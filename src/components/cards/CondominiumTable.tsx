import { Eye } from 'lucide-react';
import type { BackendCondominium } from '../../services/condominiumService';
import { InitialsAvatar } from '../ui/InitialsAvatar';
import { initialsFor, colorFor } from '../../lib/avatar';
import { formatDate } from '../../lib/format';

interface CondominiumTableProps {
    data: BackendCondominium[];
    currentPage: number;
    lastPage: number;
    total: number;
    onPrev: () => void;
    onNext: () => void;
    onView: (id: string) => void;
    onAddCondominium?: () => void;
    canCreate: boolean;
    search: string;
    onSearchChange: (value: string) => void;
}

export function CondominiumTable({
    data,
    currentPage,
    lastPage,
    total,
    onPrev,
    onNext,
    onView,
    onAddCondominium,
    canCreate,
    search,
    onSearchChange,
}: CondominiumTableProps) {
    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between px-6 py-5 border-b border-border gap-4">
                <div>
                    <h2 className="text-base font-semibold text-foreground">Condomínios</h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Gestão dos condomínios cadastrados na plataforma.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <input
                        type="text"
                        placeholder="Buscar por nome..."
                        value={search}
                        onChange={(e) => onSearchChange(e.target.value)}
                        className="px-3 py-1.5 text-sm bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors"
                    />
                    {canCreate && (
                        <button
                            onClick={onAddCondominium}
                            className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-white bg-brand rounded-lg hover:opacity-90 transition-opacity whitespace-nowrap"
                        >
                            + Novo Condomínio
                        </button>
                    )}
                </div>
            </div>

            <div className="hidden md:grid grid-cols-[2fr_2fr_1fr_auto] px-6 py-3 bg-accent/40 border-b border-border">
                {['Condomínio', 'Endereço', 'Criado em', 'Ações'].map((col) => (
                    <span key={col} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {col}
                    </span>
                ))}
            </div>

            <div className="divide-y divide-border">
                {data.map((condo) => (
                    <div
                        key={condo.id}
                        className="grid grid-cols-[1fr_auto] md:grid-cols-[2fr_2fr_1fr_auto] items-center px-6 py-4 hover:bg-accent/30 transition-colors gap-2"
                    >
                        <div className="flex items-center gap-3 min-w-0">
                            <InitialsAvatar initials={initialsFor(condo.name)} color={colorFor(condo.id)} />
                            <div className="min-w-0">
                                <p className="text-sm font-semibold text-foreground truncate">{condo.name}</p>
                                <p className="text-xs text-muted-foreground truncate md:hidden">{condo.address_full}</p>
                            </div>
                        </div>
                        <p className="hidden md:block text-sm text-muted-foreground truncate">{condo.address_full}</p>
                        <p className="hidden md:block text-sm text-muted-foreground">{formatDate(condo.created_at)}</p>
                        <div className="flex items-center gap-3">
                            <button
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                title="Ver detalhe"
                                onClick={() => onView(condo.id)}
                            >
                                <Eye size={16} />
                            </button>
                        </div>
                    </div>
                ))}

                {data.length === 0 && (
                    <div className="px-6 py-10 text-center text-sm text-muted-foreground">
                        Nenhum condomínio encontrado.
                    </div>
                )}
            </div>

            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                    Página <span className="font-semibold text-foreground">{currentPage}</span> de{' '}
                    <span className="font-semibold text-foreground">{lastPage}</span> —{' '}
                    {total.toLocaleString()} resultados
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onPrev}
                        disabled={currentPage <= 1}
                        className="px-4 py-1.5 text-sm border border-border rounded-lg text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Anterior
                    </button>
                    <button
                        onClick={onNext}
                        disabled={currentPage >= lastPage}
                        className="px-4 py-1.5 text-sm bg-brand text-white rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    >
                        Próxima
                    </button>
                </div>
            </div>
        </div>
    );
}
