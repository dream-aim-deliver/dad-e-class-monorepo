'use client';

import * as React from 'react';
import { useState } from 'react';
import { CourseStats } from '../course-stats';
import { CourseCreator } from '../course-creator';
import { StarRating } from '../../star-rating';
import { course } from '@maany_shr/e-class-models';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { PackageCourseActions } from './package-course-actions';
import { cn } from "../../../utils/style-utils";
import { useImageComponent } from '../../../contexts/image-component-context';


export interface PackageCourseCardProps extends course.TCourseMetadata {
    courseId: string;
    sales: number;
    courseIncluded: boolean;
    reviewCount: number;
    onClickUser: () => void;
    onClickDetails: () => void;
    onClickIncludeExclude: () => void;
    locale: TLocale;
};

/**
 * Card component for displaying course information tailored for students, including progress and actions.
 *
 * @param title The title of the course.
 * @param description The description of the course, displayed when study progress is 'yet-to-start'.
 * @param duration The duration object containing video, coaching, and self-study times in minutes.
 * @param reviewCount The number of reviews for the course.
 * @param pricing The pricing object containing the full price of the course.
 * @param imageUrl The URL of the course image.
 * @param rating The average rating of the course.
 * @param author The author object containing the name and image of the course creator.
 * @param sales The number of sales for the course.
 * @param courseId The unique identifier for the course.
 * @param locale The locale for translation and localization purposes.
 * @param onClickUser Callback function triggered when the user name is clicked.
 * @param onClickDetails Callback function triggered when the "Details" button is clicked.
 * @param onClickIncludeExclude Callback function triggered when the "Include/Exclude" button is clicked.
 * @param courseIncluded A boolean indicating if the course is included.
 * @param language The language object containing the name of the course language.
 *
 * @example
 * <PackageCourseCard
 *   courseId="course-123"
 *   title="Introduction to Programming"
 *   description="Learn the basics of coding."
 *   duration={{ video: 120, coaching: 60, selfStudy: 30 }}
 *   reviewCount={15}
 *   pricing={{ fullPrice: 99 }}
 *   imageUrl="course-image.jpg"
 *   rating={4.2}
 *   author={{ name: "Alice Johnson", image: "author-image.jpg" }}
 *   courseIncluded={true}
 *   language={{ name: "English" }}
 *   locale="en"
 *   onClickUser={() => console.log("User clicked!")}
 *   onClickDetails={() => console.log("Details clicked!")}
 *   onClickIncludeExclude={() => console.log("Include/Exclude clicked!")}
 * />
 */
export const PackageCourseCard: React.FC<PackageCourseCardProps> = ({
    courseId,
    title,
    description,
    duration,
    reviewCount,
    sales,
    courseIncluded,
    imageUrl,
    pricing,
    rating,
    author,
    language,
    locale,
    onClickUser,
    onClickDetails,
    onClickIncludeExclude,
}) => {

    // Calculate total course duration in minutes and format as "Xh Ym"
    const totalDurationInMinutes = (duration as any).video as number + (duration as any).coaching as number + (duration as any).selfStudy as number;
    
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
    const ImageComponent = useImageComponent();
    const [isImageError, setIsImageError] = useState(false);

    const handleImageError = () => {
        setIsImageError(true);
    };

    const shouldShowPlaceholder = !imageUrl || isImageError;

    return (
        <div className={cn(`flex flex-col flex-1 w-auto h-auto rounded-medium border border-card-stroke bg-card-fill overflow-hidden transition-transform hover:scale-[1.02]`, courseIncluded ? 'border-[2px] border-action-default' : 'opacity-60')}>
            <div className="relative">
                {shouldShowPlaceholder ? (
                    // Placeholder for broken image (matching CoachBanner styling)
                    <div className="w-full h-[200px] bg-base-neutral-700 flex items-center justify-center">
                        <span className="text-text-secondary text-md">
                            {dictionary.components.coachBanner.placeHolderText}
                        </span>
                    </div>
                ) : (
                    <ImageComponent
                        loading="lazy"
                        src={imageUrl}
                        alt={title}
                        width={430}
                        height={200}
                        className="w-full aspect-[2.15] object-cover"
                        onError={handleImageError}
                    />
                )}
            </div>

            <div className="flex flex-col p-4 gap-4">
                <div className="flex flex-col gap-2">
                    <div className="group relative">
                        <h6
                            title={title}
                            className="text-md font-bold text-text-primary line-clamp-2 text-start"
                        >
                            {title}
                        </h6>

                    </div>
                    <div className="flex gap-1 items-end">
                        <StarRating totalStars={5} rating={rating as number} />
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
                        locale={locale as TLocale}
                        onClickUser={onClickUser}
                    />

                    <CourseStats
                        locale={locale as TLocale}
                        language={(language as any).name as string}
                        sessions={10}
                        duration={formattedDuration}
                        sales={sales}
                    />

                    <p className="text-sm leading-[150%] text-text-secondary text-start">
                        {description}
                    </p>
                </div>

                <div className="flex flex-col gap-2">
                    <PackageCourseActions
                        pricing={pricing as any}
                        courseIncluded={courseIncluded}
                        onClickDetails={onClickDetails}
                        onClickIncludeExclude={onClickIncludeExclude}
                        locale={locale as TLocale}
                    />
                </div>
            </div>
        </div>
    );
};