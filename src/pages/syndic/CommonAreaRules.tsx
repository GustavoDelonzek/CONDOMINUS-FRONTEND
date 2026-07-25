import { Search, ChevronLeft, ChevronRight, PartyPopper, Flame, Dumbbell, Trophy, Coffee, History, Plus } from 'lucide-react';
import React, { useState } from 'react';

type AreaStatus = 'Ativo' | 'Manutenção' | 'Inativo';
type ApprovalType = 'Manual' | 'Automática';

interface CommonArea {
  id: string;
  name: string;
  type: string;
  icon: any;
  iconColor: string;
  iconBg: string;
  cost: number;
  capacity: number;
  schedule: string;
  status: AreaStatus;
  approval: ApprovalType;
}

const COMMON_AREAS: CommonArea[] = [
  {
    id: '1',
    name: 'Salão de Festas',
    type: 'Principal',
    icon: PartyPopper,
    iconColor: 'text-purple-600',
    iconBg: 'bg-purple-100',
    cost: 150.00,
    capacity: 80,
    schedule: '10:00 - 23:00',
    status: 'Ativo',
    approval: 'Manual',
  },
  {
    id: '2',
    name: 'Churrasqueira',
    type: 'Externa',
    icon: Flame,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-100',
    cost: 80.00,
    capacity: 25,
    schedule: '11:00 - 22:00',
    status: 'Ativo',
    approval: 'Automática',
  },
  {
    id: '3',
    name: 'Academia',
    type: 'Fitness',
    icon: Dumbbell,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-100',
    cost: 0.00,
    capacity: 15,
    schedule: '06:00 - 23:00',
    status: 'Ativo',
    approval: 'Automática',
  },
  {
    id: '4',
    name: 'Quadra',
    type: 'Esportiva',
    icon: Trophy,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-100',
    cost: 20.00,
    capacity: 20,
    schedule: '09:00 - 22:00',
    status: 'Manutenção',
    approval: 'Manual',
  },
  {
    id: '5',
    name: 'Espaço Gourmet',
    type: 'Premium',
    icon: Coffee,
    iconColor: 'text-pink-600',
    iconBg: 'bg-pink-100',
    cost: 200.00,
    capacity: 40,
    schedule: '12:00 - 00:00',
    status: 'Inativo',
    approval: 'Manual',
  },
];

const STATUS_STYLES: Record<AreaStatus, string> = {
  Ativo: 'bg-emerald-50 text-emerald-600 border-emerald-100',
  Manutenção: 'bg-amber-50 text-amber-600 border-amber-100',
  Inativo: 'bg-slate-50 text-slate-500 border-slate-100',
};

export function CommonAreaRules() {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredAreas = COMMON_AREAS.filter(area => 
    area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    area.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-8 space-y-8 h-full overflow-y-auto custom-scrollbar">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Regras de Áreas Comuns</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Visão geral e edição rápida das configurações de instalações.
        </p>
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Buscar área..."
            value={searchTerm}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm focus:ring-2 focus:ring-brand/20 focus:border-brand transition-all"
          />
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-sm font-semibold text-muted-foreground hover:bg-accent/50 hover:text-foreground transition-all shadow-sm">
            <History size={18} />
            <span className="hidden sm:inline">Histórico</span>
          </button>
          <button className="flex items-center gap-2 px-6 py-2 bg-brand text-white rounded-lg text-sm font-bold hover:bg-brand/90 transition-all shadow-sm">
            <Plus size={20} />
            Nova Área
          </button>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden overflow-x-auto">
        <table className="w-full border-collapse whitespace-nowrap">
          <thead>
            <tr className="bg-accent/30 border-b border-border text-left">
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground w-[30%]">Área</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Custo (R$)</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Capacidade</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Horário</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
              <th className="px-6 py-4 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground text-right">Aprovação</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {filteredAreas.map((area) => (
              <tr key={area.id} className="hover:bg-accent/20 transition-colors">
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${area.iconBg} ${area.iconColor}`}>
                      <area.icon size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{area.name}</p>
                      <p className="text-xs text-muted-foreground">{area.type}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm font-medium text-foreground">
                    {area.cost.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-muted-foreground">
                    {area.capacity} pessoas
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-muted-foreground">{area.schedule}</span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${STATUS_STYLES[area.status]}`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current" />
                    {area.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right">
                  <div className="flex items-center justify-end gap-3">
                    <span className={`text-[11px] font-medium ${area.approval === 'Automática' ? 'text-brand' : 'text-muted-foreground'}`}>
                      {area.approval}
                    </span>
                    <button 
                      className={`relative w-10 h-5 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-brand/20 ${
                        area.approval === 'Automática' ? 'bg-brand' : 'bg-slate-200'
                      }`}
                    >
                      <span 
                        className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full transition-transform duration-200 ${
                          area.approval === 'Automática' ? 'translate-x-5' : 'translate-x-0'
                        }`} 
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="px-6 py-4 border-t border-border flex items-center justify-between bg-accent/10">
          <p className="text-xs text-muted-foreground">
            Mostrando <span className="font-medium text-foreground">1 a {filteredAreas.length}</span> de{' '}
            <span className="font-medium text-foreground">{filteredAreas.length}</span> áreas
          </p>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40" disabled>
              <ChevronLeft size={14} />
              Anterior
            </button>
            <button className="flex items-center gap-1 px-4 py-1.5 text-xs font-bold bg-brand/10 text-brand rounded-lg hover:bg-brand/20 transition-colors disabled:opacity-40" disabled>
              Próxima
              <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
