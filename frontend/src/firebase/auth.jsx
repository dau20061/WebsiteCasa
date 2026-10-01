import {
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
} from 'firebase/auth';
import { doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, get } from 'firebase/database';
import { auth, db, rtdb } from './config';

/**
 * Đăng nhập bằng email và mật khẩu
 * Hỗ trợ cả Firebase Authentication và Realtime Database seed (nodes user & users)
 */
export async function loginWithEmail(email, password) {
  const cleanEmail = email ? email.trim().toLowerCase() : '';
  const cleanPass = password ? String(password).trim() : '';

  try {
    // 1. Thử đăng nhập chuẩn qua Firebase Auth
    const credential = await signInWithEmailAndPassword(auth, cleanEmail, password);
    return credential.user;
  } catch (authErr) {
    // 2. Nếu Firebase Auth thất bại, kiểm tra trực tiếp trong Realtime Database
    try {
      // Hàm lấy data từ node RTDB qua SDK hoặc REST API
      const fetchRtdbNode = async (nodeName) => {
        try {
          const snapshot = await get(ref(rtdb, nodeName));
          if (snapshot.exists()) return snapshot.val();
        } catch (_) {}

        // Fallback qua REST API trực tiếp nếu SDK chưa kết nối xong
        try {
          const res = await fetch(`https://websitecasa-15d46-default-rtdb.asia-southeast1.firebasedatabase.app/${nodeName}.json`);
          if (res.ok) return await res.json();
        } catch (_) {}

        return null;
      };

      // Thử cả 2 node "user" (số ít như trên hình) và "users" (số nhiều)
      const usersData = (await fetchRtdbNode('user')) || (await fetchRtdbNode('users'));

      if (usersData) {
        // Tìm user có email khớp (hỗ trợ cả admin@casate.com và admin@casatea...)
        const matchedKey = Object.keys(usersData).find((k) => {
          const uEmail = usersData[k]?.email?.toLowerCase().trim();
          if (!uEmail) return false;
          if (uEmail === cleanEmail) return true;
          // Dự phòng nếu user gõ casatea thay vì casate
          if (cleanEmail.includes('admin@casate') && uEmail.includes('admin@casate')) return true;
          return false;
        });

        if (matchedKey) {
          const u = usersData[matchedKey];
          // So khớp mật khẩu (hỗ trợ cả number 123456 lẫn string "123456")
          if (u.password !== undefined && String(u.password).trim() === cleanPass) {
            const rtdbUser = {
              uid: u.uid || matchedKey,
              email: u.email,
              displayName: u.displayName || 'Super Admin',
              role: u.role || 'SUPER_ADMIN',
              status: u.status || 'ACTIVE',
              isRtdbAuth: true,
            };
            sessionStorage.setItem('casa_rtdb_user', JSON.stringify(rtdbUser));
            return rtdbUser;
          } else if (u.password !== undefined) {
            const err = new Error('Mật khẩu không chính xác.');
            err.code = 'auth/wrong-password';
            throw err;
          }
        }
      }
    } catch (rtdbErr) {
      if (rtdbErr.code === 'auth/wrong-password') throw rtdbErr;
      console.warn('Realtime Database auth check:', rtdbErr);
    }

    // Nếu không khớp cả Realtime Database, ném lỗi Auth ban đầu
    throw authErr;
  }
}

/**
 * Đăng xuất khỏi hệ thống
 */
export async function logoutUser() {
  sessionStorage.removeItem('casa_rtdb_user');
  return await signOut(auth);
}

/**
 * Gửi email đặt lại mật khẩu
 */
export async function resetPassword(email) {
  return await sendPasswordResetEmail(auth, email);
}

/**
 * Lấy document profile của user từ Firestore hoặc Realtime Database
 */
export async function getUserProfile(uid) {
  if (!uid) return null;

  // 1. Kiểm tra trong Cloud Firestore trước
  try {
    const userDocRef = doc(db, 'users', uid);
    const snapshot = await getDoc(userDocRef);
    if (snapshot.exists()) {
      return {
        uid: snapshot.id,
        ...snapshot.data(),
      };
    }
  } catch (err) {
    console.warn('Firestore getUserProfile:', err);
  }

  // 2. Kiểm tra trong Realtime Database (cả node user và users)
  try {
    const checkRtdb = async (nodeName) => {
      try {
        const snap = await get(ref(rtdb, `${nodeName}/${uid}`));
        if (snap.exists()) return snap.val();
        const allSnap = await get(ref(rtdb, nodeName));
        if (allSnap.exists()) {
          const val = allSnap.val();
          if (val[uid]) return val[uid];
          return Object.values(val).find((u) => u && (u.uid === uid || u.email === uid));
        }
      } catch (_) {}

      // Fallback REST
      try {
        const res = await fetch(`https://websitecasa-15d46-default-rtdb.asia-southeast1.firebasedatabase.app/${nodeName}.json`);
        if (res.ok) {
          const val = await res.json();
          if (val && val[uid]) return val[uid];
          if (val) return Object.values(val).find((u) => u && (u.uid === uid || u.email === uid));
        }
      } catch (_) {}

      return null;
    };

    const foundUser = (await checkRtdb('user')) || (await checkRtdb('users'));
    if (foundUser) {
      return {
        uid: foundUser.uid || uid,
        ...foundUser,
      };
    }
  } catch (rtdbErr) {
    console.warn('RTDB getUserProfile:', rtdbErr);
  }

  // 3. Kiểm tra sessionStorage dự phòng
  const cached = sessionStorage.getItem('casa_rtdb_user');
  if (cached) {
    try {
      const parsed = JSON.parse(cached);
      if (parsed.uid === uid) return parsed;
    } catch (_) {}
  }

  return null;
}

/**
 * User tự cập nhật thông tin cá nhân (displayName, phone, photoURL)
 * Chặn mọi field nhạy cảm ở client trước khi gửi sang Firestore Rules
 */
export async function updateSelfProfile(uid, profileData) {
  // Whitelist chỉ cho phép update các field an toàn
  const safeData = {
    displayName: profileData.displayName || '',
    phone: profileData.phone || '',
    photoURL: profileData.photoURL || '',
    updatedAt: serverTimestamp(),
  };

  const userDocRef = doc(db, 'users', uid);
  await updateDoc(userDocRef, safeData);
}
