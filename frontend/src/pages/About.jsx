import React, { useState } from 'react';
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
  Calendar,
  Globe,
  Building2,
  Factory,
  Cpu,
  Boxes,
  Package,
  Coffee,
  FlaskConical,
  ExternalLink,
  ZoomIn,
  FileCheck,
  BadgeCheck
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import WaveDivider from '../components/WaveDivider';
import SEO from '../components/SEO';
import { TEA_REGIONS, CORE_VALUES, COMPANY_INFO } from '../constants/company';
import { useAppUI } from '../layouts/MainLayout';
import { useLanguage } from '../context/LanguageContext';
import contactInfographicImg from '../img/contact.jpg';
import isoCertImg from '../img/ISO.avif';
import gmpCertImg from '../img/gmp.avif';
import haccpCertImg from '../img/Haccp.avif';
import halalCertImg from '../img/halal.avif';


export const CASA_CERTIFICATES_DATA = [
  {
    id: 'iso-22000',
    badge: 'ISO 22000:2018',
    badgeZh: 'ISO 22000:2018',
    titleVi: 'Hệ Thống Quản Lý An Toàn Thực Phẩm ISO 22000:2018',
    titleZh: 'ISO 22000:2018 食品安全管理系統認證',
    orgVi: 'Tổ chức Chứng nhận Quốc tế G-CERTI (IAS & IAF)',
    orgZh: 'G-CERTI 國際認證機構 (IAS 認可 / IAF 成員)',
    certNo: 'GKVN-0402-FC',
    validity: '2023.05.08 – 2026.05.07',
    summaryVi: 'Chứng nhận toàn diện quy trình chế biến trà (ô long, trà đen, trà xanh, trà lài), cà phê túi lọc, bột kem béo không sữa, matcha nguyên chất, bột pudding, bột sương sáo, khoai môn và socola 3in1 đóng gói màng bạc vô trùng.',
    summaryZh: '全面涵蓋原葉茶（烏龍茶、紅茶、綠茶、茉莉綠茶）、濾掛咖啡、植脂末、純抹茶、布丁粉、仙草凍粉及 3合1 特調粉之充氮無菌加工與包裝體系。',
    image: isoCertImg,
    tag: 'Tiêu Chuẩn Quốc Tế ISO'
  },
  {
    id: 'gmp',
    badge: 'GMP Certified',
    badgeZh: 'GMP 良好生產規範',
    titleVi: 'Thực Hành Sản Xuất Tốt (GMP)',
    titleZh: 'GMP 良好生產規範認證 (Good Manufacturing Practice)',
    orgVi: 'Tổ chức G-CERTI System Service',
    orgZh: 'G-CERTI 國際製造品質認證服務機構',
    certNo: 'GKVN-0402-GMP',
    validity: '2023.05.08 – 2026.05.07',
    summaryVi: 'Kiểm soát khắt khe tiêu chuẩn vệ sinh xưởng, dây chuyền máy móc cơ điện khép kín, môi trường phòng sạch và quy tắc vận hành của nhân sự kỹ thuật sản xuất thực phẩm & đồ uống.',
    summaryZh: '嚴格規範生產潔淨廠房車間環境、全自動化設備管路衛生、人員作業防護及預防交叉污染之標準作業程序 (SOP)。',
    image: gmpCertImg,
    tag: 'Thực Hành Sản Xuất Tốt'
  },
  {
    id: 'haccp',
    badge: 'HACCP System',
    badgeZh: 'HACCP 食品安全體系',
    titleVi: 'Hệ Thống Quản Lý An Toàn Thực Phẩm HACCP',
    titleZh: 'HACCP 危害分析與關鍵控制點系統認證',
    orgVi: 'Tổ chức Chứng nhận An toàn Thực phẩm G-CERTI',
    orgZh: 'G-CERTI 食品安全驗證管理機構',
    certNo: 'GKVN-0402-HC',
    validity: '2023.05.08 – 2026.05.07',
    summaryVi: 'Phân tích mối nguy và kiểm soát 5 điểm tới hạn (CCP) từ khâu tiếp nhận búp chè nguyên liệu tại nông trường, sao sấy diệt men nhiệt độ cao, đóng gói chân không đến xuất kho.',
    summaryZh: '全面建立茶葉從高山契作採摘、高溫殺青乾燥、均質拼配至包裝入庫全流程之關鍵控制點 (CCP) 監控與風險防範。',
    image: haccpCertImg,
    tag: 'Kiểm Soát Mối Nguy Tới Hạn'
  },
  {
    id: 'halal',
    badge: 'HALAL Certified',
    badgeZh: 'HALAL 國際清真認證',
    titleVi: 'Chứng Nhận Chuẩn Hồi Giáo Quốc Tế Halal (JAKIM Scheme)',
    titleZh: 'HALAL 國際清真認證 (馬來西亞 JAKIM 體系)',
    orgVi: 'Halal Certification Agency Vietnam (HCA) / JAKIM',
    orgZh: '越南清真認證局 HCA (符合馬來西亞 JAKIM 規範)',
    certNo: 'HCA 975/JAKIM',
    validity: '2024.06.14 – 2025.06.13',
    summaryVi: 'Chứng nhận hợp chuẩn Luật Hồi giáo MS 1500:2019 cho 3 nhóm chủ lực: Trà (Tea), Cà phê (Coffee), Bột pha chế (Powder), đủ điều kiện xuất khẩu và phục vụ chuỗi quốc tế.',
    summaryZh: '依據伊斯蘭教法及馬來西亞 MS 1500:2019 清真標準，合格認證原葉茶、咖啡與調配粉三大核心品類，暢行全球清真穆斯林市場。',
    image: halalCertImg,
    tag: 'Tiêu Chuẩn Xuất Khẩu Toàn Cầu'
  }
];

const SERVICES_8 = [
  {
    icon: Cpu,
    titleVi: 'Máy Pha Trà Viên Nang Thông Minh',
    titleZh: '智能膠囊茶機',
    en: 'Smart Tea Capsule Machine',
    descVi: 'Hệ thống thiết bị pha chế tự động bằng viên nén thông minh, chuẩn hóa nhiệt độ và thời gian chiết xuất chính xác tại quầy bar.',
    descZh: '專業智能吧台萃茶設備，精準控制水溫、壓力與萃茶秒數，完美還原鮮泡原葉精華。',
  },
  {
    icon: Boxes,
    titleVi: 'Gia Công Trà Viên Nang (Capsule OEM)',
    titleZh: '茶膠囊代工 / 品牌合作',
    en: 'Tea Capsule OEM / Brand Partnerships',
    descVi: 'Sản xuất viên nén trà mộc và thảo mộc theo thương hiệu riêng, công nghệ đóng gói kín khí giữ trọn hương vị tươi mới dài lâu.',
    descZh: '提供茶葉專利膠囊配方調配、充氮保鮮與品牌客製化膠囊代工生產一條龍服務。',
  },
  {
    icon: Package,
    titleVi: 'Gia Công & Đóng Gói Thương Hiệu (OEM)',
    titleZh: '品牌代工包裝',
    en: 'Brand OEM Packaging',
    descVi: 'Giải pháp gia công bao bì trọn gói: túi zipper, hộp quà tặng, lon thiếc cao cấp và đóng gói công nghiệp xuất khẩu.',
    descZh: '涵蓋真空包裝、食品級夾鏈立袋、精美禮品鐵罐等各式包裝型態，全方位賦能品牌價值。',
  },
  {
    icon: Award,
    titleVi: 'Trà Túi Lọc Khách Sạn & Resort (Amenities)',
    titleZh: '飯店備品茶包',
    en: 'Hotel Tea Bag Amenities',
    descVi: 'Chuyên cung cấp dòng trà túi lọc vuông và túi tam giác pyramid cao cấp cho hệ thống khách sạn 4-5 sao, nhà hàng và resort.',
    descZh: '專為五星級飯店、連鎖餐飲及航空商務艙客製單包裝原葉茶包與迎賓禮賓茶點。',
  },
  {
    icon: Factory,
    titleVi: 'Sản Xuất & Nghiền Bột Pha Chế',
    titleZh: '粉類產品代工製造',
    en: 'Powder Product Manufacturing',
    descVi: 'Dây chuyền phối trộn và xay nghiền bột siêu mịn: bột trà xanh matcha, bột frappe, bột sữa thực vật, bột béo và bột cacao.',
    descZh: '引進低溫超微粉體研磨與全自動均質混拌產線，研發抹茶粉、特調調味粉與植脂末。',
  },
  {
    icon: Coffee,
    titleVi: 'Gia Công & Đóng Gói Cà Phê (Coffee OEM)',
    titleZh: '咖啡產品代工製造',
    en: 'Coffee OEM Manufacturing',
    descVi: 'Xử lý rang xay mộc hạt Robusta, Arabica cao nguyên, sản xuất cà phê túi lọc drip bag và cà phê hòa tan chuẩn vị.',
    descZh: '專業莊園級咖啡豆烘焙、研磨及濾掛式掛耳咖啡包、即溶咖啡三合一配方代工生產。',
  },
  {
    icon: FlaskConical,
    titleVi: 'Phát Triển Hương Vị & Nguyên Liệu Trà',
    titleZh: '茶飲原料供應 / 風味開發',
    en: 'Tea Ingredient Supply / Flavor Development',
    descVi: 'R&D công thức độc quyền cho các chuỗi đồ uống, tối ưu hóa độ đậm cốt trà TDS > 2.8% và cập nhật xu hướng F&B hiện đại.',
    descZh: '針對大型手搖飲品牌提供專屬茶湯配方研發、風味疊加調校與標準化吧台 SOP。',
  },
  {
    icon: Globe,
    titleVi: 'Xuất Khẩu Quốc Tế & Kiểm Nghiệm Thực Phẩm',
    titleZh: '國際出口業務 / 食安檢驗',
    en: 'International Export Business & Inspection',
    descVi: 'Dịch vụ xuất khẩu thương mại trọn gói, cung cấp COA, kiểm định SGS không dư lượng thuốc BVTV, chuẩn ISO 22000 & HACCP.',
    descZh: '具備完備跨國進出口資質，通過 SGS 嚴格無農殘多重檢驗，提供產地證明與報關文件。',
  },
];

const PRODUCTION_BASES = [
  {
    id: 'taiwan',
    countryVi: 'Đài Loan',
    countryZh: '台灣 (Taiwan)',
    count: '11 Cơ Sở',
    flag: '🇹🇼',
    descVi: 'Cái nôi công nghệ trà tự động hóa, viện công nghệ sinh học và trung tâm điều hành tập đoàn.',
    descZh: '全自動化製茶科技搖籃、生物科技研發中心與企業全球營運總部。',
    bases: [
      { id: 1, nameVi: 'Trung tâm điều hành doanh nghiệp Long Đàm', nameZh: '龍潭營運中心', en: 'Longtan Corporate Headquarters' },
      { id: 2, nameVi: 'Nhà máy chế biến trà tự động hóa Long Đàm', nameZh: '桔揚自動化製茶廠', en: 'Longtan Automated Tea Factory' },
      { id: 3, nameVi: 'Nhà máy đóng gói trà Đại Khê', nameZh: '桔揚大溪包裝廠', en: 'Daxi Tea Packing Factory' },
      { id: 4, nameVi: 'Hợp tác xã sản xuất trà thành phố Đào Viên', nameZh: '桃園市茶葉生產合作社', en: 'Taoyuan Tea Industry Cooperative Society' },
      { id: 5, nameVi: 'Bảo tàng văn hóa trà Khách Gia Đài Loan', nameZh: '臺灣客家茶文化館', en: 'Taoyuan Hakka Tea Culture Museum' },
      { id: 6, nameVi: 'Nông trang thảo mộc Tú Viên Long Đàm', nameZh: '龍潭秀園農場', en: 'Longtan Show Yuan Herb Farm' },
      { id: 7, nameVi: 'Trung tâm hoạch định & trải nghiệm ẩm thực Vĩnh Ninh', nameZh: '永寧餐飲策畫體驗中心', en: 'Catering Planning and Experience Center' },
      { id: 8, nameVi: 'Nhà máy nguyên liệu thực phẩm Melisun Thổ Thành', nameZh: '土城美力香食品廠', en: 'Tucheng Melisun Food Raw Material Factory' },
      { id: 9, nameVi: 'Nhà máy công nghệ sinh học Vĩnh Ninh', nameZh: '永寧生技廠', en: 'Young Ning Bio-Tech Factory' },
      { id: 10, nameVi: 'Công ty TNHH Nông nghiệp GEELY Nam Đầu', nameZh: '南投大吉農業', en: 'Nantou GEELY TEA Co., Ltd.' },
      { id: 11, nameVi: 'Nhà máy chế biến trà Cao Đỉnh Nam Đầu', nameZh: '南投高頂廠', en: 'Nantou Gao Ding Tea Factory' },
    ],
  },
  {
    id: 'vietnam',
    countryVi: 'Việt Nam',
    countryZh: '越南 (Vietnam)',
    count: '5 Cơ Sở',
    flag: '🇻🇳',
    descVi: 'Mạng lưới nhà máy và nông trường phủ khắp miền Bắc, miền Nam cung ứng sỉ hỏa tốc cho chuỗi F&B toàn quốc.',
    descZh: '布局北越與南越之現代化工廠與高山農場，為全國手搖飲通路提供即時批發配送。',
    bases: [
      { id: 13, nameVi: 'Nhà máy Casa Hà Nội', nameZh: '越南河內廠', en: 'Vietnam Ha Noi Casa LLC.' },
      { id: 14, nameVi: 'Nhà máy Casa Hưng Yên', nameZh: '越南興安廠', en: 'Vietnam Hung Yen Casa LLC.' },
      { id: 15, nameVi: 'Nông trường thảo mộc Tú Viên Đồng Nai', nameZh: '越南同奈秀園農場', en: 'Vietnam Dong Nai Tu Vien Herb Farm' },
      { id: 16, nameVi: 'Nhà máy Casa KCN Sóng Thần 1 (Bình Dương / TP.HCM)', nameZh: '越南平陽廠', en: 'Vietnam HCMC Song Than 1 Industrial Park Casa LLC.' },
      { id: 17, nameVi: 'Nhà máy thực phẩm Melisun KCN Lợi Bình Nhơn (Long An)', nameZh: '越南隆安食品廠', en: 'Vietnam Tay Ninh Loi Binh Nhon Industrial Park Melisun Co., LTD.' },
    ],
  },
  {
    id: 'china',
    countryVi: 'Trung Quốc',
    countryZh: '中國 (China)',
    count: '4 Cơ Sở',
    flag: '🇨🇳',
    descVi: 'Hệ thống nhà máy chế biến chuyên sâu tại các tỉnh trọng điểm trồng chè và trung tâm thương mại Thượng Hải.',
    descZh: '深耕各茶葉核心原產地省份，並於上海設立對外貿易與跨國採購調配樞紐。',
    bases: [
      { id: 12, nameVi: 'Nhà máy trà huyện Hoành, Quảng Tây', nameZh: '廣西橫縣茶廠', en: 'China Guangxi Heng County Factory' },
      { id: 18, nameVi: 'Công ty TNHH Thực phẩm Quảng Đức Thành Tứ Xuyên', nameZh: '四川廣德成食品有限公司', en: 'Sichuan Province Guang De Cheng Co., Ltd' },
      { id: 19, nameVi: 'Nhà máy chế biến thực phẩm Giang Tây', nameZh: '江西食品廠', en: 'Jiangxi Province Jiangxi Factory' },
      { id: 20, nameVi: 'Công ty Thương mại Vĩnh Trấn Thượng Hải', nameZh: '上海永鎮貿易公司', en: 'Shanghai Everjen Co., Ltd' },
    ],
  },
  {
    id: 'japan',
    countryVi: 'Nhật Bản',
    countryZh: '日本 (Japan)',
    count: '1 Cơ Sở',
    flag: '🇯🇵',
    descVi: 'Trụ sở công nghệ tại Shizuoka – trung tâm hợp tác công nghệ bột matcha và trà xanh danh tiếng.',
    descZh: '坐落於日本綠茶重鎮靜岡，專注於頂級抹茶加工工藝與日式原茶研發合作。',
    bases: [
      { id: 21, nameVi: 'Công ty Good Young Shizuoka Nhật Bản', nameZh: '日本靜岡桔揚公司', en: 'Good Young Japan (Shizuoka)' },
    ],
  },
];

export default function About() {
  const { openSampleModal, openLightbox } = useAppUI();
  const { t, isChinese } = useLanguage();
  const [selectedRegion, setSelectedRegion] = useState('all');

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
              className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed font-normal"
            >
              {t('about_hero_desc', 'Khởi nguồn từ tình yêu với những đồi chè đại ngàn cao nguyên Việt Nam, CASA mang sứ mệnh chuẩn hóa hương vị, nâng tầm giá trị nông sản và đồng hành cùng sự phát triển bền vững của ngành F&B hiện đại.')}
            </motion.p>
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: Hero -> Storytelling */}
      <WaveDivider
        fromBg="bg-[#FAF9F5] dark:bg-[#0B130E]"
        toColor="text-white dark:text-[#0B130E]"
        accentColor="text-tea-mint/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-leaf/20 dark:text-tea-leaf/10"
        flipX={false}
      />

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

              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                {isChinese
                  ? '14 年前，我們注意到許多手搖茶飲與餐飲店主面臨著棘手難題：市面上的商業茶葉原料品質參差不齊、前後批次風味極不穩定，甚至過度使用刺鼻的人工化學香精。'
                  : 'Hơn 14 năm trước, chúng tôi nhận thấy các chủ quán trà sữa và đồ uống tại Việt Nam gặp phải một vấn đề nan giải: trà nguyên liệu trôi nổi trên thị trường thường không ổn định về chất lượng, lô trước đậm vị thì lô sau nhạt nhòa, hoặc sử dụng hương liệu tổng hợp gắt nồng khó chịu.'}
              </p>

              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                {isChinese
                  ? '這正是 CASA TEA 創立的初心。我們從直接與保祿（Bảo Lộc）及木州（Mộc Châu）高山茶農契作著手，建立半有機友善耕作標準，嚴格杜絕化學農藥，並打造符合 ISO 22000 與 HACCP Codex 國際規範的全封閉現代化製茶廠。'
                  : 'Đó là lý do CASA TEA ra đời. Chúng tôi bắt đầu bằng việc liên kết trực tiếp với các hộ nông dân tại vùng cao nguyên Bảo Lộc và Mộc Châu, thiết lập quy chuẩn canh tác bán hữu cơ, loại bỏ thuốc trừ sâu hóa học và xây dựng nhà máy chế biến khép kín chuẩn ISO 22000 & HACCP Codex.'}
              </p>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#132018] border border-tea-border dark:border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-tea-primary dark:text-tea-mint block font-sans">100%</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold mt-1 block">
                    {isChinese ? '每批次嚴格農殘檢驗' : 'Kiểm tra dư lượng từng lô'}
                  </span>
                </div>
                <div className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#132018] border border-tea-border dark:border-white/10">
                  <span className="text-2xl sm:text-3xl font-black text-tea-primary dark:text-tea-mint block font-sans">
                    {isChinese ? '24 個月' : '24 Tháng'}
                  </span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-semibold mt-1 block">
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

      {/* Animated Wavy Transition: Storytelling -> Global Bases */}
      <WaveDivider
        fromBg="bg-white dark:bg-[#0B130E]"
        toColor="text-[#FAF9F5] dark:text-[#0B130E]"
        accentColor="text-tea-leaf/25 dark:text-tea-mint/20"
        secondaryAccent="text-tea-mint/20 dark:text-tea-leaf/10"
        flipX={true}
      />

      {/* 2.5 QUY MÔ TOÀN CẦU & HỆ SINH THÁI DỊCH VỤ TOÀN DIỆN (INFOGRAPHIC & ARTICLE) */}
      <section className="py-24 bg-gradient-to-b from-[#FAF9F5] via-[#EBF8EE]/40 to-white dark:from-[#0B130E] dark:via-[#102317]/50 dark:to-[#0B130E] transition-colors relative overflow-hidden">
        {/* Background glow auras */}
        <div className="absolute top-20 right-10 w-[600px] h-[600px] bg-tea-mint/10 dark:bg-tea-mint/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-[500px] h-[500px] bg-tea-leaf/10 dark:bg-tea-leaf/5 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge={isChinese ? '全球布局與製造能量' : 'Năng Lực Sản Xuất & Quy Mô Quốc Tế'}
            title={isChinese ? '21 大跨國生產基地與一站式全方位服務' : 'Hệ Thống 21 Cơ Sở Toàn Cầu & Giải Pháp F&B Trọn Gói'}
            subtitle={isChinese ? '整合智慧茶飲機研發、自動化深加工產線、草本農場及生物科技，為全球餐飲品牌提供全產業鏈後盾。' : 'Tích hợp R&D máy pha trà thông minh, dây chuyền chế biến tự động hóa, nông trường thảo mộc và mạng lưới nhà máy chuẩn quốc tế.'}
          />

          {/* MAIN ARTICLE & INFOGRAPHIC SHOWCASE */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center mb-16">
            {/* Left Column: Corporate Editorial Article */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-[#132018] text-tea-primary dark:text-tea-mint border border-tea-leaf/30 dark:border-tea-mint/30 text-xs font-bold uppercase tracking-wider shadow-sm">
                <Globe className="w-4 h-4 text-tea-leaf" />
                <span>{isChinese ? '全產業鏈跨國閉環體系' : 'Chuỗi Giá Trị Khép Kín Đa Quốc Gia'}</span>
              </div>

              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-tea-dark dark:text-white tracking-tight leading-snug">
                {isChinese
                  ? '立足源頭，鏈接全球：為連鎖品牌打造堅固的供應鏈護城河'
                  : 'Từ Vùng Trồng Đến Ly Đồ Uống: Nền Tảng Cung Ứng Bền Vững Cho Chuỗi F&B'}
              </h3>

              <div className="space-y-4 text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                <p>
                  {isChinese
                    ? 'CASA 不僅僅是一家原料供應商，更是跨越台灣、越南、中國及日本的綜合性茶飲原料深加工與智慧設備製造集團。我們在全球擁有 21 座現代化生產基地、草本農場與生物科技體驗中心，構建起從品種選育、半有機友善耕作、自動化製茶、微粉研磨到跨國合規出口的全產業鏈閉環。'
                    : 'CASA không đơn thuần là đơn vị cung ứng nguyên liệu rời, mà là tập đoàn sản xuất và giải pháp F&B tích hợp đa quốc gia. Với hệ thống 21 cơ sở sản xuất, nông trường thảo mộc và viện công nghệ sinh học trải rộng khắp Đài Loan, Việt Nam, Trung Quốc và Nhật Bản, chúng tôi kiểm soát 100% chuỗi cung ứng từ chọn giống, canh tác sạch, chế biến sâu đến kho vận và xuất khẩu.'}
                </p>

                <p>
                  {isChinese
                    ? '憑藉強大的 OEM / ODM 代工能量，我們提供一站式全方位解決方案：從客製化品牌包裝設計、原料拼配、智能膠囊茶機研發、茶膠囊充氮封裝、飯店專用立體茶包，到粉體微粉研磨、咖啡烘焙代工與 SGS 國際食安檢驗，一應俱全。這讓各大連鎖茶飲與餐飲集團能夠以最具競爭力的成本，擁有品質終年如一的特色專屬原料。'
                    : 'Chúng tôi cung cấp giải pháp toàn diện, trọn gói bao gồm: gia công và đóng gói thương hiệu (OEM), tùy chỉnh nguyên liệu trà mộc và trà túi lọc, máy pha trà viên nang thông minh (Smart Tea Capsule Machine), sản xuất gia công trà viên nang, dây chuyền phối trộn và xay nghiền bột pha chế, nhà máy gia công đóng gói cà phê, trà túi lọc amenities cho hệ thống khách sạn và hỗ trợ kiểm nghiệm an toàn thực phẩm xuất khẩu.'}
                </p>
              </div>

              {/* 4 Key Stat Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="p-4 rounded-2xl bg-white dark:bg-[#132018] border border-tea-leaf/20 dark:border-white/10 shadow-sm text-center">
                  <span className="text-2xl sm:text-3xl font-black text-tea-primary dark:text-tea-mint block">21</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-bold mt-1 block">
                    {isChinese ? '跨國生產基地' : 'Cơ Sở Sản Xuất'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#132018] border border-tea-leaf/20 dark:border-white/10 shadow-sm text-center">
                  <span className="text-2xl sm:text-3xl font-black text-tea-primary dark:text-tea-mint block">04</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-bold mt-1 block">
                    {isChinese ? '國家與地區' : 'Quốc Gia & Vùng'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#132018] border border-tea-leaf/20 dark:border-white/10 shadow-sm text-center">
                  <span className="text-2xl sm:text-3xl font-black text-tea-primary dark:text-tea-mint block">08</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-bold mt-1 block">
                    {isChinese ? '核心服務項目' : 'Dịch Vụ Trọn Gói'}
                  </span>
                </div>

                <div className="p-4 rounded-2xl bg-white dark:bg-[#132018] border border-tea-leaf/20 dark:border-white/10 shadow-sm text-center">
                  <span className="text-2xl sm:text-3xl font-black text-tea-primary dark:text-tea-mint block">100%</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300 font-bold mt-1 block">
                    {isChinese ? '國際食安檢驗' : 'Kiểm Định An Toàn'}
                  </span>
                </div>
              </div>
            </div>

            {/* Right Column: Infographic Image Showcase */}
            <div className="lg:col-span-6">
              <div className="relative mx-auto">
                {/* Backlight Aura */}
                <div className="absolute -inset-4 bg-gradient-to-tr from-tea-mint/30 via-tea-leaf/25 to-amber-500/20 rounded-[2.5rem] blur-2xl opacity-75 pointer-events-none" />

                {/* Glass Card Housing */}
                <div
                  onClick={() => openLightbox({ title: isChinese ? 'CASA 全球 21 大生產基地與服務項目全圖' : 'Hệ Thống 21 Cơ Sở Sản Xuất & Dịch Vụ Toàn Cầu CASA', image: contactInfographicImg })}
                  className="relative p-2.5 sm:p-3.5 rounded-[2rem] sm:rounded-[2.5rem] bg-white/85 dark:bg-white/10 border-2 border-white/80 dark:border-white/20 shadow-2xl backdrop-blur-xl group cursor-pointer transition-all duration-500 hover:shadow-tea-glow"
                  title={isChinese ? "點擊全螢幕放大檢視" : "Bấm để xem ảnh phóng to toàn màn hình"}
                >
                  <div className="relative rounded-[1.6rem] sm:rounded-[2rem] overflow-hidden bg-[#0A1A12] shadow-inner">
                    <img
                      src={contactInfographicImg}
                      alt={isChinese ? "CASA 21 Production Bases & Service" : "CASA 21 Cơ Sở Sản Xuất & Dịch Vụ Toàn Cầu"}
                      className="w-full h-auto object-cover transform scale-100 group-hover:scale-[1.02] transition-transform duration-700 ease-out"
                    />

                    {/* Shimmer light sweep */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none" />

                    {/* Hover expand button */}
                    <div className="absolute bottom-3 right-3 z-10 px-3.5 py-1.5 rounded-xl bg-black/65 hover:bg-black/85 backdrop-blur-md text-white text-xs sm:text-sm font-semibold flex items-center gap-1.5 transition-all shadow-lg border border-white/20">
                      <ExternalLink className="w-3.5 h-3.5 text-tea-mint" />
                      <span>{isChinese ? '放大檢視全圖' : 'Bấm xem ảnh lớn'}</span>
                    </div>

                    {/* Corner Badge */}
                    <div className="absolute top-3 left-3 z-10 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/20 text-white flex items-center gap-2 text-xs font-bold shadow-md">
                      <span className="flex h-2 w-2 rounded-full bg-tea-mint animate-ping" />
                      <span>{isChinese ? '21 大全球生產基地' : '21 Cơ Sở Toàn Cầu'}</span>
                    </div>
                  </div>
                </div>

                <p className="text-center text-xs text-gray-600 dark:text-gray-400 mt-3 font-medium">
                  {isChinese ? '▲ 點擊圖片可全螢幕高清縮放檢視 21 大工廠與服務地圖' : '▲ Nhấp vào hình để phóng to xem chi tiết bản đồ và 21 nhà máy'}
                </p>
              </div>
            </div>
          </div>

          {/* 8 CORE SERVICES BREAKDOWN */}
          <div className="mb-20">
            <div className="text-center max-w-3xl mx-auto mb-10 space-y-3">
              <span className="inline-block px-3.5 py-1 rounded-full bg-tea-soft dark:bg-[#132018] text-tea-primary dark:text-tea-mint text-xs font-bold uppercase tracking-wider">
                {isChinese ? '全方位服務項目' : 'Dịch Vụ & Năng Lực Cung Ứng'}
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-tea-dark dark:text-white tracking-tight">
                {isChinese ? '一站式 OEM / ODM 全方位解決方案' : '8 Giải Pháp Dịch Vụ Sản Xuất & Chế Biến Toàn Diện'}
              </h3>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 font-normal">
                {isChinese
                  ? '從品牌代工、茶飲研發到跨國檢驗，為您的飲品品牌提供無縫銜接的一條龍支持。'
                  : 'Đáp ứng mọi yêu cầu khắt khe từ đóng gói thương hiệu riêng, máy pha trà thông minh đến xuất khẩu quốc tế.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {SERVICES_8.map((srv, idx) => {
                const IconComponent = srv.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.05 }}
                    className="p-6 rounded-3xl bg-white dark:bg-[#132018] border border-tea-border/80 dark:border-white/10 shadow-tea-sm hover:shadow-tea-md transition-all hover:-translate-y-1 flex flex-col justify-between group"
                  >
                    <div>
                      <div className="w-12 h-12 rounded-2xl bg-tea-soft dark:bg-tea-green/20 flex items-center justify-center text-tea-primary dark:text-tea-mint mb-4 group-hover:scale-110 transition-transform shadow-sm">
                        <IconComponent className="w-6 h-6" />
                      </div>
                      <span className="text-[11px] font-mono font-bold text-tea-leaf dark:text-tea-mint block uppercase tracking-wider mb-1">
                        {srv.en}
                      </span>
                      <h4 className="text-base sm:text-lg font-bold text-tea-dark dark:text-white mb-2 leading-snug">
                        {isChinese ? srv.titleZh : srv.titleVi}
                      </h4>
                      <p className="text-xs sm:text-sm text-gray-800 dark:text-gray-200 leading-relaxed font-normal">
                        {isChinese ? srv.descZh : srv.descVi}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* 21 GLOBAL PRODUCTION BASES DIRECTORY */}
          <div className="rounded-4xl p-6 sm:p-10 bg-white/90 dark:bg-[#132018]/90 border border-tea-border dark:border-white/10 shadow-tea-md backdrop-blur-md">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-8 border-b border-tea-border/60 dark:border-white/10">
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-tea-leaf dark:text-tea-mint">
                  <Building2 className="w-4 h-4" />
                  {isChinese ? '全球布局明細' : 'Danh Sách Cơ Sở Toàn Cầu'}
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-tea-dark dark:text-white mt-1">
                  {isChinese ? '21 大生產研發與運營基地' : 'Chi Tiết 21 Cơ Sở Sản Xuất & Nông Trường'}
                </h3>
              </div>

              {/* Region Selector Tabs */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedRegion('all')}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedRegion === 'all'
                      ? 'bg-tea-primary text-white shadow-tea-sm'
                      : 'bg-tea-mist dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-tea-soft'
                  }`}
                >
                  {isChinese ? '全部 (21)' : 'Tất cả (21)'}
                </button>
                {PRODUCTION_BASES.map((reg) => (
                  <button
                    key={reg.id}
                    onClick={() => setSelectedRegion(reg.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectedRegion === reg.id
                        ? 'bg-tea-primary text-white shadow-tea-sm'
                        : 'bg-tea-mist dark:bg-white/5 text-gray-700 dark:text-gray-300 hover:bg-tea-soft'
                    }`}
                  >
                    <span>{reg.flag}</span>
                    <span>{isChinese ? reg.countryZh : reg.countryVi}</span>
                    <span className="text-[10px] opacity-75">({reg.bases.length})</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Bases Grid per Country */}
            <div className="pt-8 space-y-8">
              {PRODUCTION_BASES.filter(
                (reg) => selectedRegion === 'all' || selectedRegion === reg.id
              ).map((reg) => (
                <div key={reg.id} className="space-y-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{reg.flag}</span>
                    <div>
                      <h4 className="text-lg font-extrabold text-tea-dark dark:text-white flex items-center gap-2">
                        <span>{isChinese ? reg.countryZh : reg.countryVi}</span>
                        <span className="px-2.5 py-0.5 rounded-full bg-tea-soft dark:bg-[#1C2F23] text-tea-primary dark:text-tea-mint text-xs font-bold">
                          {reg.count}
                        </span>
                      </h4>
                      <p className="text-xs text-gray-700 dark:text-gray-300 font-medium">
                        {isChinese ? reg.descZh : reg.descVi}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
                    {reg.bases.map((base) => (
                      <div
                        key={base.id}
                        className="p-4 rounded-2xl bg-[#FAF9F5] dark:bg-[#0E1711] border border-tea-border/70 dark:border-white/5 hover:border-tea-leaf/40 transition-all flex items-start gap-3.5 group"
                      >
                        <div className="w-8 h-8 rounded-xl bg-tea-primary text-white dark:bg-tea-mint dark:text-tea-dark font-black text-xs flex items-center justify-center shrink-0 shadow-sm">
                          {base.id}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h5 className="text-sm font-bold text-tea-dark dark:text-white group-hover:text-tea-primary dark:group-hover:text-tea-mint transition-colors truncate">
                            {isChinese ? base.nameZh : base.nameVi}
                          </h5>
                          <p className="text-[11px] text-gray-600 dark:text-gray-300 truncate mt-0.5 font-medium">
                            {base.en}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: Global Bases -> Vision & Values */}
      <WaveDivider
        fromBg="bg-white dark:bg-[#0B130E]"
        toColor="text-[#FAF9F5] dark:text-[#0E1711]"
        accentColor="text-tea-mint/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-leaf/20 dark:text-tea-leaf/10"
        flipX={false}
      />

      {/* 3. TẦM NHÌN, SỨ MỆNH & GIÁ TRỊ CỐT LÕI */}
      <section className="py-20 bg-[#FAF9F5] dark:bg-[#0E1711] transition-colors">
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
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
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
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
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
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
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
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
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
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
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
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed font-normal">
                {isChinese ? '提供獨家 R&D 調茶諮詢、標準 SOP 培訓，與合作夥伴並肩壯大。' : 'Tư vấn R&D độc quyền, đào tạo barista và kề vai sát cánh cùng sự lớn mạnh của đối tác.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: Vision & Values -> Certificates */}
      <WaveDivider
        fromBg="bg-[#FAF9F5] dark:bg-[#0E1711]"
        toColor="text-white dark:text-[#0B130E]"
        accentColor="text-tea-leaf/25 dark:text-tea-mint/20"
        secondaryAccent="text-tea-mint/20 dark:text-tea-leaf/10"
        flipX={true}
      />

      {/* 4. CHỨNG NHẬN CHẤT LƯỢNG QUỐC TẾ (CERTIFICATES) */}
      <section className="py-20 bg-white dark:bg-[#0B130E] transition-colors relative overflow-hidden">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-1/4 -left-40 w-96 h-96 bg-tea-mint/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 -right-40 w-96 h-96 bg-tea-leaf/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <SectionHeading
            badge={isChinese ? '國際權威認證・品質背書' : 'Hồ Sơ Chứng Nhận Quốc Tế'}
            title={isChinese ? 'CASA 國際合規管理體系認證' : 'Hệ Thống Chứng Nhận Chất Lượng Quốc Tế Của CASA'}
            subtitle={isChinese ? 'CASA 嚴格遵循國際最高標準，全廠線榮獲 ISO 22000、GMP、HACCP 及 HALAL 權威認證，為每批茶品原料提供堅不可摧的合規品質背書。' : 'Minh chứng pháp lý vững chắc với đầy đủ chứng nhận ISO 22000, GMP, HACCP và HALAL, bảo chứng cho sự an toàn và chất lượng thượng hạng của từng mẻ nguyên liệu trà xuất xưởng.'}
          />

          {/* 4 Certificate Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {CASA_CERTIFICATES_DATA.map((cert, idx) => (
              <motion.div
                key={cert.id}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="group relative flex flex-col bg-[#FAF9F5] dark:bg-[#132018] rounded-3xl border border-tea-border dark:border-white/10 hover:border-tea-mint/60 shadow-tea-sm hover:shadow-2xl transition-all duration-500 overflow-hidden"
              >
                {/* Certificate Document Thumbnail Preview */}
                <div
                  onClick={() => openLightbox({
                    title: isChinese ? cert.titleZh : cert.titleVi,
                    image: cert.image
                  })}
                  className="relative h-72 sm:h-80 w-full overflow-hidden bg-gray-950/80 cursor-pointer group/img"
                  title={isChinese ? "點擊全螢幕放大檢視原件" : "Bấm để phóng to chứng nhận gốc"}
                >
                  <img
                    src={cert.image}
                    alt={isChinese ? cert.titleZh : cert.titleVi}
                    className="w-full h-full object-contain p-2 sm:p-3 filter drop-shadow-md group-hover/img:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Glass Gradient Hover Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent opacity-0 group-hover/img:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-end pb-5 px-3">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-tea-emerald text-white text-xs font-bold shadow-xl backdrop-blur-md transform translate-y-2 group-hover/img:translate-y-0 transition-transform duration-300">
                      <ZoomIn className="w-3.5 h-3.5" />
                      {isChinese ? '放大檢視原件' : 'Phóng to bản gốc'}
                    </span>
                  </div>

                  {/* Standard Badge */}
                  <div className="absolute top-3 left-3 z-10">
                    <span className="px-3 py-1 rounded-full bg-black/75 backdrop-blur-md border border-white/20 text-tea-mint text-[11px] font-bold tracking-wide shadow-md">
                      {isChinese ? cert.badgeZh : cert.badge}
                    </span>
                  </div>

                  {/* Validity status pill */}
                  <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-950/80 backdrop-blur-md border border-emerald-500/30 text-emerald-300 text-[10px] font-semibold shadow-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>{isChinese ? '有效合規' : 'Có hiệu lực'}</span>
                  </div>
                </div>

                {/* Certificate Details & Summary */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-base sm:text-lg font-bold text-tea-dark dark:text-white leading-snug group-hover:text-tea-leaf transition-colors">
                      {isChinese ? cert.titleZh : cert.titleVi}
                    </h4>

                    {/* Metadata Badges */}
                    <div className="space-y-1.5 pt-1 text-xs">
                      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-gray-200/60 dark:border-white/10">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">{isChinese ? '認證編號：' : 'Số chứng nhận:'}</span>
                        <span className="font-mono font-semibold text-tea-dark dark:text-tea-mint bg-white dark:bg-black/40 px-2 py-0.5 rounded border border-gray-200 dark:border-white/10">
                          {cert.certNo}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-gray-200/60 dark:border-white/10">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">{isChinese ? '機構：' : 'Cơ quan:'}</span>
                        <span className="font-semibold text-gray-800 dark:text-gray-200 text-right truncate max-w-[150px]">
                          {isChinese ? cert.orgZh : cert.orgVi}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-2 pb-1.5 border-b border-gray-200/60 dark:border-white/10">
                        <span className="text-gray-600 dark:text-gray-400 font-medium">{isChinese ? '有效期限：' : 'Hiệu lực:'}</span>
                        <span className="font-medium text-emerald-600 dark:text-emerald-400">
                          {cert.validity}
                        </span>
                      </div>
                    </div>

                    {/* Summary Description */}
                    <div className="pt-1">
                      <span className="text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider block mb-1">
                        {isChinese ? '涵蓋產品品類：' : 'Phạm vi chứng nhận:'}
                      </span>
                      <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4 font-normal">
                        {isChinese ? cert.summaryZh : cert.summaryVi}
                      </p>
                    </div>
                  </div>

                  {/* Zoom Button */}
                  <button
                    onClick={() => openLightbox({
                      title: isChinese ? cert.titleZh : cert.titleVi,
                      image: cert.image
                    })}
                    className="w-full mt-2 py-2.5 px-4 rounded-xl bg-white dark:bg-white/5 hover:bg-tea-primary hover:text-white dark:hover:bg-tea-leaf border border-tea-border dark:border-white/10 text-tea-dark dark:text-gray-200 text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-sm group-hover:border-tea-leaf cursor-pointer"
                  >
                    <ZoomIn className="w-3.5 h-3.5" />
                    <span>{isChinese ? '檢視高解析原件' : 'Phóng to xem bản gốc'}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom Commitment & Sample Request Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-12 p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-tea-primary to-tea-emerald text-white shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div className="space-y-2 text-center md:text-left max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-tea-mint text-xs font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{isChinese ? '法規透明・完整背書' : 'Minh Bạch Pháp Lý & Hồ Sơ Đầy Đủ'}</span>
              </div>
              <h4 className="text-lg sm:text-xl font-bold">
                {isChinese ? '需要完整 COA 檢驗分析單與認證公證複本嗎？' : 'Bạn cần đầy đủ hồ sơ kiểm định chất lượng và phiếu COA từng lô?'}
              </h4>
              <p className="text-xs sm:text-sm text-gray-200 leading-relaxed">
                {isChinese
                  ? 'CASA 隨時為廣大連鎖茶飲品牌、經銷商及加盟體系提供 ISO、GMP、HACCP、HALAL 認證公證複本、自主申報文件及批次 COA 檢驗單。'
                  : 'CASA sẵn sàng cung cấp bản sao công chứng chứng chỉ ISO, GMP, HACCP, HALAL, hồ sơ tự công bố sản phẩm và phiếu kiểm nghiệm định kỳ cho mọi chuỗi F&B và đối tác nhượng quyền.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 shrink-0">
              <button
                onClick={() => openSampleModal()}
                className="px-6 py-3 rounded-xl bg-white hover:bg-tea-mint text-tea-dark hover:text-white text-xs font-bold transition-all duration-200 shadow-lg cursor-pointer"
              >
                {isChinese ? '索取樣品與檢驗報告' : 'Nhận mẫu thử & Hồ sơ kiểm định'}
              </button>
              <Link
                to="/contact"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/25 border border-white/30 text-white text-xs font-bold transition-all duration-200 cursor-pointer"
              >
                {isChinese ? '聯絡法規品控部門' : 'Liên hệ bộ phận QC'}
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Animated Wavy Transition: Certificates -> Tea Regions */}
      <WaveDivider
        fromBg="bg-white dark:bg-[#0B130E]"
        toColor="text-[#FAF9F5] dark:text-[#0E1711]"
        accentColor="text-tea-mint/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-leaf/20 dark:text-tea-leaf/10"
        flipX={false}
      />

      {/* 5. VÙNG TRỒNG NGUYÊN LIỆU ĐẶC BIỆT */}
      <section className="py-20 bg-[#FAF9F5] dark:bg-[#0E1711] transition-colors">
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
                    <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mt-2 leading-relaxed font-normal">
                      {(isChinese && region.climateZh) || region.climate}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-gray-100 dark:border-white/10 text-xs text-gray-700 dark:text-gray-300 font-medium">
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

