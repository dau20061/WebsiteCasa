import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, ArrowRight, BookOpen, Sparkles, Tag, X, Filter, RotateCcw } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import NewsCard from '../components/NewsCard';
import WaveDivider from '../components/WaveDivider';
import SEO from '../components/SEO';
import { NEWS_CATEGORIES, getNewsCategoryLabel } from '../constants/categories';
import { SITE_URL } from '../constants/site';
import { getRtdbNews } from '../services/rtdbService';
import { useLanguage } from '../context/LanguageContext';
import { getArticleImageUrl, slugify } from '../utils/slugify';

export default function News() {
  const { t, isChinese, isEnglish } = useLanguage();
  const { tagSlug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const activeTag = (tagSlug || searchParams.get('tag') || '').trim();
  const activeTagSlug = slugify(activeTag);

  const categoryParam = (searchParams.get('category') || 'all').trim();
  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest' | 'featured' | 'oldest'

  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('casa_admin_news');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    getRtdbNews().then((res) => {
      if (res && res.length > 0) setArticles(res);
    });
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  // Đếm số lượng bài viết theo từng danh mục (chuẩn hóa alias)
  const categoryCounts = useMemo(() => {
    const counts = { all: articles.length };
    NEWS_CATEGORIES.forEach((cat) => {
      if (cat.id === 'all') return;
      const count = articles.filter((a) => {
        return (
          a.category === cat.id ||
          a.categorySlug === cat.id ||
          (cat.aliases && (cat.aliases.includes(a.category) || cat.aliases.includes(a.categorySlug)))
        );
      }).length;
      counts[cat.id] = count;
    });
    return counts;
  }, [articles]);

  // Trích xuất danh sách tất cả các Thẻ Tag từ bài viết thực tế
  const availableTags = useMemo(() => {
    const tagMap = new Map();
    articles.forEach((art) => {
      if (Array.isArray(art.tags)) {
        art.tags.forEach((t) => {
          const clean = String(t).replace(/^#+/, '').trim();
          if (clean) {
            const slug = slugify(clean);
            if (!tagMap.has(slug)) {
              tagMap.set(slug, { name: clean, slug, count: 1 });
            } else {
              tagMap.get(slug).count += 1;
            }
          }
        });
      }
    });
    return Array.from(tagMap.values()).sort((a, b) => b.count - a.count);
  }, [articles]);

  // Tên hiển thị có dấu của thẻ tag đang được lọc
  const activeTagDisplayName = useMemo(() => {
    if (!activeTag) return '';
    for (const art of articles) {
      if (Array.isArray(art.tags)) {
        for (const t of art.tags) {
          const cleanT = String(t).replace(/^#+/, '').trim();
          if (slugify(cleanT) === activeTagSlug) {
            return cleanT;
          }
        }
      }
    }
    try {
      const saved = localStorage.getItem('casa_admin_saved_tags');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const found = parsed.find((t) => slugify(t) === activeTagSlug);
          if (found) return String(found).replace(/^#+/, '').trim();
        }
      }
    } catch (_) {}
    return activeTag.replace(/-/g, ' ');
  }, [activeTag, activeTagSlug, articles]);

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const handleClearTagFilter = () => {
    if (tagSlug) {
      navigate(selectedCategory !== 'all' ? `/news?category=${selectedCategory}` : '/news');
    } else {
      searchParams.delete('tag');
      setSearchParams(searchParams);
    }
  };

  const handleResetAllFilters = () => {
    setSelectedCategory('all');
    setSearchQuery('');
    navigate('/news');
  };

  const isFiltering = selectedCategory !== 'all' || Boolean(activeTag) || Boolean(searchQuery.trim());

  const sortByDateDesc = (arr) =>
    [...arr].sort((a, b) => new Date(b.updatedAt || b.date || 0) - new Date(a.updatedAt || a.date || 0));

  const heroCandidates = articles.filter((a) => a.featuredNews === true);
  const generalFeatured = articles.filter((a) => a.featured === true || a.featuredHome === true);

  const featuredArticle =
    articles.find((a) => a.featuredNews === true) ||
    articles.find((a) => a.featured === true) ||
    sortByDateDesc(heroCandidates)[0] ||
    sortByDateDesc(generalFeatured)[0] ||
    articles[0];

  const filteredArticles = articles.filter((article) => {
    const matchesCat =
      selectedCategory === 'all' ||
      article.category === selectedCategory ||
      article.categorySlug === selectedCategory ||
      (selectedCategory === 'kien-thuc' && (article.category === 'kien-thuc-tra' || article.categorySlug === 'kien-thuc-tra')) ||
      (selectedCategory === 'kien-thuc-tra' && (article.category === 'kien-thuc' || article.categorySlug === 'kien-thuc')) ||
      (selectedCategory === 'tin-doanh-nghiep' && (article.category === 'tin-cong-ty' || article.categorySlug === 'tin-cong-ty')) ||
      (selectedCategory === 'tin-cong-ty' && (article.category === 'tin-doanh-nghiep' || article.categorySlug === 'tin-doanh-nghiep'));

    const matchesTag = !activeTag || (
      Array.isArray(article.tags) && article.tags.some((t) => {
        const cleanT = String(t).replace(/^#+/, '').trim();
        return slugify(cleanT) === activeTagSlug || cleanT.toLowerCase() === activeTag.toLowerCase();
      })
    );

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      q === '' ||
      (article.title && article.title.toLowerCase().includes(q)) ||
      (article.titleEn && article.titleEn.toLowerCase().includes(q)) ||
      (article.titleZh && article.titleZh.toLowerCase().includes(q)) ||
      (article.excerpt && article.excerpt.toLowerCase().includes(q)) ||
      (article.excerptEn && article.excerptEn.toLowerCase().includes(q)) ||
      (article.excerptZh && article.excerptZh.toLowerCase().includes(q)) ||
      (Array.isArray(article.tags) && article.tags.some((t) => t.toLowerCase().includes(q)));

    return matchesCat && matchesTag && matchesSearch;
  });

  const sortedArticles = [...filteredArticles].sort((a, b) => {
    if (sortBy === 'featured') {
      const aFeat = a.featuredNews ? 2 : (a.featuredHome || a.featured ? 1 : 0);
      const bFeat = b.featuredNews ? 2 : (b.featuredHome || b.featured ? 1 : 0);
      if (bFeat !== aFeat) return bFeat - aFeat;
    }
    if (sortBy === 'oldest') {
      return new Date(a.updatedAt || a.date || 0) - new Date(b.updatedAt || b.date || 0);
    }
    // 'newest' default
    const aFeat = a.featuredNews ? 2 : (a.featuredHome || a.featured ? 1 : 0);
    const bFeat = b.featuredNews ? 2 : (b.featuredHome || b.featured ? 1 : 0);
    if (bFeat !== aFeat) return bFeat - aFeat;
    return new Date(b.updatedAt || b.date || 0) - new Date(a.updatedAt || a.date || 0);
  });

  return (
    <div className="overflow-hidden pb-20">
      {/* TECHNICAL SEO: COLLECTIONPAGE & ITEMLIST SCHEMA */}
      <SEO
        title={t('news_hero_title', 'Tin Tức F&B, Xu Hướng Đồ Uống & Công Thức Pha Chế Trà Sữa')}
        description={t('news_hero_desc', 'Cập nhật xu hướng đồ uống 2026, công thức pha chế trà sữa chuẩn vị, bí quyết ủ cốt trà không chát và cẩm nang kỹ thuật R&D từ chuyên gia CASA TEA.')}
        keywords={['công thức pha chế trà sữa', 'tin tức F&B', 'bí quyết ủ trà', 'xu hướng đồ uống 2026', 'kiến thức trà sữa', 'CASA TEA']}
        canonical="/news"
        ogType="website"
        jsonLd={{
          '@type': 'CollectionPage',
          name: 'Tin Tức, Xu Hướng & Công Thức Pha Chế CASA TEA',
          description: 'Cẩm nang F&B toàn diện về nguyên liệu trà, công thức chuẩn vị và giải pháp phát triển menu chuỗi đồ uống.',
          url: `${SITE_URL}/news`,
          mainEntity: {
            '@type': 'ItemList',
            numberOfItems: filteredArticles.length,
            itemListElement: filteredArticles.slice(0, 30).map((a, index) => ({
              '@type': 'ListItem',
              position: index + 1,
              name: a.title,
              url: `${SITE_URL}/news/${a.slug || a.id}`
            }))
          }
        }}
      />

      {/* 1. HERO TITLE */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-14 bg-gradient-to-b from-[#DFF5E1]/50 via-[#BFE8D0]/20 to-[#FAF9F5] dark:from-[#132B1C]/70 dark:via-[#0F1E14]/40 dark:to-[#0B130E] overflow-hidden transition-colors">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-5 right-10 w-[450px] h-[450px] bg-tea-mint/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-5 left-10 w-[350px] h-[350px] bg-tea-leaf/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#132018] text-tea-primary dark:text-tea-mint border border-tea-leaf/30 dark:border-tea-mint/30 text-xs font-bold uppercase tracking-wider shadow-sm">
            <BookOpen className="w-3.5 h-3.5 text-tea-leaf" />
            {t('news_hero_badge', 'Tạp Chí F&B & Kiến Thức Trà')}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-tea-dark dark:text-white tracking-tight">
            {t('news_hero_title', 'Tin Tức, Xu Hướng & Công Thức Pha Chế')}
          </h1>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-normal">
            {t('news_hero_desc', 'Tổng hợp các báo cáo thị trường đồ uống, bí quyết kiểm soát chất lượng cốt trà và công thức menu mùa mới dành riêng cho chủ chuỗi.')}
          </p>
        </div>
      </section>

      {/* Animated Wavy Transition: Hero -> Featured News */}
      <WaveDivider
        fromBg="bg-[#FAF9F5] dark:bg-[#0B130E]"
        toColor="text-white dark:text-[#0B130E]"
        accentColor="text-tea-mint/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-leaf/20 dark:text-tea-leaf/10"
        flipX={false}
      />

      {/* 2. FEATURED HERO ARTICLE (Ẩn khi đang lọc bài viết để hiển thị ngay kết quả lọc) */}
      {featuredArticle && !isFiltering && (
        <section className="py-12 bg-white dark:bg-[#0B130E] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#FAF9F5] dark:bg-[#132018] rounded-4xl p-6 sm:p-10 border border-tea-border dark:border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-colors">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3 text-xs text-tea-leaf dark:text-tea-mint font-bold">
                  <span className="px-3 py-1 rounded-full bg-tea-soft dark:bg-[#0B130E] text-tea-primary dark:text-tea-mint uppercase">
                    {getNewsCategoryLabel(featuredArticle.category, isEnglish ? 'en' : (isChinese ? 'zh' : 'vi'))}
                  </span>
                  <span>•</span>
                  <span>{t('news_featured_badge', 'Bài viết nổi bật')}</span>
                </div>

                <Link to={`/news/${featuredArticle.slug || featuredArticle.id}`}>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-tea-dark dark:text-white hover:text-tea-green dark:hover:text-tea-mint transition-colors leading-tight">
                    {isEnglish ? (featuredArticle.titleEn || featuredArticle.title) : ((isChinese && (featuredArticle.titleZh || featuredArticle.title_zh)) || featuredArticle.title)}
                  </h2>
                </Link>

                <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                  {isEnglish ? (featuredArticle.excerptEn || featuredArticle.excerpt) : ((isChinese && (featuredArticle.excerptZh || featuredArticle.excerpt_zh)) || featuredArticle.excerpt)}
                </p>

                <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 pt-2 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-tea-leaf dark:text-tea-mint" /> {featuredArticle.date}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-4 h-4 text-tea-leaf dark:text-tea-mint" />
                    {isEnglish ? `${featuredArticle.readTime?.replace(/[^0-9]/g, '') || '5'} min read` : (isChinese ? `${featuredArticle.readTime?.replace(/[^0-9]/g, '') || '5'} 分鐘閱讀` : featuredArticle.readTime)}
                  </span>
                </div>

                <div className="pt-4">
                  <Link
                    to={`/news/${featuredArticle.slug || featuredArticle.id}`}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-tea-primary hover:bg-tea-emerald text-white text-xs font-bold transition-all shadow-tea-sm group"
                  >
                    <span>{t('news_read_more', 'Đọc bài viết chi tiết')}</span>
                    <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-3xl overflow-hidden aspect-[4/3] bg-tea-mist dark:bg-[#0B130E] shadow-tea-sm">
                  <img
                    src={getArticleImageUrl(featuredArticle)}
                    alt={isEnglish ? (featuredArticle.titleEn || featuredArticle.title) : ((isChinese && (featuredArticle.titleZh || featuredArticle.title_zh)) || featuredArticle.title)}
                    onError={(e) => {
                      e.currentTarget.src = '/logo.png';
                    }}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 3. BỘ LỌC BÀI VIẾT (CONTROLS: CATEGORIES, TAGS, SEARCH & SORT) */}
      <section className="py-5 bg-[#FAF9F5]/95 dark:bg-[#0E1711]/95 backdrop-blur-md border-y border-tea-border/60 dark:border-white/10 sticky top-16 z-20 shadow-tea-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3.5">
          {/* Hàng 1: Danh mục bài viết + Ô tìm kiếm + Sắp xếp */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3.5">
            {/* Category Pills có số lượng bài viết */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none flex-1">
              {NEWS_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat.id || (cat.aliases && cat.aliases.includes(selectedCategory));
                const count = cat.id === 'all' ? articles.length : (categoryCounts[cat.id] || 0);
                return (
                  <button
                    key={cat.id}
                    onClick={() => handleSelectCategory(cat.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs ${
                      isSelected
                        ? 'bg-tea-primary text-white shadow-tea-sm'
                        : 'bg-white dark:bg-[#132018] text-gray-700 dark:text-gray-300 hover:bg-tea-soft dark:hover:bg-[#1C2F23] border border-tea-border dark:border-white/10 hover:border-tea-leaf/40'
                    }`}
                  >
                    <span>{isEnglish ? (cat.nameEn || cat.name) : ((isChinese && cat.nameZh) || cat.name)}</span>
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-100 dark:bg-white/10 text-gray-500 dark:text-gray-400'
                    }`}>
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Bên phải: Dropdown sắp xếp + Ô tìm kiếm */}
            <div className="flex items-center gap-2.5 shrink-0">
              {/* Sắp xếp bài viết */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-3 pr-7 py-2 rounded-xl border border-tea-border dark:border-white/10 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white dark:bg-[#132018] text-gray-700 dark:text-gray-300 cursor-pointer shadow-2xs"
                >
                  <option value="newest">{isEnglish ? 'Newest' : (isChinese ? '最新發布' : 'Mới nhất')}</option>
                  <option value="featured">{isEnglish ? 'Featured' : (isChinese ? '精選推薦' : 'Nổi bật')}</option>
                  <option value="oldest">{isEnglish ? 'Oldest' : (isChinese ? '最早發布' : 'Cũ nhất')}</option>
                </select>
              </div>

              {/* Ô tìm kiếm từ khóa */}
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={t('news_search_placeholder', 'Tìm bài viết, công thức...')}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-8 py-2 rounded-xl border border-tea-border dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white dark:bg-[#132018] dark:text-white dark:placeholder-gray-400 transition-colors shadow-2xs"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-white p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Hàng 2: Bộ lọc Thẻ Tag chủ đề (Popular Tags) */}
          {availableTags.length > 0 && (
            <div className="pt-2.5 border-t border-tea-border/40 dark:border-white/5 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
              <div className="flex items-center gap-1.5 text-gray-600 dark:text-gray-400 font-bold shrink-0 mr-1 text-[11px]">
                <Tag className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint" />
                <span>{isEnglish ? 'Topic Tags:' : (isChinese ? '熱門標籤:' : 'Thẻ chủ đề:')}</span>
              </div>
              <button
                onClick={handleClearTagFilter}
                className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  !activeTag
                    ? 'bg-tea-leaf/20 dark:bg-tea-mint/20 text-tea-dark dark:text-white font-bold border border-tea-leaf/40 dark:border-tea-mint/40 shadow-2xs'
                    : 'bg-white dark:bg-[#132018] text-gray-600 dark:text-gray-400 border border-tea-border/60 dark:border-white/10 hover:border-tea-leaf/40'
                }`}
              >
                {isEnglish ? 'All tags' : (isChinese ? '全部標籤' : 'Tất cả thẻ')}
              </button>
              {availableTags.map((tagObj) => {
                const isSelected = activeTagSlug === tagObj.slug;
                return (
                  <button
                    key={tagObj.slug}
                    onClick={() => {
                      if (isSelected) {
                        handleClearTagFilter();
                      } else {
                        searchParams.set('tag', tagObj.slug);
                        setSearchParams(searchParams);
                      }
                    }}
                    className={`px-3 py-1 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                      isSelected
                        ? 'bg-tea-primary text-white font-bold shadow-2xs'
                        : 'bg-white dark:bg-[#132018] text-gray-600 dark:text-gray-400 hover:text-tea-primary dark:hover:text-tea-mint border border-tea-border/60 dark:border-white/10 hover:border-tea-leaf/40 shadow-2xs'
                    }`}
                  >
                    <span className={isSelected ? 'text-white' : 'text-tea-leaf dark:text-tea-mint font-bold'}>#</span>
                    <span>{tagObj.name}</span>
                    <span className="text-[10px] opacity-70">({tagObj.count})</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. ARTICLES GRID & ACTIVE FILTER SUMMARY */}
      <section className="py-10 bg-[#FAF9F5] dark:bg-[#0B130E] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Thanh hiển thị các điều kiện đang lọc (Active Filters Summary) */}
          {isFiltering && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 px-5 rounded-2xl bg-white dark:bg-[#132018] border border-tea-leaf/30 dark:border-tea-mint/30 text-tea-dark dark:text-white text-xs mb-8 shadow-xs">
              <div className="flex flex-wrap items-center gap-2">
                <div className="flex items-center gap-1.5 font-bold text-tea-primary dark:text-tea-mint mr-1">
                  <Filter className="w-4 h-4" />
                  <span>{isEnglish ? 'Active Filters:' : (isChinese ? '篩選條件:' : 'Đang lọc theo:')}</span>
                </div>

                {/* Danh mục */}
                {selectedCategory !== 'all' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 text-emerald-800 dark:text-emerald-300 font-semibold text-xs">
                    <span>{getNewsCategoryLabel(selectedCategory, isEnglish ? 'en' : (isChinese ? 'zh' : 'vi'))}</span>
                    <button
                      onClick={() => handleSelectCategory('all')}
                      className="hover:text-red-500 cursor-pointer"
                      title="Bỏ lọc danh mục"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {/* Thẻ Tag */}
                {activeTag && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-tea-leaf/15 dark:bg-tea-mint/15 border border-tea-leaf/30 dark:border-tea-mint/30 text-tea-primary dark:text-tea-mint font-semibold text-xs">
                    <span>#{activeTagDisplayName || activeTag}</span>
                    <button
                      onClick={handleClearTagFilter}
                      className="hover:text-red-500 cursor-pointer"
                      title="Bỏ lọc thẻ"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {/* Từ khóa tìm kiếm */}
                {searchQuery.trim() && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 dark:bg-amber-950/60 border border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 font-semibold text-xs">
                    <span>Từ khóa: "{searchQuery.trim()}"</span>
                    <button
                      onClick={() => setSearchQuery('')}
                      className="hover:text-red-500 cursor-pointer"
                      title="Xóa từ khóa"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                )}

                {/* Số lượng bài viết tìm thấy */}
                <span className="text-gray-500 dark:text-gray-400 font-normal ml-1">
                  ({filteredArticles.length} {isEnglish ? 'articles found' : (isChinese ? '篇文章' : 'bài viết phù hợp')})
                </span>
              </div>

              {/* Nút đặt lại tất cả bộ lọc */}
              <button
                onClick={handleResetAllFilters}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/15 text-gray-700 dark:text-gray-300 text-xs font-bold transition-all cursor-pointer shadow-2xs"
              >
                <RotateCcw className="w-3.5 h-3.5 text-gray-500" />
                <span>{isEnglish ? 'Reset all' : (isChinese ? '重置全部' : 'Đặt lại bộ lọc')}</span>
              </button>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedArticles.map((article) => (
              <NewsCard key={article.id} article={article} />
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="py-16 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#132018] rounded-3xl border border-tea-border dark:border-white/10 p-8 space-y-4">
              <p className="text-base font-medium">
                {isEnglish ? 'No articles found matching your criteria.' : (isChinese ? '查無符合條件的文章。' : 'Không tìm thấy bài viết phù hợp với tiêu chí lọc.')}
              </p>
              {isFiltering && (
                <button
                  onClick={handleResetAllFilters}
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-tea-primary text-white text-xs font-bold shadow-tea-sm hover:bg-tea-emerald transition-all cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>{isEnglish ? 'Reset all filters' : (isChinese ? '清除所有篩選' : 'Đặt lại tất cả bộ lọc')}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

