import { useState } from "react";
import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import { getDictionary } from "@maany_shr/e-class-translations";
import { InputField } from "../input-field";
import { IconCloudUpload } from "../icons/icon-cloud-upload";
import { TextAreaInput } from "../text-areaInput";
import DesignerLayout from "../designer-layout";
import { fileMetadata } from "@maany_shr/e-class-models";
import { Uploader } from "../drag-and-drop-uploader/uploader";
import { uploadCoachingTypes } from "./types";




/**
 * Template configuration for the Upload Files course element
 * Defines the structure and components for file upload functionality in courses
 * Allows students to upload files and add comments for review
 */
const uploadFilesElement: CourseElementTemplate = {
    type: CourseElementType.UploadFiles,  // Changed from DownloadFiles to uploadFile
    designerBtnElement: {
        icon: IconCloudUpload,
        label: "Upload Files"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};

/**
 * Props interface for the Upload Files Designer component
 * Extends base designer props to handle description changes
 */
interface UploadFilesDesignerProps extends DesignerComponentProps {
    /** Callback function triggered when the description changes */
    onChange: (description: string) => void;
}
/**
 * Designer Component for Upload Files
 * Provides an interface for configuring file upload requirements and description
 * 
 * @param elementInstance - Current instance of the upload file element
 * @param locale - Current locale for internationalization
 * @param onUpClick - Callback for moving element up
 * @param onDownClick - Callback for moving element down
 * @param onDeleteClick - Callback for deleting element
 * @param onChange - Callback for handling description changes
 */
export function DesignerComponent({
    elementInstance,
    locale,
    onUpClick,
    onDownClick,
    onDeleteClick,
    onChange
}: UploadFilesDesignerProps) {
    if (elementInstance.type !== CourseElementType.UploadFiles) return null;
    const dictionary = getDictionary(locale);
    const [description, setDescription] = useState<string>(
        (elementInstance.type === CourseElementType.UploadFiles && 'description' in elementInstance)
            ? (elementInstance as uploadCoachingTypes).description
            : ""
    );

    /**
     * Handles changes to the description input field
     * Updates local state and triggers the onChange callback
     * 
     * @param newValue - The new description text
     */
    const handleValue = (newValue: string) => {
        setDescription(newValue);
        if (onChange) {
            onChange(newValue);
        }
    }

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.uploadFilesText}
            icon={<IconCloudUpload classNames="w-6 h-6" />}
            onUpClick={() => onUpClick(elementInstance.id)}
            onDownClick={() => onDownClick(elementInstance.id)}
            onDeleteClick={() => onDeleteClick(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <div>
                <label className="text-text-secondary text-sm md:text-md">
                    {dictionary.components.courseBuilder.descriptionText}
                </label>
                <InputField
                    inputText="e.g. Upload your resume"
                    value={description}
                    setValue={handleValue}
                />
            </div>
        </DesignerLayout>
    );
}

/**
 * Props interface for the Upload Files Form component
 * Extends base form props to handle file uploads and student comments
 */
export interface UploadFilesFormProps extends FormComponentProps {
    /** Callback function triggered when files are uploaded */
    onFilesUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadata | null>;
    /** Callback function triggered when upload is complete */
    onUploadComplete?: (file: fileMetadata.TFileMetadata) => void;
    /** Callback function to handle file deletion */
    onFileDelete: (id: string) => void;
    /** Callback function to handle file download */
    onFileDownload: (id: string) => void;
    /** Currently uploaded files or null if no files are uploaded */
    files: fileMetadata.TFileMetadata[] | null;
    /** Callback function triggered when student comment changes */
    onStudentCommentChange?: (newValue: string) => void;
}

/**
 * Form Component for handling file uploads and student comments
 * Provides interface for students to upload files and add comments
 * 
 * @param elementInstance - Current upload file element instance
 * @param locale - Current locale for internationalization
 * @param onFilesUpload - Callback for file uploads
 * @param onUploadComplete - Callback for upload completion
 * @param onFileDelete - Callback for file deletion
 * @param onFileDownload - Callback for file downloads
 * @param files - Currently uploaded files
 * @param onStudentCommentChange - Callback for comment changes
 */
export function FormComponent({
    elementInstance,
    locale,
    onFilesUpload,
    onUploadComplete,
    onFileDelete,
    onFileDownload,
    files,
    onStudentCommentChange
}: UploadFilesFormProps) {
    if (elementInstance.type !== CourseElementType.UploadFiles) return null;

    const [comment, setComment] = useState<string>("");
    const dictionary = getDictionary(locale);
    const handleStudentComment = (newValue: string) => {
        setComment(newValue);
        if (onStudentCommentChange) {
            onStudentCommentChange(newValue);
        }
    };

    const handleFilesUpload = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ): Promise<fileMetadata.TFileMetadata | null> => {
        return await onFilesUpload(fileRequest, abortSignal);
    };

    const handleUploadComplete = (fileMetadata: fileMetadata.TFileMetadata) => {
        onUploadComplete?.(fileMetadata);
    };

    const handleFileDelete = (id: string) => {
        onFileDelete(id);
    };

    const handleFileDownload = (id: string) => {
        onFileDownload(id);
    };

    return (
        <div className="p-4 border rounded-md bg-base-neutral-800 flex flex-col gap-4 border-base-neutral-700">
            <div className="flex items-center gap-2 flex-1 text-text-primary py-2 border-b border-divider">
                <span className="min-w-0"><IconCloudUpload /></span>
                <p className="text-md font-important leading-[24px] word-break ">{dictionary.components.courseBuilder.uploadFilesText}</p>
            </div>

            <p className="font-important text-text-primary leading-[24px]">
                {(elementInstance.type === CourseElementType.UploadFiles && 'description' in elementInstance)
                    && (elementInstance as uploadCoachingTypes).description
                    }
            </p>
            <Uploader
                type="multiple"
                variant="generic"
                files={files}
                maxFile={5}
                onFilesChange={handleFilesUpload}
                onUploadComplete={handleUploadComplete}
                onDelete={handleFileDelete}
                onDownload={handleFileDownload}
                locale={locale}
            />
            <div className="w-full flex flex-col gap-2">
                <p className="text-sm md:text-md text-text-secondary flex gap-1 items-center">
                    {dictionary.components.courseBuilder.additionalCommentsTooltip}
                </p>
                <TextAreaInput
                    setValue={handleStudentComment}
                    value={comment}
                    placeholder={dictionary.components.courseBuilder.additionalCommentsPlaceholder}
                />
            </div>
        </div>
    );
}

export default uploadFilesElement;