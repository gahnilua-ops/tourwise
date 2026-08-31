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
  booking_id: string;
  driver_id: string;
  pickup_time: string;
  status: 'assigned' | 'in_progress' | 'completed';
  booking?: {
    id: string;
    tour_title: string;
    guest_name?: string;
    guest_email?: string;
    phone?: string;
    resort?: string;
    resort_lat?: number | null;
    resort_lng?: number | null;
    pax: number;
    tour_date?: string;
    pickup_time?: string;
    status: string;
    net_commission_amount?: number;
    supplier_amount?: number;
    driver_id?: string;
    driver_completed?: boolean;
    driver_status?: string;
    client_confirmed_arrival?: boolean;
    client_confirmed_payment?: boolean;
    payment_method?: string;
    addons?: { id: string; label: string; price_php: number }[];
  };
}
