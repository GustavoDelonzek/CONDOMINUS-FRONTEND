import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useCondo } from '../../contexts/CondoContext';
import { ROLE_LABELS, destinationForRole } from '../../lib/roles';

export function CondoSwitcher() {
  const { memberships } = useAuth();
  const { activeCondoId, activeMembership, setActiveCondoId } = useCondo();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (memberships.length <= 1 || !activeMembership) return null;

  function handleSelect(condominiumId: string) {
    setOpen(false);
    if (condominiumId === activeCondoId) return;
    const membership = memberships.find((m) => m.condominiumId === condominiumId);
    if (!membership) return;
    setActiveCondoId(membership.condominiumId);
    navigate(destinationForRole(membership.role), { replace: true });
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-border px-2.5 py-1.5 hover:border-brand/30 transition-colors cursor-pointer"
      >
        <div className="w-7 h-7 rounded-full bg-brand/10 flex items-center justify-center text-brand shrink-0">
          <Building2 size={14} />
        </div>
        <div className="min-w-0 hidden sm:block text-left">
          <p className="text-xs font-bold text-foreground truncate max-w-[140px]">
            {activeMembership.condominiumName}
          </p>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {ROLE_LABELS[activeMembership.role]}
          </p>
        </div>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-card border border-border rounded-xl shadow-lg py-2 z-50">
          <p className="px-3 pb-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Trocar condomínio
          </p>
          {memberships.map((m) => {
            const selected = m.condominiumId === activeCondoId;
            return (
              <button
                key={m.condominiumId}
                type="button"
                onClick={() => handleSelect(m.condominiumId)}
                className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-accent transition-colors cursor-pointer ${
                  selected ? 'bg-brand/5' : ''
                }`}
              >
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-foreground truncate">{m.condominiumName}</p>
                  <p className="text-[10px] text-muted-foreground">{ROLE_LABELS[m.role]}</p>
                </div>
                {selected && <Check size={14} className="text-brand shrink-0" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
