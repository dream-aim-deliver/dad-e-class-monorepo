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

interface Student {
    name: string;
    avatarUrl?: string;
}

export interface CourseGeneralInformationViewBaseProps
    extends TCourseMetadata,
        isLocalAware {
    longDescription: string;
    onClickAuthor: () => void;
    children?: React.ReactNode;
    students?: Student[];
    totalStudentCount?: number;
    studentProgress?: number;
    onClickResume?: () => void;
}

export const CourseGeneralInformationView: FC<
    CourseGeneralInformationViewBaseProps
> = (props) => {
    const {
        longDescription,
        duration,
        author,
        rating,
        onClickAuthor,
        children,
        imageUrl,
        students,
        totalStudentCount,
        studentProgress,
        onClickResume,
    } = props;

    const dictionary = getDictionary(props.locale);
    const [isImageError, setIsImageError] = useState(false);
    const shouldShowPlaceholder = !imageUrl || isImageError;

    const handleImageError = () => setIsImageError(true);

    const formatDuration = (minutes?: number) => {
        if (!minutes || minutes <= 0) return '0m';
        if (minutes > 59) {
            const h = Math.floor(minutes / 60);
            const m = minutes % 60;
            return `${h}h ${m}m`;
        }
        return `${minutes}m`;
    };

    const formatSegment = (min: number) => {
        if (min < 60) {
            return `${min} ${dictionary.components.courseGeneralInformationView.minutesText}`;
        }
        const h = Math.floor(min / 60);
        const m = min % 60;
        return (
            `${h} ${h === 1 ? dictionary.components.courseGeneralInformationView.hourText : dictionary.components.courseGeneralInformationView.hoursText}` +
            (m > 0
                ? ` ${m} ${dictionary.components.courseGeneralInformationView.minutesText}`
                : '')
        );
    };

    const totalDuration =
        (duration?.video || 0) +
        (duration?.coaching || 0) +
        (duration?.selfStudy || 0);

    const renderStudentAvatarReel = () => {
        if (!students || !totalStudentCount || students.length === 0)
            return null;
        const visible = students.slice(0, 3);
        const and = dictionary.components.courseGeneralInformationView.and;
        const other = dictionary.components.courseGeneralInformationView.other;
        const others =
            dictionary.components.courseGeneralInformationView.others;
        const remaining = totalStudentCount - visible.length;

        let label = '';
        if (visible.length === 1) {
            label =
                remaining === 0
                    ? visible[0].name
                    : `${visible[0].name} ${and} ${remaining} ${remaining === 1 ? other : others}`;
        } else if (visible.length === 2) {
            label =
                remaining === 0
                    ? `${visible[0].name} ${and} ${visible[1].name}`
                    : `${visible[0].name}, ${visible[1].name} ${and} ${remaining} ${remaining === 1 ? other : others}`;
        } else {
            label =
                `${visible[0].name}, ${visible[1].name}, ${visible[2].name}` +
                (remaining > 0 ? ` ${and} ${remaining} ${others}` : '');
        }

        return (
            <div className="flex gap-7 items-start md:items-center md:flex-row flex-col">
                <UserAvatarReel>
                    {visible.map((student, i) => (
                        <UserAvatar
                            key={i}
                            size="large"
                            fullName={student.name}
                            imageUrl={student.avatarUrl}
                            className="mr-[-12px]"
                        />
                    ))}
                </UserAvatarReel>
                <p className="text-base-white text-lg leading-[120%] font-bold">
                    {label}
                </p>
            </div>
        );
    };

    const isStudent =
        typeof studentProgress === 'number' &&
        typeof onClickResume === 'function';

    return (
        <div className="flex md:gap-20 gap-10 w-full md:flex-row flex-col-reverse">
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
                            key={totalDuration}
                            text={formatDuration(totalDuration)}
                            className="h-5 text-sm py-1 max-w-full"
                        />
                    </div>

                    {/* Duration details */}
                    <div className="flex flex-col text-sm text-text-secondary">
                        <p>
                            {formatSegment(duration.video)}{' '}
                            {
                                dictionary.components
                                    .courseGeneralInformationView
                                    .filmMaterialText
                            }
                        </p>
                        <p>
                            {formatSegment(duration.coaching)}{' '}
                            {
                                dictionary.components
                                    .courseGeneralInformationView
                                    .coachingWithAProfessionalText
                            }
                        </p>
                        <p>
                            {formatSegment(duration.selfStudy)}{' '}
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
                            <p className="text-text-primary font-important">
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

                {/* Students Reel Avatar */}
                {renderStudentAvatarReel()}
                {children}

                {/* Progress Bar & Resume Button (just for student) */}
                {isStudent && (
                    <div className="flex flex-col gap-2 md:w-[488px] w-full">
                        <h6 className="text-text-primary">
                            {
                                dictionary.components
                                    .courseGeneralInformationView
                                    .yourProgressText
                            }
                        </h6>
                        <div className="flex gap-4">
                            <ProgressBar
                                progress={studentProgress}
                                type="progress"
                            />
                            <p className="text-md text-text-secondary font-important">
                                {studentProgress}%
                            </p>
                        </div>
                        <Button
                            size="huge"
                            text={
                                dictionary.components
                                    .courseGeneralInformationView.resumeText
                            }
                            onClick={onClickResume}
                        />
                    </div>
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
