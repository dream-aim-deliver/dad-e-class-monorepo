import { FC } from 'react';
import { UserAvatar } from '../avatar/user-avatar';
import { assignment, fileMetadata, shared } from '@maany_shr/e-class-models';
import { cn } from '../../utils/style-utils';
import Banner from '../banner';
import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { FilePreview } from '../drag-and-drop-uploader/file-preview';
import { LinkEdit, LinkPreview } from '../links';

export interface MessageProps extends isLocalAware {
    reply: assignment.TAssignmentReplyWithId;
    onFileDownload: (fileMetadata: fileMetadata.TFileMetadata) => void;
}

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
    onFileDownload,
    locale,
}) => {
    const dictionary = getDictionary(locale);

    // components/FormattedDateTime.js
    const formatDateTime = (timestamp?: number) => {
        if (!timestamp) return null; // Handle case where timestamp is empty or undefined
        const date = new Date(timestamp);
        const formattedDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        const formattedTime = date.toTimeString().split(' ')[0].slice(0, 5); // 'HH:MM'
        return { formattedDate, formattedTime };
    };
    const formattedDateTime = formatDateTime(reply.timestamp);

    const getResources = () => {
        if (reply.type !== 'resources') return null;
        const hasFiles = reply.files && reply.files.length > 0;
        const hasLinks = reply.links && reply.links.length > 0;
        if (!hasFiles && !hasLinks) return null;
        return (
            <>
                <div className="w-full h-[1px] bg-base-neutral-500" />
                {reply.files?.map((file, index) => (
                    <FilePreview
                        key={index}
                        uploadResponse={file}
                        deletion={{
                            isAllowed: false,
                        }}
                        onDownload={() => onFileDownload(file)}
                        locale={locale}
                        readOnly={!(reply.sender as any).isCurrentUser}
                    />
                ))}
                {reply.links?.map((link, index) => (
                    <div className="flex flex-col w-full" key={`link-${index}`}>
                        <LinkPreview
                            preview={(reply.sender as any).isCurrentUser}
                            title={link.title as string}
                            url={link.url as string}
                            customIcon={link.customIcon}
                        />
                    </div>
                ))}
            </>
        );
    };

    const messageBubble = (
        <div
            className={cn(
                'flex flex-col gap-2 p-2 border-1 rounded-tl-medium rounded-tr-medium min-w-0 flex-1',
                (reply.sender as any).isCurrentUser
                    ? ' rounded-br-none rounded-bl-medium bg-base-neutral-700 border-base-neutral-600'
                    : 'rounded-br-medium rounded-bl-none bg-base-neutral-800 border-base-neutral-700',
            )}
        >
            <div className="flex justify-between">
                <p className="text-xs text-text-primary font-bold leading-[100%]">
                    {(reply.sender as any).isCurrentUser
                        ? dictionary.components.assignment.message.youText
                        : (reply.sender as any).name}
                </p>
                <p className="text-2xs text-text-secondary font-bold leading-[100%]">
                    {(formattedDateTime as any).formattedDate}{' '}
                    {(formattedDateTime as any).formattedTime}
                </p>
            </div>
            {reply.type === 'text' ? (
                <p className="text-sm text-text-primary leading-[150%]">
                    {reply.comment}
                </p>
            ) : reply.type === 'passed' ? (
                <Banner
                    title={
                        dictionary.components.assignment.message
                            .markAssignmentText
                    }
                    style="success"
                />
            ) : (
                <div className="flex flex-col gap-2">
                    <p className="text-sm text-text-primary leading-[150%]">
                        {reply.comment}
                    </p>
                    {getResources()}
                </div>
            )}
        </div>
    );

    return (
        <div className="w-full">
            {(reply.sender as any).isCurrentUser ? (
                <div className="flex gap-2 items-end">
                    {messageBubble}
                    <div className="flex-shrink-0">
                        <UserAvatar
                            imageUrl={(reply.sender as any).image as string}
                            size="xSmall"
                            fullName={(reply.sender as any).name as string}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex gap-2 items-end">
                    <div className="flex-shrink-0">
                        <UserAvatar
                            imageUrl={(reply.sender as any).image as string}
                            size="xSmall"
                            fullName={(reply.sender as any).name as string}
                        />
                    </div>
                    {messageBubble}
                </div>
            )}
        </div>
    );
};
