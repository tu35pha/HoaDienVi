# Báo cáo Triển khai & Đánh giá Mô hình Virtual Try-On (IDM-VTON)

## 1. Cài đặt và Cấu hình
Mô hình được triển khai dựa trên **IDM-VTON** (Improving Diffusion Models for Authentic Virtual Try-on in the Wild).
Nguồn tham khảo: [YouTube Guide](https://www.youtube.com/watch?v=4mk95tF3bhs)

### Các bước thiết lập gốc:

**Step 1: Clone the repository**
```bash
git clone https://github.com/yisol/IDM-VTON
```

**Step 2: Navigate inside the cloned repository**
```bash
cd IDM-VTON
```

**Step 3: Create virtual environment**
```bash
python -m venv venv
```

**Step 4: Activate virtual environment**
```bash
venv\scripts\activate
```

**Step 5: Install requirements**
```bash
pip install torch==2.0.1+cu118 torchvision==0.15.2+cu118 torchaudio==2.0.2+cu118 -f https://download.pytorch.org/whl/torch_stable.html
pip install pytorch-triton
pip install accelerate==0.25.0 torchmetrics==1.2.1 tqdm==4.66.1 transformers==4.36.2 diffusers==0.25.0 einops==0.7.0 bitsandbytes==0.39.0 scipy==1.11.1 opencv-python gradio==4.24.0 fvcore cloudpickle omegaconf pycocotools basicsr av onnxruntime==1.16.2
python.exe -m pip install --upgrade pip
```

**Step 6: Download checkpoints**
1. `IDM-VTON\ckpt\densepose`: Từ HuggingFace yisol/IDM-VTON
2. `IDM-VTON\ckpt\humanparsing`: parsing_atr.onnx và parsing_lip.onnx
3. `IDM-VTON\ckpt\openpose\ckpts`: body_pose_model.pth

**Step 7: Download models**
```bash
mkdir yisol
cd yisol
git lfs install
git clone https://huggingface.co/yisol/IDM-VTON
```

**Step 8: Launch the gradio UI**
```bash
venv\scripts\activate
python gradio_demo/app.py
```

---

## 2. Phân tích Mã nguồn & Tùy chỉnh

Hệ thống hiện tại bao gồm 2 phương thức chạy chính: Giao diện Web (Gradio) và Command Line (CLI).

### A. `gradio_demo/app.py` (Giao diện Web)
Đây là file chạy chính mặc định của repo, sử dụng thư viện Gradio để tạo giao diện người dùng.

**Các thay đổi quan trọng đã thực hiện (Tối ưu cho RTX 2050 - 4GB VRAM):**
1.  **Sequential CPU Offload:** Đã thêm `pipe.enable_sequential_cpu_offload()` và `pipe.enable_vae_slicing()`. Cơ chế này giúp chạy mô hình lớn trên GPU yếu bằng cách chỉ tải từng lớp mạng (layer) vào VRAM khi cần tính toán, sau đó đẩy ra RAM ngay lập tức.
2.  **Quản lý VRAM thủ công cho OpenPose:**
    *   Mặc định: OpenPose chiếm VRAM ngay từ đầu -> Gây lỗi OOM (Out of Memory) khi chạy model chính.
    *   Tối ưu: Chỉ chuyển OpenPose sang GPU (`.to(device)`) khi cần tạo mask, sau đó chuyển ngay về CPU (`.to("cpu")`) và dọn dẹp bộ nhớ (`torch.cuda.empty_cache()`).
3.  **Sửa lỗi tương thích:** Loại bỏ tham số `show_share_button=False` do xung đột phiên bản Gradio.

### B. `tryon_cli.py` (Command Line Interface)
Đây là script được viết thêm để phục vụ việc chạy tự động (automation) hoặc tích hợp vào Backend sau này.

**Đặc điểm kỹ thuật:**
*   **Path Management:** Tự động thêm đường dẫn `gradio_demo` vào `sys.path` để tái sử dụng các module `detectron2`, `apply_net`, `utils_mask` mà không cần cài đặt lại hay copy file.
*   **Input:** Nhận đường dẫn ảnh người, ảnh đồ, và thư mục output từ dòng lệnh.
*   **Pipeline:** Tương tự `app.py` nhưng bỏ qua giao diện, chạy ngầm (headless).
*   **Cấu trúc lệnh:**
    ```bash
    python tryon_cli.py <ảnh_người> <ảnh_đồ> <thư_mục_output> --description "mô tả đồ"
    ```

---

## 3. Phân tích Luồng xử lý (Workflow)

Quy trình xử lý một ảnh Try-on diễn ra qua các bước sau:

1.  **Preprocessing (Tiền xử lý):**
    *   Resize ảnh người và ảnh đồ về kích thước chuẩn `768x1024`.
    *   Crop ảnh người (nếu bật tùy chọn auto-crop).

2.  **Masking & Pose Estimation:**
    *   **OpenPose:** Xác định các điểm khớp xương (keypoints) của người.
    *   **Human Parsing:** Phân vùng các bộ phận cơ thể (tay, chân, thân, đầu...).
    *   **Mask Generation:** Tạo mặt nạ (mask) vùng thân trên (upper_body) dựa trên kết quả parsing và pose. Đây là vùng sẽ được thay thế bằng áo mới.
    *   **DensePose:** Tạo bản đồ UV map của cơ thể người (dùng Detectron2) để model hiểu được hình khối 3D của cơ thể.

3.  **Inference (Suy luận - IDM-VTON Pipeline):**
    *   Sử dụng **Stable Diffusion XL (SDXL)** làm nền tảng (Inpainting).
    *   **IP-Adapter:** Trích xuất đặc trưng (features) từ ảnh chiếc áo (Garment Image) và tiêm vào quá trình sinh ảnh để giữ lại chi tiết, hoa văn của áo.
    *   **UNet:** Thực hiện quá trình khử nhiễu (denoising) qua nhiều bước (mặc định 30 steps).

4.  **Post-processing:**
    *   Ghép ảnh kết quả vào nền gốc (nếu có crop).
    *   Lưu file kết quả.

---

## 4. Đánh giá Hiệu năng (Trên RTX 2050 4GB)

Dựa trên log chạy thực tế:
`100%|...| 30/30 [07:55<00:00, 15.84s/it]`

*   **Thời gian khởi động (Load Models):** ~20 - 40 giây.
*   **Thời gian tiền xử lý (Pose/Mask):** ~45 - 60 giây.
*   **Thời gian Inference (30 steps):** ~8 phút (khoảng 16 giây/step).
*   **Tổng thời gian cho 1 ảnh:** **~9 - 10 phút**.

**Nhận xét:**
*   **Tốc độ:** Khá chậm do giới hạn phần cứng (4GB VRAM). Việc sử dụng `Sequential CPU Offload` làm giảm tốc độ đáng kể do phải liên tục chép dữ liệu giữa RAM và VRAM, nhưng đây là **cách duy nhất** để chạy được model này trên RTX 2050 mà không bị crash.
*   **Chất lượng:** IDM-VTON cho chất lượng rất cao, xử lý tốt các tư thế phức tạp và giữ được chi tiết áo tốt hơn các model cũ (như VITON-HD, HR-VITON).
*   **Khả năng ứng dụng:** Phù hợp để chạy batch (xử lý hàng loạt) hoặc demo offline. Để triển khai thực tế cho người dùng cuối (cần phản hồi nhanh < 10s), cần nâng cấp phần cứng lên GPU có VRAM tối thiểu 16GB-24GB (như RTX 3090/4090 hoặc A10G trên Cloud).
