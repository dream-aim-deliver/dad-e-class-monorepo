import * as React from 'react';
import { useState } from 'react';
import { Button } from '../../button';
import { CourseStats } from '../course-stats';
import { CourseCreator } from '../course-creator';
import { StarRating } from '../../star-rating';
import { course } from '@maany_shr/e-class-models';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';

export interface CourseCardAddToPackageProps extends course.TCourseMetadata {
    reviewCount: number;
    sessions: number;
    sales: number;
    onClickUser: () => void;
    locale: TLocale;
    courseAdded: boolean;
    onAddOrRemove: () => void;
}

/**
 * CourseCardAddToPackage
 *
 * A visual card component representing a course with metadata and interaction options,
 * specifically designed to be used within a course package selection interface.
 *
 * Features:
 * - Displays course image or a placeholder if the image fails to load
 * - Shows course title, rating, review count, and basic metadata such as sessions, duration, sales
 * - Includes the course creator's avatar and name
 * - Renders a button to add or remove the course from a package, with dynamic label and styling
 * - Fully localized using the provided `locale` prop
 *
 * Props:
 * @param {string} title - The title of the course
 * @param {number} rating - Average rating of the course (e.g., 4.5)
 * @param {number} reviewCount - Number of reviews received
 * @param {object} language - Language object (should contain a `name` property)
 * @param {number} sessions - Number of sessions in the course
 * @param {object} author - The author of the course, containing `name` and `image` fields
 * @param {object} duration - Object representing duration in minutes for different learning types (`video`, `coaching`, `selfStudy`)
 * @param {number} sales - Number of course purchases
 * @param {string} imageUrl - URL of the course thumbnail image
 * @param {boolean} courseAdded - Whether the course is currently added to the package
 * @param {function} onAddOrRemove - Callback invoked when the add/remove button is clicked
 * @param {function} onClickUser - Callback triggered when the creator’s name or image is clicked
 * @param {TLocale} locale - Locale used for translating the UI
 *
 * Usage:
 * ```tsx
 * <CourseCardAddToPackage
 *   title="Introduction to React"
 *   rating={4.8}
 *   reviewCount={123}
 *   language={{ name: "English" }}
 *   sessions={8}
 *   author={{ name: "Jane Doe", image: "/images/jane.png" }}
 *   duration={{ video: 120, coaching: 60, selfStudy: 30 }}
 *   sales={456}
 *   imageUrl="/images/course.png"
 *   courseAdded={true}
 *   onAddOrRemove={handleAddOrRemove}
 *   onClickUser={handleUserClick}
 *   locale="en"
 * />
 * ```
 */

export const CourseCardAddToPackage: React.FC<CourseCardAddToPackageProps> = ({
    title,
    rating,
    reviewCount,
    language,
    sessions,
    author,
    duration,
    sales,
    imageUrl,
    onClickUser,
    courseAdded,
    onAddOrRemove,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    const [isImageError, setIsImageError] = useState(false);

    const addOrRemoveButtonText = courseAdded
        ? dictionary.components.courseCard.addToPackageButton
        : dictionary.components.courseCard.removeButton;

    const handleImageError = () => {
        setIsImageError(true);
    };

    const shouldShowPlaceholder = !imageUrl || isImageError;

    // Calculate total course duration in minutes and convert to hours
    const totalDurationInMinutes =
        duration.video + duration.coaching + duration.selfStudy;
    const totalDurationInHours = totalDurationInMinutes / 60;
    const formattedDuration = Number.isInteger(totalDurationInHours)
        ? totalDurationInHours.toString()
        : totalDurationInHours.toFixed(2);

    return (
        <div className="flex flex-col gap-2 rounded-medium border border-base-neutral-700 bg-base-neutral-800 w-full lg:w-[21rem]">
            {/* If image is broken */}
            <div className="relative">
                {shouldShowPlaceholder ? (
                    <div className="w-full h-[200px] rounded-t-medium bg-base-neutral-700 flex items-center justify-center">
                        <span className="text-text-secondary text-md">
                            {dictionary.components.coachBanner.placeHolderText}
                        </span>
                    </div>
                ) : (
                    // Card with image
                    <img
                        loading="lazy"
                        src={imageUrl}
                        alt={title}
                        className="w-full rounded-t-medium aspect-[2.15] object-cover"
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
                        <StarRating totalStars={5} rating={rating} />
                        <span className="text-xs text-text-primary leading-[100%]">
                            {rating}
                        </span>
                        <span className="text-xs text-text-secondary leading-[100%]">
                            ({reviewCount})
                        </span>
                    </div>

                    <CourseCreator
                        creatorName={author.name}
                        imageUrl={author.image}
                        you={false}
                        locale={locale as TLocale}
                        onClickUser={onClickUser}
                    />

                    <CourseStats
                        locale={locale as TLocale}
                        language={language.name}
                        sessions={sessions}
                        duration={`${formattedDuration} ${dictionary.components.courseCard.hours}`}
                        sales={sales}
                    />
                </div>

                <Button
                    onClick={onAddOrRemove}
                    className="w-full"
                    variant={courseAdded ? 'primary' : 'secondary'}
                    size="medium"
                    text={addOrRemoveButtonText}
                />
            </div>
        </div>
    );
};
