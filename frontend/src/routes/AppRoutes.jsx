import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';

import Home from '../pages/Home';
import About from '../pages/About';
import MachineryCertifications from '../pages/MachineryCertifications';
import Products from '../pages/Products';
import ProductDetail from '../pages/ProductDetail';
import News from '../pages/News';
import NewsDetail from '../pages/NewsDetail';
import Contact from '../pages/Contact';
import FAQ from '../pages/FAQ';

// Admin & Security Routes
import AdminLogin from '../pages/admin/AdminLogin';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Forbidden403 from '../pages/admin/Forbidden403';
import ProtectedRoute from './ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Layout */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="about" element={<About />} />
        <Route path="machinery-certifications" element={<MachineryCertifications />} />
        <Route path="products" element={<Products />} />
        <Route path="products/:id" element={<ProductDetail />} />
        <Route path="news" element={<News />} />
        <Route path="news/:slug" element={<NewsDetail />} />
        <Route path="contact" element={<Contact />} />
        <Route path="faq" element={<FAQ />} />
        <Route path="403" element={<Forbidden403 />} />
      </Route>

      {/* Admin Authentication & Portal */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Catch-all redirect to Home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
