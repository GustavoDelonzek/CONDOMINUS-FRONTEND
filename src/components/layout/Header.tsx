import { LogOut } from 'lucide-react';
import { CondoSwitcher } from './CondoSwitcher';

interface HeaderProps {
    title: string;
    userName?: string;
    userRole?: string;
    userInitials?: string;
    onLogout?: () => void;
}

export function Header({
    title,
    userName = 'Gustavo Brizola',
    userRole = 'Company Admin',
    userInitials = 'GB',
    onLogout,
}: HeaderProps) {
    return (
        <header className="h-20 flex items-center justify-between px-10 bg-transparent border-b border-border shrink-0">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>

            <div className="flex items-center gap-4">
                <CondoSwitcher />
                <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userRole}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-brand/10 border border-brand/20 flex items-center justify-center text-brand font-bold text-sm">
                    {userInitials}
                </div>
                {onLogout && (
                    <button
                        onClick={onLogout}
                        title="Sair"
                        className="text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                    >
                        <LogOut size={18} />
                    </button>
                )}
            </div>
        </header>
    );
}
