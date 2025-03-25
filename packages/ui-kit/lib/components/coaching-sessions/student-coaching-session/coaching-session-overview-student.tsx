import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { DateAndTime } from '../date-and-time';
import { CourseCreator } from '../course-creator';
import { CoachingSessionActions } from './coaching-session-actions-student';
import { ReviewCard } from '../review-card';

export interface CoachingSessionOverviewStudentProps extends isLocalAware {
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
  creatorName: string;
  creatorImageUrl?: string;
  courseName?: string;
  courseImageUrl?: string;
  groupName?: string;
  reviewText?: string;
  rating?: number;
  callQualityRating?: number;
  meetingLink?: string;
  isRecordingDownloading?: boolean;
  hoursLeftToEdit?: number;
  onClickCreator?: () => void;
  onClickCourse?: () => void;
  onClickGroup?: () => void;
  onClickJoinMeeting?: () => void;
  onClickReschedule?: () => void;
  onClickCancel?: () => void;
  onClickReviewCoachingSession?: () => void;
  onClickDownloadRecording?: () => void;
  onClickDecline?: () => void;
  onClickAccept?: () => void;
  onClickSuggestAnotherDate?: () => void;
}

/**
 * CoachingSessionOverviewStudent component for displaying a coaching session overview for students.
 *
 * @param status The current status of the coaching session (e.g., 'ongoing', 'upcoming-editable', 'ended').
 * @param title The title of the coaching session.
 * @param duration The duration of the session in minutes.
 * @param date The date of the session.
 * @param time The time of the session.
 * @param creatorName The name of the session creator.
 * @param creatorImageUrl (Optional) The image URL of the session creator.
 * @param courseName (Optional) The name of the related course.
 * @param courseImageUrl (Optional) The image URL of the course.
 * @param groupName (Optional) The group name associated with the session.
 * @param reviewText (Optional) The review text provided by the student.
 * @param rating (Optional) The rating given to the session (out of 5 stars).
 * @param callQualityRating (Optional) The rating given for call quality (out of 5 stars).
 * @param meetingLink (Optional) The link to join the coaching session.
 * @param isRecordingDownloading (Optional) Boolean flag indicating whether a session recording is downloading.
 * @param hoursLeftToEdit (Optional) Hours left to edit session details.
 * @param onClickCreator (Optional) Function to handle clicking the creator's profile.
 * @param onClickCourse (Optional) Function to handle clicking the course.
 * @param onClickGroup (Optional) Function to handle clicking the group.
 * @param onClickJoinMeeting (Optional) Function to handle joining the session.
 * @param onClickReschedule (Optional) Function to handle rescheduling the session.
 * @param onClickCancel (Optional) Function to handle canceling the session.
 * @param onClickReviewCoachingSession (Optional) Function to handle reviewing the session.
 * @param onClickDownloadRecording (Optional) Function to handle downloading session recordings.
 * @param onClickDecline (Optional) Function to handle declining a session request.
 * @param onClickAccept (Optional) Function to handle accepting a session request.
 * @param onClickSuggestAnotherDate (Optional) Function to handle suggesting another date for the session.
 * @param locale The locale for translation and localization purposes.
 *
 * @example
 * <CoachingSessionOverviewStudent
 *   status="ongoing"
 *   title="Advanced React Workshop"
 *   duration={60}
 *   date={new Date()}
 *   time="10:00 AM"
 *   creatorName="John Doe"
 *   creatorImageUrl="https://example.com/avatar.jpg"
 *   locale="en"
 * />
 */

export const CoachingSessionOverviewStudent: React.FC<
  CoachingSessionOverviewStudentProps
> = ({
  status,
  title,
  duration,
  date,
  time,
  creatorName,
  creatorImageUrl,
  courseName,
  courseImageUrl,
  groupName,
  reviewText,
  rating,
  callQualityRating,
  meetingLink,
  isRecordingDownloading,
  hoursLeftToEdit,
  onClickCreator,
  onClickCourse,
  onClickGroup,
  onClickJoinMeeting,
  onClickReschedule,
  onClickCancel,
  onClickReviewCoachingSession,
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
        <p className="text-md text-text-primary font-bold leading-[120%]">
          {title}
        </p>
        <p className="text-xs text-text-primary font-bold leading-[120%] whitespace-nowrap">
          {duration}
          {dictionary.components.coachingSessionOverview.durationText}
        </p>
      </div>
      <DateAndTime
        date={date}
        time={time}
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
        creatorName={creatorName}
        creatorImageUrl={creatorImageUrl}
        courseName={courseName}
        courseImageUrl={courseImageUrl}
        groupName={groupName}
        userRole="student"
        onClickCourse={onClickCourse}
        onClickCreator={onClickCreator}
        onClickGroup={onClickGroup}
        locale={locale}
      />
      <CoachingSessionActions
        status={status}
        hoursLeftToEdit={hoursLeftToEdit}
        meetingLink={meetingLink}
        hasReview={rating ? true : false}
        onClickJoinMeeting={onClickJoinMeeting}
        onClickReschedule={onClickReschedule}
        onClickCancel={onClickCancel}
        onClickReviewCoachingSession={onClickReviewCoachingSession}
        onClickDownloadRecording={onClickDownloadRecording}
        isRecordingDownloading={isRecordingDownloading}
        onClickAccept={onClickAccept}
        onClickDecline={onClickDecline}
        onClickSuggestAnotherDate={onClickSuggestAnotherDate}
        locale={locale}
      />
    </div>
  );
};
