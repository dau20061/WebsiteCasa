import React, { useState, useEffect, useMemo } from 'react';
import { Link, useSearchParams, useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Calendar, Clock, ArrowRight, BookOpen, Sparkles, Tag, X } from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import NewsCard from '../components/NewsCard';
import WaveDivider from '../components/WaveDivider';
import SEO from '../components/SEO';
import { NEWS_CATEGORIES } from '../constants/categories';
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

  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [articles, setArticles] = useState(() => {
    const saved = localStorage.getItem('casa_admin_news');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    getRtdbNews().then((res) => {
      if (res && res.length > 0) setArticles(res);
    });
  }, []);

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

  const handleClearTagFilter = () => {
    if (tagSlug) {
      navigate('/news');
    } else {
      searchParams.delete('tag');
      setSearchParams(searchParams);
    }
  };

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
      selectedCategory === 'all' || article.categorySlug === selectedCategory || article.category === selectedCategory;

    const matchesTag = !activeTag || (
      Array.isArray(article.tags) && article.tags.some((t) => {
        const cleanT = String(t).replace(/^#+/, '').trim();
        return slugify(cleanT) === activeTagSlug || cleanT.toLowerCase() === activeTag.toLowerCase();
      })
    );

    const q = searchQuery.toLowerCase();
    const matchesSearch =
      searchQuery === '' ||
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

      {/* 2. FEATURED HERO ARTICLE */}
      {featuredArticle && !activeTag && (
        <section className="py-12 bg-white dark:bg-[#0B130E] transition-colors">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="bg-[#FAF9F5] dark:bg-[#132018] rounded-4xl p-6 sm:p-10 border border-tea-border dark:border-white/10 overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-8 items-center transition-colors">
              <div className="lg:col-span-7 space-y-4">
                <div className="flex items-center gap-3 text-xs text-tea-leaf dark:text-tea-mint font-bold">
                  <span className="px-3 py-1 rounded-full bg-tea-soft dark:bg-[#0B130E] text-tea-primary dark:text-tea-mint uppercase">
                    {isEnglish ? (featuredArticle.categoryEn || featuredArticle.category) : ((isChinese && (featuredArticle.categoryZh || featuredArticle.category_zh)) || featuredArticle.category)}
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

      {/* 3. CONTROLS (SEARCH & CATEGORIES) */}
      <section className="py-6 bg-[#FAF9F5]/95 dark:bg-[#0E1711]/95 backdrop-blur-md border-y border-tea-border/60 dark:border-white/10 sticky top-16 z-20 shadow-tea-sm transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full md:w-auto">
              {NEWS_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    selectedCategory === cat.id
                      ? 'bg-tea-primary text-white shadow-tea-sm'
                      : 'bg-white dark:bg-[#132018] text-gray-700 dark:text-gray-300 hover:bg-tea-soft dark:hover:bg-[#1C2F23] border border-tea-border dark:border-white/10'
                  }`}
                >
                  {isEnglish ? (cat.nameEn || cat.name) : ((isChinese && cat.nameZh) || cat.name)}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder={t('news_search_placeholder', 'Tìm bài viết, công thức...')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-tea-border dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white dark:bg-[#132018] dark:text-white dark:placeholder-gray-400 transition-colors"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 4. ARTICLES GRID */}
      <section className="py-12 bg-[#FAF9F5] dark:bg-[#0B130E] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Active Tag Filter Banner */}
          {activeTag && (
            <div className="flex flex-wrap items-center justify-between gap-3 p-4 px-5 rounded-2xl bg-tea-leaf/10 dark:bg-tea-mint/10 border border-tea-leaf/30 dark:border-tea-mint/30 text-tea-dark dark:text-white text-xs mb-8 shadow-xs">
              <div className="flex items-center gap-2.5">
                <Tag className="w-4 h-4 text-tea-leaf dark:text-tea-mint shrink-0" />
                <span className="font-medium">
                  {isEnglish ? 'Filtering by tag:' : (isChinese ? '正在篩選標籤：' : 'Đang lọc bài viết theo thẻ:')}
                  <span className="ml-1.5 font-bold text-sm text-tea-primary dark:text-tea-mint">#{activeTagDisplayName || activeTag}</span>
                  <span className="ml-2 text-gray-500 dark:text-gray-400 font-normal">
                    ({filteredArticles.length} {isEnglish ? 'articles' : (isChinese ? '篇文章' : 'bài viết')})
                  </span>
                </span>
              </div>
              <button
                onClick={handleClearTagFilter}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white dark:bg-[#132018] text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 border border-tea-border dark:border-white/10 hover:border-red-300 text-xs font-semibold transition-all cursor-pointer shadow-2xs hover:shadow-xs"
              >
                <X className="w-3.5 h-3.5" />
                <span>{isEnglish ? 'Clear filter' : (isChinese ? '清除篩選' : 'Bỏ lọc thẻ')}</span>
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
              <p>{isEnglish ? 'No articles found matching your search.' : (isChinese ? '查無符合搜尋條件的文章。' : 'Không tìm thấy bài viết phù hợp với tiêu chí tìm kiếm.')}</p>
              {activeTag && (
                <button
                  onClick={handleClearTagFilter}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-tea-primary text-white text-xs font-bold shadow-tea-sm hover:bg-tea-emerald transition-all cursor-pointer"
                >
                  <X className="w-4 h-4" />
                  <span>{isEnglish ? 'Remove tag filter' : (isChinese ? '清除標籤篩選' : 'Bỏ lọc theo thẻ')}</span>
                </button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

