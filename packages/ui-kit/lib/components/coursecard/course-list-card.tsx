import React from 'react';
import { CourseCard, CourseCardProps } from './course-card';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { EmptyState } from './course-empty-state';

export interface CourseCardListProps {
  courses: CourseCardProps[];
  userType: CourseCardProps['userType'];
  locale: TLocale;
  callbacks?: Partial<Pick<CourseCardProps, 
    'onEdit' | 'onManage' | 'onBegin' | 'onResume' | 
    'onReview' | 'onDetails' | 'onBuy' | 'onBrowseCourses'
 >>;
}

const getEmptyStateConfig = (
  userType: CourseCardProps['userType'],
  locale: TLocale,
  onBrowseCourses?: () => void
) => {
  const dictionary = getDictionary(locale);
  const isCreatorOrCoach = userType === 'creator' || userType === 'coach';
  const showButton = !!onBrowseCourses && (userType === 'student' || userType === 'visitor');

  return {
    locale,
    message: isCreatorOrCoach
      ? dictionary.components.courseCard.courseEmptyState.message2
      : dictionary.components.courseCard.courseEmptyState.message,
    ...(showButton && {
      buttonText: dictionary.components.courseCard.courseEmptyState.buttonText,
      onButtonClick: onBrowseCourses,
    }),
  };
};

export const CourseCardList: React.FC<CourseCardListProps> = React.memo(({
  courses,
  userType,
  locale,
  callbacks = {},
}) => {
  const {
    onEdit,
    onManage,
    onBegin,
    onResume,
    onReview,
    onDetails,
    onBuy,
    onBrowseCourses,
  } = callbacks;

  // Early return for empty state
  if (!courses?.length) {
    return (
      <EmptyState 
        {...getEmptyStateConfig(userType, locale, onBrowseCourses)}
      />
    );
  }

  // Common props to be spread across all cards
  const baseCardProps = {
    userType,
    locale,
    onEdit,
    onManage,
    onBegin,
    onResume,
    onReview,
    onDetails,
    onBuy,
    onBrowseCourses,
  };

  return (
    <div className="course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 ">
      {courses.map((courseProps, index) => (
        <CourseCard
          key={ index} // Use course ID if available, fallback to index
          {...baseCardProps}
          {...courseProps}
          userType={userType}
        />
      ))}
    </div>
  );
});