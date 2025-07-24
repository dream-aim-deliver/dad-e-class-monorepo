import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Button } from './button';
import { UserAvatar } from './avatar/user-avatar';
import { Badge } from './badge';
import { StarRating } from './star-rating';
import SkillBadges from './skill-badges';

export interface BuyCoachingSessionBannerProps extends isLocalAware {
    coachName: string;
    coachAvatarUrl: string;
    description: string;
    coachRating: number;
    totalRatings: number;
    onBookSessionWith: () => void;
    isCourseCreator?: boolean;
    skills: string[];
}

export const BuyCoachingSessionBanner = ({
    coachName,
    coachAvatarUrl,
    description,
    coachRating,
    totalRatings,
    onBookSessionWith,
    locale,
    skills,
    isCourseCreator,
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
                        className='sm:w-fit w-full'
                    />
            </div>
            <p className="text-text-secondary"> {description} </p>

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
