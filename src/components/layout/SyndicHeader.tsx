import { ArrowLeft, Bell } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { CondoSwitcher } from './CondoSwitcher';
import { useAuth } from '../../contexts/AuthContext';
import { hasAdminAccess } from '../../lib/roles';

interface SyndicHeaderProps {
    activeItem?: string;
}

export function SyndicHeader({
    activeItem = 'dashboard',
}: SyndicHeaderProps) {
    const { user } = useAuth();
    const navigate = useNavigate();

    const canBackToMaster = hasAdminAccess(user);

    function handleBackToMaster() {
        navigate('/admin/dashboard');
    }

    const getBreadcrumbs = () => {
        if (activeItem === 'residents') {
            return (
                <div className="text-sm font-medium text-muted-foreground">
                    Dashboard <span className="mx-2">/</span> Moradores <span className="mx-2">/</span> <span className="text-brand">Diretório</span>
                </div>
            );
        }
        if (activeItem === 'blocks') {
            return (
                <div className="text-sm font-medium text-muted-foreground">
                    Dashboard <span className="mx-2">/</span> <span className="text-brand">Blocos</span>
                </div>
            );
        }
        if (activeItem === 'units') {
            return (
                <div className="text-sm font-medium text-muted-foreground">
                    Dashboard <span className="mx-2">/</span> <span className="text-brand">Unidades</span>
                </div>
            );
        }
        if (activeItem === 'common-areas') {
            return (
                <div className="text-sm font-medium text-muted-foreground">
                    Dashboard <span className="mx-2">/</span> <span className="text-brand">Áreas Comuns</span>
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
        return (
            <div className="text-sm font-medium text-muted-foreground">
                Dashboard <span className="mx-2">/</span> <span className="text-brand">Visão Geral</span>
            </div>
        );
    };

    return (
        <header className="px-4 md:px-8 py-3 md:py-4 flex items-center justify-between border-b border-border bg-card shrink-0 sticky top-0 z-40">
            <div className="hidden sm:block">
                {getBreadcrumbs()}
            </div>

            <div className="sm:hidden flex items-center gap-2">
                <img
                    src="/logo.png"
                    alt="Condominus"
                    className="w-8 h-8 object-contain"
                />
                <span className="font-bold text-sm text-foreground capitalize">
                    {activeItem === 'dashboard' ? 'Visão Geral' : activeItem}
                </span>
            </div>

            <div className="flex items-center gap-3 md:gap-6">
                <CondoSwitcher />

                {canBackToMaster && (
                    <button
                        onClick={handleBackToMaster}
                        className="flex items-center gap-2 text-[10px] md:text-sm font-semibold text-brand hover:text-brand/80 transition-colors bg-brand/10 px-2 md:px-3 py-1.5 rounded-lg"
                    >
                        <ArrowLeft size={14} className="md:w-4 md:h-4" />
                        <span className="hidden xs:inline">Voltar ao Master</span>
                        <span className="xs:hidden">Voltar</span>
                    </button>
                )}

                <button className="text-muted-foreground hover:text-foreground relative p-1">
                    <Bell size={18} className="md:w-5 md:h-5" />
                    <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
                </button>
            </div>
        </header>
    );
}
