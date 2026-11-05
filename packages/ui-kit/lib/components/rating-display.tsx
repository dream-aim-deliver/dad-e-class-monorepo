'use client';

import * as React from 'react';
import { StarRating } from './star-rating';

export interface RatingDisplayProps {
  rating: number;
  totalRatings: number;
  totalStars?: number;
  starSize?: string;
  /** When provided, stars are clickable / keyboard-activatable. */
  onActivate?: () => void;
  /** Tooltip shown on interactive stars (e.g. «Kurs bewerten»). */
  tooltip?: string;
  /**
   * When true, render empty stars as a rate entry (for enrolled students
   * when public ratings are hidden by the min-reviews threshold).
   */
  isRateEntry?: boolean;
  /** Label next to empty rate-entry stars (e.g. «Bewerten»). */
  rateEntryLabel?: string;
  /**
   * Hint shown under the stars after activation when rating is blocked
   * (e.g. not enrolled / not started). Cleared on next successful activate
   * without a hint, or when the parent remounts.
   */
  blockedHint?: string;
}

export const RatingDisplay = ({
  rating,
  totalRatings,
  totalStars = 5,
  starSize = '4',
  onActivate,
  tooltip,
  isRateEntry = false,
  rateEntryLabel,
  blockedHint,
}: RatingDisplayProps) => {
  const [visibleHint, setVisibleHint] = React.useState<string | null>(null);
  const isInteractive = typeof onActivate === 'function' || Boolean(blockedHint);

  const handleActivate = () => {
    if (blockedHint) {
      setVisibleHint(blockedHint);
      return;
    }
    setVisibleHint(null);
    onActivate?.();
  };

  const displayRating = isRateEntry ? 0 : rating;

  return (
    <div className="flex flex-col gap-1 items-start">
      <div className="flex items-center gap-1">
        <StarRating
          totalStars={totalStars}
          size={starSize}
          rating={displayRating}
          onActivate={isInteractive ? handleActivate : undefined}
          tooltip={tooltip}
          ariaLabel={tooltip}
        />
        {isRateEntry ? (
          rateEntryLabel ? (
            <span className="text-xs text-text-secondary leading-none">
              {rateEntryLabel}
            </span>
          ) : null
        ) : (
          <>
            <span className="text-xs text-text-primary leading-none">
              {rating}
            </span>
            <span className="text-xs text-text-secondary leading-none">
              ({totalRatings})
            </span>
          </>
        )}
      </div>
      {visibleHint && (
        <p className="text-xs text-text-secondary text-start" role="status">
          {visibleHint}
        </p>
      )}
    </div>
  );
};
