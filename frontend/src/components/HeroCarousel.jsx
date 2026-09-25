import React, { useState, useEffect, memo } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import heroCapsuleImg from '../img/capsule.webp';
import heroMatchaImg from '../img/matcha.webp';
import heroToppingImg from '../img/topping.webp';

const HERO_SLIDES = [
  {
    id: 'tea-bags',
    image: '/imgmain-desktop.webp',
    imageMobile: '/imgmain-hero.webp',
    badgeVi: 'CASA TEA & TEA BAGS • PREMIUM QUALITY',
    badgeZh: 'CASA TEA & TEA BAGS • 頂級原茶系列',
    badgeEn: 'CASA TEA & PYRAMID TEA BAGS • PREMIUM QUALITY',
    titleVi: 'Cốt Trà Nguyên Lá & Túi Lọc Pyramid Tam Giác',
    titleZh: '原葉茶湯與三角立體茶包工藝',
    titleEn: 'Loose-Leaf Tea & Triangle Pyramid Tea Bag Craft',
    tagVi: '100% Nguyên Liệu Tự Nhiên',
    tagZh: '100% 精選茶葉原料',
    tagEn: '100% Natural Selected Tea',
  },
  {
    id: 'matcha',
    image: heroMatchaImg,
    badgeVi: 'PREMIUM MATCHA & POWDER • NGUYÊN LIỆU BỘT CHUYÊN DỤNG',
    badgeZh: '頂級抹茶與專業調飲粉料系列',
    badgeEn: 'PREMIUM MATCHA & POWDER • PROFESSIONAL BEVERAGE BASES',
    titleVi: 'Bột Trà Xanh Matcha & Bột Pha Chế Chuẩn Vị',
    titleZh: '日式極致抹茶與專業飲品專用粉',
    titleEn: 'Matcha Green Tea Powder & Barista Beverage Mixes',
    tagVi: 'Matcha Tuyển Chọn',
    tagZh: '頂級抹茶原料',
    tagEn: 'Premium Japanese Matcha',
  },
  {
    id: 'topping',
    image: heroToppingImg,
    badgeVi: 'SIGNATURE TOPPING • BỘ SƯU TẬP TOPPING CAO CẤP',
    badgeZh: '獨家風味配料與晶球寒天系列',
    badgeEn: 'SIGNATURE TOPPING • PREMIUM TEXTURE COLLECTION',
    titleVi: 'Bộ Sưu Tập Topping & Thạch Dẻo Đa Tầng Cảm Xúc',
    titleZh: '嚴選手搖飲特色配料與豐富口感',
    titleEn: 'Multi-Layer Topping & Agar Jelly Collection',
    tagVi: 'Topping Chuẩn Chuỗi',
    tagZh: '連鎖專用配料',
    tagEn: 'Chain-Grade Topping',
  },
  {
    id: 'capsule',
    image: heroCapsuleImg,
    badgeVi: 'INNOVATIVE CAPSULE TEA • CÔNG NGHỆ CHIẾT XUẤT MỚI',
    badgeZh: '創新膠囊萃茶與現代提取科技',
    badgeEn: 'INNOVATIVE CAPSULE TEA • ADVANCED EXTRACTION TECH',
    titleVi: 'Viên Nén Trà Capsule – Chiết Xuất Nhanh Chuẩn Vị',
    titleZh: '新型茶膠囊系列 – 極速精準萃取',
    titleEn: 'Capsule Tea System – Rapid Precision Extraction',
    tagVi: 'Công Nghệ Tiên Tiến',
    tagZh: '尖端萃取科技',
    tagEn: 'Advanced Extraction Tech',
  },
];

function HeroCarousel() {
  const { isChinese, isEnglish } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  const goToSlide = (idx) => {
    setCurrentSlide(idx);
  };

  // Progressive background preloading after first paint to keep initial load lightweight
  useEffect(() => {
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(() => {
          HERO_SLIDES.slice(1).forEach((slide) => {
            const img = new Image();
            img.src = slide.image;
          });
        })
      : setTimeout(() => {
          HERO_SLIDES.slice(1).forEach((slide) => {
            const img = new Image();
            img.src = slide.image;
          });
        }, 1200);

    return () => {
      if (window.cancelIdleCallback && typeof idleId === 'number') {
        window.cancelIdleCallback(idleId);
      } else {
        clearTimeout(idleId);
      }
    };
  }, []);

  // Auto-slide effect (changes image every 3.8 seconds)
  useEffect(() => {
    if (!isAutoPlay) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 3800);
    return () => clearInterval(timer);
  }, [isAutoPlay, currentSlide]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.35, ease: 'easeOut' }}
      className="relative w-full max-w-6xl xl:max-w-7xl mx-auto mt-10 sm:mt-14"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      {/* Ambient Backlight Glow Aura */}
      <div className="absolute -inset-4 sm:-inset-8 bg-gradient-to-r from-tea-mint/35 via-tea-leaf/30 to-amber-500/25 rounded-[3rem] blur-3xl opacity-75 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Master Glass Frame */}
      <div
        className="relative p-2.5 sm:p-4 rounded-[2rem] sm:rounded-[3rem] bg-gradient-to-b from-white/90 via-white/50 to-white/20 dark:from-white/15 dark:via-white/5 dark:to-white/5 border-2 border-white/80 dark:border-white/20 shadow-[0_30px_90px_-20px_rgba(15,46,26,0.35)] dark:shadow-[0_30px_90px_-20px_rgba(0,0,0,0.85)] backdrop-blur-2xl group transition-all duration-700 hover:shadow-tea-glow select-none"
      >
        {/* Inner High-Definition Image Holder */}
        <div className="relative rounded-[1.6rem] sm:rounded-[2.4rem] overflow-hidden aspect-[16/10.3] bg-[#0E2218] shadow-inner">
          {/* Stacked Pre-rendered Slides for Instant 0ms Latency Crossfade */}
          {HERO_SLIDES.map((slide, idx) => {
            const isActive = idx === currentSlide;
            return (
              <div
                key={slide.id}
                className={`absolute inset-0 w-full h-full transition-opacity duration-300 ease-out will-change-[opacity] ${
                  isActive ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
                }`}
              >
                <img
                  src={slide.image}
                  alt={isEnglish ? slide.titleEn : (isChinese ? slide.titleZh : slide.titleVi)}
                  loading={idx === 0 ? 'eager' : 'lazy'}
                  decoding="async"
                  className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                />
                <picture>
                  {slide.imageMobile && (
                    <source media="(max-width: 640px)" srcSet={slide.imageMobile} type="image/webp" />
                  )}
                  <img
                    src={slide.image}
                    alt={isEnglish ? slide.titleEn : (isChinese ? slide.titleZh : slide.titleVi)}
                    loading={idx === 0 ? 'eager' : 'lazy'}
                    fetchPriority={idx === 0 ? 'high' : 'auto'}
                    decoding="async"
                    width="1440"
                    height="927"
                    className="w-full h-full object-cover object-center transform scale-100 group-hover:scale-[1.015] transition-transform duration-700 ease-out"
                  />
                </picture>
              </div>
            );
          })}

          {/* Shimmer Light Sweep on Hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none z-10" />

          {/* Subtle Cinematic Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 pointer-events-none z-10" />

          {/* Live Top Tag */}
          <div className="absolute top-3.5 left-3.5 sm:top-5 sm:left-5 z-20 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center gap-2 sm:gap-2.5 text-xs sm:text-sm font-bold shadow-xl">
            <span className="flex h-2.5 w-2.5 rounded-full bg-tea-mint animate-ping" />
            <span>
              {isEnglish ? HERO_SLIDES[currentSlide].badgeEn : (isChinese ? HERO_SLIDES[currentSlide].badgeZh : HERO_SLIDES[currentSlide].badgeVi)}
            </span>
          </div>

          {/* Live Corner Tag */}
          <div className="hidden sm:flex absolute top-5 right-5 z-20 px-4 py-2 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white items-center gap-2 text-xs font-bold shadow-lg">
            <span className="text-amber-400">★</span>
            <span>{isEnglish ? HERO_SLIDES[currentSlide].tagEn : (isChinese ? HERO_SLIDES[currentSlide].tagZh : HERO_SLIDES[currentSlide].tagVi)}</span>
          </div>

          {/* Navigation Arrow: Previous */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              prevSlide();
            }}
            aria-label="Previous image"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Navigation Arrow: Next */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              nextSlide();
            }}
            aria-label="Next image"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-black/40 hover:bg-black/80 backdrop-blur-md border border-white/20 text-white flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-2xl opacity-80 sm:opacity-0 sm:group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          {/* Bottom Center Dots & Slide Indicators */}
          <div className="absolute bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 sm:gap-2.5 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-full bg-black/55 backdrop-blur-md border border-white/20 shadow-xl">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToSlide(idx);
                }}
                className={`transition-all duration-300 rounded-full ${
                  idx === currentSlide
                    ? 'w-7 sm:w-9 h-2.5 bg-tea-mint shadow-[0_0_12px_rgba(105,196,150,0.8)]'
                    : 'w-2.5 h-2.5 bg-white/40 hover:bg-white/80'
                }`}
                title={isEnglish ? slide.titleEn : (isChinese ? slide.titleZh : slide.titleVi)}
              />
            ))}
          </div>

          {/* Bottom Left Slide Counter */}
          <div className="hidden sm:flex absolute bottom-5 left-5 z-20 px-3 py-1.5 rounded-xl bg-black/55 backdrop-blur-md border border-white/15 text-white/90 text-xs font-mono font-bold items-center gap-1.5 shadow-lg">
            <span className="text-tea-mint font-extrabold">0{currentSlide + 1}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/60">0{HERO_SLIDES.length}</span>
          </div>

          {/* Auto-Slide Progress Bar along bottom edge */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-20 overflow-hidden">
            <motion.div
              key={`${currentSlide}-${isAutoPlay}`}
              initial={{ width: '0%' }}
              animate={{ width: isAutoPlay ? '100%' : '0%' }}
              transition={{ duration: 3.8, ease: 'linear' }}
              className="h-full bg-gradient-to-r from-tea-leaf via-tea-mint to-tea-green"
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default memo(HeroCarousel);

