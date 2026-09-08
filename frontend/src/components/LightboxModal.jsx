import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function LightboxModal({ isOpen, onClose, data }) {
  const { isChinese } = useLanguage();

  // Close on Escape key & lock body scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen || !data) return null;

  const displayName = (isChinese && (data.nameZh || data.name_zh || data.titleZh)) || data.name || data.title;
  const displayCategory = (isChinese && (data.categoryZh || data.category_zh || data.badgeZh)) || data.badge || data.category;
  const displayOrigin = (isChinese && (data.originZh || data.origin_zh)) || data.origin;
  const displayCapacity = (isChinese && (data.capacityZh || data.capacity_zh)) || data.capacity;
  const displayScope = (isChinese && (data.descriptionZh || data.descZh || data.description_zh || data.scopeZh)) || data.scope;
  const displaySpecs = (isChinese && (data.specsZh || data.specs_zh)) || data.specs;
  const displayOrg = (isChinese && (data.orgZh || data.org_zh)) || data.org;

  // Determine if there are actual technical details to show (from machine or certification cards)
  const hasTechnicalDetails = Boolean(
    displayOrg ||
    data.certNumber ||
    displayOrigin ||
    displayCapacity ||
    displaySpecs ||
    (data.details && data.details.length > 0)
  );

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 overflow-hidden">
        {/* Dark Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/85 dark:bg-black/95 backdrop-blur-md cursor-zoom-out"
        />

        {/* Global Floating Close Button */}
        <button
          onClick={onClose}
          aria-label={isChinese ? '關閉' : 'Đóng'}
          className="fixed top-4 right-4 sm:top-6 sm:right-6 z-50 p-2.5 sm:p-3 bg-black/60 hover:bg-black/90 text-white rounded-full transition-all duration-200 hover:scale-110 shadow-2xl border border-white/20 backdrop-blur-md cursor-pointer"
        >
          <X className="w-6 h-6" />
        </button>

        {/* PURE IMAGE FULLSCREEN MODE (For Infographics, Posters, Maps) */}
        {!hasTechnicalDetails ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="relative z-10 max-w-[96vw] max-h-[94vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Floating Top Badge */}
            {displayName && (
              <div className="mb-2 sm:mb-3 px-4 py-1.5 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-white flex items-center gap-2 shadow-2xl max-w-[92vw] truncate">
                {displayCategory && (
                  <span className="px-2.5 py-0.5 rounded-full bg-tea-emerald text-white text-xs font-bold shrink-0">
                    {displayCategory}
                  </span>
                )}
                <span className="text-xs sm:text-sm md:text-base font-semibold truncate">
                  {displayName}
                </span>
              </div>
            )}

            {/* Giant Image Container - Zero empty space at bottom, fills viewport */}
            <div className="relative max-h-[86vh] max-w-[96vw] rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl border border-white/20 bg-black/40 flex items-center justify-center">
              <img
                src={data.image}
                alt={displayName || 'Lightbox Preview'}
                className="w-auto h-auto max-h-[86vh] max-w-[96vw] object-contain block mx-auto select-none"
              />
            </div>
          </motion.div>
        ) : (
          /* TECHNICAL SPECIFICATION MODE (For certificates / machines with structured data) */
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="relative z-10 my-auto w-full max-w-4xl max-h-[92vh] flex flex-col bg-white dark:bg-[#132018] rounded-3xl shadow-2xl overflow-hidden border border-white/20"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header / Image preview with object-contain */}
            <div className="relative max-h-[48vh] w-full bg-black/60 flex items-center justify-center overflow-hidden p-2 shrink-0">
              <img
                src={data.image}
                alt={displayName}
                className="max-h-[44vh] w-auto max-w-full object-contain mx-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-3 left-4 right-4 text-white">
                {displayCategory && (
                  <span className="inline-block px-3 py-1 rounded-full bg-tea-emerald/80 text-tea-mint text-xs font-semibold mb-1 backdrop-blur-sm">
                    {displayCategory}
                  </span>
                )}
                <h3 className="text-base sm:text-xl font-bold truncate">{displayName}</h3>
              </div>
            </div>

            {/* Scrollable Details section */}
            <div className="p-5 sm:p-7 space-y-3.5 text-gray-800 dark:text-gray-100 overflow-y-auto max-h-[44vh]">
              {displayOrg && (
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-white/10 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{isChinese ? '認證發證機構：' : 'Cơ quan cấp chứng nhận:'}</span>
                  <span className="font-semibold text-tea-dark dark:text-white">{displayOrg}</span>
                </div>
              )}

              {data.certNumber && (
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-white/10 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{isChinese ? '文號 / 認證編號：' : 'Số hiệu văn bản:'}</span>
                  <span className="font-mono text-xs font-semibold bg-gray-100 dark:bg-black/30 text-gray-700 dark:text-gray-300 px-2.5 py-1 rounded-md border border-transparent dark:border-white/10">
                    {data.certNumber}
                  </span>
                </div>
              )}

              {displayOrigin && (
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-white/10 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{isChinese ? '技術產地來源：' : 'Xuất xứ công nghệ:'}</span>
                  <span className="font-semibold text-tea-emerald dark:text-tea-mint">{displayOrigin}</span>
                </div>
              )}

              {displayCapacity && (
                <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-gray-100 dark:border-white/10 text-sm">
                  <span className="text-gray-500 dark:text-gray-400">{isChinese ? '設備產能 / 規格：' : 'Năng lực / Công suất:'}</span>
                  <span className="font-semibold text-tea-dark dark:text-white">{displayCapacity}</span>
                </div>
              )}

              {displayScope && (
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {displayScope}
                </p>
              )}

              {displaySpecs && (
                <div className="p-3 bg-tea-cream dark:bg-black/30 rounded-xl border border-tea-border dark:border-white/10 text-xs text-gray-700 dark:text-gray-300">
                  <strong className="text-tea-primary dark:text-tea-mint">{isChinese ? '技術規格參數：' : 'Thông số kỹ thuật:'}</strong> {displaySpecs}
                </div>
              )}

              {data.details && data.details.length > 0 && (
                <div className="space-y-2 pt-1">
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
        )}
      </div>
    </AnimatePresence>
  );
}
