import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Award,
  Leaf,
  Sliders,
  Cpu,
  HeartHandshake,
  Droplets,
  ExternalLink,
  ChevronRight,
  TrendingUp,
  FlaskConical,
  Factory
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import WaveDivider from '../components/WaveDivider';
import ProductCard from '../components/ProductCard';
import NewsCard from '../components/NewsCard';
import CertificationCard from '../components/CertificationCard';
import SEO from '../components/SEO';
import FallingTeaLeaves from '../components/FallingTeaLeaves';
import HeroCarousel from '../components/HeroCarousel';
import { getRtdbProducts, getRtdbNews } from '../services/rtdbService';
import { CERTIFICATIONS } from '../constants/certifications';
import { PRODUCTION_STEPS } from '../constants/categories';
import { STATS, CORE_VALUES, PARTNERS_FEEDBACK, COMPANY_INFO } from '../constants/company';
import { useAppUI } from '../layouts/MainLayout';
import { useLanguage } from '../context/LanguageContext';
import heroBannerImg from '../img/imgmain.jpg';
import heroCapsuleImg from '../img/capsule.jpg';
import heroMatchaImg from '../img/matcha.jpg';
import heroToppingImg from '../img/topping.jpg';

const HERO_SLIDES = [
  {
    id: 'tea-bags',
    image: heroBannerImg,
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

export default function Home() {
  const { openSampleModal } = useAppUI();
  const { t, isChinese, isEnglish } = useLanguage();
  const [activeStep, setActiveStep] = useState(0);

    const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('casa_admin_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [news, setNews] = useState(() => {
    const saved = localStorage.getItem('casa_admin_news');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    getRtdbProducts().then((res) => {
      if (Array.isArray(res)) setProducts(res);
    });
    getRtdbNews().then((res) => {
      if (res && res.length > 0) setNews(res);
    });
  }, []);

  const featuredProducts = products.filter((p) => p.featured !== false).slice(0, 4);

  // Lấy các bài viết được chọn làm nổi bật trang chủ (featuredHome)
  const featuredHomeArticles = news.filter(
    (a) => a.featuredHome === true || (a.featuredHome === undefined && a.featured)
  // Lấy các bài viết được chọn làm nổi bật trang chủ (featuredHome), ưu tiên bài mới cập nhật nhất
  const sortByDateDesc = (arr) =>
    [...arr].sort((a, b) => new Date(b.updatedAt || b.date || 0) - new Date(a.updatedAt || a.date || 0));

  const featuredHomeArticles = sortByDateDesc(
    news.filter((a) => a.featuredHome === true || (a.featuredHome === undefined && a.featured === true))
  ).slice(0, 3);
  const displayHomeNews = featuredHomeArticles.length > 0 ? featuredHomeArticles : news.slice(0, 3);

  const displayHomeNews =
    featuredHomeArticles.length > 0 ? featuredHomeArticles : sortByDateDesc(news).slice(0, 3);

  return (
    <div className="overflow-hidden relative">
      <SEO
        title={isEnglish ? "Home - CASA B2B Tea & Beverage Raw Materials" : (isChinese ? "首頁 - CASA 專業商用茶葉原料" : "Trang Chủ")}
        description={isEnglish ? "CASA TEA – Leading B2B manufacturer and wholesale supplier of raw tea, pyramid tea bags, and beverage mixes for milk tea chains and F&B brands." : (isChinese ? "CASA TEA – 專業茶葉原料與植脂末製造商，為手搖飲連鎖與餐飲通路提供批發與研發方案。" : "CASA TEA – Nhà sản xuất và cung ứng sỉ trà nguyên liệu, bột pha chế cao cấp cho chuỗi trà sữa, quán cafe và ngành F&B toàn quốc.")}
      />

      {/* Hiệu Ứng Lá Trà Rơi Nghệ Thuật CASA TEA */}
      <FallingTeaLeaves />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-20 lg:pt-32 lg:pb-28 bg-gradient-to-b from-[#EBF8EE]/80 via-[#DCF3E4]/30 to-[#FAF9F5] dark:from-[#0D1D13] dark:via-[#09140D] dark:to-[#070D09]">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-tea-mint/15 dark:bg-tea-mint/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-36 right-10 w-[450px] h-[450px] bg-tea-leaf/10 dark:bg-tea-leaf/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-[450px] h-[450px] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          {/* Top Intro Section: Centered Headings & CTAs */}
          <div className="text-center max-w-4xl mx-auto space-y-6 sm:space-y-7">
            {/* Pill Badge */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2.5 px-4 sm:px-5 py-2 rounded-full bg-white/85 dark:bg-slate-900/85 border border-tea-leaf/30 dark:border-tea-mint/30 shadow-tea-sm backdrop-blur-md"
            >
              <span className="flex h-2.5 w-2.5 rounded-full bg-tea-leaf animate-ping" />
              <span className="text-xs sm:text-sm font-bold text-tea-primary dark:text-tea-mint tracking-wider uppercase">
                {isEnglish ? 'CASA Premier B2B Tea & Pyramid Bag Supplier' : (isChinese ? 'CASA 專業商用茶葉原料與茶包供應商' : t('hero_pill', 'Giải Pháp Trà Nguyên Liệu & Túi Lọc B2B Hàng Đầu'))}
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-3xl sm:text-5xl md:text-6xl font-extrabold text-tea-dark dark:text-white tracking-tight leading-[1.14]"
            >
              {isEnglish ? (
                <>
                  The Essence of CASA Tea –{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-tea-primary via-tea-green to-tea-leaf dark:from-tea-mint dark:via-tea-leaf dark:to-tea-soft">
                    The Foundation for Exceptional Beverages
                  </span>
                </>
              ) : isChinese ? (
                <>
                  茶之精華 –{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-tea-primary via-tea-green to-tea-leaf dark:from-tea-mint dark:via-tea-leaf dark:to-tea-soft">
                    成就頂級飲品的基石
                  </span>
                </>
              ) : (
                <>
                  Tinh Hoa Trà CASA –{' '}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-tea-primary via-tea-green to-tea-leaf dark:from-tea-mint dark:via-tea-leaf dark:to-tea-soft">
                    Nền Tảng Cho Những Ly Đồ Uống
                  </span>{' '}
                  Tuyệt Hảo
                </>
              )}
            </motion.h1>

            {/* Subheading */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl mx-auto font-normal"
            >
              {isEnglish
                ? 'Specialized in premium commercial loose-leaf tea, pyramid tea bags, and custom blending solutions. Certified ISO 22000 & HACCP, empowering over 2,000+ F&B chains nationwide.'
                : isChinese
                ? '專注研發高品質商用原葉茶、三角立體茶包與專業拼配方案。國際標準 ISO 22000、HACCP 認證，助力手搖飲與餐飲連鎖打造爆款特色飲品。'
                : t('hero_desc', 'Cung cấp trà nguyên liệu tuyển chọn, trà túi lọc tam giác pyramid cao cấp và giải pháp R&D pha chế chuyên sâu. Tiêu chuẩn ISO 22000, HACCP – Đồng hành cùng hơn 2.000+ chuỗi F&B toàn quốc.')}
            </motion.p>

            {/* CTA Group */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-4 pt-2"
            >
              <Link
                to="/products"
                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-tea-primary to-tea-green hover:from-tea-emerald hover:to-tea-primary text-white text-sm sm:text-base font-bold shadow-tea-md hover:shadow-tea-lg transition-all hover:-translate-y-0.5 group"
              >
                <span>{isEnglish ? 'Explore Products' : (isChinese ? '探索精選產品' : 'Khám phá sản phẩm')}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1.5 transition-transform" />
              </Link>

              <button
                onClick={() => openSampleModal()}
                className="inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-2xl bg-white/90 dark:bg-[#132018]/90 hover:bg-tea-soft/60 dark:hover:bg-[#1C2F23] text-tea-primary dark:text-tea-mint text-sm sm:text-base font-bold border border-tea-leaf/30 dark:border-tea-mint/30 shadow-tea-sm hover:shadow-tea-md transition-all hover:-translate-y-0.5 backdrop-blur-md"
              >
                <Sparkles className="w-5 h-5 text-tea-leaf dark:text-tea-mint animate-pulse" />
                <span>{isEnglish ? 'Request Free Sample Kit' : (isChinese ? '免費索取茶樣套件' : 'Đăng ký nhận mẫu thử')}</span>
              </button>

              <Link
                to="/contact"
                className="inline-flex items-center justify-center px-7 py-4 rounded-2xl text-gray-700 dark:text-gray-300 hover:text-tea-primary dark:hover:text-tea-mint hover:bg-black/5 dark:hover:bg-white/5 text-sm sm:text-base font-bold transition-all"
              >
                {isEnglish ? 'B2B Consultation' : (isChinese ? '即刻聯絡諮詢' : 'Liên hệ tư vấn B2B')}
              </Link>
            </motion.div>
          </div>

          {/* Panoramic Flagship Banner Showcase (Isolated Auto-sliding Carousel) */}
          <HeroCarousel />

          {/* Docked 4-Column Luxury Feature Bar (Below the Banner, Clean & Symmetrical) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-8 sm:mt-10 max-w-6xl xl:max-w-7xl mx-auto">
            {/* Card 1: 3 Dòng Cốt Trà */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="p-5 rounded-2xl bg-white/80 dark:bg-[#132018]/80 border border-tea-leaf/20 dark:border-white/10 shadow-tea-sm hover:shadow-tea-md transition-all hover:-translate-y-1 backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-xl bg-tea-soft dark:bg-tea-green/20 flex items-center justify-center text-tea-primary dark:text-tea-mint mb-3.5 shadow-sm">
                <Leaf className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-tea-dark dark:text-white mb-1.5">
                {isEnglish ? '3 Core Tea Bases' : (isChinese ? '三大經典原茶基底' : '3 Dòng Cốt Trà Chuẩn Vị')}
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                {isEnglish
                  ? 'Green Tea, Black Tea & Oolong Tea rich in aroma and body, creating the perfect base for signature milk teas & fruit teas.'
                  : isChinese
                  ? '綠茶 (Green) • 紅茶 (Black) • 烏龍茶 (Oolong) 香氣濃郁飽滿，完美支撐各式手搖特調。'
                  : 'Trà Xanh (Green) • Trà Đen (Black) • Trà Ô Long (Oolong) đậm đà, chuẩn gu người tiêu dùng hiện đại.'}
              </p>
            </motion.div>

            {/* Card 2: Túi Lọc Pyramid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="p-5 rounded-2xl bg-white/80 dark:bg-[#132018]/80 border border-tea-leaf/20 dark:border-white/10 shadow-tea-sm hover:shadow-tea-md transition-all hover:-translate-y-1 backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-xl bg-amber-100/80 dark:bg-amber-900/30 flex items-center justify-center text-amber-700 dark:text-amber-300 mb-3.5 shadow-sm">
                <Award className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-tea-dark dark:text-white mb-1.5">
                {isEnglish ? 'Pyramid Tea Bag Craft' : (isChinese ? '三角立體茶包工藝' : 'Túi Lọc Tam Giác Pyramid')}
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                {isEnglish
                  ? 'Biodegradable food-grade PLA corn fiber mesh, ensuring complete tea leaf expansion without absorbing natural aromas.'
                  : isChinese
                  ? '食品級玉米纖維 PLA 環保網布，不吸附茶香，讓原葉在立體空間中完全舒展釋放。'
                  : 'Màng lưới bắp sinh học tự phân hủy, không gian bung tỏa tối đa cho búp trà nguyên bản.'}
              </p>
            </motion.div>

            {/* Card 3: Chiết xuất TDS > 2.8% */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="p-5 rounded-2xl bg-white/80 dark:bg-[#132018]/80 border border-tea-leaf/20 dark:border-white/10 shadow-tea-sm hover:shadow-tea-md transition-all hover:-translate-y-1 backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-xl bg-tea-mint/30 dark:bg-tea-mint/20 flex items-center justify-center text-tea-emerald dark:text-tea-mint mb-3.5 shadow-sm">
                <FlaskConical className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-tea-dark dark:text-white mb-1.5">
                {isEnglish ? 'High Extraction TDS > 2.8%' : (isChinese ? '高濃度萃取 TDS > 2.8%' : 'Chiết Xuất TDS > 2.8%')}
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                {isEnglish
                  ? 'Rich, lingering aftertaste that never dilutes with milk or ice; consistent flavor across 1,000+ batches.'
                  : isChinese
                  ? '茶湯醇厚回甘，加奶加冰不易淡味，1,000 批次風味始終穩定如一。'
                  : 'Cốt trà sánh đậm đặc biệt, không nhạt vị khi kết hợp đá hoặc sữa, 1.000 lô đồng nhất quanh năm.'}
              </p>
            </motion.div>

            {/* Card 4: Chứng nhận ISO & HACCP */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.7 }}
              className="p-5 rounded-2xl bg-white/80 dark:bg-[#132018]/80 border border-tea-leaf/20 dark:border-white/10 shadow-tea-sm hover:shadow-tea-md transition-all hover:-translate-y-1 backdrop-blur-md"
            >
              <div className="w-12 h-12 rounded-xl bg-blue-100/80 dark:bg-blue-900/30 flex items-center justify-center text-blue-700 dark:text-blue-300 mb-3.5 shadow-sm">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h4 className="text-base font-bold text-tea-dark dark:text-white mb-1.5">
                {isEnglish ? 'International Certifications' : (isChinese ? 'ISO 22000 & HACCP' : 'Chứng Nhận Quốc Tế')}
              </h4>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                {isEnglish
                  ? 'Strict adherence to ISO 22000 and HACCP food safety standards, multi-panel zero pesticide residues tested by SGS.'
                  : isChinese
                  ? '嚴格遵循國際食安管理體系，SGS 多項無農殘檢驗，提供合規合法的批發證明文件。'
                  : 'Đạt chuẩn ISO 22000, HACCP, kiểm nghiệm khắt khe không dư lượng BVTV, an toàn tuyệt đối.'}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: Hero -> Value Proposition */}
      <WaveDivider
        fromBg="bg-[#FAF9F5] dark:bg-[#070D09]"
        toColor="text-white dark:text-[#0C1710]"
        accentColor="text-tea-mint/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-leaf/20 dark:text-tea-leaf/10"
        flipX={false}
      />

      {/* 2. SECTION GIỚI THIỆU NGẮN: "CHÚNG TÔI MANG ĐẾN ĐIỀU GÌ?" */}
      <section className="py-20 bg-white dark:bg-[#0C1710] relative transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={isEnglish ? 'B2B Core Values' : (isChinese ? 'B2B 核心價值' : 'Giá Trị Cốt Lõi B2B')}
            title={isEnglish ? 'What Do We Bring To Your Brand?' : (isChinese ? '我們為您的品牌帶來什麼？' : 'Chúng tôi mang đến điều gì?')}
            subtitle={isEnglish ? 'Providing a sustainable ingredient foundation and standardized quality, empowering beverage brands to captivate customers.' : (isChinese ? '提供穩固可持續的原物料基石與標準化品質，助各大茶飲品牌征服消費者的味蕾。' : 'Cung cấp nền tảng nguyên liệu bền vững, chất lượng chuẩn mực giúp các thương hiệu đồ uống chinh phục vị giác khách hàng.')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {CORE_VALUES.map((val, idx) => {
              const icons = [Leaf, Cpu, Sliders, HeartHandshake];
              const Icon = icons[idx] || Leaf;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 25 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="p-8 rounded-3xl bg-tea-cream/70 dark:bg-[#132018] hover:bg-white dark:hover:bg-[#1A2C21] border border-tea-border/80 dark:border-white/10 hover:border-tea-leaf/30 shadow-tea-sm hover:shadow-tea-lg transition-all group"
                >
                  <div className="w-14 h-14 rounded-2xl bg-tea-soft dark:bg-tea-green/20 flex items-center justify-center text-tea-emerald dark:text-tea-mint group-hover:bg-tea-emerald group-hover:text-white transition-colors mb-6 shadow-sm">
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-xl font-bold text-tea-dark dark:text-white mb-1 group-hover:text-tea-green dark:group-hover:text-tea-mint transition-colors">
                    {(isEnglish && val.titleEn) || (isChinese && val.titleZh) || val.title}
                  </h3>

                  <span className="text-xs font-semibold text-tea-emerald dark:text-tea-leaf block mb-3">
                    {(isEnglish && val.subtitleEn) || (isChinese && val.subtitleZh) || val.subtitle}
                  </span>

                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                    {(isEnglish && val.descEn) || (isChinese && val.descZh) || val.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: Value Proposition -> Featured Products */}
      <WaveDivider
        fromBg="bg-white dark:bg-[#0C1710]"
        toColor="text-[#FAF9F5] dark:text-[#08120B]"
        accentColor="text-tea-leaf/25 dark:text-tea-mint/20"
        secondaryAccent="text-tea-mint/20 dark:text-tea-leaf/10"
        flipX={true}
      />

      {/* 3. SECTION SẢN PHẨM NỔI BẬT */}
      <section className="py-20 bg-[#FAF9F5] dark:bg-[#08120B] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-tea-soft dark:bg-tea-green/20 text-tea-primary dark:text-tea-mint border border-tea-leaf/20 dark:border-tea-mint/30">
                <span className="w-1.5 h-1.5 rounded-full bg-tea-leaf dark:bg-tea-mint" />
                {isEnglish ? 'Best Selling Categories' : (isChinese ? '最暢銷產品類別' : 'Danh Mục Bán Chạy Nhất')}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-tea-dark dark:text-white tracking-tight">
                {isEnglish ? 'Explore Our Commercial Tea Raw Materials' : (isChinese ? '探索我們的商用茶葉原料' : 'Khám phá dòng sản phẩm của chúng tôi')}
              </h2>
              <p className="mt-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base max-w-xl font-normal">
                {isEnglish
                  ? 'A curated selection of rich tea bases, natural aromas, and professional beverage powder bases trusted by leading F&B chains.'
                  : isChinese
                  ? '精選濃厚茶底、天然香氣與專業調飲粉料，深受各大餐飲及手搖飲連鎖品牌信賴。'
                  : 'Tuyển chọn những nền trà đậm vị, hương thơm tự nhiên và bột pha chế chuyên dụng được các chuỗi F&B tin dùng nhất.'}
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-[#132018] hover:bg-tea-primary dark:hover:bg-tea-green text-tea-dark dark:text-white hover:text-white text-xs font-bold border border-tea-border dark:border-white/10 shadow-tea-sm transition-all hover:shadow-tea-md whitespace-nowrap self-start md:self-auto"
            >
              <span>{isEnglish ? 'View all 65+ products' : (isChinese ? '查看全部 65+ 款產品' : 'Xem tất cả 65+ sản phẩm')}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {featuredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onRequestSample={(p) => openSampleModal(p)}
              />
            ))}
          </div>

          {/* Quick Category Pills Bar */}
          <div className="mt-12 p-6 rounded-3xl bg-white dark:bg-[#132018] border border-tea-border dark:border-white/10 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs font-bold text-tea-dark dark:text-white">
              <Sparkles className="w-4 h-4 text-tea-leaf dark:text-tea-mint" />
              <span>{isEnglish ? 'Browse by raw material category:' : (isChinese ? '依原料類別快速瀏覽：' : 'Khám phá theo nhóm nguyên liệu:')}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/products?cat=tra-den" className="px-3.5 py-1.5 rounded-full bg-tea-cream dark:bg-[#1C2F23] hover:bg-tea-soft dark:hover:bg-[#253D2F] text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                {isEnglish ? 'Assam Black Tea' : (isChinese ? '阿薩姆紅茶' : 'Trà Đen Assam')}
              </Link>
              <Link to="/products?cat=tra-oolong" className="px-3.5 py-1.5 rounded-full bg-tea-cream dark:bg-[#1C2F23] hover:bg-tea-soft dark:hover:bg-[#253D2F] text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                {isEnglish ? 'Roasted Oolong Tea' : (isChinese ? '炭焙烏龍茶' : 'Trà Ô Long Nướng')}
              </Link>
              <Link to="/products?cat=tra-lai-xanh" className="px-3.5 py-1.5 rounded-full bg-tea-cream dark:bg-[#1C2F23] hover:bg-tea-soft dark:hover:bg-[#253D2F] text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                {isEnglish ? 'Jasmine Green Tea' : (isChinese ? '茉莉綠茶' : 'Lục Trà Lài')}
              </Link>
              <Link to="/products?cat=tra-rang" className="px-3.5 py-1.5 rounded-full bg-tea-cream dark:bg-[#1C2F23] hover:bg-tea-soft dark:hover:bg-[#253D2F] text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                {isEnglish ? 'Japanese Hojicha' : (isChinese ? '日式焙茶' : 'Hojicha Chuẩn Nhật')}
              </Link>
              <Link to="/products?cat=bot-pha-che" className="px-3.5 py-1.5 rounded-full bg-tea-cream dark:bg-[#1C2F23] hover:bg-tea-soft dark:hover:bg-[#253D2F] text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                {isEnglish ? 'Non-Dairy Creamer' : (isChinese ? '特級植脂末' : 'Bột Béo Thực Vật')}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: Products -> 5-Step Production Story */}
      <WaveDivider
        fromBg="bg-[#FAF9F5] dark:bg-[#08120B]"
        toColor="text-tea-dark dark:text-[#040A06]"
        accentColor="text-tea-mint/35 dark:text-tea-mint/25"
        secondaryAccent="text-tea-leaf/30 dark:text-tea-leaf/15"
        flipX={false}
      />

      {/* 4. SECTION MÁY MÓC & QUY TRÌNH: STORYTELLING 5 BƯỚC */}
      <section className="py-24 bg-tea-dark dark:bg-[#040A06] text-white relative overflow-hidden transition-colors">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-tea-emerald/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tea-leaf/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge={isEnglish ? 'Closed-Loop Modern Line' : (isChinese ? '全封閉式現代化產線' : 'Dây Chuyền Khép Kín')}
            title={isEnglish ? 'Advanced Tea Processing Tech, Delivering Consistent Quality' : (isChinese ? '先進製茶工藝，鑄就穩定品質' : 'Công nghệ tạo nên chất lượng')}
            subtitle={isEnglish ? 'The complete journey from early-morning fresh tea buds to pristine finished product, strictly controlled through a 5-step modernized process.' : (isChinese ? '從晨霧中的鮮嫩茶芽到純淨成品的完整歷程，藉由現代化五步製茶工藝嚴格把關。' : 'Hành trình từ búp chè tươi non sương sớm đến thành phẩm tinh sạch tuyệt đối qua quy trình 5 bước ứng dụng công nghệ hiện đại.')}
            dark={true}
          />

          {/* Interactive Steps Selector Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mb-12 bg-white/5 p-2 rounded-2xl border border-white/10">
            {PRODUCTION_STEPS.map((step, idx) => (
              <button
                key={step.step}
                onClick={() => setActiveStep(idx)}
                className={`py-3 px-3 sm:px-4 rounded-xl text-left transition-all ${
                  activeStep === idx
                    ? 'bg-tea-emerald text-white shadow-tea-sm'
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <div className="text-[11px] font-mono font-bold opacity-75">{isEnglish ? `STEP ${step.step}` : (isChinese ? `步驟 ${step.step}` : `BƯỚC ${step.step}`)}</div>
                <div className="text-xs sm:text-sm font-bold truncate mt-0.5">
                  {(isEnglish && step.titleEn ? step.titleEn.split('&')[0] : (isChinese && step.titleZh ? step.titleZh.split('&')[0] : step.title.split('&')[0]))}
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Story Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 p-6 sm:p-10 rounded-3xl border border-white/10">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tea-mint/20 text-tea-mint text-xs font-bold">
                <Factory className="w-3.5 h-3.5" />
                <span>{isEnglish ? `Process Step ${PRODUCTION_STEPS[activeStep].step} / 05` : (isChinese ? `工藝流程 步驟 ${PRODUCTION_STEPS[activeStep].step} / 05` : `Quy trình Bước ${PRODUCTION_STEPS[activeStep].step} / 05`)}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {(isEnglish && PRODUCTION_STEPS[activeStep].titleEn) || (isChinese && PRODUCTION_STEPS[activeStep].titleZh) || PRODUCTION_STEPS[activeStep].title}
              </h3>

              <h4 className="text-base font-semibold text-tea-mint">
                {(isEnglish && PRODUCTION_STEPS[activeStep].subtitleEn) || (isChinese && PRODUCTION_STEPS[activeStep].subtitleZh) || PRODUCTION_STEPS[activeStep].subtitle}
              </h4>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {(isEnglish && PRODUCTION_STEPS[activeStep].descEn) || (isChinese && PRODUCTION_STEPS[activeStep].descZh) || PRODUCTION_STEPS[activeStep].desc}
              </p>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                <div className="flex items-center gap-2 text-xs text-tea-mint font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isEnglish ? 'Critical Control Point (CCP):' : (isChinese ? '關鍵控制點 (CCP)：' : 'Điểm kiểm soát then chốt (CCP):')}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200">
                  {(isEnglish && PRODUCTION_STEPS[activeStep].highlightEn) || (isChinese && PRODUCTION_STEPS[activeStep].highlightZh) || PRODUCTION_STEPS[activeStep].highlight}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-6 text-xs text-gray-400">
                <span>{isEnglish ? 'Specifications:' : (isChinese ? '規格參數：' : 'Thông số:')} <strong className="text-white">{(isEnglish && PRODUCTION_STEPS[activeStep].statsEn) || (isChinese && PRODUCTION_STEPS[activeStep].statsZh) || PRODUCTION_STEPS[activeStep].stats}</strong></span>
                <Link
                  to="/machinery-certifications"
                  className="inline-flex items-center gap-1 text-tea-mint hover:underline font-bold"
                >
                  <span>{isEnglish ? 'View machinery details' : (isChinese ? '查看設備詳情' : 'Xem chi tiết máy móc')}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/10] bg-gray-900 border border-white/20">
                <img
                  src={PRODUCTION_STEPS[activeStep].image}
                  alt={(isEnglish && PRODUCTION_STEPS[activeStep].titleEn) || (isChinese && PRODUCTION_STEPS[activeStep].titleZh) || PRODUCTION_STEPS[activeStep].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-white/90">
                  {isEnglish ? 'SCADA Intelligent Central Control' : (isChinese ? 'SCADA 智能中央控制系統' : 'Hệ thống kiểm soát SCADA')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: Production Story -> Certifications */}
      <WaveDivider
        fromBg="bg-tea-dark dark:bg-[#040A06]"
        toColor="text-white dark:text-[#0B130E]"
        accentColor="text-tea-leaf/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-mint/25 dark:text-tea-leaf/15"
        flipX={true}
      />

      {/* 5. SECTION CHỨNG NHẬN: "CAM KẾT CHẤT LƯỢNG" */}
      <section className="py-20 bg-white dark:bg-[#0B130E] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={isEnglish ? 'Food Safety & Hygiene Standards' : (isChinese ? '食品安全與衛生標準' : 'An Toàn Vệ Sinh Thực Phẩm')}
            title={isEnglish ? 'Quality Commitment & International Certifications' : (isChinese ? '品質承諾與國際認證' : 'Cam kết chất lượng')}
            subtitle={isEnglish ? 'All CASA tea and ingredient products comply with the strictest Vietnamese and international food safety regulations and standards.' : (isChinese ? 'CASA 所有茶葉與原料產品皆符合越南及國際最嚴格的食品安全法規與品質標準。' : 'Tất cả các sản phẩm trà và bột của CASA đều tuân thủ các chuẩn mực an toàn thực phẩm khắt khe nhất của Việt Nam và quốc tế.')}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {CERTIFICATIONS.map((cert) => (
              <CertificationCard
                key={cert.id}
                cert={cert}
                onSelect={(c) => openLightbox(c)}
              />
            ))}
          </div>

          {/* Compliance banner */}
          <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-tea-mist dark:bg-[#132018] border border-tea-border dark:border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white dark:bg-[#1C2F23] flex items-center justify-center text-tea-emerald dark:text-tea-mint shadow-sm shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-base font-bold text-tea-dark dark:text-white">
                  {isEnglish ? 'Need self-declaration dossiers & lot-specific COA test reports?' : (isChinese ? '需要每批次自我宣告文件與 COA 檢驗報告？' : 'Cần hồ sơ tự công bố & phiếu kiểm nghiệm COA từng lô?')}
                </h4>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-0.5 font-normal">
                  {isEnglish
                    ? 'CASA provides official stamped hard copies and digital PDFs to assist clients with smooth regulatory clearance and commercial operations.'
                    : isChinese
                    ? 'CASA 提供完整蓋印紙本證明及 PDF 電子檔，協助客戶順利完成各項法規備案與進口手續。'
                    : 'CASA cung cấp đầy đủ bản cứng có dấu mộc và bản PDF cho quý khách hàng hoàn tất thủ tục pháp lý.'}
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-tea-primary dark:bg-tea-green hover:bg-tea-emerald text-white text-xs font-bold transition-colors whitespace-nowrap shadow-tea-sm"
            >
              {isEnglish ? 'Request certification documents' : (isChinese ? '索取檢驗認證文件' : 'Yêu cầu hồ sơ chứng nhận')}
            </Link>
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: Certifications -> Stats Counter */}
      <WaveDivider
        fromBg="bg-white dark:bg-[#0B130E]"
        toColor="text-tea-primary dark:text-[#183B2B]"
        accentColor="text-tea-mint/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-leaf/25 dark:text-tea-leaf/15"
        flipX={false}
      />

      {/* 6. STATS COUNTER SECTION */}
      <section className="py-16 bg-gradient-to-r from-tea-primary via-tea-emerald to-tea-green text-white transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-white/15">
            {STATS.map((stat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="pt-4 sm:pt-0 sm:px-4 space-y-2"
              >
                <div className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white font-sans">
                  {stat.value}
                </div>
                <p className="text-xs sm:text-sm text-tea-mint/90 font-medium leading-snug">
                  {(isEnglish && stat.labelEn) || (isChinese && stat.labelZh) || stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: Stats Counter -> Partners Feedback */}
      <WaveDivider
        fromBg="bg-tea-green dark:bg-[#2F7A59]"
        toColor="text-[#FAF9F5] dark:text-[#0E1711]"
        accentColor="text-tea-mint/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-leaf/20 dark:text-tea-leaf/10"
        flipX={true}
      />

      {/* 7. SECTION ĐỐI TÁC & LỜI CHỨNG THỰC */}
      <section className="py-20 bg-[#FAF9F5] dark:bg-[#0E1711] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={isEnglish ? 'Trusted Long-Term Partners' : (isChinese ? '長期合作夥伴' : 'Đối Tác Đồng Hành')}
            title={isEnglish ? 'Trusted by Over 1,200+ F&B Beverage Chains' : (isChinese ? '超過 1,200+ 家餐飲連鎖品牌共同信賴' : 'Được tin dùng bởi hơn 1.200 chuỗi F&B')}
            subtitle={isEnglish ? 'Hear authentic feedback from founders and R&D beverage experts experiencing CASAs consistent tea flavor.' : (isChinese ? '傾聽創辦人與飲品研發專家的真實反饋，見證 CASA 茶葉原料的穩定風味。' : 'Lắng nghe những chia sẻ thực tế từ các nhà sáng lập và chuyên gia R&D đang sử dụng trà nguyên liệu của CASA.')}
          />

          {/* Marquee Partner Brands Simulation */}
          <div className="mb-16 py-6 border-y border-tea-border/60 dark:border-white/10 overflow-hidden">
            <div className="flex items-center justify-around gap-8 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all">
              <span className="text-lg font-black tracking-wider text-gray-700 dark:text-gray-300">T-TEA MILKTEA</span>
              <span className="text-lg font-black tracking-wider text-gray-700 dark:text-gray-300">S-BEVERAGE GROUP</span>
              <span className="text-lg font-black tracking-wider text-gray-700 dark:text-gray-300">THE CHAT CAFE</span>
              <span className="text-lg font-black tracking-wider text-gray-700 dark:text-gray-300">BOBA KINGDOM</span>
              <span className="text-lg font-black tracking-wider text-gray-700 dark:text-gray-300">AN COFFEE & TEA</span>
              <span className="text-lg font-black tracking-wider text-gray-700 dark:text-gray-300">FRESH CUP LAB</span>
            </div>
          </div>

          {/* Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {PARTNERS_FEEDBACK.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="bg-white dark:bg-[#132018] p-7 rounded-3xl border border-tea-border dark:border-white/10 shadow-tea-sm flex flex-col justify-between"
              >
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic mb-6 font-normal">
                  "{(isEnglish && item.contentEn) || (isChinese && item.contentZh) || item.content}"
                </p>

                <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100 dark:border-white/10">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border border-tea-leaf/30"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-tea-dark dark:text-white">{item.name}</h4>
                    <p className="text-[11px] text-gray-600 dark:text-gray-400 line-clamp-1 font-medium">{(isEnglish && item.roleEn) || (isChinese && item.roleZh) || item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: Partners Feedback -> Featured News */}
      {displayHomeNews && displayHomeNews.length > 0 && (
        <WaveDivider
          fromBg="bg-[#FAF9F5] dark:bg-[#0E1711]"
          toColor="text-white dark:text-[#0B130E]"
          accentColor="text-tea-mint/25 dark:text-tea-mint/15"
          secondaryAccent="text-tea-leaf/20 dark:text-tea-leaf/10"
          flipX={false}
        />
      )}

      {/* 8. FEATURED NEWS & F&B INSIGHTS SECTION */}
      {displayHomeNews && displayHomeNews.length > 0 && (
        <section className="py-20 bg-white dark:bg-[#0B130E] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tea-mist dark:bg-[#132018] text-tea-primary dark:text-tea-mint border border-tea-leaf/30 dark:border-tea-mint/30 text-xs font-bold uppercase tracking-wider mb-3 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint" />
                  {t('news_badge', 'Góc Chuyên Gia & Xu Hướng Thị Trường')}
                </div>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-tea-dark dark:text-white tracking-tight">
                  {t('news_title', 'Tin Tức & Bí Quyết Pha Chế Nổi Bật')}
                </h2>
                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 mt-2 max-w-2xl font-normal">
                  {t('news_subtitle', 'Cập nhật xu hướng đồ uống mới nhất, công thức chuẩn Barista SOP và kỹ thuật bảo quản cốt trà từ đội ngũ R&D CASA.')}
                </p>
              </div>

              <Link
                to="/news"
                className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#FAF9F5] dark:bg-[#132018] hover:bg-tea-soft dark:hover:bg-[#1A2C21] border border-tea-border dark:border-white/10 text-tea-primary dark:text-tea-mint text-xs font-bold transition-all shadow-tea-sm group self-start md:self-auto shrink-0"
              >
                <span>{t('news_view_all', 'Xem tất cả bài viết')}</span>
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {displayHomeNews.map((article) => (
                <NewsCard key={article.id || article.slug} article={article} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Animated Wavy Transition: Featured News -> Bottom CTA */}
      <WaveDivider
        fromBg="bg-white dark:bg-[#0B130E]"
        toColor="text-[#FAF9F5] dark:text-[#0E1711]"
        accentColor="text-tea-leaf/25 dark:text-tea-mint/20"
        secondaryAccent="text-tea-mint/20 dark:text-tea-leaf/10"
        flipX={true}
      />

      {/* 9. BOTTOM CTA SECTION */}
      <section className="py-20 bg-[#FAF9F5] dark:bg-[#0E1711] relative transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-14 rounded-4xl bg-gradient-to-br from-tea-primary via-tea-emerald to-tea-green text-white text-center shadow-tea-lg relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-6">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-tea-mint text-xs font-bold uppercase tracking-wider">
                {t('cta_badge', 'Hợp Tác Bền Vững & Phát Triển')}
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {t('cta_title', 'Bạn đang tìm nguồn trà nguyên liệu chuẩn vị cho thương hiệu của mình?')}
              </h2>

              <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
                {t('cta_desc', 'Đội ngũ chuyên gia CASA sẵn sàng tư vấn mẫu thử miễn phí, chuyển giao công thức pha chế tối ưu chi phí và hỗ trợ đồng hành dài hạn.')}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => openSampleModal()}
                  className="px-8 py-4 rounded-2xl bg-white text-tea-primary hover:bg-tea-soft text-sm font-bold shadow-md transition-all hover:scale-105"
                >
                  {t('cta_btn_sample', 'Nhận Bộ Mẫu Thử Miễn Phí')}
                </button>

                <Link
                  to="/contact"
                  className="px-8 py-4 rounded-2xl bg-tea-dark/40 hover:bg-tea-dark/60 text-white text-sm font-bold border border-white/25 transition-all"
                >
                  {t('cta_btn_contact', 'Liên hệ báo giá sỉ')}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

