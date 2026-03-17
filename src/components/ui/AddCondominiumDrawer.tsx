import { X, Search, Loader2, User, UserSearch } from 'lucide-react';
import React, { useState } from 'react';
import { fetchCep } from '../../services/cepService';

interface AddCondominiumDrawerProps {
    open: boolean;
    onClose: () => void;
    onSubmit?: (data: CondominiumFormData) => void;
}

export interface CondominiumFormData {
    name: string;
    cep: string;
    logradouro: string;
    numero: string;
    bairro: string;
    cidade: string;
    estado: string;
}

const ESTADOS_BR = [
    'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA',
    'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN',
    'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
];

const EMPTY_FORM: CondominiumFormData = {
    name: '', cep: '',
    logradouro: '', numero: '', bairro: '',
    cidade: '', estado: '',
};

export function AddCondominiumDrawer({ open, onClose, onSubmit }: AddCondominiumDrawerProps) {
    const [form, setForm] = useState<CondominiumFormData>(EMPTY_FORM);
    const [cepLoading, setCepLoading] = useState(false);
    const [cepError, setCepError] = useState<string | null>(null);
    const [contactSearch, setContactSearch] = useState('');

    function handleChange(field: keyof CondominiumFormData, value: string) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    async function handleCepChange(raw: string) {
        const digits = raw.replace(/\D/g, '').slice(0, 8);
        const formatted = digits.length > 5
            ? `${digits.slice(0, 5)}-${digits.slice(5)}`
            : digits;

        setForm((prev) => ({ ...prev, cep: formatted }));
        setCepError(null);

        if (digits.length === 8) {
            setCepLoading(true);
            try {
                const data = await fetchCep(digits);
                setForm((prev) => ({
                    ...prev,
                    logradouro: data.street ?? prev.logradouro,
                    bairro: data.neighborhood ?? prev.bairro,
                    cidade: data.city ?? prev.cidade,
                    estado: data.state ?? prev.estado,
                }));
            } catch {
                setCepError('CEP não encontrado.');
            } finally {
                setCepLoading(false);
            }
        }
    }

    function handleSubmit() {
        onSubmit?.(form);
        setForm(EMPTY_FORM);
        setContactSearch('');
        setCepError(null);
        onClose();
    }

    function handleCancel() {
        setForm(EMPTY_FORM);
        setContactSearch('');
        setCepError(null);
        onClose();
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className={`fixed inset-0 bg-black/30 z-40 transition-opacity duration-300 ${open ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={handleCancel}
            />

            {/* Drawer */}
            <aside
                className={`
                    fixed top-0 right-0 h-full w-[360px] bg-card border-l border-border
                    z-50 flex flex-col shadow-2xl
                    transition-transform duration-300 ease-in-out
                    ${open ? 'translate-x-0' : 'translate-x-full'}
                `}
            >
                {/* Header */}
                <div className="flex items-start justify-between px-6 pt-6 pb-5 border-b border-border">
                    <div>
                        <h2 className="text-base font-semibold text-foreground">Novo Condomínio</h2>
                        <p className="text-xs text-muted-foreground mt-0.5">Add a new property to the system.</p>
                    </div>
                    <button
                        onClick={handleCancel}
                        className="text-muted-foreground hover:text-foreground transition-colors mt-0.5"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">

                    {/* Condominium Name */}
                    <Field label="Condominium Name">
                        <input
                            type="text"
                            placeholder="e.g. Ocean View Towers"
                            value={form.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    {/* CEP */}
                    <Field label="CEP" hint={cepError ?? undefined}>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="00000-000"
                                value={form.cep}
                                onChange={(e) => handleCepChange(e.target.value)}
                                maxLength={9}
                                className={`${inputClass} pr-9 ${cepError ? 'border-destructive focus:border-destructive focus:ring-destructive/30' : ''}`}
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                {cepLoading
                                    ? <Loader2 size={14} className="animate-spin" />
                                    : <Search size={14} />
                                }
                            </span>
                        </div>
                        {cepError && (
                            <p className="text-xs text-destructive">{cepError}</p>
                        )}
                    </Field>

                    {/* Logradouro + Número */}
                    <div className="grid grid-cols-[1fr_80px] gap-3">
                        <Field label="Logradouro">
                            <input
                                type="text"
                                placeholder="Rua..."
                                value={form.logradouro}
                                onChange={(e) => handleChange('logradouro', e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Número">
                            <input
                                type="text"
                                placeholder="123"
                                value={form.numero}
                                onChange={(e) => handleChange('numero', e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                    </div>

                    {/* Bairro */}
                    <Field label="Bairro">
                        <input
                            type="text"
                            placeholder="e.g. Centro"
                            value={form.bairro}
                            onChange={(e) => handleChange('bairro', e.target.value)}
                            className={inputClass}
                        />
                    </Field>

                    {/* Cidade + Estado */}
                    <div className="grid grid-cols-[1fr_100px] gap-3">
                        <Field label="Cidade">
                            <input
                                type="text"
                                placeholder="City"
                                value={form.cidade}
                                onChange={(e) => handleChange('cidade', e.target.value)}
                                className={inputClass}
                            />
                        </Field>
                        <Field label="Estado">
                            <select
                                value={form.estado}
                                onChange={(e) => handleChange('estado', e.target.value)}
                                className={`${inputClass} appearance-none`}
                            >
                                <option value="">UF</option>
                                {ESTADOS_BR.map((uf) => (
                                    <option key={uf} value={uf}>{uf}</option>
                                ))}
                            </select>
                        </Field>
                    </div>

                    {/* Primary Contact / Syndicate */}
                    <div className="mt-2 pt-5 border-t border-border flex flex-col gap-4">
                        <div className="flex items-center gap-2 text-brand">
                            <User size={16} strokeWidth={2.5} />
                            <span className="text-xs font-bold tracking-wider uppercase">Primary Contact / Syndicate</span>
                        </div>
                        
                        <div className="border border-dashed border-border rounded-xl p-4 flex flex-col gap-3">
                            <h3 className="text-sm font-semibold text-foreground">Assign User</h3>
                            
                            <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                                    <UserSearch size={16} />
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search by name or email..."
                                    value={contactSearch}
                                    onChange={(e) => setContactSearch(e.target.value)}
                                    className={`${inputClass} pl-9`}
                                />
                            </div>

                            {/* Suggestion Card (Mock) */}
                            {contactSearch.trim().length > 0 && (
                                <div className="p-3 bg-card border border-border rounded-lg flex items-center justify-between shadow-sm mt-1">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center text-brand font-bold text-sm">
                                            JD
                                        </div>
                                        <div>
                                            <p className="text-sm font-semibold text-foreground">John Doe (Suggested)</p>
                                            <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                                        </div>
                                    </div>
                                    <button
                                        type="button"
                                        className="text-xs font-bold text-brand uppercase tracking-wider hover:opacity-80 transition-opacity"
                                    >
                                        Select
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-border flex items-center gap-3">
                    <button
                        onClick={handleSubmit}
                        className="flex-1 py-2.5 bg-brand text-white text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                    >
                        Create Condominium
                    </button>
                    <button
                        onClick={handleCancel}
                        className="px-5 py-2.5 border border-border text-sm font-medium text-foreground rounded-lg hover:bg-accent transition-colors"
                    >
                        Cancel
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

function Field({
    label,
    hint,
    children,
}: {
    label: string;
    hint?: string;
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-foreground">{label}</label>
            {children}
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
        </div>
    );
}
