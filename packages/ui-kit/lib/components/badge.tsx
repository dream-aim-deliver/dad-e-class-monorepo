/**
 * A Badge component that displays a stylized label with different variants and sizes.
 * @param variant Determines the visual style of the badge (e.g., primary, info, success, warning, error).
 * @param size Controls the size of the badge (small or big).
 * @param children The content inside the badge.
 * @param onClick Optional click event handler for the badge.
 * @param className Additional custom class names for styling.
 * @returns A styled badge component.
 */
import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { FC } from 'react';
import { cn } from '../utils/style-utils';

/**
 * Defines the base styles and variant-specific styles for the badge component.
 */
const badgeStyles = cva(
  'inline-flex items-center font-bold transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-action-default text-text-primary-inverted', 
        info: 'bg-base-neutral-400 text-text-primary-inverted', 
        successprimary:
          'bg-feedback-success-primary text-text-primary-inverted',
        warningprimary:
          'bg-feedback-warning-primary text-text-primary-inverted', 
        errorprimary: 'bg-feedback-error-primary text-text-primary-inverted', 
      },
      size: {
        small: 'py-[2px] px-[4px] text-2xs rounded-small',
        big: 'py-2 px-[8px] text-sm rounded-medium',
      },
    },
    defaultVariants: {
      variant: 'info', 
      size: 'small', 
    },
  },
);

/**
 * Props for the Badge component, extending the variant properties.
 */
export interface BadgeProps extends VariantProps<typeof badgeStyles> {
  text: String;
  onClick?: () => void;
  className?: string;
}

/**
 * Badge component renders a stylized label with customizable variant and size.
 */
export const Badge: FC<BadgeProps> = ({
  text,
  variant,
  size,
  onClick,
  className,
}) => {
  return (
    <span
      className={cn(badgeStyles({ variant, size }), className)}
      onClick={onClick}
    >
      {text}
    </span>
  );
};
