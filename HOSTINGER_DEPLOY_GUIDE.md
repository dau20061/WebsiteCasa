# HƯỚNG DẪN TRIỂN KHAI WEBSITE CASA LÊN HOSTINGER

Tài liệu này cung cấp hướng dẫn chi tiết từ A - Z để đẩy mã nguồn dự án **CASA TEA & BEVERAGE SOLUTIONS** lên **Hostinger**.

Dự án hiện đã được cấu trúc chuẩn hóa, hỗ trợ cả 2 hình thức hosting phổ biến nhất trên Hostinger:
1. **Cách 1: Hostinger Web Hosting (Shared Hosting / Cloud Hosting / WordPress Hosting)** - Đưa bản dựng tĩnh vào thư mục `public_html` (Nhanh nhất, tiết kiệm, tối ưu SEO & tốc độ LiteSpeed).
2. **Cách 2: Hostinger VPS / Cloud Server (Chạy Node.js & PM2)** - Đưa toàn bộ mã nguồn fullstack chạy dịch vụ Node.js độc lập.
Dự án hiện đã được cấu trúc chuẩn hóa, hỗ trợ 3 hình thức triển khai trên Hostinger:
1. **Cách 1: Hostinger Web Apps (Node.js) - Triển khai tự động bằng Git/GitHub** (Khuyên dùng khi bạn đang ở trang Web Apps trong hPanel).
2. **Cách 2: Hostinger Web Hosting (Shared/Cloud)** - Đưa bản dựng tĩnh vào `public_html`.
3. **Cách 3: Hostinger VPS / Cloud Server** - Chạy độc lập bằng PM2 và Nginx Reverse Proxy.

---

## 📁 CẤU TRÚC THƯ MỤC DỰ ÁN ĐÃ TỐI ƯU CHO HOSTINGER

```text
web_casa/
├── frontend/                     # Mã nguồn giao diện React (Vite, Tailwind, Lucide, Framer Motion)
│   ├── public/                   # Tài nguyên tĩnh
│   │   ├── .htaccess             # File cấu hình LiteSpeed/Apache cho SPA (tránh lỗi 404 khi F5)
│   │   ├── robots.txt            # Cấu hình SEO bot
│   │   └── sitemap.xml           # Sơ đồ trang web
│   ├── src/                      # Source code React components, pages, services
│   ├── dist/                     # THƯ MỤC XUẤT BẢN SAU KHI BUILD (dùng để upload lên public_html)
│   └── package.json
├── backend/                      # Mã nguồn REST API Node.js/Express
│   ├── src/
│   │   ├── routes/               # API Routes (/api/products, /api/news, ...)
│   │   ├── services/             # Firebase Realtime Database & Auth services
│   │   └── server.js             # Express Server chính
│   └── package.json
├── server.js                     # Root Entry Point cho Hostinger Node.js Selector & PM2
├── HOSTINGER_DEPLOY_GUIDE.md     # Tài liệu hướng dẫn này
├── package.json                  # Root package.json điều phối build & start
└── vercel.json                   # Cấu hình dự phòng Vercel (nếu vẫn muốn chạy song song)
```

## 🚀 CÁCH 1: TRIỂN KHAI TỰ ĐỘNG BẰNG GITHUB (HOSTINGER WEB APPS / NODE.JS)

Tính năng này có sẵn trên hPanel tại mục **Trang web** ➔ **Web Apps** (giao diện như ảnh trên màn hình của bạn).

### Các bước thực hiện:

#### Bước 1: Bấm nút "Bắt đầu"
- Tại màn hình **"Triển khai ứng dụng web Node.js trong vài phút"**, bấm vào nút **Bắt đầu**.

#### Bước 2: Kết nối tài khoản GitHub
- Chọn **Kết nối với GitHub** (Connect GitHub).
- Đăng nhập và ủy quyền cho Hostinger truy cập vào kho mã nguồn GitHub của bạn.

#### Bước 3: Chọn Kho lưu trữ (Repository) & Nhánh (Branch)
- **Repository**: Chọn `dau20061/WebsiteCasa` (hoặc tên repo GitHub của bạn).
- **Branch**: Chọn `main`.

#### Bước 4: Cấu hình Thiết lập Ứng dụng (Build & Deployment Settings)
Hostinger sẽ hiển thị bảng cấu hình:
- **Tên ứng dụng / App Name**: Đặt tên bất kỳ (ví dụ: `casa-tea`).
- **Thư mục gốc (Root Directory)**: Để trống hoặc `./` (thư mục gốc của repository).
- **Phiên bản Node.js (Node.js Version)**: Chọn phiên bản `20.x` hoặc `18.x` (LTS).
- **Lệnh cài đặt (Install Command)**: `npm install`
  *(Nhờ cấu hình `postinstall` có sẵn, hệ thống sẽ tự động cài đặt cả thư viện gốc và thư viện frontend)*.
- **Lệnh build (Build Command)**: `npm run build`
  *(Tự động biên dịch mã nguồn React và xuất ra thư mục `frontend/dist`)*.
- **Lệnh khởi động (Start Command)**: `npm start`
  *(Khởi chạy `node server.js` - Express Server đã tích hợp sẵn để tự động phục vụ API `/api/*` và giao diện React)*.
- **Cổng (Port)**: Hostinger tự động gán biến `$PORT` hoặc bạn có thể điền `5000`.

#### Bước 5: Biến môi trường (Environment Variables) - Tùy chọn
- Thêm các biến môi trường cần thiết nếu có (như `NODE_ENV=production`).

#### Bước 6: Bấm nút "Triển khai" (Deploy)
- Bấm **Deploy**. Hostinger sẽ tự động clone code, chạy build và đưa website lên hoạt động.
- **Ưu điểm lớn nhất**: Mỗi khi bạn thực hiện `git push` lên nhánh `main`, Hostinger sẽ **tự động cập nhật phiên bản mới ngay lập tức**!

---

## 🚀 CÁCH 1: TRIỂN KHAI LÊN HOSTINGER WEB HOSTING (KHUYÊN DÙNG - ĐƠN GIẢN NHẤT)
## 📁 CÁCH 2: TRIỂN KHAI LÊN HOSTINGER WEB HOSTING (UPLOAD TỆP DIST VÀO PUBLIC_HTML)

Áp dụng cho các gói: **Single/Premium/Business Web Hosting** hoặc **Cloud Startup/Professional** sử dụng bảng điều khiển **hPanel**.

> **Ưu điểm:** Tận dụng tối đa LiteSpeed Web Server, CDN miễn phí của Hostinger, chi phí tối ưu, tự động cấp SSL miễn phí, không tốn tài nguyên RAM của server. Frontend đã tích hợp sẵn kết nối Firebase Realtime Database trực tiếp qua REST API nên toàn bộ chức năng (sản phẩm, danh mục, tin tức, FAQ, liên hệ) đều hoạt động 100% không cần chạy Node backend riêng.

### Bước 1: Build mã nguồn trên máy tính
Mở terminal tại thư mục gốc của dự án (`e:\web_casa`) và chạy lệnh:
```bash
npm run build
```
Lệnh này sẽ biên dịch toàn bộ mã nguồn React và đóng gói vào thư mục:
👉 `e:\web_casa\frontend\dist\`

> **Lưu ý quan trọng:** File `frontend/public/.htaccess` sẽ tự động được copy vào `frontend/dist/.htaccess`. File này chứa quy tắc rewrite URL giúp bạn truy cập trực tiếp hoặc tải lại trang (F5) ở các đường dẫn như `/products`, `/news`, `/contact`, `/cart` mà không bao giờ bị lỗi **404 Not Found**.

### Bước 2: Nén thư mục dist thành file ZIP
1. Truy cập vào thư mục `frontend/dist/`.
2. Chọn tất cả các file bên trong (`index.html`, thư mục `assets/`, `.htaccess`, v.v.).
3. Nhấp chuột phải chọn **Compress to ZIP file** (hoặc dùng WinRAR/7-Zip nén lại thành file ví dụ `dist.zip`).

### Bước 3: Upload lên Hostinger hPanel
1. Đăng nhập vào tài khoản [Hostinger hPanel](https://hpanel.hostinger.com/).
2. Chọn trang web bạn muốn cài đặt, nhấp vào **Quản lý (Manage)**.
3. Trong thanh tìm kiếm bên trái hoặc mục **Tệp (Files)**, chọn **Trình quản lý tệp (File Manager)** -> Chọn **Truy cập vào tệp của [Tên miền của bạn]**.
4. Mở thư mục **`public_html`**.
5. Nếu trong `public_html` có file `default.php` mặc định của Hostinger, hãy xóa file đó đi.
6. Nhấp vào nút **Tải lên (Upload)** ở góc trên bên phải -> Chọn **Tệp (File)** -> Chọn file `dist.zip` đã nén ở Bước 2.
7. Sau khi tải lên xong, nhấp chuột phải vào `dist.zip` -> Chọn **Giải nén (Extract)** -> Nhập dấu chấm `.` để giải nén ngay tại thư mục hiện tại (`public_html`).
8. Xóa file `dist.zip` đi cho gọn.

### Bước 4: Kiểm tra kết quả
- Truy cập tên miền của bạn (ví dụ: `https://yourdomain.com`).
- Bấm thử vào các liên kết: Sản phẩm, Tin tức, Giới thiệu.
- Thử bấm **F5 (Reload)** tại một trang bất kỳ như `https://yourdomain.com/products` để kiểm tra: Trang phải hiển thị mượt mà, không gặp lỗi 404 nhờ cấu hình `.htaccess` sẵn có.

---

## ⚡ CÁCH 2: TRIỂN KHAI FULLSTACK BẰNG HOSTINGER NODE.JS APPLICATION HOẶC VPS

Áp dụng nếu gói hosting của bạn hỗ trợ tính năng **Node.js** trong hPanel hoặc bạn đang sử dụng **Hostinger VPS (Ubuntu/Debian)**.

### Tùy chọn A: Sử dụng tính năng "Node.js" trên hPanel (nếu gói có hỗ trợ)

1. **Upload toàn bộ mã nguồn dự án:**
   - Nén toàn bộ thư mục `web_casa` (loại trừ thư mục `node_modules` và `.git` để giảm dung lượng file).
   - Tải lên thư mục gốc của tài khoản hosting (hoặc thư mục ứng dụng chỉ định).
   - Giải nén mã nguồn.
2. **Cài đặt Node.js Application:**
   - Trong hPanel, tìm tính năng **Node.js**.
   - **Node.js version**: Chọn phiên bản `20.x` hoặc `18.x` (LTS).
   - **Application root**: Điền đường dẫn thư mục vừa giải nén (ví dụ `/home/u123456789/web_casa`).
   - **Application startup file**: Điền `server.js` (dự án đã tạo sẵn file `server.js` ở thư mục gốc).
   - **Application URL**: Chọn tên miền của bạn.
3. **Cài đặt dependencies và build:**
   - Trong giao diện Node.js của hPanel, nhấp vào nút **NPM Install**.
   - Hoặc mở **Terminal / SSH** trong hPanel, chạy các lệnh:
     ```bash
     npm install
     npm --prefix frontend install
     npm run build
     ```
4. **Khởi động ứng dụng:**
   - Nhấp vào nút **Restart** hoặc **Start Application**.
   - Ứng dụng Express sẽ tự động phục vụ cả các API tại `/api/*` và giao diện React từ thư mục `frontend/dist`.

---

### Tùy chọn B: Sử dụng Hostinger VPS (Khuyên dùng cho người có kiến thức quản trị máy chủ)

#### 1. Kết nối SSH vào VPS:
```bash
ssh root@<IP_VPS_CUA_BAN>
```

#### 2. Cài đặt Node.js & PM2 & Git (nếu chưa có):
```bash
# Cài đặt Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs git

# Cài đặt PM2 để quản lý tiến trình nền
sudo npm install -g pm2
```

#### 3. Clone mã nguồn từ GitHub:
```bash
cd /var/www
git clone https://github.com/dau20061/WebsiteCasa.git
cd WebsiteCasa
```

#### 4. Cài đặt thư viện và build:
```bash
npm install
npm --prefix frontend install
npm run build
```

#### 5. Cấu hình biến môi trường:
Tạo file `.env` tại thư mục gốc:
```bash
nano .env
```
Dán các thông tin cấu hình Firebase / PORT (ví dụ `PORT=5000`), sau đó lưu lại (`Ctrl + O`, `Enter`, `Ctrl + X`).

#### 6. Chạy ứng dụng với PM2:
```bash
pm2 start server.js --name "casa-website"
pm2 save
pm2 startup
```

#### 7. Cấu hình Nginx làm Reverse Proxy và cấp SSL miễn phí:
```bash
sudo apt install nginx certbot python3-certbot-nginx -y
```

Mở file cấu hình Nginx:
```bash
sudo nano /etc/nginx/sites-available/casa
```
Dán nội dung sau (thay `yourdomain.com` bằng tên miền thực tế):
```nginx
server {
    server_name yourdomain.com www.yourdomain.com;

    location / {
        proxy_pass http://localhost:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Kích hoạt cấu hình và cấp chứng chỉ SSL Let's Encrypt:
```bash
sudo ln -s /etc/nginx/sites-available/casa /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

---

## 🔍 KIỂM TRA VÀ XỬ LÝ LỖI THƯỜNG GẶP

1. **Lỗi 404 khi bấm F5 tải lại trang (chỉ gặp trên Shared Hosting):**
   - Đảm bảo file `.htaccess` nằm cùng cấp với file `index.html` trong thư mục `public_html`.
   - Nội dung file `.htaccess` phải có quy tắc:
     ```apache
     <IfModule mod_rewrite.c>
       RewriteEngine On
       RewriteBase /
       RewriteRule ^index\.html$ - [L]
       RewriteCond %{REQUEST_FILENAME} !-f
       RewriteCond %{REQUEST_FILENAME} !-d
       RewriteRule . /index.html [L]
     </IfModule>
     ```

2. **Hình ảnh sản phẩm hoặc logo không tải được:**
   - Kiểm tra các đường dẫn hình ảnh đã sử dụng link Firebase Storage hoặc link tương đối chính xác.

3. **Cần cập nhật nội dung web sau này:**
   - Mỗi lần sửa code giao diện: Chạy `npm run build` trên máy -> nén thư mục `frontend/dist/` -> upload đè lên `public_html` trên hPanel.

