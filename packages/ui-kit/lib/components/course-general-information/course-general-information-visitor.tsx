'use client';

import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TCourseMetadata } from 'packages/models/src/course';
import { UserAvatar } from '../avatar/user-avatar';
import { Button } from '../button';
import { FC, useState, useEffect } from 'react';
import { UserAvatarReel } from '../avatar/user-avatar-reel';
import { CheckBox } from '../checkbox';
import { StarRating } from '../star-rating';
import { IconVideoCamera } from '../icons/icon-video-camera';
import { IconCoachingSession, IconCourse } from '../icons';

interface Coach {
    name: string;
    avatarUrl: string;
}

interface RequiredCourse {
    image: string;
    courseTitle: string;
    slug: string;
}

export interface CourseGeneralInformationVisitorProps
    extends TCourseMetadata,
    isLocalAware {
    longDescription: string | React.ReactNode;
    onClickBook: () => void;
    onClickBuyCourse: (coachingIncluded: boolean) => void;
    coaches: Coach[];
    totalCoachesCount: number;
    coachingIncluded: boolean;
    onCoachingIncludedChange: (coachingIncluded: boolean) => void;
    rating: number;
    totalRating: number;
    ownerRating: number;
    ownerTotalRating: number;
    requirementsDetails?: string;
    requiredCourses: RequiredCourse[];
    onClickRequiredCourse: (slug: string) => void;
}

/**
 * `CourseGeneralInformationVisitor` displays comprehensive information about a course
 * for unauthenticated users or visitors. It includes the title, description, author,
 * durations, ratings, coach avatars, pricing options (with or without coaching),
 * required prerequisite courses, and call-to-action buttons.
 *
 * This component is fully responsive, localized using a dictionary based on `locale`,
 * and includes robust UI elements like avatar reels, rating stars, and checkboxes.
 *
 * ### Example usage:
 *
 * ```tsx
 * <CourseGeneralInformationVisitor
 *   title="React for Beginners"
 *   longDescription="Learn React from scratch with hands-on examples and projects."
 *   duration={{ video: 120, coaching: 60, selfStudy: 90 }}
 *   author={{
 *     name: "Jane Doe",
 *     image: "https://example.com/jane.jpg"
 *   }}
 *   pricing={{ currency: 'USD', fullPrice: 99, partialPrice: 49 }}
 *   rating={4.5}
 *   totalRating={120}
 *   ownerRating={4.8}
 *   ownerTotalRating={50}
 *   imageUrl="https://example.com/course-image.jpg"
 *   coaches={[
 *     { name: "Coach A", avatarUrl: "https://example.com/coach-a.jpg" },
 *     { name: "Coach B", avatarUrl: "https://example.com/coach-b.jpg" }
 *   ]}
 *   totalCoachesCount={2}
 *   coachingIncluded={true}
 *   onCoachingIncludedChange={(value) => console.log("Coaching included:", value)}
 *   onClickBook={() => alert("Book button clicked")}
 *   onClickBuyCourse={(included) => alert(`Buy clicked, coaching: ${included}`)}
 *   requiredCourses={[
 *     {
 *       image: "https://example.com/js-basics.jpg",
 *       courseTitle: "JS Basics",
 *       slug: "js-basics"
 *     }
 *   ]}
 *   onClickRequiredCourse={(slug) => console.log("Go to course:", slug)}
 *   requirementsDetails="Basic JS knowledge recommended."
 *   locale="en"
 * />
 * ```
 *
 * @component
 * @param {CourseGeneralInformationVisitorProps} props - Props for the component.
 * @param {string} props.title - Course title.
 * @param {string} props.longDescription - Course description.
 * @param {object} props.duration - Durations of content (video, coaching, selfStudy).
 * @param {object} props.author - Course author info (name and avatar).
 * @param {object} props.pricing - Pricing info (currency, full/partial price).
 * @param {number} props.rating - Average rating of the course.
 * @param {number} props.totalRating - Total number of ratings for the course.
 * @param {number} props.ownerRating - Author's average rating.
 * @param {number} props.ownerTotalRating - Number of ratings for the author.
 * @param {string} props.imageUrl - URL for the main course image.
 * @param {Coach[]} props.coaches - List of coaches with names and avatars.
 * @param {number} props.totalCoachesCount - Total number of coaches available.
 * @param {boolean} props.coachingIncluded - Optional: Initial value of 'coaching included in the course' checkbox. Defaults to true.
 * @param {Function} props.onCoachingIncludedChange - Callback when coaching is toggled.
 * @param {Function} props.onClickBook - Callback when book button is clicked.
 * @param {Function} props.onClickBuyCourse - Callback when main CTA button is clicked.
 * @param {RequiredCourse[]} props.requiredCourses - List of required prerequisite courses.
 * @param {Function} props.onClickRequiredCourse - Callback when a required course is clicked.
 * @param {string} props.requirementsDetails - Message displayed above required courses.
 * @param {string} props.locale - Locale for translations.
 *
 * @returns {JSX.Element} A visual block with full course information for public view.
 */

export const CourseGeneralInformationVisitor: FC<
    CourseGeneralInformationVisitorProps
> = ({
    longDescription,
    duration,
    author,
    title,
    pricing,
    rating,
    onClickBook,
    onClickBuyCourse,
    onCoachingIncludedChange,
    onClickRequiredCourse,
    imageUrl,
    locale,
    coaches,
    totalRating,
    ownerRating,
    ownerTotalRating,
    totalCoachesCount,
    requiredCourses,
    requirementsDetails,
    coachingIncluded: initialCoachingIncluded = true,
}) => {
        const dictionary = getDictionary(locale);
        const [isImageError, setIsImageError] = useState(false);
        const [coachingIncluded, setCoachingIncluded] = useState(
            initialCoachingIncluded,
        );

        const finalRequirementsDetails = requirementsDetails ||
            (requiredCourses.length > 0
                ? dictionary.components.courseGeneralInformationView
                    .requirementsDetails
                : dictionary.components.courseGeneralInformationView.noRequirements);

        useEffect(() => {
            setCoachingIncluded(initialCoachingIncluded);
        }, [initialCoachingIncluded]);

        const handleImageError = () => {
            setIsImageError(true);
        };

        const shouldShowPlaceholder = !imageUrl || isImageError;

        const formatDuration = (durationInMinutes?: number): string => {
            if (!durationInMinutes || durationInMinutes <= 0) return '0m';
            if (durationInMinutes > 59) {
                const hours = Math.floor(durationInMinutes / 60);
                const minutes = durationInMinutes % 60;
                return `${hours}h ${minutes}m`;
            }
            return `${durationInMinutes}m`;
        };

        const totalDurationInMinutes =
            (duration?.video || 0) +
            (duration?.coaching || 0) +
            (duration?.selfStudy || 0);
        const formattedTotalDuration = formatDuration(totalDurationInMinutes);

        const formatSingleDurationSegment = (
            durationInMinutes: number,
            dictionary: ReturnType<typeof getDictionary>,
        ): string => {
            if (durationInMinutes < 60) {
                return `${durationInMinutes} ${dictionary.components.courseGeneralInformationView.minutesText}`;
            }

            const hours = Math.floor(durationInMinutes / 60);
            const minutes = durationInMinutes % 60;

            let result = `${hours} ${hours === 1
                ? dictionary.components.courseGeneralInformationView.hourText
                : dictionary.components.courseGeneralInformationView.hoursText
                }`;

            if (minutes > 0) {
                result += ` ${minutes} ${dictionary.components.courseGeneralInformationView.minutesText}`;
            }

            return result;
        };

        const handleCheckboxChange = () => {
            const newValue = !coachingIncluded;
            setCoachingIncluded(newValue);
            onCoachingIncludedChange(newValue);
        };

        return (
            <div className="flex w-full max-w-full overflow-hidden md:gap-15 gap-4 px-4  flex-col md:flex-row flex-wrap min-w-0">
                <div className="flex flex-col basis-full md:flex-1 gap-4 md:gap-6 md:pt-9 items-start order-1 md:order-2 min-w-0">
                    {/* Title & rating */}
                    <h1 className="text-text-primary"> {title} </h1>
                    <div className="flex flex-row gap-2">
                        <h6 className="text-text-primary"> {rating} </h6>
                        <StarRating totalStars={5} size={'4'} rating={rating} />
                        <p className="text-text-secondary text-xs">
                            {' '}
                            {totalRating}{' '}
                            {
                                dictionary.components.courseGeneralInformationView
                                    .reviewLabel
                            }{' '}
                        </p>
                    </div>

                    {/* IMAGE for mobile */}
                    <div className="relative w-full max-w-full max-h-[400px] bg-base-neutral-700 rounded-medium overflow-hidden block md:hidden">
                        {shouldShowPlaceholder ? (
                            <div className="flex items-center justify-center h-full min-h-[200px]">
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
                                src={imageUrl}
                                className="w-full h-auto max-h-[400px] object-cover rounded-medium"
                                onError={handleImageError}
                            />
                        )}
                    </div>

                    {/* Description */}
                    <p className="text-md text-text-secondary">{longDescription}</p>

                    {/* Duration */}
                    <div className="flex gap-2 flex-col">
                        <div className="flex gap-4">
                            <h6 className="text-text-primary text-lg">
                                {
                                    dictionary.components
                                        .courseGeneralInformationView.durationText
                                }
                                : {formattedTotalDuration}
                            </h6>
                        </div>

                        {/* Duration details */}
                        <div className="flex flex-col">
                            <div className="flex flex-row gap-2">
                                <IconVideoCamera
                                    classNames="text-text-primary"
                                    size="4"
                                />
                                <p className="text-text-secondary text-sm">
                                    {formatSingleDurationSegment(
                                        (duration as any).video as number,
                                        dictionary,
                                    )}{' '}
                                    {
                                        dictionary.components
                                            .courseGeneralInformationView
                                            .filmMaterialText
                                    }
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <IconCoachingSession
                                    classNames="text-text-primary"
                                    size="4"
                                />
                                <p className="text-text-secondary text-sm">
                                    {formatSingleDurationSegment(
                                        (duration as any).coaching as number,
                                        dictionary,
                                    )}{' '}
                                    {
                                        dictionary.components
                                            .courseGeneralInformationView
                                            .coachingWithAProfessionalText
                                    }
                                </p>
                            </div>

                            <div className="flex flex-row gap-2">
                                <IconCourse
                                    classNames="text-text-primary"
                                    size="4"
                                />
                                <p className="text-text-secondary text-sm">
                                    {formatSingleDurationSegment(
                                        (duration as any).selfStudy as number,
                                        dictionary,
                                    )}{' '}
                                    {
                                        dictionary.components
                                            .courseGeneralInformationView
                                            .selfStudyMaterialText
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 items-center lg:grid-cols-2 gap-6 w-full">
                        {/* Created by */}
                        <div className="flex flex-col gap-2 items-start">
                            <h6 className="text-text-primary text-lg">
                                {
                                    dictionary.components
                                        .courseGeneralInformationView.createdByText
                                }
                            </h6>
                            <div className="flex items-center gap-3 min-w-0">
                                <UserAvatar
                                    size="medium"
                                    fullName={(author as any).name as string}
                                    imageUrl={(author as any).image as string}
                                />
                                <div className="flex flex-col min-w-0">
                                    <p className="text-md text-text-primary font-important truncate">
                                        {(author as any).name as string}
                                    </p>
                                    <div className="flex items-center gap-1">
                                        <StarRating
                                            totalStars={5}
                                            size={'4'}
                                            rating={ownerRating}
                                        />
                                        <p className="text-text-primary text-xs font-important">
                                            {rating}
                                        </p>
                                        <p className="text-text-secondary text-2xs">
                                            ({ownerTotalRating})
                                        </p>
                                    </div>
                                </div>
                                <Button
                                    size="medium"
                                    variant="text"
                                    text={
                                        dictionary.components
                                            .courseGeneralInformationView.bookLabel
                                    }
                                    onClick={onClickBook}
                                    className="px-0 ml-auto hidden md:block"
                                />
                            </div>
                        </div>

                        {/* Taught by */}
                        {coaches.length > 0 && (
                            <div className="flex flex-col gap-2 items-start">
                                <h6 className="text-text-primary text-lg">
                                    {
                                        dictionary.components
                                            .courseGeneralInformationView.taughtBy
                                    }
                                </h6>
                                <UserAvatarReel
                                    users={coaches}
                                    totalUsersCount={
                                        totalCoachesCount ?? coaches.length
                                    }
                                    locale={locale}
                                />
                            </div>
                        )}
                    </div>

                    {/* Requirements */}
                    <div className="flex flex-col gap-1 items-start w-full">
                        <h6 className="text-text-primary text-lg">
                            {
                                dictionary.components.courseGeneralInformationView
                                    .requirementsTitle
                            }
                        </h6>
                        <p className="text-text-secondary">{finalRequirementsDetails}</p>
                        <div className="flex flex-wrap gap-3">
                            {requiredCourses.map((course) => (
                                <Button
                                    key={course.courseTitle}
                                    className="p-0 gap-1 text-sm sm:w-auto truncate"
                                    size="small"
                                    title={course.courseTitle}
                                    variant="text"
                                    onClick={() =>
                                        onClickRequiredCourse(course.slug)
                                    }
                                    hasIconLeft
                                    iconLeft={
                                        <UserAvatar
                                            fullName={course.courseTitle}
                                            imageUrl={course.image}
                                            className="rounded-small"
                                            size="xSmall"
                                        />
                                    }
                                    text={course.courseTitle}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Checkbox coaching included */}
                    <div className="flex flex-row items-center gap-2">
                        <CheckBox
                            name="coachingIncluded"
                            value="coachingIncluded"
                            checked={coachingIncluded}
                            size="medium"
                            withText={true}
                            label={
                                dictionary.components.courseGeneralInformationView
                                    .coachingIncluded
                            }
                            labelClass="text-text-secondary text-md"
                            onChange={handleCheckboxChange}
                        />
                        <p className="text-feedback-success-primary lg:text-md text-sm font-important whitespace-nowrap">
                            {
                                dictionary.components.courseGeneralInformationView
                                    .saveLabel
                            }{' '}
                            {(pricing as any).currency as string} {(pricing as any).partialPrice as number}
                        </p>
                    </div>

                    {/* Button */}
                    <Button
                        size="huge"
                        text={`${dictionary.components.courseGeneralInformationView.buyButton} (${(pricing as any).currency as string} ${coachingIncluded ? (pricing as any).fullPrice as number : (pricing as any).partialPrice as number})`}
                        onClick={() => onClickBuyCourse(coachingIncluded)}
                        className="w-full text-lg lg:text-2xl"
                    />
                </div>

                {/* Image desktop */}
                <div className="relative basis-1/2 h-full order-1 md:order-2 hidden md:block">
                    {shouldShowPlaceholder ? (
                        <div className="w-full h-[400px] bg-base-neutral-700 flex items-center justify-center rounded-medium">
                            <span className="text-text-secondary text-md">
                                {dictionary.components.coachBanner.placeHolderText}
                            </span>
                        </div>
                    ) : (
                        <img
                            loading="lazy"
                            src={imageUrl}
                            className="w-full h-auto object-cover rounded-medium"
                            onError={handleImageError}
                        />
                    )}
                </div>
            </div>
        );
    };
