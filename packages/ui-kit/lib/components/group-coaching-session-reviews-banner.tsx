'use client';

import { StarRating } from './star-rating';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';



export interface GroupCoachingSessionReviewsBannerProps extends isLocalAware {
    reviewCount: number;
    averageRating: number;
    studentCount: number;
}

/**
 * A banner component that displays summary information about group coaching session reviews.
 *
 * @param reviewCount - Total number of reviews received
 * @param averageRating - Average rating from the reviews
 * @param studentCount - Number of students who attended the session
 * @param locale - The locale for translation and localization purposes
 *
 * @example
 * <ReviewCard
 *   reviewCount={150}
 *   averageRating={4.5}
 *   studentCount={30}
 *   locale={'en'}
 * />
 */
export const GroupCoachingSessionReviewsBanner: React.FC<GroupCoachingSessionReviewsBannerProps> = ({
    reviewCount,
    averageRating,
    studentCount,
    locale
}) => {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex p-3 gap-1 items-start flex-col bg-base-neutral-800 rounded-small border border-base-neutral-700">
            <div className='flex items-center gap-2'>
                <p className='text-text-secondary text-sm leading-[150%]'>
                    {dictionary.pages.groupWorkspaceCoach.reviewsBanner.reviewsReceived}:
                </p>
                <p className='text-text-primary text-sm font-bold'>
                    {reviewCount}
                </p>
            </div>
            <div className="flex items-center gap-2">
                <p className='text-text-secondary text-sm leading-[110%] whitespace-nowrap'>
                    {dictionary.pages.groupWorkspaceCoach.reviewsBanner.averageRating}:
                </p>
                <StarRating
                    totalStars={5}
                    size={'4'}
                    rating={averageRating}
                />
                <p className="text-text-primary text-sm font-important">
                    {averageRating}
                </p>
                <p className="text-xs text-text-secondary font-important">
                    ({studentCount})
                </p>
            </div>
        </div>
    );
};