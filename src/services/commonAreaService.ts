import { apiRequest } from './apiClient';

export interface BackendCommonArea {
  id: string;
  name: string;
  capacity: number | null;
  photo_url: string | null;
  booking_rules: Record<string, unknown> | null;
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

export async function listCommonAreas(condominiumId: string, perPage = 15) {
  const response = await apiRequest<CommonAreaListResponse>(`/v1/common-areas?per_page=${perPage}`, {
    condoId: condominiumId,
  });
  return { items: response.data, meta: response.meta };
}
