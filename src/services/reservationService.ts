import { apiRequest } from './apiClient';
import type { BookingRules } from './commonAreaService';

export type ReservationStatus = 'pending' | 'confirmed' | 'canceled' | 'completed' | 'denied';

export interface BackendReservation {
  id: string;
  condominium_id: string;
  common_area_id: string;
  common_area: { id: string; name: string; capacity: number | null; booking_rules: BookingRules | null } | null;
  unit_id: string;
  unit: { id: string; number: string; floor: string | null } | null;
  user_id: string;
  user: { id: string; full_name: string; phone_number: string | null } | null;
  start_time: string;
  end_time: string;
  status: ReservationStatus;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface ReservationListResponse {
  status_code: number;
  data: BackendReservation[];
  meta: PaginationMeta;
}

interface ReservationResponse {
  status_code: number;
  data: BackendReservation;
}

export interface ListReservationsParams {
  status?: ReservationStatus;
  commonAreaId?: string;
  page?: number;
  perPage?: number;
}

function toQueryString(params: ListReservationsParams) {
  const query = new URLSearchParams();
  if (params.status) query.set('status', params.status);
  if (params.commonAreaId) query.set('common_area_id', params.commonAreaId);
  query.set('per_page', String(params.perPage ?? 20));
  if (params.page) query.set('page', String(params.page));
  return query.toString();
}

export async function listReservations(condominiumId: string, params: ListReservationsParams = {}) {
  const response = await apiRequest<ReservationListResponse>(`/v1/reservations?${toQueryString(params)}`, {
    condoId: condominiumId,
  });
  return { items: response.data, meta: response.meta };
}

export async function updateReservationStatus(
  condominiumId: string,
  id: string,
  status: Exclude<ReservationStatus, 'pending'>,
) {
  const response = await apiRequest<ReservationResponse>(`/v1/reservations/${id}`, {
    method: 'PATCH',
    body: { status },
    condoId: condominiumId,
  });
  return response.data;
}
