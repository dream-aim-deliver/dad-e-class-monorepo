import { cva, VariantProps } from 'class-variance-authority';
import { FC } from 'react';
import { cn } from '../utils/style-utils';

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

export interface BadgeProps extends VariantProps<typeof badgeStyles> {
  text?: string;
  onClick?: () => void;
  className?: string;
}

/**
 * A reusable Badge component with support for multiple variants, sizes, and optional click functionality.
 *
 * @param text Optional text to display inside the badge.
 * @param variant The visual style of the badge. Options:
 *  - `primary`: A primary badge with a default action background.
 *  - `info`: An informational badge with a neutral background (default).
 *  - `successprimary`: A success badge with a green background.
 *  - `warningprimary`: A warning badge with a yellow background.
 *  - `errorprimary`: An error badge with a red background.
 * @param size The size of the badge. Options:
 *  - `small`: A small badge with compact padding and font size (default).
 *  - `big`: A larger badge with more padding and font size.
 * @param onClick Optional callback function triggered when the badge is clicked. Useful for interactive badges.
 * @param className Optional additional CSS class names to customize the badge's appearance.
 *
 * @example
 * <Badge
 *   text="Success"
 *   variant="successprimary"
 *   size="big"
 *   onClick={() => console.log("Badge clicked!")}
 * />
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
