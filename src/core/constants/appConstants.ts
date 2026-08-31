// Mirrors src/constants.ts on web — keep values in sync, or better,
// eventually source both from a shared package.
export const APP_NAME = 'TourWise';

export const SUPPORT_EMAIL = 'support@itravelbohol.com';

export const DEFAULT_MAP_REGION = {
  latitude: 9.8500,   // Bohol, Philippines
  longitude: 124.1435,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

// Vehicle types from the web app
export const VEHICLE_TYPES = [
  'Sedan',
  '7-Seater',
  'Van',
  'Coaster / Mini Bus',
  'Bus',
  'Motorcycle',
  'Standard Boat',
  'Medium Boat',
  'Big Boat',
  'Yacht',
] as const;

export type VehicleType = (typeof VEHICLE_TYPES)[number];

export const VEHICLE_CAPACITIES: Record<VehicleType, number> = {
  'Sedan': 4,
  '7-Seater': 6,
  'Van': 14,
  'Coaster / Mini Bus': 27,
  'Bus': 45,
  'Motorcycle': 1,
  'Standard Boat': 12,
  'Medium Boat': 18,
  'Big Boat': 25,
  'Yacht': 25,
};

export const DRIVER_TYPES = ['driver', 'operator'] as const;
export type DriverType = (typeof DRIVER_TYPES)[number];

export type VehicleCategory = 'car' | 'motorcycle' | 'boat';
export const VEHICLE_CATEGORY: Record<VehicleType, VehicleCategory> = {
  'Sedan': 'car',
  '7-Seater': 'car',
  'Van': 'car',
  'Coaster / Mini Bus': 'car',
  'Bus': 'car',
  'Motorcycle': 'motorcycle',
  'Standard Boat': 'boat',
  'Medium Boat': 'boat',
  'Big Boat': 'boat',
  'Yacht': 'boat',
};

export const VEHICLE_MARKER_EMOJI: Record<VehicleCategory, string> = {
  car: '🚐',
  motorcycle: '🏍️',
  boat: '🚤',
};
