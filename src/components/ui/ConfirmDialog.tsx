interface ConfirmDialogProps {
    open: boolean;
    title: string;
    message: string;
    confirmLabel?: string;
    cancelLabel?: string;
    danger?: boolean;
    loading?: boolean;
    onConfirm: () => void;
    onCancel: () => void;
}

export function ConfirmDialog({
    open,
    title,
    message,
    confirmLabel = 'Confirmar',
    cancelLabel = 'Cancelar',
    danger = false,
    loading = false,
    onConfirm,
    onCancel,
}: ConfirmDialogProps) {
    if (!open) return null;

    return (
        <>
            <div className="fixed inset-0 bg-black/30 z-40" onClick={onCancel} />
            <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
                <div className="bg-card border border-border rounded-2xl shadow-2xl w-full max-w-sm p-6 flex flex-col gap-4">
                    <h2 className="text-base font-semibold text-foreground">{title}</h2>
                    <p className="text-sm text-muted-foreground">{message}</p>
                    <div className="flex items-center gap-3 justify-end pt-2">
                        <button
                            type="button"
                            onClick={onCancel}
                            disabled={loading}
                            className="px-4 py-2 border border-border text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                        >
                            {cancelLabel}
                        </button>
                        <button
                            type="button"
                            onClick={onConfirm}
                            disabled={loading}
                            className={`px-4 py-2 text-sm font-semibold rounded-lg transition-opacity disabled:opacity-50 disabled:cursor-not-allowed text-white ${
                                danger ? 'bg-destructive hover:opacity-90' : 'bg-brand hover:opacity-90'
                            }`}
                        >
                            {loading ? 'Aguarde...' : confirmLabel}
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
