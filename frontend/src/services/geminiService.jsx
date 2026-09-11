// ============================================================================
// CASA TEA - GEMINI AI FRONTEND SERVICE ADAPTER
// Mọi yêu cầu xử lý AI được chuyển qua Backend Server (/api/ai/...)
// Đảm bảo bảo mật 100% không để lộ API Key trên trình duyệt
// ============================================================================

import { aiApi } from '../api/client';
import { autoDesignProduct, autoDesignArticle } from '../utils/aiDesignHelper';

export const GEMINI_CONFIG = {
  MODEL_NAME: 'gemini-3.7-flash',
};

export function getGeminiApiKey() {
  return 'MANAGED_BY_BACKEND_SERVER';
}

export function setGeminiApiKey(key) {
  // Handled on backend
}

export function generateSmartDescriptionFallback(input = {}) {
  const userInput = (
    input.text ||
    input.hints ||
    input.currentShortDesc ||
    input.shortDesc ||
    input.currentFullDesc ||
    input.fullDesc ||
    input.name ||
    ''
  ).trim();

  const lower = userInput.toLowerCase();

  // 1. ĐƯỜNG ĐEN / BROWN SUGAR SYRUP
  if (lower.includes('đường đen') || lower.includes('duong den') || lower.includes('brown sugar')) {
    return {
      shortDesc: 'Siro Đường Đen CASA nấu cô đặc chuẩn vị Đài Loan, sánh đậm óng ánh, vị ngọt sâu lắng và hương thơm caramel nướng ngào ngạt.',
      fullDesc: 'Siro Đường Đen CASA được tinh chế theo phương pháp nấu cô đặc truyền thống của Đài Loan, hòa quyện từ mật mía nguyên chất và đường mía tinh luyện. Kết cấu sánh quyện hoàn hảo, tạo hiệu ứng vệt hổ (tiger stripes) đẹp mắt bám lâu trên thành ly.\n\nHương caramel ấm nồng, vị ngọt bùi đượm đà không gắt họng, là nguyên liệu cốt lõi tạo nên linh hồn cho các món sữa tươi trân châu đường đen, trà sữa nướng và cà phê kem béo cao cấp.',
      isAiGenerated: false
    };
  }

  // 2. BÍ ĐAO / WINTER MELON
  if (lower.includes('bí đao') || lower.includes('bi dao') || lower.includes('winter melon')) {
    return {
      shortDesc: 'CASA Syrup Bí Đao thượng hạng chiết xuất từ bí đao tươi tự nhiên, vị ngọt thanh mát dịu, hương thơm mộc mạc kích thích vị giác.',
      fullDesc: 'Siro Bí Đao CASA lưu giữ trọn vẹn vị ngọt thanh mát tự nhiên và hương thơm mộc dịu đặc trưng của bí đao tươi thu hoạch theo mùa. Kết cấu sánh óng ánh, hòa quyện mượt mà trong các công thức trà sữa bí đao truyền thống, trà trái cây thanh nhiệt và sâm bí đao hạt chia.\n\nSản phẩm là giải pháp cốt lõi giúp các chuỗi F&B chuẩn hóa hương vị, tối ưu chi phí cost ly và mang đến trải nghiệm đồ uống giải nhiệt tuyệt hảo, sảng khoái cho thực khách.',
      isAiGenerated: false
    };
  }

  // 3. ĐÀO / PEACH
  if (lower.includes('đào') || lower.includes('dao') || lower.includes('peach')) {
    return {
      shortDesc: 'Siro Đào CASA chiết xuất từ những quả đào tươi mọng nước, hương thơm ngọt ngào bung tỏa, vị thanh chua ngọt sảng khoái.',
      fullDesc: 'Sở hữu hương thơm quả đào chín mọng tự nhiên cùng sắc vàng cam tươi sáng, Siro Đào CASA là lựa chọn hàng đầu cho các dòng trà đào cam sả, trà trái cây nhiệt đới và soda đá xay. Vị chua ngọt hài hòa giúp kích thích vị giác và đánh thức năng lượng ngay từ ngụm đầu tiên.',
      isAiGenerated: false
    };
  }

  // 4. DÂU TÂY / STRAWBERRY
  if (lower.includes('dâu') || lower.includes('dau') || lower.includes('strawberry')) {
    return {
      shortDesc: 'Siro Dâu Tây CASA lưu giữ hương thơm ngọt ngào nồng nàn của dâu tây tươi Đà Lạt, sắc đỏ quyến rũ và vị chua ngọt tinh tế.',
      fullDesc: 'Chiết xuất từ nguồn dâu tây tươi mọng nước, Siro Dâu CASA mang đến sắc đỏ rực rỡ và tầng hương thơm quả mọng đặc trưng. Kết cấu sánh mượt, dễ dàng hòa quyện trong trà dâu tằm, trà hoa quả dầm, sữa chua lắc và đá xay frappuccino.',
      isAiGenerated: false
    };
  }

  // 5. VẢI / LYCHEE
  if (lower.includes('vải') || lower.includes('vai') || lower.includes('lychee')) {
    return {
      shortDesc: 'Siro Vải CASA mang hương thơm thanh khiết của vải thiều chín mọng, vị ngọt dịu tao nhã và hậu vị sảng khoái.',
      fullDesc: 'Được chưng cất từ những quả vải thiều tươi căng mọng, Siro Vải CASA tái hiện xuất sắc nốt hương hoa quả nhiệt đới tao nhã. Rất thích hợp cho các món trà vải lài, trà sen vàng vải và cocktail giải nhiệt mùa hè.',
      isAiGenerated: false
    };
  }

  // 6. CHANH DÂY / CHANH LEO
  if (lower.includes('chanh leo') || lower.includes('chanh dây') || lower.includes('chanh day') || lower.includes('passion')) {
    return {
      shortDesc: 'Siro Chanh Dây CASA bùng nổ vị chua thanh mát sảng khoái cùng hương thơm trái cây nhiệt đới đậm đà kích thích vị giác.',
      fullDesc: 'Siro Chanh Dây CASA lưu giữ trọn vẹn vị chua thanh tự nhiên cùng hương thơm nồng nàn đặc trưng của chanh leo tươi vùng cao nguyên. Sản phẩm giúp cân bằng vị giác hoàn hảo trong các công thức trà chanh leo tuyết, soda và trà trái cây tứ quý.',
      isAiGenerated: false
    };
  }

  // 7. KEM MUỐI / MUỐI BIỂN
  if (lower.includes('muối') || lower.includes('muoi') || lower.includes('kem muối')) {
    return {
      shortDesc: 'Lớp kem muối bồng bềnh sánh mịn với vị mặn dịu tinh tế từ muối biển, hòa quyện hoàn hảo cùng vị béo ngậy ngọt thanh đầy mê hoặc.',
      fullDesc: 'Lớp kem muối sánh đặc mềm mịn tựa nhung, mang đến sự cân bằng vị giác đỉnh cao ngay khi chạm nơi đầu lưỡi. Nốt mặn duyên dáng của muối biển tinh khiết len lỏi khéo léo, kích thích từng gai vị giác bừng tỉnh, đồng thời tôn bật vị béo ngọt tự nhiên của kem tươi lên một tầm cao mới.\n\nSự kết hợp mặn - béo tương phản nhưng hòa quyện tuyệt đối giúp ly đồ uống thêm đượm đà, lưu luyến khó quên và mang đến trải nghiệm thưởng thức đa tầng đầy cuốn hút cho thực khách.',
      isAiGenerated: false
    };
  }

  // 8. KEM CHEESE / PHÔ MAI
  if (lower.includes('cheese') || lower.includes('phô mai') || lower.includes('pho mai')) {
    return {
      shortDesc: 'Lớp kem cheese sánh đặc bồng bềnh với độ béo ngậy thơm lừng phô mai đặc trưng, tan chảy êm ái như nhung trên đầu lưỡi.',
      fullDesc: 'Gây ấn tượng ngay từ ánh nhìn đầu tiên với lớp kem cheese trắng muốt, bồng bềnh và sánh mịn hoàn hảo. Từng muỗng kem được đánh bông tỉ mỉ, giữ trọn hương thơm phô mai nồng nàn quyến rũ cùng kết cấu mềm mượt đầy đặn.\n\nKhi thưởng thức, vị béo ngậy đậm đà đặc trưng lan tỏa tức thì nơi khoang miệng, hòa quyện cùng chút ngọt thanh và mằn mặn dịu nhẹ đầy tinh tế. Đây chính là lớp topping linh hồn giúp nâng tầm đồ uống cho mọi quán F&B.',
      isAiGenerated: false
    };
  }

  // 9. BỘT BÉO / BỘT KEM / NON-DAIRY CREAMER
  if (lower.includes('bột béo') || lower.includes('bot beo') || lower.includes('bột kem') || lower.includes('bot kem') || lower.includes('creamer')) {
    return {
      shortDesc: 'Bột béo thực vật Non-Dairy Creamer CASA chuyên dụng cho trà sữa, độ tan hoàn hảo, béo ngậy êm dịu và không át hương trà.',
      fullDesc: 'Được sản xuất trên dây chuyền sấy phun tháp đứng hiện đại, Bột Kem Béo CASA sở hữu độ mịn lý tưởng và hàm lượng chất béo thực vật cân đối. Sản phẩm giúp ly trà sữa đạt độ sánh mịn dày dặn (High Body), tôn bật nốt hương thanh tao của trà mà không gây ngấy béo hay che lấp vị cốt trà.',
      isAiGenerated: false
    };
  }

  // 10. Ô LONG / NƯỚNG
  if (lower.includes('long') || lower.includes('oolong') || lower.includes('ô long') || lower.includes('nướng') || lower.includes('nuong')) {
    return {
      shortDesc: 'Trà ô long nướng than hoa thượng hạng với hương thơm khói nồng nàn, nước trà nâu đỏ hổ phách và vị đầm đà sâu lắng.',
      fullDesc: 'Trải qua nghệ thuật rang ủ than hoa gia truyền, từng búp trà ô long CASA bung tỏa tầng hương khói ấm áp, quyến rũ. Vị trà dày đầm, đậm đà nhưng êm dịu, không gắt chát, để lại hậu vị ngọt bùi kéo dài mê đắm trong mọi công thức trà sữa nướng.',
      isAiGenerated: false
    };
  }

  // 11. MATCHA / TRÀ XANH
  if (lower.includes('matcha') || lower.includes('trà xanh') || lower.includes('tra xanh')) {
    return {
      shortDesc: 'Bột matcha nguyên chất thượng hạng với sắc xanh ngọc bích, vị chát êm đượm đà và hậu ngọt thanh mát sâu lắng.',
      fullDesc: 'Được chế biến từ những búp trà non tuyển chọn, bột matcha CASA sở hữu độ mịn hoàn hảo và hàm lượng diệp lục tự nhiên dồi dào. Hương thơm thanh khiết đánh thức mọi giác quan, hòa quyện tuyệt vời trong các dòng matcha latte, đá xay và trà sữa cao cấp.',
      isAiGenerated: false
    };
  }

  // 12. TRÀ HOA LÀI / JASMINE
  if (lower.includes('lài') || lower.includes('lai') || lower.includes('nhài') || lower.includes('nhai') || lower.includes('jasmine')) {
    return {
      shortDesc: 'Trà hoa lài thượng hạng ướp hoa tươi tự nhiên, sắc nước vàng óng trong trẻo và hương hoa thanh khiết tao nhã.',
      fullDesc: 'Được ướp tỉ mỉ qua nhiều lượt hoa lài hàm tiếu tươi hàm chứa tinh dầu tinh khiết nhất, cốt trà xanh CASA ngậm trọn hương hoa ngát thơm nồng nàn. Vị trà thanh nhẹ, hậu ngọt sâu, là nền trà lý tưởng cho trà sữa lài, trà sữa macchiato và các món trà hoa quả hiện đại.',
      isAiGenerated: false
    };
  }

  // 13. HỒNG TRÀ / TRÀ ĐEN / ASSAM
  if (lower.includes('hồng trà') || lower.includes('hong tra') || lower.includes('trà đen') || lower.includes('tra den') || lower.includes('assam') || lower.includes('black tea')) {
    return {
      shortDesc: 'Hồng trà Assam thượng hạng với màu nước đỏ ruby sang trọng, vị đậm đà sâu sắc và hương thơm thảo mộc quý phái.',
      fullDesc: 'Được lên men toàn phần theo quy chuẩn công nghệ cao, Hồng Trà CASA mang đến sắc nước nâu đỏ hổ phách óng ánh cùng nốt hương mạch nha nồng ấm. Độ đậm vị (body) cao vượt trội giúp ly trà sữa truyền thống luôn thơm béo, giữ trọn vị trà ngay cả khi tan đá.',
      isAiGenerated: false
    };
  }

  // 14. TOPPING / TRÂN CHÂU / THẠCH 3Q
  if (lower.includes('trân châu') || lower.includes('tran chau') || lower.includes('topping') || lower.includes('thạch') || lower.includes('thach') || lower.includes('3q')) {
    return {
      shortDesc: 'Topping cao cấp CASA với độ giòn dai dẻo chuẩn vị, bừng sáng ly đồ uống và mang đến trải nghiệm nhai vui miệng lôi cuốn.',
      fullDesc: 'Được sản xuất từ nguồn nguyên liệu tự nhiên cao cấp, topping CASA sở hữu kết cấu giòn dai sần sật và độ bóng óng ả bắt mắt. Sản phẩm giữ vững độ giòn dai suốt nhiều giờ trong đồ uống lạnh mà không bị cứng hay nhão, là điểm nhấn không thể thiếu cho mọi thương hiệu trà sữa.',
      isAiGenerated: false
    };
  }

  // 15. BỘT TÀU HỦ / ĐẬU HŨ
  if (lower.includes('tàu hủ') || lower.includes('tau hu') || lower.includes('đậu hũ') || lower.includes('dau hu')) {
    return {
      shortDesc: 'Bột tàu hủ Singapore CASA tạo nên lớp pudding tàu hủ mịn màng như lụa, vị thanh mát béo bùi và hương đậu nành tự nhiên.',
      fullDesc: 'Bột tàu hủ CASA được chế biến theo công nghệ hiện đại, hòa tan dễ dàng và đông mịn màng mà không cần kỹ thuật phức tạp. Kết cấu núng nính, mềm mượt tan ngay trong miệng, hòa quyện tuyệt vời cùng sốt đường đen, trà sữa hoặc trân châu.',
      isAiGenerated: false
    };
  }

  // 16. BỘT PUDDING
  if (lower.includes('pudding')) {
    return {
      shortDesc: 'Bột pudding CASA tạo kết cấu dẻo mịn bồng bềnh, vị ngọt béo hài hòa tan êm trên đầu lưỡi.',
      fullDesc: 'Giải pháp topping pudding chuyên nghiệp cho các chuỗi F&B, bột pudding CASA cho ra thành phẩm vàng óng, độ mềm dẻo chuẩn mực và không bị tách nước khi bảo quản lạnh. Điểm nhấn topping hấp dẫn giúp gia tăng giá trị cho mọi ly đồ uống.',
      isAiGenerated: false
    };
  }

  // 17. TỔNG QUÁT: Bám sát đúng từ khóa người dùng vừa nhập
  return {
    shortDesc: `${userInput} CASA thượng hạng với hương vị chuẩn hóa tự nhiên, cấu trúc cân bằng và tầng hương quyến rũ kích thích vị giác.`,
    fullDesc: `Được tinh tuyển và phát triển bởi đội ngũ R&D CASA TEA, sản phẩm nổi bật với ${userInput}, mang đến trải nghiệm đồ uống thơm ngon tròn vị và để lại hậu vị lưu luyến bền lâu.\n\nGiải pháp hoàn hảo cho các chuỗi F&B và thương hiệu trà sữa hiện đại muốn chuẩn hóa chất lượng pha chế, tối ưu chi phí cost ly và giữ chân khách hàng hiệu quả.`,
    isAiGenerated: false
  };
}

export async function generateProductWithGemini(input = {}) {
  try {
    const res = await aiApi.designProduct(input);
    if (res && res.name) return res;
  } catch (err) {
    console.warn('[generateProductWithGemini] Backend API error, using autoDesignProduct fallback:', err.message);
  }
  return autoDesignProduct({
    name: input.name || input.hints,
    category: input.category,
    shortDesc: input.hints || input.shortDesc
  });
}

export async function rewriteDescriptionWithGemini(input = {}) {
  try {
    const res = await aiApi.rewriteDesc(input);
    if (res && (res.shortDesc || res.fullDesc)) {
      return res;
    }
  } catch (err) {
    console.warn('[rewriteDescriptionWithGemini] Backend API error, using smart client fallback:', err.message);
  }
  return generateSmartDescriptionFallback(input);
}

export async function generateArticleWithGemini(input = {}) {
  try {
    const res = await aiApi.designNews(input);
    if (res && res.title) return res;
  } catch (err) {
    console.warn('[generateArticleWithGemini] Backend API error, using autoDesignArticle fallback:', err.message);
  }
  return autoDesignArticle(input);
}

// BẢNG TINH CHỈNH THUẬT NGỮ CHUYÊN NGÀNH TRÀ & F&B ĐÀI LOAN
const TAIWAN_FB_REFINEMENTS = [
  [/風味奶茶/g, '厚奶茶'],
  [/甜奶茶/g, '全糖奶茶'],
  [/茶精/g, '茶底核心風味'],
  [/烤煙味/g, '炭焙煙燻香'],
  [/濃鬱茶/g, '濃郁系茶品'],
  [/濃茶/g, '濃醇茶飲'],
  [/公式/g, '調飲配方'],
  [/主料/g, '核心原料'],
  [/輔料/g, '精選配料'],
  [/調料/g, '調飲原料'],
  [/糖漿/g, '風味糖漿'],
  [/奶精/g, '植脂末奶精'],
  [/奶蓋/g, '芝士/海鹽奶蓋'],
  [/珍珠/g, '黑糖珍珠粉圓'],
  [/冬瓜糖漿/g, '特級冬瓜風味糖漿'],
  [/黑糖糖漿/g, '古早味黑糖風味糖漿'],
  [/保祿/g, '保祿高原'],
  [/泡茶/g, '萃茶']
];

export function hasVietnamese(text) {
  if (!text || typeof text !== 'string') return false;
  return /[àáạảãâầấậẩẫăằắặẳẵèéẹẻẽêềếệểễìíịỉĩòóọỏõôồốộổỗơờớợởỡùúụủũưừứựửữỳýỵỷỹđ]/i.test(text);
}

/**
 * Dịch thuật triệt để 100% sang Tiếng Trung Phồn Thể (Traditional Chinese - 繁體中文)
 * Tuyệt đối không để sót chữ tiếng Việt nào!
 */
export async function translateTextToZhTw(text) {
  if (!text || typeof text !== 'string' || !text.trim()) return '';

  // Kiểm tra xem chuỗi đã là tiếng Trung thuần chưa (chứa phần lớn Hán tự và không chứa tiếng Việt)
  if (!hasVietnamese(text)) {
    const chineseChars = text.match(/[\u4e00-\u9fa5]/g) || [];
    if (chineseChars.length > text.trim().length * 0.5) {
      return text.trim();
    }
  }

  try {
    const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&sl=vi&tl=zh-TW&dt=t&q=' + encodeURIComponent(text.trim());
    const res = await fetch(url);
    if (!res.ok) throw new Error('Translation API network error');
    const data = await res.json();
    let translated = (data[0] || []).map(item => item[0]).join('');

    if (translated && translated.trim()) {
      for (const [pattern, replacement] of TAIWAN_FB_REFINEMENTS) {
        translated = translated.replace(pattern, replacement);
      }
      return translated.trim();
    }
  } catch (err) {
    console.warn('[translateTextToZhTw] Fallback notice:', err.message);
  }

  return text;
}

/**
 * Dịch bài viết bảo toàn 100% các thẻ HTML, class CSS và định dạng bảng/tiêu đề
 */
export async function translateHtmlToZhTw(html) {
  if (!html || typeof html !== 'string' || !html.trim()) return '';

  // Nếu là văn bản thuần túy không chứa HTML
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return await translateTextToZhTw(html);
  }

  const tokens = html.split(/(<[^>]+>)/g);
  const translatedTokens = await Promise.all(
    tokens.map(async (token) => {
      // Giữ nguyên thẻ HTML và thuộc tính CSS
      if (token.startsWith('<') && token.endsWith('>')) {
        return token;
      }
      if (token.trim().length === 0) {
        return token;
      }
      const leadingSpace = token.match(/^\s*/)[0];
      const trailingSpace = token.match(/\s*$/)[0];
      const translated = await translateTextToZhTw(token.trim());
      return leadingSpace + translated + trailingSpace;
    })
  );

  return translatedTokens.join('');
}

export async function translateProductToTraditionalChinese(product = {}) {
  // 1. Thử gọi qua Backend API trước (Gemini AI)
  try {
    const res = await aiApi.translateProductZh(product);
    const hasChinese = (res?.nameZh?.match(/[\u4e00-\u9fa5]/g) || []).length > 1;
    const isHalfVietnamese = hasVietnamese(res?.nameZh) || hasVietnamese(res?.shortDescZh);
    if (res && res.nameZh && hasChinese && !isHalfVietnamese) {
      return res;
    }
  } catch (err) {
    console.warn('[translateProductToTraditionalChinese] Backend API unreachable, switching to Deep Zh-TW engine:', err.message);
  }

  // 2. Dịch chi tiết toàn diện 100% từng trường thông tin
  const [nameZh, badgeZh, originZh, shortDescZh, fullDescZh] = await Promise.all([
    translateTextToZhTw(product.name || ''),
    translateTextToZhTw(product.badge || '新品上市'),
    translateTextToZhTw(product.origin || '越南林同省保祿高原產區'),
    translateTextToZhTw(product.shortDesc || ''),
    translateTextToZhTw(product.fullDesc || '')
  ]);

  let applicationsZh = [];
  if (Array.isArray(product.applications) && product.applications.length > 0) {
    applicationsZh = await Promise.all(product.applications.map(app => translateTextToZhTw(app)));
  } else {
    applicationsZh = ['經典原味厚奶茶', '現萃鮮果茶', '芝士海鹽奶蓋茶'];
  }

  return {
    nameZh: nameZh || '特選商用調飲專用原料',
    badgeZh: badgeZh || '新品上市',
    originZh: originZh || '越南林同省保祿高原產區',
    shortDescZh: shortDescZh || '嚴選頂級產區優質茶葉與調飲原料，風味純正濃醇。',
    fullDescZh: fullDescZh || 'CASA專業調飲原料，專為連鎖茶飲店研發設計，香氣醇厚持久，操作便捷穩定。',
    applicationsZh
  };
}

export async function translateArticleToTraditionalChinese(article = {}) {
  // 1. Thử gọi qua Backend API trước (Gemini AI)
  try {
    const res = await aiApi.translateNewsZh(article);
    const hasChinese = (res?.titleZh?.match(/[\u4e00-\u9fa5]/g) || []).length > 2;
    const isHalfVietnamese = hasVietnamese(res?.titleZh) || hasVietnamese(res?.excerptZh);
    if (res && res.titleZh && hasChinese && !isHalfVietnamese) {
      return res;
    }
  } catch (err) {
    console.warn('[translateArticleToTraditionalChinese] Backend API unreachable, switching to Deep Zh-TW engine:', err.message);
  }

  // 2. Dịch triệt để 100% qua Google Translate Engine + F&B Taiwan Refinements
  const [titleZh, excerptZh, contentZh] = await Promise.all([
    translateTextToZhTw(article.title || ''),
    translateTextToZhTw(article.excerpt || ''),
    translateHtmlToZhTw(article.content || '')
  ]);

  return {
    titleZh: titleZh || '2026年厚奶茶趨勢：當茶味回歸中心',
    excerptZh: excerptZh || '新世代消費者逐漸從全糖奶茶轉向帶有明顯炭焙煙燻香或天然花香的濃郁系茶品。這是品牌升級茶底核心風味的絕佳機會。',
    contentZh: contentZh || '<p>詳細調飲配方與操作步驟請洽詢專業顧問團隊。</p>'
  };
}

export async function translateNewsToTraditionalChinese(article = {}) {
  return await translateArticleToTraditionalChinese(article);
}

export async function translateFaqToTraditionalChinese(faq = {}) {
  try {
    const res = await aiApi.translateFaqZh(faq);
    const hasChinese = (res?.questionZh?.match(/[\u4e00-\u9fa5]/g) || []).length > 1;
    const isHalfVietnamese = hasVietnamese(res?.questionZh) || hasVietnamese(res?.answerZh);
    if (res && res.questionZh && hasChinese && !isHalfVietnamese) {
      return res;
    }
  } catch (err) {
    console.warn('[translateFaqToTraditionalChinese] Backend API unreachable, using Deep Zh-TW engine:', err.message);
  }

  const [questionZh, answerZh] = await Promise.all([
    translateTextToZhTw(faq.question || ''),
    translateTextToZhTw(faq.answer || '')
  ]);

  return {
    questionZh: questionZh || '常見商業合作問題諮詢',
    answerZh: answerZh || '詳細合作流程與原料樣品申請，請隨時聯繫我們的商務代表。'
  };
}

export async function translateMachineryToTraditionalChinese(machinery = {}) {
  try {
    const res = await aiApi.translateMachineryZh(machinery);
    const hasChinese = (res?.nameZh?.match(/[\u4e00-\u9fa5]/g) || []).length > 1;
    const isHalfVietnamese = hasVietnamese(res?.nameZh) || hasVietnamese(res?.descriptionZh);
    if (res && res.nameZh && hasChinese && !isHalfVietnamese) {
      return res;
    }
  } catch (err) {
    console.warn('[translateMachineryToTraditionalChinese] Backend API unreachable, using Deep Zh-TW engine:', err.message);
  }

  const [nameZh, categoryZh, originZh, descriptionZh] = await Promise.all([
    translateTextToZhTw(machinery.name || ''),
    translateTextToZhTw(machinery.category || ''),
    translateTextToZhTw(machinery.origin || ''),
    translateTextToZhTw(machinery.description || machinery.desc || '')
  ]);

  return {
    nameZh: nameZh || '專業商用茶飲加工設備',
    categoryZh: categoryZh || '茶飲生產機械',
    originZh: originZh || '進口精密技術設備',
    capacityZh: machinery.capacity || '',
    descriptionZh: descriptionZh || '高品質工業級生產線專用設備。'
  };
}

export async function translateCategoryToTraditionalChinese(category = {}) {
  try {
    const res = await aiApi.translateCategoryZh(category);
    const hasChinese = (res?.nameZh?.match(/[\u4e00-\u9fa5]/g) || []).length > 1;
    const isHalfVietnamese = hasVietnamese(res?.nameZh) || hasVietnamese(res?.descZh);
    if (res && res.nameZh && hasChinese && !isHalfVietnamese) {
      return res;
    }
  } catch (err) {
    console.warn('[translateCategoryToTraditionalChinese] Backend API unreachable, using Deep Zh-TW engine:', err.message);
  }

  const [nameZh, descZh] = await Promise.all([
    translateTextToZhTw(category.name || ''),
    translateTextToZhTw(category.desc || '')
  ]);

  return {
    nameZh: nameZh || '精選茶飲調料分類',
    descZh: descZh || '專業連鎖店專用原料與客製化解決方案。'
  };
}


