import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Users, Layers, MapPin, DoorOpen } from 'lucide-react';
import { ApiError } from '../../services/apiClient';
import * as condominiumService from '../../services/condominiumService';
import type { BackendCondominium } from '../../services/condominiumService';
import * as blockService from '../../services/blockService';
import * as unitService from '../../services/unitService';
import * as commonAreaService from '../../services/commonAreaService';
import { InitialsAvatar } from '../../components/ui/InitialsAvatar';
import { initialsFor, colorFor } from '../../lib/avatar';
import { MetricCard } from '../../components/cards/MetricCard';
import { formatDate } from '../../lib/format';

function useResourceCount(id: string | undefined, fetcher: (condominiumId: string) => Promise<{ meta: { total: number } }>) {
    const [count, setCount] = useState<number | null>(null);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        setCount(null);
        setFailed(false);
        fetcher(id)
            .then((result) => {
                if (!cancelled) setCount(result.meta.total);
            })
            .catch(() => {
                if (!cancelled) setFailed(true);
            });
        return () => {
            cancelled = true;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    return { count, failed };
}

export function CondominiumDetail() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [condominium, setCondominium] = useState<BackendCondominium | null>(null);
    const [name, setName] = useState('');
    const [addressFull, setAddressFull] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);
    const [saved, setSaved] = useState(false);

    const blocks = useResourceCount(id, (condoId) => blockService.listBlocks(condoId, 1));
    const units = useResourceCount(id, (condoId) => unitService.listUnits(condoId, { perPage: 1 }));
    const commonAreas = useResourceCount(id, (condoId) => commonAreaService.listCommonAreas(condoId, 1));

    useEffect(() => {
        if (!id) return;
        let cancelled = false;
        condominiumService
            .getCondominium(id)
            .then((data) => {
                if (cancelled) return;
                setCondominium(data);
                setName(data.name);
                setAddressFull(data.address_full);
                setLoadError(null);
            })
            .catch((err) => {
                if (cancelled) return;
                setLoadError(err instanceof ApiError ? err.message : 'Não foi possível carregar o condomínio.');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [id]);

    async function handleSave() {
        if (!id) return;
        setSaving(true);
        setSaveError(null);
        setSaved(false);
        try {
            const updated = await condominiumService.updateCondominium(id, { name, address_full: addressFull });
            setCondominium(updated);
            setSaved(true);
        } catch (err) {
            setSaveError(err instanceof ApiError ? err.message : 'Não foi possível salvar as alterações.');
        } finally {
            setSaving(false);
        }
    }

    const hasChanges = condominium && (name !== condominium.name || addressFull !== condominium.address_full);

    return (
        <div className="p-4 md:p-8 flex flex-col gap-6 h-full overflow-y-auto custom-scrollbar">
            <button
                onClick={() => navigate('/admin/condos')}
                className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors w-fit"
            >
                <ArrowLeft size={16} /> Voltar para Condomínios
            </button>

            {isLoading && (
                <div className="flex items-center justify-center py-20 text-muted-foreground text-sm">
                    Carregando...
                </div>
            )}

            {loadError && !isLoading && (
                <div className="bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
                    {loadError}
                </div>
            )}

            {condominium && !isLoading && (
                <div className="flex flex-col gap-6">
                    <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col sm:flex-row sm:items-center gap-4">
                        <InitialsAvatar initials={initialsFor(condominium.name)} color={colorFor(condominium.id)} size="md" />
                        <div className="min-w-0 flex-1">
                            <h1 className="text-xl font-semibold text-foreground truncate">{condominium.name}</h1>
                            <p className="text-sm text-muted-foreground truncate">{condominium.address_full}</p>
                            <p className="text-xs text-muted-foreground mt-1">
                                Criado em {formatDate(condominium.created_at)} · Atualizado em{' '}
                                {formatDate(condominium.updated_at)}
                            </p>
                        </div>
                        <p className="text-xs text-muted-foreground font-mono shrink-0">ID: {condominium.id}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                        <div className="lg:col-span-2 flex flex-col gap-6">
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-5">
                                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">
                                    Editar informações
                                </h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-foreground">Nome</label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors"
                                        />
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-sm font-medium text-foreground">Endereço</label>
                                        <input
                                            type="text"
                                            value={addressFull}
                                            onChange={(e) => setAddressFull(e.target.value)}
                                            className="w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors"
                                        />
                                    </div>
                                </div>

                                {saveError && <p className="text-xs text-destructive">{saveError}</p>}
                                {saved && !hasChanges && <p className="text-xs text-success">Alterações salvas.</p>}

                                <div className="flex items-center gap-3 pt-2 border-t border-border">
                                    <button
                                        onClick={handleSave}
                                        disabled={saving || !hasChanges || !name.trim()}
                                        className="px-5 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {saving ? 'Salvando...' : 'Salvar alterações'}
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div title={blocks.failed ? 'Não foi possível consultar blocos deste condomínio (erro de permissão)' : undefined}>
                                    <MetricCard
                                        label="Blocos"
                                        value={blocks.failed ? 'N/D' : (blocks.count?.toLocaleString() ?? '...')}
                                        icon={<Layers className="w-6 h-6 text-brand" />}
                                        iconBg="bg-brand/10"
                                    />
                                </div>
                                <div title={units.failed ? 'Não foi possível consultar unidades deste condomínio (erro de permissão)' : undefined}>
                                    <MetricCard
                                        label="Unidades"
                                        value={units.failed ? 'N/D' : (units.count?.toLocaleString() ?? '...')}
                                        icon={<DoorOpen className="w-6 h-6 text-success" />}
                                        iconBg="bg-success/10"
                                    />
                                </div>
                                <div title={commonAreas.failed ? 'Não foi possível consultar áreas comuns deste condomínio (erro de permissão)' : undefined}>
                                    <MetricCard
                                        label="Áreas Comuns"
                                        value={commonAreas.failed ? 'N/D' : (commonAreas.count?.toLocaleString() ?? '...')}
                                        icon={<MapPin className="w-6 h-6 text-info" />}
                                        iconBg="bg-info/10"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-6">
                            <div className="bg-card border border-border rounded-xl shadow-sm p-6 flex flex-col gap-4">
                                <h2 className="text-sm font-semibold text-foreground uppercase tracking-wide">Ações</h2>
                                <button
                                    type="button"
                                    disabled
                                    title="Impersonação de síndico ainda não implementada — decisão de autorização pendente no backend"
                                    className="flex items-center gap-2 px-4 py-2.5 border border-border text-sm font-medium text-muted-foreground rounded-lg opacity-50 cursor-not-allowed w-full justify-center"
                                >
                                    <Users size={16} /> Gerenciar como Síndico
                                </button>
                                <p className="text-xs text-muted-foreground">
                                    Em breve — depende de decisão de autorização no backend.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
