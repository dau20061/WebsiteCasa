import React, { useState, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, PhoneCall, Sparkles, ChevronRight, Leaf } from 'lucide-react';
import { COMPANY_INFO } from '../constants/company';
import ThemeToggle from './ThemeToggle';
import LanguageToggle from './LanguageToggle';
import { useLanguage } from '../context/LanguageContext';

export default function Navbar({ onOpenSampleModal }) {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const NAV_LINKS = [
    { path: '/', label: t('nav_home', 'Trang Chủ') },
    { path: '/about', label: t('nav_about', 'Giới Thiệu') },
    { path: '/machinery-certifications', label: t('nav_machinery', 'Máy Móc & Chứng Nhận') },
    { path: '/products', label: t('nav_products', 'Sản Phẩm') },
    { path: '/news', label: t('nav_news', 'Tin Tức') },
    { path: '/contact', label: t('nav_contact', 'Liên Lạc') },
    { path: '/faq', label: t('nav_faq', 'FAQ') },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const hasHeroBanner = ['/', '/about', '/machinery-certifications', '/products', '/news', '/contact', '/faq'].includes(location.pathname);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/95 dark:bg-[#0B130E]/95 backdrop-blur-md shadow-tea-sm dark:shadow-none py-3 border-b border-tea-border/60 dark:border-white/10'
            : hasHeroBanner
            ? 'bg-transparent py-4 sm:py-5'
            : 'bg-white/90 dark:bg-[#0B130E]/90 backdrop-blur-md py-4 border-b border-tea-border/50 dark:border-white/10'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-3 xl:gap-4">
          {/* Logo Brand */}
          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 select-none">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-tea-primary to-tea-green flex items-center justify-center text-white shadow-tea-sm group-hover:scale-105 transition-transform shrink-0">
              <Leaf className="w-5 h-5 text-tea-mint" />
            </div>
            <div className="flex flex-col justify-center shrink-0">
              <div className="flex items-baseline gap-1.5 leading-none whitespace-nowrap">
                <span className="text-xl sm:text-2xl font-black tracking-tight text-tea-dark dark:text-white">
                  CASA
                </span>
                <span className="text-base sm:text-lg font-bold text-tea-green dark:text-tea-mint">
                  TEA
                </span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-widest uppercase text-gray-500 dark:text-gray-400 font-semibold mt-1 whitespace-nowrap leading-none">
                Beverage Solutions
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center gap-1 xl:gap-1.5 2xl:gap-2">
          <nav className="hidden xl:flex items-center gap-0.5 2xl:gap-1.5 shrink-0">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-2.5 2xl:px-3.5 py-2 rounded-xl text-xs 2xl:text-sm font-semibold transition-all duration-200 relative whitespace-nowrap ${
                  `px-2.5 2xl:px-3 py-1.5 rounded-xl text-[13px] 2xl:text-sm font-semibold transition-all duration-200 relative whitespace-nowrap ${
                    isActive
                      ? 'text-tea-primary dark:text-tea-mint bg-tea-soft/60 dark:bg-tea-green/20'
                      : 'text-gray-700 dark:text-gray-300 hover:text-tea-primary dark:hover:text-tea-mint hover:bg-black/5 dark:hover:bg-white/5'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <span>{link.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeNavIndicator"
                        className="absolute bottom-0 left-2.5 right-2.5 2xl:left-3 2xl:right-3 h-0.5 bg-tea-green dark:bg-tea-mint rounded-full"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Right Header Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Language Toggle (Desktop & Tablet) */}
            <LanguageToggle variant="dropdown" />

            {/* Theme Toggle (Desktop & Tablet) */}
            <ThemeToggle variant="dropdown" />

            {/* Quick Hotline (Desktop only, 2xl) */}
            {/* Quick Hotline (Desktop only >= 1600px) */}
            <a
              href={`tel:${COMPANY_INFO.hotline.replace(/\s/g, '')}`}
              className="hidden 2xl:flex items-center gap-1.5 text-xs font-bold text-tea-primary dark:text-tea-mint hover:text-tea-green px-2 py-2 transition-colors whitespace-nowrap"
              title={`Hotline tư vấn: ${COMPANY_INFO.hotline}`}
              className="hidden min-[1600px]:flex items-center gap-1.5 h-9 px-2.5 rounded-xl text-xs font-bold text-tea-primary dark:text-tea-mint hover:text-tea-green border border-tea-border/60 dark:border-white/10 bg-white/80 dark:bg-[#132018]/90 shadow-sm transition-all whitespace-nowrap"
            >
              <PhoneCall className="w-3.5 h-3.5 text-tea-leaf" />
              <PhoneCall className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint shrink-0" />
              <span>{COMPANY_INFO.hotline}</span>
            </a>

            {/* CTA Button: Nhận mẫu thử */}
            {onOpenSampleModal && (
              <button
                onClick={() => onOpenSampleModal()}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 2xl:px-3.5 py-2 rounded-xl bg-tea-soft dark:bg-tea-green/25 hover:bg-tea-mint/30 text-tea-primary dark:text-tea-mint text-xs font-bold transition-all border border-tea-leaf/30 dark:border-tea-mint/30 shadow-tea-sm hover:shadow-tea-md whitespace-nowrap"
                className="hidden sm:inline-flex items-center justify-center gap-1.5 h-9 px-3 2xl:px-3.5 rounded-xl bg-tea-soft dark:bg-tea-green/25 hover:bg-tea-mint/30 text-tea-primary dark:text-tea-mint text-xs font-bold transition-all border border-tea-leaf/30 dark:border-tea-mint/30 shadow-tea-sm hover:shadow-tea-md whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint" />
                <Sparkles className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint shrink-0" />
                <span>{t('nav_sample_btn', 'Nhận Mẫu Thử')}</span>
              </button>
            )}

            {/* CTA Button: Liên hệ ngay */}
            <Link
              to="/contact"
              className="hidden sm:inline-flex items-center justify-center px-3.5 2xl:px-4 py-2 rounded-xl bg-tea-primary dark:bg-tea-green hover:bg-tea-emerald text-white text-xs font-bold shadow-tea-sm transition-all hover:shadow-tea-md hover:-translate-y-0.5 whitespace-nowrap"
              className="hidden sm:inline-flex items-center justify-center h-9 px-3.5 2xl:px-4 rounded-xl bg-tea-primary dark:bg-tea-green hover:bg-tea-emerald text-white text-xs font-bold shadow-tea-sm transition-all hover:shadow-tea-md hover:-translate-y-0.5 whitespace-nowrap"
            >
              {t('nav_contact_btn', 'Liên hệ ngay')}
            </Link>

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Mở menu"
              className="xl:hidden p-2.5 rounded-xl bg-tea-mist dark:bg-[#132018] text-tea-dark dark:text-gray-200 hover:bg-tea-soft dark:hover:bg-[#1C2F23] border border-transparent dark:border-white/10 transition-colors"
              className="xl:hidden flex items-center justify-center w-9 h-9 rounded-xl bg-tea-mist dark:bg-[#132018] text-tea-dark dark:text-gray-200 hover:bg-tea-soft dark:hover:bg-[#1C2F23] border border-transparent dark:border-white/10 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 xl:hidden">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-out Menu Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-white dark:bg-[#0E1B13] text-gray-800 dark:text-gray-100 shadow-2xl z-20 flex flex-col justify-between overflow-y-auto border-l border-gray-100 dark:border-white/10"
            >
              {/* Drawer Top */}
              <div className="p-6 border-b border-gray-100 dark:border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-tea-primary flex items-center justify-center text-white">
                    <Leaf className="w-4 h-4 text-tea-mint" />
                  </div>
                  <span className="font-bold text-lg text-tea-dark dark:text-white">CASA TEA</span>
                </div>

                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="p-6 space-y-1.5 flex-1">
                {NAV_LINKS.map((link) => (
                  <NavLink
                    key={link.path}
                    to={link.path}
                    className={({ isActive }) =>
                      `flex items-center justify-between p-3.5 rounded-2xl text-sm font-semibold transition-colors ${
                        isActive
                          ? 'bg-tea-soft dark:bg-tea-green/20 text-tea-primary dark:text-tea-mint font-bold'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-white/5'
                      }`
                    }
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-gray-400" />
                  </NavLink>
                ))}
              </div>

              {/* Language Switcher in Mobile Drawer */}
              <div className="px-6 py-3 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                  {t('nav_language', 'Ngôn ngữ')}
                </div>
                <LanguageToggle variant="segmented" />
              </div>

              {/* Theme Switcher in Mobile Drawer */}
              <div className="px-6 py-3 border-t border-gray-100 dark:border-white/10 bg-gray-50/50 dark:bg-black/20">
                <div className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-2">
                  {t('nav_theme', 'Chế độ hiển thị')}
                </div>
                <ThemeToggle variant="segmented" />
              </div>

              {/* Drawer Bottom CTAs */}
              <div className="p-6 border-t border-gray-100 dark:border-white/10 bg-tea-cream/60 dark:bg-black/40 space-y-3">
                <a
                  href={`tel:${COMPANY_INFO.hotline.replace(/\s/g, '')}`}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white dark:bg-[#132018] border border-tea-border dark:border-white/10 text-tea-dark dark:text-white text-xs font-bold shadow-sm"
                >
                  <PhoneCall className="w-4 h-4 text-tea-leaf" />
                  <span>{t('nav_hotline', 'Hotline B2B')}: {COMPANY_INFO.hotline}</span>
                </a>

                {onOpenSampleModal && (
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenSampleModal();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-tea-soft dark:bg-tea-green/20 text-tea-primary dark:text-tea-mint text-xs font-bold border border-tea-leaf/30 dark:border-tea-mint/30"
                  >
                    <Sparkles className="w-4 h-4 text-tea-leaf dark:text-tea-mint" />
                    <span>{t('nav_sample_btn', 'Đăng Ký Nhận Mẫu Thử')}</span>
                  </button>
                )}

                <Link
                  to="/contact"
                  className="w-full flex items-center justify-center py-3 rounded-xl bg-tea-primary dark:bg-tea-green hover:bg-tea-emerald text-white text-xs font-bold shadow-tea-sm transition-colors"
                >
                  {t('nav_contact_btn', 'Liên hệ báo giá ngay')}
                </Link>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}

