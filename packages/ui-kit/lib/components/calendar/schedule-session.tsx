import React, { useState } from 'react';
import { DateInput } from '../date-input';
import { InputField } from '../input-field';
import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { getDictionary, isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { IconLoaderSpinner } from '../icons/icon-loader-spinner';
import { useImageComponent } from '../../contexts/image-component-context';

export interface ScheduleSessionProps extends isLocalAware {
  user: 'student' | 'coach';
  isError: boolean;
  isLoading?: boolean;
  groupSession: boolean;
  course: boolean;
  coachImageUrl?: string;
  courseImageUrl?: string;
  dateValue: Date;
  timeValue: string;
  onDateChange: (value: string) => void;
  onTimeChange: (value: string) => void;
  coachName?: string;
  courseTitle?: string;
  groupName?: string;
  sessionName?: string;
  onClickDiscard: () => void;
  onClickSendRequest: () => void;
  onClickCoach?: () => void;
  onClickCourse?: () => void;
  onClickGroup?: () => void;
}

/**
 * A component for scheduling a coaching session with date, time, and session details.
 *
 * @param user The type of user scheduling the session: `student` or `coach`.
 * @param isError Boolean indicating if there is an error (e.g., coach not available).
 * @param isLoading Boolean indicating if the form is in a loading state.
 * @param groupSession Boolean indicating if the session is for a group.
 * @param course Boolean indicating if the session is tied to a specific course.
 * @param coachImageUrl Optional URL for the coach's profile picture.
 * @param courseImageUrl Optional URL for the course image.
 * @param dateValue The selected date for the session.
 * @param timeValue The selected time for the session in `HH:mm` format.
 * @param onDateChange Handler function for updating the selected date.
 * @param onTimeChange Handler function for updating the selected time.
 * @param coachName Optional name of the coach.
 * @param courseTitle Optional title of the course.
 * @param groupName Optional name of the group.
 * @param sessionName Optional name of the session.
 * @param onClickDiscard Handler function for discarding the session scheduling.
 * @param onClickSendRequest Handler function for sending the session request.
 * @param onClickCoach Optional handler function for clicking the coach's name.
 * @param onClickCourse Optional handler function for clicking the course title.
 * @param onClickGroup Optional handler function for clicking the group name.
 * @param locale The locale for internationalization, used to fetch the appropriate dictionary.
 *
 * @example
 * <ScheduleSession
 *   user="student"
 *   isError={false}
 *   isLoading={false}
 *   groupSession={true}
 *   course={true}
 *   coachImageUrl="https://example.com/coach.jpg"
 *   courseImageUrl="https://example.com/course.jpg"
 *   dateValue={new Date("2025-05-07")}
 *   timeValue="10:00"
 *   onDateChange={(value) => console.log("Date changed:", value)}
 *   onTimeChange={(value) => console.log("Time changed:", value)}
 *   coachName="John Doe"
 *   courseTitle="Leadership Training"
 *   groupName="Group A"
 *   sessionName="Intro Session"
 *   onClickDiscard={() => console.log("Discard clicked")}
 *   onClickSendRequest={() => console.log("Send request clicked")}
 *   onClickCoach={() => console.log("Coach clicked")}
 *   onClickCourse={() => console.log("Course clicked")}
 *   onClickGroup={() => console.log("Group clicked")}
 *   locale="en"
 * />
 */
export const ScheduleSession: React.FC<ScheduleSessionProps> = ({
  user,
  isError,
  isLoading = false,
  groupSession,
  course,
  coachImageUrl,
  courseImageUrl,
  dateValue,
  timeValue,
  onDateChange,
  onTimeChange,
  coachName: fullName,
  courseTitle,
  groupName,
  sessionName,
  onClickDiscard,
  onClickSendRequest,
  onClickCoach,
  onClickCourse,
  onClickGroup,
  locale,
}) => {
  const ImageComponent = useImageComponent();
  const [isImageError, setIsImageError] = useState(false);
  const dictionary = getDictionary(locale);
  const handleImageError = () => {
    setIsImageError(true);
  };

  const shouldShowPlaceholder = !courseImageUrl || isImageError;

  return (
    <div className="flex flex-col items-start gap-6 w-full max-w-[320px]">
      <div className="flex flex-col items-start w-full p-4 rounded-md border border-base-neutral-700 bg-base-neutral-800">
        <div className="text-text-primary font-bold text-md flex flex-row items-center">
          <span className="text-sm text-text-secondary">{dictionary.components.scheduleSession.session}:</span>
          <div className="ml-2">{sessionName}</div>
        </div>
        {user === 'student' && fullName && (
          <div className="flex items-center gap-2 text-text-primary flex-row">
            <span className="text-sm text-text-secondary">{dictionary.components.scheduleSession.coach}:</span>
            <UserAvatar imageUrl={coachImageUrl} fullName={fullName} size="xSmall" />
            <Button
              text={fullName}
              variant="text"
              size="small"
              className="ml-[-15px]"
              onClick={onClickCoach}
            />
          </div>
        )}
        {course && courseTitle && (
          <div className="flex items-center gap-2 text-white">
            <span className="text-sm text-text-secondary">{dictionary.components.scheduleSession.course}:</span>
            {shouldShowPlaceholder ? (
              <div className="w-6 h-6 rounded bg-base-neutral-700 flex items-center justify-center">
                <span className="text-text-secondary text-xs">{dictionary.components.scheduleSession.na}</span>
              </div>
            ) : (
              <ImageComponent
                src={courseImageUrl}
                alt="Course Image"
                width={24}
                height={24}
                className="w-6 h-6 rounded object-cover"
                onError={handleImageError}
              />
            )}
            <Button
              text={courseTitle}
              variant="text"
              size="small"
              className="ml-[-15px]"
              onClick={onClickCourse}
            />
          </div>
        )}
        {groupSession && groupName && (
          <div className="text-text-primary flex items-center gap-2 flex-row">
            <span className="text-sm text-text-secondary">{dictionary.components.scheduleSession.group}:</span>
            <Button
              text={groupName}
              variant="text"
              size="small"
              className="ml-[-8px]"
              onClick={onClickGroup}
            />
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-4 w-full">
        <DateInput
          label={dictionary.components.scheduleSession.date}
          value={dateValue.toISOString().split('T')[0]}
          onChange={onDateChange}
          locale={locale as TLocale}
        />
        <div className="flex flex-col gap-1 w-full">
          <label className="text-white text-sm">{dictionary.components.scheduleSession.time}</label>
          <InputField
            inputText={timeValue || ''}
            leftContent={null}
            rightContent={null}
            setValue={onTimeChange}
            type="text"
          />
        </div>
      </div>
      {isError && (
        <div className="w-full text-sm text-feedback-error-primary text-justify">
          {dictionary.components.scheduleSession.errorMessage}
        </div>
      )}
      <div className="flex flex-row gap-4 w-full">
        <Button
          text={dictionary.components.scheduleSession.discardButton}
          variant="secondary"
          className="flex-1 justify-center"
          onClick={onClickDiscard}
          disabled={isLoading}
        />
        <div className="relative flex-1">
          <Button
            text={dictionary.components.scheduleSession.sendRequestButton}
            variant="primary"
            className="w-full justify-center"
            onClick={onClickSendRequest}
            disabled={isLoading}
          />
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <IconLoaderSpinner classNames="animate-spin h-5 w-5 text-white" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};