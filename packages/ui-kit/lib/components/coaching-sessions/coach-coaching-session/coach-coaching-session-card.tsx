import React from 'react';
import { getDictionary } from '@maany_shr/e-class-translations';
import { DateAndTime } from '../date-and-time';
import { CourseCreator } from '../course-creator';
import { ReviewCard } from '../review-card';
import { CoachAction } from './coach-action';
import { CoachingSessionCardProps } from '../coaching-session-card';

/**
 * Type definition for coach coaching session card props extracted from the central discriminated union.
 * This ensures only coach-specific props are available for this component, providing type safety
 * and preventing invalid prop combinations from student-specific sessions.
 */
export type CoachCoachingSessionCardProps = Extract<CoachingSessionCardProps, { userType: 'coach' }>;

/**
 * Coach coaching session card component that displays coaching session details from a coach's perspective.
 * This component handles all possible coach session states including ongoing, upcoming, ended, requested,
 * rescheduled, and canceled sessions. Each state displays relevant information and actions based on the
 * session status and review type.
 *
 * The component uses TypeScript's discriminated union pattern to ensure type safety - props are automatically
 * validated based on the session status and review type, preventing invalid prop combinations and ensuring
 * required fields are present for each state.
 *
 * Key features:
 * - Responsive design with mobile and desktop layouts
 * - Conditional rendering based on session status and review type
 * - Integration with translation system for internationalization
 * - Dynamic action buttons based on session state through CoachAction component
 * - Dual review display types (session-review and call-quality) for ended sessions
 * - Special handling for rescheduled sessions showing previous and new times
 * - Student and course information display with interactive elements
 *
 * Layout structure:
 * 1. Header section with session title and duration
 * 2. Date/time display (regular or rescheduled format)
 * 3. Review card (conditional based on ended status and review type)
 * 4. Course creator section with student and course details
 * 5. Action buttons section handled by CoachAction component
 *
 * Review handling:
 * - `session-review`: Displays student's review text and rating
 * - `call-quality`: Shows only rating for technical call quality assessment
 * - Reviews only appear for ended sessions with valid ratings
 *
 * @param props Discriminated union props specific to coach session cards, automatically typed based on status and review type
 *
 * @example
 * // Ongoing session
 * <CoachCoachingSessionCard
 *   userType="coach"
 *   status="ongoing"
 *   title="React Advanced Patterns"
 *   duration={60}
 *   date={new Date()}
 *   startTime="10:00"
 *   endTime="11:00"
 *   studentName="John Doe"
 *   studentImageUrl="student.jpg"
 *   meetingLink="https://meet.example.com"
 *   onClickStudent={() => console.log("Student clicked")}
 *   onClickJoinMeeting={() => console.log("Join meeting")}
 *   locale="en"
 * />
 *
 * @example
 * // Ended session with session review
 * <CoachCoachingSessionCard
 *   userType="coach"
 *   status="ended"
 *   reviewType="session-review"
 *   reviewText="Great learning session!"
 *   rating={5}
 *   title="JavaScript Fundamentals"
 *   duration={45}
 *   date={new Date()}
 *   startTime="14:00"
 *   endTime="14:45"
 *   studentName="Jane Smith"
 *   studentImageUrl="student.jpg"
 *   onClickStudent={() => console.log("Student clicked")}
 *   onClickDownloadRecording={() => console.log("Download recording")}
 *   isRecordingDownloading={false}
 *   locale="en"
 * />
 *
 * @example
 * // Rescheduled session
 * <CoachCoachingSessionCard
 *   userType="coach"
 *   status="rescheduled"
 *   title="Python Basics"
 *   duration={30}
 *   date={new Date('2024-03-20')}
 *   startTime="16:00"
 *   endTime="16:30"
 *   previousDate={new Date('2024-03-18')}
 *   previousStartTime="14:00"
 *   previousEndTime="14:30"
 *   studentName="Mike Johnson"
 *   studentImageUrl="student.jpg"
 *   onClickStudent={() => console.log("Student clicked")}
 *   onClickAccept={() => console.log("Accept reschedule")}
 *   onClickDecline={() => console.log("Decline reschedule")}
 *   onClickSuggestAnotherDate={() => console.log("Suggest new date")}
 *   locale="en"
 * />
 */
export const CoachCoachingSessionCard: React.FC<CoachCoachingSessionCardProps> = (props) => {
  const dictionary = getDictionary(props.locale);

  return (
    <div className="flex flex-col md:p-4 p-2 gap-3 rounded-medium border border-card-stroke basis-0 bg-card-fill w-auto">
      <div className="flex gap-4 items-center justify-between">
        <p
          title={props.title}
          className="text-md text-text-primary font-bold leading-[120%] line-clamp-2"
        >
          {props.title}
        </p>
        <p className="text-xs text-text-primary font-bold leading-[120%] whitespace-nowrap">
          {props.duration}
          {dictionary.components.coachingSessionCard.durationText}
        </p>
      </div>
      {props.status === 'rescheduled' ? (
        <DateAndTime
          type="rescheduled"
          date={props.date}
          startTime={props.startTime}
          endTime={props.endTime}
          previousDate={props.previousDate}
          previousStartTime={props.previousStartTime}
          previousEndTime={props.previousEndTime}
          hasReview={false}
        />
      ) : (
        <DateAndTime
          type="regular"
          date={props.date}
          startTime={props.startTime}
          endTime={props.endTime}
          hasReview={props.status === 'ended'}
        />
      )}
      {props.status === 'ended' && (
        (props.reviewType === 'session-review' && props.rating && props.rating > 0) ||
        (props.reviewType === 'call-quality' && props.callQualityRating && props.callQualityRating > 0)
      ) && (
          <>
            {props.reviewType === 'session-review' ? (
              <ReviewCard
                type="coach-session-review"
                reviewText={props.reviewText}
                rating={props.rating}
                locale={props.locale}
              />
            ) : (
              <ReviewCard
                type="coach-call-quality"
                rating={props.callQualityRating}
                locale={props.locale}
              />
            )}
          </>
        )}
      <CourseCreator
        sessionType={props.sessionType}
        studentName={props.studentName}
        studentImageUrl={props.studentImageUrl}
        courseName={props.courseName}
        courseImageUrl={props.courseImageUrl}
        groupName={props.groupName}
        userRole="coach"
        onClickStudent={props.onClickStudent}
        onClickCourse={props.onClickCourse}
        onClickGroup={props.onClickGroup}
        locale={props.locale}
      />
      <div className="mt-auto">
        <CoachAction {...props} />
      </div>
    </div>
  );
};
