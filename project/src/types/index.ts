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
  description: string;
  rating: number; // numeric(2,1) in schema
  price_range: string;
  glow_color: string;
  contact_phone?: string;
  contact_email?: string;
  booking_link?: string;
  created_at?: string; // timestamp with time zone
  updated_at?: string; // timestamp with time zone - should be present due to trigger
  
  // Image fields
  image_url?: string;
  images?: string[]; // text[] in schema
  
  // Hotel details with schema defaults
  room_count?: number; // default 12
  review_count?: number; // default 234
  check_in_time?: string; // default '3:00 PM'
  check_out_time?: string; // default '11:00 AM'
  concierge_hours?: string; // default '24/7'
  certification?: string; // default 'Certified Safari Lodge'
  
  // Rating breakdowns (all numeric(2,1) with defaults)
  rating_location?: number; // default 9.2
  rating_service?: number; // default 9.0
  rating_cleanliness?: number; // default 8.8
  rating_comfort?: number; // default 9.1
  rating_value?: number; // default 8.9
  
  // Text arrays
  highlights?: string[]; // text[] in schema
  location_highlights?: string[]; // text[] in schema - MISSING in original types
  
  // JSONB fields - stored as JSON in database
  amenities?: any[]; // jsonb default '[]' - simplified from HotelAmenity[]
  destinations?: any[]; // jsonb default '[]' - simplified from Destination[]
  
  // Fields in original types but NOT in schema - consider removing or adding to schema
  room_types?: RoomType[];
  safari_experiences?: SafariExperience[];
  nearby_attractions?: NearbyAttraction[];
  special_offers?: SpecialOffer[];
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
  banned_until?: string;
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