import React, { FC } from 'react';
import { Button } from '../button';
import { Badge } from '../badge';
import { UserAvatar } from '../avatar/user-avatar';
import { cn } from '../../utils/style-utils';
import { StarRating } from '../star-rating';
import { IconLanguage } from '../icons/icon-language';
import { IconCoachingSession } from '../icons/icon-coaching-session';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import SkillBadges from '../skill-badges';

interface Course {
  image: string;
  title: string;
}

export interface CoachCardDetails {
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

export interface CoachCardProps {
  cardDetails?: CoachCardDetails;
  byCourseCreator?: boolean;
  onClickViewProfile?: () => void;
  onClickBookSession?: () => void;
  className?: string;
  locale: TLocale;
}

/**
 * 
 * @props {CoachCardProps} props - The component props.
 * @props {CoachCardDetails} props.cardDetails - The details of the coach to be displayed.
 * @props {boolean} [props.byCourseCreator] - Indicates if the card is for a course creator.
 * @props {() => void} [props.onClickViewProfile] - Callback function for viewing the coach's profile.
 * @props {() => void} [props.onClickBookSession] - Callback function for booking a session with the coach.
 * @props {string} [props.className] - Additional class names for styling.
 * @props {TLocale} props.locale - The locale for translations.
 *
 * @returns {JSX.Element} A card displaying the coach's details, including their name, image, languages, session count, skills, description, and courses.
 * */

const CoachCard: FC<CoachCardProps> = ({
  cardDetails,
  onClickViewProfile,
  onClickBookSession,
  className,
  locale
}) => {
  if (!cardDetails) return null; // Prevents errors if cardDetails is undefined

  const dictionary = getDictionary(locale);

  return (
    <div
      role="article"
      className={cn(
        'flex flex-col bg-card-fill gap-4 text-[14px] md:text-[16px] border border-card-stroke p-4 max-w-[382px] min-w-[348px] rounded-lg text-text-secondary',
        className
      )}
    >
      {/* Header section with profile and stats - fixed height */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <UserAvatar fullName={cardDetails.coachName} className="w-10 h-10 rounded-full flex-shrink-0" imageUrl={cardDetails.coachImage} />
          <div className="flex flex-col min-w-0 gap-1">
            <p className="text-color-text-primary text-white text-sm md:text-md leading-4 font-bold truncate">{cardDetails.coachName}</p>
            <div className="flex w-full gap-1 items-center">
              <StarRating totalStars={5} size={"4"} rating={cardDetails.rating} />
              <p className="text-[#FAFAF9] text-sm leading-3.5">{cardDetails.rating}</p>
              <p className="text-xs">({cardDetails.totalRatings})</p>
            </div>
          </div>
        </div>

        {/* Language & Session Count */}
        <div className="flex items-start gap-y-2 gap-x-4 w-full flex-wrap">
          <p className="flex items-center gap-1 lg:truncate">
            <IconLanguage classNames='flex-shrink-0' size="4" />
            <span className="capitalize truncate">{cardDetails.languages.join(', ')}</span>
          </p>
          <p className="flex items-center gap-1 truncate">
            <IconCoachingSession classNames='flex-shrink-0' size="4" />
            <span className="capitalize truncate">
              {cardDetails.sessionCount} {dictionary.components.coachCard.coachingSession}
              {cardDetails.sessionCount > 1 ? 's' : ''}
            </span>
          </p>
        </div>
      </div>

      {/* Skills section*/}
      <div className="h-24">
        <SkillBadges skills={cardDetails.skills} />
      </div>

      
      <div className="flex flex-col flex-grow gap-4">
        <div className="min-h-22">
          <p className="leading-[150%] line-clamp-4">{cardDetails.description}</p>
        </div>

        {/* Teaches Section */}
        <div className="flex flex-wrap gap-2 items-center min-h-16">
          <span className="text-[14px]">{dictionary.components.coachCard.teaches}:</span>
          {cardDetails.courses.slice(0, 3).map((course) => (
            <Button
              key={course.title}
              className="p-0 gap-1 text-sm"
              size='small'
              variant="text"
              hasIconLeft
              iconLeft={<UserAvatar fullName={course.title} imageUrl={course.image} className="rounded-small" size="small" />}
              text={course.title}
            />
          ))}
        </div>
      </div>

      {/* Card Footer */}
      <div className="flex flex-col gap-2 mt-auto">
        <Button
          variant="secondary"
          size="medium"
          onClick={onClickViewProfile}
          text={dictionary.components.coachCard.viewProfile}
        />
        <Button
          variant="primary"
          size="medium"
          onClick={onClickBookSession}
          text={dictionary.components.coachCard.bookSession}
        />
      </div>
    </div>
  );
};

export default CoachCard;