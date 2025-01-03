"use client";
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../utils/style-utils';

const buttonStyles = cva(
  'inline-flex items-center justify-center  font-bold transition-colors focus:outline-none',
  {
    variants: {
      variant: {
        primary: 'bg-primary text-black hover:bg-button-hover active:bg-button-pressed disabled:bg-button-disabled',
        tirtary: 'bg-secondary text-black hover:bg-secondary-hover active:bg-secondary-pressed disabled:bg-secondary-disabled',
        secondary: 'border-2 text-primary border-primary bg-transparent hover:border-button-hover active:border-button-pressed disabled:border-button-disabled',
        text:'border-0 text-primary  bg-transparent hover:text-button-hover active:text-button-pressed disabled:text-button-diabled',
        danger: 'bg-red-500 text-white hover:bg-red-600 active:bg-red-700 disabled:bg-red-300',
      },
      size: {
        small: 'px-2 py-1 text-sm rounded-smallrad',
        medium: 'px-4 py-2 text-base rounded-buttonBig',
        large: 'px-6 py-3 text-lg rounded-badgeBig',
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
