import type { Meta, StoryObj } from '@storybook/react';
import videoFileElement, { DesignerComponent, FormComponent } from '../lib/components/course-builder-lesson-component/video-file';
import { CourseElementType } from '../lib/components/course-builder/types';
import { useState } from 'react';
import { UploadedFileType, UploadResponse } from '../lib/components/drag-and-drop/uploader';

const meta: Meta<typeof DesignerComponent> = {
    title: 'Components/CourseBuilder/VideoFile',
    component: DesignerComponent,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
};

export default meta;

type DesignerStory = StoryObj<typeof DesignerComponent>;
type FormStory = StoryObj<typeof FormComponent>;

// Mock element instance
const mockElementInstance = {
    id: '1',
    order: 1,
    type: CourseElementType.VideoFile,
    VideoId: 'vrJKveKVWWV3lAxGIWxlzaAsx9ArmD9KdGlgxmb1Rso'
};

// Wrapper component to handle state
const DesignerWithState = (args: Parameters<typeof DesignerComponent>[0]) => {
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
                        videoId: `video-${Math.random().toString(36).substr(2, 9)}`,
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
            videoId: '',
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
            onFilesChange={handleFilesChange}
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

export const DesignerWithVideo: DesignerStory = {
    render: (args) => <DesignerWithState {...args} />,
    args: {
        ...Designer.args,
        elementInstance: mockElementInstance,
        locale: 'en',
    },
};

export const Form: FormStory = {
    render: (args) => (
        <FormComponent
            elementInstance={mockElementInstance}
            locale="en"
        />
    ),
};

export const FormWithoutVideo: FormStory = {
    render: (args) => (
        <FormComponent
            elementInstance={{
                id: 'video-2',
                type: CourseElementType.VideoFile,
                order: 1,
                VideoId: '',
            }}
            locale="en"
        />
    ),
};

// Different locales
export const DesignerGerman: DesignerStory = {
    render: (args) => <DesignerWithState {...args} />,
    args: {
        ...Designer.args,
        locale: 'de',
    },
};

export const FormGerman: FormStory = {
    render: (args) => (
        <FormComponent
            elementInstance={mockElementInstance}
            locale="de"
        />
    ),
};