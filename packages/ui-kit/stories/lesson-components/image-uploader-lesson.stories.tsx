import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { courseElements } from '../../lib/components/course-builder/course-builder-core';
import { CourseElementType } from '../../lib/components/course-builder/types';
import { fileMetadata } from '@maany_shr/e-class-models';
import { ImageFile as ImageFileType } from '../../lib/components/course-builder-lesson-component/types';

// Get components from courseElements
const { designerComponent: DesignerComponent, formComponent: FormComponent } = courseElements.ImageFile;

type ImageFileWithMetadata = ImageFileType & fileMetadata.TFileMetadata;

// Define the props for our stories
interface StoryProps {
    locale: 'en' | 'de';
    elementInstance: ImageFileType;
}

const meta: Meta<StoryProps> = {
    title: 'Lesson Components/Image Uploader',
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
        onImageUpload: {
            action: 'onImageUpload',
            description: 'Callback when an image is uploaded',
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

const defaultElementInstance: ImageFileType = {
    id: '1',
    type: CourseElementType.ImageFile,
    order: 1,
    category: 'image',
};

// Mock file data
const mockFile: ImageFileWithMetadata = {
    id: 'file-123',
    name: 'sample-image.jpg',
    url: 'https://via.placeholder.com/600x400',
    thumbnailUrl: 'https://via.placeholder.com/600x400',
    size: 1024 * 1024, // 1MB
    mimeType: 'image/jpeg',
    category: 'image',
    status: 'available',
    checksum: 'mock-checksum',
    type: CourseElementType.ImageFile,
    order: 1,
};

// Mock upload function that simulates an API call
const mockUpload = async (): Promise<ImageFileWithMetadata> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockFile);
        }, 1000);
    });
};

interface ImageUploaderWithStateProps extends Omit<DesignerComponentProps, 'elementInstance'> {
    elementInstance: ImageFileType;
    file: ImageFileWithMetadata | null;
    onImageUpload: (file: File) => Promise<ImageFileWithMetadata>;
    onUploadComplete: (file: ImageFileWithMetadata) => void;
    onFileDelete: () => void;
    onFileDownload: () => void;
}

const ImageUploaderWithState = (args: Omit<ImageUploaderWithStateProps, 'file' | 'onImageUpload' | 'onUploadComplete' | 'onFileDelete' | 'onFileDownload'>) => {
    const [file, setFile] = useState<ImageFileWithMetadata | null>(null);

    const handleUpload = async (file: File) => {
        console.log('Uploading image...');
        const uploadedFile = await mockUpload();
        return uploadedFile;
    };

    const handleUploadComplete = (uploadedFile: ImageFileWithMetadata) => {
        console.log('Upload complete:', uploadedFile);
        setFile(uploadedFile);
    };

    const handleDelete = () => {
        console.log('File deleted');
        setFile(null);
    };

    return (
        <div style={{ width: '600px' }}>
            <DesignerComponent
                {...args}
                elementInstance={defaultElementInstance}
                file={file}
                onImageUpload={handleUpload}
                onUploadComplete={handleUploadComplete}
                onFileDelete={handleDelete}
                onFileDownload={() => console.log('Download file')}
                onUpClick={() => { }}
                onDownClick={() => { }}
                onDeleteClick={() => { }}
                locale="en"
            />
            <div style={{ marginTop: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '4px' }}>
                <h4>Current File State:</h4>
                <pre>{JSON.stringify(file, null, 2) || 'No file uploaded'}</pre>
            </div>
        </div>
    );
};

// Create a wrapper component that uses hooks
const ImageUploaderWrapper = (args: StoryProps) => {
    const [file, setFile] = useState<ImageFileWithMetadata | null>(null);

    const handleUpload = async () => {
        const uploadedFile = await mockUpload();
        return uploadedFile;
    };

    const handleUploadComplete = (uploadedFile: ImageFileWithMetadata) => {
        setFile(uploadedFile);
    };

    const handleDelete = () => {
        setFile(null);
    };

    return (
        <div style={{ width: '600px' }}>
            <DesignerComponent
                elementInstance={args.elementInstance}
                file={file}
                onImageUpload={handleUpload}
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
    render: (args) => <ImageUploaderWrapper {...args} />,
    args: {
        locale: 'en',
        elementInstance: defaultElementInstance,
    },
};

const ImageUploaderWithImage = (args: StoryProps) => {
    const [file, setFile] = useState<ImageFileWithMetadata | null>(mockFile);

    const handleUploadComplete = (uploadedFile: ImageFileWithMetadata) => {
        setFile(uploadedFile);
    };

    const handleDelete = () => {
        setFile(null);
    };

    return (
        <div style={{ width: '600px' }}>
            <DesignerComponent
                elementInstance={args.elementInstance}
                file={file}
                onImageUpload={async () => ({} as ImageFileWithMetadata)}
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

export const WithImage: Story = {
    render: (args) => <ImageUploaderWithImage {...args} />,
    args: {
        ...Default.args,
    },
};

export const German: Story = {
    render: (args) => <ImageUploaderWrapper {...args} />,
    args: {
        ...Default.args,
        locale: 'de',
    },
};

// Form component story
export const FormView: Story = {
    render: () => (
        <div style={{ width: '600px' }}>
            <FormComponent
                elementInstance={{
                    ...defaultElementInstance,
                    ...mockFile,
                }}
                locale='en'
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

FormView.parameters = {
    docs: {
        description: {
            story: 'This shows how the image will be displayed in the course content.',
        },
    },
};
