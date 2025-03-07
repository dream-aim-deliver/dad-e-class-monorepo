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

/**
 * A reusable Activity component with support for multiple layouts, empty states, and customizable content.
 *
 * @param message Optional main text to display in the activity.
 * @param actionButton Optional text for the action button.
 * @param dateTime Optional date and time string for the activity.
 * @param isRead Optional flag indicating whether the activity has been read.
 * @param isEmpty Optional flag to display an empty state (skeleton loader).
 * @param hasChildren Optional flag indicating whether child elements are present.
 * @param children Optional child elements to render within the component.
 * @param showPlatform Optional flag to display the platform name.
 * @param platformName Optional name of the platform to display.
 * @param showRecipients Optional flag to display the number of recipients.
 * @param recipients Optional text for the number of recipients.
 * @param layout Optional layout orientation ('horizontal' or 'vertical').
 * @param onClick Optional callback function for the action button click.
 * @param className Optional additional CSS class names to customize the component's appearance.
 *
 * @example
 * <Activity
 *   message="New message received"
 *   actionButton="View Details"
 *   dateTime="2024-08-07 at 21:17"
 *   layout="vertical"
 *   onClick={() => console.log("Action clicked!")}
 * />
 */

export const Activity: FC<ActivityProps> = ({
  message = '',
  actionButton = '',
  dateTime = '',
  isRead = false,
  isEmpty = false,
  hasChildren = false,
  children,
  showPlatform = true,
  platformName = '',
  showRecipients = true,
  recipients = '',
  layout = 'horizontal',
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
              'flex p-2 my-[0.125rem] gap-4 flex-col items-center w-full bg-base-neutral-800 rounded-small ',
              className,
            )}
          >
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-2 w-full">
                <div
                  data-testid="skeleton-title"
                  className="h-[1rem] bg-base-neutral-700 rounded-medium w-[98%]"
                />
                <div
                  data-testid="skeleton-subtitle"
                  className="h-[0.5rem] bg-base-neutral-700 rounded-medium w-[20%]"
                />
              </div>
              <div className="flex gap-2">
                <div
                  data-testid="skeleton-button"
                  className="h-[1.375rem] bg-base-neutral-700 rounded-medium w-[3.75rem]"
                />
                <div
                  data-testid="skeleton-icon"
                  className="h-[1.375rem] bg-base-neutral-700 rounded-medium w-[1.375rem]"
                />
              </div>
            </div>
          </div>
        ) : (
          <div
            className={clsx(
              'flex p-4 gap-4 my-[0.125rem] items-center w-full bg-base-neutral-800 rounded-medium',
              className,
            )}
          >
            <div className="flex flex-col items-start gap-[0.6875rem] w-full">
              <div className="h-[1.5rem] bg-base-neutral-700 rounded-medium w-full" />
              <div className="flex flex-col gap-2 items-start w-full">
                <div className="h-[0.5rem] bg-base-neutral-700 rounded-medium w-full" />
                <div className="h-[0.5rem] bg-base-neutral-700 rounded-medium w-[36%]" />
              </div>
            </div>
            <div className="h-[1.5rem] w-[1.5rem] bg-base-neutral-700 rounded-medium" />
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
          `flex p-2 my-[0.125rem] flex-col items-center w-full border-b border-divider ${
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
                  <p className="text-xs text-text-secondary leading-[100%] ">
                    {platformName}
                  </p>
                )}
                {showRecipients && (
                  <p className="text-xs text-text-secondary leading-[100%]">
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
                  className="whitespace-nowrap p-0"
                />
                <p className="text-xs text-text-secondary leading-[100%] whitespace-nowrap">
                  {dateTime}
                </p>
              </div>
              {!isRead && (
                <IconButton icon={<IconCheck />} styles="text" size="medium" />
              )}
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
              {!isRead && (
                <IconButton icon={<IconCheck />} styles="text" size="medium" />
              )}
            </div>

            <div className="flex justify-between items-center w-full">
              <Button
                variant="text"
                size="small"
                className="p-0 whitespace-nowrap"
                onClick={onClick}
                text={actionButton}
              />

              <div className="flex gap-2 items-center">
                {showRecipients && (
                  <p className="text-xs text-text-secondary leading-[100%]">
                    {recipients}
                  </p>
                )}
                {showPlatform && (
                  <p className="text-xs text-text-secondary leading-[100%]">
                    {platformName}
                  </p>
                )}
                <p className="text-xs text-text-secondary leading-[100%] whitespace-nowrap">
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
