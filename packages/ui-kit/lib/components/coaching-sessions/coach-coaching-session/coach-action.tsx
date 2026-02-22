import React from 'react';
import { Button } from '../../button';
import { getDictionary } from '@maany_shr/e-class-translations';
import { IconCalendarAlt } from '../../icons/icon-calendar-alt';
import { IconTrashAlt } from '../../icons/icon-trash-alt';
import { Badge } from '../../badge';
import { IconCloudDownload } from '../../icons/icon-cloud-download';
import { IconClose } from '../../icons/icon-close';
import { IconCheck } from '../../icons/icon-check';
import { CoachingSessionCardProps } from '../coaching-session-card';

/**
 * Type definition for coach action props extracted from the central discriminated union.
 * This ensures only coach-specific session variants are available, maintaining type safety
 * and preventing invalid prop combinations from student-specific sessions.
 */
type CoachActionProps = Extract<CoachingSessionCardProps, { userType: 'coach' }>;

/**
 * Coach action component that renders appropriate action buttons and UI elements based on session status.
 * This component handles all interactive elements for coach coaching sessions, including join meeting buttons,
 * reschedule/cancel options, call quality rating, download functionality, and status indicators.
 *
 * The component uses a switch statement with TypeScript's discriminated union pattern to ensure type safety
 * across different session states. Each case handles specific actions relevant to that session status,
 * with proper type narrowing to access status-specific properties and callbacks.
 *
 * Key features:
 * - Status-specific action rendering (ongoing, upcoming, ended, requested, rescheduled, canceled)
 * - Type-safe prop access based on session status and review type
 * - Conditional UI elements based on session state and review requirements
 * - Internationalization support through translation dictionary
 * - Responsive button layouts and badge indicators
 * - Proper handling of loading states and disabled buttons
 * - Combined handling for similar statuses (requested/rescheduled)
 *
 * Session status behaviors:
 * - `ongoing`: Shows join meeting button with meeting link display
 * - `upcoming-editable`: Displays time remaining badge with reschedule/cancel options
 * - `upcoming-locked`: Shows disabled join button with informational text
 * - `ended`: Conditional rendering based on review type - call quality rating and/or download options
 * - `requested`/`rescheduled`: Shows accept/decline buttons with suggest alternative option
 * - `canceled`: Shows cancellation status badge
 *
 * Review type handling for ended sessions:
 * - `session-review`: Only shows download recording button
 * - `call-quality`: Shows rate call quality button plus download recording (disabled until rated)
 *
 * @param props Coach-specific coaching session props with discriminated union typing
 *
 * @example
 * // Ongoing session with meeting link
 * <CoachAction
 *   userType="coach"
 *   status="ongoing"
 *   meetingLink="https://meet.example.com/abc123"
 *   onClickJoinMeeting={() => window.open(meetingLink)}
 *   locale="en"
 *   // ... other required props
 * />
 *
 * @example
 * // Upcoming editable session
 * <CoachAction
 *   userType="coach"
 *   status="upcoming-editable"
 *   hoursLeftToEdit={24}
 *   onClickReschedule={() => openRescheduleModal()}
 *   onClickCancel={() => confirmCancellation()}
 *   locale="en"
 *   // ... other required props
 * />
 *
 * @example
 * // Ended session requiring call quality rating
 * <CoachAction
 *   userType="coach"
 *   status="ended"
 *   reviewType="call-quality"
 *   onClickRateCallQuality={() => openRatingModal()}
 *   onClickDownloadRecording={() => downloadRecording()}
 *   isRecordingDownloading={false}
 *   locale="en"
 *   // ... other required props
 * />
 *
 * @example
 * // Requested session requiring coach response
 * <CoachAction
 *   userType="coach"
 *   status="requested"
 *   onClickAccept={() => acceptRequest()}
 *   onClickDecline={() => declineRequest()}
 *   onClickSuggestAnotherDate={() => suggestNewTime()}
 *   locale="en"
 *   // ... other required props
 * />
 */
export const CoachAction: React.FC<CoachActionProps> = (props) => {
  const dictionary = getDictionary(props.locale);

  switch (props.status) {
    case 'ongoing':
      return (
        <div className="flex flex-col gap-1 items-start w-full">
          <Button
            onClick={props.onClickJoinMeeting}
            variant="primary"
            size="medium"
            className="w-full"
            text={dictionary.components.coachingSessionCard.joinMeetingText}
            disabled={!props.meetingLink}
          />
          {props.meetingLink && (
            <Button
              variant="text"
              size="small"
              text={dictionary.components.coachingSessionCard.copyLinkText}
              onClick={() => navigator.clipboard.writeText(props.meetingLink!)}
            />
          )}
          {props.onClickCancel && (
            <Button
              onClick={props.onClickCancel}
              variant="secondary"
              size="small"
              className="max-w-full"
              hasIconLeft
              iconLeft={<IconTrashAlt size="5" />}
              text={dictionary.components.coachingSessionCard.cancelText}
            />
          )}
        </div>
      );

    case 'upcoming-editable': {
      // Show minutes if hours is 0 and minutesLeftToEdit is provided
      const showMinutes = props.hoursLeftToEdit === 0 && props.minutesLeftToEdit !== undefined;
      const timeValue = showMinutes ? props.minutesLeftToEdit : props.hoursLeftToEdit;
      const timeText = showMinutes
        ? dictionary.components.coachingSessionCard.minutesLeftToEditText
        : dictionary.components.coachingSessionCard.hoursLeftToEditText;

      return (
        <div className="flex flex-col gap-2 w-full">
          <Badge
            className="flex items-center gap-1 px-3 py-1 rounded-medium max-w-fit"
            variant="info"
            size="big"
            text={`${timeValue ?? ''} ${timeText}`}
          />
          <div className="flex gap-[9px] justify-between">
            <Button
              onClick={props.onClickCancel}
              variant="secondary"
              size="small"
              className="max-w-full"
              hasIconLeft
              iconLeft={<IconTrashAlt size="5" />}
              text={dictionary.components.coachingSessionCard.cancelText}
            />
          </div>
        </div>
      );
    }

    case 'upcoming-locked':
      return (
        <div className="flex flex-col gap-1 items-start w-full">
          <Button
            onClick={props.onClickJoinMeeting}
            variant="primary"
            size="medium"
            className="w-full"
            text={dictionary.components.coachingSessionCard.joinMeetingText}
            disabled={!props.meetingLink}
          />
          {props.meetingLink && (
            <Button
              variant="text"
              size="small"
              text={dictionary.components.coachingSessionCard.copyLinkText}
              onClick={() => navigator.clipboard.writeText(props.meetingLink!)}
            />
          )}
          <p className="text-xs text-text-secondary leading-[100%]">
            {dictionary.components.coachingSessionCard.meetingLinkVisibilityInfo}
          </p>
        </div>
      );

    case 'ended':
      // No action interface needed for sessions without review
      if (props.reviewType === 'no-review') {
        return null;
      }
      return (
        <div className="flex flex-col gap-2 w-full">
          {props.reviewType === 'session-review' && (
            <Button
              variant="primary"
              className="w-full"
              size="medium"
              text={dictionary.components.coachingSessionCard.rateCallQualityText}
              onClick={props.onClickRateCallQuality}
            />
          )}
          {/* TODO: Download recording functionality not implemented yet
          <Button
            variant="secondary"
            className=""
            size="medium"
            hasIconLeft
            iconLeft={<IconCloudDownload size="6" />}
            text={dictionary.components.coachingSessionCard.downloadRecordingText}
            onClick={props.onClickDownloadRecording}
            disabled={props.reviewType === 'session-review' || (props.reviewType === 'call-quality' && props.isRecordingDownloading)}
          />
          {props.reviewType === 'call-quality' && props.isRecordingDownloading && (
            <p className="text-xs text-text-secondary leading-[100%]">
              {dictionary.components.coachingSessionCard.recordingAvailabilityInfo}
            </p>
          )}
          */}
        </div>
      );

    case 'requested':
    case 'rescheduled':
      return (
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="flex justify-between gap-3 w-full">
            <Button
              text={dictionary.components.coachingSessionCard.declineText}
              variant="secondary"
              hasIconLeft
              className="w-full"
              iconLeft={<IconClose size="6" />}
              onClick={props.onClickDecline}
            />
            <Button
              variant="primary"
              text={dictionary.components.coachingSessionCard.acceptText}
              hasIconLeft
              className="w-full"
              iconLeft={<IconCheck size="6" />}
              onClick={props.onClickAccept}
            />
          </div>
        </div>
      );

    case 'canceled':
      return (
        <Badge
          variant="errorprimary"
          className="text-sm max-w-fit"
          text={dictionary.components.coachingSessionCard.sessionCanceledText}
          hasIconLeft
          iconLeft={<IconTrashAlt size="5" />}
        />
      );

    default:
      return null;
  }
};
