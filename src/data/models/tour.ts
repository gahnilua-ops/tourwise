// Mirrors the shape used by src/data/tours.ts / TourCard.tsx / TourDetail.tsx on web.
export interface Tour {
  id: string;
  title: string;
  description: string;
  priceCents: number;
  durationMinutes: number;
  imageUrls: string[];
  placeIds: string[];
  rating: number | null;
}
