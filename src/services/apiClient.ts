const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000/api';

let activeCondoId: string | null = null;

export function setActiveCondoId(condominiumId: string | null) {
  activeCondoId = condominiumId;
}

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

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
  condoId?: string | null;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { method = 'GET', body, token, condoId } = options;
  const effectiveToken = token ?? authToken;
  const effectiveCondoId = condoId !== undefined ? condoId : activeCondoId;

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(effectiveToken ? { Authorization: `Bearer ${effectiveToken}` } : {}),
        ...(effectiveCondoId ? { 'X-Condo-Id': effectiveCondoId } : {}),
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(0, 'Não foi possível conectar ao servidor.');
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      unauthorizedHandler?.();
    }
    const message = typeof data?.message === 'string' ? data.message : `Erro ${response.status} ao chamar ${path}`;
    throw new ApiError(response.status, message, data?.errors);
  }

  return data as T;
}
