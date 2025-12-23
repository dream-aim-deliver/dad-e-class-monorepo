'use client';
import { FC, useState, useMemo } from 'react';
import { cn } from '../../utils/style-utils';
import { useImageComponent } from '../../contexts/image-component-context';

export interface UserAvatarProps {
  size?: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';
  imageUrl?: string;
  fullName?: string;
  className?: string;
  initialsCount?: number;
  title?: string;
}

/**
 * A component that displays a user's avatar, either as an image or initials.
 *
 * - If the `fullName` starts with a '+', the avatar will display up to 3 characters (the plus sign and two digits/letters, e.g., '+12', '+99').
 * - Otherwise, it displays the initials from the user's name (first and last initials, or first two letters if only one word).
 *
 * @param size The size of the avatar. Options:
 *   - `xSmall`: Extra small avatar (24px)
 *   - `small`: Small avatar (32px)
 *   - `medium`: Medium avatar (48px, default)
 *   - `large`: Large avatar (64px)
 *   - `xLarge`: Extra large avatar (80px)
 * @param imageUrl The URL of the profile picture to display.
 * @param fullName The user's full name to display initials when no image is available.
 * @param className Additional CSS class names for custom styling.
 *
 * @example
 * <UserAvatar fullName="John Doe" size="large" imageUrl="https://example.com/avatar.jpg" />
 *
 * @example
 * <UserAvatar fullName="John Doe" size="medium" />
 *
 * @example
 * <UserAvatar fullName="+24" size="medium" /> // Will display '+24' (plus sign and two characters)
 */

export const UserAvatar: FC<UserAvatarProps> = (props) => {
  const ImageComponent = useImageComponent();
  const { size = 'medium', className, imageUrl, fullName = '' } = props;
  const [isImageValid, setIsImageValid] = useState(Boolean(imageUrl));

  // Size mapping with consistent class structure
  const sizeClasses = {
    xSmall: 'w-6 h-6 text-2xs',
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-sm',
    xLarge: 'w-20 h-20 text-sm',
  };

  // Pixel dimensions for Next.js Image optimization
  const sizeDimensions = {
    xSmall: 24,
    small: 32,
    medium: 48,
    large: 64,
    xLarge: 80,
  };

  const initials = useMemo(() => {
    if (!fullName || typeof fullName !== 'string') return '';

    const trimmedName = fullName.trim();
    if (!trimmedName) return '';

    if (trimmedName.startsWith('+')) {
      const count = props.initialsCount ?? 3;
      return trimmedName.substring(0, count);
    }

    const nameParts = trimmedName.split(/\s+/);

    if (nameParts.length >= 2) {
      const firstInitial = nameParts[0][0] || '';
      const lastInitial = nameParts[nameParts.length - 1][0] || '';
      return `${firstInitial}${lastInitial}`;
    } else {
      return trimmedName.length >= 2
        ? trimmedName.substring(0, 2)
        : trimmedName;
    }
  }, [fullName]);

  const shouldShowInitials = !imageUrl || !isImageValid;

  const handleImageError = () => {
    setIsImageValid(false);
  };

  return (
    <div
      data-testid="user-avatar"
      className={cn(
        'flex items-center justify-center rounded-full overflow-hidden flex-shrink-0',
        shouldShowInitials &&
        'bg-base-neutral-700 text-text-secondary font-bold border border-base-neutral-600',
        sizeClasses[size],
        className,
      )}
      aria-label={fullName || 'User avatar'}
    >
      {!shouldShowInitials ? (
        <ImageComponent
          src={imageUrl}
          alt={fullName || 'User profile'}
          width={sizeDimensions[size]}
          height={sizeDimensions[size]}
          className="w-full h-full object-cover object-center"
          onError={handleImageError}
        />
      ) : (
        <span className="uppercase">{initials}</span>
      )}
    </div>
  );
};