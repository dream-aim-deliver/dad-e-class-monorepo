import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import type { ImageFile } from "./types";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconImage } from "../icons/icon-image";
import DesignerLayout from "../designer-layout";
import { fileMetadata } from "@maany_shr/e-class-models";
import { Uploader } from "../drag-and-drop-uploader/uploader";
import { useState } from "react";
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
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};

/**
 * Props interface for the image file edit component.
 * Extends DesignerComponentProps with additional properties for file handling.
 * @interface
 */
type TImageFile = fileMetadata.TFileMetadata & { category: 'image' };

interface ImageFileEditProps extends DesignerComponentProps {
    /** Callback function triggered when files are changed. Returns a Promise with upload response */
   onImageUpload: (
       fileRequest: fileMetadata.TFileUploadRequest,
       abortSignal?: AbortSignal
     ) => Promise<TImageFile | null>;

    onUploadComplete?: (file: TImageFile) => void;
    onFileDelete: () => void;
    /** Callback function to handle file download */
    onFileDownload: () => void;
    /** Currently selected file or null if no file is selected */
    file: TImageFile | null;
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
 * @returns JSX.Element | null
 */
export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick, file, onImageUpload,onUploadComplete, onFileDownload, onFileDelete }: ImageFileEditProps) {
    if (elementInstance.type !== CourseElementType.ImageFile) return null;
    const dictionary = getDictionary(locale);
    const handleImageFile = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
      ): Promise<TImageFile | null> => {
        return await onImageUpload(fileRequest, abortSignal);
      };

      const handleUploadComplete = (ImageMetadata:TImageFile) => {
        // Update form data with the uploaded file URL (if it exists)
        // Notify parent component that upload is complete
        onUploadComplete?.(ImageMetadata);
      };
    
    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.ImageFileText}
            icon={<IconImage classNames="w-6 h-6" />}
            onUpClick={() => onUpClick(Number(elementInstance.id))}
            onDownClick={() => onDownClick(Number(elementInstance.id))}
            onDeleteClick={() => onDeleteClick(Number(elementInstance.id))}
            locale={locale}
            courseBuilder={true}
        >
            <Uploader
                type="single"
                variant="image"
                file={file}
                onFilesChange={handleImageFile}
                onUploadComplete={handleUploadComplete}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
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
export function FormComponent({ elementInstance }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.ImageFile) return null;
    
    // Type guard to ensure we're working with an ImageFile
    const imageFile = elementInstance as ImageFile;
    const [imageError, setImageError] = useState<boolean>(false);
    return (
        <section className="w-full">
            <img 
                src={imageFile.url}
                alt="Uploaded image content"
                className="w-full h-auto object-cover"
                onError={() => setImageError(true)} 
            />
        </section>
    )
}

export default imageFilesElement;