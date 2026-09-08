import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  CheckCircle2,
  Sparkles,
  Building,
  Factory,
  ShieldCheck
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import WaveDivider from '../components/WaveDivider';
import SEO from '../components/SEO';
import { COMPANY_INFO } from '../constants/company';
import { useToast } from '../components/Toast';
import { saveRtdbContact } from '../services/rtdbService';
import { useLanguage } from '../context/LanguageContext';

export default function Contact() {
  const { t, isChinese } = useLanguage();
  const { showToast } = useToast();
  const [searchParams] = useSearchParams();
  const productParam = searchParams.get('product') || '';
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    company: '',
    phone: '',
    email: '',
    businessType: 'Chuỗi trà sữa (Nhiều chi nhánh)',
    productInterest: productParam ? `Tư vấn sản phẩm: ${productParam}` : 'Trà Đen Assam & Trà Ô Long Nướng',
    requestSample: true,
    message: productParam ? `Tôi quan tâm và muốn được tư vấn chi tiết, báo giá sỉ cho sản phẩm: ${productParam}` : '',
  });

  useEffect(() => {
    if (productParam) {
      setFormData((prev) => ({
        ...prev,
        productInterest: `Tư vấn sản phẩm: ${productParam}`,
        message: prev.message || `Tôi quan tâm và muốn được tư vấn chi tiết, báo giá sỉ cho sản phẩm: ${productParam}`
      }));
    }
  }, [productParam]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      showToast('Vui lòng điền Họ tên và Số điện thoại liên hệ!', 'error');
      return;
    }

    try {
      const newContact = {
        id: `contact_${Date.now()}`,
        name: formData.fullName,
        company: formData.company || 'Doanh nghiệp liên hệ',
        phone: formData.phone,
        email: formData.email || '',
        productInterest: `${formData.productInterest} (${formData.businessType})`,
        status: 'NEW',
        requestSample: formData.requestSample,
        message: formData.message || '',
        createdAt: new Date().toLocaleString('vi-VN')
      };
      await saveRtdbContact(newContact);
      
      // Update local storage for immediate Admin reflection if in same browser
      const savedContacts = localStorage.getItem('casa_admin_contacts');
      const list = savedContacts ? JSON.parse(savedContacts) : [];
      localStorage.setItem('casa_admin_contacts', JSON.stringify([newContact, ...list]));
    } catch (err) {
      console.warn('Could not save contact to RTDB:', err);
    }

    setSubmitted(true);
    showToast('Yêu cầu tư vấn đã được gửi thành công! Chuyên viên B2B CASA sẽ phản hồi trong 2 giờ.', 'success');
  };

  return (
    <div className="overflow-hidden pb-20">
      <SEO
        title="Liên Hệ Báo Giá & Đăng Ký Mẫu Thử"
        description="Liên hệ bộ phận kinh doanh dự án B2B của CASA TEA để nhận bảng giá sỉ trà nguyên liệu, mẫu thử miễn phí và tư vấn giải pháp R&D."
      />

      {/* 1. HERO HEADER */}
      <section className="relative pt-28 pb-12 sm:pt-32 sm:pb-14 bg-gradient-to-b from-[#DFF5E1]/50 via-[#BFE8D0]/20 to-[#FAF9F5] dark:from-[#132B1C]/70 dark:via-[#0F1E14]/40 dark:to-[#0B130E] overflow-hidden transition-colors">
        {/* Subtle Ambient Background Gradients */}
        <div className="absolute top-5 right-10 w-[450px] h-[450px] bg-tea-mint/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-5 left-10 w-[350px] h-[350px] bg-tea-leaf/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-3 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white dark:bg-[#132018] text-tea-primary dark:text-tea-mint border border-tea-leaf/30 dark:border-tea-mint/30 text-xs font-bold uppercase tracking-wider shadow-sm">
            <Mail className="w-3.5 h-3.5 text-tea-leaf" />
            {t('contact_hero_badge', 'Bộ Phận Kinh Doanh B2B & Dự Án')}
          </div>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-tea-dark dark:text-white tracking-tight">
            {t('contact_hero_title', 'Liên Hệ Với Chúng Tôi')}
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            {t('contact_hero_desc', 'Bạn đang tìm nguồn trà nguyên liệu cho thương hiệu của mình? Hãy kết nối với chúng tôi để nhận bảng giá sỉ và bộ mẫu thử miễn phí.')}
          </p>
        </div>
      </section>

      {/* Animated Wavy Transition: Hero -> Contact Form */}
      <WaveDivider
        fromBg="bg-[#FAF9F5] dark:bg-[#0B130E]"
        toColor="text-white dark:text-[#0B130E]"
        accentColor="text-tea-mint/30 dark:text-tea-mint/20"
        secondaryAccent="text-tea-leaf/20 dark:text-tea-leaf/10"
        flipX={false}
      />

      {/* 2. MAIN CONTACT SECTION */}
      <section className="py-16 bg-white dark:bg-[#0B130E] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            
            {/* Left Column: Direct Contact Information */}
            <div className="lg:col-span-5 space-y-8">
              <div className="space-y-3">
                <span className="text-xs font-bold text-tea-leaf dark:text-tea-mint uppercase tracking-wider block">
                  {isChinese ? '工廠與營運據點' : 'Cơ Sở & Trụ Sở Hoạt Động'}
                </span>
                <h2 className="text-2xl font-bold text-tea-dark dark:text-white">
                  {isChinese ? '直接聯絡資訊' : 'Thông Tin Liên Lạc Trực Tiếp'}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {isChinese
                    ? '我們誠摯歡迎各位合作夥伴預約參訪位於保祿的專業杯測實驗室 (Cupping Lab) 與現代化製茶廠。'
                    : 'Chúng tôi luôn sẵn sàng đón tiếp quý đối tác đến thăm quan Trung tâm Thử nếm Cupping Lab và Nhà máy chế biến tại Bảo Lộc.'}
                </p>
              </div>

              {/* Info cards */}
              <div className="space-y-4 text-xs sm:text-sm">
                {/* Headquarters */}
                <div className="p-5 rounded-2xl bg-[#FAF9F5] dark:bg-[#132018] border border-tea-border dark:border-white/10 flex items-start gap-3.5 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-tea-soft dark:bg-[#1C2F23] flex items-center justify-center text-tea-emerald dark:text-tea-mint shrink-0">
                    <Building className="w-5 h-5" />
                  </div>
                  <div>
                    <strong className="text-tea-dark dark:text-white block font-bold mb-0.5">
                      {isChinese ? '總部研發中心 (Innovation Center)：' : 'Trụ Sở Chính (Innovation Center):'}
                    </strong>
                    <span className="text-gray-600 dark:text-gray-300 leading-relaxed block">{COMPANY_INFO.headquarters}</span>
                  </div>
                </div>

                {/* Direct lines */}
                <div className="p-5 rounded-2xl bg-[#FAF9F5] dark:bg-[#132018] border border-tea-border dark:border-white/10 space-y-3 transition-colors text-gray-700 dark:text-gray-300">
                  <div className="flex items-center gap-3">
                    <Phone className="w-4 h-4 text-tea-leaf dark:text-tea-mint" />
                    <span>{isChinese ? 'B2B 諮詢熱線：' : 'Hotline tư vấn B2B: '} <a href={`tel:${COMPANY_INFO.hotline.replace(/\s/g, '')}`} className="font-bold text-tea-primary dark:text-tea-mint hover:underline">{COMPANY_INFO.hotline}</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-4 h-4 text-tea-leaf dark:text-tea-mint" />
                    <span>{isChinese ? '商務合作郵箱：' : 'Email kinh doanh: '} <a href={`mailto:${COMPANY_INFO.salesEmail}`} className="font-bold text-tea-primary dark:text-tea-mint hover:underline">{COMPANY_INFO.salesEmail}</a></span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-tea-leaf dark:text-tea-mint" />
                    <span>{isChinese ? '服務時間：' : 'Giờ làm việc: '} {COMPANY_INFO.workingHours}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: B2B Inquiry & Sample Form */}
            <div className="lg:col-span-7 bg-[#FAF9F5] dark:bg-[#132018] rounded-4xl p-6 sm:p-10 border border-tea-border dark:border-white/10 shadow-tea-sm transition-colors">
              <div className="mb-6">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white dark:bg-[#0B130E] text-tea-primary dark:text-tea-mint text-xs font-bold border border-tea-border dark:border-white/10 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-tea-leaf dark:text-tea-mint" />
                  {isChinese ? '批發報價與索樣' : 'Báo Giá & Mẫu Thử'}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-tea-dark dark:text-white">
                  {isChinese ? '送出諮詢與大宗批發報價需求' : 'Gửi Yêu Cầu Tư Vấn & Báo Giá Sỉ'}
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mt-1">
                  {isChinese
                    ? '請填寫以下資訊以取得階梯產量批發報價單，並預約免費樣品套件寄送。'
                    : 'Điền thông tin bên dưới để nhận bảng giá chiết khấu theo sản lượng và đăng ký nhận bộ mẫu thử tận nơi.'}
                </p>
              </div>

              {submitted ? (
                <div className="p-8 text-center bg-white dark:bg-[#0B130E] rounded-3xl border border-tea-border dark:border-white/10 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-tea-soft dark:bg-[#132018] flex items-center justify-center text-tea-emerald dark:text-tea-mint mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-2xl font-bold text-tea-dark dark:text-white">
                    {isChinese ? '感謝您的諮詢！' : 'Cảm Ơn Quý Khách!'}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 max-w-md mx-auto">
                    {isChinese
                      ? `CASA 已收到 ${formData.company || formData.fullName} 的諮詢需求。專屬業務人員將於 2 個工作小時內與您聯繫。`
                      : `CASA đã tiếp nhận thông tin yêu cầu của ${formData.company || formData.fullName}. Chuyên viên kinh doanh phụ trách khu vực sẽ kết nối qua Zalo/Điện thoại trong vòng 2 giờ làm việc.`}
                  </p>
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: '',
                        company: '',
                        phone: '',
                        email: '',
                        businessType: 'Chuỗi trà sữa (Nhiều chi nhánh)',
                        productInterest: 'Trà Đen Assam & Trà Ô Long Nướng',
                        requestSample: true,
                        message: '',
                      });
                    }}
                    className="px-6 py-2.5 rounded-xl bg-tea-primary text-white text-xs font-bold"
                  >
                    {isChinese ? '送出其他諮詢需求' : 'Gửi yêu cầu khác'}
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                  {/* Banner sản phẩm đang yêu cầu tư vấn */}
                  {productParam && (
                    <div className="p-4 rounded-2xl bg-tea-mist dark:bg-[#1C2F23] border border-tea-leaf/30 dark:border-tea-mint/30 flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-tea-emerald dark:text-tea-mint shrink-0" />
                        <span className="text-gray-700 dark:text-gray-200">
                          {isChinese ? '正在諮詢產品：' : 'Bạn đang yêu cầu tư vấn cho sản phẩm: '}
                          <strong className="text-tea-dark dark:text-white font-bold">{productParam}</strong>
                        </span>
                      </div>
                      <span className="px-2.5 py-1 rounded-full bg-tea-primary text-white text-[10px] font-bold shrink-0">
                        {isChinese ? '專屬諮詢' : 'Tư Vấn Sản Phẩm'}
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        {t('contact_form_name', 'Họ và tên')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="text"
                        required
                        placeholder={isChinese ? "例如: 王大明" : "VD: Trần Anh Tuấn"}
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-tea-border dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white dark:bg-[#0B130E] dark:text-white dark:placeholder-gray-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        {t('contact_form_phone', 'Số điện thoại / Zalo')} <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder={isChinese ? "例如: +886 912 345 678" : "VD: 0988 123 456"}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-tea-border dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white dark:bg-[#0B130E] dark:text-white dark:placeholder-gray-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        {t('contact_form_company', 'Tên Thương Hiệu / Quán / Công Ty')}
                      </label>
                      <input
                        type="text"
                        placeholder={isChinese ? "例如: 沐茶茶飲連鎖" : "VD: Chuỗi Trà Sữa Mộc Trà"}
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-tea-border dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white dark:bg-[#0B130E] dark:text-white dark:placeholder-gray-400 transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        {t('contact_form_email', 'Địa chỉ Email')}
                      </label>
                      <input
                        type="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-tea-border dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white dark:bg-[#0B130E] dark:text-white dark:placeholder-gray-400 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        {isChinese ? '經營模式' : 'Mô hình kinh doanh'}
                      </label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-tea-border dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white dark:bg-[#0B130E] dark:text-white transition-colors"
                      >
                        <option value="Chuỗi trà sữa (Nhiều chi nhánh)">
                          {isChinese ? '連鎖茶飲體系 (多門市)' : 'Chuỗi trà sữa (Nhiều chi nhánh)'}
                        </option>
                        <option value="Quán cafe / Trà sữa độc lập">
                          {isChinese ? '獨立咖啡館 / 風格茶飲店' : 'Quán cafe / Trà sữa độc lập'}
                        </option>
                        <option value="Xưởng sản xuất đóng chai RTD">
                          {isChinese ? '瓶裝即飲 RTD 生產工廠' : 'Xưởng sản xuất đóng chai RTD'}
                        </option>
                        <option value="Đại lý phân phối nguyên liệu F&B">
                          {isChinese ? '餐飲原物料經銷代理商' : 'Đại lý phân phối nguyên liệu F&B'}
                        </option>
                        <option value="Gia công OEM/ODM thương hiệu riêng">
                          {isChinese ? '自有品牌客製代工 OEM/ODM' : 'Gia công OEM/ODM thương hiệu riêng'}
                        </option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                        {isChinese ? '感興趣的產品系列' : 'Dòng sản phẩm quan tâm'}
                      </label>
                      <input
                        type="text"
                        placeholder={isChinese ? "例如: 炭焙烏龍茶、阿薩姆紅茶..." : "VD: Trà Oolong Nướng, Trà Đen Assam..."}
                        value={formData.productInterest}
                        onChange={(e) => setFormData({ ...formData, productInterest: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-tea-border dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white dark:bg-[#0B130E] dark:text-white dark:placeholder-gray-400 transition-colors"
                      />
                    </div>
                  </div>

                  {/* Sample Kit checkbox */}
                  <div className="p-4 rounded-xl bg-tea-mist dark:bg-[#0B130E] border border-tea-leaf/20 dark:border-white/10 flex items-center gap-3 transition-colors">
                    <input
                      type="checkbox"
                      id="sampleCheck"
                      checked={formData.requestSample}
                      onChange={(e) => setFormData({ ...formData, requestSample: e.target.checked })}
                      className="w-4 h-4 rounded text-tea-emerald focus:ring-tea-emerald cursor-pointer"
                    />
                    <label htmlFor="sampleCheck" className="text-xs text-tea-dark dark:text-white font-medium cursor-pointer">
                      {isChinese
                        ? '我想免費索取茶葉體驗套件 (Sample Kit 100g) 寄送至門市地址。'
                        : 'Tôi muốn nhận miễn phí Bộ Mẫu Thử Trà (Sample Kit 100g) gửi về địa chỉ quán.'}
                    </label>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                      {isChinese ? '詳細需求說明' : 'Nội dung yêu cầu chi tiết'}
                    </label>
                    <textarea
                      rows={3}
                      placeholder={isChinese ? "請描述預估每月採購量、配送地區或特定風味要求..." : "Mô tả số lượng dự kiến hàng tháng, khu vực giao hàng hoặc yêu cầu đặc biệt về hương vị..."}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl border border-tea-border dark:border-white/10 focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white dark:bg-[#0B130E] dark:text-white dark:placeholder-gray-400 resize-none transition-colors"
                    />
                  </div>

                  <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                      <ShieldCheck className="w-4 h-4 text-tea-leaf dark:text-tea-mint" />
                      <span>{isChinese ? '客戶資訊 100% 嚴格保密' : 'Thông tin đối tác được bảo mật 100%'}</span>
                    </div>

                    <button
                      type="submit"
                      className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-tea-primary hover:bg-tea-emerald text-white rounded-xl font-bold shadow-tea-sm transition-all hover:shadow-tea-md"
                    >
                      <Send className="w-4 h-4" />
                      {isChinese ? '送出報價諮詢' : t('contact_form_submit', 'Gửi Yêu Cầu Báo Giá')}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Animated Wavy Transition: Contact Form -> Maps */}
      <WaveDivider
        fromBg="bg-white dark:bg-[#0B130E]"
        toColor="text-[#FAF9F5] dark:text-[#0E1711]"
        accentColor="text-tea-leaf/25 dark:text-tea-mint/20"
        secondaryAccent="text-tea-mint/20 dark:text-tea-leaf/10"
        flipX={true}
      />

      {/* 3. GOOGLE MAPS SECTION */}
      <section className="py-12 bg-[#FAF9F5] dark:bg-[#0E1711] transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-tea-dark dark:text-white flex items-center gap-2">
              <MapPin className="w-5 h-5 text-tea-emerald dark:text-tea-mint" />
              {isChinese ? '總部與生產工廠地理位置' : 'Bản Đồ Vị Trí Trụ Sở & Nhà Máy'}
            </h3>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {isChinese ? '神浪工業區，平陽省以安市（鄰近胡志明市）' : 'KCN Sóng Thần, Phường Dĩ An, TP.Hồ Chí Minh'}
            </span>
          </div>

          <div className="rounded-3xl overflow-hidden border border-tea-border dark:border-white/10 shadow-tea-sm h-80 sm:h-96 w-full relative bg-gray-200 dark:bg-[#132018]">
            <iframe
              title="CASA TEA Location Map"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d489.75988382738433!2d106.74631248604081!3d10.881590542645885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9802a875f91f6e3%3A0x4867666177deb21a!2zQ0FTQSBURUEgJiBGT09EIC0gTmjDoCBNw6F5IENodXnDqm4gU-G6o24gWHXhuqV0IE5ndXnDqm4gTGnhu4d1IFBoYSBDaOG6vyBCw6xuaCBExrDGoW5n!5e0!3m2!1svi!2s!4v1788581417680!5m2!1svi!2s"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

