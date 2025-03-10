import { FC, ReactNode, isValidElement } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../utils/style-utils';

const baseDisabledStyles = 'disabled:opacity-50';
const baseButtonStyles =
  'inline-flex items-center justify-center font-bold transition-colors focus:outline-none';
const boxShadowStyles =
  'box-shadow: 0px 10px 10px -3px rgba(0, 0, 0, 0.06) inset, 0px 1px 2px 0px rgba(0, 0, 0, 0.08) inset';
const buttonStyles = cva(baseButtonStyles, {
  variants: {
    variant: {
      primary: `
            bg-button-primary-fill text-button-primary-text
            hover:bg-button-primary-hover-fill active:bg-button-primary-pressed-fill
            ${boxShadowStyles}
            disabled:bg-button-primary-fill ${baseDisabledStyles}
            disabled:hover:bg-button-primary-fill disabled:active:bg-button-primary-fill`,
      secondary: `
            border-2 text-button-secondary-text border-button-secondary-stroke bg-button-secondary-fill
            hover:border-button-secondary-hover-stroke hover:text-button-secondary-hover-text hover:bg-button-secondary-hover-fill
            active:border-button-secondary-pressed-stroke active:bg-button-secondary-pressed-fill active:text-button-secondary-pressed-text
            ${boxShadowStyles}
            disabled:bg-button-secondary-fill ${baseDisabledStyles}
            disabled:hover:border-button-secondary-stroke disabled:hover:text-button-secondary-text disabled:hover:bg-button-secondary-fill
            disabled:active:border-button-secondary-stroke disabled:active:bg-button-secondary-fill disabled:active:text-button-secondary-text`,
      text: `
            border-0 text-button-text-text bg-transparent
            hover:text-button-text-hover-text active:text-button-text-pressed-text
            disabled:text-button-text-text ${baseDisabledStyles}
            disabled:hover:text-button-text-text disabled:active:text-button-text-text`,
    },
    size: {
      small: 'px-3 h-[2rem] text-sm rounded-small',
      medium: 'px-3 h-[2.5rem] text-md rounded-medium',
      big: 'px-4 h-[3.5rem] text-xl rounded-big',
      huge: 'px-8 h-[4.5rem] text-2xl rounded-huge',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'medium',
  },
});

export interface ButtonProps extends VariantProps<typeof buttonStyles> {
  text?: string;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
  hasIconLeft?: boolean;
  hasIconRight?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
  truncateText?: boolean; // New prop to control text truncation
}

/**
 * A reusable Button component with support for multiple variants, sizes, optional icons, and accessibility features.
 *
 * @param text Optional text to display inside the button.
 * @param variant The visual style of the button. Options:
 *   - `primary`: A primary button with a solid background and text color (default).
 *   - `secondary`: A secondary button with a border and fill styles.
 *   - `text`: A text-only button with no background or border.
 * @param size The size of the button. Options:
 *   - `small`: A small button with compact padding and font size.
 *   - `medium`: A medium-sized button (default).
 *   - `big`: A large button with increased padding and font size.
 *   - `huge`: An extra-large button for high visibility.
 * @param onClick Optional callback function triggered when the button is clicked.
 * @param className Optional additional CSS class names to customize the button's appearance.
 * @param disabled Optional flag indicating whether the button is disabled. When true, the button is non-interactive and visually dimmed.
 * @param hasIconLeft Optional flag indicating whether an icon should be displayed on the left side of the button.
 * @param hasIconRight Optional flag indicating whether an icon should be displayed on the right side of the button.
 * @param iconLeft Optional ReactNode representing an icon to display on the left side of the button. Only rendered if `hasIconLeft` is true.
 * @param iconRight Optional ReactNode representing an icon to display on the right side of the button. Only rendered if `hasIconRight` is true.
 * @param truncateText Optional flag to enable text truncation with ellipsis for long text. Default is false.
 *
 * @example
 * <Button
 *   variant="primary"
 *   size="medium"
 *   onClick={() => console.log("Button clicked!")}
 *   hasIconLeft
 *   iconLeft={<ArrowLeftIcon />}
 *   truncateText
 * />
 */

export const Button: FC<ButtonProps> = ({
  text,
  onClick,
  className,
  disabled,
  variant,
  size,
  hasIconLeft = false,
  hasIconRight = false,
  iconLeft,
  iconRight,
  truncateText = false,
}) => {
  const buttonSizeClasses = cn(buttonStyles({ variant, size }), className);

  return (
    <button
      className={cn(
        buttonSizeClasses,
        'cursor-pointer flex items-center gap-1',
        truncateText && 'min-w-0',
      )}
      onClick={onClick}
      disabled={disabled}
    >
      {hasIconLeft && iconLeft && (
        <span
          className={cn(
            'flex items-center flex-shrink-0', // Add flex-shrink-0 to prevent icon from shrinking
            isValidElement(iconLeft)
              ? ''
              : 'hover:text-hover-color active:text-pressed-color',
            disabled ? 'opacity-50' : '',
          )}
          data-testid="icon-left"
        >
          {iconLeft}
        </span>
      )}

      {/* Wrap text in a span with truncation if enabled */}
      {text && (
        <span title={text} className={truncateText ? 'truncate min-w-0' : ''}>
          {text}
        </span>
      )}

      {hasIconRight && iconRight && (
        <span
          className={cn(
            'flex items-center flex-shrink-0', // Add flex-shrink-0 to prevent icon from shrinking
            isValidElement(iconRight)
              ? ''
              : 'hover:text-hover-color active:text-pressed-color',
            disabled ? 'opacity-50' : '',
          )}
          data-testid="icon-right"
        >
          {iconRight}
        </span>
      )}
    </button>
  );
};
