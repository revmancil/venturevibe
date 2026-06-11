export const VENTUREVIBE_SHARE_URL = "https://venturevibe.pro";
export const VENTUREVIBE_TWITTER_HANDLE = "VentureVibePro";

export function buildValidationScoreTweet(score: number, ideaTitle: string): string {
  return `I just validated my startup idea on @${VENTUREVIBE_TWITTER_HANDLE} and scored ${score}/100 — ${ideaTitle}. Validate yours free: ${VENTUREVIBE_SHARE_URL}`;
}

export function twitterIntentUrl(text: string): string {
  return `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`;
}

/** URL copied by "Copy link" — public per-idea results are not available yet. */
export function getShareableResultsUrl(_ideaId: string): string {
  // TODO: Return a public results URL when shareable report pages exist (e.g. `/share/ideas/${ideaId}`).
  return VENTUREVIBE_SHARE_URL;
}
