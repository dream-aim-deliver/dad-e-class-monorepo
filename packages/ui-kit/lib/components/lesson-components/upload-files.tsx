'use client';

import { useState, useEffect } from 'react';
import { IconCloudUpload } from '../icons/icon-cloud-upload';
import {
    FormElement,
    FormElementTemplate,
    FormElementType,
    DesignerComponentProps,
    FormComponentProps,
    SubmissionComponentProps,
} from '../pre-assessment/types';
import { PreAssessmentUploadFilesElement } from './types';
import DesignerLayout from '../designer-layout';
import { ElementValidator } from '../lesson/types';
import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import DefaultError from '../default-error';
import { InputField } from '../input-field';
import { TextAreaInput } from '../text-areaInput';
import { Uploader } from '../drag-and-drop-uploader/uploader';
import { FilePreview } from '../drag-and-drop-uploader/file-preview';
import { fileMetadata } from '@maany_shr/e-class-models';

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary, context = 'coach' } = props;

    if (elementInstance.type !== FormElementType.UploadFiles)
        return dictionary.components.lessons.typeValidationText;

    // Student validation: Always check if files are uploaded (actual form submission)
    // Note: Comment field is optional
    if (context === 'student') {
        if (
            !elementInstance.files ||
            elementInstance.files.length === 0
        ) {
            return dictionary.components.formRenderer.fieldRequired;
        }
        return undefined; // Student validation passed
    }

    // Coach validation: Check if description is not empty
    if (
        !elementInstance.description ||
        elementInstance.description.trim().length === 0
    ) {
        return dictionary.components.uploadFileLesson.descriptionValidationText;
    }

    return undefined;
};

/**
 * Template for the upload files form element
 * Defines the component's behavior, validation, and UI elements
 */
const uploadFilesElement: FormElementTemplate = {
    type: FormElementType.UploadFiles,
    designerBtnElement: {
        icon: IconCloudUpload,
        label: 'Upload Files',
    },
    // @ts-ignore
    designerComponent: DesignerComponent,
    formComponent: FormComponent,
    submissionComponent: ViewComponent,
};

/**
 * Designer Component for Upload Files
 * Provides an interface for configuring file upload requirements and description
 */
interface UploadFilesDesignerProps extends DesignerComponentProps {
    onDescriptionChange: (description: string) => void;
    onRequiredChange: (isRequired: boolean) => void;
}

export function DesignerComponent({
    elementInstance,
    locale,
    onUpClick,
    onDownClick,
    onDeleteClick,
    onDescriptionChange,
    onRequiredChange,
    validationError,
    isCourseBuilder,
}: UploadFilesDesignerProps) {
    if (elementInstance.type !== FormElementType.UploadFiles) return null;
    const dictionary = getDictionary(locale);
    const [description, setDescription] = useState<string>(
        elementInstance.description ?? '',
    );
    const [isRequired, setIsRequired] = useState<boolean>(
        elementInstance.required || false,
    );

    const handleValue = (newValue: string) => {
        setDescription(newValue);
        if (onDescriptionChange) {
            onDescriptionChange(newValue);
        }
    };

    const handleRequiredChange = () => {
        setIsRequired((prev) => !prev);
        onRequiredChange(!isRequired);
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
            courseBuilder={isCourseBuilder}
            isChecked={isRequired}
            onChange={handleRequiredChange}
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
 * Form Component for Upload Files
 * Provides interface for students to upload files and add comments
 */
export function FormComponent({
    elementInstance,
    submitValue,
    locale,
    onFileUpload,
    courseSlug,
    disableValidation,
}: FormComponentProps) {
    if (elementInstance.type !== FormElementType.UploadFiles) return null;

    const dictionary = getDictionary(locale);
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>(
        elementInstance.files || [],
    );
    const [comment, setComment] = useState<string>(
        elementInstance.userComment || '',
    );

    if (!disableValidation) {
        const validationError = getValidationError({
            elementInstance,
            dictionary,
            context: 'coach',
        });
        if (validationError) {
            return (
                <DefaultError
                    locale={locale}
                    title={dictionary.components.lessons.elementValidationText}
                    description={validationError}
                />
            );
        }
    }

    // Update element when files or comment change
    useEffect(() => {
        if (submitValue) {
            const updatedElement: PreAssessmentUploadFilesElement = {
                ...elementInstance,
                files: files.length > 0 ? files : null,
                userComment: comment || null,
            };
            submitValue(elementInstance.id, updatedElement);
        }
    }, [files, comment, elementInstance.id]);

    // File upload handler - requires real upload handler
    const handleFilesUpload = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ): Promise<fileMetadata.TFileMetadata | null> => {
        if (abortSignal?.aborted) {
            return null;
        }

        // Require real upload handler and course slug
        if (!onFileUpload || !courseSlug) {
            throw new Error(
                'File upload handler and course slug are required for file uploads',
            );
        }

        try {
            const uploadedFile = await onFileUpload(
                fileRequest,
                elementInstance.id,
                courseSlug,
                abortSignal,
            );
            return uploadedFile;
        } catch (error) {
            console.error('File upload failed:', error);
            // Re-throw to let Uploader component handle the error
            throw error;
        }
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
        setFiles((prev) => {
            // Check if the file already exists to avoid duplicates
            if (prev.some((f) => f.id === file.id)) {
                return prev;
            }
            return [...prev, file];
        });
    };

    const handleFileDelete = (id: string) => {
        setFiles((prev) => prev.filter((file) => file.id !== id));
    };

    const handleFileDownload = (id: string) => {
        const file = files.find((f) => f.id === id);
        if (file && file.url) {
            window.open(file.url, '_blank');
        }
    };

    const handleStudentComment = (newValue: string) => {
        setComment(newValue);
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
                isDeletionAllowed={true}
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

/**
 * View Component for Upload Files
 * Renders the read-only view of uploaded files and comments
 */
function ViewComponent({
    elementInstance,
    locale,
}: SubmissionComponentProps) {
    if (elementInstance.type !== FormElementType.UploadFiles) return null;
    const uploadElement = elementInstance as PreAssessmentUploadFilesElement;
    const dictionary = getDictionary(locale);

    const handleFileDownload = (fileId: string) => {
        const file = uploadElement.files?.find((f) => f.id === fileId);
        if (file && file.url) {
            window.open(file.url, '_blank');
        }
    };

    return (
        <div className="p-4 pt-2 w-full border rounded-md bg-base-neutral-800 flex flex-col gap-4 border-base-neutral-700">
            <div className="flex items-center gap-2 flex-1 text-text-primary py-4 border-b border-divider">
                <span className="min-w-0 flex-shrink-0">
                    <IconCloudUpload />
                </span>
                <p className="text-md font-important leading-[24px] word-break">
                    {dictionary.components.courseBuilder.uploadFilesText}
                </p>
            </div>

            <p className="font-important text-text-primary leading-[150%] text-sm md:text-md">
                {uploadElement.description}
            </p>

            {uploadElement.files && uploadElement.files.length > 0 && (
                <div className="flex flex-col gap-2 w-full">
                    {uploadElement.files.map((file, index) => (
                        <FilePreview
                            key={file.id || `file-${index}`}
                            uploadResponse={file}
                            locale={locale}
                            readOnly={true}
                            deletion={{ isAllowed: false }}
                            onDownload={() => handleFileDownload(file.id as string)}
                        />
                    ))}
                </div>
            )}

            {uploadElement.userComment && (
                <div className="w-full flex flex-col gap-2">
                    <p className="text-sm md:text-md text-text-secondary flex gap-1 items-center">
                        {
                            dictionary.components.courseBuilder
                                .additionalCommentsTooltip
                        }
                    </p>
                    <p className="text-sm text-text-primary">{uploadElement.userComment}</p>
                </div>
            )}
        </div>
    );
}

export default uploadFilesElement;

