import { getProducts } from '../backend/src/services/dbService.js';

export default async function handler(req, res) {
  try {
    const products = await getProducts();
    // Tối ưu hóa tuyệt đối: Loại bỏ Base64 imageData/imageBase64 khỏi API listing
    // Giảm dung lượng từ 1.5MB xuống ~15KB (giảm 99% payload tải mạng mobile)
    const lightweightProducts = (products || []).map((p) => {
      const { imageData, imageBase64, ...rest } = p;
      return rest;
    });
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).json(lightweightProducts);
  } catch (err) {
    console.error('[API Products Error]:', err);
    return res.status(500).json({ error: err.message || 'Internal Server Error' });
  }
}
