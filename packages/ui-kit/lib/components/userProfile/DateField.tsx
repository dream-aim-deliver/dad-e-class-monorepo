import React, { useRef } from 'react';
import { DateFieldProps } from './types';

export const DateField: React.FC<DateFieldProps> = ({ value, icon, onChange }) => {
  const dateInputRef = useRef<HTMLInputElement>(null);

  const handleIconClick = () => {
    dateInputRef.current?.showPicker(); 
  };

  return (
    <div className="flex flex-col w-full max-md:max-w-full">
      <label className="flex-1 shrink gap-2 self-stretch w-full text-sm leading-none min-h-[22px] text-stone-300 max-md:max-w-full">
        Date of birth (optional)
      </label>
      <div className="flex justify-between items-center px-3 py-2 w-full rounded-lg border border-solid bg-stone-950 border-stone-800 min-h-[40px] max-md:max-w-full">
        <input
          ref={dateInputRef}
          type="date"
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="flex-1 bg-transparent border-none text-base text-stone-50"
        />
        <button
          type="button"
          onClick={handleIconClick}
          className="flex items-center justify-center bg-transparent border-none focus:outline-none"
        >
          {icon}
        </button>
      </div>
    </div>
  );
};
