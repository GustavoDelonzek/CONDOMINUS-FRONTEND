import { Search, Filter, Download, MoreVertical, Plus } from 'lucide-react';

// --- Mock Data ---
interface Resident {
    id: string;
    name: string;
    email: string;
    avatarInitials: string;
    avatarColor: string;
    avatarBg: string;
    unit: string;
    block: string;
    phone: string;
    profile: 'Proprietário' | 'Inquilino';
    status: 'Ativo' | 'Bloqueado';
}

const MOCK_RESIDENTS: Resident[] = [
    {
        id: '1',
        name: 'Carlos Mendes',
        email: 'carlos.mendes@email.com',
        avatarInitials: 'CM',
        avatarColor: 'text-blue-600',
        avatarBg: 'bg-blue-100',
        unit: 'Ap. 304',
        block: 'Bloco A',
        phone: '(11) 9****-8821',
        profile: 'Proprietário',
        status: 'Ativo',
    },
    {
        id: '2',
        name: 'Fernanda Lima',
        email: 'fernanda.l@email.com',
        avatarInitials: 'FL',
        avatarColor: 'text-blue-600',
        avatarBg: 'bg-blue-100',
        unit: 'Ap. 102',
        block: 'Bloco B',
        phone: '(11) 9****-4532',
        profile: 'Inquilino',
        status: 'Ativo',
    },
    {
        id: '3',
        name: 'Roberto Dias',
        email: 'roberto.dias@email.com',
        avatarInitials: 'RD',
        avatarColor: 'text-blue-600',
        avatarBg: 'bg-blue-100',
        unit: 'Ap. 202',
        block: 'Bloco A',
        phone: '(11) 9****-1290',
        profile: 'Proprietário',
        status: 'Bloqueado',
    },
    {
        id: '4',
        name: 'Juliana Silva',
        email: 'juliana.silva@email.com',
        avatarInitials: 'JS',
        avatarColor: 'text-blue-600',
        avatarBg: 'bg-blue-100',
        unit: 'Ap. 501',
        block: 'Bloco B',
        phone: '(11) 9****-9988',
        profile: 'Inquilino',
        status: 'Ativo',
    },
    {
        id: '5',
        name: 'Marcelo Pereira',
        email: 'marcelo.p@email.com',
        avatarInitials: 'MP',
        avatarColor: 'text-blue-600',
        avatarBg: 'bg-blue-100',
        unit: 'Ap. 104',
        block: 'Bloco A',
        phone: '(11) 9****-3321',
        profile: 'Proprietário',
        status: 'Ativo',
    },
];

// --- Simple Badge Component ---
function Badge({ variant, children }: { variant: 'Proprietário' | 'Inquilino' | 'Ativo' | 'Bloqueado', children: React.ReactNode }) {
    const styles = {
        'Proprietário': 'bg-blue-50 text-blue-600',
        'Inquilino': 'bg-purple-50 text-purple-600',
        'Ativo': 'bg-green-50 text-green-600',
        'Bloqueado': 'bg-red-50 text-red-600',
    };

    return (
        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${styles[variant]}`}>
            {children}
        </span>
    );
}

// --- Main Page Component ---
export function Residents() {
    return (
        <div className="flex flex-col gap-6 h-full p-6 bg-background">

            <div className="flex-1 w-full overflow-y-auto pr-2 custom-scrollbar">
                <div className="w-full min-h-full flex flex-col">

                    {/* Page Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">Moradores e Unidades</h1>
                            <p className="text-muted-foreground mt-1 text-sm">Gerencie o cadastro de moradores, proprietários e inquilinos.</p>
                        </div>
                        <button className="bg-brand text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-brand/90 transition-colors shadow-sm shrink-0">
                            <Plus size={18} />
                            Novo Morador
                        </button>
                    </div>

                    {/* Toolbar: Search & Actions */}
                    <div className="flex flex-col md:flex-row gap-4 mb-6 bg-card p-2 rounded-xl border border-border shadow-sm">
                        <div className="relative flex-1">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search size={18} className="text-muted-foreground" />
                            </div>
                            <input
                                type="text"
                                placeholder="Buscar por nome ou apartamento"
                                className="w-full pl-10 pr-4 py-2 bg-transparent border-none focus:ring-0 text-sm outline-none text-foreground placeholder:text-muted-foreground/70"
                            />
                        </div>
                        <div className="flex items-center gap-2 px-2 md:px-0">
                            <div className="w-px h-6 bg-border hidden md:block mx-2"></div>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg bg-card hover:bg-accent transition-colors text-foreground shadow-sm">
                                <Filter size={16} />
                                Filtros
                            </button>
                            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium border border-border rounded-lg bg-card hover:bg-accent transition-colors text-foreground shadow-sm">
                                <Download size={16} />
                                Exportar
                            </button>
                        </div>
                    </div>

                    {/* Data Table */}
                    <div className="bg-card border border-border rounded-2xl shadow-sm overflow-hidden flex flex-col flex-1">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm whitespace-nowrap">
                                <thead className="bg-accent/50 text-xs text-muted-foreground uppercase tracking-wider font-semibold border-b border-border">
                                    <tr>
                                        <th className="px-6 py-4">Nome</th>
                                        <th className="px-6 py-4">Unidade/Bloco</th>
                                        <th className="px-6 py-4">Contato</th>
                                        <th className="px-6 py-4">Perfil</th>
                                        <th className="px-6 py-4">Status</th>
                                        <th className="px-6 py-4 text-right">Ações</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-border">
                                    {MOCK_RESIDENTS.map((resident) => (
                                        <tr key={resident.id} className="hover:bg-accent/30 transition-colors">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${resident.avatarBg} ${resident.avatarColor}`}>
                                                        {resident.avatarInitials}
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold text-foreground">{resident.name}</p>
                                                        <p className="text-xs text-muted-foreground mt-0.5">{resident.email}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="font-semibold text-foreground">{resident.unit}</p>
                                                <p className="text-xs text-muted-foreground mt-0.5">{resident.block}</p>
                                            </td>
                                            <td className="px-6 py-4 text-muted-foreground font-medium">
                                                {resident.phone}
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={resident.profile}>{resident.profile}</Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={resident.status}>{resident.status}</Badge>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors">
                                                    <MoreVertical size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination Footer */}
                        <div className="px-6 py-4 border-t border-border flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">
                                Mostrando 1 a 5 de 47 resultados
                            </span>
                            <div className="flex gap-2">
                                <button className="px-4 py-2 border border-border rounded-lg font-medium text-foreground hover:bg-accent transition-colors shadow-sm disabled:opacity-50" disabled>
                                    Anterior
                                </button>
                                <button className="px-4 py-2 border border-border rounded-lg font-medium text-foreground hover:bg-accent transition-colors shadow-sm">
                                    Próximo
                                </button>
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
