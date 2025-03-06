import { Button } from '../button';
import { StarRating } from '../star-rating';

export interface ReviewCardProps {
  text: string;
  onClick?: () => void;
  rating: number;
  hasCallQualityRating: boolean;
  readMore: string;
}

/**
 * A reusable card component that displays a review with a star rating and an optional "Read More" button.
 *
 * @param text The review text to be displayed.
 * @param onClick Optional callback function triggered when the "Read More" button is clicked.
 * @param rating The rating value to be displayed using the `StarRating` component.
 * @param hasCallQualityRating Flag indicating whether the review is for call quality. If true, only the rating is shown.
 * @param readMore The text to display on the "Read More" button.
 *
 * @example
 * <ReviewCard
 *   text="Great experience! Highly recommended."
 *   rating={5}
 *   hasCallQualityRating={false}
 *   readMore="Read More"
 *   onClick={() => console.log("Read More clicked")}
 * />
 */

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
