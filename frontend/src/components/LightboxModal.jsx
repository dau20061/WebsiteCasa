import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ZoomIn, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LightboxModal({ isOpen, onClose, data }) {
  const { isChinese } = useLanguage();
  if (!isOpen || !data) return null;

  const displayName = (isChinese && (data.nameZh || data.name_zh || data.titleZh)) || data.name || data.title;
  const displayCategory = (isChinese && (data.categoryZh || data.category_zh || data.badgeZh)) || data.badge || data.category || (isChinese ? '檢驗文件' : 'Tài liệu kiểm định');
  const displayOrigin = (isChinese && (data.originZh || data.origin_zh)) || data.origin;
  const displayCapacity = (isChinese && (data.capacityZh || data.capacity_zh)) || data.capacity;
  const displayScope = (isChinese && (data.descriptionZh || data.descZh || data.description_zh || data.scopeZh)) || data.scope || data.description || data.desc;
  const displaySpecs = (isChinese && (data.specsZh || data.specs_zh)) || data.specs;
  const displayOrg = (isChinese && (data.orgZh || data.org_zh)) || data.org;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-tea-dark/80 backdrop-blur-md"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="relative w-full max-w-3xl bg-white dark:bg-[#132018] rounded-3xl shadow-2xl overflow-hidden z-10 my-8 border border-transparent dark:border-white/10"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label={isChinese ? '關閉' : 'Đóng'}
            className="absolute top-4 right-4 z-20 p-2.5 bg-black/40 hover:bg-black/60 text-white rounded-full transition-colors backdrop-blur-sm"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Image preview */}
          <div className="relative h-72 sm:h-96 w-full bg-gray-900 overflow-hidden">
            <img
              src={data.image}
              alt={displayName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 text-white">
              <span className="inline-block px-3 py-1 rounded-full bg-tea-emerald/80 text-tea-mint text-xs font-semibold mb-1 backdrop-blur-sm">
                {displayCategory}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold">{displayName}</h3>
            </div>
          </div>

          {/* Details */}
          <div className="p-6 sm:p-8 space-y-4 text-gray-800 dark:text-gray-100">
            {displayOrg && (
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-white/10 text-sm">
                <span className="text-gray-500 dark:text-gray-400">{isChinese ? '認證發證機構：' : 'Cơ quan cấp chứng nhận:'}</span>
                <span className="font-semibold text-tea-dark dark:text-white">{displayOrg}</span>
              </div>
            )}

            {data.certNumber && (
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-white/10 text-sm">
                <span className="text-gray-500 dark:text-gray-400">{isChinese ? '文號 / 認證編號：' : 'Số hiệu văn bản:'}</span>
                <span className="font-mono text-xs font-semibold bg-gray-100 dark:bg-black/30 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md border border-transparent dark:border-white/10">
                  {data.certNumber}
                </span>
              </div>
            )}

            {displayOrigin && (
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-white/10 text-sm">
                <span className="text-gray-500 dark:text-gray-400">{isChinese ? '技術產地來源：' : 'Xuất xứ công nghệ:'}</span>
                <span className="font-semibold text-tea-emerald dark:text-tea-mint">{displayOrigin}</span>
              </div>
            )}

            {displayCapacity && (
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-100 dark:border-white/10 text-sm">
                <span className="text-gray-500 dark:text-gray-400">{isChinese ? '設備產能 / 規格：' : 'Năng lực / Công suất:'}</span>
                <span className="font-semibold text-tea-dark dark:text-white">{displayCapacity}</span>
              </div>
            )}

            <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
              {displayScope}
            </p>

            {displaySpecs && (
              <div className="p-3.5 bg-tea-cream dark:bg-black/30 rounded-xl border border-tea-border dark:border-white/10 text-xs text-gray-700 dark:text-gray-300">
                <strong className="text-tea-primary dark:text-tea-mint">{isChinese ? '技術規格參數：' : 'Thông số kỹ thuật:'}</strong> {displaySpecs}
              </div>
            )}

            {data.details && (
              <div className="space-y-2 pt-2">
                <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">{isChinese ? '遵循標準與特點：' : 'Tiêu chuẩn tuân thủ:'}</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {data.details.map((d, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-gray-700 dark:text-gray-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint shrink-0 mt-0.5" />
                      <span>{d}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

