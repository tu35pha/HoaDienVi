# Mô tả Ứng dụng Người dùng (User App)

Tài liệu này mô tả trạng thái hiện tại và kế hoạch phát triển cho thư mục `2-3-App-NguoiDung`, bao gồm hai thành phần chính là Backend (BE) và Frontend (FE).

## 1. Backend (BE)

*   **Trạng thái hiện tại:** Thư mục `be` hiện đang là placeholder và chưa chứa mã nguồn triển khai chi tiết.
*   **Kế hoạch Round 3:**
    *   Hệ thống Backend sẽ được xây dựng và bổ sung đầy đủ trong vòng thi tiếp theo (Round 3).
    *   **Công nghệ dự kiến:** Sử dụng **FastAPI (Python)** để đảm bảo hiệu năng cao và khả năng tích hợp mượt mà với các mô hình AI (Try-on, Forecast) đã được phát triển ở thư mục `2-2Models`.
    *   **Chức năng chính:** Cung cấp RESTful API cho Frontend, xử lý nghiệp vụ mua sắm, và serving các model AI.

## 2. Frontend (FE)

*   **Trạng thái hiện tại:** Đã khởi tạo khung dự án và xây dựng cấu trúc routing cơ bản.
*   **Công nghệ:** Next.js 16.1.1, React 19, TypeScript, Tailwind CSS v4.

### Cấu trúc thư mục Frontend (`fe`)

Mã nguồn Frontend được tổ chức theo kiến trúc **App Router** của Next.js:

```text
fe/
├── public/                 # Chứa tài nguyên tĩnh (ảnh, icons, fonts)
├── src/
│   └── app/                # App Router - Định nghĩa các trang của ứng dụng
│       ├── login/          # Trang Đăng nhập
│       ├── register/       # Trang Đăng ký
│       ├── forgot-password/# Trang Quên mật khẩu
│       ├── products/       # Trang Danh sách & Chi tiết sản phẩm
│       ├── cart/           # Trang Giỏ hàng
│       ├── checkout/       # Trang Thanh toán
│       ├── profile/        # Trang Thông tin cá nhân
│       ├── page.tsx        # Trang chủ (Home Page)
│       ├── layout.tsx      # Layout chung cho toàn ứng dụng
│       └── globals.css     # Global Styles (Tailwind directives)
├── next.config.ts          # Cấu hình Next.js
├── tailwind.config.ts      # Cấu hình Tailwind CSS
└── package.json            # Quản lý dependencies
```

### Những gì đã thực hiện được:
1.  **Khởi tạo dự án:** Thiết lập môi trường phát triển với các công nghệ mới nhất (Next.js 16, React 19).
2.  **Cấu trúc Routing:** Đã định nghĩa các đường dẫn (routes) cơ bản cần thiết cho một ứng dụng thương mại điện tử (Auth, Product, Cart, Checkout).
3.  **UI Foundation:** Tích hợp Tailwind CSS để phát triển giao diện nhanh chóng.

### Kế hoạch Round 3:
*   **Hoàn thiện UI/UX:** Code chi tiết giao diện cho các trang đã định nghĩa.
*   **Tích hợp API:** Kết nối với Backend (FastAPI) để lấy dữ liệu động.
*   **Tích hợp AI Features:**
    *   Thêm giao diện **Virtual Try-on** trong trang chi tiết sản phẩm.
    *   Hiển thị các thông tin dự báo hoặc gợi ý thông minh.
*   **Run App:** Đảm bảo ứng dụng có thể chạy hoàn chỉnh (End-to-End) với đầy đủ tính năng.

### Hướng dẫn cài đặt và khởi chạy (Frontend)

Để chạy ứng dụng Frontend trên máy cục bộ, bạn cần cài đặt **Node.js** (phiên bản 18 trở lên).

**Bước 1: Di chuyển vào thư mục frontend**
```bash
cd fe
```

**Bước 2: Cài đặt các thư viện phụ thuộc (Dependencies)**
```bash
npm install
# Hoặc nếu dùng yarn:
# yarn install
```

**Bước 3: Chạy server phát triển (Development Mode)**
```bash
npm run dev
# Hoặc: yarn dev
```
Truy cập [http://localhost:3000](http://localhost:3000) để xem ứng dụng.

**Bước 4: Build và chạy Production (Optional)**
```bash
npm run build
npm start
```

