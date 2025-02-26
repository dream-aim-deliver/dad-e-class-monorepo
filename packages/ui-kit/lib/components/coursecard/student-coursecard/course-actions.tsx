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
        >
          <IconCheck /> {dictionary.components.courseCard.completedBadge}{' '}
        </Badge>
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
