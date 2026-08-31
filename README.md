# TourWise

TourWise is the official mobile app for iTravelBohol — helping travelers 
discover, plan, and book tours across Bohol, Philippines.

## Features
- Browse curated tours and attractions
- Interactive map with points of interest
- Booking and itinerary management
- User reviews and ratings

## Tech Stack
- Flutter (Dart) — single codebase for Android & iOS
- [Backend/API — fill in once decided]
- [Maps provider — Google Maps / Mapbox]

## Getting Started

### Prerequisites
- Flutter SDK (stable channel)
- Android Studio / VS Code with Flutter & Dart plugins
- For iOS builds: macOS + Xcode (or CI)

### Setup
\`\`\`bash
git clone https://github.com/<org-or-user>/tourwise.git
cd tourwise
flutter pub get
flutter run
\`\`\`

### Environment variables
Copy `.env.example` to `.env` and fill in required API keys (see `docs/setup.md`).

## Project Structure
See `lib/` — organized by feature (`auth`, `tours`, `booking`, `map`, etc.)

## Contributing
See [CONTRIBUTING.md](CONTRIBUTING.md) for branch naming, commit conventions, and PR process.

## License
[TBD]
