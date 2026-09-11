import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/svg+xml'];
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

/**
 * Upload hình ảnh an toàn lên Firebase Storage (có timeout 2.5s tránh treo luồng)
 */
export async function uploadImageFile(folder, file, customFileName = null) {
  if (!file) {
    throw new Error('Vui lòng chọn file để tải lên.');
  }

  // 1. Kiểm tra MIME type
  if (file.type && !ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Định dạng file không hợp lệ! Chỉ chấp nhận: JPEG, PNG, WebP, GIF, SVG.');
  }

  // 2. Kiểm tra dung lượng
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Dung lượng file vượt quá giới hạn 10MB cho phép.');
  }

  // 3. Đặt tên an toàn tránh trùng lặp
  const extension = (file.name || 'image.webp').split('.').pop();
  const safeName = customFileName
    ? `${customFileName}.${extension}`
    : `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;

  const storageRef = ref(storage, `${folder}/${safeName}`);
  const metadata = {
    contentType: file.type || 'image/webp',
  };

  // Wrap với Timeout 2.5 giây để tránh Firebase Storage SDK retry vô tận khi Storage bucket 404
  const uploadOperation = (async () => {
    const snapshot = await uploadBytes(storageRef, file, metadata);
    const downloadUrl = await getDownloadURL(snapshot.ref);
    return {
      downloadUrl,
      fullPath: snapshot.ref.fullPath,
      fileName: safeName,
    };
  })();

  const timeoutOperation = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Firebase Storage timeout (Storage bucket chưa sẵn sàng).')), 2500)
  );

  return await Promise.race([uploadOperation, timeoutOperation]);
}

/**
 * Xóa file trên Storage (an toàn không throw lỗi crash app)
 */
export async function deleteStorageFile(fullPath) {
  if (!fullPath) return;
  try {
    const storageRef = ref(storage, fullPath);
    await Promise.race([
      deleteObject(storageRef),
      new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout xóa file')), 2000))
    ]);
  } catch (err) {
    console.warn('[Storage] Không thể xóa file trên storage:', err.message);
  }
}