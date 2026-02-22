export type SportType =
  | "football"
  | "basketball"
  | "tennis"
  | "volleyball"
  | "swimming"
  | "gym"
  | "padel"
  | "other";
export type VenueStatus =
  | "active"
  | "inactive"
  | "maintenance"
  | "pending_approval";

export interface DayHours {
  open: string;
  close: string;
}

export interface VenueListItem {
  id: string;
  name: string;
  city: string;
  sport_types: SportType[];
  status: VenueStatus;
  price_per_hour: string;
  currency: string;
  capacity: number;
  is_indoor: boolean;
  rating: string;
  total_reviews: number;
  thumbnail?: string | null;
}

export interface VenueResponse extends Omit<VenueListItem, "thumbnail"> {
  description: string;
  address: string;
  latitude?: string | null;
  longitude?: string | null;
  owner_id: string;
  total_bookings: number;
  updated_at: string;
  amenities: string[];
  working_hours: Record<string, DayHours>;
  images: VenueImageResponse[];
  unavailabilities: VenueUnavailabilityResponse[];
}

export interface VenueCreate {
  name: string;
  description: string;
  sport_types: SportType[];
  address: string;
  city: string;
  price_per_hour: number | string;
  currency?: string;
  capacity?: number;
  is_indoor?: boolean;
  working_hours?: Record<string, DayHours>;
  // ... other optional fields
}

export interface VenueImageResponse {
  id: string;
  venue_id: string;
  url: string;
  is_thumbnail: boolean;
  order: number;
}

export interface VenueUnavailabilityResponse {
  id: string;
  venue_id: string;
  start_datetime: string;
  end_datetime: string;
  reason?: string | null;
}
