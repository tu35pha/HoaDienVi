# Công nghệ dự kiến – Dự án SENTIO

Tài liệu này mô tả các công nghệ dự kiến được sử dụng trong dự án SENTIO, bao gồm Frontend, Backend, Data Layer và các mô hình Machine Learning cốt lõi.

---

## 1. Frontend Layer (FE)

### 1.1 Next.js
**Mô tả:**  
Next.js là framework React hỗ trợ Server-Side Rendering (SSR) và Static Site Generation (SSG), phù hợp cho các ứng dụng web có yêu cầu hiệu năng cao và SEO tốt.

**Module áp dụng:**  
- Frontend (User App, Merchant Dashboard)

**Input:**  
- Dữ liệu sản phẩm (tên, giá, ảnh, model 3D)
- Dữ liệu AR catalog
- Kết quả dự báo (forecast card)
- Trạng thái đặt giữ (reservation)

**Output (dự kiến):**  
- Giao diện Web/PWA cho người dùng
- Giao diện Dashboard cho cửa hàng
- Hiển thị AR catalog, try-on, forecast

---

## 2. Backend Layer (BE)

### 2.1 FastAPI
**Mô tả:**  
FastAPI là framework backend Python hiệu năng cao, phù hợp cho hệ thống tích hợp nhiều mô hình Machine Learning.

**Module áp dụng:**  
- Backend API
- AI Service API

**Input:**  
- Request từ frontend (REST API)
- Dữ liệu người dùng, sản phẩm, tồn kho
- Input cho Try-on API và Forecast API

**Output (dự kiến):**  
- API phục vụ dữ liệu cho frontend
- API inference cho Try-on Engine
- API dự báo giá và khuyến mãi

**Lý do lựa chọn:**  
- Dễ tích hợp model ML (Try-on, Forecast) hơn so với Node.js  
- Hiệu năng tốt, async, dễ mở rộng

---

## 3. Data Layer

### 3.1 PostgreSQL
**Mô tả:**  
Hệ quản trị cơ sở dữ liệu quan hệ dùng để lưu trữ dữ liệu có cấu trúc.

**Module áp dụng:**  
- Database chính

**Input:**  
- Store, Product, Sales, Promotion, Reservation
- Thông tin user & merchant

**Output (dự kiến):**  
- Dữ liệu phục vụ dashboard
- Dataset đầu vào cho Forecast Engine

---

### 3.2 Supabase Storage
**Mô tả:**  
Dịch vụ lưu trữ object (file) dùng cho dữ liệu đa phương tiện.

**Module áp dụng:**  
- Storage

**Input:**  
- Ảnh sản phẩm
- Model 3D (.glb)
- Ảnh người dùng upload (try-on)

**Output (dự kiến):**  
- URL truy cập ảnh / model cho frontend và AI models

---

## 4. Design & Prototyping

### 4.1 Figma
**Mô tả:**  
Công cụ thiết kế UI/UX và prototype.

**Module áp dụng:**  
- Design

**Input:**  
- Requirement từ user flow
- Ý tưởng trải nghiệm AR & Dashboard

**Output (dự kiến):**  
- Prototype giao diện User App
- Prototype Merchant Dashboard

---

## 5. AI / Machine Learning Layer

### 5.1 IDM-VTON (Try-on Engine)
**Mô tả:**  
IDM-VTON là mô hình Virtual Try-On giúp tạo ảnh người mặc trang phục ảo một cách chân thực.

**Module áp dụng:**  
- Models (Try-on)

**Input:**  
- Ảnh quần áo (ảnh sản phẩm, kích thước, mô tả)
- Ảnh người dùng (không yêu cầu xóa phông)

**Output (dự kiến):**  
- Ảnh người dùng mặc thử trang phục ảo

**Ghi chú:**  
- Có thể sinh dữ liệu quần áo bằng tools hoặc lấy từ website cửa hàng
- Dữ liệu nền tảng dựa trên data Round 1

---

### 5.2 Forecast Engine (Dự báo giá & khuyến mãi)
**Công nghệ dự kiến:**  
- LightGBM / CatBoost / XGBoost  
- Có thể kết hợp LSTM / GRU  
- Mô hình chuỗi thời gian: ARIMA / SARIMA

**Module áp dụng:**  
- Models (Forecast)

**Input:**  
- Lịch sử bán hàng theo thời gian
- Giá thành sản phẩm
- Promotion (ngày bắt đầu – kết thúc)
- Lượt quan tâm / scan / try-on

**Yêu cầu dữ liệu:**  
- Cần bảng dữ liệu theo thời gian chi tiết
- Tạo các feature lagging theo thời gian
- Bổ sung bảng theo dõi hiệu suất các đợt promotion

**Output (dự kiến):**  
- Dự báo nhu cầu
- Xác suất giảm giá
- Gợi ý thời điểm khuyến mãi

**Ưu điểm:**  
- Train nhanh, độ chính xác chấp nhận được
- Dễ giải thích
- Có thể train trên CPU

**Nhược điểm:**  
- Khả năng extrapolation yếu
- Khó học quan hệ giữa các sản phẩm
- Yêu cầu feature engineering cao

---

### 5.3 Background Removal (Tạo phông xanh)
**Mô tả:**  
Xử lý tiền xử lý ảnh quần áo cho Try-on Engine.

**Module áp dụng:**  
- Image Preprocessing

**Input:**  
- Ảnh quần áo chưa xóa phông

**Output (dự kiến):**  
- Ảnh quần áo đã xóa phông
- Kèm thông tin kích thước và mô tả

---

## 6. Tổng kết
Hệ thống SENTIO được thiết kế theo hướng modular, dễ mở rộng:
- FE tối ưu trải nghiệm người dùng
- BE tập trung tích hợp AI
- Data Layer đảm bảo tính nhất quán
- ML Layer tạo giá trị cốt lõi (Try-on & Forecast)

Các công nghệ được lựa chọn cân bằng giữa:
- Tính khả thi khi demo
- Khả năng mở rộng trong thực tế
- Phù hợp với mục tiêu Datathon
