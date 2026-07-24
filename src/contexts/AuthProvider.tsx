import { useEffect, useState, type ReactNode } from 'react';
import { AuthContext, type AuthUser, type Membership, type UserRole } from './AuthContext';
import * as authService from '../services/authService';
import type { BackendMembership, BackendUser } from '../services/authService';
import { ApiError } from '../services/apiClient';
import { TOKEN_STORAGE_KEY, ACTIVE_CONDO_STORAGE_KEY } from '../lib/storageKeys';

function mapUser(raw: BackendUser): AuthUser {
  const initials =
    raw.full_name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? '')
      .join('') || 'US';

  return { id: raw.id, name: raw.full_name, email: raw.email, initials, isSuperAdmin: raw.is_super_admin };
}

function mapMemberships(raw: BackendMembership[]): Membership[] {
  return raw.map((m) => ({
    id: m.id,
    role: m.role as UserRole,
    condominiumId: m.condominium.id,
    condominiumName: m.condominium.name,
    unit: m.unit,
  }));
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_STORAGE_KEY));
  const [user, setUser] = useState<AuthUser | null>(null);
  const [memberships, setMemberships] = useState<Membership[]>([]);
  const [isLoading, setIsLoading] = useState(!!token);

  // Restaura a sessão a partir do token salvo, chamando GET /v1/me uma única vez ao montar.
  // Se o token estiver expirado/inválido (401), a sessão é descartada e o usuário volta pro login.
  useEffect(() => {
    if (!token) {
      setIsLoading(false);
      return;
    }
    let cancelled = false;
    authService
      .me(token)
      .then((data) => {
        if (cancelled) return;
        setUser(mapUser(data));
        setMemberships(mapMemberships(data.memberships));
      })
      .catch(() => {
        if (cancelled) return;
        setToken(null);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(email: string, password: string) {
    const loginData = await authService.login(email, password);
    // POST /v1/login não devolve memberships (docs/auth-routes.md) — busca em seguida via /v1/me.
    const meData = await authService.me(loginData.token);

    setToken(loginData.token);
    localStorage.setItem(TOKEN_STORAGE_KEY, loginData.token);
    setUser(mapUser(meData));
    setMemberships(mapMemberships(meData.memberships));
  }

  async function logout() {
    if (token) {
      try {
        await authService.logout(token);
      } catch (err) {
        // Token já expirado/inválido no servidor não deve impedir o logout local.
        if (!(err instanceof ApiError)) throw err;
      }
    }
    setToken(null);
    setUser(null);
    setMemberships([]);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
    localStorage.removeItem(ACTIVE_CONDO_STORAGE_KEY);
  }

  return (
    <AuthContext.Provider value={{ user, memberships, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
