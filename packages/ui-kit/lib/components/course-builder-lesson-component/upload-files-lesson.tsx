'use client';

import { useState } from 'react';
import {
    CourseElementTemplate,
    CourseElementType,
    DesignerComponentProps,
    FormComponentProps,
} from '../course-builder/types';
import { getDictionary } from '@maany_shr/e-class-translations';
import { InputField } from '../input-field';
import { IconCloudUpload } from '../icons/icon-cloud-upload';
import { TextAreaInput } from '../text-areaInput';
import DesignerLayout from '../designer-layout';
import { fileMetadata } from '@maany_shr/e-class-models';
import { Uploader } from '../drag-and-drop-uploader/uploader';
import { ElementValidator } from '../lesson/types';
import DefaultError from '../default-error';

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary } = props;

    if (elementInstance.type !== CourseElementType.UploadFiles)
        return dictionary.components.lessons.typeValidationText;

    // Check if description is not empty
    if (
        !elementInstance.description ||
        elementInstance.description.trim().length === 0
    ) {
        return dictionary.components.uploadFileLesson.descriptionValidationText;
    }

    // If files are present, validate their metadata
    if (elementInstance.files && elementInstance.files.length > 0) {
        for (const file of elementInstance.files) {
            if (!file.id || !file.name || !file.url) {
                return dictionary.components.uploadFileLesson
                    .metadataValidationText;
            }

            // Validate URL format
            try {
                new URL(file.url);
            } catch {
                return dictionary.components.uploadFileLesson.urlValidationText;
            }
        }
    }

    return undefined;
};

/**
 * Template configuration for the Upload Files course element
 * Defines the structure and components for file upload functionality in courses
 * Allows students to upload files and add comments for review
 */
const uploadFilesElement: CourseElementTemplate = {
    type: CourseElementType.UploadFiles, // Changed from DownloadFiles to uploadFile
    designerBtnElement: {
        icon: IconCloudUpload,
        label: 'Upload Files',
    },
    designerComponent: DesignerComponent as React.FC<DesignerComponentProps>,
    // @ts-expect-error - Type mismatch between FormComponent props and expected interface
    formComponent: FormComponent,
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
    onChange,
    validationError,
}: UploadFilesDesignerProps) {
    if (elementInstance.type !== CourseElementType.UploadFiles) return null;
    const dictionary = getDictionary(locale);
    const [description, setDescription] = useState<string>(
        elementInstance.description ?? '',
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
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.uploadFilesText}
            icon={<IconCloudUpload classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
            validationError={validationError}
        >
            <div>
                <label className="text-text-secondary text-sm md:text-md">
                    {dictionary.components.courseBuilder.descriptionText}
                </label>
                <InputField
                    inputText={
                        dictionary.components.courseBuilder.uploadResumeText
                    }
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
        abortSignal?: AbortSignal,
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
    /** Current upload progress percentage (0-100) */
    uploadProgress?: number;
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
    onStudentCommentChange,
    files,
    uploadProgress,
}: UploadFilesFormProps) {
    if (elementInstance.type !== CourseElementType.UploadFiles) return null;

    const dictionary = getDictionary(locale);

    const validationError = getValidationError({ elementInstance, dictionary });
    if (validationError) {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={dictionary.components.lessons.elementValidationText}
                description={validationError}
            />
        );
    }

    const [comment, setComment] = useState<string>(elementInstance.userComment || '');
    const handleStudentComment = (newValue: string) => {
        setComment(newValue);
        if (onStudentCommentChange) {
            onStudentCommentChange(newValue);
        }
    };

    const handleFilesUpload = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
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
        <div className="p-4 pt-2 w-full border rounded-md bg-base-neutral-800 flex flex-col gap-4 border-base-neutral-700">
            <div className="flex items-center gap-2 flex-1 text-text-primary py-4 border-b border-divider">
                <span className="min-w-0 flex-shrink-0">
                    <IconCloudUpload />
                </span>
                <p className="text-md font-important leading-[24px] word-break ">
                    {dictionary.components.courseBuilder.uploadFilesText}
                </p>
            </div>

            <p className="font-important text-text-primary leading-[150%] text-sm md:text-md">
                {elementInstance.description}
            </p>
            <Uploader
                type="multiple"
                variant="generic"
                files={files as any}
                maxSize={50} // 50MB
                maxFile={5}
                onFilesChange={handleFilesUpload as any}
                onUploadComplete={handleUploadComplete}
                onDelete={handleFileDelete}
                onDownload={handleFileDownload}
                locale={locale}
                isDeletionAllowed={true} // Allow deletion of uploaded files
                uploadProgress={uploadProgress}
            />
            <div className="w-full flex flex-col gap-2">
                <p className="text-sm md:text-md text-text-secondary flex gap-1 items-center">
                    {
                        dictionary.components.courseBuilder
                            .additionalCommentsTooltip
                    }
                </p>
                <TextAreaInput
                    setValue={handleStudentComment}
                    value={comment}
                    placeholder={
                        dictionary.components.courseBuilder
                            .additionalCommentsPlaceholder
                    }
                />
            </div>
        </div>
    );
}

export default uploadFilesElement;
