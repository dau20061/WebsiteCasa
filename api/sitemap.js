import { getProducts, getNews } from '../backend/src/services/dbService.js';

const SITE_URL = 'https://websiteacasa.vercel.app';

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
      { loc: `${SITE_URL}/news`, priority: '0.8', changefreq: 'daily', lastmod: today },
      { loc: `${SITE_URL}/about`, priority: '0.7', changefreq: 'monthly', lastmod: today },
      { loc: `${SITE_URL}/machinery-certifications`, priority: '0.7', changefreq: 'monthly', lastmod: today },
      { loc: `${SITE_URL}/contact`, priority: '0.6', changefreq: 'monthly', lastmod: today },
      { loc: `${SITE_URL}/faq`, priority: '0.6', changefreq: 'monthly', lastmod: today }
    ];

    const productUrls = (products || []).map((p) => ({
      loc: `${SITE_URL}/products/${p.id}`,
      priority: '0.9',
      changefreq: 'weekly',
      lastmod: p.updatedAt ? p.updatedAt.split('T')[0] : today
    }));

    const newsUrls = (news || []).map((n) => ({
      loc: `${SITE_URL}/news/${n.slug || n.id}`,
      priority: '0.8',
      changefreq: 'monthly',
      lastmod: n.updatedAt ? n.updatedAt.split('T')[0] : (n.date || today)
    }));

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

