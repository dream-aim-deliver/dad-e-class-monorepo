import { getDictionary, isLocalAware } from "@maany_shr/e-class-translations";
import { FC } from "react";
import { UserAvatar } from "../avatar/user-avatar";
import { cn } from "../../utils/style-utils";
import Banner from "../banner";
import { FilePreview } from "../drag-and-drop-uploader/file-preview";
import { LinkPreview } from "../links";

/**
 * Props for the MessageCard component.
 * Displays either a regular reply message with content or a "passed" status indicator.
 */
export interface MessageCardProps extends isLocalAware {
    reply: {
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
    };
    onFileDownload: (downloadUrl: string) => void;
};

/**
 * Renders a chat-style message card for assignment replies or status updates.
 * 
 * This component displays a message bubble with sender information, timestamp, and content.
 * It handles two types of messages:
 *   1. Regular replies: Show comment text, attached files, and resource links
 *   2. "Passed" status: Display a success banner indicating assignment completion
 * 
 * The message bubble styling adapts based on whether the sender is the current user:
 *   - Current user messages: Aligned right with avatar on the right, darker background
 *   - Other user messages: Aligned left with avatar on the left, lighter background
 * 
 * Features:
 *   - User avatar display with size xSmall
 *   - Formatted timestamp (date and time)
 *   - Conditional content rendering based on reply type
 *   - File attachments with download capability (read-only previews)
 *   - Resource links with custom icons
 *   - Visual separator between comment and attachments
 *   - Responsive message bubble with appropriate border radius
 * 
 * This is a presentational component with no internal state management.
 * All interactions (file downloads) are handled via callbacks.
 * 
 * @param reply Reply object containing either:
 *   - For regular replies: sender info, comment text, files, links, and sentAt timestamp
 *   - For passed status: sender info and passedAt timestamp
 * @param onFileDownload Callback to handle file downloads, receives the file's download URL
 * @param locale Locale string for i18n/localization
 * 
 * @example
 * // Regular reply message
 * <MessageCard
 *   reply={{
 *     replyType: "reply",
 *     sender: {
 *       id: 42,
 *       username: "johndoe",
 *       role: "student",
 *       name: "John",
 *       surname: "Doe",
 *       avatarUrl: "https://...",
 *       isCurrentUser: false
 *     },
 *     comment: "Here is my completed assignment",
 *     files: [
 *       { id: "1", name: "homework.pdf", size: 1024, category: "document", downloadUrl: "https://...", thumbnailUrl: null }
 *     ],
 *     links: [
 *       { title: "Reference", url: "https://example.com", iconFile: null }
 *     ],
 *     sentAt: 1698765432
 *   }}
 *   onFileDownload={(url) => window.open(url, '_blank')}
 *   locale="en"
 * />
 * 
 * @example
 * // Passed status message
 * <MessageCard
 *   reply={{
 *     replyType: "passed",
 *     sender: {
 *       id: 10,
 *       username: "coach_jane",
 *       role: "coach",
 *       name: "Jane",
 *       surname: "Smith",
 *       avatarUrl: "https://...",
 *       isCurrentUser: true
 *     },
 *     passedAt: 1698765432
 *   }}
 *   onFileDownload={(url) => window.open(url, '_blank')}
 *   locale="en"
 * />
 */

export const MessageCard: FC<MessageCardProps> = (props) => {
    const dictionary = getDictionary(props.locale);
    let formattedDateTime;

    // components/FormattedDateTime.js
    const formatDateTime = (timestamp?: number) => {
        if (!timestamp) return null; // Handle case where timestamp is empty or undefined
        const date = new Date(timestamp * 1000); // Convert seconds to milliseconds
        const formattedDate = date.toISOString().split('T')[0]; // 'YYYY-MM-DD'
        const formattedTime = date.toTimeString().split(' ')[0].slice(0, 5); // 'HH:MM'
        return { formattedDate, formattedTime };
    };

    if (props.reply.replyType === 'reply')
        formattedDateTime = formatDateTime(props.reply.sentAt);
    else
        formattedDateTime = formatDateTime(props.reply.passedAt);

    const messageBubble = (
        <div
            className={cn(
                'flex flex-col gap-2 p-2 border-1 rounded-tl-medium rounded-tr-medium min-w-0 flex-1',
                props.reply.sender.isCurrentUser
                    ? ' rounded-br-none rounded-bl-medium bg-base-neutral-700 border-base-neutral-600'
                    : 'rounded-br-medium rounded-bl-none bg-base-neutral-800 border-base-neutral-700',
            )}
        >
            <div className="flex justify-between">
                <p className="text-xs text-text-primary font-bold leading-[100%]">
                    {props.reply.sender.isCurrentUser
                        ? dictionary.components.assignment.message.youText
                        : `${props.reply.sender.name} ${props.reply.sender.surname}`}
                </p>
                {formattedDateTime && (
                    <p className="text-2xs text-text-secondary font-bold leading-[100%]">
                        {formattedDateTime.formattedDate}{' '}
                        {formattedDateTime.formattedTime}
                    </p>
                )}
            </div>
            {props.reply.replyType === 'passed' ? (
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
                        {props.reply.comment}
                    </p>
                    {(props.reply.files.length > 0 || props.reply.links.length > 0) && (
                        <div className="w-full h-[1px] bg-base-neutral-500" />
                    )}
                    {props.reply.files?.map((file, index) => (
                        <FilePreview
                            key={index}
                            uploadResponse={{
                                ...file,
                                category: 'generic' as const,
                                status: 'available' as const,
                                url: file.downloadUrl,
                            }}
                            deletion={{
                                isAllowed: false,
                            }}
                            onDownload={() => props.onFileDownload(file.downloadUrl)}
                            locale={props.locale}
                            readOnly={true}
                        />
                    ))}
                    {props.reply.links?.map((link, index) => (
                        <div className="flex flex-col w-full" key={`link-${index}`}>
                            <LinkPreview
                                key={link.iconFile?.id}
                                title={link.title as string}
                                url={link.url as string}
                                customIcon={link.iconFile
                                    ? {
                                        ...link.iconFile,
                                        status: 'available' as const,
                                        url: link.iconFile.downloadUrl,
                                        thumbnailUrl: link.iconFile.downloadUrl,
                                    }
                                    : undefined
                                }
                                preview={false}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
    return (
        <div className="w-full">
            {props.reply.sender.isCurrentUser ? (
                <div className="flex gap-2 items-end">
                    {messageBubble}
                    <div className="flex-shrink-0">
                        <UserAvatar
                            imageUrl={props.reply.sender.avatarUrl || undefined}
                            size="xSmall"
                            fullName={`${props.reply.sender.name} ${props.reply.sender.surname}`}
                        />
                    </div>
                </div>
            ) : (
                <div className="flex gap-2 items-end">
                    <div className="flex-shrink-0">
                        <UserAvatar
                            imageUrl={props.reply.sender.avatarUrl || undefined}
                            size="xSmall"
                            fullName={`${props.reply.sender.name} ${props.reply.sender.surname}`}
                        />
                    </div>
                    {messageBubble}
                </div>
            )}
        </div>
    );
};