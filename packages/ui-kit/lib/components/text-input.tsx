import React, { FC } from 'react';
import { FeedBackMessage, FeedBackMessageProps } from './feedback-message';
import { InputField, InputFieldProps } from '@/components/input-Field';

export interface TextInputProps {
  label?: string;
  hasFeedback?: boolean;
  inputField: InputFieldProps;
  feedbackMessage?: FeedBackMessageProps;
  id?:string;
}

export const TextInput: FC<TextInputProps> = ({
  label = 'label',
  hasFeedback = false,
  inputField,
  feedbackMessage,
  id
}) => {
  const inputId =
    id || inputField.id || `input-${Math.random().toString(36).slice(2, 11)}`;

  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex flex-col items-start gap-[2px] w-full">
        <label className="text-text-secondary text-sm " htmlFor={inputId}>
          {label}
        </label>
        <InputField {...inputField} id={inputId} />
      </div>
      {hasFeedback && <FeedBackMessage {...feedbackMessage} />}
    </div>
  );
};
