import { useState, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCondo } from '../../contexts/CondoContext';
import { ApiError } from '../../services/apiClient';
import { StepIndicator } from '../../components/ui/StepIndicator';

export function Login() {
  const { login } = useAuth();
  const { clearActiveCondo } = useCondo();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      setError('Informe e-mail e senha para continuar.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      await login(email, password);
      // Todo login pelo formulário força escolher o condomínio de novo — mesmo que a
      // membership seja a mesma de antes, mesmo com só uma opção. A escolha só persiste
      // durante uma sessão contínua (refresh de página), não entre logins novos.
      clearActiveCondo();
      const redirectTo = (location.state as { from?: Location } | null)?.from?.pathname ?? '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.status === 422) {
        setError('E-mail ou senha incorretos.');
      } else if (err instanceof ApiError && err.status === 0) {
        setError('Não foi possível conectar ao servidor. Tente novamente.');
      } else {
        setError('Não foi possível entrar. Tente novamente em instantes.');
      }
    } finally {
      setLoading(false);
    }
  }

  const inputClass = (hasError: boolean) =>
    `w-full px-3 py-2.5 bg-input-background border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 transition-colors ${
      hasError
        ? 'border-destructive focus:border-destructive focus:ring-destructive/20'
        : 'border-border focus:border-brand focus:ring-brand/20'
    }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm flex flex-col items-center gap-6">
        <div className="w-full">
          <div className="flex flex-col items-center mb-8">
            <img src="/logo.png" alt="Condominus" className="w-14 h-14 object-contain mb-4" />
            <h1 className="text-2xl font-bold text-foreground text-center">Entrar no Condominus</h1>
            <p className="text-sm text-muted-foreground mt-1 text-center">
              Gerencie condomínios, moradores e ocorrências em um só lugar.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            noValidate
            className="bg-card border border-border rounded-2xl shadow-sm p-6 md:p-8 flex flex-col gap-5"
          >
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-foreground">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu@email.com"
                className={inputClass(!!error)}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-foreground">
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className={inputClass(!!error)}
              />
            </div>

            {error && <p className="text-xs text-destructive -mt-2">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand text-white font-bold text-sm py-2.5 rounded-lg hover:bg-brand/90 transition-colors disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
            >
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
        </div>

        <StepIndicator currentStep={1} />

        <p className="text-xs text-muted-foreground text-center">
          Recuperação de senha ainda não disponível — fale com o administrador do seu condomínio.
        </p>
      </div>
    </div>
  );
}
