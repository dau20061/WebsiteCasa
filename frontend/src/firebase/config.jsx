import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';
import { getAnalytics, isSupported } from 'firebase/analytics';

// Cấu hình Firebase Client SDK từ Vite environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || 'AIzaSyAXZ4FEn8aKb7TXBk9y9HgKxhlWxx8sGoU',
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || 'websitecasa-15d46.firebaseapp.com',
  databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL || 'https://websitecasa-15d46-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || 'websitecasa-15d46',
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || 'websitecasa-15d46.firebasestorage.app',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '860945124907',
  appId: import.meta.env.VITE_FIREBASE_APP_ID || '1:860945124907:web:4c93a68d2d3ab9c232e46e',
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || 'G-2ZXEYRE0NP',
};

// Khởi tạo Firebase App an toàn (Singleton)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const rtdb = getDatabase(app);

// Khởi tạo Analytics an toàn (chỉ khi trình duyệt hỗ trợ)
export let analytics = null;
if (typeof window !== 'undefined') {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export default app;
