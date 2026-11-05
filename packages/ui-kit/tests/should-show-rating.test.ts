import { describe, it, expect } from 'vitest';
import {
  getMinReviewsToShow,
  shouldShowRating,
} from '../lib/utils/should-show-rating';

describe('getMinReviewsToShow', () => {
  it('defaults to 1 when unset', () => {
    expect(getMinReviewsToShow(undefined)).toBe(1);
    expect(getMinReviewsToShow('')).toBe(1);
  });

  it('parses valid integers', () => {
    expect(getMinReviewsToShow('0')).toBe(0);
    expect(getMinReviewsToShow('3')).toBe(3);
  });

  it('falls back on invalid values', () => {
    expect(getMinReviewsToShow('nope')).toBe(1);
    expect(getMinReviewsToShow('-2')).toBe(1);
  });
});

describe('shouldShowRating', () => {
  it('shows when review count meets the minimum', () => {
    expect(shouldShowRating(1, 1)).toBe(true);
    expect(shouldShowRating(5, 3)).toBe(true);
  });

  it('hides when review count is below the minimum', () => {
    expect(shouldShowRating(0, 1)).toBe(false);
    expect(shouldShowRating(2, 3)).toBe(false);
  });
});
