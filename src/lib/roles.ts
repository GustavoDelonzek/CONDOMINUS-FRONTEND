import type { AuthUser, UserRole } from '../contexts/AuthContext';

export const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Administrador da Plataforma',
  company_admin: 'Administradora',
  syndic: 'Síndico',
  porter: 'Portaria',
  landlord: 'Proprietário',
  resident: 'Morador',
};

export function hasAdminAccess(user: AuthUser | null) {
  return !!user?.isSuperAdmin;
}

export function destinationForRole(role: UserRole) {
  if (role === 'syndic') return '/syndic/dashboard';
  return '/select-condominium';
}
