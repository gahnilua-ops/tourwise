// Mirrors StripeProvider.tsx / PaymentElement.tsx on web.
// Actual <StripeProvider> wrapping happens in src/app/App.tsx using
// @stripe/stripe-react-native — this file holds payment-intent helpers
// that call your Supabase Edge Function (same one the web app uses).
import { supabase } from './supabaseClient';

export async function createPaymentIntent(amountCents: number, bookingId: string) {
  const { data, error } = await supabase.functions.invoke('create-payment-intent', {
    body: { amountCents, bookingId },
  });
  if (error) throw error;
  return data as { clientSecret: string };
}
