import { FC } from 'react';
import { cn } from '../../utils/style-utils';
import React from 'react';

export interface UserAvatarWithPicture {
  size?: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';
  hasProfilePicture: true;
  imageUrl: string;
  className?: string;
}
export interface UserAvatarWithoutPicture {
  size?: 'xSmall' | 'small' | 'medium' | 'large' | 'xLarge';
  hasProfilePicture: false;
  initials: string;
  className?: string;
}
export type UserAvatarProps = UserAvatarWithPicture | UserAvatarWithoutPicture;

/**
 * A UserAvatar component that displays a user's profile picture or initials.
 * @param size The size of the avatar ('xSmall', 'small', 'medium', 'large', 'xLarge'). Default is 'medium'.
 * @param hasProfilePicture Boolean flag to determine if the user has a profile picture.
 * @param imageUrl The URL of the user's profile picture (if available).
 * @param initials The user's initials (used when there is no profile picture). Default is 'JF'.
 * @param className Additional custom class names for styling.
 * @returns A circular avatar component displaying either an image or initials.
 */

export const UserAvatar: FC<UserAvatarProps> = (props) => {
  const { size = 'medium', className } = props;
  const sizeClasses = {
    xSmall: 'w-6 h-6 text-2xs',
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-sm',
    large: 'w-16 h-16 text-sm',
    xLarge: 'w-20 h-20 text-sm',
  };

  return (
    <div
      data-testid="user-avatar"
      className={cn(
        'flex items-center justify-center rounded-full',
        !props.hasProfilePicture &&
          'bg-base-neutral-700 text-text-secondary font-bold border border-base-neutral-600',
        sizeClasses[size],
        className,
      )}
    >
      {props.hasProfilePicture ? (
        <img
          src={props.imageUrl}
          alt="Profile"
          className={cn('w-full h-full object-cover rounded-full', className)}
        />
      ) : (
        'initials' in props && <span>{props.initials.slice(0, 2)}</span>
      )}
    </div>
  );
};