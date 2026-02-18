import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { courseElements } from '../../lib/components/course-builder/course-builder-core';
import { CourseElementType } from '../../lib/components/course-builder/types';
import { fileMetadata } from '@maany_shr/e-class-models';
import { ImageElement } from '../../lib/components/course-builder-lesson-component/types';

// Get components from courseElements
const { designerComponent: DesignerComponent, formComponent: FormComponent } =
    courseElements[CourseElementType.ImageFile];

type ImageFileWithMetadata = ImageElement & fileMetadata.TFileMetadata;

// Define the props for our stories
interface StoryProps {
    locale: 'en' | 'de';
    elementInstance: ImageElement;
    initialFile?: ImageFileWithMetadata | null;
}

// Default element instance
const defaultElementInstance: ImageElement = {
    id: '1',
    type: CourseElementType.ImageFile,
    order: 1,
    category: 'image',
    name: 'default-image',
    url: '',
    thumbnailUrl: '',
    size: 0,
    mimeType: 'image/png',
    checksum: '',
    status: 'processing',
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

// Mock upload function that simulates an API call
const mockUpload = async (): Promise<ImageFileWithMetadata> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(mockFile);
        }, 1000);
    });
};

// Create a wrapper component that uses hooks
const ImageUploaderWrapper = (args: StoryProps) => {
    const [file, setFile] = useState<ImageFileWithMetadata | null>(
        args.initialFile || null,
    );

    const handleUpload = async (fileRequest: fileMetadata.TFileUploadRequest) => {
        console.log('Uploading image...', fileRequest);
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

    // Create props object that matches the DesignerComponent's expected props
    const componentProps = {
        elementInstance: args.elementInstance,
        file: file,
        onImageUpload: handleUpload,
        onUploadComplete: handleUploadComplete,
        onFileDelete: handleDelete,
        onFileDownload: () => alert('Download file'),
        onUpClick: () => alert('Move up clicked'),
        onDownClick: () => alert('Move down clicked'),
        onDeleteClick: () => alert('Delete clicked'),
        locale: args.locale,
        maxSize: 5,
    };

    return (
        <div style={{ width: '600px' }}>
            <DesignerComponent {...componentProps} />
        </div>
    );
};

const meta: Meta<StoryProps> = {
    title: 'Components/CourseBuilder/Image Uploader',
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
        initialFile: {
            control: 'object',
            description: 'Initial file to display',
        },
    },
};

export default meta;

type Story = StoryObj<StoryProps>;

export const Default: Story = {
    render: (args) => <ImageUploaderWrapper {...args} />,
    args: {
        locale: 'en',
        elementInstance: defaultElementInstance,
        initialFile: null,
    },
};

// Story with a pre-uploaded image
export const WithImage: Story = {
    render: (args) => <ImageUploaderWrapper {...args} />, // Use the wrapper for hooks
    args: {
        ...Default.args,
        initialFile: mockFile,
    },
};

// Story with German locale
export const GermanLocale: Story = {
    render: (args) => <ImageUploaderWrapper {...args} />,
    args: {
        ...Default.args,
        locale: 'de',
    },
};

// Story for the form component
export const FormView: Story = {
    render: (args) => (
        <div style={{ width: '600px' }}>
            <FormComponent
                elementInstance={{
                    ...args.initialFile,
                }}
                locale={args.locale}
            />
        </div>
    ),
    args: {
        locale: 'en',
        initialFile: mockFile,
    },
};
