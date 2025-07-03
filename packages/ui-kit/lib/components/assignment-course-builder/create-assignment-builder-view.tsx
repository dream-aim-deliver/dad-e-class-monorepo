import { FC, useState } from "react";
import { TextInput } from "../text-input";
import { getDictionary } from "@maany_shr/e-class-translations";
import { TextAreaInput } from "../text-areaInput";
import Tooltip from "../tooltip";
import { IconCloudUpload } from "../icons/icon-cloud-upload";
import { Uploader } from "../drag-and-drop-uploader/uploader";
import { CreateAssignmentBuilderViewTypes } from "../course-builder-lesson-component/types";
import { LinkEdit, LinkPreview } from "../link";
import { IconPlus } from "../icons/icon-plus";

export const CreateAssignmentBuilderView: FC<CreateAssignmentBuilderViewTypes> = ({
    type,
    id,
    order,
    assignmentId,
    assignmentData,
    onChange,
    onFilesChange,
    onFileDelete,
    onFileDownload,
    onLinkDelete,
    onLinkEdit,
    onClickAddLink,
    locale,
}) => {
    const [linkEditIndex, setLinkEditIndex] = useState<number>(null);
    const dictionary = getDictionary(locale);

    const handleTitleChange = (newTitle: string) => {
        onChange({
            type,
            id,
            order,
            assignmentData: {
                ...assignmentData,
                title: newTitle,
            },
        })
    };

    const handleDescriptionChange = (newDescription: string) => {
        onChange({
            type,
            id,
            order,
            assignmentData: {
                ...assignmentData,
                description: newDescription,
            },
        })
    };

    const handleSaveLink = (linkId: number, index: number) => {
        setLinkEditIndex(null);
    };

    const handleAddLink = () => {
        setLinkEditIndex(assignmentData.links.length);
        onClickAddLink();
    };

    return (
        <div className="flex flex-col gap-4 items-start w-full">
            <div className="w-full">
                <TextInput
                    label={dictionary.components.assignment.assignmentBuilder.assignmentTitleText}
                    inputField={{
                        id: 'assignment-title',
                        className: "w-full",
                        value: assignmentData.title,
                        setValue: (newTitle) => handleTitleChange(newTitle),
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
                        setValue={(newDescription) => { handleDescriptionChange(newDescription) }}
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
                    files={assignmentData.files}
                    maxFile={5}
                    onFilesChange={(file) => onFilesChange(file)}
                    onDelete={(id) => onFileDelete(id)}
                    onDownload={(id) => onFileDownload(id)}
                    locale={locale}
                    className="w-full"
                    maxSize={5}
                    filePreviewClassName="bg-transparent p-0"
                />

                <div className="flex flex-col items-center justify-center gap-[10px] w-full">
                    {assignmentData.links.map((link, index) =>
                        linkEditIndex === index ?
                            (
                                <div className="flex flex-col w-full" key={index}>
                                    <LinkEdit
                                        locale={locale}
                                        title={link.title}
                                        url={link.url}
                                        onSave={() => handleSaveLink(link.linkId, index)}
                                        onDiscard={() => onLinkDelete(assignmentId, link.linkId, 'link')}
                                        onChange={(data) => onLinkEdit(data, index)}
                                    />
                                </div>
                            ) : (
                                <div className="flex flex-col w-full" key={index}>
                                    <LinkPreview
                                        preview
                                        title={link.title}
                                        url={link.url}
                                        onEdit={() => setLinkEditIndex(index)}
                                        onDelete={() => onLinkDelete(assignmentId, link.linkId, 'link')}
                                        className="w-full"
                                    />
                                </div>
                            )
                    )}
                    <div className="flex items-center mt-4 w-full">
                        <div className="flex-grow border-t border-divider"></div>
                        <span
                            onClick={handleAddLink}
                            className="text-button-primary-fill mx-4 capitalize flex gap-1 items-center text-para-sm font-bold cursor-pointer hover:text-action-hover"
                        >
                            <IconPlus />
                            <span>{dictionary.components.assignment.replyPanel.addLinkText}</span>
                        </span>
                        <div className="flex-grow border-t border-divider"></div>
                    </div>
                </div>
            </div>
        </div>
    );
};
