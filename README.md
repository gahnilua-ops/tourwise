# TourWise

TourWise is the official mobile app for iTravelBohol — helping travelers
discover, plan, and book tours across Bohol, Philippines. It also serves
drivers with a dedicated in-app dashboard.

Built with **React Native (Expo) + TypeScript**, sharing its backend
(Supabase) and payments (Stripe) with the existing
[itravelbohol web app](#).

## Features
- Browse curated tours and attractions
- Interactive map with points of interest
- Booking, payments, and QR vouchers
- Wishlist, search, support chat & FAQ
- Driver shell: assigned trips, document upload, earnings

## Tech Stack
- **React Native + Expo** — single codebase for Android & iOS, no Mac
  required for day-to-day development or iOS builds (via EAS Build)
- **TypeScript** — shared types/patterns with the web app
- **Supabase** — auth, database, storage, realtime (same project as web)
- **Stripe** (`@stripe/stripe-react-native`) — payments
- **react-native-maps** — maps (mirrors Leaflet on web)
- **React Navigation** — routing (stack + bottom tabs)
- **Zustand** + **TanStack Query** — state & data fetching
- **Expo Notifications** — push (FCM/APNs)

## Why React Native over Flutter for this project
The web app is already React + TypeScript on Supabase/Stripe. React Native
lets business logic, types, and API/data-layer code be shared with (or
easily ported from) the web codebase, and keeps the team working in one
language instead of maintaining parallel TypeScript and Dart
implementations of the same booking/voucher/driver logic.

## Project structure

```
src/
├── app/                    # Navigation, theme, root App component
│   ├── App.tsx
│   ├── RootNavigator.tsx   # Stack: RoleGate -> TouristShell | DriverShell
│   ├── TouristTabs.tsx     # Tourist bottom-tab shell
│   ├── DriverTabs.tsx      # Driver bottom-tab shell
│   ├── RoleGate.tsx        # Routes user by role after login
│   └── theme.ts
├── core/
│   ├── services/           # supabaseClient, stripeService, pushNotifications
│   ├── constants/
│   ├── role/
│   ├── analytics/
│   └── errors/              # ErrorBoundary
├── features/
│   ├── auth/
│   ├── tours/
│   ├── places/
│   ├── search/
│   ├── booking/
│   │   └── voucher/
│   ├── map/
│   ├── wishlist/
│   ├── account/
│   ├── driver/
│   │   ├── register/
│   │   ├── dashboard/
│   │   └── upload/
│   ├── notifications/
│   ├── support/
│   │   ├── faq/
│   │   └── chat/
│   └── legal/
├── shared/
│   └── components/
└── data/
    ├── models/              # Tour, Place, Booking, Driver/Trip
    └── repositories/        # Supabase queries per domain
```

Each feature file has a comment noting the web-app file it mirrors
(e.g. `ToursScreen.tsx` → `TourDetail.tsx` + `data/tours.ts` on web) —
useful for porting logic across during implementation. `AdminDashboard`
and `PartnerRegister` from the web app are intentionally **not** included
here; admin/analytics stays web-only, and partner onboarding is a one-time
flow that doesn't need to be on-the-go.

## Getting Started

### Prerequisites
- Node.js 20+
- Expo CLI (`npx expo` — no global install needed)
- Expo Go app on your phone for fast local testing, or an Android
  emulator / iOS simulator
- An [Expo/EAS account](https://expo.dev) (free) for cloud builds —
  this is what lets you build iOS apps without owning a Mac

### Setup
```bash
git clone <repo-url> tourwise
cd tourwise
npm install
cp .env.example .env   # fill in Supabase/Stripe/Maps keys
npx expo start
```

Scan the QR code with Expo Go (Android) or the Camera app (iOS) to run
on your own device, or press `a`/`i` for an emulator/simulator.

### Building for real devices / app stores
```bash
npx eas login
npx eas build:configure
eas build --platform android --profile preview
eas build --platform ios --profile preview
```
iOS builds run in Expo's cloud — no local macOS/Xcode needed unless you
want to run the iOS Simulator locally.

## Branching
- `main` — production/release
- `develop` — integration
- `feature/*`, `bugfix/*`, `release/*` — working branches

`main` and `develop` should be protected: require PR review + passing CI
(`npm run lint`, `npm run typecheck`, `npm test`) before merge.

## Environment variables
See `.env.example`. Never commit `.env` — it's gitignored. For CI/EAS
builds, set the same keys as [EAS secrets](https://docs.expo.dev/build-reference/variables/).
