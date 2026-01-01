"""
Script to download required checkpoints for IDM-VTON
"""
import os
import shutil
from huggingface_hub import hf_hub_download

# Create checkpoint directories
os.makedirs("ckpt/densepose", exist_ok=True)
os.makedirs("ckpt/humanparsing", exist_ok=True)
os.makedirs("ckpt/openpose/ckpts", exist_ok=True)

print("Downloading DensePose checkpoint...")
hf_hub_download(
    repo_id="yisol/IDM-VTON",
    filename="densepose/model_final_162be9.pkl",
    local_dir="ckpt"
)

print("\nDownloading HumanParsing checkpoints...")
# Download parsing_atr.onnx
atr_path = hf_hub_download(
    repo_id="levihsu/OOTDiffusion",
    filename="checkpoints/humanparsing/parsing_atr.onnx"
)
shutil.copy(atr_path, "ckpt/humanparsing/parsing_atr.onnx")
print(f"Copied parsing_atr.onnx to ckpt/humanparsing/")

# Download parsing_lip.onnx
lip_path = hf_hub_download(
    repo_id="levihsu/OOTDiffusion",
    filename="checkpoints/humanparsing/parsing_lip.onnx"
)
shutil.copy(lip_path, "ckpt/humanparsing/parsing_lip.onnx")
print(f"Copied parsing_lip.onnx to ckpt/humanparsing/")

print("\nDownloading OpenPose checkpoint...")
hf_hub_download(
    repo_id="lllyasviel/ControlNet",
    filename="annotator/ckpts/body_pose_model.pth",
    local_dir="ckpt/openpose"
)

print("\n✓ All checkpoints downloaded successfully!")
