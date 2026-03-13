import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from './button';
import { UserAvatar } from './avatar/user-avatar';
import { Badge } from './badge';
import { StarRating } from './star-rating';
import SkillBadges from './skill-badges';
import { IconLanguage } from './icons/icon-language';
import { IconLink } from './icons/icon-link';

export interface BookSessionWithProps extends isLocalAware {
    coachName: string;
    coachAvatarUrl: string;
    description: string;
    coachRating: number;
    totalRatings: number;
    onBookSessionWith: () => void;
    isCourseCreator?: boolean;
    skills: string[];
    languages?: string[];
    linkedinUrl?: string | null;
    portfolioWebsite?: string | null;
}

/**
 * `BookSessionWith` is a UI component that displays key information about a coach
 * and provides an option for users to book a session.
 *
 * It shows the coach’s avatar, name, description, rating, total number of reviews,
 * and one or two badges (one for "Coach", and an optional one for "Course Creator").
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
 * @param isCourseCreator - If `true`, shows an additional badge indicating the coach is also a course creator.
 *
 * @returns A JSX element displaying coach information and a booking CTA.
 */

export const BookSessionWith = ({
    coachName,
    coachAvatarUrl,
    description,
    coachRating,
    totalRatings,
    onBookSessionWith,
    locale,
    isCourseCreator = false,
    skills,
    languages,
    linkedinUrl,
    portfolioWebsite,
}: BookSessionWithProps) => {
    const dictionary = getDictionary(locale).components.bookSessionWithBanner;

    return (
        <div className="flex flex-col w-full items-start gap-4">
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
                        <StarRating totalStars={5} size={'4'} rating={coachRating} />
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
                    text={`${dictionary.bookSessionButton} ${coachName}`}
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
            {(linkedinUrl || portfolioWebsite) && (
                <div className="flex flex-row gap-3 items-center">
                    {linkedinUrl && (
                        <a
                            href={linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-button-primary-fill hover:underline"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                            </svg>
                            LinkedIn
                        </a>
                    )}
                    {portfolioWebsite && (
                        <a
                            href={portfolioWebsite}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1 text-sm text-button-primary-fill hover:underline"
                        >
                            <IconLink size="4" />
                            Portfolio
                        </a>
                    )}
                </div>
            )}
            <div className="flex flex-row gap-2 flex-shrink-0">
                <p className="text-text-primary font-important">
                    {dictionary.skillsLabel}
                </p>
                <SkillBadges locale={locale} skills={skills} />
            </div>
        </div>
    );
};
