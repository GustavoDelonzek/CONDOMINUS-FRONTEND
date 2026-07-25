import { DollarSign, AlertCircle, Users, Package, Sun, Calendar, Bell, UserPlus } from 'lucide-react';
import { SyndicStatCard } from '../components/cards/SyndicStatCard';

export function SyndicDashboard() {
  return (
    <div className="flex flex-col xl:flex-row gap-6 h-full p-4 md:p-6 bg-background">
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 custom-scrollbar">
        <div className="bg-gradient-to-r from-brand to-purple-600 rounded-2xl p-8 text-white shadow-md relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl font-bold mb-2">Olá, John Smith</h2>
                <p className="text-white/80 mb-6 font-medium">Aqui está o resumo do Ocean View Towers para hoje.</p>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 text-sm font-semibold shadow-sm">
                        <Sun size={18} className="text-yellow-300" />
                        28°C Ensolarado
                    </div>
                    <div className="flex items-center gap-2 bg-white/20 px-4 py-2 rounded-lg backdrop-blur-sm border border-white/10 text-sm font-semibold shadow-sm">
                        <Calendar size={18} className="text-blue-100" />
                        3 Reservas hoje
                    </div>
                </div>
            </div>
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-white/5 rounded-full blur-3xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <SyndicStatCard
                icon={<DollarSign size={20} />}
                iconBgClass="bg-success/10"
                iconColorClass="text-success"
                topRightElement={<span className="text-success font-bold text-sm">~ +12%</span>}
                label="Arrecadação Mensal"
                value="R$ 42.500"
                barColorClass="bg-success"
                barWidth="w-full"
            />
             <SyndicStatCard
                icon={<AlertCircle size={20} />}
                iconBgClass="bg-warning/10"
                iconColorClass="text-warning"
                topRightElement={<span className="text-warning font-bold text-xs bg-warning/10 px-2 py-1 rounded-md">Atenção</span>}
                label="Chamados Abertos"
                value="8"
                subValue="pendentes"
                barColorClass="bg-warning"
                barWidth="w-1/3"
            />
            <SyndicStatCard
                icon={<Users size={20} />}
                iconBgClass="bg-info/10"
                iconColorClass="text-info"
                label="Ocupação"
                value="94%"
                subValue="47/50 unidades"
                barColorClass="bg-info"
                barWidth="w-[94%]"
            />
             <SyndicStatCard
                icon={<Package size={20} />}
                iconBgClass="bg-brand/10"
                iconColorClass="text-brand"
                label="Entregas Recebidas"
                value="14"
                subValue="pacotes"
                barColorClass="bg-brand"
                barWidth="w-full"
            />
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex-1">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-foreground border-l-4 border-brand pl-3">Últimas Atividades</h3>
                <button className="text-sm text-brand font-semibold hover:underline">Ver todas</button>
            </div>
            
            <div className="space-y-6">
                <div className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                    <img src="https://i.pravatar.cc/150?u=carlos" alt="User" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                            <p className="font-semibold text-foreground">Carlos Mendes <span className="text-muted-foreground font-normal text-sm">Ap. 301</span></p>
                            <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded">Reserva</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Reservou o Salão de Festas para o dia 25/10.</p>
                        <span className="text-xs text-muted-foreground mt-2 block">10 min atrás</span>
                    </div>
                </div>

                 <div className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                    <img src="https://i.pravatar.cc/150?u=fernanda" alt="User" className="w-10 h-10 rounded-full object-cover" />
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <p className="font-semibold text-foreground">Fernanda Lima <span className="text-muted-foreground font-normal text-sm">Ap. 304</span></p>
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">Acesso</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Registrou um visitante: Pedro Alcantara.</p>
                        <span className="text-xs text-muted-foreground mt-2 block">45 min atrás</span>
                    </div>
                </div>

                 <div className="flex items-start gap-4 pb-4 border-b border-border last:border-0">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                        <Package size={20} />
                    </div>
                    <div className="flex-1">
                        <div className="flex justify-between items-start">
                             <p className="font-semibold text-foreground">Portaria Central <span className="text-muted-foreground font-normal text-sm">Ap. 501</span></p>
                            <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-1 rounded">Entrega</span>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">Recebimento de 3 encomendas para o Ap. 501.</p>
                        <span className="text-xs text-muted-foreground mt-2 block">1h atrás</span>
                    </div>
                </div>
            </div>
        </div>
      </div>

      <div className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
          <div className="grid grid-cols-2 gap-4">
              <button className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-accent hover:border-brand/30 transition-all shadow-sm group">
                  <div className="w-10 h-10 rounded-lg bg-brand/10 text-brand flex items-center justify-center group-hover:bg-brand group-hover:text-white transition-colors">
                      <Bell size={20} />
                  </div>
                  <span className="text-xs font-semibold text-foreground text-center">Novo Aviso</span>
              </button>
              <button className="bg-card border border-border rounded-xl p-4 flex flex-col items-center justify-center gap-2 hover:bg-accent hover:border-success/30 transition-all shadow-sm group">
                  <div className="w-10 h-10 rounded-lg bg-success/10 text-success flex items-center justify-center group-hover:bg-success group-hover:text-white transition-colors">
                      <UserPlus size={20} />
                  </div>
                  <span className="text-xs font-semibold text-foreground text-center">Cadastrar Visitante</span>
              </button>
          </div>

          <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex-1">
              <h3 className="text-md font-bold text-foreground border-l-4 border-warning pl-3 mb-4">Comunicados Ativos</h3>

              <div className="bg-red-50 border border-red-100 rounded-xl p-4">
                  <span className="bg-destructive text-white text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">Urgente</span>
                  <h4 className="font-bold text-red-900 mt-2">Manutenção no Elevador Social</h4>
                  <p className="text-xs text-red-700 mt-1 mb-2 font-medium">Postado hoje, às 08:00</p>
                  <p className="text-sm text-red-800 leading-relaxed mb-3">
                      O elevador social do Bloco B passará por manutenção preventiva hoje das 14h às 16h. Por favor, utilizem o elevador de serviço.
                  </p>
                  <button className="text-xs font-bold text-red-600 hover:text-red-800 hover:underline">Ver todos os comunicados</button>
              </div>
          </div>
      </div>
    </div>
  );
}
