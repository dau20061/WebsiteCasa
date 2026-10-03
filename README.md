# 🍃 CASA TEA & FOOD – Enterprise B2B Beverage Solutions

[![React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-6.x-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.x-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Firebase](https://img.shields.io/badge/Firebase-RTDB_%26_Firestore-FFCA28?logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Vercel](https://img.shields.io/badge/Vercel-Production_Live-000000?logo=vercel&logoColor=white)](https://www.nguyenlieuphachecasa.com)

> Website giới thiệu doanh nghiệp và giải pháp cung ứng nguyên liệu trà cao cấp, bột pha chế B2B, gia công OEM/ODM, tích hợp bảng quản trị thời gian thực và tự động tối ưu hóa SEO.

🌐 **Website trực tiếp:** [https://www.nguyenlieuphachecasa.com](https://www.nguyenlieuphachecasa.com)

---

## 📁 Cấu Trúc Thư Mục Dự Án (Project Architecture)

Hệ thống được tổ chức theo mô hình **Monorepo** gọn gàng, phân tách rõ ràng giữa Frontend, Backend và API:

```text
web_casa/
├── api/                           # Vercel Serverless Functions (REST Endpoints & Image Streaming)
│   ├── [...path].js               # Dynamic API Router
│   ├── article-image.js           # Serverless Dynamic WebP Image Serving (Articles)
│   ├── categories.js              # Categories REST Endpoint
│   ├── news.js                    # News & Articles Endpoint
│   ├── product-image.js           # Serverless Dynamic WebP Image Serving (Products)
│   ├── products.js                # Products REST Endpoint
│   └── sitemap.js                 # Dynamic XML Sitemap Generator
│
├── backend/                       # Máy chủ Node.js/Express & Cấu hình Firebase Rules
│   ├── src/                       # Mã nguồn Express Server
│   │   ├── config/                # Cấu hình Firebase Admin & Client
│   │   ├── data/                  # Seed data & Danh mục mẫu
│   │   ├── routes/                # Express API Routes (/products, /news, /contact, /ai...)
│   │   ├── services/              # Tầng xử lý Firebase Realtime Database & AI Assistant
│   │   └── server.js              # Express Application Entry Point
│   ├── tests/                     # Bộ kiểm thử 20 kịch bản Security Rules
│   │   └── security-rules-validation.test.js
│   ├── seeds/                     # Dữ liệu khởi tạo & schema tham chiếu
│   ├── firestore.rules            # Cloud Firestore Security Rules (Zero Trust RBAC)
│   ├── storage.rules              # Firebase Storage Security Rules
│   ├── firebase.json              # Cấu hình Firebase CLI
│   └── package.json               # Backend dependencies & test scripts
│
├── frontend/                      # Ứng dụng Single Page Application (React + Vite)
│   ├── public/                    # Tài nguyên tĩnh (.htaccess, robots.txt, icons, manifest)
│   ├── src/                       # Mã nguồn giao diện chính
│   │   ├── api/                   # API Client & Axios Instance
│   │   ├── components/            # Reusable UI Components (Navbar, Footer, ProductCard...)
│   │   ├── constants/             # Danh mục, chứng nhận, thông tin công ty
│   │   ├── context/               # AuthContext, LanguageContext, ThemeContext
│   │   ├── firebase/              # Firebase Client SDK SDK (Auth, RTDB, Storage)
│   │   ├── layouts/               # MainLayout (Khách) & AdminLayout (Quản trị)
│   │   ├── locales/               # Hỗ trợ đa ngôn ngữ (Tiếng Việt, Tiếng Anh, Tiếng Trung)
│   │   ├── pages/                 # 9 trang Public (Home, About, Products, News, FAQ...)
│   │   │   └── admin/             # 3 trang Quản trị Dashboard, Login, 403 Forbidden
│   │   ├── routes/                # Router DOM, ProtectedRoute, Phân quyền RBAC
│   │   ├── services/              # Tầng gọi dữ liệu Firebase RTDB & Gemini AI
│   │   └── utils/                 # Trình nén ảnh WebP, slugify chuẩn SEO, helper
│   ├── index.html                 # HTML Entrypoint
│   ├── vite.config.js             # Cấu hình Vite & build chunk splitting
│   ├── tailwind.config.js         # Design System Tailwind CSS (Custom Color Palette)
│   └── package.json               # Frontend dependencies & build scripts
│
├── scripts/                       # Migration scripts & công cụ bảo trì dữ liệu
│   └── migrate-product-images.js
│
├── .gitignore                     # Cấu hình Git Ignore tiêu chuẩn
├── HOSTINGER_DEPLOY_GUIDE.md      # Hướng dẫn chi tiết triển khai lên Hostinger
├── package.json                   # Root Workspace điều phối lệnh build & dev
├── server.js                      # Root Entry Point cho Hostinger Node.js Web Apps
└── vercel.json                    # Cấu hình triển khai hạ tầng Vercel Production
```

---

## 🚀 Hướng Dẫn Khởi Chạy (Quick Start)

### 1. Cài Đặt Dependencies

```bash
# Cài đặt toàn bộ dependencies cho root và frontend
npm install
```

### 2. Chạy Môi Trường Phát Triển (Development)

```bash
# Khởi chạy giao diện Frontend (Khuyên dùng)
npm run frontend:dev

# Hoặc khởi chạy song song cả Backend và Frontend
npm run dev
```

Truy cập ứng dụng tại: `http://localhost:5173/`

### 3. Build Production

```bash
# Đóng gói và tối ưu hóa mã nguồn Frontend
npm run frontend:build
```

---

## 🌟 Tính Năng Nổi Bật (Key Features)

- **Giao diện Hiện đại & Nhận diện Thương hiệu**: Thiết kế tông màu xanh lá trà (`tea-primary`, `forest`, `leaf`), hỗ trợ chế độ Sáng / Tối (Light & Dark Mode) mượt mà.
- **Card sản phẩm & Dịch vụ sắc nét**: Đường viền và đổ bóng tương phản chuẩn mực, tối ưu hiển thị trên mọi loại màn hình.
- **Hệ thống Quản trị Thời gian thực (Admin Dashboard)**: Quản lý sản phẩm, danh mục, bài viết, công thức pha chế, liên hệ khách hàng thông qua Firebase Realtime Database.
- **Tối ưu SEO Toàn diện**:
  - Hỗ trợ Semantic HTML5, Schema.org (Organization, LocalBusiness, SiteNavigationElement).
  - Tự động sinh `sitemap.xml` và `robots.txt` tối ưu Googlebot.
  - Slug bài viết và sản phẩm thân thiện SEO bằng tiếng Việt không dấu.
- **Đa ngôn ngữ (Multilingual)**: Chuyển đổi nhanh 3 ngôn ngữ: Tiếng Việt (VI), Tiếng Anh (EN), Tiếng Trung (ZH).
- **Zero Trust Security**: Phân quyền 4 cấp độ người dùng (`SUPER_ADMIN`, `ADMIN`, `EDITOR`, `VIEWER`), chống leo thang đặc quyền.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

| Phân hệ | Công nghệ |
| :--- | :--- |
| **Frontend** | React 18, Vite 6, Tailwind CSS, Framer Motion, Lucide Icons |
| **Backend & API** | Node.js, Express, Vercel Serverless Functions |
| **Cơ sở dữ liệu** | Firebase Realtime Database, Cloud Firestore, Firebase Auth |
| **Trí tuệ nhân tạo** | Google Gemini AI (Hỗ trợ viết bài & gợi ý công thức) |
| **Hạ tầng Cloud** | Vercel (Edge Network), Hostinger Web Apps / VPS |

---

## 📄 Bản Quyền & Giấy Phép

© 2026 CASA TEA & FOOD. All rights reserved.
