import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Leaf } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { currentUser, userProfile, loading, authError } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF9F5]">
        <div className="w-12 h-12 rounded-2xl bg-tea-primary flex items-center justify-center text-white shadow-tea-md animate-pulse">
          <Leaf className="w-6 h-6 text-tea-mint" />
        </div>
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
