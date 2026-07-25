import { apiRequest } from './apiClient';

export interface BackendCondominium {
  id: string;
  name: string;
  address_full: string;
  settings: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface CondominiumListResponse {
  status_code: number;
  data: BackendCondominium[];
  meta: PaginationMeta;
}

interface CondominiumResponse {
  status_code: number;
  data: BackendCondominium;
}

export interface ListCondominiumsParams {
  name?: string;
  address?: string;
  page?: number;
}

export interface CondominiumPayload {
  name: string;
  address_full: string;
  settings?: Record<string, unknown>;
}

function toQueryString(params: ListCondominiumsParams) {
  const query = new URLSearchParams();
  if (params.name) query.set('name', params.name);
  if (params.address) query.set('address', params.address);
  if (params.page) query.set('page', String(params.page));
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export async function listCondominiums(params: ListCondominiumsParams = {}) {
  const response = await apiRequest<CondominiumListResponse>(`/v1/condominiums${toQueryString(params)}`);
  return { items: response.data, meta: response.meta };
}

export async function getCondominium(id: string) {
  const response = await apiRequest<CondominiumResponse>(`/v1/condominiums/${id}`);
  return response.data;
}

export async function createCondominium(payload: CondominiumPayload) {
  const response = await apiRequest<CondominiumResponse>('/v1/condominiums', { method: 'POST', body: payload });
  return response.data;
}

export async function updateCondominium(id: string, payload: CondominiumPayload) {
  const response = await apiRequest<CondominiumResponse>(`/v1/condominiums/${id}`, { method: 'PUT', body: payload });
  return response.data;
}
