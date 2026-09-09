// ============================================================================
// CASA TEA - VERCEL SERVERLESS FUNCTION
// Endpoint: POST /api/ai/translate-product-zh
// ============================================================================

import { translateProductToTraditionalChinese } from '../../backend/src/services/aiService.js';

function parseGeminiResponse(data) {
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const jsonText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(jsonText);
}

async function translateDirectWithGemini(product) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
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

  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.5,
        responseMimeType: 'application/json'
      }
    })
  });

  if (!response.ok) return null;
  const result = parseGeminiResponse(await response.json());
  return {
    nameZh: result.nameZh || product.name || '',
    badgeZh: result.badgeZh || product.badge || '',
    shortDescZh: result.shortDescZh || product.shortDesc || '',
    fullDescZh: result.fullDescZh || product.fullDesc || '',
    originZh: result.originZh || product.origin || '',
    applicationsZh: Array.isArray(result.applicationsZh) && result.applicationsZh.length > 0 ? result.applicationsZh : (product.applications || [])
  };
}

function fallbackTranslation(product) {
  const dictionary = [
    [/trà lài/gi, '茉莉綠茶'],
    [/trà xanh/gi, '綠茶'],
    [/trà sen/gi, '蓮花茶'],
    [/trà đào/gi, '蜜桃紅茶'],
    [/trà đen/gi, '經典紅茶'],
    [/hồng trà/gi, '經典紅茶'],
    [/trà ô long/gi, '炭焙烏龍茶'],
    [/ô long/gi, '烏龍茶'],
    [/bột matcha/gi, '頂級抹茶粉'],
    [/matcha/gi, '抹茶粉'],
    [/bột pha chế/gi, '商用調飲粉'],
    [/thượng hạng/gi, '特級'],
    [/đặc biệt/gi, '特選'],
    [/cao cấp/gi, '頂級'],
    [/túi lọc tam giác/gi, '立體三角茶包'],
    [/túi lọc/gi, '原葉茶包'],
    [/bảo lộc/gi, '越南保祿'],
    [/lâm đồng/gi, '林同省'],
    [/mộc châu/gi, '越南木州'],
    [/sơn la/gi, '山羅省'],
    [/việt nam/gi, '越南'],
    [/đài loan/gi, '臺灣'],
    [/nhật bản/gi, '日本'],
    [/bán chạy/gi, '熱銷首選'],
    [/đậm đà/gi, '醇厚濃郁'],
    [/thơm mát/gi, '芬芳清香']
  ];

  let nameZh = product.name || '';
  for (const [regex, replacement] of dictionary) {
    nameZh = nameZh.replace(regex, replacement);
  }

  let originZh = product.origin || '';
  for (const [regex, replacement] of dictionary) {
    originZh = originZh.replace(regex, replacement);
  }

  let badgeZh = product.badge || '';
  for (const [regex, replacement] of dictionary) {
    badgeZh = badgeZh.replace(regex, replacement);
  }

  let shortDescZh = product.shortDesc || '';
  for (const [regex, replacement] of dictionary) {
    shortDescZh = shortDescZh.replace(regex, replacement);
  }

  let fullDescZh = product.fullDesc || '';
  for (const [regex, replacement] of dictionary) {
    fullDescZh = fullDescZh.replace(regex, replacement);
  }

  const applicationsZh = (product.applications || []).map((app) => {
    let trans = String(app);
    for (const [regex, replacement] of dictionary) {
      trans = trans.replace(regex, replacement);
    }
    return trans;
  });

  return {
    nameZh: nameZh || product.name || '',
    badgeZh: badgeZh || '精選原料',
    shortDescZh: shortDescZh || product.shortDesc || '',
    fullDescZh: fullDescZh || product.fullDesc || '',
    originZh: originZh || '越南產地直送',
    applicationsZh
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const product = req.body || {};
    
    // 1. Try backend aiService (must have translated name and not be raw untranslated Vietnamese)
    try {
      const result = await translateProductToTraditionalChinese(product);
      if (result && result.nameZh && result.nameZh !== product.name) {
        return res.status(200).json(result);
      }
    } catch (e) {
      console.warn('[translate-product-zh] aiService error, trying direct Gemini:', e.message);
    }

    // 2. Try direct Gemini API
    const directResult = await translateDirectWithGemini(product).catch(() => null);
    if (directResult && directResult.nameZh && directResult.nameZh !== product.name) {
      return res.status(200).json(directResult);
    }

    // 3. Fallback dictionary translation
    return res.status(200).json(fallbackTranslation(product));
  } catch (error) {
    console.error('[translate-product-zh] Critical error:', error);
    return res.status(200).json(fallbackTranslation(req.body || {}));
  }
}
