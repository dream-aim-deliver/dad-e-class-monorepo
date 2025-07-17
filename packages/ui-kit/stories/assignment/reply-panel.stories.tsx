import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { ReplyPanel } from '../../lib/components/assignment/reply-panel';
import { assignment, fileMetadata, role, shared } from '@maany_shr/e-class-models';

// Meta Definition
const meta: Meta<typeof ReplyPanel> = {
    title: 'Components/Assignment/ReplyPanel',
    component: ReplyPanel,
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'radio',
            options: ['en', 'de'],
            defaultValue: 'en',
        },
        role: {
            control: 'radio',
            options: ['student', 'coach'],
            defaultValue: 'coach',
        },
    },
};

export default meta;
type Story = StoryObj<typeof ReplyPanel>;

// Mock Senders
const mockSenderStudent: assignment.TAssignmentReplyStudentSender = {
    id: '1',
    name: 'Alice Student',
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
    isCurrentUser: true,
    role: 'student',
};

const mockSenderCoach: assignment.TAssignmentReplyCoachSender = {
    id: '2',
    name: 'Coach Bob',
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
    isCurrentUser: true,
    role: 'coach',
};

// Simulate File Upload
const simulateFileUpload = async (
    file: fileMetadata.TFileUploadRequest,
    abortSignal?: AbortSignal,
): Promise<fileMetadata.TFileMetadata> => {
    // Simulate upload delay
    await new Promise((resolve, reject) => {
        const timeout = setTimeout(resolve, 2000);
        if (abortSignal) {
            abortSignal.addEventListener('abort', () => {
                clearTimeout(timeout);
                reject(new Error('Upload cancelled'));
            });
        }
    });

    // Return mock file metadata based on file type
    const baseMetadata = {
        id: crypto.randomUUID(),
        name: file.name,
        mimeType: file.file.type,
        size: file.file.size,
        checksum: 'mock-checksum-' + Date.now(),
        status: 'available' as const,
    };

    if (file.file.type.startsWith('image/')) {
        return {
            ...baseMetadata,
            category: 'image' as const,
            url: URL.createObjectURL(file.file),
            thumbnailUrl: URL.createObjectURL(file.file),
        };
    } else if (file.file.type.startsWith('video/')) {
        return {
            ...baseMetadata,
            category: 'video' as const,
            videoId: Math.floor(Math.random() * 1000),
            thumbnailUrl: 'https://via.placeholder.com/150x100?text=Video+Thumbnail',
        };
    } else if (
        file.file.type === 'application/pdf' ||
        file.name.endsWith('.doc') ||
        file.name.endsWith('.docx')
    ) {
        return {
            ...baseMetadata,
            category: 'document' as const,
            url: URL.createObjectURL(file.file),
        };
    } else {
        return {
            ...baseMetadata,
            category: 'generic' as const,
            url: URL.createObjectURL(file.file),
        };
    }
};

// Main Render Logic
const ReplyPanelRender: React.FC<{
    locale: 'en' | 'de';
    role: Omit<role.TRole, 'visitor' | 'admin'>;
}> = ({ locale, role }) => {
    const sender = role === 'coach' ? mockSenderCoach : mockSenderStudent;

    const [comment, setComment] = useState('');
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([]);
    const [links, setLinks] = useState<shared.TLinkWithId[]>([]);
    const [linkEditIndex, setLinkEditIndex] = useState<number | undefined>();
    const [draftLink, setDraftLink] = useState<shared.TLinkWithId | null>(null);

    // File actions
    const handleFilesChange = async (file: fileMetadata.TFileUploadRequest, signal?: AbortSignal) => {
        const uploaded = await simulateFileUpload(file, signal);
        setFiles((prev) => [...prev, uploaded]);
        return uploaded;
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
        setFiles((prev) => {
            const exists = prev.find((f) => f.id === file.id);
            if (!exists) return [...prev, file];
            return prev.map((f) => (f.id === file.id ? file : f));
        });
    };

    const handleFileDelete = (fileId: string, type: 'file') => {
        setFiles((f) => f.filter((file) => file.id !== fileId));
    };

    const handleFileDownload = (fileId: string) => {
        console.log('Download file:', fileId);
    };

    // Link actions
    const handleClickAddLink = () => {
        if (draftLink || linkEditIndex !== undefined) return; // allow only one editable link
        const newDraft: shared.TLinkWithId = { linkId: 0, url: '', title: '' };
        setDraftLink(newDraft);
    };

    const handleClickEditLink = (index: number) => {
        if (draftLink) setDraftLink(null); // discard unsaved draft
        setLinkEditIndex(index);
    };

    const handleCreateLink = async (data: shared.TLinkWithId, index: number) => {
        if (draftLink) {
            const newLink: shared.TLinkWithId = {
                ...data,
                linkId: Math.floor(Math.random() * 1000000),
            };
            setLinks([...links, newLink]);
            setDraftLink(null);
            return newLink;
        } else if (typeof linkEditIndex === 'number') {
            const updatedLinks = [...links];
            updatedLinks[linkEditIndex] = {
                ...data,
                linkId: links[linkEditIndex].linkId,
            };
            setLinks(updatedLinks);
            setLinkEditIndex(undefined);
            return updatedLinks[linkEditIndex];
        }
        return data;
    };

    const handleLinkDelete = (linkId: number, type: 'link', index: number) => {
        if (draftLink && index === links.length) {
            setDraftLink(null);
            return;
        }

        setLinks((prev) => prev.filter((_, i) => i !== index));
        if (index === linkEditIndex) setLinkEditIndex(undefined);
    };

    // Final submit
    const handleSendMessage = (reply: assignment.TAssignmentReply) => {
        console.log('[SEND MESSAGE]:', reply);
    };

    return (
        <div style={{ maxWidth: 720, margin: 'auto', padding: 24 }}>
            <ReplyPanel
                locale={locale}
                role={role}
                comment={comment}
                sender={sender}
                files={files}
                links={draftLink ? [...links, draftLink] : links}
                linkEditIndex={draftLink ? links.length : linkEditIndex}
                onChangeComment={setComment}
                onFileDownload={handleFileDownload}
                onFileDelete={handleFileDelete}
                onLinkDelete={handleLinkDelete}
                onFilesChange={handleFilesChange}
                onUploadComplete={handleUploadComplete}
                onCreateLink={handleCreateLink}
                onClickAddLink={handleClickAddLink}
                onImageChange={() => { console.log('onImageChange'); }}
                onClickEditLink={handleClickEditLink}
                onClickSendMessage={handleSendMessage}
            />
        </div>
    );
};

// Story: Coach
export const CoachPanel: Story = {
    render: (args) => <ReplyPanelRender role="coach" {...args} />,
    args: { locale: 'en' },
};

// Story: Student
export const StudentPanel: Story = {
    render: (args) => <ReplyPanelRender role="student" {...args} />,
    args: { locale: 'en' },
};
