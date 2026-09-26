import { getNews } from '../backend/src/services/dbService.js';

const SITE_URL = 'https://www.nguyenlieuphachecasa.com';

function slugify(text) {
  if (!text) return '';
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

export default async function handler(req, res) {
  try {
    const rawSlug = req.query.slug || req.query.id || '';
    const cleanSlug = rawSlug.replace(/\.(webp|png|jpg|jpeg|gif|svg)$/i, '').trim().toLowerCase();

    if (!cleanSlug) {
      return res.redirect(302, `${SITE_URL}/logo.png`);
    }

    const newsList = await getNews().catch(() => []);
    const article = (newsList || []).find((n) => {
      if (!n) return false;
      const nSlug = String(n.slug || '').toLowerCase();
      const nId = String(n.id || '').toLowerCase();
      const nTitleSlug = n.title ? slugify(n.title).toLowerCase() : '';
      return nSlug === cleanSlug || nId === cleanSlug || nTitleSlug === cleanSlug;
    });

    if (!article) {
      return res.redirect(302, `${SITE_URL}/logo.png`);
    }

    const rawImage = article.imageData || article.imageBase64 || article.image;
    if (!rawImage) {
      return res.redirect(302, `${SITE_URL}/logo.png`);
    }

    // Nếu ảnh lưu dạng Base64 Data URL (data:image/...) -> Giải mã buffer nhị phân và trả về ảnh chuẩn
    if (rawImage.startsWith('data:image/')) {
      const matches = rawImage.match(/^data:(image\/[a-zA-Z0-9+.-]+);base64,(.+)$/s);
      if (matches) {
        const mimeType = matches[1];
        const base64Data = matches[2];
        const buffer = Buffer.from(base64Data, 'base64');

        res.setHeader('Content-Type', mimeType);
        res.setHeader('Cache-Control', 'public, max-age=86400, s-maxage=604800, stale-while-revalidate=86400');
        res.setHeader('Content-Length', buffer.length);
        return res.status(200).send(buffer);
      }
    }

    // Nếu ảnh là URL công khai (http / https) -> Chuyển hướng trực tiếp (trừ khi tự trỏ vào chính endpoint)
    if (
      (rawImage.startsWith('http://') || rawImage.startsWith('https://')) &&
      !rawImage.includes('/article-image/')
    ) {
      return res.redirect(302, rawImage);
    }

    return res.redirect(302, `${SITE_URL}/logo.png`);
  } catch (error) {
    console.error('[Article Image Handler Error]:', error);
    return res.redirect(302, `${SITE_URL}/logo.png`);
  }
}

