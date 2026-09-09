import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function NewsCard({ article }) {
  const { t, isChinese } = useLanguage();
  const { slug, title, category, date, readTime, excerpt, image, author } = article;

  const displayTitle = (isChinese && (article.titleZh || article.title_zh)) || title;
  const displayExcerpt = (isChinese && (article.excerptZh || article.excerpt_zh)) || excerpt;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="group bg-white dark:bg-[#132018] rounded-3xl overflow-hidden border border-tea-border dark:border-white/10 shadow-tea-sm hover:shadow-tea-lg dark:hover:border-tea-mint/30 transition-all flex flex-col h-full"
    >
      <Link to={`/news/${slug}`} className="relative h-52 w-full overflow-hidden bg-tea-mist dark:bg-[#1A2C21] block">
        <img
          src={image}
          alt={displayTitle}
          loading="lazy"
          className="w-full h-full object-cover object-center transform group-hover:scale-106 transition-transform duration-500 ease-out"
        />
        <div className="absolute top-3.5 left-3.5">
          <span className="px-3 py-1 rounded-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md text-tea-primary dark:text-tea-mint text-xs font-bold shadow-sm">
            {(isChinese && (article.categoryZh || article.category_zh)) || category}
          </span>
        </div>
      </Link>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-3 text-xs text-gray-600 dark:text-gray-400 mb-2.5 font-medium">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint" /> {date}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint" />
              {isChinese ? `${readTime?.replace(/[^0-9]/g, '') || '5'} 分鐘閱讀` : readTime}
            </span>
          </div>

          <Link to={`/news/${slug}`}>
            <h3 className="text-lg font-bold text-tea-dark dark:text-white group-hover:text-tea-green dark:group-hover:text-tea-mint transition-colors line-clamp-2 leading-snug">
              {displayTitle}
            </h3>
          </Link>

          <p className="mt-2 text-sm text-gray-700 dark:text-gray-300 line-clamp-2 leading-relaxed font-normal">
            {displayExcerpt}
          </p>
        </div>

        <div className="mt-5 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
          <span className="text-xs text-gray-600 dark:text-gray-400 line-clamp-1 italic font-medium">
            {isChinese ? '發布:' : 'Bởi:'} {author.split('(')[0].trim()}
          </span>

          <Link
            to={`/news/${slug}`}
            className="inline-flex items-center gap-1 text-xs font-bold text-tea-primary dark:text-tea-mint hover:text-tea-emerald transition-colors"
          >
            <span>{t('news_read_more', 'Đọc tiếp')}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </motion.article>
  );
}

