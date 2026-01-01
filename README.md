# SENTIO - Feel so lit, touch your fit 👗✨

**Đội thi:** Hoa Diên Vĩ  
**Cuộc thi:** Vietnam Datathon – Datastorm 2025  

Chào mừng đến với kho mã nguồn chính thức của dự án **SENTIO**. Đây là giải pháp nền tảng **AR – AI – O2O** giúp thu hẹp khoảng cách giữa mua sắm trực tuyến và ngoại tuyến, mang lại trải nghiệm "thử đồ ảo" (Virtual Try-on) và các phân tích dữ liệu thông minh ngay tại cửa hàng vật lý.

---

## 📂 Cấu trúc Dự án

Dưới đây là cây thư mục chi tiết của dự án:

```text
HoaDienVi/
├── 0-0-TomTatBaoCaoVong1.md        # Tóm tắt báo cáo Vòng 1
├── 1-0-CongNgheDuKien.md           # Tech Stack & Kiến trúc
├── 1-1-Des/                        # Tài nguyên thiết kế (UI/UX, Images)
├── 2-0DataDuKien/                  # Dữ liệu thô & Notebooks sơ khởi
│   ├── Combine_data/               # Notebooks gộp dữ liệu
│   └── Sentio_Datastorm_2025/      # Dataset gốc & Pipeline xử lý
├── 2-1Data/                        # Dữ liệu hệ thống & Scripts DB
│   ├── PostgreSQL/                 # Scripts SQL & Config
│   ├── Supabase-Storage/           # Config lưu trữ media
│   └── SETUP_GUIDE.md              # Hướng dẫn setup Data
├── 2-2Models/                      # AI Engines (Core)
│   ├── TryOn/                      # Module Thử đồ ảo
│   │   ├── IDM-VTON/               # Source code model Diffusion
│   │   └── LuuY_CaiDat_TryOn.md    # ⚠️ Hướng dẫn cài đặt Model
│   ├── DuBaoGia/                   # Module Dự báo giá (LightGBM)
│   └── KienThucModels.md           # Tài liệu kỹ thuật AI
├── 2-3-App-NguoiDung/              # Ứng dụng End-User
│   ├── fe/                         # Frontend (Next.js 16)
│   └── be/                         # Backend (FastAPI)
├── 2-4-App-Dashbroad/              # Dashboard Merchant
└── README.md                       # File hướng dẫn này
```

Chi tiết chức năng từng thư mục:

### 1. Tài liệu & Báo cáo
*   `0-0-TomTatBaoCaoVong1.md`: Tóm tắt ý tưởng, vấn đề và giải pháp của dự án trong Vòng 1.
*   `1-0-CongNgheDuKien.md`: Tổng quan về các công nghệ (Tech Stack) được sử dụng (Next.js, FastAPI, AI Models...).
*   `1-1-Des/`: Chứa các tài nguyên thiết kế (UI/UX), hình ảnh minh họa hệ thống và icon.

### 2. Dữ liệu (`2-1Data/`)
Nơi lưu trữ và xử lý dữ liệu của dự án.
*   **`Sentio_Datastorm_2025/`**: Chứa bộ dữ liệu cuộc thi (Global Fashion Retail Analytics) và dữ liệu đã qua xử lý cho thị trường Việt Nam.
    *   `data_pipeline.ipynb`: Notebook thực hiện quy trình ETL (Trích xuất - Chuyển đổi - Tải).
*   **`PostgreSQL/` & `Supabase-Storage/`**: Các script và file cấu hình cho cơ sở dữ liệu.
*   📄 *Đọc thêm:* [`2-1Data/Sentio_Datastorm_Description.md`](2-1Data/Sentio_Datastorm_Description.md) để hiểu chi tiết về luồng dữ liệu.

### 3. Mô hình AI (`2-2Models/`)
Trái tim thông minh của Sentio, chứa các engine AI chính.
*   **`TryOn/IDM-VTON/`**: Engine thử đồ ảo (Virtual Try-on) sử dụng công nghệ Diffusion (IDM-VTON).
    *   ⚠️ **Lưu ý quan trọng:** Do các file weights rất nặng (>10GB), chúng không được lưu trên Git.
    *   📄 *Đọc ngay:* [`2-2Models/LuuY_CaiDat_TryOn.md`](2-2Models/LuuY_CaiDat_TryOn.md) để biết cách cài đặt và tải model về máy.
*   **`DuBaoGia/`**: Engine dự báo giá và nhu cầu (Forecast) sử dụng LightGBM.
*   📄 *Đọc thêm:* [`2-2Models/KienThucModels.md`](2-2Models/KienThucModels.md) để hiểu cơ chế hoạt động của các model.

### 4. Ứng dụng Người dùng (`2-3-App-NguoiDung/`)
Ứng dụng dành cho khách hàng cuối (End-user).
*   **`fe/`**: Mã nguồn Frontend (Next.js 16, React 19, Tailwind CSS).
*   **`be/`**: Mã nguồn Backend (FastAPI) - *Sẽ hoàn thiện trong Round 3*.
*   📄 *Chi tiết:* [`2-3-App-NguoiDung/App_Description.md`](2-3-App-NguoiDung/App_Description.md).

### 5. Dashboard Quản trị (`2-4-App-Dashbroad/`)
Ứng dụng dành cho chủ cửa hàng (Merchant) để quản lý và xem báo cáo.
*   *Trạng thái:* Đang trong giai đoạn thiết kế, sẽ phát triển đầy đủ trong Round 3.
*   📄 *Chi tiết:* [`2-4-App-Dashbroad/Dashboard_Description.md`](2-4-App-Dashbroad/Dashboard_Description.md).

---

## 🚀 Hướng dẫn Bắt đầu (Quick Start)

Để chạy dự án này trên máy cục bộ, bạn cần đi theo trình tự sau:

1.  **Chuẩn bị Dữ liệu:**
    *   Vào `2-1Data/Sentio_Datastorm_2025/` và chạy `data_pipeline.ipynb` để tạo ra các file dữ liệu cần thiết (nếu chưa có).

2.  **Cài đặt AI Model (Try-On):**
    *   Đây là bước phức tạp nhất. Hãy đọc kỹ hướng dẫn tại [`2-2Models/LuuY_CaiDat_TryOn.md`](2-2Models/LuuY_CaiDat_TryOn.md).
    *   Bạn cần tải weights và thiết lập môi trường Python riêng (conda/venv).

3.  **Chạy Ứng dụng (Frontend):**
    *   Yêu cầu: Node.js 18+
    ```bash
    cd 2-3-App-NguoiDung/fe
    npm install
    npm run dev
    ```
    *   Truy cập: `http://localhost:3000`

---

## 📞 Liên hệ

Mọi thắc mắc hoặc đóng góp cho dự án, vui lòng liên hệ:

*   **Thành viên:** Phạm Hoàng Anh Tú
*   **SĐT:** 0782770973
*   **Email cá nhân:** [tu35pha@gmail.com](mailto:tu35pha@gmail.com)
*   **Email tổ chức:** [23521703@gmail.com](mailto:23521703@gmail.com)
