import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';
import { LinkEdit, LinkPreview } from '../lib/components/link';
import { fileMetadata } from '@maany_shr/e-class-models';

const meta: Meta<typeof LinkEdit> = {
    title: 'Components/Link',
    component: LinkEdit,
    parameters: {
        layout: 'centered',
        docs: {
            description: {
                component: 'Link components for editing and previewing links with custom icons and favicon support.',
            },
        },
    },
    argTypes: {
        title: {
            control: 'text',
            description: 'The title of the link',
        },
        url: {
            control: 'text',
            description: 'The URL of the link',
        },
        customIconMetadata: {
            control: 'object',
            description: 'File metadata for custom icon (contains status: available | processing | unavailable)',
        },
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Locale for translations',
        },
    },
};

export default meta;
type Story = StoryObj<typeof meta>;

// Define explicit props for LinkPreview stories
interface LinkPreviewStoryArgs {
    title?: string;
    url?: string;
    customIconUrl?: string;
    preview?: boolean;
}

type PreviewStory = StoryObj<{ args: LinkPreviewStoryArgs }>;

// Wrapper component to handle state
const LinkEditWrapper = (args: Partial<React.ComponentProps<typeof LinkEdit>>) => {
    const [linkData, setLinkData] = useState({
        title: args.title || '',
        url: args.url || '',
    });
    const [customIconMetadata, setCustomIconMetadata] = useState<fileMetadata.TFileMetadata | null>(
        args.customIconMetadata || null
    );

    const handleChange = (data: { title: string; url: string; file?: File }) => {
        setLinkData(prev => ({ ...prev, ...data }));

        // Simulate file upload if file is provided
        if (data.file) {
            // Set processing state
            setCustomIconMetadata({
                name: data.file.name,
                category: 'image',
                status: 'processing',
                url: '',
                mimeType: data.file.type,
                size: data.file.size,
                checksum: '',
                lfn: '',
                thumbnailUrl: '',
            });

            // Simulate upload completion after 2 seconds
            setTimeout(() => {
                setCustomIconMetadata({
                    name: data.file?.name || 'uploaded-file',
                    category: 'image',
                    status: 'available',
                    url: data.file ? URL.createObjectURL(data.file) : '',
                    mimeType: data.file?.type || '',
                    size: data.file?.size || 0,
                    checksum: '',
                    lfn: '',
                    thumbnailUrl: data.file ? URL.createObjectURL(data.file) : '',
                });
            }, 2000);
        }
    };

    const handleSave = () => {
        console.log('Saved link:', linkData, customIconMetadata);
    };

    const handleDiscard = () => {
        setLinkData({ title: '', url: '' });
        setCustomIconMetadata(null);
        console.log('Discarded changes');
    };

    return (
        <div className="w-96">
            <LinkEdit
                title={linkData.title}
                url={linkData.url}
                customIconMetadata={customIconMetadata}
                onChange={handleChange}
                onSave={handleSave}
                onDiscard={handleDiscard}
                locale={args.locale || 'en'}
            />
        </div>
    );
};

export const Default: Story = {
    render: (args) => <LinkEditWrapper {...args} />,
    args: {
        title: '',
        url: '',
        customIconMetadata: null,
        locale: 'en',
    },
};

export const WithData: Story = {
    render: (args) => <LinkEditWrapper {...args} />,
    args: {
        title: 'Google',
        url: 'https://www.google.com',
        customIconMetadata: null,
        locale: 'en',
    },
};

export const WithCustomIcon: Story = {
    render: (args) => <LinkEditWrapper {...args} />,
    args: {
        title: 'My Custom Link',
        url: 'https://example.com',
        customIconMetadata: {
            name: 'custom-icon.png',
            category: 'image',
            status: 'available',
            url: 'https://google.com/favicon.ico',
            mimeType: 'image/png',
            size: 1024,
            checksum: '',
            lfn: '',
            thumbnailUrl: 'https://via.placeholder.com/64/0000FF/FFFFFF?text=ICON',
        },
        locale: 'en',
    },
};

export const ProcessingIcon: Story = {
    render: (args) => <LinkEditWrapper {...args} />,
    args: {
        title: 'Link with Processing Icon',
        url: 'https://example.com',
        customIconMetadata: {
            name: 'uploading.png',
            category: 'image',
            status: 'processing',
            url: '',
            mimeType: 'image/png',
            size: 1024,
            checksum: '',
            lfn: '',
            thumbnailUrl: '',
        },
        locale: 'en',
    },
};

export const FailedIcon: Story = {
    render: (args) => <LinkEditWrapper {...args} />,
    args: {
        title: 'Link with Failed Icon',
        url: 'https://example.com',
        customIconMetadata: {
            name: 'failed.png',
            category: 'image',
            status: 'unavailable',
            url: '',
            mimeType: 'image/png',
            size: 1024,
            checksum: '',
            lfn: '',
            thumbnailUrl: '',
        },
        locale: 'en',
    },
};

export const German: Story = {
    render: (args) => <LinkEditWrapper {...args} />,
    args: {
        title: 'Deutsche Webseite',
        url: 'https://www.deutschland.de',
        customIconMetadata: null,
        locale: 'de',
    },
};

// Link Preview Stories
const LinkPreviewWrapper = (args: LinkPreviewStoryArgs) => {
    const handleEdit = () => {
        console.log('Edit clicked');
    };

    const handleDelete = () => {
        console.log('Delete clicked');
    };

    return (
        <div className="w-96">
            <LinkPreview
                title={args.title || 'Default Title'}
                url={args.url || 'https://example.com'}
                customIconUrl={args.customIconUrl}
                preview={args.preview}
                onEdit={handleEdit}
                onDelete={handleDelete}
            />
        </div>
    );
};

export const PreviewDefault: PreviewStory = {
    render: (args) => <LinkPreviewWrapper {...args} />,
    args: {
        title: 'Google Search',
        url: 'https://www.google.com',
        preview: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Link preview with favicon and edit/delete controls',
            },
        },
    },
};

export const PreviewWithCustomIcon: PreviewStory = {
    render: (args) => <LinkPreviewWrapper {...args} />,
    args: {
        title: 'My Custom Website',
        url: 'https://example.com',
        customIconUrl: 'https://via.placeholder.com/64/FF0000/FFFFFF?text=CUSTOM',
        preview: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Link preview with custom icon',
            },
        },
    },
};

export const PreviewWithoutControls: PreviewStory = {
    render: (args) => <LinkPreviewWrapper {...args} />,
    args: {
        title: 'Read-only Link',
        url: 'https://www.example.com',
        preview: false,
    },
    parameters: {
        docs: {
            description: {
                story: 'Link preview without edit/delete controls',
            },
        },
    },
};

export const PreviewLongText: PreviewStory = {
    render: (args) => <LinkPreviewWrapper {...args} />,
    args: {
        title: 'This is a very long link title that should be truncated properly to prevent layout issues',
        url: 'https://www.very-long-domain-name-that-should-also-be-truncated.com/with/a/very/long/path',
        preview: true,
    },
    parameters: {
        docs: {
            description: {
                story: 'Link preview with long text to demonstrate truncation',
            },
        },
    },
};
