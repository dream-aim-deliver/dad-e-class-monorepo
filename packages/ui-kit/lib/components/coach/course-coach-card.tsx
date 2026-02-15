import { FC } from 'react';
import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { cn } from '../../utils/style-utils';
import { StarRating } from '../star-rating';
import { IconLanguage } from '../icons/icon-language';
import { IconCoachingSession } from '../icons/icon-coaching-session';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import SkillBadges from '../skill-badges';
import { IconTrashAlt } from '../icons/icon-trash-alt';
import { IconAccountInformation } from '../icons/icon-account-information';

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

const CourseCoachCard: FC<CoachCardProps> = ({
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
        'flex flex-col bg-card-fill gap-2 text-sm md:text-md border border-card-stroke p-4 max-w-[382px] rounded-lg text-text-secondary',
        className
      )}
    >
      {/* Header section with profile and stats */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
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
        <div className="flex items-start gap-y-1 gap-x-2 w-full flex-wrap">
          <p className="flex items-center gap-1 lg:truncate">
            <IconLanguage classNames='flex-shrink-0' size="4" />
            <span className="uppercase truncate">{cardDetails.languages.join(', ')}</span>
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
      <div>
        <SkillBadges locale={locale} skills={cardDetails.skills} />
      </div>

      <div className="flex flex-col">
        <div>
          <p className="leading-[150%] line-clamp-4 ">{cardDetails.description}</p>
        </div>

        {/* Teaches Section */}
        <div className="flex flex-wrap gap-1 items-center">
          <span className="text-sm">{dictionary.components.coachCard.teaches}:</span>
          {cardDetails.courses.slice(0, 3).map((course) => (
            <Button
              key={course.title}
              className="p-0 gap-1 text-sm truncate min-w-0 max-w-full"
              size='small'
              title={course.title}
              variant="text"
              hasIconLeft
              iconLeft={<UserAvatar fullName={course.title} imageUrl={course.image} className="rounded-small" size="small" />}
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
          text={dictionary.components.courseCoachCard.removeCourse}
          hasIconLeft
          iconLeft={<IconTrashAlt  size="4" />}
        />
        <Button
          variant="primary"
          size="medium"
          onClick={onClickBookSession}
          text={dictionary.components.courseCoachCard.viewProfile}
          hasIconLeft
          iconLeft={<IconAccountInformation  size="4" />}
        />
      </div>
    </div>
  );
};

export default CourseCoachCard;