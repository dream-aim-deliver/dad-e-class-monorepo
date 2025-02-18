import { FC } from 'react';
import clsx from 'clsx';

export interface CheckBoxProps {
  name: string;
  value: string;
  label?: React.ReactNode;
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

/**
 * A reusable CheckBox component that allows users to select or deselect an option.
 *
 * @param name The name attribute for the checkbox input.
 * @param value The value of the checkbox.
 * @param label The text label displayed next to the checkbox. Defaults to 'Checkbox'.
 * @param checked If true, the checkbox is checked. Defaults to false.
 * @param disabled If true, the checkbox is disabled and not clickable. Defaults to false.
 * @param withText If true, displays a label next to the checkbox. Defaults to false.
 * @param size Defines the checkbox size. Options: 'small', 'medium', 'large'. Defaults to 'medium'.
 * @param onChange Callback function triggered when the checkbox state changes.
 * @param labelClass Additional custom class names for styling the label.
 * @returns A customizable checkbox component with support for different sizes, labels, and states.
 */

export const CheckBox: FC<CheckBoxProps> = ({
  name,
  value,
  label = 'Checkbox',
  checked = false,
  disabled = false,
  withText = false,
  size = 'medium',
  onChange,
  labelClass,
}) => {
  const { container } = sizeConfig[size];

  const containerClasses = clsx(
    container,
    'rounded-small border-[1px] relative transition-all duration-200 flex items-center justify-center',
    {
      'bg-checkbox-fill border-checkbox-stroke hover:border-checkbox-hover-stroke hover:bg-checkbox-hover-fill':
        !checked && !disabled,
      'bg-checkbox-checked-fill border-none': checked && !disabled,
      'hover:bg-checkbox-checked-hover-fill': checked && !disabled,
      'opacity-50 bg-checkbox-checked-fill border-none': checked && disabled,
      'opacity-50 cursor-not-allowed': disabled,
      'opacity-50 border-checkbox-stroke bg-checkbox-fill':
        !checked && disabled,
      'cursor-pointer': !disabled,
    },
  );

  return (
    <label className="inline-flex items-start gap-3">
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
                stroke={
                  disabled
                    ? 'var(--color-base-neutral-600)'
                    : 'var(--color-checkbox-checked-check-mark)'
                }
                strokeWidth="6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
      {withText && <span className={labelClass}>{label}</span>}
    </label>
  );
};
