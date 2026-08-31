// Ported from /home/sai/itravelbohol/src/data/tours.ts
// Mirrors TourDetail.tsx + TourCard.tsx on web.

export type TourCategory = 'day-tour' | 'island-hopping' | 'package';

export interface ItineraryStop {
  time: string;
  title: string;
  description?: string;
}

export interface Tour {
  id: string;
  title: string;
  category: TourCategory;
  price: number; // PHP per person
  duration: string;
  durationMinutes?: number;
  image: string;
  gallery?: string[];
  highlights: string[];
  description: string;
  featured?: boolean;
  bestseller?: boolean;
  rating?: number | null;
  hotel_name?: string;
  room_type?: string;
  accommodation_notes?: string;
  min_pax?: number;
  max_pax?: number;
  itinerary_stops?: ItineraryStop[];
  included?: string[];
  excluded?: string[];
  cancellation_policy?: string;
  meeting_point?: string;
}

export const TOURS: Tour[] = [
  {
    id: '1',
    title: 'Bohol Countryside Day Tour',
    category: 'day-tour',
    price: 1800,
    duration: '7-8 hours',
    durationMinutes: 480,
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    highlights: ['Chocolate Hills', 'Tarsier Sanctuary', 'Loboc River Cruise with Lunch', 'Bilar Man-Made Forest'],
    description: 'Explore the iconic geological wonders and lush inland heritage of Bohol with our private air-conditioned transport and local guide.',
    featured: true,
    bestseller: true,
    rating: 4.9,
    itinerary_stops: [
      { time: '7:00 AM', title: 'Hotel pickup', description: 'Pickup from your Panglao hotel or resort in an air-conditioned vehicle.' },
      { time: '8:00 AM', title: 'Baclayon Church', description: 'Quick photo stop at one of the oldest stone churches in the Philippines.' },
      { time: '9:00 AM', title: 'Loboc River Cruise & Lunch', description: 'Buffet lunch aboard a floating restaurant with live music along the river.' },
      { time: '11:00 AM', title: 'Bilar Man-Made Forest', description: 'Drive through the cool, dense mahogany forest stretch.' },
      { time: '11:30 AM', title: 'Tarsier Sanctuary', description: 'Guided viewing of the world\'s smallest primates in their natural habitat.' },
      { time: '12:30 PM', title: 'Chocolate Hills', description: 'Climb the viewing deck for the iconic panorama of the hills.' },
      { time: '2:30 PM', title: 'Return transfer', description: 'Drop-off back at your Panglao hotel.' },
    ],
    included: [
      'Air-conditioned private transport',
      'English-speaking local guide',
      'Loboc River cruise with buffet lunch',
      'Entrance fees to Tarsier Sanctuary & Chocolate Hills',
    ],
    excluded: [
      'Hotel pickup outside Panglao (available on request)',
      'Personal expenses and souvenirs',
      'Gratuities for guide and driver',
    ],
    cancellation_policy: 'Free cancellation up to 24 hours before the tour start time.',
    meeting_point: 'Pickup at your Panglao hotel lobby',
  },
  {
    id: '2',
    title: 'Balicasag Island Hopping & Dolphin Watching',
    category: 'island-hopping',
    price: 1500,
    duration: '5-6 hours',
    durationMinutes: 360,
    image: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    highlights: ['Wild Dolphin Watching', 'Balicasag Marine Sanctuary Snorkeling', 'Sea Turtle Point', 'Virgin Island Sandbar'],
    description: 'Set sail early morning from Panglao to witness playful dolphins, snorkel among sea turtles in Balicasag, and walk the pristine crescent sandbar of Virgin Island.',
    rating: 4.8,
    itinerary_stops: [
      { time: '6:00 AM', title: 'Hotel pickup & boat briefing', description: 'Meet your boatman at the resort beachfront for a short safety briefing.' },
      { time: '6:30 AM', title: 'Dolphin watching', description: 'Cruise out to open water to spot pods of wild dolphins.' },
      { time: '8:00 AM', title: 'Balicasag Marine Sanctuary', description: 'Snorkel over coral walls and reef fish with your snorkel gear.' },
      { time: '9:30 AM', title: 'Sea Turtle Point', description: 'Swim alongside resident green sea turtles.' },
      { time: '10:30 AM', title: 'Virgin Island Sandbar', description: 'Walk the crescent sandbar, free time and snacks.' },
      { time: '12:00 PM', title: 'Return to Panglao', description: 'Boat transfer back to the resort.' },
    ],
    included: [
      'Boat transport and boatman',
      'Snorkel gear',
      'Marine sanctuary entrance fees',
      'Bottled water',
    ],
    excluded: [
      'Underwater camera rental',
      'Meals (snacks available for purchase)',
      'Environmental fees collected on-site',
    ],
    cancellation_policy: 'Free cancellation up to 24 hours before the tour start time.',
    meeting_point: 'Pickup at your Panglao resort beachfront',
  },
  {
    id: '3',
    title: 'Loboc River Firefly Watching Night Tour',
    category: 'day-tour',
    price: 950,
    duration: '2 hours',
    durationMinutes: 120,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    highlights: ['Nighttime Paddle Boat', 'Thousands of Glowing Fireflies', 'Serene Mangrove Riverscape'],
    description: 'Experience a magical evening floating down the calm Loboc River illuminated by synchronized twinkling fireflies in the mangroves.',
    rating: 4.7,
    itinerary_stops: [
      { time: '6:00 PM', title: 'Hotel pickup', description: 'Evening pickup from your Panglao hotel or resort in an air-conditioned vehicle.' },
      { time: '6:45 PM', title: 'Transfer to Loboc', description: 'Scenic drive inland as the sun sets over the countryside.' },
      { time: '7:15 PM', title: 'Board the paddle boat', description: 'Small native paddle boat with a local boatman, life vests provided.' },
      { time: '7:30 PM', title: 'Firefly watching', description: 'Glide silently through the mangroves as thousands of synchronized fireflies light up the trees.' },
      { time: '8:15 PM', title: 'Return transfer', description: 'Drop-off back at your Panglao hotel.' },
    ],
    included: [
      'Air-conditioned transport to and from Loboc',
      'Native paddle boat and boatman',
      'Life vest',
      'River entrance fee',
    ],
    excluded: [
      'Dinner (available for pre-order at the river)',
      'Personal expenses',
      'Gratuities for boatman and driver',
    ],
    cancellation_policy: 'Free cancellation up to 24 hours before the tour start time.',
    meeting_point: 'Pickup at your Panglao hotel lobby',
  },
  {
    id: '4',
    title: 'Ultimate Bohol 2-in-1 Combo Package',
    category: 'package',
    price: 3200,
    duration: '2 Days / Combined Full Experience',
    durationMinutes: 1440,
    image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Countryside Tour with Loboc Lunch',
      'Balicasag Island Hopping & Dolphins',
      'Free Panglao Hotel Pickup/Dropoff',
      'Dedicated Private Tour Coordinator',
    ],
    description: 'The most popular value package combining our bestselling Countryside Tour and Balicasag Island Hopping adventure into one seamless itinerary.',
    featured: true,
    bestseller: true,
    rating: 4.9,
    itinerary_stops: [
      { time: 'Day 1 · 7:00 AM', title: 'Hotel pickup', description: 'Pickup from your Panglao hotel or resort in an air-conditioned vehicle.' },
      { time: 'Day 1 · 9:00 AM', title: 'Loboc River Cruise & Lunch', description: 'Buffet lunch aboard a floating restaurant with live music along the river.' },
      { time: 'Day 1 · 11:30 AM', title: 'Tarsier Sanctuary & Chocolate Hills', description: 'Guided stops at the tarsier sanctuary and the Chocolate Hills viewing deck.' },
      { time: 'Day 1 · 2:30 PM', title: 'Return to hotel', description: 'Drop-off back at your Panglao hotel; rest of the day free.' },
      { time: 'Day 2 · 6:00 AM', title: 'Boat pickup for island hopping', description: 'Meet your boatman at the resort beachfront for a short safety briefing.' },
      { time: 'Day 2 · 6:30 AM', title: 'Dolphin watching', description: 'Cruise out to open water to spot pods of wild dolphins.' },
      { time: 'Day 2 · 8:00 AM', title: 'Balicasag Marine Sanctuary', description: 'Snorkel over coral walls and reef fish.' },
      { time: 'Day 2 · 10:30 AM', title: 'Virgin Island Sandbar', description: 'Walk the crescent sandbar, free time and snacks.' },
      { time: 'Day 2 · 12:00 PM', title: 'Return to Panglao', description: 'Boat transfer back to the resort, tour ends.' },
    ],
    included: [
      'Air-conditioned private transport (Day 1)',
      'Boat transport and boatman (Day 2)',
      'English-speaking local guide',
      'Loboc River cruise with buffet lunch',
      'Snorkel gear',
      'Entrance fees to Tarsier Sanctuary, Chocolate Hills & Balicasag Marine Sanctuary',
      'Free Panglao hotel pickup/dropoff both days',
      'Dedicated private tour coordinator',
    ],
    excluded: [
      'Accommodation between Day 1 and Day 2',
      'Personal expenses and souvenirs',
      'Gratuities for guides, boatman and driver',
    ],
    cancellation_policy: 'Free cancellation up to 48 hours before the first tour date.',
    meeting_point: 'Pickup at your Panglao hotel lobby (both days)',
  },
  {
    id: '5',
    title: 'Bohol Grand Adventure 3D2N Package',
    category: 'package',
    price: 5500,
    duration: '3 Days / 2 Nights',
    durationMinutes: 4320,
    image: 'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    highlights: [
      'Countryside Tour & Chocolate Hills',
      'Balicasag & Virgin Island Hopping',
      'Loboc River Firefly Night Tour',
      'Airport / Seaport Transfers Included',
    ],
    description: 'The ultimate all-inclusive Bohol holiday package covering inland wonders, marine sanctuaries, night fireflies, and hassle-free roundtrip transfers.',
    rating: 4.9,
    itinerary_stops: [
      { time: 'Day 1 · Morning', title: 'Airport / seaport pickup', description: 'Roundtrip transfer from your arrival point straight to your Panglao hotel.' },
      { time: 'Day 1 · 9:00 AM', title: 'Countryside Tour & Chocolate Hills', description: 'Loboc River cruise with lunch, Tarsier Sanctuary, and the Chocolate Hills viewing deck.' },
      { time: 'Day 2 · 6:00 AM', title: 'Balicasag & Virgin Island Hopping', description: 'Dolphin watching, Balicasag Marine Sanctuary snorkeling, and the Virgin Island sandbar.' },
      { time: 'Day 2 · Evening', title: 'Free time / optional activities', description: 'Rest at your hotel or explore Panglao at your own pace.' },
      { time: 'Day 3 · 6:00 PM', title: 'Loboc River Firefly Night Tour', description: 'Evening paddle boat ride through mangroves lit up by synchronized fireflies.' },
      { time: 'Day 3 · Departure', title: 'Airport / seaport transfer', description: 'Roundtrip drop-off in time for your departure.' },
    ],
    included: [
      'Roundtrip airport/seaport transfers',
      'Air-conditioned private transport for all land tours',
      'Boat transport and boatman for island hopping',
      'English-speaking local guide',
      'Loboc River cruise with buffet lunch',
      'Snorkel gear',
      'Native paddle boat for firefly watching',
      'All entrance fees (Tarsier Sanctuary, Chocolate Hills, Balicasag Marine Sanctuary, Loboc River)',
    ],
    excluded: [
      'Hotel accommodation for the 2 nights',
      'Meals other than the Day 1 river lunch',
      'Personal expenses and souvenirs',
      'Gratuities for guides, boatman and driver',
    ],
    cancellation_policy: 'Free cancellation up to 48 hours before the first tour date.',
    meeting_point: 'Airport/seaport pickup on Day 1; hotel pickup for Day 2 & Day 3 activities',
  },
];

export function getFeaturedTours(): Tour[] {
  return TOURS.filter((t) => t.featured || t.bestseller);
}

export function getToursByCategory(category: TourCategory): Tour[] {
  return TOURS.filter((t) => t.category === category);
}
