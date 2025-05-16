import type { Meta, StoryObj } from '@storybook/react';
import { DesignerComponent, FormComponent } from '../lib/components/course-builder-lesson-component/image-files';
import { CourseElementType } from '../lib/components/course-builder/types';
import { ImageFile } from '../lib/components/course-builder-lesson-component/types';
import { useState } from 'react';
import { UploadedFileType, UploadResponse } from '../lib/components/drag-and-drop/uploader';

const meta: Meta<typeof DesignerComponent> = {
    title: 'Components/CourseBuilder/ImageFile',
    component: DesignerComponent,
    parameters: {
        layout: 'centered',
    },
argTypes:{
    locale:{
        control: {
            type: 'select',
            options: ['en', 'de'],
        },
    }
},
    tags: ['autodocs'],

};

export default meta;

type DesignerStory = StoryObj<typeof DesignerComponent>;
type FormStory = StoryObj<typeof FormComponent>;

// Designer Component Stories
const mockElementInstance: ImageFile = {
    id: '1',
    order: 0,
    type: CourseElementType.ImageFile,
    imageThumbnailUrl: 'https://picsum.photos/400/300',
    imageId: 'image-1',
}

// Wrapper component to handle state
const DesignerWithState = (args) => {
    const [file, setFile] = useState<UploadedFileType | null>(null);

    const handleFilesChange = async (files: UploadedFileType[]): Promise<UploadResponse> => {
        if (files.length > 0) {
            const currentFile = files[0];
            // Set initial uploading state
            setFile({
                ...currentFile,
                isUploading: true
            });

            // Simulate upload delay
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
                }, 2000); // 2 second delay
            });
        }
        
        setFile(null);
        return {
            imageId: '',
            imageThumbnailUrl: '',
            fileSize: 0
        };
    };

    const handleDelete = () => {
        setFile(null);
    };

    const handleDownload = () => {
        console.log('Download clicked');
    };

    return (
        <DesignerComponent
            {...args}
            file={file}
            onChange={handleFilesChange}
            onFileDelete={handleDelete}
            onFileDownload={handleDownload}
        />
    );
};

export const Designer: DesignerStory = {
    render: (args) => <DesignerWithState {...args} />,
    args: {
        elementInstance: mockElementInstance,
        locale: 'en',
        onUpClick: () => console.log('Move Up clicked'),
        onDownClick: () => console.log('Move Down clicked'),
        onDeleteClick: () => console.log('Delete clicked'),
    },
};

export const DesignerWithImage: DesignerStory = {
    render: (args) => <DesignerWithState {...args} />,
    args: {
        ...Designer.args,
        elementInstance: mockElementInstance,
        locale: 'en',
    },
};

// Form Component Stories remain the same
export const Form: FormStory = {
    render: (args) => (
        <FormComponent
            elementInstance={mockElementInstance}
            locale="en"
        />
    ),
};

export const FormWithoutImage: FormStory = {
    render: (args) => (
        <FormComponent
            elementInstance={{
                id: 'image-2',
                type: CourseElementType.ImageFile,
                order: 1,
                imageUrl: '',
            }}
            locale="en"
        />
    ),
};