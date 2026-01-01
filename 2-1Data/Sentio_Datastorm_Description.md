# Mô tả dữ liệu Sentio Datastorm 2025

Tài liệu này mô tả cấu trúc và nội dung của thư mục `Sentio_Datastorm_2025`, nơi chứa dữ liệu gốc, quy trình xử lý và dữ liệu đầu ra phục vụ cho dự án Sentio.

## 1. Cấu trúc thư mục

```text
Sentio_Datastorm_2025/
├── dataset/
│   ├── Input (BTC)/          # Dữ liệu gốc từ cuộc thi (Global Fashion Retail Analytics)
│   └── Output (Sentio)/      # Dữ liệu đã qua xử lý và làm sạch cho Sentio
├── media/
│   ├── ar_targets/           # Hình ảnh mục tiêu cho AR
│   └── tryon/                # Dữ liệu hình ảnh phục vụ Virtual Try-on (garments, models)
└── data_pipeline.ipynb       # Notebook xử lý dữ liệu chính (ETL)
```

## 2. Dữ liệu đầu vào (Input - BTC)

Bộ dữ liệu gốc **Global Fashion Retail Analytics Dataset** bao gồm 2 năm dữ liệu giao dịch của một nhà bán lẻ thời trang đa quốc gia.

*   **Nguồn:** `dataset/Input (BTC)/`
*   **Quy mô:** Hơn 4 triệu bản ghi bán hàng từ 35 cửa hàng tại 7 quốc gia (Mỹ, Trung Quốc, Đức, Anh, Pháp, Tây Ban Nha, Bồ Đào Nha).
*   **Các file chính:**
    *   `products.csv`: Thông tin sản phẩm (Category, Size, Color...).
    *   `transactions.csv`: Lịch sử giao dịch chi tiết.
    *   `customers.csv`: Thông tin khách hàng.
    *   `stores.csv`: Danh sách cửa hàng và địa điểm.
    *   `employees.csv`: Thông tin nhân viên.
    *   `discounts.csv`: Thông tin khuyến mãi.

## 3. Quy trình xử lý dữ liệu (Data Pipeline)

File `data_pipeline.ipynb` thực hiện các bước ETL (Extract, Transform, Load) để chuyển đổi dữ liệu gốc thành dữ liệu phù hợp cho bài toán của Sentio (thị trường Việt Nam).

**Các bước xử lý chính:**
1.  **Load dữ liệu:** Đọc các file CSV từ thư mục Input.
2.  **Bản địa hóa (Localization):**
    *   Chuyển đổi và gán nhãn lại sản phẩm sang các thương hiệu Việt Nam demo (Routine, Coolmate, DirtyCoins...).
    *   Lọc lấy các sản phẩm chủ đạo là Áo (T-shirt, Top, Shirt) để phục vụ tính năng Try-on.
3.  **Tạo sinh dữ liệu giả lập (Simulation):**
    *   Tạo lịch sử tương tác người dùng (`fact_user_interactions`) gồm: Views, Try-on, Add to Cart.
    *   Tạo lịch sử giá (`fact_price_history`) để phục vụ bài toán dự báo.

## 4. Dữ liệu đầu ra (Output - Sentio)

Dữ liệu sau khi xử lý được lưu tại `dataset/Output (Sentio)/`, sẵn sàng để huấn luyện mô hình và hiển thị trên ứng dụng.

*   **`processed_products_VN_final.csv`**: Danh sách sản phẩm đã được bản địa hóa (tên, giá, thương hiệu VN).
*   **`fact_user_interactions.csv`**: Bảng dữ liệu hành vi người dùng (quan trọng cho gợi ý và dự báo nhu cầu).
*   **`fact_price_history_full.csv`**: Lịch sử biến động giá của sản phẩm theo thời gian.
*   **`train_data_forecast.csv`**: Bộ dữ liệu huấn luyện cho mô hình dự báo giá (Forecast Engine).
*   **`weekly_data_final.csv`**: Dữ liệu tổng hợp theo tuần, dùng cho phân tích xu hướng.

## 5. Dữ liệu Media

Thư mục `media/` chứa các tài nguyên phi cấu trúc:
*   **`tryon/`**: Chứa ảnh quần áo (`garments`) và ảnh người mẫu (`models`) dùng để chạy thử nghiệm và demo tính năng Virtual Try-on.
*   **`ar_targets/`**: Chứa các hình ảnh hoặc marker dùng cho tính năng AR (nếu có).
