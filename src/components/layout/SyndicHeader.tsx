import { ArrowLeft, Bell } from 'lucide-react';

interface SyndicHeaderProps {
    activeItem?: string;
    onBack?: () => void;
}

export function SyndicHeader({
    activeItem = 'dashboard',
    onBack,
}: SyndicHeaderProps) {
    const getBreadcrumbs = () => {
        if (activeItem === 'residents') {
            return (
                <div className="text-sm font-medium text-muted-foreground">
                    Dashboard <span className="mx-2">/</span> Moradores <span className="mx-2">/</span> <span className="text-brand">Diretório</span>
                </div>
            );
        }
        if (activeItem === 'tickets') {
            return (
                <div className="text-sm font-medium text-muted-foreground">
                    Dashboard <span className="mx-2">/</span> <span className="text-brand">Ocorrências Inbox</span>
                </div>
            );
        }
        if (activeItem === 'reservations') {
            return (
                <div className="text-sm font-medium text-muted-foreground">
                    Dashboard <span className="mx-2">/</span> <span className="text-brand">Reservas</span>
                </div>
            );
        }
        // Default (Dashboard / Home)
        return (
            <div className="text-sm font-medium text-muted-foreground">
                Dashboard <span className="mx-2">/</span> <span className="text-brand">Visão Geral</span>
            </div>
        );
    };

    return (
        <header className="px-8 py-4 flex items-center justify-between border-b border-border bg-card shrink-0">
            {/* Left side: Breadcrumbs */}
            {getBreadcrumbs()}

            {/* Right side: Voltar ao Super Admin & Bell */}
            <div className="flex items-center gap-6">
                <button 
                    onClick={onBack}
                    className="flex items-center gap-2 text-sm font-semibold text-brand hover:text-brand/80 transition-colors bg-brand/10 px-3 py-1.5 rounded-lg"
                >
                    <ArrowLeft size={16} />
                    Voltar ao Super Admin
                </button>
                
                <button className="text-muted-foreground hover:text-foreground relative">
                    <Bell size={20} />
                    {/* Red dot to match screenshot */}
                    <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-card"></span>
                </button>
            </div>
        </header>
    );
}
