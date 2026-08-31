// TourWise brand tokens — pulled from the iTravelBohol web app palette so
// the mobile and web experiences share the same visual identity.
import { TextStyle } from 'react-native';

export const colors = {
  // Brand
  primary: '#0E7C7B',      // teal (sage→teal gradient endpoint)
  primaryDark: '#0A5A59',
  primaryLight: '#94A684', // sage (gradient start)

  // Accent
  accent: '#5C7A2E',
  accentLight: '#EEF0DC',
  yellow: '#FCBD00',

  // Surfaces
  background: '#FBF8F1',   // cream page background
  surface: '#FFFFFF',
  surfaceMuted: '#F6F1E6',
  surfaceSunken: '#EDE7D8',

  // Text
  text: '#2A2618',         // ink
  textMuted: '#736B57',
  textSubtle: '#8C8470',
  textInverse: '#FFFFFF',

  // Lines
  border: '#E6DFCF',
  borderStrong: '#C9C0A9',

  // Semantic
  success: '#5C7A2E',
  successBg: '#EEF0DC',
  warning: '#9A6A00',
  warningBg: '#FFF6E0',
  error: '#e23744',
  errorBg: '#FFF1EC',
  info: '#0E7C7B',
  infoBg: '#E0F0F0',

  // Misc
  overlay: 'rgba(42,38,24,0.5)',
  shadow: '#2A2618',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 6,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  pill: 999,
} as const;

export const fontSize = {
  xs: 11,
  sm: 13,
  base: 15,
  md: 16,
  lg: 18,
  xl: 20,
  xxl: 24,
  xxxl: 28,
  display: 34,
} as const;

export const fontWeight = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semibold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
  extrabold: '800' as TextStyle['fontWeight'],
} as const;

export const shadow = {
  sm: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  md: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  lg: {
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
} as const;

// The signature web-app gradient: sage (#94A684) → teal (#0E7C7B).
// Use as a `style` array entry or via LinearGradient (expo-linear-gradient,
// not yet added — fall back to bg with text shadow on text-only contexts).
export const brandGradient = {
  start: colors.primaryLight,
  end: colors.primary,
} as const;
