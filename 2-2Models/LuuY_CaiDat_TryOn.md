# Hướng dẫn Cài đặt và Khôi phục Môi trường cho IDM-VTON (Try-On)

Do các file weights (mô hình) quá nặng (>10GB) và thư mục môi trường ảo (`env/`) không tương thích giữa các máy tính khác nhau, chúng đã được loại bỏ khỏi Git.

Để chạy được dự án này trên máy mới, bạn cần thực hiện các bước sau:

## 1. Yêu cầu Hệ thống
- **OS:** Windows (khuyến nghị) hoặc Linux.
- **GPU:** NVIDIA GPU với VRAM >= 16GB (để chạy mượt mà), hoặc tối thiểu 12GB (có thể cần tối ưu).
- **Driver:** Cài đặt NVIDIA Driver mới nhất.
- **CUDA:** Cài đặt CUDA Toolkit 11.8 (tương thích tốt nhất với cấu hình hiện tại).

## 2. Thiết lập Môi trường (Environment)

Không copy thư mục `env` từ máy cũ sang. Hãy tạo mới:

### Cách 1: Sử dụng Conda (Khuyến nghị)
Nếu bạn đã cài Anaconda/Miniconda:

```bash
cd 2-2Models/TryOn/IDM-VTON
conda env create -f environment.yaml
conda activate idm
```

### Cách 2: Sử dụng venv (Python thuần)
Nếu bạn không dùng Conda, hãy đảm bảo đã cài **Python 3.10**:

```bash
cd 2-2Models/TryOn/IDM-VTON
python -m venv env
.\env\Scripts\activate
pip install -r requirements.txt
# Lưu ý: Nếu không có file requirements.txt, hãy dùng environment.yaml để tham khảo các gói cần cài.
```

## 3. Tải lại Weights (Quan trọng)

Bạn cần tải 2 phần weights:

### Phần A: Các Checkpoint phụ trợ (DensePose, HumanParsing, OpenPose)
Trong thư mục `IDM-VTON` đã có sẵn script tự động tải các file này.

1. Đảm bảo đã kích hoạt môi trường (bước 2).
2. Chạy lệnh:
   ```bash
   python download_checkpoints.py
   ```
   Script này sẽ tự động tải và đặt các file vào thư mục `ckpt/`.

### Phần B: Model chính (IDM-VTON)
Model chính rất nặng (~20GB). Có 2 cách để tải:

**Cách 1: Tự động (Dễ nhất)**
Khi bạn chạy lệnh `inference.py` lần đầu tiên, thư viện `diffusers` sẽ tự động tải model từ HuggingFace về thư mục cache của máy (`C:\Users\YourName\.cache\huggingface`). Bạn không cần làm gì thêm.

**Cách 2: Tải thủ công (Nếu muốn quản lý file)**
Nếu bạn muốn lưu model ngay trong thư mục dự án (như cấu trúc cũ `yisol/IDM-VTON`):
1. Cài đặt git-lfs: `git lfs install`
2. Clone repo từ HuggingFace vào thư mục `yisol`:
   ```bash
   mkdir yisol
   cd yisol
   git clone https://huggingface.co/yisol/IDM-VTON
   ```
3. Khi chạy, hãy trỏ đường dẫn model vào thư mục này:
   ```bash
   python inference.py --pretrained_model_name_or_path "yisol/IDM-VTON" ...
   ```

## 4. Kiểm tra cấu trúc thư mục
Sau khi cài đặt xong, cấu trúc thư mục `2-2Models/TryOn/IDM-VTON` nên trông như sau:

```
IDM-VTON/
├── ckpt/                   # (Được tạo bởi download_checkpoints.py)
│   ├── densepose/
│   ├── humanparsing/
│   └── openpose/
├── env/                    # (Môi trường ảo mới tạo)
├── yisol/                  # (Tùy chọn: Nếu tải thủ công model chính)
│   └── IDM-VTON/
├── inference.py
├── environment.yaml
└── ...
```

## 5. Chạy thử
```bash
# Ví dụ lệnh chạy
python inference.py --width 768 --height 1024 --num_inference_steps 30 --output_dir "result" --unpaired --data_dir "zalando-test-data" --seed 42 --test_batch_size 2 --guidance_scale 2.0
```
