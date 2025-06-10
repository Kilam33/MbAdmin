export interface SafariPackage {
  id: string;
  slug: string;
  title: string;
  duration: string;
  group_size: string;
  overview: string;
  itinerary_highlights: string[];
  inclusions: string[];
  exclusions: string[];
  best_travel_season: string;
  price_range: number;
  tags: string[];
  rating: number;
  image_url: string;
  image_gallery?: string[];
  image_suggestions: string[];
  destination_category: 'Masai Mara' | 'Combo' | 'Samburu' | 'Lake Nakuru' | 'Amboseli';
  package_category: 'Premium' | 'Classic' | 'Adventure' | 'Cultural';
  is_featured?: boolean;
  created_at?: string;
}

export interface Hotel {
  id: string;
  name: string;
  type: 'hotel' | 'camp' | 'lodge';
  location: string;
  image_url?: string;
  images?: string[];
  description: string;
  rating: number;
  price_range: string;
  glow_color: string;
  contact_phone?: string;
  contact_email?: string;
  booking_link?: string;
  room_count?: number;
  review_count?: number;
  check_in_time?: string;
  check_out_time?: string;
  concierge_hours?: string;
  certification?: string;
  rating_location?: number;
  rating_service?: number;
  rating_cleanliness?: number;
  rating_comfort?: number;
  rating_value?: number;
  highlights?: string[];
  amenities?: HotelAmenity[];
  destinations?: Destination[];
  room_types?: RoomType[];
  safari_experiences?: SafariExperience[];
  nearby_attractions?: NearbyAttraction[];
  special_offers?: SpecialOffer[];
  created_at?: string;
  updated_at?: string;
}

export interface Destination {
  id: string;
  name: string;
  tagline: string;
  image_url: string;
  glow_color: string;
  description: string;
  key_features: string[];
  link: string;
}

export interface HotelAmenity {
  id: string;
  hotel_id: string;
  icon_name: string;
  text: string;
  created_at?: string;
}

export interface RoomType {
  id: number;
  hotel_id: string;
  name: string;
  size: string;
  occupancy: string;
  beds: string;
  features: string[];
  created_at?: string;
  updated_at?: string;
}

export interface SafariExperience {
  id: number;
  hotel_id: string;
  name: string;
  description: string;
  icon_name: string;
  gradient_from: string;
  gradient_to: string;
  created_at?: string;
  updated_at?: string;
}

export interface NearbyAttraction {
  id: string;
  hotel_id: string;
  name: string;
  distance: string;
  type: string;
  created_at?: string;
  updated_at?: string;
}

export interface SpecialOffer {
  id: string;
  hotel_id: string;
  title: string;
  description: string;
  validity?: string;
  discount?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Booking {
  id: string;
  user_id: string;
  package_id: string;
  start_date: string;
  end_date: string;
  note?: string;
  status: 'pending' | 'awaiting_payment' | 'confirmed' | 'cancelled' | 'failed';
  created_at: string;
  updated_at?: string;
  payment_reference?: string;
  adults: number;
  children: number;
  traveler_count: number;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  contact_country?: string;
  special_requests?: string;
  total_amount?: number;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  status: 'pending' | 'responded' | 'spam' | 'archived';
  created_at: string;
  updated_at: string;
  metadata?: any;
}

export interface Review {
  id: string;
  package_id: string;
  name: string;
  email: string;
  rating: number;
  title?: string;
  comment: string;
  submitted_at: string;
  is_verified: boolean;
  is_approved: boolean;
  user_id?: string;
  ip_address?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  created_at?: string;
  last_sign_in_at?: string;
  user_metadata?: {
    full_name?: string;
    name?: string;
    role?: string;
    avatar_url?: string;
  };
  app_metadata?: {
    provider?: string;
    role?: string;
  };
}

export interface DashboardStats {
  totalPackages: number;
  totalHotels: number;
  totalBookings: number;
  totalInquiries: number;
  pendingBookings: number;
  pendingInquiries: number;
  recentBookings: Booking[];
  recentInquiries: ContactInquiry[];
}