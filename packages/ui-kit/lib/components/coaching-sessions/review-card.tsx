import { useState } from 'react';
import { Button } from '../button';
import { StarRating } from '../star-rating';

export interface ReviewCardProps {
  text?: string;
  onClick?: () => void;
  rating?: number;
  hasCallQualityRating?: boolean;
  readMore: string;
  readLess: string;
}

/**
 * A reusable card component that displays a review with a star rating and an optional "Read More" button.
 *
 * @param text The review text to be displayed.
 * @param onClick Optional callback function triggered when the "Read More" button is clicked.
 * @param rating The rating value to be displayed using the `StarRating` component.
 * @param hasCallQualityRating Flag indicating whether the review is for call quality. If true, only the rating is shown.
 * @param readMore The text to display on the "Read More" button.
 * @param readLess The text to hide on the "Read Less" button.
 *
 * @example
 * <ReviewCard
 *   text="Coach was very helpful and answered all my questions. The only issue was that the session was slightly delayed due to technical difficulties. Overall, I would recommend this service!"
 *   rating={5}
 *   hasCallQualityRating={false}
 *   readMore="Read More"
 *   readLess="Read Less"
 *   onClick={() => console.log("Read More clicked")}
 * />
 */
export function ReviewCard({
  text='',
  onClick,
  rating,
  hasCallQualityRating,
  readMore,
  readLess,
}: ReviewCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
    if (onClick) onClick();
  };

  // Logic to truncate text if it exceeds a certain length (e.g., 100 characters)
  const truncatedText = text.length > 100 ? `${text.slice(0, 100)}...` : text;

  return (
    <div className="flex p-3 items-start flex-col bg-base-neutral-800 rounded-small border border-base-neutral-700">
      {hasCallQualityRating ? (
        <StarRating rating={rating} />
      ) : (
        <>
          <p className="text-sm text-text-secondary lineHight-[150%] text-left">
            "{isExpanded ? text : truncatedText}"
          </p>
          {text.length > 100 && (
            <Button
              text={isExpanded ? readLess : readMore}
              variant="text"
              size="small"
              className="p-0"
              onClick={toggleText}
            />
          )}
          <div className="flex justify-end items-end w-full">
            <StarRating rating={rating} />
          </div>
        </>
      )}
    </div>
  );
}
