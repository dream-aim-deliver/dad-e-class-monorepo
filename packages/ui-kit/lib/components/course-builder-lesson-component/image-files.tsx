import { useState } from "react";
import { courseElement, CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconCloudDownload } from "../icons/icon-cloud-download";
import { UploadedFileType, Uploader, UploadResponse } from "../drag-and-drop/uploader";
import { ImageFilePreview } from "./types";
import { IconImage } from "../icons/icon-image";

const imageFilesElement: CourseElementTemplate = {
    type: CourseElementType.ImageFile,
    designerBtnElement: {
        icon: IconImage,
        label: "Image"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};
interface ImageFileEditProps extends DesignerComponentProps  {
  onFilesChange: (files: UploadedFileType[]) => Promise<UploadResponse>;
  onFileDelete: () => void;
  onFileDownload: () => void;
  file: UploadedFileType | null;
}
export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick, file, onFilesChange, onFileDownload, onFileDelete }: ImageFileEditProps) {
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
                onFilesChange={onFilesChange}
                onDelete={onFileDelete}
                onDownload={onFileDownload}
                locale={locale}
            />
        </DesignerLayout>
    );
}

/**
 * Form Component for Download Files
 * Renders the rich text content in the form view
 */
export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.ImageFile) return null;
   return (
    <section className="w-ful">
        <img src={(elementInstance as ImageFilePreview).imageUrl}
            alt="Preview"
            className="w-full h-auto object-cover "/>
    </section>
   )
}

export default imageFilesElement;