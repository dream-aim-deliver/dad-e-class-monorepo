import { FC, useState } from 'react';
import { cn } from '../../utils/style-utils';

export interface UserAvatarWithPicture {
  size?: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';
  hasProfilePicture?: true | false;
  imageUrl?: string;
  initials?: string; 
  className?: string;
}

export type UserAvatarProps = UserAvatarWithPicture;
/**
 * Props for the UserAvatar component.
 *
 * @param size The size of the avatar. Options:
 *   - `xSmall`: Extra small avatar.
 *   - `small`: Small avatar.
 *   - `medium`: Medium avatar (default).
 *   - `large`: Large avatar.
 *   - `xLarge`: Extra large avatar.
 * @param hasProfilePicture Indicates if the user has a profile picture.
 * @param imageUrl The URL of the profile picture to display.
 * @param initials The user's initials to display when no image is available.
 * @param className Additional CSS class names for custom styling.
 *
 * @example
 * <UserAvatar size="large" imageUrl="https://example.com/avatar.jpg" />
 *
 * @example
 * <UserAvatar size="medium" initials="JD" />
 */
export const UserAvatar: FC<UserAvatarProps> = (props) => {
  const { size = 'medium', className } = props;
  const [isImageValid, setIsImageValid] = useState(true);

  const sizeClasses = {
    xSmall: 'w-6 h-6 text-2xs',
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-sm',
    xLarge: 'w-20 h-20 text-sm',
  };

  const shouldShowInitials = !props.imageUrl || !isImageValid;
  const initials = 'initials' in props ? props.initials?.slice(0, 2) || 'NA' : 'NA';

  return (
    <div
      data-testid="user-avatar"
      className={cn(
        'flex items-center justify-center rounded-full',
        shouldShowInitials && 'bg-base-neutral-700 text-text-secondary font-bold border border-base-neutral-600',
        sizeClasses[size],
        className,
      )}
    >
      {!shouldShowInitials  ? (
        <img
          src={props.imageUrl}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
          onError={() => setIsImageValid(false)}
        />
      ) : (
        <span className='uppercase'>{initials}</span>
      )}
    </div>
  );
};
