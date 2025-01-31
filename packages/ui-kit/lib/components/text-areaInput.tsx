import React, { FC } from 'react';

export interface TextAreaInputProps {
  label?: string;
  value: string;
  setValue: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export const TextAreaInput: FC<TextAreaInputProps> = ({
  label,
  value,
  setValue,
  placeholder = 'Enter text here',
  className = '',
}) => {
  return (
    <div className="flex flex-col gap-2 items-start">
      {label && <label className="text-sm text-text-secondary">{label}</label>}
      <textarea
        className={`w-full px-3 py-[10px] bg-input-fill text-text-primary border border-input-stroke rounded-medium focus:outline-none placeholder:text-text-secondary ${className}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
    </div>
  );
};
