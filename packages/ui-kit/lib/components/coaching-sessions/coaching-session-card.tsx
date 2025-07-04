import { TLocale } from '@maany_shr/e-class-translations';
import { TRole } from 'packages/models/src/role';
import { CoachCoachingSessionCard } from './coach-coaching-session/coach-coaching-session-card';
import { StudentCoachingSessionCard } from './student-coaching-session/student-coaching-session-card';

interface SharedCoachingSessionCardProps {
    locale: TLocale;
    userType: Exclude<TRole, 'admin' | 'visitor'>;
    title: string;
    duration: number;
    date: Date;
    previousDate?: Date;
    startTime: string;
    endTime: string;
    previousStartTime?: string;
    previousEndTime?: string;
    courseName?: string;
    courseImageUrl?: string;
    groupName?: string;
    reviewText?: string;
    rating?: number;
    callQualityRating?: number;
    meetingLink?: string;
    isRecordingDownloading?: boolean;
    hoursLeftToEdit?: number;
    creatorName: string;
    creatorImageUrl?: string;
    studentName: string;
    studentImageUrl?: string;
    onClickStudent?: () => void;
    onClickCreator?: () => void;
    onClickCourse?: () => void;
    onClickGroup?: () => void;
    onClickJoinMeeting?: () => void;
    onClickReschedule?: () => void;
    onClickCancel?: () => void;
    onClickDownloadRecording?: () => void;
    onClickDecline?: () => void;
    onClickAccept?: () => void;
    onClickSuggestAnotherDate?: () => void;
    onClickReviewCoachingSession?: () => void;
    onClickRateCallQuality?: () => void;
}

export interface CoachCoachingSessionCardProps
    extends SharedCoachingSessionCardProps {
    userType: 'coach';
    status:
        | 'ongoing'
        | 'upcoming-editable'
        | 'upcoming-locked'
        | 'ended'
        | 'requested'
        | 'rescheduled'
        | 'canceled';
}

export interface StudentCoachingSessionCardProps
    extends SharedCoachingSessionCardProps {
    userType: 'student';
    status:
        | 'ongoing'
        | 'upcoming-editable'
        | 'upcoming-locked'
        | 'ended'
        | 'requested'
        | 'rescheduled'
        | 'canceled'
        | 'to-be-defined';
}

export type CoachingSessionCardProps =
    | CoachCoachingSessionCardProps
    | StudentCoachingSessionCardProps;

/**
 * CoachingSessionCard component for displaying coaching session details.
 *
 * This component dynamically renders a session card depending on the user's role (`coach` or `student`),
 * adapting its display and required fields accordingly.
 *
 * @param locale - The locale for translation and localization (e.g., 'en', 'de').
 * @param userType - Role of the user viewing the card. Can be 'coach' or 'student'.
 * @param status - The current status of the session.
 *  - For **coach**: 'ongoing' | 'upcoming-editable' | 'upcoming-locked' | 'ended' | 'requested' | 'rescheduled' | 'canceled'
 *  - For **student**: Same as above, plus 'to-be-defined'
 * @param title - Title of the coaching session.
 * @param duration - Duration of the session in minutes.
 * @param date - Scheduled date of the session.
 * @param previousDate - (Optional) Previous date if the session was rescheduled.
 * @param startTime - Start time of the session (formatted string).
 * @param endTime - End time of the session (formatted string).
 * @param previousStartTime - (Optional) Previous start time if the session was rescheduled.
 * @param previousEndTime - (Optional) Previous end time if the session was rescheduled.
 * @param courseName - (Optional) Name of the associated course.
 * @param courseImageUrl - (Optional) Image URL for the course.
 * @param groupName - (Optional) Name of the group associated with the session.
 * @param reviewText - (Optional) Review message provided by the student or coach.
 * @param rating - (Optional) Session rating (0 to 5 stars).
 * @param callQualityRating - (Optional) Call quality rating (0 to 5 stars).
 * @param meetingLink - (Optional) Link to join the session.
 * @param isRecordingDownloading - (Optional) Indicates whether the recording is currently downloading.
 * @param hoursLeftToEdit - (Optional) Number of hours remaining to edit the session.
 *
 * @param creatorName - Required if userType is 'student'. Name of the session creator (usually the coach).
 * @param creatorImageUrl - (Optional) Image URL for the creator.
 * @param studentName - Required if userType is 'coach'. Name of the student attending the session.
 * @param studentImageUrl - (Optional) Image URL for the student.
 *
 * @param onClickStudent - (Optional) Callback for when the student name/image is clicked.
 * @param onClickCreator - (Optional) Callback for when the creator name/image is clicked.
 * @param onClickCourse - (Optional) Callback for when the course is clicked.
 * @param onClickGroup - (Optional) Callback for when the group is clicked.
 * @param onClickJoinMeeting - (Optional) Callback for joining the meeting.
 * @param onClickReschedule - (Optional) Callback for rescheduling the session.
 * @param onClickCancel - (Optional) Callback for canceling the session.
 * @param onClickDownloadRecording - (Optional) Callback for downloading the session recording.
 * @param onClickDecline - (Optional) Callback for declining a rescheduled session.
 * @param onClickAccept - (Optional) Callback for accepting a rescheduled session.
 * @param onClickSuggestAnotherDate - (Optional) Callback to suggest another session date.
 * @param onClickReviewCoachingSession - (Optional) Callback for reviewing the session.
 * @param onClickRateCallQuality - (Optional) Callback for rating the call quality.
 *
 * @example
 * <CoachingSessionCard
 *   locale="en"
 *   userType="coach"
 *   status="ongoing"
 *   title="Advanced JavaScript"
 *   duration={60}
 *   date={new Date()}
 *   startTime="10:00 AM"
 *   endTime="11:00 AM"
 *   studentName="John Doe"
 *   studentImageUrl="https://example.com/john.jpg"
 *   onClickJoinMeeting={() => console.log('Joining session')}
 * />
 *
 * @example
 * <CoachingSessionCard
 *   locale="es"
 *   userType="student"
 *   status="to-be-defined"
 *   title="React Basics"
 *   duration={45}
 *   date={new Date()}
 *   startTime="4:00 PM"
 *   endTime="4:45 PM"
 *   creatorName="Jane Smith"
 *   creatorImageUrl="https://example.com/jane.jpg"
 *   onClickReschedule={() => console.log('Rescheduling...')}
 * />
 */

export const CoachingSessionCard: React.FC<CoachingSessionCardProps> = (
    props,
) => {
    if (props.userType === 'coach') {
        if (!props.studentName) {
            console.error('Student Name is required for coach view');
            return null;
        }
        return <CoachCoachingSessionCard {...props} />;
    }

    if (props.userType === 'student') {
        if (!props.creatorName) {
            console.error('Creator Name is required for student view');
            return null;
        }
        return <StudentCoachingSessionCard {...props} />;
    }

    console.error(
        `Invalid userType: ${(props as CoachingSessionCardProps & { userType?: string }).userType}`,
    );
    return null;
};