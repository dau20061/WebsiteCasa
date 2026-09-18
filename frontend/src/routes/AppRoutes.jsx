import React from 'react';
import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import ProtectedRoute from './ProtectedRoute';

// Home page loaded synchronously for immediate First Contentful Paint
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
// Subpages lazy-loaded to keep initial bundle size minimal (< 250 KB)
const About = lazy(() => import('../pages/About'));
const MachineryCertifications = lazy(() => import('../pages/MachineryCertifications'));
const Products = lazy(() => import('../pages/Products'));
const ProductDetail = lazy(() => import('../pages/ProductDetail'));
const News = lazy(() => import('../pages/News'));
const NewsDetail = lazy(() => import('../pages/NewsDetail'));
const Contact = lazy(() => import('../pages/Contact'));
const FAQ = lazy(() => import('../pages/FAQ'));

// Admin & Security Routes (isolated in separate chunks)
const AdminLogin = lazy(() => import('../pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const Forbidden403 = lazy(() => import('../pages/admin/Forbidden403'));

function PageFallback() {
  return (
    <div className="min-h-[50vh] flex items-center justify-center">
      <div className="w-8 h-8 rounded-full border-2 border-tea-leaf/20 border-t-tea-primary dark:border-t-tea-mint animate-spin" />
    </div>
  );
}

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
    <Suspense fallback={<PageFallback />}>
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
        {/* Catch-all redirect to Home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}
