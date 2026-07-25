import { apiRequest } from './apiClient';

export interface BackendBlock {
  id: string;
  name: string;
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

interface BlockListResponse {
  status_code: number;
  data: BackendBlock[];
  meta: PaginationMeta;
}

export async function listBlocks(condominiumId: string, perPage = 15) {
  const response = await apiRequest<BlockListResponse>(
    `/v1/blocks?condominium_id=${condominiumId}&per_page=${perPage}`,
    { condoId: condominiumId },
  );
  return { items: response.data, meta: response.meta };
}
