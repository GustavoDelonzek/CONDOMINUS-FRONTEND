import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, MapPin, Users, Clock } from 'lucide-react';
import { useCondo } from '../../contexts/CondoContext';
import { ApiError } from '../../services/apiClient';
import * as commonAreaService from '../../services/commonAreaService';
import type { BackendCommonArea, BookingRules } from '../../services/commonAreaService';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { EditCommonAreaDrawer } from '../../components/ui/EditCommonAreaDrawer';
import { formatDate } from '../../lib/format';

function rulesSummary(rules: BookingRules | null): string | null {
    if (!rules) return null;
    const parts: string[] = [];
    if (rules.opens_at && rules.closes_at) parts.push(`${rules.opens_at}–${rules.closes_at}`);
    if (rules.max_duration_hours) parts.push(`até ${rules.max_duration_hours}h`);
    if (rules.min_advance_hours) parts.push(`${rules.min_advance_hours}h de antecedência`);
    if (rules.max_reservations_per_unit_per_month) parts.push(`${rules.max_reservations_per_unit_per_month}x/mês por unidade`);
    parts.push(rules.requires_approval ? 'aprovação manual' : 'aprovação automática');
    if (rules.fee) parts.push(`R$ ${rules.fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`);
    return parts.length > 0 ? parts.join(' · ') : null;
}

export function CommonAreas() {
    const { activeCondoId } = useCondo();
    const [items, setItems] = useState<BackendCommonArea[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState(0);

    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const [editTarget, setEditTarget] = useState<BackendCommonArea | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<BackendCommonArea | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (!activeCondoId) return;
        let cancelled = false;
        commonAreaService
            .listCommonAreas(activeCondoId, 100)
            .then((result) => {
                if (cancelled) return;
                setItems(result.items);
                setLoadError(null);
            })
            .catch((err) => {
                if (cancelled) return;
                setLoadError(err instanceof ApiError ? err.message : 'Não foi possível carregar as áreas comuns.');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [activeCondoId, refreshToken]);

    async function handleCreate(e: FormEvent) {
        e.preventDefault();
        if (!activeCondoId || !newName.trim()) return;
        setCreating(true);
        setCreateError(null);
        try {
            await commonAreaService.createCommonArea(activeCondoId, newName.trim());
            setNewName('');
            setRefreshToken((t) => t + 1);
        } catch (err) {
            setCreateError(err instanceof ApiError ? err.message : 'Não foi possível criar a área comum.');
        } finally {
            setCreating(false);
        }
    }

    async function handleSaveEdit(payload: { name: string; booking_rules: BookingRules }) {
        if (!activeCondoId || !editTarget) return;
        await commonAreaService.updateCommonArea(activeCondoId, editTarget.id, payload);
        setEditTarget(null);
        setRefreshToken((t) => t + 1);
    }

    async function handleDelete() {
        if (!activeCondoId || !deleteTarget) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            await commonAreaService.deleteCommonArea(activeCondoId, deleteTarget.id);
            setDeleteTarget(null);
            setRefreshToken((t) => t + 1);
        } catch (err) {
            setDeleteError(err instanceof ApiError ? err.message : 'Não foi possível excluir a área comum.');
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="flex flex-col gap-6 h-full p-4 md:p-6 bg-background overflow-y-auto custom-scrollbar">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Áreas Comuns</h1>
                <p className="text-muted-foreground mt-0.5 text-sm">Gerencie as áreas comuns e as regras de reserva deste condomínio.</p>
            </div>

            <form
                onSubmit={handleCreate}
                className="flex flex-col sm:flex-row gap-3 bg-card border border-border rounded-xl p-4 shadow-sm"
            >
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nome da área (ex.: Salão de Festas)"
                    className="flex-1 px-3 py-2 text-sm bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors"
                />
                <button
                    type="submit"
                    disabled={creating || !newName.trim()}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                    <Plus size={16} /> {creating ? 'Criando...' : 'Adicionar Área'}
                </button>
            </form>
            {createError && <p className="text-xs text-destructive -mt-4">{createError}</p>}

            {loadError && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
                    {loadError}
                </div>
            )}

            <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-16 text-muted-foreground text-sm">
                        Carregando...
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center gap-2 py-16 text-muted-foreground text-sm">
                        <MapPin size={24} />
                        Nenhuma área comum cadastrada ainda.
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {items.map((area) => {
                            const summary = rulesSummary(area.booking_rules);
                            return (
                                <div key={area.id} className="flex items-center gap-3 px-6 py-4">
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <p className="text-sm font-semibold text-foreground truncate">{area.name}</p>
                                            {area.capacity !== null && (
                                                <span className="flex items-center gap-1 text-[11px] font-medium text-muted-foreground bg-accent px-2 py-0.5 rounded-full">
                                                    <Users size={11} /> {area.capacity}
                                                </span>
                                            )}
                                            {!area.is_active && (
                                                <span className="text-[11px] font-medium text-destructive bg-destructive/10 px-2 py-0.5 rounded-full">
                                                    Inativa
                                                </span>
                                            )}
                                        </div>
                                        {summary ? (
                                            <p className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                                                <Clock size={11} className="shrink-0" /> {summary}
                                            </p>
                                        ) : (
                                            <p className="text-xs text-muted-foreground mt-0.5">Sem regras de reserva configuradas.</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">Criado em {formatDate(area.created_at)}</p>
                                    </div>
                                    <button
                                        onClick={() => setEditTarget(area)}
                                        title="Editar"
                                        className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteTarget(area)}
                                        title="Excluir"
                                        className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            <EditCommonAreaDrawer area={editTarget} onClose={() => setEditTarget(null)} onSubmit={handleSaveEdit} />

            <ConfirmDialog
                open={!!deleteTarget}
                title="Excluir área comum"
                message={`Tem certeza que deseja excluir "${deleteTarget?.name}"? Essa ação não pode ser desfeita.`}
                confirmLabel="Excluir"
                danger
                loading={deleting}
                onConfirm={handleDelete}
                onCancel={() => {
                    setDeleteTarget(null);
                    setDeleteError(null);
                }}
            />
            {deleteError && <p className="text-xs text-destructive text-right">{deleteError}</p>}
        </div>
    );
}
