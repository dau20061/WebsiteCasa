import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Filter, Sparkles, SlidersHorizontal, Package, X } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import WaveDivider from '../components/WaveDivider';
import ProductCard from '../components/ProductCard';
import SEO from '../components/SEO';
import { PRODUCT_CATEGORIES } from '../constants/categories';
import { getRtdbProducts, getRtdbCategories } from '../services/rtdbService';
import { useAppUI } from '../layouts/MainLayout';
import { useLanguage } from '../context/LanguageContext';

export default function Products() {
  const { t, isChinese } = useLanguage();
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

  // Filter & Search logic
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      selectedCategory === 'all' || product.category === selectedCategory;

    const matchesSearch =
      searchQuery === '' ||
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.shortDesc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.tags?.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

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
      return a.name.localeCompare(b.name);
    }
    // 'popular'
    return (b.bestseller ? 1 : 0) - (a.bestseller ? 1 : 0);
  });

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
          url: 'https://websiteacasa.vercel.app/products',
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: filteredProducts.length,
            itemListElement: filteredProducts.slice(0, 30).map((p, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: p.name,
              url: `https://websiteacasa.vercel.app/products/${p.id}`
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

      {/* Animated Wavy Transition: Hero -> Catalog Controls */}
      <WaveDivider
        fromBg="bg-[#FAF9F5] dark:bg-[#0B130E]"
        toColor="text-white/95 dark:text-[#0B130E]/95"
        accentColor="text-tea-mint/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-leaf/20 dark:text-tea-leaf/10"
        flipX={false}
      />

      {/* 2. CATALOG CONTROLS (SEARCH & CATEGORIES & SORT) */}
      <section className="py-6 bg-white/95 dark:bg-[#0B130E]/95 backdrop-blur-md sticky top-16 z-30 shadow-tea-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            {/* Realtime Search Bar */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('prod_search_placeholder', 'Tìm theo tên, mã SKU, đặc tính...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-9 py-2.5 rounded-xl border border-tea-border dark:border-white/15 text-xs focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 focus:border-tea-emerald bg-white dark:bg-[#132018] dark:text-white dark:placeholder-gray-400 transition-colors"
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

            {/* Sort Dropdown */}
            <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium flex items-center gap-1">
                <SlidersHorizontal className="w-3.5 h-3.5 text-tea-leaf" /> {t('prod_sort_label', 'Sắp xếp:')}
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-2 rounded-xl border border-tea-border dark:border-white/15 text-xs font-semibold text-tea-dark dark:text-white bg-white dark:bg-[#132018] focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 transition-colors cursor-pointer"
              >
                <option value="popular" className="bg-white dark:bg-[#132018] text-gray-900 dark:text-gray-100">{t('sort_popular', 'Bán chạy nhất (Best Seller)')}</option>
                <option value="body-desc" className="bg-white dark:bg-[#132018] text-gray-900 dark:text-gray-100">{t('sort_body', 'Độ đầm vị trà sữa (Body cao)')}</option>
                <option value="aroma-desc" className="bg-white dark:bg-[#132018] text-gray-900 dark:text-gray-100">{t('sort_aroma', 'Hương thơm tự nhiên (Aroma cao)')}</option>
                <option value="name-asc" className="bg-white dark:bg-[#132018] text-gray-900 dark:text-gray-100">{t('sort_name', 'Tên sản phẩm (A-Z)')}</option>
              </select>
            </div>
          </div>

          {/* Category Tabs */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {/* Tab Tất cả sản phẩm */}
            <button
              onClick={() => handleCategoryChange('all')}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === 'all'
                  ? 'bg-tea-primary text-white shadow-tea-sm'
                  : 'bg-white dark:bg-[#132018] text-gray-700 dark:text-gray-300 hover:bg-tea-soft dark:hover:bg-[#1C2F23] border border-tea-border dark:border-white/10'
              }`}
            >
              {isChinese ? '全部產品' : t('cat_all', 'Tất cả sản phẩm')}
            </button>

            {/* Các tab danh mục động (CRUD) */}
            {categories
              .filter((c) => c.active !== false && c.id !== 'all')
              .sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99))
              .map((cat) => {
                const catLabelKey = `cat_${cat.id.replace(/-/g, '_')}`;
                const displayCatName = isChinese
                  ? (cat.nameZh || t(catLabelKey, cat.name))
                  : (cat.name || t(catLabelKey, cat.name));
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryChange(cat.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat.id
                        ? 'bg-tea-primary text-white shadow-tea-sm'
                        : 'bg-white dark:bg-[#132018] text-gray-700 dark:text-gray-300 hover:bg-tea-soft dark:hover:bg-[#1C2F23] border border-tea-border dark:border-white/10'
                    }`}
                  >
                    {displayCatName}
                  </button>
                );
              })}
          </div>
        </div>
      </section>

      {/* 3. PRODUCTS GRID */}
      <section className="py-12 bg-[#FAF9F5] dark:bg-[#0B130E] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results counter */}
          <div className="flex items-center justify-between mb-8 text-xs text-gray-600 dark:text-gray-400 font-medium">
            <span>
              {isChinese ? '顯示 ' : 'Hiển thị '}
              <strong>{sortedProducts.length}</strong>
              {isChinese ? ' 項相符產品' : ' sản phẩm phù hợp'}
            </span>
            {searchQuery && (
              <span>
                {isChinese ? '搜尋關鍵字：' : 'Từ khóa tìm kiếm: '}
                "{searchQuery}"
              </span>
            )}
          </div>

          {sortedProducts.length === 0 ? (
            <div className="py-20 text-center bg-white dark:bg-[#132018] rounded-3xl border border-tea-border dark:border-white/10 p-8">
              <Package className="w-12 h-12 text-gray-300 dark:text-gray-500 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                {isChinese ? '查無符合條件的產品' : 'Không tìm thấy sản phẩm phù hợp'}
              </h3>
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-sm mx-auto font-medium">
                {isChinese
                  ? '請嘗試使用其他關鍵字搜尋，或清除篩選條件以查看完整產品系列。'
                  : 'Vui lòng thử tìm với từ khóa khác hoặc xóa bộ lọc để xem toàn bộ danh mục sản phẩm.'}
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('all');
                  searchParams.delete('cat');
                  setSearchParams(searchParams);
                }}
                className="mt-4 px-5 py-2.5 rounded-xl bg-tea-primary text-white text-xs font-bold"
              >
                {isChinese ? '查看全部產品' : 'Xem tất cả sản phẩm'}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onRequestSample={(p) => openSampleModal(p)}
                />
              ))}
            </div>
          )}

          {/* Bottom B2B Sample Callout */}
          <div className="mt-16 p-8 rounded-3xl bg-gradient-to-r from-tea-primary to-tea-emerald text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-1 text-center sm:text-left">
              <h3 className="text-xl font-bold">
                {isChinese ? '尚未找到符合貴品牌專屬風味的茶品？' : 'Chưa tìm thấy gu trà riêng cho chuỗi của bạn?'}
              </h3>
              <p className="text-xs text-white/80">
                {isChinese
                  ? 'CASA R&D 實驗室提供客製化獨家調配 (Blend) 服務，精準客製您的目標風味與濃郁度。'
                  : 'Phòng Lab R&D của CASA nhận blend phối trộn công thức trà độc quyền theo từng khẩu vị mong muốn.'}
              </p>
            </div>
            <button
              onClick={() => openSampleModal()}
              className="px-6 py-3 rounded-xl bg-white text-tea-primary hover:bg-tea-soft text-xs font-bold transition-all shadow-md shrink-0"
            >
              {isChinese ? '申請獨家客製打樣' : 'Yêu Cầu Blend Mẫu Độc Quyền'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

