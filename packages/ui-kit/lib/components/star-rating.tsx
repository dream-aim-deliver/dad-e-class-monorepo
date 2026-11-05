import { IconStarFilled } from './icons/icon-star-filled';
import { IconStar } from './icons/icon-star';
import { IconStarHalf } from './icons/icon-star-half';
import React from 'react';

export interface StarRatingProps {
  rating: number; // Numeric rating value (e.g., 4.6)
  totalStars: number; // Total number of stars in the rating system
  size?: string; // Size of each star icon in pixels
  /** When provided, the rating becomes keyboard- and click-activatable. */
  onActivate?: () => void;
  /** Native tooltip / title for interactive stars. */
  tooltip?: string;
  /** Accessible name when interactive. Defaults to tooltip. */
  ariaLabel?: string;
}

export const StarRating = ({
  rating,
  totalStars,
  size = '4',
  onActivate,
  tooltip,
  ariaLabel,
}: StarRatingProps) => {
  const wholeStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;
  const isInteractive = typeof onActivate === 'function';

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!isInteractive) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      onActivate();
    }
  };

  return (
    <div
      className={`flex gap-1${isInteractive ? ' cursor-pointer' : ''}`}
      onClick={isInteractive ? onActivate : undefined}
      onKeyDown={isInteractive ? handleKeyDown : undefined}
      role={isInteractive ? 'button' : undefined}
      tabIndex={isInteractive ? 0 : undefined}
      title={isInteractive ? tooltip : undefined}
      aria-label={isInteractive ? (ariaLabel || tooltip) : undefined}
    >
      {[...Array(totalStars)].map((_, index) => {
        if (index < wholeStars) {
          return (
            <IconStarFilled key={index} size={size} fill="button-text-text" />
          );
        } else if (index === wholeStars && hasHalfStar) {
          return (
            <IconStarHalf key={index} size={size} fill="button-text-text" />
          );
        } else {
          return <IconStar key={index} size={size} fill="button-text-text" />;
        }
      })}
    </div>
  );
};
