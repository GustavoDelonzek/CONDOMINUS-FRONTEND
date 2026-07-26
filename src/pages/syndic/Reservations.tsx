import { useEffect, useRef, useState } from 'react';
import { Clock, Calendar as CalendarIcon, Filter, Phone, X, Check, Users, Tag, ShieldCheck } from 'lucide-react';
import { useCondo } from '../../contexts/CondoContext';
import { ApiError } from '../../services/apiClient';
import * as reservationService from '../../services/reservationService';
import type { BackendReservation, ReservationStatus } from '../../services/reservationService';
import type { BookingRules } from '../../services/commonAreaService';
import { formatDate } from '../../lib/format';
import { SegmentedTabs } from '../../components/ui/SegmentedTabs';

const STATUS_LABELS: Record<ReservationStatus, string> = {
    pending: 'Aguardando Aprovação',
    confirmed: 'Confirmado',
    denied: 'Recusado',
    canceled: 'Cancelado',
    completed: 'Concluído',
};

const STATUS_STYLES: Record<ReservationStatus, string> = {
    pending: 'text-amber-600 border-amber-200 bg-amber-50',
    confirmed: 'text-emerald-600 border-emerald-200 bg-emerald-50',
    denied: 'text-destructive border-destructive/20 bg-destructive/10',
    canceled: 'text-muted-foreground border-border bg-accent',
    completed: 'text-muted-foreground border-border bg-accent',
};

const STATUS_BAR_COLORS: Record<ReservationStatus, string> = {
    pending: 'bg-amber-400',
    confirmed: 'bg-success',
    denied: 'bg-destructive/70',
    canceled: 'bg-muted-foreground/40',
    completed: 'bg-muted-foreground/70',
};

function parseHM(time: string) {
    const [h, m] = time.split(':').map(Number);
    return h * 60 + (m || 0);
}

function minutesToHM(totalMinutes: number) {
    const h = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
    const m = Math.round(totalMinutes % 60).toString().padStart(2, '0');
    return `${h}:${m}`;
}

function relativeMinutes(baseIso: string, targetIso: string) {
    const base = new Date(baseIso);
    const target = new Date(targetIso);
    const baseMidnight = new Date(base.getFullYear(), base.getMonth(), base.getDate()).getTime();
    return Math.round((target.getTime() - baseMidnight) / 60000);
}

function timelineBounds(bookingRules: BookingRules | null | undefined) {
    const opens = bookingRules?.opens_at ? parseHM(bookingRules.opens_at) : 6 * 60;
    const closes = bookingRules?.closes_at ? parseHM(bookingRules.closes_at) : 22 * 60;
    return closes > opens ? { opens, closes } : { opens: 6 * 60, closes: 22 * 60 };
}

function timelineBlockStyle(res: BackendReservation, bounds: { opens: number; closes: number }) {
    const total = bounds.closes - bounds.opens;
    const startMin = Math.min(Math.max(relativeMinutes(res.start_time, res.start_time), bounds.opens), bounds.closes);
    const endMin = Math.min(Math.max(relativeMinutes(res.start_time, res.end_time), bounds.opens), bounds.closes);
    const left = ((startMin - bounds.opens) / total) * 100;
    const width = Math.max(((endMin - startMin) / total) * 100, 4);
    return { left: `${left}%`, width: `${width}%` };
}

function tickPercent(minute: number, bounds: { opens: number; closes: number }) {
    const clamped = Math.min(Math.max(minute, bounds.opens), bounds.closes);
    return ((clamped - bounds.opens) / (bounds.closes - bounds.opens)) * 100;
}

function buildTimeMarks(dayReservations: BackendReservation[], selectedId: string, bounds: { opens: number; closes: number }) {
    const marks = new Map<number, boolean>();
    for (const res of dayReservations) {
        const isSelected = res.id === selectedId;
        const startMin = relativeMinutes(res.start_time, res.start_time);
        const endMin = relativeMinutes(res.start_time, res.end_time);
        for (const minute of [startMin, endMin]) {
            if (minute === bounds.opens || minute === bounds.closes) continue;
            marks.set(minute, (marks.get(minute) ?? false) || isSelected);
        }
    }
    return Array.from(marks.entries()).map(([minute, isSelected]) => ({ minute, isSelected }));
}

function StatusBadge({ status }: { status: ReservationStatus }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${STATUS_STYLES[status]}`}
        >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {STATUS_LABELS[status]}
        </span>
    );
}

function formatTimeRange(startIso: string, endIso: string) {
    const start = new Date(startIso);
    const end = new Date(endIso);
    const fmt = (d: Date) => d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    return `${fmt(start)} - ${fmt(end)}`;
}

function sameDay(aIso: string, bIso: string) {
    return new Date(aIso).toDateString() === new Date(bIso).toDateString();
}

function sortByStartTimeAsc(list: BackendReservation[]) {
    return [...list].sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime());
}

function isSameDateString(iso: string, dateStr: string) {
    const d = new Date(iso);
    const local = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    return local === dateStr;
}

const EXTRA_STATUS_OPTIONS: { value: ReservationStatus; label: string }[] = [
    { value: 'confirmed', label: 'Confirmado' },
    { value: 'denied', label: 'Recusado' },
    { value: 'canceled', label: 'Cancelado' },
    { value: 'completed', label: 'Concluído' },
];

export function Reservations() {
    const { activeCondoId } = useCondo();
    const [items, setItems] = useState<BackendReservation[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [loadError, setLoadError] = useState<string | null>(null);
    const [refreshToken, setRefreshToken] = useState(0);
    const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');
    const [filterPanelOpen, setFilterPanelOpen] = useState(false);
    const [filterStatus, setFilterStatus] = useState<ReservationStatus | ''>('');
    const [filterDate, setFilterDate] = useState('');
    const filterRef = useRef<HTMLDivElement>(null);
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [actionError, setActionError] = useState<string | null>(null);
    const [actioningId, setActioningId] = useState<string | null>(null);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setFilterPanelOpen(false);
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    function handleTabChange(tab: 'pending' | 'all') {
        setActiveTab(tab);
        if (tab === 'pending') {
            setFilterStatus('');
            setFilterDate('');
            setFilterPanelOpen(false);
        }
    }

    const hasExtraFilters = !!filterStatus || !!filterDate;

    useEffect(() => {
        if (!activeCondoId) return;
        let cancelled = false;
        reservationService
            .listReservations(activeCondoId, { perPage: 100 })
            .then((result) => {
                if (cancelled) return;
                setItems(result.items);
                setLoadError(null);
                setSelectedId((current) => {
                    if (current) return current;
                    const pending = sortByStartTimeAsc(result.items.filter((r) => r.status === 'pending'));
                    return pending[0]?.id ?? result.items[0]?.id ?? null;
                });
            })
            .catch((err) => {
                if (cancelled) return;
                setLoadError(err instanceof ApiError ? err.message : 'Não foi possível carregar as reservas.');
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });
        return () => {
            cancelled = true;
        };
    }, [activeCondoId, refreshToken]);

    let baseItems = activeTab === 'pending' ? items.filter((r) => r.status === 'pending') : items;
    if (activeTab === 'all') {
        if (filterStatus) baseItems = baseItems.filter((r) => r.status === filterStatus);
        if (filterDate) baseItems = baseItems.filter((r) => isSameDateString(r.start_time, filterDate));
    }
    const filteredItems = sortByStartTimeAsc(baseItems);
    const selectedRes = items.find((r) => r.id === selectedId) ?? null;
    const otherSameDay = selectedRes
        ? items.filter(
              (r) =>
                  r.id !== selectedRes.id &&
                  r.common_area_id === selectedRes.common_area_id &&
                  sameDay(r.start_time, selectedRes.start_time),
          )
        : [];
    const dayReservations = selectedRes
        ? items.filter(
              (r) => r.common_area_id === selectedRes.common_area_id && sameDay(r.start_time, selectedRes.start_time),
          )
        : [];
    const timelineRange = selectedRes ? timelineBounds(selectedRes.common_area?.booking_rules) : null;
    const timeMarks =
        selectedRes && timelineRange ? buildTimeMarks(dayReservations, selectedRes.id, timelineRange) : [];

    async function handleAction(reservation: BackendReservation, status: Exclude<ReservationStatus, 'pending'>) {
        if (!activeCondoId) return;
        setActioningId(reservation.id);
        setActionError(null);
        try {
            await reservationService.updateReservationStatus(activeCondoId, reservation.id, status);
            setRefreshToken((t) => t + 1);
        } catch (err) {
            setActionError(err instanceof ApiError ? err.message : 'Não foi possível atualizar a reserva.');
        } finally {
            setActioningId(null);
        }
    }

    return (
        <div className="flex flex-col h-full bg-background overflow-hidden relative">
            {loadError && (
                <div className="mx-6 mt-4 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg px-4 py-3">
                    {loadError}
                </div>
            )}

            <div className="flex-1 min-h-0 flex flex-col lg:flex-row overflow-hidden">
                <div
                    className={`
                    w-full lg:w-[340px] flex flex-col bg-card border-r border-border shrink-0 z-10
                    ${selectedId ? 'hidden lg:flex' : 'flex'}
                `}
                >
                    <div className="p-4 md:p-6 flex flex-col h-full overflow-hidden">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="font-bold text-xl text-foreground">Reservas</h3>
                            <div className="relative" ref={filterRef}>
                                <button
                                    onClick={() => activeTab === 'all' && setFilterPanelOpen((v) => !v)}
                                    disabled={activeTab !== 'all'}
                                    title={activeTab === 'all' ? 'Filtrar' : 'Filtros disponíveis na aba Todos'}
                                    className="relative text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                                >
                                    <Filter size={20} strokeWidth={1.5} />
                                    {hasExtraFilters && (
                                        <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand" />
                                    )}
                                </button>

                                {filterPanelOpen && activeTab === 'all' && (
                                    <div className="absolute right-0 top-full mt-2 w-64 bg-card border border-border rounded-xl shadow-lg p-4 z-30 flex flex-col gap-4">
                                        <div className="flex items-center justify-between">
                                            <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                                                Filtros
                                            </p>
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
                                                onChange={(e) => setFilterStatus(e.target.value as ReservationStatus | '')}
                                                className="px-3 py-1.5 text-sm bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors"
                                            >
                                                <option value="">Todos os status</option>
                                                {EXTRA_STATUS_OPTIONS.map((opt) => (
                                                    <option key={opt.value} value={opt.value}>
                                                        {opt.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="flex flex-col gap-1.5">
                                            <label className="text-xs font-medium text-foreground">Dia</label>
                                            <input
                                                type="date"
                                                value={filterDate}
                                                onChange={(e) => setFilterDate(e.target.value)}
                                                className="px-3 py-1.5 text-sm bg-input-background border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors"
                                            />
                                        </div>

                                        {hasExtraFilters && (
                                            <button
                                                onClick={() => {
                                                    setFilterStatus('');
                                                    setFilterDate('');
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
                                    { value: 'pending', label: 'Pendentes', count: items.filter((r) => r.status === 'pending').length },
                                    { value: 'all', label: 'Todos', count: items.length },
                                ]}
                            />
                        </div>

                        <div className="flex-1 min-h-0 overflow-y-auto custom-scrollbar -mx-4 md:-mx-6">
                            {isLoading ? (
                                <p className="px-4 md:px-6 text-sm text-muted-foreground">Carregando...</p>
                            ) : filteredItems.length === 0 ? (
                                <p className="px-4 md:px-6 text-sm text-muted-foreground">Nenhuma reserva encontrada.</p>
                            ) : (
                                filteredItems.map((res) => (
                                    <div
                                        key={res.id}
                                        onClick={() => setSelectedId(res.id)}
                                        className={`p-4 md:p-6 cursor-pointer transition-colors border-b border-border relative
                                            ${selectedId === res.id ? 'bg-background border-l-[3px] border-l-brand' : 'bg-card hover:bg-accent/20 border-l-[3px] border-l-transparent'}
                                        `}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <StatusBadge status={res.status} />
                                            <span className="text-[11px] text-muted-foreground font-medium">
                                                {formatDate(res.created_at)}
                                            </span>
                                        </div>
                                        <h4 className="font-bold text-sm text-foreground mb-1 leading-tight">
                                            {res.common_area?.name ?? 'Área removida'}
                                        </h4>
                                        <p className="text-[11px] text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                                            Reserva solicitada por {res.user?.full_name ?? 'morador'} para{' '}
                                            {formatDate(res.start_time)} ({formatTimeRange(res.start_time, res.end_time)}).
                                        </p>
                                        <div className="flex items-center justify-between">
                                            <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-accent text-[10px] font-bold text-muted-foreground uppercase rounded">
                                                {res.unit ? `Unidade ${res.unit.number}` : '—'}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div
                    className={`
                    flex-1 min-h-0 flex flex-col bg-background min-w-0 relative
                    ${!selectedId ? 'hidden lg:flex' : 'flex'}
                `}
                >
                    <button
                        onClick={() => setSelectedId(null)}
                        className="lg:hidden absolute top-4 left-4 p-2 cursor-pointer text-brand font-bold flex items-center gap-1 z-20"
                    >
                        &lsaquo; Voltar
                    </button>

                    <div className="flex-1 min-h-0 overflow-y-auto p-6 md:p-8 lg:p-12 custom-scrollbar bg-background">
                        {selectedRes ? (
                            <div className="w-full">
                                <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
                                    <div>
                                        <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">
                                            {selectedRes.common_area?.name ?? 'Área removida'}
                                        </h1>
                                        <StatusBadge status={selectedRes.status} />
                                    </div>

                                    <div className="flex items-center gap-3 shrink-0 mt-2 md:mt-0 flex-wrap">
                                        {selectedRes.status === 'pending' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(selectedRes, 'denied')}
                                                    disabled={actioningId === selectedRes.id}
                                                    className="flex items-center gap-2 px-5 py-2.5 cursor-pointer bg-background border border-destructive/40 text-destructive text-sm font-bold rounded-xl hover:bg-destructive/10 transition-colors disabled:opacity-50 shadow-sm"
                                                >
                                                    <X size={16} strokeWidth={2.5} /> Recusar
                                                </button>
                                                <button
                                                    onClick={() => handleAction(selectedRes, 'confirmed')}
                                                    disabled={actioningId === selectedRes.id}
                                                    className="flex items-center gap-2 px-6 py-2.5 cursor-pointer bg-success text-white text-sm font-bold rounded-xl hover:bg-success/90 transition-colors shadow-sm disabled:opacity-50"
                                                >
                                                    <Check size={16} strokeWidth={2.5} /> Aprovar
                                                </button>
                                            </>
                                        )}
                                        {selectedRes.status === 'confirmed' && (
                                            <>
                                                <button
                                                    onClick={() => handleAction(selectedRes, 'canceled')}
                                                    disabled={actioningId === selectedRes.id}
                                                    className="flex items-center gap-2 px-5 py-2.5 cursor-pointer bg-background border border-destructive/40 text-destructive text-sm font-bold rounded-xl hover:bg-destructive/10 transition-colors disabled:opacity-50 shadow-sm"
                                                >
                                                    <X size={16} strokeWidth={2.5} /> Cancelar
                                                </button>
                                                <button
                                                    onClick={() => handleAction(selectedRes, 'completed')}
                                                    disabled={actioningId === selectedRes.id}
                                                    className="flex items-center gap-2 px-6 py-2.5 cursor-pointer bg-success text-white text-sm font-bold rounded-xl hover:bg-success/90 transition-colors shadow-sm disabled:opacity-50"
                                                >
                                                    <Check size={16} strokeWidth={2.5} /> Marcar como concluída
                                                </button>
                                            </>
                                        )}
                                    </div>
                                </div>

                                {actionError && <p className="text-sm text-destructive mb-6">{actionError}</p>}

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                    <div className="bg-background border-2 border-slate-100 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
                                        <div className="w-12 h-12 rounded-full bg-brand/5 text-brand flex items-center justify-center shrink-0">
                                            <CalendarIcon size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">
                                                Data
                                            </p>
                                            <p className="text-base font-bold text-foreground">
                                                {formatDate(selectedRes.start_time)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="bg-background border-2 border-slate-100 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
                                        <div className="w-12 h-12 rounded-full bg-brand/5 text-brand flex items-center justify-center shrink-0">
                                            <Clock size={24} strokeWidth={1.5} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">
                                                Horário
                                            </p>
                                            <p className="text-base font-bold text-foreground">
                                                {formatTimeRange(selectedRes.start_time, selectedRes.end_time)}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-4 mb-12">
                                    <div className="flex-1 min-w-[160px] bg-accent/30 rounded-2xl p-6 text-center border border-slate-100">
                                        <Users size={18} className="text-brand mx-auto mb-2" />
                                        <p className="text-[11px] text-muted-foreground mb-1 font-bold uppercase tracking-wider">
                                            Capacidade
                                        </p>
                                        <p className="text-xl font-bold text-foreground">
                                            {selectedRes.common_area?.capacity
                                                ? `${selectedRes.common_area.capacity} Pessoas`
                                                : '—'}
                                        </p>
                                    </div>
                                    <div className="flex-1 min-w-[160px] bg-accent/30 rounded-2xl p-6 text-center border border-slate-100">
                                        <Tag size={18} className="text-brand mx-auto mb-2" />
                                        <p className="text-[11px] text-muted-foreground mb-1 font-bold uppercase tracking-wider">
                                            Taxa de Uso
                                        </p>
                                        <p className="text-xl font-bold text-foreground">
                                            {selectedRes.common_area?.booking_rules?.fee
                                                ? `R$ ${selectedRes.common_area.booking_rules.fee.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`
                                                : 'Gratuito'}
                                        </p>
                                    </div>
                                    <div className="flex-1 min-w-[160px] bg-accent/30 rounded-2xl p-6 text-center border border-slate-100">
                                        <ShieldCheck size={18} className="text-brand mx-auto mb-2" />
                                        <p className="text-[11px] text-muted-foreground mb-1 font-bold uppercase tracking-wider">
                                            Aprovação
                                        </p>
                                        <p className="text-xl font-bold text-foreground">
                                            {selectedRes.common_area?.booking_rules?.requires_approval ? 'Manual' : 'Automática'}
                                        </p>
                                    </div>
                                </div>

                                {timelineRange && (
                                    <div className="mb-12 bg-background border-2 border-slate-100 rounded-2xl p-6 shadow-sm">
                                        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-6">
                                            Disponibilidade do Dia ({formatDate(selectedRes.start_time)})
                                        </h3>
                                        <div className="relative w-full h-12 bg-accent/40 rounded-xl overflow-hidden">
                                            {dayReservations.map((res) => (
                                                <div
                                                    key={res.id}
                                                    title={`${res.unit ? `Unidade ${res.unit.number} · ` : ''}${formatTimeRange(res.start_time, res.end_time)} · ${STATUS_LABELS[res.status]}`}
                                                    style={timelineBlockStyle(res, timelineRange)}
                                                    className={`absolute top-0.5 bottom-0.5 rounded-md flex items-center justify-center px-1 transition-all
                                                        ${STATUS_BAR_COLORS[res.status]}
                                                        ${res.id === selectedRes.id ? 'ring-2 ring-brand z-10' : ''}
                                                    `}
                                                >
                                                    <span className="text-[10px] font-bold text-white uppercase tracking-wider truncate">
                                                        {res.id === selectedRes.id ? 'Selecionada' : STATUS_LABELS[res.status]}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="relative w-full h-4 mt-3">
                                            <span className="absolute left-0 text-[11px] text-muted-foreground font-medium">
                                                {minutesToHM(timelineRange.opens)}
                                            </span>
                                            <span className="absolute right-0 text-[11px] text-muted-foreground font-medium">
                                                {minutesToHM(timelineRange.closes)}
                                            </span>
                                            {timeMarks.map(({ minute, isSelected }) => (
                                                <span
                                                    key={`label-${minute}`}
                                                    className={`absolute -translate-x-1/2 text-[11px] font-medium whitespace-nowrap ${
                                                        isSelected ? 'text-brand font-bold' : 'text-muted-foreground'
                                                    }`}
                                                    style={{ left: `${tickPercent(minute, timelineRange)}%` }}
                                                >
                                                    {minutesToHM(minute)}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedRes.notes && (
                                    <div className="mb-12">
                                        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-3">
                                            Observações
                                        </h3>
                                        <div className="p-4 bg-accent/30 rounded-xl italic text-sm text-foreground leading-relaxed border border-border/50">
                                            {selectedRes.notes}
                                        </div>
                                    </div>
                                )}

                                {otherSameDay.length > 0 && (
                                    <>
                                        <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                                            <Clock size={14} /> Outras reservas no dia
                                        </h3>
                                        <div className="space-y-4">
                                            {otherSameDay.map((other) => (
                                                <div
                                                    key={other.id}
                                                    className="flex justify-between items-center p-5 border-2 border-slate-100 rounded-2xl bg-background shadow-sm"
                                                >
                                                    <div>
                                                        <h4 className="font-bold text-base text-foreground mb-1.5">
                                                            {formatTimeRange(other.start_time, other.end_time)}
                                                        </h4>
                                                        <p className="text-[13px] text-muted-foreground font-medium">
                                                            {other.unit ? `Unidade ${other.unit.number}` : '—'}
                                                        </p>
                                                    </div>
                                                    <StatusBadge status={other.status} />
                                                </div>
                                            ))}
                                        </div>
                                    </>
                                )}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center text-center p-12">
                                <div className="w-16 h-16 rounded-full bg-accent text-muted-foreground flex items-center justify-center mb-4">
                                    <CalendarIcon size={32} />
                                </div>
                                <p className="text-sm text-muted-foreground">Selecione uma reserva para visualizar detalhes</p>
                            </div>
                        )}
                    </div>
                </div>

                {selectedRes && (
                    <div className="w-[300px] bg-card p-6 shrink-0 overflow-y-auto custom-scrollbar hidden lg:block border-l border-border">
                        <div className="space-y-6">
                            <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-6">
                                Solicitante
                            </h3>

                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-base shrink-0">
                                    {(selectedRes.user?.full_name ?? '??')
                                        .split(' ')
                                        .slice(0, 2)
                                        .map((p) => p[0]?.toUpperCase())
                                        .join('')}
                                </div>
                                <div>
                                    <p className="font-bold text-sm text-foreground leading-tight mb-1">
                                        {selectedRes.user?.full_name ?? 'Morador'}
                                    </p>
                                    {selectedRes.unit && (
                                        <span className="inline-block px-2 py-0.5 bg-brand/10 text-brand rounded text-[10px] font-bold uppercase tracking-wider">
                                            Unidade {selectedRes.unit.number}
                                            {selectedRes.unit.floor ? ` · ${selectedRes.unit.floor}º andar` : ''}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {selectedRes.user?.phone_number && (
                                <div className="flex items-start gap-3 text-sm border-t border-border pt-4">
                                    <Phone size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                                    <div>
                                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">
                                            Telefone
                                        </p>
                                        <p className="font-medium text-foreground">{selectedRes.user.phone_number}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
