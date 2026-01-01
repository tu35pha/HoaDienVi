# Kiến thức Models - Try-on Engine

## 1. Khái niệm
Try-on Engine là một module với chức năng giúp cho khách hàng xác định được liệu trang phục, phụ kiện nào sẽ phù hợp với mình bằng cách xem ảnh của chính bản thân họ trong bộ trang phục, phụ kiện được chọn. Module này sẽ áp dụng kỹ thuật **Virtual Try-on (VTO)** - kỹ thuật này giúp xử lý tạo ra hình ảnh người mặc với trang phục (phụ kiện) đã được chọn một cách chân thực, tự nhiên mà vẫn đảm bảo giữ nguyên đặc điểm cơ thể (tư thế, dáng, khuôn mặt) từ đó cho phép người dùng “mặc thử” quần áo trong không gian ảo thông qua ảnh hoặc video mà người dùng cung cấp.

Trong thời điểm hiện tại, mục tiêu chính của module chỉ là tạo sinh ảnh khách hàng với trang phục họ muốn thử dưới dạng 2D.

## 2. Mô tả công nghệ
Trong dự án Sentio, chúng tôi đề xuất áp dụng phương pháp **IDM-VTON (Improved Diffusion Models for Virtual Try-ON)**. Đây là phương pháp tiếp cận dựa trên mô hình khuếch tán (Diffusion Models), cụ thể là tận dụng năng lực của **Stable Diffusion XL (SDXL)** để giải quyết các hạn chế của các phương pháp GAN truyền thống.

Điểm ưu việt của công nghệ này là khả năng bảo tồn **độ trung thực của trang phục (Garment Fidelity)** và **tính xác thực của hình ảnh (Authenticity)**. Thay vì chỉ thực hiện biến dạng hình học (warping) đơn thuần, IDM-VTON tập trung vào việc mã hóa cả ngữ nghĩa cấp cao (high-level semantics) và chi tiết cấp thấp (low-level features) của trang phục để tích hợp vào quá trình sinh ảnh.

## 3. Cơ chế hoạt động và kiến trúc hệ thống
Kiến trúc của module Try-on được xây dựng dựa trên sự phối hợp của ba thành phần mạng nơ-ron chính:

1.  **Mạng lưới xử lý chính (TryonNet):**
    *   Đây là một UNet cơ sở (Base UNet) dựa trên mô hình inpainting của SDXL.
    *   **Nhiệm vụ:** Xử lý quá trình khuếch tán để sinh ra hình ảnh người mặc trang phục mới.
    *   **Đầu vào:** Latent của ảnh người, mặt nạ phân đoạn (mask), ảnh người đã che (masked image) và thông tin dáng người (Densepose).

2.  **Module mã hóa ngữ nghĩa (Image Prompt Adapter - IP-Adapter):**
    *   Sử dụng bộ mã hóa hình ảnh CLIP (đã đóng băng trọng số) để trích xuất các đặc trưng ngữ nghĩa cấp cao (high-level semantics) của ảnh trang phục đầu vào.
    *   Các đặc trưng này được tích hợp vào mạng chính thông qua lớp Cross-Attention, giúp mô hình hiểu được cấu trúc tổng thể và kiểu dáng của trang phục.

3.  **Module mã hóa chi tiết (GarmentNet):**
    *   Đây là một UNet song song (sử dụng UNet của SDXL) chuyên biệt cho việc mã hóa các đặc trưng cấp thấp (low-level features) của trang phục.
    *   **Nhiệm vụ:** Bảo tồn các chi tiết tinh xảo như hoa văn, logo, kết cấu vải hoặc hình in phức tạp mà bộ mã hóa CLIP thường bỏ sót.
    *   Các đặc trưng từ GarmentNet được tích hợp vào mạng chính thông qua lớp Self-Attention.

Ngoài ra, hệ thống sử dụng cơ chế **Chú thích văn bản chi tiết (Detailed Captioning)**. Các mô tả cụ thể về trang phục (ví dụ: “short sleeve round neck t-shirts”) được đưa vào cả GarmentNet và TryonNet để tận dụng kiến thức tiên nghiệm (generative prior) của mô hình, tăng cường độ chính xác khi sinh ảnh.

## 4. Dữ liệu Input - Output

**Input (Dữ liệu đầu vào):**
*   **Ảnh người ($x_p$):** Hình ảnh gốc của người dùng muốn thử đồ.
*   **Ảnh trang phục ($x_g$):** Hình ảnh sản phẩm (quần/áo) từ catalog của cửa hàng.
*   **Thông tin ngữ nghĩa:**
    *   **Văn bản (Prompts):** Mô tả chi tiết đặc điểm trang phục (tùy chọn).
    *   **Densepose ($x_{pose}$):** Bản đồ tư thế cơ thể để đảm bảo trang phục khớp với dáng người.
*   **Mặt nạ ($m$):** Vùng cần thay thế trên ảnh người (loại bỏ trang phục cũ).

**Output (Dữ liệu đầu ra):**
*   **Ảnh thử đồ hoàn thiện ($x_{tr}$):** Hình ảnh người dùng đang mặc trang phục mới với độ phân giải $1024 \times 768$, đảm bảo tính tự nhiên về tư thế, ánh sáng và bảo toàn chi tiết nhận diện của trang phục (logo, họa tiết).

## 5. Công nghệ và hướng triển khai

### Công nghệ lõi
*   **Ngôn ngữ & Framework:** Python, PyTorch, Diffusers (Hugging Face).
*   **Base Model:** Stable Diffusion XL (SDXL) Inpainting.
*   **Support Models:**
    *   **OpenPose / DensePose:** Trích xuất tư thế người (Human Pose Estimation).
    *   **Human Parsing (e.g., Graphonomy):** Tạo mặt nạ (mask) để tách biệt vùng quần áo và cơ thể.
    *   **CLIP (OpenAI):** Mã hóa hình ảnh và văn bản.
*   **Hardware:** Yêu cầu GPU NVIDIA với VRAM tối thiểu 16GB (khuyến nghị 24GB cho SDXL) để đảm bảo tốc độ inference.

### Quy trình triển khai
1.  **Chuẩn bị dữ liệu & Tiền xử lý (Preprocessing):**
    *   Thu thập ảnh đầu vào (người và quần áo).
    *   Sử dụng mô hình Human Parsing để tạo mask tự động (loại bỏ quần áo cũ).
    *   Sử dụng DensePose để tạo bản đồ tư thế.
    *   Resize ảnh về kích thước chuẩn (768x1024 hoặc 1024x768).

2.  **Xây dựng Inference Pipeline:**
    *   Tải trọng số (weights) của IDM-VTON và các module phụ trợ.
    *   Thiết lập pipeline: `Image + Mask + Pose + Garment -> IDM-VTON -> Result Image`.
    *   Tối ưu hóa bộ nhớ bằng kỹ thuật `mixed precision (fp16)` và `xformers`.

3.  **Tích hợp Backend (Serving):**
    *   Xây dựng API bằng **FastAPI**.
    *   API nhận ảnh upload từ người dùng (Base64 hoặc Multipart).
    *   Thực hiện inference và trả về ảnh kết quả.
    *   Lưu trữ ảnh kết quả tạm thời hoặc upload lên Supabase Storage.

4.  **Tối ưu hóa & Mở rộng:**
    *   Triển khai hàng đợi (Queue) để xử lý nhiều request đồng thời (tránh OOM - Out of Memory).
    *   Cân nhắc sử dụng các phiên bản model nhẹ hơn hoặc kỹ thuật Quantization nếu cần giảm yêu cầu phần cứng.

---

# Kiến thức Models - Forecast Engine (Dự báo giá)

## 1. Khái niệm
Forecast Engine là module dự báo giá tối ưu và nhu cầu mua sắm cho sản phẩm trong tương lai gần (theo tuần). Mục tiêu là giúp người bán (Merchant) đưa ra quyết định về chiến lược giá và khuyến mãi dựa trên dữ liệu lịch sử và hành vi người dùng.

## 2. Mô tả công nghệ
Hệ thống sử dụng thuật toán **LightGBM (Light Gradient Boosting Machine)**. Đây là một framework gradient boosting hiệu năng cao dựa trên thuật toán cây quyết định (decision tree).

**Lý do lựa chọn LightGBM:**
*   **Tốc độ huấn luyện nhanh và hiệu quả cao:** Nhờ kỹ thuật GOSS (Gradient-based One-Side Sampling) và EFB (Exclusive Feature Bundling).
*   **Sử dụng bộ nhớ thấp:** Phù hợp để triển khai trên các hệ thống có tài nguyên giới hạn.
*   **Độ chính xác cao:** Thường vượt trội hơn các thuật toán boosting khác trên dữ liệu dạng bảng (tabular data).
*   **Hỗ trợ tốt dữ liệu phân loại (Categorical Features):** Có thể xử lý trực tiếp mà không cần one-hot encoding phức tạp.

## 3. Quy trình xử lý và Kiến trúc

### 3.1. Data Pipeline (ETL)
Dữ liệu được tổng hợp từ nhiều nguồn (Sales, Products, User Interactions) và xử lý qua các bước:
1.  **Làm sạch & Gộp dữ liệu:** Kết hợp lịch sử giá, thông tin sản phẩm và hành vi người dùng theo tuần.
2.  **Feature Engineering (Tạo đặc trưng):**
    *   **Log Transformation:** Áp dụng `log1p` cho các biến có phân phối lệch (skewed) như số lượng bán, lượt xem, lượt thử đồ.
    *   **Clipping:** Giới hạn giá trị ngoại lai cho biến `Sales_Velocity`.
    *   **Encoding:** Mã hóa biến phân loại (Category) sang dạng số bằng `LabelEncoder`.
    *   **Time-series Features:** Trích xuất Tháng, Tuần trong năm từ ngày bắt đầu tuần.

### 3.2. Mô hình dự báo
*   **Input:** Các đặc trưng đã xử lý (xem chi tiết mục 4).
*   **Target (Biến mục tiêu):** `Price_Ratio` (Tỷ lệ giá bán / Giá gốc).
    *   Công thức: $Price\_Ratio = \frac{Selling\_Price}{Base\_Price}$
    *   Việc dự đoán tỷ lệ giúp mô hình tổng quát hóa tốt hơn cho các sản phẩm có mức giá khác nhau.
*   **Output:** Giá trị `Price_Ratio` dự báo cho tuần tiếp theo. Từ đó tính ra giá bán tối ưu: $Predicted\_Price = Predicted\_Ratio \times Base\_Price$.

## 4. Dữ liệu Input - Output

**Input Features (Đặc trưng đầu vào):**

| Nhóm đặc trưng | Tên biến (Feature Name) | Mô tả |
| :--- | :--- | :--- |
| **Ngữ cảnh & Thời gian** | `Base_Price` | Giá gốc của sản phẩm. |
| | `Category_Encoded` | Danh mục sản phẩm (đã mã hóa số). |
| | `Month` | Tháng trong năm. |
| | `Week_of_Year` | Tuần thứ mấy trong năm. |
| | `Is_Promo` | Cờ báo hiệu tuần đó có khuyến mãi hay không (0/1). |
| **Lịch sử bán hàng** | `Qty_Sold_Lag1_Log` | Log số lượng bán của tuần trước đó (Lag 1). |
| | `Qty_Sold_Avg_4W_Log` | Log số lượng bán trung bình trong 4 tuần gần nhất. |
| | `Sales_Velocity_Capped` | Tốc độ bán hàng (đã xử lý ngoại lai). |
| **Hành vi người dùng** | `Views_Last_1W_Log` | Log tổng lượt xem sản phẩm trong tuần trước. |
| | `TryOn_Last_1W_Log` | Log tổng lượt thử đồ (Virtual Try-on) trong tuần trước. |
| | `Cart_Adds_Last_1W_Log` | Log tổng lượt thêm vào giỏ hàng trong tuần trước. |

**Output (Đầu ra):**
*   **Price_Ratio:** Tỷ lệ giá dự kiến cho tuần tiếp theo.

## 5. Công nghệ và hướng triển khai

### Công nghệ lõi
*   **Ngôn ngữ:** Python.
*   **Thư viện chính:**
    *   `pandas`, `numpy`: Xử lý dữ liệu.
    *   `scikit-learn`: Tiền xử lý (LabelEncoder) và đánh giá mô hình.
    *   `lightgbm`: Thuật toán huấn luyện mô hình chính.
    *   `joblib`: Lưu và tải mô hình (`.pkl`).

### Quy trình triển khai (Inference)
1.  **Load Model:** Tải `lgb_price_forecast_v1.pkl` và `category_encoder_v1.pkl` vào bộ nhớ khi khởi động ứng dụng (FastAPI).
2.  **Nhận Request:** API nhận thông tin sản phẩm và dữ liệu lịch sử tuần gần nhất.
3.  **Preprocess:**
    *   Tính toán các đặc trưng Lag và Log transformation tương tự như lúc huấn luyện.
    *   Mã hóa Category bằng Encoder đã load.
4.  **Predict:** Sử dụng model LightGBM để dự báo `Price_Ratio`.
5.  **Post-process:** Tính toán giá gợi ý và trả về kết quả cho Dashboard.
