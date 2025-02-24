import { Button } from '../button';
import * as React from 'react';
import { UserAvatar } from '../avatar/user-avatar';
import { IconCoachingOffer } from '../icons/icon-coaching-offer';

export interface CourseCreatorProps {
  creatorName: string;
  you?: boolean;
  // ImageUrl required for course-creator avatar
}

export const CourseCreator: React.FC<CourseCreatorProps> = ({
  creatorName,
  you = false,
}) => (
  <div className="flex flex-wrap items-center gap-1 min-h-[32px]">
    <div className="flex items-center gap-1 text-sm text-text-secondary">
      <IconCoachingOffer data-testid="briefcase-icon" />
      <span>Created by</span>
    </div>
    {!you ? (
      <Button
        size="small"
        variant="text"
        className="flex gap-1 p-0 h-8"
        text={creatorName}
        hasIconLeft
        iconLeft={
          <UserAvatar
            hasProfilePicture={true}
            size="xSmall"
            imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
          />
        }
      />
    ) : (
      <p className="text-base-white text-sm font-bold">You</p>
    )}
  </div>
);
