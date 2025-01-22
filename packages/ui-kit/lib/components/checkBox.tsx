import { FC } from 'react';
import clsx from 'clsx';

interface CheckboxProps {
  name: string;
  value: string;
  label?: string;
  checked?: boolean;
  disabled?: boolean;
  withText?: boolean;
  size?: 'small' | 'medium' | 'large';
  onChange?: (value: string) => void;
  labelClass?: string;
}

const sizeConfig = {
  small: {
    container: 'w-[24px] h-[24px]',
  },
  medium: {
    container: 'w-[32px] h-[32px]',
  },
  large: {
    container: 'w-[40px] h-[40px]',
  },
};

const Checkbox: FC<CheckboxProps> = ({
  name,
  value,
  label = "Checkbox",
  checked = false,
  disabled = false,
  withText = false,
  size = 'medium',
  onChange,
  labelClass
}) => {
  const { container } = sizeConfig[size];

  const containerClasses = clsx(
    container,
    'rounded-small border-[1px] relative transition-all duration-200 flex items-center justify-center',
    {
      'border-base-neutral-600 hover:border-badge-secondary hover:bg-base-neutral-600': !checked && !disabled,
      'bg-button-primary-fill border-none': checked && !disabled,
      'hover:bg-base-brand-400': checked && !disabled,
      'opacity-50 bg-button-primary-fill border-none': checked && disabled,
      'opacity-50 cursor-not-allowed': disabled,
      'border-base-neutral-600 ': !checked && disabled,
      'cursor-pointer': !disabled
    }
  );

  const textClasses = clsx(
    'text-xs text-base-neutral-50 select-none ml-[12px]',
    labelClass
  );

  return (
    <label className="inline-flex items-center">
      <div className="relative">
        <input
          type="checkbox"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => !disabled && onChange?.(value)}
          className="sr-only"
        />
        <div className={containerClasses}>
          {checked && (
            <svg
              data-testid="checked-icon"
              viewBox="0 0 32 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M8 16L13 21L24 8"
                stroke={disabled ? "var(--color-base-neutral-600)" : "var(--color-checkbox-checked-check-mark)"}
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      {withText && <span className={textClasses}>{label}</span>}
    </label>
  );
};

export default Checkbox;