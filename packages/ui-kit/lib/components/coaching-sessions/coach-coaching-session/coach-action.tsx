import React from 'react';
import { Button } from '../../button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconCalendarAlt } from '../../icons/icon-calendar-alt';
import { IconTrashAlt } from '../../icons/icon-trash-alt';
import { Badge } from '../../badge';
import { IconCloudDownload } from '../../icons/icon-cloud-download';
import { IconClose } from '../../icons/icon-close';
import { IconCheck } from '../../icons/icon-check';

export interface CoachActionProps extends isLocalAware {
  status:
  | 'ongoing'
  | 'upcoming-editable'
  | 'upcoming-locked'
  | 'ended'
  | 'requested'
  | 'rescheduled'
  | 'canceled';
  hoursLeftToEdit?: number;
  meetingLink?: string;
  callQualityRating?: number;
  isRecordingDownloading?: boolean;
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
 * CoachAction Component
 *
 * This component renders action buttons based on the status of a coaching session.
 * It provides different UI elements for various session states like 'ongoing', 'upcoming', 'ended', etc.
 *
 * Props:
 * - status: Current state of the session ('ongoing', 'upcoming-editable', 'upcoming-locked', 'ended', 'requested', 'rescheduled', 'canceled').
 * - hoursLeftToEdit?: Number of hours left to modify the session (for 'upcoming-editable').
 * - meetingLink?: URL for the meeting session.
 * - callQualityRating?: Rating given to the session call quality.
 * - isRecordingDownloading?: Boolean indicating if the session recording is being downloaded.
 * - onClickJoinMeeting?: Callback for joining the meeting.
 * - onClickReschedule?: Callback for rescheduling the session.
 * - onClickCancel?: Callback for canceling the session.
 * - onClickRateCallQuality?: Callback for rating the call quality.
 * - onClickDownloadRecording?: Callback for downloading the session recording.
 * - onClickDecline?: Callback for declining a rescheduled session.
 * - onClickAccept?: Callback for accepting a rescheduled session.
 * - onClickSuggestAnotherDate?: Callback for suggesting another date.
 * - locale: Localization string for language support.
 *
 * The component dynamically renders UI based on the `status` prop.
 * It utilizes `getDictionary(locale)` to fetch translated text for buttons and labels.
 *
 * Status-based Rendering:
 * - 'ongoing': Displays a 'Join Meeting' button with an optional meeting link.
 * - 'upcoming-editable': Shows hours left with options to reschedule or cancel.
 * - 'upcoming-locked': Displays a disabled 'Join Meeting' button with an info message.
 * - 'ended': Provides options to rate the call and download the session recording.
 * - 'requested': Offers options to accept, decline, or suggest another date.
 * - 'rescheduled': Similar to 'requested' with reschedule acceptance options.
 * - 'canceled': Displays a badge indicating session cancellation.
 *
 * Icons are used for better UI clarity, including calendar, trash, hourglass, check, and close icons.
 *
 */

export const CoachAction: React.FC<CoachActionProps> = ({
  status,
  hoursLeftToEdit,
  meetingLink,
  callQualityRating,
  isRecordingDownloading = false,
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

  const actionComponents = {
    ongoing: {
      render: () => (
        <div className="flex flex-col gap-1 items-start">
          <Button
            onClick={onClickJoinMeeting}
            variant="primary"
            size="medium"
            className="w-full"
            text={dictionary.components.coachingSessionCard.joinMeetingText}
          />
          {meetingLink && (
            <p className="text-xs text-text-secondary leading-tight break-all overflow-hidden">
              {meetingLink}
            </p>
          )}
        </div>
      ),
    },

    'upcoming-editable': {
      render: () => (
        <div className="flex flex-col gap-2 w-full">
          <Badge
            className="flex items-center gap-1 px-3 py-1 rounded-medium max-w-fit"
            variant="info"
            size="big"
            text={`${hoursLeftToEdit} ${dictionary.components.coachingSessionCard.hoursLeftToEditText
              }`}
          />
          <div className="flex gap-[9px] justify-between">
            <Button
              onClick={onClickReschedule}
              variant="primary"
              size="small"
              hasIconLeft
              className="w-full"
              iconLeft={<IconCalendarAlt size="5" />}
              text={
                dictionary.components.coachingSessionCard.rescheduleText
              }
            />
            <Button
              onClick={onClickCancel}
              variant="secondary"
              size="small"
              className="max-w-full"
              hasIconLeft
              iconLeft={<IconTrashAlt size="5" />}
              text={dictionary.components.coachingSessionCard.cancelText}
            />
          </div>
        </div>
      ),
    },

    'upcoming-locked': {
      render: () => (
        <div className="flex flex-col gap-1 items-start">
          <Button
            onClick={onClickJoinMeeting}
            variant="primary"
            size="medium"
            className="w-full"
            text={dictionary.components.coachingSessionCard.joinMeetingText}
            disabled
          />
          <p className="text-xs text-text-secondary leading-[100%]">
            {
              dictionary.components.coachingSessionCard
                .meetingLinkVisibilityInfo
            }
          </p>
        </div>
      ),
    },

    ended: {
      render: () => (
        <div className="flex flex-col gap-2 w-full">
          {!callQualityRating && (
            <Button
              variant="primary"
              className="w-full"
              size="medium"
              text={
                dictionary.components.coachingSessionCard
                  .rateCallQualityText
              }
              onClick={onClickRateCallQuality}
            />
          )}
          <Button
            variant="secondary"
            className=""
            size="medium"
            hasIconLeft
            iconLeft={<IconCloudDownload size="6" />}
            text={
              dictionary.components.coachingSessionCard
                .downloadRecordingText
            }
            onClick={onClickDownloadRecording}
            disabled={isRecordingDownloading}
          />
          {isRecordingDownloading && (
            <p className="text-xs text-text-secondary leading-[100%]">
              {
                dictionary.components.coachingSessionCard
                  .recordingAvailabilityInfo
              }
            </p>
          )}
        </div>
      ),
    },

    requested: {
      render: () => (
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="flex justify-between gap-3 w-full">
            <Button
              text={dictionary.components.coachingSessionCard.declineText}
              variant="secondary"
              hasIconLeft
              className="w-full"
              iconLeft={<IconClose size="6" />}
              onClick={onClickDecline}
            />
            <Button
              variant="primary"
              text={dictionary.components.coachingSessionCard.acceptText}
              hasIconLeft
              className="w-full"
              iconLeft={<IconCheck size="6" />}
              onClick={onClickAccept}
            />
          </div>
          <Button
            variant="text"
            text={
              dictionary.components.coachingSessionCard
                .suggestAnotherDateText
            }
            className="max-w-full"
            hasIconLeft
            iconLeft={<IconCalendarAlt size="6" />}
            onClick={onClickSuggestAnotherDate}
          />
        </div>
      ),
    },

    rescheduled: {
      render: () => (
        <div className="flex flex-col gap-2 items-center w-full">
          <div className="flex justify-between gap-3 w-full">
            <Button
              text={dictionary.components.coachingSessionCard.declineText}
              variant="secondary"
              hasIconLeft
              className="w-full"
              iconLeft={<IconClose size="6" />}
              onClick={onClickDecline}
            />
            <Button
              variant="primary"
              text={dictionary.components.coachingSessionCard.acceptText}
              hasIconLeft
              className="w-full"
              iconLeft={<IconCheck size="6" />}
              onClick={onClickAccept}
            />
          </div>
          <Button
            variant="text"
            text={
              dictionary.components.coachingSessionCard
                .suggestAnotherDateText
            }
            className="max-w-full"
            hasIconLeft
            iconLeft={<IconCalendarAlt size="6" />}
            onClick={onClickSuggestAnotherDate}
          />
        </div>
      ),
    },

    canceled: {
      render: () => (
        <Badge
          variant="errorprimary"
          className="text-sm max-w-fit"
          text={
            dictionary.components.coachingSessionCard.sessionCanceledText
          }
          hasIconLeft
          iconLeft={<IconTrashAlt size="5" />}
        />
      ),
    },
  };
  return actionComponents[status]?.render() || null;
};
