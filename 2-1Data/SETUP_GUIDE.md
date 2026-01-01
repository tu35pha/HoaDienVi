# Hướng dẫn Setup Hạ tầng Dữ liệu (PostgreSQL & Supabase Storage) - Dự án SENTIO

Tài liệu này hướng dẫn chi tiết cách thiết lập cơ sở dữ liệu và kho lưu trữ trên nền tảng **Supabase**, phù hợp với kiến trúc công nghệ đã đề ra trong `1-0-CongNgheDuKien.md`.

Chúng ta sẽ sử dụng **Supabase** để cung cấp:
1.  **PostgreSQL (Cloud)**: Phiên bản mới nhất (hiện tại là 15.x hoặc 16.x trên Supabase) để lưu trữ dữ liệu có cấu trúc (User, Product, Sales, Forecast...).
2.  **Supabase Storage**: Để lưu trữ file đa phương tiện (Ảnh sản phẩm, Model 3D, Ảnh upload từ người dùng).

---

## Phần 1: Khởi tạo Project trên Supabase

1.  Truy cập [https://supabase.com/dashboard](https://supabase.com/dashboard) và đăng nhập.
2.  Nhấn **"New Project"**.
3.  Chọn Organization của bạn.
4.  Điền thông tin Project:
    *   **Name:** `Sentio_Platform` (hoặc tên tùy chọn).
    *   **Database Password:** Tạo một mật khẩu mạnh và **LƯU LẠI NGAY** vào trình quản lý mật khẩu (bạn sẽ không thể xem lại nó).
    *   **Region:** Chọn khu vực gần người dùng nhất (ví dụ: `Singapore` hoặc `Vietnam` nếu có).
    *   **Pricing Plan:** Chọn Free (cho giai đoạn phát triển).
5.  Nhấn **"Create new project"**. Quá trình này mất khoảng 1-2 phút.

---

## Phần 2: Cấu hình PostgreSQL Database

Dự án SENTIO cần lưu trữ các bảng dữ liệu chính: `Store`, `Product`, `Sales`, `Promotion`, `Reservation`, `Users`.

### 1. Lấy chuỗi kết nối (Connection String)
Sau khi project đã sẵn sàng:
1.  Vào **Project Settings** (biểu tượng bánh răng) -> **Database**.
2.  Tại phần **Connection parameters**, tắt "Use connection pooling" nếu bạn dùng Prisma hoặc kết nối trực tiếp từ máy local để dev. Tuy nhiên, với môi trường Production hoặc Serverless, nên dùng Connection Pooling.
3.  Tại phần **Connection String** -> Chọn tab **URI**.
4.  Copy chuỗi kết nối. Định dạng chuẩn:
    ```
    postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
    ```
5.  **Lưu ý:** Thay `[YOUR-PASSWORD]` bằng mật khẩu bạn tạo ở Phần 1.

### 2. Cài đặt Extension (Tùy chọn)
Nếu dự án cần tìm kiếm vector (cho AI recommendation sau này) hoặc xử lý hình ảnh:
1.  Vào mục **Database** (thanh bên trái) -> **Extensions**.
2.  Tìm và enable `pgvector` (nếu cần lưu vector embeddings).
3.  Tìm và enable `postgis` (nếu cần lưu tọa độ cửa hàng).

---

## Phần 3: Cấu hình Supabase Storage

Theo thiết kế, chúng ta cần các "Bucket" (thùng chứa) riêng biệt cho các loại dữ liệu khác nhau.

### 1. Tạo các Bucket
Vào mục **Storage** (biểu tượng hình cái xô) -> **New Bucket**. Tạo lần lượt các bucket sau:

| Tên Bucket | Public? | Mục đích |
| :--- | :--- | :--- |
| `products` | **ON** | Lưu ảnh sản phẩm hiển thị trên App/Web. |
| `models-3d` | **ON** | Lưu file 3D (.glb, .gltf) cho tính năng AR/3D View. |
| `try-on-uploads` | **OFF** | Lưu ảnh người dùng upload để thực hiện Try-on (Cần bảo mật). |
| `generated-tryon`| **ON** | Lưu kết quả ảnh sau khi AI xử lý Try-on (để hiển thị lại cho user). |

### 2. Cấu hình Policy (Row Level Security - RLS)
Để Frontend hoặc Backend có thể upload/xem file, bạn cần cấu hình quyền truy cập.

**Cách làm:** Vào Storage -> Chọn Bucket -> Tab **Configuration** -> **Policies** -> **New Policy**.

#### A. Cho Bucket `products` và `models-3d` (Public Read)
*   **Policy Name:** `Public Access`
*   **Allowed operations:** `SELECT`
*   **Target roles:** `anon` (bất kỳ ai cũng xem được)
*   *Lưu ý: Quyền INSERT/UPDATE/DELETE chỉ nên cấp cho `authenticated` users (Admin/Merchant) hoặc dùng Service Role Key từ Backend.*

#### B. Cho Bucket `try-on-uploads` (Private)
*   **Policy Name:** `User Uploads`
*   **Allowed operations:** `INSERT`, `SELECT`
*   **Target roles:** `authenticated` (Chỉ user đã đăng nhập mới được up và xem ảnh của chính họ).
*   **Policy definition (USING):** `auth.uid() = owner_id` (Cần thiết lập thêm cột owner_id trong metadata hoặc quản lý qua folder structure `uid/filename`).

---

## Phần 4: Tích hợp vào Dự án (Environment Variables)

Cập nhật file cấu hình môi trường cho cả Backend (FastAPI) và Frontend (Next.js).

### 1. Lấy API Keys
Vào **Project Settings** -> **API**.
*   **Project URL:** `https://[PROJECT-REF].supabase.co`
*   **anon public:** Key dùng cho Frontend (Next.js).
*   **service_role:** Key dùng cho Backend (FastAPI) - **Tuyệt đối không lộ key này ra Frontend**.

### 2. Cấu hình cho Backend (FastAPI)
Tạo file `.env` trong thư mục `2-3-App-NguoiDung/be/`:

```env
# Database Connection
DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Supabase Auth & Storage (Dùng Service Role để có quyền Admin xử lý data)
SUPABASE_URL="https://[PROJECT-REF].supabase.co"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"

# Cấu hình Bucket
BUCKET_PRODUCTS="products"
BUCKET_MODELS="models-3d"
BUCKET_TRYON_INPUT="try-on-uploads"
BUCKET_TRYON_OUTPUT="generated-tryon"
```

### 3. Cấu hình cho Frontend (Next.js)
Tạo file `.env.local` trong thư mục `2-3-App-NguoiDung/fe/`:

```env
# Supabase Client (Public)
NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"

# Bucket Names (Public để FE biết đường dẫn)
NEXT_PUBLIC_BUCKET_PRODUCTS="products"
NEXT_PUBLIC_BUCKET_MODELS="models-3d"
```

---

## Phần 5: Kiểm tra kết nối

1.  **Database:** Dùng phần mềm như **TablePlus**, **DBeaver** hoặc **pgAdmin** kết nối thử với `DATABASE_URL`.
2.  **Storage:** Upload thử 1 file ảnh vào bucket `products` và thử truy cập qua đường dẫn:
    `https://[PROJECT-REF].supabase.co/storage/v1/object/public/products/[FILENAME]`

---
**Lưu ý quan trọng:**
*   Luôn bảo vệ `service_role` key.
*   Với tính năng Try-on, Backend sẽ cần download ảnh từ `try-on-uploads`, xử lý qua AI Model, sau đó upload kết quả lên `generated-tryon`.
