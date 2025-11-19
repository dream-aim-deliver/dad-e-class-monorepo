'use client';
import * as React from 'react';
import { Badge } from '../../badge';
import { Button } from '../../button';
import { CourseStats } from '../course-stats';
import { CourseCreator } from '../course-creator';
import { StarRating } from '../../star-rating';
import {
    getDictionary,
    isLocalAware,
    TLocale,
} from '@maany_shr/e-class-translations';
import { IconCheck } from '../../icons/icon-check';
import { IconEdit } from '../../icons/icon-edit';

export type CourseStatus = 'live' | 'draft' | 'archived';

export interface CourseCreatorCardProps extends isLocalAware {
    title?: string;
    imageUrl?: string;
    rating: number;
    reviewCount: number;
    sessions: number;
    sales: number;
    status: CourseStatus;
    duration?: {
        video?: number;
        coaching?: number;
        selfStudy?: number;
    };
    language?: {
        code?: string;
        name?: string;
    };
    author?: {
        name?: string;
        image?: string;
    };
    description?: string;
    pricing?: {
        fullPrice: number;
        partialPrice: number;
        currency: string;
    };
    onEdit?: () => void;
    onGoToOffer?: () => void;
    onClickUser?: () => void;
    onDuplicate?: () => void;
}

const StatusBadge: React.FC<{ status: CourseStatus; locale: TLocale }> = ({
    status,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    const variants = {
        live: 'successprimary',
        draft: 'info',
        archived: 'errorprimary',
    } as const;

    const labels = {
        live: dictionary.components.courseCard.publishedBadge || 'Live',
        draft: dictionary.components.courseCard.draftBadge || 'Draft',
        archived: 'Archived',
    };

    const icons = {
        live: <IconCheck size="5" />,
        draft: <IconEdit size="5" />,
        archived: <IconEdit size="5" />,
    };

    return (
        <Badge
            className="px-3 py-1 mb-2 gap-2 self-start mt-2"
            variant={variants[status]}
            size="big"
            text={labels[status]}
            hasIconLeft
            iconLeft={icons[status]}
        />
    );
};

/**
 * Card component for displaying course information created by the user.
 *
 * @param course The course metadata object containing title, duration, imageUrl, rating, author, and language.
 * @param reviewCount The number of reviews for the course.
 * @param sessions The number of sessions in the course.
 * @param sales The number of sales for the course.
 * @param status The status of the course. Options:
 *   - `published`: The course is live and available.
 *   - `under-review`: The course is being reviewed.
 *   - `draft`: The course is still in draft mode.
 * @param locale The locale for translation and localization purposes.
 * @param onEdit Optional callback function triggered when the edit button is clicked.
 * @param onManage Optional callback function triggered when the manage button is clicked.
 *
 * @example
 * <CourseCreatorCard
 *   course={{
 *     title: "Learn React",
 *     duration: { video: 120, coaching: 60, selfStudy: 60 },
 *     imageUrl: "course-image.jpg",
 *     rating: 4.5,
 *     author: { name: "John Doe", image: "author-image.jpg" },
 *     language: { name: "English" },
 *   }}
 *   reviewCount={25}
 *   sessions={10}
 *   sales={150}
 *   status="published"
 *   locale="en"
 *   onEdit={() => console.log("Edit clicked!")}
 *   onManage={() => console.log("Manage clicked!")}
 * />
 */
export const CourseCreatorCard: React.FC<CourseCreatorCardProps> = ({
    title = '',
    duration = {},
    imageUrl,
    rating,
    author,
    language = {},
    reviewCount,
    sessions,
    sales,
    status,
    locale,
    onEdit,
    onGoToOffer,
    onClickUser,
    onDuplicate,
}) => {
    const [isImageError, setIsImageError] = React.useState(false);
    // Calculate total course duration in minutes and format as "Xh Ym"
    const { video = 0, coaching = 0, selfStudy = 0 } = duration;
    const totalDurationInMinutes = video + coaching + selfStudy;
    
    // Format duration as "Xh Ym" or just "Ym" if less than an hour
    const formatDuration = (minutes: number): string => {
        if (minutes <= 0) return '0m';
        const hours = Math.floor(minutes / 60);
        const mins = minutes % 60;
        if (hours === 0) return `${mins}m`;
        if (mins === 0) return `${hours}h`;
        return `${hours}h ${mins}m`;
    };
    const formattedDuration = formatDuration(totalDurationInMinutes);

    const dictionary = getDictionary(locale);
    const handleImageError = () => {
        setIsImageError(true);
    };

    const hasValidImageUrl = imageUrl && imageUrl.trim() !== '';
    const shouldShowPlaceholder = !hasValidImageUrl || isImageError;

    return (
        <div className="w-full mx-auto">
            <div className="flex flex-col flex-1 w-auto h-fit rounded-medium border border-card-stroke bg-card-fill overflow-hidden transition-transform hover:scale-[1.02]">
                <div className="relative">
                    {shouldShowPlaceholder ? (
                        // Placeholder for broken image (matching CoachBanner styling)
                        <div className="w-full h-[200px] bg-base-neutral-700 flex items-center justify-center">
                            <span className="text-text-secondary text-md">
                                {
                                    dictionary.components.coachBanner
                                        .placeHolderText
                                }
                            </span>
                        </div>
                    ) : (
                        <img
                            loading="lazy"
                            src={imageUrl || ''}
                            alt={title}
                            width={430}
                            height={200}
                            className="w-full h-[200px] object-cover"
                            onError={handleImageError}
                        />
                    )}
                </div>
                <div className="flex flex-col p-4 gap-4">
                    <div className="flex flex-col gap-2">
                        <div className="group relative truncate w-full">
                            <h6
                                title={title}
                                className="text-md font-bold text-text-primary truncate text-start"
                            >
                                {title}
                            </h6>
                        </div>

                        {status === 'live' && (
                            <div className="flex gap-1 items-end">
                                <StarRating totalStars={5} rating={rating} />
                                <span className="text-xs text-text-primary leading-[100%]">
                                    {rating}
                                </span>
                                <span className="text-xs text-text-secondary leading-[100%]">
                                    ({reviewCount})
                                </span>
                            </div>
                        )}

                        {author?.name && <CourseCreator
                            creatorName={author.name}
                            imageUrl={author.image}
                            locale={locale as TLocale}
                            you={true}
                            onClickUser={onClickUser}
                        />}

                        <CourseStats
                            locale={locale as TLocale}
                            language={language?.name || ''}
                            sessions={sessions}
                            duration={formattedDuration}
                            sales={sales}
                        />
                    </div>
                    
                    <div className="flex flex-col gap-1">
                        {/* Status Badge */}
                        <StatusBadge
                            status={status}
                            locale={locale as TLocale}
                        />

                        <Button
                            onClick={onEdit}
                            className="w-full"
                            variant="primary"
                            size="medium"
                            text={
                                dictionary.components.courseCard
                                    .editCourseButton
                            }
                        />

                        {onGoToOffer && (
                            <Button
                                onClick={onGoToOffer}
                                className="w-full"
                                variant="text"
                                size="medium"
                                text={
                                    dictionary.components.courseCard
                                        .goToOfferButton
                                }
                            />
                        )}

                        {onDuplicate && (
                            <Button
                                onClick={onDuplicate}
                                className="w-full"
                                variant="text"
                                size="medium"
                                text={
                                    dictionary.components.courseCard
                                        .duplicateButton
                                }
                            />
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
