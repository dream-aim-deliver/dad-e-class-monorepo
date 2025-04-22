import { cn } from '../../utils/style-utils';
import { IconCalendarAlt } from '../icons/icon-calendar-alt';
import { IconClock } from '../icons/icon-clock';

export interface DateAndTimeProps {
  date: Date;
  previousDate?: Date;
  startTime: string;
  endTime: string;
  previousStartTime?: string;
  previousEndTime?: string;
  hasReview?: boolean;
}

/**
 * DateAndTime component for displaying date and time information.
 *
 * @param date The date to be displayed in YYYY-MM-DD format.
 * @param previousDate The previous date to be displayed in YYYY-MM-DD format.
 * @param startTime The start time string to be displayed.
 * @param endTime The end time string to be displayed.
 * @param previousStartTime The previous start time string to be displayed.
 * @param previousEndTime The previous end time string to be displayed.
 * @param hasReview If true, adjusts the layout to fit within a review section.
 *
 * @example
 * <DateAndTime
 *   date={new Date('2024-03-19')}
 *   startTime='10.00'
 *   endTime='11.00'
 * />
 *
 * @example
 * <DateAndTime
 *   date={new Date()}
 *   startTime='10.00'
 *   endTime='11.00'
 *   hasReview={true}
 * />
 */

export const DateAndTime: React.FC<DateAndTimeProps> = ({
  date,
  previousDate,
  startTime,
  endTime,
  previousStartTime,
  previousEndTime,
  hasReview = false,
}) => {
  const dateString = new Date(date).toISOString().split('T')[0];

  return (
    <div
      className={cn(
        'flex text-text-primary',
        hasReview
          ? 'flex-wrap gap-4'
          : 'p-3 items-start flex-col gap-3 bg-base-neutral-800 rounded-small border border-base-neutral-700',
      )}
    >
      <div className="flex items-center gap-2">
        <IconCalendarAlt size="4" />
        <div className='flex gap-2'>
          {previousDate && (
            <p className="text-xs text-text-secondary leading-[100%] line-through">
              {previousDate.toISOString().split('T')[0]}
            </p>
          )}
          <p className="text-sm text-text-primary leading-[100%]">{dateString}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <IconClock size="4" />
        <div className='flex gap-2'>
          {previousStartTime && previousEndTime && (
            <p className="text-xs text-text-secondary leading-[100%] line-through">
              {previousStartTime} - {previousEndTime}
            </p>
          )}
          <p className="text-sm text-text-primary leading-[100%]">{startTime} - {endTime}</p>
        </div>
      </div>
    </div>
  );
};
