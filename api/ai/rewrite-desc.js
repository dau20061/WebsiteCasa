function fallbackDescription(text) {
  const lowerText = text.toLowerCase();

  if (lowerText.includes('muối')) {
    return {
      shortDesc: 'Lớp kem muối bồng bềnh sánh mịn với vị mặn dịu tinh tế từ muối biển, hòa quyện hoàn hảo cùng vị béo ngậy ngọt thanh đầy mê hoặc.',
      fullDesc: 'Lớp kem muối sánh đặc mềm mịn tựa nhung, mang đến sự cân bằng vị giác đỉnh cao ngay khi chạm nơi đầu lưỡi. Nốt mặn duyên dáng của muối biển tinh khiết tôn bật vị béo ngọt tự nhiên của kem tươi.\n\nSự kết hợp mặn và béo giúp ly đồ uống thêm đượm đà, lưu luyến khó quên.',
      isAiGenerated: false
    };
  }

  if (lowerText.includes('cheese') || lowerText.includes('phô mai')) {
    return {
      shortDesc: 'Lớp kem cheese sánh đặc bồng bềnh với độ béo ngậy thơm lừng phô mai, tan chảy êm ái như nhung trên đầu lưỡi.',
      fullDesc: 'Lớp kem cheese bồng bềnh và sánh mịn, giữ trọn hương thơm phô mai nồng nàn cùng kết cấu mềm mượt đầy đặn.\n\nVị béo ngậy đậm đà lan tỏa, hòa quyện cùng chút ngọt thanh và mằn mặn dịu nhẹ để nâng tầm đồ uống.',
      isAiGenerated: false
    };
  }

  return {
    shortDesc: `${text} - Hương vị đặc trưng lôi cuốn, hòa quyện hoàn hảo giữa các tầng vị giác.`,
    fullDesc: `Sản phẩm nổi bật với ${text}, được nghiên cứu và tinh chỉnh để đánh thức mọi giác quan. Từng ngụm thưởng thức mang đến cảm giác tròn trịa, đậm đà và để lại hậu vị ngọt ngào bền lâu.`,
    isAiGenerated: false
  };
}

function parseGeminiResponse(data) {
  const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const jsonText = rawText.replace(/^```json\s*/i, '').replace(/\s*```$/i, '').trim();
  return JSON.parse(jsonText);
}

async function rewriteWithGemini(input, text) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;

  const model = process.env.GEMINI_MODEL || 'gemini-3.6-flash';
  const prompt = `Viết lại mô tả sản phẩm đồ uống CASA TEA dựa sát từ khóa: "${text}". Tên: "${input.currentName || ''}". Chỉ trả JSON hợp lệ với hai trường shortDesc và fullDesc, không markdown.`;
  const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
  });

  if (!response.ok) return null;
  const result = parseGeminiResponse(await response.json());
  return {
    shortDesc: result.shortDesc || '',
    fullDesc: result.fullDesc || '',
    isAiGenerated: true
  };
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const input = req.body || {};
    const text = String(input.text || input.hints || input.currentShortDesc || input.currentFullDesc || input.name || '').trim();
    if (!text) {
      return res.status(400).json({ error: 'Vui lòng nhập từ khóa mô tả sản phẩm.' });
    }

    const result = await rewriteWithGemini(input, text).catch(() => null);
    return res.status(200).json(result || fallbackDescription(text));
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Unable to rewrite description' });
  }
}
