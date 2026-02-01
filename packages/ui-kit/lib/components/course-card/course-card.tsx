import React from 'react';
import { CourseCreatorCard, CourseStatus } from './course-creator-course-card/course-creator-card';
import { CoachCourseCard } from './coach-course-card/coach-course-card';
import { StudentCourseCard } from './student-course-card/student-course-card';
import { VisitorCourseCard } from './visitor-course-card/visitor-course-card';
import { course, language } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';

type BaseCourseCardProps = {
  reviewCount: number;
  locale: TLocale;
  language: language.TLanguage;
  course: course.TCourseMetadata;
  onClickUser?: () => void;
  className?: string;
};

// Creator-specific props
type CreatorCourseCardProps = BaseCourseCardProps & {
  userType: 'course_creator';
  creatorStatus: CourseStatus;
  sessions: number;
  sales: number;
  onEdit?: () => void;
  onGoToOffer?: () => void;
};

// Student-specific props
type StudentCourseCardProps = BaseCourseCardProps & {
  userType: 'student';
  sales: number;
  progress: number;
  onBegin?: () => void;
  onResume?: () => void;
  onReview?: () => void;
  onDetails?: () => void;
};

// Coach-specific props
type CoachCourseCardProps = BaseCourseCardProps & {
  userType: 'coach';
  sessions: number;
  sales: number;
  groupName?: string;
  onManage?: () => void;
};

// Visitor-specific props
type VisitorCourseCardProps = BaseCourseCardProps & {
  userType: 'visitor';
  sessions: number;
  sales: number;
  onDetails?: () => void;
  onBuy?: () => void;
};

// Discriminated union type for type-safe props
export type CourseCardProps =
  | CreatorCourseCardProps
  | StudentCourseCardProps
  | CoachCourseCardProps
  | VisitorCourseCardProps;

/**
 * A versatile component that renders a course card tailored to different user types.
 * Uses discriminated union types for type-safe prop validation.
 *
 * @param userType The type of user viewing the card ('course_creator', 'coach', 'student', 'visitor').
 * @param reviewCount The number of reviews for the course (required for all types).
 * @param locale The locale for translations (e.g., 'en', 'de') (required for all types).
 * @param language The language of the course (required for all types).
 * @param course The course metadata, including title, description, author, etc. (required for all types).
 * @param onClickUser Callback for clicking the author's name (optional for all types).
 * @param className Optional CSS class for custom styling (optional for all types).
 *
 * Type-specific props:
 * - course_creator: creatorStatus (required), sessions (required), sales (required), onEdit, onManage
 * - student: progress, onBegin, onResume, onReview, onDetails (NO sales)
 * - coach: sessions (required), sales (required), groupName, onManage
 * - visitor: sessions (required), sales (required), onDetails, onBuy
 *
 * @returns A course card component specific to the user type.
 *
 * @example
 * // Course Creator card - requires creatorStatus, sessions, sales
 * <CourseCard
 *   userType="course_creator"
 *   reviewCount={328}
 *   locale="en"
 *   language={{ code: 'ENG', name: 'English' }}
 *   creatorStatus="live"
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
 *   onClickUser={() => console.log('Author clicked')}
 * />
 *
 * // Student card - NO sales, only progress
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
 *   onResume={() => console.log('Resume course')}
 *   onDetails={() => console.log('View details')}
 *   onClickUser={() => console.log('Author clicked')}
 * />
 *
 * // Coach card
 * <CourseCard
 *   userType="coach"
 *   reviewCount={200}
 *   locale="en"
 *   language={{ code: 'ENG', name: 'English' }}
 *   course={{ ... }}
 *   sessions={15}
 *   sales={500}
 *   groupName="Advanced Group"
 *   onManage={() => console.log('Manage course')}
 * />
 *
 * // Visitor card
 * <CourseCard
 *   userType="visitor"
 *   reviewCount={100}
 *   locale="en"
 *   language={{ code: 'ENG', name: 'English' }}
 *   course={{ ... }}
 *   sessions={10}
 *   sales={250}
 *   onDetails={() => console.log('View details')}
 *   onBuy={() => console.log('Buy course')}
 * />
 */
export const CourseCard: React.FC<CourseCardProps> = (props) => {
  const { className, userType, reviewCount, locale, language, course, onClickUser } = props;

  switch (userType) {
    case 'course_creator': {
      const { creatorStatus, sessions, sales, onEdit, onGoToOffer} = props;
      return (
        <div className={className}>
          <CourseCreatorCard
            title={course.title}
            author={course.author}
            imageUrl={course.imageUrl}
            rating={course.rating as number}
            duration={course.duration}
            language={language}
            reviewCount={reviewCount}
            sessions={sessions}
            sales={sales}
            status={creatorStatus}
            locale={locale}
            onEdit={onEdit}
            onGoToOffer={onGoToOffer}
            onClickUser={onClickUser}
          />
        </div>
      );
    }

    case 'coach': {
      const { sessions, sales, groupName, onManage } = props;
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
            onClickUser={onClickUser}
          />
        </div>
      );
    }

    case 'student': {
      const { sales, progress, onBegin, onResume, onReview, onDetails } = props;
      return (
        <div className={className}>
          <StudentCourseCard
            title={course.title}
            description={course.description}
            pricing={course.pricing}
            rating={course.rating}
            author={course.author}
            imageUrl={course.imageUrl}
            language={language}
            duration={course.duration}
            locale={locale}
            reviewCount={reviewCount}
            sales={sales}
            progress={progress}
            onBegin={onBegin}
            onResume={onResume}
            onReview={onReview}
            onDetails={onDetails}
            onClickUser={onClickUser}
          />
        </div>
      );
    }

    case 'visitor': {
      const { sessions, sales, onDetails, onBuy } = props;
      return (
        <div className={className}>
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
        </div>
      );
    }

    default: {
      const exhaustiveCheck: never = userType;
      return null;
    }
  }
};
