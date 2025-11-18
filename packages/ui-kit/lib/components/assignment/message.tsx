import { FC } from 'react';
import { UserAvatar } from '../avatar/user-avatar';
import { fileMetadata } from '@maany_shr/e-class-models';
import { cn } from '../../utils/style-utils';
import Banner from '../banner';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { FilePreview } from '../drag-and-drop-uploader/file-preview';
import { LinkPreview } from '../links';
import type {
    TAssignmentReplyResponse,
    TAssignmentPassedResponse,
} from '@dream-aim-deliver/e-class-cms-rest';

type AssignmentReply = TAssignmentReplyResponse | TAssignmentPassedResponse;

export interface MessageProps extends isLocalAware {
    reply: AssignmentReply;
    onFileDownload: (fileMetadata: fileMetadata.TFileMetadata) => void;
}

/**
 * Renders a single assignment reply message in a chat/conversation style, showing sender,
 * date/time, comment, and any attached files and resource links.
 *
 * This is a presentational (read-only) component that displays a reply from an assignment conversation thread.
 * Files and links are nested within the reply object and displayed without editing capabilities.
 * Styling of the message bubble changes based on which user sent the message.
 *
 * @param reply The assignment reply/message to display. Can be one of two types:
 *   - replyType: 'reply': Comment with optional attached files and/or links (nested in reply.files, reply.links)
 *   - replyType: 'passed': Coach marking assignment as passed
 * @param onFileDownload Callback to download a file from the reply's resource list.
 * @param locale The locale string for i18n/localization.
 *
 * @example
 * // Reply with resources
 * <Message
 *   reply={{
 *     replyType: 'reply',
 *     comment: 'Great work!',
 *     sender: { id: 1, username: 'coach', isCurrentUser: false, role: 'coach', ... },
 *     sentAt: 1640000000,
 *     files: [],
 *     links: [],
 *   }}
 *   onFileDownload={handleFileDownload}
 *   locale="en"
 * />
 *
 * @example
 * // Reply with nested files and links
 * <Message
 *   reply={{
 *     replyType: 'reply',
 *     comment: 'See the attached files',
 *     files: [{ id: '1', name: 'doc.pdf', url: 'https://...', downloadUrl: 'https://...', ... }],
 *     links: [{ title: 'Reference', url: 'https://...', iconFile: { ... } }],
 *     sender: { id: 2, username: 'alice', isCurrentUser: true, role: 'student', ... },
 *     sentAt: 1640000000,
 *   }}
 *   onFileDownload={handleFileDownload}
 *   locale="en"
 * />
 *
 * @example
 * // Passed assignment
 * <Message
 *   reply={{
 *     replyType: 'passed',
 *     passedAt: 1640000000,
 *     sender: { id: 1, username: 'coach', isCurrentUser: false, role: 'coach', ... },
 *   }}
 *   onFileDownload={handleFileDownload}
 *   locale="en"
 * />
 */

export const Message: FC<MessageProps> = ({
    reply,
    onFileDownload,
    locale,
}) => {
    const dictionary = getDictionary(locale);

    // components/FormattedDateTime.js
    const formatDateTime = (timestamp?: number) => {
        if (!timestamp) return null; // Handle case where timestamp is empty or undefined
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        const formattedDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        const formattedTime = date.toTimeString().split(' ')[0].slice(0, 5); // 'HH:MM'
        return { formattedDate, formattedTime };
    };
    const formattedDateTime = reply.replyType === 'passed'
        ? formatDateTime(reply.passedAt)
        : formatDateTime(reply.sentAt);

    const getResources = () => {
        if (reply.replyType !== 'reply') return null;
        const hasFiles = reply.files && reply.files.length > 0;
        const hasLinks = reply.links && reply.links.length > 0;
        if (!hasFiles && !hasLinks) return null;
        return (
            <>
                <div className="w-full h-[1px] bg-base-neutral-500" />
                {reply.files?.map((file, index) => {
                    // Transform backend file format to TFileMetadata
                    const fileMetadata: fileMetadata.TFileMetadata = {
                        ...file,
                        url: file.downloadUrl,
                        status: 'available' as const,
                        ...(file.category === 'video' ? { videoId: null } : {}),
                    } as fileMetadata.TFileMetadata;

                    return (
                        <FilePreview
                            key={index}
                            uploadResponse={fileMetadata}
                            deletion={{
                                isAllowed: false,
                            }}
                            onDownload={() => onFileDownload(fileMetadata)}
                            locale={locale}
                            readOnly={!reply.sender.isCurrentUser}
                        />
                    );
                })}
                {reply.links?.map((link, index) => {
                    // Transform icon file if present
                    const customIcon = link.iconFile ? {
                        ...link.iconFile,
                        url: link.iconFile.downloadUrl,
                        status: 'available' as const,
                        thumbnailUrl: link.iconFile.downloadUrl,
                    } : undefined;

                    return (
                        <div className="flex flex-col w-full" key={`link-${index}`}>
                            <LinkPreview
                                preview={reply.sender.isCurrentUser}
                                title={link.title}
                                url={link.url}
                                customIcon={customIcon}
                            />
                        </div>
                    );
                })}
            </>
        );
    };

    const messageBubble = (
        <div
            className={cn(
                'flex flex-col gap-2 p-2 border-1 rounded-tl-medium rounded-tr-medium min-w-0 flex-1',
                reply.sender.isCurrentUser
                    ? ' rounded-br-none rounded-bl-medium bg-base-neutral-700 border-base-neutral-600'
                    : 'rounded-br-medium rounded-bl-none bg-base-neutral-800 border-base-neutral-700',
            )}
        >
            <div className="flex justify-between">
                <p className="text-xs text-text-primary font-bold leading-[100%]">
                    {reply.sender.isCurrentUser
                        ? dictionary.components.assignment.message.youText
                        : reply.sender.username}
                </p>
                <p className="text-2xs text-text-secondary font-bold leading-[100%]">
                    {formattedDateTime ? (
                        <>
                            {(formattedDateTime as any).formattedDate}{' '}
                            {(formattedDateTime as any).formattedTime}
                        </>
                    ) : (
                        '-'
                    )}
                </p>
            </div>
            {reply.replyType === 'passed' ? (
                <Banner
                    title={
                        dictionary.components.assignment.message
                            .markAssignmentText
                    }
                    style="success"
                />
            ) : reply.replyType === 'reply' ? (
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-text-primary leading-[150%]">
                        {reply.comment}
                    </p>
                    {getResources()}
                </div>
            ) : null}
        </div>
    );

    return (
        <div className="w-full">
            {reply.sender.isCurrentUser ? (
                <div className="flex gap-2 items-end">
                    {messageBubble}
                    <div className="flex-shrink-0">
                        <UserAvatar
                            imageUrl={reply.sender.avatarUrl ?? undefined}
                            size="xSmall"
                            fullName={reply.sender.username}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex gap-2 items-end">
                    <div className="flex-shrink-0">
                        <UserAvatar
                            imageUrl={reply.sender.avatarUrl ?? undefined}
                            size="xSmall"
                            fullName={reply.sender.username}
                        />
                    </div>
                    {messageBubble}
                </div>
            )}
        </div>
    );
};
