import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Laptop, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const THEME_OPTIONS = [
  { id: 'light', label: 'Sáng', icon: Sun, desc: 'Giao diện nền sáng' },
  { id: 'dark', label: 'Tối', icon: Moon, desc: 'Giao diện nền tối sang trọng' },
  { id: 'system', label: 'Hệ thống', icon: Laptop, desc: 'Tự động theo thiết bị' },
];

export default function ThemeToggle({ variant = 'dropdown', className = '' }) {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Icon for current active theme
  const ActiveIcon = theme === 'system' ? Laptop : resolvedTheme === 'dark' ? Moon : Sun;

  // VARIANT: SEGMENTED (Ideal for Mobile Drawer or footer)
  if (variant === 'segmented') {
    return (
      <div className={`flex items-center p-1 rounded-2xl bg-gray-100 dark:bg-[#132018] border border-gray-200 dark:border-white/10 ${className}`}>
        {THEME_OPTIONS.map((opt) => {
          const Icon = opt.icon;
          const isSelected = theme === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setTheme(opt.id)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-2.5 rounded-xl text-xs font-semibold transition-all relative ${
                isSelected
                  ? 'text-tea-primary dark:text-tea-mint bg-white dark:bg-[#1C2F23] shadow-sm font-bold'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{opt.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  // VARIANT: DROPDOWN (Ideal for Desktop Navbar)
  return (
    <div ref={dropdownRef} className={`relative inline-block text-left ${className}`}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Chuyển đổi giao diện (Sáng / Tối / Tự động)"
        title={`Giao diện: ${THEME_OPTIONS.find((o) => o.id === theme)?.label || 'Hệ thống'}`}
        className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/80 dark:bg-[#132018]/90 text-gray-700 dark:text-gray-200 hover:text-tea-primary dark:hover:text-tea-mint border border-tea-border/60 dark:border-white/10 shadow-sm hover:shadow-tea-sm transition-all duration-200 backdrop-blur-md"
      >
        <motion.div
          key={theme}
          initial={{ scale: 0.7, rotate: -30, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <ActiveIcon className="w-4 h-4 text-tea-leaf dark:text-tea-mint" />
        </motion.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-48 rounded-2xl bg-white dark:bg-[#132018] border border-tea-border dark:border-white/15 shadow-tea-lg p-1.5 z-50 backdrop-blur-xl"
          >
            <div className="px-3 py-1.5 text-[10px] uppercase tracking-wider font-bold text-gray-400 dark:text-gray-500 border-b border-gray-100 dark:border-white/10 mb-1">
              Chế Độ Giao Diện
            </div>

            <div className="space-y-0.5">
              {THEME_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = theme === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => {
                      setTheme(opt.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-tea-soft/70 dark:bg-tea-green/25 text-tea-primary dark:text-tea-mint font-bold'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 text-tea-leaf dark:text-tea-mint" />
                      <span>{opt.label}</span>
                    </div>
                    {isSelected && <Check className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint" />}
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

