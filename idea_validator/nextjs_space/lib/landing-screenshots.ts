/**
 * Slugs with a PNG at public/landing/screenshots/{slug}.png.
 * Add the slug here when you add the file to avoid 404 noise in the browser console.
 */
export const LANDING_SCREENSHOT_SLUGS = new Set<string>([
  // e.g. "micro-surveys",
]);

export function hasLandingScreenshot(slug: string): boolean {
  return LANDING_SCREENSHOT_SLUGS.has(slug);
}
