import { FC } from "react";
import { TextInput } from "../text-input";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../text-areaInput";
import Tooltip from "../tooltip";
import { IconCloudUpload } from "../icons/icon-cloud-upload";
import { Uploader } from "../drag-and-drop-uploader/uploader";
import { CreateAssignmentBuilderViewTypes } from "../course-builder-lesson-component/types";
import { LinkEdit, LinkPreview } from "../links";
import { IconPlus } from "../icons/icon-plus";

/**
 * Component for building or editing an assignment in a course builder interface.
 * Allows entry of assignment title and description, file/resource uploads, and management of resource links.
 * All state and handlers are passed from the parent for maximum control.
 *
 * @param type The type/category of the assignment (used internally).
 * @param id The unique identifier for this builder view instance.
 * @param order The order/index of this assignment in the list or module.
 * @param assignmentData The current assignment data object containing:
 *    - `title`: Assignment title.
 *    - `description`: Assignment description.
 *    - `files`: Array of attached file metadata (for uploading and previewing).
 *    - `links`: Array of resource links for the assignment.
 * @param onChange Callback to update assignment data. Receives an object with type, id, order, and updated assignmentData.
 * @param onFilesChange Callback when new files are chosen/uploaded. Receives file data and an abort signal if provided.
 * @param onUploadComplete Callback after file is uploaded successfully. Receives the file metadata object.
 * @param onFileDelete Callback to delete a file. Receives the file id to remove.
 * @param onFileDownload Callback to download a file. Receives the file id to download.
 * @param onLinkDelete Callback to remove a link. Receives the linkId, and type ('link').
 * @param onLinkEdit Callback to edit a link. Receives new link data and its index in the array.
 * @param onClickAddLink Callback to add a new resource link.
 * @param locale The locale string for i18n/localized labels.
 * @param linkEditIndex The index in the links array that is currently being edited. If null, links are in preview mode.
 * @param onClickEditLink Callback to enter edit mode for a link by its index in the array.
 * @param onImageChange Callback to update the Link image.
 * @param onDeleteIcon Callback to delete the Link icon.
 *
 * @example
 * <CreateAssignmentBuilderView
 *   type="assignment"
 *   id={1}
 *   order={2}
 *   assignmentData={{
 *     title: "Essay: Future of AI",
 *     description: "Write an essay...",
 *     files: [ ... ],
 *     links: [{ title: "Info", url: "https://..." }]
 *   }}
 *   onChange={handleAssignmentChange}
 *   onFilesChange={handleFilesChange}
 *   onUploadComplete={handleUploadComplete}
 *   onFileDelete={handleFileDelete}
 *   onFileDownload={handleFileDownload}
 *   onLinkDelete={handleLinkDelete}
 *   onLinkEdit={handleLinkEdit}
 *   onClickAddLink={handleAddLink}
 *   onImageChange={handleImageChange}
 *   onDeleteIcon={handleDeleteIcon}
 *   locale="en"
 *   linkEditIndex={editingLinkIndex}
 *   onClickEditLink={setEditingLinkIndex}
 * />
 */

export const CreateAssignmentBuilderView: FC<CreateAssignmentBuilderViewTypes> = ({
    type,
    id,
    order,
    assignmentData,
    onChange,
    onFilesChange,
    onUploadComplete,
    onFileDelete,
    onFileDownload,
    onLinkDelete,
    onLinkEdit,
    onClickAddLink,
    onImageChange,
    onDeleteIcon,
    locale,
    linkEditIndex,
    onClickEditLink,
}) => {
    const dictionary = getDictionary(locale);

    const handleTitleChange = (newTitle: string) =>
        onChange({ type, id, order, assignmentData: { ...assignmentData, title: newTitle } });

    const handleDescriptionChange = (newDescription: string) =>
        onChange({ type, id, order, assignmentData: { ...assignmentData, description: newDescription } });

    return (
        <div className="flex flex-col gap-4 items-start w-full">
            <div className="w-full">
                <TextInput
                    label={dictionary.components.assignment.assignmentBuilder.assignmentTitleText}
                    inputField={{
                        id: 'assignment-title',
                        className: "w-full",
                        value: assignmentData.title,
                        setValue: handleTitleChange,
                        inputText: dictionary.components.assignment.assignmentBuilder.titlePlaceholderText,
                    }}
                />
            </div>

            <div className="flex flex-col items-start gap-2 w-full">
                <div className="flex gap-1 items-center">
                    <p className="text-sm text-text-secondary leading-[100%]">
                        {dictionary.components.assignment.assignmentBuilder.assignmentDescriptionText}
                    </p>
                    <Tooltip
                        text=''
                        description={dictionary.components.assignment.assignmentBuilder.descriptionPlaceholderText}
                    />
                </div>
                <div className="w-full">
                    <TextAreaInput
                        value={assignmentData.description}
                        setValue={handleDescriptionChange}
                        placeholder={dictionary.components.assignment.assignmentBuilder.descriptionPlaceholderText}
                    />
                </div>
            </div>

            <div className="flex flex-col gap-4 p-4 items-start border-1 border-base-neutral-700 rounded-medium w-full">
                <div className="flex gap-1 items-start pb-2 border-b-1 border-divider w-full">
                    <IconCloudUpload classNames="text-text-primary" />
                    <p className="text-sm text-text-primary font-bold leading-[150%]">
                        {dictionary.components.assignment.assignmentBuilder.addResourcesText}
                    </p>
                </div>

                <Uploader
                    type="multiple"
                    variant="generic"
                    files={assignmentData.files ?? []}
                    maxFile={5}
                    onFilesChange={onFilesChange}
                    onDelete={onFileDelete}
                    onDownload={onFileDownload}
                    onUploadComplete={onUploadComplete}
                    locale={locale}
                    className="w-full"
                    maxSize={5}
                />

                <div className="flex flex-col items-center justify-center gap-[10px] w-full">
                    {assignmentData.links?.map((link, index) =>
                        linkEditIndex === index ? (
                            <div className="flex flex-col w-full" key={index}>
                                <LinkEdit
                                    locale={locale}
                                    initialTitle={link.title}
                                    initialUrl={link.url}
                                    initialCustomIcon={link.customIcon}
                                    onSave={(title, url, customIcon) => onLinkEdit({ title, url, customIcon }, index)}
                                    onDiscard={() => onLinkDelete(link.linkId)}
                                    onImageChange={(image, abortSignal) => onImageChange(image, abortSignal)}
                                    onDeleteIcon={onDeleteIcon}
                                />
                            </div>
                        ) : (
                            <div className="flex flex-col w-full" key={index}>
                                <LinkPreview
                                    preview
                                    title={link.title}
                                    url={link.url}
                                    customIcon={link.customIcon}
                                    onEdit={() => onClickEditLink(index)}
                                    onDelete={() => onLinkDelete(link.linkId)}
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
                            <span>
                                {dictionary.components.assignment.replyPanel.addLinkText}
                            </span>
                        </span>
                        <div className="flex-grow border-t border-divider"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
