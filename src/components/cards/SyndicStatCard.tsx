import type { ReactNode } from 'react';

interface SyndicStatCardProps {
    icon: ReactNode;
    iconBgClass?: string;
    iconColorClass?: string;
    topRightElement?: ReactNode;
    label: string;
    value: string;
    subValue?: string;
    barColorClass?: string;
    barWidth?: string;
}

export function SyndicStatCard({
    icon,
    iconBgClass = 'bg-blue-50',
    iconColorClass = 'text-blue-600',
    topRightElement,
    label,
    value,
    subValue,
    barColorClass = 'bg-blue-600',
    barWidth = 'w-full',
}: SyndicStatCardProps) {
    return (
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col justify-between shadow-sm min-h-[160px] relative overflow-hidden">
            <div className="flex items-start justify-between w-full">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${iconBgClass} ${iconColorClass}`}>
                    {icon}
                </div>
                {topRightElement && (
                    <div className="text-right">
                        {topRightElement}
                    </div>
                )}
            </div>

            <div className="mt-6 flex flex-col gap-1">
                 <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {label}
                </span>
                <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-bold text-foreground leading-none">
                        {value}
                    </span>
                </div>
                {subValue && (
                     <span className="text-xs text-muted-foreground mt-1">
                         {subValue}
                     </span>
                )}
            </div>

            {/* Bottom Bar */}
            <div className={`absolute bottom-0 left-6 right-6 h-1 rounded-t-sm ${barColorClass} ${barWidth} max-w-[calc(100%-3rem)]`} />
        </div>
    );
}
