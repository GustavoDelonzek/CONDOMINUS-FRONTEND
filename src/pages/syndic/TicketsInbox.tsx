import { useState } from 'react';
import { Search, Filter, MapPin, Phone, Mail, Clock, Image as ImageIcon, User, FileText } from 'lucide-react';

// --- Types ---
type TicketStatus = 'Novo' | 'Pendente';
type Priority = 'Alta' | 'Média' | 'Baixa';

interface Ticket {
  id: string;
  number: string;
  title: string;
  description: string;
  status: TicketStatus;
  timeAgo: string;
  block: string;
  unit: string;
  priority: Priority;
  assignedTo: string;
  requesterName: string;
  requesterRole: string;
  requesterInitials: string;
  requesterPhone: string;
  requesterEmail: string;
  history: TicketHistoryItem[];
  evidences: string[];
}

interface TicketHistoryItem {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'creation' | 'assignment' | 'update';
}

// --- Mock Data ---
const MOCK_TICKETS: Ticket[] = [
  {
    id: '1',
    number: '#4829',
    title: 'Barulho Excessivo vindo do apartamento vizinho',
    description: 'Som alto após 22h do apartamento vizinho, impossibilitando o descanso dos moradores...',
    status: 'Novo',
    timeAgo: '10 min',
    block: 'Bloco A',
    unit: 'Apt 302',
    priority: 'Alta',
    assignedTo: 'Sem atribuição',
    requesterName: 'Carlos Silva',
    requesterRole: 'Proprietário',
    requesterInitials: 'CS',
    requesterPhone: '(11) 98765-4321',
    requesterEmail: 'carlos.silva@email.com',
    history: [
      { id: 'h1', title: 'Ticket Criado', description: 'Ticket aberto via App Morador por Carlos Silva.', date: 'Hoje, 22:15', type: 'creation' }
    ],
    evidences: ['placeholder-1.jpg', 'placeholder-2.jpg']
  },
  {
    id: '2',
    number: '#4828',
    title: 'Manutenção Portão - Apt 105',
    description: 'Portão de garagem travando ao abrir, interfere anteriormente e continua com problema.',
    status: 'Pendente',
    timeAgo: 'Ontem',
    block: 'Bloco B',
    unit: 'Apt 105',
    priority: 'Média',
    assignedTo: 'Equipe Manutenção',
    requesterName: 'Ana Costa',
    requesterRole: 'Proprietária',
    requesterInitials: 'AC',
    requesterPhone: '(11) 98234-5678',
    requesterEmail: 'ana.costa@email.com',
    history: [
      { id: 'h1', title: 'Ticket Criado', description: 'Ticket aberto via Portal Web por Ana Costa.', date: 'Ontem, 14:30', type: 'creation' },
      { id: 'h2', title: 'Atribuído para Manutenção', description: 'Técnico designado para verificar o problema.', date: 'Ontem, 15:00', type: 'assignment' }
    ],
    evidences: []
  },
  {
    id: '3',
    number: '#4827',
    title: 'Infiltração Teto - Apt 501',
    description: 'Mancha de umidade aparecendo no banheiro social, parece vir do andar de cima.',
    status: 'Novo',
    timeAgo: 'Ontem',
    block: 'Bloco A',
    unit: 'Apt 501',
    priority: 'Alta',
    assignedTo: 'Sem atribuição',
    requesterName: 'Roberto Dias',
    requesterRole: 'Inquilino',
    requesterInitials: 'RD',
    requesterPhone: '(11) 99876-5432',
    requesterEmail: 'roberto.dias@email.com',
    history: [
      { id: 'h1', title: 'Ticket Criado', description: 'Ticket aberto via App Morador por Roberto Dias.', date: 'Ontem, 09:10', type: 'creation' }
    ],
    evidences: []
  },
  {
    id: '4',
    number: '#4826',
    title: 'Lâmpada Queimada - Área Comum',
    description: 'Corredor do 3º andar, lâmpada piscando intermitentemente.',
    status: 'Novo',
    timeAgo: '2d atrás',
    block: 'Zeladoria',
    unit: '',
    priority: 'Baixa',
    assignedTo: 'Equipe Limpeza',
    requesterName: 'João Silva',
    requesterRole: 'Zelador',
    requesterInitials: 'JS',
    requesterPhone: '(11) 91234-5678',
    requesterEmail: 'zeladoria@oceanview.com',
    history: [
        { id: 'h1', title: 'Ticket Criado', description: 'Ticket aberto via App Síndico por João Silva.', date: '2 dias atrás', type: 'creation' }
    ],
    evidences: []
  }
];

// --- Badges ---
function StatusBadge({ status }: { status: TicketStatus }) {
  if (status === 'Novo') {
    return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-brand/10 text-brand border border-brand/20"><span className="w-1.5 h-1.5 rounded-full bg-brand"></span>Novo</span>;
  }
  return <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-600 border border-amber-500/20"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>Pendente</span>;
}

function PriorityBadge({ priority }: { priority: Priority }) {
  const styles = {
    'Alta': 'bg-red-50 text-red-500 border border-red-500/20',
    'Média': 'bg-amber-50 text-amber-600 border border-amber-500/20',
    'Baixa': 'bg-emerald-50 text-emerald-600 border border-emerald-500/20',
  };
  return <span className={`inline-block px-3 py-1 rounded-lg text-xs font-bold ${styles[priority]}`}>{priority}</span>;
}

export function TicketsInbox() {
  const [selectedTicketId, setSelectedTicketId] = useState<string>(MOCK_TICKETS[0]?.id || '');
  const selectedTicket = MOCK_TICKETS.find(t => t.id === selectedTicketId);

  return (
    <div className="flex flex-col lg:flex-row h-full bg-background overflow-hidden relative">
      
      {/* Left Panel: Ticket List - Hidden when ticket selected on mobile */}
      <div className={`
        w-full lg:w-[380px] flex flex-col bg-card border-r border-border shrink-0 z-10 shadow-[2px_0_8px_rgba(0,0,0,0.02)]
        ${selectedTicketId ? 'hidden lg:flex' : 'flex'}
      `}>
        
        {/* Header */}
        <div className="p-4 md:p-6 border-b border-border">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Tickets</h2>
            <div className="flex gap-2">
              <button className="p-1.5 text-muted-foreground hover:bg-accent rounded-lg transition-colors"><Filter size={18} /></button>
            </div>
          </div>
          
          <div className="flex gap-2 mb-4 overflow-x-auto custom-scrollbar pb-1 text-sm font-medium">
            <button className="px-4 py-1.5 rounded-full bg-brand/10 text-brand font-bold whitespace-nowrap border border-brand/20">Todos (12)</button>
            <button className="px-4 py-1.5 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground whitespace-nowrap transition-colors">Novos (5)</button>
            <button className="px-4 py-1.5 rounded-full text-muted-foreground hover:bg-accent hover:text-foreground whitespace-nowrap transition-colors">Críticos (2)</button>
          </div>

          <div className="relative">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Filtrar tickets..." 
              className="w-full pl-9 pr-4 py-2 bg-accent/50 border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {MOCK_TICKETS.map(ticket => (
            <div 
              key={ticket.id}
              onClick={() => setSelectedTicketId(ticket.id)}
              className={`p-4 md:p-5 border-b border-border cursor-pointer transition-colors relative
                ${selectedTicketId === ticket.id ? 'bg-brand/5 border-l-4 border-l-brand' : 'hover:bg-accent/50 border-l-4 border-l-transparent'}
              `}
            >
              <div className="flex justify-between items-start mb-2">
                <StatusBadge status={ticket.status} />
                <span className="text-xs text-muted-foreground font-medium">{ticket.timeAgo}</span>
              </div>
              <h3 className="font-bold text-sm text-foreground mb-1 leading-tight">{ticket.title}</h3>
              <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{ticket.description}</p>
              
              <div className="flex items-center justify-between mt-2">
                <span className="inline-flex items-center gap-1 bg-accent px-2 py-1 rounded text-[10px] font-bold text-muted-foreground">
                  <span className="w-3 h-3 bg-brand/10 text-brand rounded-sm flex items-center justify-center font-black">A</span>
                  {ticket.block}
                </span>
                <span className="text-xs font-semibold text-muted-foreground tracking-wide">{ticket.number}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Panel: Ticket Details - Visible full width on mobile when selected */}
      <div className={`
        flex-1 flex flex-col bg-card min-w-0 border-r border-border relative
        ${!selectedTicketId ? 'hidden lg:flex' : 'flex'}
      `}>
        {/* Mobile Back Button */}
        <button 
          onClick={() => setSelectedTicketId('')}
          className="lg:hidden absolute top-4 left-4 p-2 text-brand font-bold flex items-center gap-1 z-20"
        >
          &lsaquo; Voltar
        </button>
        
        {/* Content area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 mt-10 lg:mt-0 custom-scrollbar">
          <div className="max-w-3xl">
            {selectedTicket ? (
             <>
              <div className="flex items-center gap-3 mb-4">
                <span className="font-bold text-muted-foreground">{selectedTicket.number}</span>
                <StatusBadge status={selectedTicket.status} />
                <span className="flex items-center gap-1 text-xs text-muted-foreground"><Clock size={12} /> {selectedTicket.timeAgo}</span>
              </div>
              <h1 className="text-2xl font-bold text-foreground mb-8 leading-tight">{selectedTicket.title}</h1>
             </>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-12 opacity-50">
                <FileText size={48} className="mb-4 text-muted-foreground" />
                <h3 className="text-lg font-bold">Selecione um Ticket</h3>
                <p className="text-sm">Escolha um ticket na lista para visualizar os detalhes e o histórico.</p>
              </div>
            )}

            {selectedTicket && (
              <section className="mb-10">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Detalhes da Ocorrência</h3>
                <p className="text-sm text-foreground leading-relaxed">
                  {selectedTicket.id === '1' ? 
                    "Gostaria de registrar uma reclamação sobre barulho excessivo vindo do apartamento 303. O som está extremamente alto, com música e gritos, e já passa das 22h, o que infringe as regras de silêncio do condomínio. Tentei interfonar mas ninguém atende. Por favor, verificar a situação pois está impossível descansar." :
                    selectedTicket.description
                  }
                </p>
              </section>
            )}

            {selectedTicket && selectedTicket.evidences.length > 0 && (
              <section className="mb-10">
                <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-3">Evidências Anexadas</h3>
                <div className="flex gap-4 overflow-x-auto pb-2">
                  {selectedTicket.evidences.map((evidence, i) => (
                    <div key={i} className="w-48 h-32 bg-accent rounded-lg border border-border flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
                       <span className="flex flex-col items-center gap-2 opacity-50"><ImageIcon size={24}/> {evidence || `Imagem ${i + 1}`}</span>
                    </div>
                  ))}
                </div>
              </section>
            )}

            <section>
              <h3 className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-6">Registro de Atividades</h3>
              
              <div className="space-y-6">
                
                {selectedTicket && selectedTicket.history.map((item) => (
                  <div key={item.id} className="flex items-start gap-4 pb-6 border-b border-border/50">
                     <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 shrink-0 mt-0.5">
                        <div className="w-2 h-2 rounded-full bg-brand"></div>
                     </div>
                     <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                          <div>
                            <h4 className="font-bold text-sm text-foreground">{item.title}</h4>
                            <p className="text-xs text-muted-foreground">{item.description}</p>
                          </div>
                          <span className="text-[10px] font-medium text-muted-foreground whitespace-nowrap ml-4">{item.date}</span>
                        </div>
                     </div>
                  </div>
                ))}
                
                <div className="flex items-start gap-4 pt-2">
                     <div className="flex items-center justify-center w-6 h-6 rounded-full bg-brand/10 shrink-0 mt-0.5">
                        <div className="w-2.5 h-2.5 rounded-sm bg-brand"></div>
                     </div>
                     <div className="flex-1">
                        <h4 className="font-bold text-sm text-foreground mb-3">Adicionar Atualização</h4>
                        <textarea 
                           placeholder="Registre uma ação tomada ou nota interna..."
                           className="w-full h-24 p-3 bg-transparent border border-border rounded-lg text-sm mb-3 resize-none focus:outline-none focus:ring-1 focus:ring-brand placeholder:text-muted-foreground/50"
                        ></textarea>
                        <div className="flex items-center justify-between">
                           <label className="flex items-center gap-2 text-xs font-medium text-foreground cursor-pointer group">
                             <div className="w-4 h-4 rounded border border-border bg-foreground flex items-center justify-center transition-colors">
                                {/* Checked state */}
                             </div>
                             Notificar morador
                           </label>
                           <button className="px-4 py-2 bg-transparent border border-border text-foreground text-xs font-bold rounded-lg hover:bg-accent transition-colors">
                             Salvar Nota
                           </button>
                        </div>
                     </div>
                  </div>

              </div>
            </section>

          </div>
        </div>
      </div>

      {/* Right Panel: Ticket Meta */}
      {selectedTicket && (
        <div className="w-[300px] bg-card border-l border-border p-6 shrink-0 overflow-y-auto custom-scrollbar shadow-[0_0_8px_rgba(0,0,0,0.02)] hidden lg:block">
           
           <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Status Atual</label>
                <div className="relative">
                   <select className="w-full appearance-none bg-background border border-border rounded-lg px-3 py-2 text-sm font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-brand">
                     <option>{selectedTicket.status}</option>
                     <option>Resolvido</option>
                     <option>Rejeitado</option>
                   </select>
                </div>
              </div>
  
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Atribuído Para</label>
                <button className="w-full flex items-center justify-center gap-2 bg-background border border-border rounded-lg px-3 py-2 text-sm font-semibold text-muted-foreground hover:bg-accent transition-colors">
                   <User size={16} />
                   {selectedTicket.assignedTo}
                </button>
              </div>
  
              <div className="pb-6 border-b border-border border-dashed">
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-2">Prioridade</label>
                <PriorityBadge priority={selectedTicket.priority} />
              </div>
  
              <div>
                <label className="block text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-4">Solicitante</label>
                
                <div className="flex items-center gap-3 mb-6">
                   <div className="w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold text-sm">
                     {selectedTicket.requesterInitials}
                   </div>
                   <div>
                     <p className="font-bold text-sm text-foreground">{selectedTicket.requesterName}</p>
                     <p className="text-[10px] text-muted-foreground uppercase tracking-wider">{selectedTicket.requesterRole}</p>
                   </div>
                </div>
  
                <div className="space-y-4 mb-6">
                   <div className="flex items-start gap-3 text-sm">
                      <MapPin size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Unidade</p>
                        <p className="font-medium text-foreground">{selectedTicket.unit}, {selectedTicket.block}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3 text-sm">
                      <Phone size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Telefone</p>
                        <p className="font-medium text-foreground">{selectedTicket.requesterPhone}</p>
                      </div>
                   </div>
                   <div className="flex items-start gap-3 text-sm">
                      <Mail size={16} className="text-muted-foreground mt-0.5 shrink-0" />
                      <div>
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider mb-0.5">Email</p>
                        <p className="font-medium text-foreground truncate w-40">{selectedTicket.requesterEmail}</p>
                      </div>
                   </div>
                </div>
  
                <button className="w-full px-4 py-2 bg-background border border-border rounded-lg text-sm font-semibold text-foreground hover:bg-accent hover:text-brand transition-colors">
                   Ver Perfil Completo
                </button>
  
              </div>
  
           </div>
  
        </div>
      )}

    </div>
  );
}
