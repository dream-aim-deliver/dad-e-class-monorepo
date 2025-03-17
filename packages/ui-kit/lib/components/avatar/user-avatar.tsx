import { FC, useState, useMemo } from 'react';
import { cn } from '../../utils/style-utils';

export interface UserAvatarProps {
  size?: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';
  imageUrl?: string;
  fullName?: string;
  className?: string;
}

/**
 * A component that displays a user's avatar, either as an image or initials.
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
 */
export const UserAvatar: FC<UserAvatarProps> = (props) => {
  const { size = 'medium', className, imageUrl, fullName = '' } = props;
  const [isImageValid, setIsImageValid] = useState(Boolean(imageUrl));

  // Size mapping with consistent class structure
  const sizeClasses = {
    xSmall: 'w-6 h-6 text-2xs',
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-sm',
    xLarge: 'w-20 h-20 text-sm',
  };

  const initials = useMemo(() => {
    if (!fullName || typeof fullName !== 'string') return '';

    const trimmedName = fullName.trim();
    if (!trimmedName) return '';

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
        'flex items-center justify-center rounded-full overflow-hidden',
        shouldShowInitials &&
          'bg-base-neutral-700 text-text-secondary font-bold border border-base-neutral-600',
        sizeClasses[size],
        className,
      )}
      aria-label={fullName || 'User avatar'}
    >
      {!shouldShowInitials ? (
        <img
          src={imageUrl}
          alt={fullName || 'User profile'}
          className="w-full h-full object-cover object-center"
          onError={handleImageError}
        />
      ) : (
        <span className="uppercase">{initials}</span>
      )}
    </div>
  );
};
