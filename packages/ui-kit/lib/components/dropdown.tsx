'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { RadioButton } from './radio-button';
import { CheckBox } from './checkbox';
import { IconChevronUp } from './icons/icon-chevron-up';
import { IconChevronDown } from './icons/icon-chevron-down';
import { InputField } from './input-field';
import { IconSearch } from './icons/icon-search';
import { cn } from '../utils/style-utils';
import { Button } from './button';
import { UserAvatar } from './avatar/user-avatar';

export interface DropdownOption {
  label: React.ReactNode;
  value: string;
  avatarUrl?: string;
  searchText?: string;
}

export interface DropdownProps {
  type: 'simple' | 'choose-color' | 'multiple-choice-and-search' | 'single-choice-and-search' | 'single-choice-and-search-avatars' | 'multiple-choice-and-search-with-action';
  options: DropdownOption[];
  onSelectionChange: (selected: string | string[] | null) => void;
  className?: string;
  buttonClassName?: string;
  defaultValue?: string | string[];
  text: {
    simpleText?: string;
    colorText?: string;
    multiText?: string;
    searchTextPlaceholder?: string;
  };
  position?: 'top' | 'bottom';
  absolutePosition?: boolean;
  action?: {
    label: string;
    onClick: (query: string) => void;
    isLoading?: boolean;
    disabled?: boolean;
  };
}

export const Dropdown: React.FC<DropdownProps> = ({
  type,
  options,
  onSelectionChange,
  className,
  buttonClassName,
  defaultValue,
  text,
  position = 'bottom',
  absolutePosition = true,
  action,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);
  const buttonTextRef = useRef<HTMLDivElement>(null);
  const [isButtonTextTruncated, setIsButtonTextTruncated] = useState(false);

  // Centralized refs and truncation state for all options
  const optionRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const [truncatedOptions, setTruncatedOptions] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');

  // Portal positioning state
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});

  const getInitialState = () => {
    const isMultiple = type === 'multiple-choice-and-search' || type === 'multiple-choice-and-search-with-action';
    const isValidSingleValue = !isMultiple && typeof defaultValue === 'string';
    const isValidMultipleValue = isMultiple && Array.isArray(defaultValue);

    return {
      selectedOption: isValidSingleValue ? defaultValue : null,
      selectedLabel: isValidSingleValue
        ? options.find(option => option.value === defaultValue)?.label || null
        : null,
      selectedOptions: isValidMultipleValue ? defaultValue : []
    };
  };

  const initialState = getInitialState();
  const [selectedOption, setSelectedOption] = useState<string | null>(initialState.selectedOption);
  const [selectedLabel, setSelectedLabel] = useState<React.ReactNode>(initialState.selectedLabel);
  const [selectedOptions, setSelectedOptions] = useState<string[]>(initialState.selectedOptions);

  useEffect(() => {
    const newState = getInitialState();
    setSelectedOption(newState.selectedOption);
    setSelectedLabel(newState.selectedLabel);
    setSelectedOptions(newState.selectedOptions);
  }, [defaultValue, type, options]);

  let buttonText: React.ReactNode;
  if (type === 'simple') {
    buttonText = selectedLabel || text?.simpleText;
  } else if (type === 'choose-color') {
    buttonText = selectedLabel || text?.colorText;
  } else if (type === 'multiple-choice-and-search' || type === 'multiple-choice-and-search-with-action') {
    buttonText = text?.multiText;
  } else if (type === 'single-choice-and-search' || type === 'single-choice-and-search-avatars') {
    buttonText = selectedLabel || text?.simpleText;
  } else {
    buttonText = text?.multiText;
  }

  // Compute portal position from button bounding rect
  const updatePortalPosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    if (position === 'bottom') {
      setPortalStyle({
        position: 'fixed',
        top: rect.bottom + 8,
        left: rect.left,
        minWidth: rect.width,
        maxHeight: window.innerHeight - rect.bottom - 16,
        zIndex: 50,
      });
    } else {
      setPortalStyle({
        position: 'fixed',
        bottom: window.innerHeight - rect.top + 8,
        left: rect.left,
        minWidth: rect.width,
        maxHeight: rect.top - 16,
        zIndex: 50,
      });
    }
  }, [position]);

  // Reposition portal on scroll/resize while open
  useEffect(() => {
    if (!isOpen || !absolutePosition) return;
    updatePortalPosition();
    window.addEventListener('scroll', updatePortalPosition, true);
    window.addEventListener('resize', updatePortalPosition);
    return () => {
      window.removeEventListener('scroll', updatePortalPosition, true);
      window.removeEventListener('resize', updatePortalPosition);
    };
  }, [isOpen, absolutePosition, updatePortalPosition]);

  // Click outside handler — check both the trigger area and the portal content
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const inTrigger = dropdownRef.current?.contains(target);
      const inPortal = portalRef.current?.contains(target);
      if (!inTrigger && !inPortal) {
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
    // Check truncation for all options across all types
    const newTruncated = new Set<string>();
    optionRefs.current.forEach((element, value) => {
      if (element && element.scrollWidth > element.offsetWidth) {
        newTruncated.add(value);
      }
    });
    setTruncatedOptions(newTruncated);
  }, [options, isOpen, searchQuery]); // Re-check when options, visibility, or search changes

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

  const filteredOptions = options.filter((option) => {
    const base = option.searchText ?? (typeof option.label === 'string' ? option.label : '');
    return base.toLowerCase().includes(searchQuery.toLowerCase());
  });

  // Shared dropdown content rendered for all variants
  const dropdownContent = (
    <>
      {/* Simple Dropdown */}
      {type === 'simple' && (
        <div className="py-2 bg-base-neutral-800 border-[1px] border-base-neutral-700 rounded-medium w-max min-w-full flex flex-col overflow-hidden">
          <ul className="overflow-y-auto overscroll-contain">
            {options.map((option) => (
              <li
                key={option.value}
                className={clsx(
                  'py-3 px-4 cursor-pointer hover:bg-base-neutral-700 text-sm leading-[150%] whitespace-nowrap group relative',
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
              <li
                key={option.value}
                className="flex items-center group relative"
              >
                <RadioButton
                  name="color"
                  value={option.value}
                  withText
                  label={
                    <div
                      ref={(el) => {
                        if (el) {
                          optionRefs.current.set(option.value, el);
                        } else {
                          optionRefs.current.delete(option.value);
                        }
                      }}
                      className="truncate max-w-[200px] cursor-pointer" // Adjust max-width as needed
                    >
                      {option.label}
                    </div>
                  }
                  checked={selectedOption === option.value}
                  onChange={() => handleSelect(option.value, option.label)}
                  labelClass="text-sm text-text-primary leading-[150%] whitespace-nowrap w-full"
                />
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
      {/* MultiSelect Dropdowns */}
      {(type === 'multiple-choice-and-search' || type === 'multiple-choice-and-search-with-action') && (
        <div className="flex flex-col p-4 gap-3 bg-base-neutral-800 border-[1px] border-base-neutral-700 rounded-medium w-full overflow-hidden">
          <div className="flex items-center gap-2">
            <div className="flex-1">
              <InputField
                value={searchQuery}
                setValue={(value: string) => setSearchQuery(value)}
                hasLeftContent={true}
                inputText={text?.searchTextPlaceholder || "Search..."}
                leftContent={<IconSearch />}
              />
            </div>
            {type === 'multiple-choice-and-search-with-action' && action && (
              <div onMouseDown={(e) => e.stopPropagation()}>
                <Button
                  variant="primary"
                  size="medium"
                  className="whitespace-nowrap"
                  text={action.label}
                  onClick={() => {
                    action.onClick(searchQuery.trim());
                  }}
                  disabled={action.disabled || !searchQuery.trim() || options.some(o => (o.searchText ?? (typeof o.label === 'string' ? o.label : '')).toLowerCase().trim() === searchQuery.toLowerCase().trim())}
                />
              </div>
            )}
          </div>
          <ul className="flex flex-col gap-2 overflow-y-auto overscroll-contain pr-1">
            {(searchQuery ? filteredOptions : options).map((option) => (
              <li
                key={option.value}
                className="flex items-center group relative"
              >
                <CheckBox
                  name="multi"
                  withText
                  value={option.value}
                  label={
                    <div
                      ref={(el) => {
                        if (el) {
                          optionRefs.current.set(option.value, el);
                        } else {
                          optionRefs.current.delete(option.value);
                        }
                      }}
                      className="truncate max-w-[180px] cursor-pointer"
                    >
                      {option.label}
                    </div>
                  }
                  checked={selectedOptions.includes(option.value)}
                  onChange={() => handleMultiSelect(option.value)}
                  labelClass="text-sm text-text-primary leading-[150%] whitespace-nowrap w-full"
                />
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
      {/* Single select with search */}
      {type === 'single-choice-and-search' && (
        <div className="flex flex-col p-4 gap-3 bg-base-neutral-800 border-[1px] border-base-neutral-700 rounded-medium w-full overflow-hidden">
          <InputField
            value={searchQuery}
            setValue={(value: string) => setSearchQuery(value)}
            hasLeftContent={true}
            inputText={text?.searchTextPlaceholder || 'Search...'}
            leftContent={<IconSearch />}
          />
          <ul className="flex flex-col gap-2 overflow-y-auto overscroll-contain pr-1">
            {(searchQuery ? filteredOptions : options).map((option) => (
              <li key={option.value} className="group relative">
                <button
                  className="w-full text-left p-2 rounded-md hover:bg-base-neutral-700 flex items-center"
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
                    className="truncate text-sm text-text-primary"
                  >
                    {option.label}
                  </div>
                </button>
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
      {/* Single select with avatars and search */}
      {type === 'single-choice-and-search-avatars' && (
        <div className="flex flex-col p-4 gap-3 bg-base-neutral-800 border-[1px] border-base-neutral-700 rounded-medium w-full overflow-hidden">
          <InputField
            value={searchQuery}
            setValue={(value: string) => setSearchQuery(value)}
            hasLeftContent={true}
            inputText={text?.searchTextPlaceholder || 'Search...'}
            leftContent={<IconSearch />}
          />
          <ul className="flex flex-col gap-2 overflow-y-auto overscroll-contain pr-1">
            {(searchQuery ? filteredOptions : options).map((option) => (
              <li key={option.value}>
                <button
                  className="w-full text-left p-2 rounded-md hover:bg-base-neutral-700 flex items-center gap-3"
                  onClick={() => handleSelect(option.value, option.label)}
                >
                  <UserAvatar
                    fullName={
                      typeof option.label === 'string'
                        ? option.label
                        : (option.searchText || '')
                    }
                    size="small"
                    imageUrl={option.avatarUrl}
                  />
                  <div
                    ref={(el) => {
                      if (el) {
                        optionRefs.current.set(option.value, el);
                      } else {
                        optionRefs.current.delete(option.value);
                      }
                    }}
                    className="truncate max-w-[220px] text-sm text-text-primary"
                  >
                    {option.label}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );

  // Non-portal fallback classes (used when absolutePosition is false)
  const inlineDropdownClassName = cn(
    'mt-2',
    position === 'top' && 'bottom-12',
  );

  return (
    <div ref={dropdownRef} className={clsx('relative', className)}>
      {/* Dropdown Button */}
      <button
        ref={buttonRef}
        className={cn("flex cursor-pointer items-center justify-between p-2 pl-4 w-full bg-base-neutral-800 text-base-white rounded-medium border-[1px] border-base-neutral-700 group relative", buttonClassName)}
        onClick={toggleDropdown}
      >
        <div
          ref={buttonTextRef}
          className="text-base-white truncate text-sm leading-[150%] whitespace-nowrap pr-2"
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

      {/* Dropdown Content — portal for absolute, inline otherwise */}
      {isOpen && absolutePosition && typeof document !== 'undefined' && createPortal(
        <div ref={portalRef} style={portalStyle} className="flex flex-col overflow-hidden">
          {dropdownContent}
        </div>,
        (dropdownRef.current?.closest('.theme') as HTMLElement) || document.body
      )}
      {isOpen && !absolutePosition && (
        <div className={inlineDropdownClassName}>
          {dropdownContent}
        </div>
      )}
    </div>
  );
};
