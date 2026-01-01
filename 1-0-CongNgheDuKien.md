# Công nghệ dự kiến – Dự án SENTIO

Tài liệu này mô tả chi tiết các công nghệ được sử dụng và dự kiến triển khai trong dự án SENTIO, dựa trên cấu trúc mã nguồn và các mô hình đã tích hợp.

---

## 1. Frontend Layer (FE)

### 1.1 Next.js (v16)
**Mô tả:**  
Framework React hiện đại sử dụng App Router, hỗ trợ Server-Side Rendering (SSR) và Static Site Generation (SSG) để tối ưu hóa hiệu năng và SEO.

**Phiên bản:** Next.js 16.1.1, React 19.2.3

**Công nghệ đi kèm:**
- **TypeScript:** Ngôn ngữ chính giúp đảm bảo type safety.
- **Tailwind CSS (v4):** Utility-first CSS framework cho việc styling nhanh chóng và nhất quán.
- **ESLint:** Linter để đảm bảo chất lượng code.

**Module áp dụng:**  
- **User App:** Ứng dụng chính cho người dùng cuối (mua sắm, try-on).
- **Merchant Dashboard:** Giao diện quản lý cho cửa hàng (xem báo cáo, dự báo).

**Chức năng chính:**
- Hiển thị danh sách sản phẩm, chi tiết sản phẩm.
- Tích hợp giao diện Virtual Try-On.
- Hiển thị biểu đồ dự báo giá (cho Dashboard).

---

## 2. Backend Layer (BE) & AI Services

### 2.1 FastAPI (Python)
**Mô tả:**  
Framework backend hiệu năng cao, bất đồng bộ (async), được lựa chọn để phục vụ cả logic nghiệp vụ và các API inference cho AI/ML.

**Lý do lựa chọn:**  
- Tương thích tuyệt đối với hệ sinh thái Python (PyTorch, Scikit-learn, Pandas).
- Hiệu năng cao (ngang ngửa NodeJS/Go).
- Dễ dàng tích hợp các model AI nặng (Try-On, Forecast).

**Module áp dụng:**  
- **Core API:** Quản lý User, Product, Cart, Order.
- **AI Service:** Serving model IDM-VTON và Price Predictor.

---

## 3. Data Layer & Pipeline

### 3.1 Database & Storage
- **PostgreSQL:** Cơ sở dữ liệu quan hệ chính. Lưu trữ thông tin có cấu trúc: Users, Products, Transactions, Inventory.
- **Supabase Storage:** Lưu trữ Object (Unstructured Data). Dùng để chứa ảnh sản phẩm, model 3D (.glb), ảnh upload từ người dùng, và kết quả Try-on.

### 3.2 Data Processing (ETL)
**Công cụ:** Python, Pandas, Jupyter Notebook.

**Quy trình (Data Pipeline):**
- **Input:** Dữ liệu thô từ CSV (Customers, Discounts, Employees, Products, Transactions).
- **Processing:** Làm sạch, gộp dữ liệu (`Combine_data_forecast_v2.ipynb`, `data_pipeline.ipynb`).
- **Output:** Các file CSV đã xử lý (`fact_price_history_full.csv`, `train_data_forecast.csv`) dùng để huấn luyện model.

---

## 4. AI & Machine Learning Models

### 4.1 Virtual Try-On (IDM-VTON)
**Mô tả:**  
Sử dụng mô hình **IDM-VTON** (Improving Diffusion Models for Authentic Virtual Try-on in the Wild). Đây là công nghệ state-of-the-art dựa trên Diffusion Models để tạo ra hình ảnh mặc thử chân thực.

**Thành phần kỹ thuật:**
- **Diffusion Models:** Tạo sinh hình ảnh.
- **DensePose / OpenPose:** Nhận diện dáng người và các điểm mốc cơ thể.
- **Human Parsing:** Phân đoạn các phần cơ thể và quần áo.
- **IP-Adapter:** Tích hợp thông tin hình ảnh quần áo vào quá trình tạo sinh.

**Input:** Ảnh người dùng, Ảnh quần áo (Garment).
**Output:** Ảnh người dùng đang mặc bộ quần áo đó.

### 4.2 Price Forecasting (Dự báo giá & Nhu cầu)
**Mô tả:**  
Mô hình Machine Learning dự báo giá tối ưu và nhu cầu mua sắm theo tuần.

**Kỹ thuật:**
- **Thư viện:** Scikit-learn, Joblib (để load/save model).
- **Class:** `WeeklyPricePredictor`.

**Features (Đặc trưng đầu vào):**
- **Cơ bản:** Giá gốc (`Base_Price`), Danh mục (`Category_Encoded`).
- **Thời gian:** Tháng (`Month`), Tuần trong năm (`Week_of_Year`).
- **Marketing:** Có khuyến mãi không (`Is_Promo`).
- **Hành vi người dùng (Lag Features):** 
    - Lượng bán quá khứ (`Qty_Sold_Lag1`, `Qty_Sold_Avg_4W`).
    - Tương tác: Lượt xem (`Views`), Lượt thử đồ (`TryOn`), Lượt thêm vào giỏ (`Cart_Adds`).

**Output:** Dự báo lượng bán hoặc giá tối ưu cho tuần tiếp theo.

---

## 5. Design & Tools

### 5.1 Figma
- Thiết kế UI/UX cho Web App và Dashboard.
- Prototyping luồng người dùng.

## 6. Tổng kết
Hệ thống SENTIO được thiết kế theo hướng modular, dễ mở rộng:
- FE tối ưu trải nghiệm người dùng với Next.js 16.
- BE mạnh mẽ với FastAPI phục vụ AI.
- Data Layer rõ ràng với PostgreSQL và Supabase.
- ML Layer tiên tiến với IDM-VTON và các mô hình dự báo thống kê.

---

## 7. Bảng tổng hợp công nghệ

| Tên công nghệ | Mô tả | Module áp dụng | Input | Output |
| :--- | :--- | :--- | :--- | :--- |
| **Next.js** | Framework React hỗ trợ SSR/SSG, tối ưu SEO và hiệu năng. | Frontend (User App, Dashboard) | Dữ liệu sản phẩm, AR catalog, Forecast data | Giao diện Web/PWA, Dashboard, AR view |
| **FastAPI** | Framework Python hiệu năng cao, async, phục vụ API và AI Serving. | Backend API, AI Service | Request REST, Dữ liệu User/Product, Input Try-on/Forecast | API dữ liệu, API Inference (Try-on, Forecast) |
| **PostgreSQL** | Hệ quản trị CSDL quan hệ lưu trữ dữ liệu có cấu trúc. | Database | Store, Product, Sales, User info | Dữ liệu báo cáo, Dataset huấn luyện |
| **Supabase Storage** | Dịch vụ lưu trữ Object (Unstructured data). | Storage | Ảnh sản phẩm, Model 3D, Ảnh upload | URL truy cập tài nguyên |
| **Figma** | Công cụ thiết kế UI/UX và Prototyping. | Design | Requirement, User flow, Ý tưởng AR | Prototype User App, Merchant Dashboard |
| **IDM-VTON** | **Improved Diffusion Models for Virtual Try-ON.**<br>Phương pháp dựa trên mô hình khuếch tán giải quyết bài toán thử đồ ảo. Tập trung cải thiện độ trung thực (garment fidelity) và tính xác thực trong bối cảnh phức tạp (in-the-wild). | Models (Try-on) | **Hình ảnh:**<br>- Ảnh người ($x_p$)<br>- Ảnh trang phục ($x_g$)<br>**Text prompts:** Mô tả chi tiết đặc điểm trang phục.<br>**Dữ liệu phái sinh:**<br>- Mặt nạ phân đoạn ($m$)<br>- Ảnh người đã che ($x_m$)<br>- Densepose ($x_{pose}$) | **Hình ảnh thử đồ ảo ($x_{tr}$):**<br>Tổng hợp hiển thị người mẫu mặc trang phục được chọn.<br>**Chất lượng:**<br>Đảm bảo tính tự nhiên của dáng người và độ toàn vẹn của trang phục (giữ nguyên logo, họa tiết). |
| **Price Forecasting (LightGBM)** | **Gradient Boosting Decision Tree.**<br>Sử dụng cơ chế phát triển cây theo lá (Leaf-wise) giúp giảm thiểu sai số nhanh hơn. Tối ưu tốc độ huấn luyện với GOSS và EFB. | Models (Forecast) | **Nhóm thuộc tính:**<br>- Ngữ cảnh & Thời gian<br>- Lịch sử Bán hàng<br>- Tín hiệu Hành vi người mua | **Dự đoán giá/nhu cầu:**<br>Dự đoán giá sản phẩm tương lai thông qua trung gian dự đoán Price Ratio (% chênh lệch giữa giá bán và giá gốc) sau đó quy đổi trở lại về giá sản phẩm. |
| **Background Removal** | Công cụ tách nền ảnh sản phẩm tự động. | Image Preprocessing | Ảnh quần áo chưa xóa phông của cửa hàng | Ảnh quần áo đã xóa phông + Kích thước + Mô tả |
