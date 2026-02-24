import { Eye, ArrowLeftRight } from 'lucide-react';

type PlanType = 'Premium' | 'Basic';
type ApiStatus = 'Connected' | 'Disconnected';

interface Condominium {
    id: string;
    initials: string;
    initialsColor: string;
    name: string;
    syndicateName: string;
    syndicateAvatar?: string;
    planType: PlanType;
    apiStatus: ApiStatus;
}

interface CondominiumTableProps {
    data: Condominium[];
    total: number;
    page: number;
    pageSize: number;
    onPrev: () => void;
    onNext: () => void;
    onAddCondominium?: () => void;
}

const PLAN_STYLES: Record<PlanType, string> = {
    Premium: 'bg-blue-50 text-blue-600 border border-blue-200',
    Basic: 'bg-accent text-muted-foreground border border-border',
};

const STATUS_STYLES: Record<ApiStatus, { dot: string; text: string }> = {
    Connected: { dot: 'bg-green-500', text: 'text-green-600' },
    Disconnected: { dot: 'bg-red-500', text: 'text-destructive' },
};

function InitialsAvatar({ initials, color }: { initials: string; color: string }) {
    return (
        <div
            className="w-9 h-9 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
            style={{ backgroundColor: color }}
        >
            {initials}
        </div>
    );
}

export function CondominiumTable({
    data,
    total,
    page,
    pageSize,
    onPrev,
    onNext,
    onAddCondominium,
}: CondominiumTableProps) {
    const from = (page - 1) * pageSize + 1;
    const to = Math.min(page * pageSize, total);

    return (
        <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
            {/* Table Header */}
            <div className="flex items-start justify-between px-6 py-5 border-b border-border">
                <div>
                    <h2 className="text-base font-semibold text-foreground">
                        Recent Condominium Activity
                    </h2>
                    <p className="text-xs text-muted-foreground mt-0.5">
                        Real-time status of connected properties.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-3 py-1.5 text-sm text-muted-foreground border border-border rounded-lg hover:bg-accent transition-colors">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.75} d="M3 6h18M7 12h10M11 18h2" />
                        </svg>
                        Filter
                    </button>
                    <button
                        onClick={onAddCondominium}
                        className="flex items-center gap-2 px-4 py-1.5 text-sm font-semibold text-white bg-brand rounded-lg hover:opacity-90 transition-opacity"
                    >
                        + Add Condominium
                    </button>
                </div>
            </div>

            {/* Column Headers */}
            <div className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] px-6 py-3 bg-accent/40 border-b border-border">
                {['Building Name', 'Syndicate Name', 'Plan Type', 'API Status', 'Actions'].map((col) => (
                    <span key={col} className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        {col}
                    </span>
                ))}
            </div>

            {/* Rows */}
            <div className="divide-y divide-border">
                {data.map((condo) => {
                    const status = STATUS_STYLES[condo.apiStatus];
                    const plan = PLAN_STYLES[condo.planType];

                    return (
                        <div
                            key={condo.id}
                            className="grid grid-cols-[2fr_1.5fr_1fr_1fr_auto] items-center px-6 py-4 hover:bg-accent/30 transition-colors"
                        >
                            {/* Building */}
                            <div className="flex items-center gap-3">
                                <InitialsAvatar initials={condo.initials} color={condo.initialsColor} />
                                <div>
                                    <p className="text-sm font-semibold text-foreground">{condo.name}</p>
                                    <p className="text-xs text-muted-foreground">{condo.id}</p>
                                </div>
                            </div>

                            {/* Syndicate */}
                            <div className="flex items-center gap-2">
                                <img
                                    src={condo.syndicateAvatar ?? `https://ui-avatars.com/api/?name=${encodeURIComponent(condo.syndicateName)}&size=32&background=e9ebef&color=717182`}
                                    alt={condo.syndicateName}
                                    className="w-8 h-8 rounded-full object-cover"
                                />
                                <span className="text-sm text-foreground">{condo.syndicateName}</span>
                            </div>

                            {/* Plan */}
                            <div>
                                <span className={`inline-block px-2.5 py-0.5 text-xs font-medium rounded-md ${plan}`}>
                                    {condo.planType}
                                </span>
                            </div>

                            {/* Status */}
                            <div className="flex items-center gap-1.5">
                                <span className={`w-2 h-2 rounded-full shrink-0 ${status.dot}`} />
                                <span className={`text-sm font-medium ${status.text}`}>{condo.apiStatus}</span>
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <button className="text-muted-foreground hover:text-foreground transition-colors" title="View">
                                    <Eye size={16} />
                                </button>
                                <button className="text-muted-foreground hover:text-foreground transition-colors" title="Manage">
                                    <ArrowLeftRight size={16} />
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer / Pagination */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-border">
                <p className="text-xs text-muted-foreground">
                    Showing <span className="font-semibold text-foreground">{from}</span> to{' '}
                    <span className="font-semibold text-foreground">{to}</span> of{' '}
                    <span className="font-semibold text-foreground">{total.toLocaleString()}</span> results
                </p>
                <div className="flex items-center gap-2">
                    <button
                        onClick={onPrev}
                        disabled={page <= 1}
                        className="px-4 py-1.5 text-sm border border-border rounded-lg text-foreground hover:bg-accent disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                    >
                        Previous
                    </button>
                    <button
                        onClick={onNext}
                        disabled={to >= total}
                        className="px-4 py-1.5 text-sm bg-brand text-white rounded-lg hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
}
