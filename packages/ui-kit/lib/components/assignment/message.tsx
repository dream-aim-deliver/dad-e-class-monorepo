import { FC } from "react";
import { UserAvatar } from "../avatar/user-avatar";
import { assignment, fileMetadata, shared } from '@maany_shr/e-class-models';
import { cn } from "../../utils/style-utils";
import Banner from "../banner";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { FilePreview } from "../drag-and-drop-uploader/file-preview";
import { LinkEdit, LinkPreview } from "../links";

export interface MessageProps extends isLocalAware {
    reply: assignment.TAssignmentReplyWithId;
    linkEditIndex: number;
    onFileDownload: (id: string) => void;
    onFileDelete: (id: number, fileId: string) => void;
    onLinkDelete: (id: number, linkId: number) => void;
    onImageChange: (image: fileMetadata.TFileMetadata, abortSignal?: AbortSignal) => void;
    onChange: (files: fileMetadata.TFileMetadata[], links: shared.TLinkWithId[], linkEditIndex: number) => void;
    onDeleteIcon: (id: string) => void;
};

/**
 * Renders a single assignment reply message in a chat/conversation style, showing sender,
 * date/time, comment, any attached files and resource links, along with in-place editing of links.
 * 
 * This is a presentational component; all state and callback handlers (file actions, link edit, etc) are controlled by the parent.
 * Styling of the message bubble changes based on which user sent the message.
 *
 * @param reply The assignment reply/message to display.
 * @param linkEditIndex The (zero-based) index of the reply's resource links currently being edited.
 * @param onFileDownload Callback to download a file (from the resource list).
 * @param onFileDelete Callback to delete or cancel a file upload.
 * @param onLinkDelete Callback to delete a resource link.
 * @param onChange Callback to update files, links or change link editing mode.
 * @param onImageChange Callback to update the Link image.
 * @param onDeleteIcon Callback to delete the Link icon.
 * @param locale The locale string for i18n/localization.
 *
 * @example
 * <Message
 *   reply={{
 *     type: 'resources',
 *     comment: 'See the attached files',
 *     files: [{ ... }],
 *     links: [{ title: 'Ref', url: 'https://...' }],
 *     sender: { name: 'Alice', isCurrentUser: true, image: '...' },
 *     timestamp: '2023-12-20T10:30:00Z',
 *     replyId: 5,
 *   }}
 *   linkEditIndex={-1}
 *   onFileDownload={handleFileDownload}
 *   onFileDelete={handleFileDelete}
 *   onLinkDelete={handleLinkDelete}
 *   onChange={handleMessageChange}
 *   onImageChange={handleImageChange}
 *   onDeleteIcon={handleDeleteIcon}
 *   locale="en"
 * />
 */

export const Message: FC<MessageProps> = ({
    reply,
    linkEditIndex,
    onFileDownload,
    onFileDelete,
    onLinkDelete,
    onChange,
    onImageChange,
    onDeleteIcon,
    locale
}) => {
    const dictionary = getDictionary(locale);

    // components/FormattedDateTime.js
    const formatDateTime = (timestamp?: string) => {
        if (!timestamp) return null; // Handle case where timestamp is empty or undefined
        const date = new Date(timestamp);
        const formattedDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        const formattedTime = date.toTimeString().split(' ')[0].slice(0, 5); // 'HH:MM'
        return { formattedDate, formattedTime };
    };
    const formattedDateTime = formatDateTime(reply.timestamp);

    const handleSaveLink = (data: shared.TLinkWithId, index: number) => {
        if (reply.type !== 'resources') return;
        const updatedLinks = [...reply.links];
        updatedLinks[index] = data;
        onChange(reply.files, updatedLinks, null);
    };

    const handleOnClickLinkEdit = (index: number) => {
        if (reply.type !== 'resources') return;
        onChange(reply.files, reply.links, index);
    };

    const messageBubble = (
        <div className={cn('flex flex-col gap-2 p-2 border-1 rounded-tl-medium rounded-tr-medium min-w-0 flex-1', reply.sender.isCurrentUser ? ' rounded-br-none rounded-bl-medium bg-base-neutral-700 border-base-neutral-600' : 'rounded-br-medium rounded-bl-none bg-base-neutral-800 border-base-neutral-700')}>
            <div className="flex justify-between">
                <p className="text-xs text-text-primary font-bold leading-[100%]">
                    {reply.sender.isCurrentUser ? dictionary.components.assignment.message.youText : reply.sender.name}
                </p>
                <p className="text-2xs text-text-secondary font-bold leading-[100%]">
                    {formattedDateTime.formattedDate} {formattedDateTime.formattedTime}
                </p>
            </div>
            {reply.type === 'text' ? (
                <p className="text-sm text-text-primary leading-[150%]">
                    {reply.comment}
                </p>
            ) : (reply.type === 'passed' ? (
                <Banner
                    title={dictionary.components.assignment.message.markAssignmentText}
                    style="success"
                />
            ) : (
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-text-primary leading-[150%]">
                        {reply.comment}
                    </p>
                    <div className="w-full h-[1px] bg-base-neutral-500" />
                    {reply.files.map((file, index) => (
                        <FilePreview
                            key={index}
                            uploadResponse={file}
                            onDelete={() => onFileDelete(reply.replyId, file.id)}
                            onDownload={() => onFileDownload(file.id)}
                            locale={locale}
                            onCancel={() => onFileDelete(reply.replyId, file.id)}
                            readOnly={!reply.sender.isCurrentUser}
                        />
                    ))}
                    {reply.links.map((link, index) =>
                        linkEditIndex === index ?
                            (
                                <div className="flex flex-col w-full" key={index}>
                                    <LinkEdit
                                        locale={locale}
                                        initialTitle={link.title}
                                        initialUrl={link.url}
                                        initialCustomIcon={link.customIcon}
                                        onSave={(title, url, customIcon) => handleSaveLink({ title, url, customIcon }, index)}
                                        onDiscard={() => onLinkDelete(reply.replyId, link.linkId)}
                                        onImageChange={(image, abortSignal) => onImageChange(image, abortSignal)}
                                        onDeleteIcon={onDeleteIcon}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col w-full" key={index}>
                                    <LinkPreview
                                        preview={reply.sender.isCurrentUser}
                                        title={link.title}
                                        url={link.url}
                                        customIcon={link.customIcon}
                                        onEdit={() => handleOnClickLinkEdit(index)}
                                        onDelete={() => onLinkDelete(reply.replyId, link.linkId)}
                                    />
                                </div>
                            )
                    )}
                </div>
            ))}
        </div>
    );

    return (
        <div className="w-full">
            {reply.sender.isCurrentUser ? (
                <div className="flex gap-2 items-end">
                    {messageBubble}
                    <div className="flex-shrink-0">
                        <UserAvatar
                            imageUrl={reply.sender.image}
                            size="xSmall"
                            fullName={reply.sender.name}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex gap-2 items-end">
                    <div className="flex-shrink-0">
                        <UserAvatar
                            imageUrl={reply.sender.image}
                            size="xSmall"
                            fullName={reply.sender.name}
                        />
                    </div>
                    {messageBubble}
                </div>
            )}
        </div>
    );
};