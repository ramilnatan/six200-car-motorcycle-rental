export type VehicleType = 'car' | 'motorcycle'
export type VehicleStatus = 'available' | 'booked' | 'maintenance'
export type Transmission = 'manual' | 'automatic'
export type FuelType = 'gasoline' | 'diesel' | 'electric' | 'hybrid'
export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface Vehicle {
  id: string
  vehicle_type: VehicleType
  name: string
  category: string
  transmission: Transmission
  fuel_type: FuelType
  seats: number | null
  engine_cc: number | null
  luggage_capacity: number | null
  helmet_included: boolean
  top_box: boolean
  price_per_day: number
  photo_url: string | null
  gallery_urls: string[]
  availability_status: VehicleStatus
  mileage_limit: number | null
  features: string[]
  description: string | null
  is_featured: boolean
  created_at: string
}

export interface Booking {
  id: string
  customer_name: string
  contact_number: string
  email: string
  vehicle_id: string | null
  pickup_date: string
  return_date: string
  pickup_location: string
  with_driver: boolean
  special_requests: string | null
  status: BookingStatus
  total_amount: number | null
  created_at: string
  vehicles?: Vehicle
}

export interface Review {
  id: string
  customer_name: string
  customer_photo: string | null
  rating: number
  comment: string
  vehicle_id: string | null
  is_approved: boolean
  created_at: string
}

export interface BookingFormData {
  customer_name: string
  contact_number: string
  email: string
  vehicle_id: string
  pickup_date: string
  return_date: string
  pickup_location: string
  with_driver: boolean
  special_requests: string
}

export interface VehicleFilters {
  vehicle_type: VehicleType | 'all'
  category: string
  transmission: Transmission | 'all'
  min_price: number
  max_price: number
  availability_status: VehicleStatus | 'all'
  sort: 'price_asc' | 'price_desc' | 'newest' | 'popular'
}
