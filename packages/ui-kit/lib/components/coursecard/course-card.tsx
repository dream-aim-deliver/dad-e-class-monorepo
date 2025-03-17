import React from 'react';
import { CourseCreatorCard, CourseStatus } from './course-creator-coursecard/course-creator-card';
import { CoachCourseCard } from './coach-coursecard/coach-coursecard';
import { StudentCourseCard } from './student-coursecard/student-course-card';
import { VisitorCourseCard } from './visitor-coursecard/visitor-coursecard';
import { course, language } from '@maany_shr/e-class-models';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { CourseEmptyState, EmptyState } from './course-empty-state';

export type UserType = 'creator' | 'coach' | 'student' | 'visitor';

export interface CourseCardProps {
  // Common props across all card types
  userType: UserType;
  reviewCount: number;
  locale: TLocale;
  language: language.TLanguage;

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
  onBrowseCourses?: () => void;
  // Coach/Visitor-specific props
  creatorName?: string;
  groupName?: string;

  className?: string;
  
  // Add an optional courses array to check if there are any courses
  courses?: course.TCourseMetadata[];
  showEmptyState?: boolean;
}

/**
 * A flexible CourseCard component that dynamically renders different course card layouts based on the user type.
 * Shows an empty state when no courses are available.
 *
 * @param userType The type of user viewing the course card. Can be 'creator', 'coach', 'student', or 'visitor'.
 * @param reviewCount The number of reviews for the course.
 * @param locale The locale used for translations and formatting.
 * @param language The language of the course.
 * @param creatorStatus (Creator only) The status of the course for the creator.
 * @param course The course metadata, required for most user types.
 * @param progress (Student only) The progress of the student in the course.
 * @param sessions The number of sessions in the course.
 * @param sales The number of sales for the course.
 * @param onEdit (Creator only) Callback when editing the course.
 * @param onManage (Creator & Coach) Callback when managing the course.
 * @param onBegin (Student only) Callback when starting the course.
 * @param onResume (Student only) Callback when resuming the course.
 * @param onReview (Student only) Callback when reviewing the course.
 * @param onDetails (Visitor & Student) Callback when viewing course details.
 * @param onBuy (Visitor only) Callback when purchasing the course.
 * @param onBrowseCourses Callback when the browse courses button is clicked in empty state.
 * @param creatorName (Coach & Visitor) The name of the course creator.
 * @param groupName (Coach only) The name of the coaching group.
 * @param className Optional CSS class for styling.
 * @param courses Optional array of courses to check if there are any courses available.
 * @param showEmptyState Flag to explicitly control whether to show the empty state.
 *
 * @example
 * <CourseCard
 *   userType="creator"
 *   reviewCount={120}
 *   locale="en"
 *   language={{ code: "ENG", name: "English" }}
 *   creatorStatus="published"
 *   course={{ title: "React for Beginners", rating: 4.8 }}
 *   sessions={5}
 *   sales={200}
 *   onEdit={() => console.log("Edit clicked")}
 *   onManage={() => console.log("Manage clicked")}
 *   courses={[]}
 *   onBrowseCourses={() => console.log("Browse courses")}
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
    onBrowseCourses,
    groupName,
    courses,
    showEmptyState,
  } = props;

  const dictionary = getDictionary(locale);
  // Check if there are no courses or if empty state should be explicitly shown
  const shouldShowEmptyState = showEmptyState || (Array.isArray(courses) && courses.length === 0);
  
  // Custom empty state for creator and coach
  if (shouldShowEmptyState && (userType === 'creator' || userType === 'coach')) {
    return (
      <EmptyState
        message={dictionary.components.courseCard.courseEmptyState.message2}
        locale={locale}
      />
    );
  }

  // If courses is empty and onBrowseCourses is provided, show the empty state
  if (shouldShowEmptyState) {
    return <CourseEmptyState locale={locale} />;
  }

  const cardComponents = {
    creator: {
      validate: () => {
        if (!course || !creatorStatus) {
          return { isValid: false, errorMessage: 'Course and creatorStatus are required for creator view' };
        }
        return { isValid: true };
      },
      render: () => (
        <CourseCreatorCard
          course={course!}
          rating={course!.rating}
          reviewCount={reviewCount}
          sessions={sessions}
          sales={sales}
          status={creatorStatus!}
          locale={locale}
          onEdit={onEdit}
          onManage={onManage}
        />
      ),
    },
    coach: {
      validate: () => {
        if (!course || !course.title || !course.rating || !course.author || !course.duration || !course.imageUrl) {
          return { isValid: false, errorMessage: 'Course with complete metadata is required for coach view' };
        }
        return { isValid: true };
      },
      render: () => (
        <CoachCourseCard
          title={course!.title}
          rating={course!.rating}
          reviewCount={reviewCount}
          author={course!.author}
          language={language}
          sessions={sessions}
          duration={course!.duration}
          sales={sales}
          groupName={groupName}
          imageUrl={course!.imageUrl}
          onManage={onManage}
          locale={locale}
        />
      ),
    },
    student: {
      validate: () => {
        if (!course) {
          return { isValid: false, errorMessage: 'Course is required for student view' };
        }
        return { isValid: true };
      },
      render: () => (
        <StudentCourseCard
          {...course!}
          locale={locale}
          sales={sales}
          reviewCount={reviewCount}
          progress={progress}
          onBegin={onBegin}
          onResume={onResume}
          onReview={onReview}
          onDetails={onDetails}
        />
      ),
    },
    visitor: {
      validate: () => {
        if (!course || !course.title || !course.rating || !course.author || !course.pricing || !course.duration || !course.imageUrl) {
          return { isValid: false, errorMessage: 'Course with complete metadata is required for visitor view' };
        }
        return { isValid: true };
      },
      render: () => (
        <VisitorCourseCard
          title={course!.title}
          description={course!.description}
          rating={course!.rating}
          reviewCount={reviewCount}
          author={course!.author}
          pricing={course!.pricing}
          language={language}
          sessions={sessions}
          duration={course!.duration}
          sales={sales}
          imageUrl={course!.imageUrl}
          onDetails={onDetails}
          onBuy={onBuy}
          locale={locale}
        />
      ),
    },
  };

  const cardConfig = cardComponents[userType];

  // Handle invalid user types
  if (!cardConfig) {
    console.error(`Invalid userType: ${userType}`);
    return null;
  }

  // Validate props for the selected card type
  const validation = cardConfig.validate();
  if (!validation.isValid) {
    console.error(validation.errorMessage);
    return (
      <div className={`${className || ''} course-card-error`}>
        <div className="error-message">
          <h3>Unable to display course</h3>
          <p>{validation.errorMessage}</p>
        </div>
      </div>
    );
  }

  // Render the appropriate card
  return <div className={className}>{cardConfig.render()}</div>;
};