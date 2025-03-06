import * as React from 'react';
import { IconCalendarAlt } from '../icons/icon-calendar-alt';
import { IconClock } from '../icons/icon-clock';

export interface TimeInfoProps {
  date: string;
  time: string;
}

/**
 * A reusable component that displays date and time information with corresponding icons.
 *
 * @param date The date to be displayed.
 * @param time The time to be displayed.
 *
 * @example
 * <TimeInfo date="March 6, 2025" time="12:30 PM" />
 */

export function TimeInfo({ date, time }: TimeInfoProps) {
  return (
    <div className="flex p-3 items-start flex-col gap-3 bg-base-neutral-800 rounded-small border border-base-neutral-700 text-text-primary">
      <div className="flex items-center gap-2">
        <IconCalendarAlt size="4" />
        <p className="text-sm text-text-primary leading-[100%]">{date}</p>
      </div>
      <div className="flex items-center gap-2">
        <IconClock size="4" />
        <p className="text-sm text-text-primary leading-[100%]">{time}</p>
      </div>
    </div>
  );
}
