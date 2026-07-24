import type { LucideIcon } from 'lucide-react';

interface PlaceholderPageProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function PlaceholderPage({ icon: Icon, title, description }: PlaceholderPageProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 text-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-brand/10 text-brand flex items-center justify-center">
        <Icon size={32} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-foreground">{title}</h2>
        <p className="text-muted-foreground mt-1 max-w-sm">{description}</p>
      </div>
      <span className="text-xs font-semibold text-muted-foreground bg-accent px-3 py-1 rounded-full">
        Em desenvolvimento
      </span>
    </div>
  );
}
