// Mirrors ClientPortal.tsx / ClientConfirm.tsx / create-payment-intent on web.
// Uses the same Supabase project + Stripe + Edge Functions as the web app.

import { supabase } from '@/core/services/supabaseClient';
import type { Session } from '@supabase/supabase-js';

// ── Types ────────────────────────────────────────────────────────────────────
export type BookingStatus =
  | 'pending'
  | 'pending_verification'
  | 'confirmed'
  | 'completed'
  | 'cancelled'
  | 'rejected';

export interface Booking {
  id: string;
  tour_id: string;
  tour_title: string;
  guest_name?: string;
  guest_email?: string;
  phone?: string;
  tour_date?: string;
  pickup_time?: string;
  pax: number;
  total_php: number;
  status: BookingStatus;
  payment_status?: string;
  payment_method?: string;
  driver_id?: string;
  driver_status?: string;
  driver_name?: string;
  client_confirmed_arrival?: boolean;
  client_confirmed_payment?: boolean;
  addons?: { id: string; label: string; price_php: number }[];
  resort?: string;
  created_at: string;
}

export interface BookingInput {
  tourId: string;
  guestName: string;
  guestEmail: string;
  phone: string;
  tourDate: string;
  pickupTime?: string;
  pax: number;
  addons?: { id: string; label: string; price_php: number }[];
  paymentMethod: 'stripe' | 'gcash' | 'cash';
  totalCents: number;
}

// ── Booking CRUD ─────────────────────────────────────────────────────────────
export async function createBooking(
  input: BookingInput,
  session: Session,
): Promise<{ bookingId: string }> {
  const { data, error } = await supabase
    .from('bookings')
    .insert({
      tour_id: input.tourId,
      guest_name: input.guestName,
      guest_email: input.guestEmail,
      phone: input.phone,
      tour_date: input.tourDate,
      pickup_time: input.pickupTime,
      pax: input.pax,
      addons: input.addons,
      payment_method: input.paymentMethod,
      total_php: Math.round(input.totalCents / 100),
      status: 'pending',
    })
    .select('id')
    .single();

  if (error) throw new Error(error.message);
  return { bookingId: data.id };
}

export async function fetchMyBookings(session: Session): Promise<Booking[]> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('guest_email', session.user.email)
    .order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return (data as Booking[]) ?? [];
}

export async function fetchBookingById(id: string): Promise<Booking | null> {
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return null;
  return data as Booking;
}

// ── Guest confirmations (arrival / payment) ──────────────────────────────────
// Called by the guest from VoucherScreen after the tour.
export async function confirmBookingField(
  bookingId: string,
  field: 'arrival' | 'payment',
  session: Session,
): Promise<void> {
  const { error } = await supabase.functions.invoke('confirm-booking', {
    body: { booking_id: bookingId, field },
    headers: { Authorization: 'Bearer ' + session.access_token },
  });
  if (error) throw new Error(error.message);
}

// ── Stripe payment intent ────────────────────────────────────────────────────
export async function createPaymentIntent(
  amountCents: number,
  bookingId: string,
): Promise<string> {
  const { data, error } = await supabase.functions.invoke<{ clientSecret: string }>(
    'create-payment-intent',
    { body: { amountCents, bookingId } },
  );
  if (error) throw new Error(error.message);
  return data.clientSecret;
}
