// Mirrors the Supabase queries embedded in TourDetail.tsx / data/tours.ts on web.
import { supabase } from '@/core/services/supabaseClient';
import type { Tour } from '@/data/models/tour';

export async function fetchTours(): Promise<Tour[]> {
  const { data, error } = await supabase.from('tours').select('*');
  if (error) throw error;
  return data as Tour[];
}

export async function fetchTourById(id: string): Promise<Tour | null> {
  const { data, error } = await supabase.from('tours').select('*').eq('id', id).single();
  if (error) throw error;
  return data as Tour;
}
