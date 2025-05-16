
import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { UploadedFileType, Uploader, UploadResponse } from "../drag-and-drop/uploader";
import { IconImage } from "../icons/icon-image";
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
interface ImageFileEditProps extends DesignerComponentProps  {
    /** Callback function triggered when files are changed. Returns a Promise with upload response */
    onChange: (files: UploadedFileType[]) => Promise<UploadResponse>;
    /** Callback function to handle file deletion */
    onFileDelete: () => void;
    /** Callback function to handle file download */
    onFileDownload: () => void;
    /** Currently selected file or null if no file is selected */
    file: UploadedFileType | null;
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
export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick, file, onChange, onFileDownload, onFileDelete }: ImageFileEditProps) {
    if (elementInstance.type !== CourseElementType.ImageFile) return null;
    const dictionary = getDictionary(locale);
    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.ImageFileText}
            icon={<IconImage classNames="w-6 h-6" />}
            onUpClick={() => onUpClick(elementInstance.id)}
            onDownClick={() => onDownClick(elementInstance.id)}
            onDeleteClick={() => onDeleteClick(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <Uploader
                type="single"
                variant="image"
                file={file}
                onFilesChange={onChange}
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
export function FormComponent({ elementInstance}: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.ImageFile) return null;
   return (
    <section className="w-full">
        <img src={"imageUrl" in elementInstance ? elementInstance.imageUrl : ""}
            alt="Uploaded image content" 
            className="w-full h-auto object-cover "/>
    </section>
   )
}

export default imageFilesElement;