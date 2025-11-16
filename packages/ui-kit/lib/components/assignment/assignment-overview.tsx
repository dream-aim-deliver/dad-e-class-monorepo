import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { AssignmentOverviewHeader } from "./assignment-overview-header";
import { MessageCard } from "./message-card";
import { Button } from "../button";
import { AssignmentDescription } from "./assignment-description";

/**
 * Base properties shared by all assignment overview variants.
 * Contains core assignment metadata and navigation callbacks.
 */
export interface AssignmentOverviewBaseProps extends isLocalAware {
    id: string;
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
    groupId: number | null;
    groupName?: string | null;
    onClickCourse: () => void;
    onClickGroup?: () => void;
    onClickView: () => void;
    onFileDownload: (url: string, name: string) => void;
};

/**
 * Props for student view when no reply has been made yet.
 * Displays the original assignment description, files, and links.
 */
export interface AssignmentOverviewStudentNoReplyProps extends AssignmentOverviewBaseProps {
    role: 'student';
    isReplied: false;
    description: string;
    links: {
        title: string;
        url: string;
        iconFile?: {
            name: string;
            id: string;
            size: number;
            category: "image";
            downloadUrl: string;
        } | null | undefined;
    }[];
    files: {
        name: string;
        thumbnailUrl: string | null;
        id: string;
        size: number;
        category: "video" | "image" | "generic" | "document";
        downloadUrl: string;
    }[];
};

/**
 * Props for student view when a reply has been made.
 * Displays the latest reply instead of the original assignment content.
 */
export interface AssignmentOverviewStudentWithReplyProps extends AssignmentOverviewBaseProps {
    role: 'student';
    isReplied: true;
    lastReply?: {
        links: {
            title: string;
            url: string;
            iconFile?: {
                name: string;
                id: string;
                size: number;
                category: "image";
                downloadUrl: string;
            } | null | undefined;
        }[];
        sender: {
            id: number;
            username: string;
            role: string;
            name?: string | null | undefined;
            surname?: string | null | undefined;
            avatarUrl?: string | null | undefined;
            isCurrentUser: boolean;
        };
        comment: string;
        files: {
            name: string;
            thumbnailUrl: string | null;
            id: string;
            size: number;
            category: "video" | "image" | "generic" | "document";
            downloadUrl: string;
        }[];
        sentAt: number;
        replyType: "reply";
    } | {
        sender: {
            id: number;
            username: string;
            role: string;
            name?: string | null | undefined;
            surname?: string | null | undefined;
            avatarUrl?: string | null | undefined;
            isCurrentUser: boolean;
        };
        replyType: "passed";
        passedAt: number;
    } | null | undefined;
};

/**
 * Props for coach view of an assignment.
 * Displays student information and the latest reply if available.
 */
export interface AssignmentOverviewCoachProps extends AssignmentOverviewBaseProps {
    role: 'coach';
    student: {
        name: string;
        surname: string;
        id: number;
        username: string;
        avatarUrl?: string | null | undefined;
    };
    lastReply?: {
        links: {
            title: string;
            url: string;
            iconFile?: {
                name: string;
                id: string;
                size: number;
                category: "image";
                downloadUrl: string;
            } | null | undefined;
        }[];
        sender: {
            id: number;
            username: string;
            role: string;
            name?: string | null | undefined;
            surname?: string | null | undefined;
            avatarUrl?: string | null | undefined;
            isCurrentUser: boolean;
        };
        comment: string;
        files: {
            name: string;
            thumbnailUrl: string | null;
            id: string;
            size: number;
            category: "video" | "image" | "generic" | "document";
            downloadUrl: string;
        }[];
        sentAt: number;
        replyType: "reply";
    } | {
        sender: {
            id: number;
            username: string;
            role: string;
            name?: string | null | undefined;
            surname?: string | null | undefined;
            avatarUrl?: string | null | undefined;
            isCurrentUser: boolean;
        };
        replyType: "passed";
        passedAt: number;
    } | null | undefined;
    onClickUser: () => void;
};

/**
 * Union type combining all possible assignment overview variants.
 * Discriminated by the 'role' field and conditional properties.
 */
export type AssignmentOverviewProps = AssignmentOverviewStudentNoReplyProps | AssignmentOverviewStudentWithReplyProps | AssignmentOverviewCoachProps;

/**
 * Renders an assignment overview card with role-based content display.
 * 
 * This component adapts its display based on the user's role and the assignment state:
 *   - For coaches: Shows student information and the latest reply (if any)
 *   - For students with no reply: Shows the original assignment description, files, and links
 *   - For students with a reply: Shows the latest reply in the conversation
 * 
 * The card includes:
 *   - Assignment header with course/module/lesson info, status, and role-specific metadata
 *   - Conditional content area (original assignment or latest reply)
 *   - "View" button to navigate to full assignment details
 * 
 * This is a presentational component with all state management and interactions handled via props.
 * Uses discriminated unions to ensure type safety across different role and state combinations.
 * 
 * @param role The current user's role ("coach" or "student")
 * @param id Assignment ID
 * @param module Module number
 * @param lesson Lesson number
 * @param title Assignment title
 * @param status Current assignment status ("waiting-feedback", "long-wait", "passed", or null)
 * @param course Course information object with id, title, slug, and image
 * @param groupId ID of the associated group
 * @param groupName Name of the group (optional)
 * @param isReplied Whether the student has replied (student role only)
 * @param description Original assignment description (student with no reply only)
 * @param files Array of file attachments (student with no reply only)
 * @param links Array of resource links (student with no reply only)
 * @param student Student information object (coach role only)
 * @param lastReply Latest reply object with sender info, comment, files, and links
 * @param onClickCourse Callback when course is clicked in header
 * @param onClickGroup Callback when group is clicked in header
 * @param onClickUser Callback when student is clicked in header (coach only)
 * @param onClickView Callback for the "View" button at the bottom
 * @param onFileDownload Callback to download a file by its download URL
 * @param locale Locale string for i18n/localization
 * 
 * @example
 * // Coach view with a reply
 * <AssignmentOverview
 *   role="coach"
 *   id={123}
 *   module={1}
 *   lesson={3}
 *   title="Introduction Exercise"
 *   status="waiting-feedback"
 *   course={{ id: 1, title: "Math 101", slug: "math-101", imageUrl: "..." }}
 *   groupId={5}
 *   groupName="Group A"
 *   student={{ id: 42, name: "John", surname: "Doe", username: "johndoe", avatarUrl: "..." }}
 *   lastReply={{ sender: {...}, comment: "Here's my work", files: [...], links: [...], sentAt: 1234567890, replyType: "reply" }}
 *   onClickCourse={handleCourseClick}
 *   onClickGroup={handleGroupClick}
 *   onClickUser={handleUserClick}
 *   onClickView={handleViewClick}
 *   onFileDownload={handleFileDownload}
 *   locale="en"
 * />
 * 
 * @example
 * // Student view without reply
 * <AssignmentOverview
 *   role="student"
 *   isReplied={false}
 *   id={123}
 *   module={1}
 *   lesson={3}
 *   title="Introduction Exercise"
 *   status="waiting-feedback"
 *   course={{ id: 1, title: "Math 101", slug: "math-101", imageUrl: "..." }}
 *   groupId={5}
 *   description="Complete the following exercises..."
 *   files={[{ id: "1", name: "worksheet.pdf", ... }]}
 *   links={[{ title: "Reference Material", url: "https://..." }]}
 *   onClickCourse={handleCourseClick}
 *   onClickGroup={handleGroupClick}
 *   onClickView={handleViewClick}
 *   onFileDownload={handleFileDownload}
 *   locale="en"
 * />
 */

export const AssignmentOverview: React.FC<AssignmentOverviewProps> = (props) => {
    const dictionary = getDictionary(props.locale);
    return (
        <div className="flex flex-col gap-2 p-4 bg-card-fill border-1 border-card-strok rounded-medium h-fit">
            {props.role === 'coach' ? (
                <AssignmentOverviewHeader
                    locale={props.locale}
                    module={props.module}
                    lesson={props.lesson}
                    title={props.title}
                    status={props.status}
                    course={props.course}
                    groupName={props.groupName}
                    onClickCourse={props.onClickCourse}
                    onClickGroup={props.onClickGroup}
                    role="coach"
                    student={props.student}
                    onClickUser={props.onClickUser}
                />
            ) : (
                <AssignmentOverviewHeader
                    locale={props.locale}
                    module={props.module}
                    lesson={props.lesson}
                    title={props.title}
                    status={props.status}
                    course={props.course}
                    groupName={props.groupName}
                    onClickCourse={props.onClickCourse}
                    onClickGroup={props.onClickGroup}
                    role="student"
                />
            )}

            {props.role === 'coach' && props.lastReply && (
                <MessageCard
                    locale={props.locale}
                    reply={props.lastReply}
                    onFileDownload={props.onFileDownload}
                />
            )}

            {props.role === 'student' && props.isReplied && props.lastReply && (
                <MessageCard
                    locale={props.locale}
                    reply={props.lastReply}
                    onFileDownload={props.onFileDownload}
                />
            )}

            {props.role === 'student' && !props.isReplied && (
                <AssignmentDescription
                    locale={props.locale}
                    description={props.description}
                    links={props.links}
                    files={props.files}
                    onFileDownload={props.onFileDownload}
                />
            )}

            <Button
                variant="secondary"
                size="medium"
                text={dictionary.components.assignment.assignmentCard.viewText}
                onClick={props.onClickView}
            />
        </div>
    );
};