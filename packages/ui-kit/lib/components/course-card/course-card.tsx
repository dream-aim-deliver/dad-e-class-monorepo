import React from 'react';
import { CourseCreatorCard, CourseStatus } from './course-creator-course-card/course-creator-card';
import { CoachCourseCard } from './coach-course-card/coach-course-card';
import { StudentCourseCard } from './student-course-card/student-course-card';
import { VisitorCourseCard } from './visitor-course-card/visitor-course-card';
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
  groupName?: string;
  onEdit?: () => void;
  onManage?: () => void;
  onBegin?: () => void;
  onResume?: () => void;
  onReview?: () => void;
  onDetails?: () => void;
  onBuy?: () => void;
  onClickUser?: () => void;
  className?: string;
}

/**
 * A versatile component that renders a course card tailored to different user types.
 *
 * @param userType The type of user viewing the card ('creator', 'coach', 'student', 'visitor').
 * @param reviewCount The number of reviews for the course.
 * @param locale The locale for translations (e.g., 'en', 'de').
 * @param language The language of the course (e.g., { code: 'ENG', name: 'English' }).
 * @param creatorStatus The status of the course for creators ('published', 'draft', 'under-review').
 * @param course The course metadata, including title, description, author, etc.
 * @param progress The student's progress percentage (0-100, for student user type).
 * @param sessions The number of sessions in the course.
 * @param sales The number of sales for the course.
 * @param groupName The name of the coaching group (for coach user type).
 * @param onEdit Callback for editing the course (for creator user type).
 * @param onManage Callback for managing the course (for creator or coach user type).
 * @param onBegin Callback for starting the course (for student user type, progress 0).
 * @param onResume Callback for resuming the course (for student user type, progress 1-99).
 * @param onReview Callback for reviewing the course (for student user type, progress 100).
 * @param onDetails Callback for viewing course details (for student or visitor user type).
 * @param onClickUser Callback for clicking the author's name (for all user types).
 * @param onBuy Callback for purchasing the course (for visitor user type).
 * @param className Optional CSS class for custom styling.
 *
 * @returns A course card component specific to the user type, or null if invalid props are provided.
 *
 * @example
 * // Creator card
 * <CourseCard
 *   userType="creator"
 *   reviewCount={328}
 *   locale="en"
 *   language={{ code: 'ENG', name: 'English' }}
 *   creatorStatus="published"
 *   course={{
 *     title: 'Advanced Brand Identity Design',
 *     description: 'Learn to create powerful brand identities.',
 *     duration: { video: 240, coaching: 120, selfStudy: 360 },
 *     pricing: { fullPrice: 299, partialPrice: 149, currency: 'USD' },
 *     imageUrl: 'https://example.com/image.jpg',
 *     author: { name: 'Emily Chen', image: 'https://example.com/author.jpg' },
 *     rating: 4.7,
 *   }}
 *   sessions={24}
 *   sales={1850}
 *   onEdit={() => console.log('Edit course')}
 *   onManage={() => console.log('Manage course')}
 *  onClickUser={() => console.log('Author clicked')}
 * />
 *
 * // Student card
 * <CourseCard
 *   userType="student"
 *   reviewCount={156}
 *   locale="en"
 *   language={{ code: 'ENG', name: 'English' }}
 *   course={{
 *     title: 'Web Design Fundamentals',
 *     description: 'Master the basics of web design.',
 *     duration: { video: 180, coaching: 60, selfStudy: 240 },
 *     imageUrl: 'https://example.com/image.jpg',
 *     author: { name: 'Emily Chen', image: 'https://example.com/author.jpg' },
 *     rating: 4.5,
 *   }}
 *   progress={46}
 *   sessions={15}
 *   sales={980}
 *   onResume={() => console.log('Resume course')}
 *   onDetails={() => console.log('View details')}
 *  onClickUser={() => console.log('Author clicked')}
 * />
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
    groupName,
    onEdit,
    onManage,
    onBegin,
    onResume,
    onReview,
    onDetails,
    onClickUser,
    onBuy,
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
            onClickUser={onClickUser}
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
            groupName={groupName} // Pass groupName explicitly if provided
            imageUrl={course.imageUrl}
            onManage={onManage}
            locale={locale}
            onClickUser={onClickUser}
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
            onClickUser={onClickUser}
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
            onClickUser={onClickUser}
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
