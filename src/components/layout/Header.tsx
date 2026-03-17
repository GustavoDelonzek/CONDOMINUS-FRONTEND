interface HeaderProps {
    title: string;
    userName?: string;
    userRole?: string;
    userInitials?: string;
}

export function Header({
    title,
    userName = 'Gustavo Brizola',
    userRole = 'Company Admin',
    userInitials = 'GB',
}: HeaderProps) {
    return (
        <header className="h-20 flex items-center justify-between px-10 bg-transparent border-b border-border shrink-0">
            <h1 className="text-2xl font-bold text-foreground">{title}</h1>

            <div className="flex items-center gap-4">
                <div className="text-right">
                    <p className="text-sm font-bold text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground">{userRole}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
                    {userInitials}
                </div>
            </div>
        </header>
    );
}
