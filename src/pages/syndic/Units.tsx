import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, DoorOpen, Check, X } from 'lucide-react';
import { useCondo } from '../../contexts/CondoContext';
import { ApiError } from '../../services/apiClient';
import * as unitService from '../../services/unitService';
import type { BackendUnit } from '../../services/unitService';
import * as blockService from '../../services/blockService';
import type { BackendBlock } from '../../services/blockService';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { formatDate } from '../../lib/format';

const EMPTY_META = { current_page: 1, last_page: 1, per_page: 20, total: 0 };

export function Units() {
    const { activeCondoId } = useCondo();
    const [blocks, setBlocks] = useState<BackendBlock[]>([]);
    const [items, setItems] = useState<BackendUnit[]>([]);
    const [meta, setMeta] = useState(EMPTY_META);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState(0);

    const [filterBlockId, setFilterBlockId] = useState('');
    const [filterNumber, setFilterNumber] = useState('');
    const [filterFloor, setFilterFloor] = useState('');
    const [page, setPage] = useState(1);

    const [newBlockId, setNewBlockId] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [newFloor, setNewFloor] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editNumber, setEditNumber] = useState('');
    const [editFloor, setEditFloor] = useState('');
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<BackendUnit | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (!activeCondoId) return;
        let cancelled = false;
        blockService
            .listBlocks(activeCondoId, 100)
            .then((result) => {
                if (!cancelled) setBlocks(result.items);
            })
            .catch(() => {
                if (!cancelled) setBlocks([]);
            });
        return () => {
            cancelled = true;
        };
    }, [activeCondoId]);

    useEffect(() => {
        if (!activeCondoId) return;
        let cancelled = false;
        unitService
            .listUnits(activeCondoId, {
                blockId: filterBlockId || undefined,
                number: filterNumber || undefined,
                floor: filterFloor || undefined,
                page,
            })
            .then((result) => {
                if (cancelled) return;
                setItems(result.items);
                setMeta(result.meta);
                setLoadError(null);
            })
            .catch((err) => {
                if (cancelled) return;
                setLoadError(err instanceof ApiError ? err.message : 'Não foi possível carregar as unidades.');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [activeCondoId, filterBlockId, filterNumber, filterFloor, page, refreshToken]);

    function blockName(blockId: string | null) {
        return blocks.find((b) => b.id === blockId)?.name ?? '—';
    }

    async function handleCreate(e: FormEvent) {
        e.preventDefault();
        if (!activeCondoId || !newBlockId || !newNumber.trim() || !newFloor.trim()) return;
        setCreating(true);
        setCreateError(null);
        try {
            await unitService.createUnit(activeCondoId, {
                block_id: newBlockId,
                number: newNumber.trim(),
                floor: newFloor.trim(),
            });
            setNewNumber('');
            setNewFloor('');
            if (page === 1) {
                setRefreshToken((t) => t + 1);
            } else {
                setPage(1);
            }
        } catch (err) {
            setCreateError(err instanceof ApiError ? err.message : 'Não foi possível criar a unidade.');
        } finally {
            setCreating(false);
        }
    }

    function startEdit(unit: BackendUnit) {
        setEditingId(unit.id);
        setEditNumber(unit.number);
        setEditFloor(unit.floor ?? '');
        setEditError(null);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditError(null);
    }

    async function handleSaveEdit(unit: BackendUnit) {
        if (!activeCondoId || !editNumber.trim() || !editFloor.trim()) return;
        setSaving(true);
        setEditError(null);
        try {
            await unitService.updateUnit(activeCondoId, unit.id, {
                number: editNumber.trim(),
                floor: editFloor.trim(),
            });
            setEditingId(null);
            setRefreshToken((t) => t + 1);
        } catch (err) {
            setEditError(err instanceof ApiError ? err.message : 'Não foi possível salvar.');
        } finally {
            setSaving(false);
        }
    }

    async function handleDelete() {
        if (!activeCondoId || !deleteTarget) return;
        setDeleting(true);
        setDeleteError(null);
        try {
            await unitService.deleteUnit(activeCondoId, deleteTarget.id);
            setDeleteTarget(null);
            setRefreshToken((t) => t + 1);
        } catch (err) {
            setDeleteError(err instanceof ApiError ? err.message : 'Não foi possível excluir a unidade.');
        } finally {
            setDeleting(false);
        }
    }

    const selectClass =
        'px-3 py-2 text-sm bg-input-background border border-border rounded-lg text-foreground ' +
        'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors';
    const inputClass =
        'px-3 py-2 text-sm bg-input-background border border-border rounded-lg text-foreground ' +
        'placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors';

    return (
        <div className="flex flex-col gap-6 h-full p-4 md:p-6 bg-background overflow-y-auto custom-scrollbar">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Unidades</h1>
                <p className="text-muted-foreground mt-0.5 text-sm">Gerencie as unidades deste condomínio.</p>
            </div>

            <form
                onSubmit={handleCreate}
                className="flex flex-col sm:flex-row flex-wrap gap-3 bg-card border border-border rounded-xl p-4 shadow-sm"
            >
                <select value={newBlockId} onChange={(e) => setNewBlockId(e.target.value)} className={selectClass}>
                    <option value="">Selecione o bloco</option>
                    {blocks.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={newNumber}
                    onChange={(e) => setNewNumber(e.target.value)}
                    placeholder="Número (ex.: 101)"
                    className={`flex-1 min-w-[140px] ${inputClass}`}
                />
                <input
                    type="text"
                    value={newFloor}
                    onChange={(e) => setNewFloor(e.target.value)}
                    placeholder="Andar (ex.: 1)"
                    className={`flex-1 min-w-[140px] ${inputClass}`}
                />
                <button
                    type="submit"
                    disabled={creating || !newBlockId || !newNumber.trim() || !newFloor.trim()}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                    <Plus size={16} /> {creating ? 'Criando...' : 'Adicionar Unidade'}
                </button>
            </form>
            {createError && <p className="text-xs text-destructive -mt-4">{createError}</p>}
            {blocks.length === 0 && (
                <p className="text-xs text-muted-foreground -mt-4">
                    Nenhum bloco cadastrado ainda — crie um bloco antes de adicionar unidades.
                </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
                <select
                    value={filterBlockId}
                    onChange={(e) => {
                        setFilterBlockId(e.target.value);
                        setPage(1);
                    }}
                    className={selectClass}
                >
                    <option value="">Todos os blocos</option>
                    {blocks.map((b) => (
                        <option key={b.id} value={b.id}>
                            {b.name}
                        </option>
                    ))}
                </select>
                <input
                    type="text"
                    value={filterNumber}
                    onChange={(e) => {
                        setFilterNumber(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Buscar por número..."
                    className={inputClass}
                />
                <input
                    type="text"
                    value={filterFloor}
                    onChange={(e) => {
                        setFilterFloor(e.target.value);
                        setPage(1);
                    }}
                    placeholder="Buscar por andar..."
                    className={inputClass}
                />
            </div>

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
                        <DoorOpen size={24} />
                        Nenhuma unidade encontrada.
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {items.map((unit) => {
                            const isEditing = editingId === unit.id;
                            return (
                                <div key={unit.id} className="flex items-center gap-3 px-6 py-4">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editNumber}
                                                onChange={(e) => setEditNumber(e.target.value)}
                                                autoFocus
                                                className={`w-28 py-1.5 ${inputClass}`}
                                            />
                                            <input
                                                type="text"
                                                value={editFloor}
                                                onChange={(e) => setEditFloor(e.target.value)}
                                                className={`w-28 py-1.5 ${inputClass}`}
                                            />
                                            <span className="flex-1 text-xs text-muted-foreground truncate">
                                                {blockName(unit.block_id)}
                                            </span>
                                            {editError && <p className="text-xs text-destructive shrink-0">{editError}</p>}
                                            <button
                                                onClick={() => handleSaveEdit(unit)}
                                                disabled={saving || !editNumber.trim() || !editFloor.trim()}
                                                title="Salvar"
                                                className="text-success hover:opacity-80 transition-opacity disabled:opacity-50 shrink-0"
                                            >
                                                <Check size={18} />
                                            </button>
                                            <button
                                                onClick={cancelEdit}
                                                disabled={saving}
                                                title="Cancelar"
                                                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                                            >
                                                <X size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-semibold text-foreground truncate">
                                                    Unidade {unit.number}
                                                    {unit.floor ? ` · ${unit.floor}º andar` : ''}
                                                </p>
                                                <p className="text-xs text-muted-foreground truncate">
                                                    {blockName(unit.block_id)} · criado em {formatDate(unit.created_at)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => startEdit(unit)}
                                                title="Editar"
                                                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(unit)}
                                                title="Excluir"
                                                className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

                <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                    <p className="text-xs text-muted-foreground">
                        Página <span className="font-semibold text-foreground">{meta.current_page}</span> de{' '}
                        <span className="font-semibold text-foreground">{meta.last_page}</span> —{' '}
                        {meta.total.toLocaleString()} resultados
                    </p>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page <= 1}
                            className="px-4 py-1.5 text-sm border border-border rounded-lg text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                        >
                            Anterior
                        </button>
                        <button
                            onClick={() => setPage((p) => Math.min(meta.last_page, p + 1))}
                            disabled={page >= meta.last_page}
                            className="px-4 py-1.5 text-sm bg-brand text-white rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                        >
                            Próxima
                        </button>
                    </div>
                </div>
            </div>

            <ConfirmDialog
                open={!!deleteTarget}
                title="Excluir unidade"
                message={`Tem certeza que deseja excluir a unidade "${deleteTarget?.number}"? Essa ação não pode ser desfeita.`}
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
