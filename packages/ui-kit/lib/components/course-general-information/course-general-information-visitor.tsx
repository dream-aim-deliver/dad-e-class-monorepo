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

interface RequiredCourses {
    image: string;
    courseTitle: string;
    slug: string;
}

export interface CourseGeneralInformationVisitorProps
    extends TCourseMetadata,
        isLocalAware {
    longDescription: string;
    onClickBook: () => void;
    children?: React.ReactNode;
    onClickBuyCourse: (coachingIncluded: boolean) => void;
    coaches?: Coach[];
    totalCoachesCount: number;
    coachingIncluded: boolean;
    onCoachingIncludedChange: (coachingIncluded: boolean) => void;
    rating: number;
    totalRating: number;
    ownerRating: number;
    ownerTotalRating: number;
    requirementsDetails: string;
    requiredCourses?: RequiredCourses[];
    onClickCourse?: (slug: string) => void;
}

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
    children,
    onClickBuyCourse,
    onCoachingIncludedChange,
    imageUrl,
    locale,
    coaches,
    totalRating,
    ownerRating,
    ownerTotalRating,
    totalCoachesCount,
    requirementsDetails,
    requiredCourses,
    onClickCourse,
    coachingIncluded: initialCoachingIncluded,
}) => {
    const dictionary = getDictionary(locale);
    const [isImageError, setIsImageError] = useState(false);
    const [coachingIncluded, setCoachingIncluded] = useState(
        initialCoachingIncluded,
    );

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

        let result = `${hours} ${
            hours === 1
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

    const formatCoachNamesText = (
        coaches: Coach[],
        totalCount: number,
    ): string => {
        if (coaches.length === 0) return '';
        const and = dictionary.components.courseGeneralInformationView.and;
        const other = dictionary.components.courseGeneralInformationView.other;
        const others =
            dictionary.components.courseGeneralInformationView.others;

        if (coaches.length === 1) {
            const othersCount = totalCount - 1;
            if (othersCount === 0) {
                return coaches[0].name;
            } else if (othersCount === 1) {
                return `${coaches[0].name} ${and} 1 ${other}`;
            } else {
                return `${coaches[0].name} ${and} ${othersCount} ${others}`;
            }
        }

        if (coaches.length === 2) {
            const othersCount = totalCount - 2;
            if (othersCount === 0) {
                return `${coaches[0].name} ${and} ${coaches[1].name}`;
            } else if (othersCount === 1) {
                return `${coaches[0].name}, ${coaches[1].name} ${and} 1 ${other}`;
            } else {
                return `${coaches[0].name}, ${coaches[1].name} ${and} ${othersCount} ${others}`;
            }
        }

        const othersCount = totalCount - coaches.length;
        if (othersCount === 0) {
            if (coaches.length === 3) {
                return `${coaches[0].name}, ${coaches[1].name} ${and} ${coaches[2].name}`;
            }
            return `${coaches[0].name}, ${coaches[1].name}, ${coaches[2].name} ${and} ${coaches.length - 3} ${others}`;
        } else {
            return `${coaches[0].name}, ${coaches[1].name}, ${coaches[2].name} ${and} ${othersCount} ${others}`;
        }
    };

    const renderCoachAvatarReel = () => {
        if (!coaches || !totalCoachesCount) return null;
        if (coaches.length === 0) return null;

        const visibleCoaches = coaches.slice(0, 3);

        return (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <UserAvatarReel>
                    {visibleCoaches.map((coach, index) => (
                        <UserAvatar
                            key={index}
                            size="medium"
                            fullName={coach.name}
                            imageUrl={coach.avatarUrl}
                        />
                    ))}
                </UserAvatarReel>
                <p className="text-base-white text-lg font-bold">
                    {formatCoachNamesText(coaches, totalCoachesCount)}
                </p>
            </div>
        );
    };

    return (
        <div className="flex w-full max-w-full overflow-hidden md:gap-15 gap-4 px-4 py-6 flex-col md:flex-row flex-wrap min-w-0">
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
                                    duration.video,
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
                                    duration.coaching,
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
                                    duration.selfStudy,
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

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full">
                    {/* Created by */}
                    <div className="flex flex-col gap-2 items-start">
                        <h6 className="text-text-primary text-lg">
                            {
                                dictionary.components
                                    .courseGeneralInformationView.createdByText
                            }
                        </h6>
                        <div className="flex items-start gap-3 min-w-0">
                            <UserAvatar
                                size="large"
                                fullName={author.name}
                                imageUrl={author.image}
                            />
                            <div className="flex flex-col min-w-0">
                                <p className="text-md text-text-primary font-important truncate">
                                    {author.name}
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
                    <div className="flex flex-col gap-2 items-start">
                        <h6 className="text-text-primary text-lg">
                            {
                                dictionary.components
                                    .courseGeneralInformationView.taughtBy
                            }
                        </h6>
                        {renderCoachAvatarReel()}
                        {children}
                    </div>
                </div>

                {/* Requirements */}
                <div className="flex flex-col gap-1 items-start w-full">
                    <h6 className="text-text-primary text-lg">
                        {
                            dictionary.components.courseGeneralInformationView
                                .requirementsTitle
                        }
                    </h6>
                    <p className="text-text-secondary">{requirementsDetails}</p>
                    {requiredCourses
                        ?.slice(0, 3)
                        .map((course) => (
                            <Button
                                key={course.courseTitle}
                                className="p-0 gap-1 text-sm sm:w-auto truncate"
                                size="small"
                                title={course.courseTitle}
                                variant="text"
                                onClick={() => onClickCourse?.(course.slug)}
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
                        {pricing.currency} {pricing.partialPrice}
                    </p>
                </div>

                {/* Button */}
                <Button
                    size="huge"
                    text={`${dictionary.components.courseGeneralInformationView.buyButton} (${pricing.currency} ${pricing.fullPrice})`}
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
