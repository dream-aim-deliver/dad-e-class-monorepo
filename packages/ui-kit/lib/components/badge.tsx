import { FC, ReactNode, isValidElement } from 'react';
import { cva, VariantProps } from 'class-variance-authority';
import { cn } from '../utils/style-utils';

const baseBadgeStyles = 'inline-flex items-center font-bold transition-colors';

const badgeStyles = cva(baseBadgeStyles, {
  variants: {
    variant: {
      primary: 'bg-action-default text-text-primary-inverted',
      info: 'bg-base-neutral-400 text-text-primary-inverted',
      successprimary: 'bg-feedback-success-primary text-text-primary-inverted',
      warningprimary: 'bg-feedback-warning-primary text-text-primary-inverted',
      errorprimary: 'bg-feedback-error-primary text-text-primary-inverted',
    },
    size: {
      small: 'py-[2px] px-[4px] text-2xs rounded-small',
      medium: 'py-1 px-2 text-xs rounded-small',
      big: 'py-2 px-[8px] text-sm rounded-medium',
      huge: 'py-3 px-4 text-md rounded-big',
    },
  },
  defaultVariants: {
    variant: 'info',
    size: 'small',
  },
});

export interface BadgeProps extends VariantProps<typeof badgeStyles> {
  text?: string;
  onClick?: () => void;
  className?: string;
  hasIconLeft?: boolean;
  hasIconRight?: boolean;
  iconLeft?: ReactNode;
  iconRight?: ReactNode;
}

/**
 * A reusable Badge component with support for multiple variants, sizes, optional icons, and click functionality.
 *
 * @param text Optional text to display inside the badge.
 * @param variant The visual style of the badge. Options:
 *   - `primary`: A primary badge with a default action background.
 *   - `info`: An informational badge with a neutral background (default).
 *   - `successprimary`: A success badge with a green background.
 *   - `warningprimary`: A warning badge with a yellow background.
 *   - `errorprimary`: An error badge with a red background.
 * @param size The size of the badge. Options:
 *   - `small`: A small badge with compact padding and font size (default).
 *   - `medium`: A medium-sized badge with standard padding.
 *   - `big`: A larger badge with more padding and font size.
 *   - `huge`: An extra-large badge for high visibility.
 * @param onClick Optional callback function triggered when the badge is clicked. Useful for interactive badges.
 * @param className Optional additional CSS class names to customize the badge's appearance.
 * @param hasIconLeft Optional flag indicating whether an icon should be displayed on the left side of the badge.
 * @param hasIconRight Optional flag indicating whether an icon should be displayed on the right side of the badge.
 * @param iconLeft Optional ReactNode representing an icon to display on the left side of the badge. Only rendered if `hasIconLeft` is true.
 * @param iconRight Optional ReactNode representing an icon to display on the right side of the badge. Only rendered if `hasIconRight` is true.
 *
 * @example
 * <Badge
 *   text="New"
 *   variant="primary"
 *   size="medium"
 *   onClick={() => console.log("Badge clicked!")}
 *   hasIconLeft
 *   iconLeft={<StarIcon />}
 * />
 */

export const Badge: FC<BadgeProps> = ({
  text,
  onClick,
  className,
  variant,
  size,
  hasIconLeft = false,
  hasIconRight = false,
  iconLeft,
  iconRight
}) => {
  const badgeSizeClasses = cn(badgeStyles({ variant, size }), className);

  return (
    <span
      role="badge"
      className={cn(
        onClick ? 'cursor-pointer' : '',
        'flex items-center gap-1',
        badgeSizeClasses,
      )}
      onClick={onClick}
    >
      {hasIconLeft && iconLeft && (
        <span
          className={cn(
            'flex items-center flex-shrink-0',
            isValidElement(iconLeft) ? '' : '',
          )}
          data-testid="icon-left"
        >
          {iconLeft}
        </span>
      )}
      <span className="truncate leading-none">{text}</span>
      {hasIconRight && iconRight && (
        <span
          className={cn(
            'flex items-center  flex-shrink-0',
            isValidElement(iconRight) ? '' : '',
          )}
          data-testid="icon-right"
        >
          {iconRight}
        </span>
      )}
    </span>
  );
};