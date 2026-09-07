import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, MapPin, Clock, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { COMPANY_INFO } from '../constants/company';
import { useToast } from './Toast';
import { useLanguage } from '../context/LanguageContext';

export default function Footer() {
  const { t, isChinese } = useLanguage();
  const [email, setEmail] = useState('');
  const { showToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    showToast(
      isChinese
        ? '感謝您訂閱 CASA 餐飲市場趨勢簡訊！'
        : 'Cảm ơn bạn đã đăng ký nhận bản tin phân tích thị trường F&B của CASA!',
      'success'
    );
    setEmail('');
  };

  return (
    <footer className="bg-tea-dark text-white border-t border-tea-emerald/30 relative overflow-hidden pt-16 pb-12">
      {/* Background ambient leaf glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-tea-emerald/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-tea-leaf/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-white/10">
          {/* Col 1 & 2: Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 shrink-0 select-none group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-tea-leaf to-tea-mint flex items-center justify-center text-tea-dark shadow-tea-sm group-hover:scale-105 transition-transform shrink-0">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col justify-center shrink-0">
                <div className="flex items-baseline gap-1.5 leading-none whitespace-nowrap">
                  <span className="text-2xl font-black tracking-tight text-white">
                    CASA
                  </span>
                  <span className="text-lg font-bold text-tea-mint">
                    TEA
                  </span>
                </div>
                <span className="text-[10px] tracking-widest uppercase text-tea-mint/80 font-semibold mt-1 whitespace-nowrap leading-none">
                  Beverage Ingredient Solutions
                </span>
              </div>
            </Link>

            <p className="text-sm text-gray-300 leading-relaxed max-w-md">
              {t('footer_desc', 'Đơn vị tiên phong cung ứng trà nguyên liệu cao cấp, bột pha chế và chuyển giao giải pháp R&D chuyên sâu cho hơn 1.200 chuỗi trà sữa, quán cà phê và xưởng sản xuất F&B toàn quốc.')}
            </p>

            {/* Certifications mini badges */}
            <div className="pt-2 flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-tea-mint font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> ISO 22000:2018
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-tea-mint font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> HACCP CODEX
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-tea-mint font-semibold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> FDA REGISTRATION
              </span>
            </div>

            {/* Social Links */}
            <div className="pt-3 flex items-center gap-3 text-xs">
              <span className="text-gray-400">{isChinese ? '關注我們：' : 'Kết nối cùng chúng tôi:'}</span>
              <div className="flex items-center gap-2">
                <a
                  href={COMPANY_INFO.socials.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-tea-mint hover:text-tea-dark transition-all flex items-center justify-center font-bold text-xs"
                >
                  FB
                </a>
                <a
                  href={COMPANY_INFO.socials.zalo}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-tea-mint hover:text-tea-dark transition-all flex items-center justify-center font-bold text-xs"
                >
                  ZL
                </a>
                <a
                  href={COMPANY_INFO.socials.tiktok}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-tea-mint hover:text-tea-dark transition-all flex items-center justify-center font-bold text-xs"
                >
                  TT
                </a>
                <a
                  href={COMPANY_INFO.socials.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-tea-mint hover:text-tea-dark transition-all flex items-center justify-center font-bold text-xs"
                >
                  YT
                </a>
              </div>
            </div>
          </div>

          {/* Col 3: Navigation */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-tea-mint mb-4">
              {t('footer_quick_links', 'Khám Phá Website')}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/" className="hover:text-tea-mint transition-colors">{t('nav_home', 'Trang Chủ')}</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-tea-mint transition-colors">{t('nav_about', 'Về Chúng Tôi')}</Link>
              </li>
              <li>
                <Link to="/machinery-certifications" className="hover:text-tea-mint transition-colors">{t('nav_machinery', 'Máy Móc & Chứng Nhận')}</Link>
              </li>
              <li>
                <Link to="/products" className="hover:text-tea-mint transition-colors">{t('nav_products', 'Danh Mục Sản Phẩm')}</Link>
              </li>
              <li>
                <Link to="/news" className="hover:text-tea-mint transition-colors">{t('nav_news', 'Tin Tức & Công Thức')}</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-tea-mint transition-colors">{t('nav_contact', 'Liên Lạc Báo Giá')}</Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-tea-mint transition-colors">{t('nav_faq', 'Câu Hỏi Thường Gặp (FAQ)')}</Link>
              </li>
            </ul>
          </div>

          {/* Col 4: Products Categories */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-tea-mint mb-4">
              {t('footer_product_categories', 'Dòng Sản Phẩm B2B')}
            </h4>
            <ul className="space-y-2.5 text-sm text-gray-300">
              <li>
                <Link to="/products?cat=tra-den" className="hover:text-tea-mint transition-colors">{isChinese ? '阿薩姆與 CTC 紅茶' : 'Trà Đen Assam & CTC'}</Link>
              </li>
              <li>
                <Link to="/products?cat=tra-oolong" className="hover:text-tea-mint transition-colors">{isChinese ? '八珍炭焙烏龍茶' : 'Trà Ô Long Nướng Bát Trân'}</Link>
              </li>
              <li>
                <Link to="/products?cat=tra-lai-xanh" className="hover:text-tea-mint transition-colors">{isChinese ? '雪花茉莉綠茶' : 'Lục Trà Lài Tuyết Hoa'}</Link>
              </li>
              <li>
                <Link to="/products?cat=tra-rang" className="hover:text-tea-mint transition-colors">{isChinese ? '京都焙茶 Hojicha' : 'Trà Rang Hojicha Kyoto'}</Link>
              </li>
              <li>
                <Link to="/products?cat=tra-trai-cay" className="hover:text-tea-mint transition-colors">{isChinese ? '格雷伯爵紅茶 Earl Grey' : 'Hồng Trà Bá Tước Earl Grey'}</Link>
              </li>
              <li>
                <Link to="/products?cat=bot-pha-che" className="hover:text-tea-mint transition-colors">{isChinese ? '非乳製植物植脂末' : 'Bột Béo Không Sữa Thực Vật'}</Link>
              </li>
              <li>
                <Link to="/products?cat=bot-pha-che" className="hover:text-tea-mint transition-colors">{isChinese ? '起司奶蓋粉 Cheese Foam' : 'Bột Màng Sữa Cheese Foam'}</Link>
              </li>
            </ul>
          </div>

          {/* Col 5: Contact & Newsletter */}
          <div>
            <h4 className="text-sm font-bold uppercase tracking-wider text-tea-mint mb-4">
              {t('footer_contact_info', 'Thông Tin Liên Hệ')}
            </h4>
            <div className="space-y-3 text-xs text-gray-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-tea-mint shrink-0 mt-0.5" />
                <span>{isChinese ? '總部：越南林同省保林縣祿新社第4村' : COMPANY_INFO.headquarters}</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-tea-mint shrink-0" />
                <a href={`tel:${COMPANY_INFO.hotline.replace(/\s/g, '')}`} className="hover:text-tea-mint font-bold text-sm">
                  {COMPANY_INFO.hotline}
                </a>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-tea-mint shrink-0" />
                <a href={`mailto:${COMPANY_INFO.salesEmail}`} className="hover:text-tea-mint">
                  {COMPANY_INFO.salesEmail}
                </a>
              </div>
              <div className="flex items-start gap-2.5">
                <Clock className="w-4 h-4 text-tea-mint shrink-0 mt-0.5" />
                <span>{isChinese ? '營業時間：週一至週六 08:00 - 17:30' : COMPANY_INFO.workingHours}</span>
              </div>
            </div>

            {/* Newsletter input */}
            <div className="mt-6 pt-4 border-t border-white/10">
              <span className="text-xs font-semibold text-gray-300 block mb-2">
                {isChinese ? '訂閱 2026 餐飲市場趨勢簡訊：' : 'Nhận bản tin xu hướng F&B 2026:'}
              </span>
              <form onSubmit={handleSubscribe} className="flex items-center gap-1.5">
                <input
                  type="email"
                  required
                  placeholder={isChinese ? '輸入您的電子郵箱...' : 'Email của bạn...'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-white/10 border border-white/15 text-xs text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-tea-mint"
                />
                <button
                  type="submit"
                  aria-label="Đăng ký nhận tin"
                  className="p-2 rounded-xl bg-tea-emerald hover:bg-tea-leaf text-white transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-400">
          <p>{t('footer_copyright', `© 2026 ${COMPANY_INFO.legalName}. All rights reserved.`)}</p>
          <div className="flex items-center gap-6">
            <span>{isChinese ? 'ISO 22000 & HACCP 國際標準' : 'Tiêu chuẩn ISO 22000 & HACCP'}</span>
            <span>{isChinese ? '隱私權政策' : 'Chính sách bảo mật'}</span>
            <span>{isChinese ? 'B2B 供貨條款' : 'Điều khoản cung ứng B2B'}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

