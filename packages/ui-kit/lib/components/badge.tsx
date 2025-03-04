import React from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { FC } from 'react';
import { cn } from '../utils/style-utils';

const badgeStyles = cva(
  'inline-flex items-center font-bold transition-colors',
  {
    variants: {
      variant: {
        primary: 'bg-action-default text-text-primary-inverted', // Primary style
        info: 'bg-base-neutral-400 text-text-primary-inverted', // Info style (default)
        successprimary:
          'bg-feedback-success-primary text-text-primary-inverted', // Success style
        warningprimary:
          'bg-feedback-warning-primary text-text-primary-inverted', // Warning style
        errorprimary: 'bg-feedback-error-primary text-text-primary-inverted', // Error style
      },
      size: {
        small: 'py-[2px] px-[4px] text-2xs rounded-small', // Small size badge
        big: 'py-2 px-[8px] text-sm rounded-medium', // Big size badge
      },
    },
    defaultVariants: {
      variant: 'info', // Default variant
      size: 'small', // Default size
    },
  },
);

export interface BadgeProps extends VariantProps<typeof badgeStyles> {
  children: React.ReactNode; // Content inside the badge
  onClick?: () => void; // Optional click handler
  className?: string; // Additional custom class names
}
/**
 * Props for the Badge component.
 *
 * @typedef {Object} BadgeProps
 * @property {React.ReactNode} children - Content inside the badge.
 * @property {() => void} [onClick] - Optional click handler.
 * @property {string} [className] - Additional custom class names.
 * @property {'primary' | 'info' | 'successprimary' | 'warningprimary' | 'errorprimary'} [variant='info'] - Visual style of the badge.
 * @property {'small' | 'big'} [size='small'] - Size of the badge.
 */

/**
 * A versatile Badge component to display labels or counts.
 *
 * @type {React.FC<BadgeProps>}
 *
 * @example
 * // Basic usage
 * <Badge variant="primary" size="small">New</Badge>
 *
 * @example
 * // With an onClick handler
 * <Badge variant="successprimary" size="big" onClick={() => alert('Badge clicked!')}>Success</Badge>
 */
export const Badge: FC<BadgeProps> = ({
  variant,
  size,
  children,
  onClick,
  className,
}) => {
  return (
    <span
      className={cn(badgeStyles({ variant, size }), className)}
      onClick={onClick}
    >
      {children}
    </span>
  );
};
