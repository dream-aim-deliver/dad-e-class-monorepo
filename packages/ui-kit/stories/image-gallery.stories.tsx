import type { Meta, StoryObj } from '@storybook/react';
import { DesignerComponent, FormComponent } from '../lib/components/course-builder-lesson-component/images-gallery';
import { CourseElementType, courseElement } from '../lib/components/course-builder/types';
import { useState } from 'react';
import { UploadedFileType, UploadResponse } from '../lib/components/drag-and-drop/uploader';

const meta: Meta<typeof DesignerComponent> = {
    title: 'Components/CourseBuilder/Images Gallery',
    component: DesignerComponent,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof DesignerComponent>;

// Mock element instance for stories
const mockElementInstance: courseElement = {
    id: 'gallery-1',
    type: CourseElementType.ImageGallery,
    order: 1,
    imageUrls: [
        'https://picsum.photos/400/300?random=1',
        'https://picsum.photos/400/300?random=2',
        'https://picsum.photos/400/300?random=3'
    ]
};

// Wrapper component to handle state
const DesignerWithState = (args: Parameters<typeof DesignerComponent>[0]) => {
    const [files, setFiles] = useState<UploadedFileType[]>([]);

    const handleFilesChange = async (files: UploadedFileType[]): Promise<UploadResponse> => {
            // Find which files are new (still uploading)
            const uploadingFiles = files.filter((f) => f.isUploading);
    
            // Set the files immediately with loading state
            setFiles(files);
    
            // Process each uploading file
            if (uploadingFiles.length > 0) {
                const processedFiles = files.map((file) => {
                    if (file.isUploading) {
                        return {
                            ...file,
                            isUploading: false,
                            responseData: {
                                imageId: `image-${Math.random().toString(36).substr(2, 9)}`,
                                imageThumbnailUrl: URL.createObjectURL(file.file),
                                fileSize: file.file.size,
                            },
                        };
                    }
                    return file;
                });
    
                setFiles(processedFiles);
                
                // Return the response for the last uploaded file
                const lastUploadedFile = processedFiles[processedFiles.length - 1];
                return Promise.resolve(lastUploadedFile.responseData);
            }
    
            // If no files are uploading, return an empty response
            return Promise.resolve({
                imageId: '',
                imageThumbnailUrl: '',
                fileSize: 0
            });
        };
    const handleDelete = () => {
       alert('File deleted');
    };

    const handleDownload = () => {
        alert('File downloaded');
    };

    return (
        <DesignerComponent
            {...args}
            files={files}
            onFilesChange={handleFilesChange}
            onFileDelete={handleDelete}
            onFileDownload={handleDownload}
        />
    );
};

export const Designer: Story = {
    render: (args) => <DesignerWithState {...args} />,
    args: {
        elementInstance: mockElementInstance,
        locale: 'en',
        onUpClick: (id) => console.log('Move up:', id),
        onDownClick: (id) => console.log('Move down:', id),
        onDeleteClick: (id) => console.log('Delete:', id),
    },
};

export const DesignerWithImages: Story = {
    render: (args) => <DesignerWithState {...args} />,
    args: {
        ...Designer.args,
        elementInstance: {
            ...mockElementInstance,
            imageUrls: [
                'https://picsum.photos/400/300?random=1',
                'https://picsum.photos/400/300?random=2',
                'https://picsum.photos/400/300?random=3',
                'https://picsum.photos/400/300?random=4',
                'https://picsum.photos/400/300?random=5'
            ]
        }
    },
};

export const FormView: StoryObj<typeof FormComponent> = {
    render: (args) => (
        <div className="max-w-4xl mx-auto">
            <FormComponent
                elementInstance={mockElementInstance}
                locale="en"
            />
        </div>
    ),
};

export const FormWithoutImages: StoryObj<typeof FormComponent> = {
    render: (args) => (
        <div className="max-w-4xl mx-auto">
            <FormComponent
                elementInstance={{
                    id: 'gallery-2',
                    type: CourseElementType.ImageGallery,
                    order: 1,
                    imageUrls: []
                }}
                locale="en"
            />
        </div>
    ),
};

// Mobile view story
export const FormViewMobile: StoryObj<typeof FormComponent> = {
    parameters: {
        viewport: {
            defaultViewport: 'mobile1'
        },
    },
    render: FormView.render,
};

// Tablet view story
export const FormViewTablet: StoryObj<typeof FormComponent> = {
    parameters: {
        viewport: {
            defaultViewport: 'tablet'
        },
    },
    render: FormView.render,
};