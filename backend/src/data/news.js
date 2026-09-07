export const NEWS_CATEGORIES = [
  { id: 'all', name: 'Tất cả bài viết', nameZh: '全部文章' },
  { id: 'xu-huong', name: 'Xu Hướng Đồ Uống', nameZh: '飲品市場趨勢' },
  { id: 'cong-thuc', name: 'Công Thức Pha Chế', nameZh: '調飲專業配方' },
  { id: 'kien-thuc-tra', name: 'Kiến Thức Trà & R&D', nameZh: '製茶與研發知識' },
  { id: 'tin-cong-ty', name: 'Tin Tức Công Ty & Sự Kiện', nameZh: '企業最新動態' },
];

export const NEWS_ARTICLES = [
  {
    id: 'xu-huong-tra-sua-dam-vi-2026',
    slug: 'xu-huong-tra-sua-dam-vi-2026',
    title: 'Xu Hướng Trà Sữa Đậm Vị 2026: Khi Hương Vị Trà Trở Lại Vị Trí Trung Tâm',
    titleZh: '2026年濃茶厚奶風潮：當原茶香氣重返飲品核心',
    category: 'Xu Hướng Đồ Uống',
    categorySlug: 'xu-huong',
    date: '15 Tháng 02, 2026',
    readTime: '6 phút đọc',
    author: 'Nguyễn Minh Quân (Chuyên gia R&D CASA)',
    image: 'https://images.unsplash.com/photo-1541658016709-82535e94bc69?auto=format&fit=crop&w=1200&q=80',
    featured: true,
    featuredNews: true,
    featuredHome: true,
    excerpt: 'Người tiêu dùng thế hệ mới đang dần chuyển dịch từ những ly trà sữa ngọt gắt sang các dòng trà đậm vị, rõ nốt hương khói nướng hoặc hương hoa tự nhiên. Đây là cơ hội vàng cho các thương hiệu nâng cấp cốt trà.',
    excerptZh: '新一代消費者逐漸從過度甜膩的奶茶轉向香氣濃郁、帶有鮮明炭焙或天然花香的厚茶基底。這是品牌全面升級茶底的黃金契機。',
    content: `
      <p class="lead text-lg font-medium text-tea-dark mb-4">
        Sau một thập kỷ bùng nổ với hàng loạt trào lưu topping phong phú, năm 2026 đánh dấu sự quay trở lại mạnh mẽ của yếu tố cốt lõi: <strong>Chất lượng của cốt trà</strong>. Khách hàng ngày càng sành sỏi hơn, sẵn sàng chi trả cao hơn cho một ly đồ uống có hậu vị sâu lắng, hương thơm mộc mạc và cảm giác dễ chịu sau khi thưởng thức.
      </p>

      <h3 class="text-2xl font-bold text-tea-dark mt-6 mb-3">1. Sự thoái trào của trà sữa ngọt béo công nghiệp</h3>
      <p class="mb-4 text-gray-700 leading-relaxed">
        Trước đây, nhiều mô hình quán dựa vào độ ngọt của siro và độ béo ngậy của bột kem để che giấu nền trà giá rẻ, bị đắng chát hoặc thiếu hương vị. Tuy nhiên, sự xuất hiện của các thương hiệu thế hệ mới chú trọng vào nguồn gốc lá trà đã định hình lại khẩu vị người dùng. Khách hàng giờ đây dễ dàng nhận ra sự khác biệt giữa hương thơm tự nhiên từ búp trà sao sấy chuẩn và mùi hương liệu nhân tạo hóa chất.
      </p>

      <h3 class="text-2xl font-bold text-tea-dark mt-6 mb-3">2. Ba dòng trà thống trị menu đồ uống hiện đại</h3>
      <ul class="list-disc pl-6 space-y-2 text-gray-700 mb-6">
        <li><strong>Trà Ô Long Nướng (Charcoal Roasted Oolong):</strong> Với nốt hương khói nướng, caramel và hạt dẻ, Oolong nướng mang lại cảm giác ấm cúng, sang trọng và hòa quyện tuyệt vời với sữa tươi thanh trùng.</li>
        <li><strong>Trà Đen Assam Thượng Hạng:</strong> Mang lại sắc nước đỏ hổ phách và vị chát đầm ấm, giữ nguyên độ đượm vị ngay cả khi uống với nhiều đá bi.</li>
        <li><strong>Trà Lài Ướp Hoa Tự Nhiên:</strong> Là lựa chọn hàng đầu cho các món trà trái cây tươi nhờ hương thơm hoa nhài bung tỏa nhẹ nhàng, hậu vị thanh mát.</li>
      </ul>

      <div class="p-6 bg-tea-mist border-l-4 border-tea-green rounded-r-2xl my-6">
        <h4 class="font-bold text-tea-primary text-lg mb-2">Góc nhìn từ chuyên gia R&D CASA:</h4>
        <p class="text-gray-700 italic">
          "Để giữ chân khách hàng quay lại hàng ngày, yếu tố quyết định không phải là ly trà có bao nhiêu loại trân châu, mà là ngụm trà đầu tiên phải tạo được ấn tượng êm dịu nơi vòm họng và lưu hương thơm bền bỉ sau khi nuốt. Đó chính là lý do CASA đầu tư hàng triệu USD vào dây chuyền chuẩn hóa hương vị."
        </p>
      </div>

      <h3 class="text-2xl font-bold text-tea-dark mt-6 mb-3">3. Bài toán kiểm soát cost cho các chuỗi lớn</h3>
      <p class="mb-4 text-gray-700 leading-relaxed">
        Sử dụng trà chất lượng cao không đồng nghĩa với việc giá vốn (cost) ly đồ uống bị đội lên quá mức. Ngược lại, những dòng trà búp được sao chế bằng công nghệ sấy tầng sôi hiện đại có tỷ lệ chiết xuất TDS cao hơn 25-30% so với trà thông thường. Nhờ đó, barista có thể giảm lượng gram trà khô trên mỗi lít nước ủ mà vẫn đảm bảo cốt trà sánh đặc, tối ưu hóa lợi nhuận kinh doanh.
      </p>
    `,
    recipeBox: {
      title: 'Công Thức Đề Xuất: Ô Long Nướng Kem Sữa Mộc (Signature CASA 2026)',
      cost: '~7.800đ / ly 500ml',
      ingredients: [
        '120ml Nước cốt Trà Ô Long Nướng CASA No.2',
        '30g Bột Béo Thực Vật CASA Pro-Cream',
        '25ml Nước đường mía nấu hoa cúc',
        '40ml Sữa tươi thanh trùng không đường',
        '50ml Kem Cheese Macchiato CASA Foam lên bề mặt',
        'Đá bi viên đầy ly'
      ],
      steps: [
        'Ủ cốt trà Ô Long Nướng ở tỷ lệ 1:33 trong 12 phút ở nhiệt độ 93°C, sau đó sốc nhiệt cùng đá lạnh.',
        'Hòa tan bột béo CASA Pro-Cream trong cốt trà ấm, thêm đường mía và sữa tươi thanh trùng vào shake đều.',
        'Rót ra ly cùng đá bi, nhẹ nhàng phủ lớp kem cheese muối mặn bồng bềnh lên trên.'
      ]
    },
    tags: ['Xu hướng 2026', 'Trà sữa đậm vị', 'Oolong Nướng', 'R&D F&B']
  },
  {
    id: 'bi-quyet-u-tra-trai-cay-khong-bi-chua-chat',
    slug: 'bi-quyet-u-tra-trai-cay-khong-bi-chua-chat',
    title: 'Bí Quyết Hãm Nước Cốt Trà Trái Cây: Giữ Màu Xanh Trong, Tuyệt Đối Không Biến Đổi Vị',
    titleZh: '鮮果茶茶湯萃取秘訣：保持茶湯翠綠透亮、絕不反酸變澀',
    category: 'Công Thức Pha Chế',
    categorySlug: 'cong-thuc',
    date: '28 Tháng 01, 2026',
    readTime: '5 phút đọc',
    author: 'Trần Hoài Nam (Trưởng bộ phận Barista Training CASA)',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    featuredNews: false,
    featuredHome: true,
    excerpt: 'Rất nhiều chủ quán đau đầu vì nước cốt lục trà chỉ sau 2-3 tiếng là bị ngả màu thâm đỏ, xuất hiện váng đục và có vị chua chát khó chịu. Hãy cùng khám phá kỹ thuật sốc nhiệt khoa học.',
    excerptZh: '許多店家苦惱綠茶茶湯放置2-3小時後便氧化變紅、茶湯渾濁且發酸發澀。讓我們一同探索科學的冰鎮鎖香技術。',
    content: `
      <p class="lead text-lg font-medium text-tea-dark mb-4">
        Trà trái cây nhiệt đới là nhóm đồ uống mang lại biên lợi nhuận cao nhất trong menu, nhưng cũng là nhóm sản phẩm dễ gặp lỗi cảm quan nhất nếu quán không nắm vững kỹ thuật bảo quản nước cốt.
      </p>

      <h3 class="text-2xl font-bold text-tea-dark mt-6 mb-3">Hiện tượng trà bị thâm đỏ và chua gắt do đâu?</h3>
      <p class="mb-4 text-gray-700 leading-relaxed">
        Lá trà xanh và trà lài chứa hàm lượng lớn hợp chất Catechin và Diệp lục (Chlorophyll). Khi tiếp xúc với oxy trong không khí ở nhiệt độ phòng, quá trình tự oxy hóa diễn ra nhanh chóng, khiến cốt trà đổi màu từ vàng xanh sang đỏ sẫm và sinh ra các axit hữu cơ gây cảm giác chua gắt cổ họng.
      </p>

      <h3 class="text-2xl font-bold text-tea-dark mt-6 mb-3">Giải pháp 3 bước từ chuyên gia CASA</h3>
      <div class="space-y-4 mb-6 text-gray-700">
        <div class="p-4 bg-white rounded-xl shadow-tea-sm border border-tea-border">
          <h5 class="font-bold text-tea-emerald mb-1">Bước 1: Kiểm soát nhiệt độ nước ủ chính xác</h5>
          <p>Không dùng nước sôi 100°C để ủ trà xanh hay trà lài. Nhiệt độ lý tưởng nhất là 80°C - 83°C. Nước quá nóng sẽ làm 'chín luộc' lá trà, giải phóng ồ ạt vị chát tannin khó uống.</p>
        </div>
        <div class="p-4 bg-white rounded-xl shadow-tea-sm border border-tea-border">
          <h5 class="font-bold text-tea-emerald mb-1">Bước 2: Kỹ thuật sốc nhiệt bằng đá bi (Ice-Shock)</h5>
          <p>Ngay sau khi lọc bã trà, cho ngay 20-25% trọng lượng đá bi sạch vào nước cốt trà nóng và khuấy nhanh. Việc hạ nhiệt đột ngột từ 80°C xuống dưới 20°C sẽ ngay lập tức 'khóa' phân tử polyphenol, giữ nguyên màu sắc xanh ngọc và hương hoa tinh khiết.</p>
        </div>
        <div class="p-4 bg-white rounded-xl shadow-tea-sm border border-tea-border">
          <h5 class="font-bold text-tea-emerald mb-1">Bước 3: Bảo quản trong bình chân không kín gió</h5>
          <p>Đựng nước cốt trong bình ủ inox chuyên dụng, đậy kín nắp. Cốt trà được xử lý đúng cách có thể lưu trữ thơm ngon trong 24-36 tiếng ở nhiệt độ mát mà không hề biến đổi phẩm vị.</p>
        </div>
      </div>
    `,
    recipeBox: {
      title: 'Công Thức: Lục Trà Lài Dưa Lưới Sữa Chua (Melon Yogurt Jasmine)',
      cost: '~6.500đ / ly',
      ingredients: [
        '130ml Cốt Lục Trà Lài CASA (đã sốc nhiệt)',
        '30ml Puree dưa lưới tươi cô đặc',
        '20ml Nước đường cát thanh mát',
        '1 hộp sữa chua uống tiệt trùng ít đường',
        'Thạch nha đam giòn topping'
      ],
      steps: [
        'Cho cốt trà lài, puree dưa lưới và nước đường vào bình shake lắc cùng đá.',
        'Đổ ra ly, nhẹ nhàng rưới lớp sữa chua lên trên tạo hiệu ứng ombre 2 tầng bắt mắt.'
      ]
    },
    tags: ['Kỹ thuật ủ trà', 'Trà trái cây', 'Bảo quản cốt trà', 'Barista Skills']
  },
  {
    id: 'tieu-chuan-kiem-soat-du-luong-xuat-khau-tra',
    slug: 'tieu-chuan-kiem-soat-du-luong-xuat-khau-tra',
    title: 'Quy Trình Kiểm Soát 450 Hoạt Chất Dư Lượng Nông Dược Trong Chuỗi Cung Ứng Trà CASA',
    titleZh: 'CASA 茶葉供應鏈 450 項農藥殘留嚴格管控標準與流程',
    category: 'Kiến Thức Trà & R&D',
    categorySlug: 'kien-thuc-tra',
    date: '10 Tháng 01, 2026',
    readTime: '7 phút đọc',
    author: 'TS. Lê Hoàng Mai (Giám đốc Quản lý Chất lượng QC)',
    image: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    featuredNews: false,
    featuredHome: true,
    excerpt: 'Làm thế nào CASA đảm bảo nguồn nguyên liệu đạt chuẩn xuất khẩu sang các thị trường khó tính như Hoa Kỳ, Châu Âu và Nhật Bản? Khám phá hệ sinh thái nông nghiệp có trách nhiệm.',
    excerptZh: 'CASA 如何確保原物料符合出口至歐盟、美國和日本等嚴苛市場的高標準？帶您深入了解負責任的綠色農業生態系。',
    content: `
      <p class="lead text-lg font-medium text-tea-dark mb-4">
        An toàn vệ sinh thực phẩm không chỉ là một khẩu hiệu tiếp thị, mà là xương sống quyết định sự sống còn của một nhà máy cung ứng nguyên liệu đồ uống quy mô lớn.
      </p>

      <h3 class="text-2xl font-bold text-tea-dark mt-6 mb-3">1. Nguyên tắc vùng đệm tự nhiên tại nông trường</h3>
      <p class="mb-4 text-gray-700 leading-relaxed">
        Các vùng chè nguyên liệu của CASA được quy hoạch tại các sườn đồi cách xa khu dân cư và quốc lộ tối thiểu 3km. Xung quanh các lô chè là hàng rào cây xanh bản địa tạo thành vùng đệm sinh thái ngăn cách tuyệt đối mọi nguồn lây nhiễm chéo từ không khí hoặc nguồn nước thải.
      </p>

      <h3 class="text-2xl font-bold text-tea-dark mt-6 mb-3">2. Phương pháp phân tích sắc ký khối phổ tiên tiến</h3>
      <p class="mb-4 text-gray-700 leading-relaxed">
        Phòng thí nghiệm kiểm nghiệm nội bộ của chúng tôi được trang bị hệ thống sắc ký lỏng ghép khối phổ hai lần (LC-MS/MS) và sắc ký khí (GC-MS/MS). Thiết bị có khả năng phát hiện dư lượng hoạt chất ở nồng độ siêu vết (phần tỷ - ppb), đảm bảo từng lô trà đáp ứng danh mục hơn 450 chỉ tiêu khắt khe theo quy định của Liên minh Châu Âu (EU MRLs).
      </p>
    `,
    recipeBox: null,
    tags: ['An toàn thực phẩm', 'ISO 22000', 'Xuất khẩu trà', 'Kiểm nghiệm QC']
  },
  {
    id: 'casa-khanh-thanh-day-chuyen-say-tang-soi-moi',
    slug: 'casa-khanh-thanh-day-chuyen-say-tang-soi-moi',
    title: 'CASA Chính Thức Đưa Vào Vận Hành Dây Chuyền Sấy Tầng Sôi Thế Hệ Mới Công Suất 5.000 Tấn/Năm',
    titleZh: 'CASA 正式啟用年產5,000噸全新流化床乾燥生產線',
    category: 'Tin Tức Công Ty & Sự Kiện',
    categorySlug: 'tin-cong-ty',
    date: '18 Tháng 12, 2025',
    readTime: '4 phút đọc',
    author: 'Ban Truyền Thông Doanh Nghiệp CASA',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80',
    featured: false,
    featuredNews: false,
    featuredHome: false,
    excerpt: 'Nhà máy chế biến thứ 2 của CASA tại Lâm Đồng đã chính thức hoàn tất giai đoạn chạy thử nghiệm và nghiệm thu bàn giao, nâng tổng năng lực cung ứng nguyên liệu toàn quốc lên gấp đôi.',
    excerptZh: 'CASA 位於林同省的第二座現代化加工廠順利通過驗收投產，使全國原物料供應能力翻倍提升。',
    content: `
      <p class="lead text-lg font-medium text-tea-dark mb-4">
        Sự kiện đánh dấu cột mốc quan trọng trong chiến lược trở thành đơn vị sản xuất và cung ứng nguyên liệu pha chế hàng đầu tại khu vực Đông Nam Á của CASA.
      </p>

      <p class="mb-4 text-gray-700 leading-relaxed">
        Dây chuyền mới được nhập khẩu đồng bộ từ các đối tác chế tạo máy thực phẩm hàng đầu Châu Âu, tự động hóa từ khâu nạp liệu, sấy tầng sôi, tách tạp chất quang học Sortex cho đến đóng gói túi màng nhôm đa lớp hút chân không nạp khí trơ N2.
      </p>
    `,
    recipeBox: null,
    tags: ['Nhà máy mới', 'Tin doanh nghiệp', 'Mở rộng quy mô', 'Lâm Đồng']
  }
];

