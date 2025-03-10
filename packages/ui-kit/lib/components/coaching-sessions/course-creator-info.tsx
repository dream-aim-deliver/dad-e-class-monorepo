import * as React from 'react';
import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { IconCoachingOffer } from '../icons/icon-coaching-offer';
import { IconAccountInformation } from '../icons/icon-account-information';
import { IconCourse } from '../icons/icon-course';
import { IconGroup } from '../icons/icon-group';

export interface CreatorInfoProps {
  creatorName?: string;
  courseName?: string;
  groupName?: string;
  userRole?: string;
  withinCourse?: boolean;
  groupSession?: boolean;
  createdBy: string;
  student: string;
  course: string;
  group: string;
}

/**
 * A component that displays creator-related information such as name, course, and group details.
 *
 * @param creatorName The name of the creator, displayed as a button with an avatar.
 * @param courseName The name of the course, shown if `withinCourse` is true.
 * @param groupName The name of the group, shown if `groupSession` is true.
 * @param userRole The role of the user, used to determine which icon and text to display.
 * @param withinCourse Boolean flag indicating whether the user is within a course.
 * @param groupSession Boolean flag indicating whether the user is in a group session.
 * @param createdBy Label for the creator when the user is a student.
 * @param student Label for the student when the user is a creator.
 * @param course Label for the course section.
 * @param group Label for the group section.
 *
 * @example
 * <CreatorInfo
 *   creatorName="John Doe"
 *   courseName="React Basics"
 *   groupName="Advanced Learners"
 *   userRole="student"
 *   withinCourse={true}
 *   groupSession={true}
 *   createdBy="Created by: Jane Smith"
 *   student="Student: Alex Brown"
 *   course="Course:"
 *   group="Group:"
 * />
 */

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
          truncateText
          variant="text"
          className="flex gap-1 p-0 h-8 max-w-[15rem]"
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
            truncateText
            variant="text"
            className="flex gap-1 p-0 h-8 max-w-[15rem]"
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
            truncateText
            variant="text"
            className="p-0 max-w-[15rem]"
            text={groupName}
          />
        </div>
      )}
    </div>
  );
}
