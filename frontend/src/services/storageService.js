import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase/config';

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'image/svg+xml'
];

const MAX_ORIGINAL_SIZE_BYTES = 10 * 1024 * 1024; // 10MB

/**
 * Nén và chuyển đổi ảnh sang WebP Blob bằng HTML5 Canvas trên trình duyệt client
 * @param {File|Blob} file 
 * @param {Object} options 
 * @returns {Promise<{blob: Blob, width: number, height: number, sizeKb: number, format: string}>}
 */
export async function optimizeImageToBlob(file, options = {}) {
  const {
    maxWidth = 1600,
    maxHeight = 1600,
    quality = 0.84
  } = options;

  if (!file) {
    throw new Error('Vui lòng chọn tệp tin hình ảnh.');
  }

  // Nếu là file SVG thì giữ nguyên không nén qua canvas
  if (file.type === 'image/svg+xml') {
    return {
      blob: file,
      format: 'svg',
      sizeKb: Math.round(file.size / 1024)
    };
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Không thể đọc tệp hình ảnh từ thiết bị.'));

    reader.onload = (event) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Tệp hình ảnh không hợp lệ hoặc bị hỏng.'));

      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Giới hạn chiều dài/chiều rộng tối đa giữ nguyên tỷ lệ khung hình
        if (width > maxWidth || height > maxHeight) {
          if (width / maxWidth > height / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          return resolve({
            blob: file,
            format: file.type || 'image/jpeg',
            sizeKb: Math.round(file.size / 1024)
          });
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Chuyển sang WebP Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              // Fallback về JPEG nếu WebP toBlob không được trình duyệt hỗ trợ
              canvas.toBlob(
                (fallbackBlob) => {
                  if (!fallbackBlob) return resolve({ blob: file, format: file.type, sizeKb: Math.round(file.size / 1024) });
                  resolve({
                    blob: fallbackBlob,
                    width,
                    height,
                    format: 'jpeg',
                    sizeKb: Math.round(fallbackBlob.size / 1024)
                  });
                },
                'image/jpeg',
                quality
              );
              return;
            }

            resolve({
              blob,
              width,
              height,
              format: 'webp',
              sizeKb: Math.round(blob.size / 1024)
            });
          },
          'image/webp',
          quality
        );
      };

      img.src = event.target.result;
    };

    reader.readAsDataURL(file);
  });
}

/**
 * Upload ảnh sản phẩm lên Firebase Storage và trả về HTTPS Download URL
 * @param {File|Blob} fileOrBlob 
 * @param {Object} params - { folder, productId, customFileName, optimize }
 * @returns {Promise<{downloadUrl: string, storagePath: string, sizeKb: number, fileName: string}>}
 */
export async function uploadProductImage(fileOrBlob, params = {}) {
  const {
    folder = 'products',
    productId = 'common',
    customFileName = null,
    optimize = true
  } = params;

  if (!fileOrBlob) {
    throw new Error('Không có tệp ảnh để tải lên.');
  }

  // 1. Validate MIME
  if (fileOrBlob.type && !ALLOWED_MIME_TYPES.includes(fileOrBlob.type)) {
    throw new Error('Định dạng ảnh không được hỗ trợ! Chỉ chấp nhận: JPEG, PNG, WebP, GIF, SVG.');
  }

  // 2. Validate Dung lượng gốc
  if (fileOrBlob.size > MAX_ORIGINAL_SIZE_BYTES) {
    throw new Error('Dung lượng ảnh vượt quá 10MB. Vui lòng chọn ảnh nhỏ hơn.');
  }

  // 3. Tối ưu nén sang WebP nếu chưa phải WebP/SVG
  let uploadBlob = fileOrBlob;
  let fileExt = 'webp';
  let finalSizeKb = Math.round(fileOrBlob.size / 1024);

  if (optimize && typeof window !== 'undefined' && fileOrBlob.type !== 'image/svg+xml') {
    try {
      const optimized = await optimizeImageToBlob(fileOrBlob);
      uploadBlob = optimized.blob;
      fileExt = optimized.format === 'jpeg' ? 'jpg' : 'webp';
      finalSizeKb = optimized.sizeKb;
    } catch (optErr) {
      console.warn('[StorageService] Không thể nén ảnh tự động, tải lên tệp gốc:', optErr.message);
    }
  }

  // 4. Tạo tên tệp an toàn (không dấu, không khoảng trắng, không ký tự đặc biệt)
  const timestamp = Date.now();
  const safeRandom = Math.random().toString(36).substring(2, 7);
  const cleanId = String(productId).replace(/[^a-zA-Z0-9_-]/g, '_');
  const safeFileName = customFileName
    ? `${customFileName.replace(/[^a-zA-Z0-9_-]/g, '_')}_${timestamp}.${fileExt}`
    : `${timestamp}_${safeRandom}.${fileExt}`;

  const storagePath = `${folder}/${cleanId}/${safeFileName}`;
  const storageRef = ref(storage, storagePath);

  const metadata = {
    contentType: uploadBlob.type || (fileExt === 'webp' ? 'image/webp' : 'image/jpeg'),
    cacheControl: 'public, max-age=31536000', // Caching 1 năm trên CDN
  };

  try {
    const snapshot = await uploadBytes(storageRef, uploadBlob, metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);

    return {
      downloadUrl,
      storagePath,
      sizeKb: finalSizeKb,
      fileName: safeFileName
    };
  } catch (err) {
    console.error('[StorageService] Lỗi tải lên Firebase Storage:', err);
    if (err.code === 'storage/unauthorized') {
      throw new Error('Bạn không có quyền tải ảnh lên (Yêu cầu tài khoản Admin đăng nhập).');
    }
    if (err.code === 'storage/bucket-not-found' || err.message?.includes('404')) {
      throw new Error('Firebase Storage Bucket chưa được kích hoạt trên Firebase Console.');
    }
    throw new Error(err.message || 'Không thể tải ảnh lên máy chủ Firebase Storage.');
  }
}

/**
 * Xóa một ảnh khỏi Firebase Storage thông qua download URL hoặc Storage Path
 * @param {string} urlOrPath 
 */
export async function deleteStorageImage(urlOrPath) {
  if (!urlOrPath || typeof urlOrPath !== 'string') return;
  
  // Chỉ xóa nếu URL thực sự thuộc Firebase Storage
  if (!urlOrPath.includes('firebasestorage.googleapis.com') && !urlOrPath.startsWith('products/')) {
    return;
  }

  try {
    let storagePath = urlOrPath;

    // Nếu là URL HTTPS của Firebase Storage, tách path ra
    if (urlOrPath.includes('/o/')) {
      const match = urlOrPath.match(/\/o\/([^?]+)/);
      if (match && match[1]) {
        storagePath = decodeURIComponent(match[1]);
      }
    }

    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
    console.log('[StorageService] Đã xóa ảnh cũ thành công:', storagePath);
  } catch (err) {
    // Không throw lỗi làm crash luồng giao diện nếu xóa ảnh cũ thất bại
    console.warn('[StorageService] Không thể xóa ảnh trên Storage:', err.message);
  }
}
