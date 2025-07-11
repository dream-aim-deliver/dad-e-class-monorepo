import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { fileMetadata } from '@maany_shr/e-class-models';
import { CourseElementType } from '../../lib/components/course-builder/types';
import { ImageGallery, ImageFile } from '../../lib/components/course-builder-lesson-component/types';
import { DesignerComponent, FormComponent } from '../../lib/components/course-builder-lesson-component/image-gallery-uploader-lesson';

// Using the ImageFile type from the component's types

// Define the props for our stories
interface StoryProps {
    locale: 'en' | 'de';
    elementInstance: ImageGallery;
    onImageUpload?: (fileRequest: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<ImageFile | null>;
    onUploadComplete?: (file: ImageFile) => void;
    onFileDownload?: () => void;
    onFileDelete?: () => void;
    onUpClick?: (id: number) => void;
    onDownClick?: (id: number) => void;
    onDeleteClick?: (id: number) => void;
    files?: ImageFile[] | null;
}

const meta: Meta<StoryProps> = {
    title: 'Lesson Components/Image Gallery Uploader',
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
        // files is handled by the component's state
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

const defaultElementInstance: ImageGallery = {
    id: 1,
    type: CourseElementType.ImageGallery,
    order: 1,
    imageUrls: [],
};

type imageGalleryMetadata=fileMetadata.TFileMetadata & {category:"image"};
// Mock file data
const mockFiles:imageGalleryMetadata[] = [
    {
        id: 'file-1',
        name: 'sample-image-1.jpg',
        url: 'https://picsum.photos/id/10/800/600',
        thumbnailUrl: 'https://picsum.photos/id/10/200/150',
        size: 1024 * 1024,
        mimeType: 'image/jpeg',
        category: 'image',
        status: 'available',
        checksum: 'mock-checksum-1'
    },
    {
        id: 'file-2',
        name: 'sample-image-2.jpg',
        url: 'https://picsum.photos/id/11/800/600',
        thumbnailUrl: 'https://picsum.photos/id/11/200/150',
        size: 1024 * 1024 * 1.5,
        mimeType: 'image/jpeg',
        category: 'image',
        status: 'available',
        checksum: 'mock-checksum-2'
    },
    {
        id: 'file-3',
        name: 'sample-image-3.jpg',
        url: 'https://picsum.photos/id/12/800/600',
        thumbnailUrl: 'https://picsum.photos/id/12/200/150',
        size: 1024 * 1024 * 2,
        mimeType: 'image/jpeg',
        category: 'image',
        status: 'available',
        checksum: 'mock-checksum-3'
    },
    {
        id: 'file-4',
        name: 'sample-image-4.jpg',
        url: 'https://picsum.photos/id/13/800/600',
        thumbnailUrl: 'https://picsum.photos/id/13/200/150',
        size: 1024 * 1024 * 2.5,
        mimeType: 'image/jpeg',
        category: 'image',
        status: 'available',
        checksum: 'mock-checksum-4'
    },
    {
        id: 'file-5',
        name: 'sample-image-4.jpg',
        url: 'https://picsum.photos/id/13/800/600',
        thumbnailUrl: 'https://picsum.photos/id/13/200/150',
        size: 1024 * 1024 * 2.5,
        mimeType: 'image/jpeg',
        category: 'image',
        status: 'available',
        checksum: 'mock-checksum-4'
    },
    {
        id: 'file-6',
        name: 'sample-image-4.jpg',
        url: 'https://picsum.photos/id/13/800/600',
        thumbnailUrl: 'https://picsum.photos/id/13/200/150',
        size: 1024 * 1024 * 2.5,
        mimeType: 'image/jpeg',
        category: 'image',
        status: 'available',
        checksum: 'mock-checksum-4',
    },
    {
        id: 'file-7',
        name: 'sample-image-4.jpg',
        url: 'https://picsum.photos/id/13/800/600',
        thumbnailUrl: 'https://picsum.photos/id/13/200/150',
        size: 1024 * 1024 * 2.5,
        mimeType: 'image/jpeg',
        category: 'image',
        status: 'available',
        checksum: 'mock-checksum-4',
    },
    {
        id: 'file-7',
        name: 'sample-image-4.jpg',
        url: 'https://picsum.photos/id/13/800/600',
        thumbnailUrl: 'https://picsum.photos/id/13/200/150',
        size: 1024 * 1024 * 2.5,
        mimeType: 'image/jpeg',
        category: 'image',
        status: 'available',
        checksum: 'mock-checksum-4'
    },
];


// Mock upload function that simulates an API call
const mockUpload = async (): Promise<ImageFile> => {
    return new Promise((resolve) => {
        setTimeout(() => {
            const newFile: ImageFile = {
                id: `file-${Date.now()}`,
                name: `uploaded-${Math.floor(Math.random() * 1000)}.jpg`,
                url: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/800/600`,
                thumbnailUrl: `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/150`,
                size: Math.floor(Math.random() * 3 + 0.5) * 1024 * 1024, // 0.5MB - 3.5MB
                mimeType: 'image/jpeg',
                category: 'image',
                status: 'available',
                checksum: `mock-checksum-${Date.now()}`,
                type: CourseElementType.ImageFile,
                order: 0,
            };
            resolve(newFile);
        }, 1000);
    });
};

interface ImageGalleryWithStateProps {
    elementInstance: ImageGallery;
    initialFiles?: ImageFile[] | null;
    onImageUpload: (fileRequest: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => Promise<ImageFile | null>;
    onUploadComplete: (file: ImageFile) => void;
    onFileDelete: () => void;
    onFileDownload: () => void;
    onUpClick: (id: number) => void;
    onDownClick: (id: number) => void;
    onDeleteClick: (id: number) => void;
    locale: 'en' | 'de';
}

const ImageGalleryWithState = ({
    elementInstance,
    initialFiles = [],
    onImageUpload,
    onUploadComplete,
    onFileDelete,
    onFileDownload,
    onUpClick,
    onDownClick,
    onDeleteClick,
    locale = 'en',
}: ImageGalleryWithStateProps) => {
    const [files, setFiles] = useState<ImageFile[]>(initialFiles || []);

    const handleImageUpload = async (fileRequest: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => {
        if (!onImageUpload) return null;
        const newFile = await onImageUpload(fileRequest, abortSignal);
        if (newFile) {
            const updatedFiles = [...(files || []), newFile];
            setFiles(updatedFiles);
            onUploadComplete?.(newFile);
        }
        return newFile;
    };

    const handleFileDelete = () => {
        // In a real implementation, you would handle file deletion here
        console.log('File delete requested');
        onFileDelete?.();
    };

    return (
        <div className="w-[600px] max-w-full">
            <DesignerComponent
                elementInstance={elementInstance}
                locale={locale}
                files={files}
                onImageUpload={handleImageUpload}
                onUploadComplete={onUploadComplete}
                onFileDownload={onFileDownload}
                onFileDelete={handleFileDelete}
                onUpClick={onUpClick}
                onDownClick={onDownClick}
                onDeleteClick={onDeleteClick}
            />
        </div>
    );
};

// Create a wrapper component that uses hooks
const ImageGalleryWrapper = (args: StoryProps) => {
    const [files, setFiles] = useState<ImageFile[]>([]);

    const handleImageUpload = async (fileRequest: fileMetadata.TFileUploadRequest) => {
        // In a real app, you would upload the file to your server here
        console.log('Uploading file:', fileRequest.file.name);
        const result = await mockUpload();
        return result || null;
    };

    const handleUploadComplete = (file: ImageFile) => {
        setFiles(prev => [...prev, file]);
        args.onUploadComplete?.(file);
    };

    const handleFileDelete = () => {
        console.log('File delete requested');
        // In a real implementation, you would handle file deletion here
        args.onFileDelete?.();
    };

    const handleFileDownload = () => {
        console.log('File download requested');
        // In a real implementation, you would handle the file download here
        args.onFileDownload?.();
    };

    const handleUpClick = () => {
        console.log('Moving element up');
        args.onUpClick?.(0);
    };

    const handleDownClick = () => {
        console.log('Moving element down');
        args.onDownClick?.(0);
    };

    const handleDeleteClick = () => {
        console.log('Deleting element');
        args.onDeleteClick?.(0);
    };

    return (
        <ImageGalleryWithState
            elementInstance={args.elementInstance}
            initialFiles={files}
            onImageUpload={handleImageUpload}
            onUploadComplete={handleUploadComplete}
            onFileDelete={handleFileDelete}
            onFileDownload={handleFileDownload}
            onUpClick={handleUpClick}
            onDownClick={handleDownClick}
            onDeleteClick={handleDeleteClick}
            locale={args.locale}
        />
    );
};

export const Default: Story = {
    render: (args) => <ImageGalleryWrapper {...args} />,
    args: {
        locale: 'en',
        elementInstance: defaultElementInstance,
    },
};

export const WithImages: Story = {
    render: (args) => <ImageGalleryWrapper {...args} />,
    args: {
        ...Default.args,
        elementInstance: {
            ...defaultElementInstance,
            imageUrls: mockFiles,
        },
    },
};

export const GermanLocale: Story = {
    render: (args) => <ImageGalleryWrapper {...args} />,
    args: {
        ...Default.args,
        locale: 'de',
    },
};

// Form Component Stories
export const FormView: Story = {
    render: () => (
        <div className="w-[800px] max-w-full">
            <FormComponent 
                elementInstance={{
                    ...defaultElementInstance,
                    type: CourseElementType.ImageGallery,
                    imageUrls: mockFiles,
                }}
                locale="en"
            />
        </div>
    ),
    args: {
        locale: 'en',
        elementInstance: {
            ...defaultElementInstance,
            type: CourseElementType.ImageGallery,
            imageUrls: mockFiles,
        },
    },
};
