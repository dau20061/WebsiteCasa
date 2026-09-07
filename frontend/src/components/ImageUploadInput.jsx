import React, { useState, useRef } from 'react';
import { UploadCloud, Image as ImageIcon, X, Loader2, Link as LinkIcon } from 'lucide-react';
import { uploadImageFile } from '../firebase/storage';

export default function ImageUploadInput({
  label = "Hình Ảnh",
  value = "",
  onChange,
  folder = "products"
}) {
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [useUrlMode, setUseUrlMode] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate định dạng ảnh
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      setErrorMessage('Chỉ chấp nhận file ảnh định dạng JPEG, PNG, WebP hoặc GIF!');
      return;
    }

    // Validate dung lượng (< 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Dung lượng ảnh vượt quá 5MB. Vui lòng chọn ảnh nhỏ hơn.');
      return;
    }

    setErrorMessage(null);
    setUploading(true);

    // 1. Đọc preview tức thì bằng FileReader (Base64)
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Url = event.target.result;
      
      // Thử upload lên Firebase Storage
      try {
        const result = await uploadImageFile(folder, file);
        if (result?.downloadUrl) {
          onChange(result.downloadUrl);
        } else {
          onChange(base64Url);
        }
      } catch (uploadErr) {
        console.warn('Firebase Storage upload failed, fallback to local data URL:', uploadErr);
        // Fallback: Sử dụng chuỗi Base64 để ảnh vẫn hiển thị mượt mà 100%
        onChange(base64Url);
      } finally {
        setUploading(false);
      }
    };

    reader.onerror = () => {
      setErrorMessage('Không thể đọc file ảnh từ máy tính.');
      setUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-1.5 text-xs">
      <div className="flex items-center justify-between">
        <label className="font-bold text-gray-700">{label}</label>
        <button
          type="button"
          onClick={() => setUseUrlMode(!useUrlMode)}
          className="text-[11px] text-tea-emerald hover:underline flex items-center gap-1 font-semibold"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{useUrlMode ? 'Chọn từ máy tính' : 'Nhập link URL'}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-2 rounded-xl bg-red-50 border border-red-200 text-red-700 text-[11px]">
          {errorMessage}
        </div>
      )}

      {useUrlMode ? (
        <div className="space-y-2">
          <input
            type="url"
            placeholder="https://images.unsplash.com/..."
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-tea-emerald/30 outline-none"
          />
          {value && (
            <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200 group">
              <img src={value} alt="Preview" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={handleRemoveImage}
                className="absolute top-1 right-1 p-1 rounded-lg bg-black/60 text-white hover:bg-black/80"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileSelect}
            className="hidden"
          />

          {value ? (
            <div className="flex items-center gap-3 p-3 rounded-2xl border border-gray-200 bg-tea-cream/30">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                <img src={value} alt="Uploaded" className="w-full h-full object-cover" />
                {uploading && (
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white">
                    <Loader2 className="w-5 h-5 animate-spin" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0 space-y-1.5">
                <p className="text-[11px] font-bold text-tea-dark truncate">
                  {value.startsWith('data:') ? 'Ảnh tải từ máy tính' : 'Ảnh đã liên kết'}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="px-3 py-1.5 rounded-lg bg-white border border-gray-200 hover:border-tea-emerald text-gray-700 text-[11px] font-bold transition-colors"
                  >
                    Thay đổi ảnh khác
                  </button>
                  <button
                    type="button"
                    onClick={handleRemoveImage}
                    disabled={uploading}
                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                    title="Xóa ảnh"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => !uploading && fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 hover:border-tea-emerald rounded-2xl p-6 text-center cursor-pointer transition-all bg-white hover:bg-tea-cream/20 group"
            >
              {uploading ? (
                <div className="flex flex-col items-center justify-center gap-2 text-gray-500">
                  <Loader2 className="w-8 h-8 text-tea-emerald animate-spin" />
                  <span className="text-xs font-bold">Đang tải ảnh từ máy tính...</span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-2 text-gray-500 group-hover:text-tea-emerald">
                  <div className="w-12 h-12 rounded-2xl bg-tea-cream flex items-center justify-center group-hover:bg-tea-soft/50 transition-colors">
                    <UploadCloud className="w-6 h-6 text-tea-emerald" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs font-bold text-gray-700 group-hover:text-tea-dark">
                      Bấm vào đây để chọn ảnh từ tệp của máy tính
                    </p>
                    <p className="text-[10px] text-gray-400">
                      Hỗ trợ PNG, JPG, WebP, GIF (Dung lượng tối đa 5MB)
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
