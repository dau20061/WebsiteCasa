import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  X,
  Loader2,
  Link as LinkIcon,
  Sparkles,
  Check,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { uploadImageFile } from '../firebase/storage';
import { compressImage } from '../utils/imageCompressor';

// Danh sách ảnh mẫu nguyên liệu F&B cao cấp được chuẩn bị sẵn cho CASA TEA
const CASA_SAMPLE_IMAGES = [
  {
    title: 'Hồng Trà Assam',
    url: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Trà Ô Long Nướng',
    url: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Bột Matcha Nhật',
    url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Trà Hoa Lài',
    url: 'https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Syrup Đường Đen',
    url: 'https://images.unsplash.com/photo-1558857563-b37fcfeee58c?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Syrup Bí Đao',
    url: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Siro Đào Vàng',
    url: 'https://images.unsplash.com/photo-1595981267035-7b04ca84a82d?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Siro Dâu Tây',
    url: 'https://images.unsplash.com/photo-1587888637140-849b25d80ef9?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Siro Chanh Dây',
    url: 'https://images.unsplash.com/photo-1534353473418-4cfa6c56fd38?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Siro Vải Thiều',
    url: 'https://images.unsplash.com/photo-1563227812-0ea4c22e6cc8?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Bột Kem Béo',
    url: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Kem Macchiato',
    url: 'https://images.unsplash.com/photo-1579954115545-a95591f28bfc?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Trân Châu Đen',
    url: 'https://images.unsplash.com/photo-1525385133512-2f3bdd039054?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Thạch 3Q Giòn',
    url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?auto=format&fit=crop&w=800&q=80',
  },
  {
    title: 'Bột Pudding / Tàu Hủ',
    url: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=800&q=80',
  }
];

export default function ImageUploadInput({
  label = "Hình Ảnh",
  value = "",
  onChange,
  folder = "products"
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' | 'url' | 'samples'
  const [errorMessage, setErrorMessage] = useState(null);
  const [sizeInfo, setSizeInfo] = useState('');
  const [urlInput, setUrlInput] = useState('');

  // Xử lý chọn ảnh từ máy tính
  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Reset input để có thể chọn lại file cũ nếu muốn
    e.target.value = '';

    // Validate định dạng ảnh
    const validMimes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
    const validExts = /\.(jpg|jpeg|png|webp|gif|svg)$/i;
    if (!validMimes.includes(file.type) && !validExts.test(file.name)) {
      setErrorMessage('Chỉ chấp nhận tệp hình ảnh: JPG, PNG, WebP, GIF hoặc SVG!');
      return;
    }

    // Validate dung lượng (< 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('Dung lượng tệp vượt quá 10MB. Vui lòng chọn tệp nhỏ hơn.');
      return;
    }

    setErrorMessage(null);
    setUploading(true);

    try {
      // 1. NÉN TỨC THÌ BẰNG HTML5 CANVAS (< 50ms) -> Thành ảnh WebP 40-80KB siêu nhẹ
      const compressed = await compressImage(file, {
        maxWidth: 1000,
        maxHeight: 1000,
        quality: 0.82
      });

      // Áp dụng ngay ảnh nén để hiển thị tức thì, KHÔNG để người dùng phải chờ đợi!
      onChange(compressed.dataUrl);
      const originalMb = (compressed.originalSizeKb / 1024).toFixed(1);
      setSizeInfo(`Đã nén tối ưu: ${compressed.sizeKb} KB (từ ${originalMb} MB)`);
      setUploading(false);

      // 2. Thử tải ngầm lên Firebase Storage nếu bucket sẵn sàng (có timeout 2.5s không bao giờ treo)
      try {
        const result = await uploadImageFile(folder, file);
        if (result?.downloadUrl) {
          onChange(result.downloadUrl);
          setSizeInfo('Lưu trữ trên Cloud CDN');
        }
      } catch (storageErr) {
        // Firebase Storage chưa cấu hình bucket hoặc timeout -> Giữ nguyên WebP nén siêu nhẹ
        console.warn('[ImageUploadInput] Firebase Storage offline, dùng ảnh WebP tối ưu:', storageErr.message);
      }
    } catch (err) {
      console.error('[ImageUploadInput] Lỗi xử lý ảnh:', err);
      setErrorMessage(err.message || 'Không thể đọc và xử lý file ảnh.');
      setUploading(false);
    }
  };

  const handleApplyUrl = (inputUrl) => {
    const cleanUrl = (inputUrl || '').trim();
    if (!cleanUrl) return;
    onChange(cleanUrl);
    setSizeInfo('Liên kết URL trực tiếp');
    setErrorMessage(null);
  };

  const handleSelectSample = (sampleUrl) => {
    onChange(sampleUrl);
    setSizeInfo('Ảnh mẫu CASA TEA');
    setErrorMessage(null);
  };

  const handleRemoveImage = () => {
    onChange('');
    setSizeInfo('');
    setUrlInput('');
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const getImageSourceLabel = () => {
    if (!value) return '';
    if (value.startsWith('data:image/')) return 'Ảnh từ máy tính (Đã tối ưu WebP)';
    if (value.includes('unsplash.com')) return 'Ảnh nguyên liệu cao cấp';
    if (value.includes('firebasestorage')) return 'Ảnh lưu trữ Firebase Storage';
    return 'Ảnh từ liên kết ngoài';
  };

  return (
    <div className="space-y-2 text-xs">
      {/* HEADER: Tiêu đề & Chọn phương thức nhập */}
      <div className="flex items-center justify-between flex-wrap gap-1.5">
        <label className="font-bold text-gray-700 flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-tea-emerald" />
          <span>{label}</span>
        </label>

        {/* Nút chuyển tab: Máy tính / Nhập Link / Ảnh mẫu */}
        <div className="flex items-center gap-1 bg-gray-100 p-0.5 rounded-xl text-[11px] font-semibold">
          <button
            type="button"
            onClick={() => { setActiveTab('upload'); setErrorMessage(null); }}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'upload'
                ? 'bg-white text-tea-dark shadow-sm font-bold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <UploadCloud className="w-3 h-3 text-tea-emerald" />
            <span>Từ máy tính</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('url'); setErrorMessage(null); }}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'url'
                ? 'bg-white text-tea-dark shadow-sm font-bold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <LinkIcon className="w-3 h-3 text-blue-500" />
            <span>Link URL</span>
          </button>
          <button
            type="button"
            onClick={() => { setActiveTab('samples'); setErrorMessage(null); }}
            className={`px-2.5 py-1 rounded-lg transition-all flex items-center gap-1 cursor-pointer ${
              activeTab === 'samples'
                ? 'bg-white text-tea-dark shadow-sm font-bold'
                : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Ảnh mẫu CASA</span>
          </button>
        </div>
      </div>

      {/* THÔNG BÁO LỖI NẾU CÓ */}
      {errorMessage && (
        <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px] flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* INPUT FILE ẨN */}
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg,image/png,image/webp,image/gif,image/svg+xml"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* ========================================================================= */}
      {/* TRƯỜNG HỢP 1: ĐÃ CÓ ẢNH (HIỂN THỊ PREVIEW ĐẸP VÀ RÕ RÀNG)                  */}
      {/* ========================================================================= */}
      {value ? (
        <div className="p-3 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 space-y-2.5">
          <div className="flex items-center gap-3">
            {/* Khung ảnh thumbnail */}
            <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 bg-white shadow-sm shrink-0 group">
              <img
                src={value}
                alt="Product Preview"
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=200&q=80';
                }}
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-white text-[9px] font-bold gap-1">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Đang nén...</span>
                </div>
              )}
            </div>

            {/* Thông tin ảnh & nút hành động */}
            <div className="flex-1 min-w-0 space-y-1">
              <div className="flex items-center gap-1.5 text-tea-dark font-bold text-xs truncate">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                <span className="truncate">{getImageSourceLabel()}</span>
              </div>

              {sizeInfo && (
                <p className="text-[11px] text-emerald-700 font-medium">
                  {sizeInfo}
                </p>
              )}

              <div className="flex items-center gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="px-2.5 py-1 rounded-lg bg-white border border-gray-300 hover:border-tea-emerald text-gray-700 text-[11px] font-bold shadow-xs hover:bg-gray-50 transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <UploadCloud className="w-3 h-3 text-tea-emerald" />
                  <span>Chọn ảnh khác</span>
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  disabled={uploading}
                  className="px-2.5 py-1 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 text-[11px] font-bold transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                  <span>Xóa ảnh</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* ========================================================================= */
        /* TRƯỜNG HỢP 2: CHƯA CÓ ẢNH -> HIỂN THỊ KHU VỰC THEO TAB LỰA CHỌN           */
        /* ========================================================================= */
        <div>
          {/* TAB 1: TẢI TỪ MÁY TÍNH */}
          {activeTab === 'upload' && (
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-tea-emerald rounded-2xl p-5 text-center cursor-pointer transition-all bg-white hover:bg-tea-cream/20 group"
            >
              {uploading ? (
                <div className="flex flex-col items-center justify-center gap-2 py-3 text-gray-500">
                  <Loader2 className="w-7 h-7 text-tea-emerald animate-spin" />
                  <span className="text-xs font-bold text-tea-dark">Đang tối ưu hóa hình ảnh...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-gray-500 group-hover:text-tea-emerald">
                  <div className="w-11 h-11 rounded-2xl bg-tea-cream flex items-center justify-center group-hover:bg-tea-soft/50 transition-colors shadow-xs">
                    <UploadCloud className="w-5 h-5 text-tea-emerald" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-800 group-hover:text-tea-dark">
                      Bấm vào đây để chọn ảnh từ máy tính
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Tự động nén WebP siêu nét, lưu trữ mượt mà (Hỗ trợ JPG, PNG, WebP)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: NHẬP LINK URL */}
          {activeTab === 'url' && (
            <div className="p-3.5 rounded-2xl border border-gray-200 bg-gray-50/70 space-y-2.5">
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="Dán link ảnh tại đây (https://images.unsplash.com/...)"
                  value={urlInput}
                  onChange={(e) => setUrlInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleApplyUrl(urlInput);
                    }
                  }}
                  className="flex-1 px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-400 text-xs focus:ring-2 focus:ring-tea-emerald/30 outline-none"
                />
                <button
                  type="button"
                  onClick={() => handleApplyUrl(urlInput)}
                  className="px-3.5 py-2 rounded-xl bg-tea-emerald hover:bg-tea-dark text-white font-bold text-xs transition-colors shrink-0 flex items-center gap-1 shadow-xs cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Áp dụng</span>
                </button>
              </div>
              <p className="text-[10px] text-gray-500">
                Hỗ trợ dán link ảnh từ Unsplash, Imgur, Cloudinary hoặc bất kỳ website nào.
              </p>
            </div>
          )}

          {/* TAB 3: KHO ẢNH MẪU CASA TEA */}
          {activeTab === 'samples' && (
            <div className="p-3 rounded-2xl border border-amber-200/80 bg-amber-50/40 space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-amber-950 text-[11px] flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                  <span>Chọn nhanh từ 15 ảnh nguyên liệu F&B cao cấp:</span>
                </span>
                <span className="text-[10px] text-amber-700">1 click chọn ngay</span>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto pr-1">
                {CASA_SAMPLE_IMAGES.map((sample, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectSample(sample.url)}
                    className="group relative rounded-xl overflow-hidden border border-amber-200 bg-white hover:border-amber-500 hover:shadow-md transition-all text-left flex flex-col cursor-pointer"
                  >
                    <div className="h-14 w-full overflow-hidden bg-gray-100">
                      <img
                        src={sample.url}
                        alt={sample.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                    <div className="p-1 text-center bg-white">
                      <p className="text-[9px] font-bold text-gray-800 truncate group-hover:text-amber-700">
                        {sample.title}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}