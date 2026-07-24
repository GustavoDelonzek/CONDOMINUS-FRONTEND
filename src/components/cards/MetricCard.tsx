import type { ReactNode } from 'react';

interface MetricCardProps {
    label: string;
    value: string;
    trend: string;
    trendLabel: string;
    icon: ReactNode;
    iconBg?: string;
}

export function MetricCard({
    label,
    value,
    trend,
    trendLabel,
    icon,
    iconBg = 'bg-accent',
}: MetricCardProps) {
    return (
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col gap-4 shadow-sm">
            <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                    <span className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                        {label}
                    </span>
                    <span className="text-3xl font-bold text-foreground leading-none mt-1">
                        {value}
                    </span>
                </div>
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                    {icon}
                </div>
            </div>

            <p className="text-xs text-muted-foreground flex items-center gap-1">
                <span className="text-success font-semibold">↑ {trend}</span>
                {trendLabel}
            </p>
        </div>
    );
}
