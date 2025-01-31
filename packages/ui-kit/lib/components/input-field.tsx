import React, { FC, ReactNode } from 'react';

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
  type?: 'text' | 'date' | 'password';
  id?: string;
}

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
  const stateClasses = {
    placeholder:
      'border-input-stroke text-text-primary hover:border-base-neutral-400',
    disabled: 'border-input-stroke opacity-60 cursor-not-allowed',
    filled: 'border-input-stroke text-text-primary',
    filling: 'border-base-neutral-400 text-text-primary',
    warning: 'border-feedback-warning-primary text-text-primary',
    error: 'border-feedback-error-primary text-text-primary',
  };

  return (
    <div
      className={`flex gap-2 items-start justify-center flex-col px-3 py-[10px] bg-input-fill border rounded-medium w-full ${
        stateClasses[state]
      }`}
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
          className="bg-transparent outline-none flex-1 placeholder-text-secondary"
        />
        {hasRightContent && rightContent}
      </div>
    </div>
  );
};
