import React from 'react';
import { Button } from '../../button';
import { getDictionary } from '@maany_shr/e-class-translations';
import { IconCalendarAlt } from '../../icons/icon-calendar-alt';
import { IconTrashAlt } from '../../icons/icon-trash-alt';
import { Badge } from '../../badge';
import { CoachingSessionGroupOverviewCardProps } from '..';

/**
 * Type definition for coach action group overview props extracted from the central discriminated union.
 * This ensures only coach-specific session variants are available, maintaining type safety
 * and preventing invalid prop combinations from student-specific sessions.
 */
type CoachActionGroupOverviewProps = Extract<CoachingSessionGroupOverviewCardProps, { userType: 'coach' }>;

/**
 * Coach action group overview component that renders appropriate action buttons and UI elements based on session status.
 * This component handles all interactive elements for coach coaching sessions, including join meeting buttons,
 * reschedule/cancel options, call quality rating, download functionality, and status indicators.
 *
 * The component uses a switch statement with TypeScript's discriminated union pattern to ensure type safety
 * across different session states. Each case handles specific actions relevant to that session status,
 * with proper type narrowing to access status-specific properties and callbacks.
 *
 * Key features:
 * - Status-specific action rendering (ongoing, upcoming, ended, canceled, unscheduled)
 * - Type-safe prop access based on session status and review type
 * - Conditional UI elements based on session state and review requirements
 * - Internationalization support through translation dictionary
 * - Responsive button layouts and badge indicators
 * - Proper handling of loading states and disabled buttons
 *
 * Session status behaviors:
 * - `ongoing`: Shows join meeting button with meeting link display
 * - `upcoming-editable`: Displays time remaining badge with reschedule/cancel options
 * - `upcoming-locked`: Shows disabled join button with informational text
 * - `ended`: Conditional rendering based on review type - call quality rating and/or download options
 * - `canceled`: Shows cancellation status badge
 * - `unscheduled`: Shows schedule session button
 * *
 * @param props Coach-specific coaching session props with discriminated union typing
 *
 * @example
 * // Ongoing session with meeting link
 * <CoachActionGroupOverview
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
 * <CoachActionGroupOverview
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
 * // Ended session 
 * <CoachActionGroupOverview
 *   userType="coach"
 *   status="ended"
 *   onClickRateCallQuality={() => openRatingModal()}
 *   locale="en"
 *   // ... other required props
 * />
 *
 */
export const CoachActionGroupOverview: React.FC<CoachActionGroupOverviewProps> = (props) => {
  const dictionary = getDictionary(props.locale);

  // Special handling for unscheduled sessions - show schedule button if callback is provided
  if (props.status === 'unscheduled') {
    return props.onClickScheduleSession ? (
      <Button
        variant="primary"
        size="medium"
        className="w-full"
        text={dictionary.components.coachingSessionCard.scheduleSessionText}
        onClick={props.onClickScheduleSession}
      />
    ) : null;
  }

  switch (props.status) {
    case 'ongoing':
      return (
        <div className="flex flex-col gap-1 items-start">
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
            text={
              (props.hoursLeftToEdit ?? '') +
              ' ' +
              dictionary.components.coachingSessionCard.hoursLeftToEditText
            }
          />
          <div className="flex gap-[9px] justify-between">
            <Button
              onClick={props.onClickReschedule}
              variant="primary"
              size="small"
              className="flex-1"
              hasIconLeft
              iconLeft={<IconCalendarAlt size="5" />}
              text={dictionary.components.coachingSessionCard.rescheduleText}
            />
            <Button
              onClick={props.onClickCancel}
              variant="secondary"
              size="small"
              className="flex-1"
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