import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Search,
  Sparkles,
  SlidersHorizontal,
  Package,
  X,
  Layers,
  ChevronRight,
  RotateCcw
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import WaveDivider from '../components/WaveDivider';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { PRODUCT_CATEGORIES } from '../constants/categories';
import { SITE_URL } from '../constants/site';
import { getProductSlug } from '../utils/slugify';
import { getRtdbProducts, getRtdbCategories } from '../services/rtdbService';
import { useAppUI } from '../layouts/MainLayout';
import { useLanguage } from '../context/LanguageContext';

export default function Products() {
  const { t, isChinese, isEnglish } = useLanguage();
  const { openSampleModal } = useAppUI();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('cat') || 'all';

  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('casa_admin_products');
    return saved ? JSON.parse(saved) : [];
  });

  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('casa_admin_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
    return PRODUCT_CATEGORIES.filter((c) => c.id !== 'all').map((c, i) => ({
      ...c,
      order: i + 1,
      active: true
    }));
  });

  useEffect(() => {
    getRtdbProducts().then((res) => {
      if (Array.isArray(res)) {
        setProducts(res);
      }
    });
    getRtdbCategories().then((res) => {
      if (res && res.length > 0) {
        setCategories(res);
      }
    });
  }, []);

  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('popular');

  // Sync with URL query parameter
  useEffect(() => {
    const cat = searchParams.get('cat');
    if (cat) {
      setSelectedCategory(cat);
    }
  }, [searchParams]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('cat');
      setSearchParams(searchParams);
    } else {
      setSearchParams({ cat: catId });
    }
  };

  // Chuẩn hóa category so sánh không phân biệt hoa thường, dấu gạch nối hay gạch dưới
  const normCat = (str) => String(str || '').toLowerCase().replace(/[-_\s]+/g, '').trim();

  // Helper tính số lượng sản phẩm cho từng danh mục
  const getCategoryCount = (catId) => {
    if (catId === 'all') return products.length;
    const cId = normCat(catId);
    return products.filter((p) => {
      const pCat = normCat(p.category || '');
      const pCatName = normCat(p.categoryName || '');
      return pCat === cId || p.category === catId || pCatName === cId || p.categoryName === catId;
    }).length;
  };


  // Filter & Search logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' ||
      normCat(product.category) === normCat(selectedCategory) ||
      normCat(product.categoryName) === normCat(selectedCategory) ||
      String(product.category || '').toLowerCase().trim() === String(selectedCategory || '').toLowerCase().trim() ||
      String(product.categoryName || '').toLowerCase().trim() === String(selectedCategory || '').toLowerCase().trim();

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
      (product.name && product.name.toLowerCase().includes(q)) ||
      (product.nameEn && product.nameEn.toLowerCase().includes(q)) ||
      (product.nameZh && product.nameZh.toLowerCase().includes(q)) ||
      (product.sku && product.sku.toLowerCase().includes(q)) ||
      (product.shortDesc && product.shortDesc.toLowerCase().includes(q)) ||
      (product.shortDescEn && !product.shortDescEn.includes('QUERY LENGTH LIMIT') && product.shortDescEn.toLowerCase().includes(q)) ||
      (product.shortDescZh && product.shortDescZh.toLowerCase().includes(q)) ||
      product.tags?.some((t) => t.toLowerCase().includes(q));

    return matchesCategory && matchesSearch;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'body-desc') {
      return (b.tasteProfile?.body || 0) - (a.tasteProfile?.body || 0);
    }
    if (sortBy === 'aroma-desc') {
      return (b.tasteProfile?.aroma || 0) - (a.tasteProfile?.aroma || 0);
    }
    if (sortBy === 'name-asc') {
      const nameA = isEnglish ? (a.nameEn || a.name) : (isChinese ? (a.nameZh || a.name) : a.name);
      const nameB = isEnglish ? (b.nameEn || b.name) : (isChinese ? (b.nameZh || b.name) : b.name);
      return nameA.localeCompare(nameB);
    }
    // 'popular'
    return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
  });

  // Danh sách các danh mục đang hoạt động
  const activeCategoriesList = categories
    .filter((c) => c.active !== false && c.id !== 'all')
    .sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));

  // Tên danh mục đang chọn để hiển thị tiêu đề khu vực sản phẩm
  const activeCategoryObj = categories.find(
    (c) => c.id === selectedCategory || normCat(c.id) === normCat(selectedCategory)
  );
  const activeCategoryTitle =
    selectedCategory === 'all'
      ? (isEnglish ? 'All Products' : (isChinese ? '全部產品' : 'Tất cả sản phẩm'))
      : (activeCategoryObj
          ? (isEnglish
              ? (activeCategoryObj.nameEn || activeCategoryObj.name)
              : (isChinese ? (activeCategoryObj.nameZh || activeCategoryObj.name) : activeCategoryObj.name))
          : selectedCategory);

  return (
    <div className="overflow-hidden pb-20">
      {/* TECHNICAL SEO: COLLECTIONPAGE & ITEMLIST SCHEMA */}
      <SEO
        title={t('prod_catalog_title', 'Danh Mục Trà Nguyên Liệu, Syrup & Bột Pha Chế Sỉ B2B')}
        description={t('prod_catalog_desc', 'Catalog sỉ trà nguyên liệu, trà đen Assam, trà ô long rang mộc, trà lài, syrup bí đao và bột béo thực vật cho chuỗi trà sữa và F&B toàn quốc.')}
        keywords={['trà nguyên liệu giá sỉ', 'nguyên liệu pha chế trà sữa', 'syrup bí đao', 'trà đen assam', 'trà ô long', 'bột béo B2B', 'CASA TEA']}
        canonical="/products"
        ogType="website"
        jsonLd={{
          '@type': 'CollectionPage',
          name: 'Danh Mục Trà Nguyên Liệu & Giải Pháp Pha Chế CASA TEA',
          description: 'Cung cấp sỉ trà nguyên liệu, trà búp cao cấp, syrup và bột pha chế cho các chuỗi trà sữa và quán cà phê.',
          url: `${SITE_URL}/products`,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: filteredProducts.length,
            itemListElement: filteredProducts.slice(0, 30).map((p, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: p.name,
              url: `${SITE_URL}/products/${getProductSlug(p)}`
            }))
          }
        }}
      />

      {/* 1. HERO HEADER */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-14 bg-gradient-to-b from-[#DFF5E1]/50 via-[#BFE8D0]/20 to-[#FAF9F5] dark:from-[#132B1C]/70 dark:via-[#0F1E14]/40 dark:to-[#0B130E] overflow-hidden transition-colors">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-5 right-10 w-[450px] h-[450px] bg-tea-mint/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-5 left-10 w-[350px] h-[350px] bg-tea-leaf/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#132018] text-tea-primary dark:text-tea-mint border border-tea-leaf/30 dark:border-tea-mint/30 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Package className="w-3.5 h-3.5 text-tea-leaf" /> {t('prod_catalog_badge', 'B2B Product Catalog')}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-tea-dark dark:text-white tracking-tight">
            {t('prod_catalog_title', 'Danh Mục Trà Nguyên Liệu & Bột Pha Chế')}
          </h1>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-normal">
            {t('prod_catalog_desc', 'Hương vị chuẩn hóa, độ ổn định tuyệt đối và tỷ lệ chiết xuất TDS cao tối ưu chi phí giá vốn ly cho chuỗi đồ uống.')}
          </p>
        </div>
      </section>

      {/* Animated Wavy Transition: Hero -> Catalog Body */}
      <WaveDivider
        fromBg="bg-[#FAF9F5] dark:bg-[#0B130E]"
        toColor="text-white/95 dark:text-[#0B130E]/95"
        accentColor="text-tea-mint/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-leaf/20 dark:text-tea-leaf/10"
        flipX={false}
      />

      {/* 2. MAIN CATALOG LAYOUT (SIDEBAR MENU ON LEFT + PRODUCTS ON RIGHT) */}
      <section className="py-10 bg-[#FAF9F5] dark:bg-[#0B130E] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            
            {/* ======================================================== */}
            {/* LEFT SIDEBAR: MENU DANH MỤC NGUYÊN LIỆU (DESKTOP STICKY) */}
            {/* ======================================================== */}
            <aside className="w-full lg:w-72 xl:w-80 shrink-0 lg:sticky lg:top-24 space-y-6">
              
              {/* Main Category Menu Card */}
              <div className="bg-white dark:bg-[#132018] rounded-3xl p-5 sm:p-6 border border-tea-leaf/60 dark:border-white/10 shadow-md">
                
                {/* Header */}
                <div className="flex items-center justify-between pb-4 mb-4 border-b border-gray-100 dark:border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-2xl bg-tea-soft dark:bg-tea-green/20 flex items-center justify-center text-tea-primary dark:text-tea-mint shadow-2xs">
                      <Layers className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="text-xs font-black uppercase tracking-wider text-tea-dark dark:text-white">
                        {isEnglish ? 'Categories' : (isChinese ? '原料產品分類' : 'Danh Mục Nguyên Liệu')}
                      </h3>
                      <p className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        {activeCategoriesList.length + 1} {isEnglish ? 'groups' : (isChinese ? '分類項目' : 'nhóm nguyên liệu')}
                      </p>
                    </div>
                  </div>

                  {selectedCategory !== 'all' && (
                    <button
                      onClick={() => handleCategoryChange('all')}
                      title={isEnglish ? 'Clear filter' : 'Xóa bộ lọc'}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-tea-leaf hover:text-tea-primary dark:text-tea-mint transition-colors px-2 py-1 rounded-lg hover:bg-tea-soft/50 dark:hover:bg-white/5"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>{isEnglish ? 'Reset' : (isChinese ? '重設' : 'Đặt lại')}</span>
                    </button>
                  )}
                </div>

                {/* Vertical Category Menu Items List */}
                <nav className="space-y-1.5" aria-label="Menu danh mục sản phẩm">
                  {/* Mục 1: Tất cả sản phẩm */}
                  {(() => {
                    const isAllActive = selectedCategory === 'all';
                    const allCount = getCategoryCount('all');
                    return (
                      <button
                        onClick={() => handleCategoryChange('all')}
                        className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all group ${
                          isAllActive
                            ? 'bg-tea-primary text-white shadow-tea-sm dark:bg-tea-emerald'
                            : 'bg-transparent hover:bg-tea-soft/60 dark:hover:bg-[#1C2F23] text-gray-700 dark:text-gray-300 hover:text-tea-primary dark:hover:text-tea-mint'
                        }`}
                      >
                        <span className="truncate text-left">
                          {isEnglish ? 'All Products' : (isChinese ? '全部產品' : t('cat_all', 'Tất cả sản phẩm'))}
                        </span>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                              isAllActive
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:bg-tea-soft group-hover:text-tea-primary dark:group-hover:text-tea-mint'
                            }`}
                          >
                            {allCount}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isAllActive
                                ? 'text-tea-mint translate-x-0.5'
                                : 'text-gray-400 group-hover:text-tea-primary dark:group-hover:text-tea-mint group-hover:translate-x-0.5 opacity-60'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })()}

                  {/* Mục 2..N: Danh sách danh mục động */}
                  {activeCategoriesList.map((cat) => {
                    const isCatActive =
                      selectedCategory === cat.id || normCat(selectedCategory) === normCat(cat.id);
                    const catCount = getCategoryCount(cat.id);
                    const catLabelKey = `cat_${cat.id.replace(/-/g, '_')}`;
                    const displayCatName = isEnglish
                      ? (cat.nameEn || t(catLabelKey, cat.name))
                      : (isChinese ? (cat.nameZh || t(catLabelKey, cat.name)) : (cat.name || t(catLabelKey, cat.name)));

                    return (
                      <button
                        key={cat.id}
                        onClick={() => handleCategoryChange(cat.id)}
                        className={`w-full px-4 py-3 rounded-2xl flex items-center justify-between text-xs font-bold transition-all group ${
                          isCatActive
                            ? 'bg-tea-primary text-white shadow-tea-sm dark:bg-tea-emerald'
                            : 'bg-transparent hover:bg-tea-soft/60 dark:hover:bg-[#1C2F23] text-gray-700 dark:text-gray-300 hover:text-tea-primary dark:hover:text-tea-mint'
                        }`}
                      >
                        <span className="truncate text-left">{displayCatName}</span>

                        <div className="flex items-center gap-2 shrink-0">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold transition-colors ${
                              isCatActive
                                ? 'bg-white/20 text-white'
                                : 'bg-gray-100 dark:bg-white/5 text-gray-500 dark:text-gray-400 group-hover:bg-tea-soft group-hover:text-tea-primary dark:group-hover:text-tea-mint'
                            }`}
                          >
                            {catCount}
                          </span>
                          <ChevronRight
                            className={`w-3.5 h-3.5 transition-transform ${
                              isCatActive
                                ? 'text-tea-mint translate-x-0.5'
                                : 'text-gray-400 group-hover:text-tea-primary dark:group-hover:text-tea-mint group-hover:translate-x-0.5 opacity-60'
                            }`}
                          />
                        </div>
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* B2B Sample Kit Callout Box (Left Sidebar Bottom Widget) */}
              <div className="p-5 rounded-3xl bg-gradient-to-br from-tea-soft/80 via-white to-tea-mist dark:from-[#132018] dark:to-[#1C2F23] border border-tea-leaf/40 dark:border-white/10 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-tea-primary dark:text-tea-mint">
                  <Sparkles className="w-4 h-4 text-tea-leaf animate-pulse" />
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {isEnglish ? 'Free B2B Sample Kit' : (isChinese ? '免費索樣服務' : 'Đăng Ký Mẫu Thử')}
                  </span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed font-normal">
                  {isEnglish
                    ? 'Request free test ingredients to calibrate signature tea recipes for your F&B beverage chain.'
                    : (isChinese
                      ? '專為連鎖飲品與餐飲企業提供原茶樣品與專屬調飲建議。'
                      : 'Cung cấp mẫu thử trà & bột pha chế miễn phí để test công thức chuẩn gu cho chuỗi đồ uống.')}
                </p>
                <button
                  onClick={() => openSampleModal()}
                  className="w-full py-2.5 px-3 rounded-2xl bg-tea-primary hover:bg-tea-emerald text-white text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5 hover:-translate-y-0.5"
                >
                  <Package className="w-3.5 h-3.5 text-tea-mint" />
                  <span>{isEnglish ? 'Request Sample Kit' : (isChinese ? '即刻申請茶樣' : 'Nhận mẫu thử ngay')}</span>
                </button>
              </div>
            </aside>

            {/* ======================================================== */}
            {/* RIGHT MAIN COLUMN: TOOLBAR + PRODUCTS SHOWCASE           */}
            {/* ======================================================== */}
            <main className="flex-1 min-w-0 w-full space-y-6">
              
              {/* Top Controls Toolbar: Search & Sort */}
              <div className="bg-white dark:bg-[#132018] rounded-3xl p-4 sm:p-5 border border-tea-leaf/60 dark:border-white/10 shadow-sm flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
                
                {/* Search Input */}
                <div className="relative flex-1 max-w-md">
                  <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder={t('prod_search_placeholder', 'Tìm theo tên, mã SKU, đặc tính...')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-9 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 focus:border-tea-emerald bg-[#FAF9F5] dark:bg-[#0E1711] dark:text-white dark:placeholder-gray-400 transition-colors"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* Sort Selector */}
                <div className="flex items-center gap-2.5 shrink-0 justify-between md:justify-end">
                  <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                    <SlidersHorizontal className="w-3.5 h-3.5 text-tea-leaf" /> {t('prod_sort_label', 'Sắp xếp:')}
                  </span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-3.5 py-2.5 rounded-2xl border border-gray-200 dark:border-white/10 text-xs font-semibold text-tea-dark dark:text-white bg-[#FAF9F5] dark:bg-[#0E1711] focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 transition-colors cursor-pointer"
                  >
                    <option value="popular" className="bg-white dark:bg-[#132018] text-gray-900 dark:text-gray-100">
                      {t('sort_popular', 'Bán chạy nhất (Best Seller)')}
                    </option>
                    <option value="body-desc" className="bg-white dark:bg-[#132018] text-gray-900 dark:text-gray-100">
                      {t('sort_body', 'Độ đầm vị trà sữa (Body cao)')}
                    </option>
                    <option value="aroma-desc" className="bg-white dark:bg-[#132018] text-gray-900 dark:text-gray-100">
                      {t('sort_aroma', 'Hương thơm tự nhiên (Aroma cao)')}
                    </option>
                    <option value="name-asc" className="bg-white dark:bg-[#132018] text-gray-900 dark:text-gray-100">
                      {t('sort_name', 'Tên sản phẩm (A-Z)')}
                    </option>
                  </select>
                </div>
              </div>

              {/* Mobile Category Quick Bar (lg:hidden for fast swipe on small screens) */}
              <div className="lg:hidden flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  onClick={() => handleCategoryChange('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === 'all'
                      ? 'bg-tea-primary text-white shadow-tea-sm'
                      : 'bg-white dark:bg-[#132018] text-gray-700 dark:text-gray-300 border border-tea-leaf/40 dark:border-white/10'
                  }`}
                >
                  {isEnglish ? 'All' : (isChinese ? '全部' : 'Tất cả')} ({getCategoryCount('all')})
                </button>
                {activeCategoriesList.map((cat) => {
                  const isCatActive =
                    selectedCategory === cat.id || normCat(selectedCategory) === normCat(cat.id);
                  const catLabelKey = `cat_${cat.id.replace(/-/g, '_')}`;
                  const displayCatName = isEnglish
                    ? (cat.nameEn || t(catLabelKey, cat.name))
                    : (isChinese ? (cat.nameZh || t(catLabelKey, cat.name)) : (cat.name || t(catLabelKey, cat.name)));
                  return (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryChange(cat.id)}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                        isCatActive
                          ? 'bg-tea-primary text-white shadow-tea-sm'
                          : 'bg-white dark:bg-[#132018] text-gray-700 dark:text-gray-300 border border-tea-leaf/40 dark:border-white/10'
                      }`}
                    >
                      {displayCatName} ({getCategoryCount(cat.id)})
                    </button>
                  );
                })}
              </div>

              {/* Status Header: Showing results summary */}
              <div className="flex flex-wrap items-center justify-between gap-3 px-1 text-xs text-gray-600 dark:text-gray-400 font-medium">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-tea-leaf animate-pulse" />
                  <span>
                    {isEnglish ? 'Category: ' : (isChinese ? '分類：' : 'Danh mục: ')}
                    <strong className="text-tea-dark dark:text-white font-bold">{activeCategoryTitle}</strong>
                    {' • '}
                    <span>
                      {isEnglish ? 'Showing ' : (isChinese ? '顯示 ' : 'Hiển thị ')}
                      <strong className="text-tea-primary dark:text-tea-mint">{sortedProducts.length}</strong>
                      {isEnglish ? ' products' : (isChinese ? ' 項產品' : ' sản phẩm')}
                    </span>
                  </span>
                </div>

                {(selectedCategory !== 'all' || searchQuery) && (
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      handleCategoryChange('all');
                    }}
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-tea-leaf hover:text-red-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>{isEnglish ? 'Clear all filters' : (isChinese ? '清除篩選' : 'Bỏ lọc')}</span>
                  </button>
                )}
              </div>

              {/* Products Grid or Empty State */}
              {sortedProducts.length === 0 ? (
                <div className="py-20 text-center bg-white dark:bg-[#132018] rounded-3xl border border-tea-leaf/50 dark:border-white/10 p-8 shadow-sm">
                  <Package className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
                  <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                    {isEnglish ? 'No matching products found' : (isChinese ? '查無符合條件的產品' : 'Không tìm thấy sản phẩm phù hợp')}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-sm mx-auto font-medium">
                    {isEnglish
                      ? 'Please try searching with different keywords or clear filters to view all products.'
                      : (isChinese
                        ? '請嘗試使用其他關鍵字搜尋，或清除篩選條件以查看完整產品系列。'
                        : 'Vui lòng thử tìm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh mục sản phẩm.')}
                  </p>
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      handleCategoryChange('all');
                    }}
                    className="mt-5 px-5 py-2.5 rounded-2xl bg-tea-primary text-white text-xs font-bold hover:bg-tea-emerald transition-all shadow-sm"
                  >
                    {isEnglish ? 'View all products' : (isChinese ? '查看全部產品' : 'Xem tất cả sản phẩm')}
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 sm:gap-7">
                  {sortedProducts.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onRequestSample={(p) => openSampleModal(p)}
                    />
                  ))}
                </div>
              )}

              {/* Bottom B2B Custom Recipe Callout Banner */}
              <div className="mt-12 p-7 sm:p-8 rounded-3xl bg-gradient-to-r from-tea-primary via-tea-emerald to-tea-green text-white flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md">
                <div className="space-y-1.5 text-center sm:text-left">
                  <span className="inline-block px-3 py-1 rounded-full bg-white/15 text-tea-mint text-[11px] font-bold uppercase tracking-wider">
                    {isEnglish ? 'B2B Tailored Solutions' : (isChinese ? '客製配方調配' : 'Giải Pháp R&D Độc Quyền')}
                  </span>
                  <h3 className="text-lg sm:text-xl font-bold">
                    {isEnglish ? "Looking for a custom signature tea blend for your chain?" : (isChinese ? '尚未找到符合貴品牌專屬風味的茶品？' : 'Chưa tìm thấy gu trà riêng cho chuỗi của bạn?')}
                  </h3>
                  <p className="text-xs text-white/85 max-w-xl font-normal leading-relaxed">
                    {isEnglish
                      ? 'CASA R&D Laboratory provides bespoke tea blending services precisely formulated to your targeted aroma, body, and cost profile.'
                      : (isChinese
                        ? 'CASA R&D 實驗室提供客製化獨家調配 (Blend) 服務，精準客製您的目標風味與濃郁度。'
                        : 'Phòng Lab R&D của CASA nhận blend phối trộn công thức trà độc quyền theo từng khẩu vị mong muốn.')}
                  </p>
                </div>
                <button
                  onClick={() => openSampleModal()}
                  className="px-6 py-3.5 rounded-2xl bg-white text-tea-primary hover:bg-tea-soft text-xs font-bold transition-all shadow-md shrink-0 hover:scale-105"
                >
                  {isEnglish ? 'Request Custom Blend' : (isChinese ? '申請客製打樣' : 'Yêu Cầu Blend Mẫu')}
                </button>
              </div>

            </main>
          </div>
        </div>
      </section>
    </div>
  );
}
