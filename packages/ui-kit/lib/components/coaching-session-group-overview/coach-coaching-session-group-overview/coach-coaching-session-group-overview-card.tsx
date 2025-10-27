import React from 'react';
import { getDictionary } from '@maany_shr/e-class-translations';
import { DateAndTimeGroupOverview } from '../date-and-time-group-overview';
import { CourseCreatorGroupOverview } from '../course-creator-group-overview';
import { ReviewCardGroupOverview } from '../review-card-group-overview';
import { CoachActionGroupOverview } from './coach-action-group-overview';
import { IconCalendarAlt } from '../../icons/icon-calendar-alt';
import { IconClock } from '../../icons/icon-clock';
import { CoachingSessionGroupOverviewCardProps } from '../coaching-session-group-overview-card';

/**
 * Type definition for coach coaching session group overview card props extracted from the central discriminated union.
 * This ensures only coach-specific props are available for this component, providing type safety
 * and preventing invalid prop combinations from student-specific sessions.
 */
export type CoachCoachingSessionGroupOverviewCardProps = Extract<CoachingSessionGroupOverviewCardProps, { userType: 'coach' }>;

/**
 * Coach coaching session group overview card component that displays coaching session details from a coach's perspective.
 * This component handles all possible coach session states including ongoing, upcoming, ended,
 * and canceled sessions. Each state displays relevant information and actions based on the
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
 * - Dynamic action buttons based on session state through CoachActionGroupOverview component
 * - Dual review display types (session-review and call-quality) for ended sessions

 * - Student and course information display with interactive elements
 *
 * Layout structure:
 * 1. Header section with session title and duration
 * 2. Date/time display
 * 3. Review card (conditional based on ended status and review type)
 * 4. Course creator section with student and course details
 * 5. Action buttons section handled by CoachActionGroupOverview component
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
 * <CoachCoachingSessionGroupOverviewCard
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
 * <CoachCoachingSessionGroupOverviewCard
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

 */
export const CoachCoachingSessionGroupOverviewCard: React.FC<CoachCoachingSessionGroupOverviewCardProps> = (props) => {
  const dictionary = getDictionary(props.locale);

  // Special case for sessions with undefined scheduling
  // These sessions don't have finalized date/time or creator assignments
  if (props.status === 'unscheduled') {
    return (
      <div className="flex flex-col justify-center md:p-4 p-2 gap-3 rounded-medium border border-card-stroke bg-card-fill w-auto h-fit">
        <div className="flex gap-4 items-center justify-between">
          <p title={props.title} className="text-md text-text-primary font-bold leading-[120%] line-clamp-2">
            {props.title}
          </p>
          <p className="text-xs text-text-primary font-bold leading-[120%] whitespace-nowrap">
            {props.duration}
            {dictionary.components.coachingSessionCard.durationText}
          </p>
        </div>
        <div className="flex text-text-primary p-3 items-start flex-col gap-3 bg-base-neutral-800 rounded-small border border-base-neutral-700">
          <div className="flex items-center gap-2">
            <IconCalendarAlt size="4" />
            <p className="text-sm text-text-primary leading-[100%]">
              {dictionary.components.coachingSessionCard.toBeDefined}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <IconClock size="4" />
            <p className="text-sm text-text-primary leading-[100%]">
              {dictionary.components.coachingSessionCard.toBeDefined}
            </p>
          </div>
        </div>
        {props.withinCourse && (
          <CourseCreatorGroupOverview
            withinCourse={props.withinCourse}
            userRole="coach"
            status={props.status}
            courseName={props.courseName}
            courseImageUrl={props.courseImageUrl}
            groupName={props.groupName}
            creatorName={props.creatorName}
            creatorImageUrl={props.creatorImageUrl}
            onClickCourse={props.onClickCourse}
            onClickGroup={props.onClickGroup}
            onClickCreator={props.onClickCreator}
            locale={props.locale}
          />
        )}
        <CoachActionGroupOverview {...props} />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center md:p-4 p-2 gap-3 rounded-medium border border-card-stroke basis-0 bg-card-fill w-auto h-fit">
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
      <DateAndTimeGroupOverview
        type="regular"
        date={props.date}
        startTime={props.startTime}
        endTime={props.endTime}
        hasReview={props.status === 'ended'}
      />
      {props.status === 'ended' && (
        <ReviewCardGroupOverview
          reviewCount={props.reviewCount}
          studentCount={props.studentCount}
          averageRating={props.averageRating}
          onClickReadReviews={props.onClickReadReviews}
          locale={props.locale}
        />
        )}
      <CourseCreatorGroupOverview
        withinCourse={props.withinCourse}
        userRole="coach"
        status={props.status}
        courseName={props.courseName}
        courseImageUrl={props.courseImageUrl}
        groupName={props.groupName}
        creatorName={props.creatorName}
        creatorImageUrl={props.creatorImageUrl}
        onClickCourse={props.onClickCourse}
        onClickGroup={props.onClickGroup}
        onClickCreator={props.onClickCreator}
        locale={props.locale}
      />
      <CoachActionGroupOverview {...props} />
    </div>
  );
};