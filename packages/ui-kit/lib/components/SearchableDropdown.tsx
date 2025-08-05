import { useState, useEffect, useRef } from 'react';
import { InputField } from './input-field';
import { IconSearch } from './icons';
import { useDebounce } from '../hooks/use-debounce';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

interface SearchableDropdownProps<T> extends isLocalAware {
    options: T[];
    optionKey: keyof T;
    optionValue: keyof T;
    onSelect: (selected: T) => void;
    placeholder?: string;
    debounceTimeout?: number;
}

export function SearchableDropdown<T extends { [key: string]: any }>({
    options,
    optionKey,
    optionValue,
    onSelect,
    placeholder = 'Search...',
    debounceTimeout = 500,
    locale
}: SearchableDropdownProps<T>) {
    const dictionary = getDictionary(locale);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredOptions, setFilteredOptions] = useState<T[]>(options);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const debouncedSearchTerm = useDebounce(searchTerm, debounceTimeout);

    useEffect(() => {
        if (debouncedSearchTerm.trim()) {
            const filtered = options.filter(option =>
                String(option[optionValue]).toLowerCase().includes(debouncedSearchTerm.toLowerCase())
            );
            setFilteredOptions(filtered);
        } else {
            setFilteredOptions(options);
        }
    }, [debouncedSearchTerm, options, optionValue]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleSelect = (option: T) => {
        onSelect(option);
        setSearchTerm('');
        setIsOpen(false);
    };

    return (
        <div className='relative' ref={dropdownRef}>
            <InputField
                hasLeftContent
                leftContent={<IconSearch />}
                type='text'
                inputPlaceholder={placeholder}
                value={searchTerm}
                setValue={value => {
                    setSearchTerm(value);
                    setIsOpen(true);
                }}
            />
            {isOpen && (
                <div className='absolute z-10 w-full mt-1 bg-base-neutral-700 border rounded-md shadow-lg max-h-60 overflow-y-auto'>
                    {filteredOptions.length > 0 ? (
                        filteredOptions.map(option => (
                            <div
                                key={option[optionKey]}
                                className='p-2 cursor-pointer flex items-center gap-2 hover:bg-base-neutral-600'
                                onClick={() => handleSelect(option)}
                            >
                                <span className='md:text-md text-sm text-text-secondary'>{String(option[optionValue])}</span>
                            </div>
                        ))
                    ) : (
                        <div className='p-2 text-text-secondary'>{dictionary.components.searchableDropdown.noResultsFound}</div>
                    )}
                </div>
            )}
        </div>
    );
}
