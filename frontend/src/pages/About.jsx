import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Target,
  Compass,
  Heart,
  Award,
  Users,
  Sprout,
  CheckCircle2,
  ArrowRight,
  MapPin,
  Calendar
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import SEO from '../components/SEO';
import { TIMELINE, TEA_REGIONS, CORE_VALUES, COMPANY_INFO } from '../constants/company';
import { useAppUI } from '../layouts/MainLayout';
import { useLanguage } from '../context/LanguageContext';

export default function About() {
  const { openSampleModal } = useAppUI();
  const { t, isChinese } = useLanguage();

  return (
    <div className="overflow-hidden pb-20">
      <SEO
        title="Về Chúng Tôi"
        description="Khám phá câu chuyện hình thành, sứ mệnh, tầm nhìn và hành trình kiến tạo chuẩn mực trà nguyên liệu của CASA TEA & BEVERAGE SOLUTIONS."
      />

      {/* 1. HERO ABOUT */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-gradient-to-b from-[#DFF5E1]/50 via-[#BFE8D0]/20 to-[#FAF9F5] dark:from-[#132B1C]/70 dark:via-[#0F1E14]/40 dark:to-[#0B130E] overflow-hidden border-b border-tea-border/60 dark:border-white/10 transition-colors">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-tea-mint/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-tea-leaf/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#132018] text-tea-primary dark:text-tea-mint border border-tea-leaf/30 dark:border-tea-mint/30 text-xs font-bold uppercase tracking-wider shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-tea-leaf" />
              {t('about_hero_badge', 'Câu Chuyện Thương Hiệu CASA')}
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-tea-dark dark:text-white tracking-tight leading-tight"
            >
              {t('about_hero_title_1', 'Kiến Tạo Chuẩn Mực Mới Cho')}{' '}
              <span className="text-gradient-tea">{t('about_hero_title_highlight', 'Ngành Trà Nguyên Liệu')}</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed"
            >
              {t('about_hero_desc', 'Khởi nguồn từ tình yêu với những đồi chè đại ngàn cao nguyên Việt Nam, CASA mang sứ mệnh chuẩn hóa hương vị, nâng tầm giá trị nông sản và đồng hành cùng sự phát triển bền vững của ngành F&B hiện đại.')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* 2. CÂU CHUYỆN HÌNH THÀNH (STORYTELLING) */}
      <section className="py-20 bg-white dark:bg-[#0B130E] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tea-soft dark:bg-[#132018] text-tea-primary dark:text-tea-mint border border-tea-leaf/20 dark:border-white/10 text-xs font-bold uppercase">
                <Sprout className="w-3.5 h-3.5" />
                <span>{isChinese ? '源頭產地與匠心精神' : 'Nguồn Cội & Tâm Huyết'}</span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-tea-dark dark:text-white tracking-tight leading-snug">
                {isChinese ? '從晨霧繚繞的茶山，到現代化封閉式茶廠' : 'Từ Đồi Chè Sương Mù Đến Nhà Máy Hiện Đại'}
              </h2>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {isChinese
                  ? '14 年前，我們注意到許多手搖茶飲與餐飲店主面臨著棘手難題：市面上的商業茶葉原料品質參差不齊、前後批次風味極不穩定，甚至過度使用刺鼻的人工化學香精。'
                  : 'Hơn 14 năm trước, chúng tôi nhận thấy các chủ quán trà sữa và đồ uống tại Việt Nam gặp phải một vấn đề nan giải: trà nguyên liệu trôi nổi trên thị trường thường không ổn định về chất lượng, lô trước đậm vị thì lô sau nhạt nhòa, hoặc sử dụng hương liệu tổng hợp gắt nồng khó chịu.'}
              </p>

              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {isChinese
                  ? '這正是 CASA TEA 創立的初心。我們從直接與保祿（Bảo Lộc）及木州（Mộc Châu）高山茶農契作著手，建立半有機友善耕作標準，嚴格杜絕化學農藥，並打造符合 ISO 22000 與 HACCP Codex 國際規範的全封閉現代化製茶廠。'
                  : 'Đó là lý do CASA TEA ra đời. Chúng tôi bắt đầu bằng việc liên kết trực tiếp với các hộ nông dân tại vùng cao nguyên Bảo Lộc và Mộc Châu, thiết lập quy chuẩn canh tác bán hữu cơ, loại bỏ thuốc trừ sâu hóa học và xây dựng nhà máy chế biến khép kín chuẩn ISO 22000 & HACCP Codex.'}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#132018] border border-tea-border dark:border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-tea-primary dark:text-tea-mint block font-sans">100%</span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1 block">
                    {isChinese ? '每批次嚴格農殘檢驗' : 'Kiểm tra dư lượng từng lô'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#132018] border border-tea-border dark:border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-tea-primary dark:text-tea-mint block font-sans">
                    {isChinese ? '24 個月' : '24 Tháng'}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 font-medium mt-1 block">
                    {isChinese ? 'QC 品管留樣追溯期' : 'Lưu mẫu đối chứng QC'}
                  </span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-6">
              <div className="relative rounded-3xl overflow-hidden shadow-tea-lg border-4 border-white dark:border-[#1B2E23] aspect-[4/3] bg-tea-mist dark:bg-[#132018]">
                <img
                  src="https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=80"
                  alt={isChinese ? 'CASA 保祿高山茶園' : 'Nông trường trà Bảo Lộc CASA'}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 text-white text-xs">
                  <span className="font-bold text-sm block">
                    {isChinese ? '保祿茶園基地 – 海拔 1,100 公尺' : 'Đồi chè Bảo Lộc – Cao độ 1.100m'}
                  </span>
                  <span>
                    {isChinese ? '全年雲霧繚繞，滋養出富含蜜香的嫩綠鮮芽' : 'Mây mù bao phủ quanh năm nuôi dưỡng búp trà non đượm mật'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. TẦM NHÌN, SỨ MỆNH & GIÁ TRỊ CỐT LÕI */}
      <section className="py-20 bg-[#FAF9F5] dark:bg-[#0E1711] border-t border-tea-border/60 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={isChinese ? '戰略發展方向' : 'Định Hướng Chiến Lược'}
            title={isChinese ? '企業願景與發展使命' : 'Tầm Nhìn & Sứ Mệnh Phát Triển'}
            subtitle={isChinese ? '指引 CASA 在產品研發、標準化生產及伴隨客戶成長道路上的核心行動指南。' : 'Kim chỉ nam dẫn dắt mọi quyết định trong hoạt động nghiên cứu, sản xuất và đồng hành cùng khách hàng của CASA.'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {/* Tầm nhìn */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#132018] border border-tea-border dark:border-white/10 shadow-tea-sm space-y-4 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-tea-soft dark:bg-[#1C2F23] flex items-center justify-center text-tea-emerald dark:text-tea-mint">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-tea-dark dark:text-white">
                {isChinese ? '企業願景 (Vision)' : 'Tầm Nhìn (Vision)'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {isChinese
                  ? '成為越南及東南亞地區首屈一指的茶葉深加工製造商與原料解決方案提供商，是國內外知名餐飲連鎖集團不可或缺的戰略合作夥伴。'
                  : 'Trở thành đơn vị sản xuất, chế biến sâu và cung ứng giải pháp nguyên liệu trà số 1 tại Việt Nam và Đông Nam Á. Là đối tác chiến lược không thể thiếu của các tập đoàn chuỗi F&B trong nước và quốc tế.'}
              </p>
            </div>

            {/* Sứ mệnh */}
            <div className="p-8 sm:p-10 rounded-3xl bg-white dark:bg-[#132018] border border-tea-border dark:border-white/10 shadow-tea-sm space-y-4 transition-colors">
              <div className="w-12 h-12 rounded-2xl bg-tea-mint/30 dark:bg-[#1C2F23] flex items-center justify-center text-tea-emerald dark:text-tea-mint">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-tea-dark dark:text-white">
                {isChinese ? '發展使命 (Mission)' : 'Sứ Mệnh (Mission)'}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                {isChinese
                  ? '提供天然純淨的茶葉原料、終年穩定一致的醇厚風味與創新調配配方，協助客戶品牌建立獨特差異化，全面優化單杯經營成本。'
                  : 'Mang đến nguồn nguyên liệu trà tinh khiết, hương vị ổn định tuyệt đối và các giải pháp công thức sáng tạo. Giúp thương hiệu của khách hàng tạo dựng sự khác biệt độc đáo và tối ưu hóa hiệu quả kinh doanh.'}
              </p>
            </div>
          </div>

          {/* 4 Giá trị cốt lõi */}
          <h3 className="text-xl sm:text-2xl font-bold text-center text-tea-dark dark:text-white mb-8">
            {isChinese ? '四大核心價值觀 (Core Values)' : 'Bốn Giá Trị Cốt Lõi (Core Values)'}
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#132018] p-6 rounded-3xl border border-tea-border dark:border-white/10 text-center space-y-2 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-tea-mist dark:bg-[#1C2F23] text-tea-emerald dark:text-tea-mint flex items-center justify-center font-bold text-lg">
                01
              </div>
              <h4 className="font-bold text-tea-dark dark:text-white text-lg">
                {isChinese ? '卓越品質' : 'Chất Lượng'}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {isChinese ? '從產地源頭標準化把關，100% 堅持食品安全零妥協。' : 'Chuẩn hóa từ vùng trồng, kiểm soát 100% không thỏa hiệp về an toàn thực phẩm.'}
              </p>
            </div>

            <div className="bg-white dark:bg-[#132018] p-6 rounded-3xl border border-tea-border dark:border-white/10 text-center space-y-2 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-tea-mist dark:bg-[#1C2F23] text-tea-emerald dark:text-tea-mint flex items-center justify-center font-bold text-lg">
                02
              </div>
              <h4 className="font-bold text-tea-dark dark:text-white text-lg">
                {isChinese ? '誠信履約' : 'Uy Tín'}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {isChinese ? '嚴格恪守供貨交期、研發配方絕對保密、批發價格公開透明。' : 'Giữ trọn cam kết về tiến độ giao hàng, bảo mật công thức và chính sách giá sỉ minh bạch.'}
              </p>
            </div>

            <div className="bg-white dark:bg-[#132018] p-6 rounded-3xl border border-tea-border dark:border-white/10 text-center space-y-2 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-tea-mist dark:bg-[#1C2F23] text-tea-emerald dark:text-tea-mint flex items-center justify-center font-bold text-lg">
                03
              </div>
              <h4 className="font-bold text-tea-dark dark:text-white text-lg">
                {isChinese ? '持續創新' : 'Đổi Mới'}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {isChinese ? '緊跟全球手搖飲趨勢，導入國際頂尖低溫烘焙與色選加工科技。' : 'Không ngừng cập nhật xu hướng đồ uống toàn cầu, ứng dụng công nghệ sao sấy tân tiến.'}
              </p>
            </div>

            <div className="bg-white dark:bg-[#132018] p-6 rounded-3xl border border-tea-border dark:border-white/10 text-center space-y-2 transition-colors">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-tea-mist dark:bg-[#1C2F23] text-tea-emerald dark:text-tea-mint flex items-center justify-center font-bold text-lg">
                04
              </div>
              <h4 className="font-bold text-tea-dark dark:text-white text-lg">
                {isChinese ? '攜手共贏' : 'Đồng Hành'}
              </h4>
              <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                {isChinese ? '提供獨家 R&D 調茶諮詢、標準 SOP 培訓，與合作夥伴並肩壯大。' : 'Tư vấn R&D độc quyền, đào tạo barista và kề vai sát cánh cùng sự lớn mạnh của đối tác.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. HÀNH TRÌNH PHÁT TRIỂN (TIMELINE) */}
      <section className="py-20 bg-white dark:bg-[#0B130E] transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={isChinese ? '時光印記' : 'Dấu Ấn Thời Gian'}
            title={isChinese ? 'CASA 發展歷程里程碑' : 'Hành trình phát triển của CASA'}
            subtitle={isChinese ? '見證我們一步步奠定專業商用茶葉原料領先地位的重要時刻。' : 'Những cột mốc quan trọng khẳng định vị thế thương hiệu nguyên liệu trà hàng đầu.'}
          />

          <div className="relative border-l-2 border-tea-soft dark:border-white/10 ml-4 sm:ml-32 space-y-12">
            {TIMELINE.map((item, idx) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="relative pl-8 sm:pl-10 group"
              >
                {/* Year Marker on Left for Desktop */}
                <div className="hidden sm:block absolute -left-28 top-0 text-xl font-black text-tea-emerald dark:text-tea-mint font-sans">
                  {item.year}
                </div>

                {/* Dot marker */}
                <div className="absolute -left-2.5 top-1.5 w-5 h-5 rounded-full bg-white dark:bg-[#132018] border-4 border-tea-leaf group-hover:border-tea-emerald group-hover:scale-125 transition-all shadow-sm" />

                <div className="bg-[#FAF9F5] dark:bg-[#132018] p-6 rounded-2xl border border-tea-border dark:border-white/10 transition-colors">
                  <span className="sm:hidden text-xs font-black text-tea-emerald dark:text-tea-mint block mb-1">
                    {item.year}
                  </span>
                  <h4 className="text-lg font-bold text-tea-dark dark:text-white mb-1">
                    {(isChinese && item.titleZh) || item.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {(isChinese && item.descZh) || item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. VÙNG TRỒNG NGUYÊN LIỆU ĐẶC BIỆT */}
      <section className="py-20 bg-[#FAF9F5] dark:bg-[#0E1711] border-t border-tea-border/60 dark:border-white/10 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={isChinese ? '特色產區來源' : 'Nguồn Gốc Nông Sản'}
            title={isChinese ? '著名高山茶葉原料產區' : 'Các vùng nguyên liệu danh tiếng'}
            subtitle={isChinese ? '海拔千米以上的純淨土壤與雲霧氣候，培育出富含珍貴花果香氣的高品質茶菁。' : 'Độ cao trên 1.000m cùng khí hậu sương mù nuôi dưỡng những búp chè tươi giàu khoáng chất và hương hoa quý hiếm.'}
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {TEA_REGIONS.map((region, idx) => (
              <div
                key={idx}
                className="bg-white dark:bg-[#132018] rounded-3xl overflow-hidden border border-tea-border dark:border-white/10 shadow-tea-sm flex flex-col justify-between transition-colors"
              >
                <div className="h-48 w-full overflow-hidden">
                  <img
                    src={region.image}
                    alt={(isChinese && region.regionZh) || region.region}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    <h4 className="text-lg font-bold text-tea-dark dark:text-white">
                      {(isChinese && region.regionZh) || region.region}
                    </h4>
                    <p className="text-xs text-tea-emerald dark:text-tea-mint font-semibold mt-1">
                      {isChinese ? '海拔：' : 'Độ cao: '} {(isChinese && region.altitudeZh) || region.altitude}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
                      {(isChinese && region.climateZh) || region.climate}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-white/10 text-xs text-gray-500 dark:text-gray-400">
                    <strong className="text-tea-primary dark:text-tea-mint">
                      {isChinese ? '特色：' : 'Đặc sản:'}
                    </strong>{' '}
                    {(isChinese && region.specialtyZh) || region.specialty}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CTA BOTTOM */}
      <section className="py-20 bg-white dark:bg-[#0B130E] relative transition-colors">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-14 rounded-4xl bg-gradient-to-br from-tea-primary via-tea-emerald to-tea-green text-white text-center shadow-tea-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />

            <div className="relative z-10 max-w-2xl mx-auto space-y-5">
              <span className="inline-block px-3.5 py-1 rounded-full bg-white/15 text-tea-mint text-xs font-bold uppercase tracking-wider">
                {isChinese ? '永續合作・攜手共贏' : 'Hợp Tác Bền Vững & Phát Triển'}
              </span>

              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight">
                {isChinese ? '與您攜手打造具有競爭力的飲品連鎖品牌' : 'Đồng hành cùng phát triển thương hiệu đồ uống của bạn'}
              </h2>

              <p className="text-sm sm:text-base text-gray-200 leading-relaxed font-normal">
                {isChinese
                  ? '讓 CASA TEA 成為您最值得信賴的原料供應後盾，為每一杯飲品的卓越品質奠定根基。'
                  : 'Hãy để CASA TEA trở thành đối tác cung ứng tin cậy và nền móng vững chắc cho chất lượng đồ uống của bạn.'}
              </p>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                <button
                  onClick={() => openSampleModal()}
                  className="px-8 py-4 rounded-2xl bg-white text-tea-primary hover:bg-tea-soft text-sm font-bold shadow-md transition-all hover:scale-105"
                >
                  {isChinese ? '免費登記索取樣品' : 'Đăng ký nhận mẫu thử'}
                </button>
                <Link
                  to="/products"
                  className="px-8 py-4 rounded-2xl bg-tea-dark/40 hover:bg-tea-dark/60 text-white text-sm font-bold border border-white/25 transition-all"
                >
                  {isChinese ? '瀏覽商用產品目錄' : 'Xem danh mục sản phẩm'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

