/**
 * Định nghĩa User Roles và Ma trận phân quyền RBAC
 */
export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ADMIN: 'ADMIN',
  EDITOR: 'EDITOR',
  VIEWER: 'VIEWER',
};

export const USER_STATUS = {
  ACTIVE: 'ACTIVE',
  INACTIVE: 'INACTIVE',
  SUSPENDED: 'SUSPENDED',
};

// Cấp bậc quyền hạn (Hierarchy Level)
const ROLE_LEVELS = {
  [ROLES.SUPER_ADMIN]: 4,
  [ROLES.ADMIN]: 3,
  [ROLES.EDITOR]: 2,
  [ROLES.VIEWER]: 1,
};

/**
 * Kiểm tra xem user có đạt role yêu cầu hoặc cao hơn không
 */
export function hasMinRole(userRole, requiredRole) {
  if (!userRole || !requiredRole) return false;
  const userLevel = ROLE_LEVELS[userRole] || 0;
  const reqLevel = ROLE_LEVELS[requiredRole] || 999;
  return userLevel >= reqLevel;
}

/**
 * Các hàm kiểm tra phân quyền chi tiết
 */
export function isSuperAdminRole(role) {
  return role === ROLES.SUPER_ADMIN;
}

export function isAdminRole(role) {
  return role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN;
}

export function isEditorRole(role) {
  return role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN || role === ROLES.EDITOR;
}

export function isViewerRole(role) {
  return (
    role === ROLES.SUPER_ADMIN ||
    role === ROLES.ADMIN ||
    role === ROLES.EDITOR ||
    role === ROLES.VIEWER
  );
}

// Quyền quản lý Users (Chỉ SUPER_ADMIN được tạo/xóa; ADMIN được xem/sửa hạn chế)
export function canManageUsers(role) {
  return role === ROLES.SUPER_ADMIN;
}

export function canViewUsers(role) {
  return role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN;
}

// Quyền sửa Site Settings & Global Homepage/About (Chỉ ADMIN & SUPER_ADMIN)
export function canEditSiteSettings(role) {
  return role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN;
}

// Quyền thao tác nội dung Products/News/FAQ/Machinery/Certifications (EDITOR trở lên)
export function canManageContent(role) {
  return isEditorRole(role);
}

// Quyền xóa liên hệ Contacts (Chỉ ADMIN & SUPER_ADMIN; EDITOR chỉ được xem và đổi trạng thái)
export function canDeleteContacts(role) {
  return role === ROLES.SUPER_ADMIN || role === ROLES.ADMIN;
}

/**
 * Helper hiển thị badge role đẹp mắt
 */
export function getRoleBadgeInfo(role) {
  switch (role) {
    case ROLES.SUPER_ADMIN:
      return { label: 'Super Admin', color: 'bg-purple-100 text-purple-800 border-purple-200' };
    case ROLES.ADMIN:
      return { label: 'Admin', color: 'bg-blue-100 text-blue-800 border-blue-200' };
    case ROLES.EDITOR:
      return { label: 'Editor', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' };
    case ROLES.VIEWER:
      return { label: 'Viewer', color: 'bg-gray-100 text-gray-800 border-gray-200' };
    default:
      return { label: 'Khách', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' };
  }
}
