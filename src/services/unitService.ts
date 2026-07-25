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

export async function listUnits(condominiumId: string, perPage = 15) {
  const response = await apiRequest<UnitListResponse>(
    `/v1/units?condominium_id=${condominiumId}&per_page=${perPage}`,
    { condoId: condominiumId },
  );
  return { items: response.data, meta: response.meta };
}
