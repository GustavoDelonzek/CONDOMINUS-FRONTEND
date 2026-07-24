import { Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardAdminCompany } from './pages/DashboardAdminCompany';
import { Condominiums } from './pages/admin/Condominiums';
import { AdminUsers } from './pages/admin/AdminUsers';
import { Documents } from './pages/admin/Documents';
import { Billing } from './pages/admin/Billing';
import { Settings } from './pages/admin/Settings';
import { SyndicSidebar } from './components/layout/SyndicSidebar';
import { SyndicHeader } from './components/layout/SyndicHeader';
import { SyndicDashboard } from './pages/SyndicDashboard';
import { Residents } from './pages/syndic/Residents';
import { FinancialTransparency } from './pages/syndic/FinancialTransparency';
import { TicketsInbox } from './pages/syndic/TicketsInbox';
import { Reservations } from './pages/syndic/Reservations';

function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeItem = location.pathname.split('/').pop() || 'dashboard';

  const handleNavigate = (id: string) => {
    if (id === 'dashboard') navigate('/admin/dashboard');
    if (id === 'condos') navigate('/admin/condos');
    if (id === 'users') navigate('/admin/users');
    if (id === 'documents') navigate('/admin/documents');
    if (id === 'billing') navigate('/admin/billing');
    if (id === 'settings') navigate('/admin/settings');
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
        <Header title={adminPageTitles[activeItem] ?? 'Dashboard'} />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="dashboard" element={<DashboardAdminCompany />} />
            <Route path="condos" element={<Condominiums />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="documents" element={<Documents />} />
            <Route path="billing" element={<Billing />} />
            <Route path="settings" element={<Settings />} />
            {/* fallback within admin */}
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
  const activeItem = location.pathname.split('/').pop() || 'dashboard';

  const handleNavigate = (id: string) => {
    if (id === 'dashboard') navigate('/syndic/dashboard');
    if (id === 'residents') navigate('/syndic/residents');
    if (id === 'financial') navigate('/syndic/financial');
    if (id === 'tickets') navigate('/syndic/tickets');
    if (id === 'reservations') navigate('/syndic/reservations');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-background font-sans">
      <SyndicSidebar activeItem={activeItem} onNavigate={handleNavigate} />
      <main className="flex-1 flex flex-col overflow-hidden pb-16 md:pb-0">
        <SyndicHeader activeItem={activeItem} onBack={() => navigate('/admin/dashboard')} />
        <div className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="dashboard" element={<SyndicDashboard />} />
            <Route path="residents" element={<Residents />} />
            <Route path="financial" element={<FinancialTransparency />} />
            <Route path="tickets" element={<TicketsInbox />} />
            <Route path="reservations" element={<Reservations />} />
            {/* fallback within syndic */}
            <Route path="*" element={<Navigate to="dashboard" replace />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/syndic/*" element={<SyndicLayout />} />
        {/* Default redirect to admin for now */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
}

export default App;