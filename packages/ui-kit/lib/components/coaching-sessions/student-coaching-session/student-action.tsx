import React from 'react';
import { Button } from '../../button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconCalendarAlt } from '../../icons/icon-calendar-alt';
import { IconTrashAlt } from '../../icons/icon-trash-alt';
import { Badge } from '../../badge';
import { IconCloudDownload } from '../../icons/icon-cloud-download';
import { IconHourglass } from '../../icons/icon-hourglass';
import { IconClose } from '../../icons/icon-close';
import { IconCheck } from '../../icons/icon-check';

export interface StudentActionProps extends isLocalAware {
    status:
        | 'ongoing'
        | 'upcoming-editable'
        | 'upcoming-locked'
        | 'ended'
        | 'requested'
        | 'rescheduled'
        | 'canceled'
        | 'to-be-defined';
    hoursLeftToEdit?: number;
    meetingLink?: string;
    hasReview?: boolean;
    isRecordingDownloading?: boolean;
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
 * StudentAction Component
 *
 * This component renders action buttons based on the status of a coaching session.
 * It provides different UI elements for various session states like 'ongoing', 'upcoming', 'ended', etc.
 *
 * Props:
 * - status: Current state of the session ('ongoing', 'upcoming-editable', 'upcoming-locked', 'ended', etc.).
 * - hoursLeftToEdit?: Number of hours left to modify the session (for 'upcoming-editable').
 * - meetingLink?: URL for the meeting session.
 * - hasReview?: Boolean indicating if the session has been reviewed.
 * - isRecordingDownloading?: Boolean indicating if the session recording is downloading.
 * - onClickJoinMeeting?: Callback for joining the meeting.
 * - onClickReschedule?: Callback for rescheduling the session.
 * - onClickCancel?: Callback for canceling the session.
 * - onClickReviewCoachingSession?: Callback for reviewing the coaching session.
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
 * - 'ongoing': Shows a 'Join Meeting' button with a meeting link if available.
 * - 'upcoming-editable': Displays a badge with hours left and buttons for rescheduling/canceling.
 * - 'upcoming-locked': Shows a disabled 'Join Meeting' button with an info message.
 * - 'ended': Displays options for reviewing and downloading the session recording.
 * - 'requested': Shows a pending request badge and an option to cancel the request.
 * - 'rescheduled': Allows accepting, declining, or suggesting another date.
 * - 'canceled': Shows a badge indicating cancellation.
 *
 * Icons are used for better UI clarity, including calendar, trash, hourglass, check, and close icons.
 *
 */

export const StudentAction: React.FC<StudentActionProps> = ({
    status,
    hoursLeftToEdit,
    meetingLink,
    hasReview = false,
    isRecordingDownloading = false,
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

    const actionComponents = {
        ongoing: {
            render: () => (
                <div className="flex flex-col gap-1 items-start w-full">
                    <Button
                        onClick={onClickJoinMeeting}
                        variant="primary"
                        size="medium"
                        className="w-full"
                        text={
                            dictionary.components.coachingSessionCard
                                .joinMeetingText
                        }
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
                        text={`${hoursLeftToEdit} ${
                            dictionary.components.coachingSessionCard
                                .hoursLeftToEditText
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
                                dictionary.components.coachingSessionCard
                                    .rescheduleText
                            }
                        />
                        <Button
                            onClick={onClickCancel}
                            variant="secondary"
                            size="small"
                            className="max-w-full"
                            hasIconLeft
                            iconLeft={<IconTrashAlt size="5" />}
                            text={
                                dictionary.components.coachingSessionCard
                                    .cancelText
                            }
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
                        text={
                            dictionary.components.coachingSessionCard
                                .joinMeetingText
                        }
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
                    {!hasReview && (
                        <Button
                            variant="primary"
                            className="w-full"
                            size="medium"
                            text={
                                dictionary.components.coachingSessionCard
                                    .reviewCoachingSessionText
                            }
                            onClick={onClickReviewCoachingSession}
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
                <div className="flex flex-col gap-2">
                    <Badge
                        className="flex items-center gap-1 px-3 py-1 rounded-medium max-w-fit"
                        variant="info"
                        size="big"
                        text={
                            dictionary.components.coachingSessionCard
                                .requestSentText
                        }
                        hasIconLeft
                        iconLeft={<IconHourglass size="5" />}
                    />
                    <Button
                        className="max-w-full"
                        onClick={onClickCancel}
                        variant="secondary"
                        size="medium"
                        hasIconLeft
                        iconLeft={<IconTrashAlt size="5" />}
                        text={
                            dictionary.components.coachingSessionCard
                                .cancelRequestText
                        }
                    />
                </div>
            ),
        },

        rescheduled: {
            render: () => (
                <div className="flex flex-col gap-2 items-center w-full">
                    <div className="flex justify-between gap-3 w-full">
                        <Button
                            text={
                                dictionary.components.coachingSessionCard
                                    .declineText
                            }
                            variant="secondary"
                            hasIconLeft
                            className="w-full"
                            iconLeft={<IconClose size="6" />}
                            onClick={onClickDecline}
                        />
                        <Button
                            variant="primary"
                            text={
                                dictionary.components.coachingSessionCard
                                    .acceptText
                            }
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
                        dictionary.components.coachingSessionCard
                            .sessionCanceledText
                    }
                    hasIconLeft
                    iconLeft={<IconTrashAlt size="5" />}
                />
            ),
        },
        'to-be-defined': {
            render: () => null,
        },
    };
    return actionComponents[status]?.render() || null;
};
