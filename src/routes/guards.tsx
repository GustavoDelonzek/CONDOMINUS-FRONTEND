import type { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCondo } from '../contexts/CondoContext';
import { FullScreenLoading } from '../components/ui/FullScreenLoading';
import { hasAdminAccess } from '../lib/roles';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullScreenLoading />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  return <>{children}</>;
}

export function RequireAdminAccess({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) return <FullScreenLoading />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!hasAdminAccess(user)) {
    return <Navigate to="/select-condominium" replace />;
  }
  return <>{children}</>;
}

export function RequireSyndicAccess({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const { activeCondoId, activeMembership } = useCondo();
  const location = useLocation();

  if (isLoading) return <FullScreenLoading />;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (!activeCondoId) {
    return <Navigate to="/select-condominium" replace />;
  }
  if (activeMembership?.role !== 'syndic') {
    return <Navigate to="/select-condominium" replace />;
  }
  return <>{children}</>;
}
