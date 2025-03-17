import { Badge } from '../badge';
import React, { FC } from 'react';

export interface DragDropSessionProps {
  title?: string;
  time?: number;
  durationMinutes?: string;
  numberofSessions?: number;
  isLoading?: boolean;
}

/**
 * A reusable component that displays individual coaching sessions with a title, duration,
 * and session count. It also supports an empty state for loading placeholders.
 *
 * @param title The title of the coaching session.
 * @params durationMinutes The duration of the session (e.g., minutes).
 * @param time The time of the session (e.g., 60).
 * @param numberofSessions The number of available sessions. Displays a badge if greater than 1.
 * @param isLoading A boolean value to check if the data is loading or not.
 * @example
 * <DragDropSession
 *   title="React Coaching"
 *   time={60}
 *   numberofSessions={2}
 *   durationMinutes="minutes"
 * />
 */
export const DragDropSession: FC<DragDropSessionProps> = ({
  title,
  time,
  numberofSessions,
  durationMinutes,
  isLoading = false,
}) => {
  return (
    <>
      {isLoading ? (
        <div className="flex p-2 gap-4 justify-center items-center bg-card-stroke border border-divider rounded-medium w-full">
          <div className="flex flex-col gap-1 items-start w-full">
            <div className="h-[0.875rem] w-full bg-divider rounded-small"></div>
            <div className="h-[0.875rem] w-[3.625rem] bg-divider rounded-small"></div>
          </div>
          <div className="h-[0.875rem] w-[2.25rem] bg-divider rounded-small"></div>
        </div>
      ) : (
        <div className="flex  gap-2 p-2 items-center justify-between bg-card-stroke border border-divider rounded-medium w-full">
          <div className="flex flex-col gap-1 items-start">
            <p className="text-sm text-text-primary font-bold leading-[100%]">
              {title}
            </p>
            <p className="text-sm text-text-secondary leading-[100%]">
              {time} {durationMinutes}
            </p>
          </div>
          {numberofSessions > 1 && (
            <Badge
              className="h-[1.5rem] min-w-[2.0625rem] px-0 py-1 items-center justify-center text-sm leading-[100%]"
              text={'x' + numberofSessions.toString()}
            />
          )}
        </div>
      )}
    </>
  );
};
