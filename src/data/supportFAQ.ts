// Ported from /home/sai/itravelbohol/src/data/supportFAQ.ts
// Mirrors SupportPage.tsx on web.

export type FAQRole = 'guests' | 'drivers' | 'operators';

export interface FAQItem {
  id: string;
  role: FAQRole;
  category: string;
  question: string;
  answer: string;
  tags: string[];
}

export const supportFAQ: FAQItem[] = [
  // ==================== GUESTS ====================
  {
    id: 'guest-booking-1',
    role: 'guests',
    category: 'Booking & Reservations',
    question: 'How do I book a tour?',
    answer: 'Browse tours on the home page or Tours section. Select your date, number of guests, and any options. Add to cart, then proceed to checkout. You\'ll pay securely via Stripe (cards, GCash, Maya) and receive an instant confirmation email with your booking reference.',
    tags: ['booking', 'checkout', 'payment', 'confirmation'],
  },
  {
    id: 'guest-booking-2',
    role: 'guests',
    category: 'Booking & Reservations',
    question: 'Can I modify my booking after confirming?',
    answer: 'Yes, you can request a date/time change from My Bookings. Changes require operator approval and are subject to availability. If approved, you\'ll receive an updated confirmation. For same-day changes, contact support directly.',
    tags: ['modify', 'change', 'date', 'operator-approval'],
  },
  {
    id: 'guest-booking-3',
    role: 'guests',
    category: 'Booking & Reservations',
    question: 'What is included in my tour price?',
    answer: 'Each tour page lists inclusions under "What\'s Included" — typically transport, guide, entrance fees, and sometimes meals. Check the specific tour page for exact details. Exclusions (tips, personal expenses, optional add-ons) are also listed.',
    tags: ['inclusions', 'price', 'tour-details'],
  },
  {
    id: 'guest-cancellation-1',
    role: 'guests',
    category: 'Cancellation',
    question: 'What is your cancellation policy?',
    answer: 'Most day tours allow free cancellation up to 24 hours before the start time. Multi-day packages require 48 hours notice. Cancellations made after the window, no-shows, or same-day cancellations may not be refundable. See the specific tour page for the full policy.',
    tags: ['cancellation', 'refund', 'policy'],
  },
  {
    id: 'guest-cancellation-2',
    role: 'guests',
    category: 'Cancellation',
    question: 'How do I get a refund?',
    answer: 'Approved refunds are processed to your original payment method within 5–10 business days. If you paid cash on-site, refund instructions will be sent by email. Contact support if you haven\'t received your refund after 10 days.',
    tags: ['refund', 'payment', 'support'],
  },
  {
    id: 'guest-payment-1',
    role: 'guests',
    category: 'Payments',
    question: 'What payment methods are accepted?',
    answer: 'Online: Visa, Mastercard, American Express, JCB, GCash, Maya (PayMaya). On-site: Cash (PHP), with your driver confirming the payment. Card payments on-site are not accepted — please pay online or in cash to your driver.',
    tags: ['payment', 'gcash', 'maya', 'cash'],
  },
  {
    id: 'guest-payment-2',
    role: 'guests',
    category: 'Payments',
    question: 'Is it safe to pay online?',
    answer: 'Yes. All online payments are processed by Stripe, a PCI-compliant payment processor used by millions of businesses worldwide. We never store your card details.',
    tags: ['payment', 'stripe', 'security'],
  },
  {
    id: 'guest-voucher-1',
    role: 'guests',
    category: 'Vouchers & Confirmations',
    question: 'Where is my booking confirmation?',
    answer: 'After booking, you\'ll receive a confirmation email with your voucher and booking reference. You can also view all your bookings in My Bookings inside your account.',
    tags: ['confirmation', 'voucher', 'email'],
  },
  {
    id: 'guest-support-1',
    role: 'guests',
    category: 'Support',
    question: 'How do I contact support?',
    answer: 'Use the Chat button in the app for real-time help, or email support@itravelbohol.com. For urgent issues on the day of your tour, call your driver directly using the phone number in your booking details.',
    tags: ['support', 'chat', 'contact'],
  },

  // ==================== DRIVERS ====================
  {
    id: 'driver-registration-1',
    role: 'drivers',
    category: 'Registration',
    question: 'How do I register as a driver?',
    answer: 'Go to the app\'s Account tab and select "Register as Driver". Fill in your details (name, contact, vehicle type, plate number) and upload your business/permit papers. Submit and wait for admin approval — you\'ll be notified by email once accepted.',
    tags: ['registration', 'driver', 'approval'],
  },
  {
    id: 'driver-registration-2',
    role: 'drivers',
    category: 'Registration',
    question: 'Why was my driver application declined?',
    answer: 'Common reasons: missing or expired documents, unclear photos, vehicle type not supported, or duplicate accounts. Your decline notification will include the specific reason. Fix the issue and reapply.',
    tags: ['declined', 'documents', 'reapply'],
  },
  {
    id: 'driver-docs-1',
    role: 'drivers',
    category: 'Documents',
    question: 'What documents do I need to upload?',
    answer: 'Operators: business/permit papers. All drivers: vehicle photo, driver selfie, driver\'s license, and operator permit. Documents are uploaded via the secure Upload section in the app, or via the admin-issued link sent by email.',
    tags: ['documents', 'license', 'permit', 'upload'],
  },
  {
    id: 'driver-docs-2',
    role: 'drivers',
    category: 'Documents',
    question: 'How do I know if my documents are expiring?',
    answer: 'The app will show a warning in your Dashboard if any document expires within 30 days. Keep your documents up to date — expired documents may result in suspension from new bookings.',
    tags: ['expiry', 'documents', 'warning'],
  },
  {
    id: 'driver-trips-1',
    role: 'drivers',
    category: 'Trips & Earnings',
    question: 'How are trips assigned to me?',
    answer: 'The admin assigns confirmed bookings to available drivers. You\'ll receive a push notification with the trip details. Go to the Trips tab to see your upcoming schedule and guest contact information.',
    tags: ['trips', 'assignment', 'notification'],
  },
  {
    id: 'driver-trips-2',
    role: 'drivers',
    category: 'Trips & Earnings',
    question: 'How do I mark a trip as complete?',
    answer: 'After dropping off your guests, open the trip in your Trips tab and tap "Complete Trip". The app will ask the guest to confirm arrival — once confirmed, the trip status updates and your commission is credited.',
    tags: ['complete', 'confirmation', 'commission'],
  },
  {
    id: 'driver-trips-3',
    role: 'drivers',
    category: 'Trips & Earnings',
    question: 'Can I see my monthly earnings?',
    answer: 'Yes — the Earnings tab shows your available, pending, and paid commission breakdown by month. "Available" earnings are ready for payout request. "Pending" are awaiting guest payment confirmation.',
    tags: ['earnings', 'commission', 'payout'],
  },
  {
    id: 'driver-payout-1',
    role: 'drivers',
    category: 'Payouts',
    question: 'How do I request a payout?',
    answer: 'Go to the Earnings tab and tap "Request Payout" when you have available earnings. Choose your preferred receiving method (bank transfer / GCash) and submit. Payouts are processed within 3–5 business days.',
    tags: ['payout', 'bank', 'gcash', 'withdraw'],
  },
  {
    id: 'driver-support-1',
    role: 'drivers',
    category: 'Support',
    question: 'A guest hasn\'t paid. What do I do?',
    answer: 'If the guest selected cash on-site, collect the payment directly. If there\'s a payment dispute, contact support immediately via the app chat. Do not cancel the trip without admin approval.',
    tags: ['payment', 'cash', 'dispute'],
  },
];

export function getFAQByRole(role: FAQRole): FAQItem[] {
  return supportFAQ.filter((f) => f.role === role);
}

export function getFAQCategories(role: FAQRole): string[] {
  const items = getFAQByRole(role);
  return [...new Set(items.map((f) => f.category))];
}
