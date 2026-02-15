import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from './button';
import { UserAvatar } from './avatar/user-avatar';
import { Badge } from './badge';
import { StarRating } from './star-rating';
import { IconLanguage } from './icons/icon-language';

export interface BookSessionWithProps extends isLocalAware {
    coachName: string;
    coachAvatarUrl: string;
    description: string;
    coachRating: number;
    totalRatings: number;
    onBookSessionWith: () => void;
    isCourseCreator?: boolean;
    languages?: string[];
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
    languages,
}: BookSessionWithProps) => {
    const dictionary = getDictionary(locale).components.bookSessionWithBanner;

    return (
        <div className="flex flex-col w-full p-3 items-start gap-2">
            <UserAvatar
                fullName={coachName}
                size="medium"
                imageUrl={coachAvatarUrl}
            />
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
            {languages && languages.length > 0 && (
                <p className="flex items-center gap-1 text-text-secondary">
                    <IconLanguage classNames="flex-shrink-0" size="4" />
                    <span className="truncate">{languages.join(', ')}</span>
                </p>
            )}
            <p className="text-text-secondary"> {description} </p>
            <Button
                variant="primary"
                size="medium"
                onClick={onBookSessionWith}
                text={`${dictionary.bookSessionButton} ${coachName}`}
            />
        </div>
    );
};
