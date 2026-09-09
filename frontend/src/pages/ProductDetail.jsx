import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Download,
  Clock,
  Box,
  AlertCircle,
  RefreshCw,
  ShoppingBag,
  MessageCircle
} from 'lucide-react';
import SEO from '../components/SEO';
import ProductCard from '../components/ProductCard';
import { getRtdbProducts } from '../services/rtdbService';
import { useAppUI } from '../layouts/MainLayout';
import { useToast } from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { openSampleModal } = useAppUI();
  const { showToast } = useToast();
  const { t, isChinese } = useLanguage();

  const [allProducts, setAllProducts] = useState(() => {
    const saved = localStorage.getItem('casa_admin_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [isLoading, setIsLoading] = useState(() => {
    const saved = localStorage.getItem('casa_admin_products');
    const list = saved ? JSON.parse(saved) : [];
    return !list.some((p) => p.id === id);
  });

  useEffect(() => {
    getRtdbProducts()
      .then((res) => {
        if (Array.isArray(res)) {
          setAllProducts(res);
        }
      })
      .catch((err) => {
        console.warn('Lỗi khi tải sản phẩm từ RTDB:', err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [id]);

  const product = allProducts.find((p) => p.id === id);

  // Màn hình đang tải từ Realtime Database
  if (isLoading) {
    return (
      <div className="pt-36 pb-20 text-center max-w-md mx-auto px-4">
        <RefreshCw className="w-10 h-10 text-tea-primary animate-spin mx-auto mb-4" />
        <h2 className="text-xl font-bold text-tea-dark">Đang tải thông tin sản phẩm...</h2>
      </div>
    );
  }

  // Xử lý khi không tìm thấy sản phẩm
  if (!product) {
    return (
      <div className="pt-36 pb-20 text-center max-w-md mx-auto px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-tea-dark dark:text-white">
          {isChinese ? '找不到該產品' : 'Không tìm thấy sản phẩm'}
        </h2>
        <p className="text-sm text-gray-700 dark:text-gray-300 mt-2 font-normal">
          {isChinese ? '產品編號 ' : 'Mã sản phẩm '}
          <span className="font-mono font-bold text-tea-primary dark:text-tea-mint">{id}</span>
          {isChinese ? ' 不存在於系統中或已停產。' : ' không tồn tại trên hệ thống hoặc đã ngừng cung ứng.'}
        </p>
        <Link
          to="/products"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-tea-primary text-white text-xs font-bold shadow-tea-sm"
        >
          <ArrowLeft className="w-4 h-4" /> {isChinese ? '返回產品系列目錄' : 'Quay lại danh mục sản phẩm'}
        </Link>
      </div>
    );
  }

  // Dữ liệu an toàn dự phòng (Safe Defaults) & Song ngữ (Bilingual)
  const categoryId = product.category || 'tra-den';
  const categoryName = isChinese
    ? t(`cat_${categoryId.replace(/-/g, '_')}`, product.categoryName || 'Trà Nguyên Liệu')
    : (product.categoryName || 'Trà Nguyên Liệu');
  const sku = product.sku || `CS-TEA-${product.id?.slice(-4) || '01'}`;
  const origin = (isChinese && (product.originZh || product.origin_zh)) || product.origin || (isChinese ? '精選保祿與木州高山茶園產區' : 'Vùng cao nguyên Bảo Lộc & Mộc Châu tuyển chọn');
  const shelfLife = product.shelfLife || '24 tháng kể từ ngày sản xuất';
  const storageText = (isChinese && (product.storageZh || product.storage_zh)) || product.storage || (isChinese ? '存放於陰涼乾燥處（25°C以下），避免陽光直射。' : 'Bảo quản nơi khô ráo, thoáng mát (dưới 25°C), tránh ánh nắng trực tiếp.');
  const fullDesc = (isChinese && (product.fullDescZh || product.fullDesc_zh)) || product.fullDesc || product.shortDesc || (isChinese ? '特級商用茶葉原料，經現代化科技製茶工藝精心烘焙，確保連鎖餐飲四季風味穩定一致。' : 'Dòng trà nguyên liệu cao cấp được tinh tuyển và chế biến theo quy trình công nghệ hiện đại, đảm bảo độ ổn định hương vị tối đa cho các chuỗi F&B.');
  const displayName = (isChinese && (product.nameZh || product.name_zh)) || product.name;
  const displayBadge = (isChinese && (product.badgeZh || product.badge_zh)) || product.badge;
  const image = product.image || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1000&q=80';

  const tasteProfile = {
    aroma: product.tasteProfile?.aroma ?? 85,
    body: product.tasteProfile?.body ?? 88,
    sweetness: product.tasteProfile?.sweetness ?? 80,
    color: product.tasteProfile?.color || 'Đỏ Ruby Ánh Nâu'
  };

  const applications = Array.isArray(product.applications) && product.applications.length > 0
    ? (isChinese && product.applicationsZh ? product.applicationsZh : product.applications)
    : (isChinese
        ? ['招牌厚乳奶茶基底', '芝士奶蓋茶 Macchiato', '冷萃低溫慢釀 Cold Brew']
        : ['Trà sữa truyền thống đậm vị', 'Trà kem cheese Macchiato', 'Ủ lạnh Cold Brew']);

  const packaging = Array.isArray(product.packaging) && product.packaging.length > 0
    ? (isChinese && product.packagingZh ? product.packagingZh : product.packaging)
    : (isChinese
        ? ['三層鋁箔真空鎖鮮包裝 1kg (10包/箱)', '出口標準 25kg 鍍銀專業專用編織袋']
        : ['Gói nhôm 3 lớp 1kg hút chân không (10 gói/thùng)', 'Bao tráng bạc chuyên dụng 25kg chuẩn xuất khẩu']);

  const brewingGuide = product.brewingGuide || {
    ratio: isChinese ? '1:30 (35g 茶葉 / 1050ml 純淨水)' : '1:30 (35g trà / 1050ml nước)',
    temp: '92°C - 95°C',
    time: isChinese ? '12 - 15 分鐘 (密閉悶泡)' : '12 - 15 phút (ủ kín nhiệt)',
    tips: isChinese
      ? '過濾茶渣後立即加入 250g 潔淨冰塊進行降溫鎖香（冰震工藝），以保持茶湯清澈晶瑩並鎖住天然植物精油香氣。'
      : 'Lọc bỏ bã xong sốc nhiệt ngay bằng 250g đá bi sạch để giữ màu nước trong sáng và khóa trọn hương thơm tinh dầu.'
  };

  const specifications = Array.isArray(product.specifications) && product.specifications.length > 0
    ? product.specifications
    : (isChinese
        ? [
            { label: '含水率 (Moisture)', value: '< 6.5%' },
            { label: '外來異物雜質', value: '0% (通過 Sortex 光學色選剔除)' },
            { label: '醇厚度 (Body)', value: 'High Body B2B 商用級' },
            { label: '食品安全認證', value: '符合 ISO 22000 & HACCP 標準' }
          ]
        : [
            { label: 'Độ ẩm (Moisture)', value: '< 6.5%' },
            { label: 'Tạp chất lạ', value: '0% (Qua máy tách Sortex quang học)' },
            { label: 'Độ đầm vị (Body)', value: 'High Body B2B' },
            { label: 'Tiêu chuẩn kiểm định', value: 'Đạt chuẩn ISO 22000 & HACCP' }
          ]);

  // Sản phẩm liên quan cùng danh mục
  const relatedProducts = allProducts
    .filter((p) => p.id !== product.id && (p.category === product.category || !product.category))
    .slice(0, 3);

  const handleDownloadDoc = (docType) => {
    showToast(`Đang tải tài liệu kỹ thuật ${docType} cho ${sku} (TDS / Tiêu chuẩn kiểm nghiệm)...`, 'info');
  };

  return (
    <div className="pt-20 pb-20 bg-[#FAF9F5] dark:bg-[#0B130E] min-h-screen transition-colors">
      <SEO
        title={product.name}
        description={product.shortDesc || fullDesc}
      />

      {/* Breadcrumbs */}
      <div className="bg-white/90 dark:bg-[#0B130E]/90 backdrop-blur-md border-b border-tea-border/60 dark:border-white/10 py-3.5 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-tea-primary dark:hover:text-tea-mint">
            {isChinese ? '首頁' : 'Trang Chủ'}
          </Link>
          <span>/</span>
          <Link to="/products" className="hover:text-tea-primary dark:hover:text-tea-mint">
            {isChinese ? '產品中心' : 'Sản Phẩm'}
          </Link>
          <span>/</span>
          <Link to={`/products?cat=${categoryId}`} className="hover:text-tea-primary dark:hover:text-tea-mint">
            {categoryName}
          </Link>
          <span>/</span>
          <span className="text-tea-dark dark:text-white font-semibold truncate max-w-xs">{displayName}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* Back Link */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-tea-primary dark:hover:text-tea-mint mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {isChinese ? '返回上一頁列表' : 'Quay lại danh sách'}
        </button>

        {/* Top Product Overview Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 bg-white dark:bg-[#132018] rounded-4xl p-6 sm:p-10 border border-tea-border dark:border-white/10 shadow-tea-sm transition-colors">
          
          {/* Left Column: Product Image Showcase */}
          <div className="lg:col-span-6 space-y-4">
            <div className="relative rounded-3xl overflow-hidden aspect-square bg-[#FAF9F5] dark:bg-[#0B130E] border border-tea-border dark:border-white/10">
              <img
                src={image}
                alt={displayName}
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute top-4 left-4">
                <span className="px-3.5 py-1.5 rounded-full bg-white/95 dark:bg-[#132018]/95 text-tea-primary dark:text-tea-mint text-xs font-bold tracking-wide uppercase shadow-sm border border-black/5 dark:border-white/10">
                  {categoryName}
                </span>
              </div>
              {displayBadge && (
                <div className="absolute top-4 right-4">
                  <span className="px-3.5 py-1.5 rounded-full bg-tea-primary text-tea-mint text-xs font-bold tracking-wide shadow-sm flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    {displayBadge}
                  </span>
                </div>
              )}
            </div>

            {/* Sub details badges */}
            <div className="grid grid-cols-3 gap-3 text-center text-xs">
              <div className="p-3 rounded-2xl bg-[#FAF9F5] dark:bg-[#0B130E] border border-tea-border dark:border-white/10">
                <span className="text-gray-500 dark:text-gray-400 block font-mono text-[10px] font-semibold">{isChinese ? '產品編號' : 'MÃ SKU'}</span>
                <span className="font-bold text-tea-dark dark:text-white mt-0.5 block">{sku}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF9F5] dark:bg-[#0B130E] border border-tea-border dark:border-white/10">
                <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-semibold">{isChinese ? '保存期限' : 'HẠN SỬ DỤNG'}</span>
                <span className="font-bold text-tea-dark dark:text-white mt-0.5 block">{isChinese ? '24 個月' : shelfLife}</span>
              </div>
              <div className="p-3 rounded-2xl bg-[#FAF9F5] dark:bg-[#0B130E] border border-tea-border dark:border-white/10">
                <span className="text-gray-500 dark:text-gray-400 block text-[10px] font-semibold">{isChinese ? '品質認證' : 'TIÊU CHUẨN'}</span>
                <span className="font-bold text-tea-emerald dark:text-tea-mint mt-0.5 block">ISO 22000</span>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Description, and CTAs */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold text-tea-emerald dark:text-tea-mint uppercase tracking-wider block">
                {isChinese ? '產地來源: ' : 'Xuất xứ: '}{origin}
              </span>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-tea-dark dark:text-white leading-snug">
                {displayName}
              </h1>

              <p className="text-sm sm:text-base text-gray-800 dark:text-gray-200 leading-relaxed whitespace-pre-line font-normal">
                {fullDesc}
              </p>

              {/* Applications Badges */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 dark:text-gray-200 uppercase tracking-wider block">
                  {isChinese ? '最佳調飲應用推薦：' : 'Ứng dụng pha chế tối ưu:'}
                </span>
                <div className="flex flex-wrap gap-2">
                  {applications.map((app, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-xl bg-[#FAF9F5] dark:bg-[#0B130E] border border-tea-border dark:border-white/10 text-xs font-medium text-tea-dark dark:text-gray-200"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions: Purchase / Contact & Request Free Sample */}
            <div className="pt-6 border-t border-gray-100 dark:border-white/10 space-y-3">
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {product.purchaseAction === 'shopee' && product.shopeeUrl ? (
                  <>
                    <a
                      href={product.shopeeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-[#EE4D2D] hover:bg-[#D73211] text-white text-xs sm:text-sm font-bold shadow-md transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>{isChinese ? '前往蝦皮賣場購買 (Shopee)' : 'Mua Ngay Trên Shopee'}</span>
                    </a>

                    <Link
                      to={`/contact?product=${encodeURIComponent(displayName)}`}
                      className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-tea-mist dark:bg-[#0B130E] hover:bg-tea-soft dark:hover:bg-[#1B2E23] text-tea-primary dark:text-tea-mint border border-tea-border dark:border-white/10 text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-2"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>{isChinese ? '聯繫諮詢採購' : 'Liên Hệ Tư Vấn'}</span>
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to={`/contact?product=${encodeURIComponent(displayName)}`}
                      className="w-full sm:flex-1 py-4 px-6 rounded-2xl bg-tea-primary hover:bg-tea-emerald text-white text-xs sm:text-sm font-bold shadow-tea-md transition-all flex items-center justify-center gap-2 hover:-translate-y-0.5"
                    >
                      <MessageCircle className="w-4 h-4 text-tea-mint" />
                      <span>{isChinese ? '聯繫諮詢 / 索取大宗報價' : 'Liên Hệ Tư Vấn & Báo Giá Sỉ'}</span>
                    </Link>

                    <button
                      onClick={() => openSampleModal(product)}
                      className="w-full sm:w-auto py-4 px-6 rounded-2xl bg-tea-mist dark:bg-[#0B130E] hover:bg-tea-soft dark:hover:bg-[#1B2E23] text-tea-primary dark:text-tea-mint border border-tea-border dark:border-white/10 text-xs sm:text-sm font-bold transition-all text-center flex items-center justify-center gap-2"
                    >
                      <Sparkles className="w-4 h-4 text-tea-mint" />
                      <span>{isChinese ? '免費索取 100g 茶樣' : 'Đăng Ký Mẫu Thử 100g'}</span>
                    </button>
                  </>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 font-medium pt-1">
                <button
                  onClick={() => handleDownloadDoc('TDS Spec Sheet')}
                  className="inline-flex items-center gap-1.5 text-tea-emerald dark:text-tea-mint hover:underline font-semibold"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>
                    {isChinese
                      ? `下載規格技術文件 TDS (${sku}.pdf)`
                      : `Tải tài liệu kỹ thuật TDS (${sku}.pdf)`}
                  </span>
                </button>

                <span>
                  {isChinese ? '保存方式：' : 'Bảo quản: '}
                  {storageText.split(',')[0]}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Brewing Guide & Packaging Specs Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
          
          {/* Barista Brewing Guide */}
          <div className="lg:col-span-7 bg-white dark:bg-[#132018] rounded-3xl p-6 sm:p-8 border border-tea-border dark:border-white/10 shadow-tea-sm space-y-6 transition-colors">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-tea-soft dark:bg-[#1C2F23] flex items-center justify-center text-tea-emerald dark:text-tea-mint">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-tea-dark dark:text-white">
                  {isChinese ? '調茶師標準萃取 SOP 指南' : 'Hướng Dẫn Ủ Cốt Trà Chuẩn SOP Barista'}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {isChinese ? 'CASA 資深研發品茶師推薦最佳萃取參數' : 'Quy trình chiết xuất khuyến nghị từ chuyên gia CASA'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
              <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#0B130E] border border-tea-border dark:border-white/10">
                <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1 font-semibold">
                  {isChinese ? '茶水比例 (茶 : 水)' : 'TỶ LỆ NƯỚC : TRÀ'}
                </span>
                <span className="text-base font-bold text-tea-dark dark:text-white block">{brewingGuide.ratio}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#0B130E] border border-tea-border dark:border-white/10">
                <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1 font-semibold">
                  {isChinese ? '最佳浸泡水溫' : 'NHIỆT ĐỘ NƯỚC Ủ'}
                </span>
                <span className="text-base font-bold text-tea-dark dark:text-white block">{brewingGuide.temp}</span>
              </div>

              <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#0B130E] border border-tea-border dark:border-white/10">
                <span className="text-xs text-gray-600 dark:text-gray-400 block mb-1 font-semibold">
                  {isChinese ? '悶泡萃取時間' : 'THỜI GIAN HÃM'}
                </span>
                <span className="text-base font-bold text-tea-dark dark:text-white block">{brewingGuide.time}</span>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-tea-mist dark:bg-[#0B130E] border border-tea-leaf/20 dark:border-white/10 text-xs text-gray-800 dark:text-gray-200 space-y-1">
              <strong className="text-tea-primary dark:text-tea-mint flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-tea-leaf" />
                {isChinese ? 'Master Barista 調茶秘笈：' : 'Bí quyết từ Master Barista:'}
              </strong>
              <p className="leading-relaxed font-normal">{brewingGuide.tips}</p>
            </div>
          </div>

          {/* Packaging & Lab Specs */}
          <div className="lg:col-span-5 bg-white dark:bg-[#132018] rounded-3xl p-6 sm:p-8 border border-tea-border dark:border-white/10 shadow-tea-sm space-y-5 transition-colors">
            <div className="flex items-center gap-3 border-b border-gray-100 dark:border-white/10 pb-4">
              <div className="w-10 h-10 rounded-xl bg-tea-soft dark:bg-[#1C2F23] flex items-center justify-center text-tea-emerald dark:text-tea-mint">
                <Box className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-tea-dark dark:text-white">
                  {isChinese ? '商用包裝規格與檢驗標準' : 'Quy Cách Đóng Gói & Tiêu Chuẩn'}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-400 font-medium">
                  {isChinese ? '工業級 B2B 標準化出貨規格' : 'Quy cách B2B tiêu chuẩn công nghiệp'}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200 block">
                {isChinese ? '出貨包裝規格：' : 'Quy cách xuất hàng:'}
              </span>
              <ul className="space-y-1.5 text-xs text-gray-800 dark:text-gray-200">
                {packaging.map((pack, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-tea-leaf shrink-0" />
                    <span>{pack}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-2 border-t border-gray-100 dark:border-white/10 space-y-2">
              <span className="text-xs font-bold text-gray-700 dark:text-gray-200 block">
                {isChinese ? '實驗室檢測技術指標：' : 'Chỉ tiêu kỹ thuật kiểm định:'}
              </span>
              <div className="space-y-1.5 text-xs">
                {specifications.map((spec, i) => (
                  <div key={i} className="flex justify-between text-gray-700 dark:text-gray-300 border-b border-gray-50 dark:border-white/5 pb-1">
                    <span>{spec.label}:</span>
                    <strong className="text-tea-dark dark:text-white">{spec.value}</strong>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h3 className="text-2xl font-bold text-tea-dark dark:text-white mb-8">
              {isChinese ? '同系列相關推薦茶品' : 'Sản phẩm cùng danh mục bạn có thể quan tâm'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onRequestSample={(prod) => openSampleModal(prod)}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
