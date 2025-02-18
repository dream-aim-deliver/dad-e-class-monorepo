import { FC } from 'react';
import clsx from 'clsx';

export interface RadioButtonProps {
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
    inner: 'w-[18px] h-[18px]',
  },
  medium: {
    container: 'w-[32px] h-[32px]',
    inner: 'w-[24px] h-[24px]',
  },
  large: {
    container: 'w-[40px] h-[40px]',
    inner: 'w-[30px] h-[30px]',
  },
};

/**
 * A reusable RadioButton component that allows users to select a single option from a set.
 *
 * @param name The name attribute for the radio input.
 * @param value The value of the radio button.
 * @param label The text label displayed next to the radio button. Defaults to 'Radio Button'.
 * @param checked If true, the radio button is selected. Defaults to false.
 * @param disabled If true, the radio button is disabled and not clickable. Defaults to false.
 * @param withText If true, displays a label next to the radio button. Defaults to false.
 * @param size Defines the radio button size. Options: 'small', 'medium', 'large'. Defaults to 'medium'.
 * @param onChange Callback function triggered when the radio button state changes.
 * @param labelClass Additional custom class names for styling the label.
 * @returns A customizable radio button component with support for different sizes, labels, and states.
 */

export const RadioButton: FC<RadioButtonProps> = ({
  name,
  value,
  label = 'Radio Button',
  checked = false,
  disabled = false,
  withText = false,
  size = 'medium',
  onChange,
  labelClass,
}) => {
  const { container, inner } = sizeConfig[size];

  const containerClasses = clsx(
    container,
    'rounded-full border border-radio-background-stroke bg-radio-background-fill relative flex items-center justify-center transition-all duration-200 group',
    {
      'cursor-pointer hover:border-radio-hover-background-stroke hover:bg-radio-hover-background-fill':
        !disabled,
      'opacity-50 cursor-not-allowed': disabled,
    },
  );

  const innerCircleClasses = clsx(
    inner,
    'rounded-full transition-all duration-200',
    {
      hidden: !checked,
      'bg-button-primary-fill group-hover:bg-button-primary-hover-fill':
        !disabled,
      'bg-button-primary-fill opacity-50': disabled,
    },
  );

  return (
    <label className="inline-flex items-center gap-3">
      <div className="relative">
        <input
          type="radio"
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => !disabled && onChange?.(value)}
          className="sr-only"
        />
        <div className={containerClasses}>
          <div className={innerCircleClasses} />
        </div>
      </div>
      {withText && <span className={labelClass}>{label}</span>}
    </label>
  );
};
