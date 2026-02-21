import { LayoutDashboard, Users, CreditCard, FileText, Layers, Settings } from 'lucide-react';

interface SidebarProps {
  activeItem: string;
  onNavigate?: (id: string) => void;
}

const menuItems = [
  { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'condos', icon: Layers, label: 'Condominiums' },
  { id: 'users', icon: Users, label: 'Users' },
  { id: 'documents', icon: FileText, label: 'Documents' },
  { id: 'billing', icon: CreditCard, label: 'Billing' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

export function Sidebar({ activeItem, onNavigate }: SidebarProps) {
  return (
    <aside className="w-16 h-screen flex flex-col items-center py-6 bg-sidebar border-r border-sidebar-border shrink-0">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand">
          <Layers size={20} className="text-white" />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-1">
        {menuItems.map((item) => {
          const isActive = item.id === activeItem;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              title={item.label}
              onClick={() => onNavigate?.(item.id)}
              className={`
                relative w-10 h-10 rounded-lg flex items-center justify-center
                transition-all duration-150 group
                ${isActive
                  ? 'bg-sidebar-active-bg text-sidebar-active-fg'
                  : 'text-sidebar-icon hover:bg-sidebar-accent'
                }
              `}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />

              {/* Tooltip */}
              <span className="
                pointer-events-none absolute left-full ml-3 px-2.5 py-1.5
                bg-foreground text-background text-xs rounded-lg font-medium
                whitespace-nowrap opacity-0 group-hover:opacity-100
                transition-opacity duration-150 shadow-lg z-50
              ">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>
    </aside>
  );
}
