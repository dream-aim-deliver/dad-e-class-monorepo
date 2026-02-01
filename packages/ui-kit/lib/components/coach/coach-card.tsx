import { FC } from 'react';
import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { cn } from '../../utils/style-utils';
import { StarRating } from '../star-rating';
import { IconLanguage } from '../icons/icon-language';
import { IconCoachingSession } from '../icons/icon-coaching-session';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import SkillBadges from '../skill-badges';
import { IconAccountInformation, IconTrashAlt } from '../icons';

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

type BaseCoachCardProps = {
  cardDetails?: CoachCardDetails;
  onClickCourse?: (slug: string) => void;
  className?: string;
  locale: TLocale;
};

type CoachVariantProps = BaseCoachCardProps & {
  variant: 'coach';
  onClickViewProfile: () => void;
};

type CourseCreatorVariantProps = BaseCoachCardProps & {
  variant: 'courseCreator';
  onClickViewProfile: () => void;
  onClickRemoveFromCourse: () => void;
};

type DefaultVariantProps = BaseCoachCardProps & {
  variant?: "student" | undefined;
  onClickViewProfile: () => void;
  onClickBookSession: () => void;
};

export type CoachCardProps = CoachVariantProps | CourseCreatorVariantProps | DefaultVariantProps;

/**
 * 
 * @props {CoachCardProps} props - The component props.
 * @props {CoachCardDetails} props.cardDetails - The details of the coach to be displayed.
 * @props {'coach'} props.variant - Coach variant shows only view profile button.
 * @props {'courseCreator'} props.variant - Course creator variant shows view profile and remove from course buttons.
 * @props {'default' | undefined} props.variant - Default variant shows view profile and book session buttons.
 * @props {() => void} props.onClickViewProfile - Callback function for viewing the coach's profile.
 * @props {() => void} [props.onClickBookSession] - Callback function for booking a session (default variant only).
 * @props {() => void} [props.onClickRemoveFromCourse] - Callback function for removing coach from course (courseCreator variant only).
 * @props {string} [props.className] - Additional class names for styling.
 * @props {TLocale} props.locale - The locale for translations.
 *
 * @returns {JSX.Element} A card displaying the coach's details with variant-specific action buttons.
 * */

const CoachCard: FC<CoachCardProps> = (props) => {
  const { cardDetails, onClickCourse, className, locale, variant = 'student' } = props;

  // Type-safe extraction of variant-specific props
  const onClickViewProfile = props.onClickViewProfile;
  const onClickBookSession = variant === 'student' || !variant ? (props as DefaultVariantProps).onClickBookSession : undefined;
  const onClickRemoveFromCourse = variant === 'courseCreator' ? (props as CourseCreatorVariantProps).onClickRemoveFromCourse : undefined;

  if (!cardDetails) return null; // Prevents errors if cardDetails is undefined

  const dictionary = getDictionary(locale);

  return (
    <div
      role="article"
      className={cn(
        'flex flex-col bg-card-fill gap-4 text-sm md:text-md border border-card-stroke p-4 rounded-lg text-text-secondary h-fit',
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
        {(cardDetails.languages.length > 0 || cardDetails.sessionCount > 0) && (
          <div className="flex items-start gap-y-2 gap-x-4 w-full flex-wrap">
            {cardDetails.languages.length > 0 && (
              <p className="flex items-center gap-1 lg:truncate">
                <IconLanguage classNames='flex-shrink-0' size="4" />
                <span className="capitalize truncate">{cardDetails.languages.join(', ')}</span>
              </p>
            )}
            {cardDetails.sessionCount > 0 && (
              <p className="flex items-center gap-1 truncate">
                <IconCoachingSession classNames='flex-shrink-0' size="4" />
                <span className="capitalize truncate">
                  {cardDetails.sessionCount} {dictionary.components.coachCard.coachingSession}
                  {cardDetails.sessionCount > 1 ? 's' : ''}
                </span>
              </p>
            )}
          </div>
        )}
      </div>

      {/* Skills section*/}
      <div className="flex-shrink-0">
        <SkillBadges locale={locale} skills={cardDetails.skills} />
      </div>


      <div className="flex flex-col  gap-4">
        <div className="h-21 lg:h-24">
          <p className="leading-[150%] line-clamp-4 ">{cardDetails.description}</p>
        </div>

        {/* Teaches Section - only show if there are courses */}
        {cardDetails.courses.length > 0 && (
          <div className="flex flex-wrap gap-2 items-center min-h-18">
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
                onClick={() => onClickCourse?.(course.slug)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Card Footer */}
      <div className="flex flex-col gap-2">
        {variant === 'courseCreator'  && (
          <Button
            variant="secondary"
            size="medium"
            hasIconLeft
            iconLeft={<IconTrashAlt />}
            onClick={onClickRemoveFromCourse}
            text="Remove from Course"
          />
        )}
        
        <Button
          variant={variant === 'student' ? "secondary" : "primary"}
          size="medium"
          hasIconLeft={variant !== 'student'}
          iconLeft={<IconAccountInformation />}
          onClick={onClickViewProfile}
          text={dictionary.components.coachCard.viewProfile}
        />
        {variant === 'student' && onClickBookSession && (
          <Button
            variant="primary"
            size="medium"
            onClick={onClickBookSession}
            text={dictionary.components.coachCard.bookSession}
          />
        )}
      </div>
    </div>
  );
};

export default CoachCard;