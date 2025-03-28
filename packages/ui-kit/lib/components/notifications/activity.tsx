import { Button } from '../button';
import clsx from 'clsx';
import { FC, ReactNode } from 'react';
import {notification} from '@maany_shr/e-class-models'
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface ActivityProps  extends notification.TNotification , isLocalAware {
  children?: ReactNode;
  platformName?: string;
  recipients?: number;
  layout?: 'horizontal' | 'vertical';
  className?: string;
}

/**
 * Activity component that displays notifications with optional actions.
 * Supports both horizontal and vertical layouts.
 *
 * @param message The main notification message.
 * @param action An optional action object containing the title for the button.
 * @param timestamp The timestamp of the notification.
 * @param isRead Indicates if the notification has been read (default: false).
 * @param children Optional additional content to display within the notification.
 * @param platformName Optional name of the platform related to the notification.
 * @param recipients Optional number of recipients for the notification.
 * @param layout Defines the layout style ('horizontal' or 'vertical', default: 'horizontal').
 * @param className Optional additional CSS class names for customization.
 * @param locale The locale used for translations.
 *
 * @example
 * <Activity
 *   message="New course available!"
 *   action={{ title: "View Course" }}
 *   timestamp="2024-03-27T12:00:00Z"
 *   isRead={false}
 *   platformName="E-Class"
 *   recipients={10}
 *   layout="horizontal"
 * />
 */

export const Activity: FC<ActivityProps> = ({
  message = '',
  action,
  timestamp ,
  isRead = false,
  children,
  platformName = '',
  recipients ,
  layout = 'horizontal',
  className,
  locale
}) => {
  const dictionary = getDictionary(locale);

  // Function to format date and time
  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
  
    const formattedDate = date.toISOString().split("T")[0]; // Extracts 'YYYY-MM-DD'
    const formattedTime = date.toTimeString().split(" ")[0].slice(0, 5); // Extracts 'HH:MM'
  
    return { formattedDate, formattedTime };
  };
  const { formattedDate, formattedTime } = formatDateTime(timestamp);
  const atText = dictionary?.components?.activity?.atText;
  const recipientsText = dictionary?.components?.activity?.recipientsText;

  // Check if the message is empty
  if (!message || message === '') {
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
      {layout === 'vertical' && children && <>{children}</>}
      <a href={action.url} className="block">
        <div
          data-testid="activity"
          className={clsx(
            `flex p-2 my-[0.125rem] flex-col items-center w-full border-b border-divider cursor-pointer ${
              isRead ? 'bg-transparent' : 'bg-base-neutral-800 rounded-small'
            }`,
            layout === 'horizontal'
              ? 'flex-row items-center gap-4'
              : 'flex-col items-start',
            className,
          )}
        >
          {/* Horizontal layout */}
          {layout === 'horizontal' && (
            <div className="flex gap-4 items-center w-full justify-between">
              <div className="flex flex-col items-start gap-1">
                <p
                  className={`text-sm text-text-primary leading-[150%] text-left`}
                >
                  {message}
                </p>
                {children && <>{children}</>}
                <div className="flex gap-2">
                  {platformName && (
                    <p className="text-xs text-text-secondary leading-[100%] ">
                      {platformName}
                    </p>
                  )}
                  {recipients && (
                    <p className="text-xs text-text-secondary leading-[100%]">
                      {recipientsText} {recipients}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="flex gap-4 items-baseline">
                  <Button
                    variant="text"
                    size="medium"
                    text={action.title}
                    className="whitespace-nowrap p-0 max-w-[15rem]"
                  />
                  <p className="text-xs text-text-secondary leading-[100%] whitespace-nowrap">
                    {formattedDate} {atText} {formattedTime}
                  </p>
                </div>
                {!isRead && (
                  <button
                    className="w-3 h-3 ml-2 rounded-full transition-colors duration-200 bg-button-primary-fill flex-shrink-0"
                  />
                )}
              </div>
            </div>
          )}
          {/* Vertical layout */}
          {layout === 'vertical' && (
            <>
              <div className="flex justify-between items-center w-full">
                <p
                  className={`text-sm text-text-primary lineHeight-[150%] text-left`}
                >
                  {message}
                </p>
                {!isRead && (
                  <button
                    className="w-3 h-3 rounded-full transition-colors duration-200 bg-button-primary-fill flex-shrink-0"
                  />
                )}
              </div>

              <div className="flex justify-between items-center w-full">
                <Button
                  variant="text"
                  size="medium"
                  text={action.title}
                  className="whitespace-nowrap p-0 max-w-[20rem]"
                />
                <div className="flex gap-2 items-center">
                  {recipients && (
                    <p className="text-xs text-text-secondary leading-[100%]">
                      {recipientsText} {recipients}
                    </p>
                  )}
                  {platformName && (
                    <p className="text-xs text-text-secondary leading-[100%]">
                      {platformName}
                    </p>
                  )}
                  <p className="text-xs text-text-secondary leading-[100%] whitespace-nowrap">
                  {formattedDate} {atText} {formattedTime}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </a>
    </>
  );
};
