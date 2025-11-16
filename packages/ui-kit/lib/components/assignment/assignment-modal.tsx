import { FC } from 'react';
import { IconButton } from '../icon-button';
import { IconClose, IconAssignment } from '../icons';
import { AssignmentHeader } from './assignment-header';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import {
    assignment,
    fileMetadata,
    role,
    shared,
} from '@maany_shr/e-class-models';
import { FilePreview } from '../drag-and-drop-uploader/file-preview';
import { LinkEdit, LinkPreview } from '../links';

export interface AssignmentModalProps
    extends Omit<assignment.TAssignmentWithId, 'replies'>,
        isLocalAware {
    role: Omit<role.TRole, 'visitor' | 'admin' | 'superadmin'>;
    linkEditIndex: number;
    children: React.ReactNode;
    onFileDownload: (id: string) => void;
    onFileDelete: (id: number, fileId: string) => void;
    onLinkDelete: (id: number, linkId: number) => void;
    onChange: (
        files: fileMetadata.TFileMetadata[],
        links: shared.TLinkWithId[],
        linkEditIndex: number,
    ) => void;
    onImageChange: (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => Promise<fileMetadata.TFileMetadata>;
    onDeleteIcon: (id: string) => void;
    onClickCourse: () => void;
    onClickUser: () => void;
    onClickGroup: () => void;
    onClose: () => void;
}

/**
 * Displays a modal dialog presenting the details and resources of a single assignment.
 *
 * The modal includes:
 *   - Modal close button (top right)
 *   - Assignment icon and label at the top
 *   - Assignment header info (title, course, module, lesson, status, student/group, etc.)
 *   - Main body: assignment description, attached files, and resource links, with support for in-place editing/deletion for roles with permissions (coach)
 *   - Divider lines between main sections
 *   - A flexible children section that can render messages, reply panels, or any React nodes after the assignment content.
 *
 * Props control all data, permissions, and handler callbacks for files, links, and navigation.
 *
 * @param role The current user's role ("coach", "student", etc.), no "visitor"/"admin"
 * @param linkEditIndex Index of the resource link currently being edited; -1 or undefined if none
 * @param title Assignment title
 * @param description Assignment description text
 * @param course Course object (used in assignment header)
 * @param module Module number or data (header)
 * @param lesson Lesson number or data (header)
 * @param status Assignment status (passed to header)
 * @param student Student user object (if this assignment is for a single student)
 * @param groupName Name of the group (if group assignment)
 * @param files Array of attached files (metadata objects)
 * @param links Array of attached resource links
 * @param onFileDownload Callback to trigger downloading a file (given file id)
 * @param onFileDelete Callback to delete/cancel a file (assignmentId, fileId, type)
 * @param onLinkDelete Callback to delete a link (assignmentId, linkId, type)
 * @param onChange Callback to update files/links or start link editing
 * @param onClickCourse Callback when course link is clicked in header
 * @param onClickUser Callback when student username is clicked in header
 * @param onClickGroup Callback when group name is clicked in header
 * @param onClose Callback to close the modal (fires from top-right close button)
 * @param onImageChange Callback to update the Link image.
 * @param onDeleteIcon Callback to delete the Link icon.
 * @param locale Locale string for I18N
 * @param children Custom React content (messages, reply panels, additional details) rendered after assignment resources
 *
 * @example
 * // Example usage: Showing assignment modal with messages and reply panel as children
 * <AssignmentModal
 *   title="Sample Assignment Modal"
 *   description="Solve these tasks to finish your homework."
 *   course={courseObj}
 *   module={1}
 *   lesson={2}
 *   role="coach"
 *   status="AwaitingReview"
 *   student={studentObj}
 *   groupName="Group A"
 *   files={[{...}]}
 *   links={[{ title: "Doc", url: "https://..." }]}
 *   linkEditIndex={-1}
 *   onFileDownload={handleFileDownload}
 *   onFileDelete={handleFileDelete}
 *   onLinkDelete={handleLinkDelete}
 *   onChange={handleChange}
 *   locale="en"
 *   onClickCourse={showCourse}
 *   onImageChange={handleImageChange}
 *   onDeleteIcon={handleDeleteIcon}
 *   onClickUser={showUser}
 *   onClickGroup={showGroup}
 *   onClose={closeModal}
 * >
 *   <div>
 *     {messages.map(msg => (
 *       <Message
 *         key={msg.replyId}
 *         reply={msg}
 *         linkEditIndex={messageLinkEditIndexes[msg.replyId] ?? null}
 *         locale="en"
 *         onFileDownload={handleMsgFileDownload}
 *         onFileDelete={handleMsgFileDelete}
 *         onLinkDelete={handleMsgLinkDelete}
 *         onChange={handleMsgChange}
 *         onImageChange={handleImageChange}
 *         onDeleteIcon={handleDeleteIcon}
 *       />
 *     ))}
 *     <ReplyPanel
 *        locale="en"
 *        role="coach"
 *        comment={replyComment}
 *        onImageChange={handleImageChange}
 *        onDeleteIcon={handleDeleteIcon}
 *        ...
 *      />
 *   </div>
 * </AssignmentModal>
 */

export const AssignmentModal: FC<AssignmentModalProps> = ({
    role,
    assignmentId,
    linkEditIndex,
    children,
    title,
    description,
    course,
    module,
    lesson,
    status,
    student,
    groupName,
    files,
    links,
    onFileDelete,
    onFileDownload,
    onLinkDelete,
    onChange,
    onClickCourse,
    onClickUser,
    onImageChange,
    onDeleteIcon,
    onClickGroup,
    onClose,
    locale,
}) => {
    const dictionary = getDictionary(locale);

    const handleSaveLink = (data: shared.TLinkWithId, index: number) => {
        const updatedLinks = [...(links as shared.TLinkWithId[])];
        updatedLinks[index] = data;
        onChange(files as fileMetadata.TFileMetadata[], updatedLinks, -1);
    };

    const handleOnClickLinkEdit = (index: number) => {
        onChange(files as fileMetadata.TFileMetadata[], links as shared.TLinkWithId[], index);
    };

    return (
        <div className="flex flex-col gap-4 p-6 bg-card-fill border-1 border-card-stroke rounded-medium shadow-md relative max-w-[800px] w-full">
            {/* Close Button */}
            <div className="absolute top-3 right-3 z-10">
                <IconButton
                    data-testid="close-modal-button"
                    styles="text"
                    icon={<IconClose />}
                    size="small"
                    onClick={onClose}
                    className="text-button-text-text"
                />
            </div>

            {/* Assignment Icon & Label */}
            <div className="flex items-center gap-2">
                <span className="p-1 bg-base-neutral-700 rounded-small">
                    <IconAssignment size="4" classNames="text-text-primary" />
                </span>
                <p className="text-sm font-bold text-text-primary leading-[150%]">
                    {
                        dictionary.components.assignment.assignmentModal
                            .assignmentText
                    }
                </p>
            </div>

            <div className="w-full h-[1px] bg-divider" />

            {/* Assignment Header */}
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
                role={role} description={''} assignmentId={0}            />

            <div className="w-full h-[1px] bg-divider" />

            {/* Body Content */}
            <div className="flex flex-col gap-4 items-start w-full">
                <p className="text-md text-text-primary leading-[150%]">
                    {description}
                </p>

                {/* Files */}
                <div className="flex flex-col gap-2 w-full">
                    {(files as fileMetadata.TFileMetadata[]).map((file, index) => (
                        <FilePreview
                            key={index}
                            uploadResponse={file}
                            locale={locale}
                            onDownload={() => onFileDownload(file.id as string)}
                            onCancel={() => onFileDelete(assignmentId as number, file.id as string)}
                            readOnly={role !== 'coach'}
                            deletion={{
                                isAllowed: true,
                                onDelete: () =>
                                    onFileDelete(assignmentId as number, file.id as string),
                            }}
                        />
                    ))}
                </div>
                {/* Links */}
                {(links as shared.TLinkWithId[]).map((link, index) =>
                    linkEditIndex === index ? (
                        <div key={index} className="flex flex-col w-full">
                            <LinkEdit
                                locale={locale}
                                initialTitle={link.title}
                                initialUrl={link.url}
                                initialCustomIcon={link.customIcon}
                                onSave={(title, url, customIcon) =>
                                    handleSaveLink(
                                        {
                                            url,
                                            title,
                                            linkId: link.linkId as number,
                                            customIcon,
                                        },
                                        index,
                                    )
                                }
                                onDiscard={() =>
                                    onLinkDelete(assignmentId as number, link.linkId as number)
                                }
                                onImageChange={(image, abortSignal) =>
                                    onImageChange(image, abortSignal)
                                }
                                onDeleteIcon={onDeleteIcon}
                            />
                        </div>
                    ) : (
                        <div key={index} className="flex flex-col w-full">
                            <LinkPreview
                                preview={role === 'coach'}
                                title={link.title as string}
                                url={link.url as string}
                                customIcon={link.customIcon}
                                onEdit={() => handleOnClickLinkEdit(index)}
                                onDelete={() =>
                                    onLinkDelete(assignmentId as number, link.linkId as number)
                                }
                            />
                        </div>
                    ),
                )}
            </div>

            <div className="w-full h-[1px] bg-divider" />

            {/* Extra Content */}
            {children}
        </div>
    );
};
