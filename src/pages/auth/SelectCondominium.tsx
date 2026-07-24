import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, LogOut } from 'lucide-react';
import { useAuth, type UserRole } from '../../contexts/AuthContext';
import { useCondo } from '../../contexts/CondoContext';
import { StepIndicator } from '../../components/ui/StepIndicator';

const ROLE_LABELS: Record<UserRole, string> = {
  super_admin: 'Administrador da Plataforma',
  company_admin: 'Administradora',
  syndic: 'Síndico',
  porter: 'Portaria',
  landlord: 'Proprietário',
  resident: 'Morador',
};

function destinationForRole(role: UserRole) {
  return role === 'syndic' ? '/syndic/dashboard' : '/admin/dashboard';
}

export function SelectCondominium() {
  const { memberships, logout } = useAuth();
  const { setActiveCondoId } = useCondo();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedMembership = memberships.find((m) => m.condominiumId === selectedId) ?? null;

  function handleContinue() {
    if (!selectedMembership) return;
    setActiveCondoId(selectedMembership.condominiumId);
    navigate(destinationForRole(selectedMembership.role), { replace: true });
  }

  async function handleLogout() {
    await logout();
    navigate('/login', { replace: true });
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md flex flex-col items-center gap-6">
        <div className="w-full">
          <div className="flex flex-col items-center mb-8">
            <h1 className="text-2xl font-bold text-foreground text-center">Selecione seu condomínio</h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Escolha qual unidade deseja gerenciar nesta sessão.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8 flex flex-col gap-3">
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-1 -mr-1">
              {memberships.map((m) => {
                const selected = m.condominiumId === selectedId;
                return (
                  <button
                    key={m.condominiumId}
                    type="button"
                    onClick={() => setSelectedId(m.condominiumId)}
                    className={`w-full flex items-center gap-3 rounded-xl p-4 text-left transition-colors cursor-pointer shrink-0 ${
                      selected
                        ? 'bg-brand/5 border-2 border-brand'
                        : 'bg-background border border-border hover:border-brand/30'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center shrink-0 text-muted-foreground">
                      <Building2 size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-sm text-foreground truncate">{m.condominiumName}</p>
                      {m.unit && (
                        <p className="text-xs text-muted-foreground truncate">
                          Unidade {m.unit.number}
                          {m.unit.floor ? ` — ${m.unit.floor}º andar` : ''}
                        </p>
                      )}
                      <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
                        {ROLE_LABELS[m.role]}
                      </p>
                    </div>
                    {selected && (
                      <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shrink-0">
                        <Check size={12} className="text-white" />
                      </div>
                    )}
                  </button>
                );
              })}

              {memberships.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Nenhum condomínio vinculado a este usuário.
                </div>
              )}
            </div>

            {memberships.length > 0 && (
              <button
                onClick={handleContinue}
                disabled={!selectedMembership}
                className="w-full mt-2 bg-brand text-white font-bold text-sm py-2.5 rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
              >
                Continuar
              </button>
            )}
          </div>
        </div>

        <StepIndicator currentStep={2} />

        <div className="flex flex-col items-center gap-3">
          <p className="text-xs text-muted-foreground text-center">
            Não encontrou seu condomínio?{' '}
            <span className="text-brand font-semibold cursor-not-allowed" title="Ainda não disponível">
              Contatar suporte
            </span>
          </p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors"
          >
            <LogOut size={14} /> Sair da conta
          </button>
        </div>
      </div>
    </div>
  );
}
