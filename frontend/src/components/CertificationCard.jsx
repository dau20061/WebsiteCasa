import React from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Award, Globe, CheckCircle2, FileText, Sprout, ExternalLink } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const iconMap = {
  ShieldCheck,
  Award,
  Globe,
  CheckCircle2,
  Sprout,
  FileText,
};

export default function CertificationCard({ cert, onSelect }) {
  const { isChinese } = useLanguage();
  const IconComponent = iconMap[cert.icon] || ShieldCheck;

  const displayTitle = (isChinese && cert.titleZh) || cert.title;
  const displayBadge = (isChinese && cert.badgeZh) || cert.badge;
  const displayOrg = (isChinese && cert.orgZh) || cert.org;
  const displayScope = (isChinese && cert.scopeZh) || cert.scope;
  const displayValidity = (isChinese && cert.validityZh) || cert.validity;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-[#132018] rounded-3xl p-6 sm:p-7 border border-tea-border dark:border-white/10 shadow-tea-sm hover:shadow-tea-lg dark:hover:border-tea-mint/30 transition-all flex flex-col justify-between group"
    >
      <div>
        {/* Header with Icon and Badge */}
        <div className="flex items-start justify-between gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-tea-mist dark:bg-[#1C2F23] border border-tea-leaf/20 dark:border-white/10 flex items-center justify-center text-tea-emerald dark:text-tea-mint group-hover:bg-tea-emerald group-hover:text-white transition-colors">
            <IconComponent className="w-6 h-6" />
          </div>
          <span className="px-3 py-1 rounded-full bg-tea-cream dark:bg-[#1C2F23] text-tea-dark dark:text-white border border-tea-border dark:border-white/10 text-xs font-semibold">
            {displayBadge}
          </span>
        </div>

        {/* Certificate Title */}
        <h3 className="text-xl font-bold text-tea-dark dark:text-white group-hover:text-tea-green dark:group-hover:text-tea-mint transition-colors">
          {cert.name}
        </h3>
        <p className="text-xs font-semibold text-tea-emerald dark:text-tea-mint mt-1">
          {displayTitle}
        </p>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {isChinese ? '發證機構：' : 'Cơ quan:'} <span className="text-gray-700 dark:text-gray-200 font-medium">{displayOrg}</span>
        </p>

        {/* Scope snippet */}
        <p className="mt-3.5 text-xs text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-3">
          {displayScope}
        </p>

        {/* Placeholder disclaimer badge */}
        <div className="mt-3.5 py-1.5 px-2.5 bg-gray-50 dark:bg-black/30 rounded-lg border border-dashed border-gray-200 dark:border-white/10 text-[11px] text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-tea-leaf dark:bg-tea-mint" />
          <span className="truncate">{cert.certNumber}</span>
        </div>
      </div>

      {/* Button to open lightbox preview */}
      <div className="mt-6 pt-4 border-t border-gray-100 dark:border-white/10 flex items-center justify-between">
        <span className="text-[11px] text-gray-400 dark:text-gray-400">
          {isChinese ? '效期：' : 'Hiệu lực:'} {displayValidity}
        </span>
        <button
          onClick={() => onSelect(cert)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-tea-emerald dark:text-tea-mint hover:text-tea-primary transition-colors"
        >
          <span>{isChinese ? '檢視證書' : 'Xem chứng chỉ'}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </button>
      </div>
    </motion.div>
  );
}

