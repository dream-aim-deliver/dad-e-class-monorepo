import { FC } from 'react';
import { Button } from '../button';
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
  slug: string;
}

export interface CoachCardDetails {
  coachName: string;
  coachImage?: string;
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
  onClickCourse?: (slug: string) => void;
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
  onClickCourse,
  className,
  locale
}) => {
  if (!cardDetails) return null; // Prevents errors if cardDetails is undefined

  const dictionary = getDictionary(locale);

  return (
    <div
      role="article"
      className={cn(
        'flex flex-col bg-card-fill gap-4 text-sm md:text-md border border-card-stroke p-4 rounded-lg text-text-secondary max-w-[406px]',
        className
      )}
    >
      {/* Header section with profile and stats */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-3">
          <UserAvatar fullName={cardDetails.coachName} className="w-10 h-10 rounded-full flex-shrink-0" imageUrl={cardDetails.coachImage} />
          <div className="flex flex-col min-w-0 gap-1">
            <p className="text-color-text-primary text-white text-sm md:text-md leading-4 font-bold truncate">{cardDetails.coachName}</p>
            <div className="flex w-full gap-1 items-center">
              <StarRating totalStars={5} size={"4"} rating={cardDetails.rating} />
              <p className="text-text-primary text-sm leading-3.5">{cardDetails.rating}</p>
              <p className="text-xs">({cardDetails.totalRatings})</p>
            </div>
          </div>
        </div>

        {/* Language & Session Count */}
        <div className="flex items-start gap-x-4 w-full overflow-hidden">
          <p className="flex items-center gap-1 truncate whitespace-nowrap" title={cardDetails.languages.join(', ')}>
            <IconLanguage classNames='flex-shrink-0' size="4" />
            <span className="capitalize truncate">{cardDetails.languages.join(', ')}</span>
          </p>
          <p className="flex items-center gap-1 truncate whitespace-nowrap">
            <IconCoachingSession classNames='flex-shrink-0' size="4" />
            <span className="capitalize truncate" title={`${cardDetails.sessionCount} ${dictionary.components.coachCard.coachingSession}${cardDetails.sessionCount > 1 ? 's' : ''}`}>
              {cardDetails.sessionCount} {dictionary.components.coachCard.coachingSession}
              {cardDetails.sessionCount > 1 ? 's' : ''}
            </span>
          </p>
        </div>
      </div>

      {/* Skills section*/}
      <div className="h-16 flex-shrink-0">
        <SkillBadges locale={locale} skills={cardDetails.skills} />
      </div>

      <div className="flex flex-col gap-4 flex-1">
        <div className="h-21 lg:h-24">
          <p title={cardDetails.description} className="leading-[150%] line-clamp-4 ">{cardDetails.description}</p>
        </div>

        {/* Teaches Section */}
        <div className="flex flex-wrap gap-2 items-center max-h-18">
          {/* Keep label and first course on the same line */}
          {cardDetails.courses.length > 0 && (
            <div className="flex items-center gap-2 min-w-0 whitespace-nowrap">
              <span className="text-sm flex-shrink-0">{dictionary.components.coachCard.teaches}:</span>
              <Button
                className={cn('p-0 gap-1 text-sm truncate max-w-full')}
                size='small'
                title={cardDetails.courses[0].title}
                variant="text"
                hasIconLeft
                iconLeft={<UserAvatar fullName={cardDetails.courses[0].title} imageUrl={cardDetails.courses[0].image} className="rounded-small" size="small" />}
                text={cardDetails.courses[0].title}
                onClick={() => onClickCourse?.(cardDetails.courses[0].slug)}
              />
            </div>
          )}

          {/* Render second course (if any) normally so it can wrap */}
          {cardDetails.courses.length > 1 && (
            <Button
              className={cn('p-0 gap-1 text-sm truncate')}
              size='small'
              title={cardDetails.courses[1].title}
              variant="text"
              hasIconLeft
              iconLeft={<UserAvatar fullName={cardDetails.courses[1].title} imageUrl={cardDetails.courses[1].image} className="rounded-small" size="small" />}
              text={cardDetails.courses[1].title}
              onClick={() => onClickCourse?.(cardDetails.courses[1].slug)}
            />
          )}

          {cardDetails.courses.length > 2 && (
            <span
              className="text-xs text-text-secondary truncate"
              title={cardDetails.courses.slice(2).map((c) => c.title).join(', ')}
            >
              +{cardDetails.courses.length - 2} {dictionary.components.coachCard.more}
            </span>
          )}
        </div>
      </div>

      {/* Card Footer */}
      <div className="mt-auto flex flex-col gap-2">
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