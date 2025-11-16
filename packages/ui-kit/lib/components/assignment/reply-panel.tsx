import { FC } from "react";
import { Button } from "../button";
import { IconCoachingSession } from "../icons/icon-coaching-session";
import Tooltip from "../tooltip";
import { TextAreaInput } from "../text-areaInput";
import { IconAssignmentPassed } from "../icons/icon-assignment-passed";
import { assignment, fileMetadata, role, shared } from '@maany_shr/e-class-models';
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { Uploader } from "../drag-and-drop-uploader/uploader";
import { LinkEdit, LinkPreview } from "../links";
import { IconPlus } from "../icons/icon-plus";
import Banner from "../banner";

export interface ReplyPanelProps extends isLocalAware {
    role: Omit<role.TRole, 'visitor' | 'admin' | 'superadmin'>;
    comment: string;
    linkEditIndex: number | null;
    files: fileMetadata.TFileMetadata[];
    links: shared.TLinkWithId[];
    onChangeComment: (comment: string) => void;
    onFileDownload: (id: string) => void;
    onFileDelete: (fileId: string) => void;
    onLinkDelete: (index: number) => void;
    onLinkDiscard: (index: number) => void;
    onFilesChange: (file: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onImageChange: (fileRequest: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<fileMetadata.TFileMetadata>;
    onDeleteIcon: (index: number) => void;
    onUploadComplete: (file: fileMetadata.TFileMetadata) => void;
    onCreateLink: (data: shared.TLinkWithId, index: number) => void;
    onClickEditLink: (index: number) => void;
    onClickAddLink: () => void;
    onClickSendMessage: () => void;
    onClickMarkAsPassed: () => void;
    isSending?: boolean;
    showSuccessBanner?: boolean;
    onCloseSuccessBanner?: () => void;
};

/**
 * Renders a reply panel interface for submitting assignment-related messages, 
 * such as text comments, attached files, or resource links. 
 * Includes file upload capability, inline link editing, and optional marking as "Passed" by coaches.
 *
 * This is a presentational and interactive component that delegates all business logic (file handling, link creation, etc.)
 * to its parent component via callbacks.
 *
 * @param role The role of the current user (only 'student' or 'coach' allowed). Coaches can mark assignments as passed.
 * @param comment The current text input in the reply comment box.
 * @param files The list of uploaded files in the reply.
 * @param links The list of resource links in the reply.
 * @param linkEditIndex The index of the link currently being edited, if any.
 * @param sender The reply sender object including user metadata.
 * @param onChangeComment Callback to update the comment text value.
 * @param onFileDownload Callback to trigger downloading of a file.
 * @param onFileDelete Callback to delete a file from the list.
 * @param onLinkDelete Callback to delete a resource link.
 * @param onFilesChange Callback when a new file is selected for upload.
 * @param onUploadComplete Callback triggered after a file is successfully uploaded.
 * @param onCreateLink Callback to save a newly created or edited link.
 * @param onClickEditLink Callback when the user clicks to edit a specific link.
 * @param onImageChange Callback to update the Link image.
 * @param onDeleteIcon Callback to delete the Link icon.
 * @param onClickAddLink Callback when the user clicks the "Add Link" button.
 * @param onClickSendMessage Callback when the user sends a reply (text, resources, or passed).
 * @param locale The locale string used for internationalization/localized text.
 *
 * @example
 * <ReplyPanel
 *   role="coach"
 *   comment="Here are some resources"
 *   files={[...]}
 *   links={[...]}
 *   sender={{ name: 'Coach John', isCurrentUser: true, image: '...' }}
 *   onChangeComment={handleChangeComment}
 *   onFileDownload={handleDownload}
 *   onFileDelete={handleDelete}
 *   onLinkDelete={handleLinkDelete}
 *   onFilesChange={handleFilesChange}
 *   onUploadComplete={handleUploadComplete}
 *   onCreateLink={handleCreateLink}
 *   onClickEditLink={handleEditLink}
 *   onImageChange={handleImageChange}
 *   onClickAddLink={handleAddLink}
 *   onClickSendMessage={handleSend}
 *   onDeleteIcon={handleDeleteIcon}
 *   locale="en"
 * />
 */


export const ReplyPanel: FC<ReplyPanelProps> = ({
    role,
    comment,
    files,
    links,
    linkEditIndex,
    onChangeComment,
    onFileDownload,
    onFileDelete,
    onLinkDelete,
    onFilesChange,
    onUploadComplete,
    onCreateLink,
    onClickEditLink,
    onClickAddLink,
    onImageChange,
    onDeleteIcon,
    onClickSendMessage,
    onClickMarkAsPassed,
    locale,
    isSending,
    showSuccessBanner,
    onCloseSuccessBanner,
}) => {
    const dictionary = getDictionary(locale);

    const isFormInvalid = !comment && files.length === 0 && links.length === 0;

    return (
        <div className="flex flex-col gap-[27px] p-4 bg-base-neutral-800 border-1 border-base-neutral-700 rounded-medium">
            {showSuccessBanner && (
                <Banner
                    title={dictionary.components.assignment.replyPanel.messageSentSuccessText}
                    style="success"
                    closeable={true}
                    onClose={onCloseSuccessBanner}
                />
            )}
            <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between pb-2 border-b-1 border-divider">
                    <div className="flex gap-1 items-center justify-center">
                        <IconCoachingSession fill='text-primary' />
                        <p className="md:text-sm text-xs text-text-primary font-bold leading-[150%]">
                            {dictionary.components.assignment.replyPanel.replyText}
                        </p>
                    </div>
                    {role === 'coach' && (
                        <Button
                            variant="text"
                            size="small"
                            iconLeft={<IconAssignmentPassed />}
                            hasIconLeft
                            text={dictionary.components.assignment.replyPanel.markAsPassedText}
                            onClick={onClickMarkAsPassed}
                            disabled={isSending}
                        />
                    )}
                </div>
                <Uploader
                    type="multiple"
                    variant="generic"
                    files={files}
                    maxFile={5}
                    onFilesChange={(file, abortSignal) => onFilesChange(file, abortSignal)}
                    onDelete={(id) => onFileDelete(id)}
                    onDownload={(id) => onFileDownload(id)}
                    onUploadComplete={(file) => onUploadComplete(file)}
                    locale={locale}
                    className="w-full"
                    maxSize={5}
                />
                <div className="flex flex-col items-center justify-center gap-[10px] w-full">
                    {links.map((link, index) =>
                        linkEditIndex === index ?
                            (
                                <div className="flex flex-col w-full" key={index}>
                                    <LinkEdit
                                        locale={locale}
                                        initialTitle={link.title as string}
                                        initialUrl={link.url as string}
                                        initialCustomIcon={link.customIcon}
                                        onSave={(title, url, customIcon) => onCreateLink({ title, url, customIcon, linkId: link.linkId as number }, index)}
                                        onDiscard={() => onLinkDelete(index)}
                                        onImageChange={(image, abortSignal) => onImageChange(image, abortSignal)}
                                        onDeleteIcon={() => onDeleteIcon(index)}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col w-full" key={index}>
                                    <LinkPreview
                                        preview
                                        title={link.title as string}
                                        url={link.url as string}
                                        customIcon={link.customIcon}
                                        onEdit={() => onClickEditLink(index)}
                                        onDelete={() => onLinkDelete(index)}
                                    />
                                </div>
                            )
                    )}
                    <div className="flex items-center mt-4 w-full">
                        <div className="flex-grow border-t border-divider"></div>
                        <span
                            onClick={onClickAddLink}
                            className="text-button-primary-fill mx-4 capitalize flex gap-1 items-center text-para-sm font-bold cursor-pointer hover:text-action-hover"
                        >
                            <IconPlus />
                            <span>{dictionary.components.assignment.replyPanel.addLinkText}</span>
                        </span>
                        <div className="flex-grow border-t border-divider"></div>
                    </div>
                </div>
                <div className="flex flex-col gap-2 items-start w-full">
                    <div className="flex gap-1 justify-center items-center">
                        <p className="text-sm text-text-primary font-bold leading-[150%]">
                            {dictionary.components.assignment.replyPanel.yourCommentsText}:
                        </p>
                        <div className="flex items-center justify-center">
                            <Tooltip
                                text=''
                                description={dictionary.components.assignment.replyPanel.replyPlaceholderText}
                                tipPosition='right'
                            />
                        </div>
                    </div>
                    <div className="w-full">
                        <TextAreaInput
                            value={comment}
                            setValue={(comment) => onChangeComment(comment)}
                            className="w-full"
                            placeholder={dictionary.components.assignment.replyPanel.replyPlaceholderText}
                        />
                    </div>
                </div>
                <Button
                    size='medium'
                    variant="primary"
                    text={isSending ? dictionary.components.assignment.replyPanel.sendingMessageText : dictionary.components.assignment.replyPanel.sendMessageText}
                    onClick={onClickSendMessage}
                    disabled={isFormInvalid || isSending}
                />
            </div>
        </div>
    );
};