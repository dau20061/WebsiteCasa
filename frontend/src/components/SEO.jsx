import { useEffect } from 'react';

export default function SEO({ title, description }) {
  useEffect(() => {
    const fullTitle = title 
      ? `${title} | CASA TEA – Giải Pháp Trà Nguyên Liệu B2B`
      : 'CASA TEA | Tinh Hoa Trà Nguyên Liệu & Giải Pháp Pha Chế B2B Hàng Đầu';
    
    document.title = fullTitle;

    if (description) {
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute('content', description);
      }
    }
  }, [title, description]);

  return null;
}

