import { Button } from '../button';
import * as React from 'react';
import { UserAvatar } from '../avatar/user-avatar';
import { IconCoachingOffer } from '../icons/icon-coaching-offer';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';

interface CourseCreatorProps extends isLocalAware {
  creatorName: string;
  imageUrl?: string;
  you?: boolean;
  onClickUser?: () => void;
}

/**
 * A component for displaying the creator of a course with an avatar and name, optionally indicating if it’s the current user.
 *
 * @param creatorName The name of the course creator.
 * @param imageUrl Optional URL of the creator’s profile image.
 * @param you Optional boolean indicating if the creator is the current user (defaults to false).
 * @param locale The locale for translation and localization purposes.
 * @param onClickUser Optional callback function triggered when the user name is clicked. 
 * @example
 * <CourseCreator
 *   creatorName="Jane Doe"
 *   imageUrl="https://example.com/jane-doe.jpg"
 *   you={false}
 *   locale="en"
 *   onClickUser={() => console.log("Creator clicked!")}
 * />
 */
export const CourseCreator: React.FC<CourseCreatorProps> = ({
  creatorName,
  you = false,
  imageUrl,
  onClickUser,
  locale
}) => {
  const dictionary = getDictionary(locale);
  return (
    <div className="flex flex-wrap items-center gap-1 min-h-[32px] w-full">
      <div className="flex items-center gap-1 text-sm text-text-secondary">
        <IconCoachingOffer size='5' data-testid="briefcase-icon" />
        <span>{dictionary.components.courseCard.createdBy}</span>
      </div>
      {!you ? (
        <Button
          size="small"
          variant="text"
          className="flex gap-1 p-0 h-8 max-w-full"
          text={creatorName}
          hasIconLeft
          iconLeft={
            <UserAvatar
              size="xSmall"
              imageUrl={imageUrl}
              fullName={creatorName}
            />
          }
          onClick={onClickUser}
        />
      ) : (
        <div className="flex gap-1 items-center">
          <UserAvatar
            size="xSmall"
            imageUrl={imageUrl}
            fullName={creatorName}
          />
          <p className="text-base-white text-sm font-bold">
            {dictionary.components.courseCard.you}
          </p>
        </div>
      )}
    </div>
  )
};
