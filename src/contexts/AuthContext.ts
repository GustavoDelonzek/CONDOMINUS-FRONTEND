import { createContext, useContext } from 'react';

// Papéis conforme EnumRoleUser do backend (docs/functional-scope.md §1).
export type UserRole = 'super_admin' | 'company_admin' | 'syndic' | 'porter' | 'landlord' | 'resident';

export interface MembershipUnit {
  id: string;
  number: string;
  floor: string;
}

export interface Membership {
  id: string;
  role: UserRole;
  condominiumId: string;
  condominiumName: string;
  unit: MembershipUnit | null;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  isSuperAdmin: boolean;
}

export interface AuthContextValue {
  user: AuthUser | null;
  memberships: Membership[];
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de <AuthProvider>');
  return ctx;
}
