import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, CheckCircle2, ShieldCheck, Box } from 'lucide-react';
import { useToast } from './Toast';
import { saveRtdbContact, getRtdbProducts } from '../services/rtdbService';
import { useLanguage } from '../context/LanguageContext';

export default function SampleRequestModal({ isOpen, onClose, defaultProduct = null }) {
  const { t, isChinese } = useLanguage();
  const { showToast } = useToast();
  const [productList, setProductList] = useState(() => {
    try {
      const saved = localStorage.getItem('casa_admin_products');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    getRtdbProducts().then((res) => {
      if (Array.isArray(res)) setProductList(res);
    });
  }, []);

  const [formData, setFormData] = useState({
    fullName: '',
    brandName: '',
    businessType: 'Chuỗi trà sữa / Quán cafe',
    phone: '',
    email: '',
    product: '',
    address: '',
    notes: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (defaultProduct) {
      setFormData((prev) => ({
        ...prev,
        product: typeof defaultProduct === 'string' ? defaultProduct : defaultProduct.name
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        product: prev.product || (productList[0]?.name || 'Combo Mẫu Thử Đầy Đủ (Best-Sellers)')
      }));
    }
  }, [defaultProduct, isOpen, productList]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone || !formData.address) {
      showToast('Vui lòng điền đầy đủ Họ tên, Số điện thoại và Địa chỉ nhận mẫu!', 'error');
      return;
    }

    try {
      const newContact = {
        id: `sample_${Date.now()}`,
        name: formData.fullName,
        company: formData.brandName || formData.businessType,
        phone: formData.phone,
        email: formData.email || '',
        productInterest: `Mẫu thử: ${formData.product}`,
        status: 'NEW',
        requestSample: true,
        message: `Địa chỉ: ${formData.address}. Ghi chú: ${formData.notes || 'Không có'}`,
        createdAt: new Date().toLocaleString('vi-VN')
      };
      await saveRtdbContact(newContact);

      const savedContacts = localStorage.getItem('casa_admin_contacts');
      const list = savedContacts ? JSON.parse(savedContacts) : [];
      localStorage.setItem('casa_admin_contacts', JSON.stringify([newContact, ...list]));
    } catch (err) {
      console.warn('Could not save sample request to RTDB:', err);
    }

    setIsSubmitted(true);
    showToast('Đăng ký mẫu thử thành công! Chuyên viên R&D CASA sẽ liên hệ trong 24h.', 'success');

    setTimeout(() => {
      setIsSubmitted(false);
      onClose();
    }, 2200);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-tea-dark/60 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-xl bg-white dark:bg-[#132018] rounded-3xl shadow-2xl border border-tea-border dark:border-white/10 overflow-hidden z-10 my-8"
        >
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-tea-primary to-tea-emerald p-6 text-white relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-white/70 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-tea-mint text-xs font-semibold uppercase tracking-wider mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              {isChinese ? 'B2B 免費樣品政策' : 'Chính Sách B2B Mẫu Thử Miễn Phí'}
            </div>
            <h3 className="text-xl sm:text-2xl font-bold">
              {isChinese ? '免費登記索取茶樣套件 (Sample Kit)' : 'Đăng Ký Nhận Bộ Mẫu Thử (Sample Kit)'}
            </h3>
            <p className="text-sm text-white/80 mt-1">
              {isChinese
                ? '體驗 100g - 200g 充氮密封專業茶樣，並獲贈標準成本分析諮詢表。'
                : 'Trải nghiệm mẫu thử trà 100g - 200g đóng gói kín khí và nhận bảng tư vấn cost công thức chuẩn.'}
            </p>
          </div>

          {/* Body Content */}
          {isSubmitted ? (
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-tea-soft dark:bg-tea-green/30 flex items-center justify-center text-tea-emerald dark:text-tea-mint mb-4">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-2xl font-bold text-tea-dark dark:text-white mb-2">
                {isChinese ? '已成功受理您的索樣需求！' : 'Đã Tiếp Nhận Yêu Cầu!'}
              </h4>
              <p className="text-gray-600 dark:text-gray-300 text-sm max-w-md mb-4">
                {isChinese
                  ? '感謝您對 CASA 茶葉原料解決方案的關注。該區域的研發專員將在 24 小時內與您聯繫確認寄送資訊。'
                  : 'Cảm ơn bạn đã quan tâm đến giải pháp trà nguyên liệu của CASA. Chuyên viên R&D phụ trách khu vực sẽ liên hệ xác nhận thông tin gửi mẫu trong vòng 24 giờ làm việc.'}
              </p>
              <div className="p-4 bg-tea-cream dark:bg-black/30 rounded-2xl border border-tea-border dark:border-white/10 text-xs text-gray-600 dark:text-gray-300 w-full text-left">
                <strong>{isChinese ? '已選產品：' : 'Sản phẩm đã chọn:'}</strong> {formData.product}<br/>
                <strong>{isChinese ? '收件人：' : 'Người nhận:'}</strong> {formData.fullName} - {formData.phone}<br/>
                <strong>{isChinese ? '收件地址：' : 'Địa chỉ gửi:'}</strong> {formData.address}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-4 max-h-[75vh] overflow-y-auto">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    {isChinese ? '負責人 / 收件人姓名' : 'Họ và tên người nhận'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={isChinese ? '例：陳大明' : 'VD: Nguyễn Văn A'}
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C2F23] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 focus:border-tea-emerald"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    {isChinese ? '聯絡電話 / 微信 / Zalo' : 'Số điện thoại / Zalo'} <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder={isChinese ? '例：+886 912 345 678 或 0912 345 678' : 'VD: 0912 345 678'}
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C2F23] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 focus:border-tea-emerald"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    {isChinese ? '店名 / 連鎖品牌名稱' : 'Tên Quán / Thương hiệu Chuỗi'}
                  </label>
                  <input
                    type="text"
                    placeholder={isChinese ? '例：Casa Tea 手搖茶飲、沐茗咖啡' : 'VD: Trà Sữa Casa Tea, Tiệm Cafe Mộc'}
                    value={formData.brandName}
                    onChange={(e) => setFormData({ ...formData, brandName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C2F23] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 focus:border-tea-emerald"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                    {isChinese ? '經營模式' : 'Mô hình kinh doanh'}
                  </label>
                  <select
                    value={formData.businessType}
                    onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C2F23] text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 focus:border-tea-emerald"
                  >
                    <option className="dark:bg-[#1C2F23]">{isChinese ? '手搖茶飲連鎖（多家門市）' : 'Chuỗi trà sữa (Nhiều chi nhánh)'}</option>
                    <option className="dark:bg-[#1C2F23]">{isChinese ? '獨立咖啡館 / 獨立茶飲店' : 'Quán cafe / Trà sữa độc lập'}</option>
                    <option className="dark:bg-[#1C2F23]">{isChinese ? 'RTD 即飲瓶裝工廠 / OEM 代工' : 'Nhà xưởng đóng chai RTD / OEM'}</option>
                    <option className="dark:bg-[#1C2F23]">{isChinese ? '餐飲原料批發經銷商' : 'Đại lý phân phối nguyên liệu F&B'}</option>
                    <option className="dark:bg-[#1C2F23]">{isChinese ? '新店籌備項目（菜單研發中）' : 'Dự án mở quán mới (Đang lên menu)'}</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  {isChinese ? '感興趣的樣品品項' : 'Dòng sản phẩm mẫu quan tâm'} <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.product}
                  onChange={(e) => setFormData({ ...formData, product: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C2F23] text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 focus:border-tea-emerald"
                >
                  <option value="Combo Mẫu Thử Đầy Đủ (Best-Sellers)" className="dark:bg-[#1C2F23]">
                    {isChinese ? '★ 熱銷必試：4款頂級商用茶樣體驗套件（阿薩姆、炭焙烏龍、茉莉綠茶、植脂末）' : '★ Combo Trọn Bộ 4 Mẫu Trà Thượng Hạng (Assam, Ô Long Nướng, Lài, Bột Béo)'}
                  </option>
                  {productList.map((p) => (
                    <option key={p.id} value={p.name} className="dark:bg-[#1C2F23]">
                      {p.sku} – {(isChinese && (p.nameZh || p.name_zh)) || p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  {isChinese ? '茶樣包裹收件地址' : 'Địa chỉ nhận bưu kiện mẫu thử'} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder={isChinese ? '請輸入省市、行政區及詳細門牌地址' : 'Số nhà, Tên đường, Phường/Xã, Quận/Huyện, Tỉnh/TP'}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C2F23] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 focus:border-tea-emerald"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider mb-1.5">
                  {isChinese ? '風味偏好或配方需求備註' : 'Ghi chú gu vị hoặc yêu cầu công thức'}
                </label>
                <textarea
                  rows={2}
                  placeholder={isChinese ? '例：需要尋找具有濃郁麥芽香氣的紅茶，與鮮奶調配不被掩蓋...' : 'VD: Cần tìm dòng trà đen có hương mạch nha đậm, pha cùng sữa tươi không bị nhạt...'}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-[#1C2F23] text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 focus:border-tea-emerald resize-none"
                />
              </div>

              <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-gray-100 dark:border-white/10">
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
                  <ShieldCheck className="w-4 h-4 text-tea-leaf dark:text-tea-mint" />
                  <span>{isChinese ? '100% 嚴格保護餐飲夥伴商業資訊' : 'Bảo mật 100% thông tin đối tác F&B'}</span>
                </div>

                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-tea-primary dark:bg-tea-green hover:bg-tea-emerald text-white rounded-xl text-sm font-semibold shadow-tea-sm transition-all hover:shadow-tea-md"
                >
                  <Send className="w-4 h-4" />
                  {isChinese ? '送出樣品索取' : 'Gửi Yêu Cầu Nhận Mẫu'}
                </button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

