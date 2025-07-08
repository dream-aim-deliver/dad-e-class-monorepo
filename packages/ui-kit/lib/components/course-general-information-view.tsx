import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { TCourseMetadata } from "packages/models/src/course";
import { UserAvatar } from "./avatar/user-avatar";
import { Button } from "./button";
import { Badge } from './badge';
import { ProgressBar } from "./progress-bar";
import { FC, useState } from "react";
import { IconClock } from "./icons/icon-clock";
import { IconStar } from "./icons/icon-star";
import { UserAvatarReel } from "./avatar/user-avatar-reel";

interface Student {
    name: string;
    avatarUrl?: string;
}
export interface CourseGeneralInformationViewProps extends TCourseMetadata, isLocalAware {
    longDescription: string;
    onClickAuthor?: () => void;
    children?: React.ReactNode;
    studentProgress?: number;
    onClickResume?: () => void;
    students?: Student[];
    totalStudentCount?: number;
};

export const CourseGeneralInformationView: FC<CourseGeneralInformationViewProps> = ({
    longDescription,
    duration,
    author,
    rating,
    onClickAuthor,
    children,
    studentProgress,
    onClickResume,
    imageUrl,
    locale,
    students,
    totalStudentCount
}) => {
    const dictionary = getDictionary(locale);
    const [isImageError, setIsImageError] = useState(false);

    // Handle image loading errors
    const handleImageError = () => {
        setIsImageError(true);
    };

    const shouldShowPlaceholder = !imageUrl || isImageError;

    // Helper function to format duration in hours and minutes
    const formatDuration = (durationInMinutes?: number): string => {
        if (!durationInMinutes || durationInMinutes <= 0) return "0m";
        if (durationInMinutes > 59) {
            const hours = Math.floor(durationInMinutes / 60);
            const minutes = durationInMinutes % 60;
            return `${hours}h ${minutes}m`;
        }
        return `${durationInMinutes}m`;
    };

    // Calculate total duration
    const totalDurationInMinutes =
        (duration?.video || 0) + (duration?.coaching || 0) + (duration?.selfStudy || 0);
    const formattedTotalDuration = formatDuration(totalDurationInMinutes);

    // Helper function to format single duration segment
    const formatSingleDurationSegment = (
        durationInMinutes: number,
        dictionary: ReturnType<typeof getDictionary>
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

    // Helper function to format student names text
    const formatStudentNamesText = (students: Student[], totalCount: number): string => {
        if (students.length === 0) return '';
        
        if (students.length === 1) {
            const othersCount = totalCount - 1;
            if (othersCount === 0) {
                return students[0].name;
            } else if (othersCount === 1) {
                return `${students[0].name} and 1 other`;
            } else {
                return `${students[0].name} and ${othersCount} others`;
            }
        }
        
        if (students.length === 2) {
            const othersCount = totalCount - 2;
            if (othersCount === 0) {
                return `${students[0].name} and ${students[1].name}`;
            } else if (othersCount === 1) {
                return `${students[0].name}, ${students[1].name} and 1 other`;
            } else {
                return `${students[0].name}, ${students[1].name} and ${othersCount} others`;
            }
        }
        
        // For 3 or more students shown
        const othersCount = totalCount - students.length;
        if (othersCount === 0) {
            if (students.length === 3) {
                return `${students[0].name}, ${students[1].name} and ${students[2].name}`;
            }
            // For more than 3 students, show first 2 and count
            return `${students[0].name}, ${students[1].name} and ${students.length - 2} others`;
        } else {
            return `${students[0].name}, ${students[1].name} and ${othersCount} others`;
        }
    };

    // Render student avatar reel
    const renderStudentAvatarReel = () => {
        if (!students || !totalStudentCount) return null;
        if (students.length === 0) return null;

        const visibleStudents = students.slice(0, 3);

        return (
            <div className='flex gap-7 items-start md:items-center md:flex-row flex-col'>
                <UserAvatarReel>
                    {visibleStudents.map((student, index) => (
                        <UserAvatar
                            key={index}
                            size='large'
                            fullName={student.name}
                            imageUrl={student.avatarUrl}
                            className='mr-[-12px]'
                        />
                    ))}
                </UserAvatarReel>
                <p className='text-base-white text-lg leading-[120%] font-bold'>
                    {formatStudentNamesText(students, totalStudentCount)}
                </p>
            </div>
        );
    };

    return (
        <div className="flex md:gap-20  gap-10 w-full md:flex-row flex-col-reverse">
            <div className="flex gap-[42px] flex-col basis-1/2">
                <p className="text-md text-text-secondary leading-[150%]">
                    {longDescription}
                </p>
                <div className="flex gap-2 flex-col">
                    {/* Duration */}
                    <div className="flex gap-4">
                        <p className="text-text-primary text-lg leading-[120%] font-bold">
                            {dictionary.components.courseGeneralInformationView.durationText}
                        </p>
                        <Badge
                            hasIconLeft
                            iconLeft={<IconClock size='4' />}
                            key={formattedTotalDuration}
                            text={formattedTotalDuration}
                            className="h-5 text-sm py-1 max-w-full"
                        />
                    </div>
                    {/* Duration details */}
                    <div className="flex flex-col">
                        <p className="text-text-secondary text-sm leading-[150%]">
                            {formatSingleDurationSegment(duration.video, dictionary)}{" "}
                            {dictionary.components.courseGeneralInformationView.filmMaterialText}
                        </p>

                        <p className="text-text-secondary text-sm leading-[150%]">
                            {formatSingleDurationSegment(duration.coaching, dictionary)}{" "}
                            {dictionary.components.courseGeneralInformationView.coachingWithAProfessionalText}
                        </p>

                        <p className="text-text-secondary text-sm leading-[150%]">
                            {formatSingleDurationSegment(duration.selfStudy, dictionary)}{" "}
                            {dictionary.components.courseGeneralInformationView.selfStudyMaterialText}
                        </p>
                    </div>
                </div>
                {/* Author */}
                <div className="flex flex-col gap-4">
                    <p className="text-text-primary text-xl font-bold leading-[120%]">
                        {dictionary.components.courseGeneralInformationView.createdByText}
                    </p>
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
                                    iconLeft={<IconStar size='4' />}
                                    text={`${rating}`}
                                    className="h-5 py-1 text-sm max-w-full"
                                />
                                <Button
                                    size="small"
                                    variant="text"
                                    text={dictionary.components.courseGeneralInformationView.viewProfileText}
                                    onClick={onClickAuthor}
                                    className="px-0"
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {renderStudentAvatarReel()}
                {children}
                {studentProgress !== undefined && <div className="flex flex-col gap-2 md:w-[488px] w-full">
                    <h6 className="text-md text-text-primary font-bold leading-[120%]">
                        {dictionary.components.courseGeneralInformationView.yourProgressText}
                    </h6>
                    <div className="flex gap-4">
                        <ProgressBar
                            progress={studentProgress}
                            type="progress"
                        />
                        <p className="text-md text-text-secondary font-bold leading-[150%]">
                            {studentProgress}%
                        </p>
                    </div>
                    <Button
                        size="huge"
                        text={dictionary.components.courseGeneralInformationView.resumeText}
                        onClick={onClickResume}
                    />
                </div>}
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
