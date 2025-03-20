import React from 'react';
import { CourseCreatorCard, CourseStatus } from './course-creator-coursecard/course-creator-card';
import { CoachCourseCard } from './coach-coursecard/coach-coursecard';
import { StudentCourseCard } from './student-coursecard/student-course-card';
import { VisitorCourseCard } from './visitor-coursecard/visitor-coursecard';
import { course, language } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';

export type UserType = 'creator' | 'coach' | 'student' | 'visitor';

export interface CourseCardProps {
  userType: UserType;
  reviewCount: number;
  locale: TLocale;
  language: language.TLanguage;
  creatorStatus?: CourseStatus;
  course?: course.TCourseMetadata;
  progress?: number;
  sessions?: number;
  sales?: number;
  onEdit?: () => void;
  onManage?: () => void;
  onBegin?: () => void;
  onResume?: () => void;
  onReview?: () => void;
  onDetails?: () => void;
  onBuy?: () => void;
  onBrowseCourses?: () => void;
  creatorName?: string;
  groupName?: string;
  className?: string;
}

export const CourseCard: React.FC<CourseCardProps> = (props) => {
  const {
    className,
    userType,
    reviewCount,
    locale,
    language,
    creatorStatus,
    course,
    progress,
    sessions = 0,
    sales = 0,
    onEdit,
    onBuy,
    onManage,
    onBegin,
    onResume,
    onReview,
    onDetails,
    groupName,
  } = props;

  const cardComponents = {
    creator: {
      render: () => {
        if (!course || !creatorStatus) {
          console.error('Course and creatorStatus are required for creator view');
          return null;
        }
        return (
          <CourseCreatorCard
            title={course.title}
            author={course.author}
            imageUrl={course.imageUrl}
            rating={course.rating}
            duration={course.duration}
            language={language}
            reviewCount={reviewCount}
            sessions={sessions}
            sales={sales}
            description={course.description}
            pricing={course.pricing}
            status={creatorStatus}
            locale={locale}
            onEdit={onEdit}
            onManage={onManage}
          />
        );
      },
    },
    coach: {
      render: () => {
        if (!course) {
          console.error('Course is required for coach view');
          return null;
        }
        return (
          <CoachCourseCard
            title={course.title}
            rating={course.rating}
            reviewCount={reviewCount}
            author={course.author}
            language={language}
            sessions={sessions}
            duration={course.duration}
            sales={sales}
            groupName={groupName}
            imageUrl={course.imageUrl}
            onManage={onManage}
            locale={locale}
          />
        );
      },
    },
    student: {
      render: () => {
        if (!course) {
          console.error('Course is required for student view');
          return null;
        }
        return (
          <StudentCourseCard
            title={course.title}
            description={course.description}
            rating={course.rating}
            author={course.author}
            imageUrl={course.imageUrl}
            language={language}
            duration={course.duration}
            pricing={course.pricing}
            locale={locale}
            sales={sales}
            reviewCount={reviewCount}
            progress={progress}
            onBegin={onBegin}
            onResume={onResume}
            onReview={onReview}
            onDetails={onDetails}
          />
        );
      },
    },
    visitor: {
      render: () => {
        if (!course) {
          console.error('Course is required for visitor view');
          return null;
        }
        return (
          <VisitorCourseCard
            title={course.title}
            description={course.description}
            rating={course.rating}
            reviewCount={reviewCount}
            author={course.author}
            pricing={course.pricing}
            language={language}
            sessions={sessions}
            duration={course.duration}
            sales={sales}
            imageUrl={course.imageUrl}
            onDetails={onDetails}
            onBuy={onBuy}
            locale={locale}
          />
        );
      },
    },
  };

  const cardConfig = cardComponents[userType];

  if (!cardConfig) {
    console.error(`Invalid userType: ${userType}`);
    return null;
  }

  return <div className={className}>{cardConfig.render()}</div>;
};