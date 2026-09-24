import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Package,
  Sparkles,
  ArrowRight,
  ExternalLink,
  MessageCircle,
  ShoppingBag,
  CheckCircle2,
  PhoneCall
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { getProductSlug } from '../utils/slugify';

export default function ArticleAttachedProducts({
  products = [],
  title,
  subtitle,
  compact = false
}) {
  const { t, isChinese, isEnglish } = useLanguage();

  if (!products || products.length === 0) return null;

  const defaultTitle = isEnglish
    ? 'Featured Ingredients & Products'
    : (isChinese ? '本文推薦調飲原料與產品' : 'Nguyên Liệu & Sản Phẩm Trong Bài Viết');

  const defaultSubtitle = isEnglish
    ? 'Standardized commercial F&B ingredients crafted for high-volume coffee and milk tea chains.'
    : (isChinese
      ? '專為手搖茶飲與連鎖咖啡店打造的高標準商用原料，品質穩定、香氣出眾。'
      : 'Nguyên liệu đạt chuẩn ISO 22000 & HACCP, được đội ngũ R&D CASA phát triển chuyên sâu cho chuỗi F&B.');

  return (
    <section className="my-10 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-tea-mist/60 via-white to-tea-soft/40 dark:from-[#132018] dark:via-[#17261D] dark:to-[#0E1712] border-2 border-tea-emerald/30 dark:border-tea-mint/20 shadow-tea-sm transition-colors">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-tea-leaf/20 dark:border-white/10 mb-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-tea-primary dark:bg-tea-mint text-white dark:text-tea-dark flex items-center justify-center shadow-md shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wider uppercase text-tea-emerald dark:text-tea-mint">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isEnglish ? 'Direct From Manufacturer' : (isChinese ? '原廠直送推薦' : 'Nguyên Liệu Chuẩn R&D CASA')}</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-extrabold text-tea-dark dark:text-white leading-tight">
              {title || defaultTitle}
            </h3>
          </div>
        </div>

        <Link
          to="/products"
          className="inline-flex items-center gap-1 text-xs font-bold text-tea-primary dark:text-tea-mint hover:underline self-start sm:self-auto shrink-0 group"
        >
          <span>{isEnglish ? 'View All Products' : (isChinese ? '瀏覽全部原料' : 'Xem toàn bộ sản phẩm')}</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
        {subtitle || defaultSubtitle}
      </p>

      {/* Grid of Attached Products */}
      <div className={`grid gap-4 sm:gap-6 ${compact ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'}`}>
        {products.map((product) => {
          const productSlug = getProductSlug(product);
          const productUrl = `/products/${productSlug}`;

          const displayName = isEnglish
            ? (product.nameEn || product.name_en || product.name)
            : (isChinese ? (product.nameZh || product.name_zh || product.name) : product.name);

          const displayCategory = isEnglish
            ? (product.categoryNameEn || product.categoryName || product.category)
            : (isChinese ? (product.categoryNameZh || product.categoryName || product.category) : (product.categoryName || product.category));

          const displayDesc = isEnglish
            ? (product.shortDescEn || product.shortDesc_en || product.shortDesc || product.description)
            : (isChinese ? (product.shortDescZh || product.shortDesc_zh || product.shortDesc || product.description) : (product.shortDesc || product.description));

          return (
            <motion.div
              key={product.id || productSlug}
              whileHover={{ y: -4 }}
              transition={{ duration: 0.2 }}
              className="bg-white dark:bg-[#1A2C21] rounded-2xl border border-tea-border dark:border-white/10 overflow-hidden shadow-tea-sm hover:shadow-tea-md flex flex-col justify-between transition-all"
            >
              {/* Product Top: Thumbnail & Badges */}
              <div>
                <Link to={productUrl} className="block relative aspect-[4/3] overflow-hidden bg-tea-mist dark:bg-[#0B130E] group">
                  <img
                    src={product.image || 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80'}
                    alt={`${displayName} – CASA TEA`}
                    title={`${displayName} – CASA TEA`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-tea-primary/90 text-white text-[10px] font-bold tracking-wide backdrop-blur-sm shadow-sm">
                      {displayCategory}
                    </span>
                    {product.badge && (
                      <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[10px] font-bold shadow-sm">
                        {product.badge}
                      </span>
                    )}
                  </div>
                  {product.sku && (
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded bg-black/60 text-white/90 text-[10px] font-mono backdrop-blur-sm">
                      {product.sku}
                    </span>
                  )}
                </Link>

                {/* Info */}
                <div className="p-4 space-y-2">
                  <Link to={productUrl} className="block group">
                    <h4 className="font-bold text-sm sm:text-base text-tea-dark dark:text-white group-hover:text-tea-primary dark:group-hover:text-tea-mint transition-colors line-clamp-1">
                      {displayName}
                    </h4>
                  </Link>

                  {displayDesc && (
                    <p className="text-xs text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
                      {displayDesc}
                    </p>
                  )}

                  {/* Highlights / Packaging */}
                  {product.packaging && Array.isArray(product.packaging) && product.packaging.length > 0 && (
                    <div className="flex items-center gap-1.5 text-[11px] text-gray-500 dark:text-gray-400 pt-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint shrink-0" />
                      <span className="truncate">
                        {isEnglish ? 'Spec: ' : (isChinese ? '規格：' : 'Quy cách: ')}
                        {product.packaging.join(' • ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="p-4 pt-0 space-y-2 border-t border-gray-100 dark:border-white/5 mt-2">
                <div className="flex items-center justify-between gap-2 pt-3">
                  <Link
                    to={productUrl}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-tea-primary hover:bg-tea-dark text-white text-xs font-bold shadow-sm transition-colors"
                  >
                    <span>{isEnglish ? 'View Product' : (isChinese ? '查看詳情' : 'Xem chi tiết')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {product.purchaseAction === 'shopee' && product.shopeeUrl ? (
                    <a
                      href={product.shopeeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center p-2 rounded-xl bg-[#EE4D2D] hover:bg-[#D73211] text-white transition-colors shadow-sm"
                      title={isChinese ? '在蝦皮購買' : (isEnglish ? 'Buy on Shopee' : 'Mua trên Shopee')}
                    >
                      <ShoppingBag className="w-4 h-4" />
                    </a>
                  ) : (
                    <Link
                      to={`/contact?product=${encodeURIComponent(displayName)}`}
                      className="inline-flex items-center justify-center p-2 rounded-xl bg-tea-soft dark:bg-[#0B130E] hover:bg-tea-mist dark:hover:bg-[#132018] text-tea-primary dark:text-tea-mint border border-tea-border dark:border-white/10 transition-colors"
                      title={isChinese ? '洽詢批發報價' : (isEnglish ? 'Quote Consultation' : 'Báo giá sỉ')}
                    >
                      <MessageCircle className="w-4 h-4" />
                    </Link>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}

