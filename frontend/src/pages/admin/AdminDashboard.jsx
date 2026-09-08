import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck,
  UserCheck,
  Users,
  Package,
  FileText,
  HelpCircle,
  Cpu,
  Mail,
  Sliders,
  LogOut,
  Sparkles,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Trash2,
  Plus,
  Pencil,
  Search,
  Filter,
  X,
  Eye,
  Check,
  RefreshCw,
  Tag,
  Calendar,
  Layers,
  Award,
  ChefHat,
  BookOpen,
  Wand2,
  Star
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  ROLES,
  getRoleBadgeInfo,
  canManageUsers,
  canViewUsers,
  canEditSiteSettings,
  canManageContent,
  canDeleteContacts
} from '../../utils/permissions';
import { useToast } from '../../components/Toast';
import SEO from '../../components/SEO';
import { autoDesignProduct, autoDesignArticle } from '../../utils/aiDesignHelper';
import {
  generateProductWithGemini,
  rewriteDescriptionWithGemini,
  generateArticleWithGemini,
  translateProductToTraditionalChinese,
  translateArticleToTraditionalChinese,
  translateFaqToTraditionalChinese,
  translateMachineryToTraditionalChinese,
  translateCategoryToTraditionalChinese
} from '../../services/geminiService';

import { PRODUCT_CATEGORIES, FAQ_CATEGORIES } from '../../constants/categories';
import ImageUploadInput from '../../components/ImageUploadInput';
import {
  getRtdbProducts,
  saveRtdbProduct,
  deleteRtdbProduct,
  getRtdbCategories,
  saveRtdbCategory,
  deleteRtdbCategory,
  getRtdbNews,
  saveRtdbNews,
  deleteRtdbNews,
  getRtdbFaqs,
  saveRtdbFaq,
  deleteRtdbFaq,
  getRtdbMachinery,
  saveRtdbMachinery,
  deleteRtdbMachinery,
  getRtdbContacts,
  saveRtdbContact,
  deleteRtdbContact,
  saveRtdbUser,
  deleteRtdbUser
} from '../../services/rtdbService';

export default function AdminDashboard() {
  const { userProfile, role, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Tab điều hướng chính
  const [activeTab, setActiveTab] = useState('products');
  const [isSyncingRtdb, setIsSyncingRtdb] = useState(false);
  const [isDesigningProduct, setIsDesigningProduct] = useState(false);
  const [isTranslatingProduct, setIsTranslatingProduct] = useState(false);
  const [isRewritingDesc, setIsRewritingDesc] = useState(false);
  const [productAiHints, setProductAiHints] = useState('');
  const [productModalTab, setProductModalTab] = useState('edit'); // 'edit' | 'preview'
  const [isDesigningNews, setIsDesigningNews] = useState(false);
  const [isTranslatingNews, setIsTranslatingNews] = useState(false);
  const [isTranslatingFaq, setIsTranslatingFaq] = useState(false);
  const [isTranslatingMachinery, setIsTranslatingMachinery] = useState(false);
  const [newsModalTab, setNewsModalTab] = useState('edit'); // 'edit' | 'preview'

  // ============================================================================
  // STATE CRUD: DANH MỤC SẢN PHẨM (CATEGORIES)
  // ============================================================================
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('casa_admin_categories');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
    return PRODUCT_CATEGORIES.filter((c) => c.id !== 'all').map((c, i) => ({
      id: c.id,
      slug: c.id,
      name: c.name,
      nameZh: '',
      order: i + 1,
      active: true,
      desc: '',
      descZh: ''
    }));
  });

  const [categorySearch, setCategorySearch] = useState('');
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const [deleteCategoryModalOpen, setDeleteCategoryModalOpen] = useState(false);
  const [isTranslatingCategory, setIsTranslatingCategory] = useState(false);

  const initialCategoryForm = {
    id: '',
    name: '',
    nameZh: '',
    slug: '',
    order: 1,
    desc: '',
    descZh: '',
    active: true
  };
  const [categoryFormData, setCategoryFormData] = useState(initialCategoryForm);

  const generateCategorySlug = (str) => {
    return str
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-');
  };

  const handleOpenCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryFormData({
        id: cat.id || '',
        name: cat.name || '',
        nameZh: cat.nameZh || '',
        slug: cat.slug || cat.id || '',
        order: cat.order || 1,
        desc: cat.desc || '',
        descZh: cat.descZh || '',
        active: cat.active !== false
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData({
        id: '',
        name: '',
        nameZh: '',
        slug: '',
        order: categories.length + 1,
        desc: '',
        descZh: '',
        active: true
      });
    }
    setCategoryModalOpen(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) {
      showToast('Vui lòng nhập tên danh mục!', 'error');
      return;
    }

    const cleanSlug = categoryFormData.slug.trim() || generateCategorySlug(categoryFormData.name);
    const catId = editingCategory ? editingCategory.id : (cleanSlug || `cat_${Date.now()}`);

    const payload = {
      ...categoryFormData,
      id: catId,
      slug: cleanSlug,
      order: Number(categoryFormData.order) || 1,
      active: categoryFormData.active !== false
    };

    try {
      setIsSyncingRtdb(true);
      await saveRtdbCategory(payload);

      setCategories((prev) => {
        const idx = prev.findIndex((c) => c.id === catId);
        let updated;
        if (idx >= 0) {
          updated = [...prev];
          updated[idx] = payload;
        } else {
          updated = [...prev, payload];
        }
        return updated.sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99));
      });

      showToast(editingCategory ? 'Đã cập nhật danh mục thành công!' : 'Đã thêm danh mục mới thành công!', 'success');
      setCategoryModalOpen(false);
    } catch (err) {
      showToast('Lỗi lưu danh mục: ' + err.message, 'error');
    } finally {
      setIsSyncingRtdb(false);
    }
  };

  const handleTranslateCategory = async () => {
    if (!categoryFormData.name.trim()) {
      showToast('Vui lòng nhập tên danh mục tiếng Việt trước!', 'warning');
      return;
    }
    try {
      setIsTranslatingCategory(true);
      const res = await translateCategoryToTraditionalChinese({
        name: categoryFormData.name,
        desc: categoryFormData.desc
      });
      if (res && res.nameZh) {
        setCategoryFormData((prev) => ({
          ...prev,
          nameZh: res.nameZh,
          descZh: res.descZh || prev.descZh
        }));
        showToast('Đã dịch sang tiếng Trung Phồn thể thành công!', 'success');
      }
    } catch (err) {
      showToast('Lỗi dịch tiếng Trung: ' + err.message, 'error');
    } finally {
      setIsTranslatingCategory(false);
    }
  };

  const handleDeleteCategory = async () => {
    if (!categoryToDelete) return;
    try {
      setIsSyncingRtdb(true);
      await deleteRtdbCategory(categoryToDelete.id);
      setCategories((prev) => prev.filter((c) => c.id !== categoryToDelete.id));
      showToast(`Đã xóa danh mục "${categoryToDelete.name}" thành công!`, 'success');
      setDeleteCategoryModalOpen(false);
      setCategoryToDelete(null);
    } catch (err) {
      showToast('Lỗi xóa danh mục: ' + err.message, 'error');
    } finally {
      setIsSyncingRtdb(false);
    }
  };

  // ============================================================================
  // 1. STATE CRUD: SẢN PHẨM (PRODUCTS)
  // ============================================================================
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('casa_admin_products');
    return saved ? JSON.parse(saved) : [];
  });

  // Tải dữ liệu trực tiếp từ Firebase Realtime Database khi mở trang
  useEffect(() => {
    getRtdbCategories().then((res) => {
      if (res && res.length > 0) setCategories(res);
    });
    getRtdbProducts().then((res) => {
      if (res && res.length > 0) setProducts(res);
    });
    getRtdbNews().then((res) => {
      if (res && res.length > 0) setNews(res);
    });
    getRtdbFaqs().then((res) => {
      if (res && res.length > 0) setFaqs(res);
    });
    getRtdbMachinery().then((res) => {
      if (res && res.length > 0) setMachinery(res);
    });
    getRtdbContacts().then((res) => {
      if (res && res.length > 0) setContacts(res);
    });
  }, []);
  const [productSearch, setProductSearch] = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('all');
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [productFormData, setProductFormData] = useState({
    name: '',
    nameZh: '',
    sku: '',
    category: 'tra-den',
    categoryName: 'Trà Đen',
    badge: 'Bán chạy',
    badgeZh: '',
    shortDesc: '',
    shortDescZh: '',
    fullDesc: '',
    fullDescZh: '',
    origin: 'Bảo Lộc, Lâm Đồng',
    originZh: '',
    image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
    status: 'PUBLISHED',
    purchaseAction: 'contact',
    shopeeUrl: '',
    tasteProfile: { aroma: 85, body: 90, sweetness: 75, color: 'Nâu đỏ ruby' },
    applications: ['Trà sữa truyền thống', 'Trà kem cheese'],
    packaging: ['Gói 1kg (10 gói/thùng)']
  });

  useEffect(() => {
    localStorage.setItem('casa_admin_products', JSON.stringify(products));
  }, [products]);

  // ============================================================================
  // 2. STATE CRUD: TIN TỨC & CÔNG THỨC (NEWS)
  // ============================================================================
  const [news, setNews] = useState(() => {
    const saved = localStorage.getItem('casa_admin_news');
    return saved ? JSON.parse(saved) : [];
  });
  const [newsSearch, setNewsSearch] = useState('');
  const [newsModalOpen, setNewsModalOpen] = useState(false);
  const [editingNews, setEditingNews] = useState(null);
  const [newsFormData, setNewsFormData] = useState({
    title: '',
    titleZh: '',
    slug: '',
    category: 'cong-thuc',
    categoryName: 'Công Thức Pha Chế',
    excerpt: '',
    excerptZh: '',
    author: 'CASA R&D Team',
    readTime: '4 phút',
    date: '05 Tháng 09, 2026',
    status: 'PUBLISHED',
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
    content: '',
    contentZh: '',
    featuredHome: false,
    featuredNews: false
  });

  useEffect(() => {
    localStorage.setItem('casa_admin_news', JSON.stringify(news));
  }, [news]);

  // ============================================================================
  // 3. STATE CRUD: CÂU HỎI THƯỜNG GẶP (FAQ)
  // ============================================================================
  const [faqs, setFaqs] = useState(() => {
    const saved = localStorage.getItem('casa_admin_faqs');
    return saved ? JSON.parse(saved) : [];
  });
  const [faqModalOpen, setFaqModalOpen] = useState(false);
  const [editingFaq, setEditingFaq] = useState(null);
  const [faqFormData, setFaqFormData] = useState({
    question: '',
    questionZh: '',
    answer: '',
    answerZh: '',
    category: 'san-pham'
  });

  useEffect(() => {
    localStorage.setItem('casa_admin_faqs', JSON.stringify(faqs));
  }, [faqs]);

  // ============================================================================
  // 4. STATE CRUD: MÁY MÓC & CHỨNG NHẬN (MACHINERY)
  // ============================================================================
  const [machinery, setMachinery] = useState(() => {
    const saved = localStorage.getItem('casa_admin_machinery');
    return saved ? JSON.parse(saved) : [];
  });
  const [machineryModalOpen, setMachineryModalOpen] = useState(false);
  const [editingMachinery, setEditingMachinery] = useState(null);
  const [machineryFormData, setMachineryFormData] = useState({
    name: '',
    nameZh: '',
    category: 'Sàng Lọc & Phân Loại',
    categoryZh: '',
    origin: 'Thụy Sĩ',
    originZh: '',
    capacity: '2.5 tấn/giờ',
    capacityZh: '',
    status: 'Hoạt động 100%',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
    description: '',
    descriptionZh: ''
  });

  useEffect(() => {
    localStorage.setItem('casa_admin_machinery', JSON.stringify(machinery));
  }, [machinery]);

  // ============================================================================
  // 5. STATE CRUD: QUẢN LÝ LIÊN HỆ B2B (CONTACTS)
  // ============================================================================
  const [contacts, setContacts] = useState(() => {
    const saved = localStorage.getItem('casa_admin_contacts');
    return saved
      ? JSON.parse(saved)
      : [
          {
            id: 'contact-01',
            name: 'Nguyễn Thanh Tùng',
            company: 'Chuỗi Trà Sữa Boba Hub (12 Quán)',
            phone: '0912 345 678',
            email: 'tung.nguyen@bobahub.vn',
            productInterest: 'Trà Ô Long Nướng & Bột Béo',
            status: 'NEW',
            requestSample: true,
            createdAt: 'Hôm nay, 08:30',
          },
          {
            id: 'contact-02',
            name: 'Lê Minh Hạnh',
            company: 'Tiệm Trà Mộc Hương Đà Nẵng',
            phone: '0988 765 432',
            email: 'hanh.le@mochuong.com',
            productInterest: 'Trà Lài Tuyết Hoa',
            status: 'CONTACTED',
            requestSample: true,
            createdAt: 'Hôm qua, 15:45',
          },
          {
            id: 'contact-03',
            name: 'Hoàng Quốc Bảo',
            company: 'Xưởng Đóng Chai Trà Giải Khát Tân Phát',
            phone: '0903 889 911',
            email: 'bao.hoang@tanphatbev.vn',
            productInterest: 'Trà Đen CTC Xuất Khẩu',
            status: 'COMPLETED',
            requestSample: false,
            createdAt: '03/09/2026',
          }
        ];
  });

  useEffect(() => {
    localStorage.setItem('casa_admin_contacts', JSON.stringify(contacts));
  }, [contacts]);

  // ============================================================================
  // 6. STATE CRUD: QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN (USERS)
  // ============================================================================
  const [usersList, setUsersList] = useState(() => {
    const saved = localStorage.getItem('casa_admin_users');
    return saved
      ? JSON.parse(saved)
      : [
          {
            uid: userProfile?.uid || 'admin_super',
            email: userProfile?.email || 'admin@casate.com',
            displayName: userProfile?.displayName || 'Super Admin',
            role: ROLES.SUPER_ADMIN,
            status: 'ACTIVE',
            createdAt: '05/09/2026'
          },
          {
            uid: 'usr_editor_01',
            email: 'editor@casatea.vn',
            displayName: 'Trần Ban Biên Tập',
            role: ROLES.EDITOR,
            status: 'ACTIVE',
            createdAt: '01/09/2026'
          },
          {
            uid: 'usr_viewer_01',
            email: 'viewer.sale@casatea.vn',
            displayName: 'Lê Chuyên Viên Sale',
            role: ROLES.VIEWER,
            status: 'ACTIVE',
            createdAt: '02/09/2026'
          }
        ];
  });
  const [userModalOpen, setUserModalOpen] = useState(false);
  const [userFormData, setUserFormData] = useState({
    displayName: '',
    email: '',
    role: ROLES.EDITOR,
    status: 'ACTIVE'
  });

  useEffect(() => {
    localStorage.setItem('casa_admin_users', JSON.stringify(usersList));
  }, [usersList]);

  // Thông tin Badge Role
  const badgeInfo = getRoleBadgeInfo(role);

  // Đăng xuất
  const handleLogout = async () => {
    try {
      await logout();
      showToast('Đã đăng xuất khỏi hệ thống an toàn.', 'info');
      navigate('/admin/login');
    } catch (err) {
      showToast('Lỗi khi đăng xuất: ' + err.message, 'error');
    }
  };

  // ============================================================================
  // HANDLERS: PRODUCTS CRUD
  // ============================================================================
  const handleOpenProductModal = (prod = null) => {
    setProductAiHints('');
    setProductModalTab('edit');
    if (prod) {
      setEditingProduct(prod);
      setProductFormData({
        name: prod.name || '',
        sku: prod.sku || '',
        category: prod.category || 'tra-den',
        categoryName: prod.categoryName || 'Trà Đen',
        badge: prod.badge || '',
        shortDesc: prod.shortDesc || '',
        fullDesc: prod.fullDesc || prod.shortDesc || '',
        origin: prod.origin || 'Bảo Lộc, Lâm Đồng',
        image: prod.image || '',
        status: prod.status || 'PUBLISHED',
        purchaseAction: prod.purchaseAction || (prod.shopeeUrl ? 'shopee' : 'contact'),
        shopeeUrl: prod.shopeeUrl || '',
        tasteProfile: prod.tasteProfile || { aroma: 85, body: 90, sweetness: 75, color: 'Nâu đỏ ruby' },
        applications: prod.applications || ['Trà sữa truyền thống'],
        packaging: prod.packaging || ['Gói 1kg'],
        brewingGuide: prod.brewingGuide || {
          ratio: '1:30 (35g trà / 1050ml nước)',
          temp: '92°C - 95°C',
          time: '12 - 14 phút',
          tips: 'Sốc nhiệt ngay với 250g đá bi sau khi lọc bã để giữ hương.'
        }
      });
    } else {
      setEditingProduct(null);
      setProductFormData({
        name: '',
        sku: `CS-TEA-${Math.floor(10 + Math.random() * 90)}`,
        category: 'tra-den',
        categoryName: 'Trà Đen',
        badge: 'Hàng Mới',
        shortDesc: '',
        fullDesc: '',
        origin: 'Cao nguyên Bảo Lộc, Lâm Đồng',
        image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80',
        status: 'PUBLISHED',
        purchaseAction: 'contact',
        shopeeUrl: '',
        tasteProfile: { aroma: 90, body: 90, sweetness: 80, color: 'Đỏ Hổ Phách' },
        applications: ['Trà sữa đậm vị', 'Trà trái cây tươi'],
        packaging: ['Gói 1kg (10 gói/thùng)', 'Bao 25kg'],
        brewingGuide: {
          ratio: '1:30 (35g trà / 1050ml nước)',
          temp: '92°C - 95°C',
          time: '12 - 14 phút',
          tips: 'Sốc nhiệt ngay với 250g đá bi sau khi lọc bã để giữ hương.'
        }
      });
    }
    setProductModalOpen(true);
  };

  // 1. Tự động thiết kế toàn bộ sản phẩm bằng Gemini AI 3.6 Flash
  const handleGeminiDesignProduct = async () => {
    setIsDesigningProduct(true);
    try {
      showToast('Đang kết nối Gemini AI 3.6 Flash để sáng tạo thông số sản phẩm...', 'info');
      const hints = productAiHints.trim() || productFormData.name || productFormData.shortDesc;
      const designed = await generateProductWithGemini({
        hints,
        name: productFormData.name,
        category: productFormData.category,
        shortDesc: productFormData.shortDesc,
        fullDesc: productFormData.fullDesc,
        origin: productFormData.origin
      });

      setProductFormData((prev) => ({
        ...prev,
        name: designed.name || prev.name,
        badge: designed.badge || prev.badge,
        shortDesc: designed.shortDesc || prev.shortDesc,
        fullDesc: designed.fullDesc || prev.fullDesc,
        origin: designed.origin || prev.origin,
        tasteProfile: designed.tasteProfile || prev.tasteProfile,
        applications: Array.isArray(designed.applications) && designed.applications.length > 0 ? designed.applications : prev.applications,
        packaging: Array.isArray(designed.packaging) && designed.packaging.length > 0 ? designed.packaging : prev.packaging,
        brewingGuide: designed.brewingGuide || prev.brewingGuide
      }));

      if (designed.isAiGenerated) {
        showToast(`✨ Gemini AI 3.6 Flash đã thiết kế xuất sắc: "${designed.name}"!`, 'success');
      } else {
        showToast(`✨ Đã thiết kế hoàn chỉnh [${designed.name}] theo mẫu R&D chuẩn!`, 'success');
      }
    } catch (err) {
      showToast('Lỗi khi thiết kế Gemini AI: ' + err.message, 'error');
    } finally {
      setIsDesigningProduct(false);
    }
  };

  // 2. Chuyên biệt: Dùng Gemini AI viết lại mô tả bám sát đúng từ khóa người dùng nhập (Ví dụ: kem muối -> mặn béo, kem cheese -> béo ngậy)
  const handleGeminiRewriteDescription = async (specificText = null, targetField = 'both') => {
    setIsRewritingDesc(true);
    try {
      const textToRewrite = (
        (typeof specificText === 'string' && specificText.trim()) ||
        productAiHints.trim() ||
        productFormData.shortDesc.trim() ||
        productFormData.fullDesc.trim() ||
        productFormData.name.trim()
      );

      if (!textToRewrite) {
        showToast('Vui lòng gõ vài từ khóa (Ví dụ: kem muối, kem cheese...) vào ô mô tả hoặc khung gợi ý!', 'warning');
        setIsRewritingDesc(false);
        return;
      }

      showToast(`Gemini AI đang viết lại mô tả bám sát từ khóa: "${textToRewrite}"...`, 'info');
      const res = await rewriteDescriptionWithGemini({
        text: textToRewrite,
        currentName: productFormData.name,
        currentShortDesc: productFormData.shortDesc,
        currentFullDesc: productFormData.fullDesc
      });

      setProductFormData((prev) => {
        if (targetField === 'shortOnly') {
          return { ...prev, shortDesc: res.shortDesc || prev.shortDesc };
        }
        if (targetField === 'fullOnly') {
          return { ...prev, fullDesc: res.fullDesc || prev.fullDesc };
        }
        return {
          ...prev,
          shortDesc: res.shortDesc || prev.shortDesc,
          fullDesc: res.fullDesc || prev.fullDesc
        };
      });

      showToast(`✨ Đã viết lại mô tả chuẩn vị bám sát: "${textToRewrite}"!`, 'success');
    } catch (err) {
      showToast('Lỗi khi viết lại mô tả: ' + err.message, 'error');
    } finally {
      setIsRewritingDesc(false);
    }
  };

  // Tương thích alias
  const handleAiAutoDesignProduct = handleGeminiDesignProduct;

  // 3. Dịch thông tin sản phẩm sang Trung Phồn Thể (繁體中文) bằng Gemini AI
  const handleTranslateProductZh = async () => {
    if (!productFormData.name.trim() && !productFormData.shortDesc.trim()) {
      showToast('Vui lòng nhập Tên sản phẩm hoặc Mô tả trước khi dịch!', 'warning');
      return;
    }
    setIsTranslatingProduct(true);
    try {
      showToast('Gemini AI đang dịch sản phẩm sang Trung Phồn Thể (繁體中文)...', 'info');
      const zhResult = await translateProductToTraditionalChinese(productFormData);
      setProductFormData((prev) => ({
        ...prev,
        nameZh: zhResult.nameZh || prev.nameZh,
        badgeZh: zhResult.badgeZh || prev.badgeZh,
        shortDescZh: zhResult.shortDescZh || prev.shortDescZh,
        fullDescZh: zhResult.fullDescZh || prev.fullDescZh,
        originZh: zhResult.originZh || prev.originZh
      }));
      showToast(`✨ Đã dịch hoàn tất sang Trung Phồn Thể: "${zhResult.nameZh}"!`, 'success');
    } catch (err) {
      showToast('Lỗi khi dịch sản phẩm: ' + err.message, 'error');
    } finally {
      setIsTranslatingProduct(false);
    }
  };

  // 4. Dịch bài viết sang Trung Phồn Thể (繁體中文) bằng Gemini AI
  const handleTranslateNewsZh = async () => {
    if (!newsFormData.title.trim()) {
      showToast('Vui lòng nhập Tiêu đề bài viết trước khi dịch!', 'warning');
      return;
    }
    setIsTranslatingNews(true);
    try {
      showToast('Gemini AI đang dịch bài viết sang Trung Phồn Thể (繁體中文)...', 'info');
      const zhResult = await translateArticleToTraditionalChinese(newsFormData);
      setNewsFormData((prev) => ({
        ...prev,
        titleZh: zhResult.titleZh || prev.titleZh,
        excerptZh: zhResult.excerptZh || prev.excerptZh,
        contentZh: zhResult.contentZh || prev.contentZh
      }));
      showToast(`✨ Đã dịch hoàn tất bài viết sang Trung Phồn Thể: "${zhResult.titleZh}"!`, 'success');
    } catch (err) {
      showToast('Lỗi khi dịch bài viết: ' + err.message, 'error');
    } finally {
      setIsTranslatingNews(false);
    }
  };

  // Đồng bộ toàn bộ dữ liệu mẫu lên Firebase Realtime Database
  const handleSyncAllToRtdb = async () => {
    setIsSyncingRtdb(true);
    try {
      showToast('Đang đồng bộ dữ liệu lên Firebase Realtime Database...', 'info');
      for (const p of products) {
        await saveRtdbProduct(p);
      }
      for (const n of news) {
        await saveRtdbNews(n);
      }
      for (const f of faqs) {
        await saveRtdbFaq(f);
      }
      for (const m of machinery) {
        await saveRtdbMachinery(m);
      }
      for (const c of contacts) {
        await saveRtdbContact(c);
      }
      showToast('Đã đẩy toàn bộ Sản phẩm, Tin tức, FAQ lên Firebase Realtime Database!', 'success');
    } catch (err) {
      showToast('Lỗi khi đồng bộ: ' + err.message, 'error');
    } finally {
      setIsSyncingRtdb(false);
    }
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!productFormData.name.trim() || !productFormData.sku.trim()) {
      showToast('Vui lòng điền đầy đủ Tên sản phẩm và SKU!', 'error');
      return;
    }

    let finalData = { ...productFormData };

    // TỰ ĐỘNG DỊCH SANG TRUNG PHỒN THỂ (繁體中文) NẾU CHƯA CÓ
    if (!finalData.nameZh || !finalData.nameZh.trim()) {
      try {
        const zh = await translateProductToTraditionalChinese(finalData);
        finalData.nameZh = zh.nameZh;
        finalData.badgeZh = zh.badgeZh;
        finalData.shortDescZh = zh.shortDescZh;
        finalData.fullDescZh = zh.fullDescZh;
        finalData.originZh = zh.originZh;
      } catch (e) {
        console.warn('Tự động dịch ngầm:', e);
      }
    }

    if (editingProduct) {
      // SỬA (UPDATE)
      const updatedProd = {
        ...editingProduct,
        ...finalData,
        updatedAt: new Date().toISOString()
      };
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProduct.id ? updatedProd : p))
      );
      // Ghi trực tiếp lên Firebase Realtime Database
      await saveRtdbProduct(updatedProd);
      showToast(`Đã lưu [${finalData.name}] (kèm bản dịch 繁體中文) lên Realtime Database!`, 'success');
    } else {
      // THÊM MỚI (CREATE)
      const newId = `product_${Date.now()}`;
      const newProd = {
        id: newId,
        ...finalData,
        createdAt: new Date().toISOString()
      };
      setProducts((prev) => [newProd, ...prev]);
      // Ghi trực tiếp lên Firebase Realtime Database
      await saveRtdbProduct(newProd);
      showToast(`Đã thêm mới [${finalData.name}] (kèm bản dịch 繁體中文) lên Realtime Database!`, 'success');
    }

    setProductModalOpen(false);
  };

  const handleDeleteProduct = async (productId, productName) => {
    if (!canManageContent(role)) {
      showToast('Bạn không có quyền xóa sản phẩm!', 'error');
      return;
    }
    if (window.confirm(`Bạn có chắc chắn muốn xóa sản phẩm "${productName}"?`)) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
      // Xóa trực tiếp trên Firebase Realtime Database
      await deleteRtdbProduct(productId);
      showToast(`Đã xóa sản phẩm "${productName}" trên Realtime Database.`, 'info');
    }
  };

  const handleToggleProductStatus = async (productId) => {
    let targetProd = null;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          const nextStatus = p.status === 'PUBLISHED' ? 'DRAFT' : 'PUBLISHED';
          targetProd = { ...p, status: nextStatus };
          showToast(`Đã đổi trạng thái sang [${nextStatus}] trên Firebase`, 'info');
          return targetProd;
        }
        return p;
      })
    );
    if (targetProd) {
      await saveRtdbProduct(targetProd);
    }
  };

  // ============================================================================
  // HANDLERS: NEWS CRUD
  // ============================================================================
  const handleOpenNewsModal = (item = null) => {
    setNewsModalTab('edit');
    if (item) {
      setEditingNews(item);
      setNewsFormData({
        title: item.title || '',
        titleZh: item.titleZh || item.title_zh || '',
        slug: item.slug || '',
        category: item.category || 'cong-thuc',
        categoryName: item.categoryName || 'Công Thức Pha Chế',
        excerpt: item.excerpt || '',
        excerptZh: item.excerptZh || item.excerpt_zh || '',
        author: item.author || 'CASA R&D Team',
        readTime: item.readTime || '4 phút',
        date: item.date || '05 Tháng 09, 2026',
        status: item.status || 'PUBLISHED',
        image: item.image || '',
        content: item.content || '',
        contentZh: item.contentZh || item.content_zh || '',
        recipeBox: item.recipeBox || null,
        tags: item.tags || [],
        featuredHome: Boolean(item.featuredHome),
        featuredNews: Boolean(item.featuredNews ?? item.featured)
      });
    } else {
      setEditingNews(null);
      setNewsFormData({
        title: '',
        titleZh: '',
        slug: `bai-viet-${Date.now()}`,
        category: 'cong-thuc',
        categoryName: 'Công Thức Pha Chế',
        excerpt: '',
        excerptZh: '',
        author: userProfile?.displayName || 'CASA R&D Team',
        readTime: '4 phút',
        date: new Date().toLocaleDateString('vi-VN', { day: '2-digit', month: 'long', year: 'numeric' }),
        status: 'PUBLISHED',
        image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
        content: '',
        contentZh: '',
        recipeBox: null,
        tags: ['CASA Tea', 'F&B 2026'],
        featuredHome: false,
        featuredNews: false
      });
    }
    setNewsModalOpen(true);
  };

  // Tự động thiết kế bài viết & công thức bằng AI
  const handleAiAutoDesignNews = (templateType = 'recipe') => {
    setIsDesigningNews(true);
    try {
      const designed = autoDesignArticle(newsFormData, templateType);
      setNewsFormData(designed);
      showToast(`✨ Đã tự động thiết kế hoàn chỉnh bài viết [${designed.title}]!`, 'success');
    } catch (err) {
      showToast('Lỗi khi thiết kế bài viết: ' + err.message, 'error');
    } finally {
      setIsDesigningNews(false);
    }
  };

  const handleSaveNews = async (e) => {
    e.preventDefault();
    if (!newsFormData.title.trim()) {
      showToast('Tiêu đề bài viết không được để trống!', 'error');
      return;
    }

    let finalData = { ...newsFormData };

    // TỰ ĐỘNG DỊCH BÀI VIẾT SANG TRUNG PHỒN THỂ (繁體中文) NẾU CHƯA CÓ
    if (!finalData.titleZh || !finalData.titleZh.trim()) {
      try {
        const zh = await translateArticleToTraditionalChinese(finalData);
        finalData.titleZh = zh.titleZh;
        finalData.excerptZh = zh.excerptZh;
        finalData.contentZh = zh.contentZh;
      } catch (e) {
        console.warn('Tự động dịch ngầm bài viết:', e);
      }
    }

    if (editingNews) {
      const updated = {
        ...editingNews,
        ...finalData,
        featured: Boolean(finalData.featuredNews),
        featuredNews: Boolean(finalData.featuredNews),
        featuredHome: Boolean(finalData.featuredHome)
      };
      setNews((prev) =>
        prev.map((n) => (n.id === editingNews.id ? updated : n))
      );
      await saveRtdbNews(updated);
      showToast(`Đã cập nhật bài viết [${finalData.title}] (kèm bản dịch 繁體中文) lên Realtime Database!`, 'success');
    } else {
      const newArticle = {
        id: `news_${Date.now()}`,
        ...finalData,
        featured: Boolean(finalData.featuredNews),
        featuredNews: Boolean(finalData.featuredNews),
        featuredHome: Boolean(finalData.featuredHome)
      };
      setNews((prev) => [newArticle, ...prev]);
      await saveRtdbNews(newArticle);
      showToast(`Đã xuất bản bài viết mới (kèm bản dịch 繁體中文) lên Realtime Database!`, 'success');
    }
    setNewsModalOpen(false);
  };

  // Bật/tắt nhanh nổi bật trên Trang Chủ (Home)
  const handleToggleNewsFeaturedHome = async (newsId) => {
    let updatedArticle = null;
    const updatedList = news.map((item) => {
      if (item.id === newsId) {
        const nextVal = !Boolean(item.featuredHome);
        updatedArticle = { ...item, featuredHome: nextVal };
        return updatedArticle;
      }
      return item;
    });
    setNews(updatedList);
    if (updatedArticle) {
      await saveRtdbNews(updatedArticle);
      showToast(
        updatedArticle.featuredHome
          ? `⭐ Đã chọn [${updatedArticle.title}] làm nổi bật Trang Chủ!`
          : `Đã gỡ [${updatedArticle.title}] khỏi nổi bật Trang Chủ.`,
        'success'
      );
    }
  };

  // Bật/tắt nhanh tiêu điểm chính trên Trang Tin Tức (News Hero)
  const handleToggleNewsFeaturedHero = async (newsId) => {
    let targetTitle = '';
    let isNowHero = false;
    const currentItem = news.find((n) => n.id === newsId);
    const willBeHero = !Boolean(currentItem?.featuredNews ?? currentItem?.featured);

    const updatedList = news.map((item) => {
      if (item.id === newsId) {
        targetTitle = item.title;
        isNowHero = willBeHero;
        return {
          ...item,
          featuredNews: willBeHero,
          featured: willBeHero
        };
      }
      if (willBeHero && (item.featuredNews || item.featured)) {
        return {
          ...item,
          featuredNews: false,
          featured: false
        };
      }
      return item;
    });

    setNews(updatedList);
    for (const item of updatedList) {
      if (item.id === newsId || (willBeHero && (item.featuredNews === false))) {
        await saveRtdbNews(item);
      }
    }

    showToast(
      isNowHero
        ? `📰 Đã đặt [${targetTitle}] làm tiêu điểm chính (Hero) Trang Tin Tức!`
        : `Đã bỏ tiêu điểm Trang Tin Tức cho [${targetTitle}].`,
      'success'
    );
  };

  const handleDeleteNews = async (id, title) => {
    if (window.confirm(`Xóa bài viết "${title}"?`)) {
      setNews((prev) => prev.filter((n) => n.id !== id));
      await deleteRtdbNews(id);
      showToast('Đã xóa bài viết trên Realtime Database.', 'info');
    }
  };

  // ============================================================================
  // HANDLERS: FAQ CRUD
  // ============================================================================
  const handleOpenFaqModal = (item = null) => {
    if (item) {
      setEditingFaq(item);
      setFaqFormData({
        question: item.question || '',
        questionZh: item.questionZh || item.question_zh || '',
        answer: item.answer || '',
        answerZh: item.answerZh || item.answer_zh || '',
        category: item.category || 'san-pham'
      });
    } else {
      setEditingFaq(null);
      setFaqFormData({ question: '', questionZh: '', answer: '', answerZh: '', category: 'san-pham' });
    }
    setFaqModalOpen(true);
  };

  const handleTranslateFaqZh = async () => {
    if (!faqFormData.question.trim() && !faqFormData.answer.trim()) {
      showToast('Vui lòng nhập câu hỏi hoặc câu trả lời trước khi dịch!', 'error');
      return;
    }
    try {
      setIsTranslatingFaq(true);
      showToast('🤖 AI Gemini đang dịch câu hỏi FAQ sang Trung Phồn Thể...', 'info');
      const res = await translateFaqToTraditionalChinese(faqFormData);
      setFaqFormData((prev) => ({
        ...prev,
        questionZh: res.questionZh,
        answerZh: res.answerZh
      }));
      showToast('Đã dịch câu hỏi FAQ sang Trung Phồn Thể thành công!', 'success');
    } catch (err) {
      showToast('Lỗi khi dịch FAQ: ' + err.message, 'error');
    } finally {
      setIsTranslatingFaq(false);
    }
  };

  const handleSaveFaq = async (e) => {
    e.preventDefault();
    if (!faqFormData.question.trim() || !faqFormData.answer.trim()) {
      showToast('Vui lòng điền câu hỏi và câu trả lời!', 'error');
      return;
    }

    let finalData = { ...faqFormData };

    // Tự động dịch ngầm sang tiếng Trung nếu admin chưa điền
    if (!finalData.questionZh?.trim() || !finalData.answerZh?.trim()) {
      try {
        setIsTranslatingFaq(true);
        const zh = await translateFaqToTraditionalChinese(finalData);
        finalData.questionZh = zh.questionZh || finalData.questionZh || '';
        finalData.answerZh = zh.answerZh || finalData.answerZh || '';
      } catch (err) {
        console.warn('Lỗi dịch ngầm FAQ:', err);
      } finally {
        setIsTranslatingFaq(false);
      }
    }

    if (editingFaq) {
      const updated = { ...editingFaq, ...finalData };
      setFaqs((prev) =>
        prev.map((f) => (f.id === editingFaq.id ? updated : f))
      );
      await saveRtdbFaq(updated);
      showToast('Đã cập nhật câu hỏi FAQ song ngữ lên Realtime Database!', 'success');
    } else {
      const newFaq = { id: `faq_${Date.now()}`, ...finalData };
      setFaqs((prev) => [newFaq, ...prev]);
      await saveRtdbFaq(newFaq);
      showToast('Đã thêm câu hỏi FAQ mới song ngữ lên Realtime Database!', 'success');
    }
    setFaqModalOpen(false);
  };

  const handleDeleteFaq = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa câu hỏi FAQ này?')) {
      setFaqs((prev) => prev.filter((f) => f.id !== id));
      await deleteRtdbFaq(id);
      showToast('Đã xóa câu hỏi FAQ trên Realtime Database.', 'info');
    }
  };

  // ============================================================================
  // HANDLERS: MACHINERY CRUD
  // ============================================================================
  const handleOpenMachineryModal = (item = null) => {
    if (item) {
      setEditingMachinery(item);
      setMachineryFormData({
        name: item.name || '',
        nameZh: item.nameZh || item.name_zh || '',
        category: item.category || 'Sàng Lọc & Phân Loại',
        categoryZh: item.categoryZh || item.category_zh || '',
        origin: item.origin || 'CHLB Đức',
        originZh: item.originZh || item.origin_zh || '',
        capacity: item.capacity || '3 tấn/giờ',
        capacityZh: item.capacityZh || item.capacity_zh || '',
        status: item.status || 'Hoạt động 100%',
        image: item.image || 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
        description: item.description || item.desc || '',
        descriptionZh: item.descriptionZh || item.description_zh || item.descZh || ''
      });
    } else {
      setEditingMachinery(null);
      setMachineryFormData({
        name: '',
        nameZh: '',
        category: 'Sàng Lọc & Phân Loại',
        categoryZh: '',
        origin: 'CHLB Đức',
        originZh: '',
        capacity: '3 tấn/giờ',
        capacityZh: '',
        status: 'Hoạt động 100%',
        image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80',
        description: '',
        descriptionZh: ''
      });
    }
    setMachineryModalOpen(true);
  };

  const handleTranslateMachineryZh = async () => {
    if (!machineryFormData.name.trim()) {
      showToast('Vui lòng nhập tên thiết bị trước khi dịch!', 'error');
      return;
    }
    try {
      setIsTranslatingMachinery(true);
      showToast('🤖 AI Gemini đang dịch thiết bị máy móc sang Trung Phồn Thể...', 'info');
      const res = await translateMachineryToTraditionalChinese(machineryFormData);
      setMachineryFormData((prev) => ({
        ...prev,
        nameZh: res.nameZh,
        categoryZh: res.categoryZh,
        originZh: res.originZh,
        capacityZh: res.capacityZh,
        descriptionZh: res.descriptionZh
      }));
      showToast('Đã dịch thiết bị máy móc sang Trung Phồn Thể thành công!', 'success');
    } catch (err) {
      showToast('Lỗi khi dịch máy móc: ' + err.message, 'error');
    } finally {
      setIsTranslatingMachinery(false);
    }
  };

  const handleSaveMachinery = async (e) => {
    e.preventDefault();
    if (!machineryFormData.name.trim()) {
      showToast('Vui lòng nhập tên máy móc / chứng nhận!', 'error');
      return;
    }

    let finalData = { ...machineryFormData };

    // Tự động dịch ngầm sang tiếng Trung nếu admin chưa điền
    if (!finalData.nameZh?.trim()) {
      try {
        setIsTranslatingMachinery(true);
        const zh = await translateMachineryToTraditionalChinese(finalData);
        finalData.nameZh = zh.nameZh || finalData.nameZh || '';
        finalData.categoryZh = zh.categoryZh || finalData.categoryZh || '';
        finalData.originZh = zh.originZh || finalData.originZh || '';
        finalData.capacityZh = zh.capacityZh || finalData.capacityZh || '';
        finalData.descriptionZh = zh.descriptionZh || finalData.descriptionZh || '';
      } catch (err) {
        console.warn('Lỗi dịch ngầm máy móc:', err);
      } finally {
        setIsTranslatingMachinery(false);
      }
    }

    if (editingMachinery) {
      const updated = { ...editingMachinery, ...finalData };
      setMachinery((prev) =>
        prev.map((m) => (m.id === editingMachinery.id ? updated : m))
      );
      await saveRtdbMachinery(updated);
      showToast('Đã cập nhật máy móc song ngữ lên Realtime Database!', 'success');
    } else {
      const newM = { id: `mach_${Date.now()}`, ...finalData };
      setMachinery((prev) => [newM, ...prev]);
      await saveRtdbMachinery(newM);
      showToast('Đã thêm thiết bị mới song ngữ lên Realtime Database!', 'success');
    }
    setMachineryModalOpen(false);
  };

  const handleDeleteMachinery = async (id, name) => {
    if (window.confirm(`Xóa thiết bị "${name}"?`)) {
      setMachinery((prev) => prev.filter((m) => m.id !== id));
      await deleteRtdbMachinery(id);
      showToast('Đã xóa thiết bị trên Realtime Database.', 'info');
    }
  };

  // ============================================================================
  // HANDLERS: CONTACTS STATUS & DELETE
  // ============================================================================
  const handleUpdateContactStatus = async (contactId, newStatus) => {
    if (role === ROLES.VIEWER) {
      showToast('Quyền VIEWER không được phép chỉnh sửa trạng thái!', 'error');
      return;
    }
    let updatedC = null;
    setContacts((prev) =>
      prev.map((c) => {
        if (c.id === contactId) {
          updatedC = { ...c, status: newStatus };
          return updatedC;
        }
        return c;
      })
    );
    if (updatedC) {
      await saveRtdbContact(updatedC);
    }
    showToast(`Đã cập nhật trạng thái liên hệ thành [${newStatus}] trên Realtime Database`, 'success');
  };

  const handleDeleteContact = async (contactId) => {
    if (!canDeleteContacts(role)) {
      showToast('Bị từ chối bởi Rules: Chỉ ADMIN và SUPER_ADMIN mới có quyền xóa Contacts!', 'error');
      return;
    }
    setContacts((prev) => prev.filter((c) => c.id !== contactId));
    await deleteRtdbContact(contactId);
    showToast('Đã xóa liên hệ trên Realtime Database.', 'success');
  };

  // ============================================================================
  // HANDLERS: USERS MANAGEMENT CRUD
  // ============================================================================
  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!userFormData.email.trim()) {
      showToast('Email người dùng không được để trống!', 'error');
      return;
    }
    const newUser = {
      uid: `usr_${Date.now()}`,
      ...userFormData,
      createdAt: 'Hôm nay'
    };
    setUsersList((prev) => [...prev, newUser]);
    await saveRtdbUser(newUser);
    showToast(`Đã tạo người dùng mới [${userFormData.email}] lên Realtime Database!`, 'success');
    setUserModalOpen(false);
    setUserFormData({ displayName: '', email: '', role: ROLES.EDITOR, status: 'ACTIVE' });
  };

  const handleChangeUserRole = async (targetUid, newRole) => {
    if (role !== ROLES.SUPER_ADMIN) {
      showToast('Chỉ SUPER_ADMIN mới có quyền thay đổi Role người dùng!', 'error');
      return;
    }
    let updatedU = null;
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.uid === targetUid) {
          updatedU = { ...u, role: newRole };
          return updatedU;
        }
        return u;
      })
    );
    if (updatedU) {
      await saveRtdbUser(updatedU);
    }
    showToast(`Đã phân quyền [${newRole}] cho tài khoản trên Realtime Database.`, 'success');
  };

  const handleToggleUserStatus = async (targetUid) => {
    if (role !== ROLES.SUPER_ADMIN && role !== ROLES.ADMIN) {
      showToast('Bạn không có quyền khóa hoặc mở tài khoản!', 'error');
      return;
    }
    let updatedU = null;
    setUsersList((prev) =>
      prev.map((u) => {
        if (u.uid === targetUid) {
          const next = u.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
          updatedU = { ...u, status: next };
          return updatedU;
        }
        return u;
      })
    );
    if (updatedU) {
      await saveRtdbUser(updatedU);
    }
    showToast(`Đã cập nhật trạng thái trên Realtime Database.`, 'info');
  };

  const handleDeleteUser = async (targetUid, email) => {
    if (role !== ROLES.SUPER_ADMIN) {
      showToast('Chỉ SUPER_ADMIN mới có quyền xóa tài khoản!', 'error');
      return;
    }
    if (window.confirm(`Bạn có chắc muốn xóa vĩnh viễn tài khoản [${email}]?`)) {
      setUsersList((prev) => prev.filter((u) => u.uid !== targetUid));
      await deleteRtdbUser(targetUid);
      showToast(`Đã xóa tài khoản [${email}] trên Realtime Database.`, 'info');
    }
  };

  // Danh sách sản phẩm sau khi tìm kiếm và lọc
  const filteredProducts = products.filter((p) => {
    const matchSearch =
      p.name?.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.sku?.toLowerCase().includes(productSearch.toLowerCase());
    const matchCat = productCategoryFilter === 'all' || p.category === productCategoryFilter;
    return matchSearch && matchCat;
  });

  // Danh sách bài viết sau khi tìm kiếm
  const filteredNews = news.filter((n) =>
    n.title?.toLowerCase().includes(newsSearch.toLowerCase())
  );

  return (
    <div className="pt-24 pb-20 bg-[#FAF9F5] min-h-screen text-gray-800">
      <SEO
        title="CASA Portal - Trung Tâm Quản Trị Hệ Thống CRUD"
        description="Bảng điều khiển quản trị toàn diện: CRUD Sản phẩm, Bài viết, FAQ, Máy móc và Phân quyền người dùng."
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* ==================================================================== */}
        {/* TOP HEADER CARD */}
        {/* ==================================================================== */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tea-border shadow-tea-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-tea-primary to-tea-green flex items-center justify-center text-white shadow-tea-sm shrink-0">
              <UserCheck className="w-7 h-7 text-tea-mint" />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h1 className="text-xl sm:text-2xl font-extrabold text-tea-dark">
                  {userProfile?.displayName || 'Super Admin'}
                </h1>
                <span className={`px-3 py-0.5 rounded-full font-bold text-xs border ${badgeInfo.color}`}>
                  {badgeInfo.label}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-bold border border-emerald-200">
                  {userProfile?.status || 'ACTIVE'}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email: <span className="font-mono font-bold text-tea-emerald">{userProfile?.email}</span> | UID: <span className="font-mono text-gray-400">{userProfile?.uid}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end flex-wrap">
            <button
              onClick={handleSyncAllToRtdb}
              disabled={isSyncingRtdb}
              className="px-4 py-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-bold border border-amber-300 transition-colors flex items-center gap-1.5 shadow-sm disabled:opacity-50"
              title="Đồng bộ toàn bộ Sản phẩm, Tin tức, FAQ lên Firebase Realtime Database"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-amber-600 ${isSyncingRtdb ? 'animate-spin' : ''}`} />
              <span>{isSyncingRtdb ? 'Đang đồng bộ...' : '⚡ Đẩy Tất Cả Lên Realtime'}</span>
            </button>
            <Link
              to="/"
              target="_blank"
              className="px-4 py-2.5 rounded-xl border border-tea-border text-xs font-bold text-gray-700 hover:bg-tea-soft/50 transition-colors flex items-center gap-1.5"
            >
              <Eye className="w-3.5 h-3.5 text-tea-leaf" />
              <span>Xem Website</span>
            </Link>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 text-xs font-bold border border-red-200 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Đăng xuất</span>
            </button>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* STATS OVERVIEW CARDS */}
        {/* ==================================================================== */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 sm:gap-4">
          <div
            onClick={() => setActiveTab('categories')}
            className={`cursor-pointer p-4 rounded-2xl bg-white border transition-all ${
              activeTab === 'categories' ? 'border-tea-emerald shadow-tea-sm ring-2 ring-tea-emerald/20' : 'border-tea-border hover:border-tea-leaf'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Danh mục</span>
              <Layers className="w-4 h-4 text-emerald-600" />
            </div>
            <div className="text-2xl font-black text-tea-dark mt-1">{categories.length}</div>
            <div className="text-[10px] text-emerald-600 font-semibold">CRUD Đầy Đủ</div>
          </div>
          <div
            onClick={() => setActiveTab('products')}
            className={`cursor-pointer p-4 rounded-2xl bg-white border transition-all ${
              activeTab === 'products' ? 'border-tea-emerald shadow-tea-sm ring-2 ring-tea-emerald/20' : 'border-tea-border hover:border-tea-leaf'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Sản phẩm</span>
              <Package className="w-4 h-4 text-tea-leaf" />
            </div>
            <div className="text-2xl font-black text-tea-dark mt-1">{products.length}</div>
            <div className="text-[10px] text-tea-emerald font-semibold">CRUD Đầy Đủ</div>
          </div>

          <div
            onClick={() => setActiveTab('news')}
            className={`cursor-pointer p-4 rounded-2xl bg-white border transition-all ${
              activeTab === 'news' ? 'border-tea-emerald shadow-tea-sm ring-2 ring-tea-emerald/20' : 'border-tea-border hover:border-tea-leaf'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Tin tức & Recipe</span>
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <div className="text-2xl font-black text-tea-dark mt-1">{news.length}</div>
            <div className="text-[10px] text-blue-600 font-semibold">CRUD Đầy Đủ</div>
          </div>

          <div
            onClick={() => setActiveTab('faq')}
            className={`cursor-pointer p-4 rounded-2xl bg-white border transition-all ${
              activeTab === 'faq' ? 'border-tea-emerald shadow-tea-sm ring-2 ring-tea-emerald/20' : 'border-tea-border hover:border-tea-leaf'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Hỏi đáp FAQ</span>
              <HelpCircle className="w-4 h-4 text-purple-500" />
            </div>
            <div className="text-2xl font-black text-tea-dark mt-1">{faqs.length}</div>
            <div className="text-[10px] text-purple-600 font-semibold">CRUD Đầy Đủ</div>
          </div>

          <div
            onClick={() => setActiveTab('machinery')}
            className={`cursor-pointer p-4 rounded-2xl bg-white border transition-all ${
              activeTab === 'machinery' ? 'border-tea-emerald shadow-tea-sm ring-2 ring-tea-emerald/20' : 'border-tea-border hover:border-tea-leaf'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Máy móc & Cert</span>
              <Cpu className="w-4 h-4 text-amber-500" />
            </div>
            <div className="text-2xl font-black text-tea-dark mt-1">{machinery.length}</div>
            <div className="text-[10px] text-amber-600 font-semibold">CRUD Đầy Đủ</div>
          </div>

          <div
            onClick={() => setActiveTab('contacts')}
            className={`cursor-pointer p-4 rounded-2xl bg-white border transition-all ${
              activeTab === 'contacts' ? 'border-tea-emerald shadow-tea-sm ring-2 ring-tea-emerald/20' : 'border-tea-border hover:border-tea-leaf'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Khách B2B</span>
              <Mail className="w-4 h-4 text-rose-500" />
            </div>
            <div className="text-2xl font-black text-tea-dark mt-1">{contacts.length}</div>
            <div className="text-[10px] text-rose-600 font-semibold">Duyệt & Xóa</div>
          </div>

          <div
            onClick={() => setActiveTab('users')}
            className={`cursor-pointer p-4 rounded-2xl bg-white border transition-all ${
              activeTab === 'users' ? 'border-tea-emerald shadow-tea-sm ring-2 ring-tea-emerald/20' : 'border-tea-border hover:border-tea-leaf'
            }`}
          >
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>Users / Role</span>
              <Users className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="text-2xl font-black text-tea-dark mt-1">{usersList.length}</div>
            <div className="text-[10px] text-indigo-600 font-semibold">4 Cấp Quyền</div>
          </div>
        </div>

        {/* ==================================================================== */}
        {/* NAVIGATION TABS */}
        {/* ==================================================================== */}
        <div className="flex items-center gap-2 border-b border-tea-border pb-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('products')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'products'
                ? 'bg-tea-primary text-white shadow-tea-sm'
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>1. Quản Lý Sản Phẩm ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'categories'
                ? 'bg-tea-primary text-white shadow-tea-sm'
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Danh Mục Sản Phẩm ({categories.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('news')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'news'
                ? 'bg-tea-primary text-white shadow-tea-sm'
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>2. Tin Tức & Công Thức ({news.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('faq')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'faq'
                ? 'bg-tea-primary text-white shadow-tea-sm'
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>3. Câu Hỏi Thường Gặp ({faqs.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('machinery')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'machinery'
                ? 'bg-tea-primary text-white shadow-tea-sm'
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>4. Máy Móc & Chứng Nhận ({machinery.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('contacts')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'contacts'
                ? 'bg-tea-primary text-white shadow-tea-sm'
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            <Mail className="w-4 h-4" />
            <span>5. Liên Hệ Khách B2B ({contacts.length})</span>
          </button>

          {canViewUsers(role) && (
            <button
              onClick={() => setActiveTab('users')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
                activeTab === 'users'
                  ? 'bg-tea-primary text-white shadow-tea-sm'
                  : 'text-gray-600 hover:bg-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>6. Quản Lý Users ({usersList.length})</span>
            </button>
          )}

          <button
            onClick={() => setActiveTab('rbac_matrix')}
            className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap ${
              activeTab === 'rbac_matrix'
                ? 'bg-tea-primary text-white shadow-tea-sm'
                : 'text-gray-600 hover:bg-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Ma Trận Bảo Mật RBAC</span>
          </button>
        </div>

        {/* ==================================================================== */}
        {/* TAB 1: SẢN PHẨM (PRODUCTS CRUD) */}
        {/* ==================================================================== */}
        {activeTab === 'products' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tea-border shadow-tea-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-tea-dark flex items-center gap-2">
                  <Package className="w-6 h-6 text-tea-emerald" />
                  <span>Quản Lý Sản Phẩm Trà & Nguyên Liệu Pha Chế (CRUD)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Thêm, sửa thông số cảm quan, xóa hoặc bật/tắt trạng thái xuất bản (PUBLISHED / DRAFT).
                </p>
              </div>

              <button
                onClick={() => handleOpenProductModal()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-tea-primary hover:bg-tea-emerald text-white text-xs font-bold shadow-tea-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Sản Phẩm Mới</span>
              </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên sản phẩm, mã SKU..."
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white text-gray-900 placeholder-gray-400"
                />
              </div>

              <select
                value={productCategoryFilter}
                onChange={(e) => setProductCategoryFilter(e.target.value)}
                className="w-full sm:w-56 px-3 py-2.5 rounded-xl border border-gray-200 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white text-gray-900"
              >
                <option value="all">Tất cả danh mục ({products.length})</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Products Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-tea-cream/60 text-gray-500 uppercase tracking-wider">
                    <th className="p-3.5 font-bold">Hình Ảnh</th>
                    <th className="p-3.5 font-bold">Tên Sản Phẩm & SKU</th>
                    <th className="p-3.5 font-bold">Danh Mục</th>
                    <th className="p-3.5 font-bold">Đặc Điểm & Hương Vị</th>
                    <th className="p-3.5 font-bold text-center">Trạng Thái</th>
                    <th className="p-3.5 font-bold text-right">Thao Tác (CRUD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredProducts.map((p) => (
                    <tr key={p.id} className="hover:bg-tea-cream/20 transition-colors">
                      <td className="p-3.5">
                        <img
                          src={p.image || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80'}
                          alt={p.name}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                        />
                      </td>
                      <td className="p-3.5">
                        <strong className="text-tea-dark block text-sm font-bold">{p.name}</strong>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-mono text-[10px] text-tea-emerald font-bold bg-tea-soft px-1.5 py-0.5 rounded">
                            SKU: {p.sku}
                          </span>
                          {p.badge && (
                            <span className="text-[10px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-medium">
                              {p.badge}
                            </span>
                          )}
                          {p.purchaseAction === 'shopee' && p.shopeeUrl ? (
                            <a
                              href={p.shopeeUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[10px] bg-orange-50 text-[#EE4D2D] border border-orange-200 px-1.5 py-0.5 rounded font-bold hover:underline inline-flex items-center gap-1"
                              title={p.shopeeUrl}
                            >
                              <span>🛍️ Shopee</span>
                            </a>
                          ) : (
                            <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-medium inline-flex items-center gap-1">
                              <span>📞 Tư vấn</span>
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="font-semibold text-gray-800">{p.categoryName || p.category}</span>
                      </td>
                      <td className="p-3.5">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-gray-500">Aroma:</span>
                            <div className="w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className="h-full bg-tea-leaf rounded-full"
                                style={{ width: `${p.tasteProfile?.aroma || 80}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-[10px]">{p.tasteProfile?.aroma || 80}%</span>
                          </div>
                          <div className="flex items-center gap-2 text-[11px]">
                            <span className="text-gray-500">Body:</span>
                            <div className="w-16 h-1.5 rounded-full bg-gray-200 overflow-hidden">
                              <div
                                className="h-full bg-tea-emerald rounded-full"
                                style={{ width: `${p.tasteProfile?.body || 85}%` }}
                              />
                            </div>
                            <span className="font-mono font-bold text-[10px]">{p.tasteProfile?.body || 85}%</span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => handleToggleProductStatus(p.id)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border transition-colors ${
                            p.status === 'PUBLISHED'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300 hover:bg-emerald-100'
                              : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
                          }`}
                          title="Click để chuyển đổi PUBLISHED / DRAFT"
                        >
                          {p.status === 'PUBLISHED' ? '● PUBLISHED' : '○ DRAFT'}
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenProductModal(p)}
                            className="p-2 rounded-xl bg-tea-cream hover:bg-tea-soft text-tea-emerald border border-tea-border transition-colors"
                            title="Chỉnh sửa sản phẩm"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteProduct(p.id, p.name)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                            title="Xóa sản phẩm"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-xs">
                  Không tìm thấy sản phẩm nào khớp với bộ lọc.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB: DANH MỤC SẢN PHẨM (CATEGORIES CRUD) */}
        {/* ==================================================================== */}
        {activeTab === 'categories' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tea-border shadow-tea-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-tea-dark flex items-center gap-2">
                  <Layers className="w-6 h-6 text-tea-emerald" />
                  <span>Quản Lý Danh Mục Sản Phẩm (Category CRUD)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Thêm, chỉnh sửa thứ tự hiển thị, quản lý tên song ngữ Việt - Trung và kiểm soát danh mục hiển thị trên website.
                </p>
              </div>

              <button
                onClick={() => handleOpenCategoryModal()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-tea-primary hover:bg-tea-emerald text-white text-xs font-bold shadow-tea-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Danh Mục Mới</span>
              </button>
            </div>

            {/* Filter & Search Toolbar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <div className="relative flex-1 w-full">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên danh mục, slug, tên tiếng Trung..."
                  value={categorySearch}
                  onChange={(e) => setCategorySearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white text-gray-900 placeholder-gray-400"
                />
              </div>
              <div className="text-xs text-gray-500 font-medium whitespace-nowrap">
                Tổng cộng: <strong className="text-tea-dark">{categories.length}</strong> danh mục
              </div>
            </div>

            {/* Categories Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-tea-cream/60 text-gray-500 uppercase tracking-wider">
                    <th className="p-3.5 font-bold text-center w-16">Thứ Tự</th>
                    <th className="p-3.5 font-bold">Tên Danh Mục (Việt - Trung)</th>
                    <th className="p-3.5 font-bold">Mã Định Danh (Slug/ID)</th>
                    <th className="p-3.5 font-bold text-center">Sản Phẩm</th>
                    <th className="p-3.5 font-bold text-center">Trạng Thái</th>
                    <th className="p-3.5 font-bold text-right">Thao Tác (CRUD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {categories
                    .filter((c) => {
                      const q = categorySearch.toLowerCase().trim();
                      if (!q) return true;
                      return (
                        (c.name && c.name.toLowerCase().includes(q)) ||
                        (c.nameZh && c.nameZh.toLowerCase().includes(q)) ||
                        (c.id && c.id.toLowerCase().includes(q)) ||
                        (c.desc && c.desc.toLowerCase().includes(q))
                      );
                    })
                    .sort((a, b) => (Number(a.order) || 99) - (Number(b.order) || 99))
                    .map((cat) => {
                      const linkedCount = products.filter(
                        (p) => p.category === cat.id || p.category === cat.slug
                      ).length;
                      return (
                        <tr key={cat.id} className="hover:bg-tea-cream/30 transition-colors">
                          <td className="p-3.5 text-center">
                            <span className="inline-flex items-center justify-center w-7 h-7 rounded-xl bg-tea-mist font-mono font-bold text-tea-dark text-xs border border-tea-emerald/20">
                              #{cat.order || 1}
                            </span>
                          </td>
                          <td className="p-3.5">
                            <div className="font-bold text-sm text-tea-dark">{cat.name}</div>
                            {cat.nameZh && (
                              <div className="text-[11px] text-gray-500 flex items-center gap-1 mt-0.5 font-medium">
                                <span>🇹🇼</span>
                                <span>{cat.nameZh}</span>
                              </div>
                            )}
                            {cat.desc && (
                              <div className="text-[11px] text-gray-400 mt-1 max-w-md line-clamp-1">
                                {cat.desc}
                              </div>
                            )}
                          </td>
                          <td className="p-3.5">
                            <code className="px-2.5 py-1 rounded-lg bg-gray-100 text-gray-700 font-mono text-[11px] border border-gray-200">
                              {cat.slug || cat.id}
                            </code>
                          </td>
                          <td className="p-3.5 text-center">
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 text-[11px] font-bold border border-emerald-200">
                              <Package className="w-3 h-3 text-emerald-600" />
                              <span>{linkedCount} SP</span>
                            </span>
                          </td>
                          <td className="p-3.5 text-center">
                            {cat.active !== false ? (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                                <span>Hiển thị</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100 text-gray-600 text-[10px] font-bold">
                                <XCircle className="w-3 h-3 text-gray-400" />
                                <span>Tạm ẩn</span>
                              </span>
                            )}
                          </td>
                          <td className="p-3.5 text-right space-x-1 whitespace-nowrap">
                            <button
                              onClick={() => handleOpenCategoryModal(cat)}
                              className="p-2 rounded-xl text-tea-emerald hover:bg-tea-mist border border-transparent hover:border-tea-emerald/20 transition-all"
                              title="Chỉnh sửa danh mục"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => {
                                setCategoryToDelete(cat);
                                setDeleteCategoryModalOpen(true);
                              }}
                              className="p-2 rounded-xl text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition-all"
                              title="Xóa danh mục"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>

              {categories.length === 0 && (
                <div className="text-center py-12 text-gray-400 text-xs">
                  Chưa có danh mục nào. Hãy bấm "+ Thêm Danh Mục Mới" để tạo danh mục đầu tiên!
                </div>
              )}
            </div>
          </div>
        )}


        {/* ==================================================================== */}
        {/* TAB 2: TIN TỨC & CÔNG THỨC (NEWS CRUD) */}
        {/* ==================================================================== */}
        {activeTab === 'news' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tea-border shadow-tea-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-tea-dark flex items-center gap-2">
                  <FileText className="w-6 h-6 text-blue-600" />
                  <span>Quản Lý Bài Viết & Công Thức Pha Chế (CRUD)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Đăng tải công thức Barista SOP, xu hướng F&B và tin tức chuyên ngành.
                </p>
              </div>

              <button
                onClick={() => handleOpenNewsModal()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-tea-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Viết Bài / Công Thức Mới</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-blue-50/50 text-gray-500 uppercase tracking-wider">
                    <th className="p-3.5 font-bold">Hình Ảnh</th>
                    <th className="p-3.5 font-bold">Tiêu Đề Bài Viết</th>
                    <th className="p-3.5 font-bold">Chuyên Mục</th>
                    <th className="p-3.5 font-bold">Tác Giả / Ngày Đăng</th>
                    <th className="p-3.5 font-bold text-center">Nổi Bật (1-Click)</th>
                    <th className="p-3.5 font-bold text-center">Trạng Thái</th>
                    <th className="p-3.5 font-bold text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {filteredNews.map((n) => (
                    <tr key={n.id} className="hover:bg-blue-50/20 transition-colors">
                      <td className="p-3.5">
                        <img
                          src={n.image}
                          alt={n.title}
                          className="w-12 h-12 rounded-xl object-cover border border-gray-200"
                        />
                      </td>
                      <td className="p-3.5">
                        <strong className="text-tea-dark block text-sm font-bold">{n.title}</strong>
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">{n.excerpt}</p>
                      </td>
                      <td className="p-3.5 font-semibold text-blue-700">{n.categoryName || n.category}</td>
                      <td className="p-3.5 text-gray-500">
                        <div className="font-medium text-gray-700">{n.author}</div>
                        <div className="text-[10px]">{n.date}</div>
                      </td>
                      <td className="p-3.5 text-center">
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-1.5">
                          {/* Nổi bật Trang Chủ */}
                          <button
                            type="button"
                            onClick={() => handleToggleNewsFeaturedHome(n.id)}
                            title={n.featuredHome ? 'Đang nổi bật Trang Chủ (Click để hủy)' : 'Chưa nổi bật Trang Chủ (Click để bật)'}
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              n.featuredHome
                                ? 'bg-amber-100 text-amber-800 border border-amber-300 shadow-xs hover:bg-amber-200'
                                : 'bg-gray-100 text-gray-400 border border-gray-200 hover:text-amber-700 hover:bg-amber-50 hover:border-amber-300'
                            }`}
                          >
                            <Star className={`w-3 h-3 ${n.featuredHome ? 'fill-amber-500 text-amber-500' : 'text-gray-400'}`} />
                            <span>Trang Chủ</span>
                          </button>

                          {/* Tiêu điểm Trang Tin Tức (Hero) */}
                          <button
                            type="button"
                            onClick={() => handleToggleNewsFeaturedHero(n.id)}
                            title={
                              (n.featuredNews || n.featured)
                                ? 'Đang là Tiêu Điểm Tin Tức (Click để hủy)'
                                : 'Đặt làm Tiêu Điểm chính Trang Tin Tức (Click để bật)'
                            }
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all cursor-pointer ${
                              (n.featuredNews || n.featured)
                                ? 'bg-blue-100 text-blue-800 border border-blue-300 shadow-xs hover:bg-blue-200'
                                : 'bg-gray-100 text-gray-400 border border-gray-200 hover:text-blue-700 hover:bg-blue-50 hover:border-blue-300'
                            }`}
                          >
                            <Sparkles className={`w-3 h-3 ${(n.featuredNews || n.featured) ? 'fill-blue-500 text-blue-600' : 'text-gray-400'}`} />
                            <span>Trang Tin</span>
                          </button>
                        </div>
                      </td>
                      <td className="p-3.5 text-center">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          {n.status || 'PUBLISHED'}
                        </span>
                      </td>
                      <td className="p-3.5 text-right">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => handleOpenNewsModal(n)}
                            className="p-2 rounded-xl bg-gray-50 hover:bg-gray-100 text-blue-600 border border-gray-200 transition-colors"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteNews(n.id, n.title)}
                            className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-colors"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 3: FAQ (CÂU HỎI THƯỜNG GẶP CRUD) */}
        {/* ==================================================================== */}
        {activeTab === 'faq' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tea-border shadow-tea-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-tea-dark flex items-center gap-2">
                  <HelpCircle className="w-6 h-6 text-purple-600" />
                  <span>Quản Lý Câu Hỏi Thường Gặp (FAQ CRUD)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Giải đáp thắc mắc về chính sách mẫu thử, năng lực R&D và MOQ giao hàng.
                </p>
              </div>

              <button
                onClick={() => handleOpenFaqModal()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-tea-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Câu Hỏi FAQ</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {faqs.map((f) => (
                <div
                  key={f.id}
                  className="p-5 rounded-2xl border border-gray-200 bg-white hover:border-purple-300 transition-all space-y-2 relative group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200">
                      {f.category}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenFaqModal(f)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-purple-600 hover:bg-purple-50 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteFaq(f.id)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                  <h4 className="font-bold text-tea-dark text-sm leading-snug">{f.question}</h4>
                  <p className="text-xs text-gray-600 leading-relaxed line-clamp-3">{f.answer}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 4: MÁY MÓC & CHỨNG NHẬN (MACHINERY & CERTS CRUD) */}
        {/* ==================================================================== */}
        {activeTab === 'machinery' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tea-border shadow-tea-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-tea-dark flex items-center gap-2">
                  <Cpu className="w-6 h-6 text-amber-600" />
                  <span>Quản Lý Thiết Bị Máy Móc Nhà Máy (CRUD)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Danh sách dây chuyền sàng lọc quang học Sortex, máy sấy tầng sôi và phòng Lab QC.
                </p>
              </div>

              <button
                onClick={() => handleOpenMachineryModal()}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-tea-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>+ Thêm Thiết Bị Mới</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {machinery.map((m) => (
                <div key={m.id} className="rounded-2xl border border-gray-200 overflow-hidden bg-white hover:shadow-tea-md transition-all">
                  <img src={m.image} alt={m.name} className="w-full h-44 object-cover" />
                  <div className="p-5 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                        {m.category}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {m.status}
                      </span>
                    </div>
                    <h3 className="font-bold text-tea-dark text-sm">{m.name}</h3>
                    <div className="text-xs text-gray-500 flex items-center justify-between pt-1">
                      <span>Xuất xứ: <strong>{m.origin}</strong></span>
                      <span>Công suất: <strong>{m.capacity}</strong></span>
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => handleOpenMachineryModal(m)}
                        className="p-1.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-amber-50 hover:text-amber-700 transition-colors"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDeleteMachinery(m.id, m.name)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 5: LIÊN HỆ B2B (CONTACTS) */}
        {/* ==================================================================== */}
        {activeTab === 'contacts' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tea-border shadow-tea-sm space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-extrabold text-tea-dark flex items-center gap-2">
                  <Mail className="w-6 h-6 text-rose-600" />
                  <span>Danh Sách Yêu Cầu Liên Hệ & Nhận Mẫu Thử B2B</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Đơn gửi trực tiếp từ form khách hàng. Phân quyền kiểm soát nghiêm ngặt theo Firestore Rules.
                </p>
              </div>
              <span className="text-xs text-gray-400 font-mono">
                Tổng: {contacts.length} liên hệ
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-rose-50/50 text-gray-500 uppercase tracking-wider">
                    <th className="p-3.5 font-bold">Khách Hàng</th>
                    <th className="p-3.5 font-bold">Doanh Nghiệp / Quán</th>
                    <th className="p-3.5 font-bold">Điện Thoại / Email</th>
                    <th className="p-3.5 font-bold">Sản Phẩm Quan Tâm</th>
                    <th className="p-3.5 font-bold">Trạng Thái Đơn</th>
                    <th className="p-3.5 font-bold text-right">Xóa</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {contacts.map((c) => (
                    <tr key={c.id} className="hover:bg-rose-50/20 transition-colors">
                      <td className="p-3.5">
                        <strong className="text-tea-dark block font-bold text-sm">{c.name}</strong>
                        <span className="text-[10px] text-gray-400">{c.createdAt}</span>
                      </td>
                      <td className="p-3.5 font-medium">{c.company}</td>
                      <td className="p-3.5">
                        <span className="block font-bold text-tea-primary">{c.phone}</span>
                        <span className="text-gray-400 text-[11px]">{c.email}</span>
                      </td>
                      <td className="p-3.5">
                        <span className="block text-gray-700">{c.productInterest}</span>
                        {c.requestSample && (
                          <span className="inline-block mt-0.5 px-2 py-0.5 rounded-full bg-tea-soft text-tea-primary text-[10px] font-bold">
                            Mẫu thử 100g
                          </span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <select
                          value={c.status}
                          disabled={role === ROLES.VIEWER}
                          onChange={(e) => handleUpdateContactStatus(c.id, e.target.value)}
                          className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-tea-emerald bg-white"
                        >
                          <option value="NEW">NEW (Mới)</option>
                          <option value="CONTACTED">CONTACTED (Đã gọi)</option>
                          <option value="COMPLETED">COMPLETED (Đã gửi mẫu)</option>
                          <option value="CANCELLED">CANCELLED (Hủy)</option>
                        </select>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteContact(c.id)}
                          className={`p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors ${
                            !canDeleteContacts(role) ? 'opacity-40 cursor-not-allowed' : ''
                          }`}
                          title={!canDeleteContacts(role) ? 'Chỉ ADMIN/SUPER_ADMIN mới có quyền xóa' : 'Xóa đơn'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 6: QUẢN LÝ NGƯỜI DÙNG & PHÂN QUYỀN (USERS CRUD) */}
        {/* ==================================================================== */}
        {activeTab === 'users' && canViewUsers(role) && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tea-border shadow-tea-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-tea-dark flex items-center gap-2">
                  <Users className="w-6 h-6 text-indigo-600" />
                  <span>Quản Lý Tài Khoản & Phân Quyền Hệ Thống (RBAC Users)</span>
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  Chỉ SUPER_ADMIN mới có toàn quyền tạo mới, đổi role và xóa tài khoản.
                </p>
              </div>

              {canManageUsers(role) && (
                <button
                  onClick={() => setUserModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-tea-sm transition-all"
                >
                  <Plus className="w-4 h-4" />
                  <span>+ Thêm Người Dùng Mới</span>
                </button>
              )}
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-indigo-50/50 text-gray-500 uppercase tracking-wider">
                    <th className="p-3.5 font-bold">Người Dùng</th>
                    <th className="p-3.5 font-bold">Email</th>
                    <th className="p-3.5 font-bold">Cấp Phân Quyền (Role)</th>
                    <th className="p-3.5 font-bold text-center">Trạng Thái</th>
                    <th className="p-3.5 font-bold text-right">Thao Tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  {usersList.map((u) => (
                    <tr key={u.uid} className="hover:bg-indigo-50/20 transition-colors">
                      <td className="p-3.5">
                        <strong className="text-tea-dark block font-bold text-sm">{u.displayName}</strong>
                        <span className="font-mono text-[10px] text-gray-400">UID: {u.uid}</span>
                      </td>
                      <td className="p-3.5 font-mono text-gray-700">{u.email}</td>
                      <td className="p-3.5">
                        {canManageUsers(role) && u.uid !== userProfile?.uid ? (
                          <select
                            value={u.role}
                            onChange={(e) => handleChangeUserRole(u.uid, e.target.value)}
                            className="px-2.5 py-1 rounded-lg border border-gray-200 text-xs font-bold focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white"
                          >
                            <option value={ROLES.SUPER_ADMIN}>SUPER_ADMIN</option>
                            <option value={ROLES.ADMIN}>ADMIN</option>
                            <option value={ROLES.EDITOR}>EDITOR</option>
                            <option value={ROLES.VIEWER}>VIEWER</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-0.5 rounded-full font-bold text-[10px] border ${getRoleBadgeInfo(u.role).color}`}>
                            {getRoleBadgeInfo(u.role).label}
                          </span>
                        )}
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          disabled={!canManageUsers(role) || u.uid === userProfile?.uid}
                          onClick={() => handleToggleUserStatus(u.uid)}
                          className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                            u.status === 'ACTIVE'
                              ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                              : 'bg-red-50 text-red-700 border-red-300'
                          } disabled:opacity-60`}
                        >
                          {u.status}
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        {canManageUsers(role) && u.uid !== userProfile?.uid && (
                          <button
                            onClick={() => handleDeleteUser(u.uid, u.email)}
                            className="p-2 rounded-xl text-red-600 hover:bg-red-50 transition-colors"
                            title="Xóa tài khoản"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ==================================================================== */}
        {/* TAB 7: MA TRẬN BẢO MẬT (RBAC MATRIX) */}
        {/* ==================================================================== */}
        {activeTab === 'rbac_matrix' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-tea-border shadow-tea-sm space-y-6">
            <div>
              <h2 className="text-xl font-extrabold text-tea-dark flex items-center gap-2">
                <ShieldCheck className="w-6 h-6 text-tea-emerald" />
                <span>Ma Trận Phân Quyền Hệ Thống & Bảo Mật Rules</span>
              </h2>
              <p className="text-xs text-gray-500 mt-1">
                Nguyên tắc Zero Trust thực thi trực tiếp tại máy chủ Cloud Firestore Security Rules.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-gray-100 bg-tea-cream/50 text-gray-500 uppercase tracking-wider">
                    <th className="p-3.5 font-bold">Tài Nguyên</th>
                    <th className="p-3.5 font-bold">Public</th>
                    <th className="p-3.5 font-bold">VIEWER</th>
                    <th className="p-3.5 font-bold">EDITOR</th>
                    <th className="p-3.5 font-bold">ADMIN</th>
                    <th className="p-3.5 font-bold">SUPER_ADMIN</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3.5 font-bold text-tea-dark">products & categories</td>
                    <td className="p-3.5 text-emerald-600 font-semibold">Chỉ đọc Published</td>
                    <td className="p-3.5 text-gray-600">Đọc tất cả</td>
                    <td className="p-3.5 text-tea-emerald font-bold">CRUD</td>
                    <td className="p-3.5 text-tea-emerald font-bold">CRUD</td>
                    <td className="p-3.5 text-purple-700 font-bold">CRUD Toàn quyền</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-tea-dark">news, faqs, machinery</td>
                    <td className="p-3.5 text-emerald-600 font-semibold">Chỉ đọc Published</td>
                    <td className="p-3.5 text-gray-600">Đọc tất cả</td>
                    <td className="p-3.5 text-tea-emerald font-bold">CRUD</td>
                    <td className="p-3.5 text-tea-emerald font-bold">CRUD</td>
                    <td className="p-3.5 text-purple-700 font-bold">CRUD Toàn quyền</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-tea-dark">contacts (Khách liên hệ)</td>
                    <td className="p-3.5 text-blue-600 font-semibold">Chỉ Create (NEW)</td>
                    <td className="p-3.5 text-gray-600">Chỉ đọc</td>
                    <td className="p-3.5 text-amber-600 font-semibold">Đọc + Sửa status</td>
                    <td className="p-3.5 text-tea-emerald font-bold">Đọc + Sửa + Xóa</td>
                    <td className="p-3.5 text-purple-700 font-bold">Toàn quyền</td>
                  </tr>
                  <tr>
                    <td className="p-3.5 font-bold text-tea-dark">users (Người dùng)</td>
                    <td className="p-3.5 text-red-500 font-bold">Deny All</td>
                    <td className="p-3.5 text-gray-600">Chỉ đọc profile mình</td>
                    <td className="p-3.5 text-gray-600">Chỉ đọc profile mình</td>
                    <td className="p-3.5 text-blue-700 font-semibold">Xem DS (Cấm sửa SuperAdmin)</td>
                    <td className="p-3.5 text-purple-700 font-bold">CRUD Toàn quyền</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>


      {/* ==================================================================== */}
      {/* MODAL: THÊM / SỬA DANH MỤC SẢN PHẨM */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {categoryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[92vh] overflow-y-auto border border-tea-border shadow-tea-xl space-y-5"
            >
              {/* MODAL HEADER */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div>
                  <h3 className="text-lg font-bold text-tea-dark flex items-center gap-2">
                    <Layers className="w-5 h-5 text-tea-emerald" />
                    <span>{editingCategory ? 'Chỉnh Sửa Danh Mục' : 'Thêm Danh Mục Mới'}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Quản lý thông tin định danh, tên song ngữ và thứ tự hiển thị danh mục.
                  </p>
                </div>
                <button
                  onClick={() => setCategoryModalOpen(false)}
                  className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* FORM */}
              <form onSubmit={handleSaveCategory} className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Tên Danh Mục (Tiếng Việt) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Trà Đen (Black Tea), Bột Pha Chế..."
                    value={categoryFormData.name}
                    onChange={(e) => {
                      const newName = e.target.value;
                      if (!editingCategory) {
                        setCategoryFormData({
                          ...categoryFormData,
                          name: newName,
                          slug: generateCategorySlug(newName)
                        });
                      } else {
                        setCategoryFormData({ ...categoryFormData, name: newName });
                      }
                    }}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="font-bold text-gray-700 flex items-center gap-1.5">
                      <span>Tên Tiếng Trung Phồn Thể</span>
                      <span className="text-xs">🇹🇼</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleTranslateCategory}
                      disabled={isTranslatingCategory || !categoryFormData.name}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-[11px] font-bold border border-indigo-200 transition-all disabled:opacity-50"
                    >
                      <Sparkles className="w-3 h-3 text-indigo-600" />
                      <span>{isTranslatingCategory ? 'Đang dịch AI...' : 'AI Dịch Tiếng Trung'}</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Ví dụ: 特級阿薩姆與經典紅茶"
                    value={categoryFormData.nameZh}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, nameZh: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Mã Định Danh (Slug / ID)
                    </label>
                    <input
                      type="text"
                      placeholder="tra-den, tra-oolong..."
                      value={categoryFormData.slug}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, slug: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 font-mono bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">
                      Thứ Tự Hiển Thị (#)
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={categoryFormData.order}
                      onChange={(e) => setCategoryFormData({ ...categoryFormData, order: Number(e.target.value) || 1 })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">
                    Trạng Thái Hoạt Động
                  </label>
                  <select
                    value={categoryFormData.active ? 'active' : 'inactive'}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, active: e.target.value === 'active' })}
                    className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                  >
                    <option value="active">Hiển thị công khai trên website</option>
                    <option value="inactive">Tạm ẩn (Không xuất hiện trên trang sản phẩm)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mô Tả Danh Mục (Tiếng Việt)</label>
                  <textarea
                    rows="2"
                    placeholder="Mô tả tóm tắt ứng dụng của nhóm sản phẩm này..."
                    value={categoryFormData.desc}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, desc: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Mô Tả Danh Mục (Tiếng Trung Phồn Thể 🇹🇼)</label>
                  <textarea
                    rows="2"
                    placeholder="類別詳細應用說明..."
                    value={categoryFormData.descZh}
                    onChange={(e) => setCategoryFormData({ ...categoryFormData, descZh: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                  />
                </div>

                {/* MODAL ACTIONS */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setCategoryModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 font-bold hover:bg-gray-50 transition-colors"
                  >
                    Hủy Bỏ
                  </button>
                  <button
                    type="submit"
                    disabled={isSyncingRtdb}
                    className="px-6 py-2.5 rounded-xl bg-tea-primary hover:bg-tea-emerald text-white font-bold shadow-tea-sm transition-all flex items-center gap-2"
                  >
                    {isSyncingRtdb ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Đang Lưu...</span>
                      </>
                    ) : (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>{editingCategory ? 'Lưu Cập Nhật' : 'Tạo Danh Mục'}</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* MODAL: XÁC NHẬN XÓA DANH MỤC */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {deleteCategoryModalOpen && categoryToDelete && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-red-100 shadow-tea-xl space-y-5"
            >
              <div className="w-12 h-12 rounded-2xl bg-red-100 text-red-600 flex items-center justify-center mx-auto">
                <Trash2 className="w-6 h-6" />
              </div>

              <div className="text-center space-y-2">
                <h3 className="text-lg font-bold text-gray-900">
                  Xác Nhận Xóa Danh Mục?
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  Bạn có chắc chắn muốn xóa vĩnh viễn danh mục <strong className="text-tea-dark">"{categoryToDelete.name}"</strong>?
                </p>
              </div>

              {/* Warning if products are linked */}
              {(() => {
                const linked = products.filter(
                  (p) => p.category === categoryToDelete.id || p.category === categoryToDelete.slug
                );
                if (linked.length > 0) {
                  return (
                    <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600" />
                        <span>Cảnh báo liên kết dữ liệu!</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        Hiện có <strong className="font-bold">{linked.length} sản phẩm</strong> đang thuộc danh mục này ({linked.slice(0, 3).map(p => p.name).join(', ')}{linked.length > 3 ? '...' : ''}).
                      </p>
                    </div>
                  );
                }
                return null;
              })()}

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setDeleteCategoryModalOpen(false);
                    setCategoryToDelete(null);
                  }}
                  className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-xs"
                >
                  Hủy Bỏ
                </button>
                <button
                  type="button"
                  onClick={handleDeleteCategory}
                  disabled={isSyncingRtdb}
                  className="flex-1 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold shadow-tea-sm transition-all text-xs flex items-center justify-center gap-1.5"
                >
                  {isSyncingRtdb ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Đang xóa...</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Xóa Vĩnh Viễn</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* MODAL: THÊM / SỬA SẢN PHẨM (PRODUCT MODAL) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {productModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-tea-border shadow-tea-xl space-y-5"
            >
              {/* MODAL HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-100 gap-3">
                <div>
                  <h3 className="text-lg font-bold text-tea-dark flex items-center gap-2">
                    <span>{editingProduct ? 'Chỉnh Sửa Sản Phẩm' : 'Thêm Sản Phẩm Mới (Create)'}</span>
                  </h3>
                  <p className="text-xs text-gray-500 mt-0.5">
                    Hỗ trợ trí tuệ nhân tạo viết mô tả cuốn hút & thiết kế trọn bộ thông số F&B
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex bg-gray-100 p-1 rounded-xl text-xs font-bold">
                    <button
                      type="button"
                      onClick={() => setProductModalTab('edit')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        productModalTab === 'edit'
                          ? 'bg-white text-tea-primary shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      📝 Nhập Liệu & AI
                    </button>
                    <button
                      type="button"
                      onClick={() => setProductModalTab('preview')}
                      className={`px-3 py-1.5 rounded-lg transition-all ${
                        productModalTab === 'preview'
                          ? 'bg-white text-tea-primary shadow-sm'
                          : 'text-gray-500 hover:text-gray-900'
                      }`}
                    >
                      👁️ Xem Trước (Preview)
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => setProductModalOpen(false)}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* TAB 1: FORM CHỈNH SỬA & GEMINI AI */}
              {productModalTab === 'edit' ? (
                <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
                  {/* GEMINI AI 3.6 FLASH ASSISTANT BANNER */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-amber-500/10 border border-emerald-500/25 space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-tea-primary to-tea-emerald text-white flex items-center justify-center shrink-0 shadow-sm">
                          <Sparkles className="w-4 h-4 text-tea-mint" />
                        </div>
                        <div>
                          <span className="font-bold text-tea-dark block text-xs">
                            Trợ Lý Gemini AI (Tự Động Viết Mô Tả Bám Sát Đúng Từ Khóa Của Bạn)
                          </span>
                          <span className="text-[11px] text-gray-500">
                            Nhập bất kỳ từ khóa nào (kem muối, kem cheese, đào giòn...) ➔ AI sẽ bám sát 100% để làm nổi bật vị mặn béo ngậy hoặc thơm ngon đặc trưng!
                          </span>
                        </div>
                      </div>
                      <span className="hidden sm:inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold font-mono">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        gemini-3.7-flash
                      </span>
                    </div>

                    {/* Khung nhập gợi ý của người dùng */}
                    <div className="space-y-1.5">
                      <textarea
                        rows={2}
                        value={productAiHints}
                        onChange={(e) => setProductAiHints(e.target.value)}
                        placeholder="Gõ từ khóa bạn muốn mô tả... Ví dụ: 'kem muối', 'kem cheese', 'vị đào giòn mọng nước', 'ô long rang đậm vị'..."
                        className="w-full px-3 py-2 text-xs rounded-xl border border-emerald-300/70 bg-white focus:ring-2 focus:ring-tea-emerald/30 outline-none leading-relaxed"
                      />

                      {/* Bấm nhanh các từ khóa mẫu */}
                      <div className="flex items-center gap-1.5 flex-wrap text-[11px] pt-0.5">
                        <span className="text-gray-500 font-semibold text-[10px]">Thử nhanh từ khóa:</span>
                        {[
                          { label: '🧂 kem muối', text: 'kem muối' },
                          { label: '🧀 kem cheese béo ngậy', text: 'kem cheese béo ngậy' },
                          { label: '🥛 bột béo sánh mịn', text: 'bột béo sánh mịn' },
                          { label: '🍵 trà ô long nướng', text: 'trà ô long nướng đậm vị' },
                          { label: '🍑 đào giòn mọng nước', text: 'đào giòn mọng nước' },
                          { label: '🥥 cốt dừa béo bùi', text: 'cốt dừa béo bùi thơm lừng' }
                        ].map((item, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setProductAiHints((prev) => (prev.trim() ? `${prev.trim()}, ${item.text}` : item.text));
                            }}
                            className="px-2 py-0.5 rounded-lg bg-white border border-emerald-300/80 text-tea-dark font-medium hover:bg-emerald-50 transition-colors cursor-pointer text-[11px] shadow-2xs"
                          >
                            + {item.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Nút hành động AI */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => handleGeminiRewriteDescription(productAiHints, 'both')}
                        disabled={isRewritingDesc || isDesigningProduct}
                        className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Wand2 className={`w-3.5 h-3.5 ${isRewritingDesc ? 'animate-spin' : ''}`} />
                        <span>{isRewritingDesc ? 'AI Đang Viết Lại...' : '🪄 Viết Lại Mô Tả (Bám Sát Từ Khóa Trên)'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleGeminiDesignProduct}
                        disabled={isDesigningProduct || isRewritingDesc || isTranslatingProduct}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-tea-primary to-tea-emerald hover:opacity-95 text-white font-bold text-xs shadow-tea-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-tea-mint ${isDesigningProduct ? 'animate-spin' : ''}`} />
                        <span>{isDesigningProduct ? 'AI Đang Thiết Kế...' : '✨ Thiết Kế Toàn Bộ Sản Phẩm Theo Từ Khóa'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleTranslateProductZh}
                        disabled={isTranslatingProduct || isDesigningProduct}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                        title="Dịch toàn bộ thông tin sản phẩm này sang chữ Hán Phồn Thể (繁體中文)"
                      >
                        <Sparkles className={`w-3.5 h-3.5 text-purple-200 ${isTranslatingProduct ? 'animate-spin' : ''}`} />
                        <span>{isTranslatingProduct ? 'Đang dịch sang 繁中...' : '🇹🇼 AI Dịch Sang Trung Phồn Thể'}</span>
                      </button>
                    </div>
                  </div>

                  {/* THÔNG TIN CƠ BẢN */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Tên Sản Phẩm *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Lớp Kem Muối Biển Macchiato CASA"
                        value={productFormData.name}
                        onChange={(e) => setProductFormData({ ...productFormData, name: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none font-medium"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Mã SKU *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: CS-SALT-01"
                        value={productFormData.sku}
                        onChange={(e) => setProductFormData({ ...productFormData, sku: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Danh Mục</label>
                      <select
                        value={productFormData.category}
                        onChange={(e) => {
                          const selectedCat = PRODUCT_CATEGORIES.find((c) => c.id === e.target.value);
                          setProductFormData({
                            ...productFormData,
                            category: e.target.value,
                            categoryName: selectedCat ? selectedCat.name : e.target.value
                          });
                        }}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                      >
                        {categories.filter((c) => c.id !== 'all').map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name} {c.nameZh ? `(${c.nameZh})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Huy Hiệu (Badge)</label>
                      <input
                        type="text"
                        placeholder="Vị Mặn Béo Cuốn Hút, Best Seller..."
                        value={productFormData.badge}
                        onChange={(e) => setProductFormData({ ...productFormData, badge: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Trạng Thái</label>
                      <select
                        value={productFormData.status}
                        onChange={(e) => setProductFormData({ ...productFormData, status: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-tea-emerald font-bold focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                      >
                        <option value="PUBLISHED">PUBLISHED (Công khai)</option>
                        <option value="DRAFT">DRAFT (Bản nháp)</option>
                      </select>
                    </div>
                  </div>

                  {/* HÌNH THỨC BÁN HÀNG & NÚT HÀNH ĐỘNG (CTA) */}
                  <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-tea-border space-y-3">
                    <label className="block font-bold text-tea-dark text-xs uppercase tracking-wider">
                      Hình Thức Mua Hàng & Nút Hành Động (Call to Action)
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <label
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          productFormData.purchaseAction !== 'shopee'
                            ? 'bg-white border-tea-emerald shadow-sm ring-2 ring-tea-emerald/20 text-tea-dark font-bold'
                            : 'bg-white/70 border-gray-200 hover:border-tea-leaf/50 text-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="purchaseAction"
                          value="contact"
                          checked={productFormData.purchaseAction !== 'shopee'}
                          onChange={() => setProductFormData({ ...productFormData, purchaseAction: 'contact' })}
                          className="mt-0.5 text-tea-emerald focus:ring-tea-emerald"
                        />
                        <div className="text-xs">
                          <div className="font-bold flex items-center gap-1.5">
                            <span>📞 Liên hệ tư vấn</span>
                          </div>
                          <span className="text-[11px] text-gray-500 font-normal block mt-0.5">
                            Khách bấm sẽ nhảy trực tiếp sang trang Liên hệ (/contact)
                          </span>
                        </div>
                      </label>

                      <label
                        className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                          productFormData.purchaseAction === 'shopee'
                            ? 'bg-white border-[#EE4D2D] shadow-sm ring-2 ring-[#EE4D2D]/20 text-[#EE4D2D] font-bold'
                            : 'bg-white/70 border-gray-200 hover:border-[#EE4D2D]/50 text-gray-700'
                        }`}
                      >
                        <input
                          type="radio"
                          name="purchaseAction"
                          value="shopee"
                          checked={productFormData.purchaseAction === 'shopee'}
                          onChange={() => setProductFormData({ ...productFormData, purchaseAction: 'shopee' })}
                          className="mt-0.5 text-[#EE4D2D] focus:ring-[#EE4D2D]"
                        />
                        <div className="text-xs">
                          <div className="font-bold flex items-center gap-1.5 text-gray-900">
                            <span className="text-[#EE4D2D]">🛍️ Mua trên Shopee</span>
                          </div>
                          <span className="text-[11px] text-gray-500 font-normal block mt-0.5">
                            Gắn đường link dẫn tới gian hàng Shopee của bạn
                          </span>
                        </div>
                      </label>
                    </div>

                    {/* Ô nhập đường link Shopee khi chọn "Mua trên Shopee" */}
                    {productFormData.purchaseAction === 'shopee' && (
                      <div className="pt-2">
                        <label className="block font-bold text-gray-700 mb-1 text-xs">
                          Đường Link Sản Phẩm Shopee <span className="text-[#EE4D2D]">*</span>
                        </label>
                        <div className="relative">
                          <input
                            type="url"
                            placeholder="https://shopee.vn/ten-san-pham-i.123456789.987654321..."
                            value={productFormData.shopeeUrl || ''}
                            onChange={(e) => setProductFormData({ ...productFormData, shopeeUrl: e.target.value })}
                            className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#EE4D2D]/30 focus:border-[#EE4D2D] outline-none text-xs"
                          />
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm">🛍️</span>
                        </div>
                        <p className="text-[11px] text-gray-500 mt-1">
                          Nút "Mua trên Shopee" sẽ xuất hiện trên thẻ sản phẩm và trang chi tiết, dẫn khách hàng trực tiếp sang Shopee.
                        </p>
                      </div>
                    )}
                  </div>

                  {/* 1. MÔ TẢ NGẮN (SHORT DESCRIPTION) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-gray-700">Mô Tả Ngắn (Hiển thị thẻ danh sách & tóm tắt 35-50 từ)</label>
                      <button
                        type="button"
                        onClick={() => handleGeminiRewriteDescription(productFormData.shortDesc || productAiHints, 'shortOnly')}
                        disabled={isRewritingDesc}
                        className="text-[11px] text-tea-emerald hover:text-tea-dark font-bold flex items-center gap-1 cursor-pointer transition-colors bg-emerald-50 hover:bg-emerald-100 px-2 py-0.5 rounded-lg border border-emerald-200"
                        title="Đọc từ khóa trong ô này và viết lại thành câu cuốn hút"
                      >
                        <Sparkles className="w-3 h-3 text-amber-500" />
                        <span>AI nâng cấp từ nội dung ô này</span>
                      </button>
                    </div>
                    <textarea
                      rows={2}
                      placeholder="Gõ nhanh từ khóa (Ví dụ: 'kem muối', 'kem cheese béo ngậy')... rồi bấm nút [AI nâng cấp từ nội dung ô này]!"
                      value={productFormData.shortDesc}
                      onChange={(e) => setProductFormData({ ...productFormData, shortDesc: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none leading-relaxed"
                    />
                  </div>

                  {/* 2. MÔ TẢ CHI TIẾT BÀI VIẾT (FULL DESCRIPTION) */}
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <label className="font-bold text-gray-700">
                        Mô Tả Chi Tiết Bài Viết (Hiển thị trang chi tiết sản phẩm)
                      </label>
                      <button
                        type="button"
                        onClick={() => handleGeminiRewriteDescription(productFormData.fullDesc || productFormData.shortDesc || productAiHints, 'fullOnly')}
                        disabled={isRewritingDesc}
                        className="text-[11px] text-amber-700 hover:text-amber-900 font-bold flex items-center gap-1 cursor-pointer transition-colors bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded-lg border border-amber-200"
                        title="Đọc từ khóa trong ô này và mở rộng thành bài chi tiết 3 đoạn cuốn hút"
                      >
                        <Wand2 className="w-3 h-3 text-amber-500" />
                        <span>AI mở rộng bài viết từ ô này</span>
                      </button>
                    </div>
                    <textarea
                      rows={5}
                      placeholder="Gõ ý tưởng/nguyên liệu bạn muốn (Ví dụ: 'kem muối mặn mòi, sữa béo New Zealand, vị đậm đà không ngấy')... rồi bấm nút [AI mở rộng bài viết từ ô này]!"
                      value={productFormData.fullDesc}
                      onChange={(e) => setProductFormData({ ...productFormData, fullDesc: e.target.value })}
                      className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none font-sans leading-relaxed"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <ImageUploadInput
                        label="Hình Ảnh Sản Phẩm (Tệp Máy Tính hoặc Link)"
                        value={productFormData.image}
                        onChange={(url) => setProductFormData({ ...productFormData, image: url })}
                        folder="products"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Vùng Trồng / Xuất Xứ</label>
                      <input
                        type="text"
                        placeholder="Cao nguyên Bảo Lộc & Cầu Đất, Lâm Đồng..."
                        value={productFormData.origin}
                        onChange={(e) => setProductFormData({ ...productFormData, origin: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                      />
                    </div>
                  </div>

                  {/* BẢN DỊCH TRUNG PHỒN THỂ (繁體中文) */}
                  <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base">🇹🇼</span>
                        <span className="font-bold text-purple-900 text-xs">
                          Bản Dịch Tiếng Trung Phồn Thể (繁體中文)
                        </span>
                      </div>
                      <span className="text-[10px] text-purple-600 font-medium">
                        Tự động dịch bằng AI khi Lưu nếu để trống
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Tên sản phẩm (繁體中文)
                        </label>
                        <input
                          type="text"
                          placeholder="例如: 頂級海鹽奶蓋粉 CASA"
                          value={productFormData.nameZh || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, nameZh: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-400/30"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Huy hiệu nổi bật (繁體中文)
                        </label>
                        <input
                          type="text"
                          placeholder="例如: 暢銷奶茶專用"
                          value={productFormData.badgeZh || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, badgeZh: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-400/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Mô tả ngắn (繁體中文)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="以繁體中文撰寫的簡短商品描述..."
                          value={productFormData.shortDescZh || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, shortDescZh: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white text-gray-900 placeholder-gray-400 outline-none leading-relaxed focus:ring-2 focus:ring-purple-400/30"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Vùng trồng / Xuất xứ (繁體中文)
                        </label>
                        <input
                          type="text"
                          placeholder="例如: 越南保祿高原產區..."
                          value={productFormData.originZh || ''}
                          onChange={(e) => setProductFormData({ ...productFormData, originZh: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-400/30"
                        />
                      </div>
                    </div>
                  </div>

                  {/* ỨNG DỤNG PHA CHẾ & ĐÓNG GÓI */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Gợi Ý Món Ứng Dụng (Cách nhau bằng dấu phẩy)</label>
                      <input
                        type="text"
                        placeholder="Trà sữa ô long nướng, Trà kem cheese, Trà trái cây..."
                        value={Array.isArray(productFormData.applications) ? productFormData.applications.join(', ') : ''}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            applications: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Quy Cách Đóng Gói (Cách nhau bằng dấu phẩy)</label>
                      <input
                        type="text"
                        placeholder="Gói nhôm 1kg (10 gói/thùng), Bao 25kg..."
                        value={Array.isArray(productFormData.packaging) ? productFormData.packaging.join(', ') : ''}
                        onChange={(e) =>
                          setProductFormData({
                            ...productFormData,
                            packaging: e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                          })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                      />
                    </div>
                  </div>

                  {/* NÚT THAO TÁC FORM */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setProductModalTab('preview')}
                      className="px-4 py-2.5 rounded-xl border border-tea-border text-tea-dark hover:bg-tea-cream/50 font-bold flex items-center gap-1.5"
                    >
                      <Eye className="w-4 h-4 text-tea-emerald" /> Xem Trước Hiển Thị
                    </button>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setProductModalOpen(false)}
                        className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold"
                      >
                        Hủy bỏ
                      </button>
                      <button
                        type="submit"
                        className="px-6 py-2.5 rounded-xl bg-tea-primary hover:bg-tea-emerald text-white font-bold shadow-tea-sm transition-colors"
                      >
                        {editingProduct ? 'Lưu Thay Đổi (Update)' : 'Thêm Sản Phẩm (Create)'}
                      </button>
                    </div>
                  </div>
                </form>
              ) : (
                /* TAB 2: LIVE PREVIEW SẢN PHẨM TRÊN GIAO DIỆN WEB */
                <div className="space-y-6">
                  <div className="p-4 rounded-2xl bg-tea-mist/60 border border-tea-border flex items-center justify-between">
                    <span className="text-xs font-bold text-tea-dark flex items-center gap-1.5">
                      <Eye className="w-4 h-4 text-tea-emerald" /> Bản xem trước trang chi tiết sản phẩm trên giao diện khách hàng
                    </span>
                    <button
                      type="button"
                      onClick={() => setProductModalTab('edit')}
                      className="text-xs font-bold text-tea-primary hover:underline flex items-center gap-1"
                    >
                      <Pencil className="w-3.5 h-3.5" /> Quay lại chỉnh sửa
                    </button>
                  </div>

                  {/* Simulated Product Card & Detail Preview */}
                  <div className="bg-white rounded-3xl p-6 border border-tea-border shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                      <div className="md:col-span-5">
                        <div className="relative rounded-2xl overflow-hidden aspect-square bg-tea-cream border border-tea-border">
                          <img
                            src={productFormData.image || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'}
                            alt={productFormData.name}
                            className="w-full h-full object-cover"
                          />
                          {productFormData.badge && (
                            <div className="absolute top-3 left-3">
                              <span className="px-3 py-1 rounded-full bg-tea-primary text-tea-mint text-[11px] font-bold shadow-sm flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                {productFormData.badge}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-gray-500 font-mono">
                          <span>MÃ: {productFormData.sku || 'CS-TEA-XX'}</span>
                          <span className="text-tea-emerald font-bold">{productFormData.categoryName}</span>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-3">
                        <span className="text-[11px] font-bold text-tea-emerald uppercase tracking-wider block">
                          Xuất xứ: {productFormData.origin || 'Bảo Lộc, Lâm Đồng'}
                        </span>
                        <h2 className="text-xl sm:text-2xl font-extrabold text-tea-dark leading-snug">
                          {productFormData.name || 'Tên Sản Phẩm Mẫu'}
                        </h2>

                        {/* Short Description */}
                        {productFormData.shortDesc && (
                          <div className="p-3 rounded-xl bg-tea-mist/40 border border-tea-border/60">
                            <span className="text-[10px] font-bold text-tea-dark block uppercase tracking-wider mb-1">
                              Mô Tả Nhanh (Short Desc)
                            </span>
                            <p className="text-xs text-gray-700 leading-relaxed italic">
                              "{productFormData.shortDesc}"
                            </p>
                          </div>
                        )}

                        {/* Full Description */}
                        <div>
                          <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider mb-1">
                            Bài Viết Giới Thiệu Chuyên Sâu (Full Story)
                          </span>
                          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
                            {productFormData.fullDesc || productFormData.shortDesc || 'Chưa có mô tả chi tiết bài viết.'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Applications & Packaging Chips */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                      <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60">
                        <span className="font-bold text-tea-dark block mb-2">Ứng Dụng Pha Chế Gợi Ý</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(productFormData.applications || []).map((app, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 text-[11px]">
                              ☕ {app}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="p-3.5 rounded-xl border border-gray-100 bg-gray-50/60">
                        <span className="font-bold text-tea-dark block mb-2">Quy Cách Đóng Gói B2B</span>
                        <div className="flex flex-wrap gap-1.5">
                          {(productFormData.packaging || []).map((pkg, idx) => (
                            <span key={idx} className="px-2.5 py-1 rounded-lg bg-white border border-gray-200 text-gray-700 text-[11px]">
                              📦 {pkg}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* PREVIEW BOTTOM ACTIONS */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => setProductModalTab('edit')}
                      className="px-4 py-2 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold text-xs"
                    >
                      ← Quay lại chỉnh sửa
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveProduct}
                      className="px-6 py-2.5 rounded-xl bg-tea-primary hover:bg-tea-emerald text-white font-bold text-xs shadow-tea-sm transition-colors"
                    >
                      {editingProduct ? 'Lưu Sản Phẩm (Update)' : 'Thêm Sản Phẩm Ngay (Create)'}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* MODAL: THÊM / SỬA TIN TỨC & CÔNG THỨC (NEWS MODAL) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {newsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-3xl w-full max-h-[92vh] overflow-y-auto border border-tea-border shadow-tea-xl space-y-4 text-xs"
            >
              {/* Header with Title and Tab Switcher */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-100 pb-3">
                <div>
                  <h3 className="text-base font-bold text-tea-dark">
                    {editingNews ? 'Chỉnh Sửa Bài Viết & Công Thức' : 'Viết Bài / Công Thức Mới (Create)'}
                  </h3>
                  <p className="text-[11px] text-gray-500">Thiết kế bài viết chuyên nghiệp, chuẩn SEO và quy trình Barista SOP</p>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center bg-gray-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setNewsModalTab('edit')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        newsModalTab === 'edit'
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      ✏️ Soạn Thảo
                    </button>
                    <button
                      type="button"
                      onClick={() => setNewsModalTab('preview')}
                      className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-colors ${
                        newsModalTab === 'preview'
                          ? 'bg-white text-blue-700 shadow-sm'
                          : 'text-gray-500 hover:text-gray-800'
                      }`}
                    >
                      👁️ Xem Trước Bố Cục
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setNewsModalOpen(false)}
                    className="p-1.5 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveNews} className="space-y-4">
                {newsModalTab === 'edit' ? (
                  <>
                    {/* AI AUTO-DESIGN BAR */}
                    <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-teal-500/10 border border-blue-200 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm">
                            <Sparkles className="w-4 h-4 text-cyan-300" />
                          </div>
                          <div>
                            <span className="font-bold text-gray-900 block text-xs">AI Smart Auto-Design (Tự động thiết kế)</span>
                            <span className="text-[11px] text-gray-600">Nhập tiêu đề hoặc vài từ khóa thô, bấm 1 nút để AI tự động lên dàn bài & định dạng đẹp</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleAiAutoDesignNews(newsFormData.category === 'cong-thuc' ? 'recipe' : newsFormData.category === 'xu-huong' ? 'trend' : 'knowledge')}
                            disabled={isDesigningNews || isTranslatingNews}
                            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer disabled:opacity-50"
                          >
                            <Sparkles className={`w-3.5 h-3.5 text-cyan-300 ${isDesigningNews ? 'animate-spin' : ''}`} />
                            <span>{isDesigningNews ? 'Đang tạo bố cục...' : '✨ Tự động thiết kế'}</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleTranslateNewsZh}
                            disabled={isTranslatingNews || isDesigningNews}
                            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-95 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-1.5 shrink-0 transition-all cursor-pointer disabled:opacity-50"
                            title="Dịch bài viết này sang chữ Hán Phồn Thể (繁體中文)"
                          >
                            <Sparkles className={`w-3.5 h-3.5 text-purple-200 ${isTranslatingNews ? 'animate-spin' : ''}`} />
                            <span>{isTranslatingNews ? 'Đang dịch sang 繁中...' : '🇹🇼 AI Dịch Sang 繁中'}</span>
                          </button>
                        </div>
                      </div>

                      {/* Presets / Templates */}
                      <div className="flex items-center gap-2 pt-2 border-t border-blue-200/60 text-[11px] flex-wrap">
                        <span className="text-gray-500 font-medium">Chọn mẫu dựng sẵn:</span>
                        <button
                          type="button"
                          onClick={() => handleAiAutoDesignNews('recipe')}
                          className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold transition-colors cursor-pointer"
                        >
                          🍹 Công Thức Barista SOP
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAiAutoDesignNews('trend')}
                          className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold transition-colors cursor-pointer"
                        >
                          📈 Báo Cáo Xu Hướng 2026
                        </button>
                        <button
                          type="button"
                          onClick={() => handleAiAutoDesignNews('knowledge')}
                          className="px-2.5 py-1 rounded-lg bg-white border border-blue-200 hover:bg-blue-50 text-blue-700 font-semibold transition-colors cursor-pointer"
                        >
                          🔬 Bí Quyết Chiết Xuất R&D
                        </button>
                      </div>
                    </div>

                    {/* Standard Inputs */}
                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Tiêu Đề Bài Viết *</label>
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Công thức Trà Ô Long Nướng Kem Mặn 2026..."
                        value={newsFormData.title}
                        onChange={(e) => setNewsFormData({ ...newsFormData, title: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 text-sm font-semibold"
                      />
                    </div>

                    {/* BẢN DỊCH BÀI VIẾT TIẾNG TRUNG PHỒN THỂ (繁體中文) */}
                    <div className="p-4 rounded-2xl bg-purple-50/70 border border-purple-200/80 space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-base">🇹🇼</span>
                          <span className="font-bold text-purple-900 text-xs">
                            Bản Dịch Bài Viết Tiếng Trung Phồn Thể (繁體中文)
                          </span>
                        </div>
                        <span className="text-[10px] text-purple-600 font-medium">
                          Tự động dịch bằng AI khi Lưu nếu để trống
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Tiêu đề bài viết (繁體中文)
                        </label>
                        <input
                          type="text"
                          placeholder="例如: 2026 炭焙烏龍海鹽奶蓋調配標準 SOP..."
                          value={newsFormData.titleZh || ''}
                          onChange={(e) => setNewsFormData({ ...newsFormData, titleZh: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-400/30"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-semibold text-gray-700 mb-1">
                          Tóm tắt bài viết (繁體中文)
                        </label>
                        <textarea
                          rows={2}
                          placeholder="文章繁體中文簡介..."
                          value={newsFormData.excerptZh || ''}
                          onChange={(e) => setNewsFormData({ ...newsFormData, excerptZh: e.target.value })}
                          className="w-full px-3 py-2 text-xs rounded-xl border border-purple-200 bg-white text-gray-900 placeholder-gray-400 outline-none leading-relaxed focus:ring-2 focus:ring-purple-400/30"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Chuyên Mục</label>
                        <select
                          value={newsFormData.category}
                          onChange={(e) => setNewsFormData({ ...newsFormData, category: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none font-medium"
                        >
                          <option value="cong-thuc">Công Thức Pha Chế (Barista SOP)</option>
                          <option value="xu-huong">Xu Hướng Đồ Uống 2026</option>
                          <option value="kien-thuc">Kiến Thức Trà & Kỹ Thuật R&D</option>
                          <option value="tin-doanh-nghiep">Tin Doanh Nghiệp</option>
                        </select>
                      </div>
                      <div>
                        <label className="block font-bold text-gray-700 mb-1">Thời Gian Đọc</label>
                        <input
                          type="text"
                          placeholder="4 phút"
                          value={newsFormData.readTime}
                          onChange={(e) => setNewsFormData({ ...newsFormData, readTime: e.target.value })}
                          className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30"
                        />
                      </div>
                    </div>

                    {/* Cấu hình hiển thị nổi bật */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-50/80 to-blue-50/80 border border-amber-200/80 space-y-2">
                      <span className="font-bold text-gray-800 text-xs flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                        Cài Đặt Vị Trí Nổi Bật (Featured)
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-amber-200/80 hover:border-amber-400 cursor-pointer transition-all shadow-xs">
                          <input
                            type="checkbox"
                            checked={Boolean(newsFormData.featuredHome)}
                            onChange={(e) => setNewsFormData({ ...newsFormData, featuredHome: e.target.checked })}
                            className="mt-0.5 w-4 h-4 text-amber-600 rounded focus:ring-amber-500 border-gray-300 cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-gray-800 text-xs block">⭐ Nổi bật trên Trang Chủ</span>
                            <span className="text-[11px] text-gray-500 leading-snug block mt-0.5">Hiển thị bài viết này trong khu vực Tin Tức Nổi Bật tại Trang Chủ.</span>
                          </div>
                        </label>

                        <label className="flex items-start gap-2.5 p-2.5 rounded-xl bg-white border border-blue-200/80 hover:border-blue-400 cursor-pointer transition-all shadow-xs">
                          <input
                            type="checkbox"
                            checked={Boolean(newsFormData.featuredNews)}
                            onChange={(e) => setNewsFormData({ ...newsFormData, featuredNews: e.target.checked })}
                            className="mt-0.5 w-4 h-4 text-blue-600 rounded focus:ring-blue-500 border-gray-300 cursor-pointer"
                          />
                          <div>
                            <span className="font-bold text-gray-800 text-xs block">📰 Tiêu điểm Trang Tin Tức</span>
                            <span className="text-[11px] text-gray-500 leading-snug block mt-0.5">Đặt làm bài viết Hero lớn ở đầu trang Tin Tức.</span>
                          </div>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block font-bold text-gray-700 mb-1">Tóm Tắt Ngắn (Excerpt)</label>
                      <textarea
                        rows={2}
                        placeholder="Đoạn tóm tắt mở đầu bài viết thu hút người đọc..."
                        value={newsFormData.excerpt}
                        onChange={(e) => setNewsFormData({ ...newsFormData, excerpt: e.target.value })}
                        className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30"
                      />
                    </div>

                    <div>
                      <ImageUploadInput
                        label="Hình Ảnh Bài Viết / Bìa Công Thức (Tệp Máy Tính hoặc Link)"
                        value={newsFormData.image}
                        onChange={(url) => setNewsFormData({ ...newsFormData, image: url })}
                        folder="news"
                      />
                    </div>

                    {/* Detailed HTML Content Editor */}
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <label className="font-bold text-gray-700">Nội Dung Chi Tiết Bài Viết (Hỗ trợ HTML định dạng đẹp)</label>
                        <span className="text-[10px] text-gray-400">Hỗ trợ các thẻ: &lt;h2&gt;, &lt;p&gt;, &lt;table&gt;, &lt;ul&gt;</span>
                      </div>
                      <textarea
                        rows={8}
                        placeholder="Nhập hoặc để AI tự động thiết kế nội dung bài viết HTML chuẩn tạp chí..."
                        value={newsFormData.content}
                        onChange={(e) => setNewsFormData({ ...newsFormData, content: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-blue-500/30 font-mono text-xs leading-relaxed"
                      />
                    </div>

                    {/* Recipe Box Editor (if category is cong-thuc or recipeBox exists) */}
                    {(newsFormData.category === 'cong-thuc' || newsFormData.recipeBox) && (
                      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-3">
                        <div className="flex items-center gap-2">
                          <ChefHat className="w-4 h-4 text-amber-700" />
                          <span className="font-bold text-amber-900 text-xs">Hộp Công Thức Pha Chế Chuẩn Barista SOP</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Tên Món Uống:</label>
                            <input
                              type="text"
                              value={newsFormData.recipeBox?.title || ''}
                              onChange={(e) =>
                                setNewsFormData({
                                  ...newsFormData,
                                  recipeBox: { ...(newsFormData.recipeBox || {}), title: e.target.value }
                                })
                              }
                              placeholder="Ví dụ: Trà Sữa Ô Long Nướng"
                              className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-500/30"
                            />
                          </div>
                          <div>
                            <label className="block font-semibold text-gray-700 mb-1">Giá Vốn Ước Tính (Cost/ly):</label>
                            <input
                              type="text"
                              value={newsFormData.recipeBox?.cost || ''}
                              onChange={(e) =>
                                setNewsFormData({
                                  ...newsFormData,
                                  recipeBox: { ...(newsFormData.recipeBox || {}), cost: e.target.value }
                                })
                              }
                              placeholder="Ví dụ: 4.800đ - 5.500đ / ly 500ml"
                              className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-500/30"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Danh Sách Nguyên Liệu (Mỗi dòng 1 nguyên liệu):</label>
                          <textarea
                            rows={3}
                            value={(newsFormData.recipeBox?.ingredients || []).join('\n')}
                            onChange={(e) =>
                              setNewsFormData({
                                ...newsFormData,
                                recipeBox: {
                                  ...(newsFormData.recipeBox || {}),
                                  ingredients: e.target.value.split('\n').filter((x) => x.trim())
                                }
                              })
                            }
                            placeholder="120ml Cốt trà CASA&#10;25g Bột béo CASA&#10;20ml Nước đường"
                            className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-500/30 text-xs"
                          />
                        </div>

                        <div>
                          <label className="block font-semibold text-gray-700 mb-1">Các Bước Thực Hiện SOP (Mỗi dòng 1 bước):</label>
                          <textarea
                            rows={3}
                            value={(newsFormData.recipeBox?.steps || []).join('\n')}
                            onChange={(e) =>
                              setNewsFormData({
                                ...newsFormData,
                                recipeBox: {
                                  ...(newsFormData.recipeBox || {}),
                                  steps: e.target.value.split('\n').filter((x) => x.trim())
                                }
                              })
                            }
                            placeholder="Ủ cốt trà theo tỷ lệ 1:30 trong 12 phút.&#10;Cho cốt trà, bột béo, đường vào shaker.&#10;Thêm đá và lắc mạnh 15 nhịp."
                            className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-500/30 text-xs"
                          />
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  /* LIVE PREVIEW TAB */
                  <div className="p-4 sm:p-6 rounded-2xl bg-white border border-gray-200 space-y-6 max-h-[65vh] overflow-y-auto">
                    <div>
                      <span className="inline-block px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[11px] font-bold uppercase tracking-wider mb-2">
                        {newsFormData.categoryName || newsFormData.category}
                      </span>
                      <h2 className="text-xl sm:text-2xl font-extrabold text-tea-dark leading-snug">
                        {newsFormData.title || 'Tiêu Đề Bài Viết Xem Trước'}
                      </h2>
                      <div className="flex items-center gap-4 text-gray-400 text-[11px] mt-2 border-b border-gray-100 pb-3">
                        <span>Tác giả: <strong className="text-gray-700">{newsFormData.author || 'CASA R&D Team'}</strong></span>
                        <span>•</span>
                        <span>{newsFormData.date || 'Hôm nay'}</span>
                        <span>•</span>
                        <span>{newsFormData.readTime || '4 phút đọc'}</span>
                      </div>
                    </div>

                    {newsFormData.image && (
                      <div className="rounded-2xl overflow-hidden aspect-[16/9] bg-gray-100">
                        <img
                          src={newsFormData.image}
                          alt={newsFormData.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Excerpt */}
                    {newsFormData.excerpt && (
                      <p className="text-sm font-medium text-gray-600 italic border-l-3 border-blue-500 pl-3">
                        {newsFormData.excerpt}
                      </p>
                    )}

                    {/* HTML Content Body */}
                    <div
                      className="prose prose-sm max-w-none text-gray-700 leading-relaxed space-y-4"
                      dangerouslySetInnerHTML={{
                        __html:
                          newsFormData.content ||
                          '<p class="text-gray-400 italic">Chưa có nội dung. Bạn có thể bấm "Tự động thiết kế" ở tab Soạn thảo để tạo nội dung chuẩn tạp chí ngay tức thì!</p>'
                      }}
                    />

                    {/* Recipe Box Preview */}
                    {newsFormData.recipeBox && (
                      <div className="p-5 rounded-2xl bg-tea-mist border-2 border-tea-leaf/30 shadow-tea-sm space-y-4">
                        <div className="flex items-center gap-3 border-b border-tea-leaf/20 pb-3">
                          <div className="w-9 h-9 rounded-xl bg-white flex items-center justify-center text-tea-emerald shadow-sm">
                            <ChefHat className="w-5 h-5" />
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-tea-dark">{newsFormData.recipeBox.title}</h4>
                            <span className="text-[11px] font-semibold text-tea-emerald">
                              Giá vốn: {newsFormData.recipeBox.cost}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Nguyên liệu:</h5>
                            <ul className="space-y-1 text-xs text-gray-700">
                              {(newsFormData.recipeBox.ingredients || []).map((ing, i) => (
                                <li key={i} className="flex items-center gap-1.5">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-tea-leaf shrink-0" />
                                  <span>{ing}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <div>
                            <h5 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Quy trình SOP:</h5>
                            <ol className="list-decimal pl-4 space-y-1 text-xs text-gray-700">
                              {(newsFormData.recipeBox.steps || []).map((st, i) => (
                                <li key={i}>{st}</li>
                              ))}
                            </ol>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Footer buttons */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setNewsModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                  >
                    Hủy bỏ
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-sm transition-all"
                  >
                    Lưu Bài Viết & Đẩy Lên Realtime
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: THÊM / SỬA CÂU HỎI FAQ */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {faqModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-tea-border shadow-tea-xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-tea-dark">
                  {editingFaq ? 'Chỉnh Sửa FAQ' : 'Thêm Câu Hỏi FAQ Mới (Create)'}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTranslateFaqZh}
                    disabled={isTranslatingFaq}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 text-[11px] font-bold transition-all border border-purple-200 shadow-sm disabled:opacity-50"
                    title="Dùng AI dịch câu hỏi và câu trả lời sang tiếng Trung Phồn Thể"
                  >
                    {isTranslatingFaq ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>🇹🇼</span>
                    )}
                    <span>{isTranslatingFaq ? 'AI Đang Dịch...' : 'AI Dịch Sang 繁中'}</span>
                  </button>
                  <button onClick={() => setFaqModalOpen(false)}>
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveFaq} className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Chuyên Mục FAQ</label>
                  <select
                    value={faqFormData.category}
                    onChange={(e) => setFaqFormData({ ...faqFormData, category: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none"
                  >
                    <option value="san-pham">Sản Phẩm & Nguồn Gốc</option>
                    <option value="pha-che-rd">R&D & Hỗ Trợ Công Thức</option>
                    <option value="dat-hang-moq">Đặt Hàng, MOQ & Giao Hàng</option>
                    <option value="oem-odm">Gia Công OEM/ODM & Đại Lý</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Câu Hỏi (Tiếng Việt) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: MOQ đặt hàng là bao nhiêu?"
                      value={faqFormData.question}
                      onChange={(e) => setFaqFormData({ ...faqFormData, question: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500/30"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-purple-800 mb-1 flex items-center gap-1">
                      <span>Câu Hỏi (繁體中文)</span>
                      <span className="text-[10px] text-purple-600 font-normal">(Tự động dịch nếu trống)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="例如：批量訂單的起訂量是多少？"
                      value={faqFormData.questionZh || ''}
                      onChange={(e) => setFaqFormData({ ...faqFormData, questionZh: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-gray-900 placeholder-purple-400 outline-none focus:ring-2 focus:ring-purple-400/30"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Câu Trả Lời Chi Tiết (Tiếng Việt) *</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Nội dung giải đáp chi tiết..."
                    value={faqFormData.answer}
                    onChange={(e) => setFaqFormData({ ...faqFormData, answer: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-purple-500/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-purple-800 mb-1 flex items-center gap-1">
                    <span>Câu Trả Lời (繁體中文)</span>
                    <span className="text-[10px] text-purple-600 font-normal">(Tự động dịch nếu trống)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="詳細解答內容（繁體中文）..."
                    value={faqFormData.answerZh || ''}
                    onChange={(e) => setFaqFormData({ ...faqFormData, answerZh: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-purple-200 bg-white text-gray-900 placeholder-purple-400 outline-none focus:ring-2 focus:ring-purple-400/30"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setFaqModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 font-bold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-purple-600 text-white font-bold"
                  >
                    Lưu FAQ
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* MODAL: THÊM NGƯỜI DÙNG MỚI (USER MODAL) */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {userModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full border border-tea-border shadow-tea-xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-tea-dark">
                  Thêm Người Dùng & Phân Quyền (Create User)
                </h3>
                <button onClick={() => setUserModalOpen(false)}>
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              <form onSubmit={handleCreateUser} className="space-y-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Họ & Tên Hiển Thị</label>
                  <input
                    type="text"
                    required
                    placeholder="Ví dụ: Nguyễn Văn Quản Trị"
                    value={userFormData.displayName}
                    onChange={(e) => setUserFormData({ ...userFormData, displayName: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Email Đăng Nhập *</label>
                  <input
                    type="email"
                    required
                    placeholder="email@casatea.vn"
                    value={userFormData.email}
                    onChange={(e) => setUserFormData({ ...userFormData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-indigo-500/30"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Cấp Quyền (Role)</label>
                    <select
                      value={userFormData.role}
                      onChange={(e) => setUserFormData({ ...userFormData, role: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 outline-none font-bold focus:ring-2 focus:ring-indigo-500/30"
                    >
                      <option value={ROLES.SUPER_ADMIN}>SUPER_ADMIN (Toàn quyền)</option>
                      <option value={ROLES.ADMIN}>ADMIN (Quản trị)</option>
                      <option value={ROLES.EDITOR}>EDITOR (Biên tập)</option>
                      <option value={ROLES.VIEWER}>VIEWER (Xem)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Trạng Thái</label>
                    <select
                      value={userFormData.status}
                      onChange={(e) => setUserFormData({ ...userFormData, status: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-emerald-700 outline-none font-bold focus:ring-2 focus:ring-emerald-500/30"
                    >
                      <option value="ACTIVE">ACTIVE (Kích hoạt)</option>
                      <option value="INACTIVE">INACTIVE (Khóa)</option>
                    </select>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setUserModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 font-bold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-indigo-600 text-white font-bold"
                  >
                    Thêm Người Dùng
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ==================================================================== */}
      {/* MODAL: THÊM / SỬA MÁY MÓC */}
      {/* ==================================================================== */}
      <AnimatePresence>
        {machineryModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full border border-tea-border shadow-tea-xl space-y-4 text-xs"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-3">
                <h3 className="text-base font-bold text-tea-dark">
                  {editingMachinery ? 'Sửa Thiết Bị Máy Móc' : 'Thêm Thiết Bị Mới'}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handleTranslateMachineryZh}
                    disabled={isTranslatingMachinery}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 text-amber-800 hover:bg-amber-100 text-[11px] font-bold transition-all border border-amber-200 shadow-sm disabled:opacity-50"
                    title="Dùng AI dịch thông tin thiết bị sang tiếng Trung Phồn Thể"
                  >
                    {isTranslatingMachinery ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <span>🇹🇼</span>
                    )}
                    <span>{isTranslatingMachinery ? 'AI Đang Dịch...' : 'AI Dịch Sang 繁中'}</span>
                  </button>
                  <button onClick={() => setMachineryModalOpen(false)}>
                    <X className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
              </div>

              <form onSubmit={handleSaveMachinery} className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Tên Thiết Bị (Tiếng Việt) *</label>
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Máy sàng lọc màu quang học Sortex"
                      value={machineryFormData.name}
                      onChange={(e) => setMachineryFormData({ ...machineryFormData, name: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-amber-800 mb-1 flex items-center gap-1">
                      <span>Tên Thiết Bị (繁體中文)</span>
                      <span className="text-[10px] text-amber-600 font-normal">(Tự động dịch nếu trống)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="例如：Sortex 光學彩色色選機"
                      value={machineryFormData.nameZh || ''}
                      onChange={(e) => setMachineryFormData({ ...machineryFormData, nameZh: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-gray-900 placeholder-amber-400 outline-none focus:ring-2 focus:ring-amber-400/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Xuất Xứ (Tiếng Việt)</label>
                    <input
                      type="text"
                      placeholder="Thụy Sĩ, CHLB Đức..."
                      value={machineryFormData.origin}
                      onChange={(e) => setMachineryFormData({ ...machineryFormData, origin: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-amber-800 mb-1">Xuất Xứ (繁體中文)</label>
                    <input
                      type="text"
                      placeholder="瑞士進口, 德國製造..."
                      value={machineryFormData.originZh || ''}
                      onChange={(e) => setMachineryFormData({ ...machineryFormData, originZh: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-gray-900 placeholder-amber-400 outline-none focus:ring-2 focus:ring-amber-400/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Công Suất (Tiếng Việt)</label>
                    <input
                      type="text"
                      placeholder="Ví dụ: 3.5 tấn/giờ"
                      value={machineryFormData.capacity}
                      onChange={(e) => setMachineryFormData({ ...machineryFormData, capacity: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-amber-800 mb-1">Công Suất (繁體中文)</label>
                    <input
                      type="text"
                      placeholder="例如：每小時 3.5 噸"
                      value={machineryFormData.capacityZh || ''}
                      onChange={(e) => setMachineryFormData({ ...machineryFormData, capacityZh: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-gray-900 placeholder-amber-400 outline-none focus:ring-2 focus:ring-amber-400/30"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-gray-700 mb-1">Mô Tả / Công Nghệ (Tiếng Việt)</label>
                    <textarea
                      rows={3}
                      placeholder="Mô tả nguyên lý hoạt động, cấp độ công nghệ..."
                      value={machineryFormData.description}
                      onChange={(e) => setMachineryFormData({ ...machineryFormData, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-amber-500/30"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-amber-800 mb-1 flex items-center gap-1">
                      <span>Mô Tả (繁體中文)</span>
                      <span className="text-[10px] text-amber-600 font-normal">(Tự động dịch nếu trống)</span>
                    </label>
                    <textarea
                      rows={3}
                      placeholder="設備詳細運作與技術優勢（繁體中文）..."
                      value={machineryFormData.descriptionZh || ''}
                      onChange={(e) => setMachineryFormData({ ...machineryFormData, descriptionZh: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl border border-amber-200 bg-white text-gray-900 placeholder-amber-400 outline-none focus:ring-2 focus:ring-amber-400/30"
                    />
                  </div>
                </div>

                <div>
                  <ImageUploadInput
                    label="Hình Ảnh Thiết Bị / Máy Móc (Tệp Máy Tính hoặc Link)"
                    value={machineryFormData.image}
                    onChange={(url) => setMachineryFormData({ ...machineryFormData, image: url })}
                    folder="machinery"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setMachineryModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 font-bold"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-amber-600 text-white font-bold"
                  >
                    Lưu Thiết Bị
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

