// ============================================================================
// CASA TEA - UI CATEGORIES & PROCESS CONSTANTS
// Danh mục bộ lọc hiển thị giao diện và các bước quy trình sản xuất
// ============================================================================

export const PRODUCT_CATEGORIES = [
  { id: 'all', name: 'Tất cả sản phẩm', nameZh: '全部產品', nameEn: 'All Products', count: 12 },
  { id: 'tra-den', name: 'Trà Đen (Black Tea)', nameZh: '商用紅茶系列', nameEn: 'Black Tea Series', count: 3 },
  { id: 'tra-oolong', name: 'Trà Ô Long (Oolong)', nameZh: '高山烏龍系列', nameEn: 'Oolong Tea Series', count: 3 },
  { id: 'tra-lai-xanh', name: 'Trà Lài & Trà Xanh', nameZh: '茉莉綠茶系列', nameEn: 'Jasmine & Green Tea', count: 2 },
  { id: 'tra-rang', name: 'Trà Rang & Hojicha', nameZh: '烘焙焙茶系列', nameEn: 'Roasted Tea & Hojicha', count: 2 },
  { id: 'tra-trai-cay', name: 'Nền Trà Trái Cây', nameZh: '特調果茶茶湯底', nameEn: 'Fruit Tea Base Series', count: 2 },
  { id: 'bot-pha-che', name: 'Bột Pha Chế & Topping', nameZh: '專用調配粉末原料', nameEn: 'Beverage Powders & Mixes', count: 2 },
];

export const NEWS_CATEGORIES = [
  { id: 'all', name: 'Tất cả bài viết', nameZh: '全部文章', nameEn: 'All Articles' },
  { id: 'xu-huong', name: 'Xu Hướng Đồ Uống', nameZh: '飲品市場趨勢', nameEn: 'Beverage Trends' },
  { id: 'cong-thuc', name: 'Công Thức Pha Chế', nameZh: '調飲專業配方', nameEn: 'Barista Recipes' },
  { id: 'kien-thuc-tra', name: 'Kiến Thức Trà & R&D', nameZh: '製茶與研發知識', nameEn: 'Tea R&D Insights' },
  { id: 'tin-cong-ty', name: 'Tin Tức Công Ty & Sự Kiện', nameZh: '企業最新動態', nameEn: 'Corporate News' },
];

export const FAQ_CATEGORIES = [
  { id: 'all', name: 'Tất cả câu hỏi', nameZh: '全部問題', nameEn: 'All Questions' },
  { id: 'san-pham', name: 'Sản Phẩm & Nguồn Gốc', nameZh: '產品系列與原產地', nameEn: 'Products & Origin' },
  { id: 'pha-che-rd', name: 'R&D & Hỗ Trợ Công Thức', nameZh: '研發諮詢與調配支援', nameEn: 'R&D & Recipe Support' },
  { id: 'dat-hang-moq', name: 'Đặt Hàng, MOQ & Giao Hàng', nameZh: '採購起訂量與物流配送', nameEn: 'Orders, MOQ & Shipping' },
  { id: 'oem-odm', name: 'Gia Công OEM/ODM & Đại Lý', nameZh: '代工定制與經銷加盟', nameEn: 'OEM/ODM & Distributorship' },
];

export const PRODUCTION_STEPS = [
  {
    step: '01',
    title: 'Tuyển Chọn & Thu Hái Búp Non',
    titleZh: '鮮葉精選與清晨採摘',
    titleEn: 'Fresh Leaf Selection & Dawn Harvesting',
    subtitle: 'Nguồn Nguyên Liệu Chuẩn VietGAP',
    subtitleZh: 'VietGAP 標準高山契作茶園',
    subtitleEn: 'VietGAP High-Elevation Contracted Plantations',
    desc: 'Búp trà tươi được thu hoạch theo quy chuẩn 1 tôm 2 lá vào sáng sớm khi sương vừa tan tại các nông trường liên kết ở độ cao trên 1.000m. Lá trà tươi được vận chuyển nhanh về xưởng trong vòng 3 giờ bằng xe chuyên dụng thông gió để giữ nguyên độ tươi mới.',
    descZh: '清晨朝露初散時，採摘海拔 1,000 公尺以上契作茶園之一心二葉優質嫩芽。鮮葉於 3 小時內由專用通風專車直送工廠，確保原料極致新鮮活性。',
    descEn: 'Fresh tea leaves are hand-picked at the standard of 1 bud and 2 tender leaves at dawn across contracted tea gardens at elevations exceeding 1,000m. Harvested leaves are transported to the processing facility within 3 hours via ventilated vehicles to lock in fresh vegetal vitality.',
    highlight: '100% kiểm tra dư lượng thuốc BVTV trước khi thu mua',
    highlightZh: '100% 收購前即時農藥殘留快篩',
    highlightEn: '100% pre-procurement pesticide residue rapid screening',
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1000&q=80',
    stats: '1.200 Hecta vùng nguyên liệu',
    statsZh: '1,200 公頃契作高山茶園',
    statsEn: '1,200 Hectares of Contracted Tea Gardens',
  },
  {
    step: '02',
    title: 'Sàng Lọc Quang Học Sortex',
    titleZh: 'Sortex 光學智能色選',
    titleEn: 'Sortex Optical & Color Sorting',
    subtitle: 'Công Nghệ Tách Tạp Chất Camera Đa Điểm',
    subtitleZh: '多光譜相機精準異物剔除技術',
    subtitleEn: 'Multi-Spectral AI Foreign Matter Ejection',
    desc: 'Trà thô được đưa qua hệ thống máy tách màu quang học cao cấp sử dụng camera hồng ngoại và trí tuệ nhân tạo nhận diện. Từng cọng cuống già, lá úa hoặc dị vật dù nhỏ hơn 0.5mm đều bị luồng khí nén tốc độ cao thổi bay chính xác tuyệt đối.',
    descZh: '初製毛茶進入高階光學色選系統，透過紅外線光譜與 AI 視覺辨識。老梗、黃葉、甚至小於 0.5mm 的微細雜質皆被超音速氣壓噴射閥精準吹除。',
    descEn: 'Raw tea batches pass through state-of-the-art optical color sorters equipped with infrared cameras and AI vision. Coarse stalks, discolored leaves, and foreign matter smaller than 0.5mm are ejected by supersonic air pulses with absolute precision.',
    highlight: 'Độ tinh sạch nguyên liệu đạt 99.98%',
    highlightZh: '原料精細純淨度高達 99.98%',
    highlightEn: 'Ingredient purity rate up to 99.98%',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1000&q=80',
    stats: 'Tốc độ sàng lọc 1.5 Tấn / Giờ',
    statsZh: '色選產能 1.5 噸 / 小時',
    statsEn: 'Sorting Capacity: 1.5 Tons / Hour',
  },
  {
    step: '03',
    title: 'Lên Men & Sao Sấy Tầng Sôi',
    titleZh: '控溫發酵與流化床熱風烘焙',
    titleEn: 'Precision Fermentation & Fluidized Bed Drying',
    subtitle: 'Kiểm Soát Vi Khí Hậu & Nhiệt Động Lực',
    subtitleZh: '智慧微氣候與熱動力精密溫控',
    subtitleEn: 'Microclimate & Aerodynamic Heat Control',
    desc: 'Phòng lên men vi khí hậu kiểm soát chuẩn xác từng 0.5°C nhiệt độ và 1% độ ẩm. Tiếp sau đó là hệ thống sấy tầng sôi động lực học tuần hoàn khí nóng đa cấp, giúp làm khô lá trà đều từ trong lõi mà không làm cháy mép lá, khóa chặt hương mạch nha và hương hoa quý giá.',
    descZh: '微氣候發酵室精密控制每 0.5°C 溫度與 1% 相對濕度。隨後進入多級熱風循環流化床，由內而外溫和均勻透乾，鎖住醇厚麥芽香與高雅花香。',
    descEn: 'Microclimate fermentation rooms maintain temperature within ±0.5°C and relative humidity within 1%. Leaves then enter multi-stage fluidized bed drying systems, evenly dehydrating from the core without scorching the leaf edges, sealing in rich malty notes and delicate floral aromatics.',
    highlight: 'Hệ thống điều khiển trung tâm SCADA tự động hóa',
    highlightZh: 'SCADA 全自動中控系統精準監測',
    highlightEn: 'Fully automated central SCADA monitoring system',
    image: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=1000&q=80',
    stats: 'Dung sai nhiệt độ kiểm soát ± 0.5°C',
    statsZh: '溫度精密控制容差 ± 0.5°C',
    statsEn: 'Temperature Precision: ±0.5°C Tolerance',
  },
  {
    step: '04',
    title: 'Phối Trộn Chuẩn Hóa Hương Vị',
    titleZh: '多維立體均質拼配',
    titleEn: 'Multi-Dimensional Homogeneous Blending',
    subtitle: 'Đảm Bảo 1000 Lô Như Một Cả Năm',
    subtitleZh: '確保全年千批次風味始終如一',
    subtitleEn: '1,000 Batches of Uniform Consistency Year-Round',
    desc: 'Máy trộn xoay lập phương đa chiều inox SUS 304 tiêu chuẩn dược phẩm nhẹ nhàng đồng nhất các mẻ trà mà không làm gãy vụn cánh trà. Đây là khâu then chốt giúp các chuỗi trà sữa yên tâm tuyệt đối về sự đồng đều vị trà dù pha ở bất cứ cửa hàng nào vào bất kỳ thời điểm nào trong năm.',
    descZh: '醫藥級 SUS 304 不鏽鋼三維立體混料機，溫和均質各批次茶葉而不破壞嫩葉完整性。這是確保各大手搖茶飲連鎖門市全年風味零偏差的核心基石。',
    descEn: 'Pharmaceutical-grade SUS 304 stainless steel multi-dimensional rotary blenders gently homogenize master tea batches without crushing leaf structure. This ensures tea beverage chains achieve zero flavor variance across all outlets throughout all four seasons.',
    highlight: 'Độ đồng đều hương vị giữa các lô đạt > 98%',
    highlightZh: '跨批次風味穩定一致性 > 98%',
    highlightEn: 'Cross-batch flavor consistency > 98%',
    image: 'https://images.unsplash.com/photo-1587293852726-70cdb56c2866?auto=format&fit=crop&w=1000&q=80',
    stats: 'Mẻ trộn công suất 2.000kg / Mẻ',
    statsZh: '單批混料產能 2,000 公斤 / 批',
    statsEn: 'Batch Blending Capacity: 2,000 kg / Batch',
  },
  {
    step: '05',
    title: 'Đóng Gói Vô Trùng & Lưu Mẫu QC',
    titleZh: '無菌充氮包裝與 QC 樣品留存',
    titleEn: 'Aseptic Nitrogen Packaging & Retention Samples',
    subtitle: 'Màng Nhôm 3 Lớp Kháng Ẩm Tuyệt Đối',
    subtitleZh: '三層複合鋁箔阻隔防潮鎖鮮',
    subtitleEn: '3-Layer Composite Foil for Complete Moisture Barrier',
    desc: 'Quy trình đóng gói diễn ra trong phòng sạch áp lực dương tiêu chuẩn Class 100.000. Máy định lượng tự động chiết rót khí nitơ trơ và hàn miệng túi chân không màng nhôm composite 3 lớp. Mỗi lô hàng đều được trích xuất 500g lưu trữ tại kho mẫu đối chứng trong suốt 24 tháng hạn sử dụng.',
    descZh: '於 Class 100.000 正壓無菌潔淨室進行全自動計量包裝、抽真空並充填高純度惰性氮氣 (N2)。每批出廠茶葉均抽取 500g 樣品，於對照樣品庫留樣 24 個月。',
    descEn: 'Packaging takes place in Class 100,000 positive-pressure clean rooms with automated dosing, inert nitrogen (N2) flushing, and hermetic vacuum sealing inside 3-ply composite aluminum barrier bags. A 500g control sample from every batch is archived in retention storage for the full 24-month shelf life.',
    highlight: 'Phòng sạch Class 100.000 – Đóng gói khí trơ N2',
    highlightZh: 'Class 100.000 潔淨無菌車間 – 惰性 N2 充氮保鮮',
    highlightEn: 'Class 100,000 Clean Room – Inert N2 Nitrogen Sealing',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1000&q=80',
    stats: 'Lưu mẫu kiểm nghiệm 24 Tháng',
    statsZh: '留樣追溯保存 24 個月',
    statsEn: 'QC Retention Archive: 24 Months Traceability',
  },
];

export const QC_PILLARS = [
  {
    code: 'GATE 01',
    title: 'Kiểm soát nguyên liệu đầu vào',
    titleZh: '原料進廠嚴格質檢',
    titleEn: 'Raw Material Inbound Inspection',
    desc: 'Test nhanh dư lượng tại chỗ và gửi mẫu định kỳ sang trung tâm kiểm nghiệm Eurofins / Quatest 3.',
    descZh: '進廠即刻進行農藥殘留快篩，並定期送檢 Eurofins 及 Quatest 3 國家級權威實驗室。',
    descEn: 'Rapid on-site pesticide residue screening and periodic verification at accredited third-party labs Eurofins / Quatest 3.'
  },
  {
    code: 'GATE 02',
    title: 'Giám sát bán thành phẩm Online',
    titleZh: '在製品在線即時監控',
    titleEn: 'In-Process Real-Time Monitoring',
    desc: 'Cảm biến IoT đo nhiệt độ, độ ẩm và thông số mẻ sấy truyền dữ liệu liên tục về máy chủ SCADA.',
    descZh: 'IoT 傳感器連續監測溫度、相對濕度與流化床烘乾數值，數據實時上傳 SCADA 伺服器。',
    descEn: 'Continuous IoT sensor monitoring of temperature, relative humidity, and drying parameters streaming to central SCADA servers.'
  },
  {
    code: 'GATE 03',
    title: 'Blind Cupping Thử Nếm Lô Hàng',
    titleZh: '專業盲測杯測 (Blind Cupping)',
    titleEn: 'Sensory Blind Cupping Evaluation',
    desc: 'Hội đồng chuyên gia thử nếm mù cốt trà theo bảng điểm 5 tiêu chí: Sắc nước, Hương thơm, Độ đầm, Hậu vị, Vị chát.',
    descZh: '資深杯測評審團對每批茶湯進行雙盲杯測，評定五大核心指標：水色、香氣、醇厚度、回甘、收斂度。',
    descEn: 'Senior sensory panel conducts double-blind cupping scoring 5 core metrics: Liquor color, Aroma intensity, Body, Sweet aftertaste, and Astringency.'
  },
  {
    code: 'GATE 04',
    title: 'Kiểm tra bao bì & độ kín mối hàn',
    titleZh: '包裝密封性與真空耐壓檢測',
    titleEn: 'Packaging Integrity & Vacuum Testing',
    desc: 'Thử nghiệm áp lực hút chân không và độ bền màng túi trong bồn thử nghiệm kín.',
    descZh: '於密閉負壓檢驗槽中對鋁箔密封袋進行水下耐壓及微漏氣真空洩漏測試。',
    descEn: 'Submerged negative-pressure vacuum chamber testing to guarantee seal integrity and complete barrier protection.'
  },
  {
    code: 'GATE 05',
    title: 'Lưu mẫu đối chứng & Truy xuất nguồn gốc',
    titleZh: '對照樣品留存與全程溯源',
    titleEn: 'Retention Archiving & End-to-End Traceability',
    desc: 'Mỗi gói hàng gắn mã QR Code duy nhất truy xuất nông trường thu hái, ngày sao chế và nhân sự phụ trách.',
    descZh: '每袋產品均賦予唯一 QR 追溯碼，可精準查詢採摘茶園、烘焙日期及 QC 負責人。',
    descEn: 'Every pack bears a unique QR traceability code linking directly to plantation harvest date, roaster profile, and certified QC inspector.'
  }
];
