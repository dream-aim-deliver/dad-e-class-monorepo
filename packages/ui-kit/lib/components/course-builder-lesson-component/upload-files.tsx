import { useState } from "react";
import {  CourseElementTemplate, CourseElementType, DesignerComponentProps, FormComponentProps } from "../course-builder/types";
import DesignerLayout from "./designer-layout";
import { getDictionary } from "@maany_shr/e-class-translations";
import { UploadedFileType, Uploader, UploadResponse } from "../drag-and-drop/uploader";
import { InputField } from "../input-field";
import { UploadFileType } from "./types";
import { IconCloudUpload } from "../icons/icon-cloud-upload";
import { TextAreaInput } from "../text-areaInput";


const uploadFilesElement: CourseElementTemplate = {
    type: CourseElementType.uploadFile,  // Changed from DownloadFiles to uploadFile
    designerBtnElement: {
        icon: IconCloudUpload,
        label: "Upload Files"
    },
    designerComponent: DesignerComponent,
    formComponent: FormComponent
};

export function DesignerComponent({ elementInstance, locale, onUpClick, onDownClick, onDeleteClick }: DesignerComponentProps) {
    if (elementInstance.type !== CourseElementType.uploadFile) return null;
    const dictionary = getDictionary(locale);
    const [value, setValue] = useState<string>("");

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
                    value={value}
                    setValue={setValue}
                />
            </div>

        </DesignerLayout>
    );
}

/**
 * Form Component for Download Files
 * Renders the rich text content in the form view
 */
export function FormComponent({ elementInstance, locale }: FormComponentProps) {
    if (elementInstance.type !== CourseElementType.uploadFile) return null;
    const [files, setFiles] = useState<UploadedFileType[]>([]);
    const [value, seValue] = useState<string>((elementInstance as UploadFileType).studentComment);
    console.log(value, files)
    const handleFilesChange = (newFiles: UploadedFileType[]): Promise<UploadResponse> => {
        const uploadingFiles = newFiles.filter((f) => f.isUploading);
        setFiles(newFiles);

        return new Promise((resolve, reject) => {
            if (uploadingFiles.length > 0) {
                setTimeout(() => {
                    try {
                        const processedFiles = newFiles.map((file) => {
                            if (file.isUploading) {
                                const fileType = file.file.type.split('/')[0];
                                let responseData: UploadResponse;

                                // Validate file size (max 10MB)
                                if (file.file.size > 10 * 1024 * 1024) {
                                    throw new Error(`File ${file.file.name} exceeds maximum size of 10MB`);
                                }

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
                                    case 'application':
                                    case 'text':
                                        responseData = {
                                            fileId: `file-${Math.random().toString(36).substr(2, 9)}`,
                                            fileName: file.file.name,
                                            fileSize: file.file.size,
                                        };
                                        break;
                                    default:
                                        throw new Error(`Unsupported file type: ${fileType}`);
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
                    } catch (error) {
                        const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
                        setFiles(newFiles.map(file => ({
                            ...file,
                            isUploading: false,
                            error: errorMessage
                        })));
                        reject(error);
                    }
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
        <div className="p-4 border rounded-md bg-base-neutral-800 flex flex-col gap-4">
            <div className="flex items-center gap-2 flex-1 text-text-primary py-2  border-b border-divider">
                <span className="min-w-0"><IconCloudUpload /></span>
                <p className="text-md font-important leading-[24px] word-break">Upload</p>
            </div>

            <p className="font-important text-text-primary leading-[24px]">{(elementInstance as UploadFileType).description}</p>
            <Uploader
                type="multiple"
                variant="file"
                files={files}
                maxFile={5}
                onFilesChange={handleFilesChange}
                locale={locale}
            />
            <div className="w-full">
                <TextAreaInput

                    setValue={seValue}
                    value={value}
                    placeholder="write additional comments here"
                />
            </div>
        </div>
    )
}

export default uploadFilesElement;