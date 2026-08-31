// Mirrors DriverDashboard.tsx / DriverUploadPage.tsx on web.
import { supabase } from '@/core/services/supabaseClient';
import type { Trip } from '@/data/models/driver';

export async function fetchAssignedTrips(driverId: string): Promise<Trip[]> {
  const { data, error } = await supabase
    .from('trips')
    .select('*')
    .eq('driver_id', driverId)
    .order('pickup_time', { ascending: true });
  if (error) throw error;
  return data as Trip[];
}
