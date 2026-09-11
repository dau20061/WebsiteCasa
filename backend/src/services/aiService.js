// ============================================================================
// CASA TEA - GEMINI AI INTEGRATION SERVICE
// Model: gemini-3.6-flash | Google Generative Language API
// Tự động viết lại mô tả sản phẩm, gợi ý thông số cảm quan & bài viết chuyên nghiệp F&B
// ============================================================================

import { autoDesignProduct, autoDesignArticle } from './aiDesignHelper.js';
import dotenv from 'dotenv';
import path from 'path';
dotenv.config();
try {
  dotenv.config({ path: path.resolve(process.cwd(), 'backend/.env') });
} catch (e) {}

export const GEMINI_CONFIG = {
  MODEL_NAME: 'gemini-3.6-flash',
  API_BASE_URL: 'https://generativelanguage.googleapis.com/v1beta'
};

/**
 * Lấy API Key hiện hành (ưu tiên biến môi trường Backend .env)
 */
export function getGeminiApiKey() {
  return process.env.GEMINI_API_KEY || '';
}

/**
 * Lưu API Key tùy chỉnh vào localStorage
 */
export function setGeminiApiKey(key) {
  if (typeof window !== 'undefined') {
    if (key && key.trim()) {
      localStorage.setItem('casa_gemini_api_key', key.trim());
    } else {
      localStorage.removeItem('casa_gemini_api_key');
    }
  }
}

/**
 * Gọi API Google Generative Language trực tiếp
 */
async function callGeminiApi({ prompt, systemInstruction = '' }) {
  const apiKey = getGeminiApiKey();
  // Ưu tiên các model khả dụng trong năm 2026 (gemini-3.6-flash hoạt động ổn định nhất)
  const modelsToTry = ['gemini-3.6-flash', 'gemini-3.7-flash', 'gemini-flash-latest', GEMINI_CONFIG.MODEL_NAME];
  let lastError = null;

  for (const model of modelsToTry) {
    try {
      const url = `${GEMINI_CONFIG.API_BASE_URL}/models/${model}:generateContent?key=${apiKey}`;

      const payload = {
        contents: [
          {
            role: 'user',
            parts: [{ text: prompt }]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topP: 0.95,
          responseMimeType: 'application/json'
        }
      };

      if (systemInstruction) {
        payload.systemInstruction = {
          parts: [{ text: systemInstruction }]
        };
      }

      // Timeout 25s cho mỗi lần gọi để AI có đủ thời gian xử lý bài viết dài và phản hồi đầy đủ
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 25000);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errMsg = errorData.error?.message || `HTTP ${response.status}: ${response.statusText}`;
        throw new Error(`Gemini API (${model}) Error: ${errMsg}`);
      }

      const data = await response.json();
      const candidate = data.candidates?.[0];
      if (!candidate || !candidate.content?.parts?.[0]?.text) {
        throw new Error(`Model ${model} không trả về kết quả hợp lệ.`);
      }

      const text = candidate.content.parts[0].text;
      try {
        return JSON.parse(text);
      } catch (parseErr) {
        const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
      }
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini AI] Thử model ${model} gặp sự cố:`, err.message);
    }
  }

  throw lastError || new Error('Không thể kết nối các model Gemini API.');
}

/**
 * 1. DÙNG GEMINI THIẾT KẾ TOÀN BỘ SẢN PHẨM TỪ GỢI Ý
 * @param {Object} input - { hints, name, category, shortDesc, fullDesc, origin }
 */
export async function generateProductWithGemini(input = {}) {
  const hints = (input.hints || input.name || input.shortDesc || '').trim();
  const currentCategory = input.category || 'tra-den';
  const currentName = input.name || '';

  const prompt = `
Bạn là chuyên gia R&D và Giám đốc Marketing cao cấp của thương hiệu CASA TEA.
Người dùng vừa cung cấp các gợi ý / từ khóa về sản phẩm: "${hints || 'Nguyên liệu F&B cao cấp'}".
- Tên hiện tại (nếu có): "${currentName}"
- Danh mục mục tiêu: "${currentCategory}"

QUY TẮC CỐT LÕI (BẮT BUỘC BÁM SÁT Ý NGƯỜI DÙNG):
1. PHẢI BÁM SÁT ĐÚNG THÀNH PHẦN & TỪ KHÓA NGƯỜI DÙNG NHẬP:
   - Nếu người dùng nhập "kem muối": Sản phẩm phải là Lớp Kem Muối / Bột Kem Muối Biển, miêu tả vị mặn ngon đặc trưng của muối biển kết hợp lớp kem béo mịn. TUYỆT ĐỐI KHÔNG tự bịa ra đồi chè hay búp trà nếu người dùng không nhắc tới trà.
   - Nếu người dùng nhập "kem cheese" / "phô mai": Tập trung vào vị béo ngậy, sánh mịn, bồng bềnh của phô mai.
   - Nếu người dùng nhập loại trà cụ thể (ô long nướng, sen, lài, đen...): Miêu tả đúng tính chất và tầng hương của loại trà đó.
   - Nếu người dùng nhập trái cây (đào, dâu, chanh...): Miêu tả sự tươi mới, mọng nước, chua ngọt sảng khoái.
2. Tên sản phẩm, mô tả ngắn, mô tả chi tiết, cảm quan và ứng dụng đều phải xoay quanh ĐÚNG NGUYÊN LIỆU VÀ Ý CỦA NGƯỜI DÙNG.

YÊU CẦU ĐỊNH DẠNG TRẢ VỀ JSON:
{
  "name": "Tên sản phẩm thương mại B2B sang trọng, đúng bản chất nguyên liệu người dùng nhập",
  "badge": "Huy hiệu thu hút (Ví dụ: Best Seller F&B 2026, Vị Mặn Béo Độc Bản, Béo Ngậy Sánh Mịn)",
  "shortDesc": "Mô tả ngắn 1-2 câu (khoảng 35-45 từ) làm bật lên đúng hương vị đặc trưng mà người dùng đã nhập",
  "fullDesc": "Mô tả chi tiết 2-3 đoạn văn sống động: Đoạn 1 đi sâu vào kết cấu và vị giác đặc trưng (vị mặn tinh tế, béo ngậy, thanh khiết...); Đoạn 2 miêu tả sự bùng nổ hương vị khi kết hợp trong ly đồ uống; Đoạn 3 khẳng định giá trị tạo món signature cuốn khách cho quán F&B.",
  "origin": "Vùng nguyên liệu / xuất xứ phù hợp (Ví dụ: Muối biển tinh khiết Sa Huỳnh & Sữa tươi New Zealand, hoặc Cao nguyên Lâm Đồng)",
  "aroma": 90,
  "body": 92,
  "sweetness": 82,
  "color": "Màu sắc cảm quan (Ví dụ: Trắng Ngà Sánh Mịn, Vàng Hổ Phách Ánh Mật...)",
  "applications": ["Tên món ứng dụng 1", "Tên món ứng dụng 2", "Tên món ứng dụng 3"],
  "packaging": ["Gói nhôm 3 lớp 1kg (10 gói/thùng)", "Bao chuyên dụng 25kg"],
  "brewingGuide": {
    "ratio": "Định lượng sử dụng chuẩn",
    "temp": "Nhiệt độ thao tác",
    "time": "Thời gian thao tác",
    "tips": "Mẹo pha chế hoặc bảo quản chuẩn SOP"
  }
}
`;

  try {
    const aiResult = await callGeminiApi({ prompt });
    const aroma = Number(aiResult.aroma) || Number(aiResult.tasteProfile?.aroma) || 90;
    const body = Number(aiResult.body) || Number(aiResult.tasteProfile?.body) || 88;
    const sweetness = Number(aiResult.sweetness) || Number(aiResult.tasteProfile?.sweetness) || 82;
    const color = aiResult.color || aiResult.tasteProfile?.color || 'Trắng Ngà Tự Nhiên';

    return {
      name: aiResult.name || currentName || 'Nguyên Liệu CASA Cao Cấp',
      badge: aiResult.badge || 'Hương Vị Đỉnh Cao',
      shortDesc: aiResult.shortDesc || '',
      fullDesc: aiResult.fullDesc || '',
      origin: aiResult.origin || 'Tuyển chọn cao cấp',
      category: currentCategory,
      tasteProfile: { aroma, body, sweetness, color },
      applications: Array.isArray(aiResult.applications) && aiResult.applications.length > 0
        ? aiResult.applications
        : ['Trà sữa kem mặn', 'Trà kem cheese', 'Đồ uống Signature'],
      packaging: Array.isArray(aiResult.packaging) && aiResult.packaging.length > 0
        ? aiResult.packaging
        : ['Gói nhôm 3 lớp 1kg (10 gói/thùng)', 'Bao chuyên dụng 25kg'],
      brewingGuide: aiResult.brewingGuide || {
        ratio: 'Tỷ lệ định lượng chuẩn F&B',
        temp: 'Nhiệt độ phòng mát mẻ',
        time: 'Thao tác nhanh 30 giây',
        tips: 'Bảo quản nơi khô ráo, đậy kín sau khi mở bao bì.'
      },
      isAiGenerated: true,
      modelUsed: GEMINI_CONFIG.MODEL_NAME
    };
  } catch (err) {
    console.warn('[Gemini AI] Lỗi gọi API, kích hoạt bộ thiết kế dự phòng:', err.message);
    const fallback = autoDesignProduct({
      name: input.name || hints,
      category: currentCategory,
      shortDesc: hints
    });
    return {
      ...fallback,
      isAiGenerated: false,
      errorNotice: `Không thể kết nối Gemini API (${err.message}). Đã áp dụng mẫu thiết kế F&B thông minh dự phòng.`
    };
  }
}

/**
 * 2. CHUYÊN BIỆT: DÙNG GEMINI VIẾT LẠI MÔ TẢ DỰA TRÊN ĐÚNG NỘI DUNG NGƯỜI DÙNG NHẬP
 * (Ví dụ nhập "kem muối" -> viết về vị mặn ngon đặc trưng của muối; nhập "kem cheese" -> viết về độ béo ngậy)
 * @param {Object} input - { hints, text, currentName, currentShortDesc, currentFullDesc }
 */
export async function rewriteDescriptionWithGemini(input = {}) {
  // Ưu tiên lấy đúng từ khóa người dùng vừa gõ vào
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

  const name = (input.currentName || input.name || '').trim();

  if (!userInput) {
    throw new Error('Vui lòng nhập ít nhất một vài từ khóa hoặc đặc tính (ví dụ: kem muối, kem cheese, đào giòn...) để AI nâng cấp.');
  }

  const prompt = `
Bạn là chuyên gia Copywriter F&B và R&D đồ uống cao cấp của thương hiệu CASA TEA.
Người dùng vừa nhập nội dung/từ khóa mô tả về sản phẩm: "${userInput}".
${name ? `Tên sản phẩm liên quan (nếu có): "${name}"` : ''}

QUY TẮC CỐT LÕI (BẮT BUỘC TUÂN THỦ 100%):
1. PHẢI BÁM SÁT VÀ NÂNG CẤP CHÍNH XÁC TỪ CÁC TỪ KHÓA, THÀNH PHẦN HOẶC ĐẶC TÍNH MÀ NGƯỜI DÙNG ĐÃ NHẬP.
   - TUYỆT ĐỐI KHÔNG tự ý bịa đặt nội dung lạc đề hoặc tự động nhồi nhét "đồi chè / búp trà / lên men" nếu người dùng không hề nhắc tới trà.
   - Ví dụ: Nếu người dùng nhập "kem muối", "kem cheese", "bột béo", "siro", "trái cây", thì PHẢI TẬP TRUNG 100% VÀO THÀNH PHẦN ĐÓ.
2. NẮM BẮT ĐÚNG TÍNH CHẤT NGUYÊN LIỆU ĐỂ MIÊU TẢ KÍCH THÍCH VỊ GIÁC:
   - Nếu có "kem muối": Phải miêu tả rõ vị mặn ngon đặc trưng, tinh tế của muối biển hòa quyện cùng lớp kem mềm mịn, béo bùi, cân bằng vị ngọt và tạo điểm nhấn độc đáo khó cưỡng cho ly đồ uống.
   - Nếu có "kem cheese" / "phô mai": Phải bật lên độ béo ngậy, sánh mịn ngập tràn, thơm bùi bồng bềnh, quyến rũ đầu lưỡi.
   - Nếu có "trà" (olong, sen, lài, đen, matcha...): Phải làm nổi bật tầng hương thơm mộc, độ đầm vị, hậu ngọt sâu của đúng loại trà đó.
   - Nếu có "trái cây" (đào, dâu, chanh leo, mãng cầu...): Phải miêu tả sự tươi mát, mọng nước, chua ngọt sảng khoái đánh thức mọi giác quan.
3. VĂN PHONG: Cực kỳ cuốn hút, hấp dẫn, giàu hình ảnh cảm xúc vị giác, chuẩn ngôn từ F&B cao cấp khiến khách hàng đọc là muốn nếm thử ngay.

YÊU CẦU ĐẦU RA JSON (không dùng markdown):
{
  "shortDesc": "Mô tả ngắn 1-2 câu (khoảng 30-45 từ) cực kỳ sắc sảo, đắt giá, bám sát từ khóa người dùng nhập",
  "fullDesc": "Mô tả chi tiết 2-3 đoạn văn sống động, phân tích tầng vị giác, cảm giác béo mịn/mặn mà/thơm mát khi thưởng thức và sự bùng nổ hương vị khi kết hợp trong ly đồ uống"
}
`;

  try {
    const aiResult = await callGeminiApi({ prompt });
    return {
      shortDesc: aiResult.shortDesc || '',
      fullDesc: aiResult.fullDesc || '',
      isAiGenerated: true
    };
  } catch (err) {
    console.warn('[Gemini AI] Lỗi viết lại mô tả, dùng bộ trau chuốt từ khóa dự phòng:', err.message);
    
    // Fallback thông minh cục bộ bám sát đúng từ khóa người dùng
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

    // 5. KEM MUỐI / MUỐI BIỂN
    if (lower.includes('muối') || lower.includes('muoi') || lower.includes('kem muối')) {
      return {
        shortDesc: 'Lớp kem muối bồng bềnh sánh mịn với vị mặn dịu tinh tế từ muối biển, hòa quyện hoàn hảo cùng vị béo ngậy ngọt thanh đầy mê hoặc.',
        fullDesc: 'Lớp kem muối sánh đặc mềm mịn tựa nhung, mang đến sự cân bằng vị giác đỉnh cao ngay khi chạm nơi đầu lưỡi. Nốt mặn duyên dáng của muối biển tinh khiết len lỏi khéo léo, kích thích từng gai vị giác bừng tỉnh, đồng thời tôn bật vị béo ngọt tự nhiên của kem tươi lên một tầm cao mới.\n\nSự kết hợp mặn - béo tương phản nhưng hòa quyện tuyệt đối giúp ly đồ uống thêm đượm đà, lưu luyến khó quên và mang đến trải nghiệm thưởng thức đa tầng đầy cuốn hút cho thực khách.',
        isAiGenerated: false
      };
    }

    // 6. KEM CHEESE / PHÔ MAI
    if (lower.includes('cheese') || lower.includes('phô mai') || lower.includes('pho mai')) {
      return {
        shortDesc: 'Lớp kem cheese sánh đặc bồng bềnh với độ béo ngậy thơm lừng phô mai đặc trưng, tan chảy êm ái như nhung trên đầu lưỡi.',
        fullDesc: 'Gây ấn tượng ngay từ ánh nhìn đầu tiên với lớp kem cheese trắng muốt, bồng bềnh và sánh mịn hoàn hảo. Từng muỗng kem được đánh bông tỉ mỉ, giữ trọn hương thơm phô mai nồng nàn quyến rũ cùng kết cấu mềm mượt đầy đặn.\n\nKhi thưởng thức, vị béo ngậy đậm đà đặc trưng lan tỏa tức thì nơi khoang miệng, hòa quyện cùng chút ngọt thanh và mằn mặn dịu nhẹ đầy tinh tế. Đây chính là lớp topping linh hồn giúp nâng tầm đồ uống cho mọi quán F&B.',
        isAiGenerated: false
      };
    }

    // 7. BỘT BÉO / BỘT KEM / NON-DAIRY CREAMER
    if (lower.includes('bột béo') || lower.includes('bot beo') || lower.includes('bột kem') || lower.includes('bot kem') || lower.includes('creamer')) {
      return {
        shortDesc: 'Bột béo thực vật Non-Dairy Creamer CASA chuyên dụng cho trà sữa, độ tan hoàn hảo, béo ngậy êm dịu và không át hương trà.',
        fullDesc: 'Được sản xuất trên dây chuyền sấy phun tháp đứng hiện đại, Bột Kem Béo CASA sở hữu độ mịn lý tưởng và hàm lượng chất béo thực vật cân đối. Sản phẩm giúp ly trà sữa đạt độ sánh mịn dày dặn (High Body), tôn bật nốt hương thanh tao của trà mà không gây ngấy béo hay che lấp vị cốt trà.',
        isAiGenerated: false
      };
    }

    // 8. Ô LONG / NƯỚNG
    if (lower.includes('long') || lower.includes('oolong') || lower.includes('ô long') || lower.includes('nướng') || lower.includes('nuong')) {
      return {
        shortDesc: 'Trà ô long nướng than hoa thượng hạng với hương thơm khói nồng nàn, nước trà nâu đỏ hổ phách và vị đầm đà sâu lắng.',
        fullDesc: 'Trải qua nghệ thuật rang ủ than hoa gia truyền, từng búp trà ô long CASA bung tỏa tầng hương khói ấm áp, quyến rũ. Vị trà dày đầm, đậm đà nhưng êm dịu, không gắt chát, để lại hậu vị ngọt bùi kéo dài mê đắm trong mọi công thức trà sữa nướng.',
        isAiGenerated: false
      };
    }

    // 9. MATCHA / TRÀ XANH
    if (lower.includes('matcha') || lower.includes('trà xanh') || lower.includes('tra xanh')) {
      return {
        shortDesc: 'Bột matcha nguyên chất thượng hạng với sắc xanh ngọc bích, vị chát êm đượm đà và hậu ngọt thanh mát sâu lắng.',
        fullDesc: 'Được chế biến từ những búp trà non tuyển chọn, bột matcha CASA sở hữu độ mịn hoàn hảo và hàm lượng diệp lục tự nhiên dồi dào. Hương thơm thanh khiết đánh thức mọi giác quan, hòa quyện tuyệt vời trong các dòng matcha latte, đá xay và trà sữa cao cấp.',
        isAiGenerated: false
      };
    }

    // 10. TỔNG QUÁT: Bám sát đúng từ khóa người dùng vừa nhập
    return {
      shortDesc: `${userInput} CASA thượng hạng với hương vị chuẩn hóa tự nhiên, cấu trúc cân bằng và tầng hương quyến rũ kích thích vị giác.`,
      fullDesc: `Được tinh tuyển và phát triển bởi đội ngũ R&D CASA TEA, sản phẩm nổi bật với ${userInput}, mang đến trải nghiệm đồ uống thơm ngon tròn vị và để lại hậu vị lưu luyến bền lâu.\n\nGiải pháp hoàn hảo cho các chuỗi F&B và thương hiệu trà sữa hiện đại muốn chuẩn hóa chất lượng pha chế, tối ưu chi phí cost ly và giữ chân khách hàng hiệu quả.`,
      isAiGenerated: false
    };
  }
}

/**
 * 3. DÙNG GEMINI VIẾT BÀI BÁO / CÔNG THỨC PHA CHẾ SOP
 */
export async function generateArticleWithGemini(input = {}) {
  const title = (input.title || '').trim();
  const notes = (input.notes || input.content || '').trim();
  const category = input.category || 'cong-thuc';

  const prompt = `
Bạn là chuyên gia đào tạo Barista và Trưởng phòng R&D đồ uống tại CASA TEA.
Hãy tạo một bài viết/công thức pha chế B2B chuyên nghiệp:
- Tiêu đề mong muốn: "${title}"
- Gợi ý / Ghi chú: "${notes}"
- Danh mục: "${category}"

YÊU CẦU ĐẦU RA JSON:
{
  "title": "Tiêu đề hấp dẫn, chuẩn SEO F&B 2026",
  "category": "${category}",
  "categoryName": "${category === 'cong-thuc' ? 'Công Thức Pha Chế' : category === 'xu-huong' ? 'Xu Hướng Đồ Uống' : 'Kiến Thức Trà & R&D'}",
  "excerpt": "Tóm tắt ngắn gọn 2 câu hấp dẫn (dưới 45 từ)",
  "author": "CASA R&D Barista Team",
  "readTime": "4 phút",
  "content": "Nội dung bài viết định dạng HTML chuyên nghiệp với các thẻ <p>, <h2>, <ul>, <li>, <table> chuẩn đẹp",
  "tags": ["Từ khóa 1", "Từ khóa 2", "Từ khóa 3", "CASA F&B"]
}
`;

  try {
    const aiResult = await callGeminiApi({ prompt });
    return {
      ...aiResult,
      isAiGenerated: true
    };
  } catch (err) {
    console.warn('[Gemini AI] Fallback sang autoDesignArticle:', err.message);
    const fallback = autoDesignArticle({ title, notes }, category);
    return {
      ...fallback,
      isAiGenerated: false,
      errorNotice: err.message
    };
  }
}

/**
 * 4. DÙNG GEMINI AI DỊCH SẢN PHẨM SANG TRUNG PHỒN THỂ (繁體中文) CHUẨN F&B ĐÀI LOAN
 * @param {Object} product - { name, shortDesc, fullDesc, origin, badge, applications }
 */
export async function translateProductToTraditionalChinese(product = {}) {
  const prompt = `
Bạn là chuyên gia ngôn ngữ và chuyên gia R&D ngành trà sữa Đài Loan (F&B / Bubble Tea).
Hãy dịch toàn bộ thông tin sản phẩm sau từ tiếng Việt sang TIẾNG TRUNG PHỒN THỂ (繁體中文 - Traditional Chinese), sử dụng đúng thuật ngữ chuyên môn ngành trà sữa và đồ uống:

Thông tin sản phẩm:
- Tên sản phẩm: "${product.name || ''}"
- Huy hiệu: "${product.badge || ''}"
- Mô tả ngắn: "${product.shortDesc || ''}"
- Mô tả chi tiết: "${product.fullDesc || ''}"
- Xuất xứ: "${product.origin || ''}"
- Ứng dụng: ${JSON.stringify(product.applications || [])}

QUY TẮC:
- BẮT BUỘC sử dụng chữ Hán Phồn thể (Traditional Chinese / 繁體中文, ví dụ: 臺灣, 原料, 萃取, 奶茶, 烏龍茶, 醇厚, 專用).
- Tuyệt đối KHÔNG dùng chữ Giản thể.
- Thuật ngữ chuẩn mực và hấp dẫn cho ngành F&B.

YÊU CẦU ĐẦU RA ĐÚNG ĐỊNH DẠNG JSON:
{
  "nameZh": "Tên sản phẩm tiếng Trung Phồn thể",
  "badgeZh": "Huy hiệu tiếng Trung Phồn thể",
  "shortDescZh": "Mô tả ngắn tiếng Trung Phồn thể",
  "fullDescZh": "Mô tả chi tiết tiếng Trung Phồn thể",
  "originZh": "Xuất xứ tiếng Trung Phồn thể",
  "applicationsZh": ["Tên món ứng dụng 1", "Tên món ứng dụng 2"]
}
`;

  try {
    const aiResult = await callGeminiApi({ prompt });
    const hasChinese = (aiResult?.nameZh?.match(/[\u4e00-\u9fa5]/g) || []).length > 1;
    const isHalfVietnamese = hasVietnamese(aiResult?.nameZh) || hasVietnamese(aiResult?.shortDescZh);

    if (aiResult && aiResult.nameZh && hasChinese && !isHalfVietnamese) {
      return {
        nameZh: aiResult.nameZh || '',
        badgeZh: aiResult.badgeZh || '新品上市',
        shortDescZh: aiResult.shortDescZh || '',
        fullDescZh: aiResult.fullDescZh || '',
        originZh: aiResult.originZh || '越南林同省保祿高原產區',
        applicationsZh: Array.isArray(aiResult.applicationsZh) && aiResult.applicationsZh.length > 0 ? aiResult.applicationsZh : ['經典原味厚奶茶', '現萃鮮果茶']
      };
    }
  } catch (err) {
    console.warn('[Gemini AI] Lỗi dịch sản phẩm, kích hoạt bộ dịch F&B chuyên nghiệp:', err.message);
  }

  // Fallback sang bộ dịch Google Zh-TW sâu + TAIWAN_FB_REFINEMENTS
  return await fallbackProductTranslation(product);
}

// BẢNG TINH CHỈNH THUẬT NGỮ CHUYÊN NGÀNH TRÀ & F&B ĐÀI LOAN
export const TAIWAN_FB_REFINEMENTS = [
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

export async function translateTextToZhTw(text) {
  if (!text || typeof text !== 'string' || !text.trim()) return '';

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
    console.warn('[translateTextToZhTw backend] Fallback notice:', err.message);
  }

  return text;
}

export async function translateHtmlToZhTw(html) {
  if (!html || typeof html !== 'string' || !html.trim()) return '';

  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return await translateTextToZhTw(html);
  }

  const tokens = html.split(/(<[^>]+>)/g);
  const translatedTokens = await Promise.all(
    tokens.map(async (token) => {
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

export async function fallbackProductTranslation(product = {}) {
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

/**
 * 5. DÙNG GEMINI AI DỊCH BÀI VIẾT / TIN TỨC SANG TRUNG PHỒN THỂ (繁體中文)
 * @param {Object} article - { title, excerpt, content }
 */
export async function translateArticleToTraditionalChinese(article = {}) {
  const prompt = `
Bạn là biên tập viên cao cấp tạp chí F&B Đài Loan và chuyên gia pha chế.
Hãy dịch bài viết sau từ tiếng Việt sang TIẾNG TRUNG PHỒN THỂ (繁體中文 - Traditional Chinese), giữ nguyên các thẻ định dạng HTML (như <h2>, <p>, <ul>, <li>, <strong>, <table>) nếu có trong content:

Thông tin bài viết:
- Tiêu đề: "${article.title || ''}"
- Tóm tắt: "${article.excerpt || ''}"
- Nội dung: ${JSON.stringify(article.content || '')}

QUY TẮC:
- BẮT BUỘC dùng chữ Hán Phồn thể (繁體中文).
- Tuyệt đối KHÔNG dùng chữ Giản thể và KHÔNG để sót từ tiếng Việt nào.
- Giữ nguyên cấu trúc HTML để bài viết hiển thị đẹp mắt.

YÊU CẦU ĐẦU RA JSON:
{
  "titleZh": "Tiêu đề tiếng Trung Phồn thể",
  "excerptZh": "Tóm tắt tiếng Trung Phồn thể",
  "contentZh": "Nội dung bài viết hoàn chỉnh bằng tiếng Trung Phồn thể (giữ nguyên cấu trúc HTML)"
}
`;

  try {
    const aiResult = await callGeminiApi({ prompt });
    const hasChinese = (aiResult?.titleZh?.match(/[\u4e00-\u9fa5]/g) || []).length > 2;
    const isHalfVietnamese = hasVietnamese(aiResult?.titleZh) || hasVietnamese(aiResult?.excerptZh);

    if (aiResult && aiResult.titleZh && hasChinese && !isHalfVietnamese) {
      return {
        titleZh: aiResult.titleZh,
        excerptZh: aiResult.excerptZh || '',
        contentZh: aiResult.contentZh || ''
      };
    }
  } catch (err) {
    console.warn('[Gemini AI] Lỗi dịch bài viết sang tiếng Trung Phồn thể:', err.message);
  }

  // Fallback sang bộ dịch Google Zh-TW sâu + TAIWAN_FB_REFINEMENTS
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

/**
 * 6. DÙNG GEMINI AI DỊCH CÂU HỎI FAQ SANG TRUNG PHỒN THỂ (繁體中文)
 * @param {Object} faq - { question, answer, category }
 */
export async function translateFaqToTraditionalChinese(faq = {}) {
  const prompt = `
Bạn là chuyên gia tư vấn dịch vụ khách hàng B2B ngành F&B và trà sữa Đài Loan.
Hãy dịch câu hỏi thường gặp (FAQ) sau từ tiếng Việt sang TIẾNG TRUNG PHỒN THỂ (繁體中文 - Traditional Chinese), đảm bảo văn phong trang trọng, chuẩn xác cho đối tác thương mại:

Thông tin câu hỏi:
- Câu hỏi: "${faq.question || ''}"
- Câu trả lời: "${faq.answer || ''}"

QUY TẮC:
- BẮT BUỘC dùng chữ Hán Phồn thể (繁體中文 - Traditional Chinese).
- Tuyệt đối KHÔNG dùng chữ Giản thể và KHÔNG để sót từ tiếng Việt nào.
- Câu trả lời ngắn gọn, rành mạch, đúng thuật ngữ thương mại F&B (ví dụ: 起訂量 MOQ, 樣品套件 Sample Kit, 獨家客製配方 OEM/ODM...).

YÊU CẦU ĐẦU RA JSON:
{
  "questionZh": "Câu hỏi tiếng Trung Phồn thể",
  "answerZh": "Câu trả lời tiếng Trung Phồn thể"
}
`;

  try {
    const aiResult = await callGeminiApi({ prompt });
    const hasChinese = (aiResult?.questionZh?.match(/[\u4e00-\u9fa5]/g) || []).length > 1;
    const isHalfVietnamese = hasVietnamese(aiResult?.questionZh) || hasVietnamese(aiResult?.answerZh);

    if (aiResult && aiResult.questionZh && hasChinese && !isHalfVietnamese) {
      return {
        questionZh: aiResult.questionZh,
        answerZh: aiResult.answerZh || ''
      };
    }
  } catch (err) {
    console.warn('[Gemini AI] Lỗi dịch FAQ sang tiếng Trung Phồn thể:', err.message);
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

/**
 * 7. DÙNG GEMINI AI DỊCH MÁY MÓC & THIẾT BỊ SANG TRUNG PHỒN THỂ (繁體中文)
 * @param {Object} machinery - { name, category, origin, capacity, description }
 */
export async function translateMachineryToTraditionalChinese(machinery = {}) {
  const prompt = `
Bạn là kỹ sư trưởng thiết bị chế biến trà và công nghệ thực phẩm Đài Loan.
Hãy dịch thông tin thiết bị / máy móc sau từ tiếng Việt sang TIẾNG TRUNG PHỒN THỂ (繁體中文 - Traditional Chinese):

Thông tin máy móc:
- Tên thiết bị: "${machinery.name || ''}"
- Phân loại: "${machinery.category || ''}"
- Xuất xứ: "${machinery.origin || ''}"
- Công suất: "${machinery.capacity || ''}"
- Mô tả / Công nghệ: "${machinery.description || machinery.desc || ''}"

QUY TẮC:
- BẮT BUỘC dùng chữ Hán Phồn thể (繁體中文).
- Tuyệt đối KHÔNG để sót từ tiếng Việt nào.
- Dùng đúng thuật ngữ cơ khí chính xác (ví dụ: 色選機, 流化床乾燥系統, 三維多向混合機, 無菌充氮包裝機, 瑞士進口...).

YÊU CẦU ĐẦU RA JSON:
{
  "nameZh": "Tên thiết bị tiếng Trung Phồn thể",
  "categoryZh": "Phân loại tiếng Trung Phồn thể",
  "originZh": "Xuất xứ tiếng Trung Phồn thể",
  "capacityZh": "Công suất tiếng Trung Phồn thể",
  "descriptionZh": "Mô tả chi tiết tiếng Trung Phồn thể"
}
`;

  try {
    const aiResult = await callGeminiApi({ prompt });
    const hasChinese = (aiResult?.nameZh?.match(/[\u4e00-\u9fa5]/g) || []).length > 1;
    const isHalfVietnamese = hasVietnamese(aiResult?.nameZh) || hasVietnamese(aiResult?.descriptionZh);

    if (aiResult && aiResult.nameZh && hasChinese && !isHalfVietnamese) {
      return {
        nameZh: aiResult.nameZh,
        categoryZh: aiResult.categoryZh || machinery.category || '',
        originZh: aiResult.originZh || machinery.origin || '',
        capacityZh: aiResult.capacityZh || machinery.capacity || '',
        descriptionZh: aiResult.descriptionZh || machinery.description || machinery.desc || ''
      };
    }
  } catch (err) {
    console.warn('[Gemini AI] Lỗi dịch máy móc sang tiếng Trung Phồn thể:', err.message);
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

/**
 * 8. DÙNG GEMINI AI DỊCH DANH MỤC SẢN PHẨM SANG TRUNG PHỒN THỂ (繁體中文)
 * @param {Object} category - { name, desc }
 */
export async function translateCategoryToTraditionalChinese(category = {}) {
  const prompt = `
Bạn là chuyên gia thẩm định và phân loại trà & nguyên liệu F&B cao cấp tại Đài Loan.
Hãy dịch tên và mô tả danh mục sản phẩm sau từ tiếng Việt sang TIẾNG TRUNG PHỒN THỂ (繁體中文 - Traditional Chinese):

Thông tin danh mục:
- Tên danh mục: "${category.name || ''}"
- Mô tả: "${category.desc || ''}"

QUY TẮC:
- BẮT BUỘC dùng chữ Hán Phồn thể (繁體中文).
- Tuyệt đối KHÔNG để sót từ tiếng Việt nào.
- Dùng từ ngữ sang trọng, chuyên nghiệp chuẩn ngành trà & F&B Đài Loan (ví dụ: 特級阿薩姆與經典紅茶, 高山炭焙烏龍茶, 茉莉花茶與鮮萃綠茶, 特級植脂末與調飲配料...).

YÊU CẦU ĐẦU RA JSON:
{
  "nameZh": "Tên danh mục tiếng Trung Phồn thể",
  "descZh": "Mô tả danh mục tiếng Trung Phồn thể"
}
`;

  try {
    const aiResult = await callGeminiApi({ prompt });
    const hasChinese = (aiResult?.nameZh?.match(/[\u4e00-\u9fa5]/g) || []).length > 1;
    const isHalfVietnamese = hasVietnamese(aiResult?.nameZh) || hasVietnamese(aiResult?.descZh);

    if (aiResult && aiResult.nameZh && hasChinese && !isHalfVietnamese) {
      return {
        nameZh: aiResult.nameZh,
        descZh: aiResult.descZh || ''
      };
    }
  } catch (err) {
    console.warn('[Gemini AI] Lỗi dịch danh mục sang tiếng Trung Phồn thể:', err.message);
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



