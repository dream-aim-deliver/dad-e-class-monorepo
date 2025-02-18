import React, { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { RadioButton } from './radio-button';
import { CheckBox } from './checkbox';
import { IconChevronUp } from './icons/icon-chevron-up';
import { IconChevronDown } from './icons/icon-chevron-down';
import { InputField } from './input-field';
import { IconSearch } from './icons/icon-search';

export interface DropdownProps {
    type: 'simple' | 'choose-color' | 'multiple-choice-and-search';
    options: { label: React.ReactNode; value: string }[];
    onSelectionChange: (selected: string | string[] | null) => void;
    className?: string;
    defaultValue?: string | string[]; // New optional prop
    text:{
        simpleText?: string;
        colorText?: string;
        multiText?: string;
    }
}

/**
 * A reusable Dropdown component that provides different selection options.
 *
 * @param type Defines the dropdown type. Options:
 *   - 'simple': A standard dropdown with text options.
 *   - 'choose-color': A color selection dropdown using radio buttons.
 *   - 'multiple-choice-and-search': A multi-select dropdown with a search bar.
 * @param options An array of available options, each containing a label and a value.
 * @param onSelectionChange Callback function triggered when the selection changes.
 * @param className Additional custom class names for styling the dropdown.
 * @returns A customizable dropdown component supporting single, multi-select, and search functionalities.
 */

export const Dropdown: React.FC<DropdownProps> = ({
    type,
    options,
    onSelectionChange,
    className,
    defaultValue,
    text
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const [selectedOption, setSelectedOption] = useState<string | null>(
        type !== 'multiple-choice-and-search' && defaultValue && typeof defaultValue === 'string'
            ? defaultValue
            : null
    );

    const [selectedLabel, setSelectedLabel] = useState<React.ReactNode | null>(
        type !== 'multiple-choice-and-search' && defaultValue && typeof defaultValue === 'string'
            ? options.find((option) => option.value === defaultValue)?.label || null
            : null
    );

    const [selectedOptions, setSelectedOptions] = useState<string[]>(
        type === 'multiple-choice-and-search' && Array.isArray(defaultValue) ? defaultValue : []
    );

    const [searchQuery, setSearchQuery] = useState('');



    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleSelect = (value: string, label: React.ReactNode) => {
        setSelectedOption(value);
        setSelectedLabel(label);
        onSelectionChange(value);
        if (type !== 'choose-color') {
            setIsOpen(false);
        }
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
                className="flex items-center justify-between p-2 pl-4 w-full bg-base-neutral-800 text-base-white rounded-medium border-[1px] border-base-neutral-700"
                onClick={toggleDropdown}
            >
                <div className="text-base-white text-sm leading-[100%] whitespace-nowrap">
                    {type === 'simple'
                        ? selectedLabel || text?.simpleText
                        : type === 'choose-color'
                            ? selectedLabel || text?.colorText
                            // : selectedOptions.length > 0
                            //     ? `${selectedOptions.length} selected`
                                : text?.multiText}
                </div>
                {isOpen ? (
                    <IconChevronUp classNames="fill-base-neutral-50 cursor-pointer" />
                ) : (
                    <IconChevronDown classNames="fill-base-neutral-50 cursor-pointer" />
                )}
            </button>

            {/* Dropdown Content */}
            {isOpen && (
                <div className="mt-2 z-50 absolute w-auto">
                    {' '}
                    {/* Ensure absolute positioning and higher z-index */}
                    {/* Simple Dropdown */}
                    {type === 'simple' && (
                        <div className="py-2 bg-base-neutral-800 border-[1px] border-base-neutral-700 rounded-medium w-full">
                            <ul>
                                {options.map((option) => (
                                    <li
                                        key={option.value}
                                        className={clsx(
                                            'py-3 px-4 cursor-pointer hover:bg-base-neutral-700 text-sm leading-[100%] whitespace-nowrap',
                                            selectedOption === option.value
                                                ? 'text-button-text-text'
                                                : 'text-text-primary',
                                        )}
                                        onClick={() => handleSelect(option.value, option.label)}
                                    >
                                        {option.label}
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
                            {/* Search Input */}
                            <InputField
                                value={searchQuery}
                                setValue={(value: string) => setSearchQuery(value)}
                                hasLeftContent={true}
                                inputText="Search..."
                                leftContent={<IconSearch />}
                                
                            />

                            {/* Options List */}
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

