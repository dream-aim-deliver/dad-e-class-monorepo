import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Badge } from '../../badge';
import { Button } from '../../button';
import { Check } from 'lucide-react';
import * as React from 'react';
import { IconCheck } from '../../icons/icon-check';

interface CourseActionsProps extends isLocalAware{
  onBegin?: () => void;
  onResume?: () => void;
  onReview?: () => void;
  onDetails?: () => void;
  progress?: number;
  studyProgress?: 'yet-to-start' | 'in-progress' | 'completed';
}
/**
 * Props for the CourseActions component.
 *
 * @typedef {Object} CourseActionsProps
 * @property {() => void} [onBegin] - Handler for beginning the course.
 * @property {() => void} [onResume] - Handler for resuming the course.
 * @property {() => void} [onReview] - Handler for reviewing the course.
 * @property {() => void} [onDetails] - Handler for viewing course details.
 * @property {number} [progress] - Progress percentage of the course.
 * @property {'yet-to-start' | 'in-progress' | 'completed'} [studyProgress] - Current study progress status.
 * @property {string} locale - The locale for translations.
 */

/**
 * Displays action buttons for course interactions based on the study progress.
 *
 * @type {React.FC<CourseActionsProps>}
 */
export const CourseActions: React.FC<CourseActionsProps> = ({
  onBegin,
  onResume,
  onReview,
  onDetails,
  progress,
  studyProgress,
  locale
}) => {
  const dictionary = getDictionary(locale);

  if (studyProgress === 'completed') {
    return (
      <div className="flex flex-col gap-4">
        <Badge
          className="flex items-center gap-1 px-3 py-1 rounded-lg w-fit"
          variant={'successprimary'}
          size={'big'}
          text={dictionary.components.courseCard.completedBadge}
          iconLeft={<IconCheck />}
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
