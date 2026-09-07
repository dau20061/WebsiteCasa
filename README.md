# CASA TEA & BEVERAGE SOLUTIONS – HỆ THỐNG PHÂN TÁCH FRONTEND & BACKEND

Dự án đã được phân tách thành 2 phân hệ độc lập, rõ ràng và dễ dàng mở rộng:

```
e:/web_casa/
├── frontend/               # Giao diện người dùng (ReactJS + Vite + Tailwind CSS)
│   ├── src/                # Toàn bộ mã nguồn giao diện (Pages, Components, Context, Routes, Services)
│   │   ├── components/     # UI components (Navbar, Footer, ProductCard, Modals...)
│   │   ├── context/        # AuthContext quản lý đăng nhập & phân quyền
│   │   ├── firebase/       # Client SDK kết nối Firebase (Auth, Firestore, Storage)
│   │   ├── pages/          # 9 trang Public + 3 trang Admin Dashboard
│   │   ├── routes/         # Router DOM, ProtectedRoute, RoleGuard
│   │   └── services/       # Tầng truy vấn tuân thủ Firestore Rules
│   ├── public/             # Assets tĩnh
│   ├── index.html          # HTML Entrypoint
│   ├── vite.config.js      # Cấu hình Vite
│   ├── tailwind.config.js  # Design System Tailwind
│   ├── package.json        # Dependencies frontend
│   └── .env                # Biến môi trường Client SDK
│
├── backend/                # Toàn bộ cấu hình máy chủ & Bảo mật Firebase (Spark Plan)
│   ├── firestore.rules     # Cloud Firestore Security Rules v2 (Zero Trust RBAC)
│   ├── storage.rules       # Firebase Storage Rules (Giới hạn 5MB, định dạng ảnh)
│   ├── firebase.json       # Cấu hình triển khai Firebase CLI
│   ├── .firebaserc         # Alias Project Firebase
│   ├── tests/              # Bộ kiểm thử 20 kịch bản quy tắc bảo mật
│   │   └── security-rules-validation.test.js
│   ├── seeds/              # Dữ liệu mẫu tham chiếu & Schema các collections
│   │   └── sampleDataSeed.js
│   ├── package.json        # Scripts chạy test và deploy rules
│   └── README.md           # Hướng dẫn chi tiết tạo SUPER_ADMIN và cấu hình Firebase
│
└── package.json            # Root workspace script điều khiển tiện lợi
```

---

## 🚀 Hướng Dẫn Khởi Chạy

### 1. Khởi chạy Frontend (Giao diện Website & Admin)
Từ thư mục gốc:
```bash
npm run frontend:dev
```
Hoặc chuyển vào thư mục `frontend`:
```bash
cd frontend
npm run dev
```
Trang web sẽ chạy tại: `http://localhost:5173/`

### 2. Kiểm thử Bộ Quy Tắc Bảo Mật Backend
Từ thư mục gốc:
```bash
npm run backend:test
```
Hoặc chuyển vào thư mục `backend`:
```bash
cd backend
npm test
```
Tất cả 20 kịch bản kiểm thử bảo mật sẽ được thực thi và hiển thị kết quả chi tiết.

### 3. Triển khai Quy Tắc Lên Firebase Cloud
Từ thư mục `backend`:
```bash
cd backend
firebase login
firebase deploy --only firestore:rules,storage
```

---

## 🔒 Quy Tắc Bảo Mật Cốt Lõi
- **Zero Trust Client**: Tuyệt đối không xác thực quyền bằng dữ liệu gửi từ trình duyệt. Quyền hạn lấy trực tiếp từ `users/{uid}` trong Firestore.
- **Spark Plan (Free)**: Không cần Cloud Functions, không cần Admin SDK, không phát sinh chi phí.
- **Chống leo thang đặc quyền**: User không thể tự đổi role; ADMIN không thể sửa/xóa SUPER_ADMIN.
