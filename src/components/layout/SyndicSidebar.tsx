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
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-16 h-screen flex-col items-center py-6 bg-sidebar border-r border-sidebar-border shrink-0 sticky top-0">
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

    {/* Mobile Bottom Navigation */}
      <nav className="flex md:hidden fixed bottom-0 left-0 right-0 h-16 bg-sidebar border-t border-sidebar-border items-center justify-around px-2 z-50">
        {topMenuItems.map((item) => {
          const isActive = item.id === activeItem;
          const Icon = item.icon;

          return (
            <button
              key={item.id}
              onClick={() => onNavigate?.(item.id)}
              className={`
                flex flex-col items-center justify-center gap-1 flex-1 h-full
                transition-all duration-150
                ${isActive
                  ? 'text-sidebar-active-fg'
                  : 'text-sidebar-icon'
                }
              `}
            >
              <Icon size={20} strokeWidth={isActive ? 2.5 : 1.75} />
              <span className="text-[10px] font-medium leading-none">{item.label}</span>
              {isActive && (
                <span className="absolute bottom-0 w-8 h-1 bg-brand rounded-t-full shadow-[0_-1px_4px_rgba(49,87,242,0.4)]" />
              )}
            </button>
          );
        })}
      </nav>
    </>
  );
}
