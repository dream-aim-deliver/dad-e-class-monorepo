import { getDictionary } from "@maany_shr/e-class-translations";
import { FC } from "react";
import { AssignmentBuilderViewTypes } from "../course-builder-lesson-component/types";
import { IconAssignment } from "../icons/icon-assignment";
import { FilePreview } from "../drag-and-drop-uploader/file-preview";
import { LinkPreview } from "../link";

export const AssignmentBuilderView: FC<AssignmentBuilderViewTypes> = ({
    assignmentData,
    locale
}) => {
    const dictionary = getDictionary(locale);

    return (
        <div className="flex flex-col gap-4 items-start bg-base-neutral-800 border-1 border-divider rounded-medium p-4 w-full">
            <div className="flex gap-1 items-center justify-center">
                <IconAssignment classNames="text-text-primary" />
                <p className="text-sm text-text-primary font-bold leading-[150%]">
                    {dictionary.components.assignment.assignmentBuilder.assignmentText}
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
                    {assignmentData.files.map((file, index) => (
                        <FilePreview
                            key={index}
                            uploadResponse={file}
                            index={index}
                            locale={locale}
                            onDelete={() => { }}
                            onDownload={() => { }}
                            onCancelUpload={() => { }}
                            className="bg-transparent p-0 w-full"
                            isDeleteAllowed={false}
                        />
                    ))}
                    {assignmentData.links.map((link, index) => (
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