import { Meta, StoryObj } from '@storybook/react';
import uploadFilesElement, { FormComponent } from '../lib/components/course-builder-lesson-component//upload-files';
import { CourseElementType } from '../lib/components/course-builder/types';

const meta: Meta<typeof FormComponent> = {
    title: 'Components/Course-builder/UploadFiles',
    component: FormComponent,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormComponent>;

// Designer Component Story
export const Designer = {
    render: () => {
        const elementInstance = {
            id: '1',
            type: CourseElementType.uploadFile,
            studentComment: '',
            description: 'Upload your files here',
            studentUploadedFiles: [],
            order: 1
        };

        return uploadFilesElement.designerComponent({
            elementInstance,
            locale: 'en',
            onUpClick: (id) => console.log('Up clicked', id),
            onDownClick: (id) => console.log('Down clicked', id),
            onDeleteClick: (id) => console.log('Delete clicked', id)
        });
    }
};

// Form Component Story
export const Form: Story = {
    args: {
        elementInstance: {
            id: '1',
            type: CourseElementType.uploadFile,
            studentComment: 'Initial comment',
            description: 'Please upload your assignment files',
            studentUploadedFiles: [],
            order: 1
        },
        locale: 'en',
    },
};

// Form Component with Multiple Files Story
export const FormWithFiles: Story = {
    args: {
        elementInstance: {
            id: '1',
            type: CourseElementType.uploadFile,
            studentComment: '',
            description: 'Upload multiple files',
            studentUploadedFiles: [
                {
                    fileId: 'file-1',
                    fileName: 'document.pdf',
                    fileSize: 1024000,
                    url: 'https://example.com/document.pdf',
                    uploadedAt: '2025-05-14T12:00:00Z'
                },
                {
                    imageId: 'image-1',
                    imageThumbnailUrl: 'https://via.placeholder.com/150',
                    fileSize: 512000,
                    url: 'https://example.com/image.jpg',
                    uploadedAt: '2025-05-14T12:00:00Z'
                }
            ],
            order: 1
        },
        locale: 'en',
    },
};