import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { COMPANY_INFO } from '../constants/company';
import { useLanguage } from '../context/LanguageContext';

export default function FloatingContact() {
  const { isChinese } = useLanguage();
  const [hovered, setHovered] = useState(null);

  const zaloUrl = COMPANY_INFO?.socials?.zalo || 'https://zalo.me/2639720552268371942';
  const fbUrl = COMPANY_INFO?.socials?.facebook || 'https://www.facebook.com/CasaTeanFood';

  return (
    <aside
      aria-label={isChinese ? "即時諮詢管道" : "Kênh liên hệ nhanh"}
      className="fixed bottom-6 right-5 sm:right-6 z-40 flex flex-col items-center gap-3.5 select-none"
    >
      {/* 1. ZALO CONTACT BUBBLE */}
      <div
        className="relative flex items-center justify-center group"
        onMouseEnter={() => setHovered('zalo')}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Tooltip Label (Desktop only) */}
        <AnimatePresence>
          {hovered === 'zalo' && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-full mr-3 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-semibold shadow-xl border border-white/10 whitespace-nowrap pointer-events-none z-50 backdrop-blur-md"
            >
              <span>{isChinese ? 'Zalo 線上諮詢' : 'Chat Zalo B2B'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Sonar Ripple Rings */}
        <span
          className="absolute -inset-2 rounded-full border border-blue-400/40 animate-sonar pointer-events-none"
          aria-hidden="true"
        />
        <span
          className="absolute -inset-1 rounded-full bg-blue-500/20 animate-ping pointer-events-none"
          aria-hidden="true"
        />

        {/* Outer Circular Ring & Main Button */}
        <a
          href={zaloUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Tư vấn nhanh qua Zalo"
          className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900/90 hover:bg-[#0068FF] text-white shadow-2xl border-2 border-white/20 hover:border-blue-400 transition-all duration-300 hover:scale-110 group-hover:shadow-[0_0_25px_rgba(0,104,255,0.6)] backdrop-blur-md"
        >
          {/* Authentic Zalo SVG Logo */}
          <svg
            viewBox="0 0 50 50"
            className="w-7 h-7 sm:w-8 sm:h-8 transition-transform duration-300 group-hover:scale-105 drop-shadow"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* White speech bubble */}
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M7.779 43.5892C10.1019 43.846 13.0061 43.1836 15.0682 42.1825C24.0225 47.1318 38.0197 46.8954 46.4923 41.4732C46.8209 40.9803 47.1279 40.4677 47.4128 39.9363C49.1062 36.7779 50.0004 33.22 50.0004 27.1316V22.7175C50.0004 16.629 49.1062 13.0711 47.4128 9.91273C45.7385 6.75436 43.2461 4.28093 40.0877 2.58758C36.9293 0.894239 33.3714 0 27.283 0H22.8499C17.6644 0 14.2982 0.652754 11.4699 1.89893C11.3153 2.03737 11.1636 2.17818 11.0151 2.32135C2.71734 10.3203 2.08658 27.6593 9.12279 37.0782C9.13064 37.0921 9.13933 37.1061 9.14889 37.1203C10.2334 38.7185 9.18694 41.5154 7.55068 43.1516C7.28431 43.399 7.37944 43.5512 7.779 43.5892Z"
              fill="white"
            />
            {/* Z */}
            <path
              d="M20.5632 17H10.8382V19.0853H17.5869L10.9329 27.3317C10.7244 27.635 10.5728 27.9194 10.5728 28.5639V29.0947H19.748C20.203 29.0947 20.5822 28.7156 20.5822 28.2606V27.1421H13.4922L19.748 19.2938C19.8428 19.1801 20.0134 18.9716 20.0893 18.8768L20.1272 18.8199C20.4874 18.2891 20.5632 17.8341 20.5632 17.2844V17Z"
              fill="#0068FF"
            />
            {/* L */}
            <path
              d="M32.9416 29.0947H34.3255V17H32.2402V28.3933C32.2402 28.7725 32.5435 29.0947 32.9416 29.0947Z"
              fill="#0068FF"
            />
            {/* A */}
            <path
              d="M25.814 19.6924C23.1979 19.6924 21.0747 21.8156 21.0747 24.4317C21.0747 27.0478 23.1979 29.171 25.814 29.171C28.4301 29.171 30.5533 27.0478 30.5533 24.4317C30.5723 21.8156 28.4491 19.6924 25.814 19.6924ZM25.814 27.2184C24.2785 27.2184 23.0273 25.9672 23.0273 24.4317C23.0273 22.8962 24.2785 21.645 25.814 21.645C27.3495 21.645 28.6007 22.8962 28.6007 24.4317C28.6007 25.9672 27.3685 27.2184 25.814 27.2184Z"
              fill="#0068FF"
            />
            {/* O */}
            <path
              d="M40.4867 19.6162C37.8516 19.6162 35.7095 21.7584 35.7095 24.3934C35.7095 27.0285 37.8516 29.1707 40.4867 29.1707C43.1217 29.1707 45.2639 27.0285 45.2639 24.3934C45.2639 21.7584 43.1217 19.6162 40.4867 19.6162ZM40.4867 27.2181C38.9322 27.2181 37.681 25.9669 37.681 24.4124C37.681 22.8579 38.9322 21.6067 40.4867 21.6067C42.0412 21.6067 43.2924 22.8579 43.2924 24.4124C43.2924 25.9669 42.0412 27.2181 40.4867 27.2181Z"
              fill="#0068FF"
            />
          </svg>
        </a>
      </div>

      {/* 2. FACEBOOK CONTACT BUBBLE */}
      <div
        className="relative flex items-center justify-center group"
        onMouseEnter={() => setHovered('fb')}
        onMouseLeave={() => setHovered(null)}
      >
        {/* Tooltip Label (Desktop only) */}
        <AnimatePresence>
          {hovered === 'fb' && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-full mr-3 hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/95 text-white text-xs font-semibold shadow-xl border border-white/10 whitespace-nowrap pointer-events-none z-50 backdrop-blur-md"
            >
              <span>{isChinese ? 'Facebook 官方粉絲專頁' : 'Facebook Fanpage'}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Outer Circular Ring & Main Button */}
        <a
          href={fbUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={isChinese ? "聯絡 CASA TEA 官方 Facebook 粉絲專頁" : "Liên hệ Facebook Fanpage CASA TEA"}
          className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-slate-900/90 hover:bg-[#1877F2] text-white shadow-2xl border-2 border-white/20 hover:border-blue-400 transition-all duration-300 hover:scale-110 group-hover:shadow-[0_0_25px_rgba(24,119,242,0.6)] backdrop-blur-md"
        >
          {/* Authentic Facebook "f" logo */}
          <svg
            viewBox="0 0 24 24"
            className="w-6 h-6 sm:w-7 sm:h-7 text-[#1877F2] group-hover:text-white transition-colors duration-300 drop-shadow"
            fill="currentColor"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
          </svg>
        </a>
      </div>
    </aside>
  );
}

