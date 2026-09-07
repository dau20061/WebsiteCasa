// ============================================================================
// CASA TEA - UI CATEGORIES & PROCESS CONSTANTS
// Danh mục bộ lọc hiển thị giao diện và các bước quy trình sản xuất
// ============================================================================

export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'Tất cả sản phẩm', count: 12 },
  { id: 'tra-den', name: 'Trà Đen (Black Tea)', count: 3 },
  { id: 'tra-oolong', name: 'Trà Ô Long (Oolong)', count: 3 },
  { id: 'tra-lai-xanh', name: 'Trà Lài & Trà Xanh', count: 2 },
  { id: 'tra-rang', name: 'Trà Rang & Hojicha', count: 2 },
  { id: 'tra-trai-cay', name: 'Nền Trà Trái Cây', count: 2 },
  { id: 'bot-pha-che', name: 'Bột Pha Chế & Topping', count: 2 },
];

export const NEWS_CATEGORIES = [
  { id: 'all', name: 'Tất cả bài viết', nameZh: '全部文章' },
  { id: 'xu-huong', name: 'Xu Hướng Đồ Uống', nameZh: '飲品市場趨勢' },
  { id: 'cong-thuc', name: 'Công Thức Pha Chế', nameZh: '調飲專業配方' },
  { id: 'kien-thuc-tra', name: 'Kiến Thức Trà & R&D', nameZh: '製茶與研發知識' },
  { id: 'tin-cong-ty', name: 'Tin Tức Công Ty & Sự Kiện', nameZh: '企業最新動態' },
];

export const FAQ_CATEGORIES = [
  { id: 'all', name: 'Tất cả câu hỏi' },
  { id: 'san-pham', name: 'Sản Phẩm & Nguồn Gốc' },
  { id: 'pha-che-rd', name: 'R&D & Hỗ Trợ Công Thức' },
  { id: 'dat-hang-moq', name: 'Đặt Hàng, MOQ & Giao Hàng' },
  { id: 'oem-odm', name: 'Gia Công OEM/ODM & Đại Lý' },
];

export const PRODUCTION_STEPS = [
  {
    step: '01',
    title: 'Tuyển Chọn & Thu Hái Búp Non',
    titleZh: '鮮葉精選與清晨採摘',
    subtitle: 'Nguồn Nguyên Liệu Chuẩn VietGAP',
    subtitleZh: 'VietGAP 標準高山契作茶園',
    desc: 'Búp trà tươi được thu hoạch theo quy chuẩn 1 tôm 2 lá vào sáng sớm khi sương vừa tan tại các nông trường liên kết ở độ cao trên 1.000m. Lá trà tươi được vận chuyển nhanh về xưởng trong vòng 3 giờ bằng xe chuyên dụng thông gió để giữ nguyên độ tươi mới.',
    descZh: '清晨朝露初散時，採摘海拔 1,000 公尺以上契作茶園之一心二葉優質嫩芽。鮮葉於 3 小時內由專用通風專車直送工廠，確保原料極致新鮮活性。',
    highlight: '100% kiểm tra dư lượng thuốc BVTV trước khi thu mua',
    highlightZh: '100% 收購前即時農藥殘留快篩',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1000&q=80',
    stats: '1.200 Hecta vùng nguyên liệu',
    statsZh: '1,200 公頃契作高山茶園',
  },
  {
    step: '02',
    title: 'Sàng Lọc Quang Học Sortex',
    titleZh: 'Sortex 光學智能色選',
    subtitle: 'Công Nghệ Tách Tạp Chất Camera Đa Điểm',
    subtitleZh: '多光譜相機精準異物剔除技術',
    desc: 'Trà thô được đưa qua hệ thống máy tách màu quang học cao cấp sử dụng camera hồng ngoại và trí tuệ nhân tạo nhận diện. Từng cọng cuống già, lá úa hoặc dị vật dù nhỏ hơn 0.5mm đều bị luồng khí nén tốc độ cao thổi bay chính xác tuyệt đối.',
    descZh: '初製毛茶進入高階光學色選系統，透過紅外線光譜與 AI 視覺辨識。老梗、黃葉、甚至小於 0.5mm 的微細雜質皆被超音速氣壓噴射閥精準吹除。',
    highlight: 'Độ tinh sạch nguyên liệu đạt 99.98%',
    highlightZh: '原料精細純淨度高達 99.98%',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
    stats: 'Tốc độ sàng lọc 1.5 Tấn / Giờ',
    statsZh: '色選產能 1.5 噸 / 小時',
  },
  {
    step: '03',
    title: 'Lên Men & Sao Sấy Tầng Sôi',
    titleZh: '控溫發酵與流化床熱風烘焙',
    subtitle: 'Kiểm Soát Vi Khí Hậu & Nhiệt Động Lực',
    subtitleZh: '智慧微氣候與熱動力精密溫控',
    desc: 'Phòng lên men vi khí hậu kiểm soát chuẩn xác từng 0.5°C nhiệt độ và 1% độ ẩm. Tiếp sau đó là hệ thống sấy tầng sôi động lực học tuần hoàn khí nóng đa cấp, giúp làm khô lá trà đều từ trong lõi mà không làm cháy mép lá, khóa chặt hương mạch nha và hương hoa quý giá.',
    descZh: '微氣候發酵室精密控制每 0.5°C 溫度與 1% 相對濕度。隨後進入多級熱風循環流化床，由內而外溫和均勻透乾，鎖住醇厚麥芽香與高雅花香。',
    highlight: 'Hệ thống điều khiển trung tâm SCADA tự động hóa',
    highlightZh: 'SCADA 全自動中控系統精準監測',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    stats: 'Dung sai nhiệt độ kiểm soát ± 0.5°C',
    statsZh: '溫度精密控制容差 ± 0.5°C',
  },
  {
    step: '04',
    title: 'Phối Trộn Chuẩn Hóa Hương Vị',
    titleZh: '多維立體均質拼配',
    subtitle: 'Đảm Bảo 1000 Lô Như Một Cả Năm',
    subtitleZh: '確保全年千批次風味始終如一',
    desc: 'Máy trộn xoay lập phương đa chiều inox SUS 304 tiêu chuẩn dược phẩm nhẹ nhàng đồng nhất các mẻ trà mà không làm gãy vụn cánh trà. Đây là khâu then chốt giúp các chuỗi trà sữa yên tâm tuyệt đối về sự đồng đều vị trà dù pha ở bất cứ cửa hàng nào vào bất kỳ thời điểm nào trong năm.',
    descZh: '醫藥級 SUS 304 不鏽鋼三維立體混料機，溫和均質各批次茶葉而不破壞嫩葉完整性。這是確保各大手搖茶飲連鎖門市全年風味零偏差的核心基石。',
    highlight: 'Độ đồng đều hương vị giữa các lô đạt > 98%',
    highlightZh: '跨批次風味穩定一致性 > 98%',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1000&q=80',
    stats: 'Mẻ trộn công suất 2.000kg / Mẻ',
    statsZh: '單批混料產能 2,000 公斤 / 批',
  },
  {
    step: '05',
    title: 'Đóng Gói Vô Trùng & Lưu Mẫu QC',
    titleZh: '無菌充氮包裝與 QC 樣品留存',
    subtitle: 'Màng Nhôm 3 Lớp Kháng Ẩm Tuyệt Đối',
    subtitleZh: '三層複合鋁箔阻隔防潮鎖鮮',
    desc: 'Quy trình đóng gói diễn ra trong phòng sạch áp lực dương tiêu chuẩn Class 100.000. Máy định lượng tự động chiết rót khí nitơ trơ và hàn miệng túi chân không màng nhôm composite 3 lớp. Mỗi lô hàng đều được trích xuất 500g lưu trữ tại kho mẫu đối chứng trong suốt 24 tháng hạn sử dụng.',
    descZh: '於 Class 100.000 正壓無菌潔淨室進行全自動計量包裝、抽真空並充填高純度惰性氮氣 (N2)。每批出廠茶葉均抽取 500g 樣品，於對照樣品庫留樣 24 個月。',
    highlight: 'Phòng sạch Class 100.000 – Đóng gói khí trơ N2',
    highlightZh: 'Class 100.000 潔淨無菌車間 – 惰性 N2 充氮保鮮',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
    stats: 'Lưu mẫu kiểm nghiệm 24 Tháng',
    statsZh: '留樣追溯保存 24 個月',
  },
];

export const QC_PILLARS = [
  {
    code: 'GATE 01',
    title: 'Kiểm soát nguyên liệu đầu vào',
    desc: 'Test nhanh dư lượng tại chỗ và gửi mẫu định kỳ sang trung tâm kiểm nghiệm Eurofins / Quatest 3.'
  },
  {
    code: 'GATE 02',
    title: 'Giám sát bán thành phẩm Online',
    desc: 'Cảm biến IoT đo nhiệt độ, độ ẩm và thông số mẻ sấy truyền dữ liệu liên tục về máy chủ SCADA.'
  },
  {
    code: 'GATE 03',
    title: 'Blind Cupping Thử Nếm Lô Hàng',
    desc: 'Hội đồng chuyên gia thử nếm mù cốt trà theo bảng điểm 5 tiêu chí: Sắc nước, Hương thơm, Độ đầm, Hậu vị, Vị chát.'
  },
  {
    code: 'GATE 04',
    title: 'Kiểm tra bao bì & độ kín mối hàn',
    desc: 'Thử nghiệm áp lực hút chân không và độ bền màng túi trong bồn thử nghiệm kín.'
  },
  {
    code: 'GATE 05',
    title: 'Lưu mẫu đối chứng & Truy xuất nguồn gốc',
    desc: 'Mỗi gói hàng gắn mã QR Code duy nhất truy xuất nông trường thu hái, ngày sao chế và nhân sự phụ trách.'
  }
];
