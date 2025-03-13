import { IconStarFilled } from './icons/icon-star-filled';
import { IconStar } from './icons/icon-star';
import { IconStarHalf } from './icons/icon-star-half';
import React from 'react';

export interface StarRatingProps {
  rating?: number; // Numeric rating value (e.g., 4.6)
  totalStars?: number; // Total number of stars in the rating system
  size?: string; // Size of each star icon in pixels
}
/**
 * A reusable StarRating component for displaying a visual representation of a numeric rating.
 *
 * @param rating Numeric rating value (e.g., 4.6). Defaults to 4.6.
 * @param totalStars Total number of stars in the rating system. Defaults to 5.
 * @param size Size of each star icon in pixels. Defaults to '4'.
 *
 * @example
 * <StarRating rating={4.5} totalStars={5} size="6" />
 */
export const StarRating = ({
  rating = 4.6,
  totalStars = 5,
  size = '4',
}: StarRatingProps) => {
  const wholeStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <div className="flex gap-1">
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