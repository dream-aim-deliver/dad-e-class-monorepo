import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import downloadFilesElement from '../lib/components/course-builder-lesson-component/download-files';
import { CourseElementType } from '../lib/components/course-builder/types';
import { UploadResponse, UploadedFileType } from '../lib/components/drag-and-drop/uploader';

// Mock elementInstance for DesignerComponent
const designerElementInstance = {
    id: 'designer-1',
    type: CourseElementType.DownloadFiles,
    description: 'Download available course materials.',
    fileUrls: [],
    order: 1,
};

// Mock elementInstance for FormComponent with sample files
const formElementInstance = {
    id: 'form-1',
    type: CourseElementType.DownloadFiles,
    description: 'Download course materials below.',
    fileUrls: [
        {
            fileId: 'file-1',
            fileName: 'course-materials.pdf',
            fileSize: 1024 * 1024 * 2.5, // 2.5MB
        },
        {
            imageId: 'image-1',
            imageThumbnailUrl: 'https://via.placeholder.com/150',
            fileSize: 1024 * 1024 * 1.2, // 1.2MB
        },
        {
            videoId: 'video-1',
            thumbnailUrl: 'https://via.placeholder.com/150',
            fileSize: 1024 * 1024 * 5.8, // 5.8MB
        }
    ],
    order: 1,
};

const locale = 'en';

const meta: Meta = {
    title: 'Components/Course Builder/DownloadFiles',
    component: downloadFilesElement.designerComponent,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj;

// Designer Story with mock functionality
const DesignerStory: React.FC = () => {
    const [files, setFiles] = useState<UploadedFileType[]>([]);

    const handleChange = async (newFiles: UploadedFileType[]): Promise<UploadResponse> => {
        const uploadingFiles = newFiles.filter((f) => f.isUploading);
        setFiles(newFiles);

        return new Promise((resolve) => {
            if (uploadingFiles.length > 0) {
                setTimeout(() => {
                    try {
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
                    } catch (error) {
                        console.error('Upload error:', error);
                        resolve({
                            fileId: 'error',
                            fileName: 'Error uploading file',
                            fileSize: 0
                        });
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

    const handleFileDelete = (fileId: number) => {
        setFiles(files.filter((_, index) => index !== fileId));
    };

    const handleFileDownload = (fileId: number) => {
        console.log('Downloading file:', fileId);
        // In a real app, this would trigger the file download
    };

    return (
        <downloadFilesElement.designerComponent
            elementInstance={designerElementInstance}
            locale={locale}
            onUpClick={() => alert('Moving element up')}
            onDownClick={() => alert('Moving element down')}
            onDeleteClick={() => alert('Deleting element')}
            onChange={handleChange}
            onFileDelete={handleFileDelete}
            onFileDownload={handleFileDownload}
            files={files}
        />
    );
};

// Form Story
const FormStory: React.FC = () => (
    <downloadFilesElement.formComponent
        elementInstance={formElementInstance}
        locale={locale}
    />
);

export const Designer: Story = {
    render: () => <DesignerStory />
};

export const Form: Story = {
    render: () => <FormStory />
};