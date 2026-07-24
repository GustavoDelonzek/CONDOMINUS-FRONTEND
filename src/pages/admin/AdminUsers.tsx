import { Users } from 'lucide-react';
import { PlaceholderPage } from '../../components/ui/PlaceholderPage';

export function AdminUsers() {
  return (
    <PlaceholderPage
      icon={Users}
      title="Users"
      description="Administração de usuários e permissões de acesso."
    />
  );
}
