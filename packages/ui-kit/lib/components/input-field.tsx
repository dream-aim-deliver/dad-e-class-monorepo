import React, { FC, ReactNode, useState } from 'react';

export interface InputFieldProps {
  hasLeftContent?: boolean;
  hasRightContent?: boolean;
  leftContent?: ReactNode;
  rightContent?: ReactNode;
  inputText?: string;
  state?:
    | 'placeholder'
    | 'disabled'
    | 'filled'
    | 'filling'
    | 'warning'
    | 'error';
  value?: string;
  setValue: (value: string) => void;
  type?: 'text' | 'password';
  id?: string;
}

/**
 * A reusable InputField component with optional left and right content.
 *
 * @param hasLeftContent If true, displays content on the left side of the input field.
 * @param hasRightContent If true, displays content on the right side of the input field.
 * @param leftContent React node to be displayed on the left side of the input field.
 * @param rightContent React node to be displayed on the right side of the input field.
 * @param inputText The placeholder text for the input field.
 * @param state Determines the visual appearance of the input field.
 * @param value The current value of the input field.
 * @param setValue Function to update the input field's value.
 * @param type Specifies the type of input field (e.g., text, password).
 * @param id Unique identifier for the input field, useful for testing or accessibility.
 * @returns A styled input field component.
 */

export const InputField: FC<InputFieldProps> = ({
  hasLeftContent = false,
  hasRightContent = false,
  leftContent,
  rightContent,
  inputText = 'Placeholder',
  state = 'placeholder',
  value,
  setValue,
  type = 'text',
  id,
}) => {
  const [borderColor, setBorderColor] = useState(false);
  

  const stateClasses = {
    placeholder: `text-text-primary ${borderColor ? 'border-base-neutral-400' : 'border-input-stroke'}`,
    disabled: 'border-input-stroke opacity-60 cursor-not-allowed',
    filled: 'border-input-stroke text-text-primary',
    filling: 'border-base-neutral-400 text-text-primary',
    warning: 'border-feedback-warning-primary text-text-primary',
    error: 'border-feedback-error-primary text-text-primary',
  };

  return (
    <div
      className={`flex gap-2 items-start justify-center flex-col px-3 py-[10px] bg-input-fill border rounded-medium w-full 
      ${stateClasses[state]} 
      `}
    >
      <div className="flex items-center gap-2 w-full">
        {hasLeftContent && leftContent}
        <input
          data-testid={id}
          type={type}
          placeholder={inputText}
          disabled={state === 'disabled'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setBorderColor(true)}
          onBlur={() => setBorderColor(false)}
          className="bg-transparent outline-none flex-1 placeholder-text-secondary min-w-0"
        />
        {hasRightContent && rightContent}
      </div>
    </div>
  );
};
