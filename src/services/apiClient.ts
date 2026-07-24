const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

export class ApiError extends Error {
  status: number;
  errors?: Record<string, string[]>;

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  token?: string | null;
}

// Toda resposta do backend passa pelo ResponseMiddleware dele, que sempre injeta
// `status_code` no corpo — por isso dá pra tratar erro só olhando `response.ok` + `data.message`,
// sem parsing especial por endpoint (ver docs/auth-routes.md).
export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = typeof data?.message === 'string' ? data.message : `Erro ${response.status} ao chamar ${path}`;
    throw new ApiError(response.status, message, data?.errors);
  }

  return data as T;
}
