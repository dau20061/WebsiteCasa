import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  HelpCircle,
  ChevronDown,
  Search,
  Sparkles,
  MessageSquare,
  Send,
  PhoneCall
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import SEO from '../components/SEO';
import WaveDivider from '../components/WaveDivider';
import { FAQ_CATEGORIES } from '../constants/categories';
import { COMPANY_INFO } from '../constants/company';
import { useToast } from '../components/Toast';
import { useLanguage } from '../context/LanguageContext';
import { getRtdbFaqs } from '../services/rtdbService';

export default function FAQ() {
  const { t, isChinese } = useLanguage();
  const { showToast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [openItems, setOpenItems] = useState(['faq-01', 'faq-02']); // default opened
  const [questionInput, setQuestionInput] = useState('');

  const [faqsList, setFaqsList] = useState(() => {
    const saved = localStorage.getItem('casa_admin_faqs');
    return saved ? JSON.parse(saved) : [];
  });

  React.useEffect(() => {
    getRtdbFaqs().then((res) => {
      if (res && res.length > 0) setFaqsList(res);
    });
  }, []);

  const toggleItem = (id) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const filteredFaqs = faqsList.filter((faq) => {
    const q = (isChinese && (faq.questionZh || faq.question_zh)) || faq.question || '';
    const a = (isChinese && (faq.answerZh || faq.answer_zh)) || faq.answer || '';
    const matchesCategory =
      selectedCategory === 'all' || faq.category === selectedCategory;

    const matchesSearch =
      searchQuery === '' ||
      q.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleAskQuestion = (e) => {
    e.preventDefault();
    if (!questionInput.trim()) return;
    showToast('Câu hỏi của bạn đã được gửi đến bộ phận kỹ thuật R&D CASA. Chúng tôi sẽ phản hồi sớm nhất!', 'success');
    setQuestionInput('');
  };

  return (
    <div className="overflow-hidden pb-20">
      <SEO
        title="Câu Hỏi Thường Gặp (FAQ)"
        description="Giải đáp mọi thắc mắc về chính sách mẫu thử miễn phí, số lượng đặt hàng tối thiểu MOQ, quy cách đóng gói và chuyển giao công thức trà CASA."
      />

      {/* 1. HERO TITLE */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-14 bg-gradient-to-b from-[#DFF5E1]/50 via-[#BFE8D0]/20 to-[#FAF9F5] dark:from-[#132B1C]/70 dark:via-[#0F1E14]/40 dark:to-[#0B130E] overflow-hidden transition-colors">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-5 right-10 w-[450px] h-[450px] bg-tea-mint/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-5 left-10 w-[350px] h-[350px] bg-tea-leaf/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#132018] text-tea-primary dark:text-tea-mint border border-tea-leaf/30 dark:border-tea-mint/30 text-xs font-bold uppercase tracking-wider shadow-sm">
            <HelpCircle className="w-3.5 h-3.5 text-tea-leaf" /> {t('faq_hero_badge', 'Trung Tâm Trợ Giúp B2B')}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-tea-dark dark:text-white tracking-tight">
            {t('faq_hero_title', 'Câu Hỏi Thường Gặp (FAQ)')}
          </h1>
          <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 max-w-2xl mx-auto font-normal">
            {t('faq_hero_desc', 'Tổng hợp các thắc mắc phổ biến của các chuỗi trà sữa, quán cafe và nhà phân phối khi tìm hiểu về nguyên liệu và chính sách của CASA.')}
          </p>
        </div>
      </section>

      {/* Animated Wavy Transition: Hero -> Search Filters */}
      <WaveDivider
        fromBg="bg-[#FAF9F5] dark:bg-[#0B130E]"
        toColor="text-white/95 dark:text-[#0B130E]/95"
        accentColor="text-tea-mint/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-leaf/20 dark:text-tea-leaf/10"
        flipX={false}
      />

      {/* 2. SEARCH & CATEGORY FILTER */}
      <section className="py-6 bg-white/95 dark:bg-[#0B130E]/95 backdrop-blur-md sticky top-16 z-20 shadow-tea-sm transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Category tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none w-full sm:w-auto">
            {FAQ_CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-tea-primary text-white shadow-tea-sm'
                    : 'bg-white dark:bg-[#132018] text-gray-700 dark:text-gray-300 hover:bg-tea-soft dark:hover:bg-[#1C2F23] border border-tea-border dark:border-white/10'
                }`}
              >
                {isChinese
                  ? (cat.id === 'all' ? '全部' : cat.id === 'product' ? '茶品與原料' : cat.id === 'policy' ? '樣品與起訂量' : cat.id === 'storage' ? '保存與效期' : cat.name)
                  : cat.name}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder={t('faq_search_placeholder', 'Tìm kiếm câu hỏi...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl border border-tea-border dark:border-white/10 text-xs focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white dark:bg-[#132018] dark:text-white dark:placeholder-gray-400 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* 3. ACCORDION LIST */}
      <section className="py-12 bg-[#FAF9F5] dark:bg-[#0B130E] transition-colors">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="space-y-4">
            {filteredFaqs.map((faq) => {
              const isOpen = openItems.includes(faq.id);
              const displayQuestion = (isChinese && (faq.questionZh || faq.question_zh)) || faq.question;
              const displayAnswer = (isChinese && (faq.answerZh || faq.answer_zh)) || faq.answer;

              return (
                <div
                  key={faq.id}
                  className="bg-white dark:bg-[#132018] rounded-2xl border border-tea-border/80 dark:border-white/10 shadow-tea-sm overflow-hidden transition-all"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 hover:bg-tea-cream/40 dark:hover:bg-white/5 transition-colors"
                  >
                    <span className="text-sm sm:text-base font-bold text-tea-dark dark:text-white leading-snug">
                      {displayQuestion}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${
                        isOpen
                          ? 'bg-tea-emerald text-white rotate-180'
                          : 'bg-tea-soft dark:bg-[#1C2F23] text-tea-emerald dark:text-tea-mint'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeInOut' }}
                      >
                        <div className="px-5 pb-6 sm:px-6 sm:pb-6 pt-2 border-t border-gray-100 dark:border-white/10 text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-normal">
                          {displayAnswer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}

            {filteredFaqs.length === 0 && (
              <div className="py-12 text-center text-gray-500 dark:text-gray-400 bg-white dark:bg-[#132018] rounded-2xl border border-tea-border dark:border-white/10">
                {isChinese
                  ? '查無相符的問題。您可以在下方直接向我們提出您的疑問。'
                  : 'Không tìm thấy câu hỏi phù hợp. Bạn có thể gửi câu hỏi trực tiếp cho chúng tôi bên dưới.'}
              </div>
            )}
          </div>

          {/* Ask Question Card */}
          <div className="mt-16 p-6 sm:p-10 rounded-3xl bg-white dark:bg-[#132018] border border-tea-border dark:border-white/10 shadow-tea-sm space-y-6 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-tea-soft dark:bg-[#1C2F23] flex items-center justify-center text-tea-emerald dark:text-tea-mint">
                <MessageSquare className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-tea-dark dark:text-white">
                  {isChinese ? '仍有其他疑問需要解答？' : 'Vẫn còn câu hỏi thắc mắc khác?'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 font-normal">
                  {isChinese
                    ? '送出您的問題，CASA 專業調配技術專家將透過電子郵件或電話直接回覆您。'
                    : 'Gửi câu hỏi của bạn, chuyên gia kỹ thuật của CASA sẽ phản hồi trực tiếp qua email hoặc hotline.'}
                </p>
              </div>
            </div>

            <form onSubmit={handleAskQuestion} className="space-y-3">
              <textarea
                rows={3}
                required
                placeholder={isChinese ? "請在此輸入您的問題（例如：訂購 200kg 原料之配送物流方式與運費為何？）..." : "Nhập câu hỏi của bạn tại đây (VD: Chi phí vận chuyển về Hải Phòng cho đơn 200kg là bao nhiêu?)..."}
                value={questionInput}
                onChange={(e) => setQuestionInput(e.target.value)}
                className="w-full p-4 rounded-xl border border-tea-border dark:border-white/10 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 resize-none bg-white dark:bg-[#0B130E] dark:text-white dark:placeholder-gray-400 transition-colors"
              />

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                <a
                  href={`tel:${COMPANY_INFO.hotline.replace(/\s/g, '')}`}
                  className="text-xs text-tea-emerald dark:text-tea-mint font-bold flex items-center gap-1.5 hover:underline"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>
                    {isChinese ? `或直接撥打 B2B 諮詢專線：${COMPANY_INFO.hotline}` : `Hoặc gọi hotline B2B: ${COMPANY_INFO.hotline}`}
                  </span>
                </a>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-tea-primary hover:bg-tea-emerald text-white text-xs font-bold transition-all shadow-tea-sm"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isChinese ? '送出問題' : 'Gửi câu hỏi'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}

