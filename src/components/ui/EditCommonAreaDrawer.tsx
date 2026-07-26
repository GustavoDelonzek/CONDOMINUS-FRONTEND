import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import type { BackendCommonArea, BookingRules } from '../../services/commonAreaService';

interface EditCommonAreaDrawerProps {
    area: BackendCommonArea | null;
    onClose: () => void;
    onSubmit: (payload: { name: string; booking_rules: BookingRules }) => Promise<void>;
}

const EMPTY_RULES: BookingRules = {
    opens_at: '',
    closes_at: '',
    min_advance_hours: null,
    max_duration_hours: null,
    max_reservations_per_unit_per_month: null,
    requires_approval: false,
    fee: null,
};

function toFormRules(rules: BookingRules | null): BookingRules {
    return { ...EMPTY_RULES, ...(rules ?? {}) };
}

export function EditCommonAreaDrawer({ area, onClose, onSubmit }: EditCommonAreaDrawerProps) {
    const [name, setName] = useState('');
    const [rules, setRules] = useState<BookingRules>(EMPTY_RULES);
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    useEffect(() => {
        if (area) {
            setName(area.name);
            setRules(toFormRules(area.booking_rules));
            setSubmitError(null);
        }
    }, [area]);

    function updateRule<K extends keyof BookingRules>(key: K, value: BookingRules[K]) {
        setRules((prev) => ({ ...prev, [key]: value }));
    }

    async function handleSubmit() {
        setSubmitting(true);
        setSubmitError(null);
        try {
            await onSubmit({
                name,
                booking_rules: {
                    opens_at: rules.opens_at || null,
                    closes_at: rules.closes_at || null,
                    min_advance_hours: rules.min_advance_hours,
                    max_duration_hours: rules.max_duration_hours,
                    max_reservations_per_unit_per_month: rules.max_reservations_per_unit_per_month,
                    requires_approval: rules.requires_approval,
                    fee: rules.fee,
                },
            });
        } catch {
            setSubmitError('Não foi possível salvar as alterações.');
        } finally {
            setSubmitting(false);
        }
    }

    const open = !!area;

    return (
        <>
            <div
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            />

            <aside
                className={`
                    fixed top-0 right-0 h-full w-full sm:w-[420px] bg-card border-l border-border
                    z-50 flex flex-col shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${open ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-border">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Editar Área Comum</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">{area?.name}</p>
                    </div>
                    <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors mt-0.5">
                        <X size={18} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
                    <Field label="Nome">
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    <div className="pt-2 border-t border-border">
                        <p className="text-xs font-bold uppercase tracking-wider text-brand mb-4">Regras de Reserva</p>

                        <div className="grid grid-cols-2 gap-4">
                            <Field label="Abre às">
                                <input
                                    type="time"
                                    value={rules.opens_at ?? ''}
                                    onChange={(e) => updateRule('opens_at', e.target.value)}
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Fecha às">
                                <input
                                    type="time"
                                    value={rules.closes_at ?? ''}
                                    onChange={(e) => updateRule('closes_at', e.target.value)}
                                    className={inputClass}
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <Field label="Antecedência mínima (h)">
                                <input
                                    type="number"
                                    min={0}
                                    value={rules.min_advance_hours ?? ''}
                                    onChange={(e) => updateRule('min_advance_hours', e.target.value ? Number(e.target.value) : null)}
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Duração máxima (h)">
                                <input
                                    type="number"
                                    min={1}
                                    value={rules.max_duration_hours ?? ''}
                                    onChange={(e) => updateRule('max_duration_hours', e.target.value ? Number(e.target.value) : null)}
                                    className={inputClass}
                                />
                            </Field>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                            <Field label="Limite por unidade/mês">
                                <input
                                    type="number"
                                    min={1}
                                    value={rules.max_reservations_per_unit_per_month ?? ''}
                                    onChange={(e) =>
                                        updateRule('max_reservations_per_unit_per_month', e.target.value ? Number(e.target.value) : null)
                                    }
                                    className={inputClass}
                                />
                            </Field>
                            <Field label="Taxa (R$)">
                                <input
                                    type="number"
                                    min={0}
                                    step="0.01"
                                    value={rules.fee ?? ''}
                                    onChange={(e) => updateRule('fee', e.target.value ? Number(e.target.value) : null)}
                                    className={inputClass}
                                />
                            </Field>
                        </div>

                        <label className="flex items-center gap-2 mt-4 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={!!rules.requires_approval}
                                onChange={(e) => updateRule('requires_approval', e.target.checked)}
                                className="w-4 h-4 rounded border-border text-brand focus:ring-brand/30"
                            />
                            <span className="text-sm text-foreground">Requer aprovação do síndico</span>
                        </label>
                    </div>

                    {submitError && <p className="text-xs text-destructive">{submitError}</p>}
                </div>

                <div className="px-6 py-4 border-t border-border flex items-center gap-3">
                    <button
                        onClick={handleSubmit}
                        disabled={submitting || !name.trim()}
                        className="flex-1 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {submitting ? 'Salvando...' : 'Salvar Alterações'}
                    </button>
                    <button
                        onClick={onClose}
                        disabled={submitting}
                        className="px-5 py-2.5 border border-border text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors disabled:opacity-50"
                    >
                        Cancelar
                    </button>
                </div>
            </aside>
        </>
    );
}

const inputClass =
    'w-full px-3 py-2 text-sm bg-input-background border border-border rounded-lg ' +
    'text-foreground placeholder:text-muted-foreground ' +
    'focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand/60 transition-colors';

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium text-foreground">{label}</label>
            {children}
        </div>
    );
}
