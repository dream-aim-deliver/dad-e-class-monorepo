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
    <span className="text-text-primary text-sm leading-4">
      {rating} <span className="text-text-secondary text-xs align-middle">({totalRatings})</span>
    </span>
  </div>
);
