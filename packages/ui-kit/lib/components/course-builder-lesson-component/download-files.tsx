import { useState } from "react";
import { CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { IconCloudDownload } from "../icons/icon-cloud-download";
import { UploadedFileType, Uploader, UploadResponse } from "../drag-and-drop/uploader";
import { IconFile } from "../icons/icon-file";
import { IconVideo } from "../icons/icon-video";
import { IconEdit } from "../icons/icon-edit";
import { IconTrashAlt } from "../icons/icon-trash-alt";
import {IconButton} from "../icon-button";

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


    return (
        <DesignerLayout
            type={elementInstance.type}
            title={dictionary.components.courseBuilder.downloadFilesText}
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
    if ('fileUrls' in elementInstance) {
        return (
            <div className="text-text-primary flex flex-col gap-2">
                {elementInstance.fileUrls.map((file, index) => {
                    // Determine the file type based on response data properties
                    const isImage = 'imageId' in file && 'imageThumbnailUrl' in file;
                    const isVideo = 'videoId' in file && 'thumbnailUrl' in file;

                    // Get display name based on file type
                    const getDisplayName = () => {
                        if (isImage) return 'Image';
                        if (isVideo) return 'Video';
                        return 'fileId' in file && 'fileName' in file ? file.fileName : 'File';
                    };

                    return (
                        <div key={index} className="flex items-center justify-between gap-2 p-2 rounded-medium bg-base-neutral-900">
                            <div className="flex items-center gap-2">
                                <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border border-base-neutral-700">
                                    {isImage ? (
                                        <img
                                            src={file.imageThumbnailUrl}
                                            alt="Image preview"
                                            className="w-10 h-10 object-cover rounded-small"
                                        />
                                    ) : isVideo ? (
                                        <div className="w-12 h-12 flex items-center justify-center rounded-medium bg-base-neutral-800 border border-base-neutral-700 relative">
                                            
                                            <IconVideo classNames="w-6 h-6 text-text-primary" />
                                        </div>
                                    ) : (
                                        <IconFile classNames="w-6 h-6 text-text-primary" />
                                    )}
                                </div>
                            </div>
                            <div className="flex flex-col flex-1 w-full gap-1 truncate">
                                <span
                                    title={getDisplayName()}
                                    className="text-sm font-medium text-text-primary truncate"
                                >
                                    {getDisplayName()}
                                </span>
                                <span className="text-xs text-text-secondary">
                                    {((file.fileSize || 0) / (1024 * 1024)).toFixed(2)} MB
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <IconButton
                                    icon={<IconEdit />}
                                    size="small"
                                    styles="text"
                                    title="Edit file"
                                />
                                <IconButton
                                    icon={<IconTrashAlt />}
                                    size="small"
                                    styles="text"
                                    title="Delete file"

                                />
                            </div>
                        </div>
                    );
                })}
            </div>
        );
    }
    return null;
}

export default downloadFilesElement;