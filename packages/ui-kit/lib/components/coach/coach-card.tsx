import React, { FC } from 'react';
import { Button } from '../button';
import { Badge } from '../badge';
import { UserAvatar } from '../avatar/user-avatar';
import { cn } from '../../utils/style-utils';
import { StarRating } from '../star-rating';
import { IconLanguage } from '../icons/icon-language';
import { IconCoachingSession } from '../icons/icon-coaching-session';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';

/**
 * Represents a course associated with a coach.
 */
interface Course {
  image: string;
  title: string;
}

/**
 * Represents the details of a coach displayed in the CoachCard component.
 */
interface CoachCardDetails {
  coachName: string;
  coachImage: string;
  languages: string[];
  sessionCount: number;
  skills: string[];
  description: string;
  courses: Course[];
  rating: number;
  totalRatings: number;
}

/**
 * Props for the CoachCard component.
 */
interface CoachCardProps {
  cardDetails?: CoachCardDetails; // Details of the coach
  byCourseCreator?: boolean; // Indicates if the card is created by a course creator
  onClickViewProfile?: () => void; // Callback when the "View Profile" button is clicked
  onClickBookSession?: () => void; // Callback when the "Book Session" button is clicked
  className?: string; // Additional class names for styling
  locale: TLocale; // Localization settings
}

/**
 * CoachCard component displays information about a coach, including their name, profile image,
 * rating, languages, session count, skills, courses, and action buttons for viewing the profile
 * and booking a session.
 */
const CoachCard: FC<CoachCardProps> = ({
  cardDetails,
  onClickViewProfile,
  onClickBookSession,
  className,
  locale
}) => {
  const dictionary = getDictionary(locale);

  return (
    <div
      role="article"
      className={cn(
        'flex flex-col gap-4 bg-card-fill text-[14px] md:text-[16px] border border-card-stroke p-4 max-w-[382px] min-w-[348px] rounded-lg text-text-secondary',
        className
      )}
    >
      {/* Card Header */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <UserAvatar hasProfilePicture className="w-10 h-10 rounded-full" imageUrl={cardDetails.coachImage} />
          <div className="flex flex-col gap-1">
            <p className="text-color-text-primary text-white text-sm md:text-md leading-4 font-bold">{cardDetails.coachName}</p>
            <div className="flex w-full gap-1 items-center">
              <StarRating rating={cardDetails.rating} />
              <p className="text-[#FAFAF9] text-sm leading-3.5">{cardDetails.rating}</p>
              <p className=" text-xs">({cardDetails.totalRatings})</p>
            </div>
          </div>
        </div>

        {/* Language & Session Count */}
        <div className="flex items-start gap-y-2 gap-x-4 w-full flex-wrap">
          <p className="flex items-center gap-1 lg:truncate">
            <IconLanguage size="4" />
            <span className="capitalize truncate">{cardDetails.languages.join(', ')}</span>
          </p>
          <p className="flex items-center gap-1 truncate">
            <IconCoachingSession size='4' />
            <span className="capitalize truncate">
              {cardDetails.sessionCount} {dictionary.components.coachCard.coachingSession}
              {cardDetails.sessionCount > 1 ? 's' : ''}
            </span>
          </p>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-2">
          {cardDetails.skills.map((skill) => (
            <Badge text={skill} key={skill} className="h-6 w-auto py-1 text-base" />
          ))}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-col gap-4">
        <p className="leading-[150%]">{cardDetails.description}</p>

        {/* Teaches Section */}
        <div className="flex flex-wrap gap-2 items-center">
          <span className="text-[14px]">{dictionary.components.coachCard.teaches}:</span>
          {cardDetails.courses.slice(0, 3).map((course) => (
            <Button
              key={course.title}
              className='p-0 gap-1 text-sm'
              variant='text'
              hasIconLeft
              iconLeft={<UserAvatar imageUrl={course.image} className='rounded-small' size="small" />}
              text={course.title}
            />
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex flex-col gap-1">
        <Button
          variant="secondary"
          size="medium"
          onClick={onClickViewProfile}
          text={dictionary.components.coachCard.viewProfile} />
        <Button
          variant="primary"
          size="medium"
          onClick={onClickBookSession}
          text={dictionary.components.coachCard.bookSession} />
      </div>
    </div>
  );
};

export default CoachCard;
