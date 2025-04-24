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
 * A reusable CheckBox component with support for different sizes, states (checked/disabled), and optional labels.
 *
 * @param name The name of the checkbox input.
 * @param value The value associated with the checkbox.
 * @param label Optional label to display next to the checkbox.
 * @param checked Optional flag indicating whether the checkbox is checked.
 * @param disabled Optional flag indicating whether the checkbox is disabled.
 * @param withText Optional flag indicating whether to display a label next to the checkbox.
 * @param size The size of the checkbox. Options:
 *   - `small`: Small-sized checkbox.
 *   - `medium`: Medium-sized checkbox (default).
 *   - `large`: Large-sized checkbox.
 * @param onChange Optional callback function triggered when the checkbox state changes. Receives the `value` as an argument.
 * @param labelClass Optional additional CSS classes for customizing the label's appearance.
 *
 * @example
 * <CheckBox
 *   name="example-checkbox"
 *   value="example"
 *   label="Example Checkbox"
 *   checked={true}
 *   onChange={(value) => console.log("Checkbox changed:", value)}
 *   size="medium"
 * />
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
    <label className="inline-flex items-center gap-3 w-full">
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
              width="32"
              height="28"
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
