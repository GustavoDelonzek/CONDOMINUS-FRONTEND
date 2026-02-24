import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DashboardAdminCompany } from './pages/DashboardAdminCompany';

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');

  const pageTitles: Record<string, string> = {
    dashboard: 'Dashboard',
    condos: 'Condominiums',
    users: 'Users',
    documents: 'Documents',
    billing: 'Billing',
    settings: 'Settings',
  };

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar activeItem={activeItem} onNavigate={setActiveItem} />

      <main className="flex-1 flex flex-col overflow-hidden">
        <Header title={pageTitles[activeItem] ?? 'Dashboard'} />

        <div className="flex-1 overflow-y-auto">
          {activeItem === 'dashboard' && <DashboardAdminCompany />}
        </div>
      </main>
    </div>
  );
}

export default App;