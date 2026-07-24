import { createContext, useContext } from 'react';
import type { Membership } from './AuthContext';

export interface CondoContextValue {
  activeCondoId: string | null;
  activeMembership: Membership | null;
  setActiveCondoId: (condominiumId: string) => void;
  clearActiveCondo: () => void;
}

export const CondoContext = createContext<CondoContextValue | undefined>(undefined);

export function useCondo() {
  const ctx = useContext(CondoContext);
  if (!ctx) throw new Error('useCondo deve ser usado dentro de <CondoProvider>');
  return ctx;
}
