// ReplyPanel.stories.tsx

import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { ReplyPanel } from '../../lib/components/assignment/reply-panel';
import { assignment, fileMetadata, role, shared } from '@maany_shr/e-class-models';

// Mock Data Generators

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

// Helper: Simulate file upload (like your handleFilesChange)
const simulateFileUpload = async (
    newFiles: fileMetadata.TFileUploadRequest[],
): Promise<fileMetadata.TFileMetadata> => {
    if (newFiles.length === 0) return Promise.resolve({} as fileMetadata.TFileMetadata);

    // Simulate processing (in real app, you would upload and get metadata)
    return new Promise((resolve) => {
        setTimeout(() => {
            const uploaded = {
                id: Math.floor(Math.random() * 1000000),
                name: newFiles[0].name,
                mimeType: newFiles[0].file.type || 'application/pdf',
                size: newFiles[0].file.size,
                checksum: 'checksum-uploaded',
                status: 'available',
                category: 'document',
                url: 'https://example.com/' + newFiles[0].name,
            } as fileMetadata.TFileMetadata;
            resolve(uploaded);
        }, 1200);
    });
};

// Helper: Simulate link creation/editing
const simulateLinkCreateOrEdit = async (data: shared.TLink): Promise<shared.TLink> => {
    // If linkId exists, just update data, else create new linkId
    if (data.linkId) {
        return Promise.resolve({ ...data });
    } else {
        return Promise.resolve({
            ...data,
            linkId: Math.floor(Math.random() * 1000000),
            title: data.title || 'New Link',
            url: data.url || 'https://www.example.com',
        });
    }
};

// The main render function with all state management
const ReplyPanelRender: React.FC<{
    locale: 'en' | 'de';
    role: 'student' | 'coach';
}> = ({ locale, role }) => {
    // For demo, replyId is fixed, sender depends on role
    const sender = role === 'coach' ? mockSenderCoach : mockSenderStudent;
    const replyId = 1001;

    // For demo: show last sent reply below the panel
    const [lastReply, setLastReply] = useState<assignment.TAssignmentReply | null>(null);

    // File download handler
    const handleFileDownload = (id: number) => {
        alert(`Download file with id: ${id}`);
    };

    // File delete handler
    const handleFileDelete = (replyId: number, fileId: number, type: 'file') => {
        alert(`Delete file with id: ${fileId} from reply ${replyId}`);
    };

    // Link delete handler
    const handleLinkDelete = (replyId: number, linkId: number, type: 'link') => {
        alert(`Delete link with id: ${linkId} from reply ${replyId}`);
    };

    // File upload handler (simulates async upload)
    const handleFilesChange = async (files: fileMetadata.TFileUploadRequest[]) => {
        return await simulateFileUpload(files);
    };

    // Link create/edit handler (simulates async server call)
    const handleCreateLink = async (data: shared.TLink) => {
        return await simulateLinkCreateOrEdit(data);
    };

    // Mark as passed handler
    const handleClickPassed = (reply: assignment.TAssignmentReply) => {
        setLastReply(reply);
        alert('Assignment marked as passed!');
        console.log("this is the reply", reply);
    };

    // Send message handler
    const handleClickSendMessage = (reply: assignment.TAssignmentReply) => {
        setLastReply(reply);
        alert('Reply sent! See below.');
        console.log("this is the reply", reply);
    };

    return (
        <div style={{ maxWidth: 600, margin: 'auto' }}>
            <ReplyPanel
                role={role}
                replyId={replyId}
                sender={sender}
                onFileDownload={handleFileDownload}
                onFileDelete={handleFileDelete}
                onLinkDelete={handleLinkDelete}
                onFilesChange={handleFilesChange}
                onCreateLink={handleCreateLink}
                onClickPassed={handleClickPassed}
                onClickSendMessage={handleClickSendMessage}
                locale={locale}
            />
        </div>
    );
};

// Story definitions
export const CoachPanel: Story = {
    render: (args) => <ReplyPanelRender locale={args.locale || 'en'} role="coach" />,
    args: { locale: 'en' },
};

export const StudentPanel: Story = {
    render: (args) => <ReplyPanelRender locale={args.locale || 'en'} role="student" />,
    args: { locale: 'en' },
};
