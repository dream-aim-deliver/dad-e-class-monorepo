import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Badge } from '../badge';
import { IconAssignment } from '../icons/icon-assignment';

export interface CourseAssignment {
    courseName: string;
    courseImageUrl: string;
    assignmentTitle?: string;
    status: 'default' | 'long-wait' | 'waiting-feedback' | 'course-completed';
    completedCourseDate?: Date;
    onClickCourse: () => void;
    onViewAssignment?: () => void;
}

export interface YourStudentCardProps extends isLocalAware {
    studentName: string;
    studentImageUrl: string;
    coachingSessionsLeft?: number;
    onStudentDetails: () => void;
    courses: CourseAssignment[];
}

/**
 * `YourStudentCard` displays a student's avatar, name, coaching sessions left, and a list of their courses with assignment statuses.
 *
 * This component helps visualize a student's academic progress in a compact card layout. It supports localization, badge indicators,
 * and status-based UI elements for courses and assignments.
 *
 * ### Props
 * @param {YourStudentCardProps} props - The props for `YourStudentCard`.
 * @param {string} props.studentName - The full name of the student.
 * @param {string} props.studentImageUrl - URL for the student's avatar image.
 * @param {number} [props.coachingSessionsLeft] - Optional number of remaining coaching sessions.
 * @param {() => void} props.onStudentDetails - Callback triggered when the "Student Details" button is clicked.
 * @param {CourseAssignment[]} props.courses - Array of courses associated with the student, with status and assignment details.
 * @param {string} props.locale - The locale string used for translation (from `isLocalAware`).
 *
 * ### CourseAssignment
 * Each course includes:
 * - `courseName` (string): Name of the course.
 * - `courseImageUrl` (string): Avatar or icon image URL for the course.
 * - `assignmentTitle?` (string): Title of the current assignment (optional).
 * - `status` ('default' | 'long-wait' | 'waiting-feedback' | 'course-completed'): The current status of the course.
 * - `completedCourseDate?` (Date): Date when the course was completed (used if status is `course-completed`).
 * - `onClickCourse` (() => void): Callback triggered when the course name is clicked.
 * - `onViewAssignment?` (() => void): Optional callback for viewing the assignment, triggered from the "View Assignment" button.
 *
 * ### Behavior
 * - Courses are sorted by priority of status.
 * - Renders badges based on course and assignment status.
 * - Displays a button for viewing student details.
 *
 * @returns {JSX.Element} A student card component showing avatar, sessions left, course list, and action buttons.
 */

export const YourStudentCard = ({
    studentName,
    studentImageUrl,
    coachingSessionsLeft,
    onStudentDetails,
    courses,
    locale,
}: YourStudentCardProps) => {
    const dictionary = getDictionary(locale).components.studentCard;

    const sortedCourses = [...courses].sort((a, b) => {
        const priority = {
            'long-wait': 1,
            'waiting-feedback': 2,
            default: 3,
            'course-completed': 4,
        };
        return priority[a.status] - priority[b.status];
    });

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

            {/* Course & Assignment */}
            {sortedCourses.map((course, index) => (
                <div key={index} className="pb-2 mb-1 border-b border-divider">
                    <div className="flex flex-row items-center justify-between mb-1 w-full">
                        <Button
                            size="small"
                            variant="text"
                            className="p-0 text-sm truncate"
                            text={course.courseName}
                            onClick={course.onClickCourse}
                            hasIconLeft
                            iconLeft={
                                <UserAvatar
                                    className="rounded-small"
                                    fullName={course.courseName}
                                    size="xSmall"
                                    imageUrl={course.courseImageUrl}
                                />
                            }
                        />
                        {/* Course completed badge */}
                        {course.status === 'course-completed' &&
                            course.completedCourseDate && (
                                <Badge
                                    variant="successprimary"
                                    size="small"
                                    text={`${dictionary.completedOnBadge} ${course.completedCourseDate.toISOString().split('T')[0]}`}
                                />
                            )}
                    </div>

                    {/* Assignment details based on status */}
                    {(course.status === 'long-wait' ||
                        course.status === 'waiting-feedback') && (
                        <div className="flex flex-col gap-2 items-start justify-between bg-neutral-800 p-2 rounded-small border border-neutral-700">
                            <div className="flex flex-row w-full items-center justify-between">
                                <div className="flex gap-2 items-start">
                                    <IconAssignment
                                        classNames="text-text-primary flex-shrink-0"
                                        size="4"
                                    />
                                    <p className="text-sm text-text-primary font-important break-words leading-snug">
                                        {course.assignmentTitle}
                                    </p>
                                </div>
                            </div>
                            {course.status === 'waiting-feedback' && (
                                <Badge
                                    variant="warningprimary"
                                    size="small"
                                    text={dictionary.waitingFeedbackBagde}
                                />
                            )}
                            {course.status === 'long-wait' && (
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
                                onClick={course.onViewAssignment}
                            />
                        </div>
                    )}
                </div>
            ))}

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
