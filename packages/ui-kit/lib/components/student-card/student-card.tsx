import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Badge } from '../badge';
import { IconCoachingOffer } from '../icons/icon-coaching-offer';
import { IconCourse } from '../icons/icon-course';
import { IconAssignment } from '../icons/icon-assignment';

export interface DefaultStudentCardProps extends isLocalAware {
    studentName: string;
    studentImageUrl: string;
    coachName: string;
    coachImageUrl: string;
    courseName: string;
    courseImageUrl: string;
    onStudentDetails: () => void;
    coachingSessionsLeft?: number;
    isYou: boolean;
    onClickCourse: () => void;
    onClickCoach: () => void;
}

export interface NoAssignmentStudentCardProps extends DefaultStudentCardProps {
    status: 'no-assignment';
}

export interface LongWaitStudentCardProps extends DefaultStudentCardProps {
    status: 'long-wait';
    assignmentTitle: string;
    onViewAssignment: () => void;
}

export interface WaitingFeedbackStudentCardProps
    extends DefaultStudentCardProps {
    status: 'waiting-feedback';
    assignmentTitle: string;
    onViewAssignment: () => void;
}

export interface CompletedStudentCardProps extends DefaultStudentCardProps {
    status: 'passed';
    completedCourseDate: Date;
}

export type StudentCardProps =
    | NoAssignmentStudentCardProps
    | LongWaitStudentCardProps
    | WaitingFeedbackStudentCardProps
    | CompletedStudentCardProps;

/**
 * `StudentCard` is a UI component that displays detailed information about a student,
 * including their coach, course, remaining coaching sessions, and their current course or assignment status.
 *
 * The card adapts its content dynamically based on the student's `status`:
 * - `'no-assignment'`: The student has no current assignment.
 * - `'long-wait'`: The student has an assignment pending feedback for a long time.
 * - `'waiting-feedback'`: The student is awaiting feedback on a recent assignment.
 * - `'passed'`: The student has completed the course.
 *
 * It provides interactive buttons for viewing student details, course information, coach details,
 * and the assignment (if applicable).
 *
 * @param {StudentCardProps} props - The properties used to render the component, which vary based on the student's status.
 * @param {string} props.studentName - Full name of the student.
 * @param {string} props.studentImageUrl - URL of the student's profile image.
 * @param {string} props.coachName - Name of the coach assigned to the student.
 * @param {string} props.coachImageUrl - URL of the coach's profile image.
 * @param {string} props.courseName - Name of the course the student is enrolled in.
 * @param {string} props.courseImageUrl - URL of the course image.
 * @param {boolean} props.isYou - Indicates if the current user is the student's coach.
 * @param {number} [props.coachingSessionsLeft] - Optional number of remaining coaching sessions.
 * @param {() => void} props.onStudentDetails - Callback invoked when the "view student details" button is clicked.
 * @param {() => void} props.onClickCoach - Callback triggered when clicking on the coach's name/avatar (if not you).
 * @param {() => void} props.onClickCourse - Callback triggered when clicking on the course name/avatar.
 *
 * For status-specific props:
 * @param {'no-assignment' | 'long-wait' | 'waiting-feedback' | 'passed'} props.status - Current status of the student.
 *
 * If status is `'long-wait'` or `'waiting-feedback'`:
 * @param {string} props.assignmentTitle - Title of the pending assignment.
 * @param {() => void} props.onViewAssignment - Callback invoked when clicking the "view assignment" button.
 *
 * If status is `'passed'`:
 * @param {Date} props.completedCourseDate - The date when the course was completed.
 */

export const StudentCard = (props: StudentCardProps) => {
    const dictionary = getDictionary(props.locale).components.studentCard;

    return (
        <div className="flex flex-col md:p-4 p-2 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full ">
            {/* Avatar, student name & Badge */}
            <div className="flex flex-row items-center gap-3 mb-2">
                <UserAvatar
                    fullName={props.studentName}
                    className="w-10 h-10 rounded-full flex-shrink-0"
                    imageUrl={props.studentImageUrl}
                />
                <div className="flex flex-col gap-1">
                    <h6 className="text-md text-text-primary font-important">
                        {props.studentName}
                    </h6>
                    {typeof props.coachingSessionsLeft === 'number' &&
                        props.coachingSessionsLeft > 0 && (
                            <Badge
                                className="flex items-center"
                                variant="info"
                                size="small"
                                text={`${props.coachingSessionsLeft} ${dictionary.coachingSessionsLeftText}`}
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
                {props.isYou ? (
                    <div className="flex items-center gap-1 text-sm text-text-primary font-important">
                        <UserAvatar
                            fullName={props.coachName}
                            size="small"
                            imageUrl={props.coachImageUrl}
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
                                fullName={props.coachName}
                                size="small"
                                imageUrl={props.coachImageUrl}
                            />
                        }
                        text={props.coachName}
                        onClick={props.onClickCoach}
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
                    text={props.courseName}
                    onClick={props.onClickCourse}
                    hasIconLeft
                    iconLeft={
                        <UserAvatar
                            className="rounded-small"
                            fullName={props.courseName}
                            size="xSmall"
                            imageUrl={props.courseImageUrl}
                        />
                    }
                />
            </div>

            {/* Assignment details based on status */}
            {(props.status === 'long-wait' ||
                props.status === 'waiting-feedback') && (
                    <div className="flex flex-col gap-2 items-start justify-between bg-neutral-800 p-2 rounded-small border border-neutral-700">
                        <div className="flex flex-row w-full items-center justify-between">
                            <div className="flex flex-row gap-2 items-center">
                                <IconAssignment
                                    classNames="text-text-primary"
                                    size="4"
                                />
                                <p className="text-md text-text-primary font-bold">
                                    {props.assignmentTitle}
                                </p>
                            </div>
                        </div>
                        {props.status === 'waiting-feedback' && (
                            <Badge
                                variant="warningprimary"
                                size="small"
                                text={dictionary.waitingFeedbackBadge}
                            />
                        )}
                        {props.status === 'long-wait' && (
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
                            onClick={props.onViewAssignment}
                        />
                    </div>
                )}

            {/* Course completed badge */}
            <div className="flex flex-col mb-2 items-start justify-between">
                {props.status === 'passed' &&
                    props.completedCourseDate && (
                        <Badge
                            variant="successprimary"
                            size="small"
                            text={`${dictionary.completedCourseBadge} ${new Date(props.completedCourseDate).toISOString().split('T')[0]}`}
                        />
                    )}
            </div>

            {/* Student details button */}
            <Button
                onClick={props.onStudentDetails}
                variant="secondary"
                size="medium"
                text={dictionary.studentDetailsButton}
            />
        </div>
    );
};
