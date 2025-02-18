import React, { useRef } from 'react';
import { IconButton } from './icon-button';
import { IconCalendarAvailability } from './icons/icon-calendar-availability';

export interface DateInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * A reusable DateInput component with an integrated calendar picker.
 *
 * @param label Optional label for the date input field.
 * @param value The selected date in string format.
 * @param onChange Callback function triggered when the date is changed.
 * @returns A customizable date input field with a calendar icon for selecting a date.
 */
export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  label,
}) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    dateInputRef.current?.showPicker();
  };

  return (
    <div
      className="flex flex-col w-full justify-start max-md:max-w-full"
      data-testid="date-input-container"
    >
      {label && (
        <label
          htmlFor="date-input"
          className="flex-1 shrink gap-2 self-stretch w-full text-sm leading-none min-h-[22px] text-text-secondary max-md:max-w-full text-left flex items-start"
          data-testid="date-input-label"
        >
          {label}
        </label>
      )}
      <div
        className="relative flex justify-between items-center px-3 py-2 w-full rounded-medium border border-solid bg-input-fill border-input-stroke min-h-[40px] max-md:max-w-full hover:border-base-neutral-400 cursor-pointer"
        data-testid="date-input-wrapper"
      >
        {/* Hide the default calendar icon in Firefox */}
        <input
          id="date-input"
          ref={dateInputRef}
          type="date"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent border-none text-md text-text-primary outline-none appearance-none relative placeholder:text-text-secondary [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:pointer-events-none [&::-moz-calendar-picker-indicator]:opacity-0 [&::-moz-calendar-picker-indicator]:pointer-events-none"
          data-testid="date-input-field"
        />

        {/* Custom calendar icon */}
        <IconButton
          size="small"
          styles="text"
          icon={<IconCalendarAvailability />}
          onClick={handleIconClick}
          data-testid="date-input-icon-button"
        />
      </div>
    </div>
  );
};
