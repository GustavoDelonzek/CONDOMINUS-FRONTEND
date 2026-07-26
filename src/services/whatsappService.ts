import { apiRequest } from './apiClient';

export type WhatsAppInstanceStatus = 'not_configured' | 'connecting' | 'open' | 'close';

export interface WhatsAppInstanceStatusResponse {
  status_code: number;
  status: WhatsAppInstanceStatus;
  phone_number_connected: string | null;
}

export interface WhatsAppConnectResponse {
  status_code: number;
  status: WhatsAppInstanceStatus;
  qrcode: string | null;
}

export type MessageDirection = 'inbound' | 'outbound';

export interface BackendMessageLog {
  id: string;
  direction: MessageDirection;
  content: string;
  media_url: string | null;
  phone_number: string;
  user: { id: string; full_name: string } | null;
  created_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

interface MessageLogListResponse {
  status_code: number;
  data: BackendMessageLog[];
  meta: PaginationMeta;
}

export async function getInstanceStatus(condominiumId: string) {
  return apiRequest<WhatsAppInstanceStatusResponse>('/v1/whatsapp/instance', {
    condoId: condominiumId,
  });
}

export async function connectInstance(condominiumId: string) {
  return apiRequest<WhatsAppConnectResponse>('/v1/whatsapp/instance', {
    method: 'POST',
    condoId: condominiumId,
  });
}

export async function listMessages(condominiumId: string, perPage = 50) {
  const response = await apiRequest<MessageLogListResponse>(`/v1/whatsapp/messages?per_page=${perPage}`, {
    condoId: condominiumId,
  });
  return { items: response.data, meta: response.meta };
}
