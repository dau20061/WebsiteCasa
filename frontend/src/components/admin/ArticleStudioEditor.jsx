import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  List,
  ListOrdered,
  Quote,
  Link as LinkIcon,
  Image as ImageIcon,
  ImagePlus,
  Undo,
  Redo,
  Code,
  Eye,
  Save,
  Send,
  ArrowLeft,
  Sparkles,
  Sliders,
  Check,
  X,
  Plus,
  Trash2,
  ChevronDown,
  Globe,
  UploadCloud,
  Search,
  Tag,
  Star,
  ChefHat,
  Package,
  Layers,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Table,
  Minus,
  Sun,
  Moon,
  RefreshCw
} from 'lucide-react';
import { optimizeImageToDataUrl } from '../../services/storageService';
import { slugify } from '../../utils/slugify';
import { getRtdbTags, saveRtdbTag } from '../../services/rtdbService';

// Kho ảnh mẫu nguyên liệu F&B cao cấp được chuẩn bị sẵn cho CASA TEA
const CASA_SAMPLE_IMAGES = [
  { title: 'Hồng Trà Assam Cao Cấp', url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Trà Ô Long Nướng Đậm Vị', url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Bột Matcha Uji Thượng Hạng', url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Trà Hoa Lài Thơm Ngát', url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Syrup Đường Đen Đài Loan', url: 'https://images.unsplash.com/photo-1558857563-b37fcfeee58c?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Siro Đào Vàng Tươi Mát', url: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Bột Kem Béo Thực Vật CASA', url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Trân Châu Đen Dẻo Dai', url: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=1200&q=80' },
  { title: 'Thạch 3Q Giòn Đài Loan', url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=1200&q=80' }
];

// Danh sách từ khóa gợi ý chuẩn xác theo hình chụp thực tế của khách hàng
const SUGGESTED_TAGS_COLLECTION = [
  'bảo quản nguyên liệu',
  'bột kem béo',
  'bột kem béo tươi dinh dưỡng',
  'bột kem béo chất lượng',
  'bột kem béo giá sỉ',
  'bột kem béo giá rẻ',
  'bột kem béo nguồn',
  'bột pha chế giá sỉ tphcm',
  'Công thức pha chế',
  'Casa',
  'đại lý nguyên liệu pha chế tphcm',
  'Giá sỉ tốt',
  'khóa nguyên liệu pha chế tphcm',
  'Kiến thức sản phẩm',
  'Lài nhuận',
  'Matcha',
  'Mẹo pha chế',
  'Một quán',
  'Nẹp gấp túi sipline',
  'nguyên liệu pha chế giá rẻ tphcm',
  'nguyên liệu pha chế sỉ tphcm',
  'nguyên liệu pha chế giá sỉ tphcm',
  'nguyên liệu pha chế tphcm',
  'nguyên liệu trà sữa giá sỉ',
  'nguyên liệu trà sữa giá sỉ tphcm',
  'nhà cung cấp nguyên liệu pha chế tphcm',
  'nơi bán nguyên liệu pha chế tphcm',
  'phát triển sản phẩm trọn gói',
  'Pudding trứng',
  'Thạch',
  'Thạch sương sáo',
  'Topping',
  'Trà Lài bông',
  'Trà Oolong',
  'Trà sữa'
];

export default function ArticleStudioEditor({
  isOpen,
  onClose,
  newsFormData,
  setNewsFormData,
  editingNews,
  onSave,
  products = [],
  onAiAutoDesign,
  isDesigningNews,
  onTranslateZh,
  isTranslatingNews,
  onTranslateEn,
  isTranslatingNewsEn,
  showToast
}) {
  if (!isOpen) return null;

  // Tabs bên phải: 'settings' (Cài đặt) | 'seo' (SEO Check)
  const [activeSidebarTab, setActiveSidebarTab] = useState('settings');
  // Chế độ xem trước bài viết hoàn chỉnh (Preview modal)
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  // Chế độ soạn thảo: 'wysiwyg' (Word trực quan) | 'code' (Mã HTML)
  const [editorMode, setEditorMode] = useState('wysiwyg');

  // Input thẻ Tag mới & Danh sách gợi ý thẻ (Tự động đồng bộ và lưu trữ vĩnh viễn)
  const [customTagInput, setCustomTagInput] = useState('');
  const [tagSuggestions, setTagSuggestions] = useState(() => {
    const list = [...SUGGESTED_TAGS_COLLECTION];
    try {
      const saved = localStorage.getItem('casa_admin_saved_tags');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          parsed.forEach((t) => {
            if (t && !list.includes(t)) list.push(t);
          });
        }
      }
    } catch (_) {}
    return list;
  });

  useEffect(() => {
    getRtdbTags().then((fetchedTags) => {
      if (fetchedTags && Array.isArray(fetchedTags) && fetchedTags.length > 0) {
        setTagSuggestions((prev) => {
          const merged = [...prev];
          fetchedTags.forEach((t) => {
            if (t && !merged.includes(t)) merged.push(t);
          });
          return merged;
        });
      }
    });
  }, []);

  // Tìm kiếm sản phẩm đính kèm
  const [productSearch, setProductSearch] = useState('');

  // Dropdown AI Auto-Design
  const [aiMenuOpen, setAiMenuOpen] = useState(false);

  // Modal chèn hình ảnh vào nội dung bài viết ("giống Word")
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [imageModalTab, setImageModalTab] = useState('upload'); // 'upload' | 'url' | 'samples'
  const [imageSrc, setImageSrc] = useState('');
  const [imageCaption, setImageCaption] = useState('');
  const [imageAlt, setImageAlt] = useState('');
  const [imageAlign, setImageAlign] = useState('center'); // 'center' | 'left' | 'right' | 'full'
  const [imageWidth, setImageWidth] = useState('100%'); // '100%' | '75%' | '50%'
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadError, setImageUploadError] = useState(null);

  // Modal chèn liên kết (Link)
  const [linkModalOpen, setLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');
  const [linkNewTab, setLinkNewTab] = useState(true);

  // Trạng thái đang lưu bài
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Chế độ giao diện: 'light' (Sáng - Mặc định, chuẩn Word / CMS) | 'dark' (Tối)
  const [editorTheme, setEditorTheme] = useState(() => {
    try {
      const saved = localStorage.getItem('casa_editor_theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return 'dark';
    } catch (_) {
      return 'dark';
    }
  });
  const isDark = editorTheme === 'dark';
  const toggleTheme = () => {
    const next = isDark ? 'light' : 'dark';
    setEditorTheme(next);
    try {
      localStorage.setItem('casa_editor_theme', next);
    } catch (_) {}
  };

  // Ref của vùng soạn thảo WYSIWYG
  const editorRef = useRef(null);
  const savedSelectionRangeRef = useRef(null);

  // Accordion mở rộng (Công thức Barista & Đa ngôn ngữ)
  const [showRecipeBox, setShowRecipeBox] = useState(
    Boolean(newsFormData.category === 'cong-thuc' || newsFormData.recipeBox)
  );
  const [showTranslations, setShowTranslations] = useState(false);
  const [showAttachedProducts, setShowAttachedProducts] = useState(false);

  // Tab ngôn ngữ đang soạn thảo trực tiếp: 'vi' (Tiếng Việt) | 'zh' (繁體中文) | 'en' (English)
  const [activeLanguageTab, setActiveLanguageTab] = useState('vi');
  const [previewLang, setPreviewLang] = useState('vi');
  const [previewTheme, setPreviewTheme] = useState('light');

  // Tự động khởi tạo / đồng bộ Slug theo Title (nếu chưa có slug hoặc slug đang mang giá trị tạm như bai-viet-...)
  useEffect(() => {
    if (newsFormData?.title) {
      const isTempSlug = !newsFormData.slug || newsFormData.slug.startsWith('bai-viet-') || newsFormData.slug.startsWith('news_');
      if (isTempSlug) {
        const generated = slugify(newsFormData.title);
        if (generated) {
          setNewsFormData((prev) => ({ ...prev, slug: generated }));
        }
      }
    }
  }, [newsFormData?.title, newsFormData?.slug]);

  // Lấy nội dung theo ngôn ngữ đang chọn
  const getCurrentContent = () => {
    if (activeLanguageTab === 'zh') return newsFormData.contentZh || '';
    if (activeLanguageTab === 'en') return newsFormData.contentEn || '';
    return newsFormData.content || '';
  };

  const getCurrentTitle = () => {
    if (activeLanguageTab === 'zh') return newsFormData.titleZh || '';
    if (activeLanguageTab === 'en') return newsFormData.titleEn || '';
    return newsFormData.title || '';
  };

  const getCurrentExcerpt = () => {
    if (activeLanguageTab === 'zh') return newsFormData.excerptZh || '';
    if (activeLanguageTab === 'en') return newsFormData.excerptEn || '';
    return newsFormData.excerpt || '';
  };

  // Chuyển đổi tab ngôn ngữ trong Word canvas
  const handleSwitchLanguageTab = (targetLang) => {
    if (targetLang === activeLanguageTab) return;

    // 1. Lưu nội dung hiện tại của editor vào đúng ngôn ngữ cũ
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      if (activeLanguageTab === 'vi') setNewsFormData((prev) => ({ ...prev, content: currentHtml }));
      else if (activeLanguageTab === 'zh') setNewsFormData((prev) => ({ ...prev, contentZh: currentHtml }));
      else if (activeLanguageTab === 'en') setNewsFormData((prev) => ({ ...prev, contentEn: currentHtml }));
    }

    // 2. Chuyển tab
    setActiveLanguageTab(targetLang);

    // 3. Tải nội dung của ngôn ngữ mới vào editor
    setTimeout(() => {
      if (editorRef.current) {
        let nextHtml = '';
        if (targetLang === 'vi') nextHtml = newsFormData.content || '';
        else if (targetLang === 'zh') nextHtml = newsFormData.contentZh || '';
        else if (targetLang === 'en') nextHtml = newsFormData.contentEn || '';
        editorRef.current.innerHTML = nextHtml;
      }
    }, 20);
  };

  // Dịch toàn bộ bài viết (Cả Tiêu đề, Tóm tắt VÀ Toàn bộ Nội dung bài viết WYSIWYG)
  const handleTranslateArticle = async (targetLang) => {
    // 1. Lưu nội dung mới nhất từ editor
    const currentEditorHtml = editorRef.current ? editorRef.current.innerHTML : (newsFormData.content || '');
    const latestFormData = {
      ...newsFormData,
      content: activeLanguageTab === 'vi' ? currentEditorHtml : (newsFormData.content || ''),
      contentZh: activeLanguageTab === 'zh' ? currentEditorHtml : (newsFormData.contentZh || ''),
      contentEn: activeLanguageTab === 'en' ? currentEditorHtml : (newsFormData.contentEn || '')
    };

    if (!latestFormData.title?.trim() && !latestFormData.content?.trim()) {
      showToast?.('Vui lòng nhập Tiêu đề hoặc Nội dung bài viết tiếng Việt trước khi dịch!', 'warning');
      return;
    }

    if (targetLang === 'zh') {
      const res = await onTranslateZh(latestFormData);
      if (res) {
        setNewsFormData((prev) => ({
          ...prev,
          titleZh: res.titleZh || prev.titleZh,
          excerptZh: res.excerptZh || prev.excerptZh,
          contentZh: res.contentZh || prev.contentZh
        }));
        // Tự động chuyển ngay sang tab tiếng Trung để xem và sửa toàn văn bài viết dịch
        setActiveLanguageTab('zh');
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.innerHTML = res.contentZh || '';
          }
        }, 50);
      }
    } else if (targetLang === 'en') {
      const res = await onTranslateEn(latestFormData);
      if (res) {
        setNewsFormData((prev) => ({
          ...prev,
          titleEn: res.titleEn || prev.titleEn,
          excerptEn: res.excerptEn || prev.excerptEn,
          contentEn: res.contentEn || prev.contentEn
        }));
        // Tự động chuyển ngay sang tab tiếng Anh để xem và sửa toàn văn bài viết dịch
        setActiveLanguageTab('en');
        setTimeout(() => {
          if (editorRef.current) {
            editorRef.current.innerHTML = res.contentEn || '';
          }
        }, 50);
      }
    }
  };

  // Đồng bộ nội dung vào editor khi tab ngôn ngữ hoặc dữ liệu từ AI thay đổi
  useEffect(() => {
    if (editorRef.current) {
      let expectedHtml = '';
      if (activeLanguageTab === 'vi') expectedHtml = newsFormData.content || '';
      else if (activeLanguageTab === 'zh') expectedHtml = newsFormData.contentZh || '';
      else if (activeLanguageTab === 'en') expectedHtml = newsFormData.contentEn || '';

      if (editorRef.current.innerHTML !== expectedHtml) {
        editorRef.current.innerHTML = expectedHtml;
      }
    }
  }, [activeLanguageTab, newsFormData.content, newsFormData.contentZh, newsFormData.contentEn]);

  // Lưu selection range trước khi click toolbar hoặc mở popup
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0) {
      savedSelectionRangeRef.current = sel.getRangeAt(0).cloneRange();
    }
  };

  const restoreSelection = () => {
    if (savedSelectionRangeRef.current) {
      const sel = window.getSelection();
      sel.removeAllRanges();
      sel.addRange(savedSelectionRangeRef.current);
    }
  };

  // Hàm thực thi lệnh định dạng Word (Bold, Italic, Headings, Lists...)
  const execCmd = (command, value = null) => {
    if (editorRef.current) {
      editorRef.current.focus();
      restoreSelection();
      document.execCommand(command, false, value);
      handleEditorInput();
      saveSelection();
    }
  };

  // Cập nhật state khi người dùng gõ vào editor
  const handleEditorInput = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      if (activeLanguageTab === 'vi') {
        setNewsFormData((prev) => ({ ...prev, content: html }));
      } else if (activeLanguageTab === 'zh') {
        setNewsFormData((prev) => ({ ...prev, contentZh: html }));
      } else if (activeLanguageTab === 'en') {
        setNewsFormData((prev) => ({ ...prev, contentEn: html }));
      }
    }
  };

  // Mở modal chèn hình ảnh
  const openInsertImageModal = () => {
    saveSelection();
    setImageSrc('');
    setImageCaption('');
    setImageAlt('');
    setImageAlign('center');
    setImageWidth('100%');
    setImageUploadError(null);
    setImageModalOpen(true);
  };

  // Xử lý tải ảnh từ máy tính (nén WebP tự động, 0ms, không tốn dung lượng)
  const handleImageFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    if (!file.type.startsWith('image/')) {
      setImageUploadError('Vui lòng chọn tệp hình ảnh hợp lệ (PNG, JPG, WebP, GIF)!');
      return;
    }

    setImageUploadError(null);
    setIsUploadingImage(true);
    try {
      const optimized = await optimizeImageToDataUrl(file, { maxWidth: 1400, maxHeight: 1400, quality: 0.85 });
      setImageSrc(optimized.dataUrl);
      if (!imageCaption) {
        setImageCaption(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      if (!imageAlt) {
        setImageAlt(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
    } catch (err) {
      setImageUploadError('Không thể xử lý ảnh: ' + (err.message || 'Lỗi đọc tệp'));
    } finally {
      setIsUploadingImage(false);
    }
  };

  // Chèn hình ảnh vào đúng vị trí con trỏ (giống Word)
  const handleInsertImageToEditor = () => {
    if (!imageSrc) {
      setImageUploadError('Vui lòng chọn hoặc dán đường dẫn hình ảnh!');
      return;
    }

    if (editorRef.current) {
      editorRef.current.focus();
      restoreSelection();

      let alignStyle = 'margin: 1.5rem auto; text-align: center;';
      let floatClass = '';
      if (imageAlign === 'left') {
        alignStyle = 'float: left; margin: 0.75rem 1.5rem 1rem 0; max-width: 48%;';
        floatClass = 'float-left mr-4 mb-3';
      } else if (imageAlign === 'right') {
        alignStyle = 'float: right; margin: 0.75rem 0 1rem 1.5rem; max-width: 48%;';
        floatClass = 'float-right ml-4 mb-3';
      } else if (imageAlign === 'full') {
        alignStyle = 'width: 100%; margin: 2rem 0; text-align: center;';
      }

      const imgHtml = `
        <figure class="article-figure my-6 clear-both ${floatClass}" style="${alignStyle}">
          <img 
            src="${imageSrc}" 
            alt="${imageAlt || imageCaption || newsFormData.title || 'Hình ảnh bài viết CASA'}" 
            title="${imageCaption || imageAlt || ''}"
            style="width: ${imageWidth}; max-width: 100%; height: auto; border-radius: 1rem; box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.12); border: 1px solid rgba(0,0,0,0.06); display: inline-block;"
            loading="lazy"
          />
          ${imageCaption ? `<figcaption style="margin-top: 0.5rem; font-size: 0.85rem; color: #6b7280; font-style: italic; text-align: center;">${imageCaption}</figcaption>` : ''}
        </figure>
        <p><br/></p>
      `;

      document.execCommand('insertHTML', false, imgHtml);
      handleEditorInput();
      setImageModalOpen(false);
      showToast('Đã chèn hình ảnh vào bài viết!', 'success');
    }
  };

  // Mở modal chèn Link
  const openInsertLinkModal = () => {
    saveSelection();
    const sel = window.getSelection();
    setLinkText(sel ? sel.toString() : '');
    setLinkUrl('');
    setLinkModalOpen(true);
  };

  const handleInsertLink = () => {
    if (!linkUrl) return;
    if (editorRef.current) {
      editorRef.current.focus();
      restoreSelection();

      const href = linkUrl.startsWith('http') || linkUrl.startsWith('/') ? linkUrl : `https://${linkUrl}`;
      const text = linkText || href;
      const targetAttr = linkNewTab ? 'target="_blank" rel="noopener noreferrer"' : '';
      const linkHtml = `<a href="${href}" ${targetAttr} class="text-tea-primary dark:text-tea-mint underline font-semibold hover:opacity-80">${text}</a>`;

      document.execCommand('insertHTML', false, linkHtml);
      handleEditorInput();
      setLinkModalOpen(false);
    }
  };

  // Chèn bảng mẫu 2 cột x 3 dòng chuẩn F&B
  const handleInsertTable = () => {
    if (editorRef.current) {
      editorRef.current.focus();
      restoreSelection();
      const tableHtml = `
        <table style="width: 100%; border-collapse: collapse; margin: 1.5rem 0; font-size: 0.9rem;">
          <thead>
            <tr style="background-color: rgba(46, 125, 50, 0.1); border-bottom: 2px solid #2e7d32;">
              <th style="padding: 10px; text-align: left; font-weight: bold;">Hạng mục / Tiêu chí</th>
              <th style="padding: 10px; text-align: left; font-weight: bold;">Định lượng / Thông số Barista</th>
            </tr>
          </thead>
          <tbody>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px;">Trà Nền CASA</td>
              <td style="padding: 10px;">120ml (Tỷ lệ ủ 1:30 ở 90°C trong 10 phút)</td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 10px;">Bột Kem Béo CASA</td>
              <td style="padding: 10px;">30g (Khuấy tan hoàn toàn khi trà còn ấm)</td>
            </tr>
            <tr>
              <td style="padding: 10px;">Đường mía lỏng / Syrup</td>
              <td style="padding: 10px;">20ml (Tùy chỉnh theo khẩu vị từng vùng)</td>
            </tr>
          </tbody>
        </table>
        <p><br/></p>
      `;
      document.execCommand('insertHTML', false, tableHtml);
      handleEditorInput();
      showToast('Đã chèn bảng thông số F&B!', 'success');
    }
  };

  // Thêm / gỡ Thẻ Tag & Tự động lưu vào thư viện dùng chung
  const handleAddTag = (tagToAdd) => {
    const raw = (tagToAdd || customTagInput).trim();
    if (!raw) return;
    const val = raw.replace(/^#+/, '').trim();
    if (!val) return;

    const currentTags = Array.isArray(newsFormData.tags) ? [...newsFormData.tags] : [];
    if (!currentTags.includes(val)) {
      setNewsFormData({ ...newsFormData, tags: [...currentTags, val] });
    }
    setCustomTagInput('');

    // Tự động lưu tag vào thư viện để lần sau các bài khác sử dụng
    setTagSuggestions((prev) => {
      if (!prev.includes(val)) {
        return [...prev, val];
      }
      return prev;
    });
    saveRtdbTag(val);
  };

  const handleRemoveTag = (tagToRemove) => {
    const currentTags = Array.isArray(newsFormData.tags) ? newsFormData.tags : [];
    setNewsFormData({
      ...newsFormData,
      tags: currentTags.filter((t) => t !== tagToRemove)
    });
  };

  // Xử lý upload ảnh đại diện (Featured Thumbnail)
  const handleThumbnailSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';

    try {
      showToast('Đang nén và tải ảnh đại diện...', 'info');
      const optimized = await optimizeImageToDataUrl(file, { maxWidth: 1200, maxHeight: 1200, quality: 0.84 });
      setNewsFormData({ ...newsFormData, image: optimized.dataUrl });
      showToast('Đã cập nhật ảnh đại diện bài viết!', 'success');
    } catch (err) {
      showToast('Lỗi tải ảnh: ' + err.message, 'error');
    }
  };

  // Lưu bài viết (Xuất bản hoặc Lưu nháp)
  const handleSaveAction = async (status = 'PUBLISHED') => {
    let finalContent = newsFormData.content || '';
    let finalContentZh = newsFormData.contentZh || '';
    let finalContentEn = newsFormData.contentEn || '';

    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      if (activeLanguageTab === 'vi') finalContent = currentHtml;
      else if (activeLanguageTab === 'zh') finalContentZh = currentHtml;
      else if (activeLanguageTab === 'en') finalContentEn = currentHtml;
    }

    if (!newsFormData.title?.trim() && !newsFormData.titleZh?.trim() && !newsFormData.titleEn?.trim()) {
      showToast('Vui lòng nhập Tiêu đề bài viết!', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const isTemp = !newsFormData.slug || newsFormData.slug.startsWith('bai-viet-') || newsFormData.slug.startsWith('news_');
      const generatedSlug = (!isTemp && newsFormData.slug.trim()) ? slugify(newsFormData.slug) : slugify(newsFormData.title || 'bai-viet-casa');
      const articlePayload = {
        ...newsFormData,
        content: finalContent,
        contentZh: finalContentZh,
        contentEn: finalContentEn,
        slug: generatedSlug,
        status: status,
        author: newsFormData.author || 'CASA R&D Team',
        readTime: newsFormData.readTime || '4 phút',
        date: newsFormData.date || new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' })
      };

      await onSave(articlePayload);
    } catch (err) {
      showToast('Lỗi lưu bài viết: ' + (err.message || 'Thất bại'), 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Tính toán SEO Check & Word count theo ngôn ngữ hiện hành
  const currentTitle = getCurrentTitle();
  const currentExcerpt = getCurrentExcerpt();
  const currentContent = getCurrentContent();
  const titleLength = currentTitle.trim().length;
  const excerptLength = currentExcerpt.trim().length;
  const hasThumbnail = Boolean(newsFormData.image);
  const hasCategory = Boolean(newsFormData.category);
  const tagsCount = (newsFormData.tags || []).length;
  const hasHeadings = /<h[1-4]/i.test(currentContent);
  const hasInlineImages = /<img/i.test(currentContent);
  const wordCount = currentContent.replace(/<[^>]+>/g, ' ').trim().split(/\s+/).filter(Boolean).length;

  const seoScore = [
    titleLength >= 40 && titleLength <= 70,
    excerptLength >= 90 && excerptLength <= 180,
    hasThumbnail,
    hasCategory,
    tagsCount >= 3,
    hasHeadings,
    hasInlineImages
  ].filter(Boolean).length;

  return (
    <div className={`fixed inset-0 z-50 overflow-hidden flex flex-col font-sans transition-colors duration-200 article-studio-root ${isDark ? "dark bg-[#0A100C] text-gray-100 theme-dark" : "bg-[#F6F8F7] text-gray-900 theme-light"}`}>
      <style>{`
        /* Force color-scheme: dark so Chromium/Windows never uses black OS brushes */
        .article-studio-root,
        .article-studio-root *,
        .article-studio-root input,
        .article-studio-root textarea,
        .article-studio-root select,
        .article-studio-root select option {
          color-scheme: dark !important;
        }

        /* Force crisp pure white text on EVERYTHING in Article Studio */
        .article-studio-root,
        .article-studio-root input,
        .article-studio-root textarea,
        .article-studio-root select,
        .article-studio-root select option,
        .article-studio-root .wysiwyg-canvas,
        .article-studio-root .wysiwyg-canvas *,
        .admin-portal .article-studio-root,
        .admin-portal .article-studio-root input,
        .admin-portal .article-studio-root textarea,
        .admin-portal .article-studio-root select,
        .admin-portal .article-studio-root select option,
        .admin-portal .article-studio-root .wysiwyg-canvas,
        .admin-portal .article-studio-root .wysiwyg-canvas * {
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
        }

        .article-studio-root input::placeholder,
        .article-studio-root textarea::placeholder,
        .article-studio-root input::-webkit-input-placeholder,
        .article-studio-root textarea::-webkit-input-placeholder,
        .admin-portal .article-studio-root input::placeholder,
        .admin-portal .article-studio-root textarea::placeholder {
          color: #D1D5DB !important;
          -webkit-text-fill-color: #D1D5DB !important;
          opacity: 1 !important;
        }

        .article-studio-root select,
        .article-studio-root select option,
        .admin-portal .article-studio-root select,
        .admin-portal .article-studio-root select option {
          background-color: #0E1611 !important;
          color: #FFFFFF !important;
          -webkit-text-fill-color: #FFFFFF !important;
          color-scheme: dark !important;
        }

        .wysiwyg-canvas[contenteditable]:empty:before {
          content: attr(data-placeholder) !important;
          color: #9CA3AF !important;
          -webkit-text-fill-color: #9CA3AF !important;
          pointer-events: none;
          display: block;
          font-style: italic;
        }

        .wysiwyg-canvas a {
          color: #38BDF8 !important;
          -webkit-text-fill-color: #38BDF8 !important;
          text-decoration: underline !important;
        }

        .wysiwyg-canvas blockquote {
          border-left-color: #10B981 !important;
          color: #E2E8F0 !important;
          -webkit-text-fill-color: #E2E8F0 !important;
        }
      `}</style>

      {/* ==================================================================== */}
      {/* 1. TOP HEADER BAR: Điều hướng, Tiêu đề, Xem trước, Lưu nháp, Xuất bản */}
      {/* ==================================================================== */}
      <header className="h-16 px-4 sm:px-6 border-b border-gray-200 dark:border-[#1E2E23] bg-white/95 dark:bg-[#0E1611]/95 backdrop-blur-md flex items-center justify-between gap-4 shrink-0 z-20 shadow-xs dark:shadow-none">
        {/* Left: Nút Quay lại & Tiêu đề studio */}
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onClose}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 dark:bg-[#17231B] hover:bg-gray-200 dark:hover:bg-[#203126] text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 border border-gray-300 dark:border-[#273B2E] transition-all text-xs font-semibold cursor-pointer shrink-0 shadow-2xs"
          >
            <ArrowLeft className="w-4 h-4 text-emerald-400" />
            <span className="hidden sm:inline">Quay lại</span>
          </button>

          <div className="h-4 w-px bg-white/10 hidden sm:block" />

          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate flex items-center gap-2">
              <span>{editingNews ? 'Chỉnh sửa bài viết' : 'Viết bài mới'}</span>
              <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                newsFormData.status === 'DRAFT'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
              }`}>
                {newsFormData.status === 'DRAFT' ? 'Bản Nháp' : 'Xuất Bản'}
              </span>
            </h1>
          </div>
        </div>

        {/* Right: Các nút Hành động */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          {/* Nút dịch toàn bộ bài viết sang Tiếng Trung Phồn Thể 繁中 */}
          <button
            type="button"
            disabled={isTranslatingNews}
            onClick={() => handleTranslateArticle('zh')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-purple-50 dark:bg-purple-950/40 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-200 hover:text-purple-900 dark:hover:text-white border border-purple-200 dark:border-purple-500/40 transition-all text-xs font-bold cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Dịch toàn bộ bài viết (Cả Tiêu đề, Tóm tắt và Toàn văn nội dung) sang Tiếng Trung Phồn Thể 繁中"
          >
            <span className="text-sm">🇹🇼</span>
            <span className="hidden sm:inline">{isTranslatingNews ? 'Đang dịch...' : 'Dịch toàn bài 繁中'}</span>
          </button>

          {/* Nút dịch toàn bộ bài viết sang Tiếng Anh English */}
          <button
            type="button"
            disabled={isTranslatingNewsEn}
            onClick={() => handleTranslateArticle('en')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-50 dark:bg-blue-950/40 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-200 hover:text-blue-900 dark:hover:text-white border border-blue-200 dark:border-blue-500/40 transition-all text-xs font-bold cursor-pointer disabled:opacity-50 shadow-2xs"
            title="Dịch toàn bộ bài viết (Cả Tiêu đề, Tóm tắt và Toàn văn nội dung) sang Tiếng Anh English"
          >
            <span className="text-sm">🇬🇧</span>
            <span className="hidden sm:inline">{isTranslatingNewsEn ? 'Đang dịch...' : 'Dịch toàn bài English'}</span>
          </button>

          {/* Menu AI Auto-Design & Mẫu bài viết */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setAiMenuOpen(!aiMenuOpen)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-600/30 dark:via-indigo-600/30 dark:to-purple-600/30 text-indigo-700 dark:text-blue-200 border border-indigo-200 dark:border-blue-500/40 text-xs font-bold transition-all shadow-2xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
              <span className="hidden md:inline">Công cụ AI</span>
              <ChevronDown className="w-3 h-3 text-blue-300" />
            </button>

            {aiMenuOpen && (
              <div className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-[#141E17] border border-gray-200 dark:border-[#273B2E] shadow-xl p-2 z-50 space-y-1 text-xs text-gray-800 dark:text-gray-200">
                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Tự động thiết kế bài viết (AI)
                </div>
                <button
                  type="button"
                  disabled={isDesigningNews}
                  onClick={() => {
                    setAiMenuOpen(false);
                    onAiAutoDesign('recipe');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1E2E23] text-gray-700 dark:text-gray-200 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <ChefHat className="w-4 h-4 text-amber-400" />
                  <span>🍹 Mẫu Công thức Barista SOP</span>
                </button>
                <button
                  type="button"
                  disabled={isDesigningNews}
                  onClick={() => {
                    setAiMenuOpen(false);
                    onAiAutoDesign('trend');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1E2E23] text-gray-700 dark:text-gray-200 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>📈 Mẫu Báo cáo Xu hướng 2026</span>
                </button>
                <button
                  type="button"
                  disabled={isDesigningNews}
                  onClick={() => {
                    setAiMenuOpen(false);
                    onAiAutoDesign('knowledge');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-gray-100 dark:hover:bg-[#1E2E23] text-gray-700 dark:text-gray-200 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <BookOpen className="w-4 h-4 text-emerald-400" />
                  <span>🔬 Mẫu Bí quyết Chiết xuất R&D</span>
                </button>

                <div className="border-t border-white/10 my-1" />

                <div className="px-3 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Dịch thuật trọn gói bài viết
                </div>
                <button
                  type="button"
                  disabled={isTranslatingNews}
                  onClick={() => {
                    setAiMenuOpen(false);
                    handleTranslateArticle('zh');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-purple-50 dark:hover:bg-[#1E2E23] text-purple-700 dark:text-purple-300 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <span>🇹🇼</span>
                  <span>{isTranslatingNews ? 'Đang dịch toàn bài...' : 'Dịch toàn bộ bài viết sang 繁中'}</span>
                </button>
                <button
                  type="button"
                  disabled={isTranslatingNewsEn}
                  onClick={() => {
                    setAiMenuOpen(false);
                    handleTranslateArticle('en');
                  }}
                  className="w-full text-left px-3 py-2 rounded-xl hover:bg-blue-50 dark:hover:bg-[#1E2E23] text-blue-700 dark:text-blue-300 flex items-center gap-2 transition-colors disabled:opacity-50"
                >
                  <span>🇬🇧</span>
                  <span>{isTranslatingNewsEn ? 'Đang dịch toàn bài...' : 'Dịch toàn bộ bài viết sang English'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Nút Chuyển đổi giao diện Sáng / Tối */}
          <button
            type="button"
            onClick={toggleTheme}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
              isDark
                ? 'bg-[#17231B] hover:bg-[#203126] text-amber-300 border border-[#273B2E]'
                : 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 shadow-2xs'
            }`}
            title={isDark ? 'Chuyển sang Giao diện Sáng (Chuẩn giấy trắng chữ đen)' : 'Chuyển sang Giao diện Tối (Dark Mode)'}
          >
            {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-amber-600" />}
            <span className="hidden md:inline">{isDark ? 'Giao diện Sáng' : 'Giao diện Tối'}</span>
          </button>

          {/* Xem trước */}
          <button
            type="button"
            onClick={() => {
              if (editorRef.current) {
                const currentHtml = editorRef.current.innerHTML;
                if (activeLanguageTab === 'vi') setNewsFormData((prev) => ({ ...prev, content: currentHtml }));
                else if (activeLanguageTab === 'zh') setNewsFormData((prev) => ({ ...prev, contentZh: currentHtml }));
                else if (activeLanguageTab === 'en') setNewsFormData((prev) => ({ ...prev, contentEn: currentHtml }));
              }
              setPreviewLang(activeLanguageTab);
              setIsPreviewModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-gray-100 dark:bg-[#17231B] hover:bg-gray-200 dark:hover:bg-[#203126] text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-[#273B2E] transition-all text-xs font-semibold cursor-pointer shadow-2xs"
          >
            <Eye className="w-3.5 h-3.5 text-gray-400" />
            <span className="hidden sm:inline">Xem trước</span>
          </button>

          {/* Lưu nháp */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSaveAction('DRAFT')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-50 dark:bg-[#1B291F] hover:bg-amber-100 dark:hover:bg-[#233528] text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-500/30 transition-all text-xs font-bold cursor-pointer disabled:opacity-50 shadow-2xs"
          >
            <Save className="w-3.5 h-3.5" />
            <span>Lưu nháp</span>
          </button>

          {/* Xuất bản */}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => handleSaveAction('PUBLISHED')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-lg shadow-emerald-950/40 transition-all cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSubmitting ? 'Đang xuất bản...' : 'Xuất bản'}</span>
          </button>
        </div>
      </header>

      {/* ==================================================================== */}
      {/* 2. MAIN 2-COLUMN WORKSPACE: KHU VỰC SOẠN THẢO (TRÁI) & CÀI ĐẶT (PHẢI) */}
      {/* ==================================================================== */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-[1600px] mx-auto p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
            
            {/* ============================================================== */}
            {/* CỘT TRÁI (COL-8): THANH CHUYỂN NGÔN NGỮ + TIÊU ĐỀ + WORD WYSIWYG */}
            {/* ============================================================== */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* THANH CHUYỂN ĐỔI TAB NGÔN NGỮ (VI | ZH | EN) */}
              <div className="p-3 sm:p-4 rounded-2xl bg-white dark:bg-[#111A13] border border-gray-200 dark:border-[#223326] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider pl-1 hidden sm:inline">
                    Ngôn ngữ soạn thảo:
                  </span>

                  {/* Tab Tiếng Việt */}
                  <button
                    type="button"
                    onClick={() => handleSwitchLanguageTab('vi')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      activeLanguageTab === 'vi'
                        ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-950/50 ring-2 ring-emerald-400/50'
                        : 'bg-gray-100 dark:bg-[#152219] text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 hover:bg-gray-200 dark:hover:bg-[#1C2C21] border border-gray-200 dark:border-[#26382B]'
                    }`}
                  >
                    <span className="text-base">🇻🇳</span>
                    <span>Tiếng Việt (Gốc)</span>
                  </button>

                  {/* Tab Tiếng Trung */}
                  <button
                    type="button"
                    onClick={() => handleSwitchLanguageTab('zh')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      activeLanguageTab === 'zh'
                        ? 'bg-purple-600 text-white shadow-lg shadow-purple-950/50 ring-2 ring-purple-400/50'
                        : 'bg-gray-100 dark:bg-[#152219] text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 hover:bg-gray-200 dark:hover:bg-[#1C2C21] border border-gray-300 dark:border-[#26382B]'
                    }`}
                  >
                    <span className="text-base">🇹🇼</span>
                    <span>繁體中文</span>
                    {newsFormData.contentZh || newsFormData.titleZh ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-semibold">
                        ✓ Có bản dịch
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 font-semibold">
                        Chưa dịch
                      </span>
                    )}
                  </button>

                  {/* Tab Tiếng Anh */}
                  <button
                    type="button"
                    onClick={() => handleSwitchLanguageTab('en')}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                      activeLanguageTab === 'en'
                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-950/50 ring-2 ring-blue-400/50'
                        : 'bg-gray-100 dark:bg-[#152219] text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 hover:bg-gray-200 dark:hover:bg-[#1C2C21] border border-gray-300 dark:border-[#26382B]'
                    }`}
                  >
                    <span className="text-base">🇬🇧</span>
                    <span>English</span>
                    {newsFormData.contentEn || newsFormData.titleEn ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-semibold">
                        ✓ Có bản dịch
                      </span>
                    ) : (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-950/80 text-amber-300 border border-amber-500/40 font-semibold">
                        Chưa dịch
                      </span>
                    )}
                  </button>
                </div>

                {/* Nút dịch nhanh toàn bài */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    disabled={isTranslatingNews}
                    onClick={() => handleTranslateArticle('zh')}
                    className="px-3 py-1.5 rounded-xl bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                    title="Dịch toàn bộ bài viết (Cả Tiêu đề, Tóm tắt & Nội dung) sang Tiếng Trung Phồn Thể"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-purple-300 ${isTranslatingNews ? 'animate-spin' : ''}`} />
                    <span>{isTranslatingNews ? 'Đang dịch...' : 'Dịch toàn bài 繁中'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isTranslatingNewsEn}
                    onClick={() => handleTranslateArticle('en')}
                    className="px-3 py-1.5 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/40 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                    title="Dịch toàn bộ bài viết (Cả Tiêu đề, Tóm tắt & Nội dung) sang Tiếng Anh"
                  >
                    <Sparkles className={`w-3.5 h-3.5 text-blue-300 ${isTranslatingNewsEn ? 'animate-spin' : ''}`} />
                    <span>{isTranslatingNewsEn ? 'Đang dịch...' : 'Dịch toàn bài EN'}</span>
                  </button>
                </div>
              </div>

              {/* 1. Tiêu đề bài viết */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#111A13] border border-[#223326] shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider">
                    {activeLanguageTab === 'vi' && 'Tiêu đề bài viết (Tiếng Việt - Bản gốc) *'}
                    {activeLanguageTab === 'zh' && 'Tiêu đề bài viết Tiếng Trung Phồn Thể (繁體中文 標題) *'}
                    {activeLanguageTab === 'en' && 'Article Title in English (Tiêu đề Tiếng Anh) *'}
                  </label>
                  <div className="flex items-center gap-2">
                    {activeLanguageTab === 'zh' && (
                      <span className="text-[11px] font-bold text-purple-300 flex items-center gap-1">
                        <span>🇹🇼</span> Đang soạn Tiếng Trung
                      </span>
                    )}
                    {activeLanguageTab === 'en' && (
                      <span className="text-[11px] font-bold text-blue-300 flex items-center gap-1">
                        <span>🇬🇧</span> Đang soạn English
                      </span>
                    )}
                    {activeLanguageTab === 'vi' && (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <span>🇻🇳</span> Đang soạn Tiếng Việt
                      </span>
                    )}
                  </div>
                </div>

                <input
                  type="text"
                  required
                  placeholder={
                    activeLanguageTab === 'vi'
                      ? 'Tiêu đề bài viết tiếng Việt...'
                      : activeLanguageTab === 'zh'
                      ? '輸入繁體中文文章標題... (hoặc bấm nút Dịch toàn bài 繁中)'
                      : 'Enter article title in English... (or click Translate full article)'
                  }
                  value={
                    activeLanguageTab === 'vi'
                      ? newsFormData.title || ''
                      : activeLanguageTab === 'zh'
                      ? newsFormData.titleZh || ''
                      : newsFormData.titleEn || ''
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    if (activeLanguageTab === 'vi') {
                      setNewsFormData({
                        ...newsFormData,
                        title: val,
                        slug: slugify(val)
                      });
                    } else if (activeLanguageTab === 'zh') {
                      setNewsFormData({
                        ...newsFormData,
                        titleZh: val
                      });
                    } else if (activeLanguageTab === 'en') {
                      setNewsFormData({
                        ...newsFormData,
                        titleEn: val
                      });
                    }
                  }}
                  style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF', backgroundColor: '#090F0B', colorScheme: 'dark' }}
                  className="w-full px-4 py-3 rounded-xl bg-[#090F0B] border border-[#26382B] text-white placeholder:text-gray-300 text-lg sm:text-xl font-bold outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all shadow-2xs"
                />
                
                {/* Đường dẫn Slug URL */}
                <div className="flex flex-wrap items-center gap-2 text-xs text-gray-400 pt-1">
                  <span className="text-gray-500 font-semibold">Đường dẫn (Slug URL):</span>
                  <div className="flex items-center gap-2 flex-1 min-w-[260px]">
                    <span className="text-emerald-400 font-mono text-[11px] flex items-center gap-1 flex-1">
                      <span className="text-gray-500 hidden sm:inline">https://nguyenlieuphachecasa.com/news/</span>
                      <input
                        type="text"
                        value={newsFormData.slug || ''}
                        onChange={(e) => setNewsFormData({ ...newsFormData, slug: slugify(e.target.value) })}
                        placeholder="duong-dan-bai-viet"
                        className="bg-transparent text-emerald-400 font-mono text-[11px] border-b border-dashed border-emerald-500/50 outline-none px-1 flex-1 min-w-[150px]"
                        style={{ color: '#34D399', WebkitTextFillColor: '#34D399' }}
                      />
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        const titleToUse = newsFormData.title || '';
                        const generated = slugify(titleToUse);
                        setNewsFormData((prev) => ({ ...prev, slug: generated }));
                        if (showToast) {
                          showToast(`Đã đồng bộ Slug: ${generated}`, 'success');
                        }
                      }}
                      title="Tự động đồng bộ Slug theo tiêu đề bài viết"
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 hover:text-emerald-300 border border-emerald-500/30 text-[10px] font-bold transition-all cursor-pointer shrink-0 flex items-center gap-1 shadow-2xs"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Tạo theo tiêu đề</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* 2. Trình soạn thảo Rich Text Editor (Word-like WYSIWYG) */}
              <div className="rounded-2xl bg-[#111A13] border border-[#223326] shadow-sm overflow-hidden">
                {/* Thanh công cụ Toolbar giống Word */}
                <div className="sticky top-0 z-10 p-2 sm:p-2.5 bg-[#141F17] border-b border-[#223326] flex flex-wrap items-center gap-1 text-xs select-none text-white backdrop-blur-sm">
                  
                  {/* Dropdown Định dạng khối (Paragraph / Headings) */}
                  <select
                    onChange={(e) => execCmd('formatBlock', e.target.value)}
                    style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF', backgroundColor: '#0E1611', colorScheme: 'dark' }}
                    className="h-8 px-2 rounded-lg bg-[#0E1611] text-white border border-[#273B2E] text-xs font-semibold outline-none hover:border-emerald-500/50 cursor-pointer shadow-2xs"
                    defaultValue="p"
                  >
                    <option value="p" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>Paragraph</option>
                    <option value="h1" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>Tiêu đề 1 (H1)</option>
                    <option value="h2" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>Tiêu đề 2 (H2)</option>
                    <option value="h3" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>Tiêu đề 3 (H3)</option>
                    <option value="h4" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>Tiêu đề 4 (H4)</option>
                    <option value="blockquote" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>Trích dẫn (Quote)</option>
                  </select>

                  {/* Dropdown Phông chữ */}
                  <select
                    onChange={(e) => execCmd('fontName', e.target.value)}
                    style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF', backgroundColor: '#0E1611', colorScheme: 'dark' }}
                    className="h-8 px-2 rounded-lg bg-[#0E1611] text-white border border-[#273B2E] text-xs font-semibold outline-none hover:border-emerald-500/50 cursor-pointer hidden sm:block shadow-2xs"
                    defaultValue="Montserrat, sans-serif"
                  >
                    <option value="Montserrat, sans-serif" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>Mặc định</option>
                    <option value="Arial, sans-serif" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>Arial</option>
                    <option value="Times New Roman, serif" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>Times New Roman</option>
                    <option value="Georgia, serif" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>Georgia</option>
                    <option value="Courier New, monospace" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>Monospace</option>
                  </select>

                  {/* Dropdown Cỡ chữ */}
                  <select
                    onChange={(e) => execCmd('fontSize', e.target.value)}
                    style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF', backgroundColor: '#0E1611', colorScheme: 'dark' }}
                    className="h-8 px-2 rounded-lg bg-[#0E1611] text-white border border-[#273B2E] text-xs font-semibold outline-none hover:border-emerald-500/50 cursor-pointer hidden md:block shadow-2xs"
                    defaultValue="3"
                  >
                    <option value="2" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>13px</option>
                    <option value="3" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>15px</option>
                    <option value="4" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>18px</option>
                    <option value="5" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>24px</option>
                    <option value="6" style={{ backgroundColor: '#0E1611', color: '#FFFFFF' }}>32px</option>
                  </select>

                  <div className="w-px h-5 bg-white/10 mx-0.5" />

                  {/* Định dạng văn bản cơ bản */}
                  <button
                    type="button"
                    title="In đậm (Bold - Ctrl+B)"
                    onClick={() => execCmd('bold')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <Bold className="w-4 h-4 font-bold" />
                  </button>

                  <button
                    type="button"
                    title="In nghiêng (Italic - Ctrl+I)"
                    onClick={() => execCmd('italic')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <Italic className="w-4 h-4 italic" />
                  </button>

                  <button
                    type="button"
                    title="Gạch dưới (Underline - Ctrl+U)"
                    onClick={() => execCmd('underline')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <Underline className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    title="Gạch ngang chữ (Strikethrough)"
                    onClick={() => execCmd('strikeThrough')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer hidden sm:flex"
                  >
                    <Strikethrough className="w-4 h-4" />
                  </button>

                  <div className="w-px h-5 bg-white/10 mx-0.5" />

                  {/* Chèn liên kết (Link) */}
                  <button
                    type="button"
                    title="Chèn liên kết (Link)"
                    onClick={openInsertLinkModal}
                    className="w-8 h-8 rounded-lg hover:bg-blue-100 dark:hover:bg-[#203126] flex items-center justify-center text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors cursor-pointer"
                  >
                    <LinkIcon className="w-4 h-4" />
                  </button>

                  {/* NÚT ĐẶC BIỆT: CHÈN HÌNH ẢNH VÀO TỪNG MỤC BÀI VIẾT (GIỐNG WORD) */}
                  <button
                    type="button"
                    title="Chèn hình ảnh vào bài viết (Ảnh minh họa, quy trình, công thức)"
                    onClick={openInsertImageModal}
                    className="px-2.5 h-8 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 flex items-center gap-1.5 font-bold transition-all shadow-sm cursor-pointer"
                  >
                    <ImagePlus className="w-4 h-4 text-emerald-400" />
                    <span className="hidden sm:inline text-xs">Thêm ảnh</span>
                  </button>

                  <div className="w-px h-5 bg-white/10 mx-0.5" />

                  {/* Căn lề */}
                  <button
                    type="button"
                    title="Căn trái"
                    onClick={() => execCmd('justifyLeft')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <AlignLeft className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    title="Căn giữa"
                    onClick={() => execCmd('justifyCenter')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <AlignCenter className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    title="Căn phải"
                    onClick={() => execCmd('justifyRight')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <AlignRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    title="Căn đều hai bên"
                    onClick={() => execCmd('justifyFull')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer hidden md:flex"
                  >
                    <AlignJustify className="w-4 h-4" />
                  </button>

                  <div className="w-px h-5 bg-white/10 mx-0.5" />

                  {/* Danh sách */}
                  <button
                    type="button"
                    title="Danh sách gạch đầu dòng"
                    onClick={() => execCmd('insertUnorderedList')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <List className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    title="Danh sách đánh số thứ tự"
                    onClick={() => execCmd('insertOrderedList')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer"
                  >
                    <ListOrdered className="w-4 h-4" />
                  </button>

                  {/* Trích dẫn & Bảng & Đường kẻ */}
                  <button
                    type="button"
                    title="Trích dẫn (Quote)"
                    onClick={() => execCmd('formatBlock', 'blockquote')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer hidden sm:flex"
                  >
                    <Quote className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    title="Chèn bảng biểu so sánh F&B"
                    onClick={handleInsertTable}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer hidden md:flex"
                  >
                    <Table className="w-4 h-4 text-emerald-400" />
                  </button>

                  <button
                    type="button"
                    title="Chèn đường kẻ ngang phân đoạn"
                    onClick={() => execCmd('insertHorizontalRule')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer hidden md:flex"
                  >
                    <Minus className="w-4 h-4" />
                  </button>

                  <div className="w-px h-5 bg-white/10 mx-0.5" />

                  {/* Màu chữ & Màu nền Highlight */}
                  <div className="flex items-center gap-1">
                    <label
                      title="Màu chữ"
                      className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center cursor-pointer relative"
                    >
                      <span className="font-extrabold text-sm text-emerald-400 underline">A</span>
                      <input
                        type="color"
                        onChange={(e) => execCmd('foreColor', e.target.value)}
                        className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                      />
                    </label>

                    <label
                      title="Màu nền dạ quang (Highlight)"
                      className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center cursor-pointer relative"
                    >
                      <span className="px-1 py-0.5 rounded bg-yellow-400/20 text-yellow-300 font-bold text-xs">ab</span>
                      <input
                        type="color"
                        onChange={(e) => execCmd('hiliteColor', e.target.value)}
                        className="opacity-0 absolute inset-0 cursor-pointer w-full h-full"
                      />
                    </label>
                  </div>

                  <div className="w-px h-5 bg-white/10 mx-0.5" />

                  {/* Undo / Redo */}
                  <button
                    type="button"
                    title="Hoàn tác (Undo - Ctrl+Z)"
                    onClick={() => execCmd('undo')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer hidden sm:flex"
                  >
                    <Undo className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    title="Làm lại (Redo - Ctrl+Y)"
                    onClick={() => execCmd('redo')}
                    className="w-8 h-8 rounded-lg hover:bg-gray-200 dark:hover:bg-[#203126] flex items-center justify-center text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 transition-colors cursor-pointer hidden sm:flex"
                  >
                    <Redo className="w-4 h-4" />
                  </button>

                  {/* Nút chuyển đổi chế độ xem: WYSIWYG trực quan ↔ Mã nguồn HTML */}
                  <button
                    type="button"
                    onClick={() => {
                      if (editorMode === 'wysiwyg') {
                        setEditorMode('code');
                      } else {
                        setEditorMode('wysiwyg');
                      }
                    }}
                    title="Chuyển đổi giữa chế độ Soạn thảo trực quan và Mã nguồn HTML"
                    className={`ml-auto px-2.5 h-8 rounded-lg flex items-center gap-1.5 text-xs font-bold transition-colors cursor-pointer ${
                      editorMode === 'code'
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'bg-white dark:bg-[#0E1611] text-gray-700 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white border border-gray-300 dark:border-[#273B2E]'
                    }`}
                  >
                    <Code className="w-3.5 h-3.5" />
                    <span>{editorMode === 'code' ? 'Soạn thảo Word' : 'Mã HTML'}</span>
                  </button>
                </div>

                {/* Vùng soạn thảo chính */}
                {/* Banner thông báo nếu bản dịch Tiếng Trung hoặc Tiếng Anh đang trống */}
                {activeLanguageTab === 'zh' && !(newsFormData.contentZh || '').trim() && (
                  <div className="mx-6 mt-4 p-4 rounded-xl bg-purple-950/40 border border-purple-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs text-purple-200">
                      <span className="font-bold flex items-center gap-1.5 text-purple-300">
                        <span>🇹🇼</span> Bản dịch tiếng Trung (繁體中文) chưa có nội dung
                      </span>
                      <span>Bạn có thể gõ trực tiếp bên dưới hoặc bấm nút bên phải để AI tự động dịch toàn bộ từ bản gốc tiếng Việt.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTranslateArticle('zh')}
                      disabled={isTranslatingNews}
                      className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isTranslatingNews ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>{isTranslatingNews ? 'Đang dịch...' : '✨ AI Dịch Toàn Bộ Sang 繁中'}</span>
                    </button>
                  </div>
                )}
                {activeLanguageTab === 'en' && !(newsFormData.contentEn || '').trim() && (
                  <div className="mx-6 mt-4 p-4 rounded-xl bg-blue-950/40 border border-blue-800/60 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="text-xs text-blue-200">
                      <span className="font-bold flex items-center gap-1.5 text-blue-300">
                        <span>🇬🇧</span> Bản dịch tiếng Anh (English) chưa có nội dung
                      </span>
                      <span>Bạn có thể gõ trực tiếp bên dưới hoặc bấm nút bên phải để AI tự động dịch toàn bộ từ bản gốc tiếng Việt.</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleTranslateArticle('en')}
                      disabled={isTranslatingNewsEn}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md cursor-pointer disabled:opacity-50"
                    >
                      {isTranslatingNewsEn ? <Sparkles className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                      <span>{isTranslatingNewsEn ? 'Đang dịch...' : '✨ AI Dịch Toàn Bộ Sang EN'}</span>
                    </button>
                  </div>
                )}

                {editorMode === 'wysiwyg' ? (
                  <div
                    ref={editorRef}
                    contentEditable
                    onInput={handleEditorInput}
                    onBlur={saveSelection}
                    onKeyUp={saveSelection}
                    onMouseUp={saveSelection}
                    data-placeholder={
                      activeLanguageTab === 'zh'
                        ? '輸入繁體中文內容... (可直接輸入、反白選取文字進行排版或插入圖片)'
                        : activeLanguageTab === 'en'
                        ? 'Type English content here... (Format text, insert images for each section)'
                        : "Bắt đầu viết nội dung bài viết... (Bạn có thể gõ trực tiếp, bôi đen để định dạng và bấm 'Thêm ảnh' để chèn hình minh họa vào từng đoạn)"
                    }
                    className="article-content wysiwyg-canvas p-6 sm:p-10 min-h-[550px] max-h-[800px] overflow-y-auto bg-[#0B120E] text-white text-base leading-relaxed outline-none focus:ring-0 space-y-4 shadow-inner/5"
                    style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF', backgroundColor: '#0B120E' }}
                  />
                ) : (
                  <textarea
                    rows={20}
                    spellCheck={false}
                    value={
                      activeLanguageTab === 'zh'
                        ? (newsFormData.contentZh || '')
                        : activeLanguageTab === 'en'
                        ? (newsFormData.contentEn || '')
                        : (newsFormData.content || '')
                    }
                    onChange={(e) => {
                      if (activeLanguageTab === 'zh') {
                        setNewsFormData({ ...newsFormData, contentZh: e.target.value });
                      } else if (activeLanguageTab === 'en') {
                        setNewsFormData({ ...newsFormData, contentEn: e.target.value });
                      } else {
                        setNewsFormData({ ...newsFormData, content: e.target.value });
                      }
                    }}
                    placeholder={`Mã HTML bài viết (${activeLanguageTab === 'zh' ? '繁體中文' : activeLanguageTab === 'en' ? 'English' : 'Tiếng Việt'})...`}
                    className="w-full p-6 bg-[#070D09] text-emerald-400 font-mono text-xs leading-relaxed outline-none resize-y min-h-[550px] html-code-editor border border-emerald-900/40"
                    style={{
                      color: '#FFFFFF',
                      WebkitTextFillColor: '#FFFFFF',
                      backgroundColor: '#070D09',
                      caretColor: '#FFFFFF'
                    }}
                  />
                )}

                {/* Thanh thông tin dưới đáy editor */}
                <div className="px-4 py-2 bg-gray-50 dark:bg-[#0E1611] border-t border-gray-200 dark:border-[#223326] flex items-center justify-between text-[11px] text-gray-600 dark:text-gray-400">
                  <div className="flex items-center gap-4">
                    <span>Ngôn ngữ đang soạn: <strong className={activeLanguageTab === 'zh' ? 'text-purple-300' : activeLanguageTab === 'en' ? 'text-blue-300' : 'text-emerald-400'}>{activeLanguageTab === 'zh' ? '🇹🇼 繁體中文' : activeLanguageTab === 'en' ? '🇬🇧 English' : '🇻🇳 Tiếng Việt'}</strong></span>
                    <span>Số từ: <strong className="text-white">{wordCount}</strong></span>
                    <span>Thời gian đọc ước tính: <strong className="text-white">{Math.max(1, Math.ceil(wordCount / 200))} phút</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-400">● Tự động đồng bộ chuẩn F&B Magazine</span>
                  </div>
                </div>
              </div>

              {/* 3. Tóm tắt ngắn (Excerpt) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-[#111A13] border border-[#223326] shadow-xs space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                    Tóm tắt (Excerpt) {activeLanguageTab === 'zh' ? '— 繁體中文' : activeLanguageTab === 'en' ? '— English' : '— Tiếng Việt'}
                  </label>
                  <span className={`text-[11px] font-medium ${
                    excerptLength >= 90 && excerptLength <= 180 ? 'text-emerald-400' : 'text-gray-500'
                  }`}>
                    {excerptLength} / 160 ký tự khuyến nghị
                  </span>
                </div>
                <textarea
                  rows={3}
                  placeholder={
                    activeLanguageTab === 'zh'
                      ? '輸入繁體中文文章摘要...'
                      : activeLanguageTab === 'en'
                      ? 'Article summary in English...'
                      : 'Một đoạn tóm tắt ngắn...'
                  }
                  value={getCurrentExcerpt()}
                  onChange={(e) => {
                    if (activeLanguageTab === 'zh') {
                      setNewsFormData({ ...newsFormData, excerptZh: e.target.value });
                    } else if (activeLanguageTab === 'en') {
                      setNewsFormData({ ...newsFormData, excerptEn: e.target.value });
                    } else {
                      setNewsFormData({ ...newsFormData, excerpt: e.target.value });
                    }
                  }}
                  style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF', backgroundColor: '#090F0B' }}
                  className="w-full px-4 py-3 rounded-xl bg-[#090F0B] border border-[#26382B] text-white placeholder-gray-500 text-sm leading-relaxed outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all resize-none shadow-2xs"
                />
              </div>

              {/* 4. Khối Mở rộng: Hộp Công Thức SOP, Sản Phẩm Gắn Kèm, Đa Ngôn Ngữ */}
              <div className="space-y-3 pt-2">
                {/* Accordion: Hộp công thức Barista SOP */}
                <div className="rounded-2xl bg-[#111A13] border border-[#223326] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setShowRecipeBox(!showRecipeBox)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-[#152219] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <ChefHat className="w-4 h-4 text-amber-400" />
                      <span className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                        Hộp Công Thức Barista SOP (Tùy chọn dành cho bài viết công thức)
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showRecipeBox ? 'rotate-180' : ''}`} />
                  </button>

                  {showRecipeBox && (
                    <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-[#223326] bg-gray-50/60 dark:bg-[#0C140F] space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Tên Món Uống:</label>
                          <input
                            type="text"
                            value={newsFormData.recipeBox?.title || ''}
                            onChange={(e) =>
                              setNewsFormData({
                                ...newsFormData,
                                recipeBox: { ...(newsFormData.recipeBox || {}), title: e.target.value }
                              })
                            }
                            placeholder="Ví dụ: Trà Ô Long Nướng Kem Muối Biển"
                            style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080E0A] border border-gray-300 dark:border-[#243729] text-gray-900 dark:text-white text-xs outline-none focus:border-amber-500 shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Giá Vốn Dự Kiến (Cost):</label>
                          <input
                            type="text"
                            value={newsFormData.recipeBox?.cost || ''}
                            onChange={(e) =>
                              setNewsFormData({
                                ...newsFormData,
                                recipeBox: { ...(newsFormData.recipeBox || {}), cost: e.target.value }
                              })
                            }
                            placeholder="Ví dụ: ~4.500đ / Ly 500ml"
                            style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080E0A] border border-gray-300 dark:border-[#243729] text-gray-900 dark:text-white text-xs outline-none focus:border-amber-400 shadow-2xs"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Định Lượng Nguyên Liệu (Mỗi dòng 1 món):</label>
                          <textarea
                            rows={4}
                            value={(newsFormData.recipeBox?.ingredients || []).join('\n')}
                            onChange={(e) =>
                              setNewsFormData({
                                ...newsFormData,
                                recipeBox: {
                                  ...(newsFormData.recipeBox || {}),
                                  ingredients: e.target.value.split('\n')
                                }
                              })
                            }
                            placeholder="120ml Trà Ô Long Nướng CASA&#10;30g Bột Kem Béo CASA&#10;20ml Syrup Đường Mía"
                            style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080E0A] border border-gray-300 dark:border-[#243729] text-gray-900 dark:text-white text-xs font-mono outline-none focus:border-amber-500 leading-relaxed shadow-2xs"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">Các Bước Pha Chế SOP (Mỗi dòng 1 bước):</label>
                          <textarea
                            rows={4}
                            value={(newsFormData.recipeBox?.steps || []).join('\n')}
                            onChange={(e) =>
                              setNewsFormData({
                                ...newsFormData,
                                recipeBox: {
                                  ...(newsFormData.recipeBox || {}),
                                  steps: e.target.value.split('\n')
                                }
                              })
                            }
                            placeholder="Ủ 30g Trà với 1000ml nước 90°C trong 10 phút.&#10;Khuấy tan bột béo khi nước cốt trà còn nóng.&#10;Thêm đá viên và lắc đều trong shaker."
                            style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
                            className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#080E0A] border border-gray-300 dark:border-[#243729] text-gray-900 dark:text-white text-xs font-mono outline-none focus:border-amber-400 leading-relaxed shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Accordion: Gắn sản phẩm F&B đính kèm */}
                <div className="rounded-2xl bg-white dark:bg-[#111A13] border border-gray-200 dark:border-[#223326] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setShowAttachedProducts(!showAttachedProducts)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-[#152219] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Package className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                        Gắn Sản Phẩm F&B CASA Vào Bài Viết ({((newsFormData.relatedProductIds || []).length)})
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showAttachedProducts ? 'rotate-180' : ''}`} />
                  </button>

                  {showAttachedProducts && (
                    <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-[#223326] bg-gray-50/60 dark:bg-[#0C140F] space-y-3">
                      <div className="relative">
                        <Search className="w-4 h-4 absolute left-3 top-3 text-gray-500" />
                        <input
                          type="text"
                          placeholder="Tìm trà, bột béo, topping để gắn vào bài viết..."
                          value={productSearch}
                          onChange={(e) => setProductSearch(e.target.value)}
                          style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
                          className="w-full pl-9 pr-3 py-2 rounded-xl bg-white dark:bg-[#080E0A] border border-gray-300 dark:border-[#243729] text-gray-900 dark:text-white text-xs outline-none focus:border-emerald-500 shadow-2xs"
                        />
                      </div>

                      {productSearch.trim() && (
                        <div className="max-h-48 overflow-y-auto space-y-1 p-2 rounded-xl bg-gray-50 dark:bg-[#080E0A] border border-gray-200 dark:border-[#243729]">
                          {products
                            .filter((p) => (p.name || '').toLowerCase().includes(productSearch.toLowerCase()))
                            .slice(0, 5)
                            .map((prod) => {
                              const isAdded = (newsFormData.relatedProductIds || []).includes(prod.id);
                              return (
                                <div key={prod.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-white/5 text-xs">
                                  <span className="text-gray-700 dark:text-gray-300 truncate">{prod.name}</span>
                                  <button
                                    type="button"
                                    disabled={isAdded}
                                    onClick={() => {
                                      const current = newsFormData.relatedProductIds || [];
                                      setNewsFormData({ ...newsFormData, relatedProductIds: [...current, prod.id] });
                                      setProductSearch('');
                                    }}
                                    className={`px-2 py-1 rounded text-[11px] font-bold ${
                                      isAdded ? 'bg-gray-800 text-gray-500' : 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                                    }`}
                                  >
                                    {isAdded ? 'Đã gắn' : '+ Gắn'}
                                  </button>
                                </div>
                              );
                            })}
                        </div>
                      )}

                      {/* Danh sách đã chọn */}
                      <div className="flex flex-wrap gap-2 pt-2">
                        {(newsFormData.relatedProductIds || []).map((pId) => {
                          const prod = products.find((p) => p.id === pId);
                          return (
                            <span key={pId} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/40 text-emerald-800 dark:text-emerald-300 text-xs font-semibold">
                              <span>{prod ? prod.name : pId}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewsFormData({
                                    ...newsFormData,
                                    relatedProductIds: (newsFormData.relatedProductIds || []).filter((id) => id !== pId)
                                  });
                                }}
                                className="hover:text-red-400 cursor-pointer"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Accordion: Bản dịch đa ngôn ngữ */}
                <div className="rounded-2xl bg-white dark:bg-[#111A13] border border-gray-200 dark:border-[#223326] overflow-hidden shadow-xs">
                  <button
                    type="button"
                    onClick={() => setShowTranslations(!showTranslations)}
                    className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-[#152219] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Globe className="w-4 h-4 text-purple-400" />
                      <span className="font-bold text-xs sm:text-sm text-gray-800 dark:text-gray-200">
                        Bản Dịch Đa Ngôn Ngữ (Tiếng Trung 繁體中文 & Tiếng Anh English)
                      </span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${showTranslations ? 'rotate-180' : ''}`} />
                  </button>

                  {showTranslations && (
                    <div className="p-4 sm:p-5 border-t border-gray-200 dark:border-[#223326] bg-gray-50/60 dark:bg-[#0C140F] space-y-5">
                      {/* Tiếng Trung */}
                      <div className="p-4 rounded-xl bg-purple-950/20 border border-purple-800/40 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🇹🇼</span>
                            <span className="text-xs font-bold text-purple-300">
                              Bản Dịch Tiếng Trung Phồn Thể (繁體中文)
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              (newsFormData.contentZh || '').trim()
                                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                : 'bg-gray-800 text-gray-400'
                            }`}>
                              {(newsFormData.contentZh || '').trim() ? '✓ Đã dịch' : 'Chưa có bản dịch'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSwitchLanguageTab('zh')}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-[#19271E] hover:bg-gray-200 dark:hover:bg-[#223529] text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 border border-gray-300 dark:border-[#2B4232] text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                            >
                              Mở soạn trong Word Canvas →
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTranslateArticle('zh')}
                              disabled={isTranslatingNews}
                              className="px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-[11px] font-bold cursor-pointer flex items-center gap-1.5 shadow-md disabled:opacity-50"
                            >
                              {isTranslatingNews ? <Sparkles className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              <span>{isTranslatingNews ? 'Đang dịch...' : '✨ AI Dịch Toàn Bài 繁中'}</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">Tiêu đề (繁體中文):</label>
                          <input
                            type="text"
                            placeholder="Tiêu đề tiếng Trung (繁體中文)..."
                            value={newsFormData.titleZh || ''}
                            onChange={(e) => setNewsFormData({ ...newsFormData, titleZh: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#080E0A] border border-purple-300 dark:border-purple-800/40 text-gray-900 dark:text-purple-100 text-xs outline-none focus:border-purple-500 shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">Tóm tắt ngắn (繁體中文):</label>
                          <textarea
                            rows={2}
                            placeholder="Tóm tắt bài viết tiếng Trung (繁體中文)..."
                            value={newsFormData.excerptZh || ''}
                            onChange={(e) => setNewsFormData({ ...newsFormData, excerptZh: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#080E0A] border border-purple-300 dark:border-purple-800/40 text-gray-900 dark:text-purple-100 text-xs outline-none focus:border-purple-500 resize-none shadow-2xs"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-bold text-gray-400">Nội dung bài viết (繁體中文):</label>
                            <span className="text-[10px] text-purple-400">{(newsFormData.contentZh || '').length} ký tự HTML</span>
                          </div>
                          <textarea
                            rows={5}
                            placeholder="Toàn bộ nội dung bài viết bằng tiếng Trung phồn thể..."
                            value={newsFormData.contentZh || ''}
                            onChange={(e) => setNewsFormData({ ...newsFormData, contentZh: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white dark:bg-[#080E0A] border border-purple-300 dark:border-purple-800/40 text-gray-900 dark:text-purple-100 font-mono text-[11px] leading-relaxed outline-none focus:border-purple-500 shadow-2xs"
                          />
                        </div>
                      </div>

                      {/* Tiếng Anh */}
                      <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-800/40 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <span className="text-base">🇬🇧</span>
                            <span className="text-xs font-bold text-blue-300">
                              Bản Dịch Tiếng Anh (English)
                            </span>
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                              (newsFormData.contentEn || '').trim()
                                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                                : 'bg-gray-800 text-gray-400'
                            }`}>
                              {(newsFormData.contentEn || '').trim() ? '✓ Đã dịch' : 'Chưa có bản dịch'}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleSwitchLanguageTab('en')}
                              className="px-2.5 py-1 rounded-lg bg-gray-100 dark:bg-[#19271E] hover:bg-gray-200 dark:hover:bg-[#223529] text-gray-700 dark:text-white hover:text-gray-900 dark:hover:text-emerald-300 border border-gray-300 dark:border-[#2B4232] text-[11px] font-bold cursor-pointer transition-colors shadow-2xs"
                            >
                              Mở soạn trong Word Canvas →
                            </button>
                            <button
                              type="button"
                              onClick={() => handleTranslateArticle('en')}
                              disabled={isTranslatingNewsEn}
                              className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold cursor-pointer flex items-center gap-1.5 shadow-md disabled:opacity-50"
                            >
                              {isTranslatingNewsEn ? <Sparkles className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
                              <span>{isTranslatingNewsEn ? 'Đang dịch...' : '✨ AI Dịch Toàn Bài EN'}</span>
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">Title (English):</label>
                          <input
                            type="text"
                            placeholder="Article title in English..."
                            value={newsFormData.titleEn || ''}
                            onChange={(e) => setNewsFormData({ ...newsFormData, titleEn: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#080E0A] border border-blue-300 dark:border-blue-800/40 text-gray-900 dark:text-blue-100 text-xs outline-none focus:border-blue-500 shadow-2xs"
                          />
                        </div>

                        <div>
                          <label className="block text-[10px] font-bold text-gray-400 mb-1">Excerpt (English):</label>
                          <textarea
                            rows={2}
                            placeholder="Article summary in English..."
                            value={newsFormData.excerptEn || ''}
                            onChange={(e) => setNewsFormData({ ...newsFormData, excerptEn: e.target.value })}
                            className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#080E0A] border border-blue-300 dark:border-blue-800/40 text-gray-900 dark:text-blue-100 text-xs outline-none focus:border-blue-500 resize-none shadow-2xs"
                          />
                        </div>

                        <div>
                          <div className="flex items-center justify-between mb-1">
                            <label className="text-[10px] font-bold text-gray-400">Content / Body (English):</label>
                            <span className="text-[10px] text-blue-400">{(newsFormData.contentEn || '').length} characters HTML</span>
                          </div>
                          <textarea
                            rows={5}
                            placeholder="Full article content in English..."
                            value={newsFormData.contentEn || ''}
                            onChange={(e) => setNewsFormData({ ...newsFormData, contentEn: e.target.value })}
                            className="w-full p-3 rounded-lg bg-white dark:bg-[#080E0A] border border-blue-300 dark:border-blue-800/40 text-gray-900 dark:text-blue-100 font-mono text-[11px] leading-relaxed outline-none focus:border-blue-500 shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* ============================================================== */}
            {/* CỘT PHẢI (COL-4): BÀI NỔI BẬT + TABS CÀI ĐẶT & SEO CHECK */}
            {/* ============================================================== */}
            <div className="lg:col-span-4 space-y-6">
              
              {/* 1. Bài nổi bật (Spotlight) */}
              <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#111A13] border border-gray-200 dark:border-[#223326] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <span className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      Bài nổi bật (Spotlight)
                    </span>
                    <span className="text-[11px] text-gray-400 block">
                      Hiển thị ở vị trí nổi bật trên trang Tin tức
                    </span>
                  </div>

                  {/* Toggle switch */}
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(newsFormData.featuredNews)}
                      onChange={(e) => setNewsFormData({ ...newsFormData, featuredNews: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                  </label>
                </div>

                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-gray-300 font-medium">Nổi bật trên Trang Chủ</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={Boolean(newsFormData.featuredHome)}
                      onChange={(e) => setNewsFormData({ ...newsFormData, featuredHome: e.target.checked })}
                      className="sr-only peer"
                    />
                    <div className="w-9 h-5 bg-gray-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500"></div>
                  </label>
                </div>
              </div>

              {/* 2. Switcher 2 Tabs: Cài đặt | SEO Check */}
              <div className="rounded-2xl bg-white dark:bg-[#111A13] border border-gray-200 dark:border-[#223326] shadow-xs overflow-hidden">
                <div className="grid grid-cols-2 border-b border-gray-200 dark:border-[#223326] bg-gray-100 dark:bg-[#0E1611]">
                  <button
                    type="button"
                    onClick={() => setActiveSidebarTab('settings')}
                    className={`py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeSidebarTab === 'settings'
                        ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-500 bg-white dark:bg-[#141F17]'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <Sliders className="w-3.5 h-3.5" />
                    <span>Cài đặt</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setActiveSidebarTab('seo')}
                    className={`py-3 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                      activeSidebarTab === 'seo'
                        ? 'text-emerald-700 dark:text-emerald-400 border-b-2 border-emerald-500 bg-white dark:bg-[#141F17]'
                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>SEO Check ({seoScore}/7)</span>
                  </button>
                </div>

                {/* NỘI DUNG TAB CÀI ĐẶT */}
                {activeSidebarTab === 'settings' && (
                  <div className="p-4 sm:p-5 space-y-6">
                    
                    {/* Hình ảnh đại diện */}
                    <div className="space-y-3">
                      <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">
                        Hình ảnh đại diện
                      </label>

                      {newsFormData.image ? (
                        <div className="relative rounded-2xl overflow-hidden border border-gray-300 dark:border-[#273B2E] aspect-[16/10] group bg-gray-100 dark:bg-black/40">
                          <img
                            src={newsFormData.image}
                            alt="Ảnh đại diện bài viết"
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3">
                            <label className="px-3 py-1.5 rounded-xl bg-white text-gray-900 font-bold text-xs cursor-pointer shadow-md hover:bg-gray-100">
                              Đổi ảnh
                              <input type="file" accept="image/*" onChange={handleThumbnailSelect} className="hidden" />
                            </label>
                            <button
                              type="button"
                              onClick={() => setNewsFormData({ ...newsFormData, image: '' })}
                              className="px-3 py-1.5 rounded-xl bg-red-600 text-white font-bold text-xs shadow-md hover:bg-red-500 cursor-pointer"
                            >
                              Xóa ảnh
                            </button>
                          </div>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-[#2A3E30] hover:border-emerald-500 bg-gray-50 dark:bg-[#090F0B] hover:bg-gray-100 dark:hover:bg-[#0E1712] cursor-pointer transition-all text-center">
                          <UploadCloud className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mb-2" />
                          <span className="font-bold text-xs text-gray-800 dark:text-white">Nhấn để tải ảnh</span>
                          <span className="text-[10px] text-gray-500 mt-0.5">SVG, PNG, JPG hoặc WebP</span>
                          <input type="file" accept="image/*" onChange={handleThumbnailSelect} className="hidden" />
                        </label>
                      )}

                      {/* Khuyến nghị kích thước chuẩn theo ảnh khách chụp */}
                      <div className="p-3 rounded-xl bg-gray-50 dark:bg-[#090F0B] border border-gray-200 dark:border-white/5 space-y-1 text-[11px] text-gray-600 dark:text-gray-400">
                        <span className="font-semibold text-gray-700 dark:text-gray-300 block">Kích thước chuẩn tối ưu SEO:</span>
                        <div className="space-y-0.5 text-[10px]">
                          <div>• Vuông: 1200x1200px</div>
                          <div>• Ngang: 1200x630px</div>
                          <div>• Định dạng: WebP tối ưu dung lượng</div>
                        </div>
                      </div>

                      {/* Văn bản thay thế (Alt Text) */}
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                          Văn bản thay thế (Alt Text)
                        </label>
                        <input
                          type="text"
                          placeholder="Mô tả hình ảnh cho SEO..."
                          value={newsFormData.alt || ''}
                          onChange={(e) => setNewsFormData({ ...newsFormData, alt: e.target.value })}
                          style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF' }}
                          className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#090F0B] border border-gray-300 dark:border-[#243729] text-gray-900 dark:text-gray-200 text-xs outline-none focus:border-emerald-500 shadow-2xs"
                        />
                      </div>
                    </div>

                    {/* Phân loại danh mục */}
                    <div className="space-y-2">
                      <label className="block text-xs font-bold text-gray-800 dark:text-gray-200">Phân loại</label>
                      <div>
                        <span className="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">Danh mục</span>
                        <select
                          value={newsFormData.category || 'cong-thuc'}
                          onChange={(e) => {
                            const cat = e.target.value;
                            const catMap = {
                              'cong-thuc': 'Công Thức Pha Chế',
                              'xu-huong': 'Xu Hướng Đồ Uống',
                              'kien-thuc': 'Kiến Thức Trà & Kỹ Thuật R&D',
                              'tin-doanh-nghiep': 'Tin Doanh Nghiệp'
                            };
                            setNewsFormData({
                              ...newsFormData,
                              category: cat,
                              categoryName: catMap[cat] || cat
                            });
                          }}
                          style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF', backgroundColor: '#090F0B' }}
                          className="w-full px-3 py-2.5 rounded-xl bg-[#090F0B] border border-[#243729] text-white text-xs font-medium outline-none focus:border-emerald-500 cursor-pointer shadow-2xs"
                        >
                          <option value="cong-thuc">Công Thức Pha Chế (Barista SOP)</option>
                          <option value="xu-huong">Xu Hướng Đồ Uống 2026</option>
                          <option value="kien-thuc">Kiến Thức Trà & Kỹ Thuật R&D</option>
                          <option value="tin-doanh-nghiep">Tin Doanh Nghiệp</option>
                        </select>
                      </div>
                    </div>

                    {/* Thẻ (Tags) */}
                    <div className="space-y-3">
                      <div>
                        <span className="block text-[11px] text-gray-600 dark:text-gray-400 mb-1">Thẻ (Tags)</span>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            placeholder="Nhập thẻ và nhấn Enter..."
                            value={customTagInput}
                            onChange={(e) => setCustomTagInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddTag();
                              }
                            }}
                            style={{ color: '#FFFFFF', WebkitTextFillColor: '#FFFFFF', backgroundColor: '#090F0B' }}
                            className="flex-1 px-3 py-2 rounded-xl bg-[#090F0B] border border-[#243729] text-white text-xs outline-none focus:border-emerald-500 shadow-2xs"
                          />
                          <button
                            type="button"
                            onClick={() => handleAddTag()}
                            className="px-3 py-2 rounded-xl bg-emerald-50 dark:bg-[#1A281E] hover:bg-emerald-100 dark:hover:bg-[#233829] text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-500/30 text-xs font-bold cursor-pointer shadow-2xs"
                          >
                            + Thêm
                          </button>
                        </div>
                      </div>

                      {/* Danh sách thẻ đang có */}
                      {(newsFormData.tags || []).length > 0 && (
                        <div className="flex flex-wrap gap-1.5 p-2 rounded-xl bg-gray-50 dark:bg-[#090F0B] border border-gray-200 dark:border-[#243729]">
                          {newsFormData.tags.map((tag) => (
                            <span
                              key={tag}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-700/50 text-emerald-800 dark:text-emerald-300 text-[11px] font-semibold"
                            >
                              <span>{tag}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveTag(tag)}
                                className="hover:text-red-400 cursor-pointer"
                              >
                                <X className="w-3 h-3" />
                              </button>
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Gợi ý thẻ (Click để thêm) giống 100% hình chụp của khách */}
                      <div className="space-y-2 pt-2 border-t border-white/5">
                        <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Thẻ gợi ý (Click để thêm)
                        </span>
                        <div className="flex flex-wrap gap-1.5 max-h-56 overflow-y-auto pr-1">
                          {tagSuggestions.map((sugTag) => {
                            const isAdded = (newsFormData.tags || []).includes(sugTag);
                            return (
                              <button
                                key={sugTag}
                                type="button"
                                disabled={isAdded}
                                onClick={() => handleAddTag(sugTag)}
                                className={`px-2 py-1 rounded-lg text-[10px] font-medium transition-all ${
                                  isAdded
                                    ? 'bg-gray-100 dark:bg-[#121B14] text-gray-400 dark:text-gray-600 border border-transparent opacity-60 cursor-default'
                                    : 'bg-gray-100 dark:bg-[#0E1611] hover:bg-emerald-50 dark:hover:bg-[#18261D] text-gray-700 dark:text-gray-300 hover:text-emerald-700 dark:hover:text-emerald-300 border border-gray-200 dark:border-[#223326] hover:border-emerald-300 dark:hover:border-emerald-500/40 cursor-pointer'
                                }`}
                              >
                                {sugTag} {isAdded ? '✓' : '+'}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* NỘI DUNG TAB SEO CHECK */}
                {activeSidebarTab === 'seo' && (
                  <div className="p-4 sm:p-5 space-y-6">
                    {/* Google SERP Snippet Preview */}
                    <div className="space-y-2">
                      <span className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Xem trước trên kết quả tìm kiếm Google
                      </span>
                      <div className="p-4 rounded-xl bg-white text-gray-900 shadow-md space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600 truncate">
                          <span className="w-4 h-4 rounded-full bg-emerald-700 flex items-center justify-center text-white text-[9px] font-bold">C</span>
                          <span className="truncate">https://nguyenlieuphachecasa.com › news › {newsFormData.slug || 'bai-viet'}</span>
                        </div>
                        <h4 className="text-blue-700 text-sm font-semibold truncate hover:underline cursor-pointer">
                          {newsFormData.title || 'Tiêu Đề Bài Viết CASA TEA'}
                        </h4>
                        <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                          {newsFormData.excerpt || 'Mô tả bài viết sẽ xuất hiện tại đây giúp người tìm kiếm trên Google click vào website của bạn...'}
                        </p>
                      </div>
                    </div>

                    {/* Danh sách tiêu chí SEO */}
                    <div className="space-y-2.5">
                      <span className="block text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                        Tiêu chí xếp hạng SEO Google
                      </span>

                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-[#090F0B] border border-gray-200 dark:border-white/5">
                          <span className="text-gray-700 dark:text-gray-300">Độ dài tiêu đề (40-70 ký tự):</span>
                          <span className={titleLength >= 40 && titleLength <= 70 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                            {titleLength} ký tự
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-[#090F0B] border border-gray-200 dark:border-white/5">
                          <span className="text-gray-700 dark:text-gray-300">Độ dài tóm tắt meta (90-180 ký tự):</span>
                          <span className={excerptLength >= 90 && excerptLength <= 180 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                            {excerptLength} ký tự
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-[#090F0B] border border-gray-200 dark:border-white/5">
                          <span className="text-gray-700 dark:text-gray-300">Hình ảnh đại diện:</span>
                          <span className={hasThumbnail ? 'text-emerald-400 font-bold' : 'text-red-400'}>
                            {hasThumbnail ? '✓ Đã có' : '✗ Chưa có'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-[#090F0B] border border-gray-200 dark:border-white/5">
                          <span className="text-gray-700 dark:text-gray-300">Thẻ Tags SEO (tối thiểu 3 thẻ):</span>
                          <span className={tagsCount >= 3 ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                            {tagsCount} thẻ
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-[#090F0B] border border-gray-200 dark:border-white/5">
                          <span className="text-gray-700 dark:text-gray-300">Phân đoạn đề mục (H2 / H3):</span>
                          <span className={hasHeadings ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                            {hasHeadings ? '✓ Tốt' : 'Khuyên dùng'}
                          </span>
                        </div>

                        <div className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-[#090F0B] border border-gray-200 dark:border-white/5">
                          <span className="text-gray-700 dark:text-gray-300">Hình ảnh minh họa trong nội dung:</span>
                          <span className={hasInlineImages ? 'text-emerald-400 font-bold' : 'text-amber-400'}>
                            {hasInlineImages ? '✓ Đã chèn ảnh' : 'Chưa có ảnh'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ==================================================================== */}
      {/* 3. MODAL CHÈN HÌNH ẢNH VÀO NỘI DUNG (GIỐNG WORD) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {imageModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#121C15] border border-gray-200 dark:border-[#273B2E] rounded-3xl p-6 max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl space-y-5 text-xs text-gray-800 dark:text-gray-200"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <ImagePlus className="w-5 h-5 text-emerald-400" />
                  <h3 className="text-sm font-bold text-gray-900 dark:text-white">Chèn hình ảnh vào bài viết</h3>
                </div>
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  className="p-1 rounded-lg text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs nguồn ảnh */}
              <div className="flex rounded-xl bg-gray-100 dark:bg-[#0A100C] p-1 border border-gray-200 dark:border-white/5">
                <button
                  type="button"
                  onClick={() => setImageModalTab('upload')}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                    imageModalTab === 'upload' ? 'bg-white dark:bg-[#1C2C20] text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  📁 Tải từ máy tính
                </button>
                <button
                  type="button"
                  onClick={() => setImageModalTab('url')}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                    imageModalTab === 'url' ? 'bg-white dark:bg-[#1C2C20] text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  🔗 Dán link ảnh (URL)
                </button>
                <button
                  type="button"
                  onClick={() => setImageModalTab('samples')}
                  className={`flex-1 py-1.5 rounded-lg font-bold text-center transition-colors cursor-pointer ${
                    imageModalTab === 'samples' ? 'bg-white dark:bg-[#1C2C20] text-emerald-700 dark:text-emerald-300 shadow-xs' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  🍃 Kho ảnh CASA
                </button>
              </div>

              {/* Tab 1: Upload từ máy tính */}
              {imageModalTab === 'upload' && (
                <div className="space-y-3">
                  <label className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-gray-300 dark:border-[#2A3E30] hover:border-emerald-500 bg-gray-50 dark:bg-[#0A100C] hover:bg-gray-100 dark:hover:bg-[#0E1712] cursor-pointer transition-all text-center">
                    <UploadCloud className="w-8 h-8 text-emerald-500 dark:text-emerald-400 mb-2" />
                    <span className="font-bold text-xs text-gray-800 dark:text-white">
                      {isUploadingImage ? 'Đang nén WebP siêu tốc...' : 'Nhấn để chọn ảnh từ thiết bị'}
                    </span>
                    <span className="text-[10px] text-gray-500 mt-0.5">Tự động nén WebP siêu nhẹ, nét căng chuẩn F&B</span>
                    <input type="file" accept="image/*" onChange={handleImageFileSelect} className="hidden" />
                  </label>
                  {imageUploadError && (
                    <div className="text-red-400 text-[11px] flex items-center gap-1.5">
                      <AlertCircle className="w-3.5 h-3.5" />
                      <span>{imageUploadError}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Tab 2: URL */}
              {imageModalTab === 'url' && (
                <div className="space-y-2">
                  <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300">Đường dẫn hình ảnh (URL):</label>
                  <input
                    type="url"
                    placeholder="https://images.unsplash.com/... hoặc link ảnh bất kỳ"
                    value={imageSrc}
                    onChange={(e) => setImageSrc(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-xl bg-white dark:bg-[#0A100C] border border-gray-300 dark:border-[#273B2E] text-gray-900 dark:text-white text-xs outline-none focus:border-emerald-500 shadow-2xs"
                  />
                </div>
              )}

              {/* Tab 3: Kho ảnh mẫu CASA */}
              {imageModalTab === 'samples' && (
                <div className="grid grid-cols-3 gap-2.5 max-h-56 overflow-y-auto p-1">
                  {CASA_SAMPLE_IMAGES.map((sample, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        setImageSrc(sample.url);
                        setImageCaption(sample.title);
                        setImageAlt(sample.title);
                      }}
                      className={`group relative rounded-xl overflow-hidden aspect-[4/3] border text-left cursor-pointer transition-all ${
                        imageSrc === sample.url ? 'border-emerald-500 ring-2 ring-emerald-500/30' : 'border-white/10 hover:border-emerald-500/50'
                      }`}
                    >
                      <img src={sample.url} alt={sample.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[10px] text-white font-medium truncate">{sample.title}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}

              {/* Xem trước ảnh đã chọn */}
              {imageSrc && (
                <div className="rounded-2xl overflow-hidden border border-gray-300 dark:border-[#273B2E] aspect-[16/9] bg-gray-100 dark:bg-black/30 relative">
                  <img src={imageSrc} alt="Preview" className="w-full h-full object-contain" />
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500 text-white font-bold text-[10px]">
                      Sẵn sàng chèn
                    </span>
                  </div>
                </div>
              )}

              {/* Cấu hình Chú thích & Căn lề giống Word */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Chú thích ảnh (Caption hiển thị dưới ảnh):
                  </label>
                  <input
                    type="text"
                    placeholder="Ví dụ: Hình 1: Quy trình ủ trà Ô Long CASA..."
                    value={imageCaption}
                    onChange={(e) => setImageCaption(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A100C] border border-gray-300 dark:border-[#273B2E] text-gray-900 dark:text-white text-xs outline-none focus:border-emerald-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">
                    Thẻ Alt Text (Tối ưu SEO Google):
                  </label>
                  <input
                    type="text"
                    placeholder="Mô tả cho Google..."
                    value={imageAlt}
                    onChange={(e) => setImageAlt(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A100C] border border-gray-300 dark:border-[#273B2E] text-gray-900 dark:text-white text-xs outline-none focus:border-emerald-500 shadow-2xs"
                  />
                </div>
              </div>

              {/* Lựa chọn Căn lề & Kích thước */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Vị trí căn lề:</label>
                  <select
                    value={imageAlign}
                    onChange={(e) => setImageAlign(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A100C] border border-gray-300 dark:border-[#273B2E] text-gray-900 dark:text-white text-xs outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="center">↔️ Căn giữa (Khuyên dùng)</option>
                    <option value="left">⬅️ Căn trái (Chữ bọc quanh)</option>
                    <option value="right">➡️ Căn phải (Chữ bọc quanh)</option>
                    <option value="full">⏹️ Tràn viền (Toàn chiều rộng)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Độ rộng ảnh:</label>
                  <select
                    value={imageWidth}
                    onChange={(e) => setImageWidth(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A100C] border border-gray-300 dark:border-[#273B2E] text-gray-900 dark:text-white text-xs outline-none cursor-pointer shadow-2xs"
                  >
                    <option value="100%">100% (Tiêu chuẩn)</option>
                    <option value="75%">75% (Vừa vặn)</option>
                    <option value="50%">50% (Gọn nhỏ)</option>
                  </select>
                </div>
              </div>

              {/* Nút hành động */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setImageModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#17231B] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:text-white font-semibold cursor-pointer border border-gray-300 dark:border-transparent"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={!imageSrc}
                  onClick={handleInsertImageToEditor}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold disabled:opacity-50 shadow-md cursor-pointer"
                >
                  Chèn vào bài viết
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 4. MODAL CHÈN LINK (LIÊN KẾT) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {linkModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white dark:bg-[#121C15] border border-gray-200 dark:border-[#273B2E] rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 text-xs text-gray-800 dark:text-gray-200"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-3">
                <h3 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  <LinkIcon className="w-4 h-4 text-blue-500 dark:text-blue-400" />
                  <span>Chèn liên kết (Link)</span>
                </h3>
                <button type="button" onClick={() => setLinkModalOpen(false)} className="text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Địa chỉ liên kết (URL):</label>
                  <input
                    type="text"
                    placeholder="https://nguyenlieuphachecasa.com/products/..."
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A100C] border border-gray-300 dark:border-[#273B2E] text-gray-900 dark:text-white text-xs outline-none focus:border-blue-500 shadow-2xs"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-gray-700 dark:text-gray-300 mb-1">Văn bản hiển thị:</label>
                  <input
                    type="text"
                    placeholder="Chữ hiển thị thay cho link..."
                    value={linkText}
                    onChange={(e) => setLinkText(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-[#0A100C] border border-gray-300 dark:border-[#273B2E] text-gray-900 dark:text-white text-xs outline-none focus:border-blue-400 shadow-2xs"
                  />
                </div>

                <label className="flex items-center gap-2 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={linkNewTab}
                    onChange={(e) => setLinkNewTab(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded bg-white dark:bg-[#0A100C] border-gray-300 dark:border-[#273B2E]"
                  />
                  <span className="text-xs text-gray-700 dark:text-gray-300">Mở trong tab mới (target="_blank")</span>
                </label>
              </div>

              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setLinkModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-gray-100 dark:bg-[#17231B] text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:text-white font-semibold cursor-pointer border border-gray-300 dark:border-transparent"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  disabled={!linkUrl}
                  onClick={handleInsertLink}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold disabled:opacity-50 cursor-pointer"
                >
                  Chèn Link
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* 5. MODAL XEM TRƯỚC (FULL PREVIEW BÀI VIẾT HOÀN HẢO) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {isPreviewModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={`border rounded-3xl max-w-4xl w-full max-h-[92vh] overflow-y-auto shadow-2xl p-6 sm:p-10 space-y-6 transition-colors ${
                previewTheme === 'light'
                  ? 'bg-[#FAF9F5] border-gray-200 text-gray-900 preview-theme-light'
                  : 'bg-[#0B130E] border-white/10 text-gray-100 preview-theme-dark'
              }`}
            >
              <div className="flex items-center justify-between border-b border-gray-200 dark:border-white/10 pb-4">
                <div className="flex items-center gap-2">
                  <Eye className="w-5 h-5 text-emerald-500" />
                  <span className={`font-bold text-sm ${previewTheme === 'light' ? 'text-gray-900' : 'text-white'}`}>
                    Xem trước bố cục thực tế trên Website
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className={`p-1.5 rounded-xl cursor-pointer transition-colors ${
                    previewTheme === 'light'
                      ? 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                      : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Controls in Preview Modal: Ngôn ngữ & Chế độ xem */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-white dark:bg-[#111A14] p-3 rounded-2xl border border-gray-200 dark:border-white/5 shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-gray-600 dark:text-gray-300">Giao diện xem trước:</span>
                  <div className="flex items-center gap-1 bg-gray-100 dark:bg-[#080E0A] p-1 rounded-xl border border-gray-200 dark:border-white/10">
                    <button
                      type="button"
                      onClick={() => setPreviewTheme('light')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        previewTheme === 'light' ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
                      }`}
                    >
                      ☀️ Chuẩn Website (Sáng)
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewTheme('dark')}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        previewTheme === 'dark' ? 'bg-[#17231B] text-emerald-300 border border-emerald-500/40 shadow-xs' : 'text-gray-500 hover:text-gray-800 dark:text-gray-400'
                      }`}
                    >
                      🌙 Giao diện Tối
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 bg-gray-100 dark:bg-[#080E0A] p-1 rounded-xl border border-gray-200 dark:border-white/10">
                  <button
                    type="button"
                    onClick={() => setPreviewLang('vi')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewLang === 'vi' ? 'bg-emerald-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🇻🇳 Tiếng Việt
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLang('zh')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewLang === 'zh' ? 'bg-purple-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🇹🇼 繁體中文
                  </button>
                  <button
                    type="button"
                    onClick={() => setPreviewLang('en')}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                      previewLang === 'en' ? 'bg-blue-600 text-white shadow-sm' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    🇬🇧 English
                  </button>
                </div>
              </div>

              {/* Header bài viết & Nội dung theo ngôn ngữ được chọn */}
              {(() => {
                const previewTitle =
                  previewLang === 'zh'
                    ? (newsFormData.titleZh || newsFormData.title || 'Tiêu Đề (Chưa có bản dịch Tiếng Trung)')
                    : previewLang === 'en'
                    ? (newsFormData.titleEn || newsFormData.title || 'Title (No English translation yet)')
                    : (newsFormData.title || 'Tiêu Đề Bài Viết Xem Trước');

                const previewExcerpt =
                  previewLang === 'zh'
                    ? (newsFormData.excerptZh || newsFormData.excerpt || '')
                    : previewLang === 'en'
                    ? (newsFormData.excerptEn || newsFormData.excerpt || '')
                    : (newsFormData.excerpt || '');

                const previewContent =
                  previewLang === 'zh'
                    ? (newsFormData.contentZh || '<p class="text-amber-400 italic">Chưa có nội dung bài viết bằng Tiếng Trung (繁體中文)... Bạn hãy dùng nút AI Dịch 繁中 để dịch toàn bộ bài.</p>')
                    : previewLang === 'en'
                    ? (newsFormData.contentEn || '<p class="text-amber-400 italic">No English content available yet... Please use AI Dịch EN to translate the whole article.</p>')
                    : (newsFormData.content || '<p>Chưa có nội dung bài viết...</p>');

                return (
                  <>
                    <div className="space-y-4">
                      <span className="inline-block px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 text-xs font-bold uppercase tracking-wider border border-emerald-800/40">
                        {newsFormData.categoryName || newsFormData.category || 'Tin tức'}
                      </span>
                      <h1 className={`text-2xl sm:text-3xl font-extrabold leading-tight ${previewTheme === 'light' ? 'text-[#0E2218]' : 'text-white'}`}>
                        {previewTitle}
                      </h1>
                      <div className="flex items-center gap-4 text-xs text-gray-400">
                        <span>Tác giả: <strong className={`${previewTheme === 'light' ? 'text-gray-900' : 'text-gray-200'}`}>{newsFormData.author || 'CASA R&D Team'}</strong></span>
                        <span>•</span>
                        <span>{newsFormData.date || 'Hôm nay'}</span>
                        <span>•</span>
                        <span>{newsFormData.readTime || '4 phút đọc'}</span>
                      </div>
                    </div>

                    {/* Ảnh bìa */}
                    {newsFormData.image && (
                      <div className="rounded-3xl overflow-hidden aspect-[16/9] shadow-lg border border-white/10">
                        <img src={newsFormData.image} alt={previewTitle} className="w-full h-full object-cover" />
                      </div>
                    )}

                    {/* Tóm tắt */}
                    {previewExcerpt && (
                      <p className={`text-base sm:text-lg font-medium italic border-l-4 border-emerald-500 pl-4 py-1 leading-relaxed ${previewTheme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                        {previewExcerpt}
                      </p>
                    )}

                    {/* Khối bài viết hoàn chỉnh (Mô phỏng chuẩn Card của trang Web chi tiết) */}
                    <div className={`p-6 sm:p-10 rounded-3xl border shadow-sm transition-colors ${
                      previewTheme === 'light' ? 'bg-white border-gray-200 text-gray-900' : 'bg-[#132018] border-white/10 text-gray-100'
                    }`}>
                      <div
                        className={`article-content prose prose-lg max-w-none leading-relaxed space-y-4 text-base ${
                          previewTheme === 'light' ? 'text-gray-800' : 'prose-invert text-gray-200'
                        }`}
                        dangerouslySetInnerHTML={{ __html: previewContent }}
                      />
                    </div>
                  </>
                );
              })()}

              {/* Hộp công thức nếu có */}
              {newsFormData.recipeBox && (
                <div className={`p-6 rounded-3xl border shadow-md space-y-4 transition-colors ${
                  previewTheme === 'light'
                    ? 'bg-emerald-50/40 border-emerald-200 text-gray-900'
                    : 'bg-[#142017] border-emerald-600/40 text-gray-100'
                }`}>
                  <div className="flex items-center gap-2.5 border-b border-white/10 pb-3">
                    <ChefHat className="w-5 h-5 text-amber-400" />
                    <h3 className="font-bold text-gray-900 dark:text-white text-base">{newsFormData.recipeBox.title || 'Công Thức Barista SOP'}</h3>
                    {newsFormData.recipeBox.cost && (
                      <span className="ml-auto px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
                        Giá vốn: {newsFormData.recipeBox.cost}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="font-bold text-emerald-400 block mb-1">Nguyên liệu:</span>
                      <ul className="list-disc pl-4 space-y-1 text-gray-700 dark:text-gray-300">
                        {(newsFormData.recipeBox.ingredients || []).map((ing, i) => (
                          <li key={i}>{ing}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <span className="font-bold text-emerald-400 block mb-1">Các bước thực hiện:</span>
                      <ol className="list-decimal pl-4 space-y-1 text-gray-700 dark:text-gray-300">
                        {(newsFormData.recipeBox.steps || []).map((st, i) => (
                          <li key={i}>{st}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-4 border-t border-white/10 flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsPreviewModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer"
                >
                  Đóng xem trước
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
