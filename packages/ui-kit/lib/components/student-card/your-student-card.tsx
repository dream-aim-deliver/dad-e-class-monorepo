import { Button } from '../button';
import { UserAvatar } from '../avatar/user-avatar';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { Badge } from '../badge';
import { IconAssignment } from '../icons/icon-assignment';

export interface DefaultCourseAssignment {
    courseName: string;
    courseImageUrl: string;
    onClickCourse: () => void;
}

export interface NoAssignmentCourse extends DefaultCourseAssignment {
    status: 'no-assignment';
}

export interface LongWaitCourseAssignment extends DefaultCourseAssignment {
    status: 'long-wait';
    assignmentTitle: string;
    onViewAssignment: () => void;
}

export interface WaitingFeedbackCourseAssignment
    extends DefaultCourseAssignment {
    status: 'waiting-feedback';
    assignmentTitle: string;
    onViewAssignment: () => void;
}

export interface CourseCompletedCourseAssignment
    extends DefaultCourseAssignment {
    status: 'passed';
    completedCourseDate: Date;
}

export type CourseAssignment =
    | NoAssignmentCourse
    | LongWaitCourseAssignment
    | WaitingFeedbackCourseAssignment
    | CourseCompletedCourseAssignment;

export interface YourStudentCardProps extends isLocalAware {
    studentName: string;
    studentImageUrl: string;
    coachingSessionsLeft?: number;
    onStudentDetails: () => void;
    courses: CourseAssignment[];
}

/**
 * `YourStudentCard` displays a student's profile with their assigned courses and related assignments.
 *
 * It shows the student's avatar, name, number of coaching sessions left (if any), and a list of their courses.
 * Each course can have different statuses which affect how the assignment information is presented:
 * - 'no-assignment': course without any current assignment.
 * - 'long-wait': assignment is pending for a long time, shows an alert badge and a button to view assignment.
 * - 'waiting-feedback': assignment submitted and waiting for feedback, shows a warning badge and view button.
 * - 'passed': course is finished, shows completion date badge.
 *
 * Courses are sorted by status priority: long-wait, waiting-feedback, no-assignment, passed.
 *
 * ### Props
 * @param {string} studentName - Full name of the student.
 * @param {string} studentImageUrl - URL to the student's avatar image.
 * @param {number} [coachingSessionsLeft] - Optional count of remaining coaching sessions.
 * @param {() => void} onStudentDetails - Callback fired when clicking the button to view student details.
 * @param {CourseAssignment[]} courses - Array of course assignments with various statuses and details.
 * @param {string} locale - Locale string used for translations.
 *
 * @returns {JSX.Element} A styled card component displaying student and course information.
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
            'no-assignment': 3,
            'passed': 4,
        };
        return priority[a.status] - priority[b.status];
    });

    return (
        <div className="flex flex-col md:p-4 p-2 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full">
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
                        {course.status === 'passed' &&
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
                                    text={dictionary.waitingFeedbackBadge}
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
