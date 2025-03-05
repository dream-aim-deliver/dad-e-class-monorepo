import * as React from 'react';
import { CreatorInfoProps } from './types';
import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { IconCoachingOffer } from '../icons/icon-coaching-offer';
import { IconAccountInformation } from '../icons/icon-account-information';
import { IconCourse } from '../icons/icon-course';
import { IconGroup } from '../icons/icon-group';

export function CreatorInfo({
  creatorName,
  courseName,
  groupName,
  userRole,
  withinCourse,
  groupSession,
  createdBy,
  student,
  course,
  group,
}: CreatorInfoProps) {
  return (
    <div className="flex flex-col items-start w-full gap-1">
      <div className="flex flex-wrap items-center gap-1">
        <div className="flex items-center gap-1 text-sm text-text-secondary">
          {userRole === 'student' ? (
            <>
              <IconCoachingOffer size="4" />
              <p className="text-sm text-text-secondary">{createdBy}</p>
            </>
          ) : (
            <>
              <IconAccountInformation size="4" />
              <p className="text-sm text-text-secondary">{student}</p>
            </>
          )}
        </div>
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
      </div>
      {withinCourse && (
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <IconCourse size="4" />
            <p className="text-sm text-text-secondary">{course}</p>
          </div>
          <Button
            size="small"
            variant="text"
            className="flex gap-1 p-0 h-8"
            text={courseName}
            hasIconLeft
            iconLeft={
              <UserAvatar
                hasProfilePicture={true}
                className="rounded-small"
                size="xSmall"
                imageUrl="https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg"
              />
            }
          />
        </div>
      )}
      {groupSession && (
        <div className="flex flex-wrap items-center gap-1">
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <IconGroup size="4" data-testid="briefcase-icon" />
            <p className="text-sm text-text-secondary">{group}</p>
          </div>
          <Button
            size="small"
            variant="text"
            className="flex gap-1 p-0 h-8"
            text={groupName}
          />
        </div>
      )}
    </div>
  );
}
