import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  ArrowLeft,
  Share2,
  Bookmark,
  CheckCircle2,
  Sparkles,
  ChefHat,
  Tag,
  AlertCircle
} from 'lucide-react';
import SEO from '../components/SEO';
import NewsCard from '../components/NewsCard';
import { getRtdbNews } from '../services/rtdbService';
import { useToast } from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';

export default function NewsDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { t, isChinese } = useLanguage();

  const [allArticles, setAllArticles] = useState(() => {
    const saved = localStorage.getItem('casa_admin_news');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    getRtdbNews().then((res) => {
      if (res && res.length > 0) setAllArticles(res);
    });
  }, []);

  const article = allArticles.find((a) => a.slug === slug || a.id === slug);

  if (!article) {
    return (
      <div className="pt-36 pb-20 text-center max-w-md mx-auto px-4">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h2 className="text-2xl font-bold text-tea-dark dark:text-white">
          {isChinese ? '找不到該文章' : 'Không tìm thấy bài viết'}
        </h2>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
          {isChinese ? '文章可能已被移除或路徑不正確。' : 'Bài viết có thể đã bị xóa hoặc đường dẫn không chính xác.'}
        </p>
        <Link
          to="/news"
          className="mt-6 inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-tea-primary text-white text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> {isChinese ? '返回資訊專區' : 'Quay lại danh mục tin tức'}
        </Link>
      </div>
    );
  }

  const relatedArticles = allArticles.filter((a) => a.id !== article.id).slice(0, 2);

  const displayTitle = (isChinese && (article.titleZh || article.title_zh)) || article.title;
  const displayExcerpt = (isChinese && (article.excerptZh || article.excerpt_zh)) || article.excerpt;
  const displayContent = (isChinese && (article.contentZh || article.content_zh)) || article.content;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast(isChinese ? '文章連結已複製至剪貼簿！' : 'Đã sao chép liên kết bài viết vào bộ nhớ tạm!', 'success');
    }
  };

  return (
    <div className="pt-20 pb-20 bg-[#FAF9F5] dark:bg-[#0B130E] min-h-screen transition-colors">
      {/* TECHNICAL SEO: SCHEMA.ORG NEWSARTICLE & BREADCRUMBS */}
      <SEO
        title={`${displayTitle} – Kiến Thức & Công Thức F&B`}
        description={displayExcerpt}
        keywords={[displayTitle, article.category, ...(Array.isArray(article.tags) ? article.tags : []), 'công thức pha chế', 'tin tức trà sữa', 'kiến thức F&B', 'CASA TEA']}
        canonical={`/news/${article.slug || article.id}`}
        ogType="article"
        ogImage={article.image}
        ogImageAlt={`${displayTitle} – CASA TEA`}
        publishedTime={article.createdAt || '2026-01-01T00:00:00Z'}
        modifiedTime={article.updatedAt || article.createdAt || '2026-01-01T00:00:00Z'}
        author={article.author || 'CASA TEA R&D Team'}
        jsonLd={[
          {
            '@type': 'NewsArticle',
            headline: displayTitle,
            description: displayExcerpt,
            keywords: (article.tags && article.tags.length > 0) ? article.tags.join(', ') : undefined,
            image: [article.image],
            datePublished: article.createdAt || '2026-01-01T00:00:00Z',
            dateModified: article.updatedAt || article.createdAt || '2026-01-01T00:00:00Z',
            author: {
              '@type': 'Person',
              name: article.author || 'CASA TEA R&D Team'
            },
            publisher: {
              '@type': 'Organization',
              name: 'CASA TEA & BEVERAGE SOLUTIONS',
              logo: {
                '@type': 'ImageObject',
                url: 'https://websiteacasa.vercel.app/logo.png'
              }
            },
            mainEntityOfPage: `https://websiteacasa.vercel.app/news/${article.slug || article.id}`
          },
          {
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: isChinese ? '首頁' : 'Trang Chủ',
                item: 'https://websiteacasa.vercel.app/'
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: isChinese ? '資訊與配方' : 'Tin Tức & Công Thức',
                item: 'https://websiteacasa.vercel.app/news'
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: displayTitle,
                item: `https://websiteacasa.vercel.app/news/${article.slug || article.id}`
              }
            ]
          }
        ]}
      />

      {/* Breadcrumbs */}
      <div className="bg-white/90 dark:bg-[#0B130E]/90 backdrop-blur-md border-b border-tea-border/60 dark:border-white/10 py-3.5 transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
          <Link to="/" className="hover:text-tea-primary dark:hover:text-tea-mint">
            {isChinese ? '首頁' : 'Trang Chủ'}
          </Link>
          <span>/</span>
          <Link to="/news" className="hover:text-tea-primary dark:hover:text-tea-mint">
            {isChinese ? '資訊與配方' : 'Tin Tức'}
          </Link>
          <span>/</span>
          <span className="text-tea-dark dark:text-white font-semibold truncate">{displayTitle}</span>
        </div>
      </div>

      <article className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-700 dark:text-gray-300 hover:text-tea-primary dark:hover:text-tea-mint mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> {isChinese ? '返回上一頁' : 'Quay lại'}
        </button>

        {/* Card wrapper */}
        <div className="bg-white dark:bg-[#132018] rounded-4xl p-6 sm:p-12 border border-tea-border dark:border-white/10 shadow-tea-sm transition-colors">
          {/* Article Header */}
          <header className="space-y-4 mb-8">
            <div className="inline-block px-3.5 py-1 rounded-full bg-tea-soft dark:bg-[#0B130E] text-tea-primary dark:text-tea-mint border border-tea-leaf/20 dark:border-white/10 text-xs font-bold tracking-wide uppercase">
              {(isChinese && (article.categoryZh || article.category_zh)) || article.category}
            </div>

            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-tea-dark dark:text-white leading-tight tracking-tight">
              {displayTitle}
            </h1>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-b border-gray-100 dark:border-white/10 pb-6 text-xs text-gray-600 dark:text-gray-400 font-medium">
              <div className="flex items-center gap-4">
                <span className="font-semibold text-tea-dark dark:text-white">{isChinese ? '作者' : 'Tác giả'}: {article.author}</span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint" /> {article.date}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint" />
                  {isChinese ? `${article.readTime?.replace(/[^0-9]/g, '') || '5'} 分鐘閱讀` : article.readTime}
                </span>
              </div>

              <button
                onClick={handleShare}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF9F5] dark:bg-[#0B130E] hover:bg-tea-soft dark:hover:bg-[#1C2F23] text-tea-primary dark:text-tea-mint font-semibold text-xs border border-tea-border dark:border-white/10 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>{isChinese ? '分享文章' : 'Chia sẻ bài viết'}</span>
              </button>
            </div>
          </header>

          {/* Featured Image */}
          <div className="rounded-3xl overflow-hidden aspect-[16/9] mb-10 bg-tea-mist dark:bg-[#0B130E] shadow-tea-sm">
            <img
              src={article.image}
              alt={`${displayTitle} – Chuyên Mục Kiến Thức & Công Thức Pha Chế CASA TEA`}
              title={`${displayTitle} – CASA TEA`}
              loading="eager"
              fetchPriority="high"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Article Body HTML Content */}
          <div
            className="article-content prose prose-lg dark:prose-invert max-w-none text-gray-800 dark:text-gray-200 leading-relaxed space-y-4 font-normal"
            dangerouslySetInnerHTML={{ __html: displayContent }}
          />

          {/* Recipe Box (if exists) */}
          {article.recipeBox && (
            <div className="my-10 p-6 sm:p-8 rounded-3xl bg-[#FAF9F5] dark:bg-[#0B130E] border-2 border-tea-leaf/30 dark:border-white/10 shadow-tea-sm transition-colors">
              <div className="flex items-center gap-3 border-b border-tea-leaf/20 dark:border-white/10 pb-4 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white dark:bg-[#132018] flex items-center justify-center text-tea-emerald dark:text-tea-mint shadow-sm">
                  <ChefHat className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-tea-dark dark:text-white">
                    {(isChinese && (article.recipeBox.titleZh || article.recipeBox.title_zh)) || article.recipeBox.title}
                  </h3>
                  <span className="text-xs font-semibold text-tea-emerald dark:text-tea-mint">
                    {isChinese ? `單杯原物料成本預估：${article.recipeBox.cost}` : `Ước tính giá vốn: ${article.recipeBox.cost}`}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    {isChinese ? '準備原物料：' : 'Nguyên liệu chuẩn bị:'}
                  </h4>
                  <ul className="space-y-1.5 text-xs text-gray-800 dark:text-gray-200">
                    {article.recipeBox.ingredients.map((ing, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-tea-leaf shrink-0 mt-0.5" />
                        <span>{ing}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-2">
                    {isChinese ? '標準調茶 SOP 操作步驟：' : 'Các bước thực hiện SOP:'}
                  </h4>
                  <ol className="list-decimal pl-4 space-y-1.5 text-xs text-gray-800 dark:text-gray-200">
                    {article.recipeBox.steps.map((st, i) => (
                      <li key={i} className="leading-relaxed">{st}</li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
          )}

          {/* Tags */}
          {article.tags && (
            <div className="pt-6 border-t border-gray-100 dark:border-white/10 flex flex-wrap items-center gap-2">
              <Tag className="w-4 h-4 text-tea-leaf" />
              <span className="text-xs text-gray-700 dark:text-gray-300 mr-2 font-medium">
                {isChinese ? '文章標籤：' : 'Thẻ bài viết:'}
              </span>
              {article.tags.map((tag, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-lg bg-[#FAF9F5] dark:bg-[#0B130E] text-xs font-medium text-gray-700 dark:text-gray-300 border border-tea-border dark:border-white/10"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Related articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200 dark:border-white/10">
            <h3 className="text-xl font-bold text-tea-dark dark:text-white mb-6">
              {isChinese ? '同主題推薦閱讀' : 'Bài viết cùng chuyên mục'}
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((a) => (
                <NewsCard key={a.id} article={a} />
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
}

