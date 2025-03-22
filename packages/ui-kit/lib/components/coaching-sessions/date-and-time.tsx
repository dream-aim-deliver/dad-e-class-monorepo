import { cn } from '../../utils/style-utils';
import { IconCalendarAlt } from '../icons/icon-calendar-alt';
import { IconClock } from '../icons/icon-clock';

export interface DateAndTimeProps {
  date: Date;
  time: string;
  hasReview?: boolean;
}

/**
 * DateAndTime component for displaying date and time information.
 *
 * @param date The date to be displayed in YYYY-MM-DD format.
 * @param time The time string to be displayed.
 * @param hasReview If true, adjusts the layout to fit within a review section.
 *
 * @example
 * <DateAndTime
 *   date={new Date('2024-03-19')}
 *   time="10:30 - 11:30"
 * />
 *
 * @example
 * <DateAndTime
 *   date={new Date()}
 *   time="3:45 - 4:45"
 *   hasReview={true}
 * />
 */

export const DateAndTime: React.FC<DateAndTimeProps> = ({
  date,
  time,
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
        <p className="text-sm text-text-primary leading-[100%]">{dateString}</p>
      </div>
      <div className="flex items-center gap-2">
        <IconClock size="4" />
        <p className="text-sm text-text-primary leading-[100%]">{time}</p>
      </div>
    </div>
  );
};
