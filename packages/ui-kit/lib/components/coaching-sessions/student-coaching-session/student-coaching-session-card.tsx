import React from 'react';
import { getDictionary } from '@maany_shr/e-class-translations';
import { DateAndTime } from '../date-and-time';
import { CourseCreator } from '../course-creator';
import { StudentAction } from './student-action';
import { ReviewCard } from '../review-card';
import { IconCalendarAlt } from '../../icons/icon-calendar-alt';
import { IconClock } from '../../icons/icon-clock';
import { CoachingSessionCardProps } from '../coaching-session-card';

/**
 * Type definition for student coaching session card props extracted from the central discriminated union.
 * This ensures only student-specific props are available for this component, providing type safety
 * and preventing invalid prop combinations.
 */
export type StudentCoachingSessionCardProps = Extract<CoachingSessionCardProps, { userType: 'student' }>;

/**
 * Student coaching session card component that displays coaching session details from a student's perspective.
 * This component handles all possible student session states including ongoing, upcoming, ended, requested,
 * rescheduled, canceled, and to-be-defined sessions. Each state displays relevant information and actions
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
 * <StudentCoachingSessionCard
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
 * <StudentCoachingSessionCard
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
 * // To-be-defined session
 * <StudentCoachingSessionCard
 *   userType="student"
 *   status="to-be-defined"
 *   title="Python Basics"
 *   duration={30}
 *   locale="en"
 * />
 */
export const StudentCoachingSessionCard: React.FC<StudentCoachingSessionCardProps> = (props) => {
    const dictionary = getDictionary(props.locale);

    // Special case for sessions with undefined scheduling
    // These sessions don't have finalized date/time or creator assignments
    if (props.status === 'to-be-defined') {
        return (
            <div className="flex flex-col md:p-4 p-2 gap-3 rounded-medium border border-card-stroke bg-card-fill w-auto">
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
                <p className="text-md text-text-primary">
                    {dictionary.components.coachingSessionCard.toBeDefinedMessage}
                </p>
            </div>
        );
    }

    // All other session statuses with defined creators and scheduling
    // TypeScript ensures all required props are present based on the specific status
    return (
        <div className="flex flex-col md:p-4 p-2 gap-3 rounded-medium border border-card-stroke bg-card-fill w-auto">
            <div className="flex gap-4 items-center justify-between">
                <p title={props.title} className="text-md text-text-primary font-bold leading-[120%] line-clamp-2">
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
            {props.status === 'ended' && props.hasReview && props.rating && props.rating > 0 && (
                <ReviewCard
                    type="student-review"
                    reviewText={props.reviewText}
                    rating={props.rating}
                    locale={props.locale}
                />
            )}
            <CourseCreator
                sessionType="student"
                creatorName={props.creatorName}
                creatorImageUrl={props.creatorImageUrl}
                courseName={props.courseName}
                courseImageUrl={props.courseImageUrl}
                groupName={props.groupName}
                userRole="student"
                onClickCourse={props.onClickCourse}
                onClickCreator={props.onClickCreator}
                onClickGroup={props.onClickGroup}
                locale={props.locale}
            />
            <div className="mt-auto">
                <StudentAction {...props} />
            </div>
        </div>
    );
};