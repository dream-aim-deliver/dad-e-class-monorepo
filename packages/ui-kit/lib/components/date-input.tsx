'use client';

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/style.css';
import { IconButton } from './icon-button';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { IconCalendarAlt } from './icons/icon-calendar-alt';

export interface DateInputProps extends isLocalAware {
  label?: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Converts an ISO date string (YYYY-MM-DD) to a Date object.
 * Returns undefined if the string is empty or invalid.
 */
function parseISODate(isoString: string): Date | undefined {
  if (!isoString) return undefined;
  const parts = isoString.split('-');
  if (parts.length !== 3) return undefined;
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const day = parseInt(parts[2], 10);
  if (isNaN(year) || isNaN(month) || isNaN(day)) return undefined;
  const date = new Date(year, month, day);
  if (isNaN(date.getTime())) return undefined;
  return date;
}

/**
 * Converts a Date to an ISO string (YYYY-MM-DD).
 */
function toISODateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * A reusable DateInput component with a calendar popover using react-day-picker.
 * Features year/month dropdown navigation for fast date selection (e.g., birth dates).
 *
 * @param label Optional label to display above the date input field.
 * @param value The current value of the date input field (in ISO format YYYY-MM-DD).
 * @param onChange Callback function triggered when the date value changes. Receives the new date as an ISO string.
 *
 * @example
 * <DateInput
 *   label="Select a Date"
 *   value="2023-10-01"
 *   onChange={(date) => console.log("Selected date:", date)}
 *   locale="en"
 * />
 */
export const DateInput: React.FC<DateInputProps> = ({
  value,
  onChange,
  label,
  locale
}) => {
  const dictionary = getDictionary(locale).components.dateInput;

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [textValue, setTextValue] = useState('');

  const selectedDate = parseISODate(value);

  // Sync text value with the prop value
  useEffect(() => {
    if (selectedDate) {
      const localeStr = locale === 'de' ? 'de-DE' : 'en-US';
      setTextValue(selectedDate.toLocaleDateString(localeStr));
    } else {
      setTextValue('');
    }
  }, [value, locale]);

  // Close popover on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleDaySelect = useCallback((day: Date | undefined) => {
    if (day) {
      onChange(toISODateString(day));
    }
    setIsOpen(false);
  }, [onChange]);

  const handleToggleCalendar = useCallback(() => {
    setIsOpen((prev) => !prev);
  }, []);

  const handleInputClick = useCallback(() => {
    setIsOpen(true);
  }, []);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTextValue(e.target.value);
  }, []);

  const handleTextBlur = useCallback(() => {
    // Try to parse the typed text as a date
    const parsed = new Date(textValue);
    if (!isNaN(parsed.getTime())) {
      onChange(toISODateString(parsed));
    } else if (textValue === '') {
      onChange('');
    }
    // If invalid, revert to previous value display on next render via useEffect
  }, [textValue, onChange]);

  const handleTextKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTextBlur();
      setIsOpen(false);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
  }, [handleTextBlur]);

  return (
    <div
      ref={containerRef}
      className="flex flex-col w-full justify-start max-md:max-w-full relative"
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
        onClick={handleInputClick}
      >
        <div className="relative flex-1">
          <input
            id="date-input"
            ref={inputRef}
            type="text"
            value={textValue}
            placeholder={dictionary.placeholder}
            onChange={handleTextChange}
            onBlur={handleTextBlur}
            onKeyDown={handleTextKeyDown}
            className="w-full bg-transparent text-md text-text-primary outline-none border-none cursor-pointer placeholder:text-text-secondary"
            data-testid="date-input-field"
            onClick={(e) => e.stopPropagation()}
            onFocus={() => setIsOpen(true)}
            autoComplete="off"
          />
        </div>

        <IconButton
          size="small"
          styles="text"
          icon={<IconCalendarAlt />}
          onClick={(e) => {
            e.stopPropagation();
            handleToggleCalendar();
          }}
          data-testid="date-input-icon-button"
        />
      </div>

      {isOpen && (
        <div
          className="absolute top-full left-0 z-50 mt-1 bg-base-neutral-800 border border-base-neutral-700 rounded-medium shadow-lg"
          data-testid="date-input-calendar"
          style={{
            '--rdp-accent-color': 'var(--color-base-brand-400)',
            '--rdp-accent-background-color': 'rgba(251, 146, 60, 0.15)',
            '--rdp-day-height': '36px',
            '--rdp-day-width': '36px',
            '--rdp-day_button-height': '34px',
            '--rdp-day_button-width': '34px',
            '--rdp-day_button-border-radius': 'var(--radius-medium, 0.5rem)',
            '--rdp-selected-border': '2px solid var(--color-base-brand-400)',
            '--rdp-today-color': 'var(--color-base-brand-400)',
            '--rdp-disabled-opacity': '0.3',
            '--rdp-outside-opacity': '0.5',
          } as React.CSSProperties}
        >
          <DayPicker
            mode="single"
            captionLayout="dropdown"
            selected={selectedDate}
            onSelect={handleDaySelect}
            defaultMonth={selectedDate || new Date()}
            startMonth={new Date(1920, 0)}
            endMonth={new Date()}
            classNames={{
              root: 'p-3 text-text-primary',
              month_caption: 'text-text-primary mb-2',
              weekday: 'text-text-secondary text-xs',
              day: 'text-text-primary hover:bg-base-neutral-700 rounded-medium',
              today: 'font-bold',
              selected: 'bg-button-primary-fill text-button-primary-text rounded-medium',
              outside: 'text-text-secondary opacity-50',
              dropdown: 'bg-base-neutral-700 text-text-primary border border-base-neutral-600 rounded-medium px-1 py-0.5 text-sm',
              nav: 'text-text-primary',
              button_next: 'hover:bg-base-neutral-700 rounded-medium',
              button_previous: 'hover:bg-base-neutral-700 rounded-medium',
              chevron: 'fill-button-primary-fill',
              disabled: 'opacity-30 cursor-not-allowed',
            }}
          />
        </div>
      )}
    </div>
  );
};
