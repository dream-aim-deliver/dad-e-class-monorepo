import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { courseElements } from '../../lib/components/course-builder/course-builder-core';
import { CourseElementType } from '../../lib/components/course-builder/types';
import { fileMetadata } from '@maany_shr/e-class-models';
import { VideoFile as VideoFileType } from '../../lib/components/course-builder-lesson-component/types';

// Get components from courseElements
const { designerComponent: DesignerComponent, formComponent: FormComponent } = courseElements[CourseElementType.VideoFile];

type VideoFileWithMetadata = VideoFileType & fileMetadata.TFileMetadata;

// Define the props for our stories
interface StoryProps {
    locale: 'en' | 'de';
    elementInstance: VideoFileType;
}

const meta: Meta<StoryProps> = {
    title: 'Lesson Components/Video Uploader',
    component: DesignerComponent as unknown as React.ComponentType<StoryProps>,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Language locale (en/de)',
        },
        elementInstance: {
            control: 'object',
            description: 'Course element instance',
        },
        file: {
            control: 'object',
            description: 'Current file being displayed',
        },
        onVideoUpload: {
            action: 'onVideoUpload',
            description: 'Callback when a video is uploaded',
        },
        onUploadComplete: {
            action: 'onUploadComplete',
            description: 'Callback when upload is complete',
        },
        onFileDownload: {
            action: 'onFileDownload',
            description: 'Callback when file download is requested',
        },
        onFileDelete: {
            action: 'onFileDelete',
            description: 'Callback when file is deleted',
        },
        onUpClick: {
            action: 'onUpClick',
            description: 'Callback for moving element up',
        },
        onDownClick: {
            action: 'onDownClick',
            description: 'Callback for moving element down',
        },
        onDeleteClick: {
            action: 'onDeleteClick',
            description: 'Callback for deleting the element',
        },
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

const defaultElementInstance: VideoFileType = {
    id: '1',
    type: CourseElementType.VideoFile,
    order: 1,
    category: 'video',
};

// Mock file data
const mockFile: VideoFileWithMetadata = {
    id: 'file-123',
    name: 'sample-video.mp4',
    url: 'https://example.com/sample-video.mp4',
    thumbnailUrl: 'https://via.placeholder.com/600x400',
    videoId: 12345,
    size: 50 * 1024 * 1024, // 50MB
    mimeType: 'video/mp4',
    category: 'video',
    status: 'available',
    checksum: 'mock-checksum',
    type: CourseElementType.VideoFile,
    order: 1,
};

// Mock upload function that simulates an API call
const mockUpload = async (): Promise<VideoFileWithMetadata> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockFile);
        }, 1000);
    });
};

// Create a wrapper component that uses hooks
const VideoUploaderWrapper = (args: StoryProps) => {
    const [file, setFile] = useState<VideoFileWithMetadata | null>(null);

    const handleUpload = async (fileRequest: fileMetadata.TFileUploadRequest) => {
        console.log('Uploading video...', fileRequest);
        const uploadedFile = await mockUpload();
        return uploadedFile;
    };

    const handleUploadComplete = (uploadedFile: VideoFileWithMetadata) => {
        console.log('Upload complete:', uploadedFile);
        setFile(uploadedFile);
    };

    const handleDelete = () => {
        console.log('File deleted');
        setFile(null);
    };

    return (
        <div style={{ width: '800px' }}>
            <DesignerComponent
                elementInstance={args.elementInstance}
                file={file}
                onVideoUpload={handleUpload}
                onUploadComplete={handleUploadComplete}
                onFileDelete={handleDelete}
                onFileDownload={() => console.log('Download file')}
                onUpClick={() => { }}
                onDownClick={() => { }}
                onDeleteClick={() => { }}
                locale={args.locale}
            />
            <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                <h4>Current File State:</h4>
                <pre>{JSON.stringify(file, null, 2) || 'No file uploaded'}</pre>
            </div>
        </div>
    );
};

export const Default: Story = {
    render: (args) => <VideoUploaderWrapper {...args} />,
    args: {
        locale: 'en',
        elementInstance: defaultElementInstance,
    },
};

// Story with a pre-uploaded video
export const WithVideo: Story = {
    render: (args) => {
        const [file, setFile] = useState<VideoFileWithMetadata | null>(mockFile);

        const handleUpload = async (fileRequest: fileMetadata.TFileUploadRequest) => {
            console.log('Uploading video...', fileRequest);
            const uploadedFile = await mockUpload();
            return uploadedFile;
        };

        const handleUploadComplete = (uploadedFile: VideoFileWithMetadata) => {
            console.log('Upload complete:', uploadedFile);
            setFile(uploadedFile);
        };

        const handleDelete = () => {
            console.log('File deleted');
            setFile(null);
        };

        return (
            <div style={{ width: '800px' }}>
                <DesignerComponent
                    {...args}
                    file={file}
                    onVideoUpload={handleUpload}
                    onUploadComplete={handleUploadComplete}
                    onFileDelete={handleDelete}
                    onFileDownload={() => console.log('Download file')}
                    onUpClick={() => { }}
                    onDownClick={() => { }}
                    onDeleteClick={() => { }}
                    locale={args.locale}
                />
                <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                    <h4>Current File State:</h4>
                    <pre>{JSON.stringify(file, null, 2) || 'No file uploaded'}</pre>
                </div>
            </div>
        );
    },
    args: {
        ...Default.args,
    },
};

// Story with German locale
export const GermanLocale: Story = {
    render: (args) => <VideoUploaderWrapper {...args} />,
    args: {
        ...Default.args,
        locale: 'de',
    },
};

// Story for the form component
export const FormView: Story = {
    render: () => (
        <div style={{ width: '800px' }}>
            <FormComponent
                elementInstance={{
                    ...defaultElementInstance,
                    ...mockFile,
                }}
                locale="en"
            />
        </div>
    ),
    args: {
        locale: 'en',
        elementInstance: {
            ...defaultElementInstance,
            ...mockFile,
        },
    },
};
