# AI Models (Core Engine)

Thư mục này chứa mã nguồn và tài liệu kỹ thuật cho các mô hình trí tuệ nhân tạo của Sentio.

## Các Module chính

### 1. Virtual Try-On (`TryOn/`)
- **Model:** IDM-VTON (Improving Diffusion Models for Virtual Try-ON).
- **Chức năng:** Tạo ảnh người dùng mặc trang phục được chọn một cách tự nhiên.
- **⚠️ Cài đặt:** Xem file [`LuuY_CaiDat_TryOn.md`](TryOn/LuuY_CaiDat_TryOn.md) để biết cách tải weights (>10GB) và thiết lập môi trường.

### 2. Dự báo & Gợi ý (`DuBaoGia/`)
- **Model:** LightGBM & Collaborative Filtering.
- **Chức năng:** Dự báo nhu cầu sản phẩm, tối ưu giá bán và gợi ý sản phẩm cá nhân hóa.

## Tài liệu tham khảo
- [`KienThucModels.md`](KienThucModels.md): Giải thích chi tiết về kiến trúc và nguyên lý hoạt động của các model.
