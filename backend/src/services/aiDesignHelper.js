// ============================================================================
// CASA TEA - AI AUTO-DESIGN & SMART FORMATTING ENGINE
// Tự động chuẩn hóa, thiết kế bố cục và tối ưu hóa nội dung Sản Phẩm & Bài Viết
// ============================================================================

// 1. TỰ ĐỘNG THIẾT KẾ SẢN PHẨM (PRODUCT AUTO-DESIGN)
export function autoDesignProduct(input = {}) {
  const rawName = (input.name || '').trim();
  const rawDesc = (input.shortDesc || '').trim();
  const base = `${rawName} ${rawDesc}`.toLowerCase();

  // Nhận diện loại trà từ từ khóa người dùng nhập
  let category = input.category || 'tra-den';
  let categoryName = 'Trà Đen';
  let defaultImage = 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80';
  let defaultSkuPrefix = 'CS-BLK';
  let aroma = 88;
  let body = 92;
  let sweetness = 78;
  let color = 'Đỏ Ruby Ánh Nâu';
  let origin = 'Cao nguyên Bảo Lộc & Assam tuyển chọn';
  let badge = 'Bán Chạy Nhất';
  let applications = ['Trà sữa truyền thống đậm vị', 'Trà sữa nướng than hoa', 'Hồng trà kem cheese'];
  let packaging = ['Gói nhôm 3 lớp 1kg (10 gói/thùng)', 'Bao chuyên dụng 25kg chuẩn xuất khẩu'];

  if (base.includes('muối') || base.includes('kem muối')) {
    category = 'bot-pha-che';
    categoryName = 'Kem Muối Biển & Topping';
    defaultSkuPrefix = 'CS-SALT';
    defaultImage = 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=800&q=80';
    aroma = 86;
    body = 96;
    sweetness = 78;
    color = 'Trắng Ngà Sánh Mịn';
    origin = 'Muối biển Sa Huỳnh tinh khiết & Sữa béo New Zealand';
    badge = 'Vị Mặn Béo Cuốn Hút';
    applications = ['Cà phê muối xứ Huế', 'Trà đen kem muối biển', 'Ô long kem muối Macchiato'];
    packaging = ['Gói 1kg (10 gói/thùng)', 'Bao 25kg'];
  } else if (base.includes('cheese') || base.includes('phô mai')) {
    category = 'bot-pha-che';
    categoryName = 'Kem Cheese & Phô Mai';
    defaultSkuPrefix = 'CS-CHS';
    defaultImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
    aroma = 88;
    body = 98;
    sweetness = 82;
    color = 'Vàng Kem Sánh Đặc';
    origin = 'Phô mai Cheddar New Zealand & Kem béo thực vật';
    badge = 'Béo Ngậy Sánh Mịn';
    applications = ['Hồng trà kem cheese', 'Ô long kem cheese nướng', 'Matcha kem cheese'];
    packaging = ['Gói 1kg (10 gói/thùng)', 'Bao 25kg'];
  } else if (base.includes('long') || base.includes('oolong') || base.includes('ô long') || base.includes('nướng')) {
    category = 'tra-oolong';
    categoryName = 'Trà Ô Long';
    defaultSkuPrefix = 'CS-OOL';
    defaultImage = 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80';
    aroma = 94;
    body = 86;
    sweetness = 85;
    color = 'Vàng Hổ Phách Ánh Mật';
    origin = 'Vùng trà Oolong cao nguyên Lâm Đồng (Độ cao 1.100m)';
    badge = 'Hương Thơm Đỉnh Cao';
    applications = ['Trà sữa Ô long nướng', 'Ô long sữa tươi trân châu', 'Trà ô long Macchiato'];
  } else if (base.includes('lài') || base.includes('nhài') || base.includes('xanh') || base.includes('green') || base.includes('sen')) {
    category = 'tra-lai-xanh';
    categoryName = 'Trà Lài & Trà Xanh';
    defaultSkuPrefix = 'CS-GRN';
    defaultImage = 'https://images.unsplash.com/photo-1627435601361-ec25f5b1d0e5?auto=format&fit=crop&w=800&q=80';
    aroma = 96;
    body = 75;
    sweetness = 88;
    color = 'Xanh Cốm Trong Vắt';
    origin = 'Búp trà Shan Tuyết ướp hoa lài tự nhiên qua đêm';
    badge = 'Best Seller Trà Trái Cây';
    applications = ['Trà lài mãng cầu', 'Trà mãng cầu xiêm', 'Trà xanh sữa lài kem mặn', 'Trà đào cam sả'];
  } else if (base.includes('hojicha') || base.includes('rang') || base.includes('gạo') || base.includes('matcha')) {
    category = 'tra-rang';
    categoryName = 'Trà Rang & Hojicha';
    defaultSkuPrefix = 'CS-ROAST';
    defaultImage = 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80';
    aroma = 92;
    body = 90;
    sweetness = 82;
    color = 'Nâu Gỗ Trầm Ấm';
    origin = 'Sao rang công nghệ nhiệt khí đối lưu Nhật Bản';
    badge = 'Vị Rang Đậm Khói';
    applications = ['Hojicha Latte Nhật Bản', 'Trà rang sữa nướng', 'Bánh kem trà rang'];
  } else if (base.includes('bột') || base.includes('béo') || base.includes('kem') || base.includes('powder')) {
    category = 'bot-pha-che';
    categoryName = 'Bột Pha Chế & Topping';
    defaultSkuPrefix = 'CS-PWD';
    defaultImage = 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80';
    aroma = 85;
    body = 95;
    sweetness = 80;
    color = 'Trắng Ngà Tự Nhiên';
    origin = 'Nhập khẩu nguyên bao từ Malaysia / Indonesia';
    badge = 'Tôn Vị Trà Tối Đa';
    applications = ['Pha trà sữa các loại không lấn át vị trà', 'Đá xay Frappuccino', 'Làm cốt kem béo'];
  } else if (base.includes('trái cây') || base.includes('quả') || base.includes('chanh') || base.includes('mận')) {
    category = 'tra-trai-cay';
    categoryName = 'Nền Trà Trái Cây';
    defaultSkuPrefix = 'CS-FRT';
    defaultImage = 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80';
    aroma = 95;
    body = 78;
    sweetness = 90;
    color = 'Vàng Sáng Trong';
    origin = 'Cao nguyên Mộc Châu & Lâm Đồng tuyển chọn';
    badge = 'Cực Chuộng Mùa Hè';
    applications = ['Trà trái cây nhiệt đới', 'Trà dưa lưới / mận hậu', 'Trà vải lài đá tuyết'];
  }

  // Tạo tên B2B thương mại sang trọng
  let formattedName = rawName;
  if (!formattedName || formattedName.length < 5) {
    formattedName = `${categoryName} CASA Thượng Hạng Tuyển Chọn`;
  } else if (!formattedName.toLowerCase().includes('casa')) {
    formattedName = `${formattedName} CASA No.${Math.floor(1 + Math.random() * 9)}`;
  }

  // Mã SKU tự động
  const sku = input.sku && input.sku.trim()
    ? input.sku.toUpperCase()
    : `${defaultSkuPrefix}-${Math.floor(10 + Math.random() * 90)}`;

  // Mô tả dự phòng thông minh
  let defaultShortDesc = `Dòng nguyên liệu F&B chất lượng cao với hương thơm tự nhiên quyến rũ, vị đầm đà cân bằng hoàn hảo và hậu vị ngọt sâu. Lựa chọn số 1 cho các chuỗi F&B tối ưu chi phí giá vốn ly.`;
  let defaultFullDesc = `${formattedName} được nghiên cứu và tinh chỉnh riêng biệt cho phân khúc F&B cao cấp. Trải qua quy trình sản xuất tiêu chuẩn quốc tế, sản phẩm mang đến độ ổn định 1000 lô như một và khả năng hòa quyện tuyệt hảo cùng các món đồ uống hiện đại.`;

  if (base.includes('muối') || base.includes('kem muối')) {
    defaultShortDesc = `Lớp kem muối sánh mịn bồng bềnh với vị mặn dịu tinh tế từ muối biển, hòa quyện hoàn hảo cùng vị béo ngậy ngọt thanh đầy mê hoặc.`;
    defaultFullDesc = `Lớp kem muối sánh đặc mềm mịn tựa nhung, mang đến sự cân bằng vị giác đỉnh cao ngay khi chạm nơi đầu lưỡi. Nốt mặn duyên dáng của muối biển tinh khiết len lỏi khéo léo, kích thích từng gai vị giác bừng tỉnh, đồng thời tôn bật vị béo ngọt tự nhiên của kem tươi lên một tầm cao mới.\n\nSự kết hợp mặn - béo tương phản nhưng hòa quyện tuyệt đối giúp ly đồ uống thêm đượm đà, lưu luyến khó quên và mang đến trải nghiệm thưởng thức đa tầng đầy cuốn hút cho thực khách.`;
  } else if (base.includes('cheese') || base.includes('phô mai')) {
    defaultShortDesc = `Lớp kem cheese sánh đặc bồng bềnh với độ béo ngậy thơm lừng phô mai đặc trưng, tan chảy êm ái như nhung trên đầu lưỡi.`;
    defaultFullDesc = `Gây ấn tượng ngay từ ánh nhìn đầu tiên với lớp kem cheese trắng muốt, bồng bềnh và sánh mịn hoàn hảo. Từng muỗng kem được đánh bông tỉ mỉ, giữ trọn hương thơm phô mai nồng nàn quyến rũ cùng kết cấu mềm mượt đầy đặn.\n\nKhi thưởng thức, vị béo ngậy đậm đà đặc trưng lan tỏa tức thì nơi khoang miệng, hòa quyện cùng chút ngọt thanh và mằn mặn dịu nhẹ đầy tinh tế. Đây chính là lớp topping linh hồn giúp nâng tầm đồ uống cho mọi quán F&B.`;
  }

  const shortDesc = rawDesc || defaultShortDesc;
  const fullDesc = input.fullDesc || defaultFullDesc;

  return {
    name: formattedName,
    sku,
    category,
    categoryName,
    badge: input.badge || badge,
    shortDesc,
    fullDesc,
    origin: input.origin || origin,
    image: input.image || defaultImage,
    status: input.status || 'PUBLISHED',
    tasteProfile: {
      aroma: input.tasteProfile?.aroma || aroma,
      body: input.tasteProfile?.body || body,
      sweetness: input.tasteProfile?.sweetness || sweetness,
      color: input.tasteProfile?.color || color
    },
    applications,
    packaging
  };
}


// 2. TỰ ĐỘNG THIẾT KẾ BÀI VIẾT & CÔNG THỨC (ARTICLE & RECIPE AUTO-DESIGN)
export function autoDesignArticle(input = {}, templateType = 'recipe') {
  const rawTitle = (input.title || '').trim();
  const rawNotes = (input.content || input.notes || '').trim();
  const base = `${rawTitle} ${rawNotes}`.toLowerCase();

  // Nhận diện kiểu nội dung
  let isRecipe = templateType === 'recipe' || base.includes('công thức') || base.includes('pha chế') || base.includes('cách làm') || base.includes('sop') || base.includes('ly');
  let isTrend = templateType === 'trend' || base.includes('xu hướng') || base.includes('trend') || base.includes('thị trường') || base.includes('2026');
  let isKnowledge = templateType === 'knowledge' || base.includes('bí quyết') || base.includes('ủ trà') || base.includes('kỹ thuật') || base.includes('bảo quản') || base.includes('chiết xuất');

  if (!isRecipe && !isTrend && !isKnowledge) {
    isRecipe = true; // Mặc định là công thức nếu không rõ
  }

  if (isRecipe) {
    // TEMPLATE 1: CÔNG THỨC TRÀ SỮA / ĐỒ UỐNG CHUẨN BARISTA SOP
    const beverageName = rawTitle ? rawTitle.replace(/công thức|cách làm/gi, '').trim() : 'Trà Sữa Ô Long Nướng Kem Mặn';
    const formattedTitle = rawTitle.length > 10 ? rawTitle : `Công Thức Pha Chế: ${beverageName} Chuẩn Vị Đậm Đà 2026`;
    const slug = `cong-thuc-${beverageName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

    const htmlContent = `
<div class="space-y-6">
  <div class="p-5 rounded-2xl bg-[#EEF8F1] border-l-4 border-[#2F7A59] text-gray-800">
    <p class="font-bold text-[#183B2B] text-base mb-1">💡 Điểm Nhấn Công Thức B2B</p>
    <p class="text-sm leading-relaxed">
      Công thức được đội ngũ R&D CASA tinh chỉnh nhằm đạt độ đầm vị cao nhất (High Body), nước cốt trà thơm sâu và giữ trọn hương vị sau 48h ủ lạnh. Tỷ lệ chiết xuất TDS đo lường đạt chuẩn 2.8% – 3.2%.
    </p>
  </div>

  <h2 class="text-2xl font-extrabold text-[#183B2B] flex items-center gap-2">
    <span>1. Thông Số Ủ Cốt Trà Tiêu Chuẩn (Extraction SOP)</span>
  </h2>
  <div class="overflow-x-auto my-4">
    <table class="w-full text-left text-sm border border-gray-200 rounded-xl overflow-hidden">
      <thead class="bg-gray-100 text-gray-700 font-bold">
        <tr>
          <th class="p-3">Thông số</th>
          <th class="p-3">Định lượng tiêu chuẩn</th>
          <th class="p-3">Ghi chú kỹ thuật</th>
        </tr>
      </thead>
      <tbody class="divide-y divide-gray-100">
        <tr>
          <td class="p-3 font-semibold text-[#2F7A59]">Tỷ lệ Trà : Nước</td>
          <td class="p-3 font-mono font-bold">1 : 30 (35g trà / 1050ml nước)</td>
          <td class="p-3 text-xs text-gray-500">Giúp cốt trà đậm đà không bị loãng khi gặp đá</td>
        </tr>
        <tr>
          <td class="p-3 font-semibold text-[#2F7A59]">Nhiệt độ nước</td>
          <td class="p-3 font-mono font-bold">92°C - 95°C</td>
          <td class="p-3 text-xs text-gray-500">Tránh nước sôi 100°C làm khét tannin</td>
        </tr>
        <tr>
          <td class="p-3 font-semibold text-[#2F7A59]">Thời gian ủ kín</td>
          <td class="p-3 font-mono font-bold">12 - 15 phút</td>
          <td class="p-3 text-xs text-gray-500">Đậy kín nắp bình ủ cách nhiệt để giữ hương bay hơi</td>
        </tr>
        <tr>
          <td class="p-3 font-semibold text-[#2F7A59]">Sốc nhiệt đá bi</td>
          <td class="p-3 font-mono font-bold">250g đá bi sạch</td>
          <td class="p-3 text-xs text-gray-500">Lọc bỏ bã xong sốc nhiệt ngay để nước cốt bóng đẹp</td>
        </tr>
      </tbody>
    </table>
  </div>

  <h2 class="text-2xl font-extrabold text-[#183B2B] flex items-center gap-2">
    <span>2. Quy Trình Pha Chế Từng Ly (Cup SOP 500ml)</span>
  </h2>
  <ul class="space-y-3 text-sm text-gray-700">
    <li class="flex items-start gap-2">
      <span class="w-6 h-6 rounded-full bg-[#DFF5E1] text-[#2F7A59] font-bold flex items-center justify-center shrink-0 text-xs">1</span>
      <span><strong>Bước 1:</strong> Đong 120ml cốt trà đậm CASA đã ủ lạnh vào shaker.</span>
    </li>
    <li class="flex items-start gap-2">
      <span class="w-6 h-6 rounded-full bg-[#DFF5E1] text-[#2F7A59] font-bold flex items-center justify-center shrink-0 text-xs">2</span>
      <span><strong>Bước 2:</strong> Thêm 25g bột béo thực vật chuyên dụng CASA hòa tan, cùng 25ml nước đường bắp hoặc sữa đặc.</span>
    </li>
    <li class="flex items-start gap-2">
      <span class="w-6 h-6 rounded-full bg-[#DFF5E1] text-[#2F7A59] font-bold flex items-center justify-center shrink-0 text-xs">3</span>
      <span><strong>Bước 3:</strong> Thêm 180g đá viên, lắc mạnh 15-20 lần (khoảng 8 giây) để tạo lớp bọt mịn màng và hòa tan hoàn hảo.</span>
    </li>
    <li class="flex items-start gap-2">
      <span class="w-6 h-6 rounded-full bg-[#DFF5E1] text-[#2F7A59] font-bold flex items-center justify-center shrink-0 text-xs">4</span>
      <span><strong>Bước 4:</strong> Rót ra ly, phủ thêm 40ml kem mặn Macchiato hoặc topping trân châu nướng tùy ý và thưởng thức.</span>
    </li>
  </ul>

  <div class="p-5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
    <p class="font-bold text-sm text-amber-800">⚠️ Lưu Ý Kỹ Thuật Bảo Quản Cốt Trà:</p>
    <p>• Không bảo quản cốt trà trong tủ đông hoặc ngăn đá vì sẽ phá vỡ liên kết tinh dầu trà.</p>
    <p>• Bảo quản ở nhiệt độ mát 4°C - 7°C trong bình thủy tinh hoặc inox 304 có nắp gioăng kín.</p>
    <p>• Thời gian sử dụng tốt nhất: Trong vòng 36 giờ đầu sau khi ủ.</p>
  </div>
</div>
`;

    return {
      title: formattedTitle,
      slug,
      category: 'cong-thuc',
      categoryName: 'Công Thức Pha Chế',
      excerpt: input.excerpt || `Khám phá công thức pha chế ${beverageName} chuẩn vị đậm đà, tối ưu chi phí cost ly dưới 5.000đ và quy trình ủ cốt trà chuẩn SOP cho quán F&B.`,
      author: input.author || 'CASA R&D Team',
      readTime: '4 phút',
      date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }),
      status: 'PUBLISHED',
      image: input.image || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
      content: htmlContent,
      recipeBox: {
        title: `Công Thức Chuẩn Hóa: ${beverageName}`,
        cost: '4.800đ - 5.500đ / ly 500ml',
        ingredients: [
          '120ml Cốt trà CASA tuyển chọn (ủ chuẩn nhiệt độ)',
          '25g Bột kem béo thực vật CASA No.1',
          '20ml - 25ml Nước đường hoa quả hoặc sữa đặc',
          '180g Đá bi tinh khiết',
          'Topping tùy chọn: Trân châu đen hoặc Kem cheese mặn (35ml)'
        ],
        steps: [
          'Ủ cốt trà theo tỷ lệ 1:30 trong 13 phút, sốc nhiệt đá bi để giữ hương.',
          'Cho trà, bột béo và đường vào shaker khuấy tan nhanh.',
          'Thêm đá viên đầy shaker, lắc đều tay 15 nhịp.',
          'Rót ra ly 500ml, trang trí topping và phục vụ ngay.'
        ]
      },
      tags: ['Công thức trà sữa', 'Barista SOP', 'Tối ưu Cost ly', 'CASA R&D']
    };
  }

  if (isTrend) {
    // TEMPLATE 2: BÁO CÁO XU HƯỚNG ĐỒ UỐNG F&B 2026
    const trendTopic = rawTitle || 'Xu Hướng Trà Nguyên Liệu Đậm Vị & Healthy F&B 2026';
    const slug = `xu-huong-${trendTopic.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

    const htmlContent = `
<div class="space-y-6">
  <div class="p-5 rounded-2xl bg-[#FAF9F5] border border-tea-border text-gray-800">
    <p class="font-bold text-[#183B2B] text-base mb-1">📊 Tổng Quan Thị Trường F&B</p>
    <p class="text-sm leading-relaxed">
      Năm 2026 chứng kiến sự chuyển dịch mạnh mẽ của người tiêu dùng trẻ (Gen Z & Millennial) từ các loại đồ uống nhiều hương liệu nhân tạo sang các dòng trà đậm hương tự nhiên, hậu vị mộc mạc và minh bạch nguồn gốc nông sản.
    </p>
  </div>

  <h2 class="text-2xl font-extrabold text-[#183B2B]">1. Ba Xu Hướng Dẫn Đầu Ngành Đồ Uống</h2>
  <div class="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
    <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-2">
      <div class="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">1</div>
      <h3 class="font-bold text-gray-900 text-sm">Trà Đậm Vị Body Cao</h3>
      <p class="text-xs text-gray-600">Khách hàng ưu tiên các dòng trà có độ đầm, uống đến ngụm cuối cùng vẫn không bị nhạt do tan đá.</p>
    </div>
    <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-2">
      <div class="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">2</div>
      <h3 class="font-bold text-gray-900 text-sm">Hương Vị Rang Than (Roast)</h3>
      <p class="text-xs text-gray-600">Sự bùng nổ của Trà Ô Long nướng, Hojicha rang khói và Cà phê ủ lạnh kết hợp trà.</p>
    </div>
    <div class="p-4 rounded-xl bg-white border border-gray-200 shadow-sm space-y-2">
      <div class="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">3</div>
      <h3 class="font-bold text-gray-900 text-sm">Nền Trà Trái Cây Tươi Mới</h3>
      <p class="text-xs text-gray-600">Trà xanh nhài tuyết hoa kết hợp các loại trái cây bản địa: mận hậu, mãng cầu xiêm, dưa lưới.</p>
    </div>
  </div>

  <h2 class="text-2xl font-extrabold text-[#183B2B]">2. Lời Khuyên Chiến Lược Cho Chủ Chuỗi & R&D Menu</h2>
  <p class="text-sm text-gray-700 leading-relaxed">
    Để tối ưu hóa biên lợi nhuận trong bối cảnh giá vốn mặt bằng tăng cao, các chủ thương hiệu cần chuẩn hóa quy trình chiết xuất cốt trà tập trung, giảm phụ thuộc vào tay nghề nhân viên pha chế theo ca, và hợp tác trực tiếp với các nhà sản xuất nguyên liệu đầu nguồn để có chính sách giá sỉ ổn định lâu dài.
  </p>
</div>
`;

    return {
      title: trendTopic,
      slug,
      category: 'xu-huong',
      categoryName: 'Xu Hướng Đồ Uống',
      excerpt: input.excerpt || `Phân tích chuyên sâu về làn sóng đồ uống mới năm 2026: Trà đậm vị tự nhiên, công nghệ rang khói và giải pháp tối ưu chi phí cho các chuỗi cafe & trà sữa.`,
      author: input.author || 'Chuyên Gia F&B CASA',
      readTime: '5 phút',
      date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }),
      status: 'PUBLISHED',
      image: input.image || 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=800&q=80',
      content: htmlContent,
      tags: ['Xu hướng F&B 2026', 'Thị trường trà sữa', 'Tối ưu Menu', 'Chiến lược F&B']
    };
  }

  // TEMPLATE 3: KIẾN THỨC KỸ THUẬT R&D TRÀ (KNOWLEDGE)
  const knowledgeTitle = rawTitle || 'Bí Quyết Kiểm Soát Độ Chát Đắng & Tinh Dầu Khi Chiết Xuất Cốt Trà B2B';
  const slug = `kien-thuc-${knowledgeTitle.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;

  const htmlContent = `
<div class="space-y-6">
  <div class="p-5 rounded-2xl bg-tea-mist border-l-4 border-tea-emerald text-gray-800">
    <p class="font-bold text-tea-dark text-base mb-1">🔬 Cơ Chế Hóa Sinh Của Lá Trà</p>
    <p class="text-sm leading-relaxed">
      Vị của ly trà là sự cân bằng vi tế giữa <strong>Tanin (Polyphenol)</strong> tạo độ chát, <strong>Caffeine</strong> tạo độ đắng êm, và <strong>Theanine (Axit amin)</strong> tạo vị ngọt umami sâu.
    </p>
  </div>

  <h2 class="text-2xl font-extrabold text-tea-dark">1. Nguyên Nhân Khiến Cốt Trà Bị Đục (Cloudy Tea) & Cách Khắc Phục</h2>
  <p class="text-sm text-gray-700 leading-relaxed">
    Hiện tượng đục nước khi làm lạnh (Tea Creaming) xảy ra khi phức hợp giữa caffeine và theaflavin bị kết tủa ở nhiệt độ dưới 10°C. Để nước cốt trà luôn sáng bóng, tuyệt đối không cho bã trà tiếp xúc với nước quá 98°C trong thời gian kéo dài, và phải thực hiện kỹ thuật <strong>Sốc nhiệt bằng đá bi ngay lập tức</strong> sau khi lọc bã.
  </p>

  <h2 class="text-2xl font-extrabold text-tea-dark">2. Ba Yếu Tố Quyết Định Nồng Độ TDS Chuẩn</h2>
  <ul class="list-disc pl-5 space-y-2 text-sm text-gray-700">
    <li><strong>Nguồn nước pha:</strong> Phải sử dụng nước qua hệ thống lọc RO có chỉ số TDS nước vào khoảng 30 - 60 ppm. Nước cứng chứa nhiều canxi sẽ làm biến tính mùi thơm của búp trà non.</li>
    <li><strong>Kích thước mảnh lá trà:</strong> Cắt lá chuẩn BOP (Broken Orange Pekoe) cho tốc độ thoát hương nhanh gấp 2.5 lần so với lá nguyên búp, rất thích hợp với mô hình quán bán nhanh (High Traffic).</li>
    <li><strong>Độ kín của bình ủ:</strong> Mất nắp đậy trong 5 phút đầu tiên có thể làm thất thoát tới 40% hợp chất thơm Linalool và Geraniol quý giá.</li>
  </ul>
</div>
`;

  return {
    title: knowledgeTitle,
    slug,
    category: 'kien-thuc',
    categoryName: 'Kiến Thức Trà & R&D',
    excerpt: input.excerpt || `Khám phá các nguyên lý khoa học đằng sau quy trình ủ cốt trà: Kiểm soát độ đục, đo lường TDS và bảo toàn trọn vẹn hương tinh dầu tự nhiên.`,
    author: input.author || 'Phòng Lab QC & R&D CASA',
    readTime: '6 phút',
    date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }),
    status: 'PUBLISHED',
    image: input.image || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
    content: htmlContent,
    tags: ['Kỹ thuật ủ trà', 'Khoa học F&B', 'Phòng Lab R&D', 'Đo lường TDS']
  };
}

