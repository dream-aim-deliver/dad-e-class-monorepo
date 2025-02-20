import React, { FC } from 'react';
import { FeedBackMessage, FeedBackMessageProps } from './feedback-message';
import { InputField, InputFieldProps } from './input-field';

export interface TextInputProps {
  label?: string;
  hasFeedback?: boolean;
  inputField: InputFieldProps;
  feedbackMessage?: FeedBackMessageProps;
  id?: string;
}

/**
 * A reusable TextInput component that combines an input field with optional labels and feedback messages.
 *
 * @param label Optional label to display above the input field. Defaults to "label".
 * @param hasFeedback Optional flag to indicate if feedback messages should be displayed. Defaults to `false`.
 * @param inputField Props for the underlying `InputField` component (e.g., value, setValue, placeholder).
 * @param feedbackMessage Props for the optional `FeedBackMessage` component (e.g., type, message).
 * @param id Optional unique ID for the input field. If not provided, a random ID is generated.
 *
 * @example
 * <TextInput
 *   label="Username"
 *   hasFeedback={true}
 *   inputField={{
 *     value: username,
 *     setValue: (newValue) => setUsername(newValue),
 *     placeholder: "Enter your username",
 *   }}
 *   feedbackMessage={{
 *     type: "error",
 *     message: "Username is required",
 *   }}
 * />
 */

export const TextInput: FC<TextInputProps> = ({
  label = 'label',
  hasFeedback = false,
  inputField,
  feedbackMessage,
  id,
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
