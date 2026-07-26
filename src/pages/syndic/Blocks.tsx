import { useEffect, useState, type FormEvent } from 'react';
import { Plus, Pencil, Trash2, Layers, Check, X } from 'lucide-react';
import { useCondo } from '../../contexts/CondoContext';
import { ApiError } from '../../services/apiClient';
import * as blockService from '../../services/blockService';
import type { BackendBlock } from '../../services/blockService';
import { ConfirmDialog } from '../../components/ui/ConfirmDialog';
import { formatDate } from '../../lib/format';

export function Blocks() {
    const { activeCondoId } = useCondo();
    const [items, setItems] = useState<BackendBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState(0);

    const [newName, setNewName] = useState('');
    const [creating, setCreating] = useState(false);
    const [createError, setCreateError] = useState<string | null>(null);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editName, setEditName] = useState('');
    const [saving, setSaving] = useState(false);
    const [editError, setEditError] = useState<string | null>(null);

    const [deleteTarget, setDeleteTarget] = useState<BackendBlock | null>(null);
    const [deleting, setDeleting] = useState(false);
    const [deleteError, setDeleteError] = useState<string | null>(null);

    useEffect(() => {
        if (!activeCondoId) return;
        let cancelled = false;
        blockService
            .listBlocks(activeCondoId, 100)
            .then((result) => {
                if (cancelled) return;
                setItems(result.items);
                setLoadError(null);
            })
            .catch((err) => {
                if (cancelled) return;
                setLoadError(err instanceof ApiError ? err.message : 'Não foi possível carregar os blocos.');
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
            await blockService.createBlock(activeCondoId, newName.trim());
            setNewName('');
            setRefreshToken((t) => t + 1);
        } catch (err) {
            setCreateError(err instanceof ApiError ? err.message : 'Não foi possível criar o bloco.');
        } finally {
            setCreating(false);
        }
    }

    function startEdit(block: BackendBlock) {
        setEditingId(block.id);
        setEditName(block.name);
        setEditError(null);
    }

    function cancelEdit() {
        setEditingId(null);
        setEditError(null);
    }

    async function handleSaveEdit(block: BackendBlock) {
        if (!activeCondoId || !editName.trim()) return;
        setSaving(true);
        setEditError(null);
        try {
            await blockService.updateBlock(activeCondoId, block.id, editName.trim());
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
            await blockService.deleteBlock(activeCondoId, deleteTarget.id);
            setDeleteTarget(null);
            setRefreshToken((t) => t + 1);
        } catch (err) {
            setDeleteError(err instanceof ApiError ? err.message : 'Não foi possível excluir o bloco.');
        } finally {
            setDeleting(false);
        }
    }

    return (
        <div className="flex flex-col gap-6 h-full p-4 md:p-6 bg-background overflow-y-auto custom-scrollbar">
            <div>
                <h1 className="text-2xl font-bold text-foreground">Blocos</h1>
                <p className="text-muted-foreground mt-0.5 text-sm">Gerencie os blocos deste condomínio.</p>
            </div>

            <form
                onSubmit={handleCreate}
                className="flex flex-col sm:flex-row gap-3 bg-card border border-border rounded-xl p-4 shadow-sm"
            >
                <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="Nome do bloco (ex.: Bloco A)"
                    className="flex-1 px-3 py-2 text-sm bg-input-background border border-border rounded-lg text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors"
                />
                <button
                    type="submit"
                    disabled={creating || !newName.trim()}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-brand rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
                >
                    <Plus size={16} /> {creating ? 'Criando...' : 'Adicionar Bloco'}
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
                        <Layers size={24} />
                        Nenhum bloco cadastrado ainda.
                    </div>
                ) : (
                    <div className="divide-y divide-border">
                        {items.map((block) => {
                            const isEditing = editingId === block.id;
                            return (
                                <div key={block.id} className="flex items-center gap-3 px-6 py-4">
                                    {isEditing ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editName}
                                                onChange={(e) => setEditName(e.target.value)}
                                                autoFocus
                                                className="flex-1 px-3 py-1.5 text-sm bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors"
                                            />
                                            {editError && <p className="text-xs text-destructive shrink-0">{editError}</p>}
                                            <button
                                                onClick={() => handleSaveEdit(block)}
                                                disabled={saving || !editName.trim()}
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
                                                <p className="text-sm font-semibold text-foreground truncate">{block.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Criado em {formatDate(block.created_at)}
                                                </p>
                                            </div>
                                            <button
                                                onClick={() => startEdit(block)}
                                                title="Editar"
                                                className="text-muted-foreground hover:text-foreground transition-colors shrink-0"
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => setDeleteTarget(block)}
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
            </div>

            <ConfirmDialog
                open={!!deleteTarget}
                title="Excluir bloco"
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
