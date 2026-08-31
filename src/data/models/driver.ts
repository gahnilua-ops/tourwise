// Mirrors DriverRegister.tsx / DriverDashboard.tsx on web.
export interface DriverProfile {
  id: string;
  fullName: string;
  vehicleType: string;
  licenseDocUrl: string | null;
  verified: boolean;
}

export interface Trip {
  id: string;
  bookingId: string;
  driverId: string;
  pickupTime: string;
  status: 'assigned' | 'in_progress' | 'completed';
}
