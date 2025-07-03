import { FC } from "react";
import { UserAvatar } from "../avatar/user-avatar";
import { assignment, fileMetadata, shared } from '@maany_shr/e-class-models';
import { cn } from "../../utils/style-utils";
import Banner from "../banner";
import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { FilePreview } from "../drag-and-drop-uploader/file-preview";
import { LinkEdit, LinkPreview } from "../link";

export interface MessageProps extends isLocalAware {
    reply: assignment.TAssignmentReply;
    linkEditIndex: number;
    onFileDownload: (id: number) => void;
    onFileDelete: (id: number, fileId: number, type: 'file') => void;
    onLinkDelete: (id: number, linkId: number, type: 'link') => void;
    onChange: (files: fileMetadata.TFileMetadata[], links: shared.TLink[], linkEditIndex?: number) => void;
};

export const Message: FC<MessageProps> = ({
    reply,
    linkEditIndex,
    onFileDownload,
    onFileDelete,
    onLinkDelete,
    onChange,
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

    const handleSaveLink = (index: number) => {
        if (reply.type !== 'resources') return;
        const updatedLinks = [...reply.links];
        updatedLinks[index] = {
            ...updatedLinks[index],
        };
        onChange(reply.files, updatedLinks, null);
    };

    const handleLinkEdit = (data: shared.TLink, index: number) => {
        if (reply.type !== 'resources') return;
        const updatedLinks = [...reply.links];
        updatedLinks[index] = data;
        onChange(reply.files, updatedLinks, index);
    };

    const handleOnClickLinkEdit = (index: number) => {
        if (reply.type !== 'resources') return;
        onChange(reply.files, reply.links, index);
    };

    const messageBubble = (
        <div className={cn('flex flex-col gap-2 p-2 border-1 rounded-tl-medium rounded-tr-medium w-full', reply.sender.isCurrentUser ? ' rounded-br-none rounded-bl-medium bg-base-neutral-700 border-base-neutral-600' : 'rounded-br-medium rounded-bl-none bg-base-neutral-800 border-base-neutral-700')}>
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
                    title={dictionary.components.assignment.message.markAssigmentText}
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
                            index={index}
                            onDelete={() => onFileDelete(reply.replyId, file.id, 'file')}
                            onDownload={() => onFileDownload(file.id)}
                            locale={locale}
                            onCancelUpload={() => onFileDelete(reply.replyId, file.id, 'file')}
                            className="bg-transparent p-0"
                            isDeleteAllowed={reply.sender.isCurrentUser}
                        />
                    ))}
                    {reply.links.map((link, index) =>
                        linkEditIndex === index ?
                            (
                                <div className="flex flex-col w-full" key={index}>
                                    <LinkEdit
                                        locale={locale}
                                        title={link.title}
                                        url={link.url}
                                        onSave={() => handleSaveLink(index)}
                                        onDiscard={() => onLinkDelete(reply.replyId, link.linkId, 'link')}
                                        onChange={(data) => handleLinkEdit(data, index)}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col w-full" key={index}>
                                    <LinkPreview
                                        preview={reply.sender.isCurrentUser}
                                        title={link.title}
                                        url={link.url}
                                        onEdit={() => handleOnClickLinkEdit(index)}
                                        onDelete={() => onLinkDelete(reply.replyId, link.linkId, 'link')}
                                        className="w-full"
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
                    <UserAvatar
                        imageUrl={reply.sender.image}
                        size="medium"
                        fullName={reply.sender.name}
                    />
                </div>
            ) : (
                <div className="flex gap-2 items-end">
                    <UserAvatar
                        imageUrl={reply.sender.image}
                        size="medium"
                        fullName={reply.sender.name}
                    />
                    {messageBubble}
                </div>
            )}
        </div>
    );
};