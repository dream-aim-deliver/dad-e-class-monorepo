import React, { FC } from 'react';
import { FeedBackMessage, FeedBackMessageProps } from './feedback-message';
import { InputField, InputFieldProps } from './input-field';

export interface TextInputProps {
  label?: string;
  hasFeedback?: boolean;
  inputField: InputFieldProps;
  feedbackMessage?: FeedBackMessageProps;
  id?:string;
}
/**
 * A reusable TextInput component that includes a label, an input field, and an optional feedback message.
 * 
 * @param label The label displayed above the input field. Defaults to 'label'.
 * @param hasFeedback If true, displays a feedback message below the input field.
 * @param inputField Props to configure the InputField component.
 * @param feedbackMessage Props to configure the FeedBackMessage component (if hasFeedback is true).
 * @param id Optional unique identifier for the input field. If not provided, it generates a random ID.
 * @returns A styled text input field with an optional label and feedback message.
 */
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
