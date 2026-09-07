import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasMinRole } from '../utils/permissions';

export default function RoleGuard({ requiredRole, children }) {
  const { role, loading } = useAuth();

  if (loading) {
    return null;
  }

  // Kiểm tra cấp bậc role
  const isAllowed = hasMinRole(role, requiredRole);

  if (!isAllowed) {
    return <Navigate to="/403" replace />;
  }

  return children ? children : <Outlet />;
}
