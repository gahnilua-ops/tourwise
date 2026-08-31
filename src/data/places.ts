// Ported from /home/sai/itravelbohol/src/data/places.ts
// Mirrors PlaceDetailModal.tsx on web.

export interface Place {
  id: string;
  name: string;
  blurb: string;
  images: string[];
  latitude?: number;
  longitude?: number;
  tourIds?: string[]; // which tour IDs include this place
}

export const PLACES: Place[] = [
  {
    id: 'p1',
    name: 'Chocolate Hills',
    blurb: "Nature's most geometric wonder — 1,776 cone-shaped hills that turn brown in summer.",
    images: [
      'https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272?auto=format&fit=crop&w=800&q=80',
    ],
    latitude: 9.8500,
    longitude: 124.1435,
    tourIds: ['1', '4', '5'],
  },
  {
    id: 'p2',
    name: 'Philippine Tarsier Sanctuary',
    blurb: "The world's smallest primate, living freely in a protected forest sanctuary.",
    images: [
      'https://images.unsplash.com/photo-1569718212165-3a8278d5f624?auto=format&fit=crop&w=800&q=80',
    ],
    latitude: 9.7484,
    longitude: 124.1476,
    tourIds: ['1', '4', '5'],
  },
  {
    id: 'p3',
    name: 'Loboc River',
    blurb: 'Cruise through lush mangroves on a floating restaurant as the sun sets over Bohol.',
    images: [
      'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?auto=format&fit=crop&w=800&q=80',
    ],
    latitude: 9.7129,
    longitude: 124.0317,
    tourIds: ['1', '3', '4', '5'],
  },
  {
    id: 'p4',
    name: 'Alona Beach',
    blurb: 'Panglao\'s iconic white-sand beach — the main hub for island-hopping departures and sunset views.',
    images: [
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
    ],
    latitude: 9.5578,
    longitude: 123.7867,
    tourIds: ['2'],
  },
  {
    id: 'p5',
    name: 'Balicasag Island',
    blurb: 'A tiny coral island with a thriving marine sanctuary, famous for sea turtles and vibrant reef fish.',
    images: [
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&w=800&q=80',
    ],
    latitude: 9.5167,
    longitude: 123.7000,
    tourIds: ['2', '4', '5'],
  },
  {
    id: 'p6',
    name: 'Virgin Island',
    blurb: 'A pristine sandbar that appears at low tide — a perfect crescent of white sand surrounded by turquoise water.',
    images: [
      'https://images.unsplash.com/photo-1559494007-9f5847c49d94?auto=format&fit=crop&w=800&q=80',
    ],
    latitude: 9.5333,
    longitude: 123.7167,
    tourIds: ['2', '4', '5'],
  },
  {
    id: 'p7',
    name: 'Bilar Man-Made Forest',
    blurb: 'A dense stretch of mahogany trees planted in the 1960s — a cool, dramatic forest corridor through Bohol\'s interior.',
    images: [
      'https://images.unsplash.com/photo-1448375240586-882707db888b?auto=format&fit=crop&w=800&q=80',
    ],
    latitude: 9.7167,
    longitude: 124.0833,
    tourIds: ['1'],
  },
  {
    id: 'p8',
    name: 'Baclayon Church',
    blurb: 'One of the oldest stone churches in the Philippines, founded in 1595 — a UNESCO World Heritage Site candidate.',
    images: [
      'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=800&q=80',
    ],
    latitude: 9.6128,
    longitude: 124.0338,
    tourIds: ['1'],
  },
];
