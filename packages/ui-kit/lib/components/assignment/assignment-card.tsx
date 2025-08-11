import { FC } from "react";
import { Button } from "../button";
import { assignment, fileMetadata, role, shared } from '@maany_shr/e-class-models';
import { AssignmentHeader } from "./assignment-header";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { Message } from "./message";
import { cn } from "../../utils/style-utils";
import { FilePreview } from "../drag-and-drop-uploader/file-preview";
import { LinkEdit, LinkPreview } from "../links";

export interface AssignmentCardProps extends assignment.TAssignmentWithId, isLocalAware {
    role: Omit<role.TRole, 'visitor' | 'admin'>;
    onFileDownload: (id: string) => void;
    onFileDelete: (assignmentId: number, fileId: string) => void;
    onLinkDelete: (assignmentId: number, linkId: number) => void;
    onReplyFileDelete: (replyId: number, fileId: string) => void;
    onReplyLinkDelete: (replyId: number, linkId: number) => void;
    linkEditIndex: number;
    onImageChange: (fileRequest: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onDeleteIcon: (id: string) => void;
    onChange: (files: fileMetadata.TFileMetadata[], links: shared.TLinkWithId[], linkEditIndex: number) => void;
    replyLinkEditIndex: number;
    onReplyImageChange: (fileRequest: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onReplyDeleteIcon: (id: string) => void;
    onReplyChange: (files: fileMetadata.TFileMetadata[], links: shared.TLinkWithId[], replyLinkEditIndex: number) => void;
    onClickCourse: () => void;
    onClickUser: () => void;
    onClickGroup: () => void;
    onClickView: () => void;
};

/**
 * Renders an interactive assignment card, displaying assignment details, attached files, resource links,
 * and the most recent assignment reply in a structured card format.
 * 
 * The card includes:
 *   - Assignment header (title, course/module/lesson info, status, student or group info)
 *   - Description/comment
 *   - List of attached files and resource links with support for in-place editing/deletion (for coaches)
 *   - The latest reply in the assignment conversation (if present), using the Message component
 *   - "View" button to trigger details or navigation
 * 
 * This is a presentational component; all state and callback handlers for files/links/replies are managed via props.
 * Styling changes subtly depending on whether there are student replies or not.
 *
 * @param role The current user's role for this card ("coach", "student", not "admin"/"visitor")
 * @param title Assignment title
 * @param description Assignment description/comment
 * @param files Array of attached file metadatas for the assignment
 * @param links Array of resource link objects for the assignment
 * @param course Assignment's parent course data (for display in header)
 * @param module Module of the assignment (header)
 * @param lesson Lesson of the assignment (header)
 * @param status Current assignment status (header)
 * @param replies Array of conversation/reply messages for this assignment
 * @param student Student user object if this assignment is for a single student
 * @param groupName Name of the group if it's a group assignment
 * @param linkEditIndex Index of the resource link currently in "edit" mode; -1 if none
 * @param onFileDownload Callback to download a file (from card resource list)
 * @param onFileDelete Callback to delete or cancel a file upload (from resource list)
 * @param onLinkDelete Callback to delete a resource link (from card resource list)
 * @param onReplyFileDelete Callback to delete a file from a reply
 * @param onReplyLinkDelete Callback to delete a link from a reply
 * @param onReplyChange Callback to update files/links in a reply
 * @param onChange Callback to update assignment files/links or to open a link for editing
 * @param onClickCourse Callback to view the course (triggers when user clicks course in header)
 * @param onClickUser Callback to view the student (in header) 
 * @param onClickGroup Callback to view the group (in header)
 * @param onClickView Callback for the "View" button at the bottom of the card
 * @param onImageChange Callback to update the Link image.
 * @param onDeleteIcon Callback to delete the Link icon.
 * @param locale Locale string for i18n/localization (passed to child components too)
 *
 * @example
 * <AssignmentCard
 *   role="coach"
 *   title="Homework - Algebra"
 *   description="Please review the problems and submit your solutions."
 *   files={[{ ... }]}
 *   links={[{ title: 'Reference doc', url: 'https://...' }]}
 *   course={courseObj}
 *   module={moduleObj}
 *   lesson={lessonObj}
 *   status="pending"
 *   replies={[ ]}
 *   student={userObj}
 *   groupName={null}
 *   onFileDownload={handleFileDownload}
 *   onFileDelete={handleFileDelete}
 *   onLinkDelete={handleLinkDelete}
 *   onReplyFileDelete={handleReplyFileDelete}
 *   onReplyLinkDelete={handleReplyLinkDelete}
 *   onClickCourse={goToCourse}
 *   linkEditIndex={-1}
 *   onImageChange={handleImageChange}
 *   onDeleteIcon={handleDeleteIcon}
 *   onChange={handleAssignmentChange}
 *   replyLinkEditIndex={-1}
 *   onReplyImageChange={handleReplyImageChange}
 *   onReplyDeleteIcon={handleReplyDeleteIcon}
 *   onReplyChange={handleReplyChange}
 *   onClickUser={goToUser}
 *   onClickGroup={goToGroup}
 *   onClickView={goToAssignment}
 *   locale="en"
 * />
 */

export const AssignmentCard: FC<AssignmentCardProps> = ({
    role,
    assignmentId,
    title,
    description,
    files,
    links,
    course,
    module,
    lesson,
    status,
    replies,
    student,
    groupName,
    onFileDelete,
    onFileDownload,
    onLinkDelete,
    onReplyFileDelete,
    onReplyLinkDelete,
    linkEditIndex,
    onImageChange,
    onDeleteIcon,
    onChange,
    replyLinkEditIndex,
    onReplyImageChange,
    onReplyDeleteIcon,
    onReplyChange,
    onClickCourse,
    onClickUser,
    onClickGroup,
    onClickView,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    const getLatestReply = (replies: assignment.TAssignmentReplyWithId[]) => {
        if (replies.length === 0) return undefined;
        return replies.reduce((latest, current) =>
            new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest
        );
    };

    const handleSaveLink = (data: shared.TLinkWithId, index: number) => {
        const updatedLinks = [...links];
        updatedLinks[index] = data;
        onChange(files, updatedLinks, null);
    };

    const handleOnClickLinkEdit = (index: number) => {
        onChange(files, links, index);
    };

    return (
        <div
            className={cn(
                "flex flex-col p-4 bg-card-fill border-1 border-card-stroke rounded-medium",
                replies.length > 0 ? 'gap-2' : 'gap-4'
            )}>
            <AssignmentHeader
                title={title}
                course={course}
                module={module}
                lesson={lesson}
                status={status}
                student={student}
                groupName={groupName}
                onClickCourse={onClickCourse}
                onClickUser={onClickUser}
                onClickGroup={onClickGroup}
                locale={locale}
                role={role}
            />
            {replies.length > 0 ? (
                // Show latest reply if there are replies
                (() => {
                    const latestReply = getLatestReply(replies);
                    return latestReply ? (
                        <div className="flex flex-col gap-2">
                            <h6 className="text-md text-text-primary font-bold leading-[120%]">
                                {dictionary.components.assignment.assignmentCard.lastActivityText}
                            </h6>
                            <Message
                                reply={latestReply}
                                linkEditIndex={replyLinkEditIndex}
                                onFileDownload={onFileDownload}
                                onFileDelete={onReplyFileDelete}
                                onLinkDelete={onReplyLinkDelete}
                                onImageChange={onReplyImageChange}
                                onDeleteIcon={onReplyDeleteIcon}
                                onChange={onReplyChange}
                                locale={locale}
                            />
                        </div>
                    ) : null;
                })()
            ) : (
                // Show assignment content (description, files, links) if no replies
                (!!description || files.length > 0 || links.length > 0) && (
                    <div className="flex flex-col gap-4 items-start w-full">
                        <p className="text-md text-text-primary leading-[150%]">
                            {description}
                        </p>
                        <div className="flex flex-col gap-2 w-full">
                            {files.map((file, index) => (
                                <FilePreview
                                    key={index}
                                    uploadResponse={file}
                                    locale={locale}
                                    onDelete={() => onFileDelete(assignmentId, file.id)}
                                    onDownload={() => onFileDownload(file.id)}
                                    onCancel={() => onFileDelete(assignmentId, file.id)}
                                    readOnly={role !== 'coach'}
                                />
                            ))}
                            {links.map((link, index) =>
                                linkEditIndex === index ? (
                                    <div className="flex flex-col w-full" key={index}>
                                        <LinkEdit
                                            locale={locale}
                                            initialTitle={link.title}
                                            initialUrl={link.url}
                                            initialCustomIcon={link.customIcon}
                                            onSave={(title, url, customIcon) => handleSaveLink({ title, url, customIcon }, index)}
                                            onDiscard={() => onLinkDelete(assignmentId, link.linkId)}
                                            onImageChange={(image, abortSignal) => onImageChange(image, abortSignal)}
                                            onDeleteIcon={onDeleteIcon}
                                        />
                                    </div>
                                ) : (
                                    <div className="flex flex-col w-full" key={index}>
                                        <LinkPreview
                                            preview={role === 'coach'}
                                            title={link.title}
                                            url={link.url}
                                            customIcon={link.customIcon}
                                            onEdit={() => handleOnClickLinkEdit(index)}
                                            onDelete={() => onLinkDelete(assignmentId, link.linkId)}
                                        />
                                    </div>
                                )
                            )}
                        </div>
                    </div>
                )
            )}
            <Button
                variant="secondary"
                size="medium"
                text={dictionary.components.assignment.assignmentCard.viewText}
                onClick={onClickView}
            />
        </div>
    );
};