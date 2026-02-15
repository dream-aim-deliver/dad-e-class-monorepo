'use client';

import { Button } from '../button';
import { StarRating } from '../star-rating';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

/**
 * ReviewCardGroupOverview props 
 */
export interface ReviewCardGroupOverviewProps extends isLocalAware {
  averageRating: number;
  reviewCount: number;
  studentCount: number;
  onClickReadReviews?: () => void;
}

/**
 * ReviewCardGroupOverview component for displaying review information using discriminated unions.
 * Uses type-safe props based on the specific review scenario.
 *
* @param averageRating Average rating value to display
* @param reviewCount Total number of reviews
* @param studentCount Total number of students in the session
* @param onClickReadReviews Optional callback when "Read Reviews" is clicked
* @param locale Locale string for translations
 *
 * @example
 * <ReviewCardGroupOverview
 *   averageRating={4.5}
 *   reviewCount={5}
 *   studentCount={50}
 *   locale="en"
 * />
 */
export const ReviewCardGroupOverview: React.FC<ReviewCardGroupOverviewProps> = (props) => {
  const dictionary = getDictionary(props.locale);

  return (
    <div className="flex p-3 items-start flex-col gap-3 bg-base-neutral-800 rounded-small border border-base-neutral-700">
        <div className="flex flex-col gap-2 w-full">
          <div className='flex items-center gap-1'>
            <p className="text-sm text-text-secondary">
              {dictionary.components.coachingSessionCard.reviewsSentText} 
            </p>
            <span className="text-sm text-text-primary font-bold">
              {props.reviewCount}
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            <p className="text-sm text-text-secondary">
              {dictionary.components.coachingSessionCard.averageRatingText}
            </p>
            <div className="flex items-center gap-1">
              <StarRating totalStars={5} rating={props.averageRating} />
              <span className="text-sm text-text-primary font-bold">
                {props.averageRating} ({props.reviewCount})
              </span>
              <span className="text-xs text-text-secondary font-semibold">
                ({props.studentCount})
              </span>
            </div>
          </div>
            {props.onClickReadReviews && (
              <Button
                text={dictionary.components.coachingSessionCard.readReviewsText}
                variant="text"
                size="small"
                className="p-0 max-w-[15rem] text-left justify-start"
                onClick={props.onClickReadReviews}
              />
            )}
        </div>
    </div>
  );
};
