import React from 'react';
import { motion } from 'framer-motion';

export default function SectionHeading({
  badge,
  title,
  subtitle,
  align = 'center',
  dark = false,
  className = ''
}) {
  const isCenter = align === 'center';

  return (
    <div className={`mb-12 md:mb-16 ${isCenter ? 'text-center mx-auto' : 'text-left'} max-w-3xl ${className}`}>
      {badge && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase mb-3.5 border ${
            dark
              ? 'bg-white/10 text-tea-mint border-white/15'
              : 'bg-tea-soft dark:bg-tea-green/20 text-tea-primary dark:text-tea-mint border-tea-leaf/20 dark:border-tea-mint/30'
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-tea-mint animate-pulse" />
          {badge}
        </motion.div>
      )}

      <motion.h2
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className={`text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-[1.2] ${
          dark ? 'text-white' : 'text-tea-dark dark:text-white'
        }`}
      >
        {title}
      </motion.h2>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`mt-4 text-base sm:text-lg leading-relaxed ${
            dark ? 'text-gray-300' : 'text-gray-700 dark:text-gray-300 font-normal'
          }`}
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

