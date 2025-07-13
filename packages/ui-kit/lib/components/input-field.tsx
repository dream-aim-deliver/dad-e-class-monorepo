import React, { FC, ReactNode, useState } from 'react';
import { cn } from '../utils/style-utils';

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
  defaultValue?: string;
  setValue: (value: string) => void;
  type?: 'text' | 'password'|'number' |'url';
  id?: string;
  className?: string;
  inputClassName?: string;
  min?: number;
  max?: number;
}

/**
 * A reusable InputField component with support for multiple states, dynamic content, and customizable behavior.
 *
 * @param hasLeftContent Optional flag to indicate if there is content on the left side of the input field.
 * @param hasRightContent Optional flag to indicate if there is content on the right side of the input field.
 * @param leftContent Optional ReactNode to render on the left side of the input field (e.g., an icon).
 * @param rightContent Optional ReactNode to render on the right side of the input field (e.g., a clear button or icon).
 * @param inputText Placeholder text for the input field. Defaults to "Placeholder".
 * @param state The current state of the input field. Options:
 *   - `placeholder`: Default state with placeholder text (default).
 *   - `disabled`: Disabled state where interaction is not allowed.
 *   - `filled`: State indicating that the field is filled with valid data.
 *   - `filling`: State indicating that data is being entered into the field.
 *   - `warning`: State indicating a warning related to the data entered.
 *   - `error`: State indicating an error related to the data entered.
 * @param value The current value of the input field. This makes it a controlled component.
 * @param setValue Callback function triggered when the value changes. Receives the new value as a string.
 * @param type The type of input. Options: `text` (default) or `password`.
 * @param id Optional unique ID for identifying this specific input field (useful for testing or accessibility).
 * @param className Optional additional CSS classes to apply to the outer container.
 * @param inputClassName Optional additional CSS classes to apply to the input element.
 * @param defaultValue Optional default value for the input field, used when the component is first rendered.
 * @param min Optional minimum value for number inputs.
 * @param max Optional maximum value for number inputs.
 *
 * @example
 * <InputField
 *   hasLeftContent={true}
 *   leftContent={<IconSearch />}
 *   hasRightContent={true}
 *   rightContent={<ClearButton />}
 *   inputText="Search here..."
 *   state="filling"
 *   value={searchValue}
 *   setValue={(newValue) => setSearchValue(newValue)}
 * />
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
  className,
  inputClassName,
  defaultValue,
  min,
  max
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
      className={cn(`flex gap-2 items-start justify-center flex-col px-3 py-[10px] bg-input-fill border rounded-medium
      ${stateClasses[state]}
      ${className}
      `)}
    >
      <div className="flex items-center gap-2 w-full h-full">
        {hasLeftContent && leftContent}
        <input
          defaultValue={defaultValue}
          data-testid={id}
          type={type}
          placeholder={inputText}
          disabled={state === 'disabled'}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setBorderColor(true)}
          onBlur={() => setBorderColor(false)}
          min={min}
          max={max}
          className={cn("bg-transparent outline-none [-moz-appearance:textfield] flex-1 placeholder-text-secondary h-full w-full appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",inputClassName)}
        />
        {hasRightContent && rightContent}
      </div>
    </div>
  );
};
