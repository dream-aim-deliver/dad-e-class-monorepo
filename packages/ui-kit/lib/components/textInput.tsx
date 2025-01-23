import React, { FC } from 'react';
import { FeedBackMessage, FeedBackMessageProps } from './feedbackMessage';
import { InputField, InputFieldProps } from './inputField';

export interface TextInputProps {
  label?: string;
  hasFeedback?: boolean;
  inputField: InputFieldProps;
  feedbackMessage?: FeedBackMessageProps;
}

export const TextInput: FC<TextInputProps> = ({
  label = 'label',
  hasFeedback = false,
  inputField,
  feedbackMessage,
}) => {
  return (
    <div className="flex flex-col items-start gap-1">
      <div className="flex flex-col items-start gap-[2px] w-full">
        <p className="text-text-secondary text-sm ">{label}</p>
        <InputField {...inputField} />
      </div>
      {hasFeedback && <FeedBackMessage {...feedbackMessage} />}
    </div>
  );
};
