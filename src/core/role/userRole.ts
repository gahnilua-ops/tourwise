export type UserRole = 'tourist' | 'driver';

export interface Profile {
  id: string;
  role: UserRole;
  fullName: string | null;
}
