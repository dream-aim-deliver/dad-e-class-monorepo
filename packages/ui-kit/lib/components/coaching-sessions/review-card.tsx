import { useState } from 'react';
import { Button } from '../button';
import { StarRating } from '../star-rating';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface ReviewCardProps extends isLocalAware {
  reviewText?: string;
  rating?: number;
  callQualityRating?: number;
}

/**
 * ReviewCard component for displaying review information.
 *
 * @param reviewText The text content of the review.
 * @param rating The rating given in the review (out of 5 stars).
 * @param callQualityRating The rating for call quality (out of 5 stars).
 * @param locale The locale for translation and localization purposes.
 *
 * @example
 * <ReviewCard
 *   reviewText="This was an excellent coaching session. The instructor was very knowledgeable and helpful."
 *   rating={4.5}
 *   locale="en"
 * />
 *
 * @example
 * <ReviewCard
 *   callQualityRating={5}
 *   locale="es"
 * />
 */

export const ReviewCard: React.FC<ReviewCardProps> = ({
  reviewText = '',
  rating,
  callQualityRating,
  locale,
}) => {
  const dictionary = getDictionary(locale);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleText = () => {
    setIsExpanded((isExpanded) => !isExpanded);
  };

  const truncatedText =
    reviewText?.length > 100 ? `${reviewText?.slice(0, 100)}...` : reviewText;

  return (
    <div className="flex p-3 items-start flex-col bg-base-neutral-800 rounded-small border border-base-neutral-700">
      {callQualityRating ? (
        <StarRating totalStars={5} rating={callQualityRating} />
      ) : (
        <>
          <p className="text-sm text-text-secondary text-left">
            "{isExpanded ? reviewText : truncatedText}"
          </p>
          {reviewText?.length > 100 && (
            <Button
              text={
                isExpanded
                  ? dictionary.components.coachingSessionCard.readLessText
                  : dictionary.components.coachingSessionCard.readMoreText
              }
              variant="text"
              size="small"
              className="p-0 max-w-[15rem]"
              onClick={handleToggleText}
            />
          )}
          <div className="flex justify-end items-end w-full">
            {rating > 0 && <StarRating totalStars={5} rating={rating} />}
          </div>
        </>
      )}
    </div>
  );
};