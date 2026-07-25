import { useState } from 'react';
import { Search, Clock, Calendar as CalendarIcon, Bell, Filter, MapPin, Phone, Mail } from 'lucide-react';
import { CommonAreaRules } from './CommonAreaRules';

type ReservationStatus = 'Aguardando Aprovação' | 'Confirmado' | 'Recusado' | 'Concluído';

interface Reservation {
  id: string;
  spaceName: string;
  status: ReservationStatus;
  date: string;
  timeRange: string;
  duration: string;
  capacity: number;
  cleaningFee: string;
  specificRule: string;
  timeAgo: string;
  unit: string;
  block: string;
  requesterName: string;
  requesterRole: string;
  requesterInitials: string;
  requesterPhone: string;
  requesterEmail: string;
  requesterStatus: 'Adimplente' | 'Inadimplente';
  reservationsMonth: string;
  infractions: string;
  observations: string;
}

const MOCK_RESERVATIONS: Reservation[] = [
  {
    id: '1',
    spaceName: 'Churrasqueira',
    status: 'Aguardando Aprovação',
    date: '15 de Outubro, 2023',
    timeRange: '12:00 - 16:00',
    duration: '4 horas',
    capacity: 30,
    cleaningFee: 'R$ 50,00',
    specificRule: 'Som até 22h',
    timeAgo: '2 min atrás',
    unit: 'Apartamento 304',
    block: 'Bloco A',
    requesterName: 'Roberto Alves',
    requesterRole: 'Proprietário',
    requesterInitials: 'RA',
    requesterPhone: '(11) 98765-4321',
    requesterEmail: 'roberto.alves@email.com',
    requesterStatus: 'Adimplente',
    reservationsMonth: '1/4',
    infractions: 'Nenhuma',
    observations: '"Vou precisar usar o freezer adicional se possível. Serão apenas familiares, cerca de 15 pessoas."'
  },
  {
    id: '2',
    spaceName: 'Quadra Pol.',
    status: 'Confirmado',
    date: '16 de Outubro, 2023',
    timeRange: '10:00 - 11:30',
    duration: '1.5 horas',
    capacity: 20,
    cleaningFee: 'R$ 0,00',
    specificRule: 'Sem chuteira de trava',
    timeAgo: '15 min atrás',
    unit: 'Apt 101',
    block: '',
    requesterName: 'Ana Silva',
    requesterRole: 'Inquilino',
    requesterInitials: 'AS',
    requesterPhone: '(11) 91234-5678',
    requesterEmail: 'ana.silva@email.com',
    requesterStatus: 'Inadimplente',
    reservationsMonth: '2/4',
    infractions: '1 Advertência',
    observations: 'Nenhuma observação.'
  },
  {
    id: '3',
    spaceName: 'Salão de Festas',
    status: 'Concluído',
    date: '21 de Outubro, 2023',
    timeRange: '14:00 - 22:00',
    duration: '8 horas',
    capacity: 100,
    cleaningFee: 'R$ 150,00',
    specificRule: 'Limpeza não inclusa',
    timeAgo: '1h atrás',
    unit: 'Apt 802',
    block: '',
    requesterName: 'Carlos Mendes',
    requesterRole: 'Proprietário',
    requesterInitials: 'CM',
    requesterPhone: '(11) 99876-1234',
    requesterEmail: 'carlos.mendes@email.com',
    requesterStatus: 'Adimplente',
    reservationsMonth: '1/2',
    infractions: 'Nenhuma',
    observations: 'Festa de aniversário infantil.'
  }
];

function StatusBadge({ status }: { status: ReservationStatus }) {
  if (status === 'Aguardando Aprovação') {
    return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-amber-600 border border-amber-200"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Pendentes</span>;
  }
  if (status === 'Confirmado') {
     return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-emerald-600 border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Confirmado</span>;
  }
  if (status === 'Recusado') {
     return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-brand border border-brand/20"><span className="w-1.5 h-1.5 rounded-full bg-brand"></span>Novo</span>;
  }
  return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider text-muted-foreground border border-border"><span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>Concluído</span>;
}

export function Reservations() {
  const [activeTab, setActiveTab] = useState<'reservations' | 'rules'>('reservations');
  const [selectedResId, setSelectedResId] = useState<string>(MOCK_RESERVATIONS[0]?.id || '');
  const selectedRes = MOCK_RESERVATIONS.find(r => r.id === selectedResId);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      <div className="flex items-center justify-between px-8 pt-4 border-b border-border bg-card shrink-0 h-[72px]">
        <div className="flex items-center gap-8 h-full">
          <button 
            onClick={() => setActiveTab('reservations')}
            className={`text-sm h-full flex items-center border-b-2 cursor-pointer transition-colors ${activeTab === 'reservations' ? 'font-bold text-brand border-brand' : 'font-semibold text-muted-foreground hover:text-foreground border-transparent'}`}
          >
            Reservas
          </button>
          <button 
            onClick={() => setActiveTab('rules')}
            className={`text-sm h-full flex items-center border-b-2 cursor-pointer transition-colors ${activeTab === 'rules' ? 'font-bold text-brand border-brand' : 'font-semibold text-muted-foreground hover:text-foreground border-transparent'}`}
          >
            Configuração de Regras
          </button>
        </div>
        <div className="flex items-center gap-6">
          <button className="flex items-center gap-2 cursor-pointer bg-brand text-white px-5 py-2.5 rounded-lg font-bold text-sm hover:bg-brand/90 transition-colors shadow-sm">
            <span className="text-lg leading-none">+</span> Nova Reserva
          </button>
          <button className="text-muted-foreground hover:text-foreground cursor-pointer relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-2 h-2 bg-destructive rounded-full border-2 border-card"></span>
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {activeTab === 'reservations' ? (
          <>
            <div className={`
              w-full lg:w-[340px] flex flex-col bg-card border-r border-border shrink-0 z-10
              ${selectedResId ? 'hidden lg:flex' : 'flex'}
            `}>
              <div className="p-4 md:p-6 flex flex-col h-full overflow-hidden">

                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-xl text-foreground">Reservas</h3>
                  <button className="text-muted-foreground hover:text-foreground cursor-pointer">
                    <Filter size={20} strokeWidth={1.5} />
                  </button>
                </div>
                
                <div className="flex items-center gap-4 border-b border-border/50 pb-4 mb-4">
                  <button className="px-4 py-1.5 bg-brand/10 text-brand cursor-pointer text-sm font-bold rounded-full">
                    Todos ({MOCK_RESERVATIONS.length})
                  </button>
                  <button className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    Novos (1)
                  </button>
                  <button className="text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                    Pendentes (1)
                  </button>
                </div>

                <div className="relative mb-6">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Filtrar reservas..." 
                    className="w-full pl-9 pr-4 py-2.5 bg-accent/30 border border-border/50 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand placeholder:text-muted-foreground"
                  />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar -mx-4 md:-mx-6">
                  {MOCK_RESERVATIONS.map(res => (
                    <div 
                      key={res.id}
                      onClick={() => setSelectedResId(res.id)}
                      className={`p-4 md:p-6 cursor-pointer transition-colors border-b border-border relative
                        ${selectedResId === res.id ? 'bg-background border-l-[3px] border-l-brand' : 'bg-card hover:bg-accent/20 border-l-[3px] border-l-transparent'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <StatusBadge status={res.status} />
                        <span className="text-[11px] text-muted-foreground font-medium">{res.timeAgo}</span>
                      </div>
                      
                      <h4 className="font-bold text-sm text-foreground mb-1 leading-tight">{res.spaceName}</h4>
                      <p className="text-[11px] text-muted-foreground mb-4 line-clamp-2 leading-relaxed">
                         Reserva solicitada por {res.requesterName.split(' ')[0]} para {res.date} ({res.timeRange}). {res.observations && `Obs: ${res.observations}`}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-accent text-[10px] font-bold text-muted-foreground uppercase rounded">
                           <span className="text-brand font-black">A</span> {res.block || res.unit}
                        </span>
                        <span className="text-[11px] font-bold text-muted-foreground">#{res.id.padStart(4, '482')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className={`
              flex-1 flex flex-col bg-background min-w-0 border-r border-border relative
              ${!selectedResId ? 'hidden lg:flex' : 'flex'}
            `}>
              <button 
                onClick={() => setSelectedResId('')}
                className="lg:hidden absolute top-4 left-4 p-2 cursor-pointer text-brand font-bold flex items-center gap-1 z-20"
              >
                &lsaquo; Voltar
              </button>

              <div className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-12 custom-scrollbar bg-background">
                <div className="w-full">
                  {selectedRes ? (
                    <>
                      <div className="flex flex-col md:flex-row md:items-start justify-between mb-10 gap-6">
                         <div>
                            <h1 className="text-3xl font-black text-foreground mb-4 tracking-tight">{selectedRes.spaceName}</h1>
                            <StatusBadge status={selectedRes.status} />
                         </div>
                         
                         <div className="flex items-center gap-4 shrink-0 mt-2 md:mt-0">
                            <button className="text-sm font-bold cursor-pointer text-muted-foreground hover:text-foreground transition-colors mr-2">
                              Enviar Mensagem
                            </button>
                            <button className="w-11 h-11 flex cursor-pointer items-center justify-center bg-background border border-destructive/40 text-destructive rounded-xl hover:bg-destructive/10 transition-colors">
                              <span className="text-xl leading-none mb-1">&times;</span>
                            </button>
                            <button className="px-6 py-2.5 cursor-pointer bg-success text-white text-sm font-bold rounded-xl hover:bg-success/90 transition-colors flex items-center gap-2 shadow-sm">
                              <span className="text-base leading-none">&#10003;</span> Aprovar
                            </button>
                         </div>
                      </div>                   
    
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                         <div className="bg-background border-2 border-slate-100 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-brand/5 text-brand flex items-center justify-center shrink-0">
                              <CalendarIcon size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Data</p>
                              <p className="text-base font-bold text-foreground">{selectedRes.date}</p>
                            </div>
                         </div>
                         <div className="bg-background border-2 border-slate-100 rounded-2xl p-6 flex items-center gap-5 shadow-sm">
                            <div className="w-12 h-12 rounded-full bg-brand/5 text-brand flex items-center justify-center shrink-0">
                              <Clock size={24} strokeWidth={1.5} />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold mb-1">Horário</p>
                              <p className="text-base font-bold text-foreground">{selectedRes.timeRange} <span className="text-muted-foreground font-medium">({selectedRes.duration})</span></p>
                            </div>
                         </div>
                      </div>
    
                      <div className="mb-12">
                         <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-6">Disponibilidade do Dia ({selectedRes.date.toUpperCase()})</h3>
                         
                         <div className="w-full h-10 bg-success/10 rounded-xl overflow-hidden flex relative border-2 border-success/20">
                            <div className="absolute left-[30%] w-[30%] h-full bg-warning flex items-center justify-center">
                               <span className="text-[11px] font-bold text-white uppercase tracking-wider shadow-sm">Solicitado</span>
                            </div>
                         </div>
                         <div className="flex justify-between mt-3 px-2">
                            <span className="text-[11px] text-muted-foreground font-medium">06:00</span>
                            <span className="text-[11px] text-muted-foreground font-medium">10:00</span>
                            <span className="text-[11px] text-brand font-bold">12:00</span>
                            <span className="text-[11px] text-brand font-bold">14:00</span>
                            <span className="text-[11px] text-muted-foreground font-medium">16:00</span>
                            <span className="text-[11px] text-muted-foreground font-medium">18:00</span>
                            <span className="text-[11px] text-muted-foreground font-medium">20:00</span>
                            <span className="text-[11px] text-muted-foreground font-medium">22:00</span>
                         </div>
                      </div>
    
                      <div className="flex flex-wrap gap-6 mb-14">
                         <div className="flex-1 min-w-[200px] bg-accent/30 rounded-2xl p-6 text-center border border-slate-100">
                           <p className="text-[11px] text-muted-foreground mb-2 font-bold uppercase tracking-wider">Capacidade</p>
                           <p className="text-xl font-bold text-foreground">{selectedRes.capacity} Pessoas</p>
                         </div>
                         <div className="flex-1 min-w-[200px] bg-accent/30 rounded-2xl p-6 text-center border border-slate-100">
                           <p className="text-[11px] text-muted-foreground mb-2 font-bold uppercase tracking-wider">Taxa de Limpeza</p>
                           <p className="text-xl font-bold text-foreground">{selectedRes.cleaningFee}</p>
                         </div>
                         <div className="flex-1 min-w-[200px] bg-accent/30 rounded-2xl p-6 text-center border border-slate-100">
                           <p className="text-[11px] text-muted-foreground mb-2 font-bold uppercase tracking-wider">Regra Específica</p>
                           <p className="text-xl font-bold text-foreground">{selectedRes.specificRule}</p>
                         </div>
                      </div>
    
                      <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider mb-6 flex items-center gap-2">
                         <Clock size={14} /> Outras Reservas no Dia ({selectedRes.date.toUpperCase()})
                      </h3>
                      <div className="space-y-4">
                         <div className="flex justify-between items-center p-5 border-2 border-slate-100 rounded-2xl bg-background shadow-sm">
                           <div>
                             <h4 className="font-bold text-base text-foreground mb-1.5">Salão de Festas</h4>
                             <p className="text-[13px] text-muted-foreground font-medium">19:00 - 23:00 • Apt 501</p>
                           </div>
                           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-emerald-600 border border-emerald-200"><span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>Confirmado</span>
                         </div>
                         <div className="flex justify-between items-center p-5 border-2 border-slate-100 rounded-2xl bg-background shadow-sm">
                           <div>
                             <h4 className="font-bold text-base text-foreground mb-1.5">Academia</h4>
                             <p className="text-[13px] text-muted-foreground font-medium">07:00 - 08:00 • Apt 102</p>
                           </div>
                           <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded text-xs font-bold uppercase tracking-wider text-muted-foreground border border-border"><span className="w-1.5 h-1.5 rounded-full bg-muted-foreground"></span>Concluído</span>
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12">
                      <div className="w-16 h-16 rounded-full bg-accent text-muted-foreground flex items-center justify-center mb-4">
                        <CalendarIcon size={32} />
                      </div>
                      <p className="text-sm text-muted-foreground">Selecione uma reserva para visualizar detalhes</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {selectedRes && (
              <div className="w-[300px] bg-card p-6 shrink-0 overflow-y-auto custom-scrollbar hidden lg:block border-l border-border">
                 <div className="space-y-6">
                    <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-6">Solicitante</h3>
                    
                    <div className="flex items-center gap-3 mb-4">
                       <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm shrink-0">
                         {selectedRes.requesterInitials}
                       </div>
                       <div>
                         <p className="font-bold text-sm text-foreground leading-tight mb-1">{selectedRes.requesterName}</p>
                         <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{selectedRes.requesterRole}</p>
                       </div>
                    </div>
  
                    <div className="flex gap-2 mb-6">
                       <span className="px-2 py-1 bg-brand/10 text-brand rounded text-[10px] font-bold">Proprietário</span>
                       <span className={`px-2 py-1 rounded text-[10px] font-bold ${selectedRes.requesterStatus === 'Adimplente' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                         {selectedRes.requesterStatus}
                       </span>
                    </div>
  
                    <div className="space-y-4 mb-6">
                       <div className="flex items-start gap-3 text-sm">
                          <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Unidade</p>
                            <p className="font-medium text-foreground">{selectedRes.unit}{selectedRes.block ? `, ${selectedRes.block}` : ''}</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-3 text-sm">
                          <Phone size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Telefone</p>
                            <p className="font-medium text-foreground">{selectedRes.requesterPhone}</p>
                          </div>
                       </div>
                       <div className="flex items-start gap-3 text-sm">
                          <Mail size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                          <div>
                            <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                            <p className="font-medium text-foreground truncate w-40">{selectedRes.requesterEmail}</p>
                          </div>
                       </div>
                    </div>
  
                    <div className="border-t border-border pt-6 space-y-3 mb-6">
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground font-medium">Reservas (Mês)</span>
                          <span className="font-bold text-foreground">{selectedRes.reservationsMonth}</span>
                       </div>
                       <div className="flex justify-between items-center text-sm">
                          <span className="text-muted-foreground font-medium">Multas/Infrações</span>
                          <span className={`font-bold ${selectedRes.infractions === 'Nenhuma' ? 'text-emerald-500' : 'text-red-500'}`}>{selectedRes.infractions}</span>
                       </div>
                    </div>
  
                    <div>
                       <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Observações do Morador</h3>
                       <div className="p-4 bg-accent/30 rounded-xl italic text-sm text-foreground leading-relaxed border border-border/50">
                          {selectedRes.observations}
                       </div>
                    </div>
  
                    <button className="w-full mt-6 px-4 py-2.5 bg-background border cursor-pointer border-border rounded-lg text-sm font-semibold text-foreground hover:bg-accent hover:text-brand transition-colors shadow-sm">
                       Ver Perfil Completo
                    </button>
                 </div>
              </div>
            )}
            
          </>
        ) : (
          <div className="flex-1 overflow-y-auto">
            <CommonAreaRules />
          </div>
        )}
      </div>
    </div>
  );
}
