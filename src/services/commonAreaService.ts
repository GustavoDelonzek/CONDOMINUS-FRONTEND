import { apiRequest } from './apiClient';

export interface BookingRules {
  opens_at?: string | null;
  closes_at?: string | null;
  min_advance_hours?: number | null;
  max_duration_hours?: number | null;
  max_reservations_per_unit_per_month?: number | null;
  requires_approval?: boolean | null;
  fee?: number | null;
}

export interface BackendCommonArea {
  id: string;
  name: string;
  capacity: number | null;
  photo_url: string | null;
  booking_rules: BookingRules | null;
  is_active: boolean;
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

interface CommonAreaListResponse {
  status_code: number;
  data: BackendCommonArea[];
  meta: PaginationMeta;
}

interface CommonAreaResponse {
  status_code: number;
  data: BackendCommonArea;
}

export async function listCommonAreas(condominiumId: string, perPage = 15) {
  const response = await apiRequest<CommonAreaListResponse>(`/v1/common-areas?per_page=${perPage}`, {
    condoId: condominiumId,
  });
  return { items: response.data, meta: response.meta };
}

export async function createCommonArea(condominiumId: string, name: string) {
  const response = await apiRequest<CommonAreaResponse>('/v1/common-areas', {
    method: 'POST',
    body: { name, condominium_id: condominiumId },
    condoId: condominiumId,
  });
  return response.data;
}

export async function updateCommonArea(
  condominiumId: string,
  id: string,
  payload: { name: string; booking_rules?: BookingRules },
) {
  const response = await apiRequest<CommonAreaResponse>(`/v1/common-areas/${id}`, {
    method: 'PUT',
    body: payload,
    condoId: condominiumId,
  });
  return response.data;
}

export async function deleteCommonArea(condominiumId: string, id: string) {
  await apiRequest(`/v1/common-areas/${id}`, { method: 'DELETE', condoId: condominiumId });
}
