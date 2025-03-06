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
 * A versatile card component that renders different course card variations based on the user type.
 *
 * @param userType The type of user viewing the card. Options:
 *   - `creator`: Displays the CourseCreatorCard for course creators.
 *   - `coach`: Displays the CoachCourseCard for coaches.
 *   - `student`: Displays the StudentCourseCard for students.
 *   - `visitor`: Displays the VisitorCourseCard for visitors.
 * @param reviewCount The number of reviews for the course.
 * @param locale The locale for translation and localization purposes.
 * @param language The language object containing the name of the course language.
 * @param creatorStatus Optional status of the course for creators. Options: 'published', 'under-review', 'draft'. Required for 'creator' userType.
 * @param course Optional course metadata object containing title, rating, author, duration, imageUrl, etc. Required for certain user types.
 * @param progress Optional numeric value representing the course completion progress (used for 'student' userType).
 * @param sessions Optional number of sessions in the course (defaults to 0).
 * @param sales Optional number of sales for the course (defaults to 0).
 * @param onEdit Optional callback function triggered when the "Edit" button is clicked (for 'creator' userType).
 * @param onManage Optional callback function triggered when the "Manage" button is clicked (for 'creator' or 'coach' userType).
 * @param onBegin Optional callback function triggered when the "Begin Course" button is clicked (for 'student' userType).
 * @param onResume Optional callback function triggered when the "Resume Course" button is clicked (for 'student' userType).
 * @param onReview Optional callback function triggered when the "Review Course" button is clicked (for 'student' userType).
 * @param onDetails Optional callback function triggered when the "Details" button is clicked (for 'student' or 'visitor' userType).
 * @param onBuy Optional callback function triggered when the "Buy Course" button is clicked (for 'visitor' userType).
 * @param creatorName Optional name of the course creator (not directly used in this component but included in props).
 * @param groupName Optional name of the group associated with the course (for 'coach' userType).
 * @param className Optional additional CSS class names to customize the card's appearance.
 *
 * @example
 * <CourseCard
 *   userType="student"
 *   reviewCount={10}
 *   locale="en"
 *   language={{ name: "English" }}
 *   course={{
 *     title: "Learn JavaScript",
 *     rating: 4.7,
 *     author: { name: "John Doe", image: "author.jpg" },
 *     duration: { video: 120, coaching: 60, selfStudy: 30 },
 *     imageUrl: "course.jpg"
 *   }}
 *   progress={25}
 *   onResume={() => console.log("Resume clicked!")}
 *   className="custom-card"
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
            sales={sales}
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
        </div>
      );

    default:
      return null;
  }
};