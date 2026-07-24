import { Settings as SettingsIcon } from 'lucide-react';
import { PlaceholderPage } from '../../components/ui/PlaceholderPage';

export function Settings() {
  return (
    <PlaceholderPage
      icon={SettingsIcon}
      title="Settings"
      description="Configurações gerais da conta e da plataforma."
    />
  );
}
