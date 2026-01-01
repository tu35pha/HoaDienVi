#!/usr/bin/env python
"""
IDM-VTON Command Line Interface
Nhận đầu vào: ảnh người + ảnh đồ -> Xuất ảnh try-on
Cách dùng: python tryon_cli.py <human_image> <garment_image> <output_dir> [--description "..."]
"""

import sys
import os

# Thêm thư mục gốc vào path để import src
current_dir = os.path.abspath(os.path.dirname(__file__))
sys.path.append(current_dir)

# Thêm thư mục gradio_demo vào path để import detectron2, apply_net, utils_mask
gradio_demo_path = os.path.join(current_dir, 'gradio_demo')
if os.path.exists(gradio_demo_path):
    sys.path.append(gradio_demo_path)

import argparse
from pathlib import Path
from PIL import Image
import torch
import numpy as np
from torchvision import transforms
from torchvision.transforms.functional import to_pil_image

# Import các thư viện cần thiết
from src.tryon_pipeline import StableDiffusionXLInpaintPipeline as TryonPipeline
from src.unet_hacked_garmnet import UNet2DConditionModel as UNet2DConditionModel_ref
from src.unet_hacked_tryon import UNet2DConditionModel
from transformers import (
    CLIPImageProcessor,
    CLIPVisionModelWithProjection,
    CLIPTextModel,
    CLIPTextModelWithProjection,
    AutoTokenizer,
)
from diffusers import DDPMScheduler, AutoencoderKL
from detectron2.data.detection_utils import convert_PIL_to_numpy, _apply_exif_orientation
from typing import List

from preprocess.humanparsing.run_parsing import Parsing
from preprocess.openpose.run_openpose import OpenPose
import apply_net
from utils_mask import get_mask_location

# ============================================================================
# CẤU HÌNH
# ============================================================================
device = 'cuda:0' if torch.cuda.is_available() else 'cpu'
print(f"Using device: {device}")

base_path = 'yisol/IDM-VTON'
example_path = os.path.join(os.path.dirname(__file__), 'example')

# ============================================================================
# HÀM PHỤ TRỢ
# ============================================================================
def pil_to_binary_mask(pil_image, threshold=0):
    """Chuyển ảnh PIL thành binary mask"""
    np_image = np.array(pil_image)
    grayscale_image = Image.fromarray(np_image).convert("L")
    binary_mask = np.array(grayscale_image) > threshold
    mask = np.zeros(binary_mask.shape, dtype=np.uint8)
    for i in range(binary_mask.shape[0]):
        for j in range(binary_mask.shape[1]):
            if binary_mask[i, j]:
                mask[i, j] = 1
    mask = (mask * 255).astype(np.uint8)
    return Image.fromarray(mask)


def load_models():
    """Tải tất cả models vào GPU/CPU"""
    print("Đang tải models...")
    
    unet = UNet2DConditionModel.from_pretrained(
        base_path,
        subfolder="unet",
        torch_dtype=torch.float16,
    )
    unet.requires_grad_(False)
    
    tokenizer_one = AutoTokenizer.from_pretrained(
        base_path,
        subfolder="tokenizer",
        revision=None,
        use_fast=False,
    )
    tokenizer_two = AutoTokenizer.from_pretrained(
        base_path,
        subfolder="tokenizer_2",
        revision=None,
        use_fast=False,
    )
    
    noise_scheduler = DDPMScheduler.from_pretrained(base_path, subfolder="scheduler")
    
    text_encoder_one = CLIPTextModel.from_pretrained(
        base_path,
        subfolder="text_encoder",
        torch_dtype=torch.float16,
    )
    text_encoder_two = CLIPTextModelWithProjection.from_pretrained(
        base_path,
        subfolder="text_encoder_2",
        torch_dtype=torch.float16,
    )
    
    image_encoder = CLIPVisionModelWithProjection.from_pretrained(
        base_path,
        subfolder="image_encoder",
        torch_dtype=torch.float16,
    )
    
    vae = AutoencoderKL.from_pretrained(
        base_path,
        subfolder="vae",
        torch_dtype=torch.float16,
    )
    
    UNet_Encoder = UNet2DConditionModel_ref.from_pretrained(
        base_path,
        subfolder="unet_encoder",
        torch_dtype=torch.float16,
    )
    
    # Tắt gradient
    UNet_Encoder.requires_grad_(False)
    image_encoder.requires_grad_(False)
    vae.requires_grad_(False)
    unet.requires_grad_(False)
    text_encoder_one.requires_grad_(False)
    text_encoder_two.requires_grad_(False)
    
    # Khởi tạo pipeline
    pipe = TryonPipeline.from_pretrained(
        base_path,
        unet=unet,
        vae=vae,
        feature_extractor=CLIPImageProcessor(),
        text_encoder=text_encoder_one,
        text_encoder_2=text_encoder_two,
        tokenizer=tokenizer_one,
        tokenizer_2=tokenizer_two,
        scheduler=noise_scheduler,
        image_encoder=image_encoder,
        torch_dtype=torch.float16,
    )
    pipe.unet_encoder = UNet_Encoder
    
    # --- TỐI ƯU CHO CARD 4GB VRAM ---
    print("Bật chế độ tiết kiệm VRAM (Sequential CPU Offload)...")
    pipe.enable_sequential_cpu_offload()
    pipe.enable_vae_slicing()
    pipe.enable_vae_tiling()
    # --------------------------------
    
    print("✓ Models đã tải xong")
    return pipe, tokenizer_one, tokenizer_two


def tryon(
    pipe, 
    human_image_path: str, 
    garment_image_path: str, 
    output_dir: str,
    garment_description: str = "garment",
    denoise_steps: int = 30,
    seed: int = 42,
    use_auto_mask: bool = True
):
    """
    Thực hiện virtual try-on
    
    Args:
        pipe: Pipeline đã tải
        human_image_path: Đường dẫn ảnh người
        garment_image_path: Đường dẫn ảnh đồ
        output_dir: Thư mục lưu kết quả
        garment_description: Mô tả về đồ (ví dụ: "Short Sleeve T-Shirt")
        denoise_steps: Số bước denoise (20-40)
        seed: Random seed
        use_auto_mask: Sử dụng auto-mask hay không
    """
    
    # Kiểm tra file tồn tại
    if not os.path.exists(human_image_path):
        raise FileNotFoundError(f"Không tìm thấy file: {human_image_path}")
    if not os.path.exists(garment_image_path):
        raise FileNotFoundError(f"Không tìm thấy file: {garment_image_path}")
    
    # Tạo thư mục output
    os.makedirs(output_dir, exist_ok=True)
    
    # Load ảnh
    print(f"Đang tải ảnh...")
    garm_img = Image.open(garment_image_path).convert("RGB").resize((768, 1024))
    human_img_orig = Image.open(human_image_path).convert("RGB")
    human_img = human_img_orig.resize((768, 1024))
    
    # Load parsing & openpose models
    parsing_model = Parsing(0)
    openpose_model = OpenPose(0)
    
    tensor_transform = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize([0.5], [0.5]),
    ])
    
    # ========== XỬ LÝ MASK ==========
    if use_auto_mask:
        print("Đang tạo auto-mask bằng OpenPose & Parsing...")
        openpose_model.preprocessor.body_estimation.model.to(device)
        
        keypoints = openpose_model(human_img.resize((384, 512)))
        model_parse, _ = parsing_model(human_img.resize((384, 512)))
        mask, mask_gray = get_mask_location('hd', "upper_body", model_parse, keypoints)
        mask = mask.resize((768, 1024))
        
        # Giải phóng VRAM
        openpose_model.preprocessor.body_estimation.model.to("cpu")
        torch.cuda.empty_cache()
        print("✓ Auto-mask tạo xong")
    else:
        print("Sử dụng white mask (toàn bộ ảnh)")
        mask = Image.new('RGB', (768, 1024), (255, 255, 255))
        mask_gray = Image.new('RGB', (768, 1024), (255, 255, 255))
    
    # ========== XỬ LÝ POSE ==========
    print("Đang chạy DensePose...")
    human_img_arg = _apply_exif_orientation(human_img.resize((384, 512)))
    human_img_arg = convert_PIL_to_numpy(human_img_arg, format="BGR")
    
    args = apply_net.create_argument_parser().parse_args((
        'show', './configs/densepose_rcnn_R_50_FPN_s1x.yaml', 
        './ckpt/densepose/model_final_162be9.pkl', 'dp_segm', 
        '-v', '--opts', 'MODEL.DEVICE', 'cuda'
    ))
    pose_img = args.func(args, human_img_arg)
    pose_img = pose_img[:, :, ::-1]
    pose_img = Image.fromarray(pose_img).resize((768, 1024))
    print("✓ DensePose xong")
    
    # Dọn dẹp trước khi vào model chính
    torch.cuda.empty_cache()
    
    # ========== TRY-ON ==========
    print(f"Đang thực hiện try-on ({denoise_steps} steps)...")
    
    with torch.no_grad():
        with torch.cuda.amp.autocast():
            # Prompt cho người mặc
            prompt = "model is wearing " + garment_description
            negative_prompt = "monochrome, lowres, bad anatomy, worst quality, low quality"
            
            with torch.inference_mode():
                (
                    prompt_embeds,
                    negative_prompt_embeds,
                    pooled_prompt_embeds,
                    negative_pooled_prompt_embeds,
                ) = pipe.encode_prompt(
                    prompt,
                    num_images_per_prompt=1,
                    do_classifier_free_guidance=True,
                    negative_prompt=negative_prompt,
                )
            
            # Prompt cho đồ
            prompt_garm = "a photo of " + garment_description
            negative_prompt_garm = "monochrome, lowres, bad anatomy, worst quality, low quality"
            
            with torch.inference_mode():
                (
                    prompt_embeds_c,
                    _,
                    _,
                    _,
                ) = pipe.encode_prompt(
                    prompt_garm,
                    num_images_per_prompt=1,
                    do_classifier_free_guidance=False,
                    negative_prompt=negative_prompt_garm,
                )
            
            # Chuẩn bị tensors
            pose_img_tensor = tensor_transform(pose_img).unsqueeze(0).to(device, torch.float16)
            garm_tensor = tensor_transform(garm_img).unsqueeze(0).to(device, torch.float16)
            generator = torch.Generator(device).manual_seed(seed) if seed is not None else None
            
            # Chạy inference
            images = pipe(
                prompt_embeds=prompt_embeds.to(device, torch.float16),
                negative_prompt_embeds=negative_prompt_embeds.to(device, torch.float16),
                pooled_prompt_embeds=pooled_prompt_embeds.to(device, torch.float16),
                negative_pooled_prompt_embeds=negative_pooled_prompt_embeds.to(device, torch.float16),
                num_inference_steps=denoise_steps,
                generator=generator,
                strength=1.0,
                pose_img=pose_img_tensor.to(device, torch.float16),
                text_embeds_cloth=prompt_embeds_c.to(device, torch.float16),
                cloth=garm_tensor.to(device, torch.float16),
                mask_image=mask,
                image=human_img,
                height=1024,
                width=768,
                ip_adapter_image=garm_img.resize((768, 1024)),
                guidance_scale=2.0,
            )[0]
    
    print("✓ Try-on xong")
    
    # Lưu kết quả
    output_filename = f"tryon_{Path(human_image_path).stem}_{Path(garment_image_path).stem}.png"
    output_path = os.path.join(output_dir, output_filename)
    images[0].save(output_path)
    print(f"✓ Kết quả đã lưu: {output_path}")
    
    return output_path


# ============================================================================
# MAIN
# ============================================================================
def main():
    parser = argparse.ArgumentParser(
        description="IDM-VTON CLI - Virtual Try-On từ Command Line",
        formatter_class=argparse.RawDescriptionHelpFormatter,
        epilog="""
Ví dụ sử dụng:
  python tryon_cli.py human.jpg garment.jpg output_folder
  python tryon_cli.py human.jpg garment.jpg output_folder --description "Short Sleeve T-Shirt"
  python tryon_cli.py human.jpg garment.jpg output_folder --steps 40 --seed 123
        """
    )
    
    parser.add_argument('human_image', help='Đường dẫn ảnh người')
    parser.add_argument('garment_image', help='Đường dẫn ảnh đồ')
    parser.add_argument('output_dir', help='Thư mục lưu kết quả')
    parser.add_argument('--description', '-d', default='garment', 
                       help='Mô tả về đồ (mặc định: "garment")')
    parser.add_argument('--steps', '-s', type=int, default=30, 
                       help='Số bước denoise (20-40, mặc định: 30)')
    parser.add_argument('--seed', type=int, default=42, 
                       help='Random seed (mặc định: 42)')
    parser.add_argument('--no-mask', action='store_true',
                       help='Không dùng auto-mask (dùng white mask)')
    
    args = parser.parse_args()
    
    try:
        # Tải models (chỉ 1 lần)
        pipe, tok1, tok2 = load_models()
        
        # Chạy try-on
        output = tryon(
            pipe,
            args.human_image,
            args.garment_image,
            args.output_dir,
            garment_description=args.description,
            denoise_steps=args.steps,
            seed=args.seed,
            use_auto_mask=not args.no_mask
        )
        
        print("\n" + "="*60)
        print("✓ THÀNH CÔNG!")
        print("="*60)
        
    except Exception as e:
        print(f"\n✗ LỖI: {e}", file=sys.stderr)
        import traceback
        traceback.print_exc()
        sys.exit(1)


if __name__ == '__main__':
    main()
