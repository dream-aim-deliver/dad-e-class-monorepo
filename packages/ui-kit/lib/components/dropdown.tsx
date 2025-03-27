import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { RadioButton } from './radio-button';
import { CheckBox } from './checkbox';
import { IconChevronUp } from './icons/icon-chevron-up';
import { IconChevronDown } from './icons/icon-chevron-down';
import { InputField } from './input-field';
import { IconSearch } from './icons/icon-search';
import { cn } from '../utils/style-utils';

export interface DropdownProps {
  type: 'simple' | 'choose-color' | 'multiple-choice-and-search';
  options: { label: React.ReactNode; value: string }[];
  onSelectionChange: (selected: string | string[] | null) => void;
  className?: string;
  defaultValue?: string | string[];
  text: {
    simpleText?: string;
    colorText?: string;
    multiText?: string;
  };
  position?: 'top' | 'bottom';
}

export const Dropdown: React.FC<DropdownProps> = ({
  type,
  options,
  onSelectionChange,
  className,
  defaultValue,
  text,
  position = 'bottom',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonTextRef = useRef<HTMLDivElement>(null);
  const [isButtonTextTruncated, setIsButtonTextTruncated] = useState(false);
  
  // Centralized refs and truncation state for options
  const optionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [truncatedOptions, setTruncatedOptions] = useState<Set<string>>(new Set());

  const [selectedOption, setSelectedOption] = useState<string | null>(
    type !== 'multiple-choice-and-search' &&
      defaultValue &&
      typeof defaultValue === 'string'
      ? defaultValue
      : null,
  );

  const [selectedLabel, setSelectedLabel] = useState<React.ReactNode | null>(
    type !== 'multiple-choice-and-search' &&
      defaultValue &&
      typeof defaultValue === 'string'
      ? options.find((option) => option.value === defaultValue)?.label || null
      : null,
  );

  const [selectedOptions, setSelectedOptions] = useState<string[]>(
    type === 'multiple-choice-and-search' && Array.isArray(defaultValue)
      ? defaultValue
      : [],
  );

  const [searchQuery, setSearchQuery] = useState('');

  const buttonText =
    type === 'simple'
      ? selectedLabel || text?.simpleText
      : type === 'choose-color'
        ? selectedLabel || text?.colorText
        : text?.multiText;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const checkButtonTruncation = () => {
      if (buttonTextRef.current) {
        setIsButtonTextTruncated(
          buttonTextRef.current.scrollWidth > buttonTextRef.current.offsetWidth
        );
      }
    };
    checkButtonTruncation();
    window.addEventListener('resize', checkButtonTruncation);
    return () => window.removeEventListener('resize', checkButtonTruncation);
  }, [buttonText]);

  useEffect(() => {
    // Check truncation for all options
    const newTruncated = new Set<string>();
    optionRefs.current.forEach((element, value) => {
      if (element && element.scrollWidth > element.offsetWidth) {
        newTruncated.add(value);
      }
    });
    setTruncatedOptions(newTruncated);
  }, [options, isOpen]); // Re-check when options or dropdown visibility changes

  const toggleDropdown = () => setIsOpen(!isOpen);

  const handleSelect = (value: string, label: React.ReactNode) => {
    setSelectedOption(value);
    setSelectedLabel(label);
    onSelectionChange(value);
    if (type !== 'choose-color') setIsOpen(false);
  };

  const handleMultiSelect = (value: string) => {
    const updatedSelections = selectedOptions.includes(value)
      ? selectedOptions.filter((item) => item !== value)
      : [...selectedOptions, value];
    setSelectedOptions(updatedSelections);
    onSelectionChange(updatedSelections);
  };

  const filteredOptions = options.filter((option) =>
    typeof option.label === 'string'
      ? option.label.toLowerCase().includes(searchQuery.toLowerCase())
      : true,
  );

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      {/* Dropdown Button */}
      <button
        className="flex items-center justify-between p-2 pl-4 w-full bg-base-neutral-800 text-base-white rounded-medium border-[1px] border-base-neutral-700 group relative"
        onClick={toggleDropdown}
      >
        <div
          ref={buttonTextRef}
          className="text-base-white truncate text-sm leading-[100%] whitespace-nowrap"
        >
          {buttonText}
        </div>
        {isButtonTextTruncated && (
          <span
            className={cn(
              'absolute left-0 top-full mt-1 bg-base-neutral-700 text-text-primary text-sm px-2 py-1 rounded-medium whitespace-nowrap z-10',
              'hidden group-hover:block',
            )}
          >
            {buttonText}
          </span>
        )}
        {isOpen ? (
          <IconChevronUp classNames="fill-base-neutral-50 cursor-pointer flex-shrink-0" />
        ) : (
          <IconChevronDown classNames="fill-base-neutral-50 cursor-pointer flex-shrink-0" />
        )}
      </button>

      {/* Dropdown Content */}
      {isOpen && (
        <div className={cn('z-50 absolute w-full', position === 'bottom' ? 'mt-2' : 'bottom-12')}>
          {/* Simple Dropdown */}
          {type === 'simple' && (
            <div className="py-2 bg-base-neutral-800 border-[1px] border-base-neutral-700 rounded-medium w-full">
              <ul>
                {options.map((option) => (
                  <li
                    key={option.value}
                    className={clsx(
                      'py-3 px-4 cursor-pointer hover:bg-base-neutral-700 text-sm leading-[100%] whitespace-nowrap group relative',
                      selectedOption === option.value
                        ? 'text-button-text-text'
                        : 'text-text-primary',
                    )}
                    onClick={() => handleSelect(option.value, option.label)}
                  >
                    <div
                      ref={(el) => {
                        if (el) {
                          optionRefs.current.set(option.value, el);
                        } else {
                          optionRefs.current.delete(option.value);
                        }
                      }}
                      className="truncate"
                    >
                      {option.label}
                    </div>
                    {truncatedOptions.has(option.value) && (
                      <span
                        className={cn(
                          'absolute left-0 top-full mt-1 bg-base-neutral-700 text-text-primary text-sm px-2 py-1 rounded-medium whitespace-nowrap z-10',
                          'hidden group-hover:block',
                        )}
                      >
                        {option.label}
                      </span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* Color Select Dropdown */}
          {type === 'choose-color' && (
            <div className="flex flex-col p-4 gap-3 bg-base-neutral-800 border-[1px] border-base-neutral-700 rounded-medium w-full">
              <ul className="flex flex-col gap-2">
                {options.map((option) => (
                  <li key={option.value} className="flex items-center">
                    <RadioButton
                      name="color"
                      value={option.value}
                      withText
                      label={option.label}
                      checked={selectedOption === option.value}
                      onChange={() => handleSelect(option.value, option.label)}
                      labelClass="text-sm text-text-primary leading-[150%] whitespace-nowrap"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
          {/* MultiSelect Dropdown */}
          {type === 'multiple-choice-and-search' && (
            <div className="flex flex-col p-4 gap-3 bg-base-neutral-800 border-[1px] border-base-neutral-700 rounded-medium w-full">
              <InputField
                value={searchQuery}
                setValue={(value: string) => setSearchQuery(value)}
                hasLeftContent={true}
                inputText="Search..."
                leftContent={<IconSearch />}
              />
              <ul className="flex flex-col gap-2">
                {(searchQuery ? filteredOptions : options).map((option) => (
                  <li key={option.value} className="flex items-center">
                    <CheckBox
                      name="multi"
                      withText
                      value={option.value}
                      label={option.label}
                      checked={selectedOptions.includes(option.value)}
                      onChange={() => handleMultiSelect(option.value)}
                      labelClass="text-sm text-text-primary leading-[150%] whitespace-nowrap"
                    />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};