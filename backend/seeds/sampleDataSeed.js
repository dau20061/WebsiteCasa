/**
 * ============================================================================
 * CASA TEA - FIRESTORE INITIAL DATABASE SCHEMA & SEED DATA TEMPLATES
 * Dùng làm tài liệu tham chiếu cấu trúc tài liệu (Schema) cho Firestore
 * ============================================================================
 */

export const INITIAL_SUPER_ADMIN_SCHEMA = {
  // Document path: users/{FIREBASE_AUTH_UID}
  uid: "PASTE_YOUR_FIREBASE_AUTH_UID_HERE",
  email: "admin@casatea.vn",
  displayName: "Tổng Quản Trị Hệ Thống",
  role: "SUPER_ADMIN", // Bắt buộc: SUPER_ADMIN | ADMIN | EDITOR | VIEWER
  status: "ACTIVE",    // Bắt buộc: ACTIVE | INACTIVE | SUSPENDED
  createdAt: new Date(),
  updatedAt: new Date()
};

export const SAMPLE_PRODUCT_SCHEMA = {
  // Document path: products/{productId}
  sku: "CS-BLK-01",
  name: "Trà Đen Assam Thượng Hạng CASA No.1",
  category: "tra-den",
  categoryName: "Trà Đen",
  status: "PUBLISHED", // Bắt buộc: PUBLISHED (cho public đọc) | DRAFT | ARCHIVED
  badge: "Best Seller Trà Sữa",
  shortDesc: "Hương thơm mạch nha nồng nàn, vị chát đầm ấm và hậu vị ngọt sâu.",
  fullDesc: "Tuyển chọn từ những búp trà chất lượng cao vùng cao nguyên Bảo Lộc...",
  origin: "Vùng cao nguyên Bảo Lộc, Lâm Đồng",
  tasteProfile: {
    aroma: 92,
    body: 95,
    sweetness: 80,
    color: "Đỏ Ruby Ánh Cam"
  },
  applications: [
    "Trà sữa truyền thống Đài Loan",
    "Hồng trà kem cheese Macchiato"
  ],
  packaging: [
    "Gói nhôm 1kg (10 gói/thùng)",
    "Bao 25kg xuất khẩu"
  ],
  shelfLife: "24 tháng",
  storage: "Bảo quản nơi khô ráo, thoáng mát dưới 25°C",
  createdAt: new Date(),
  updatedAt: new Date()
};

export const SAMPLE_CONTACT_SCHEMA = {
  // Document path: contacts/{contactId}
  name: "Trần Anh Tuấn",
  company: "Chuỗi Trà Sữa Mộc Trà",
  phone: "0988 123 456",
  email: "tuan.tran@moctra.vn",
  subject: "Đăng ký tư vấn B2B & Nhận mẫu thử",
  message: "Tôi muốn nhận mẫu thử dòng Trà Ô Long Nướng và Trà Đen Assam.",
  businessType: "Chuỗi trà sữa (Nhiều chi nhánh)",
  productInterest: "Trà Ô Long Nướng, Trà Đen Assam",
  requestSample: true,
  status: "NEW", // Bắt buộc: NEW (khi Public tạo) | CONTACTED | COMPLETED | CANCELLED
  source: "Website Public Form",
  createdAt: new Date(),
  updatedAt: new Date()
};

export const SAMPLE_SITE_SETTINGS_SCHEMA = {
  // Document path: siteContent/settings
  companyName: "CASA TEA & BEVERAGE SOLUTIONS",
  hotline: "1900 88 66 33",
  salesEmail: "kinhdoanh@casatea.vn",
  headquarters: "Tòa nhà CASA Innovation Center, Số 88 Đường Song Hành, An Phú, TP. Thủ Đức",
  factory: "KCN Lộc Sơn, TP. Bảo Lộc, Lâm Đồng",
  workingHours: "Thứ 2 – Thứ 7: 08:00 – 17:30",
  socials: {
    facebook: "https://facebook.com/casatea.vn",
    zalo: "https://zalo.me/casatea"
  }
};
