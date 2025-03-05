import * as React from 'react';
import { TimeInfoProps } from './types';
import { IconCalendarAlt } from '../icons/icon-calendar-alt';
import { IconClock } from '../icons/icon-clock';

export function TimeInfo({ date, time }: TimeInfoProps) {
  return (
    <div className="flex p-3 items-start flex-col gap-3 bg-base-neutral-800 rounded-small border border-base-neutral-700">
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
