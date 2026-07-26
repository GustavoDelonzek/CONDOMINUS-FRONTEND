import { apiRequest } from './apiClient';

export type OccurrenceStatus = 'open' | 'in_progress' | 'resolved' | 'closed';
export type OccurrencePriority = 'low' | 'medium' | 'high';

export interface OccurrenceMedia {
  id: string;
  media_url: string;
  media_type: 'image' | 'video' | 'document' | 'audio';
  uploaded_at: string | null;
}

export interface BackendOccurrence {
  id: string;
  condominium_id: string;
  category: string;
  description: string | null;
  status: OccurrenceStatus;
  priority: OccurrencePriority;
  admin_response: string | null;
  responded_at: string | null;
  unit_id: string;
  unit: { id: string; number: string; floor: string | null; block: { id: string; name: string } | null } | null;
  user_id: string;
  user: { id: string; full_name: string; phone_number: string | null; email: string | null } | null;
  occurrence_media: OccurrenceMedia[];
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface OccurrenceListResponse {
  status_code: number;
  data: BackendOccurrence[];
  meta: PaginationMeta;
}

interface OccurrenceResponse {
  status_code: number;
  data: BackendOccurrence;
}

export interface ListOccurrencesParams {
  status?: OccurrenceStatus;
  priority?: OccurrencePriority;
  page?: number;
  perPage?: number;
}

export interface UpdateOccurrencePayload {
  status: OccurrenceStatus;
  priority?: OccurrencePriority;
  admin_response?: string;
  notify_resident?: boolean;
}

function toQueryString(params: ListOccurrencesParams) {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.priority) query.set('priority', params.priority);
  query.set('per_page', String(params.perPage ?? 20));
  if (params.page) query.set('page', String(params.page));
  return query.toString();
}

export async function listOccurrences(condominiumId: string, params: ListOccurrencesParams = {}) {
  const response = await apiRequest<OccurrenceListResponse>(`/v1/occurrences?${toQueryString(params)}`, {
    condoId: condominiumId,
  });
  return { items: response.data, meta: response.meta };
}

export async function updateOccurrence(condominiumId: string, id: string, payload: UpdateOccurrencePayload) {
  const response = await apiRequest<OccurrenceResponse>(`/v1/occurrences/${id}`, {
    method: 'PATCH',
    body: payload,
    condoId: condominiumId,
  });
  return response.data;
}
