import { useState } from 'react';
import { Sidebar } from './components/layout/Sidebar';

function App() {
  const [activeItem, setActiveItem] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-background font-sans">
      <Sidebar activeItem={activeItem} onNavigate={setActiveItem} />

      <main className="flex-1 flex flex-col">

        <header className="h-20 flex items-center justify-between px-10 bg-transparent border-b border-border">
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-bold text-foreground">Gustavo Brizola</p>
              <p className="text-xs text-muted-foreground">Super Admin</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              GB
            </div>
          </div>
        </header>

        <div className="p-10 pt-6 overflow-y-auto">
          <div className="border-2 border-dashed border-border rounded-lg h-96 flex items-center justify-center text-muted-foreground">
            Espaço para os KPIs e Tabela de Condomínios
          </div>
        </div>

      </main>
    </div>
  );
}

export default App;