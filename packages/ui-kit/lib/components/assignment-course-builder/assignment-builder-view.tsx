import { getDictionary } from '@maany_shr/e-class-translations';
import { FC } from 'react';
import { AssignmentBuilderViewTypes } from '../course-builder-lesson-component/types';
import { IconAssignment } from '../icons/icon-assignment';
import { FilePreview } from '../drag-and-drop-uploader/file-preview';
import { LinkPreview } from '../links';

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

export const AssignmentBuilderView: FC<AssignmentBuilderViewTypes> = ({
    assignmentData,
    onFileDownload,
    locale,
    onFileCancel,
    onFileDelete,
}) => {
    const dictionary = getDictionary(locale);

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
                    {assignmentData.title}
                </h4>
                <p className="text-md text-text-primary leading-[150%]">
                    {assignmentData.description}
                </p>
                <div className="flex flex-col gap-2 items-start w-full">
                    {assignmentData.files?.map((file, index) => (
                        <FilePreview
                            key={index}
                            uploadResponse={file}
                            locale={locale}
                            readOnly={true}
                            onCancel={() => onFileCancel(file.id)}
                            deletion={{
                                isAllowed: true,
                                onDelete: () => onFileDelete(file.id),
                            }}
                            onDownload={() => onFileDownload(file.id)}
                        />
                    ))}
                    {assignmentData.links?.map((link, index) => (
                        <div className="flex flex-col w-full" key={index}>
                            <LinkPreview
                                preview={false}
                                title={link.title}
                                url={link.url}
                            />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
