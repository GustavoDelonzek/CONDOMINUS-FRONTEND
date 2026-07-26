interface SegmentedTabsOption<T extends string> {
    value: T;
    label: string;
    count: number;
}

interface SegmentedTabsProps<T extends string> {
    value: T;
    onChange: (value: T) => void;
    options: SegmentedTabsOption<T>[];
}

const GRID_COLS_CLASS: Record<number, string> = {
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
};

export function SegmentedTabs<T extends string>({ value, onChange, options }: SegmentedTabsProps<T>) {
    return (
        <div className={`grid ${GRID_COLS_CLASS[options.length] ?? 'grid-cols-2'} gap-1 bg-accent/50 rounded-xl p-1`}>
            {options.map((opt) => (
                <button
                    key={opt.value}
                    onClick={() => onChange(opt.value)}
                    className={`px-1.5 py-2 cursor-pointer rounded-lg text-[11px] sm:text-xs font-bold leading-tight text-center truncate transition-colors ${
                        value === opt.value ? 'bg-card text-brand shadow-sm' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    {opt.label} ({opt.count})
                </button>
            ))}
        </div>
    );
}
