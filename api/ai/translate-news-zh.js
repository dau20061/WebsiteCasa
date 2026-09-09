// ============================================================================
// CASA TEA - VERCEL SERVERLESS FUNCTION
// Endpoint: POST /api/ai/translate-news-zh
// ============================================================================

import { translateArticleToTraditionalChinese } from '../../backend/src/services/aiService.js';

function parseGeminiResponse(data) {
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const jsonText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(jsonText);
}

async function translateDirectWithGemini(article) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const prompt = `
Bạn là biên tập viên cao cấp tạp chí F&B Đài Loan và chuyên gia pha chế.
Hãy dịch bài viết sau từ tiếng Việt sang TIẾNG TRUNG PHỒN THỂ (繁體中文 - Traditional Chinese), giữ nguyên các thẻ định dạng HTML (như <h2>, <p>, <ul>, <li>, <strong>, <table>) nếu có trong content:

Thông tin bài viết:
- Tiêu đề: "${article.title || ''}"
- Tóm tắt: "${article.excerpt || ''}"
- Nội dung: ${JSON.stringify(article.content || '')}

QUY TẮC:
- BẮT BUỘC dùng chữ Hán Phồn thể (繁體中文).
- Giữ nguyên cấu trúc HTML để bài viết hiển thị đẹp mắt.

YÊU CẦU ĐẦU RA JSON:
{
  "titleZh": "Tiêu đề tiếng Trung Phồn thể",
  "excerptZh": "Tóm tắt tiếng Trung Phồn thể",
  "contentZh": "Nội dung bài viết hoàn chỉnh bằng tiếng Trung Phồn thể (giữ nguyên cấu trúc HTML)"
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
    titleZh: result.titleZh || article.title || '',
    excerptZh: result.excerptZh || article.excerpt || '',
    contentZh: result.contentZh || article.content || ''
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const article = req.body || {};

    try {
      const result = await translateArticleToTraditionalChinese(article);
      if (result && result.titleZh) {
        return res.status(200).json(result);
      }
    } catch (e) {
      console.warn('[translate-news-zh] aiService error, trying direct Gemini:', e.message);
    }

    const direct = await translateDirectWithGemini(article).catch(() => null);
    if (direct && direct.titleZh) {
      return res.status(200).json(direct);
    }

    return res.status(200).json({
      titleZh: article.title || '',
      excerptZh: article.excerpt || '',
      contentZh: article.content || ''
    });
  } catch (error) {
    console.error('[translate-news-zh] Critical error:', error);
    return res.status(200).json({
      titleZh: req.body?.title || '',
      excerptZh: req.body?.excerpt || '',
      contentZh: req.body?.content || ''
    });
  }
}

