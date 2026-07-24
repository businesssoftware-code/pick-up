export type TripStatus =
  | 'CREATED'
  | 'STARTED'
  | 'REACHED_PICKUP'
  | 'PAUSED'
  | 'IN_TRANSIT'
  | 'REACHED_DESTINATION'
  | 'COMPLETED'
  | 'CANCELLED';

export interface Driver {
  id: number;
  name: string;
  phoneNumber: string;
  licenseNumber?: string;
  isActive: boolean;
}

export interface Vehicle {
  id: number;
  vehicleNumber: string;
  vehicleType?: string;
  brand?: string;
  model?: string;
  color?: string;
  isActive: boolean;
}

export interface Outlet {
  id: number;
  name: string;
  address?: string;
}

export interface TripOutlet {
  id: number;
  name: string;
  address?: string;
  type: string;
  Area?: {areaManagerId: number;}
  latitude?: number;
  longitude?: number;
}

export interface PaginatedTrips {
  data: Trip[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
export interface Trip {
  id: number;
  status: TripStatus;
  tripDate: string;
  driverId: number;
  vehicleId: number;
  pickupOutletId: number;
  dropOutletId: number;
  driver: Driver;
  vehicle: Vehicle;
  pickupOutlet: TripOutlet;
  dropOutlet: TripOutlet;

  startedAt?: string | null;
  reachedPickupAt?: string | null;
  reachedDestinationAt?: string | null;
  completedAt?: string | null;
  
}

export interface CreateTripPayload {
  vehicleId: number;
  pickupOutletId: number;
  dropOutletId: number;
  tripDate: string;
  driverId: number;
}

// NOTE: assumed shape — adjust to match your actual driver login DTO/response.
export interface LoginPayload {
  driverCode: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  driver: Driver;
}

export interface TripLocationPing {
  tripId: number;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
}

export type ApiErrorResponse = {
  statusCode: number;
  timestamp: string;
  path: string;
  message?: string | string[];
  error?: string;
};

export interface TypeOfLiveLocation {
  tripId: number;
  driverId?: number;
  vehicleId?: number;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  remainingDistanceKm?: number;
  remainingTimeMinutes?: number;
  timestamp: number;
  polyline?: string;
}

