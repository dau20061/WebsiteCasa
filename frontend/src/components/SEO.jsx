import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';

const SITE_URL = 'https://websiteacasa.vercel.app';
const DEFAULT_IMAGE = `${SITE_URL}/leaf-icon.svg`;
const SITE_NAME = 'CASA TEA & BEVERAGE SOLUTIONS';

function setMetaTag(attrName, attrValue, content) {
  if (!content) return;
  let element = document.querySelector(`meta[${attrName}="${attrValue}"]`);
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attrName, attrValue);
    document.head.appendChild(element);
  }
  element.setAttribute('content', content);
}

function setLinkTag(rel, href, extraAttrs = {}) {
  if (!href) return;
  let selector = `link[rel="${rel}"]`;
  if (extraAttrs.hreflang) {
    selector += `[hreflang="${extraAttrs.hreflang}"]`;
  }
  let element = document.querySelector(selector);
  if (!element) {
    element = document.createElement('link');
    element.setAttribute('rel', rel);
    for (const [key, val] of Object.entries(extraAttrs)) {
      element.setAttribute(key, val);
    }
    document.head.appendChild(element);
  }
  element.setAttribute('href', href);
}

export default function SEO({
  title,
  description,
  keywords,
  canonical,
  ogType = 'website',
  ogImage,
  ogImageAlt,
  publishedTime,
  modifiedTime,
  author = 'CASA TEA R&D Team',
  noindex = false,
  jsonLd = null
}) {
  const location = useLocation();
  const { isChinese } = useLanguage();

  useEffect(() => {
    // 1. TỐI ƯU TITLE TAG
    const defaultSuffix = isChinese
      ? 'CASA TEA | 專業商用茶飲原料與調飲方案'
      : 'CASA TEA – Tinh Hoa Trà Nguyên Liệu B2B';
    const fullTitle = title ? `${title} | ${defaultSuffix}` : defaultSuffix;
    document.title = fullTitle;

    // 2. TỐI ƯU META DESCRIPTION
    const defaultDesc = isChinese
      ? 'CASA TEA – 專業商用茶飲原料、特選原葉茶包、風味糖漿與調飲專用粉研發供應商。符合ISO 22000、HACCP國際標準。'
      : 'CASA TEA – Nhà sản xuất và cung ứng sỉ trà nguyên liệu, siro pha chế, bột béo cao cấp cho chuỗi trà sữa, cafe và ngành F&B toàn quốc. Đạt chuẩn ISO 22000, HACCP.';
    const metaDescription = description || defaultDesc;
    setMetaTag('name', 'description', metaDescription);

    // 3. TỐI ƯU META KEYWORDS
    const defaultKeywords = isChinese
      ? '商用茶葉, 奶茶原料, 冬瓜糖漿, 茉莉綠茶, 烏龍茶, 抹茶粉, 越南茶葉供應商, CASA TEA'
      : 'trà nguyên liệu, trà pha trà sữa, syrup bí đao, siro pha chế, trà đen sỉ, trà ô long, bột béo, nguyên liệu f&b, CASA TEA';
    const metaKeywords = Array.isArray(keywords) ? keywords.join(', ') : (keywords || defaultKeywords);
    setMetaTag('name', 'keywords', metaKeywords);

    // 4. CANONICAL & HREFLANG
    const fullCanonical = canonical
      ? (canonical.startsWith('http') ? canonical : `${SITE_URL}${canonical}`)
      : `${SITE_URL}${location.pathname}`;
    setLinkTag('canonical', fullCanonical);
    setLinkTag('alternate', fullCanonical, { hreflang: 'vi' });
    setLinkTag('alternate', fullCanonical, { hreflang: 'zh-TW' });
    setLinkTag('alternate', fullCanonical, { hreflang: 'x-default' });

    // 5. META ROBOTS
    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      setMetaTag('name', 'robots', 'index, follow, max-snippet:-1, max-image-preview:large, max-video-preview:-1');
    }

    // 6. OPEN GRAPH (FACEBOOK, ZALO, LINKEDIN)
    setMetaTag('property', 'og:site_name', SITE_NAME);
    setMetaTag('property', 'og:title', fullTitle);
    setMetaTag('property', 'og:description', metaDescription);
    setMetaTag('property', 'og:url', fullCanonical);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:locale', isChinese ? 'zh_TW' : 'vi_VN');

    const imageToUse = ogImage
      ? (ogImage.startsWith('http') ? ogImage : `${SITE_URL}${ogImage}`)
      : DEFAULT_IMAGE;
    setMetaTag('property', 'og:image', imageToUse);
    setMetaTag('property', 'og:image:secure_url', imageToUse);
    setMetaTag('property', 'og:image:alt', ogImageAlt || fullTitle);

    if (ogType === 'article') {
      if (publishedTime) setMetaTag('property', 'article:published_time', publishedTime);
      if (modifiedTime) setMetaTag('property', 'article:modified_time', modifiedTime);
      if (author) setMetaTag('property', 'article:author', author);
    }

    // 7. TWITTER CARDS
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', fullTitle);
    setMetaTag('name', 'twitter:description', metaDescription);
    setMetaTag('name', 'twitter:image', imageToUse);

    // 8. STRUCTURED DATA JSON-LD (GOOGLE RICH RESULTS)
    const jsonLdId = 'casa-jsonld-schema';
    let scriptTag = document.getElementById(jsonLdId);
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = jsonLdId;
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }

    if (jsonLd) {
      const dataToInject = Array.isArray(jsonLd)
        ? { '@context': 'https://schema.org', '@graph': jsonLd }
        : { '@context': 'https://schema.org', ...jsonLd };
      scriptTag.textContent = JSON.stringify(dataToInject);
    } else {
      // Default WebPage schema
      scriptTag.textContent = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        name: fullTitle,
        description: metaDescription,
        url: fullCanonical,
        inLanguage: isChinese ? 'zh-TW' : 'vi',
        isPartOf: {
          '@type': 'WebSite',
          name: SITE_NAME,
          url: SITE_URL
        }
      });
    }

    return () => {
      // Cleanup custom JSON-LD when component unmounts to prevent schema bleeding
      const existingScript = document.getElementById(jsonLdId);
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [
    title,
    description,
    keywords,
    canonical,
    ogType,
    ogImage,
    ogImageAlt,
    publishedTime,
    modifiedTime,
    author,
    noindex,
    jsonLd,
    location.pathname,
    isChinese
  ]);

  return null;
}

