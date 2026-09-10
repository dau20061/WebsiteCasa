import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logoImg from '../img/logo.png';

export default function ProtectedRoute({ children }) {
  const { currentUser, userProfile, loading, authError } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
        <img
          src={logoImg}
          alt="CASA Tea & Food"
          className="h-14 w-auto object-contain animate-pulse mb-3"
        />
        <p className="mt-4 text-xs font-bold text-gray-500 uppercase tracking-wider">
          Đang xác thực bảo mật...
        </p>
      </div>
    );
  }

  // Chưa đăng nhập hoặc tài khoản không hợp lệ
  if (!currentUser || !userProfile) {
    return <Navigate to="/admin/login" state={{ from: location, error: authError }} replace />;
  }

  return children ? children : <Outlet />;
}
