import { FC, useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { Message } from '../../lib/components/assignment/message';
import { fileMetadata, shared } from '@maany_shr/e-class-models';

// Mock Data Generators
const mockSenderStudent = {
    id: "1",
    name: 'Alice Student',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    isCurrentUser: false,
    role: 'student' as const,
};

const mockSenderCoach = {
    id: "2",
    name: 'Coach Bob',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    isCurrentUser: true,
    role: 'coach' as const,
};

const generateMockFile = (): fileMetadata.TFileMetadata => ({
    id: Math.floor(Math.random() * 1000000),
    name: 'Sample.pdf',
    mimeType: 'application/pdf',
    size: 123456,
    checksum: 'checksum123',
    status: 'available',
    category: 'document',
    url: 'https://example.com/sample.pdf',
});

const generateMockImage = (): fileMetadata.TFileMetadata => ({
    id: Math.floor(Math.random() * 1000000),
    name: 'Image.png',
    mimeType: 'image/png',
    size: 54321,
    checksum: 'checksum456',
    status: 'available',
    category: 'image',
    url: 'https://picsum.photos/400/300',
    thumbnailUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
});

const generateMockLink = (overrides?: Partial<shared.TLink>): shared.TLink => ({
    linkId: Math.floor(Math.random() * 1000000),
    url: 'https://www.example.com',
    title: 'Example Link',
    customIconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
    ...overrides,
});

// Storybook Meta
const meta: Meta<typeof Message> = {
    title: 'Components/Assignment/Message',
    component: Message,
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'radio',
            options: ['en', 'de'],
            defaultValue: 'en',
        },
    },
};
export default meta;
type Story = StoryObj<typeof Message>;

// Render functions with state management
const TextReplyRender: FC<{ locale: 'en' | 'de' }> = ({ locale }) => (
    <Message
        reply={{
            timestamp: new Date().toISOString(),
            sender: mockSenderStudent,
            type: 'text',
            comment: 'This is a text reply from a student.',
        }}
        locale={locale}
        // These are required but not used for text type
        linkEditIndex={null}
        onFileDownload={() => { }}
        onFileDelete={() => { }}
        onLinkDelete={() => { }}
        onChange={() => { }}
    />
);

const ResourcesReplyRender: FC<{ locale: 'en' | 'de' }> = ({ locale }) => {
    // State for files, links, and linkEditIndex
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([
        generateMockFile(),
        generateMockImage(),
    ]);
    const [links, setLinks] = useState<shared.TLink[]>([
        generateMockLink(),
        generateMockLink({
            url: 'https://www.google.com',
            title: 'Google',
            customIconUrl: '',
        }),
    ]);
    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    // Handlers
    const handleFileDownload = (fileId: number) => {
        alert(`Download clicked for file with id: ${fileId}`);
    };

    const handleFileDelete = (replyId: number, fileId: number, type: 'file') => {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    const handleLinkDelete = (replyId: number, linkId: number, type: 'link') => {
        setLinks((prev) => prev.filter((l) => l.linkId !== linkId));
        if (linkEditIndex !== null && links[linkEditIndex]?.linkId === linkId) {
            setLinkEditIndex(null);
        }
    };

    const handleChange = (
        newFiles: fileMetadata.TFileMetadata[],
        newLinks: shared.TLink[],
        newLinkEditIndex?: number | null
    ) => {
        setFiles(newFiles);
        setLinks(newLinks);
        setLinkEditIndex(
            typeof newLinkEditIndex === 'number' ? newLinkEditIndex : null
        );
    };

    return (
        <Message
            reply={{
                timestamp: new Date().toISOString(),
                sender: mockSenderCoach,
                type: 'resources',
                comment: 'Here are some files and links for you.',
                files,
                links,
                replyId: 1, // add id for reply as required by handlers
            }}
            linkEditIndex={linkEditIndex}
            onFileDownload={handleFileDownload}
            onFileDelete={handleFileDelete}
            onLinkDelete={handleLinkDelete}
            onChange={handleChange}
            locale={locale}
        />
    );
};

const PassedReplyRender: FC<{ locale: 'en' | 'de' }> = ({ locale }) => (
    <Message
        reply={{
            timestamp: new Date().toISOString(),
            sender: mockSenderCoach,
            type: 'passed',
        }}
        locale={locale}
        // These are required but not used for passed type
        linkEditIndex={null}
        onFileDownload={() => { }}
        onFileDelete={() => { }}
        onLinkDelete={() => { }}
        onChange={() => { }}
    />
);

const ResourcesReplyFromOtherUserRender: FC<{ locale: 'en' | 'de' }> = ({ locale }) => {
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([
        generateMockFile(),
        generateMockImage(),
    ]);
    const [links, setLinks] = useState<shared.TLink[]>([
        generateMockLink(),
        generateMockLink({
            url: 'https://www.google.com',
            title: 'Google',
            customIconUrl: '',
        }),
    ]);
    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    const handleFileDownload = (fileId: number) => {
        alert(`Download clicked for file with id: ${fileId}`);
    };

    const handleFileDelete = (replyId: number, fileId: number, type: 'file') => {
        setFiles((prev) => prev.filter((f) => f.id !== fileId));
    };

    const handleLinkDelete = (replyId: number, linkId: number, type: 'link') => {
        setLinks((prev) => prev.filter((l) => l.linkId !== linkId));
        if (linkEditIndex !== null && links[linkEditIndex]?.linkId === linkId) {
            setLinkEditIndex(null);
        }
    };

    const handleChange = (
        newFiles: fileMetadata.TFileMetadata[],
        newLinks: shared.TLink[],
        newLinkEditIndex?: number | null
    ) => {
        setFiles(newFiles);
        setLinks(newLinks);
        setLinkEditIndex(
            typeof newLinkEditIndex === 'number' ? newLinkEditIndex : null
        );
    };

    return (
        <Message
            reply={{
                timestamp: new Date().toISOString(),
                sender: mockSenderStudent,
                type: 'resources',
                comment: 'Here are some files and links for you.',
                files,
                links,
                replyId: 2,
            }}
            linkEditIndex={linkEditIndex}
            onFileDownload={handleFileDownload}
            onFileDelete={handleFileDelete}
            onLinkDelete={handleLinkDelete}
            onChange={handleChange}
            locale={locale}
        />
    );
};


// Story definitions
export const TextReply: Story = {
    render: (args) => <TextReplyRender locale={args.locale || 'en'} />,
    args: { locale: 'en' },
};

export const ResourcesReply: Story = {
    render: (args) => <ResourcesReplyRender locale={args.locale || 'en'} />,
    args: { locale: 'en' },
};

export const PassedReply: Story = {
    render: (args) => <PassedReplyRender locale={args.locale || 'en'} />,
    args: { locale: 'en' },
};

export const ResourcesReplyFromOtherUser: Story = {
    render: (args) => <ResourcesReplyFromOtherUserRender locale={args.locale || 'en'} />,
    args: { locale: 'en' },
};
