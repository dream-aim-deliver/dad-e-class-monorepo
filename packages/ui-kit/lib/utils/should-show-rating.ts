const DEFAULT_MIN_REVIEWS_TO_SHOW = 1;

/**
 * Reads NEXT_PUBLIC_MIN_REVIEWS_TO_SHOW (default 1).
 * Invalid / missing values fall back to the default.
 */
export function getMinReviewsToShow(
  envValue: string | undefined = typeof process !== 'undefined'
    ? process.env.NEXT_PUBLIC_MIN_REVIEWS_TO_SHOW
    : undefined,
): number {
  if (envValue === undefined || envValue === '') {
    return DEFAULT_MIN_REVIEWS_TO_SHOW;
  }
  const parsed = Number.parseInt(envValue, 10);
  if (!Number.isFinite(parsed) || parsed < 0) {
    return DEFAULT_MIN_REVIEWS_TO_SHOW;
  }
  return parsed;
}

/**
 * Whether stars + review count should be shown on public surfaces.
 * Hide when the review count is below the configured minimum.
 */
export function shouldShowRating(
  reviewCount: number,
  minReviews: number = getMinReviewsToShow(),
): boolean {
  return (reviewCount ?? 0) >= minReviews;
}
