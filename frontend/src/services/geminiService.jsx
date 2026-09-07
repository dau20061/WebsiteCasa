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

export async function translateProductToTraditionalChinese(product = {}) {
  return await aiApi.translateProductZh(product);
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
