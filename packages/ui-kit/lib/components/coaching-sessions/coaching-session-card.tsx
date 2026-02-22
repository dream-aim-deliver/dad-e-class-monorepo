import { TLocale } from '@maany_shr/e-class-translations';
import { CoachCoachingSessionCard } from './coach-coaching-session/coach-coaching-session-card';
import { StudentCoachingSessionCard } from './student-coaching-session/student-coaching-session-card';

/**
 * Base properties shared across all coaching session card variants.
 * Contains common fields like locale, session details, and optional course information.
 */
interface BaseCardSharedProps {
    locale: TLocale;
    title: string;
    duration: number;
    date: Date;
    startTime: string;
    endTime: string;
    courseName?: string;
    courseImageUrl?: string;
    onClickCourse?: () => void;
}

/**
 * Props specific to individual (1:1) student sessions from coach perspective.
 */
interface CoachStudentSessionProps {
    sessionType: 'student';
    studentName: string;
    studentImageUrl: string;
    onClickStudent: () => void;
    groupName?: string;
    onClickGroup?: () => void;
}

/**
 * Props specific to group sessions from coach perspective.
 */
interface CoachGroupSessionProps {
    sessionType: 'group';
    groupName: string;
    onClickGroup: () => void;
    studentName?: never;
    studentImageUrl?: never;
    onClickStudent?: never;
}

/**
 * Union type for session type discrimination in coach cards.
 */
type CoachSessionTypeProps = CoachStudentSessionProps | CoachGroupSessionProps;

// =============================================================================
// STUDENT CARD TYPES (unchanged - students only see 1:1 sessions)
// =============================================================================

/**
 * Student coaching session card for ongoing sessions.
 * Displays session currently in progress with join meeting functionality.
 */
type StudentOngoingCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'ongoing';
    creatorName: string;
    creatorImageUrl: string;
    meetingLink?: string;
    onClickCreator: () => void;
    onClickJoinMeeting: () => void;
    groupName?: string;
    onClickGroup?: () => void;
};

/**
 * Student coaching session card for upcoming sessions that can still be modified.
 * Shows remaining time to edit and provides reschedule/cancel options.
 */
type StudentUpcomingEditableCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'upcoming-editable';
    hoursLeftToEdit: number;
    /** Minutes remaining when hoursLeftToEdit is 0. If provided and hours is 0, shows minutes instead */
    minutesLeftToEdit?: number;
    creatorName: string;
    creatorImageUrl: string;
    onClickCreator: () => void;
    /** Optional reschedule handler. If not provided, the reschedule button won't render */
    onClickReschedule?: () => void;
    /** Optional cancel handler. If not provided, the cancel button won't render (e.g. group sessions) */
    onClickCancel?: () => void;
    groupName?: string;
    onClickGroup?: () => void;
};

/**
 * Student coaching session card for upcoming sessions that cannot be modified.
 * Session is locked from editing but allows joining when time comes.
 */
type StudentUpcomingLockedCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'upcoming-locked';
    creatorName: string;
    creatorImageUrl: string;
    meetingLink?: string;
    onClickCreator: () => void;
    onClickJoinMeeting: () => void;
    groupName?: string;
    onClickGroup?: () => void;
};

/**
 * Student coaching session card for completed sessions without a review.
 * Provides options to review the session and download recording.
 */
type StudentEndedWithoutReviewCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'ended';
    hasReview: false;
    creatorName: string;
    creatorImageUrl: string;
    onClickCreator: () => void;
    onClickReviewCoachingSession: () => void;
    onClickDownloadRecording: () => void;
    isRecordingDownloading: boolean;
    groupName?: string;
    onClickGroup?: () => void;
};

/**
 * Student coaching session card for completed sessions with an existing review.
 * Displays the review content and rating, with recording download option.
 */
type StudentEndedWithReviewCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'ended';
    hasReview: true;
    reviewText: string;
    rating: number;
    creatorName: string;
    creatorImageUrl: string;
    onClickCreator: () => void;
    onClickDownloadRecording: () => void;
    isRecordingDownloading: boolean;
    groupName?: string;
    onClickGroup?: () => void;
};

/**
 * Student coaching session card for sessions with pending approval.
 * Shows session request awaiting coach confirmation with cancel option.
 */
type StudentRequestedCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'requested';
    creatorName: string;
    creatorImageUrl: string;
    onClickCreator: () => void;
    /** Optional cancel handler. If not provided, the cancel button won't render (e.g. group sessions) */
    onClickCancel?: () => void;
    groupName?: string;
    onClickGroup?: () => void;
};

/**
 * Student coaching session card for sessions that have been rescheduled by the coach.
 * Shows original and new times with options to accept, decline, or suggest alternative.
 */
type StudentRescheduledCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'rescheduled';
    previousDate: Date;
    previousStartTime: string;
    previousEndTime: string;
    creatorName: string;
    creatorImageUrl: string;
    onClickCreator: () => void;
    onClickAccept: () => void;
    onClickDecline: () => void;
    onClickSuggestAnotherDate: () => void;
    groupName?: string;
    onClickGroup?: () => void;
};

/**
 * Student coaching session card for canceled sessions.
 * Displays session that has been canceled by either party.
 */
type StudentCanceledCard = BaseCardSharedProps & {
    userType: 'student';
    status: 'canceled';
    creatorName: string;
    creatorImageUrl: string;
    onClickCreator: () => void;
    groupName?: string;
    onClickGroup?: () => void;
};

/**
 * Student coaching session card for sessions with undefined scheduling.
 * Used when session details are not yet finalized or confirmed.
 */
type StudentToBeDefinedCard = {
    userType: 'student';
    status: 'to-be-defined';
    locale: TLocale;
    title: string;
    duration: number;
};

// =============================================================================
// COACH CARD TYPES (with sessionType discriminated union)
// =============================================================================

/**
 * Coach coaching session card for ongoing sessions.
 * Displays session currently in progress from coach perspective with join meeting functionality.
 */
type CoachOngoingCard = BaseCardSharedProps & CoachSessionTypeProps & {
    userType: 'coach';
    status: 'ongoing';
    meetingLink?: string;
    onClickJoinMeeting: () => void;
    onClickCancel?: () => void;
};

/**
 * Coach coaching session card for upcoming sessions that can still be modified.
 * Shows remaining time to edit and provides reschedule/cancel options from coach perspective.
 */
type CoachUpcomingEditableCard = BaseCardSharedProps & CoachSessionTypeProps & {
    userType: 'coach';
    status: 'upcoming-editable';
    hoursLeftToEdit: number;
    /** Minutes remaining when hoursLeftToEdit is 0. If provided and hours is 0, shows minutes instead */
    minutesLeftToEdit?: number;
    onClickCancel: () => void;
};

/**
 * Coach coaching session card for upcoming sessions that cannot be modified.
 * Session is locked from editing but allows joining when time comes from coach perspective.
 */
type CoachUpcomingLockedCard = BaseCardSharedProps & CoachSessionTypeProps & {
    userType: 'coach';
    status: 'upcoming-locked';
    meetingLink?: string;
    onClickJoinMeeting: () => void;
};

/**
 * Coach coaching session card for completed sessions with student review.
 * Displays the session review from student with rating functionality for coach.
 */
type CoachEndedSessionReviewCard = BaseCardSharedProps & CoachSessionTypeProps & {
    userType: 'coach';
    status: 'ended';
    reviewType: 'session-review';
    reviewText: string;
    rating: number;
    onClickRateCallQuality: () => void;
    onClickDownloadRecording: () => void;
};

/**
 * Coach coaching session card for completed sessions with call quality rating.
 * Shows the call quality rating with recording download functionality.
 */
type CoachEndedCallQualityCard = BaseCardSharedProps & CoachSessionTypeProps & {
    userType: 'coach';
    status: 'ended';
    reviewType: 'call-quality';
    callQualityRating: number;
    onClickDownloadRecording: () => void;
    isRecordingDownloading: boolean;
};

/**
 * Coach coaching session card for completed sessions without a student review.
 * Shows download recording option for sessions that haven't been reviewed yet.
 */
type CoachEndedWithoutReviewCard = BaseCardSharedProps & CoachSessionTypeProps & {
    userType: 'coach';
    status: 'ended';
    reviewType: 'no-review';
    onClickDownloadRecording: () => void;
    isRecordingDownloading: boolean;
};

/**
 * Coach coaching session card for sessions with pending approval from coach.
 * Shows student request awaiting coach's decision with accept/decline/reschedule options.
 */
type CoachRequestedCard = BaseCardSharedProps & CoachSessionTypeProps & {
    userType: 'coach';
    status: 'requested';
    onClickAccept: () => void;
    onClickDecline: () => void;
};

/**
 * Coach coaching session card for sessions that have been rescheduled by the student.
 * Shows original and new times with options to accept, decline, or suggest alternative from coach perspective.
 */
type CoachRescheduledCard = BaseCardSharedProps & CoachSessionTypeProps & {
    userType: 'coach';
    status: 'rescheduled';
    previousDate: Date;
    previousStartTime: string;
    previousEndTime: string;
    onClickAccept: () => void;
    onClickDecline: () => void;
};

/**
 * Coach coaching session card for canceled sessions.
 * Displays session that has been canceled by either party from coach perspective.
 */
type CoachCanceledCard = BaseCardSharedProps & CoachSessionTypeProps & {
    userType: 'coach';
    status: 'canceled';
};

/**
 * Discriminated union type representing all possible coaching session card configurations.
 * This serves as the single source of truth for all card-related component props,
 * ensuring type safety across student and coach variants with different statuses.
 */
export type CoachingSessionCardProps =
    | StudentOngoingCard
    | StudentUpcomingEditableCard
    | StudentUpcomingLockedCard
    | StudentEndedWithoutReviewCard
    | StudentEndedWithReviewCard
    | StudentRequestedCard
    | StudentRescheduledCard
    | StudentCanceledCard
    | StudentToBeDefinedCard
    | CoachOngoingCard
    | CoachUpcomingEditableCard
    | CoachUpcomingLockedCard
    | CoachEndedSessionReviewCard
    | CoachEndedCallQualityCard
    | CoachEndedWithoutReviewCard
    | CoachRequestedCard
    | CoachRescheduledCard
    | CoachCanceledCard;

/**
 * Central coaching session card component that routes props to appropriate sub-components.
 * Uses discriminated union pattern to determine whether to render student or coach variant
 * based on the userType property, ensuring type safety and proper component delegation.
 *
 * @param props Discriminated union props that determine the specific card variant to render
 *
 * @example
 * // Student ongoing session
 * <CoachingSessionCard
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
 * @example
 * // Coach requested session (student type)
 * <CoachingSessionCard
 *   userType="coach"
 *   status="requested"
 *   sessionType="student"
 *   title="JavaScript Fundamentals"
 *   duration={45}
 *   date={new Date()}
 *   startTime="14:00"
 *   endTime="14:45"
 *   studentName="Jane Smith"
 *   studentImageUrl="student.jpg"
 *   onClickStudent={() => console.log("Student clicked")}
 *   onClickAccept={() => console.log("Accept request")}
 *   onClickDecline={() => console.log("Decline request")}
 *   locale="en"
 * />
 *
 * @example
 * // Coach requested session (group type)
 * <CoachingSessionCard
 *   userType="coach"
 *   status="requested"
 *   sessionType="group"
 *   title="Group Session"
 *   duration={60}
 *   date={new Date()}
 *   startTime="10:00"
 *   endTime="11:00"
 *   groupName="Advanced Python Group"
 *   onClickGroup={() => console.log("Group clicked")}
 *   onClickAccept={() => console.log("Accept request")}
 *   onClickDecline={() => console.log("Decline request")}
 *   locale="en"
 * />
 */
export const CoachingSessionCard: React.FC<CoachingSessionCardProps> = (props) => {
    if (props.userType === 'student') {
        return <StudentCoachingSessionCard {...props} />;
    }
    if (props.userType === 'coach') {
        return <CoachCoachingSessionCard {...props} />;
    }
    // Should never happen if types are correct
    console.error(`Invalid userType: ${(props as { userType?: string }).userType}`);
    return null;
};
