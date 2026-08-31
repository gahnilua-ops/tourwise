// Mirrors lib/analytics.ts on web. Swap the implementation for whatever
// provider the web app already uses (e.g. Amplitude, PostHog, GA4) so
// events land in the same place.
export function trackEvent(name: string, properties?: Record<string, unknown>): void {
  // TODO: wire to your analytics provider
  if (__DEV__) {
    console.log('[analytics]', name, properties);
  }
}
