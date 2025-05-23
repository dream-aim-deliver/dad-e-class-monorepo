import React, { useState, useMemo, useRef, useEffect } from 'react';
import { DateInput } from './date-input';
import { Button } from './button';
import { CheckBox } from './checkbox';
import { RadioButton } from './radio-button';
import StarRatingInput from './star-rating-input';

// AutocompleteInput Component
interface AutocompleteInputProps {
  label: string;
  inputField: {
    id: string;
    className?: string;
    value: string | string[];
    setValue: (value: string | string[]) => void;
    inputText: string;
    options?: string[];
    multiple?: boolean;
  };
}

export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({ label, inputField }) => {
  const { id, className, value, setValue, inputText, options = [], multiple = false } = inputField;
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filteredOptions = useMemo(() => {
    return options.filter((option) =>
      option.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, options]);

  const handleSelect = (option: string) => {
    if (multiple) {
      const currentValues = Array.isArray(value) ? value : [];
      if (!currentValues.includes(option)) {
        setValue([...currentValues, option]);
      }
      setSearchTerm(''); // Clear input for multi-select
    } else {
      setValue(option);
      setSearchTerm(option); // Fill input with selected value for single-select
      setIsOpen(false);
    }
  };

  const handleRemoveTag = (tag: string) => {
    if (multiple) {
      setValue((Array.isArray(value) ? value : []).filter((t) => t !== tag));
    }
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      {label && <label htmlFor={id} className="text-sm text-text-primary">{label}</label>}
      <input
        id={id}
        className={`w-full p-2 border rounded bg-input-fill text-white border-input-stroke focus:outline-none focus:ring-2 focus:ring-primary ${className}`}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onFocus={() => setIsOpen(true)}
        placeholder={inputText}
      />
      {multiple && Array.isArray(value) && value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {value.map((tag) => (
            <div
              key={tag}
              className="flex items-center gap-1 px-2 py-1 bg-primary rounded text-sm text-white"
            >
              {tag}
              <button
                type="button"
                onClick={() => handleRemoveTag(tag)}
                className="text-white hover:text-red-500"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {isOpen && filteredOptions.length > 0 && (
        <ul className="absolute z-10 w-full mt-1 bg-card-fill border border-input-stroke rounded shadow-lg max-h-60 overflow-auto">
          {filteredOptions.map((option) => (
            <li
              key={option}
              className="px-3 py-2 text-white hover:bg-primary cursor-pointer"
              onClick={() => handleSelect(option)}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// Define the props interface
interface AdminCourseFilterModalProps {
  onApplyFilters: (filters: any) => void;
  categories: string[];
  languageOptions: { name: string; code: string }[];
  initialFilters?: any;
  creators: string[];
  coaches: string[];
  tags: string[];
}

// Main Component
export const AdminCourseFilterModalExpanded: React.FC<AdminCourseFilterModalProps> = ({
  onApplyFilters,
  categories,
  languageOptions,
  initialFilters,
  creators,
  coaches,
  tags,
}) => {
  const [filters, setFilters] = useState({
    minRating: initialFilters?.minRating || 0,
    maxRating: initialFilters?.maxRating || 5,
    minSales: initialFilters?.minSales || '',
    maxSales: initialFilters?.maxSales || '',
    createdBy: initialFilters?.createdBy || '',
    taughtBy: initialFilters?.taughtBy || '',
    minCoaches: initialFilters?.minCoaches || '',
    maxCoaches: initialFilters?.maxCoaches || '',
    categories: initialFilters?.categories || [],
    tags: initialFilters?.tags || [],
    languages: initialFilters?.languages || ['English', 'German'],
    publishBefore: initialFilters?.publishBefore || '',
    publishAfter: initialFilters?.publishAfter || '',
  });

  const handleChange = (field: string, value: any) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleMinRatingChange = ({ single }: { single?: number }) => {
    setFilters((prev) => ({
      ...prev,
      minRating: single !== undefined ? single : prev.minRating,
    }));
  };

  const handleMaxRatingChange = ({ single }: { single?: number }) => {
    setFilters((prev) => ({
      ...prev,
      maxRating: single !== undefined ? single : prev.maxRating,
    }));
  };

  const handleCategoryToggle = (category: string) => {
    setFilters((prev) => {
      const updatedCategories = prev.categories.includes(category)
        ? prev.categories.filter((c: string) => c !== category)
        : [...prev.categories, category];
      return { ...prev, categories: updatedCategories };
    });
  };

  const handleLanguageToggle = (language: string) => {
    setFilters((prev) => {
      const languages = prev.languages.includes(language)
        ? prev.languages.filter((lang: string) => lang !== language)
        : [...prev.languages, language];
      return { ...prev, languages };
    });
  };

  const handleReset = () => {
    setFilters({
      minRating: 0,
      maxRating: 5,
      minSales: '',
      maxSales: '',
      createdBy: '',
      taughtBy: '',
      minCoaches: '',
      maxCoaches: '',
      categories: [],
      tags: [],
      languages: [],
      publishBefore: '',
      publishAfter: '',
    });
  };

  const handleApply = () => {
    onApplyFilters(filters);
  };

  return (
    <div className="flex flex-col gap-4 p-6 bg-card-fill text-text-primary w-full max-w-[350px] h-full">
      <h2 className="text-2xl font-bold">Filters</h2>
      <div className="h-px w-full bg-divider"></div>
      {/* Performance Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold">Performance</h3>
        <div className="flex flex-col gap-2">
          <h4 className="text-lg font-semibold">Rating</h4>
          <div className="flex flex-col gap-2">
            <div className="flex flex-row gap-2 items-center">
              <p className="text-sm w-32">Minimum Rating</p>
              <StarRatingInput
                totalStars={5}
                size={20}
                type="single"
                onChange={handleMinRatingChange}
              />
            </div>
            <div className="flex flex-row gap-2 items-center">
              <p className="text-sm w-32">Maximum Rating</p>
              <StarRatingInput
                totalStars={5}
                size={20}
                type="single"
                onChange={(value) => handleMaxRatingChange(value)}
              />
            </div>
          </div>
        </div>
        <h3 className="text-xl font-semibold">Number of sales</h3>
        <div className="flex gap-2 flex-row">
          <AutocompleteInput
            label="Min"
            inputField={{
              id: 'minSales',
              className: "w-full text-white border-input-stroke",
              value: filters.minSales,
              setValue: (value: string | string[]) => handleChange('minSales', Array.isArray(value) ? value[0] : value),
              inputText: 'e.g. 28',
            }}
          />
          <AutocompleteInput
            label="Max"
            inputField={{
              id: 'maxSales',
              className: "w-full text-white border-input-stroke",
              value: filters.maxSales,
              setValue: (value: string | string[]) => handleChange('maxSales', Array.isArray(value) ? value[0] : value),
              inputText: 'e.g. 120',
            }}
          />
        </div>
      </div>
      <div className="h-px w-full bg-divider"></div>
      {/* Coaches Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold">Coaches</h3>
        <AutocompleteInput
          label="Created by"
          inputField={{
            id: 'createdBy',
            className: "w-full text-white border-input-stroke",
            value: filters.createdBy,
            setValue: (value: string | string[]) => handleChange('createdBy', Array.isArray(value) ? value[0] : value),
            inputText: 'Search course creator',
            options: creators,
          }}
        />
        <AutocompleteInput
          label="Taught by"
          inputField={{
            id: 'taughtBy',
            className: "w-full text-white border-input-stroke",
            value: filters.taughtBy,
            setValue: (value: string | string[]) => handleChange('taughtBy', Array.isArray(value) ? value[0] : value),
            inputText: 'Search coach',
            options: coaches,
          }}
        />
        <h3 className="text-xl font-semibold">Number of coaches</h3>
        <div className="flex gap-2">
          <AutocompleteInput
            label="Min"
            inputField={{
              id: 'minCoaches',
              className: "w-full text-white border-input-stroke",
              value: filters.minCoaches,
              setValue: (value: string | string[]) => handleChange('minCoaches', typeof value === 'string' ? value : value[0] || ''),
              inputText: 'e.g. 28',
            }}
          />
          <AutocompleteInput
            label="Max"
            inputField={{
              id: 'maxCoaches',
              className: "w-full text-white border-input-stroke",
              value: filters.maxCoaches,
              setValue: (value: string | string[]) => handleChange('maxCoaches', typeof value === 'string' ? value : value[0] || ''),
              inputText: 'e.g. 120',
            }}
          />
        </div>
      </div>
      <div className="h-px w-full bg-divider"></div>
      {/* Taxonomy Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold">Taxonomy (aka Goals)</h3>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <RadioButton
              key={category}
              name="category"
              value={category}
              label={category}
              withText={true}
              labelClass="text-white text-sm"
              checked={filters.categories.includes(category)}
              onChange={() => handleCategoryToggle(category)}
            />
          ))}
        </div>
      </div>
      {/* Tags Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold">Tags (aka Skills)</h3>
        <AutocompleteInput
          label=""
          inputField={{
            id: 'tags',
            className: "w-full text-white border-input-stroke",
            value: filters.tags,
            setValue: (value: string | string[]) => handleChange('tags', Array.isArray(value) ? value : [value]),
            inputText: 'Search tag',
            options: tags,
            multiple: true,
          }}
        />
      </div>
      <div className="h-px w-full bg-divider"></div>
      {/* Others Section */}
      <div className="flex flex-col gap-4">
        <h3 className="text-xl font-semibold">Others</h3>
        <div>
          <p className="text-sm mb-2">Languages</p>
          <div className="grid grid-cols-3 gap-3">
            {languageOptions.map((lang) => (
              <CheckBox
                key={lang.code}
                name={lang.name}
                value={lang.name}
                label={lang.name}
                labelClass="text-white text-sm"
                checked={filters.languages.includes(lang.name)}
                withText
                onChange={() => handleLanguageToggle(lang.name)}
              />
            ))}
          </div>
        </div>
        <DateInput
          label="Published Before"
          value={filters.publishBefore}
          onChange={(value: string) => handleChange('publishBefore', value)}
        />
        <DateInput
          label="Published After"
          value={filters.publishAfter}
          onChange={(value: string) => handleChange('publishAfter', value)}
        />
      </div>
      <div className="h-px w-full bg-divider"></div>
      {/* Buttons */}
      <div className="flex gap-2">
        <Button
          variant="secondary"
          size="medium"
          onClick={handleReset}
          className="flex-1"
          text="Reset filters"
        />
        <Button
          variant="primary"
          size="medium"
          onClick={handleApply}
          className="flex-1"
          text="Apply filters"
        />
      </div>
    </div>
  );
};