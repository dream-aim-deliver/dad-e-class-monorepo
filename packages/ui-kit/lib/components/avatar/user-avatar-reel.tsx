import { FC, ReactNode } from 'react';
import { cn } from '../../utils/style-utils';

interface UserAvatarReelProps {
  children: ReactNode;
  className?: string;
}

/**
 * 
 * @props {UserAvatarReelProps} props - The component props.
 * @props {ReactNode} props.children - UserAvatar components to display in the reel.
 * @props {string} [props.className] - Additional class names for styling.
 *
 * @returns {JSX.Element} A horizontal container that displays overlapping UserAvatar components, typically used to show groups of users.
 * 
 * @example Standard usage
 * ```
 * <UserAvatarReel>
 *   <UserAvatar fullName="Alice Smith" imageUrl="..." />
 *   <UserAvatar fullName="Bob Johnson" imageUrl="..." />
 *   <UserAvatar fullName="Charlie Brown" imageUrl="..." />
 *   <UserAvatar fullName="+3" />
 * </UserAvatarReel>
 * ```
 */

export const UserAvatarReel: FC<UserAvatarReelProps> = ({
  children,
  className,
}) => {
  return (
    <div
      role='group'
      className={cn('flex items-center', className)}
    >
      {children}
    </div>
  );
};
