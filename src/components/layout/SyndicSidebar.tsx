import { Home, Users, PieChart, Wrench, Calendar, LogOut } from 'lucide-react';

interface SyndicSidebarProps {
  activeItem: string;
  onNavigate?: (id: string) => void;
}

const topMenuItems = [
  { id: 'dashboard', icon: Home, label: 'Início' },
  { id: 'residents', icon: Users, label: 'Moradores' },
  { id: 'financial', icon: PieChart, label: 'Financeiro' },
  { id: 'tickets', icon: Wrench, label: 'Ocorrências' },
  { id: 'reservations', icon: Calendar, label: 'Reservas' },
];

export function SyndicSidebar({ activeItem, onNavigate }: SyndicSidebarProps) {
  return (
    <aside className="w-16 h-screen flex flex-col items-center py-6 bg-sidebar border-r border-sidebar-border shrink-0">
      {/* Logo */}
      <div className="mb-8">
        <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-brand">
          <span className="text-white font-bold text-sm">CD</span>
        </div>
      </div>

      {/* Primary Navigation */}
      <nav className="flex-1 flex flex-col items-center gap-1 w-full">
        {topMenuItems.map((item) => {
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

      {/* Bottom Actions */}
      <div className="mt-auto flex flex-col items-center gap-1 w-full pt-4 border-t border-sidebar-border/50">
        <button
          title="Sair"
          onClick={() => console.log('Logout')}
          className="
            relative w-10 h-10 rounded-lg flex items-center justify-center
            transition-all duration-150 group text-sidebar-icon hover:bg-sidebar-accent hover:text-red-500
          "
        >
          <LogOut size={20} strokeWidth={1.75} />
          
          {/* Tooltip */}
          <span className="
            pointer-events-none absolute left-full ml-3 px-2.5 py-1.5
            bg-foreground text-background text-xs rounded-lg font-medium
            whitespace-nowrap opacity-0 group-hover:opacity-100
            transition-opacity duration-150 shadow-lg z-50
          ">
            Sair
          </span>
        </button>
      </div>
    </aside>
  );
}
