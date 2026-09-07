# Hướng Dẫn Thiết Lập & Triển Khai Firebase Security Rules (CASA TEA)

Tài liệu hướng dẫn toàn diện cấu hình, bảo mật và triển khai hệ thống phân quyền 4 role (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `VIEWER`, `PUBLIC`) trên nền tảng **Firebase Spark Plan (Gói Miễn Phí)**.

---

## 1. Kiến Trúc Bảo Mật & Phân Quyền (Zero Trust Client)

Hệ thống hoạt động theo nguyên tắc **Zero Trust**:
- **Không bao giờ tin tưởng Client**: Không sử dụng `request.resource.data.role` hay bất kỳ claim nào gửi từ trình duyệt để cấp quyền.
- **Xác thực trực tiếp trên Server**: Mọi thao tác ghi/đọc nhạy cảm đều truy vấn quyền hạn thực tế từ document `users/$(request.auth.uid)` trong Firestore.
- **Chống leo thang đặc quyền (Privilege Escalation)**:
  - User thường không thể tự sửa `role`, `status` hay `uid`.
  - `ADMIN` không thể sửa/xóa `SUPER_ADMIN` và không thể tự nâng quyền chính mình lên `SUPER_ADMIN`.
  - `EDITOR` và `VIEWER` bị chặn hoàn toàn khỏi việc truy cập danh sách người dùng (`users`).
  - Khách vãng lai (`PUBLIC`) chỉ được tạo đơn liên hệ mới (`contacts`) với trạng thái bắt buộc `NEW` và danh sách trường Whitelist được kiểm duyệt chặt chẽ.

---

## 2. Ma Trận Phân Quyền Chi Tiết (Role Matrix)

| Tài nguyên / Collection | PUBLIC | VIEWER | EDITOR | ADMIN | SUPER_ADMIN |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **products** | Đọc `status == "PUBLISHED"` | Đọc tất cả | CRUD | CRUD | CRUD |
| **productCategories** | Đọc `status == "ACTIVE"` | Đọc tất cả | CRUD | CRUD | CRUD |
| **news** & **newsCategories** | Đọc `status == "PUBLISHED"` / `"ACTIVE"` | Đọc tất cả | CRUD | CRUD | CRUD |
| **faqs** & **faqCategories** | Đọc `status == "PUBLISHED"` / `"ACTIVE"` | Đọc tất cả | CRUD | CRUD | CRUD |
| **machinery** & **certifications** | Đọc `status == "PUBLISHED"` | Đọc tất cả | CRUD | CRUD | CRUD |
| **contacts** (Khách gửi form) | **Chỉ CREATE** (`status: "NEW"`, cấm đọc/sửa/xóa) | Chỉ đọc | Đọc & Đổi trạng thái xử lý (Cấm xóa) | Đọc + Sửa + Xóa | Toàn quyền |
| **siteContent** (*homepage*, *about*) | Đọc công khai | Đọc | Đọc (Cấm sửa) | Đọc + Cập nhật | Toàn quyền |
| **siteContent/settings** | Đọc cấu hình public | Đọc | Đọc (Cấm sửa) | Đọc + Cập nhật | Toàn quyền |
| **users/{uid}** | **Cấm truy cập** (Deny all) | Chỉ đọc profile mình | Chỉ đọc profile mình | Xem danh sách (Cấm sửa SuperAdmin) | **Toàn quyền CRUD** |
| **Firebase Storage** (`/products`, `/news`...) | Đọc ảnh | Đọc | Upload/Xóa ảnh content | Toàn quyền content + `/site` | Toàn quyền |

---

## 3. Hướng Dẫn Tạo Tài Khoản SUPER_ADMIN Đầu Tiên

Do dự án sử dụng **Firebase Spark Plan (Free)** không dùng Cloud Functions hay Admin SDK, tài khoản `SUPER_ADMIN` đầu tiên được tạo một cách an toàn thông qua Firebase Console:

### Bước 1: Tạo tài khoản Authentication
1. Truy cập [Firebase Console](https://console.firebase.google.com/) -> Chọn Project của bạn.
2. Vào mục **Build** -> **Authentication** -> Tab **Users**.
3. Bấm **Add user**.
4. Nhập Email (VD: `admin@casatea.vn`) và Mật khẩu mạnh.
5. Sau khi tạo, bấm vào dòng user đó và **sao chép User UID** (Chuỗi ký tự dạng `xYz12345Abc...`).

### Bước 2: Tạo document phân quyền trong Firestore
1. Vào mục **Build** -> **Firestore Database**.
2. Chọn **Start collection** -> Nhập tên collection: `users`.
3. Nhập **Document ID**: Dán chính xác chuỗi `UID` vừa sao chép ở Bước 1 (Ví dụ: `xYz12345Abc...`).
4. Thêm các trường dữ liệu sau:
   - `uid` (string): `<Dán_UID_vào_đây>`
   - `email` (string): `admin@casatea.vn`
   - `displayName` (string): `Giám Đốc Quản Trị Hệ Thống`
   - `role` (string): `SUPER_ADMIN`
   - `status` (string): `ACTIVE`
   - `createdAt` (timestamp): Chọn ngày giờ hiện tại
   - `updatedAt` (timestamp): Chọn ngày giờ hiện tại
5. Bấm **Save**.

### Bước 3: Đăng nhập vào Admin Portal
1. Mở trang `/admin/login` trên website (hoặc `http://localhost:5173/admin/login`).
2. Đăng nhập bằng email và mật khẩu bạn vừa tạo.
3. Hệ thống sẽ tự động đối soát UID với Firestore Security Rules và mở quyền truy cập Dashboard!

> [!WARNING]
> Tuyệt đối **không mở tính năng tự phong SUPER_ADMIN** từ phía client. Chỉ những người có quyền truy cập trực tiếp vào Firebase Console hoặc được `SUPER_ADMIN` hiện tại cấp quyền mới có thể sở hữu đặc quyền tối cao này.

---

## 4. Hướng Dẫn Triển Khai Security Rules Bằng Firebase CLI

Không cần Cloud Functions, bạn chỉ cần triển khai 2 file: [firestore.rules](file:///e:/web_casa/firestore.rules) và [storage.rules](file:///e:/web_casa/storage.rules).

### Bước 1: Cài đặt Firebase CLI (Nếu chưa có)
```bash
npm install -g firebase-tools
```

### Bước 2: Đăng nhập và liên kết dự án
```bash
firebase login
firebase use --add
# Chọn Project ID của bạn trong danh sách
```

### Bước 3: Deploy Security Rules lên Firebase
Deploy Firestore Rules:
```bash
firebase deploy --only firestore:rules
```

Deploy Storage Rules:
```bash
firebase deploy --only storage
```

Hoặc deploy cả 2 cùng lúc:
```bash
firebase deploy --only firestore:rules,storage
```

---

## 5. CẢNH BÁO QUAN TRỌNG: Rules Không Phải Bộ Lọc (Rules Are Not Filters)

Trong Firebase Firestore:
> **Security Rules không hoạt động như mệnh đề `WHERE` trong SQL.**

### ❌ Ví dụ SAI (Sẽ bị Firestore từ chối lỗi `permission-denied`):
```javascript
// Rule trong firestore.rules:
// allow read: if resource.data.status == "PUBLISHED";

// Code frontend viết:
const snapshot = await getDocs(collection(db, "products")); // ❌ LỖI NGAY LẬP TỨC!
// Firestore từ chối toàn bộ truy vấn vì trong collection có cả sản phẩm DRAFT, 
// và query không chứng minh được chỉ lấy các tài liệu PUBLISHED!
```

### ✅ Ví dụ ĐÚNG (Tuân thủ chuẩn mực trong `src/services/`):
```javascript
import { collection, query, where, getDocs } from 'firebase/firestore';

// Query PHẢI có điều kiện lọc khớp với Rule:
const q = query(
  collection(db, "products"),
  where("status", "==", "PUBLISHED") // ✅ Hợp lệ, Rules sẽ cấp quyền đọc!
);
const snapshot = await getDocs(q);
```

Tất cả các hàm trong thư mục [src/services/](file:///e:/web_casa/src/services/) của dự án đã được thiết kế sẵn đúng 100% theo nguyên lý này.

---

## 6. Chạy Kiểm Thử Tự Động Bộ Quy Tắc (Security Rules Test Suite)

Dự án đã tích hợp sẵn kịch bản kiểm thử 20 ca kiểm nghiệm bảo mật:
```bash
npm run test:rules
```

**20 Kịch bản kiểm thử bao gồm:**
1. Anonymous đọc sản phẩm PUBLISHED -> **ALLOW**
2. Anonymous đọc sản phẩm DRAFT -> **DENY**
3. Anonymous tạo sản phẩm -> **DENY**
4. Anonymous cập nhật sản phẩm -> **DENY**
5. Anonymous xóa sản phẩm -> **DENY**
6. EDITOR tạo sản phẩm -> **ALLOW**
7. EDITOR cập nhật sản phẩm -> **ALLOW**
8. EDITOR xóa sản phẩm -> **ALLOW**
9. EDITOR cập nhật bảng users -> **DENY**
10. EDITOR cập nhật cấu hình settings -> **DENY**
11. EDITOR cập nhật trang chủ homepage -> **DENY**
12. ADMIN cập nhật sản phẩm -> **ALLOW**
13. ADMIN cập nhật cấu hình settings -> **ALLOW**
14. ADMIN sửa quyền của SUPER_ADMIN -> **DENY** (Chống hạ bệ)
15. SUPER_ADMIN cập nhật users -> **ALLOW**
16. User tự nâng quyền từ EDITOR lên ADMIN -> **DENY** (Chống Privilege Escalation)
17. Anonymous gửi biểu mẫu contact (status=NEW) -> **ALLOW**
18. Anonymous đọc danh sách contact -> **DENY** (Bảo mật thông tin khách)
19. Anonymous cập nhật contact -> **DENY**
20. Anonymous xóa contact -> **DENY**

---

## 7. Bảng Kiểm Tra An Toàn (Security Audit Checklist)

- [x] Không tồn tại `allow read, write: if true;` ở bất kỳ đâu trong `firestore.rules` và `storage.rules`.
- [x] Không tin tưởng `request.resource.data.role` từ frontend.
- [x] Bắt buộc `status == "ACTIVE"` để thực thi quyền quản trị.
- [x] Toàn bộ collections chưa được khai báo đều rơi vào fallback `allow read, write: if false;`.
- [x] Khách Public chỉ được CREATE vào `contacts` với Whitelist trường nghiêm ngặt, bắt buộc `status: "NEW"` và `createdAt: request.time`.
- [x] Storage Rules kiểm tra định dạng ảnh (JPEG/PNG/WebP) và dung lượng tối đa 5MB, chặn file thực thi.
- [x] Frontend không lưu trữ Service Account, Private Key hay Secret Token.
