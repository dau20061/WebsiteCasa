export const CERTIFICATIONS = [
  {
    id: 'cert-iso-22000',
    name: 'ISO 22000:2018',
    title: 'Hệ Thống Quản Lý An Toàn Thực Phẩm Toàn Cầu',
    titleZh: '全球食品安全管理系統認證',
    org: 'Tổ chức Tiêu chuẩn hóa Quốc tế (ISO)',
    orgZh: '國際標準化組織 (ISO)',
    certNumber: 'Certification Placeholder (Cấp theo quy định kiểm toán hàng năm)',
    scope: 'Áp dụng cho toàn bộ quy trình tiếp nhận nguyên liệu, sơ chế, chế biến sâu, phối trộn và đóng gói thành phẩm các dòng trà khô và bột nguyên liệu pha chế.',
    scopeZh: '適用於原物料驗收、初加工、深加工、均質拼配及各類商用茶葉與飲品原料粉末成品包裝之全製程。',
    badge: 'Tiêu chuẩn Quốc tế',
    badgeZh: '國際權威標準',
    icon: 'ShieldCheck',
    previewDoc: 'Chứng nhận Hệ thống Quản lý ATTP ISO 22000:2018',
    validity: 'Định kỳ tái đánh giá hàng năm',
    validityZh: '每年定期複審與稽核',
    details: [
      'Kiểm soát toàn diện mối nguy sinh học, hóa học và vật lý',
      'Tuân thủ chuỗi truy xuất nguồn gốc một chiều',
      'Được công nhận tại hơn 160 quốc gia trên thế giới'
    ],
    image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cert-haccp',
    name: 'HACCP Codex Alimentarius',
    title: 'Hệ Thống Phân Tích Mối Nguy & Điểm Kiểm Soát Tới Hạn',
    titleZh: '危害分析與關鍵控制點體系',
    org: 'Ủy ban Tiêu chuẩn Thực phẩm Quốc tế CODEX',
    orgZh: '國際食品法典委員會 CODEX',
    certNumber: 'Certification Placeholder (Đánh giá độc lập bên thứ 3)',
    scope: 'Xác định và kiểm soát triệt để các CCP (Critical Control Points) trong khâu diệt men, sao sấy nhiệt và đóng gói vô trùng.',
    scopeZh: '精確識別並嚴格控制高溫殺青、熱風烘焙乾燥及無菌包裝等關鍵控制點 (CCP)。',
    badge: 'Codex Chuẩn F&B',
    badgeZh: 'Codex 國際標準',
    icon: 'Award',
    previewDoc: 'Chứng chỉ HACCP Codex Phân Tích Mối Nguy',
    validity: 'Định kỳ giám sát 6 tháng/lần',
    validityZh: '每6個月定期監督審核',
    details: [
      'Thiết lập ngưỡng giới hạn nhiệt độ và độ ẩm nghiêm ngặt',
      'Quy trình vệ sinh thiết bị CIP tự động hóa',
      'Nhật ký giám sát điện tử lưu trữ đám mây an toàn'
    ],
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cert-fda',
    name: 'FDA USA Registration',
    title: 'Đăng Ký Cơ Sở Xuất Khẩu Sang Hoa Kỳ',
    titleZh: '美國食品藥品監督管理局登記註冊',
    org: 'Cục Quản Lý Thực Phẩm & Dược Phẩm Hoa Kỳ (US FDA)',
    orgZh: '美國食品藥品監督管理局 (US FDA)',
    certNumber: 'Certification Placeholder (Facility Registration Holder)',
    scope: 'Đăng ký cơ sở sản xuất và kho lưu trữ nông sản xuất khẩu đáp ứng Đạo luật Hiện đại hóa An toàn Thực phẩm (FSMA).',
    scopeZh: '外銷美國之茶葉生產基地與農產儲運倉儲符合《食品安全現代化法案》(FSMA) 規範登記。',
    badge: 'Xuất Khẩu Hoa Kỳ',
    badgeZh: '外銷美國合規',
    icon: 'Globe',
    previewDoc: 'FDA Facility Registration Confirmation Placeholder',
    validity: 'Gia hạn 2 năm một lần theo quy định FDA Hoa Kỳ',
    validityZh: '依美國 FDA 法規每2年續展',
    details: [
      'Đạt chuẩn các bài kiểm nghiệm vi sinh và kim loại nặng khắt khe',
      'Chấp thuận cho các thương hiệu chuỗi mở rộng sang thị trường Mỹ',
      'Hỗ trợ đầy đủ hồ sơ khai báo trước Prior Notice xuất khẩu'
    ],
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cert-halal',
    name: 'HALAL Certification',
    title: 'Chứng Nhận Tiêu Chuẩn Thực Phẩm Hồi Giáo',
    titleZh: '伊斯蘭清真食品標準認證',
    org: 'Cơ quan Đánh giá & Cấp chứng nhận Halal Quốc tế',
    orgZh: '國際清真認證機構 (JAKIM / GCC)',
    certNumber: 'Certification Placeholder (JAKIM / GCC Compliant)',
    scope: 'Toàn bộ dây chuyền sản xuất và các thành phần trà, bột béo, hương liệu tự nhiên không chứa cồn, mỡ động vật và chất cấm theo luật Hồi giáo Shariah.',
    scopeZh: '全自動化生產線及茶葉、植脂末、天然萃取液均不含酒精、動物性脂肪及伊斯蘭教法禁用成分。',
    badge: 'Chứng Nhận Halal',
    badgeZh: '清真 Halal 認證',
    icon: 'CheckCircle2',
    previewDoc: 'Giấy chứng nhận Halal Sản Phẩm Trà & Bột',
    validity: 'Hiệu lực thường niên',
    validityZh: '年度審驗續約',
    details: [
      'Thuận lợi cung ứng cho các chuỗi đồ uống quốc tế tại Đông Nam Á & Trung Đông',
      '100% nguyên liệu có nguồn gốc thực vật tinh khiết',
      'Dây chuyền tách biệt không lây nhiễm chéo'
    ],
    image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cert-vietgap',
    name: 'VietGAP Tea Estate',
    title: 'Thực Hành Sản Xuất Nông Nghiệp Tốt Tại Việt Nam',
    titleZh: '越南良好農業規範優質茶園',
    org: 'Bộ Nông nghiệp & Phát triển Nông thôn Việt Nam',
    orgZh: '越南農業與農村發展部',
    certNumber: 'Certification Placeholder (Mã số vùng trồng chứng nhận)',
    scope: 'Canh tác trên các nông trường đồi chè liên kết tại Lâm Đồng và Tây Bắc: kiểm soát đất, nguồn nước tưới suối đầu nguồn và phân bón hữu cơ vi sinh.',
    scopeZh: '林同省及西北高原契作高山茶園：嚴格管控土壤健康、高山純淨水源與有機生物肥料。',
    badge: 'Nông Trại Sạch',
    badgeZh: '純淨茶園',
    icon: 'Sprout',
    previewDoc: 'Chứng nhận Vùng Trồng Đạt Chuẩn VietGAP',
    validity: 'Cấp theo mùa vụ & chu kỳ canh tác',
    validityZh: '按產季與農作週期動態驗證',
    details: [
      'Thời gian cách ly an toàn trước thu hoạch tối thiểu 21 ngày',
      'Không sử dụng hóa chất kích thích tăng trưởng',
      'Bảo tồn hệ sinh thái tự nhiên vùng đồi chè bền vững'
    ],
    image: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1000&q=80'
  },
  {
    id: 'cert-coa',
    name: 'COA & Test Reports',
    title: 'Phiếu Kết Quả Kiểm Nghiệm Từng Lô Hàng Xuất Xưởng',
    titleZh: '出廠批次理化微生物檢驗分析單',
    org: 'Trung tâm Đo lường Chất lượng Quatest 3 / Eurofins Viện Kiểm Nghiệm Quốc Gia',
    orgZh: 'Quatest 3 國家質量檢驗中心 / Eurofins 國際檢測機構',
    certNumber: 'Certification Placeholder (Cấp riêng theo số Batch sản xuất)',
    scope: 'Phân tích đầy đủ các chỉ tiêu lý hóa (Độ ẩm, tro tổng, tanin, caffeine) và chỉ tiêu vi sinh (E.Coli, Samonella, Nấm mốc, Kim loại nặng As, Pb, Cd).',
    scopeZh: '全面檢驗理化指標（水分、總灰分、單寧、咖啡因含量）與微生物安全（大腸桿菌、沙門氏菌、黴菌、重金屬鉛砷鎘）。',
    badge: 'Minh Bạch 100%',
    badgeZh: '100% 透明公開',
    icon: 'FileText',
    previewDoc: 'Mẫu Phiếu Phân Tích Kiểm Nghiệm COA Đi Kèm Mỗi Lô Hàng',
    validity: 'Đi kèm theo từng chuyến hàng bàn giao khách',
    validityZh: '隨每批貨物同步附送',
    details: [
      'Cung cấp bản cứng có dấu mộc và bản mềm PDF cho khách hàng làm hồ sơ',
      'Hỗ trợ khách hàng chuỗi hoàn thiện hồ sơ tự công bố sản phẩm với Sở Y Tế',
      'Sẵn sàng test thêm các chỉ tiêu đặc thù theo yêu cầu của đối tác'
    ],
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1000&q=80'
  }
];

