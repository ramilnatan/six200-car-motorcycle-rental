export const CAR_CATEGORIES = [
  { value: 'sedan', label: 'Sedan' },
  { value: 'suv', label: 'SUV' },
  { value: 'van', label: 'Van' },
  { value: 'pickup', label: 'Pickup' },
  { value: 'luxury', label: 'Luxury' },
]

export const MOTORCYCLE_CATEGORIES = [
  { value: 'scooter', label: 'Scooter' },
  { value: 'standard', label: 'Standard' },
  { value: 'sport', label: 'Sport Bike' },
  { value: 'adventure', label: 'Adventure Bike' },
  { value: 'touring', label: 'Touring Bike' },
]

export const ALL_CATEGORIES = [...CAR_CATEGORIES, ...MOTORCYCLE_CATEGORIES]

export const PICKUP_LOCATIONS = [
  'Six200 Main Office — Quezon City',
  'Six200 Branch — Makati CBD',
  'Six200 Branch — BGC, Taguig',
  'Six200 Branch — Cebu City',
  'Six200 Branch — Davao City',
  'Airport Pickup — NAIA Terminal 1',
  'Airport Pickup — NAIA Terminal 3',
  'Airport Pickup — Clark International Airport',
  'Custom Location (specify in remarks)',
]
