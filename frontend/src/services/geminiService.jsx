// ============================================================================
// CASA TEA - GEMINI AI FRONTEND SERVICE ADAPTER
// Mọi yêu cầu xử lý AI được chuyển qua Backend Server (/api/ai/...)
// Đảm bảo bảo mật 100% không để lộ API Key trên trình duyệt
// ============================================================================

import { aiApi } from '../api/client';

export const GEMINI_CONFIG = {
  MODEL_NAME: 'gemini-3.6-flash',
};

export function getGeminiApiKey() {
  return 'MANAGED_BY_BACKEND_SERVER';
}

export function setGeminiApiKey(key) {
  // Handled on backend
}

export async function generateProductWithGemini(input = {}) {
  return await aiApi.designProduct(input);
}

export async function rewriteDescriptionWithGemini(input = {}) {
  return await aiApi.rewriteDesc(input);
}

export async function generateArticleWithGemini(input = {}) {
  return await aiApi.designNews(input);
}

const ZH_DICTIONARY = [
  [/syrup bí đao/gi, '特級冬瓜風味糖漿'],
  [/siro bí đao/gi, '特級冬瓜風味糖漿'],
  [/bí đao/gi, '冬瓜'],
  [/syrup/gi, '風味糖漿'],
  [/siro/gi, '風味糖漿'],
  [/hàng mới/gi, '新品上市'],
  [/bán chạy nhất|bán chạy/gi, '熱銷首選'],
  [/cao cấp/gi, '頂級'],
  [/thượng hạng/gi, '特選'],
  [/đặc biệt/gi, '特級'],
  [/trà lài/gi, '茉莉花綠茶'],
  [/trà xanh/gi, '特級綠茶'],
  [/trà sen/gi, '清香蓮花茶'],
  [/trà đào/gi, '蜜桃紅茶'],
  [/trà đen|hồng trà/gi, '經典阿薩姆紅茶'],
  [/trà ô long/gi, '炭焙烏龍茶'],
  [/ô long/gi, '烏龍茶'],
  [/bột matcha/gi, '頂級抹茶粉'],
  [/matcha/gi, '抹茶粉'],
  [/bột pudding/gi, '特調布丁粉'],
  [/bột tàu hủ/gi, '豆花專用粉'],
  [/bột kem béo|bột kem/gi, '特濃調飲奶精粉'],
  [/topping/gi, '精選配料'],
  [/cao nguyên bảo lộc, lâm đồng/gi, '越南林同省保祿高原產區'],
  [/cao nguyên bảo lộc/gi, '越南保祿高原'],
  [/bảo lộc, lâm đồng/gi, '越南林同省保祿市'],
  [/bảo lộc/gi, '越南保祿'],
  [/lâm đồng/gi, '林同省'],
  [/mộc châu, sơn la/gi, '越南山羅省木州產區'],
  [/mộc châu/gi, '越南木州'],
  [/sơn la/gi, '山羅省'],
  [/việt nam/gi, '越南產地直送'],
  [/trà sữa đậm vị/gi, '濃醇厚奶茶'],
  [/trà trái cây tươi/gi, '現萃鮮果茶'],
  [/trà trái cây/gi, '鮮果茶系列'],
  [/trà sữa truyền thống/gi, '經典原味奶茶'],
  [/trà sữa bí đao/gi, '古早味冬瓜奶茶'],
  [/trà sữa/gi, '風味奶茶'],
  [/soda đá xay/gi, '創意氣泡冰沙'],
  [/đá xay/gi, '冰沙系列'],
  [/gói 1kg \(10 gói\/thùng\)/gi, '1公斤包裝 (每箱10包)'],
  [/gói 1kg/gi, '1公斤裝'],
  [/bao 25kg/gi, '25公斤大袋裝'],
  [/túi lọc tam giác/gi, '立體三角茶包'],
  [/túi lọc/gi, '原葉茶包'],
  [/đậm đà/gi, '醇厚濃郁'],
  [/thơm mát/gi, '芬芳清香'],
  [/ngọt thanh/gi, '清甜回甘']
];

function translateTextFallback(text) {
  if (!text) return '';
  let res = String(text);
  for (const [regex, rep] of ZH_DICTIONARY) {
    res = res.replace(regex, rep);
  }
  return res;
}

export function fallbackProductTranslation(product = {}) {
  let nameZh = translateTextFallback(product.name || '');
  let badgeZh = translateTextFallback(product.badge || '新品上市');
  let originZh = translateTextFallback(product.origin || '越南林同省保祿高原產區');
  let shortDescZh = translateTextFallback(product.shortDesc || '');
  let fullDescZh = translateTextFallback(product.fullDesc || '');

  if (nameZh === (product.name || '')) {
    if (/bí đao/i.test(product.name)) {
      nameZh = '特級冬瓜風味糖漿';
    } else if (/matcha/i.test(product.name)) {
      nameZh = '頂級特選抹茶粉';
    } else if (/trà/i.test(product.name)) {
      nameZh = `特選商用${nameZh}`;
    }
  }

  if (shortDescZh === (product.shortDesc || '') && /bí đao/i.test(product.name)) {
    shortDescZh = '萃取新鮮冬瓜天然精華，CASA冬瓜糖漿呈現純淨清甜、天然濃郁風味與純樸清新的香氣，徹底喚醒味蕾。';
  }
  if (fullDescZh === (product.fullDesc || '') && /bí đao/i.test(product.name)) {
    fullDescZh = 'CASA特級冬瓜糖漿完美再現傳統古早味冬瓜香，濃郁清甜，色澤晶瑩剔透。口感清爽解渴，尾韻回甘悠長，是調製古早味冬瓜茶、冬瓜鮮奶茶、冬瓜檸檬與各式創意冰飲的最佳專用原料。';
  }

  const applicationsZh = (product.applications || []).map(translateTextFallback);

  return {
    nameZh: nameZh || '特選商用茶飲原料',
    badgeZh: badgeZh || '新品上市',
    shortDescZh: shortDescZh || '嚴選頂級產區優質茶葉與調飲原料，風味純正濃醇。',
    fullDescZh: fullDescZh || 'CASA專業調飲原料，專為連鎖茶飲店研發設計，香氣醇厚持久，操作便捷穩定。',
    originZh: originZh || '越南林同省保祿高原產區',
    applicationsZh: applicationsZh.length > 0 ? applicationsZh : ['經典原味奶茶', '現萃鮮果茶']
  };
}

export async function translateProductToTraditionalChinese(product = {}) {
  try {
    const res = await aiApi.translateProductZh(product);
    if (res && res.nameZh && res.nameZh.trim() !== (product.name || '').trim()) {
      return res;
    }
  } catch (err) {
    console.warn('[translateProductToTraditionalChinese] API error, using client fallback:', err.message);
  }
  return fallbackProductTranslation(product);
}

export async function translateArticleToTraditionalChinese(article = {}) {
  return await aiApi.translateNewsZh(article);
}

export async function translateNewsToTraditionalChinese(article = {}) {
  return await aiApi.translateNewsZh(article);
}

export async function translateFaqToTraditionalChinese(faq = {}) {
  return await aiApi.translateFaqZh(faq);
}

export async function translateMachineryToTraditionalChinese(machinery = {}) {
  return await aiApi.translateMachineryZh(machinery);
}

export async function translateCategoryToTraditionalChinese(category = {}) {
  return await aiApi.translateCategoryZh(category);
}

