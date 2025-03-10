import { Badge } from '../badge';
import React, { FC } from 'react';

export interface DragDropSessionProps {
  title?: string;
  duration?: string;
  isMoreThan1Available?: boolean;
  property1?: 'default' | 'empty';
}

export const DragDropSession: FC<DragDropSessionProps> = ({
  title,
  duration,
  isMoreThan1Available,
  property1 = 'default',
}) => {
  return (
    <>
      {property1 === 'empty' ? (
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
          {isMoreThan1Available && (
            <Badge
              className="h-[1.5rem] min-w-[2.0625rem] px-0 py-1 items-center justify-center text-sm leading-[100%]"
              text="x2"
            />
          )}
        </div>
      )}
    </>
  );
};
