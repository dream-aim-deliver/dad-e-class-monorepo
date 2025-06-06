import React, { FC } from 'react';
import { IconError } from './icons/icon-error';
import { IconSuccess } from './icons/icon-success';
import { IconWarning } from './icons/icon-warning';

export interface FeedBackMessageProps {
  type?: 'error' | 'success' | 'warning';
  message?: string;
}

/**
 * A reusable FeedBackMessage component for displaying feedback messages with corresponding icons and styles.
 *
 * @param type The type of feedback message. Options:
 *   - `error`: Displays an error icon and styles (default).
 *   - `success`: Displays a success icon and styles.
 *   - `warning`: Displays a warning icon and styles.
 * @param message The feedback message text to display. Defaults to "Feedback Message".
 *
 * @example
 * <FeedBackMessage type="success" message="Operation completed successfully!" />
 */

export const FeedBackMessage: FC<FeedBackMessageProps> = ({
  type = 'error',
  message = 'Feedback Message',
}) => {
  const textColorClass = {
    error: 'text-feedback-error-primary',
    success: 'text-feedback-success-primary',
    warning: 'text-feedback-warning-primary',
  }[type];

  return (
    <div className="flex space-x-2 items-center">
      {type === 'error' ? (
        <IconError classNames="fill-feedback-error-primary flex-shrink-0" />
      ) : type === 'success' ? (
        <IconSuccess classNames="fill-feedback-success-primary flex-shrink-0" />
      ) : (
        <IconWarning classNames="fill-feedback-warning-primary flex-shrink-0" />
      )}
      <p className={`text-sm ${textColorClass}`}>{message}</p>
    </div>
  );
};
