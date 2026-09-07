import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from './config';

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Upload hình ảnh an toàn lên Firebase Storage
 * Thực hiện client-side validation trước khi gửi sang Storage Rules
 */
export async function uploadImageFile(folder, file, customFileName = null) {
  if (!file) {
    throw new Error('Vui lòng chọn file để tải lên.');
  }

  // 1. Kiểm tra MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Định dạng file không hợp lệ! Chỉ chấp nhận: JPEG, PNG, WebP.');
  }

  // 2. Kiểm tra dung lượng
  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Dung lượng file vượt quá giới hạn 5MB cho phép.');
  }

  // 3. Đặt tên an toàn tránh trùng lặp
  const extension = file.name.split('.').pop();
  const safeName = customFileName
    ? `${customFileName}.${extension}`
    : `${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${extension}`;

  const storageRef = ref(storage, `${folder}/${safeName}`);
  const metadata = {
    contentType: file.type,
  };

  const snapshot = await uploadBytes(storageRef, file, metadata);
  const downloadUrl = await getDownloadURL(snapshot.ref);

  return {
    downloadUrl,
    fullPath: snapshot.ref.fullPath,
    fileName: safeName,
  };
}

/**
 * Xóa file trên Storage
 */
export async function deleteStorageFile(fullPath) {
  if (!fullPath) return;
  const storageRef = ref(storage, fullPath);
  await deleteObject(storageRef);
}
