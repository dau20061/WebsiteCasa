import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Cpu,
  ShieldCheck,
  Award,
  Factory,
  CheckCircle2,
  Filter,
  Sparkles,
  ArrowRight,
  ExternalLink,
  Layers,
  FlaskConical,
  Gauge
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import WaveDivider from '../components/WaveDivider';
import MachineryCard from '../components/MachineryCard';
import CertificationCard from '../components/CertificationCard';
import SEO from '../components/SEO';
import { PRODUCTION_STEPS, QC_PILLARS } from '../constants/categories';
import { CERTIFICATIONS } from '../constants/certifications';
import { useAppUI } from '../layouts/MainLayout';
import { useLanguage } from '../context/LanguageContext';
import { getRtdbMachinery } from '../services/rtdbService';

const MACHINERY_FILTERS = [
  { id: 'all', label: 'Tất cả thiết bị', labelZh: '全部設備' },
  { id: 'Sàng lọc & Tinh tuyển', label: 'Sàng lọc Sortex', labelZh: '光學色選' },
  { id: 'Sao sấy & Diệt men', label: 'Sao sấy nhiệt', labelZh: '熱風殺青烘焙' },
  { id: 'Phối trộn & Chuẩn hóa', label: 'Phối trộn đa chiều', labelZh: '多維均質拼配' },
  { id: 'Đóng gói vô trùng', label: 'Đóng gói vô trùng', labelZh: '無菌惰性氣體包裝' },
  { id: 'Kiểm soát chất lượng QC', label: 'Phòng Lab QC', labelZh: '品管實驗室' },
];

export default function MachineryCertifications() {
  const { t, isChinese } = useLanguage();
  const { openLightbox, openSampleModal } = useAppUI();
  const [selectedFilter, setSelectedFilter] = useState('all');

  const [machineryList, setMachineryList] = useState(() => {
    const saved = localStorage.getItem('casa_admin_machinery');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    getRtdbMachinery().then((res) => {
      if (res && res.length > 0) setMachineryList(res);
    });
  }, []);

  const filteredMachinery = selectedFilter === 'all'
    ? machineryList
    : machineryList.filter((m) => m.category === selectedFilter);

  return (
    <div className="overflow-hidden pb-20">
      <SEO
        title={isChinese ? "生產設備與國際認證 | CASA" : "Máy Móc & Chứng Nhận Chất Lượng"}
        description={isChinese ? "探索現代化生產廠房、原裝進口國際標準茶葉加工設備，以及 CASA 獲得之 ISO 22000、HACCP、FDA 權威認證。" : "Khám phá hệ thống nhà máy sản xuất hiện đại, dây chuyền máy móc nhập khẩu chuẩn quốc tế và chứng nhận ISO 22000, HACCP, FDA của CASA."}
      />

      {/* 1. HERO SECTION */}
      <section className="relative pt-28 pb-16 lg:pt-36 lg:pb-20 bg-gradient-to-b from-[#DFF5E1]/50 via-[#BFE8D0]/20 to-[#FAF9F5] dark:from-[#132B1C]/70 dark:via-[#0F1E14]/40 dark:to-[#0B130E] overflow-hidden transition-colors">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-10 right-10 w-[500px] h-[500px] bg-tea-mint/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-10 w-[400px] h-[400px] bg-tea-leaf/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#132018] text-tea-primary dark:text-tea-mint border border-tea-leaf/30 dark:border-tea-mint/30 text-xs font-bold uppercase tracking-wider shadow-sm"
          >
            <Cpu className="w-3.5 h-3.5 text-tea-leaf" />
            {isChinese ? '工藝技術實力與國際生產規範' : t('mach_hero_badge', 'Năng Lực Công Nghệ & Tiêu Chuẩn Sản Xuất')}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-tea-dark dark:text-white tracking-tight leading-tight max-w-3xl mx-auto"
          >
            {isChinese ? (
              <>先進工藝設備 締造<span className="text-gradient-tea">頂級非凡品質</span></>
            ) : (
              <>Công Nghệ Tạo Nên <span className="text-gradient-tea">Chất Lượng Vượt Trội</span></>
            )}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-base sm:text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            {isChinese
              ? '位於林同省保祿市佔地6,000平方公尺的現代化工廠，全面引進流化床乾燥線、Sortex 光學色選機及符合 ISO 22000 與 HACCP Codex 標準的無菌品管實驗室。'
              : t('mach_hero_desc', 'Hệ thống nhà máy 6.000m² tại Bảo Lộc, Lâm Đồng được trang bị dây chuyền sấy tầng sôi, máy tách màu Sortex và phòng kiểm nghiệm vi sinh đạt chuẩn ISO 22000 & HACCP Codex.')}
          </motion.p>
        </div>
      </section>

      {/* Animated Wavy Transition: Hero -> Machinery Grid */}
      <WaveDivider
        fromBg="bg-[#FAF9F5] dark:bg-[#0B130E]"
        toColor="text-white dark:text-[#0B130E]"
        accentColor="text-tea-mint/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-leaf/20 dark:text-tea-leaf/10"
        flipX={false}
      />

      {/* 2. GALLERY MÁY MÓC & HẠ TẦNG SẢN XUẤT */}
      <section className="py-20 bg-white dark:bg-[#0B130E] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={isChinese ? '工廠先進裝備' : 'Trang Thiết Bị Nhà Máy'}
            title={isChinese ? '新世代頂級制茶機械生產線' : 'Dây chuyền máy móc thế hệ mới'}
            subtitle={isChinese ? '由歐洲、日本及台灣頂尖食品機械製造商同步原裝引進。' : 'Được nhập khẩu đồng bộ từ các đối tác chế tạo thiết bị thực phẩm hàng đầu Châu Âu, Nhật Bản và Đài Loan.'}
          />

          {/* Filter Pills */}
          <div className="flex items-center justify-center gap-2 flex-wrap mb-12">
            {MACHINERY_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedFilter === f.id
                    ? 'bg-tea-primary text-white shadow-tea-sm'
                    : 'bg-white dark:bg-[#132018] text-gray-700 dark:text-gray-300 hover:bg-tea-soft dark:hover:bg-[#1C2F23] border border-tea-border dark:border-white/10'
                }`}
              >
                {isChinese ? f.labelZh : f.label}
              </button>
            ))}
          </div>

          {/* Machinery Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredMachinery.map((item) => (
              <MachineryCard
                key={item.id}
                item={item}
                onSelect={(m) => openLightbox(m)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: Machinery Grid -> 5-Gate QC */}
      <WaveDivider
        fromBg="bg-white dark:bg-[#0B130E]"
        toColor="text-tea-dark dark:text-tea-dark"
        accentColor="text-tea-mint/35 dark:text-tea-mint/25"
        secondaryAccent="text-tea-leaf/30 dark:text-tea-leaf/15"
        flipX={true}
      />

      {/* 3. 5-GATE QUALITY CONTROL SYSTEM */}
      <section className="py-20 bg-tea-dark text-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge={isChinese ? '全面品質保證系統' : 'Hệ Thống Đảm Bảo Chất Lượng'}
            title={isChinese ? '五道品管嚴格把關流程 (5-Gate QC)' : 'Quy trình kiểm soát chất lượng 5 cửa (5-Gate QC)'}
            subtitle={isChinese ? '出廠的每一公斤茶葉在交付客戶前，都必須通過5道嚴格檢驗關卡。' : 'Mọi kg trà xuất xưởng đều phải vượt qua 5 trạm kiểm tra nghiêm ngặt trước khi được bàn giao cho đối tác.'}
            dark={true}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {QC_PILLARS.map((gate, idx) => {
              const gateTitleZh = {
                'GATE 01': '原料入廠源頭品控',
                'GATE 02': '半成品線上即時監控',
                'GATE 03': '盲測杯測評鑑 (Blind Cupping)',
                'GATE 04': '包裝氣密性與封口強度測試',
                'GATE 05': '對照樣品留存與全程溯源'
              }[gate.code] || gate.title;

              const gateDescZh = {
                'GATE 01': '現場農殘快速篩檢，並定期抽樣送檢 Eurofins / Quatest 3 第三方公正實驗室。',
                'GATE 02': 'IoT 智慧傳感器即時監測溫度、水分與烘焙參數，數據無縫同步傳輸至 SCADA 中控主機。',
                'GATE 03': '專業評審團依據茶湯色澤、香氣、滋味醇厚度、回甘、收斂性等5大維度進行嚴格盲測杯測。',
                'GATE 04': '置於負壓真空密封試驗槽進行極限壓力測試，確保長途運輸絕無漏氣滲潮。',
                'GATE 05': '每包茶葉均賦予唯一 QR Code，可追溯採摘茶園、烘焙批次與負責品管工程師，留樣保存24個月。'
              }[gate.code] || gate.desc;

              return (
                <motion.div
                  key={gate.code}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="bg-white/5 hover:bg-white/10 p-6 rounded-3xl border border-white/10 transition-all flex flex-col justify-between"
                >
                  <div>
                    <span className="text-xs font-black tracking-widest text-tea-mint block font-mono mb-2">
                      {gate.code}
                    </span>
                    <h4 className="text-base font-bold text-white mb-2 leading-snug">
                      {isChinese ? gateTitleZh : gate.title}
                    </h4>
                    <p className="text-xs text-gray-300 leading-relaxed">
                      {isChinese ? gateDescZh : gate.desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/10 flex items-center gap-1 text-[11px] text-tea-mint">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{isChinese ? '100% 達標符合' : 'Đạt 100% tiêu chí'}</span>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: 5-Gate QC -> Certifications */}
      <WaveDivider
        fromBg="bg-tea-dark dark:text-tea-dark"
        toColor="text-[#FAF9F5] dark:text-[#0E1711]"
        accentColor="text-tea-leaf/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-mint/25 dark:text-tea-leaf/15"
        flipX={false}
      />

      {/* 4. CHỨNG NHẬN CHẤT LƯỢNG (CERTIFICATIONS SHOWCASE) */}
      <section className="py-20 bg-[#FAF9F5] dark:bg-[#0E1711] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge={isChinese ? '國際權威認證' : 'Chứng Nhận & Kiểm Định'}
            title={isChinese ? '恪守國際頂級品質承諾' : 'Cam kết chất lượng quốc tế'}
            subtitle={isChinese ? '合規透明，隨時為連鎖品牌提供完整檢驗報告與產品自主申報資料。' : 'Minh bạch pháp lý, sẵn sàng cung cấp đầy đủ hồ sơ kiểm định và tự công bố sản phẩm cho các chuỗi mở rộng.'}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {CERTIFICATIONS.map((cert) => (
              <CertificationCard
                key={cert.id}
                cert={cert}
                onSelect={(c) => openLightbox(c)}
              />
            ))}
          </div>

          <div className="mt-16 p-8 rounded-3xl bg-white dark:bg-[#132018] border border-tea-border dark:border-white/10 shadow-tea-sm text-center max-w-2xl mx-auto space-y-4 transition-colors">
            <h4 className="text-xl font-bold text-tea-dark dark:text-white">
              {isChinese ? '下單前需要樣品測試與 COA 檢驗分析單嗎？' : 'Bạn cần kiểm tra mẫu thử và phiếu COA trước khi lên đơn?'}
            </h4>
            <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
              {isChinese
                ? 'CASA 提供 100g – 200g 免費茶葉測試樣品，隨附微生物理化檢驗單及標準 SOP 萃取教學手冊。'
                : 'CASA hỗ trợ gửi mẫu thử 100g – 200g đính kèm phiếu phân tích chỉ tiêu vi sinh và tài liệu hướng dẫn ủ cốt trà chuẩn SOP.'}
            </p>
            <button
              onClick={() => openSampleModal()}
              className="px-8 py-3 rounded-xl bg-tea-primary hover:bg-tea-emerald text-white text-xs font-bold transition-all shadow-tea-sm"
            >
              {isChinese ? '登記索取樣品與 TDS 規格書' : 'Đăng ký nhận mẫu thử & Tài liệu TDS'}
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

