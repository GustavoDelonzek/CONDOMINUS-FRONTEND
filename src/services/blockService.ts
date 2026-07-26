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

interface BlockResponse {
  status_code: number;
  data: BackendBlock;
}

export async function listBlocks(condominiumId: string, perPage = 15) {
  const response = await apiRequest<BlockListResponse>(
    `/v1/blocks?condominium_id=${condominiumId}&per_page=${perPage}`,
    { condoId: condominiumId },
  );
  return { items: response.data, meta: response.meta };
}

export async function createBlock(condominiumId: string, name: string) {
  const response = await apiRequest<BlockResponse>('/v1/blocks', {
    method: 'POST',
    body: { name },
    condoId: condominiumId,
  });
  return response.data;
}

export async function updateBlock(condominiumId: string, id: string, name: string) {
  const response = await apiRequest<BlockResponse>(`/v1/blocks/${id}`, {
    method: 'PUT',
    body: { name },
    condoId: condominiumId,
  });
  return response.data;
}

export async function deleteBlock(condominiumId: string, id: string) {
  await apiRequest(`/v1/blocks/${id}`, { method: 'DELETE', condoId: condominiumId });
}
