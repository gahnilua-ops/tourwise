// Reusable tab-bar icon wrapper using lucide-react-native.
// Accepts named icons from the shared icons surface.
import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Compass, MapPin, Search, Map, Heart, User, Star,
  ShoppingCart, Calendar, MessageSquare, Bell, Settings,
  Car, Phone, Mail, Clock, DollarSign, Navigation,
} from 'lucide-react-native';
import { colors } from '@/app/theme';

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  compass: Compass,
  'map-pin': MapPin,
  search: Search,
  map: Map,
  heart: Heart,
  user: User,
  star: Star,
  cart: ShoppingCart,
  calendar: Calendar,
  chat: MessageSquare,
  bell: Bell,
  settings: Settings,
  car: Car,
  phone: Phone,
  mail: Mail,
  clock: Clock,
  dollar: DollarSign,
  navigation: Navigation,
};

interface Props {
  name: string;
  color?: string;
  size?: number;
}

export function TabBarIcon({ name, color = colors.textMuted, size = 22 }: Props) {
  const Icon = ICON_MAP[name];
  if (!Icon) return null;
  return <Icon size={size} color={color} />;
}
