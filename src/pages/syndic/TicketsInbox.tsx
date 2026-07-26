import { useEffect, useRef, useState } from 'react';
import { Search, Filter, Phone, Mail, Clock, Image as ImageIcon, Video, Music, FileText, X, Tag, MapPin, MessageSquare } from 'lucide-react';
import { useCondo } from '../../contexts/CondoContext';
import { ApiError } from '../../services/apiClient';
import * as occurrenceService from '../../services/occurrenceService';
import type { BackendOccurrence, OccurrenceStatus, OccurrencePriority } from '../../services/occurrenceService';
import { formatDate } from '../../lib/format';
import { initialsFor, colorFor } from '../../lib/avatar';
import { InitialsAvatar } from '../../components/ui/InitialsAvatar';
import { SegmentedTabs } from '../../components/ui/SegmentedTabs';

const STATUS_LABELS: Record<OccurrenceStatus, string> = {
    open: 'Aberta',
    in_progress: 'Em Andamento',
    resolved: 'Resolvida',
    closed: 'Encerrada',
};

const STATUS_STYLES: Record<OccurrenceStatus, string> = {
    open: 'text-brand border-brand/20 bg-brand/10',
    in_progress: 'text-amber-600 border-amber-200 bg-amber-50',
    resolved: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    closed: 'text-muted-foreground border-border bg-accent',
};

const PRIORITY_LABELS: Record<OccurrencePriority, string> = {
    low: 'Baixa',
    medium: 'Média',
    high: 'Alta',
};

const PRIORITY_STYLES: Record<OccurrencePriority, string> = {
    low: 'bg-emerald-50 text-emerald-600 border border-emerald-500/20',
    medium: 'bg-amber-50 text-amber-600 border border-amber-500/20',
    high: 'bg-red-50 text-red-500 border border-red-500/20',
};

const ALLOWED_TRANSITIONS: Record<OccurrenceStatus, OccurrenceStatus[]> = {
    open: ['open', 'in_progress', 'resolved', 'closed'],
    in_progress: ['in_progress', 'resolved', 'closed'],
    resolved: ['closed'],
    closed: [],
};

const STATUS_FILTER_OPTIONS: { value: OccurrenceStatus; label: string }[] = [
    { value: 'open', label: 'Aberta' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'resolved', label: 'Resolvida' },
    { value: 'closed', label: 'Encerrada' },
];

const PRIORITY_OPTIONS: OccurrencePriority[] = ['low', 'medium', 'high'];

function StatusBadge({ status }: { status: OccurrenceStatus }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLES[status]}`}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {STATUS_LABELS[status]}
        </span>
    );
}

function PriorityBadge({ priority }: { priority: OccurrencePriority }) {
    return (
        <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${PRIORITY_STYLES[priority]}`}>
            {PRIORITY_LABELS[priority]}
        </span>
    );
}

function InfoCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
    return (
        <div className="bg-background border-2 border-slate-100 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-brand/5 text-brand flex items-center justify-center shrink-0">
                {icon}
            </div>
            <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">{label}</p>
                <p className="text-base font-bold text-foreground">{value}</p>
            </div>
        </div>
    );
}

function MediaIcon({ type }: { type: BackendOccurrence['occurrence_media'][number]['media_type'] }) {
    if (type === 'video') return <Video size={24} />;
    if (type === 'audio') return <Music size={24} />;
    if (type === 'document') return <FileText size={24} />;
    return <ImageIcon size={24} />;
}

function sortByCreatedAtAsc(list: BackendOccurrence[]) {
    return [...list].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
}

function sortByCreatedAtDesc(list: BackendOccurrence[]) {
    return [...list].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
}

function unitLabel(occ: BackendOccurrence) {
    if (!occ.unit) return '—';
    const block = occ.unit.block?.name ? `${occ.unit.block.name} · ` : '';
    return `${block}Apt ${occ.unit.number}`;
}

export function TicketsInbox() {
    const { activeCondoId } = useCondo();
    const [items, setItems] = useState<BackendOccurrence[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState(0);
    const [activeTab, setActiveTab] = useState<'open' | 'in_progress' | 'all'>('open');
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<OccurrenceStatus | ''>('');
    const [filterPriority, setFilterPriority] = useState<OccurrencePriority | ''>('');
    const [searchText, setSearchText] = useState('');
    const filterRef = useRef<HTMLDivElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [respondDrawerOpen, setRespondDrawerOpen] = useState(false);

    const [pendingStatus, setPendingStatus] = useState<OccurrenceStatus>('open');
    const [pendingPriority, setPendingPriority] = useState<OccurrencePriority>('medium');
    const [responseText, setResponseText] = useState('');
    const [notifyResident, setNotifyResident] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [saveError, setSaveError] = useState<string | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setFilterPanelOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleTabChange(tab: 'open' | 'in_progress' | 'all') {
        setActiveTab(tab);
        if (tab !== 'all') {
            setFilterStatus('');
            setFilterPriority('');
            setFilterPanelOpen(false);
        }
    }

    const hasExtraFilters = !!filterStatus || !!filterPriority;

    useEffect(() => {
        if (!activeCondoId) return;
        let cancelled = false;
        occurrenceService
            .listOccurrences(activeCondoId, { perPage: 100 })
            .then((result) => {
                if (cancelled) return;
                setItems(result.items);
                setLoadError(null);
                setSelectedId((current) => {
                    if (current) return current;
                    const open = sortByCreatedAtAsc(
                        result.items.filter((o) => o.status === 'open' || o.status === 'in_progress'),
                    );
                    return open[0]?.id ?? result.items[0]?.id ?? null;
                });
            })
            .catch((err) => {
                if (cancelled) return;
                setLoadError(err instanceof ApiError ? err.message : 'Não foi possível carregar as ocorrências.');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [activeCondoId, refreshToken]);

    const selected = items.find((o) => o.id === selectedId) ?? null;

    useEffect(() => {
        if (!selected) return;
        setPendingStatus(selected.status);
        setPendingPriority(selected.priority);
        setResponseText(selected.admin_response ?? '');
        setNotifyResident(false);
        setSaveError(null);
    }, [selected?.id]);

    let baseItems = activeTab === 'all' ? items : items.filter((o) => o.status === activeTab);
    if (activeTab === 'all') {
        if (filterStatus) baseItems = baseItems.filter((o) => o.status === filterStatus);
        if (filterPriority) baseItems = baseItems.filter((o) => o.priority === filterPriority);
    }
    if (searchText.trim()) {
        const q = searchText.trim().toLowerCase();
        baseItems = baseItems.filter(
            (o) => o.category.toLowerCase().includes(q) || (o.description ?? '').toLowerCase().includes(q),
        );
    }
    const filteredItems = activeTab === 'all' ? sortByCreatedAtDesc(baseItems) : sortByCreatedAtAsc(baseItems);
    const openCount = items.filter((o) => o.status === 'open').length;
    const inProgressCount = items.filter((o) => o.status === 'in_progress').length;
    const allowedNextStatuses = selected ? ALLOWED_TRANSITIONS[selected.status] : [];

    function openRespondDrawer() {
        if (!selected) return;
        setPendingStatus(selected.status);
        setPendingPriority(selected.priority);
        setResponseText(selected.admin_response ?? '');
        setNotifyResident(false);
        setSaveError(null);
        setRespondDrawerOpen(true);
    }

    async function handleSave() {
        if (!activeCondoId || !selected) return;
        setIsSaving(true);
        setSaveError(null);
        try {
            await occurrenceService.updateOccurrence(activeCondoId, selected.id, {
                status: pendingStatus,
                priority: pendingPriority,
                admin_response: responseText.trim() ? responseText.trim() : undefined,
                notify_resident: notifyResident,
            });
            setRefreshToken((t) => t + 1);
            setRespondDrawerOpen(false);
        } catch (err) {
            setSaveError(err instanceof ApiError ? err.message : 'Não foi possível salvar as alterações.');
        } finally {
            setIsSaving(false);
        }
    }

    return (
        <div className="flex flex-col lg:flex-row h-full bg-background overflow-hidden relative">
            <div
                className={`
        w-full lg:w-[380px] flex flex-col bg-card border-r border-border shrink-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]
        ${selectedId ? 'hidden lg:flex' : 'flex'}
      `}
            >
                <div className="p-4 md:p-6 border-b border-border">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-foreground">Ocorrências</h2>
                        <div className="relative" ref={filterRef}>
                            <button
                                onClick={() => activeTab === 'all' && setFilterPanelOpen((v) => !v)}
                                disabled={activeTab !== 'all'}
                                title={activeTab === 'all' ? 'Filtrar' : 'Filtros disponíveis na aba Todas'}
                                className="relative text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            >
                                <Filter size={18} />
                                {hasExtraFilters && (
                                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand" />
                                )}
                            </button>

                            {filterPanelOpen && activeTab === 'all' && (
                                <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-lg p-4 z-30 flex flex-col gap-4">
                                    <div className="flex items-center justify-between">
                                        <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Filtros</p>
                                        <button
                                            onClick={() => setFilterPanelOpen(false)}
                                            className="text-muted-foreground hover:text-foreground cursor-pointer"
                                        >
                                            <X size={14} />
                                        </button>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-foreground">Status</label>
                                        <select
                                            value={filterStatus}
                                            onChange={(e) => setFilterStatus(e.target.value as OccurrenceStatus | '')}
                                            className="px-3 py-1.5 text-sm bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors"
                                        >
                                            <option value="">Todos os status</option>
                                            {STATUS_FILTER_OPTIONS.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="flex flex-col gap-1.5">
                                        <label className="text-xs font-medium text-foreground">Prioridade</label>
                                        <select
                                            value={filterPriority}
                                            onChange={(e) => setFilterPriority(e.target.value as OccurrencePriority | '')}
                                            className="px-3 py-1.5 text-sm bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors"
                                        >
                                            <option value="">Todas as prioridades</option>
                                            {PRIORITY_OPTIONS.map((p) => (
                                                <option key={p} value={p}>
                                                    {PRIORITY_LABELS[p]}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    {hasExtraFilters && (
                                        <button
                                            onClick={() => {
                                                setFilterStatus('');
                                                setFilterPriority('');
                                            }}
                                            className="text-xs font-semibold text-brand hover:opacity-80 transition-opacity self-start cursor-pointer"
                                        >
                                            Limpar filtros
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="mb-4">
                        <SegmentedTabs
                            value={activeTab}
                            onChange={handleTabChange}
                            options={[
                                { value: 'open', label: 'Abertas', count: openCount },
                                { value: 'in_progress', label: 'Andamento', count: inProgressCount },
                                { value: 'all', label: 'Todas', count: items.length },
                            ]}
                        />
                    </div>

                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="Buscar por categoria ou descrição..."
                            className="w-full pl-9 pr-4 py-2 bg-accent/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand placeholder:text-muted-foreground"
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    {isLoading ? (
                        <p className="p-4 md:p-6 text-sm text-muted-foreground">Carregando...</p>
                    ) : filteredItems.length === 0 ? (
                        <p className="p-4 md:p-6 text-sm text-muted-foreground">Nenhuma ocorrência encontrada.</p>
                    ) : (
                        filteredItems.map((occ) => (
                            <div
                                key={occ.id}
                                onClick={() => setSelectedId(occ.id)}
                                className={`p-4 md:p-5 border-b border-border cursor-pointer transition-colors relative
                ${selectedId === occ.id ? 'bg-brand/5 border-l-4 border-l-brand' : 'hover:bg-accent/50 border-l-4 border-l-transparent'}
              `}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                        <StatusBadge status={occ.status} />
                                        <PriorityBadge priority={occ.priority} />
                                    </div>
                                    <span className="text-xs text-muted-foreground font-medium shrink-0 ml-2">
                                        {formatDate(occ.created_at)}
                                    </span>
                                </div>
                                <p className="font-bold text-sm text-foreground mb-1 leading-tight line-clamp-2">
                                    {occ.description ?? 'Sem descrição'}
                                </p>

                                <div className="flex items-center justify-between mt-2">
                                    <span className="inline-flex items-center gap-1 bg-accent px-2 py-1 rounded text-[10px] font-bold text-muted-foreground uppercase">
                                        {occ.category}
                                    </span>
                                    <span className="text-xs font-semibold text-muted-foreground tracking-wide">
                                        {unitLabel(occ)}
                                    </span>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            <div
                className={`
        flex-1 flex flex-col bg-card min-w-0 border-r border-border relative
        ${!selectedId ? 'hidden lg:flex' : 'flex'}
      `}
            >
                <button
                    onClick={() => setSelectedId(null)}
                    className="lg:hidden absolute top-4 left-4 p-2 text-brand font-bold flex items-center gap-1 z-20 cursor-pointer"
                >
                    &lsaquo; Voltar
                </button>

                <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 mt-10 lg:mt-0 custom-scrollbar">
                    {loadError && (
                        <div className="mb-6 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
                            {loadError}
                        </div>
                    )}

                    <div className="w-full">
                        {selected ? (
                            <>
                                <div className="flex flex-col md:flex-row md:items-start justify-between mb-8 gap-4">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3 flex-wrap">
                                            <span className="font-bold text-muted-foreground text-sm">
                                                #{selected.id.slice(0, 8).toUpperCase()}
                                            </span>
                                            <StatusBadge status={selected.status} />
                                            <PriorityBadge priority={selected.priority} />
                                        </div>
                                        <h1 className="text-3xl font-black text-foreground mb-2 tracking-tight">
                                            {selected.category}
                                        </h1>
                                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                                            <Clock size={12} /> Registrada em {formatDate(selected.created_at)}
                                        </span>
                                    </div>

                                    <button
                                        onClick={openRespondDrawer}
                                        disabled={allowedNextStatuses.length === 0}
                                        title={
                                            allowedNextStatuses.length === 0
                                                ? 'Ocorrência encerrada — não pode mais ser alterada'
                                                : undefined
                                        }
                                        className="flex items-center gap-2 px-5 py-2.5 shrink-0 bg-brand text-white text-sm font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-sm"
                                    >
                                        <MessageSquare size={16} strokeWidth={2.5} /> Responder Ocorrência
                                    </button>
                                </div>

                                {saveError && !respondDrawerOpen && <p className="text-sm text-destructive mb-6">{saveError}</p>}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <InfoCard icon={<Tag size={22} strokeWidth={1.5} />} label="Categoria" value={selected.category} />
                                    <InfoCard icon={<MapPin size={22} strokeWidth={1.5} />} label="Unidade" value={unitLabel(selected)} />
                                </div>

                                <section className="mb-8 bg-background border-2 border-slate-100 rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                                        Detalhes da Ocorrência
                                    </h3>
                                    <p className="text-sm text-foreground leading-relaxed">
                                        {selected.description ?? 'Sem descrição.'}
                                    </p>
                                </section>

                                {selected.occurrence_media.length > 0 && (
                                    <section className="mb-8 bg-background border-2 border-slate-100 rounded-2xl p-6 shadow-sm">
                                        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-4">
                                            Evidências Anexadas
                                        </h3>
                                        <div className="flex gap-4 overflow-x-auto pb-2">
                                            {selected.occurrence_media.map((media) =>
                                                media.media_type === 'image' ? (
                                                    <img
                                                        key={media.id}
                                                        src={media.media_url}
                                                        alt="Evidência anexada"
                                                        className="w-48 h-32 object-cover rounded-lg border border-border shrink-0"
                                                    />
                                                ) : (
                                                    <a
                                                        key={media.id}
                                                        href={media.media_url}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="w-48 h-32 bg-accent rounded-lg border border-border flex items-center justify-center text-muted-foreground shrink-0"
                                                    >
                                                        <span className="flex flex-col items-center gap-2 opacity-70">
                                                            <MediaIcon type={media.media_type} /> {media.media_type}
                                                        </span>
                                                    </a>
                                                ),
                                            )}
                                        </div>
                                    </section>
                                )}

                                <section className="mb-8 bg-background border-2 border-slate-100 rounded-2xl p-6 shadow-sm">
                                    <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-6">
                                        Registro de Atividades
                                    </h3>

                                    <div className="space-y-6">
                                        <div className="flex items-start gap-4 pb-6 border-b border-border/50">
                                            <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 shrink-0 mt-0.5">
                                                <div className="w-2 h-2 rounded-full bg-brand"></div>
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between items-start mb-1">
                                                    <div>
                                                        <h4 className="font-bold text-sm text-foreground">Ocorrência registrada</h4>
                                                        <p className="text-xs text-muted-foreground">
                                                            Registrada via bot do WhatsApp por {selected.user?.full_name ?? 'morador'}.
                                                        </p>
                                                    </div>
                                                    <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap ml-4">
                                                        {formatDate(selected.created_at)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {selected.admin_response && selected.responded_at ? (
                                            <div className="flex items-start gap-4">
                                                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 shrink-0 mt-0.5">
                                                    <div className="w-2 h-2 rounded-full bg-brand"></div>
                                                </div>
                                                <div className="flex-1">
                                                    <div className="flex justify-between items-start mb-1">
                                                        <div>
                                                            <h4 className="font-bold text-sm text-foreground">Resposta do síndico</h4>
                                                            <p className="text-xs text-muted-foreground">{selected.admin_response}</p>
                                                        </div>
                                                        <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap ml-4">
                                                            {formatDate(selected.responded_at)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-muted-foreground italic">
                                                Ainda sem resposta do síndico.
                                            </p>
                                        )}
                                    </div>
                                </section>
                            </>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                                <FileText size={48} className="mb-4 text-muted-foreground" />
                                <h3 className="text-lg font-bold">Selecione uma Ocorrência</h3>
                                <p className="text-sm">Escolha uma ocorrência na lista para visualizar os detalhes.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {selected && (
                <div className="w-[300px] bg-card border-l border-border p-6 shrink-0 overflow-y-auto custom-scrollbar shadow-[0_0_8px_rgba(0,0,0,0.02)] hidden lg:block">
                    <div className="space-y-6">
                        <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Solicitante</h3>

                        <div className="flex items-center gap-3">
                            <InitialsAvatar
                                initials={initialsFor(selected.user?.full_name ?? '??')}
                                color={colorFor(selected.user?.id ?? selected.id)}
                                size="md"
                            />
                            <div>
                                <p className="font-bold text-sm text-foreground">{selected.user?.full_name ?? 'Morador'}</p>
                                {selected.unit && (
                                    <span className="inline-block mt-1 px-2 py-0.5 bg-brand/10 text-brand rounded text-[10px] font-bold uppercase tracking-wider">
                                        {unitLabel(selected)}
                                    </span>
                                )}
                            </div>
                        </div>

                        <div className="space-y-4">
                            {selected.user?.phone_number && (
                                <div className="flex items-start gap-3 text-sm border-t border-border pt-4">
                                    <Phone size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                                            Telefone
                                        </p>
                                        <p className="font-medium text-foreground">{selected.user.phone_number}</p>
                                    </div>
                                </div>
                            )}
                            {selected.user?.email && (
                                <div className="flex items-start gap-3 text-sm">
                                    <Mail size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                                            Email
                                        </p>
                                        <p className="font-medium text-foreground truncate w-40">{selected.user.email}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            <div
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${respondDrawerOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => !isSaving && setRespondDrawerOpen(false)}
            />

            <aside
                className={`
                    fixed top-0 right-0 h-full w-full sm:w-[420px] bg-card border-l border-border
                    z-50 flex flex-col shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${respondDrawerOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-border">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Responder Ocorrência</h2>
                        {selected && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                                {selected.category} · #{selected.id.slice(0, 8).toUpperCase()}
                            </p>
                        )}
                    </div>
                    <button
                        onClick={() => setRespondDrawerOpen(false)}
                        className="text-muted-foreground hover:text-foreground transition-colors mt-0.5 cursor-pointer"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-foreground">Status</label>
                            <select
                                value={pendingStatus}
                                onChange={(e) => setPendingStatus(e.target.value as OccurrenceStatus)}
                                disabled={allowedNextStatuses.length === 0}
                                className="px-3 py-2 text-sm bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors disabled:opacity-50"
                            >
                                {allowedNextStatuses.map((s) => (
                                    <option key={s} value={s}>
                                        {STATUS_LABELS[s]}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-foreground">Prioridade</label>
                            <select
                                value={pendingPriority}
                                onChange={(e) => setPendingPriority(e.target.value as OccurrencePriority)}
                                className="px-3 py-2 text-sm bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors"
                            >
                                {PRIORITY_OPTIONS.map((p) => (
                                    <option key={p} value={p}>
                                        {PRIORITY_LABELS[p]}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-medium text-foreground">Resposta</label>
                        <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Registre uma resposta para o morador..."
                            className="w-full h-32 p-3 bg-input-background border border-border rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors placeholder:text-muted-foreground"
                        ></textarea>
                    </div>

                    <label
                        title={
                            !selected?.user?.phone_number
                                ? 'Morador sem telefone cadastrado'
                                : !responseText.trim()
                                  ? 'Escreva uma resposta para poder notificar'
                                  : undefined
                        }
                        className="flex items-center gap-2 text-sm font-medium text-foreground cursor-pointer"
                    >
                        <input
                            type="checkbox"
                            checked={notifyResident}
                            disabled={!selected?.user?.phone_number || !responseText.trim()}
                            onChange={(e) => setNotifyResident(e.target.checked)}
                            className="w-4 h-4 rounded border border-border disabled:opacity-40"
                        />
                        Notificar morador via WhatsApp
                    </label>

                    {saveError && <p className="text-xs text-destructive">{saveError}</p>}
                </div>

                <div className="px-6 py-4 border-t border-border flex items-center gap-3">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                    >
                        {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    <button
                        onClick={() => setRespondDrawerOpen(false)}
                        disabled={isSaving}
                        className="px-5 py-2.5 border border-border text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors disabled:opacity-50 cursor-pointer"
                    >
                        Cancelar
                    </button>
                </div>
            </aside>
        </div>
    );
}
