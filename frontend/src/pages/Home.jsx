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
import ProductCard from '../components/ProductCard';
import NewsCard from '../components/NewsCard';
import CertificationCard from '../components/CertificationCard';
import SEO from '../components/SEO';
import { getRtdbProducts, getRtdbNews } from '../services/rtdbService';
import { CERTIFICATIONS } from '../constants/certifications';
import { PRODUCTION_STEPS } from '../constants/categories';
import { STATS, CORE_VALUES, PARTNERS_FEEDBACK, COMPANY_INFO } from '../constants/company';
import { useAppUI } from '../layouts/MainLayout';
import { useLanguage } from '../context/LanguageContext';

export default function Home() {
  const { openSampleModal, openLightbox } = useAppUI();
  const { t, isChinese } = useLanguage();
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
      if (res && res.length > 0) setProducts(res);
    });
    getRtdbNews().then((res) => {
      if (res && res.length > 0) setNews(res);
    });
  }, []);

  const featuredProducts = products.filter((p) => p.featured !== false).slice(0, 4);

  // Lấy các bài viết được chọn làm nổi bật trang chủ (featuredHome)
  const featuredHomeArticles = news.filter(
    (a) => a.featuredHome === true || (a.featuredHome === undefined && a.featured)
  ).slice(0, 3);
  const displayHomeNews = featuredHomeArticles.length > 0 ? featuredHomeArticles : news.slice(0, 3);

  return (
    <div className="overflow-hidden">
      <SEO
        title={isChinese ? "首頁 - CASA 專業商用茶葉原料" : "Trang Chủ"}
        description={isChinese ? "CASA TEA – 專業茶葉原料與植脂末製造商，為手搖飲連鎖與餐飲通路提供批發與研發方案。" : "CASA TEA – Nhà sản xuất và cung ứng sỉ trà nguyên liệu, bột pha chế cao cấp cho chuỗi trà sữa, quán cafe và ngành F&B toàn quốc."}
      />

      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center pt-24 pb-16 lg:pt-32 lg:pb-24 bg-gradient-to-b from-[#DFF5E1]/50 via-[#BFE8D0]/20 to-[#FAF9F5] dark:from-[#132B1C]/70 dark:via-[#0F1E14]/40 dark:to-[#0B130E]">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-tea-mint/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-tea-leaf/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            
            {/* Left Column: Copywriting & CTAs */}
            <div className="lg:col-span-7 space-y-6 sm:space-y-8">
              {/* Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 dark:bg-slate-900/80 border border-tea-leaf/30 dark:border-tea-mint/30 shadow-tea-sm backdrop-blur-md"
              >
                <span className="flex h-2 w-2 rounded-full bg-tea-leaf animate-ping" />
                <span className="text-xs font-bold text-tea-primary dark:text-tea-mint tracking-wide uppercase">
                  {t('hero_pill', 'Giải Pháp Trà Nguyên Liệu B2B Hàng Đầu')}
                </span>
              </motion.div>

              {/* Main Heading */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl xl:text-6xl font-extrabold text-tea-dark dark:text-white tracking-tight leading-[1.15]"
              >
                {isChinese ? (
                  <>
                    茶之精華 –{' '}
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-tea-primary via-tea-green to-tea-leaf dark:from-tea-mint dark:via-tea-leaf dark:to-tea-soft">
                      成就頂級飲品的基石
                    </span>
                  </>
                ) : (
                  <>
                    Tinh Hoa Trà –{' '}
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
                className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed max-w-2xl font-normal"
              >
                {t('hero_desc', 'Cung cấp trà nguyên liệu và giải pháp nguyên liệu pha chế chuyên nghiệp cho trà sữa, trà trái cây và đồ uống hiện đại. Đạt chuẩn chất lượng ISO 22000, HACCP và xuất khẩu quốc tế.')}
              </motion.p>

              {/* CTA Group */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap items-center gap-3.5 sm:gap-4 pt-2"
              >
                <Link
                  to="/products"
                  className="inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl bg-tea-primary dark:bg-tea-green hover:bg-tea-emerald text-white text-sm font-bold shadow-tea-md hover:shadow-tea-lg transition-all hover:-translate-y-0.5 group"
                >
                  <span>{isChinese ? '探索精選產品' : 'Khám phá sản phẩm'}</span>
                  <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                </Link>

                <button
                  onClick={() => openSampleModal()}
                  className="inline-flex items-center justify-center gap-2 px-6 py-4 rounded-2xl bg-white dark:bg-[#132018] hover:bg-tea-soft/60 dark:hover:bg-[#1C2F23] text-tea-primary dark:text-tea-mint text-sm font-bold border border-tea-leaf/30 dark:border-tea-mint/30 shadow-tea-sm hover:shadow-tea-md transition-all hover:-translate-y-0.5"
                >
                  <Sparkles className="w-4 h-4 text-tea-leaf dark:text-tea-mint" />
                  <span>{isChinese ? '免費索取茶樣套件' : 'Đăng ký nhận mẫu thử'}</span>
                </button>

                <Link
                  to="/contact"
                  className="inline-flex items-center justify-center px-6 py-4 rounded-2xl text-gray-700 dark:text-gray-300 hover:text-tea-primary dark:hover:text-tea-mint hover:bg-black/5 dark:hover:bg-white/5 text-sm font-bold transition-all"
                >
                  {isChinese ? '即刻聯絡諮詢' : 'Liên hệ với chúng tôi'}
                </Link>
              </motion.div>

              {/* Trust badges footer in hero */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, delay: 0.4 }}
                className="pt-6 border-t border-tea-border/80 dark:border-white/10 flex flex-wrap items-center gap-6 text-xs text-gray-600 dark:text-gray-400 font-medium"
              >
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-tea-leaf" />
                  <span>{isChinese ? 'ISO 22000 & HACCP 國際標準' : 'Tiêu chuẩn ISO 22000 & HACCP'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-tea-leaf" />
                  <span>{isChinese ? 'TDS 高濃度穩定萃取' : 'Chiết xuất TDS đậm đặc & ổn định'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-tea-leaf" />
                  <span>{isChinese ? '全系列原物料批發直送' : 'Giao hàng sỉ toàn quốc'}</span>
                </div>
              </motion.div>
            </div>

            {/* Right Column: Hero Visual Composite with Floating Cards */}
            <div className="lg:col-span-5 relative">
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className="relative mx-auto max-w-md lg:max-w-none"
              >
                {/* Main Hero Visual Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white aspect-[4/5] bg-tea-mist">
                  <img
                    src="https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80"
                    alt={isChinese ? "CASA 頂級商用茶品原料" : "Trà nguyên liệu CASA cao cấp"}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-tea-dark/70 via-transparent to-transparent" />

                  {/* Caption overlay */}
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <span className="px-3 py-1 rounded-full bg-tea-mint/90 text-tea-dark text-xs font-bold uppercase tracking-wider inline-block mb-2">
                      {isChinese ? '嚴選高山產區' : 'Vùng Trồng Chọn Lọc'}
                    </span>
                    <h3 className="text-xl font-bold leading-tight">
                      {isChinese ? '海拔 1,100m 半有機茶園鮮嫩原葉' : 'Búp Trà Xanh Bán Hữu Cơ Cao Nguyên 1.100m'}
                    </h3>
                    <p className="text-xs text-white/80 mt-1">
                      {isChinese ? '密閉循環熱風烘焙 完整鎖住精華香氣' : 'Sao sấy tầng sôi khép kín lưu giữ trọn vẹn hương vị tinh túy'}
                    </p>
                  </div>
                </div>

                {/* Floating Card 1: Sensory TDS Note */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  className="absolute -top-6 -left-6 sm:-left-8 bg-white/95 dark:bg-[#132018]/95 backdrop-blur-md p-4 rounded-2xl shadow-tea-lg border border-tea-border dark:border-white/10 flex items-center gap-3.5 z-20 max-w-[240px] animate-float-slow"
                >
                  <div className="w-11 h-11 rounded-xl bg-tea-soft dark:bg-tea-green/30 flex items-center justify-center text-tea-emerald dark:text-tea-mint shrink-0">
                    <FlaskConical className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-gray-400 dark:text-gray-400 block">
                      {isChinese ? '茶湯濃郁醇厚度' : 'Độ Đậm Cốt Trà'}
                    </span>
                    <span className="text-sm font-extrabold text-tea-dark dark:text-white">
                      {isChinese ? 'TDS > 2.8% 連鎖標準' : 'TDS > 2.8% Chuẩn Chuỗi'}
                    </span>
                  </div>
                </motion.div>

                {/* Floating Card 2: 100% Consistent Flavor */}
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.5 }}
                  className="absolute -bottom-6 -right-4 sm:-right-8 bg-white/95 dark:bg-[#132018]/95 backdrop-blur-md p-4 rounded-2xl shadow-tea-lg border border-tea-border dark:border-white/10 flex items-center gap-3.5 z-20 max-w-[260px] animate-float-delayed"
                >
                  <div className="w-11 h-11 rounded-xl bg-tea-mint/30 dark:bg-tea-green/30 flex items-center justify-center text-tea-dark dark:text-tea-mint shrink-0">
                    <Sliders className="w-6 h-6 text-tea-emerald dark:text-tea-mint" />
                  </div>
                  <div>
                    <span className="text-[11px] uppercase font-bold text-gray-400 dark:text-gray-400 block">
                      {isChinese ? '四季風味穩定性' : 'Độ Ổn Định Hương Vị'}
                    </span>
                    <span className="text-sm font-extrabold text-tea-dark dark:text-white">
                      {isChinese ? '1,000 批次始終如一' : '1.000 Lô Như Một Quanh Năm'}
                    </span>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SECTION GIỚI THIỆU NGẮN: "CHÚNG TÔI MANG ĐẾN ĐIỀU GÌ?" */}
      <section className="py-20 bg-white dark:bg-[#0B130E] relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={isChinese ? 'B2B 核心價值' : 'Giá Trị Cốt Lõi B2B'}
            title={isChinese ? '我們為您的品牌帶來什麼？' : 'Chúng tôi mang đến điều gì?'}
            subtitle={isChinese ? '提供穩固可持續的原物料基石與標準化品質，助各大茶飲品牌征服消費者的味蕾。' : 'Cung cấp nền tảng nguyên liệu bền vững, chất lượng chuẩn mực giúp các thương hiệu đồ uống chinh phục vị giác khách hàng.'}
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
                    {(isChinese && val.titleZh) || val.title}
                  </h3>

                  <span className="text-xs font-semibold text-tea-emerald dark:text-tea-leaf block mb-3">
                    {(isChinese && val.subtitleZh) || val.subtitle}
                  </span>

                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {(isChinese && val.descZh) || val.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. SECTION SẢN PHẨM NỔI BẬT */}
      <section className="py-20 bg-[#FAF9F5] dark:bg-[#0E1711] border-t border-tea-border/60 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3 bg-tea-soft dark:bg-tea-green/20 text-tea-primary dark:text-tea-mint border border-tea-leaf/20 dark:border-tea-mint/30">
                <span className="w-1.5 h-1.5 rounded-full bg-tea-leaf dark:bg-tea-mint" />
                {isChinese ? '最暢銷產品類別' : 'Danh Mục Bán Chạy Nhất'}
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-tea-dark dark:text-white tracking-tight">
                {isChinese ? '探索我們的商用茶葉原料' : 'Khám phá dòng sản phẩm của chúng tôi'}
              </h2>
              <p className="mt-2 text-gray-600 dark:text-gray-300 text-sm sm:text-base max-w-xl">
                {isChinese
                  ? '精選濃厚茶底、天然香氣與專業調飲粉料，深受各大餐飲及手搖飲連鎖品牌信賴。'
                  : 'Tuyển chọn những nền trà đậm vị, hương thơm tự nhiên và bột pha chế chuyên dụng được các chuỗi F&B tin dùng nhất.'}
              </p>
            </div>

            <Link
              to="/products"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white dark:bg-[#132018] hover:bg-tea-primary dark:hover:bg-tea-green text-tea-dark dark:text-white hover:text-white text-xs font-bold border border-tea-border dark:border-white/10 shadow-tea-sm transition-all hover:shadow-tea-md whitespace-nowrap self-start md:self-auto"
            >
              <span>{isChinese ? '查看全部 65+ 款產品' : 'Xem tất cả 65+ sản phẩm'}</span>
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
              <span>{isChinese ? '依原料類別快速瀏覽：' : 'Khám phá theo nhóm nguyên liệu:'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Link to="/products?cat=tra-den" className="px-3.5 py-1.5 rounded-full bg-tea-cream dark:bg-[#1C2F23] hover:bg-tea-soft dark:hover:bg-[#253D2F] text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                {isChinese ? '阿薩姆紅茶' : 'Trà Đen Assam'}
              </Link>
              <Link to="/products?cat=tra-oolong" className="px-3.5 py-1.5 rounded-full bg-tea-cream dark:bg-[#1C2F23] hover:bg-tea-soft dark:hover:bg-[#253D2F] text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                {isChinese ? '炭焙烏龍茶' : 'Trà Ô Long Nướng'}
              </Link>
              <Link to="/products?cat=tra-lai-xanh" className="px-3.5 py-1.5 rounded-full bg-tea-cream dark:bg-[#1C2F23] hover:bg-tea-soft dark:hover:bg-[#253D2F] text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                {isChinese ? '茉莉綠茶' : 'Lục Trà Lài'}
              </Link>
              <Link to="/products?cat=tra-rang" className="px-3.5 py-1.5 rounded-full bg-tea-cream dark:bg-[#1C2F23] hover:bg-tea-soft dark:hover:bg-[#253D2F] text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                {isChinese ? '日式焙茶' : 'Hojicha Chuẩn Nhật'}
              </Link>
              <Link to="/products?cat=bot-pha-che" className="px-3.5 py-1.5 rounded-full bg-tea-cream dark:bg-[#1C2F23] hover:bg-tea-soft dark:hover:bg-[#253D2F] text-xs font-semibold text-gray-700 dark:text-gray-200 transition-colors">
                {isChinese ? '特級植脂末' : 'Bột Béo Thực Vật'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. SECTION MÁY MÓC & QUY TRÌNH: STORYTELLING 5 BƯỚC */}
      <section className="py-24 bg-tea-dark text-white relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-tea-emerald/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-tea-leaf/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge={isChinese ? '全封閉式現代化產線' : 'Dây Chuyền Khép Kín'}
            title={isChinese ? '先進製茶工藝，鑄就穩定品質' : 'Công nghệ tạo nên chất lượng'}
            subtitle={isChinese ? '從晨霧中的鮮嫩茶芽到純淨成品的完整歷程，藉由現代化五步製茶工藝嚴格把關。' : 'Hành trình từ búp chè tươi non sương sớm đến thành phẩm tinh sạch tuyệt đối qua quy trình 5 bước ứng dụng công nghệ hiện đại.'}
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
                <div className="text-[11px] font-mono font-bold opacity-75">{isChinese ? `步驟 ${step.step}` : `BƯỚC ${step.step}`}</div>
                <div className="text-xs sm:text-sm font-bold truncate mt-0.5">
                  {(isChinese && step.titleZh ? step.titleZh.split('&')[0] : step.title.split('&')[0])}
                </div>
              </button>
            ))}
          </div>

          {/* Active Step Story Showcase */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-white/5 p-6 sm:p-10 rounded-3xl border border-white/10">
            <div className="lg:col-span-6 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-tea-mint/20 text-tea-mint text-xs font-bold">
                <Factory className="w-3.5 h-3.5" />
                <span>{isChinese ? `工藝流程 步驟 ${PRODUCTION_STEPS[activeStep].step} / 05` : `Quy trình Bước ${PRODUCTION_STEPS[activeStep].step} / 05`}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                {(isChinese && PRODUCTION_STEPS[activeStep].titleZh) || PRODUCTION_STEPS[activeStep].title}
              </h3>

              <h4 className="text-base font-semibold text-tea-mint">
                {(isChinese && PRODUCTION_STEPS[activeStep].subtitleZh) || PRODUCTION_STEPS[activeStep].subtitle}
              </h4>

              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                {(isChinese && PRODUCTION_STEPS[activeStep].descZh) || PRODUCTION_STEPS[activeStep].desc}
              </p>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/15 space-y-2">
                <div className="flex items-center gap-2 text-xs text-tea-mint font-bold">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{isChinese ? '關鍵控制點 (CCP)：' : 'Điểm kiểm soát then chốt (CCP):'}</span>
                </div>
                <p className="text-xs sm:text-sm text-gray-200">
                  {(isChinese && PRODUCTION_STEPS[activeStep].highlightZh) || PRODUCTION_STEPS[activeStep].highlight}
                </p>
              </div>

              <div className="pt-2 flex items-center gap-6 text-xs text-gray-400">
                <span>{isChinese ? '規格參數：' : 'Thông số:'} <strong className="text-white">{(isChinese && PRODUCTION_STEPS[activeStep].statsZh) || PRODUCTION_STEPS[activeStep].stats}</strong></span>
                <Link
                  to="/machinery-certifications"
                  className="inline-flex items-center gap-1 text-tea-mint hover:underline font-bold"
                >
                  <span>{isChinese ? '查看設備詳情' : 'Xem chi tiết máy móc'}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[16/10] bg-gray-900 border border-white/20">
                <img
                  src={PRODUCTION_STEPS[activeStep].image}
                  alt={(isChinese && PRODUCTION_STEPS[activeStep].titleZh) || PRODUCTION_STEPS[activeStep].title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-lg text-xs text-white/90">
                  {isChinese ? 'SCADA 智能中央控制系統' : 'Hệ thống kiểm soát SCADA'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. SECTION CHỨNG NHẬN: "CAM KẾT CHẤT LƯỢNG" */}
      <section className="py-20 bg-white dark:bg-[#0B130E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={isChinese ? '食品安全與衛生標準' : 'An Toàn Vệ Sinh Thực Phẩm'}
            title={isChinese ? '品質承諾與國際認證' : 'Cam kết chất lượng'}
            subtitle={isChinese ? 'CASA 所有茶葉與原料產品皆符合越南及國際最嚴格的食品安全法規與品質標準。' : 'Tất cả các sản phẩm trà và bột của CASA đều tuân thủ các chuẩn mực an toàn thực phẩm khắt khe nhất của Việt Nam và quốc tế.'}
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
                  {isChinese ? '需要每批次自我宣告文件與 COA 檢驗報告？' : 'Cần hồ sơ tự công bố & phiếu kiểm nghiệm COA từng lô?'}
                </h4>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-0.5">
                  {isChinese ? 'CASA 提供完整蓋印紙本證明及 PDF 電子檔，協助客戶順利完成各項法規備案與進口手續。' : 'CASA cung cấp đầy đủ bản cứng có dấu mộc và bản PDF cho quý khách hàng hoàn tất thủ tục pháp lý.'}
                </p>
              </div>
            </div>

            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-tea-primary dark:bg-tea-green hover:bg-tea-emerald text-white text-xs font-bold transition-colors whitespace-nowrap shadow-tea-sm"
            >
              {isChinese ? '索取檢驗認證文件' : 'Yêu cầu hồ sơ chứng nhận'}
            </Link>
          </div>
        </div>
      </section>

      {/* 6. STATS COUNTER SECTION */}
      <section className="py-16 bg-gradient-to-r from-tea-primary via-tea-emerald to-tea-green text-white">
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
                  {(isChinese && stat.labelZh) || stat.label}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. SECTION ĐỐI TÁC & LỜI CHỨNG THỰC */}
      <section className="py-20 bg-[#FAF9F5] dark:bg-[#0E1711]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={isChinese ? '長期合作夥伴' : 'Đối Tác Đồng Hành'}
            title={isChinese ? '超過 1,200+ 家餐飲連鎖品牌共同信賴' : 'Được tin dùng bởi hơn 1.200 chuỗi F&B'}
            subtitle={isChinese ? '傾聽創辦人與飲品研發專家的真實反饋，見證 CASA 茶葉原料的穩定風味。' : 'Lắng nghe những chia sẻ thực tế từ các nhà sáng lập và chuyên gia R&D đang sử dụng trà nguyên liệu của CASA.'}
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
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed italic mb-6">
                  "{(isChinese && item.contentZh) || item.content}"
                </p>

                <div className="flex items-center gap-3.5 pt-4 border-t border-gray-100 dark:border-white/10">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-11 h-11 rounded-full object-cover border border-tea-leaf/30"
                  />
                  <div>
                    <h4 className="text-sm font-bold text-tea-dark dark:text-white">{item.name}</h4>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 line-clamp-1">{(isChinese && item.roleZh) || item.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. FEATURED NEWS & F&B INSIGHTS SECTION */}
      {displayHomeNews && displayHomeNews.length > 0 && (
        <section className="py-20 bg-white dark:bg-[#0B130E] border-t border-tea-border/60 dark:border-white/10 transition-colors">
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
                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mt-2 max-w-2xl">
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

      {/* 9. BOTTOM CTA SECTION */}
      <section className="py-20 bg-[#FAF9F5] dark:bg-[#0E1711] relative border-t border-tea-border/60 dark:border-white/10 transition-colors">
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

