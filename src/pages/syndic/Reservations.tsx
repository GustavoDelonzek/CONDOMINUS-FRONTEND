import { useState } from 'react';
import { Search, MapPin, Phone, Mail, Clock, Calendar as CalendarIcon } from 'lucide-react';
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

// --- Badges ---
function StatusBadge({ status }: { status: ReservationStatus }) {
  if (status === 'Aguardando Aprovação') {
    return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-yellow-100 text-yellow-700">Aguardando Aprovação</span>;
  }
  if (status === 'Confirmado') {
     return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-green-50 text-green-600 border border-green-500/20">Confirmado</span>;
  }
  if (status === 'Recusado') {
     return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-600 border border-red-500/20">Recusado</span>;
  }
  return <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-accent text-muted-foreground border border-border">Concluído</span>;
}

export function Reservations() {
  const [activeTab, setActiveTab] = useState<'reservations' | 'rules'>('reservations');
  const [selectedResId, setSelectedResId] = useState<string>(MOCK_RESERVATIONS[0]?.id || '');
  const selectedRes = MOCK_RESERVATIONS.find(r => r.id === selectedResId);

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden relative">
      {/* Header Tabs */}
      <div className="flex items-center gap-6 px-8 pt-4 border-b border-border bg-card shrink-0">
        <button 
          onClick={() => setActiveTab('reservations')}
          className={`text-sm pb-3 transition-all ${activeTab === 'reservations' ? 'font-bold text-brand border-b-2 border-brand' : 'font-semibold text-muted-foreground hover:text-foreground'}`}
        >
          Reservas
        </button>
        <button 
          onClick={() => setActiveTab('rules')}
          className={`text-sm pb-3 transition-all ${activeTab === 'rules' ? 'font-bold text-brand border-b-2 border-brand' : 'font-semibold text-muted-foreground hover:text-foreground'}`}
        >
          Configuração de Regras
        </button>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        {activeTab === 'reservations' ? (
          <>
            {/* Left Panel: List - Stacked on mobile, hidden when detail is open */}
            <div className={`
              w-full lg:w-[340px] flex flex-col bg-card border-r border-border shrink-0 z-10
              ${selectedResId ? 'hidden lg:flex' : 'flex'}
            `}>
              <div className="p-4 md:p-6 flex flex-col h-full overflow-hidden">
                <button className="w-full flex items-center justify-center gap-2 bg-brand text-white py-2.5 rounded-lg font-bold text-sm hover:bg-brand/90 transition-colors mb-6 shadow-sm">
                   <span className="text-lg leading-none">+</span> Nova Reserva
                </button>

                <h3 className="font-bold text-base text-foreground mb-3">Solicitações Pendentes</h3>
                
                <div className="flex items-center gap-2 mb-4">
                   <span className="px-2 py-0.5 bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase rounded-full">3 Novos</span>
                </div>

                <div className="relative mb-6">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <input 
                    type="text" 
                    placeholder="Buscar por apto ou área..." 
                    className="w-full pl-9 pr-4 py-2 bg-accent/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand placeholder:text-muted-foreground"
                  />
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar -mx-2 px-2">
                  {MOCK_RESERVATIONS.map(res => (
                    <div 
                      key={res.id}
                      onClick={() => setSelectedResId(res.id)}
                      className={`p-4 rounded-xl cursor-pointer transition-colors mb-2 relative
                        ${selectedResId === res.id ? 'bg-accent/80' : 'hover:bg-accent/40'}
                      `}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-sm text-foreground">{res.spaceName}</h4>
                        <span className="text-[10px] text-muted-foreground font-medium">{res.timeAgo}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mb-2">{res.unit} - {res.requesterName.split(' ')[0]}</p>
                      
                      <div className="flex justify-between items-center text-xs text-muted-foreground font-medium">
                        <span className="flex items-center gap-1"><CalendarIcon size={12} /> {res.date.split(' ')[0]} {res.date.split(' ')[2]}</span>
                        <span className="flex items-center gap-1"><Clock size={12} /> {res.timeRange}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Middle Panel: Details - Full width on mobile when selected */}
            <div className={`
              flex-1 flex flex-col bg-background min-w-0 border-r border-border relative
              ${!selectedResId ? 'hidden lg:flex' : 'flex'}
            `}>
              {/* Mobile Back Button */}
              <button 
                onClick={() => setSelectedResId('')}
                className="lg:hidden absolute top-4 left-4 p-2 text-brand font-bold flex items-center gap-1 z-20"
              >
                &lsaquo; Voltar
              </button>

              <div className="absolute top-6 right-4 md:right-8 flex gap-2 md:gap-3 z-10">
                  <button className="px-3 md:px-6 py-2 bg-background border border-red-500 text-red-500 text-[10px] md:text-sm font-bold rounded-lg hover:bg-red-50 transition-colors flex items-center gap-1 md:gap-2">
                    <span className="text-sm md:text-lg leading-none">&times;</span> <span className="hidden xs:inline">Rejeitar</span>
                  </button>
                  <button className="px-3 md:px-6 py-2 bg-green-500 text-white text-[10px] md:text-sm font-bold rounded-lg hover:bg-green-600 transition-colors flex items-center gap-1 md:gap-2 shadow-sm">
                    <span className="text-xs md:text-base leading-none">&#10003;</span> <span className="hidden xs:inline">Aprovar Reserva</span>
                    <span className="xs:hidden">Aprovar</span>
                  </button>
              </div>

              <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 custom-scrollbar">
                <div className="max-w-4xl mt-12 lg:mt-0">
                  {selectedRes ? (
                    <>
                      <div className="flex justify-between items-start mb-8 lg:pr-[300px]">
                         <div>
                            <h1 className="text-2xl font-bold text-foreground mb-3">{selectedRes.spaceName}</h1>
                            <StatusBadge status={selectedRes.status} />
                         </div>
                      </div>
    
                      {/* Date / Time Cards */}
                      <div className="grid grid-cols-2 gap-4 mb-8">
                         <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                              <CalendarIcon size={20} />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Data</p>
                              <p className="text-sm font-bold text-foreground">{selectedRes.date}</p>
                            </div>
                         </div>
                         <div className="bg-card border border-border rounded-xl p-4 flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                              <Clock size={20} />
                            </div>
                            <div>
                              <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold mb-0.5">Horário</p>
                              <p className="text-sm font-bold text-foreground">{selectedRes.timeRange} ({selectedRes.duration})</p>
                            </div>
                         </div>
                      </div>
    
                      {/* Timeline UI Placeholder */}
                      <div className="mb-8">
                         <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Disponibilidade do Dia ({selectedRes.date.toUpperCase()})</h3>
                         
                         <div className="w-full h-8 bg-green-50 rounded-lg overflow-hidden flex relative border border-green-500/10">
                            {/* Mocking the yellow block */}
                            <div className="absolute left-[35%] w-[25%] h-full bg-yellow-400 flex items-center justify-center">
                               <span className="text-[10px] font-bold text-white uppercase tracking-wider">Solicitado</span>
                            </div>
                         </div>
                         <div className="flex justify-between mt-2 px-1">
                            <span className="text-[10px] text-muted-foreground font-medium">06:00</span>
                            <span className="text-[10px] text-muted-foreground font-medium">10:00</span>
                            <span className="text-[10px] text-brand font-bold">12:00</span>
                            <span className="text-[10px] text-brand font-bold">14:00</span>
                            <span className="text-[10px] text-muted-foreground font-medium">16:00</span>
                            <span className="text-[10px] text-muted-foreground font-medium">18:00</span>
                            <span className="text-[10px] text-muted-foreground font-medium">20:00</span>
                            <span className="text-[10px] text-muted-foreground font-medium">22:00</span>
                         </div>
                      </div>
    
                      {/* Rule Blocks */}
                      <div className="flex flex-wrap gap-4 mb-10">
                         <div className="flex-1 min-w-[150px] bg-accent/40 rounded-xl p-4 text-center">
                           <p className="text-xs text-muted-foreground mb-1 font-medium">Capacidade</p>
                           <p className="text-lg font-bold text-foreground">{selectedRes.capacity} Pessoas</p>
                         </div>
                         <div className="flex-1 min-w-[150px] bg-accent/40 rounded-xl p-4 text-center">
                           <p className="text-xs text-muted-foreground mb-1 font-medium">Taxa de Limpeza</p>
                           <p className="text-lg font-bold text-foreground">{selectedRes.cleaningFee}</p>
                         </div>
                         <div className="flex-1 min-w-[150px] bg-accent/40 rounded-xl p-4 text-center">
                           <p className="text-xs text-muted-foreground mb-1 font-medium">Regra Específica</p>
                           <p className="text-lg font-bold text-foreground">{selectedRes.specificRule}</p>
                         </div>
                      </div>
    
                      {/* Other Reservations */}
                      <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4 flex items-center gap-2">
                         <Clock size={12} /> Outras Reservas no Dia ({selectedRes.date.toUpperCase()})
                      </h3>
                      <div className="space-y-3">
                         <div className="flex justify-between items-center p-4 border border-border/50 rounded-xl bg-card">
                           <div>
                             <h4 className="font-bold text-sm text-foreground mb-1">Salão de Festas</h4>
                             <p className="text-xs text-muted-foreground">19:00 - 23:00 • Apt 501</p>
                           </div>
                           <StatusBadge status="Confirmado" />
                         </div>
                         <div className="flex justify-between items-center p-4 border border-border/50 rounded-xl bg-card">
                           <div>
                             <h4 className="font-bold text-sm text-foreground mb-1">Academia</h4>
                             <p className="text-xs text-muted-foreground">07:00 - 08:00 • Apt 102</p>
                           </div>
                           <StatusBadge status="Concluído" />
                         </div>
                      </div>
                    </>
                  ) : (
                    <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                      <CalendarIcon size={48} className="mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-bold">Selecione uma Reserva</h3>
                      <p className="text-sm">Escolha uma reserva na lista para visualizar os detalhes e o solicitante.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Panel: Requester Meta */}
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
                       <span className="px-2 py-1 bg-accent rounded text-[10px] font-bold text-muted-foreground">Proprietário</span>
                       <span className={`px-2 py-1 rounded text-[10px] font-bold ${selectedRes.requesterStatus === 'Adimplente' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
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
                          <span className={`font-bold ${selectedRes.infractions === 'Nenhuma' ? 'text-green-500' : 'text-red-500'}`}>{selectedRes.infractions}</span>
                       </div>
                    </div>
  
                    <div>
                       <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Observações do Morador</h3>
                       <div className="p-4 bg-accent/30 rounded-xl italic text-sm text-foreground leading-relaxed border border-border/50">
                          {selectedRes.observations}
                       </div>
                    </div>
  
                    <button className="w-full mt-6 px-4 py-2.5 bg-background border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-accent hover:text-brand transition-colors shadow-sm">
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
