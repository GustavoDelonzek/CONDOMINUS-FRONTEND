import { useEffect, useState, type ReactNode } from 'react';
import { CondoContext } from './CondoContext';
import { useAuth } from './AuthContext';
import { setActiveCondoId as setApiClientCondoId } from '../services/apiClient';
import { ACTIVE_CONDO_STORAGE_KEY } from '../lib/storageKeys';

export function CondoProvider({ children }: { children: ReactNode }) {
  const { memberships } = useAuth();
  const [selectedCondoId, setSelectedCondoId] = useState<string | null>(() =>
    localStorage.getItem(ACTIVE_CONDO_STORAGE_KEY)
  );

  const activeMembership = memberships.find((m) => m.condominiumId === selectedCondoId) ?? null;
  const activeCondoId = activeMembership ? selectedCondoId : null;

  useEffect(() => {
    setApiClientCondoId(activeCondoId);
  }, [activeCondoId]);

  function setActiveCondoId(condominiumId: string) {
    setSelectedCondoId(condominiumId);
    localStorage.setItem(ACTIVE_CONDO_STORAGE_KEY, condominiumId);
  }

  function clearActiveCondo() {
    setSelectedCondoId(null);
    localStorage.removeItem(ACTIVE_CONDO_STORAGE_KEY);
  }

  return (
    <CondoContext.Provider value={{ activeCondoId, activeMembership, setActiveCondoId, clearActiveCondo }}>
      {children}
    </CondoContext.Provider>
  );
}
