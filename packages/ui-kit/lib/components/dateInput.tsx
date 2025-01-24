import React, { useRef } from 'react';
import { IconButton } from './iconButton';
import { Calendar } from 'lucide-react';

export interface DateInputProps {
  value: string;
  onChange: (value: string) => void;
}

export const DateInput: React.FC<DateInputProps> = ({ value, onChange }) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    dateInputRef.current?.showPicker();
  };

  return (
    <div className="flex flex-col w-full max-md:max-w-full ">
      <label
        htmlFor="date-input"
        className="flex-1 shrink gap-2 self-stretch w-full text-sm leading-none min-h-[22px] text-text-secondary max-md:max-w-full"
      >
        Date of birth (optional)
      </label>
      <div className="flex justify-between items-center px-3 py-2 w-full rounded-medium border border-solid bg-input-fill border-input-stroke min-h-[40px] max-md:max-w-full hover:border-base-neutral-400 cursor-pointer">
        <input
          id="date-input"
          ref={dateInputRef}
          type="date"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent border-none text-md text-text-primary outline-none"
        />
        <IconButton
          size="small"
          styles="text"
          icon={Calendar}
          onClick={handleIconClick}
        />
      </div>
    </div>
  );
};
