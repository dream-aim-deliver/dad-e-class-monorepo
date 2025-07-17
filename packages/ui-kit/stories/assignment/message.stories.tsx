import { FC, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Message } from '../../lib/components/assignment/message';
import { fileMetadata, shared } from '@maany_shr/e-class-models';

// Mock Data Generators
const mockSenderStudent = {
    id: '1',
    name: 'Alice Student',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    isCurrentUser: false,
    role: 'student' as const,
};

const mockSenderCoach = {
    id: '2',
    name: 'Coach Bob',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    isCurrentUser: true,
    role: 'coach' as const,
};

const generateMockFile = (): fileMetadata.TFileMetadata => ({
    id: String(Math.floor(Math.random() * 1000000)),
    name: 'Sample.pdf',
    mimeType: 'application/pdf',
    size: 123456,
    checksum: 'checksum123',
    status: 'available',
    category: 'document',
    url: 'https://example.com/sample.pdf',
});

const generateMockImage = (): fileMetadata.TFileMetadata => ({
    id: String(Math.floor(Math.random() * 1000000)),
    name: 'Image.png',
    mimeType: 'image/png',
    size: 54321,
    checksum: 'checksum456',
    status: 'available',
    category: 'image',
    url: 'https://picsum.photos/400/300',
    thumbnailUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
});

const generateMockLink = (overrides?: Partial<shared.TLink>): shared.TLinkWithId => ({
    linkId: Math.floor(Math.random() * 1000000),
    title: 'Example Link',
    url: 'https://www.example.com',
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

// Story: Text Reply
const TextReplyRender: FC<{ locale: 'en' | 'de' }> = ({ locale }) => (
    <Message
        reply={{
            replyId: 1,
            timestamp: new Date().toISOString(),
            sender: mockSenderStudent,
            type: 'text',
            comment: 'This is a text reply from a student.',
        }}
        linkEditIndex={null}
        onFileDownload={() => alert('File download clicked')}
        onFileDelete={() => alert('File delete clicked')}
        onLinkDelete={() => alert('Link delete clicked')}
        onImageChange={() => alert('Image change')}
        onChange={() => alert('Change triggered')}
        locale={locale}
    />
);

// Story: Resources Reply (Coach)
const ResourcesReplyRender: FC<{ locale: 'en' | 'de' }> = ({ locale }) => {
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([
        generateMockFile(),
        generateMockImage(),
    ]);
    const [links, setLinks] = useState<shared.TLinkWithId[]>([
        generateMockLink(),
        generateMockLink({ title: 'Google', url: 'https://www.google.com' }),
    ]);
    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    const logReply = (newFiles: fileMetadata.TFileMetadata[], newLinks: shared.TLink[]) => {
        const updatedReply = {
            id: 1,
            timestamp: new Date().toISOString(),
            sender: mockSenderCoach,
            type: 'resources',
            comment: 'Here are some files and links for you.',
            files: newFiles,
            links: newLinks,
        };
        console.log('Updated reply:', updatedReply);
    };

    const handleFileDownload = (fileId: string) => {
        alert(`Download clicked for file with id: ${fileId}`);
    };

    const handleFileDelete = (replyId: number, fileId: string, type: 'file') => {
        const updatedFiles = files.filter((f) => f.id !== fileId);
        setFiles(updatedFiles);
        logReply(updatedFiles, links);
    };

    const handleLinkDelete = (replyId: number, linkId: number, type: 'link') => {
        const updatedLinks = links.filter((l) => l.linkId !== linkId);
        setLinks(updatedLinks);
        if (linkEditIndex !== null && links[linkEditIndex]?.linkId === linkId) {
            setLinkEditIndex(null);
        }
        logReply(files, updatedLinks);
    };

    const handleChange = (
        newFiles: fileMetadata.TFileMetadata[],
        newLinks: shared.TLink[],
        newLinkEditIndex?: number | null
    ) => {
        setFiles(newFiles);
        setLinks(newLinks);
        setLinkEditIndex(typeof newLinkEditIndex === 'number' ? newLinkEditIndex : null);
        logReply(newFiles, newLinks);
    };

    return (
        <Message
            reply={{
                replyId: 1,
                timestamp: new Date().toISOString(),
                sender: mockSenderCoach,
                type: 'resources',
                comment: 'Here are some files and links for you.',
                files,
                links,
            }}
            linkEditIndex={linkEditIndex}
            onFileDownload={handleFileDownload}
            onFileDelete={handleFileDelete}
            onLinkDelete={handleLinkDelete}
            onImageChange={() => { console.log('onImageChange') }}
            onChange={handleChange}
            locale={locale}
        />
    );
};

// Story: Resources Reply (Student)
const ResourcesReplyFromOtherUserRender: FC<{ locale: 'en' | 'de' }> = ({
    locale,
}) => {
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([
        generateMockFile(),
        generateMockImage(),
    ]);
    const [links, setLinks] = useState<shared.TLinkWithId[]>([
        generateMockLink(),
        generateMockLink({ title: 'Google', url: 'https://www.google.com' }),
    ]);
    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    const logReply = (newFiles: fileMetadata.TFileMetadata[], newLinks: shared.TLink[]) => {
        const updatedReply = {
            id: 2,
            timestamp: new Date().toISOString(),
            sender: mockSenderStudent,
            type: 'resources',
            comment: 'Here are some files and links for you.',
            files: newFiles,
            links: newLinks,
        };
        console.log('Updated reply:', updatedReply);
    };

    const handleFileDownload = (fileId: string) => {
        alert(`Download clicked for file with id: ${fileId}`);
    };

    const handleFileDelete = (replyId: number, fileId: string, type: 'file') => {
        const updatedFiles = files.filter((f) => f.id !== fileId);
        setFiles(updatedFiles);
        logReply(updatedFiles, links);
    };

    const handleLinkDelete = (replyId: number, linkId: number, type: 'link') => {
        const updatedLinks = links.filter((l) => l.linkId !== linkId);
        setLinks(updatedLinks);
        if (linkEditIndex !== null && links[linkEditIndex]?.linkId === linkId) {
            setLinkEditIndex(null);
        }
        logReply(files, updatedLinks);
    };

    const handleChange = (
        newFiles: fileMetadata.TFileMetadata[],
        newLinks: shared.TLink[],
        newLinkEditIndex?: number | null
    ) => {
        setFiles(newFiles);
        setLinks(newLinks);
        setLinkEditIndex(typeof newLinkEditIndex === 'number' ? newLinkEditIndex : null);
        logReply(newFiles, newLinks);
    };

    return (
        <Message
            reply={{
                replyId: 2,
                timestamp: new Date().toISOString(),
                sender: mockSenderStudent,
                type: 'resources',
                comment: 'Here are some files and links for you.',
                files,
                links,
            }}
            linkEditIndex={linkEditIndex}
            onFileDownload={handleFileDownload}
            onFileDelete={handleFileDelete}
            onLinkDelete={handleLinkDelete}
            onImageChange={() => { console.log('onImageChange') }}
            onChange={handleChange}
            locale={locale}
        />
    );
};

// Story: Passed Reply
const PassedReplyRender: FC<{ locale: 'en' | 'de' }> = ({ locale }) => (
    <Message
        reply={{
            replyId: 1,
            timestamp: new Date().toISOString(),
            sender: mockSenderCoach,
            type: 'passed',
        }}
        linkEditIndex={null}
        onFileDownload={() => alert('File download clicked')}
        onFileDelete={() => alert('File delete clicked')}
        onLinkDelete={() => alert('Link delete clicked')}
        onImageChange={() => alert('Image change')}
        onChange={() => alert('Change triggered')}
        locale={locale}
    />
);

// Exports
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
