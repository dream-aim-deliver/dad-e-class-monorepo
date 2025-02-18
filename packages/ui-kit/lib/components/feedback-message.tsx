import React, { FC } from 'react';
import { IconError } from './icons/icon-error';
import { IconSuccess } from './icons/icon-success';
import { IconWarning } from './icons/icon-warning';


export interface FeedBackMessageProps {
  type?: 'error' | 'success' | 'warning';
  message?: string;
}

/**
 * A component to display feedback messages with different types (error, success, warning).
 * 
 * @param type The type of feedback message (error, success, warning). Defaults to 'error'.
 * @param message The message to display. Defaults to 'Feedback Message'.
 * @returns A styled feedback message component with an appropriate icon.
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
        <IconError classNames='fill-feedback-error-primary' />
      ) : type === 'success' ? (
        <IconSuccess classNames='fill-feedback-success-primary' />
      ) : (
        <IconWarning classNames='fill-feedback-warning-primary' />
      )}
      <p className={`text-2xs ${textColorClass}`}>{message}</p>
    </div>
  );
};
