import React, { useRef, useEffect, useState } from 'react';
import { IconButton } from './icon-button';
import { IconCalendarAlt } from './icons/icon-calendar-alt';

export interface DateInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * A reusable DateInput component with a custom calendar icon and optional label.
 * The date picker opens below the text field when clicked.
 *
 * @param label Optional label to display above the date input field.
 * @param value The current value of the date input field (in ISO format).
 * @param onChange Callback function triggered when the date value changes. Receives the new date as a string.
 *
 * @example
 * <DateInput
 *   label="Select a Date"
 *   value="2023-10-01"
 *   onChange={(date) => console.log("Selected date:", date)}
 * />
 */
export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  label,
}) => {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);
  const [isFirefox, setIsFirefox] = useState(false);

  useEffect(() => {
    // Detect Firefox browser
    setIsFirefox(navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
    
    // Apply Firefox-specific positioning if needed
    if (isFirefox && dateInputRef.current) {
      const styleElement = document.createElement('style');
      styleElement.textContent = `
        /* Firefox date picker positioning */
        #${dateInputRef.current.id}::-moz-calendar-picker-wrapper {
          margin-top: 40px !important;
        }
      `;
      document.head.appendChild(styleElement);
      
      return () => {
        document.head.removeChild(styleElement);
      };
    }
  }, [isFirefox]);

  const handleTextFieldClick = () => {
    if (dateInputRef.current) {
      dateInputRef.current.showPicker();
      
      // In some browsers, we need to apply additional positioning
      if (!isFirefox && wrapperRef.current) {
        const wrapperRect = wrapperRef.current.getBoundingClientRect();
        
        // For webkit browsers, we can create a style to position the calendar
        const styleElement = document.createElement('style');
        styleElement.textContent = `
          ::-webkit-datetime-edit-fields-wrapper {
            position: relative;
          }
          ::-webkit-calendar-picker-indicator {
            position: relative;
          }
          ::-webkit-calendar-picker {
            margin-top: ${wrapperRect.height + 8}px !important;
          }
        `;
        document.head.appendChild(styleElement);
        
        // Remove the style after a short delay
        setTimeout(() => {
          document.head.removeChild(styleElement);
        }, 500);
      }
    }
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
        ref={wrapperRef}
        className="relative flex justify-between items-center px-3 py-2 w-full rounded-medium border border-solid bg-input-fill border-input-stroke min-h-[40px] max-md:max-w-full hover:border-base-neutral-400 cursor-pointer"
        data-testid="date-input-wrapper"
        onClick={handleTextFieldClick}
      >
        {/* For custom Firefox styling */}
        {isFirefox && (
          <style>
            {`
              input[type="date"]::-moz-calendar-picker-indicator {
                opacity: 0;
                width: 100%;
                height: 100%;
                position: absolute;
                top: 0;
                left: 0;
                cursor: pointer;
              }
            `}
          </style>
        )}
        
        {/* Custom date input wrapper to manage the hidden input */}
        <div className="relative flex-1">
          <input
            id="date-input"
            ref={dateInputRef}
            type="date"
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className={`w-full h-full absolute top-3 left-0 opacity-0 cursor-pointer ${isFirefox ? 'z-10' : ''}`}
            data-testid="date-input-field"
          />
          
          {/* Visible text that shows the selected date */}
          <div className="text-md text-text-primary">
            {value ? new Date(value).toLocaleDateString() : "Select a date..."}
          </div>
        </div>

        {/* Custom calendar icon */}
        <IconButton
          size="small"
          styles="text"
          icon={<IconCalendarAlt />}
          onClick={handleTextFieldClick}
          data-testid="date-input-icon-button"
        />
      </div>
    </div>
  );
};