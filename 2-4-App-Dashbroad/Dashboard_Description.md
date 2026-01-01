# Mô tả Ứng dụng Dashboard (Merchant App)

Tài liệu này mô tả định hướng và kế hoạch phát triển cho thư mục `2-4-App-Dashbroad`.

## 1. Mục tiêu & Đối tượng sử dụng
Đây là ứng dụng quản trị dành riêng cho **Cửa hàng (Merchants)** và **Quản trị viên hệ thống**.

**Mục đích chính:**
*   Cung cấp công cụ quản lý vận hành (sản phẩm, đơn hàng).
*   Hỗ trợ ra quyết định kinh doanh dựa trên dữ liệu và AI.

## 2. Kế hoạch phát triển (Round 3)
Hiện tại phân hệ này đang trong giai đoạn thiết kế. Toàn bộ mã nguồn **Frontend (FE)** và **Backend (BE)** sẽ được bổ sung và hoàn thiện đầy đủ trong **Vòng 3**.

### Các tính năng cốt lõi dự kiến:
1.  **Quản lý danh mục sản phẩm:**
    *   Thêm mới, cập nhật thông tin, giá cả và hình ảnh sản phẩm.
    *   Quản lý kho hàng (Inventory).
2.  **Dashboard phân tích & Báo cáo:**
    *   Biểu đồ doanh thu, lợi nhuận, số lượng bán theo thời gian thực.
    *   Phân tích hành vi người dùng (lượt xem, lượt thử đồ ảo).
3.  **Tính năng AI nâng cao (Forecast):**
    *   Tích hợp **Forecast Engine** để hiển thị dự báo nhu cầu tiêu thụ trong tuần tới.
    *   Gợi ý giá bán tối ưu và thời điểm nên chạy khuyến mãi để tối đa hóa lợi nhuận.

## 3. Công nghệ dự kiến
*   **Frontend:** Next.js (thống nhất công nghệ với User App) kết hợp với các thư viện biểu đồ (Recharts, Chart.js).
*   **Backend:** Sử dụng chung hạ tầng **FastAPI** để tận dụng các model AI, đảm bảo tính nhất quán dữ liệu.
