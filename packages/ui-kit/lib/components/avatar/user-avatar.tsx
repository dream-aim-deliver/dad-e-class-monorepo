import { FC } from 'react';
import { cn } from '../../utils/style-utils';

export interface UserAvatarWithPicture {
  size?: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';
  hasProfilePicture: true;
  imageUrl?: string;
  className?: string;
}

export interface UserAvatarWithoutPicture {
  size?: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';
  hasProfilePicture?: false;
  initials?: string;
  className?: string;
}

export type UserAvatarProps = UserAvatarWithPicture | UserAvatarWithoutPicture;

export const UserAvatar: FC<UserAvatarProps> = (props) => {
  const { size = 'medium', className } = props;
  const sizeClasses = {
    xSmall: 'w-6 h-6 text-2xs',
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-sm',
    xLarge: 'w-20 h-20 text-sm',
  };

  // Default values
  const hasProfilePicture = props.hasProfilePicture ?? false;
  const initials = 'initials' in props ? props.initials?.slice(0, 2) ?? 'JF' : 'JF';
  const imageUrl =
    props.hasProfilePicture && 'imageUrl' in props
      ? props.imageUrl ?? 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg'
      : undefined;

  return (
    <div
      data-testid="user-avatar"
      className={cn(
        'flex items-center justify-center rounded-full',
        !hasProfilePicture &&
          'bg-base-neutral-700 text-text-secondary font-bold border border-base-neutral-600',
        sizeClasses[size],
        className,
      )}
    >
      {hasProfilePicture ? (
        <img
          src={imageUrl}
          alt="Profile"
          className={cn('w-full h-full object-cover rounded-full', className)}
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
};