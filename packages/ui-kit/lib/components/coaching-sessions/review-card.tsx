import { Button } from '../button';
import { StarRating } from '../star-rating';
import { ReviewCardProps } from './types';

export function ReviewCard({
  text,
  onClick,
  rating,
  hasCallQualityRating,
  readMore,
}: ReviewCardProps) {
  return (
    <div className="flex p-3 items-start flex-col bg-base-neutral-800 rounded-small border border-base-neutral-700">
      {hasCallQualityRating ? (
        <StarRating rating={rating} />
      ) : (
        <>
          <p className="text-sm text-text-secondary lineHight-[150%] text-left">
            "{text}"
          </p>
          <Button
            text={readMore}
            variant="text"
            size="small"
            className="p-0"
            onClick={onClick}
          />
          <div className="flex justify-end items-end w-full">
            <StarRating rating={rating} />
          </div>
        </>
      )}
    </div>
  );
}
