import React from 'react';
import { CourseCreatorCard, CourseStatus } from './course-creator-coursecard/course-creator-card';
import { CoachCourseCard } from './coach-coursecard/coach-coursecard';
import { StudentCourseCard } from './student-coursecard/student-course-card';
import { VisitorCourseCard } from './visitor-coursecard/visitor-coursecard';
import { course } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import { TLanguage } from 'packages/models/src/language';


export type UserType = 'creator' | 'coach' | 'student' | 'visitor';

export interface CourseCardProps {
  // Common props across all card types
  userType: UserType;
  reviewCount: number;
  locale: TLocale;
  language: TLanguage;

  // Creator-specific props
  creatorStatus?: CourseStatus;
  course?: course.TCourseMetadata;

  // Student-specific props
  progress?: number;

  // Session, duration and sales can be handled differently based on the card
  sessions?: number;
  sales?: number;

  // Common action handlers
  onEdit?: () => void;
  onManage?: () => void;
  onBegin?: () => void;
  onResume?: () => void;
  onReview?: () => void;
  onDetails?: () => void;
  onBuy?: () => void;
  // Coach/Visitor-specific props
  creatorName?: string;
  groupName?: string;

  className?: string;
}

/**
 * User types for the CourseCard component.
 * @typedef {'creator' | 'coach' | 'student' | 'visitor'} UserType
 */

/**
 * Props for the CourseCard component.
 * @typedef {Object} CourseCardProps
 * @property {UserType} userType - The type of user viewing the course.
 * @property {number} reviewCount - The number of reviews for the course.
 * @property {TLocale} locale - The locale setting for the component.
 * @property {TLanguage} language - The language of the course.
 * @property {CourseStatus} [creatorStatus] - The status of the course for creators.
 * @property {course.TCourseMetadata} [course] - Metadata of the course.
 * @property {number} [progress] - The progress percentage for students.
 * @property {number} [sessions=0] - The number of sessions in the course.
 * @property {number} [sales=0] - The number of sales for the course.
 * @property {Function} [onEdit] - Callback for editing the course.
 * @property {Function} [onManage] - Callback for managing the course.
 * @property {Function} [onBegin] - Callback for beginning the course.
 * @property {Function} [onResume] - Callback for resuming the course.
 * @property {Function} [onReview] - Callback for reviewing the course.
 * @property {Function} [onDetails] - Callback for viewing course details.
 * @property {Function} [onBuy] - Callback for purchasing the course.
 * @property {string} [creatorName] - Name of the course creator.
 * @property {string} [groupName] - Name of the group associated with the course.
 * @property {string} [className] - Additional CSS class names for styling.
 */

/**
 * CourseCard component renders different course cards based on user type.
 *
 * @param {CourseCardProps} props - The properties for the component.
 * @returns {React.ReactElement|null} The rendered course card component.
 */
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

  switch (userType) {
    case 'creator':
      if (!course || !creatorStatus) {
        //To-do to handle errors in a better way
        console.error('Course and creatorStatus are required for creator view');
        return null;
      }
      return (
        <div className={className}>
          <CourseCreatorCard
            course={course}
            rating={course.rating}
            reviewCount={reviewCount}
            sessions={sessions}
            sales={sales}
            status={creatorStatus}
            locale={locale}
            onEdit={onEdit}
            onManage={onManage}
          />
        </div>
      );

    case 'coach':
      return (
        <div className={className}>
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
        </div>
      );

    case 'student':
      if (!course) {
        console.error('Course is required for student view');
        return null;
      }
      return (
        <div className={className}>
          <StudentCourseCard
            {...course}
            locale={locale}
            reviewCount={reviewCount}
            progress={progress}
            onBegin={onBegin}
            onResume={onResume}
            onReview={onReview}
            onDetails={onDetails}
          />
        </div>
      );

    case 'visitor':
      return (
        <div className={className}>
          <VisitorCourseCard
            title={course.title}
            rating={course.rating}
            reviewCount={reviewCount}
            author={course.author}
            language={language}
            sessions={sessions}
            duration={course.duration}
            sales={sales}
            imageUrl={course.imageUrl}
            onDetails={onDetails}
            onBuy={onBuy}
            locale={locale}
          />
        </div>
      );

    default:
      return null;
  }
};