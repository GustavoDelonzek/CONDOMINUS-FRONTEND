import { Plus, Upload, Wallet, TrendingUp, TrendingDown, FileText, Download, AlertTriangle } from 'lucide-react';

const RECENT_FILES = [
  { id: '1', title: 'Balancete Jan/2026', date: 'Adicionado em 02 fev 2026', size: '2.4 MB', type: 'pdf', iconColor: 'text-red-500', bgColor: 'bg-red-50' },
  { id: '2', title: 'Balancete Dez/2025', date: 'Adicionado em 05 Jan 2026', size: '2.1 MB', type: 'pdf', iconColor: 'text-red-500', bgColor: 'bg-red-50' },
  { id: '3', title: 'Previsão Orçamentária 2026', date: 'Adicionado em 15 Dez 2025', size: '650 KB', type: 'excel', iconColor: 'text-green-600', bgColor: 'bg-green-50' },
  { id: '4', title: 'Ata Assembleia Geral 2025', date: 'Adicionado em 10 Nov 2025', size: '1.2 MB', type: 'pdf', iconColor: 'text-red-500', bgColor: 'bg-red-50' },
  { id: '5', title: 'Comprovante Pagamento Zelador', date: 'Adicionado em 01 Fev 2026', size: '590 KB', type: 'pdf', iconColor: 'text-red-500', bgColor: 'bg-red-50' },
  { id: '6', title: 'Relatório de Manutenção Jan/26', date: 'Adicionado em 20 Jan 2026', size: '3.5 MB', type: 'word', iconColor: 'text-blue-500', bgColor: 'bg-blue-50' },
];

const OVERDUE_UNITS = [
  { unit: 'Unidade 402', days: 'Vencido há 45 dias', value: 'R$ 2.450,00' },
  { unit: 'Unidade 105', days: 'Vencido há 15 dias', value: 'R$ 1.200,00' },
  { unit: 'Unidade 201', days: 'Vencido há 6 dias', value: 'R$ 980,00' },
];

const UPCOMING_BILLS = [
  { date: 'FEV 10', title: 'Manutenção Elevadores', subtitle: 'Atlas Schindler', value: 'R$ 1.200' },
  { date: 'FEV 15', title: 'Segurança Privada', subtitle: 'Grupo Security', value: 'R$ 4.560' },
];

export function FinancialTransparency() {
  return (
    <div className="flex flex-col gap-4 md:gap-6 h-full p-4 md:p-6 bg-background overflow-y-auto custom-scrollbar">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Transparência Financeira</h1>
          <p className="text-muted-foreground mt-1 text-sm">Gestão de documentos contábeis e prestação de contas do Ocean View Towers.</p>
        </div>
        <button className="bg-brand text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-brand/90 transition-colors shadow-sm shrink-0">
          <Plus size={18} />
          Novo Balancete
        </button>
      </div>

      <div className="flex flex-col xl:flex-row gap-6">
        
        <div className="flex-1 flex flex-col gap-6">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-brand/10 text-brand flex items-center justify-center shrink-0">
                <Wallet size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Saldo em Caixa</p>
                <p className="text-xl md:text-2xl font-bold text-foreground">R$ 124.500,00</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-success/10 text-success flex items-center justify-center shrink-0">
                <TrendingUp size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Receita Jan/24</p>
                <p className="text-xl md:text-2xl font-bold text-foreground">R$ 48.200,00</p>
              </div>
            </div>
            <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center shrink-0">
                <TrendingDown size={24} />
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground">Despesas Jan/24</p>
                <p className="text-xl md:text-2xl font-bold text-foreground">R$ 32.150,00</p>
              </div>
            </div>
          </div>

          <div className="bg-card border-2 border-dashed border-border rounded-2xl p-10 flex flex-col items-center justify-center text-center hover:bg-accent/30 transition-colors">
            <div className="w-14 h-14 rounded-full bg-brand/10 text-brand flex items-center justify-center mb-4">
              <Upload size={28} />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">Arraste arquivos aqui ou clique para enviar</h3>
            <p className="text-sm text-muted-foreground mb-6">Suporte para PDF, XLS, e DOCX (Máx. 10MB)</p>
            <button className="px-6 py-2 border border-border rounded-lg text-sm font-bold text-foreground hover:bg-accent transition-colors shadow-sm">
              Selecionar Arquivo
            </button>
          </div>

          <div className="flex overflow-x-auto gap-2 text-sm font-medium pb-1 custom-scrollbar">
            <button className="px-4 py-2 rounded-full bg-brand/10 text-brand font-bold whitespace-nowrap">Todos</button>
            <button className="px-4 py-2 rounded-full hover:bg-accent text-muted-foreground whitespace-nowrap transition-colors">Balancetes 2024</button>
            <button className="px-4 py-2 rounded-full hover:bg-accent text-muted-foreground whitespace-nowrap transition-colors">Atas de Assembleia</button>
            <button className="px-4 py-2 rounded-full hover:bg-accent text-muted-foreground whitespace-nowrap transition-colors">Contratos</button>
            <button className="px-4 py-2 rounded-full hover:bg-accent text-muted-foreground whitespace-nowrap transition-colors">Notas Fiscais</button>
          </div>

          <div>
            <h3 className="text-lg font-bold text-foreground border-l-4 border-brand pl-3 mb-4">Arquivos Recentes</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {RECENT_FILES.map((file) => (
                <div key={file.id} className="bg-card border border-border rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between group">
                  <div>
                    <div className={`w-10 h-10 rounded-lg ${file.bgColor} ${file.iconColor} flex items-center justify-center mb-4`}>
                      <FileText size={20} />
                    </div>
                    <h4 className="font-bold text-foreground text-sm line-clamp-1">{file.title}</h4>
                    <p className="text-xs text-muted-foreground mt-1">{file.date}</p>
                  </div>
                  <div className="flex items-center justify-between mt-6">
                    <span className="text-xs font-semibold text-muted-foreground bg-accent px-2 py-1 rounded-md">{file.size}</span>
                    <button className="text-sm font-semibold text-brand flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                      Baixar <Download size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="w-full xl:w-96 flex flex-col gap-6 shrink-0">
          
          <div className="bg-brand rounded-2xl p-6 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-1">Status Financeiro</h3>
              <p className="text-blue-200 text-xs mb-6">Visão geral do mês corrente</p>

              <div className="mb-5">
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span>Arrecadação</span>
                  <span>85%</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div className="bg-white h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold mb-2">
                  <span>Meta Fundo Reserva</span>
                  <span>R$ 50k / 100k</span>
                </div>
                <div className="w-full bg-black/20 rounded-full h-2">
                  <div className="bg-warning h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
              </div>
            </div>
            <div className="absolute -right-16 -top-16 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-base font-bold text-foreground flex items-center gap-2">
                <AlertTriangle size={18} className="text-destructive" />
                Inadimplência
              </h3>
              <button className="text-xs font-semibold text-muted-foreground hover:text-foreground">Ver Relatório</button>
            </div>
            
            <div className="space-y-4">
              {OVERDUE_UNITS.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center text-xs font-bold text-muted-foreground shrink-0">
                      {item.unit.split(' ')[1]}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{item.unit}</p>
                      <p className="text-xs text-muted-foreground">{item.days}</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-destructive">{item.value}</span>
                </div>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-border flex justify-between items-center">
              <span className="text-sm text-muted-foreground font-medium">Total Pendente</span>
              <span className="text-base font-bold text-destructive">R$ 4.630,00</span>
            </div>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-foreground mb-6">Próximos Vencimentos</h3>
            
            <div className="space-y-4">
              {UPCOMING_BILLS.map((bill, idx) => (
                <div key={idx} className="flex justify-between items-start pb-4 border-b border-border last:border-0 last:pb-0">
                  <div className="flex items-start gap-3">
                    <div className="flex flex-col items-center justify-center w-10 h-10 rounded-lg bg-accent shrink-0">
                      <span className="text-[10px] uppercase font-bold text-muted-foreground">{bill.date.split(' ')[0]}</span>
                      <span className="text-sm font-bold text-foreground leading-none">{bill.date.split(' ')[1]}</span>
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">{bill.title}</p>
                      <p className="text-xs text-muted-foreground">{bill.subtitle}</p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-foreground">{bill.value}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
