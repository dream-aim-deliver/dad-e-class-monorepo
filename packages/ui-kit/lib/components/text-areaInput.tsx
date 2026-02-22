import React, { FC } from 'react';

export interface TextAreaInputProps {
  label?: string;
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  className?: string;
  required?: boolean;
}

/**
 * A reusable TextAreaInput component for capturing multi-line text input with optional labels and placeholders.
 *
 * @param label Optional label to display above the textarea.
 * @param value The current value of the textarea. This makes it a controlled component.
 * @param setValue Callback function triggered when the textarea value changes. Receives the new value as a string.
 * @param placeholder Placeholder text for the textarea. Defaults to "Enter text here".
 * @param className Optional additional CSS classes for customizing the appearance of the textarea.
 *
 * @example
 * <TextAreaInput
 *   label="Description"
 *   value={description}
 *   setValue={(newValue) => setDescription(newValue)}
 *   placeholder="Enter your description here"
 *   className="custom-class"
 * />
 */
export const TextAreaInput: FC<TextAreaInputProps> = ({
  label,
  value,
  setValue,
  placeholder = '',
  className = '',
  required = false,
}) => {
  return (
    <div className="flex flex-col gap-2 items-start w-full">
      {label && <label className="text-sm text-text-secondary">{label}{required && <span className="text-error ml-1">*</span>}</label>}
      <textarea
        className={`w-full px-3 py-[10px] bg-input-fill text-text-primary border border-input-stroke rounded-medium focus:outline-none placeholder:text-text-secondary ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
