import { Button } from '../button';
import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import { notification } from '@maany_shr/e-class-models';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface ActivityProps extends notification.TNotification, isLocalAware {
  children?: ReactNode;
  platformName?: string;
  recipients?: number;
  layout?: 'horizontal' | 'vertical';
  onClickActivity?: (url: string) => () => void;
  className?: string;
}

/**
 * Activity component for displaying notifications or activities in a customizable layout.
 * It supports horizontal and vertical layouts and provides options for interaction.
 *
 * @param message The main message or content of the activity.
 * @param action An object containing action details such as title and URL.
 * @param timestamp The timestamp of when the activity occurred, formatted as a string.
 * @param isRead A boolean indicating whether the activity has been read.
 * @param children Optional ReactNode elements to be displayed within the component.
 * @param platformName Optional name of the platform associated with the activity.
 * @param recipients Optional number of recipients involved in the activity.
 * @param layout Specifies the layout of the component. Can be either 'horizontal' or 'vertical'.
 * @param className Optional custom class name for styling the component.
 * @param onClickActivity Callback function triggered when the activity is clicked. Accepts a URL as an argument.
 * @param locale The locale used for translation and localization purposes.
 *
 * @example
 * <Activity
 *   message="New course available!"
 *   action={{ title: "View Course", url: "/course/123" }}
 *   timestamp="2025-04-07T12:30:00Z"
 *   isRead={false}
 *   platformName="E-Class"
 *   recipients={100}
 *   layout="horizontal"
 *   onClickActivity={(url) => () => console.log(`Redirecting to ${url}`)}
 *   locale="en"
 * />
 */

export const Activity: FC<ActivityProps> = ({
  message = '',
  action,
  timestamp,
  isRead = false,
  children,
  platformName = '',
  recipients,
  layout = 'horizontal',
  className,
  onClickActivity,
  locale,
}) => {
  const dictionary = getDictionary(locale);

  // Function to format date and time
  const formatDateTime = (timestamp?: string) => {
    if (!timestamp) return null; // Handle case where timestamp is empty or undefined
    const date = new Date(timestamp);
    const formattedDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
    const formattedTime = date.toTimeString().split(' ')[0].slice(0, 5); // 'HH:MM'
    return { formattedDate, formattedTime };
  };
  const formattedDateTime = formatDateTime(timestamp);
  const atText = dictionary?.components?.activity?.atText;
  const recipientsText = dictionary?.components?.activity?.recipientsText;

  // Skeleton for empty message
  if (!message || message === '') {
    return layout === 'horizontal' ? (
      <div
        data-testid="activity"
        className={clsx(
          'flex p-2 my-[0.125rem] gap-4 flex-col items-center w-full bg-base-neutral-800 rounded-small',
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
    );
  }

  return (
    <div
      data-testid="activity"
      onClick={onClickActivity?.(action?.url ?? '')}
      className={clsx(
        `flex p-2 my-[0.125rem] flex-col items-center w-full border-b border-divider cursor-pointer ${
          isRead ? 'bg-transparent' : 'bg-base-neutral-800 rounded-small'
        }`,
        layout === 'horizontal' ? 'flex-row items-center gap-4' : 'flex-col items-start',
        className,
      )}
    >
      {/* Horizontal layout */}
      {layout === 'horizontal' && (
        <div className="flex gap-4 items-center w-full justify-between">
          <div className="flex flex-col items-start gap-1">
            <p className="text-sm text-text-primary leading-[150%] text-left">{message}</p>
            {children}
            <div className="flex gap-2">
              {platformName && (
                <p className="text-xs text-text-secondary leading-[100%]">{platformName}</p>
              )}
              {recipients > 0 && (
                <p className="text-xs text-text-secondary leading-[100%]">
                  {recipientsText} {recipients}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex gap-4 items-baseline">
              {action?.title && (
                <Button
                  variant="text"
                  size="small"
                  text={action.title}
                  className="whitespace-nowrap p-0 max-w-[15rem]"
                />
              )}
              {formattedDateTime && (
                <p className="text-xs text-text-secondary leading-[100%] whitespace-nowrap">
                  {formattedDateTime.formattedDate} {atText} {formattedDateTime.formattedTime}
                </p>
              )}
            </div>
            {!isRead && (
              <span className="w-2 h-2 rounded-full bg-button-primary-fill flex-shrink-0" />
            )}
          </div>
        </div>
      )}
      {/* Vertical layout */}
      {layout === 'vertical' && (
        <>
          <div className="flex justify-between items-start w-full gap-4">
            <p className="text-sm text-text-primary leading-[150%] text-left">{message}</p>
            {!isRead && (
              <span className="w-2 h-2 rounded-full bg-button-primary-fill flex-shrink-0" />
            )}
          </div>
          {children}
          <div className="flex justify-between items-center w-full">
            {action?.title && (
              <Button
                variant="text"
                size="small"
                text={action.title}
                className="whitespace-nowrap p-0 max-w-[20rem]"
              />
            )}
            <div className="flex gap-2 items-center">
              {recipients > 0 && (
                <p className="text-xs text-text-secondary leading-[100%]">
                  {recipientsText} {recipients}
                </p>
              )}
              {platformName && (
                <p className="text-xs text-text-secondary leading-[100%]">{platformName}</p>
              )}
              {formattedDateTime && (
                <p className="text-xs text-text-secondary leading-[100%] whitespace-nowrap">
                  {formattedDateTime.formattedDate} {atText} {formattedDateTime.formattedTime}
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};