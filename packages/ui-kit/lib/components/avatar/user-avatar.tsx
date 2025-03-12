import { FC } from 'react';
import { cn } from '../../utils/style-utils';

export interface UserAvatarProps {
  size?: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge'; // Defines avatar sizes
  hasProfilePicture?: boolean; // Indicates if the user has a profile picture
  imageUrl?: string; // URL of the profile picture
  initials?: string; // Initials to display if no profile picture is present
  className?: string; // Additional styling classes
}

export const UserAvatar: FC<UserAvatarProps> = ({
  size = 'medium',
  hasProfilePicture=false,
  initials = '',
  imageUrl = '',
  className,
}) => {
  /**
   * Defines the size classes for different avatar sizes.
   */
  const sizeClasses = {
    xSmall: 'w-6 h-6 text-xs',
    small: 'w-6 h-6 text-sm',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-sm',
    xLarge: 'w-20 h-20 text-sm',
  };

  return (
    <div
      data-testid="user-avatar"
      className={cn(
        'flex items-center justify-center rounded-full',
        !hasProfilePicture &&
          'bg-base-neutral-700 text-text-secondary font-bold border border-base-neutral-600', // Styling when no profile picture
        sizeClasses[size], // Apply size styles
        className,
      )}
    >
      {hasProfilePicture && imageUrl  ? (

        // Render profile picture if available
        <img
          src={imageUrl}
          alt="Profile"
          className={cn('w-full h-full object-cover rounded-full', className)}
        />
      ) : (
        // Render initials if no profile picture
        <span>{initials}</span>
      )}
    </div>
  );
};
