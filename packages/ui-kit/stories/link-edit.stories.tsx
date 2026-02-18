import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { LinkEdit } from '../lib/components/links';
import { fileMetadata } from '@maany_shr/e-class-models';

const meta: Meta<typeof LinkEdit> = {
    title: 'Components/LinkEdit',
    component: LinkEdit,
    parameters: {
        layout: 'centered',
    },
    tags: ['autodocs'],
    argTypes: {
        initialTitle: { control: 'text' },
        initialUrl: { control: 'text' },
        locale: { control: 'select', options: ['en', 'de'] },
    },
};

export default meta;
type Story = StoryObj<typeof LinkEdit>;

// Mock file metadata for custom icon
const mockFile = {
    id: '1',
    name: 'custom-icon.png',
    mimeType: 'image/png',
    size: 1024,
    checksum: 'abc123',
    status: 'available' as const,
    category: 'image' as const,
    url: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    thumbnailUrl:
        'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
};

// Wrapper component to manage state
type LinkEditProps = Omit<
    React.ComponentProps<typeof LinkEdit>,
    'onSave' | 'onDiscard' | 'onImageChange' | 'onDeleteIcon'
>;

const LinkEditWithState = (props: LinkEditProps) => {
    const [title, setTitle] = useState(props.initialTitle || '');
    const [url, setUrl] = useState(props.initialUrl || '');
    const [customIcon, setCustomIcon] = useState<
        fileMetadata.TFileMetadata | undefined
    >(props.initialCustomIcon);

    const handleSave = (
        newTitle: string,
        newUrl: string,
        newCustomIcon?: fileMetadata.TFileMetadata,
    ) => {
        console.log('onSave', {
            title: newTitle,
            url: newUrl,
            customIcon: newCustomIcon,
        });
        setTitle(newTitle);
        setUrl(newUrl);
        setCustomIcon(newCustomIcon);
    };

    const handleDiscard = () => {
        console.log('onDiscard');
    };

    const handleImageChange = async (fileRequest: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal): Promise<fileMetadata.TFileMetadata> => {
        console.log('Starting upload for:', fileRequest.name);

        // Create temporary metadata for UI state
        const processingFile: fileMetadata.TFileMetadata = {
            id: fileRequest.id,
            name: fileRequest.name,
            mimeType: fileRequest.file.type,
            size: fileRequest.file.size,
            category: 'image',
            status: 'processing',
            url: URL.createObjectURL(fileRequest.file),
            thumbnailUrl: URL.createObjectURL(fileRequest.file),
            checksum: '',
        };


        try {
            // Simulate upload with setTimeout that can be aborted
            await new Promise<void>((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    console.log('Upload completed successfully');
                    resolve();
                }, 3000); // 3 second delay to see the spinner

                // Handle abort signal
                if (abortSignal) {
                    abortSignal.addEventListener('abort', () => {
                        clearTimeout(timeoutId);
                        console.log('Upload cancelled by user');
                        reject(new DOMException('Upload cancelled', 'AbortError'));
                    });
                }
            });

            // Update to completed state
            const completedFile: fileMetadata.TFileMetadata = {
                ...processingFile,
                status: 'available' as const,
                checksum: 'uploaded-checksum',
            };
            setCustomIcon(completedFile);
            console.log('File upload completed:', completedFile);
            return completedFile;

        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                console.log('Upload was cancelled');
                setCustomIcon(null); // Remove the file on cancellation
                throw error; // Re-throw abort error
            } else {
                console.error('Upload failed:', error);
                // Handle other errors - could set status to 'unavailable'
                const failedFile: fileMetadata.TFileMetadata = {
                    ...processingFile,
                    status: 'unavailable' as const,
                };
                setCustomIcon(failedFile);
                return failedFile;
            }
        }
    };

    const handleDeleteIcon = (id: string) => {
        // Remove the icon if it matches the id
        console.log('onDeleteIcon', id);
        if (customIcon && customIcon.id === id) setCustomIcon(null);
    };

    return (
        <LinkEdit
            {...props}
            initialTitle={title}
            initialUrl={url}
            initialCustomIcon={customIcon}
            onSave={handleSave}
            onDiscard={handleDiscard}
            onImageChange={handleImageChange}
            onDeleteIcon={handleDeleteIcon}
        />
    );
};

export const Default: Story = {
    render: (args) => <LinkEditWithState {...args} />,
    args: {
        initialTitle: 'Example Link',
        initialUrl: 'https://example.com',
        locale: 'en',
    },
};

export const WithCustomIcon: Story = {
    render: (args) => <LinkEditWithState {...args} />,
    args: {
        ...Default.args,
        initialCustomIcon: mockFile,
    },
};

export const EmptyState: Story = {
    render: (args) => <LinkEditWithState {...args} />,
    args: {
        initialTitle: '',
        initialUrl: '',
        locale: 'de',
    },
};

export const ProcessingState: Story = {
    render: (args) => <LinkEditWithState {...args} />,
    args: {
        ...Default.args,
        initialCustomIcon: {
            id: 'processing-1',
            name: 'uploading-image.png',
            mimeType: 'image/png',
            size: 2048,
            checksum: 'processing123',
            status: 'processing',
            category: 'image',
            url: 'https://via.placeholder.com/48',
            thumbnailUrl: 'https://via.placeholder.com/48',
        },
    },
};

export const GermanLocale: Story = {
    render: (args) => <LinkEditWithState {...args} />,
    args: {
        ...Default.args,
        locale: 'de',
    },
};

export const SpinnerTest: Story = {
    render: (args) => <LinkEditWithState {...args} />,
    args: {
        ...Default.args,
        initialTitle: 'Test Upload Spinner',
        initialUrl: 'https://example.com',
        locale: 'en',
    },
};