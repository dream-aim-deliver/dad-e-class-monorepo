import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
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
    role: Omit<role.TRole, 'visitor' | 'admin' | 'superadmin'>;
}> = ({ locale, role }) => {
    const sender = role === 'coach' ? mockSenderCoach : mockSenderStudent;

    const [comment, setComment] = useState('');
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([]);
    const [links, setLinks] = useState<shared.TLinkWithId[]>([]);
    const [linkEditIndex, setLinkEditIndex] = useState<number | undefined>();

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

    const handleFileDelete = (fileId: string) => {
        setFiles((f) => f.filter((file) => file.id !== fileId));
    };

    const handleFileDownload = (fileId: string) => {
        console.log('Download file:', fileId);
    };

    const handleImageChange = async (
        image: fileMetadata.TFileMetadata,
        abortSignal?: AbortSignal
    ) => {
        if (linkEditIndex === undefined) return;

        // Set status to "processing" for the custom icon
        setLinks(links =>
            links.map((link, idx) =>
                idx === linkEditIndex
                    ? { ...link, customIcon: { ...image, status: 'processing' as const } }
                    : link
            )
        );

        try {
            // Simulate async upload (like 2 seconds)
            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(resolve, 2000);
                if (abortSignal) {
                    abortSignal.addEventListener('abort', () => {
                        clearTimeout(timeout);
                        reject(new DOMException('Cancelled', 'AbortError'));
                    });
                }
            });

            // Set status to "available" after "upload"
            setLinks(links =>
                links.map((link, idx) =>
                    idx === linkEditIndex
                        ? { ...link, customIcon: { ...image, status: 'available' as const } }
                        : link
                )
            );
        } catch {
            // Remove customIcon if upload is aborted or fails
            setLinks(links =>
                links.map((link, idx) =>
                    idx === linkEditIndex
                        ? { ...link, customIcon: undefined }
                        : link
                )
            );
        }
    };

    const handleDeleteIcon = (id: string) => {
        if (linkEditIndex === undefined) return;
        setLinks(links =>
            links.map((link, idx) =>
                idx === linkEditIndex && link.customIcon?.id === id
                    ? { ...link, customIcon: undefined }
                    : link
            )
        );
    };

    // Link actions
    const handleClickAddLink = () => {
        if (typeof linkEditIndex === 'number') return; // Prevent editing multiple links at once

        // Add a blank link to the array and set it into edit mode
        const newLink: shared.TLinkWithId = { linkId: 0, url: '', title: '' };
        setLinks((prev) => [...prev, newLink]);
        setLinkEditIndex(links.length); // points to the new link being edited
    };

    const handleClickEditLink = (index: number) => {
        // Remove trailing empty draft if present before switching edit focus
        setLinks(prev => {
            if (
                prev.length > 0 &&
                prev[prev.length - 1].linkId === 0 &&
                prev[prev.length - 1].title === '' &&
                prev[prev.length - 1].url === ''
            ) {
                // If the currently-being-edited link is the draft, and we're switching away, discard it
                if (linkEditIndex === prev.length - 1) {
                    // Remove trailing draft link
                    setLinkEditIndex(undefined); // must switch out of current edit first
                    return prev.slice(0, -1);
                }
                // If not editing, still remove stray draft
                return prev.slice(0, -1);
            }
            return prev;
        });
        setLinkEditIndex(index);
    };

    const handleCreateLink = async (data: shared.TLinkWithId, index: number) => {
        // If linkId is 0, assign a new random ID
        const newLink = { ...data, linkId: data.linkId || Math.floor(Math.random() * 1000000) };
        setLinks((prev) =>
            prev.map((link, idx) => (idx === index ? newLink : link))
        );
        setLinkEditIndex(undefined);
    };

    const handleLinkDelete = (linkId: number, index: number) => {
        // If the currently edited link has linkId === 0, this is a new/draft link
        setLinks((prev) => prev.filter((_, i) => i !== index));
        if (index === linkEditIndex) setLinkEditIndex(undefined);
    };

    // Final submit
    const handleSendMessage = (reply: assignment.TAssignmentReply) => {
        console.log('[SEND MESSAGE]:', reply);
    };

    return (
        <div style={{ maxWidth: 720, margin: 'auto' }}>
            <ReplyPanel
                locale={locale}
                role={role}
                comment={comment}
                sender={sender}
                files={files}
                links={links}
                linkEditIndex={linkEditIndex}
                onChangeComment={setComment}
                onFileDownload={handleFileDownload}
                onFileDelete={handleFileDelete}
                onLinkDelete={handleLinkDelete}
                onFilesChange={handleFilesChange}
                onUploadComplete={handleUploadComplete}
                onCreateLink={handleCreateLink}
                onClickAddLink={handleClickAddLink}
                onImageChange={handleImageChange}
                onDeleteIcon={handleDeleteIcon}
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
