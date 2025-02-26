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
    <div className="flex gap-[2px] items-center">
      {type === 'error' ? (
        <IconError classNames="fill-feedback-error-primary" />
      ) : type === 'success' ? (
        <IconSuccess classNames="fill-feedback-success-primary" />
      ) : (
        <IconWarning classNames="fill-feedback-warning-primary" />
      )}
      <p className={`text-2xs ${textColorClass}`}>{message}</p>
    </div>
  );
};
