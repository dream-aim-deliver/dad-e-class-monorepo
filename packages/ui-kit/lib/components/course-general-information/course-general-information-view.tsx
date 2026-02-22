'use client';

import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TCourseMetadata } from 'packages/models/src/course';
import { Button } from '../button';
import { Badge } from '../badge';
import { ProgressBar } from '../progress-bar';
import { FC, useState } from 'react';
import { IconClock } from '../icons/icon-clock';
import RichTextRenderer from '../rich-text-element/renderer';
import { IconCheck, IconStar } from '../icons';
import { UserAvatar } from '../avatar/user-avatar';
import { UserAvatarReel } from '../avatar/user-avatar-reel';
import { useImageComponent } from '../../contexts/image-component-context';

interface Coach {
    name: string;
    avatarUrl: string;
}
export interface CourseGeneralInformationViewBaseProps
    extends TCourseMetadata,
        isLocalAware {
    longDescription: string;
    onClickAuthor: () => void;
    coaches: Coach[];
}

export interface WithProgressViewProps
    extends CourseGeneralInformationViewBaseProps {
    progress: number;
    onClickResume: () => void;
    showProgress: true;
    onClickReview: () => void;
}

export interface WithoutProgressViewProps
    extends CourseGeneralInformationViewBaseProps {
    showProgress: false;
}

export type CourseGeneralInformationViewProps =
    | WithProgressViewProps
    | WithoutProgressViewProps;

/**
 * CourseGeneralInformationView
 *
 * A responsive and localized component for displaying detailed course metadata.
 * It supports two modes:
 * - With progress tracking and resume button (for enrolled users),
 * - Without progress display (for public or unauthenticated users).
 *
 * @component
 *
 * @param {CourseGeneralInformationViewProps} props - The props for the component.
 * @param {string} props.longDescription - A detailed description of the course.
 * @param {object} props.duration - Duration details including video, coaching, and self-study (in minutes).
 * @param {object} props.author - Author information containing name and image.
 * @param {string} [props.imageUrl] - URL for the course image. If missing or broken, a placeholder is shown.
 * @param {boolean} props.showProgress - Whether to show progress bar and resume button.
 * @param {number} [props.progress] - Current progress percentage (required when `showProgress` is true).
 * @param {Function} [props.onClickResume] - Callback when the resume button is clicked (required when `showProgress` is true).
 * @param {Function} props.onClickAuthor - Callback when the author's profile is clicked.
 * @param {Student[]} props.students - Array of enrolled students with name and avatar.
 * @param {number} [props.totalStudentCount] - Optional total student count (used when more students exist than avatars shown).
 * @param {string} props.locale - Current language/locale code for translations.
 *
 * @example
 * ```tsx
 * import { CourseGeneralInformationView } from './components/course/course-general-information-view';
 *
 * const courseData = {
 *   title: 'Intro to Design Systems',
 *   longDescription: 'Learn how to create consistent and scalable UI systems...',
 *   duration: {
 *     video: 90,
 *     coaching: 60,
 *     selfStudy: 45,
 *   },
 *   author: {
 *     name: 'Jane Doe',
 *     image: 'https://example.com/avatars/jane.jpg',
 *   },
 *   imageUrl: 'https://example.com/images/course-banner.jpg',
 *   students: [
 *     { name: 'Alice', avatarUrl: '/avatars/alice.png' },
 *     { name: 'Bob', avatarUrl: '/avatars/bob.png' },
 *   ],
 *   totalStudentCount: 128,
 *   rating: 4.8,
 *   locale: 'en',
 *   onClickAuthor: () => alert('Author clicked!'),
 * };
 *
 * const App = () => (
 *   <CourseGeneralInformationView
 *     {...courseData}
 *     showProgress={true}
 *     progress={65}
 *     onClickResume={() => alert('Resume course!')}
 *   />
 * );
 * ```
 */

export const CourseGeneralInformationView: FC<
    CourseGeneralInformationViewProps
> = (props) => {
    const {
        longDescription,
        duration,
        author,
        rating,
        onClickAuthor,
        imageUrl,
        showProgress,
        coaches,
    } = props;

    const dictionary = getDictionary(props.locale);
    const [isImageError, setIsImageError] = useState(false);
    const ImageComponent = useImageComponent();

    // Handle image loading errors
    const handleImageError = () => {
        setIsImageError(true);
    };

    const shouldShowPlaceholder = !imageUrl || isImageError;

    // Helper function to format duration in hours and minutes
    const formatDuration = (durationInMinutes?: number): string => {
        if (!durationInMinutes || durationInMinutes <= 0) return '0m';
        if (durationInMinutes > 59) {
            const hours = Math.floor(durationInMinutes / 60);
            const minutes = durationInMinutes % 60;
            return `${hours}h ${minutes}m`;
        }
        return `${durationInMinutes}m`;
    };

    // Calculate total duration
    const totalDurationInMinutes =
        (duration?.video || 0) +
        (duration?.coaching || 0) +
        (duration?.selfStudy || 0);
    const formattedTotalDuration = formatDuration(totalDurationInMinutes);

    // Helper function to format single duration segment
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

    return (
        <div className="flex md:gap-20  gap-10 w-full md:flex-row flex-col-reverse">
            <div className="flex gap-[42px] flex-col basis-1/2">
                {/* Description */}
                <RichTextRenderer
                    onDeserializationError={console.error}
                    content={longDescription}
                    className="text-md text-text-secondary"
                />

                {/* Duration */}
                <div className="flex gap-2 flex-col">
                    <div className="flex gap-4 items-center">
                        <h5 className="text-text-primary">
                            {
                                dictionary.components
                                    .courseGeneralInformationView.durationText
                            }
                        </h5>
                        <Badge
                            hasIconLeft
                            iconLeft={<IconClock size="4" />}
                            key={formattedTotalDuration}
                            text={formattedTotalDuration}
                            className="h-5 text-sm max-w-full"
                        />
                    </div>

                    {/* Duration details */}
                    <div className="flex flex-col">
                        <p className="text-text-secondary text-sm">
                            {formatSingleDurationSegment(
                                duration?.video || 0,
                                dictionary,
                            )}{' '}
                            {
                                dictionary.components
                                    .courseGeneralInformationView
                                    .filmMaterialText
                            }
                        </p>

                        <p className="text-text-secondary text-sm">
                            {formatSingleDurationSegment(
                                duration?.coaching || 0,
                                dictionary,
                            )}{' '}
                            {
                                dictionary.components
                                    .courseGeneralInformationView
                                    .coachingWithAProfessionalText
                            }
                        </p>

                        <p className="text-text-secondary text-sm">
                            {formatSingleDurationSegment(
                                duration?.selfStudy || 0,
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

                {/* Created by */}
                {author?.name?.trim() && (
                    <div className="flex flex-col gap-4">
                        <h5 className="text-text-primary">
                            {
                                dictionary.components.courseGeneralInformationView
                                    .createdByText
                            }
                        </h5>
                        <div className="flex gap-2">
                            <UserAvatar
                                size="large"
                                fullName={author.name}
                                imageUrl={author.image}
                            />
                            <div className="flex flex-col justify-center items-start">
                                <p className="text-md text-text-primary font-bold leading-[120%]">
                                    {author.name}
                                </p>
                                <div className="flex gap-2 items-center">
                                    <Badge
                                        hasIconLeft
                                        iconLeft={<IconStar size="4" />}
                                        text={`${rating}`}
                                        className="h-5 text-sm max-w-full"
                                    />
                                    <Button
                                        size="small"
                                        variant="text"
                                        text={
                                            dictionary.components
                                                .courseGeneralInformationView
                                                .viewProfileText
                                        }
                                        onClick={onClickAuthor}
                                        className="px-0"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Taught by */}
                {coaches.length > 0 && (
                    <div className="flex flex-col gap-2 items-start">
                        <h6 className="text-text-primary text-lg">
                            {dictionary.components.courseGeneralInformationView.taughtBy}
                        </h6>
                        <UserAvatarReel
                            users={coaches}
                            totalUsersCount={coaches.length}
                            locale={props.locale}
                        />
                    </div>
                )}

                {/* Show Progress Bar & Resume Button JUST if the user is a student */}
                {showProgress === true && (
                    <>
                        {/* Begin course if progress is 0 */}
                        {props.progress === 0 && (
                            <div className="flex flex-col gap-2 md:w-[488px] w-full">
                                <Button
                                    size="big"
                                    text={
                                        dictionary.components
                                            .courseGeneralInformationView
                                            .beginCourseButton
                                    }
                                    onClick={props.onClickResume}
                                />
                            </div>
                        )}

                        {/* Course in progress */}
                        {props.progress > 0 && props.progress < 100 && (
                            <div className="flex flex-col gap-2 md:w-[488px] w-full">
                                <h6 className="text-md text-text-primary font-bold leading-[120%]">
                                    {
                                        dictionary.components
                                            .courseGeneralInformationView
                                            .yourProgressText
                                    }
                                </h6>
                                <div className="flex gap-4">
                                    <ProgressBar
                                        progress={props.progress}
                                        type="progress"
                                    />
                                    <p className="text-md text-text-secondary font-bold leading-[150%]">
                                        {Number(props.progress.toFixed(2))}%
                                    </p>
                                </div>
                                <Button
                                    size="big"
                                    text={
                                        dictionary.components
                                            .courseGeneralInformationView
                                            .resumeText
                                    }
                                    onClick={props.onClickResume}
                                />
                            </div>
                        )}

                        {/* Completed course if progress is 100 */}
                        {props.progress === 100 && (
                            <div className="flex flex-col gap-2 md:w-[488px] w-full items-center">
                                <div className="flex gap-4 items-center">
                                    <Badge
                                        variant="successprimary"
                                        size="big"
                                        text={
                                            dictionary.components
                                                .courseGeneralInformationView
                                                .courseCompletedBadge
                                        }
                                        className="h-7 text-xs lg:text-sm py-1 max-w-full"
                                        hasIconLeft
                                        iconLeft={<IconCheck />}
                                    />
                                </div>
                                <Button
                                    size="big"
                                    text={
                                        dictionary.components
                                            .courseGeneralInformationView
                                            .reviewCourseButton
                                    }
                                    onClick={props.onClickReview}
                                    className="w-full"
                                />
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Image section */}
            <div className="relative basis-1/2 h-full">
                {shouldShowPlaceholder ? (
                    <div className="w-full h-[400px] bg-base-neutral-700 flex items-center justify-center">
                        <span className="text-text-secondary text-md">
                            {dictionary.components.coachBanner.placeHolderText}
                        </span>
                    </div>
                ) : (
                    <ImageComponent
                        loading="lazy"
                        src={imageUrl}
                        width={600}
                        height={400}
                        className="w-full h-full object-cover rounded-medium"
                        onError={handleImageError}
                        alt={props.title || ''}
                    />
                )}
            </div>
        </div>
    );
};
