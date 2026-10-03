# 🌐 CASA TEA & FOOD – Frontend Application

Giao diện Single Page Application (SPA) của hệ thống **CASA TEA & FOOD**, được xây dựng bằng **React 18**, **Vite 6** và **Tailwind CSS**.

---

## 📁 Cấu Trúc Thư Mục Frontend

```text
frontend/
├── public/                # Assets tĩnh (.htaccess, robots.txt, icons, logo)
├── src/
│   ├── api/               # API client kết nối Backend & Serverless
│   ├── components/        # UI components tái sử dụng (Navbar, Footer, ProductCard, Modals...)
│   │   └── admin/         # Component chuyên biệt cho bảng quản trị
│   ├── constants/         # Dữ liệu tĩnh, danh mục, chứng nhận, thông tin công ty
│   ├── context/           # React Context (AuthContext, LanguageContext, ThemeContext)
│   ├── firebase/          # Cấu hình SDK Firebase Client (Auth, Realtime Database, Storage)
│   ├── layouts/           # Layout khung (MainLayout, AdminLayout)
│   ├── locales/           # File dịch thuật đa ngôn ngữ (VI, EN, ZH)
│   ├── pages/             # 9 trang công khai (Home, About, Products, News, FAQ, Contact...)
│   │   └── admin/         # 3 trang quản trị (AdminDashboard, AdminLogin, Forbidden403)
│   ├── routes/            # Hệ thống định tuyến React Router DOM & RoleGuard
│   ├── services/          # Tầng xử lý logic truy vấn dữ liệu RTDB & Gemini AI
│   ├── utils/             # Tiện ích bổ trợ (nén ảnh WebP, slugify SEO, quyền hạn)
│   ├── App.jsx            # Component gốc
│   ├── index.css          # CSS toàn cục & định nghĩa Tailwind utility
│   └── main.jsx           # Entrypoint khởi tạo React DOM
├── index.html             # HTML entrypoint
├── package.json           # Dependencies và scripts frontend
├── tailwind.config.js     # Cấu hình Design System màu sắc (tea palette)
└── vite.config.js         # Cấu hình Vite bundler & chunk splitting
```

---

## 🚀 Lệnh Khởi Chạy

```bash
# Cài đặt thư viện
npm install

# Khởi chạy môi trường phát triển (Port 5173)
npm run dev

# Đóng gói sản phẩm cho production (Thư mục dist/)
npm run build

# Xem thử bản dựng production
npm run preview
```
