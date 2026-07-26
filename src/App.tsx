import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardAdminCompany } from './pages/DashboardAdminCompany';
import { Condominiums } from './pages/admin/Condominiums';
import { CondominiumDetail } from './pages/admin/CondominiumDetail';
import { AdminUsers } from './pages/admin/AdminUsers';
import { Documents } from './pages/admin/Documents';
import { Billing } from './pages/admin/Billing';
import { Settings } from './pages/admin/Settings';
import { SyndicSidebar } from './components/layout/SyndicSidebar';
import { SyndicHeader } from './components/layout/SyndicHeader';
import { SyndicDashboard } from './pages/SyndicDashboard';
import { Residents } from './pages/syndic/Residents';
import { Blocks } from './pages/syndic/Blocks';
import { CommonAreas } from './pages/syndic/CommonAreas';
import { Units } from './pages/syndic/Units';
import { FinancialTransparency } from './pages/syndic/FinancialTransparency';
import { TicketsInbox } from './pages/syndic/TicketsInbox';
import { Reservations } from './pages/syndic/Reservations';
import { Login } from './pages/auth/Login';
import { SelectCondominium } from './pages/auth/SelectCondominium';
import { RequireAuth, RequireAdminAccess, RequireSyndicAccess } from './routes/guards';
import { useAuth } from './contexts/AuthContext';
import { useCondo } from './contexts/CondoContext';
import { FullScreenLoading } from './components/ui/FullScreenLoading';
import { ROLE_LABELS, destinationForRole, hasAdminAccess } from './lib/roles';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const activeItem = location.pathname.split('/')[2] || 'dashboard';

  const handleNavigate = (id: string) => {
    if (id === 'dashboard') navigate('/admin/dashboard');
    if (id === 'condos') navigate('/admin/condos');
    if (id === 'users') navigate('/admin/users');
    if (id === 'documents') navigate('/admin/documents');
    if (id === 'billing') navigate('/admin/billing');
    if (id === 'settings') navigate('/admin/settings');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  const adminPageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    condos: 'Condominiums',
    users: 'Users',
    documents: 'Documents',
    billing: 'Billing',
    settings: 'Settings',
  };

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar activeItem={activeItem} onNavigate={handleNavigate} />
      <main className="flex-1 flex flex-col overflow-hidden">
        <Header
          title={adminPageTitles[activeItem] ?? 'Dashboard'}
          userName={user?.name}
          userRole={ROLE_LABELS.super_admin}
          userInitials={user?.initials}
          onLogout={handleLogout}
        />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="dashboard" element={<DashboardAdminCompany />} />
            <Route path="condos" element={<Condominiums />} />
            <Route path="condos/:id" element={<CondominiumDetail />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="documents" element={<Documents />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function SyndicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();
  const activeItem = location.pathname.split('/').pop() || 'dashboard';

  const handleNavigate = (id: string) => {
    if (id === 'dashboard') navigate('/syndic/dashboard');
    if (id === 'residents') navigate('/syndic/residents');
    if (id === 'blocks') navigate('/syndic/blocks');
    if (id === 'common-areas') navigate('/syndic/common-areas');
    if (id === 'units') navigate('/syndic/units');
    if (id === 'financial') navigate('/syndic/financial');
    if (id === 'tickets') navigate('/syndic/tickets');
    if (id === 'reservations') navigate('/syndic/reservations');
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login', { replace: true });
  };

  return (
    <div className="flex flex-col md:flex-row h-screen overflow-hidden bg-background font-sans">
      <SyndicSidebar activeItem={activeItem} onNavigate={handleNavigate} onLogout={handleLogout} />
      <main className="flex-1 min-h-0 flex flex-col overflow-hidden pb-16 md:pb-0">
        <SyndicHeader activeItem={activeItem} />
        <div className="flex-1 min-h-0 overflow-y-auto">
          <Routes>
            <Route path="dashboard" element={<SyndicDashboard />} />
            <Route path="residents" element={<Residents />} />
            <Route path="blocks" element={<Blocks />} />
            <Route path="common-areas" element={<CommonAreas />} />
            <Route path="units" element={<Units />} />
            <Route path="financial" element={<FinancialTransparency />} />
            <Route path="tickets" element={<TicketsInbox />} />
            <Route path="reservations" element={<Reservations />} />
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function RootRedirect() {
  const { isAuthenticated, isLoading, user, memberships } = useAuth();
  const { activeCondoId, activeMembership } = useCondo();

  if (isLoading) {
    return <FullScreenLoading />;
  }
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasSyndicMembership = memberships.some((m) => m.role === 'syndic');
  if (hasAdminAccess(user) && !hasSyndicMembership) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  if (!activeCondoId) {
    return <Navigate to="/select-condominium" replace />;
  }
  return <Navigate to={activeMembership ? destinationForRole(activeMembership.role) : '/select-condominium'} replace />;
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/select-condominium"
        element={
          <RequireAuth>
            <SelectCondominium />
          </RequireAuth>
        }
      />
      <Route
        path="/admin/*"
        element={
          <RequireAdminAccess>
            <AdminLayout />
          </RequireAdminAccess>
        }
      />
      <Route
        path="/syndic/*"
        element={
          <RequireSyndicAccess>
            <SyndicLayout />
          </RequireSyndicAccess>
        }
      />
      <Route path="/" element={<RootRedirect />} />
    </Routes>
  );
}

export default App;
