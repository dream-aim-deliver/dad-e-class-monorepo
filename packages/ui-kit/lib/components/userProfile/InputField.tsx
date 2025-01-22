import * as React from 'react';
import { InputFieldProps } from './types';

export const InputField: React.FC<InputFieldProps> = ({ label, value, isOptional, onChange }) => (
  <div className="flex flex-col w-full whitespace-nowrap max-md:max-w-full">
    <label className="flex-1 shrink gap-2 self-stretch w-full text-sm leading-none min-h-[22px] text-stone-300 max-md:max-w-full">
      {label}{isOptional && " (optional)"}
    </label>
    <input
      className="flex flex-col justify-center px-3 py-2 w-full text-base rounded-lg border border-solid bg-stone-950 border-stone-800 min-h-[40px] text-stone-50 max-md:max-w-full"
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
    />
  </div>
);
