import React from 'react';
import { Button } from '../../button';
import { getDictionary } from '@maany_shr/e-class-translations';
import { IconCalendarAlt } from '../../icons/icon-calendar-alt';
import { IconTrashAlt } from '../../icons/icon-trash-alt';
import { Badge } from '../../badge';
import { IconCloudDownload } from '../../icons/icon-cloud-download';
import { IconHourglass } from '../../icons/icon-hourglass';
import { IconClose } from '../../icons/icon-close';
import { IconCheck } from '../../icons/icon-check';
import { CoachingSessionCardProps } from '../coaching-session-card';

/**
 * Type definition for student action props extracted from the central discriminated union.
 * This ensures only student-specific session variants are available, maintaining type safety
 * and preventing invalid prop combinations from coach-specific sessions.
 */
type StudentActionProps = Extract<CoachingSessionCardProps, { userType: 'student' }>;

/**
 * Student action component that renders appropriate action buttons and UI elements based on session status.
 * This component handles all interactive elements for student coaching sessions, including join meeting buttons,
 * reschedule/cancel options, review prompts, download functionality, and status indicators.
 *
 * The component uses a switch statement with TypeScript's discriminated union pattern to ensure type safety
 * across different session states. Each case handles specific actions relevant to that session status,
 * with proper type narrowing to access status-specific properties.
 *
 * Key features:
 * - Status-specific action rendering (ongoing, upcoming, ended, requested, rescheduled, canceled)
 * - Type-safe prop access based on session status
 * - Conditional UI elements based on session state (e.g., review availability, download status)
 * - Internationalization support through translation dictionary
 * - Responsive button layouts and badge indicators
 * - Proper handling of loading states and disabled buttons
 *
 * Session status behaviors:
 * - `ongoing`: Shows join meeting button with meeting link
 * - `upcoming-editable`: Displays time remaining badge with reschedule/cancel options
 * - `upcoming-locked`: Shows disabled join button with informational text
 * - `ended`: Conditional rendering based on review status - review prompt or download only
 * - `requested`: Shows pending status badge with cancel option
 * - `rescheduled`: Displays accept/decline buttons with suggest alternative option
 * - `canceled`: Shows cancellation status badge
 * - `to-be-defined`: Returns null (no actions available)
 *
 * @param props Student-specific coaching session props with discriminated union typing
 *
 * @example
 * // Ongoing session with meeting link
 * <StudentAction
 *   userType="student"
 *   status="ongoing"
 *   meetingLink="https://meet.example.com/abc123"
 *   onClickJoinMeeting={() => window.open(meetingLink)}
 *   locale="en"
 *   // ... other required props
 * />
 *
 * @example
 * // Upcoming editable session
 * <StudentAction
 *   userType="student"
 *   status="upcoming-editable"
 *   hoursLeftToEdit={24}
 *   onClickReschedule={() => openRescheduleModal()}
 *   onClickCancel={() => confirmCancellation()}
 *   locale="en"
 *   // ... other required props
 * />
 *
 * @example
 * // Ended session without review
 * <StudentAction
 *   userType="student"
 *   status="ended"
 *   hasReview={false}
 *   onClickReviewCoachingSession={() => openReviewForm()}
 *   onClickDownloadRecording={() => downloadRecording()}
 *   isRecordingDownloading={false}
 *   locale="en"
 *   // ... other required props
 * />
 *
 * @example
 * // Rescheduled session requiring response
 * <StudentAction
 *   userType="student"
 *   status="rescheduled"
 *   onClickAccept={() => acceptReschedule()}
 *   onClickDecline={() => declineReschedule()}
 *   onClickSuggestAnotherDate={() => suggestNewTime()}
 *   locale="en"
 *   // ... other required props
 * />
 */
export const StudentAction: React.FC<StudentActionProps> = (props) => {
    const dictionary = getDictionary(props.locale);

    // No action interface needed for undefined sessions
    if (props.status === 'to-be-defined') return null;

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
                    {(props.onClickCancel || props.onClickReschedule) && (
                        <Badge
                            className="flex items-center gap-1 px-3 py-1 rounded-medium max-w-fit"
                            variant="info"
                            size="big"
                            text={`${timeValue} ${timeText}`}
                        />
                    )}
                    <div className="flex gap-[9px] justify-between">
                        {props.onClickReschedule && (
                            <Button
                                onClick={props.onClickReschedule}
                                variant="primary"
                                size="small"
                                hasIconLeft
                                className="w-full"
                                iconLeft={<IconCalendarAlt size="5" />}
                                text={dictionary.components.coachingSessionCard.rescheduleText}
                            />
                        )}
                        {props.onClickCancel && (
                            <Button
                                onClick={props.onClickCancel}
                                variant={props.onClickReschedule ? "secondary" : "primary"}
                                size="small"
                                className={props.onClickReschedule ? "max-w-full" : "w-full"}
                                hasIconLeft
                                iconLeft={<IconTrashAlt size="5" />}
                                text={dictionary.components.coachingSessionCard.cancelText}
                            />
                        )}
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
            if (!props.hasReview) {
                // Type narrowing: props is now StudentEndedWithoutReviewCard
                const endedProps = props as Extract<StudentActionProps, { status: 'ended'; hasReview: false }>;
                return (
                    <div className="flex flex-col gap-2 w-full">
                        <Button
                            variant="primary"
                            className="w-full"
                            size="medium"
                            text={dictionary.components.coachingSessionCard.reviewCoachingSessionText}
                            onClick={endedProps.onClickReviewCoachingSession}
                        />
                        {/* TODO: Download recording functionality not implemented yet
                        <Button
                            variant="secondary"
                            className=""
                            size="medium"
                            hasIconLeft
                            iconLeft={<IconCloudDownload size="6" />}
                            text={dictionary.components.coachingSessionCard.downloadRecordingText}
                            onClick={endedProps.onClickDownloadRecording}
                            disabled={true}
                        />
                        */}
                    </div>
                );
            } else {
                // Type narrowing: props is now StudentEndedWithReviewCard
                // const endedProps = props as Extract<StudentActionProps, { status: 'ended'; hasReview: true }>;
                return (
                    <div className="flex flex-col gap-2 w-full">
                        {/* TODO: Download recording functionality not implemented yet
                        <Button
                            variant="secondary"
                            className=""
                            size="medium"
                            hasIconLeft
                            iconLeft={<IconCloudDownload size="6" />}
                            text={dictionary.components.coachingSessionCard.downloadRecordingText}
                            onClick={endedProps.onClickDownloadRecording}
                            disabled={endedProps.isRecordingDownloading}
                        />
                        {endedProps.isRecordingDownloading && (
                            <p className="text-xs text-text-secondary leading-[100%]">
                                {dictionary.components.coachingSessionCard.recordingAvailabilityInfo}
                            </p>
                        )}
                        */}
                    </div>
                );
            }

        case 'requested':
            return (
                <div className="flex flex-col gap-2">
                    <Badge
                        className="flex items-center gap-1 px-3 py-1 rounded-medium max-w-fit"
                        variant="info"
                        size="big"
                        text={dictionary.components.coachingSessionCard.requestSentText}
                        hasIconLeft
                        iconLeft={<IconHourglass size="5" />}
                    />
                    {props.onClickCancel && (
                        <Button
                            className="max-w-full"
                            onClick={props.onClickCancel}
                            variant="secondary"
                            size="medium"
                            hasIconLeft
                            iconLeft={<IconTrashAlt size="5" />}
                            text={dictionary.components.coachingSessionCard.cancelRequestText}
                        />
                    )}
                </div>
            );

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
                    <Button
                        variant="text"
                        text={dictionary.components.coachingSessionCard.suggestAnotherDateText}
                        className="max-w-full"
                        hasIconLeft
                        iconLeft={<IconCalendarAlt size="6" />}
                        onClick={props.onClickSuggestAnotherDate}
                    />
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
