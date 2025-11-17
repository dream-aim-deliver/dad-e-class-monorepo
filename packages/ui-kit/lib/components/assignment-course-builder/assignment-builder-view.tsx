import { getDictionary, isLocalAware } from '@maany_shr/e-class-translations';
import { FC } from 'react';
import {
    AssignmentElement,
    AssignmentStatus,
} from '../course-builder-lesson-component/types';
import { IconAssignment } from '../icons/icon-assignment';
import { FilePreview } from '../drag-and-drop-uploader/file-preview';
import { LinkPreview } from '../links';
import { Message } from '../assignment/message';
import { Badge } from '../badge';
import { fileMetadata } from '@maany_shr/e-class-models';
import { Button } from '../button';

/**
 * Displays a summary view of the assignment, including title, description, attached files, and resource links.
 * Typically used to preview or review an assignment structure before publishing or editing.
 *
 * @param assignmentData The assignment's data containing:
 *   - `title`: The title of the assignment.
 *   - `description`: The description or details of the assignment.
 *   - `files`: Array of attached files, suitable for preview (each file object compatible with FilePreview).
 *   - `links`: Array of resource links, each containing a title and URL.
 * @param locale The locale string for language translation, used for all labels and text.
 *
 * @example
 * <AssignmentBuilderView
 *   assignmentData={{
 *     title: "Math Assignment",
 *     description: "Solve all problems. Show your work.",
 *     files: [{...}, {...}],
 *     links: [{title: "Reference", url: "https://..." }]
 *   }}
 *   locale="en"
 * />
 */

interface AssignmentStudentView extends isLocalAware {
    elementInstance: AssignmentElement;
    onFileDownload: (fileMetadata: fileMetadata.TFileMetadata) => void;
    viewButton?: React.ReactNode;
}

export const AssignmentBuilderView: FC<AssignmentStudentView> = ({
    elementInstance,
    onFileDownload,
    viewButton,
    locale,
}) => {
    const dictionary = getDictionary(locale);
    const lastReply = elementInstance.progress?.lastReply;

    return (
        <div className="flex flex-col gap-4 items-start bg-base-neutral-800 border-1 border-divider rounded-medium p-4 w-full">
            <div className="flex gap-1 items-center justify-center">
                <IconAssignment classNames="text-text-primary" />
                <p className="text-sm text-text-primary font-bold leading-[150%]">
                    {
                        dictionary.components.assignment.assignmentBuilder
                            .assignmentText
                    }
                </p>
            </div>
            <div className="w-full h-[1px] bg-divider" />
            <div className="flex flex-col gap-4 items-start w-full">
                <h4 className="text-xl text-text-primary font-bold leading-[120%]">
                    {elementInstance.title}
                </h4>
                <p className="text-md text-text-primary leading-[150%]">
                    {elementInstance.description}
                </p>
                {elementInstance.progress?.status ===
                    AssignmentStatus.AwaitingReview && (
                    <Badge
                        text={
                            dictionary.components.assignment.assignmentCard
                                .awaitingReviewText
                        }
                        variant="warningprimary"
                        size="medium"
                        className="w-fit"
                    />
                )}
                {elementInstance.progress?.status ===
                    AssignmentStatus.Passed && (
                    <Badge
                        text={
                            dictionary.components.assignment.assignmentCard
                                .passedText
                        }
                        variant="successprimary"
                        size="medium"
                        className="w-fit"
                    />
                )}
                {elementInstance.progress?.status ===
                    AssignmentStatus.AwaitingReviewLongTime && (
                    <Badge
                        text={
                            dictionary.components.assignment.assignmentCard
                                .longWaitText
                        }
                        variant="errorprimary"
                        size="medium"
                        className="w-fit"
                    />
                )}
                <div className="flex flex-col gap-2 items-start w-full">
                    {elementInstance.files?.map((file, index) => (
                        <FilePreview
                            key={`file-preview-${index}`}
                            uploadResponse={file}
                            locale={locale}
                            readOnly={true}
                            deletion={{ isAllowed: false }}
                            onDownload={() => file.id && onFileDownload(file)}
                        />
                    ))}
                    {elementInstance.links?.map((link, index) => (
                        <div className="flex flex-col w-full" key={`link-preview-${index}`}>
                            <LinkPreview
                                preview={false}
                                title={link.title as string}
                                url={link.url as string}
                            />
                        </div>
                    ))}
                </div>
                {lastReply && (
                    <div className="flex flex-col gap-2">
                        <h6 className="text-md text-text-primary font-bold leading-[120%]">
                            {
                                dictionary.components.assignment.assignmentCard
                                    .lastActivityText
                            }
                        </h6>
                        <Message
                            reply={lastReply}
                            onFileDownload={onFileDownload}
                            locale={locale}
                        />
                    </div>
                )}
            </div>
            {viewButton}
        </div>
    );
};
