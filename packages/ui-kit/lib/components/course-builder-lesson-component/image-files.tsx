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

export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick }: DesignerComponentProps) {
    if (elementInstance.type !== CourseElementType.ImageFile) return null;
    const dictionary = getDictionary(locale);
    const [file, setFile] = useState<UploadedFileType | null>(null);

    const handleFilesChange = async (files: UploadedFileType[]): Promise<UploadResponse> => {
        if (files.length > 0) {
            const currentFile = files[0];
            setFile(currentFile);

            return new Promise((resolve) => {
                setTimeout(() => {
                    const response: UploadResponse = {
                        imageId: `image-${Math.random().toString(36).substr(2, 9)}`,
                        imageThumbnailUrl: URL.createObjectURL(currentFile.file),
                        fileSize: currentFile.file.size,
                    };
                    setFile({
                        ...currentFile,
                        isUploading: false,
                        responseData: response
                    });
                    resolve(response);
                }, 5000);
            });
        }
        setFile(null);
        return Promise.resolve({
            imageId: '',
            imageThumbnailUrl: '',
            fileSize: 0
        });
    };

    const handleDelete = () => {
        setFile(null);
    };

    const handleDownload = () => {
        //handle download logic here
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title="Image"
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
                onFilesChange={handleFilesChange}
                onDelete={handleDelete}
                onDownload={handleDownload}
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
    const dictionary = getDictionary(locale);
   return (
    <section className="w-ful">
        <img src={(elementInstance as ImageFilePreview).imageUrl}
            alt="Preview"
            className="w-full h-auto object-cover "/>
    </section>
   )
}

export default imageFilesElement;