import { getProducts, getNews } from '../backend/src/services/dbService.js';

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
    const [products, news] = await Promise.all([
      getProducts().catch(() => []),
      getNews().catch(() => [])
    ]);

    const today = new Date().toISOString().split('T')[0];

    const staticUrls = [
      { loc: `${SITE_URL}/`, priority: '1.0', changefreq: 'daily', lastmod: today },
      { loc: `${SITE_URL}/products`, priority: '0.9', changefreq: 'daily', lastmod: today },
      { loc: `${SITE_URL}/products?cat=tra-cao-cap`, priority: '0.8', changefreq: 'weekly', lastmod: today },
      { loc: `${SITE_URL}/products?cat=bot-pudding`, priority: '0.8', changefreq: 'weekly', lastmod: today },
      { loc: `${SITE_URL}/products?cat=bot-tau-hu`, priority: '0.8', changefreq: 'weekly', lastmod: today },
      { loc: `${SITE_URL}/products?cat=bot-kem`, priority: '0.8', changefreq: 'weekly', lastmod: today },
      { loc: `${SITE_URL}/products?cat=syrup`, priority: '0.8', changefreq: 'weekly', lastmod: today },
      { loc: `${SITE_URL}/products?cat=bot-kem-beo`, priority: '0.8', changefreq: 'weekly', lastmod: today },
      { loc: `${SITE_URL}/products?cat=matcha`, priority: '0.8', changefreq: 'weekly', lastmod: today },
      { loc: `${SITE_URL}/products?cat=topping`, priority: '0.8', changefreq: 'weekly', lastmod: today },
      { loc: `${SITE_URL}/news`, priority: '0.8', changefreq: 'daily', lastmod: today },
      { loc: `${SITE_URL}/about`, priority: '0.8', changefreq: 'monthly', lastmod: today },
      { loc: `${SITE_URL}/machinery-certifications`, priority: '0.8', changefreq: 'monthly', lastmod: today },
      { loc: `${SITE_URL}/contact`, priority: '0.7', changefreq: 'monthly', lastmod: today },
      { loc: `${SITE_URL}/faq`, priority: '0.7', changefreq: 'monthly', lastmod: today }
    ];

    const productUrls = (products || []).map((p) => {
      const slug = p.slug || (p.name ? slugify(p.name) : p.id);
      return {
        loc: `${SITE_URL}/products/${slug}`,
        priority: '0.9',
        changefreq: 'weekly',
        lastmod: p.updatedAt ? p.updatedAt.split('T')[0] : today
      };
    });

    const newsUrls = (news || []).map((n) => {
      const slug = n.slug || (n.title ? slugify(n.title) : n.id);
      return {
        loc: `${SITE_URL}/news/${slug}`,
        priority: '0.8',
        changefreq: 'monthly',
        lastmod: n.updatedAt ? n.updatedAt.split('T')[0] : (n.date || today)
      };
    });

    const allUrls = [...staticUrls, ...productUrls, ...newsUrls];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
        xsi:schemaLocation="http://www.sitemaps.org/schemas/sitemap/0.9
        http://www.sitemaps.org/schemas/sitemap/0.9/sitemap.xsd">
${allUrls
  .map(
    (u) => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>`;

    res.setHeader('Content-Type', 'application/xml; charset=utf-8');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate=86400');
    return res.status(200).send(xml);
  } catch (error) {
    console.error('[Sitemap Generator Error]:', error);
    return res.status(500).send('Error generating sitemap');
  }
}
