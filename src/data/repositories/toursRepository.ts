// Mirrors the Supabase queries embedded in TourDetail.tsx / data/tours.ts on web.
// For now we use the static TOURS catalog. The Supabase-backed version
// (fetchTours / fetchTourById) can replace these when the tours table is seeded.
import { supabase } from '@/core/services/supabaseClient';
import { TOURS, type Tour } from '@/data/tours';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Static catalog (default — swap for live Supabase query when ready)
export async function fetchTours(): Promise<Tour[]> {
  // Live: const { data, error } = await supabase.from('tours').select('*');
  return TOURS;
}

export async function fetchTourById(id: string): Promise<Tour | null> {
  return TOURS.find((t) => t.id === id) ?? null;
}

// Wishlist (local — stored in AsyncStorage via Zustand)
const WISHLIST_KEY = 'tourwise_wishlist';

export async function getWishlist(): Promise<string[]> {
  try {
    const raw = await AsyncStorage.getItem(WISHLIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function addToWishlist(tourId: string): Promise<string[]> {
  const list = await getWishlist();
  if (!list.includes(tourId)) {
    list.push(tourId);
    await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  }
  return list;
}

export async function removeFromWishlist(tourId: string): Promise<string[]> {
  const list = (await getWishlist()).filter((id) => id !== tourId);
  await AsyncStorage.setItem(WISHLIST_KEY, JSON.stringify(list));
  return list;
}
