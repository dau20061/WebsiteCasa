import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Mail, ShieldAlert, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import SEO from '../../components/SEO';
import logoImg from '../../img/logo.png';

export default function AdminLogin() {
  const { login, authError, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(location.state?.error || null);

  const from = location.state?.from?.pathname || '/admin';

  // Nếu đã đăng nhập hợp lệ, chuyển về trang đích
  if (isAuthenticated) {
    navigate(from, { replace: true });
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Đăng nhập thất bại:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        setError('Email hoặc mật khẩu không chính xác.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Đăng nhập sai quá nhiều lần. Vui lòng thử lại sau ít phút.');
      } else {
        setError(err.message || 'Không thể đăng nhập. Vui lòng kiểm tra lại kết nối.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-[#FAF9F5] px-4">
      <SEO
        title="Đăng Nhập Quản Trị Hệ Thống"
        description="Cổng đăng nhập hệ thống quản lý B2B CASA TEA với phân quyền bảo mật 4 cấp."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-tea-border shadow-tea-lg relative"
      >
        {/* Brand Header */}
        <div className="text-center space-y-3 mb-8">
          <Link to="/" className="inline-block group">
            <img
              src={logoImg}
              alt="CASA Tea & Food"
              className="h-14 sm:h-16 w-auto object-contain mx-auto transition-transform group-hover:scale-105"
            />
          </Link>
          <div>
            <h1 className="text-2xl font-extrabold text-tea-dark">CASA Admin Portal</h1>
            <p className="text-xs text-gray-500 mt-1">
              Hệ thống quản trị bảo mật phân quyền 4 role (RBAC)
            </p>
          </div>
        </div>

        {/* Error Alert */}
        {(error || authError) && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2.5">
            <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1 leading-relaxed">{error || authError}</div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4 text-xs sm:text-sm">
          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Email Quản Trị
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@casatea.vn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-tea-border text-xs focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
              Mật Khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-tea-border text-xs focus:outline-none focus:ring-2 focus:ring-tea-emerald/30 bg-white text-gray-900 placeholder-gray-400"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 px-6 rounded-xl bg-tea-primary hover:bg-tea-emerald text-white text-xs font-bold transition-all shadow-tea-sm flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Đang kiểm tra quyền...</span>
            ) : (
              <>
                <span>Đăng nhập hệ thống</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security Notice */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-gray-500">
            <ShieldCheck className="w-3.5 h-3.5 text-tea-leaf" />
            <span>Được bảo vệ bởi Cloud Firestore Security Rules</span>
          </div>
          <p className="text-[10px] text-gray-400 max-w-xs mx-auto leading-relaxed">
            Quyền hạn được xác thực từ document <code>users/&#123;uid&#125;</code> trên máy chủ. Mọi hành vi leo thang quyền client đều bị ngăn chặn tự động.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
