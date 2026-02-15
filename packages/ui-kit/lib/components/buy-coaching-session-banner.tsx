import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from './button';
import { UserAvatar } from './avatar/user-avatar';
import { Badge } from './badge';
import { StarRating } from './star-rating';
import SkillBadges from './skill-badges';
import { IconLanguage } from './icons/icon-language';

export interface BuyCoachingSessionBannerProps extends isLocalAware {
    coachName: string;
    coachAvatarUrl: string;
    description: string;
    coachRating: number;
    totalRatings: number;
    onBookSessionWith: () => void;
    isCourseCreator?: boolean;
    skills: string[];
    languages?: string[];
}

/**
 * `BuyCoachingSessionBanner` is a UI component that displays key information about a coach
 * and provides an option for users to buy coaching sessions.
 *
 * It shows the coach’s avatar, name, description, rating, total number of reviews,
 * one badge for "Coach", and optionally a second badge for "Course Creator".
 * It also displays a list of the coach’s skills.
 *
 * A call-to-action button is included to trigger the booking flow.
 *
 * @param coachName - Full name of the coach.
 * @param coachAvatarUrl - URL of the coach’s avatar image.
 * @param description - Short biography or description of the coach.
 * @param coachRating - Average rating of the coach (0 to 5).
 * @param totalRatings - Total number of ratings the coach has received.
 * @param onBookSessionWith - Callback triggered when the booking button is clicked.
 * @param locale - Current locale used for translations (e.g., 'en', 'de').
 * @param isCourseCreator - Optional. If `true`, shows an additional badge indicating the coach is also a course creator.
 * @param skills - List of skills associated with the coach.
 *
 * @returns A JSX element displaying coach information, badges, skills, and a purchase CTA.
 */

export const BuyCoachingSessionBanner = ({
    coachName,
    coachAvatarUrl,
    description,
    coachRating,
    totalRatings,
    onBookSessionWith,
    locale,
    skills,
    isCourseCreator = false,
    languages,
}: BuyCoachingSessionBannerProps) => {
    const dictionary =
        getDictionary(locale).components.buyCoachingSessionBanner;

    return (
        <div className="flex flex-col w-full p-3 items-start gap-4">
            <div className="flex flex-col md:flex-row w-full gap-5">
                <div>
                    <UserAvatar
                        fullName={coachName}
                        size="xLarge"
                        imageUrl={coachAvatarUrl}
                    />
                </div>
                <div className="flex flex-col w-full gap-2">
                    <h1 className="text-text-primary"> {coachName} </h1>
                    <div className="flex flex-row w-full gap-2 items-center">
                        <StarRating
                            totalStars={5}
                            size={'4'}
                            rating={coachRating}
                        />
                        <p className="text-sm font-important text-text-primary">
                            {coachRating} ({totalRatings})
                        </p>
                        {/* Show coach badge and, if applicable, course creator badge */}{' '}
                        <Badge
                            variant="info"
                            size="medium"
                            text={dictionary.coachBadge}
                            className="w-fit text-sm"
                        />
                        {isCourseCreator && (
                            <Badge
                                variant="info"
                                size="medium"
                                text={dictionary.courseCreatorBadge}
                                className="w-fit text-sm"
                            />
                        )}
                    </div>
                </div>
                <Button
                    variant="primary"
                    size="medium"
                    onClick={onBookSessionWith}
                    text={`${dictionary.buyButton}`}
                    className="sm:w-fit w-full"
                />
            </div>
            <p className="text-text-secondary"> {description} </p>

            {languages && languages.length > 0 && (
                <p className="flex items-center gap-1 text-text-secondary">
                    <IconLanguage classNames="flex-shrink-0" size="4" />
                    <span className="truncate">{languages.join(', ')}</span>
                </p>
            )}

            {/* Skills section*/}
            <div className="flex flex-row gap-2 h-16 flex-shrink-0">
                <p className="text-text-primary font-important">
                    {' '}
                    {dictionary.skillsLabel}{' '}
                </p>
                <SkillBadges locale={locale} skills={skills} />
            </div>
        </div>
    );
};
