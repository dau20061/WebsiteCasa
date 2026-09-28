import { getNews } from '../backend/src/services/dbService.js';

export default async function handler(req, res) {
  try {
    const news = await getNews();
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(news || []);
  } catch (err) {
    console.error('[API News Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
