'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../utils/style-utils';
import { InputField } from '../input-field';
import { IconSearch } from '../icons/icon-search';
import { IconChevronUp } from '../icons/icon-chevron-up';
import { IconChevronDown } from '../icons/icon-chevron-down';
import { CheckBox } from '../checkbox';

export interface CouponSearchDropdownProps {
  mode: 'single' | 'multiple';
  options: { label: string; value: string }[];
  onSelectionChange: (selected: string | string[] | null) => void;
  placeholder: string;
  searchPlaceholder?: string;
  defaultValue?: string | string[];
  className?: string;
}

export const CouponSearchDropdown: React.FC<CouponSearchDropdownProps> = ({
  mode,
  options,
  onSelectionChange,
  placeholder,
  searchPlaceholder = 'Search...',
  defaultValue,
  className,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [portalStyle, setPortalStyle] = useState<React.CSSProperties>({});

  const containerRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const portalRef = useRef<HTMLDivElement>(null);

  // Selection state
  const getInitialSingle = () =>
    typeof defaultValue === 'string' ? defaultValue : null;
  const getInitialMultiple = () =>
    Array.isArray(defaultValue) ? defaultValue : [];

  const [selectedSingle, setSelectedSingle] = useState<string | null>(getInitialSingle);
  const [selectedMultiple, setSelectedMultiple] = useState<string[]>(getInitialMultiple);

  // Sync defaultValue changes
  useEffect(() => {
    if (mode === 'single') {
      setSelectedSingle(typeof defaultValue === 'string' ? defaultValue : null);
    } else {
      setSelectedMultiple(Array.isArray(defaultValue) ? defaultValue : []);
    }
  }, [defaultValue, mode]);

  // Auto drop-direction + portal positioning
  const updatePortalPosition = useCallback(() => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow >= spaceAbove) {
      setPortalStyle({
        position: 'fixed',
        top: rect.bottom + 4,
        left: rect.left,
        minWidth: rect.width,
        maxHeight: spaceBelow - 16,
        zIndex: 9999,
      });
    } else {
      setPortalStyle({
        position: 'fixed',
        bottom: window.innerHeight - rect.top + 4,
        left: rect.left,
        minWidth: rect.width,
        maxHeight: spaceAbove - 16,
        zIndex: 9999,
      });
    }
  }, []);

  // Reposition on scroll/resize while open
  useEffect(() => {
    if (!isOpen) return;
    updatePortalPosition();
    window.addEventListener('scroll', updatePortalPosition, true);
    window.addEventListener('resize', updatePortalPosition);
    return () => {
      window.removeEventListener('scroll', updatePortalPosition, true);
      window.removeEventListener('resize', updatePortalPosition);
    };
  }, [isOpen, updatePortalPosition]);

  // Click outside handler
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const inTrigger = containerRef.current?.contains(target);
      const inPortal = portalRef.current?.contains(target);
      if (!inTrigger && !inPortal) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Clear search when closing
  useEffect(() => {
    if (!isOpen) {
      setSearchQuery('');
    }
  }, [isOpen]);

  // Filtered options
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  // Selection handlers
  const handleSingleSelect = (value: string) => {
    setSelectedSingle(value);
    onSelectionChange(value);
    setIsOpen(false);
  };

  const handleMultiSelect = (value: string) => {
    const updated = selectedMultiple.includes(value)
      ? selectedMultiple.filter((v) => v !== value)
      : [...selectedMultiple, value];
    setSelectedMultiple(updated);
    onSelectionChange(updated);
  };

  // Button display text
  const buttonDisplayText =
    mode === 'single'
      ? options.find((o) => o.value === selectedSingle)?.label || placeholder
      : placeholder;

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        ref={buttonRef}
        className="flex cursor-pointer items-center justify-between p-2 pl-4 w-full bg-base-neutral-800 text-base-white rounded-medium border-[1px] border-base-neutral-700"
        onClick={toggleDropdown}
      >
        <div className="text-base-white truncate text-sm leading-[150%] whitespace-nowrap pr-2">
          {buttonDisplayText}
        </div>
        {isOpen ? (
          <IconChevronUp classNames="fill-base-neutral-50 cursor-pointer flex-shrink-0" />
        ) : (
          <IconChevronDown classNames="fill-base-neutral-50 cursor-pointer flex-shrink-0" />
        )}
      </button>

      {isOpen &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={portalRef}
            style={portalStyle}
            className="flex flex-col overflow-hidden"
          >
            <div className="flex flex-1 min-h-0 flex-col p-4 gap-3 bg-base-neutral-800 border-[1px] border-base-neutral-700 rounded-medium w-full overflow-hidden">
              <InputField
                value={searchQuery}
                setValue={(value: string) => setSearchQuery(value)}
                hasLeftContent={true}
                inputText={searchPlaceholder}
                leftContent={<IconSearch />}
              />
              <ul className="flex flex-1 min-h-0 flex-col gap-2 overflow-y-auto overscroll-contain pr-1">
                {filteredOptions.map((option) => (
                  <li key={option.value}>
                    {mode === 'multiple' ? (
                      <CheckBox
                        name="coupon-multi"
                        withText
                        value={option.value}
                        label={
                          <div className="truncate cursor-pointer">
                            {option.label}
                          </div>
                        }
                        checked={selectedMultiple.includes(option.value)}
                        onChange={() => handleMultiSelect(option.value)}
                        labelClass="text-sm text-text-primary leading-[150%] whitespace-nowrap w-full"
                      />
                    ) : (
                      <button
                        className="w-full text-left p-2 rounded-md hover:bg-base-neutral-700 flex items-center"
                        onClick={() => handleSingleSelect(option.value)}
                      >
                        <div className="truncate text-sm text-text-primary">
                          {option.label}
                        </div>
                      </button>
                    )}
                  </li>
                ))}
                {filteredOptions.length === 0 && (
                  <li className="p-2 text-sm text-text-secondary">
                    No results
                  </li>
                )}
              </ul>
            </div>
          </div>,
          (containerRef.current?.closest('.theme') as HTMLElement) ||
            document.body,
        )}
    </div>
  );
};
