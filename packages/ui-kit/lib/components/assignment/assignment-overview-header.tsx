import { FC } from "react";
import { Badge } from "../badge";
import { Button } from "../button";
import { UserAvatar } from "../avatar/user-avatar";
import { IconGroup } from "../icons/icon-group";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";

/**
 * Base properties shared by all assignment overview header variants.
 * Contains core assignment metadata, status information, and navigation callbacks.
 */
export interface AssignmentOverviewHeaderBaseProps extends isLocalAware {
    module: number;
    lesson: number;
    title: string;
    status: "waiting-feedback" | "long-wait" | "passed" | null;
    course: {
        imageUrl: string | null;
        title: string;
        id: number;
        slug: string;
    };
    groupName?: string | null;
    onClickCourse: () => void;
    onClickGroup?: () => void;
}

/**
 * Props for student view of the assignment overview header.
 * Does not include student-specific information as it's for the student's own view.
 */
export interface AssignmentOverviewStudentHeaderProps extends AssignmentOverviewHeaderBaseProps {
    role: 'student';
}

/**
 * Props for coach view of the assignment overview header.
 * Includes student information and callback to navigate to student profile.
 */
export interface AssignmentOverviewCoachHeaderProps extends AssignmentOverviewHeaderBaseProps {
    role: 'coach';
    student: {
        name: string;
        surname: string;
        id: number;
        username: string;
        avatarUrl?: string | null | undefined;
    };
    onClickUser: () => void;
};

/**
 * Union type combining all possible assignment overview header variants.
 * Discriminated by the 'role' field to ensure type safety.
 */
export type AssignmentOverviewHeaderProps = AssignmentOverviewStudentHeaderProps | AssignmentOverviewCoachHeaderProps;

/**
 * Renders the header section of an assignment overview card with role-based content.
 * 
 * This component displays the key metadata and navigation elements for an assignment:
 *   - Module and lesson numbers
 *   - Assignment title
 *   - Status badge (waiting-feedback, long-wait, or course-completed)
 *   - Course information with clickable navigation
 *   - Student information (coach view only)
 *   - Group information (when applicable)
 * 
 * Status badges are color-coded:
 *   - "waiting-feedback": Warning (yellow/orange) badge
 *   - "long-wait": Error (red) badge indicating overdue or delayed feedback
 *   - "passed": Success (green) badge indicating assignment passed
 * 
 * Navigation elements:
 *   - Course: Displays course avatar and title, clickable to view course details
 *   - Student: (Coach only) Displays student avatar and name, clickable to view profile
 *   - Group: Displays group icon and name, clickable to view group details
 * 
 * All clickable elements are implemented as text buttons with icons and proper truncation
 * for long names, ensuring responsive behavior across different screen sizes.
 * 
 * This is a presentational component with all interactions handled via callbacks.
 * Uses discriminated unions to ensure type safety between student and coach views.
 * 
 * @param role The current user's role ("coach" or "student")
 * @param module Module number for the assignment
 * @param lesson Lesson number for the assignment
 * @param title Assignment title
 * @param status Current assignment status (determines badge appearance)
 * @param course Course information object with id, title, slug, and optional image URL
 * @param groupName Optional name of the associated group
 * @param student Student information object (coach role only) with name, surname, username, id, and optional avatar
 * @param onClickCourse Callback when course button is clicked
 * @param onClickGroup Optional callback when group button is clicked
 * @param onClickUser Callback when student button is clicked (coach role only)
 * @param locale Locale string for i18n/localization
 * 
 * @example
 * // Coach view with all elements
 * <AssignmentOverviewHeader
 *   role="coach"
 *   module={2}
 *   lesson={5}
 *   title="Algebra Problem Set"
 *   status="waiting-feedback"
 *   course={{
 *     id: 1,
 *     title: "Mathematics 101",
 *     slug: "math-101",
 *     imageUrl: "https://example.com/course-image.jpg"
 *   }}
 *   groupName="Advanced Group"
 *   student={{
 *     id: 42,
 *     name: "John",
 *     surname: "Doe",
 *     username: "johndoe",
 *     avatarUrl: "https://example.com/avatar.jpg"
 *   }}
 *   onClickCourse={() => navigate('/courses/1')}
 *   onClickGroup={() => navigate('/groups/5')}
 *   onClickUser={() => navigate('/students/42')}
 *   locale="en"
 * />
 * 
 * @example
 * // Student view with long-wait status
 * <AssignmentOverviewHeader
 *   role="student"
 *   module={1}
 *   lesson={3}
 *   title="Introduction to Programming"
 *   status="long-wait"
 *   course={{
 *     id: 10,
 *     title: "Computer Science Fundamentals",
 *     slug: "cs-fundamentals",
 *     imageUrl: null
 *   }}
 *   groupName="Beginners"
 *   onClickCourse={() => navigate('/courses/10')}
 *   onClickGroup={() => navigate('/groups/3')}
 *   locale="en"
 * />
 */

export const AssignmentOverviewHeader: FC<AssignmentOverviewHeaderProps> = (props) => {
    const dictionary = getDictionary(props.locale);

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2">
                <p className="text-sm text-text-secondary font-bold leading-[100%]">
                    {dictionary.components.assignment.assignmentCard.moduleText} {props.module}, {dictionary.components.assignment.assignmentCard.lessonText} {props.lesson}
                </p>
                <h4 className="text-xl text-text-primary font-bold leading-[120%]">
                    {props.title}
                </h4>
            </div>
            {props.status === 'waiting-feedback' && (
                <Badge
                    text={dictionary.components.assignment.assignmentCard.awaitingReviewText}
                    variant="warningprimary"
                    size="medium"
                    className="w-fit"
                />
            )}
            {props.status === 'passed' && (
                <Badge
                    text={dictionary.components.assignment.assignmentCard.passedText}
                    variant="successprimary"
                    size="medium"
                    className="w-fit"
                />
            )}
            {props.status === 'long-wait' && (
                <Badge
                    text={dictionary.components.assignment.assignmentCard.longWaitText}
                    variant="errorprimary"
                    size="medium"
                    className="w-fit"
                />
            )}
            <div className="flex flex-wrap gap-x-6 items-center">
                {props.course && (
                    <div className="flex gap-[13px] items-center w-full">
                        <p className="text-sm text-text-secondary leading-[100%]">
                            {dictionary.components.assignment.assignmentCard.courseText}:
                        </p>
                        <Button
                            size="small"
                            variant="text"
                            className="p-0 gap-1 text-sm truncate"
                            text={props.course.title}
                            onClick={props.onClickCourse}
                            title={props.course.title}
                        />
                    </div>
                )}
                {props.role === 'coach' && (
                    <div className="flex gap-[13px] items-center w-full">
                        <p className="text-sm text-text-secondary leading-[100%]">
                            {dictionary.components.assignment.assignmentCard.studentText}:
                        </p>
                        <Button
                            size="small"
                            variant="text"
                            className="p-0 gap-1 text-sm truncate"
                            text={props.student.username}
                            onClick={props.onClickUser}
                            title={`${props.student.name} ${props.student.surname} (${props.student.username})`}
                            hasIconLeft
                            iconLeft={
                                <UserAvatar
                                    size="xSmall"
                                    imageUrl={props.student.avatarUrl || undefined}
                                    fullName={`${props.student.name} ${props.student.surname}`}
                                />
                            }
                        />
                    </div>
                )}
                {props.groupName && (
                    <div className="flex items-center gap-1 w-full">
                        <div className="flex items-center gap-1 text-sm text-text-secondary">
                            <IconGroup size="4" data-testid="briefcase-icon" />
                            <p className="text-sm text-text-secondary">{dictionary.components.assignment.assignmentCard.groupText}</p>
                        </div>
                        <Button
                            size="small"
                            variant="text"
                            className="p-0 max-w-full truncate"
                            title={props.groupName}
                            text={props.groupName}
                            onClick={props.onClickGroup}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};