import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { TCourseMetadata } from 'packages/models/src/course';
import { UserAvatar } from '../avatar/user-avatar';
import { Button } from '../button';
import { Badge } from '../badge';
import { ProgressBar } from '../progress-bar';
import { FC, useState } from 'react';
import { IconClock } from '../icons/icon-clock';
import { IconStar } from '../icons/icon-star';
import { UserAvatarReel } from '../avatar/user-avatar-reel';
import { IconCheck } from '../icons';

interface Student {
    name: string;
    avatarUrl: string;
}
export interface CourseGeneralInformationViewBaseProps
    extends TCourseMetadata,
        isLocalAware {
    longDescription: string;
    onClickAuthor: () => void;
    students: Student[];
    totalStudentCount: number;
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
 * A responsive and localized component for displaying detailed course metadata with dynamic progress states.
 * It supports multiple modes based on user enrollment and progress:
 * - Public view (no progress tracking for unauthenticated users)
 * - Not started (progress = 0, shows "Begin Course" button)
 * - In progress (0 < progress < 100, shows progress bar and "Resume" button)
 * - Completed (progress = 100, shows completion badge and "Review" button)
 *
 * @component
 *
 * @param {CourseGeneralInformationViewProps} props - The props for the component.
 * @param {string} props.title - Course title (from TCourseMetadata).
 * @param {string} props.longDescription - A detailed description of the course content.
 * @param {object} props.duration - Duration breakdown including video, coaching, and self-study time (in minutes).
 * @param {number} props.duration.video - Video content duration in minutes.
 * @param {number} props.duration.coaching - Professional coaching duration in minutes.
 * @param {number} props.duration.selfStudy - Self-study material duration in minutes.
 * @param {object} props.author - Course author information.
 * @param {string} props.author.name - Author's full name.
 * @param {string} props.author.image - URL to author's profile image.
 * @param {number} props.rating - Course rating (typically 1-5 scale).
 * @param {string} [props.imageUrl] - URL for the course banner image. Shows placeholder if missing or fails to load.
 * @param {boolean} props.showProgress - Determines if progress tracking UI should be displayed.
 * @param {number} [props.progress] - Current completion percentage (0-100). Required when `showProgress` is true.
 * @param {Function} [props.onClickResume] - Callback for resume/begin course button. Required when `showProgress` is true.
 * @param {Function} [props.onClickReview] - Callback for review course button. Required when `showProgress` is true.
 * @param {Function} props.onClickAuthor - Callback when the author's profile is clicked.
 * @param {Student[]} props.students - Array of enrolled students with name and avatar information.
 * @param {string} props.students[].name - Student's name.
 * @param {string} props.students[].avatarUrl - URL to student's avatar image.
 * @param {number} props.totalStudentCount - Total number of enrolled students (may exceed students array length).
 * @param {string} props.locale - Language/locale code for translations (e.g., 'en', 'es', 'de').
 *
 * @example
 * ```
 * // Coaches view (without progress bar)
 * <CourseGeneralInformationView
 *   title="Advanced React Patterns"
 *   longDescription="Master advanced React concepts including hooks, context, and performance optimization..."
 *   duration={{ video: 180, coaching: 90, selfStudy: 120 }}
 *   author={{ name: "Sarah Johnson", image: "/avatars/sarah.jpg" }}
 *   rating={4.7}
 *   imageUrl="/courses/react-advanced.jpg"
 *   students={[{ name: "Alice", avatarUrl: "/avatars/alice.jpg" }]}
 *   totalStudentCount={245}
 *   locale="en"
 *   showProgress={false}
 *   onClickAuthor={() => navigate('/author/sarah-johnson')}
 * />
 *
 * // Course not started (progress = 0)
 * <CourseGeneralInformationView
 *   {...courseData}
 *   showProgress={true}
 *   progress={0}
 *   onClickResume={() => startCourse()}
 *   onClickReview={() => reviewCourse()}
 * />
 *
 * // Course in progress (0 < progress < 100)
 * <CourseGeneralInformationView
 *   {...courseData}
 *   showProgress={true}
 *   progress={65}
 *   onClickResume={() => resumeCourse()}
 *   onClickReview={() => reviewCourse()}
 * />
 *
 * // Course completed (progress = 100)
 * <CourseGeneralInformationView
 *   {...courseData}
 *   showProgress={true}
 *   progress={100}
 *   onClickResume={() => resumeCourse()}
 *   onClickReview={() => reviewCourse()}
 * />
 * ```
 *
 * @see {@link Student} Student interface definition
 * @see {@link CourseGeneralInformationViewProps} Complete props type definition
 * @see {@link TCourseMetadata} Course metadata interface from models package
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
        students,
        totalStudentCount,
    } = props;

    const dictionary = getDictionary(props.locale);
    const [isImageError, setIsImageError] = useState(false);

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
                <p className="text-md text-text-secondary">{longDescription}</p>

                {/* Duration */}
                <div className="flex gap-2 flex-col">
                    <div className="flex gap-4">
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
                            className="h-5 text-sm py-1 max-w-full"
                        />
                    </div>

                    {/* Duration details */}
                    <div className="flex flex-col">
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

                {/* Created by */}
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
                                    className="h-5 py-1 text-sm max-w-full"
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

                {/* Enrolled Students */}
                <div className="flex items-center">
                    <UserAvatarReel
                        users={students}
                        totalUsersCount={totalStudentCount ?? students.length}
                        locale={props.locale}
                    />
                </div>

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
                                        {props.progress}%
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
                    <img
                        loading="lazy"
                        src={imageUrl}
                        className="w-full h-full object-cover rounded-medium"
                        onError={handleImageError}
                    />
                )}
            </div>
        </div>
    );
};
