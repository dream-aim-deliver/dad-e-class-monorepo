import { TLocale } from '@maany_shr/e-class-translations';
import { CoachingSessionOverviewCoach } from './coach-coaching-session/coaching-session-overview-coach';
import { CoachingSessionOverviewStudent } from './student-coaching-session/coaching-session-overview-student';
import { UserType } from './coaching-sessions';

export interface CoachingSessionOverviewProps {
  locale: TLocale;
  userType: UserType;
  status:
    | 'ongoing'
    | 'upcoming-editable'
    | 'upcoming-locked'
    | 'ended'
    | 'requested'
    | 'rescheduled'
    | 'canceled';
  title: string;
  duration: number;
  date: Date;
  time: string;
  courseName?: string;
  courseImageUrl?: string;
  groupName?: string;
  reviewText?: string;
  rating?: number;
  callQualityRating?: number;
  meetingLink?: string;
  isRecordingDownloading?: boolean;
  hoursLeftToEdit?: number;
  onClickCourse?: () => void;
  onClickGroup?: () => void;
  onClickJoinMeeting?: () => void;
  onClickReschedule?: () => void;
  onClickCancel?: () => void;
  onClickDownloadRecording?: () => void;
  onClickDecline?: () => void;
  onClickAccept?: () => void;
  onClickSuggestAnotherDate?: () => void;
  studentName?: string;
  studentImageUrl?: string;
  onClickStudent?: () => void;
  onClickRateCallQuality?: () => void;
  creatorName?: string;
  creatorImageUrl?: string;
  onClickCreator?: () => void;
  onClickReviewCoachingSession?: () => void;
}

/**
 * CoachingSessionOverview component for displaying coaching session details.
 *
 * This component dynamically renders the coaching session overview based on the user's role (coach or student).
 * It also validates required fields depending on the user type.
 *
 * @param locale - The locale for translation and localization purposes.
 * @param userType - Defines whether the user is a 'coach' or 'student'.
 * @param status - The current status of the coaching session.
 * @param title - The title of the coaching session.
 * @param duration - The duration of the session in minutes.
 * @param date - The date of the session.
 * @param time - The time of the session.
 * @param courseName - (Optional) Name of the course associated with the session.
 * @param courseImageUrl - (Optional) URL of the course image.
 * @param groupName - (Optional) Name of the group associated with the session.
 * @param reviewText - (Optional) Review text left for the session.
 * @param rating - (Optional) Rating given to the session (out of 5 stars).
 * @param callQualityRating - (Optional) Rating for call quality (out of 5 stars).
 * @param meetingLink - (Optional) Link to join the coaching session meeting.
 * @param isRecordingDownloading - (Optional) Indicates if the recording is being downloaded.
 * @param hoursLeftToEdit - (Optional) Number of hours left to edit the session details.
 * @param onClickCourse - (Optional) Callback for clicking the course name.
 * @param onClickGroup - (Optional) Callback for clicking the group name.
 * @param onClickJoinMeeting - (Optional) Callback for joining the meeting.
 * @param onClickReschedule - (Optional) Callback for rescheduling the session.
 * @param onClickCancel - (Optional) Callback for canceling the session.
 * @param onClickDownloadRecording - (Optional) Callback for downloading the session recording.
 * @param onClickDecline - (Optional) Callback for declining the session request.
 * @param onClickAccept - (Optional) Callback for accepting the session request.
 * @param onClickSuggestAnotherDate - (Optional) Callback for suggesting another date for the session.
 * @param studentName - (Optional) Name of the student (required if userType is 'coach').
 * @param studentImageUrl - (Optional) Image URL of the student (required if userType is 'coach').
 * @param onClickStudent - (Optional) Callback for clicking on the student's profile.
 * @param onClickRateCallQuality - (Optional) Callback for rating call quality.
 * @param creatorName - (Optional) Name of the session creator (required if userType is 'student').
 * @param creatorImageUrl - (Optional) Image URL of the session creator (required if userType is 'student').
 * @param onClickCreator - (Optional) Callback for clicking on the creator's profile.
 * @param onClickReviewCoachingSession - (Optional) Callback for reviewing the coaching session.
 *
 * @example
 * <CoachingSessionOverview
 *   locale="en"
 *   userType="coach"
 *   status="ongoing"
 *   title="Advanced JavaScript Coaching"
 *   duration={60}
 *   date={new Date()}
 *   time="10:00 AM"
 *   studentName="John Doe"
 *   studentImageUrl="https://example.com/john-doe.jpg"
 *   onClickJoinMeeting={() => console.log('Joining meeting')}
 * />
 *
 * @example
 * <CoachingSessionOverview
 *   locale="es"
 *   userType="student"
 *   status="upcoming-editable"
 *   title="React Basics"
 *   duration={45}
 *   date={new Date()}
 *   time="2:00 PM"
 *   creatorName="Jane Smith"
 *   creatorImageUrl="https://example.com/jane-smith.jpg"
 *   onClickReschedule={() => console.log('Rescheduling session')}
 * />
 */

export const CoachingSessionOverview: React.FC<CoachingSessionOverviewProps> = (
  props,
) => {
  const coachingSessionComponent = {
    coach: {
      validate: () => {
        if (!props.studentName) {
          return {
            isValid: false,
            errorMessage: 'Student Name is required',
          };
        }
        return { isValid: true };
      },

      render: () => (
        <CoachingSessionOverviewCoach
          {...props}
          studentName={props.studentName}
        />
      ),
    },

    student: {
      validate: () => {
        if (!props.creatorName) {
          return {
            isValid: false,
            errorMessage: 'Creator Name is required',
          };
        }
        return { isValid: true };
      },

      render: () => (
        <CoachingSessionOverviewStudent
          {...props}
          creatorName={props.creatorName}
        />
      ),
    },
  };

  const coachingSessionConfig = coachingSessionComponent[props.userType];

  // Validate props for the selected card type
  const validation = coachingSessionConfig.validate();
  if (!validation.isValid) {
    console.error(validation.errorMessage);
    return (
      <div className="error-message">
        <h3>Unable to display coaching session</h3>
        <p>{validation.errorMessage}</p>
      </div>
    );
  }
  return <div>{coachingSessionConfig.render()}</div>;
};
