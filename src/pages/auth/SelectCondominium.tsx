import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, LogOut, ShieldCheck } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCondo } from '../../contexts/CondoContext';
import { StepIndicator } from '../../components/ui/StepIndicator';
import { ROLE_LABELS, destinationForRole, hasAdminAccess } from '../../lib/roles';

const ADMIN_OPTION_ID = '__admin__';

export function SelectCondominium() {
  const { user, memberships, logout } = useAuth();
  const { setActiveCondoId } = useCondo();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const showAdminOption = hasAdminAccess(user);
  const selectedMembership = memberships.find((m) => m.condominiumId === selectedId) ?? null;
  const selectedAdminOption = selectedId === ADMIN_OPTION_ID;

  function handleContinue() {
    if (selectedAdminOption) {
      navigate('/admin/dashboard', { replace: true });
      return;
    }
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
            <h1 className="text-2xl font-bold text-foreground text-center">
              {showAdminOption ? 'Como deseja entrar?' : 'Selecione seu condomínio'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              {showAdminOption
                ? 'Escolha o painel administrativo ou um condomínio específico para gerenciar.'
                : 'Escolha qual unidade deseja gerenciar nesta sessão.'}
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8 flex flex-col gap-3">
            <div className="flex flex-col gap-3 max-h-80 overflow-y-auto custom-scrollbar pr-1 -mr-1">
              {showAdminOption && (
                <button
                  type="button"
                  onClick={() => setSelectedId(ADMIN_OPTION_ID)}
                  className={`w-full flex items-center gap-3 rounded-xl p-4 text-left transition-colors cursor-pointer shrink-0 ${
                    selectedAdminOption
                      ? 'bg-brand/5 border-2 border-brand'
                      : 'bg-background border border-border hover:border-brand/30'
                  }`}
                >
                  <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0 text-brand">
                    <ShieldCheck size={18} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm text-foreground truncate">Painel Administrativo</p>
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mt-0.5">
                      {ROLE_LABELS.super_admin}
                    </p>
                  </div>
                  {selectedAdminOption && (
                    <div className="w-5 h-5 rounded-full bg-brand flex items-center justify-center shrink-0">
                      <Check size={12} className="text-white" />
                    </div>
                  )}
                </button>
              )}

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

              {!showAdminOption && memberships.length === 0 && (
                <div className="text-center py-8 text-sm text-muted-foreground">
                  Nenhum condomínio vinculado a este usuário.
                </div>
              )}
            </div>

            {(showAdminOption || memberships.length > 0) && (
              <button
                onClick={handleContinue}
                disabled={!selectedMembership && !selectedAdminOption}
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
