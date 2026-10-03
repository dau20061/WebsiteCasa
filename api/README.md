# ⚡ CASA TEA & FOOD – Serverless API Endpoints

Thư mục chứa các hàm **Vercel Serverless Functions**, đảm nhiệm vai trò cung cấp REST API công khai và stream dữ liệu hình ảnh trực tiếp.

---

## 📁 Danh Sách Endpoints

| File | Đường dẫn API | Chức năng |
| :--- | :--- | :--- |
| `[...path].js` | `/api/*` | Dynamic router điều phối các yêu cầu API |
| `article-image.js` | `/article-image/:slug.webp` | Stream ảnh bài viết định dạng WebP trực tiếp từ RTDB |
| `categories.js` | `/api/categories` | Lấy danh sách danh mục nguyên liệu theo thời gian thực |
| `news.js` | `/api/news` | Lấy danh sách bài viết và chi tiết tin tức |
| `product-image.js` | `/product-image/:slug.webp` | Stream ảnh sản phẩm định dạng WebP trực tiếp từ RTDB |
| `products.js` | `/api/products` | Lấy danh sách sản phẩm và hỗ trợ lọc danh mục |
| `sitemap.js` | `/sitemap.xml` | Tự động sinh XML Sitemap cho Google Search Console |
