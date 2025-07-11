import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { courseElements } from '../../lib/components/course-builder/course-builder-core';
import { CourseElementType } from '../../lib/components/course-builder/types';
import { fileMetadata } from '@maany_shr/e-class-models';
import { ImageFile } from '../../lib/components/course-builder-lesson-component/types';
import { TLocale } from '@maany_shr/e-class-translations';

// Get components from courseElements
const { designerComponent: DesignerComponent, formComponent: FormComponent } = courseElements.ImageFile;

type ImageFileWithMetadata = ImageFile & { category: 'image' };

// Define the props for our stories
interface StoryProps {
    locale: TLocale;
    elementInstance: ImageFile;
    onFileUpload: (file: fileMetadata.TFileUploadRequest) => Promise<ImageFileWithMetadata>;
    onFileUploadComplete: (file: ImageFileWithMetadata) => void;
    onFileDelete: () => void;
    onFileDownload: () => void;
}

interface ImageUploaderWithStateProps {
    elementInstance: ImageFile;
    onFileUpload: (file: fileMetadata.TFileUploadRequest) => Promise<ImageFileWithMetadata>;
    onFileUploadComplete: (file: ImageFileWithMetadata) => void;
    onFileDelete: () => void;
    onFileDownload: () => void;
    onUpClick?: (id: string) => void;
    onDownClick?: (id: string) => void;
    onDeleteClick?: (id: string) => void;
    locale: TLocale;
}

// Default element instance
const defaultElementInstance: ImageFile = {
    id: '1',
    name: 'default-image',
    type: CourseElementType.ImageFile,
    url: '',
    thumbnailUrl: '',
    size: 0,
    mimeType: 'image/png',
    checksum: '',
    status: 'processing',
    category: 'image',
    order: 1,
};

// Mock file for testing
const mockFile: ImageFileWithMetadata = {
    id: 'file-1',
    name: 'sample-image.jpg',
    type: CourseElementType.ImageFile,
    url: 'https://picsum.photos/800/600',
    thumbnailUrl: 'https://picsum.photos/200/150',
    size: 1024 * 1024,
    mimeType: 'image/jpeg',
    checksum: 'mock-checksum',
    status: 'available',
    category: 'image',
    order: 1,
};



// Create a wrapper component that uses hooks
const ImageUploaderWithState = ({
    elementInstance,
    onFileUpload,
    onFileUploadComplete,
    onFileDelete,
    onFileDownload,
    onUpClick = () => alert('Move up clicked'),
    onDownClick = () => alert('Move down clicked'),
    onDeleteClick = () => alert('Delete clicked'),
    locale,
}: ImageUploaderWithStateProps) => {
    const [file, setFile] = useState<ImageFileWithMetadata | null>(null);

    const handleUpload = async (fileRequest: fileMetadata.TFileUploadRequest) => {
        const uploadedFile = await onFileUpload(fileRequest);
        return uploadedFile;
    };

    const handleUploadComplete = (uploadedFile: ImageFileWithMetadata) => {
        setFile(uploadedFile);
        onFileUploadComplete(uploadedFile);
    };

    const handleDelete = () => {
        setFile(null);
        onFileDelete();
    };

    const handleDownload = () => {
        if (file) {
            onFileDownload();
        }
    };

    return (
        <div style={{ width: '600px' }}>
            <DesignerComponent
                elementInstance={elementInstance}
                onUpClick={() => onUpClick(elementInstance.id)}
                onDownClick={() => onDownClick(elementInstance.id)}
                onDeleteClick={() => onDeleteClick(elementInstance.id)}
                locale={locale}
            />
        </div>
    );
};

// Create a wrapper component for the story
const ImageUploaderWrapper = (args: StoryProps) => {
    return (
        <ImageUploaderWithState
            elementInstance={args.elementInstance}
            onFileUpload={args.onFileUpload}
            onFileUploadComplete={args.onFileUploadComplete}
            onFileDelete={args.onFileDelete}
            onFileDownload={args.onFileDownload}
            locale={args.locale}
        />
    );
};



const meta: Meta<typeof ImageUploaderWrapper> = {
    title: 'Components/CourseBuilder/Image Uploader',
    component: ImageUploaderWrapper,
    tags: ['autodocs'],
    parameters: {
        docs: {
            description: {
                component: 'An image uploader component that allows users to upload, preview, and manage images.',
            },
        },
    },
    args: {
        locale: 'en',
        elementInstance: defaultElementInstance,
        onFileUpload: async (fileRequest) => {
            console.log('Uploading file...', fileRequest);
            await new Promise(resolve => setTimeout(resolve, 1000));
            return {
                ...mockFile,
                id: 'uploaded-' + Date.now(),
                name: fileRequest.name,
                size: fileRequest.file.size,
                mimeType: fileRequest.file.type,
                checksum: 'checksum-' + Date.now(),
                url: URL.createObjectURL(fileRequest.file),
                thumbnailUrl: URL.createObjectURL(fileRequest.file),
                status: 'available' as const,
                type: CourseElementType.ImageFile,
                order: 1,
                category: 'image' as const,
            };
        },
        onFileUploadComplete: (file) => console.log('File uploaded:', file),
        onFileDelete: () => console.log('File deleted'),
        onFileDownload: () => console.log('Download file'),
    },
};

export default meta;

type Story = StoryObj<typeof ImageUploaderWrapper>;

export const Default: Story = {
    render: (args) => <ImageUploaderWrapper {...args} />,
};

export const WithImage: Story = {
    args: {
        elementInstance: mockFile,
    },
};

export const German: Story = {
    args: {
        locale: 'de',
    },
};

export const WithCustomImage: Story = {
    args: {
        elementInstance: {
            ...defaultElementInstance,
            ...mockFile,
        },
    },
};

// Form component story
export const FormView: Story = {
    render: (args) => (
        <div style={{ width: '600px' }}>
            <FormComponent
                elementInstance={{
                    ...defaultElementInstance,
                    ...mockFile,
                }}
                submitValue={(key, value) => console.log('Form submitted:', { key, value })}
                locale={args.locale}
            />
        </div>
    ),
    parameters: {
        docs: {
            description: {
                story: 'Form view of the image uploader component.',
            },
        },
    },
};

// Add a story for the designer component
export const DesignerView: Story = {
    render: (args) => (
        <div style={{ width: '600px' }}>
            <DesignerComponent
                elementInstance={args.elementInstance}
                onUpClick={() => console.log('Move up')}
                onDownClick={() => console.log('Move down')}
                onDeleteClick={() => console.log('Delete')}
                locale={args.locale}
            />
        </div>
    ),
    args: {
        elementInstance: {
            ...defaultElementInstance,
            ...mockFile,
        },
    },
    parameters: {
        docs: {
            description: {
                story: 'Designer view of the image uploader component.',
            },
        },
    },
};
