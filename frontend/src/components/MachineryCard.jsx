import React from 'react';
import { motion } from 'framer-motion';
import { Cpu, Gauge, Globe2, ZoomIn, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function MachineryCard({ item, onSelect }) {
  const { isChinese } = useLanguage();

  const displayName = (isChinese && (item.nameZh || item.name_zh)) || item.name;
  const displayCategory = (isChinese && (item.categoryZh || item.category_zh)) || item.category;
  const displayOrigin = (isChinese && (item.originZh || item.origin_zh)) || item.origin;
  const displayCapacity = (isChinese && (item.capacityZh || item.capacity_zh)) || item.capacity;
  const displayDesc = (isChinese && (item.descriptionZh || item.descZh || item.description_zh)) || item.description || item.desc;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-[#132018] rounded-3xl overflow-hidden border border-tea-border dark:border-white/10 shadow-tea-sm hover:shadow-tea-lg dark:hover:border-tea-mint/30 transition-all flex flex-col justify-between"
    >
      <div>
        {/* Machine Image */}
        <div className="relative h-56 w-full overflow-hidden bg-gray-900">
          <img
            src={item.image}
            alt={displayName}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-106 transition-transform duration-500 ease-out"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80" />

          <div className="absolute top-3.5 left-3.5">
            <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-tea-primary dark:text-tea-mint text-xs font-bold shadow-sm">
              {displayCategory}
            </span>
          </div>

          <button
            onClick={() => onSelect(item)}
            aria-label={isChinese ? '放大查看設備詳情' : 'Phóng to chi tiết máy móc'}
            className="absolute bottom-3.5 right-3.5 p-2 rounded-full bg-black/50 hover:bg-tea-emerald text-white backdrop-blur-sm transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
        </div>

        {/* Info */}
        <div className="p-6">
          <h3 className="text-lg font-bold text-tea-dark dark:text-white group-hover:text-tea-green dark:group-hover:text-tea-mint transition-colors leading-snug">
            {displayName}
          </h3>

          <div className="mt-3 space-y-2 text-xs text-gray-600 dark:text-gray-300">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-tea-emerald dark:text-tea-mint shrink-0" />
              <span><strong>{isChinese ? '產地：' : 'Xuất xứ:'}</strong> {displayOrigin}</span>
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="w-4 h-4 text-tea-emerald dark:text-tea-mint shrink-0" />
              <span><strong>{isChinese ? '產能/規格：' : 'Công suất:'}</strong> {displayCapacity}</span>
            </div>
          </div>

          <p className="mt-3.5 text-xs text-gray-500 dark:text-gray-400 line-clamp-2 leading-relaxed">
            {displayDesc}
          </p>

          {item.features && (
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-white/10 space-y-1.5">
              {item.features.slice(0, 2).map((f, i) => (
                <div key={i} className="flex items-center gap-1.5 text-xs text-gray-700 dark:text-gray-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint shrink-0" />
                  <span className="truncate">{f}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6">
        <button
          onClick={() => onSelect(item)}
          className="w-full py-2.5 px-4 rounded-xl bg-tea-mist dark:bg-[#1C2F23] hover:bg-tea-soft dark:hover:bg-[#253D2F] text-tea-primary dark:text-tea-mint text-xs font-bold transition-colors flex items-center justify-center gap-2"
        >
          <span>{isChinese ? '查看詳細規格' : 'Xem thông số chi tiết'}</span>
        </button>
      </div>
    </motion.div>
  );
}

