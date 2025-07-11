import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Badge } from '../badge';
import { IconCoachingOffer } from '../icons/icon-coaching-offer';
import { IconCourse } from '../icons/icon-course';
import { IconAssignment } from '../icons/icon-assignment';

export interface StudentCardProps extends isLocalAware {
    status: 'default' | 'long-wait' | 'waiting-feedback' | 'course-completed';
    studentName: string;
    studentImageUrl: string;
    coachName: string;
    coachImageUrl: string;
    courseName: string;
    courseImageUrl: string;
    assignmentTitle?: string;
    onStudentDetails: () => void;
    onViewAssignment?: () => void;
    coachingSessionsLeft?: number;
    completedCourseDate?: Date;
    isYou: boolean;
    onClickCourse: () => void;
    onClickCoach: () => void;
}

/**
 * Renders a card displaying student information, including their avatar, name, coaching sessions left,
 * coach details, course details, assignment status, and actions. The card adapts its content based on
 * the student's current status (e.g., waiting for feedback, long wait, course completed).
 *
 * @param status - The current status of the student (e.g., 'long-wait', 'waiting-feedback', 'course-completed').
 * @param studentName - The full name of the student.
 * @param studentImageUrl - The URL of the student's avatar image.
 * @param coachName - The full name of the coach.
 * @param coachImageUrl - The URL of the coach's avatar image.
 * @param courseName - The name of the course.
 * @param courseImageUrl - The URL of the course's image.
 * @param assignmentTitle - The title of the current assignment.
 * @param isYou - Indicates if the coach is the current user.
 * @param onClickCourse - Callback invoked when the course name is clicked.
 * @param onClickCoach - Callback invoked when the coach's name is clicked.
 * @param completedCourseDate - The date when the course was completed (if applicable).
 * @param onStudentDetails - Callback invoked when the "Student Details" button is clicked.
 * @param onViewAssignment - Callback invoked when the "View Assignment" button is clicked.
 * @param coachingSessionsLeft - The number of coaching sessions left for the student.
 * @param locale - The locale used for translations.
 *
 * @returns A styled card component displaying student, coach, course, and assignment details with relevant actions.
 */
export const StudentCard = ({
    status,
    studentName,
    studentImageUrl,
    coachName,
    coachImageUrl,
    courseName,
    courseImageUrl,
    assignmentTitle,
    isYou,
    onClickCourse,
    onClickCoach,
    completedCourseDate,
    onStudentDetails,
    onViewAssignment,
    coachingSessionsLeft,
    locale,
}: StudentCardProps) => {
    const dictionary = getDictionary(locale).components.studentCard;

    return (
        <div className="flex flex-col md:p-4 p-2 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:w-[22rem]">
            {/* Avatar, student name & Badge */}
            <div className="flex flex-row items-center gap-3 mb-2">
                <UserAvatar
                    fullName={studentName}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                    imageUrl={studentImageUrl}
                />
                <div className="flex flex-col gap-1">
                    <h6 className="text-md text-text-primary font-important">
                        {studentName}
                    </h6>
                    {typeof coachingSessionsLeft === 'number' &&
                        coachingSessionsLeft > 0 && (
                            <Badge
                                className="flex items-center"
                                variant="info"
                                size="small"
                                text={`${coachingSessionsLeft} ${dictionary.coachingSessionsLeftText}`}
                            />
                        )}
                </div>
            </div>

            {/* Coach details */}
            <div className="flex flex-wrap items-center gap-2">
                <IconCoachingOffer classNames="text-text-secondary" size="4" />
                <p className="text-text-secondary text-sm">
                    {dictionary.coach}
                </p>
                {isYou ? (
                    <div className="flex items-center gap-1 text-sm text-text-primary font-important">
                        <UserAvatar
                            fullName={coachName}
                            size="small"
                            imageUrl={coachImageUrl}
                        />
                        <span>{dictionary.you}</span>
                    </div>
                ) : (
                    <Button
                        className="p-0 gap-1 text-sm truncate"
                        size="small"
                        variant="text"
                        hasIconLeft
                        iconLeft={
                            <UserAvatar
                                fullName={coachName}
                                size="small"
                                imageUrl={coachImageUrl}
                            />
                        }
                        text={coachName}
                        onClick={onClickCoach}
                    />
                )}
            </div>

            {/* Course details */}
            <div className="flex flex-wrap items-center gap-2">
                <IconCourse classNames="text-text-secondary" size="4" />
                <p className="text-text-secondary text-sm">
                    {dictionary.course}
                </p>
                <Button
                    size="small"
                    variant="text"
                    className="p-0 gap-1 text-sm truncate"
                    text={courseName}
                    onClick={onClickCourse}
                    hasIconLeft
                    iconLeft={
                        <UserAvatar
                            className="rounded-small"
                            fullName={courseName}
                            size="xSmall"
                            imageUrl={courseImageUrl}
                        />
                    }
                />
            </div>

            {/* Assignment details based on status */}
            {(status === 'long-wait' || status === 'waiting-feedback') && (
                <div className="flex flex-col gap-2 items-start justify-between bg-neutral-800 p-2 rounded-small border border-neutral-700">
                    <div className="flex flex-row w-full items-center justify-between">
                        <div className="flex flex-row gap-2 items-center">
                            <IconAssignment
                                classNames="text-text-primary"
                                size="4"
                            />
                            <p className="text-md text-text-primary font-bold">
                                {assignmentTitle}
                            </p>
                        </div>
                    </div>
                    {status === 'waiting-feedback' && (
                        <Badge
                            variant="warningprimary"
                            size="small"
                            text={dictionary.waitingFeedbackBagde}
                        />
                    )}
                    {status === 'long-wait' && (
                        <Badge
                            variant="errorprimary"
                            size="small"
                            text={dictionary.longWaitBadge}
                        />
                    )}

                    <Button
                        variant="primary"
                        size="small"
                        className="w-full mt-2"
                        text={dictionary.viewAssignment}
                        onClick={onViewAssignment}
                    />
                </div>
            )}

            {/* Course completed badge */}
            <div className="flex flex-col mb-2 items-start justify-between">
                {status === 'course-completed' && completedCourseDate && (
                    <Badge
                        variant="successprimary"
                        size="small"
                        text={`${dictionary.completedCourseBadge} ${new Date(completedCourseDate).toISOString().split('T')[0]}`}
                    />
                )}
            </div>

            {/* Student details button */}
            <Button
                onClick={onStudentDetails}
                variant="secondary"
                size="medium"
                text={dictionary.studentDetailsButton}
            />
        </div>
    );
};
