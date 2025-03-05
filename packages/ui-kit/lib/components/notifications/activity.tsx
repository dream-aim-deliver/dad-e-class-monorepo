import { Button } from '../button';
import clsx from 'clsx';
import React, { FC, ReactNode } from 'react';
import { IconButton } from '../icon-button';
import { IconCheck } from '../icons/icon-check';

export interface ActivityProps {
  message?: string;
  actionButton?: string;
  dateTime?: string;
  isRead?: boolean;
  isEmpty?: boolean;
  hasChildren?: boolean;
  children?: ReactNode;
  showPlatform?: boolean;
  platformName?: string;
  showRecipients?: boolean;
  recipients?: string;
  layout?: 'horizontal' | 'vertical';
  onClick?: () => void;
  className?: string;
}

export const Activity: FC<ActivityProps> = ({
  message = 'Coach {coach-name} {coach-surname} accepted your request to reschedule the coaching session.',
  actionButton = 'Session details',
  dateTime = '2024-08-07 at 21:17',
  isRead = false,
  isEmpty = false,
  hasChildren = false,
  children,
  showPlatform = true,
  platformName = 'Platform Name',
  showRecipients = true,
  recipients = '88 Recipients',
  layout = 'horizontal', // Default layout
  onClick,
  className,
}) => {
  if (isEmpty) {
    return (
      <>
        {layout === 'horizontal' ? (
          <div
            data-testid="activity"
            className={clsx(
              'flex p-2 my-[2px] gap-4 flex-col items-center w-full bg-base-neutral-800 rounded-small ',
              className,
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-2 w-full">
                <div
                  data-testid="skeleton-title"
                  className="h-[16px] bg-base-neutral-700 rounded-medium w-[98%]"
                />
                <div
                  data-testid="skeleton-subtitle"
                  className="h-[8px] bg-base-neutral-700 rounded-medium w-[20%]"
                />
              </div>
              <div className="flex gap-2">
                <div
                  data-testid="skeleton-button"
                  className="h-[22px] bg-base-neutral-700 rounded-medium w-[60px]"
                />
                <div
                  data-testid="skeleton-icon"
                  className="h-[22px] bg-base-neutral-700 rounded-medium w-[22px]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className={clsx(
              'flex p-4 gap-4 my-[2px] items-center w-full bg-base-neutral-800 rounded-medium',
              className,
            )}
          >
            <div className="flex flex-col items-start gap-[11px] w-full">
              <div className="h-[24px] bg-base-neutral-700 rounded-medium w-full" />
              <div className="flex flex-col gap-2 items-start w-full">
                <div className="h-[8px] bg-base-neutral-700 rounded-medium w-full" />
                <div className="h-[8px] bg-base-neutral-700 rounded-medium w-[36%]" />
              </div>
            </div>
            <div className="h-[24px] w-[24px] bg-base-neutral-700 rounded-medium" />
          </div>
        )}
      </>
    );
  }

  return (
    <>
      {layout === 'vertical' && hasChildren && <>{children}</>}
      <div
        className={clsx(
          `flex p-2 my-[2px] flex-col items-center w-full border-b border-divider ${
            isRead ? 'bg-transparent' : 'bg-base-neutral-800 rounded-small'
          }`,
          layout === 'horizontal'
            ? 'flex-row items-center gap-4'
            : 'flex-col items-start',
          className,
        )}
      >
        {layout === 'horizontal' && (
          <div className="flex gap-4 items-center w-full justify-between">
            <div className="flex flex-col items-start gap-1">
              <p
                className={`text-sm text-text-primary leading-[150%] text-left`}
              >
                {message}
              </p>
              {hasChildren && <>{children}</>}
              <div className="flex gap-2">
                {showPlatform && (
                  <p className="text-2xs text-text-secondary leading-[100%]">
                    {platformName}
                  </p>
                )}
                {showRecipients && (
                  <p className="text-2xs text-text-secondary leading-[100%]">
                    {recipients}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center">
              <div className="flex gap-4 items-baseline">
                <Button
                  variant="text"
                  size="medium"
                  onClick={onClick}
                  text={actionButton}
                />
                <p className="text-2xs text-text-secondary leading-[100%]">
                  {dateTime}
                </p>
              </div>
              <IconButton icon={<IconCheck />} styles="text" size="medium" />
            </div>
          </div>
        )}

        {layout === 'vertical' && (
          <>
            <div className="flex justify-between items-center w-full">
              <p
                className={`text-sm text-text-primary lineHeight-[150%] text-left`}
              >
                {message}
              </p>
              <IconButton icon={<IconCheck />} styles="text" size="medium" />
            </div>

            <div className="flex justify-between items-center w-full">
              <Button
                variant="text"
                size="small"
                className="p-0"
                onClick={onClick}
                text={actionButton}
              />

              <div className="flex gap-2 items-center">
                {showRecipients && (
                  <p className="text-2xs text-text-secondary leading-[100%]">
                    {recipients}
                  </p>
                )}
                {showPlatform && (
                  <p className="text-2xs text-text-secondary leading-[100%]">
                    {platformName}
                  </p>
                )}
                <p className="text-2xs text-text-secondary leading-[100%]">
                  {dateTime}
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};
