import { CreditCard } from 'lucide-react';
import { PlaceholderPage } from '../../components/ui/PlaceholderPage';

export function Billing() {
  return (
    <PlaceholderPage
      icon={CreditCard}
      title="Billing"
      description="Faturamento e cobrança das assinaturas dos condomínios."
    />
  );
}
