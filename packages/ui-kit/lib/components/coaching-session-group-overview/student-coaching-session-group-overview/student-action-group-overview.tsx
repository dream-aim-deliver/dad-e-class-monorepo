import React from 'react';
import { Button } from '../../button';
import { getDictionary } from '@maany_shr/e-class-translations';
import { IconCalendarAlt } from '../../icons/icon-calendar-alt';
import { IconTrashAlt } from '../../icons/icon-trash-alt';
import { Badge } from '../../badge';
import { CoachingSessionGroupOverviewCardProps } from '../coaching-session-group-overview-card';

/**
 * Type definition for student action group overview props extracted from the central discriminated union.
 * This ensures only student-specific session variants are available, maintaining type safety
 * and preventing invalid prop combinations from coach-specific sessions.
 */
type StudentActionGroupOverviewProps = Extract<CoachingSessionGroupOverviewCardProps, { userType: 'student' }>;

/**
 * Student action group overview component that renders appropriate action buttons and UI elements based on session status.
 * This component handles all interactive elements for student coaching sessions, including join meeting buttons,
 * reschedule/cancel options, review prompts, download functionality, and status indicators.
 *
 * The component uses a switch statement with TypeScript's discriminated union pattern to ensure type safety
 * across different session states. Each case handles specific actions relevant to that session status,
 * with proper type narrowing to access status-specific properties.
 *
 * Key features:
 * - Status-specific action rendering (ongoing, upcoming, ended, canceled)
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
 * - `canceled`: Shows red cancellation status button (disabled)
 * - `unscheduled`: Returns null (no actions available)
 *
 * @param props Student-specific coaching session props with discriminated union typing
 *
 * @example
 * // Ongoing session with meeting link
 * <StudentActionGroupOverview
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
 * <StudentActionGroupOverview
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
 * <StudentActionGroupOverview
 *   userType="student"
 *   status="ended"
 *   locale="en"
 *   // ... other required props
 * />
 *
 */
export const StudentActionGroupOverview: React.FC<StudentActionGroupOverviewProps> = (props) => {
    const dictionary = getDictionary(props.locale);

    // No action interface needed for unscheduled sessions
    if (props.status === 'unscheduled') return null;

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
                    />
                    {props.meetingLink && (
                        <p className="text-xs text-text-secondary leading-tight break-all overflow-hidden">
                            {props.meetingLink}
                        </p>
                    )}
                </div>
            );

        case 'upcoming-editable':
            return (
                <div className="flex flex-col gap-2 w-full">
                    <Badge
                        className="flex items-center gap-1 px-3 py-1 rounded-medium max-w-fit"
                        variant="info"
                        size="big"
                        text={`${props.hoursLeftToEdit} ${dictionary.components.coachingSessionCard.hoursLeftToEditText}`}
                    />
                    <div className="flex gap-[9px] justify-between">
                        <Button
                            onClick={props.onClickReschedule}
                            variant="primary"
                            size="small"
                            hasIconLeft
                            className="w-full"
                            iconLeft={<IconCalendarAlt size="5" />}
                            text={dictionary.components.coachingSessionCard.rescheduleText}
                        />
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

        case 'upcoming-locked':
            return (
                <div className="flex flex-col gap-1 items-start">
                    <Button
                        onClick={props.onClickJoinMeeting}
                        variant="primary"
                        size="medium"
                        className="w-full"
                        text={dictionary.components.coachingSessionCard.joinMeetingText}
                        disabled
                    />
                    <p className="text-xs text-text-secondary leading-[100%]">
                        {dictionary.components.coachingSessionCard.meetingLinkVisibilityInfo}
                    </p>
                </div>
            );

        // Do not show any action buttons for ended sessions that have reviews
        case 'ended':
            return null;

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