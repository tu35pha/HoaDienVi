# Đánh giá Dữ liệu Dự kiến (Output Sentio) - Ver 1

## 1. Tổng quan
Dữ liệu được tạo ra từ quy trình `data_pipeline.ipynb` nhằm mục đích chuyển đổi bộ dữ liệu bán lẻ toàn cầu (Global Retail Dataset) thành dữ liệu giả lập cho thị trường Việt Nam, phục vụ dự án **Sentio**.

Quy trình xử lý tập trung vào việc "Việt hóa" thương hiệu, tiền tệ và giả lập các hành vi tương tác công nghệ mới (AR, Try-on) mà bộ dữ liệu gốc không có.

## 2. Chi tiết các tập dữ liệu đầu ra

### 2.1. Danh mục sản phẩm (Product Catalog)
- **File:** `processed_products_VN_final.csv`
- **Mô tả:** Danh sách sản phẩm đã được gán thương hiệu Việt (Coolmate, DirtyCoins, Routine...), chuyển đổi giá sang VND và cập nhật mô tả tiếng Việt.
- **Đánh giá:**
    - ✅ **Ưu điểm:** 
        - Dữ liệu sạch, sẵn sàng để hiển thị lên App Demo.
        - Có cột `image_url` và `model_3d_url` khớp với thư mục media, phục vụ trực tiếp cho tính năng AR Catalog.
        - Mô tả sản phẩm (Description) khá trau chuốt, phù hợp trải nghiệm người dùng.
    - ⚠️ **Hạn chế:** 
        - Số lượng sản phẩm demo còn ít (khoảng 50 sản phẩm), tập trung chủ yếu vào ngành hàng Áo (Tops).
        - Các thông số kỹ thuật (Size, Color) vẫn giữ nguyên từ dataset gốc, có thể chưa hoàn toàn khớp với chuẩn size Việt Nam.

### 2.2. Dữ liệu Huấn luyện Dự báo (Forecast Training Data)
- **File:** `train_data_forecast.csv`
- **Mô tả:** Dữ liệu lịch sử bán hàng được tổng hợp (Group by) theo ngày, cửa hàng và sản phẩm.
- **Đánh giá:**
    - ✅ **Ưu điểm:** 
        - Cấu trúc chuẩn cho bài toán Time Series Forecasting (Date, Store, Product, Quantity).
        - Đã có các đặc trưng thời gian cơ bản (Day of week, Is Weekend).
    - ⚠️ **Hạn chế:** 
        - Chưa tích hợp thông tin khuyến mãi (Discount) vào dòng dữ liệu này. Model sẽ khó học được mối quan hệ nhân quả giữa "Giảm giá" và "Tăng doanh số".

### 2.3. Lịch sử Biến động Giá (Price History)
- **File:** `fact_price_history.csv`
- **Mô tả:** Dữ liệu giả lập các đợt biến động giá và sự kiện khuyến mãi trong năm (Tết, Black Friday, Summer Sale).
- **Đánh giá:**
    - ✅ **Ưu điểm:** 
        - Đây là dữ liệu **quan trọng nhất** cho tính năng "Forecast Card" (Dự báo giá & Khuyên mua).
        - Các sự kiện (Event) được thiết kế rất sát với thực tế thị trường bán lẻ Việt Nam (Sale Tết, Sale Hè).
    - ⚠️ **Hạn chế:** 
        - Dữ liệu được sinh ra bằng quy luật cố định (hard-coded rules) trong code, tính ngẫu nhiên chưa cao.

### 2.4. Tương tác Người dùng (User Interactions)
- **File:** `fact_user_interactions.csv`
- **Mô tả:** Giả lập hành trình khách hàng (Customer Journey) từ lúc xem AR, thử đồ ảo đến lúc mua hàng.
- **Đánh giá:**
    - ✅ **Ưu điểm:** 
        - Phục vụ tốt cho việc phân tích phễu chuyển đổi (Conversion Funnel) để chứng minh giá trị của công nghệ AR.
        - Có đầy đủ các loại hành động đặc thù của Sentio: `VIEW_AR_CATALOG`, `TRY_ON_VIRTUAL`.
    - ⚠️ **Hạn chế:** 
        - Dữ liệu hiện tại chỉ sinh ra từ những giao dịch **đã mua hàng** (Positive samples). Thiếu các trường hợp "Xem nhưng không mua" (Negative samples), điều này có thể gây lệch (bias) nếu dùng để train model gợi ý (Recommendation).

## 3. Kết luận & Đề xuất
- **Mức độ phù hợp:** Bộ dữ liệu này đáp ứng **85%** nhu cầu của Demo vòng 1 và vòng Chung kết. Nó giải quyết tốt bài toán "thiếu dữ liệu thực tế" cho các tính năng mới.
- **Đề xuất cải thiện:**
    1.  **Merge dữ liệu:** Cần ghép thông tin từ `fact_price_history` vào `train_data_forecast` để tạo ra bộ dữ liệu huấn luyện hoàn chỉnh hơn cho model dự báo nhu cầu.
    2.  **Bổ sung Negative Samples:** Trong code sinh tương tác, nên thêm logic sinh ra các user chỉ xem/thử đồ mà không mua để phản ánh thực tế chính xác hơn.