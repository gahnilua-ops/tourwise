// Mirrors CartDrawer.tsx / ClientConfirm.tsx / lib/voucher.tsx on web.
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed';

export interface Booking {
  id: string;
  tourId: string;
  userId: string;
  status: BookingStatus;
  guestCount: number;
  totalCents: number;
  voucherCode: string;
  createdAt: string;
}
