import { apiRequest } from './apiClient';

export interface BackendUser {
  id: string;
  full_name: string;
  email: string;
  phone_number: string | null;
  photo_url: string | null;
  is_super_admin: boolean;
}

export interface BackendMembership {
  id: string;
  role: string;
  is_active: boolean;
  condominium: { id: string; name: string };
  unit: { id: string; number: string; floor: string } | null;
}

interface LoginResponse {
  status_code: number;
  user: BackendUser;
  token: string;
}

interface MeApiResponse {
  status_code: number;
  data: BackendUser & { memberships: BackendMembership[] };
}

export function login(email: string, password: string) {
  return apiRequest<LoginResponse>('/v1/login', { method: 'POST', body: { email, password } });
}

export function logout(token: string) {
  return apiRequest<{ status_code: number; message: string }>('/v1/logout', { method: 'POST', token });
}

export async function me(token: string) {
  const response = await apiRequest<MeApiResponse>('/v1/me', { token });
  return response.data;
}
