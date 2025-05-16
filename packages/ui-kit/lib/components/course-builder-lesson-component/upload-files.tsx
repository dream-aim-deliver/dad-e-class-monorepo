import { useState } from "react";
import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { UploadedFileType, Uploader, UploadResponse } from "../drag-and-drop/uploader";
import { InputField } from "../input-field";
import { UploadFileType } from "./types";
import { IconCloudUpload } from "../icons/icon-cloud-upload";
import { TextAreaInput } from "../text-areaInput";


/**
 * Template configuration for the Upload Files course element
 * Defines the structure and components for file upload functionality in courses
 * Allows students to upload files and add comments for review
 */
const uploadFilesElement: CourseElementTemplate = {
    type: CourseElementType.uploadFile,  // Changed from DownloadFiles to uploadFile
    designerBtnElement: {
        icon: IconCloudUpload,
        label: "Upload Files"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};

/**
 * Props interface for the Upload File Coach component
 * Extends base designer props to handle file description changes
 */
interface UploadFileCoach extends DesignerComponentProps {
    /** Callback function triggered when the description changes, returns a Promise with upload response */
    onChange: (description: string) => Promise<UploadResponse>;
}
/**
 * Designer Component for Upload Files
 * Provides an interface for configuring file upload requirements and description
 * 
 * @param param0 - Component props
 * @param param0.elementInstance - Current instance of the upload file element
 * @param param0.locale - Current locale for internationalization
 * @param param0.onUpClick - Callback for moving element up
 * @param param0.onDownClick - Callback for moving element down
 * @param param0.onDeleteClick - Callback for deleting element
 * @param param0.onChange - Callback for handling description changes
 */
export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick, onChange }: UploadFileCoach) {
    if (elementInstance.type !== CourseElementType.uploadFile) return null;
    const dictionary = getDictionary(locale);
    const [description, setDescription] = useState<string>("");
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
                <label className="text-text-secondary">
                    {dictionary.components.courseBuilder.descriptionText}
                </label>
                <InputField
                    placeholder="e.g. Upload your resume"
                    value={description}
                    setValue={handleValue}

                />
            </div>

        </DesignerLayout>
    );
}

/**
 * Form Component for Upload Files
 * Renders the upload form and handles file uploads and student comments
 */
interface UploadFileFormProps extends FormComponentProps {
    /** Callback function when either files or comment changes */
    onFileDelete?: (fileId: number) => void;
    onFileDownload?: (fileId: number) => void;
    files?: UploadedFileType[] | null;
    onFilesChange?: (newFiles: UploadedFileType[]) => Promise<UploadResponse>;
    onStudentCommentChange?: (newValue: string) => void;
}

/**
 * Form Component for handling file uploads and student comments
 * Provides interface for students to upload files and add comments
 * 
 * @param param0 - Component props
 * @param param0.elementInstance - Current upload file element instance
 * @param param0.locale - Current locale for internationalization
 * @param param0.onStudentCommentChange - Callback for comment changes
 * @param param0.onFileDelete - Callback for file deletion
 * @param param0.onFileDownload - Callback for file downloads
 * @param param0.files - Currently uploaded files
 * @param param0.onFilesChange - Callback for file changes
 */
export function FormComponent({
    elementInstance,
    locale,
    onStudentCommentChange,
    onFileDelete,
    onFileDownload,
    files,
    onFilesChange
}: UploadFileFormProps) {
    if (elementInstance.type !== CourseElementType.uploadFile) return null;

    const [comment, setComment] = useState<string>(
        ("studentComment" in elementInstance) ? elementInstance.studentComment : ""
    );

    /**
     * Handles changes to student comments
     * Updates local state and triggers the onChange callback
     * 
     * @param newValue - The new comment text
     */
    const handleStudentComment = (newValue: string) => {
        setComment(newValue);
        if (onStudentCommentChange) {
            onStudentCommentChange(newValue);
        }
    };
    return (
        <div className="p-4 border rounded-md bg-base-neutral-800 flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-1 text-text-primary py-2 border-b border-divider">
                <span className="min-w-0"><IconCloudUpload /></span>
                <p className="text-md font-important leading-[24px] word-break">Upload</p>
            </div>

            <p className="font-important text-text-primary leading-[24px]">{(elementInstance as UploadFileType).description}</p>
            <Uploader
                type="multiple"
                variant="file"
                files={files || []}
                maxFile={5}
                onFilesChange={onFilesChange}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
            />
            <div className="w-full">
                <TextAreaInput
                    setValue={handleStudentComment}
                    value={comment}
                    placeholder="Write additional comments here"
                />
            </div>
        </div>
    );
}

export default uploadFilesElement;