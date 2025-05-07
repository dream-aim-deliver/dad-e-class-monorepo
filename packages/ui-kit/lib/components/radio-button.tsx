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
 * A reusable RadioButton component with support for multiple sizes, states (checked/disabled), and optional labels.
 *
 * @param name The name of the radio button group.
 * @param value The value associated with the radio button.
 * @param label Optional label to display next to the radio button. Defaults to "Radio Button".
 * @param checked Optional flag indicating whether the radio button is selected. Defaults to `false`.
 * @param disabled Optional flag indicating whether the radio button is disabled. Defaults to `false`.
 * @param withText Optional flag indicating whether to display a label next to the radio button. Defaults to `false`.
 * @param size The size of the radio button. Options:
 *   - `small`: Small-sized radio button.
 *   - `medium`: Medium-sized radio button (default).
 *   - `large`: Large-sized radio button.
 * @param onChange Optional callback function triggered when the state changes. Receives the `value` as an argument.
 * @param labelClass Optional additional CSS classes for customizing the label's appearance.
 *
 * @example
 * <RadioButton
 *   name="example-group"
 *   value="option1"
 *   label="Option 1"
 *   checked={true}
 *   onChange={(value) => console.log("Selected:", value)}
 *   size="medium"
 * />
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
    <label className="inline-flex items-center gap-3 w-full">
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
