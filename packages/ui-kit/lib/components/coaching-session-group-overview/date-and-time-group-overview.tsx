import { cn } from '../../utils/style-utils';
import { IconCalendarAlt } from '../icons/icon-calendar-alt';
import { IconClock } from '../icons/icon-clock';

/**
 * Base props shared by all DateAndTimeGroupOverview variants
 */
interface BaseDateAndTimeGroupOverviewProps {
  date: Date;
  startTime: string;
  endTime: string;
  hasReview?: boolean;
}

/**
 * DateAndTimeGroupOverview props for regular sessions (no reschedule info)
 */
interface RegularDateAndTimeGroupOverviewProps extends BaseDateAndTimeGroupOverviewProps {
  type: 'regular';
}

/**
 * DateAndTimeGroupOverview props for rescheduled sessions (includes previous date/time info)
 */
interface RescheduledDateAndTimeGroupOverviewProps extends BaseDateAndTimeGroupOverviewProps {
  type: 'rescheduled';
  previousDate: Date;
  previousStartTime: string;
  previousEndTime: string;
}

/**
 * Discriminated union for DateAndTimeGroupOverview props
 */
export type DateAndTimeGroupOverviewProps = RegularDateAndTimeGroupOverviewProps | RescheduledDateAndTimeGroupOverviewProps;

/**
 * DateAndTimeGroupOverview component for displaying date and time information.
 * Uses discriminated union to handle regular vs rescheduled sessions.
 *
 * @param type - 'regular' for normal sessions, 'rescheduled' for sessions that were rescheduled
 * @param date The date to be displayed in YYYY-MM-DD format.
 * @param startTime The start time string to be displayed.
 * @param endTime The end time string to be displayed.
 * @param previousDate (rescheduled only) The previous date to be displayed in YYYY-MM-DD format.
 * @param previousStartTime (rescheduled only) The previous start time string to be displayed.
 * @param previousEndTime (rescheduled only) The previous end time string to be displayed.
 * @param hasReview If true, adjusts the layout to fit within a review section.
 *
 * @example
 * // Regular session
 * <DateAndTimeGroupOverview
 *   type="regular"
 *   date={new Date('2024-03-19')}
 *   startTime='10.00'
 *   endTime='11.00'
 * />
 *
 * @example
 * // Rescheduled session
 * <DateAndTimeGroupOverview
 *   type="rescheduled"
 *   date={new Date('2024-03-19')}
 *   startTime='10.00'
 *   endTime='11.00'
 *   previousDate={new Date('2024-03-18')}
 *   previousStartTime='09.00'
 *   previousEndTime='10.00'
 *   hasReview={true}
 * />
 */
export const DateAndTimeGroupOverview: React.FC<DateAndTimeGroupOverviewProps> = (props) => {
  const dateString = new Date(props.date).toISOString().split('T')[0];

  return (
    <div
      className={cn(
        'flex text-text-primary',
        props.hasReview
          ? 'flex-wrap gap-4'
          : 'p-3 items-start flex-col gap-3 bg-base-neutral-800 rounded-small border border-base-neutral-700',
      )}
    >
      <div className="flex items-center gap-2">
        <IconCalendarAlt size="4" />
        <div className='flex gap-2'>
          {props.type === 'rescheduled' && (
            <p className="text-xs text-text-secondary leading-[100%] line-through">
              {props.previousDate.toISOString().split('T')[0]}
            </p>
          )}
          <p className="text-sm text-text-primary leading-[100%]">{dateString}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <IconClock size="4" />
        <div className='flex gap-2'>
          {props.type === 'rescheduled' && (
            <p className="text-xs text-text-secondary leading-[100%] line-through">
              {props.previousStartTime} - {props.previousEndTime}
            </p>
          )}
          <p className="text-sm text-text-primary leading-[100%]">{props.startTime} - {props.endTime}</p>
        </div>
      </div>
    </div>
  );
};