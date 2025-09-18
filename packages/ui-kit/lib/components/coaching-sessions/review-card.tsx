'use client';

import { useState } from 'react';
import { Button } from '../button';
import { StarRating } from '../star-rating';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

/**
 * ReviewCard props for student reviews (session review with text and rating)
 */
interface StudentReviewCardProps extends isLocalAware {
  type: 'student-review';
  reviewText: string;
  rating: number;
}

/**
 * ReviewCard props for coach session review (text and rating)
 */
interface CoachSessionReviewCardProps extends isLocalAware {
  type: 'coach-session-review';
  reviewText: string;
  rating: number;
}

/**
 * ReviewCard props for coach call quality rating (rating and call quality)
 */
interface CoachCallQualityCardProps extends isLocalAware {
  type: 'coach-call-quality';
  rating: number;
}

/**
 * Discriminated union for ReviewCard props
 */
export type ReviewCardProps = StudentReviewCardProps | CoachSessionReviewCardProps | CoachCallQualityCardProps;

/**
 * ReviewCard component for displaying review information using discriminated unions.
 * Uses type-safe props based on the specific review scenario.
 *
 * @param type - The type of review: 'student-review', 'coach-session-review', or 'coach-call-quality'
 * @param reviewText - (student-review, coach-session-review) The text content of the review
 * @param rating - The rating given in the review (out of 5 stars)
 * @param locale - The locale for translation and localization purposes
 *
 * @example
 * // Student review
 * <ReviewCard
 *   type="student-review"
 *   reviewText="This was an excellent coaching session."
 *   rating={4.5}
 *   locale="en"
 * />
 *
 * @example
 * // Coach session review
 * <ReviewCard
 *   type="coach-session-review"
 *   reviewText="Great session with the student."
 *   rating={5}
 *   locale="en"
 * />
 *
 * @example
 * // Coach call quality rating
 * <ReviewCard
 *   type="coach-call-quality"
 *   rating={4}
 *   locale="en"
 * />
 */
export const ReviewCard: React.FC<ReviewCardProps> = (props) => {
  const dictionary = getDictionary(props.locale);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToggleText = () => {
    setIsExpanded((isExpanded) => !isExpanded);
  };

  if (props.type === 'coach-call-quality') {
    // Show only call quality rating
    return (
      <div className="flex p-3 items-start flex-col bg-base-neutral-800 rounded-small border border-base-neutral-700">
        <StarRating totalStars={5} rating={props.rating} />
      </div>
    );
  }

  // For both student-review and coach-session-review (both have reviewText and rating)
  const reviewText = props.reviewText;
  const rating = props.rating;
  const truncatedText = reviewText.length > 100 ? `${reviewText.slice(0, 100)}...` : reviewText;

  return (
    <div className="flex p-3 items-start flex-col bg-base-neutral-800 rounded-small border border-base-neutral-700">
      <p className="text-sm text-text-secondary text-left">
        "{isExpanded ? reviewText : truncatedText}"
      </p>
      {reviewText.length > 100 && (
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
        <StarRating totalStars={5} rating={rating} />
      </div>
    </div>
  );
};