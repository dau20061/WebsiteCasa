import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const LANGUAGE_OPTIONS = [
  {
    id: 'vi',
    label: 'Tiếng Việt',
    shortLabel: 'VI',
    flag: '🇻🇳',
    desc: 'Giao diện Tiếng Việt'
  },
  {
    id: 'zh',
    label: '繁體中文',
    shortLabel: '繁中',
    flag: '🇹🇼',
    desc: 'Traditional Chinese (繁體中文)'
  }
];

export default function LanguageToggle({ variant = 'dropdown', className = '' }) {
  const { language, setLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Đóng dropdown khi bấm ra ngoài
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = LANGUAGE_OPTIONS.find((o) => o.id === language) || LANGUAGE_OPTIONS[0];

  // ============================================================================
  // 1. VARIANT: SEGMENTED (Cho Menu Trượt Mobile Drawer)
  // ============================================================================
  if (variant === 'segmented') {
    return (
      <div className={`flex items-center p-1 rounded-2xl bg-gray-100 dark:bg-[#132018] border border-gray-200 dark:border-white/10 ${className}`}>
        {LANGUAGE_OPTIONS.map((opt) => {
          const isSelected = language === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setLanguage(opt.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isSelected
                  ? 'text-tea-primary dark:text-tea-mint bg-white dark:bg-[#1C2F23] shadow-sm font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <span>{opt.flag}</span>
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // ============================================================================
  // 2. VARIANT: DROPDOWN (Cho Desktop Header Navbar)
  // ============================================================================
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chuyển đổi ngôn ngữ (Tiếng Việt / 繁體中文)"
        title={`Ngôn ngữ: ${currentOption.label}`}
        className="flex items-center gap-1.5 h-9 px-2.5 rounded-xl bg-white/80 dark:bg-[#132018]/90 text-gray-700 dark:text-gray-200 hover:text-tea-primary dark:hover:text-tea-mint border border-tea-border/60 dark:border-white/10 shadow-sm hover:shadow-tea-sm transition-all duration-200 backdrop-blur-md text-xs font-bold"
      >
        <Globe className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint shrink-0" />
        <span className="hidden sm:inline">{currentOption.flag}</span>
        <span className="tracking-wide">{currentOption.shortLabel}</span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-52 rounded-2xl bg-white dark:bg-[#132018] border border-tea-border dark:border-white/15 shadow-tea-lg p-1.5 z-50 backdrop-blur-xl"
          >
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/10 mb-1 flex items-center justify-between">
              <span>Ngôn Ngữ</span>
              <span className="text-gray-400">語言</span>
            </div>

            <div className="space-y-0.5">
              {LANGUAGE_OPTIONS.map((opt) => {
                const isSelected = language === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setLanguage(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-tea-soft dark:bg-[#1C2F23] text-tea-primary dark:text-tea-mint font-bold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm">{opt.flag}</span>
                      <div className="text-left">
                        <div className="leading-snug">{opt.label}</div>
                        <div className="text-[10px] text-gray-400 dark:text-gray-500">{opt.desc}</div>
                      </div>
                    </div>
                    {isSelected && (
                      <Check className="w-4 h-4 text-tea-leaf dark:text-tea-mint shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
