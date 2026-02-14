'use client';
import * as React from 'react';
import { Button } from '../../button';
import { CourseStats } from '../course-stats';
import { CourseCreator } from '../course-creator';
import { StarRating } from '../../star-rating';
import { course } from '@maany_shr/e-class-models';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import RichTextRenderer from '../../rich-text-element/renderer';
import { useImageComponent } from '../../../contexts/image-component-context';

// Extend the existing type with the properties we need that aren't in TCourseMetadata
export interface VisitorCourseCardProps extends course.TCourseMetadata {
    reviewCount: number;
    sessions: number;
    sales: number;
    onDetails?: () => void;
    onBuy?: () => void;
    onClickUser?: () => void;
    coachingIncluded?: boolean;
    locale: TLocale;
}

/**
 * Card component for displaying course information tailored for visitors, including options to view details or buy.
 *
 * @param title The title of the course.
 * @param rating The average rating of the course.
 * @param reviewCount The number of reviews for the course.
 * @param author The author object containing the name and image of the course creator.
 * @param language The language object containing the name of the course language.
 * @param sessions The number of sessions in the course.
 * @param duration The duration object containing video, coaching, and self-study times in minutes.
 * @param sales The number of sales for the course.
 * @param imageUrl The URL of the course image.
 * @param locale The locale for translation and localization purposes.
 * @param onDetails Optional callback function triggered when the "Details" button is clicked.
 * @param onBuy Optional callback function triggered when the "Buy Course" button is clicked.
 * @param onClickUser Optional callback function triggered when the user name is clicked.
 *
 * @example
 * <VisitorCourseCard
 *   title="Web Development Basics"
 *   rating={4.5}
 *   reviewCount={20}
 *   author={{ name: "Bob Smith", image: "author-image.jpg" }}
 *   language={{ name: "English" }}
 *   sessions={8}
 *   duration={{ video: 150, coaching: 60, selfStudy: 90 }}
 *   sales={120}
 *   imageUrl="course-image.jpg"
 *   locale="en"
 *   onDetails={() => console.log("Details clicked!")}
 *   onBuy={() => console.log("Buy clicked!")}
 *  onClickUser={() => console.log("Author clicked!")}
 * />
 */
export const VisitorCourseCard: React.FC<VisitorCourseCardProps> = ({
    title,
    description,
    rating,
    reviewCount,
    pricing,
    author,
    language,
    sessions,
    duration,
    sales,
    imageUrl,
    locale,
    coachingIncluded = false,
    onDetails,
    onClickUser,
    onBuy,
}) => {
    const ImageComponent = useImageComponent();
    const [isImageError, setIsImageError] = React.useState(false);
    const dictionary = getDictionary(locale);

    // Calculate total course duration in minutes and format as "Xh Ym"
    const totalDurationInMinutes = (((((duration as any).video as number) +
        (duration as any).coaching) as number) +
        (duration as any).selfStudy) as number;

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

    const handleImageError = () => {
        setIsImageError(true);
    };

    const shouldShowPlaceholder = !imageUrl || isImageError;

    const pricingLabel = `${dictionary.components.courseCard.fromButton} ${(pricing as any).currency} ${(pricing as any).partialPrice}`;
    return (
        <div className="w-full mx-auto">
            <div className="flex flex-col w-auto h-[600px] rounded-medium border border-card-stroke bg-card-fill overflow-visible transition-transform hover:scale-[1.02]">
                <div className="relative flex-shrink-0 overflow-hidden rounded-t-medium">
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
                        <ImageComponent
                            loading="lazy"
                            src={imageUrl}
                            alt={title}
                            width={430}
                            height={200}
                            className="w-full h-[200px] object-cover"
                            onError={handleImageError}
                        />
                    )}
                </div>

                <div className="flex flex-col flex-1 p-4 gap-4">
                    <div className="flex flex-col gap-2 flex-shrink-0">
                        <div className="group relative">
                            <h6
                                title={title}
                                className="text-md font-bold text-text-primary line-clamp-1 text-start"
                            >
                                {title}
                            </h6>
                        </div>

                        <div className="flex gap-1 items-end">
                            <StarRating
                                totalStars={5}
                                rating={rating as number}
                            />
                            <span className="text-xs text-text-primary leading-[100%]">
                                {rating}
                            </span>
                            <span className="text-xs text-text-secondary leading-[100%]">
                                ({reviewCount})
                            </span>
                        </div>

                        <CourseCreator
                            creatorName={author?.name as string}
                            imageUrl={author?.image}
                            you={false}
                            locale={locale as TLocale}
                            onClickUser={onClickUser}
                        />

                        <CourseStats
                            locale={locale as TLocale}
                            language={language?.code?.toUpperCase() ?? ''}
                            sessions={sessions}
                            duration={formattedDuration}
                            sales={sales}
                        />
                    </div>

                    {description && (
                        <RichTextRenderer
                            content={description}
                            onDeserializationError={console.error}
                            className="text-sm text-text-secondary text-start line-clamp-3 flex-1 min-h-0"
                        />
                    )}

                    <div className="flex flex-col gap-2 flex-shrink-0 mt-auto">
                        <Button
                            className=""
                            variant={'secondary'}
                            size={'medium'}
                            onClick={onDetails}
                            text={
                                dictionary.components.courseCard
                                    .detailsCourseButton
                            }
                        />
                        <Button
                            className=""
                            variant={'primary'}
                            size={'medium'}
                            onClick={onDetails}
                            text={pricingLabel}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};
