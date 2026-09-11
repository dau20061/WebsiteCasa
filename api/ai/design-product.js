import { generateProductWithGemini } from '../../backend/src/services/aiService.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const result = await generateProductWithGemini(req.body || {});
    return res.status(200).json(result);
  } catch (error) {
    return res.status(500).json({ error: error.message || 'Error processing request' });
  }
}

