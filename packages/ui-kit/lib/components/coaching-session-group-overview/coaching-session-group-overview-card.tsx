import { TLocale } from '@maany_shr/e-class-translations';
import { CoachCoachingSessionGroupOverviewCard } from './coach-coaching-session-group-overview/coach-coaching-session-group-overview-card';
import { StudentCoachingSessionGroupOverviewCard } from './student-coaching-session-group-overview/student-coaching-session-group-overview-card';

/**
 * Base properties shared across all coaching session group overview card variants.
 * Contains common fields like locale, session details, and optional course/group information.
 */
interface BaseCardSharedProps {
    locale: TLocale;
    title: string;
    duration: number;
    date: Date;
    startTime: string;
    endTime: string;
    withinCourse: boolean;
    courseName?: string;
    courseImageUrl?: string;
    groupName?: string;
    creatorName?: string;
    creatorImageUrl?: string;
    onClickCourse?: () => void;
    onClickGroup?: () => void;
    onClickCreator?: () => void;
}

/**
 * Student coaching session group overview card for ongoing sessions.
 * Displays session currently in progress with join meeting functionality.
 */
type StudentOngoingCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'ongoing';
    meetingLink: string;
    onClickJoinMeeting: () => void;
};

/**
 * Student coaching session group overview card for upcoming sessions that can still be modified.
 * Shows remaining time to edit and provides reschedule/cancel options.
 */
type StudentUpcomingEditableCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'upcoming-editable';
    hoursLeftToEdit: number;
    onClickReschedule: () => void;
    onClickCancel: () => void;
};

/**
 * Student coaching session group overview card for upcoming sessions that cannot be modified.
 * Session is locked from editing but allows joining when time comes.
 */
type StudentUpcomingLockedCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'upcoming-locked';
    onClickJoinMeeting: () => void;
};

/**
 * Student coaching session group overview card for completed sessions without a review.
 * Provides options to review the session and download recording.
 */
type StudentEndedWithoutReviewCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'ended';
    hasReview: false;
    onClickReviewCoachingSession: () => void;
    onClickDownloadRecording: () => void;
    isRecordingDownloading: boolean;
};

/**
 * Student coaching session group overview card for completed sessions with an existing review.
 * Displays the review content and rating, with recording download option.
 */
type StudentEndedWithReviewCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'ended';
    hasReview: true;
    reviewText: string;
    rating: number;
    totalReviews?: number;
    averageRating?: number;
    onClickReadReviews?: () => void;
    onClickDownloadRecording: () => void;
    isRecordingDownloading: boolean;
};

/**
 * Student coaching session group overview card for canceled sessions.
 * Displays session that has been canceled by either party.
 */
type StudentCanceledCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'canceled';
};

/**
 * Student coaching session group overview card for sessions with undefined scheduling.
 * Used when session details are not yet finalized or confirmed.
 */
type StudentUnscheduledCard = {
    userType: 'student';
    status: 'unscheduled';
    locale: TLocale;
    title: string;
    duration: number;
    withinCourse: boolean;
};

/**
 * Coach coaching session group overview card for ongoing sessions.
 * Displays session currently in progress from coach perspective with join meeting functionality.
 */
type CoachOngoingCard = BaseCardSharedProps & {
    userType: 'coach';
    status: 'ongoing';
    meetingLink: string;
    onClickJoinMeeting: () => void;
};

/**
 * Coach coaching session group overview card for upcoming sessions that can still be modified.
 * Shows remaining time to edit and provides reschedule/cancel options from coach perspective.
 */
type CoachUpcomingEditableCard = BaseCardSharedProps & {
    userType: 'coach';
    status: 'upcoming-editable';
    hoursLeftToEdit: number;
    onClickReschedule: () => void;
    onClickCancel: () => void;
};

/**
 * Coach coaching session group overview card for upcoming sessions that cannot be modified.
 * Session is locked from editing but allows joining when time comes from coach perspective.
 */
type CoachUpcomingLockedCard = BaseCardSharedProps & {
    userType: 'coach';
    status: 'upcoming-locked';
    onClickJoinMeeting: () => void;
};

/**
 * Coach coaching session group overview card for completed sessions with student review.
 * Displays the session review from student with rating functionality for coach.
 */
type CoachEndedSessionReviewCard = BaseCardSharedProps & {
    userType: 'coach';
    status: 'ended';
    reviewType: 'session-review';
    reviewText: string;
    rating: number;
    totalReviews?: number;
    averageRating?: number;
    onClickReadReviews?: () => void;
    onClickRateCallQuality: () => void;
    onClickDownloadRecording: () => void;
};

/**
 * Coach coaching session group overview card for completed sessions with call quality rating.
 * Shows the call quality rating with recording download functionality.
 */
type CoachEndedCallQualityCard = BaseCardSharedProps & {
    userType: 'coach';
    status: 'ended';
    reviewType: 'call-quality';
    callQualityRating: number;
    onClickDownloadRecording: () => void;
    isRecordingDownloading: boolean;
};

/**
 * Coach coaching session group overview card for canceled sessions.
 * Displays session that has been canceled by either party from coach perspective.
 */
type CoachCanceledCard = BaseCardSharedProps & {
    userType: 'coach';
    status: 'canceled';
};

/**
 * Coach coaching session group overview card for sessions with undefined scheduling.
 * Used when session details are not yet finalized or confirmed from coach perspective.
 */
type CoachUnscheduledCard = {
    userType: 'coach';
    status: 'unscheduled';
    locale: TLocale;
    title: string;
    duration: number;
    withinCourse: boolean;
    courseName?: string;
    courseImageUrl?: string;
    groupName?: string;
    creatorName?: string;
    creatorImageUrl?: string;
    onClickCourse?: () => void;
    onClickGroup?: () => void;
    onClickCreator?: () => void;
    onClickScheduleSession: () => void;
};

/**
 * Discriminated union type representing all possible coaching session group overview card configurations.
 * This serves as the single source of truth for all card-related component props,
 * ensuring type safety across student and coach variants with different statuses.
 */
export type CoachingSessionGroupOverviewCardProps =
    | StudentOngoingCard
    | StudentUpcomingEditableCard
    | StudentUpcomingLockedCard
    | StudentEndedWithoutReviewCard
    | StudentEndedWithReviewCard
    | StudentCanceledCard
    | StudentUnscheduledCard
    | CoachOngoingCard
    | CoachUpcomingEditableCard
    | CoachUpcomingLockedCard
    | CoachEndedSessionReviewCard
    | CoachEndedCallQualityCard
    | CoachCanceledCard
    | CoachUnscheduledCard;

/**
 * Central coaching session group overview card component that routes props to appropriate sub-components.
 * Uses discriminated union pattern to determine whether to render student or coach variant
 * based on the userType property, ensuring type safety and proper component delegation.
 *
 * @param props Discriminated union props that determine the specific card variant to render
 *
 * @example
 * // Student ongoing session
 * <CoachingSessionGroupOverviewCard
 *   userType="student"
 *   status="ongoing"
 *   title="Advanced React Patterns"
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

 */
export const CoachingSessionGroupOverviewCard: React.FC<CoachingSessionGroupOverviewCardProps> = (props) => {
    if (props.userType === 'student') {
        return <StudentCoachingSessionGroupOverviewCard {...props} />;
    }
    if (props.userType === 'coach') {
        return <CoachCoachingSessionGroupOverviewCard {...props} />;
    }
    // Should never happen if types are correct
    console.error(`Invalid userType: ${(props as { userType?: string }).userType}`);
    return null;
};