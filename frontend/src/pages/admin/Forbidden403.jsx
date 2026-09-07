import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft, Home, ShieldX } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getRoleBadgeInfo } from '../../utils/permissions';
import SEO from '../../components/SEO';

export default function Forbidden403() {
  const { role, userProfile } = useAuth();
  const badgeInfo = getRoleBadgeInfo(role);

  return (
    <div className="min-h-screen pt-28 pb-16 flex items-center justify-center bg-[#FAF9F5] px-4">
      <SEO
        title="403 - Quyền Truy Cập Bị Từ Chối"
        description="Bạn không có đủ thẩm quyền để thực hiện thao tác này."
      />

      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-tea-border shadow-tea-lg text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-red-50 border border-red-200 text-red-600 flex items-center justify-center mx-auto shadow-sm">
          <ShieldX className="w-9 h-9" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-black tracking-widest text-red-600 uppercase font-mono">
            MÃ LỖI: 403 FORBIDDEN
          </span>
          <h1 className="text-2xl font-extrabold text-tea-dark">
            Truy Cập Bị Giới Hạn Quyền
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 leading-relaxed max-w-sm mx-auto">
            Hệ thống phân quyền Firebase Security Rules đã từ chối yêu cầu này. Tài khoản của bạn hiện tại không đủ đặc quyền để truy cập khu vực này.
          </p>
        </div>

        {/* Current role display */}
        <div className="p-4 rounded-2xl bg-tea-cream border border-tea-border text-xs text-gray-600 space-y-1">
          <div className="flex items-center justify-between">
            <span>Tài khoản:</span>
            <strong className="text-tea-dark">{userProfile?.email || 'N/A'}</strong>
          </div>
          <div className="flex items-center justify-between pt-1">
            <span>Vai trò hiện tại:</span>
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-[11px] border ${badgeInfo.color}`}>
              {badgeInfo.label}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Link
            to="/admin"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-tea-primary hover:bg-tea-emerald text-white text-xs font-bold transition-all shadow-tea-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Về Dashboard Admin</span>
          </Link>

          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-tea-mist hover:bg-tea-soft text-tea-primary text-xs font-bold transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Về Trang Chủ Public</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
