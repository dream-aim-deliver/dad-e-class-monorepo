"use client";
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../utils/style-utils';
/**
 * A reusable Button component with multiple variants and sizes.
 *
 * @param children The content inside the button, typically text or an icon.
 * @param onClick Callback function triggered when the button is clicked.
 * @param className Additional custom class names for styling.
 * @param disabled If true, the button is disabled and not interactive. Defaults to false.
 * @param variant Defines the button style variant. Options: 'primary', 'secondary', 'text'. Defaults to 'primary'.
 * @param size Defines the button size. Options: 'small', 'medium', 'big', 'huge'. Defaults to 'medium'.
 * @returns A customizable button component that supports different styles, sizes, and states.
 */

const buttonStyles = cva(
  'inline-flex items-center justify-center  font-bold transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        primary:
          'bg-button-primary-fill text-button-primary-text hover:bg-button-primary-hover-fill active:bg-button-primary-pressed-fill disabled:bg-button-primary-fill disabled:opacity-50',
        secondary:
          'border-2 text-button-secondary-text border-button-secondary-stroke bg-transparent hover:border-button-secondary-hover-stroke active:border-button-secondary-pressed-stroke disabled:border-button-secondary-stroke disabled:opacity-50',
        text: 'border-0 text-button-text-text  bg-transparent hover:text-button-text-hover-text active:text-button-text-pressed-text disabled:text-button-text-text disabled:opacity-50',
      },
      size: {
        small: 'px-3 py-1 text-sm rounded-small',
        medium: 'px-3 py-2 text-md rounded-medium',
        big: 'p-4 text-xl rounded-big',
        huge: 'px-8 text-2xl rounded-huge',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'medium',
    },
  }
);

export interface ButtonProps extends VariantProps<typeof buttonStyles> {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      className={cn(buttonStyles({variant: props.variant, size: props.size}), "cursor-pointer", props.className)}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      {props.children}
    </button>
  );
};
