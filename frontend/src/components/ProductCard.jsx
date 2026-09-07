import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles, Droplets, Flame, Wind } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ProductCard({ product, onRequestSample }) {
  const { t, isChinese } = useLanguage();
  const { id, name, sku, categoryName, badge, shortDesc, image, tasteProfile, tags } = product;

  const displayName = (isChinese && (product.nameZh || product.name_zh)) || name;
  const displayShortDesc = (isChinese && (product.shortDescZh || product.shortDesc_zh)) || shortDesc;
  const displayBadge = (isChinese && (product.badgeZh || product.badge_zh)) || badge;
  const displayCategoryName = isChinese
    ? t(`cat_${product.category?.replace(/-/g, '_')}`, categoryName)
    : categoryName;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-[#132018] rounded-3xl overflow-hidden border border-tea-border dark:border-white/10 shadow-tea-sm hover:shadow-tea-lg dark:hover:border-tea-mint/30 transition-all flex flex-col h-full"
    >
      {/* Product Image Box */}
      <div className="relative h-60 w-full overflow-hidden bg-tea-mist dark:bg-[#1A2C21]">
        <img
          src={image}
          alt={displayName}
          loading="lazy"
          className="w-full h-full object-cover object-center transform group-hover:scale-108 transition-transform duration-500 ease-out"
        />
        
        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Top Badges */}
        <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none">
          <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-tea-primary dark:text-tea-mint text-[11px] font-bold tracking-wide uppercase shadow-sm">
            {displayCategoryName}
          </span>
          {displayBadge && (
            <span className="px-3 py-1 rounded-full bg-tea-primary text-tea-mint text-[11px] font-bold tracking-wide shadow-sm flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              {displayBadge}
            </span>
          )}
        </div>

        {/* SKU Chip */}
        <div className="absolute bottom-3 left-3.5">
          <span className="px-2.5 py-1 rounded-md bg-black/60 text-white/90 backdrop-blur-md text-[11px] font-mono font-medium">
            {sku}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <Link to={`/products/${id}`} className="block">
            <h3 className="text-lg font-bold text-tea-dark dark:text-white group-hover:text-tea-green dark:group-hover:text-tea-mint transition-colors line-clamp-2 leading-snug">
              {displayName}
            </h3>
          </Link>

          <p className="mt-2.5 text-xs sm:text-sm text-gray-600 dark:text-gray-300 line-clamp-2 leading-relaxed">
            {displayShortDesc}
          </p>

          {/* Taste Sensory mini indicators */}
          {tasteProfile && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Wind className="w-3 h-3 text-tea-leaf dark:text-tea-mint" /> {t('card_aroma', 'Hương thơm:')}
                </span>
                <div className="w-24 bg-gray-100 dark:bg-black/30 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-tea-mint h-full rounded-full"
                    style={{ width: `${tasteProfile.aroma}%` }}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Flame className="w-3 h-3 text-tea-emerald dark:text-tea-leaf" /> {t('card_body', 'Độ đầm vị (Body):')}
                </span>
                <div className="w-24 bg-gray-100 dark:bg-black/30 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="bg-tea-emerald dark:bg-tea-leaf h-full rounded-full"
                    style={{ width: `${tasteProfile.body}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center gap-2.5">
          <Link
            to={`/products/${id}`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-tea-mist dark:bg-[#1A2C21] hover:bg-tea-soft dark:hover:bg-[#253D2F] text-tea-primary dark:text-tea-mint text-xs font-bold transition-colors"
          >
            <span>{t('card_detail', 'Chi tiết')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>

          {onRequestSample && (
            <button
              onClick={() => onRequestSample(product)}
              className="px-3 py-2.5 rounded-xl border border-tea-leaf/30 dark:border-tea-mint/30 text-tea-primary dark:text-tea-mint hover:bg-tea-primary dark:hover:bg-tea-green hover:text-white text-xs font-bold transition-all whitespace-nowrap"
            >
              {t('card_sample', 'Mẫu thử')}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

