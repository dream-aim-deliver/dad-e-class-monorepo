import { Badge } from '../badge';
import { FC } from 'react';

export interface DragDropSessionProps {
  title?: string;
  time?: number;
  durationMinutes?: string;
  numberOfSessions?: number;
  isLoading?: boolean;
}

/**
 * Displays individual coaching sessions with title, duration, and remaining session count.
 */
export const DragDropSession: FC<DragDropSessionProps> = ({
  title,
  time,
  numberOfSessions,
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
        <div className="flex gap-2 p-2 items-center justify-between bg-card-stroke border border-divider rounded-medium w-full">
          <div className="flex flex-col gap-1 items-start">
            <p className="text-sm text-text-primary font-bold leading-[100%]">{title}</p>
            <p className="text-sm text-text-secondary leading-[100%]">
              {time} {durationMinutes}
            </p>
          </div>
          {numberOfSessions && numberOfSessions > 1 && (
            <Badge
              className="h-[1.5rem] min-w-[2.0625rem] px-0 py-1 items-center justify-center text-sm leading-[100%]"
              text={'x' + numberOfSessions.toString()}
            />
          )}
        </div>
      )}
    </>
  );
};