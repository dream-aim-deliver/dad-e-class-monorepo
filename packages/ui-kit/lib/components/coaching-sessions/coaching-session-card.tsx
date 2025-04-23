import { TLocale } from '@maany_shr/e-class-translations';
import { TRole } from 'packages/models/src/role';
import { CoachCoachingSessionCard } from './coach-coaching-session/coach-coaching-session-card';
import { StudentCoachingSessionCard } from './student-coaching-session/student-coaching-session-card';

export interface CoachingSessionCardProps {
  locale: TLocale;
  userType: Exclude<TRole, 'admin' | 'visitor'>;
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
 * CoachingSessionCard component for displaying coaching session details.
 *
 * This component dynamically renders the coaching session Card based on the user's role (coach or student).
 * It also validates required fields depending on the user type.
 *
 * @param locale - The locale for translation and localization purposes.
 * @param userType - Defines whether the user is a 'coach' or 'student'.
 * @param status - The current status of the coaching session.
 * @param title - The title of the coaching session.
 * @param duration - The duration of the session in minutes.
 * @param date - The date of the session.
 * @param previousDate - (Optional) The previous date of the session.
 * @param startTime - The start time of the session.
 * @param endTime - The end time of the session.
 * @param previousStartTime - (Optional) The previous start time of the session.
 * @param previousEndTime - (Optional) The previous end time of the session.
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
 * <CoachingSessionCard
 *   locale="en"
 *   userType="coach"
 *   status="ongoing"
 *   title="Advanced JavaScript Coaching"
 *   duration={60}
 *   date={new Date()}
 *   previousDate={new Date(new Date().getTime() - 24 * 60 * 60 * 1000)}
 *   time="10:00 AM"
 *   previousTime="9:00 AM"
 *   studentName="John Doe"
 *   studentImageUrl="https://example.com/john-doe.jpg"
 *   onClickJoinMeeting={() => console.log('Joining meeting')}
 * />
 *
 * @example
 * <CoachingSessionCard
 *   locale="es"
 *   userType="student"
 *   status="upcoming-editable"
 *   title="React Basics"
 *   duration={45}
 *   date={new Date()}
 *   startTime="10:00 AM"
 *   endTime="11:00 AM"
 *   creatorName="Jane Smith"
 *   creatorImageUrl="https://example.com/jane-smith.jpg"
 *   onClickReschedule={() => console.log('Rescheduling session')}
 * />
 */

export const CoachingSessionCard: React.FC<CoachingSessionCardProps> = (
  props,
) => {
  const coachingSessionComponent = {
    coach: {
      render: () => {
        if (!props.studentName) {
          console.error('Student Name is required for coach view');
          return null;
        }
        return <CoachCoachingSessionCard {...props} studentName={props.studentName} />;
      },
    },

    student: {
      render: () => {
        if (!props.creatorName) {
          console.error('Creator Name is required for student view');
          return null;
        }
        return <StudentCoachingSessionCard {...props} creatorName={props.creatorName} />;
      },
    },
  };

  const coachingSessionConfig = coachingSessionComponent[props.userType];

  if (!coachingSessionConfig) {
    console.error(`Invalid userType: ${props.userType}`);
    return null;
  }

  return <div>{coachingSessionConfig.render()}</div>;
};

