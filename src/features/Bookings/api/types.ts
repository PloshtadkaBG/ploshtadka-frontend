export type BookingStatus =
  | "pending"
  | "confirmed"
  | "completed"
  | "cancelled"
  | "no_show";

export interface BookingCreate {
  venue_id: string;
  start_datetime: string; // ISO 8601
  end_datetime: string; // ISO 8601
  notes?: string | null;
}

export interface BookingResponse {
  id: string;
  venue_id: string;
  venue_owner_id: string;
  user_id: string;
  start_datetime: string;
  end_datetime: string;
  status: BookingStatus;
  price_per_hour: string;
  total_price: string;
  currency: string;
  notes: string | null;
  updated_at: string;
}
