import { apiRequest } from './apiClient';

export interface BackendUnit {
  id: string;
  number: string;
  floor: string | null;
  block_id: string | null;
  condominium_id: string;
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface UnitListResponse {
  status_code: number;
  data: BackendUnit[];
  meta: PaginationMeta;
}

interface UnitResponse {
  status_code: number;
  data: BackendUnit;
}

export interface ListUnitsParams {
  blockId?: string;
  number?: string;
  floor?: string;
  page?: number;
  perPage?: number;
}

function toQueryString(condominiumId: string, params: ListUnitsParams) {
  const query = new URLSearchParams();
  query.set('condominium_id', condominiumId);
  if (params.blockId) query.set('block_id', params.blockId);
  if (params.number) query.set('number', params.number);
  if (params.floor) query.set('floor', params.floor);
  query.set('per_page', String(params.perPage ?? 20));
  if (params.page) query.set('page', String(params.page));
  return query.toString();
}

export async function listUnits(condominiumId: string, params: ListUnitsParams = {}) {
  const response = await apiRequest<UnitListResponse>(`/v1/units?${toQueryString(condominiumId, params)}`, {
    condoId: condominiumId,
  });
  return { items: response.data, meta: response.meta };
}

export async function createUnit(
  condominiumId: string,
  payload: { block_id: string; number: string; floor: string },
) {
  const response = await apiRequest<UnitResponse>('/v1/units', {
    method: 'POST',
    body: { condominium_id: condominiumId, ...payload },
    condoId: condominiumId,
  });
  return response.data;
}

export async function updateUnit(condominiumId: string, id: string, payload: { number: string; floor: string }) {
  const response = await apiRequest<UnitResponse>(`/v1/units/${id}`, {
    method: 'PUT',
    body: payload,
    condoId: condominiumId,
  });
  return response.data;
}

export async function deleteUnit(condominiumId: string, id: string) {
  await apiRequest(`/v1/units/${id}`, { method: 'DELETE', condoId: condominiumId });
}
