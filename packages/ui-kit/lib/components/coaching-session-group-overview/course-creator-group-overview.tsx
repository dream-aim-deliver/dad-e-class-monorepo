import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { IconCoachingOffer } from '../icons/icon-coaching-offer';
import { IconCourse } from '../icons/icon-course';
import { IconGroup } from '../icons/icon-group';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

export interface CourseCreatorGroupOverviewProps extends isLocalAware {
  withinCourse: boolean;
  userRole: 'student' | 'coach';
  status?: string;
  courseImageUrl?: string;
  courseName?: string;
  groupName?: string;
  creatorName?: string;
  creatorImageUrl?: string;
  onClickCourse?: () => void;
  onClickGroup?: () => void;
  onClickCreator?: () => void;
}

/**
 * CourseCreatorGroupOverview component for displaying course creator and group information.
 *
 * @param withinCourse When true, shows course and group sections. When false, hides course and group sections except for 'upcoming-locked' status which always shows them.
 * @param userRole Determines whether to show creator (for students) or hide creator info (for coaches).
 * @param status The current session status. Creator info is shown for all student variants when creatorName is provided. Course and group info is shown for 'upcoming-locked' regardless of withinCourse.
 * @param courseName The name of the course.
 * @param courseImageUrl The image URL of the course.
 * @param groupName The name of the group.
 * @param creatorName The name of the course creator.
 * @param creatorImageUrl The image URL of the course creator.
 * @param onClickCourse Callback triggered when clicking on the course.
 * @param onClickGroup Callback triggered when clicking on the group.
 * @param onClickCreator Callback triggered when clicking on the creator.
 * @param locale The locale for translation and localization purposes.
 *
 * @example
 * <CourseCreatorGroupOverview
 *   withinCourse={true}
 *   userRole="student"
 *   courseName="React Basics"
 *   courseImageUrl="https://example.com/course.jpg"
 *   groupName="Frontend Developers"
 *   creatorName="John Doe"
 *   creatorImageUrl="https://example.com/creator.jpg"
 *   onClickCourse={() => console.log('Course clicked')}
 *   onClickGroup={() => console.log('Group clicked')}
 *   onClickCreator={() => console.log('Creator clicked')}
 *   locale="en"
 * />
 */

export const CourseCreatorGroupOverview: React.FC<CourseCreatorGroupOverviewProps> = ({
  withinCourse,
  userRole,
  status,
  courseName,
  courseImageUrl,
  groupName,
  creatorName,
  creatorImageUrl,
  onClickCourse,
  onClickGroup,
  onClickCreator,
  locale,
}) => {
  const dictionary = getDictionary(locale);
  const createdByText = dictionary.components.coachingSessionCard.createdByText;
  const courseText = dictionary.components.coachingSessionCard.courseText;
  const groupText = dictionary.components.coachingSessionCard.groupText;

  // Show "Created by" section for all student variants that have creator information
  const showCreatedBy = userRole === 'student' && status !== 'unscheduled' && creatorName;
  // Show course and group sections when withinCourse is true OR for upcoming-locked status
  const showCourseAndGroup = withinCourse || status === 'upcoming-locked';

  // If nothing to show, return null
  if (!showCreatedBy && !showCourseAndGroup) {
    return null;
  }

  return (
    <div className="flex flex-col items-start w-full gap-1">
      {/* Show "Created by" section for all student variants that have creator information */}
      {showCreatedBy && (
        <div className="flex flex-wrap items-center gap-1 w-full">
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <IconCoachingOffer size="4" />
            <p className="text-sm text-text-secondary">{createdByText}</p>
          </div>
          <Button
            size="small"
            variant="text"
            className="flex gap-1 p-0 h-8 max-w-full"
            text={creatorName}
            onClick={onClickCreator}
            hasIconLeft
            iconLeft={
              <UserAvatar
                size="xSmall"
                imageUrl={creatorImageUrl}
              />
            }
          />
        </div>
      )}

      {/* Group section - only show when withinCourse is true */}
      {showCourseAndGroup && groupName && (
        <div className="flex flex-wrap items-center gap-1 w-full">
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <IconGroup size="4" data-testid="briefcase-icon" />
            <p className="text-sm text-text-secondary">{groupText}</p>
          </div>
          <Button
            size="small"
            variant="text"
            className="p-0 max-w-full"
            text={groupName}
            onClick={onClickGroup}
          />
        </div>
      )}

      {/* Course section - only show when withinCourse is true */}
      {showCourseAndGroup && courseName && (
        <div className="flex flex-wrap items-center gap-1 w-full">
          <div className="flex items-center gap-1 text-sm text-text-secondary">
            <IconCourse size="4" />
            <p className="text-sm text-text-secondary">{courseText}</p>
          </div>
          <Button
            size="small"
            variant="text"
            className="flex gap-1 p-0 h-8 max-w-full"
            text={courseName}
            onClick={onClickCourse}
            hasIconLeft
            iconLeft={
              <UserAvatar
                className="rounded-small"
                size="xSmall"
                imageUrl={courseImageUrl}
              />
            }
          />
        </div>
      )}

    </div>
  );
};