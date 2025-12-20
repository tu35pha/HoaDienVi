# VIETNAM DATATHON – DATASTORM 2025  
## Báo cáo Vòng 01 – Dự án SENTIO  

**Đội:** Hoa Diên Vĩ  
**Tên dự án:** SENTIO – *Feel so lit, touch your fit*  
**Ngày nộp:** 16/11/2025  

### Thành viên
- Huỳnh Quốc Cường – ĐH Công nghệ Thông tin, ĐHQG-HCM  
- Hồ Phú Vương – ĐH Kinh tế – Luật, ĐHQG-HCM  
- Võ Phương Chi – ĐH Kinh tế – Luật, ĐHQG-HCM  
- Nguyễn Đăng Khôi – ĐH Công nghệ Thông tin, ĐHQG-HCM  
- Phạm Hoàng Anh Tú – ĐH Công nghệ Thông tin, ĐHQG-HCM  

---

## 1. Bối cảnh & Vấn đề

### 1.1. Vấn đề trong bán lẻ offline hiện nay
Mua sắm trực tiếp (offline retail) đang gặp nhiều rào cản:

- **Bất cân xứng thông tin:**  
  Người dùng không biết trước tồn kho, giá, khuyến mãi khi đi ngang cửa hàng.  
- **Trải nghiệm khám phá hạn chế:**  
  Cửa hàng nhỏ không đủ không gian trưng bày, ít mẫu thử.  
- **Rào cản tâm lý (đặc biệt với Gen Z):**  
  Ngại bước vào cửa hàng, sợ bị theo sát hoặc “bị đánh giá” nếu không mua.  
- **Hiện tượng showrooming (xem offline – mua online):**  
  Gây thất thoát doanh thu cho cửa hàng vật lý.

### 1.2. Cơ hội thị trường
- Người tiêu dùng đang **quay lại mua sắm offline**, nhưng kỳ vọng trải nghiệm số hoá.
- Thị trường **AR trong bán lẻ tăng trưởng >40%/năm**.
- Gen Z & Millennials ưa chuộng trải nghiệm *phygital* (online + offline).

➡️ **Khoảng trống:** Offline retail thiếu một “lớp trải nghiệm số” ngay tại mặt tiền cửa hàng.

---

## 2. Giải pháp – SENTIO là gì?

**Sentio** là nền tảng **AR – AI – O2O**, đóng vai trò *“cầu nối thực – ảo”* cho bán lẻ offline.

👉 Khi người dùng **đi ngang cửa hàng**, họ có thể:
- Quét mặt tiền / QR
- Xem **catalog AR 3D**
- **Thử sản phẩm ảo (Virtual Try-on)**
- Xem **dự báo khuyến mãi – giá tương lai**
- Quyết định **mua / chờ / đặt giữ** trước khi bước vào cửa hàng

---

## 3. Giá trị cốt lõi

### 3.1. Giá trị cho người dùng
- **Tối ưu chi tiêu:** Biết khi nào nên mua để có giá tốt nhất  
- **Xóa rào cản tâm lý:** Thử & khám phá trước khi bước vào cửa hàng  
- **Tiết kiệm thời gian:** Không cần hỏi nhân viên, không cần vào nhiều shop  

### 3.2. Giá trị cho cửa hàng
- **Tăng tỷ lệ chuyển đổi khách vãng lai (20–50%)**
- **Mở rộng không gian trưng bày ảo (AR Catalog)**
- **Thu thập dữ liệu hành vi trước khi khách vào shop**
- **Dự báo & kích hoạt khuyến mãi thông minh**

### 3.3. Giá trị cho thị trường
- Thúc đẩy **chuyển đổi số bán lẻ địa phương**
- Tạo nền tảng dữ liệu O2O (Online-to-Offline) theo vị trí

---

## 4. Luồng người dùng (User Flow)

### Bước 1: Khám phá & Thử ảo
- Quét mặt tiền cửa hàng
- Xem catalog AR
- Thử sản phẩm ảo bằng camera

### Bước 2: Xem dự báo & quyết định
- Hiển thị *Forecast Card*:
  - Giá hiện tại
  - Xác suất giảm giá
  - Gợi ý: *Mua ngay / Chờ X ngày*

### Bước 3: Đặt giữ (Reservation)
- Người dùng để lại thông tin
- Hệ thống giữ hàng tạm thời
- Sinh mã QR xác nhận

### Bước 4: Cửa hàng thao tác
- Merchant Dashboard:
  - Xem lượt quét, lượt thử
  - Xác nhận / huỷ giữ hàng
  - Kích hoạt flash sale

---

## 5. Công nghệ chính

### 5.1. Try-On Engine (AI tạo sinh)
- **Virtual Try-on 2D**
- Diffusion Models + Appearance Flow
- Giữ nguyên dáng người, khuôn mặt, họa tiết trang phục

### 5.2. Forecast Engine
- Dự báo:
  - Nhu cầu
  - Khả năng giảm giá
  - Thời điểm khuyến mãi tối ưu
- Công nghệ:
  - XGBoost (Time-series ML)
  - Feature: sales history, inventory, promotion, hành vi AR

### 5.3. Data & API Layer
- Đồng bộ dữ liệu:
  - POS
  - AR Catalog
  - Forecast Engine
- REST API + Realtime Sync
- Hỗ trợ Dashboard & Notification

---

## 6. Dữ liệu

- Dataset gốc: **E-commerce Dataset (Kaggle)**
- Tạo **Mock Data cho thị trường Việt Nam**
- Các bảng chính:
  - `store`
  - `products`
  - `sales`
  - `promos`
  - `inventory_update`

---

## 7. Tác động định lượng (ước tính)

| Đối tượng | Chỉ số | Tác động |
|---------|------|--------|
| Cửa hàng | Conversion Rate | +20% – 50% |
| Cửa hàng | ROI khuyến mãi | +15% – 30% |
| Cửa hàng | Doanh thu / m² | +10% – 25% |
| Người dùng | Tiết kiệm chi tiêu | 5% – 15% |
| Người dùng | Thời gian mua sắm | +15% – 40% |

---

## 8. Rủi ro & Giảm thiểu

- **Sai lệch dự báo:**  
  → Hiển thị dải tin cậy & disclaimer  
- **Tích hợp POS phức tạp:**  
  → Hỗ trợ CSV / API từng bước  
- **Chi phí AR – AI cao:**  
  → Triển khai theo module, scale dần  

---

## 9. Tầm nhìn

- Trợ lý AI cá nhân hoá mua sắm
- Tích hợp thanh toán (MoMo, VNPay)
- Trở thành **nền tảng AR – O2O cho mọi con phố**

---

**SENTIO – giảm ma sát trong mua sắm offline,  
mở ra trải nghiệm bán lẻ minh bạch – thông minh – bền vững.**
