import React, { createContext, useContext, useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase/config';
import { getUserProfile, loginWithEmail, logoutUser } from '../firebase/auth';
import { ROLES, USER_STATUS } from '../utils/permissions';

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Lắng nghe thay đổi trạng thái đăng nhập Firebase Auth hoặc RTDB
  useEffect(() => {
    // 1. Kiểm tra session RTDB trước
    const cachedRtdbUser = sessionStorage.getItem('casa_rtdb_user');
    if (cachedRtdbUser) {
      try {
        const parsed = JSON.parse(cachedRtdbUser);
        if (parsed?.status === USER_STATUS.ACTIVE) {
          setCurrentUser(parsed);
          setUserProfile(parsed);
          setRole(parsed.role || ROLES.SUPER_ADMIN);
          setLoading(false);
          return;
        }
      } catch (e) {
        sessionStorage.removeItem('casa_rtdb_user');
      }
    }

    // 2. Lắng nghe Firebase Auth chuẩn
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setAuthError(null);

      if (user) {
        try {
          // Lấy profile từ Firestore hoặc Realtime Database users/{uid}
          const profile = await getUserProfile(user.uid);

          if (!profile) {
            // Trường hợp user có Auth nhưng chưa có Document
            setCurrentUser(user);
            setUserProfile(null);
            setRole(null);
            setAuthError('Tài khoản chưa được phân quyền trong hệ thống. Vui lòng liên hệ SUPER_ADMIN.');
          } else if (profile.status !== USER_STATUS.ACTIVE) {
            // Tài khoản bị khóa (INACTIVE / SUSPENDED)
            await logoutUser();
            setCurrentUser(null);
            setUserProfile(null);
            setRole(null);
            setAuthError('Tài khoản của bạn đang bị vô hiệu hóa hoặc tạm khóa.');
          } else {
            setCurrentUser(user);
            setUserProfile(profile);
            setRole(profile.role || ROLES.VIEWER);
          }
        } catch (error) {
          console.error('Lỗi khi tải profile người dùng:', error);
          setAuthError('Không thể đồng bộ hồ sơ quyền hạn: ' + error.message);
        }
      } else {
        // Chỉ reset nếu không có session RTDB
        if (!sessionStorage.getItem('casa_rtdb_user')) {
          setCurrentUser(null);
          setUserProfile(null);
          setRole(null);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    const resultUser = await loginWithEmail(email, password);

    if (resultUser?.isRtdbAuth) {
      setCurrentUser(resultUser);
      setUserProfile(resultUser);
      setRole(resultUser.role || ROLES.SUPER_ADMIN);
    }
    return resultUser;
  };

  const logout = async () => {
    return await logoutUser();
  };

  const refreshProfile = async () => {
    if (currentUser?.uid) {
      const profile = await getUserProfile(currentUser.uid);
      if (profile) {
        setUserProfile(profile);
        setRole(profile.role);
      }
    }
  };

  const value = {
    currentUser,
    userProfile,
    role,
    loading,
    authError,
    isAuthenticated: !!currentUser && !!userProfile && userProfile.status === USER_STATUS.ACTIVE,
    login,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
