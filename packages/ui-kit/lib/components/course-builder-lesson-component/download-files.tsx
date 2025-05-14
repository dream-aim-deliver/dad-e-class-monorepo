import { useState } from "react";
import { courseElement, CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconCloudDownload } from "../icons/icon-cloud-download";
import { UploadedFileType, Uploader, UploadResponse } from "../drag-and-drop/uploader";
import { IconFile } from "../icons/icon-file";
import { IconButton } from "../icon-button";
import { IconTrashAlt } from "../icons/icon-trash-alt";

const downloadFilesElement: CourseElementTemplate = {
    type: CourseElementType.DownloadFiles,
    designerBtnElement: {
        icon: IconCloudDownload,
        label: "Download Files"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};

function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick }: DesignerComponentProps) {
    if (elementInstance.type !== CourseElementType.DownloadFiles) return null;
    const dictionary = getDictionary(locale);
    const [files, setFiles] = useState<UploadedFileType[]>([]);

    const handleFilesChange = (newFiles: UploadedFileType[]): Promise<UploadResponse> => {
        const uploadingFiles = newFiles.filter((f) => f.isUploading);
        setFiles(newFiles);

        return new Promise((resolve) => {
            if (uploadingFiles.length > 0) {
                setTimeout(() => {
                    const processedFiles = newFiles.map((file) => {
                        if (file.isUploading) {
                            const fileType = file.file.type.split('/')[0];
                            let responseData: UploadResponse;

                            switch (fileType) {
                                case 'image':
                                    responseData = {
                                        imageId: `image-${Math.random().toString(36).substr(2, 9)}`,
                                        imageThumbnailUrl: URL.createObjectURL(file.file),
                                        fileSize: file.file.size,
                                    };
                                    break;
                                case 'video':
                                    responseData = {
                                        videoId: `video-${Math.random().toString(36).substr(2, 9)}`,
                                        thumbnailUrl: 'https://via.placeholder.com/150',
                                        fileSize: file.file.size,
                                    };
                                    break;
                                default:
                                    responseData = {
                                        fileId: `file-${Math.random().toString(36).substr(2, 9)}`,
                                        fileName: file.file.name,
                                        fileSize: file.file.size,
                                    };
                            }

                            return {
                                ...file,
                                isUploading: false,
                                responseData,
                            };
                        }
                        return file;
                    });

                    setFiles(processedFiles);
                    resolve(processedFiles[0].responseData);
                }, 2000);
            } else {
                resolve({
                    fileId: 'no-upload',
                    fileName: 'No file uploaded',
                    fileSize: 0
                });
            }
        });
    };

    const handleDelete = (index: number) => {
        setFiles(files.filter((_, i) => i !== index));
    };

    const handleDownload = (index: number) => {
        // Implement download logic here
    };

    return (
        <DesignerLayout
            type={elementInstance.type}
            title="Download"
            icon={<IconCloudDownload classNames="w-6 h-6" />}
            onUpClick={() => onUpClick(elementInstance.id)}
            onDownClick={() => onDownClick(elementInstance.id)}
            onDeleteClick={() => onDeleteClick(elementInstance.id)}
            locale={locale}
            courseBuilder={true}
        >
            <Uploader
                type="multiple"
                variant="file"
                files={files}
                maxFile={5}
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
    if (elementInstance.type !== CourseElementType.DownloadFiles) return null;
    const dictionary = getDictionary(locale);
    if ('fileUrls' in elementInstance) {
        return (
            <div className="text-text-primary flex flex-col gap-2">
                {elementInstance.fileUrls.map((file, index) => (
                    <div className="flex items-center justify-between gap-2 p-2 rounded-medium bg-base-neutral-900">
                        <div className="flex items-center gap-2">
                            <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border border-base-neutral-700">
                                <IconFile classNames="w-6 h-6 text-text-primary" />
                            </div>
                        </div>
                        <div className="flex flex-col flex-1 w-full gap-1 truncate">
                            <span
                                title={file.fileName}
                                className="text-sm font-medium text-text-primary truncate"
                            >
                                {file.fileName}
                            </span>
                            <span className="text-xs text-text-secondary">
                                {((file.fileSize || 0) / (1024 * 1024)).toFixed(2)} MB
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        );
    }
}

export default downloadFilesElement;