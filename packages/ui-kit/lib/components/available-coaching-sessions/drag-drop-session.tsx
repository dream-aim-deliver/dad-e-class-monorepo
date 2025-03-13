import { Badge } from '../badge';
import React, { FC } from 'react';

export interface DragDropSessionProps {
  title?: string;
  duration?: string;
  numberofSessions?: number;
  isEmpty?: 'default' | 'empty';
}

/**
 * A reusable component that displays individual coaching sessions with a title, duration, 
 * and session count. It also supports an empty state for loading placeholders.
 *
 * @param title The title of the coaching session.
 * @param duration The duration of the session (e.g., "60 min").
 * @param numberofSessions The number of available sessions. Displays a badge if greater than 1.
 * @param isEmpty Determines whether to show session details or a placeholder. Options: `'default' | 'empty'`. Defaults to `'default'`.
 *
 * @example
 * <DragDropSession
 *   title="React Coaching"
 *   duration="60 min"
 *   numberofSessions={2}
 * />
 *
 * @example
 * // Empty state
 * <DragDropSession isEmpty="empty" />
 */
export const DragDropSession: FC<DragDropSessionProps> = ({
  title,
  duration,
  numberofSessions,
  isEmpty = 'default',
}) => {
  return (
    <>
      {isEmpty === 'empty' ? (
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
              {duration}
            </p>
          </div>
          {numberofSessions > 1 && (
            <Badge
              className="h-[1.5rem] min-w-[2.0625rem] px-0 py-1 items-center justify-center text-sm leading-[100%]"
              text={"x" + numberofSessions.toString()}
            />
          )}
        </div>
      )}
    </>
  );
};
