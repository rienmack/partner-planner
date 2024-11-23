export type RequestStatus = 'pending' | 'accepted' | 'rejected';

export interface PartnerRequest {
  id: string;
  requester_id: string;
  recipient_id: string;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
} 