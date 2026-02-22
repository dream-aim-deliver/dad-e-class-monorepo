import { StarRating } from './star-rating';

export interface RatingDisplayProps {
  rating: number;
  totalRatings: number;
  totalStars?: number;
  starSize?: string;
}

export const RatingDisplay = ({
  rating,
  totalRatings,
  totalStars = 5,
  starSize = '4',
}: RatingDisplayProps) => (
  <div className="flex items-center gap-1">
    <StarRating totalStars={totalStars} size={starSize} rating={rating} />
    <span className="text-xs text-text-primary leading-none">
      {rating}
    </span>
    <span className="text-xs text-text-secondary leading-none">
      ({totalRatings})
    </span>
  </div>
);
