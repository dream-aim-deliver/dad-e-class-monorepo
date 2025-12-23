'use client';
import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import type { ImageElement } from "./types";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconImage } from "../icons/icon-image";
import DesignerLayout from "../designer-layout";
import { fileMetadata } from "@maany_shr/e-class-models";
import { Uploader } from "../drag-and-drop-uploader/uploader";
import { useState } from "react";
import { ElementValidator } from '../lesson/types';
import DefaultError from '../default-error';
import { useImageComponent } from '../../contexts/image-component-context';

export const getValidationError: ElementValidator = (props) => {
    const { elementInstance, dictionary } = props;

    if (elementInstance.type !== CourseElementType.ImageFile)
        return dictionary.components.lessons.typeValidationText;

    // Check if an image file is attached
    if (!elementInstance.file) {
        return dictionary.components.imageLesson.imageValidationText;
    }

    // Validate image file metadata
    const file = elementInstance.file;
    if (!file.id || !file.name || !file.url) {
        return dictionary.components.imageLesson.metadataValidationText;
    }

    // Validate that it's an image file
    if (file.category !== 'image') {
        return dictionary.components.imageLesson.categoryValidationText;
    }

    if (file.status !== 'available') {
        return dictionary.components.imageLesson.statusValidationText;
    }

    // Validate URL format
    try {
        new URL(file.url);
    } catch {
        return dictionary.components.imageLesson.urlValidationText;
    }

    return undefined;
};

/**
 * @fileoverview Image file component for the course builder.
 * This file contains components and types for handling image uploads and display
 * in the course builder interface.
 */

/**
 * Configuration object for the image file element in the course builder.
 * Defines the type, button appearance, and component references for image handling.
 */
const imageFilesElement: CourseElementTemplate = {
    type: CourseElementType.ImageFile,
    designerBtnElement: {
        icon: IconImage,
        label: "Image"
    },
    designerComponent: DesignerComponent as React.FC<DesignerComponentProps>,
    formComponent: FormComponent
};

interface ImageFileEditProps extends DesignerComponentProps {
    /** Maximum file size allowed for upload in MB */
    maxSize: number;
    /** Callback function triggered when files are changed. Returns a Promise with upload response */
    onImageUpload: (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ) => Promise<fileMetadata.TFileMetadataImage | null>;

    onUploadComplete: (file: fileMetadata.TFileMetadataImage) => void;
    onFileDelete: () => void;
    /** Callback function to handle file download */
    onFileDownload: () => void;
    /** Current upload progress percentage (0-100) */
    uploadProgress?: number;
}

/**
 * Designer component for handling image file uploads in the course builder.
 * Provides a UI for uploading, viewing, and managing image files.
 * 
 * @param elementInstance - The current course element instance
 * @param locale - The current locale for translations
 * @param onUpClick - Callback for moving the element up
 * @param onDownClick - Callback for moving the element down
 * @param onDeleteClick - Callback for deleting the element
 * @param file - The current file being handled
 * @param onChange - Callback for file changes
 * @param onFileDownload - Callback for file downloads
 * @param onFileDelete - Callback for file deletion
 * @param onImageUpload - Callback for image uploads
 * @param onUploadComplete - Callback when upload is complete
 * @param maxSize - Maximum file size allowed for upload, in MB
 * @returns JSX.Element | null
 */
export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick, onImageUpload, onUploadComplete, onFileDownload, onFileDelete, maxSize, uploadProgress }: ImageFileEditProps) {
    if (elementInstance.type !== CourseElementType.ImageFile) return null;
    const dictionary = getDictionary(locale);
    const handleImageFile = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ): Promise<fileMetadata.TFileMetadataImage | null> => {
        return await onImageUpload(fileRequest, abortSignal);
    };

    const handleUploadComplete = (ImageMetadata: fileMetadata.TFileMetadata) => {
        // Update form data with the uploaded file URL (if it exists)
        // Notify parent component that upload is complete
        onUploadComplete?.(ImageMetadata as fileMetadata.TFileMetadataImage);
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.ImageFileText}
            icon={<IconImage classNames="w-6 h-6" />}
            onUpClick={() => onUpClick?.(elementInstance.id)}
            onDownClick={() => onDownClick?.(elementInstance.id)}
            onDeleteClick={() => onDeleteClick?.(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <Uploader
                type="single"
                variant="image"
                file={elementInstance.file}
                onFilesChange={handleImageFile as any}
                onUploadComplete={handleUploadComplete}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
                maxSize={maxSize}
                isDeletionAllowed={true}
                uploadProgress={uploadProgress}
            />
        </DesignerLayout>
    );
}

/**
 * Form component for displaying uploaded images in the course content.
 * Renders the image in a responsive container.
 * 
 * @param elementInstance - The course element instance containing image data
 * @returns JSX.Element | null - Returns null if the element is not an image file
 */
export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.ImageFile) return null;

    const ImageComponent = useImageComponent();
    const dictionary = getDictionary(locale);
    const validationError = getValidationError({ elementInstance, dictionary });
    if (validationError) {
        return (
            <DefaultError
                locale={locale}
                title={dictionary.components.lessons.elementValidationText}
                description={validationError}
            />
        );
    }

    // Type guard to ensure we're working with an ImageFile
    const imageFile = elementInstance as ImageElement;
    const [imageError, setImageError] = useState<boolean>(false);
    return (
        <section className="w-full flex justify-center p-4 rounded-lg">
            <div className="w-full max-w-[976px]">
                <ImageComponent
                    src={imageFile.file?.url}
                    alt="Uploaded image content"
                    className="w-full h-auto object-cover rounded-xl"
                    onError={() => setImageError(true)}
                />
            </div>
        </section>
    )
}

export default imageFilesElement;