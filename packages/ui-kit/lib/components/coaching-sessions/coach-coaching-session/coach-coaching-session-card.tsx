import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { DateAndTime } from '../date-and-time';
import { CourseCreator } from '../course-creator';
import { ReviewCard } from '../review-card';
import { CoachAction } from './coach-action';

export interface CoachCoachingSessionCardProps extends isLocalAware {
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
  studentName: string;
  studentImageUrl?: string;
  courseName?: string;
  courseImageUrl?: string;
  groupName?: string;
  reviewText?: string;
  rating?: number;
  callQualityRating?: number;
  meetingLink?: string;
  isRecordingDownloading?: boolean;
  hoursLeftToEdit?: number;
  onClickStudent?: () => void;
  onClickCourse?: () => void;
  onClickGroup?: () => void;
  onClickJoinMeeting?: () => void;
  onClickReschedule?: () => void;
  onClickCancel?: () => void;
  onClickRateCallQuality?: () => void;
  onClickDownloadRecording?: () => void;
  onClickDecline?: () => void;
  onClickAccept?: () => void;
  onClickSuggestAnotherDate?: () => void;
}

/**
 * CoachCoachingSessionCard component for displaying a coaching session Card for coaches.
 *
 * @param status The current status of the coaching session (e.g., 'ongoing', 'upcoming-editable', 'ended', etc.).
 * @param title The title of the coaching session.
 * @param duration The duration of the session in minutes.
 * @param date The date of the session.
 * @param previousDate (Optional) The previous date of the session.
 * @param startTime The start time of the session.
 * @param endTime The end time of the session.
 * @param previousStartTime (Optional) The previous start time of the session.
 * @param previousEndTime (Optional) The previous end time of the session.
 * @param studentName The name of the student attending the session.
 * @param studentImageUrl (Optional) The image URL of the student.
 * @param courseName (Optional) The name of the related course.
 * @param courseImageUrl (Optional) The image URL of the course.
 * @param groupName (Optional) The group name associated with the session.
 * @param reviewText (Optional) The review text provided for the session.
 * @param rating (Optional) The rating given to the session (out of 5 stars).
 * @param callQualityRating (Optional) The rating given for call quality (out of 5 stars).
 * @param meetingLink (Optional) The link to join the coaching session.
 * @param isRecordingDownloading (Optional) Boolean flag indicating whether a session recording is downloading.
 * @param hoursLeftToEdit (Optional) Hours left to edit session details.
 * @param onClickStudent (Optional) Function to handle clicking the student's profile.
 * @param onClickCourse (Optional) Function to handle clicking the course.
 * @param onClickGroup (Optional) Function to handle clicking the group.
 * @param onClickJoinMeeting (Optional) Function to handle joining the session.
 * @param onClickReschedule (Optional) Function to handle rescheduling the session.
 * @param onClickCancel (Optional) Function to handle canceling the session.
 * @param onClickRateCallQuality (Optional) Function to handle rating the call quality.
 * @param onClickDownloadRecording (Optional) Function to handle downloading session recordings.
 * @param onClickDecline (Optional) Function to handle declining a session request.
 * @param onClickAccept (Optional) Function to handle accepting a session request.
 * @param onClickSuggestAnotherDate (Optional) Function to handle suggesting another date for the session.
 * @param locale The locale for translation and localization purposes.
 *
 * @example
 * <CoachCoachingSessionCard
 *   status="ongoing"
 *   title="Advanced React Workshop"
 *   duration={60}
 *   date={new Date()}
 *   startTime="10.00"
 *   endTime="11.00"
 *   studentName="Jane Doe"
 *   studentImageUrl="https://example.com/avatar.jpg"
 *   locale="en"
 * />
 */

export const CoachCoachingSessionCard: React.FC<
  CoachCoachingSessionCardProps
> = ({
  status,
  title,
  duration,
  date,
  previousDate,
  startTime,
  endTime,
  previousStartTime,
  previousEndTime,
  studentName,
  studentImageUrl,
  courseName,
  courseImageUrl,
  groupName,
  reviewText,
  rating,
  callQualityRating,
  meetingLink,
  isRecordingDownloading,
  hoursLeftToEdit,
  onClickStudent,
  onClickCourse,
  onClickGroup,
  onClickJoinMeeting,
  onClickReschedule,
  onClickCancel,
  onClickRateCallQuality,
  onClickDownloadRecording,
  onClickDecline,
  onClickAccept,
  onClickSuggestAnotherDate,
  locale,
}) => {
    const dictionary = getDictionary(locale);
    return (
      <div
        className={`flex flex-col justify-center md:p-4 p-2 gap-3 rounded-medium border border-card-stroke basis-0 bg-card-fill w-auto max-w-[24rem]`}
      >
        <div className="flex gap-4 items-center justify-between">
          <p title={title} className="text-md text-text-primary font-bold leading-[120%] line-clamp-2">
            {title}
          </p>
          <p className="text-xs text-text-primary font-bold leading-[120%] whitespace-nowrap">
            {duration}
            {dictionary.components.coachingSessionCard.durationText}
          </p>
        </div>
        <DateAndTime
          date={date}
          previousDate={previousDate}
          startTime={startTime}
          endTime={endTime}
          previousStartTime={previousStartTime}
          previousEndTime={previousEndTime}
          hasReview={rating > 0 ? true : false}
        />
        {rating > 0 && (
          <ReviewCard
            reviewText={reviewText}
            rating={rating}
            callQualityRating={callQualityRating}
            locale={locale}
          />
        )}
        <CourseCreator
          studentName={studentName}
          studentImageUrl={studentImageUrl}
          courseName={courseName}
          courseImageUrl={courseImageUrl}
          groupName={groupName}
          userRole="coach"
          onClickStudent={onClickStudent}
          onClickCourse={onClickCourse}
          onClickGroup={onClickGroup}
          locale={locale}
        />
        <CoachAction
          status={status}
          hoursLeftToEdit={hoursLeftToEdit}
          meetingLink={meetingLink}
          callQualityRating={callQualityRating}
          isRecordingDownloading={isRecordingDownloading}
          onClickJoinMeeting={onClickJoinMeeting}
          onClickReschedule={onClickReschedule}
          onClickCancel={onClickCancel}
          onClickRateCallQuality={onClickRateCallQuality}
          onClickDownloadRecording={onClickDownloadRecording}
          onClickAccept={onClickAccept}
          onClickDecline={onClickDecline}
          onClickSuggestAnotherDate={onClickSuggestAnotherDate}
          locale={locale}
        />
      </div>
    );
  };
