import React from 'react';
import { getDictionary } from '@maany_shr/e-class-translations';
import { DateAndTimeGroupOverview } from '../date-and-time-group-overview';
import { CourseCreatorGroupOverview } from '../course-creator-group-overview';
import { StudentActionGroupOverview } from './student-action-group-overview';
import { ReviewCardGroupOverview } from '../review-card-group-overview';
import { IconCalendarAlt } from '../../icons/icon-calendar-alt';
import { IconClock } from '../../icons/icon-clock';
import { CoachingSessionGroupOverviewCardProps } from '../coaching-session-group-overview-card';

/**
 * Type definition for student coaching session group overview card props extracted from the central discriminated union.
 * This ensures only student-specific props are available for this component, providing type safety
 * and preventing invalid prop combinations.
 */
export type StudentCoachingSessionGroupOverviewCardProps = Extract<CoachingSessionGroupOverviewCardProps, { userType: 'student' }>;

/**
 * Student coaching session group overview card component that displays coaching session details from a student's perspective.
 * This component handles all possible student session states including ongoing, upcoming, ended,
 * canceled, and unscheduled sessions. Each state displays relevant information and actions
 * based on the session status.
 *
 * The component uses TypeScript's discriminated union pattern to ensure type safety - props are automatically
 * validated based on the session status, preventing invalid prop combinations and ensuring required fields
 * are present for each state.
 *
 * Key features:
 * - Responsive design with mobile and desktop layouts
 * - Conditional rendering based on session status
 * - Integration with translation system for internationalization
 * - Dynamic action buttons based on session state
 * - Review display for completed sessions
 * - Special handling for undefined/pending sessions
 *
 * @param props Discriminated union props specific to student session cards, automatically typed based on status
 *
 * @example
 * // Ongoing session
 * <StudentCoachingSessionGroupOverviewCard
 *   userType="student"
 *   status="ongoing"
 *   title="React Advanced Patterns"
 *   duration={60}
 *   date={new Date()}
 *   startTime="10:00"
 *   endTime="11:00"
 *   creatorName="John Doe"
 *   creatorImageUrl="profile.jpg"
 *   meetingLink="https://meet.example.com"
 *   onClickCreator={() => console.log("Creator clicked")}
 *   onClickJoinMeeting={() => console.log("Join meeting")}
 *   locale="en"
 * />
 *
 * @example
 * // Ended session with review
 * <StudentCoachingSessionGroupOverviewCard
 *   userType="student"
 *   status="ended"
 *   hasReview={true}
 *   reviewText="Great session!"
 *   rating={5}
 *   title="JavaScript Fundamentals"
 *   duration={45}
 *   date={new Date()}
 *   startTime="14:00"
 *   endTime="14:45"
 *   creatorName="Jane Smith"
 *   creatorImageUrl="creator.jpg"
 *   onClickCreator={() => console.log("Creator clicked")}
 *   onClickDownloadRecording={() => console.log("Download recording")}
 *   isRecordingDownloading={false}
 *   locale="en"
 * />
 *
 * @example
 * // Unscheduled session
 * <StudentCoachingSessionGroupOverviewCard
 *   userType="student"
 *   status="unscheduled"
 *   title="Python Basics"
 *   duration={30}
 *   locale="en"
 * />
 */
export const StudentCoachingSessionGroupOverviewCard: React.FC<StudentCoachingSessionGroupOverviewCardProps> = (props) => {
    const dictionary = getDictionary(props.locale);

    // Special case for sessions with undefined scheduling
    // These sessions don't have finalized date/time but still show creator information
    if (props.status === 'unscheduled') {
        return (
            <div className="flex flex-col justify-center md:p-4 p-2 gap-3 rounded-medium border border-card-stroke bg-card-fill w-auto">
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
                <CourseCreatorGroupOverview
                    withinCourse={props.withinCourse}
                    userRole="student"
                    status={props.status}
                    courseName={undefined}
                    courseImageUrl={undefined}
                    groupName={undefined}
                    creatorName={props.creatorName}
                    creatorImageUrl={props.creatorImageUrl}
                    onClickCourse={undefined}
                    onClickGroup={undefined}
                    onClickCreator={props.onClickCreator}
                    locale={props.locale}
                />
                <p className="text-md text-text-primary">
                    {dictionary.components.coachingSessionCard.toBeDefinedMessage}
                </p>
            </div>
        );
    }

    // All other session statuses with defined creators and scheduling
    // TypeScript ensures all required props are present based on the specific status
    return (
        <div className="flex flex-col justify-center md:p-4 p-2 gap-3 rounded-medium border border-card-stroke bg-card-fill w-auto">
            <div className="flex gap-4 items-center justify-between">
                <p title={props.title} className="text-md text-text-primary font-bold leading-[120%] line-clamp-2">
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
            {props.status === 'ended' && props.hasReview && props.rating && props.rating > 0 && (
                <ReviewCardGroupOverview
                    type="student-review"
                    reviewText={props.reviewText}
                    rating={props.rating}
                    totalReviews={props.totalReviews}
                    averageRating={props.averageRating}
                    onClickReadReviews={props.onClickReadReviews}
                    locale={props.locale}
                />
            )}
            <CourseCreatorGroupOverview
                withinCourse={props.withinCourse}
                userRole="student"
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
            <StudentActionGroupOverview {...props} />
        </div>
    );
};