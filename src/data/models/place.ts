// Mirrors src/data/places.ts / PlaceDetailModal.tsx on web.
export interface Place {
  id: string;
  name: string;
  description: string;
  latitude: number;
  longitude: number;
  imageUrls: string[];
}
