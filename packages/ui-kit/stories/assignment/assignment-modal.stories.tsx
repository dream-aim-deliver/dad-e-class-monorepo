// AssignmentModal.stories.tsx

import React, { useState } from 'react';
import { Meta, StoryObj } from '@storybook/react';
import { AssignmentModal } from '../../lib/components/assignment/assignment-modal';
import { Message } from '../../lib/components/assignment/message';
import { ReplyPanel } from '../../lib/components/assignment/reply-panel';
import { assignment, fileMetadata, role, shared, course } from '@maany_shr/e-class-models';

// --- Mock Data Generators ---
const mockCourse: course.TCourseMetadata = {
    title: 'Mathematics 101',
    imageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
};

const mockStudent = {
    id: 'student-1',
    name: 'Alice Johnson',
    image: 'https://randomuser.me/api/portraits/women/2.jpg',
};

const mockGroup = {
    id: 'group-1',
    name: 'Team React',
};

const generateMockFile = (): fileMetadata.TFileMetadata => ({
    id: Math.floor(Math.random() * 1000000),
    name: 'Assignment.pdf',
    mimeType: 'application/pdf',
    size: 123456,
    checksum: 'checksum123',
    status: 'available',
    category: 'document',
    url: 'https://example.com/assignment.pdf',
});

const generateMockImage = (): fileMetadata.TFileMetadata => ({
    id: Math.floor(Math.random() * 1000000),
    name: 'Diagram.png',
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
    url: 'https://react.dev',
    title: 'React Documentation',
    customIconUrl: 'https://cdn-icons-png.flaticon.com/512/25/25231.png',
    ...overrides,
});

const generateMockReply = (overrides?: Partial<assignment.TAssignmentReply>): assignment.TAssignmentReply => ({
    replyId: Math.floor(Math.random() * 1000000),
    timestamp: new Date().toISOString(),
    sender: {
        id: 'student-1',
        name: 'Alice Johnson',
        image: 'https://randomuser.me/api/portraits/women/2.jpg',
        isCurrentUser: true,
        role: 'student',
    },
    type: 'text',
    comment: 'I have submitted my assignment!',
    ...overrides,
});

// --- File/Link/Reply Handlers ---
const simulateFileUpload = async (
    newFiles: fileMetadata.TFileUploadRequest[],
): Promise<fileMetadata.TFileMetadata> => {
    if (newFiles.length === 0) return Promise.resolve({} as fileMetadata.TFileMetadata);
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
        }, 1000);
    });
};

const simulateLinkCreateOrEdit = async (data: shared.TLink): Promise<shared.TLink> => {
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

// --- Main Render Function ---
const AssignmentModalRender: React.FC<{
    role: Omit<role.TRole, 'visitor' | 'admin'>;
    locale: 'en' | 'de';
}> = ({ role, locale }) => {
    // Assignment-level files/links (not per-reply)
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([
        generateMockFile(),
        generateMockImage(),
    ]);
    const [links, setLinks] = useState<shared.TLink[]>([
        generateMockLink(),
        generateMockLink({ url: 'https://storybook.js.org', title: 'Storybook Docs', customIconUrl: '' }),
    ]);
    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    // --- Replies array with per-reply files/links/linkEditIndex ---
    const [replies, setReplies] = useState(() => {
        // 1. Text reply from current user (student)
        const textReply: assignment.TAssignmentReply = generateMockReply();

        // 2. Resource reply from current user (coach or student)
        const resourceReply: assignment.TAssignmentReply = {
            replyId: Math.floor(Math.random() * 1000000),
            timestamp: new Date(Date.now() + 1000).toISOString(),
            sender: {
                id: role === 'coach' ? 'coach-1' : 'student-1',
                name: role === 'coach' ? 'Coach Bob' : 'Alice Johnson',
                image: role === 'coach'
                    ? 'https://randomuser.me/api/portraits/men/1.jpg'
                    : 'https://randomuser.me/api/portraits/women/2.jpg',
                isCurrentUser: true,
                role: role as 'coach' | 'student',
            },
            type: 'resources',
            comment: 'Please review these resources:',
            files: [generateMockImage()],
            links: [
                generateMockLink({ url: 'https://react-typescript-cheatsheet.netlify.app', title: 'TS Cheatsheet' }),
            ],
        };

        // 3. Resource reply by other user (opposite of current user)
        const otherUserResourceReply: assignment.TAssignmentReply = {
            replyId: Math.floor(Math.random() * 1000000),
            timestamp: new Date(Date.now() + 2000).toISOString(),
            sender: role === 'coach'
                ? {
                    id: 'student-1',
                    name: 'Alice Johnson',
                    image: 'https://randomuser.me/api/portraits/women/2.jpg',
                    isCurrentUser: false,
                    role: 'student',
                }
                : {
                    id: 'coach-1',
                    name: 'Coach Bob',
                    image: 'https://randomuser.me/api/portraits/men/1.jpg',
                    isCurrentUser: false,
                    role: 'coach',
                },
            type: 'resources',
            comment: role === 'coach'
                ? 'Here are some resources from the student.'
                : 'Here are some resources from your coach.',
            files: [generateMockFile()],
            links: [
                generateMockLink({ url: 'https://developer.mozilla.org', title: 'MDN Docs' }),
            ],
        };

        return [
            { ...textReply, linkEditIndex: null },
            { ...resourceReply, linkEditIndex: null, files: resourceReply.files || [], links: resourceReply.links || [] },
            { ...otherUserResourceReply, linkEditIndex: null, files: otherUserResourceReply.files || [], links: otherUserResourceReply.links || [] }
        ];
    });

    // --- Handlers for assignment-level files/links ---
    const onChange = (
        newFiles: fileMetadata.TFileMetadata[],
        newLinks: shared.TLink[],
        newLinkEditIndex?: number | null
    ) => {
        setFiles(newFiles);
        setLinks(newLinks);
        setLinkEditIndex(typeof newLinkEditIndex === 'number' ? newLinkEditIndex : null);
    };

    const onFileDelete = (assignmentId: number, fileId: number, type: 'file') => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
    };
    const onFileDownload = (fileId: number) => {
        alert(`Download clicked for file with id: ${fileId}`);
    };
    const onLinkDelete = (assignmentId: number, linkId: number, type: 'link') => {
        setLinks(prev => prev.filter(l => l.linkId !== linkId));
        if (linkEditIndex !== null && links[linkEditIndex]?.linkId === linkId) {
            setLinkEditIndex(null);
        }
    };

    // --- Handlers for replies (per reply) ---
    // File/Link download/delete for replies
    const handleReplyFileDownload = (fileId: number) => {
        alert(`Download file with id: ${fileId}`);
    };
    const handleReplyFileDelete = (replyId: number, fileId: number, type: 'file') => {
        setReplies(prev =>
            prev.map(reply =>
                reply.replyId === replyId && reply.type === 'resources'
                    ? { ...reply, files: (reply.files || []).filter(f => f.id !== fileId) }
                    : reply
            )
        );
    };

    const handleReplyLinkDelete = (replyId: number, linkId: number, type: 'link') => {
        setReplies(prev =>
            prev.map(reply =>
                reply.replyId === replyId && reply.type === 'resources'
                    ? {
                        ...reply,
                        links: (reply.links || []).filter(l => l.linkId !== linkId),
                        linkEditIndex: null,
                    }
                    : reply
            )
        );
    };

    // Per-reply onChange handler
    const handleReplyChange = (
        replyId: number,
        newFiles: fileMetadata.TFileMetadata[],
        newLinks: shared.TLink[],
        newLinkEditIndex?: number | null
    ) => {
        console.log("reply changed", replyId, newFiles, newLinks, newLinkEditIndex);
        setReplies(prev =>
            prev.map(reply =>
                reply.replyId === replyId
                    ? {
                        ...reply,
                        files: newFiles,
                        links: newLinks,
                        linkEditIndex: typeof newLinkEditIndex === 'number' ? newLinkEditIndex : null,
                    }
                    : reply
            )
        );
    };

    // --- ReplyPanel handlers (for new reply) ---
    const sender = role === 'coach'
        ? {
            id: 'coach-1',
            name: 'Coach Bob',
            image: 'https://randomuser.me/api/portraits/men/1.jpg',
            isCurrentUser: true,
            role: 'coach' as const,
        }
        : {
            id: 'student-1',
            name: 'Alice Johnson',
            image: 'https://randomuser.me/api/portraits/women/2.jpg',
            isCurrentUser: true,
            role: 'student' as const,
        };
    const replyId = Math.floor(Math.random() * 1000000);

    const handleFilesChange = async (filesReq: fileMetadata.TFileUploadRequest[]) => {
        return await simulateFileUpload(filesReq);
    };
    const handleCreateLink = async (data: shared.TLink) => {
        return await simulateLinkCreateOrEdit(data);
    };

    const handleClickPassed = (reply: assignment.TAssignmentReply) => {
        setReplies(prev => [
            ...prev,
            { ...reply, linkEditIndex: null },
        ]);
        alert('Assignment marked as passed!');
    };

    const handleClickSendMessage = (reply: assignment.TAssignmentReply) => {
        setReplies(prev => [
            ...prev,
            reply.type === 'resources'
                ? { ...reply, linkEditIndex: null, files: reply.files || [], links: reply.links || [] }
                : { ...reply, linkEditIndex: null }
        ]);
        alert('Reply sent!');
        console.log("this is the reply", reply);
    };

    // --- Compose children: all replies as Message, then ReplyPanel ---
    const children = (
        <div className="flex flex-col gap-4 w-full">
            {replies.map((reply) => (
                <Message
                    key={reply.replyId}
                    reply={reply}
                    linkEditIndex={reply.linkEditIndex ?? null}
                    onFileDownload={handleReplyFileDownload}
                    onFileDelete={handleReplyFileDelete}
                    onLinkDelete={handleReplyLinkDelete}
                    onChange={(newFiles, newLinks, newLinkEditIndex) =>
                        handleReplyChange(reply.replyId, newFiles, newLinks, newLinkEditIndex)
                    }
                    locale={locale}
                />
            ))}
            <ReplyPanel
                role={role}
                replyId={replyId}
                sender={sender}
                onFileDownload={handleReplyFileDownload}
                onFileDelete={handleReplyFileDelete}
                onLinkDelete={handleReplyLinkDelete}
                onFilesChange={handleFilesChange}
                onCreateLink={handleCreateLink}
                onClickPassed={handleClickPassed}
                onClickSendMessage={handleClickSendMessage}
                locale={locale}
            />
        </div>
    );

    return (
        <AssignmentModal
            assignmentId={123}
            title="Component Design Assignment"
            description="Create a reusable button component with variants and size options."
            files={files}
            links={links}
            course={mockCourse}
            module={1}
            lesson={1}
            status="AwaitingReview"
            student={mockStudent}
            groupName={mockGroup.name}
            role={role}
            linkEditIndex={linkEditIndex}
            onFileDelete={onFileDelete}
            onFileDownload={onFileDownload}
            onLinkDelete={onLinkDelete}
            onChange={onChange}
            onClickCourse={() => alert('Course clicked')}
            onClickUser={() => alert('User clicked')}
            onClickGroup={() => alert('Group clicked')}
            onClose={() => alert('Modal closed')}
            locale={locale}
        >
            {children}
        </AssignmentModal>
    );
};

// --- Storybook Meta ---
const meta: Meta<typeof AssignmentModal> = {
    title: 'Components/Assignment/AssignmentModal',
    component: AssignmentModal,
    tags: ['autodocs'],
    argTypes: {
        role: {
            control: 'radio',
            options: ['student', 'coach'],
            defaultValue: 'student',
        },
        locale: {
            control: 'radio',
            options: ['en', 'de'],
            defaultValue: 'en',
        },
    },
};
export default meta;
type Story = StoryObj<typeof AssignmentModal>;

// --- Story Export ---
export const Default: Story = {
    render: (args) => (
        <AssignmentModalRender
            role={args.role || 'student'}
            locale={args.locale || 'en'}
        />
    ),
    args: {
        role: 'student',
        locale: 'en',
    },
};
