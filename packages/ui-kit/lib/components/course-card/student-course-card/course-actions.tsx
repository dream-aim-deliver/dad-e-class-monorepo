import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Badge } from '../../badge';
import { Button } from '../../button';
import * as React from 'react';
import { IconCheck } from '../../icons/icon-check';

interface CourseActionsProps extends isLocalAware {
  onBegin?: () => void;
  onResume?: () => void;
  onReview?: () => void;
  onDetails?: () => void;
  onBuy?: () => void;
  progress?: number;
  pricing?: {
    currency?: string;
    fullPrice?: number;
    partialPrice?: number;
  };
  isPurchased?: boolean;
  coachingIncluded?: boolean;
  studyProgress?: 'yet-to-start' | 'in-progress' | 'completed';
}

/**
 * A component for rendering course action buttons based on the study progress of a course.
 *
 * @param onBegin Optional callback function triggered when the "Begin Course" button is clicked. Used when studyProgress is 'yet-to-start'.
 * @param onResume Optional callback function triggered when the "Resume Course" button is clicked. Used when studyProgress is 'in-progress'.
 * @param onReview Optional callback function triggered when the "Review Course" button is clicked. Used when studyProgress is 'completed'.
 * @param onDetails Optional callback function triggered when the "Details" button is clicked. Used when studyProgress is 'completed'.
 * @param progress Optional numeric value representing the course completion progress (not directly used in this component but included in props).
 * @param isPurchased Optional boolean indicating if the course has been purchased (not directly used in this component but included in props).
 * @param pricing Optional object containing pricing details: currency, fullPrice, and partialPrice.
 * @param onBuy Optional callback function triggered when the "Buy Course" button is clicked. Used when the course is not purchased.
 * @param coachingIncluded Optional boolean indicating if coaching is included in the course pricing.
 * @param studyProgress The current study progress of the course. Options:
 *   - `yet-to-start`: The course has not been started yet (default behavior).
 *   - `in-progress`: The course is currently in progress.
 *   - `completed`: The course has been fully completed.
 * @param locale The locale for translation and localization purposes.
 *
 * @example
 * <CourseActions
 *   onBegin={() => console.log("Begin clicked!")}
 *   onResume={() => console.log("Resume clicked!")}
 *   onReview={() => console.log("Review clicked!")}
 *   onDetails={() => console.log("Details clicked!")}
 *   studyProgress="in-progress"
 *   isPurchased={true}
 *   locale="en"
 * />
 */
export const CourseActions: React.FC<CourseActionsProps> = ({
  onBegin,
  onResume,
  onReview,
  onDetails,
  progress,
  coachingIncluded = false,
  pricing,
  onBuy,
  isPurchased,
  studyProgress,
  locale
}) => {
  const dictionary = getDictionary(locale);

  const pricingValue = pricing && pricing.currency 
    ? coachingIncluded && pricing.fullPrice
      ? `${pricing.currency} ${pricing.fullPrice}`
      : pricing.partialPrice
      ? `${dictionary.components.courseCard.fromButton} ${pricing.currency} ${pricing.partialPrice}`
      : ''
    : '';

  if (isPurchased === false) {
    return (
      <div className="flex flex-col gap-2 flex-shrink-0 mt-auto">
        <Button
          className=""
          variant={'secondary'}
          size={'medium'}
          onClick={onDetails}
          text={
            dictionary.components.courseCard
              .detailsCourseButton
          }
        />
        <Button
          className=""
          variant={'primary'}
          size={'medium'}
          onClick={onBuy}
          text={pricingValue ? `${dictionary.components.courseCard.buyButton} (${pricingValue})` : dictionary.components.courseCard.buyButton}
        />
      </div>
    );
  } else if (studyProgress === 'completed') {
    return (
      <div className="flex flex-col gap-4">
        <Badge
          className="flex items-center gap-1 px-3 py-1 rounded-lg w-fit"
          variant={'successprimary'}
          size={'big'}
          text={dictionary.components.courseCard.completedBadge}
          iconLeft={<IconCheck size="5" />}
          hasIconLeft
        />
        <div className="flex flex-col gap-2">
          <Button
            className=""
            variant={'primary'}
            size={'medium'}
            onClick={onReview}
            text={dictionary.components.courseCard.reviewCourseButton}
          />
          <Button
            className=""
            variant={'secondary'}
            size={'medium'}
            onClick={onDetails}
            text={dictionary.components.courseCard.detailsCourseButton}
          />
        </div>
      </div>
    );
  } else if (studyProgress === 'in-progress') {
    return (
      <Button
        onClick={onResume}
        className="w-full p-3"
        variant={'primary'}
        size={'medium'}
        text={dictionary.components.courseCard.resumeCourseButton}
      />
    );
  }

  return (
    <Button
      onClick={onBegin}
      className="w-full p-3"
      variant={'primary'}
      size={'medium'}
      text={dictionary.components.courseCard.beginCourseButton}
    />
  );
};