import React from 'react';
import { AuthProvider } from '../context/AuthContext';
import { Outlet } from 'react-router-dom';

/**
 * AdminLayout encapsulates Firebase Authentication context.
 * This guarantees Firebase SDK (660KB+) is completely isolated
 * and only downloaded when an admin visits /admin routes,
 * keeping the public mobile homepage bundle ultralight (< 200KB).
 */
export default function AdminLayout() {
  return (
    <AuthProvider>
      <Outlet />
    </AuthProvider>
  );
}

