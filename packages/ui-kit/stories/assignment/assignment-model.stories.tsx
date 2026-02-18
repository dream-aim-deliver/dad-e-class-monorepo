import { FC, useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { AssignmentModal } from '../../lib/components/assignment/assignment-modal';
import { Message } from '../../lib/components/assignment/message';
import { ReplyPanel } from '../../lib/components/assignment/reply-panel';
import { assignment, fileMetadata, role, shared } from '@maany_shr/e-class-models';

// Mock Data Generators
const mockCourse = {
    id: 1,
    title: 'Storybook Champions',
    imageUrl: 'https://picsum.photos/40/40',
};

const mockStudent = {
    id: '1',
    name: 'John Doe',
    image: 'https://randomuser.me/api/portraits/men/3.jpg',
    isCurrentUser: false,
    role: 'student' as const,
};

const mockCoach = {
    id: '2',
    name: 'Coach Jane',
    image: 'https://randomuser.me/api/portraits/women/5.jpg',
    isCurrentUser: true,
    role: 'coach' as const,
};

const generateFile = (): fileMetadata.TFileMetadata => ({
    id: Math.random().toString(),
    name: 'Slide.pdf',
    size: 102400,
    status: 'available',
    category: 'document',
    url: 'https://example.com/slide.pdf',
});

const generateLink = (): shared.TLinkWithId => ({
    linkId: Math.floor(Math.random() * 1_000_000),
    title: 'Example Link',
    url: 'https://example.com',
});

// Meta
const meta: Meta<typeof AssignmentModal> = {
    title: 'Components/Assignment/AssignmentModal',
    component: AssignmentModal,
    tags: ['autodocs'],
    argTypes: {
        locale: {
            control: 'radio',
            options: ['en', 'de'],
            defaultValue: 'en',
        },
        role: {
            control: 'radio',
            options: ['coach', 'student'],
        },
    },
};
export default meta;
type Story = StoryObj<typeof AssignmentModal>;

// Template Component
const ModalTemplate: FC<{
    locale: 'en' | 'de';
    role: Omit<role.TRole, 'visitor' | 'admin' | 'superadmin'>;
    withReplies?: boolean;
    status?: 'active' | 'passed';
}> = ({ locale, role, withReplies, status = 'active' }) => {
    const sender = role === 'coach' ? mockCoach : mockStudent;

    // Assignment-level state
    const [description] = useState("This is the assignment description.");
    const [files, setFiles] = useState<fileMetadata.TFileMetadata[]>([generateFile()]);
    const [links, setLinks] = useState<shared.TLinkWithId[]>([generateLink()]);
    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    // MESSAGE HISTORY
    const [messages, setMessages] = useState<assignment.TAssignmentReplyWithId[]>(() => {
        if (!withReplies) return [];

        const file = generateFile();
        const link = generateLink();

        const baseMessages: assignment.TAssignmentReplyWithId[] = [
            {
                replyId: 1,
                timestamp: Math.floor((Date.now() - 172800000) / 1000), // 2 days ago in seconds
                type: "text" as const,
                comment: "Great job!",
                sender: mockCoach,
            },
            {
                replyId: 2,
                timestamp: Math.floor((Date.now() - 86400000) / 1000), // 1 day ago in seconds
                type: "resources" as const,
                comment: "Thanks for feedback!",
                sender: mockStudent,
                files: [file],
                links: [link],
            },
            {
                replyId: 3,
                timestamp: Math.floor((Date.now() - 3600000) / 1000), // 1 hour ago in seconds
                type: "resources" as const,
                comment: "Please check these resources.",
                files: [file],
                links: [link],
                sender: mockCoach,
            },
        ];

        // If status is passed, add a passed reply
        if (status === 'passed') {
            return [
                ...baseMessages,
                {
                    replyId: 4,
                    timestamp: Math.floor((Date.now() - 1800000) / 1000), // 30 minutes ago in seconds
                    type: 'passed' as const,
                    sender: mockCoach,
                },
            ];
        }

        return baseMessages;
    });


    // REPLY PANEL STATE
    const [replyComment, setReplyComment] = useState('');
    const [replyFiles, setReplyFiles] = useState<fileMetadata.TFileMetadata[]>([]);
    const [replyLinks, setReplyLinks] = useState<shared.TLinkWithId[]>([]);
    const [replyLinkEditIndex, setReplyLinkEditIndex] = useState<number | undefined>();
    const [replyDraftLink, setReplyDraftLink] = useState<shared.TLinkWithId | null>(null);

    useEffect(() => {
        // Compose the current "complete data" snapshot
        const data = {
            modal: {
                files,
                links,
                linkEditIndex,
                description,
                // Assignment-level...
            },
            messages,
            replyPanel: {
                replyComment,
                replyFiles,
                replyLinks,
                replyDraftLink,
                replyLinkEditIndex
            },
        };
        console.log('[AssignmentModal Data Snapshot]', data);
    }, [
        files,
        links,
        linkEditIndex,
        messages,
        replyComment,
        replyFiles,
        replyLinks,
        replyDraftLink,
        replyLinkEditIndex
    ]);

    const handleFileDownload = (id: string) => alert(`Download file ${id}`);

    const handleMessageFileDownload = (file: fileMetadata.TFileMetadata) => alert(`Download file ${file.name}`);

    const handleFileDelete = (assignmentId: number, fileId: string) => {
        setFiles(prev => prev.filter(file => file.id !== fileId));
    };

    const handleLinkDelete = (assignmentId: number, linkId: number) => {
        setLinks(prev => prev.filter(link => link.linkId !== linkId));
        if (linkEditIndex !== null && links[linkEditIndex]?.linkId === linkId) {
            setLinkEditIndex(null);
        }
    };

    const handleImageChange = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ): Promise<fileMetadata.TFileMetadata> => {
        const uploadedFile = await simulateFileUpload(fileRequest, abortSignal);

        if (linkEditIndex !== null) {
            setLinks(links =>
                links.map((link, idx) =>
                    idx === linkEditIndex
                        ? { ...link, customIcon: uploadedFile }
                        : link
                )
            );
        }

        return uploadedFile;
    };

    const handleDeleteIcon = (id: string) => {
        if (linkEditIndex === null) return;
        setLinks(links =>
            links.map((link, idx) =>
                idx === linkEditIndex && link.customIcon?.id === id
                    ? { ...link, customIcon: undefined }
                    : link
            )
        );
    };

    const handleReplyImageChange = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ): Promise<fileMetadata.TFileMetadata> => {
        const uploadedFile = await simulateFileUpload(fileRequest, abortSignal);

        // Use the index logic as in your robust reply story
        const editIdx = replyDraftLink ? replyLinks.length : replyLinkEditIndex;
        if (typeof editIdx === "number") {
            const linksList = replyDraftLink ? [...replyLinks, replyDraftLink] : replyLinks;

            const updated = linksList.map((link, idx) =>
                idx === editIdx
                    ? { ...link, customIcon: uploadedFile }
                    : link
            );
            if (replyDraftLink) {
                setReplyDraftLink(updated.pop()!);
                setReplyLinks(updated);
            } else {
                setReplyLinks(updated);
            }
        }

        return uploadedFile;
    };

    const handleReplyDeleteIcon = (index: number) => {
        const linksList = replyDraftLink ? [...replyLinks, replyDraftLink] : replyLinks;
        const updated = linksList.map((link, idx) =>
            idx === index
                ? { ...link, customIcon: undefined }
                : link
        );
        if (replyDraftLink) {
            setReplyDraftLink(updated.pop()!);
            setReplyLinks(updated);
        } else {
            setReplyLinks(updated);
        }
    };

    const handleChange = (
        newFiles: fileMetadata.TFileMetadata[],
        newLinks: shared.TLinkWithId[],
        newLinkEditIndex: number | null
    ) => {
        setFiles(newFiles);
        setLinks(newLinks);
        setLinkEditIndex(newLinkEditIndex ?? null);
    };

    const handleSendMessage = (reply: assignment.TAssignmentReply) => {
        setMessages(prev => [
            ...prev,
            {
                ...reply,
                replyId: Date.now(),
                timestamp: Math.floor(Date.now() / 1000), // Convert to seconds
            },
        ]);

        setReplyComment('');
        setReplyFiles([]);
        setReplyLinks([]);
        setReplyLinkEditIndex(undefined);
        setReplyDraftLink(null);
    };

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
                videoId: String(Math.floor(Math.random() * 1000)),
                url: URL.createObjectURL(file.file),
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


    return (
        <AssignmentModal
            assignmentId={42}
            title="Sample Assignment Modal"
            description={description}
            course={mockCourse}
            module={1}
            lesson={2}
            role={role}
            status="AwaitingReview"
            student={mockStudent}
            groupName="Group A"
            files={files}
            links={links}
            linkEditIndex={linkEditIndex}
            onFileDownload={handleFileDownload}
            onFileDelete={handleFileDelete}
            onLinkDelete={handleLinkDelete}
            onChange={handleChange}
            locale={locale}
            onImageChange={handleImageChange}
            onDeleteIcon={handleDeleteIcon}
            onClickCourse={() => alert("Course clicked")}
            onClickUser={() => alert("User clicked")}
            onClickGroup={() => alert("Group clicked")}
            onClose={() => alert("Modal closed")}
        >
            <div className="flex flex-col gap-4 w-full">
                {messages.map((msg) => (
                    <Message
                        key={msg.replyId}
                        reply={msg}
                        locale={locale}
                        onFileDownload={handleMessageFileDownload}
                    />
                ))}

                {status !== 'passed' && (
                    <ReplyPanel
                    locale={locale}
                    role={role}
                    comment={replyComment}
                    files={replyFiles}
                    links={replyDraftLink ? [...replyLinks, replyDraftLink] : replyLinks}
                    linkEditIndex={replyDraftLink ? replyLinks.length : replyLinkEditIndex}
                    onChangeComment={setReplyComment}
                    onFileDownload={(id) => alert("Download: " + id)}
                    onFileDelete={(fileId) =>
                        setReplyFiles((prev) => prev.filter((f) => f.id !== fileId))
                    }
                    onFilesChange={simulateFileUpload}
                    onUploadComplete={(file) =>
                        setReplyFiles((prev) => [...prev, file])
                    }
                    onClickSendMessage={() => {
                        // Construct reply from current state
                        const reply: assignment.TAssignmentReply = {
                            type: 'resources',
                            comment: replyComment,
                            sender: sender,
                            files: replyFiles,
                            links: replyDraftLink ? [...replyLinks, replyDraftLink] : replyLinks,
                        };
                        handleSendMessage(reply);
                    }}
                    onClickAddLink={() => {
                        if (!replyDraftLink && replyLinkEditIndex === undefined) {
                            setReplyDraftLink({ linkId: 0, url: "", title: "" });
                        }
                    }}
                    onClickEditLink={(index) => {
                        if (replyDraftLink) setReplyDraftLink(null);
                        setReplyLinkEditIndex(index);
                    }}
                    onLinkDelete={(index) => {
                        if (replyDraftLink && index === replyLinks.length) {
                            setReplyDraftLink(null);
                        } else {
                            setReplyLinks((prev) => prev.filter((_, i) => i !== index));
                            if (replyLinkEditIndex === index)
                                setReplyLinkEditIndex(undefined);
                        }
                    }}
                    onCreateLink={async (data, index) => {
                        if (replyDraftLink) {
                            const newLink = {
                                ...data,
                                linkId: Math.floor(Math.random() * 100000),
                            };
                            setReplyLinks([...replyLinks, newLink]);
                            setReplyDraftLink(null);
                            return newLink;
                        } else if (typeof replyLinkEditIndex === "number") {
                            const updated = [...replyLinks];
                            updated[replyLinkEditIndex] = {
                                ...data,
                                linkId: replyLinks[replyLinkEditIndex].linkId,
                            };
                            setReplyLinks(updated);
                            setReplyLinkEditIndex(undefined);
                            return updated[replyLinkEditIndex];
                        }
                        return data;
                    }}
                    onImageChange={handleReplyImageChange}
                    onDeleteIcon={handleReplyDeleteIcon}
                    onLinkDiscard={(index) => {
                        if (replyDraftLink && index === replyLinks.length) {
                            setReplyDraftLink(null);
                        } else if (typeof replyLinkEditIndex === "number") {
                            setReplyLinkEditIndex(undefined);
                        }
                    }}
                    onClickMarkAsPassed={() => {
                        // Simulate marking as passed
                        const passedReply: assignment.TAssignmentReply = {
                            type: 'passed' as const,
                            sender: mockCoach,
                        };
                        handleSendMessage(passedReply);
                        alert("Assignment marked as passed!");
                    }}
                />
                )}
            </div>
        </AssignmentModal>
    );
};

// Stories

export const NoMessagesOnlyAssignment: Story = {
    render: (args) => <ModalTemplate locale={args.locale} role={args.role} />,
    args: {
        locale: "en",
        role: "coach",
    },
};

export const WithMessages: Story = {
    render: (args) => <ModalTemplate locale={args.locale} role={args.role} withReplies />,
    args: {
        locale: "en",
        role: "coach",
    },
};

export const PassedAssignment: Story = {
    render: (args) => <ModalTemplate locale={args.locale} role={args.role} withReplies status="passed" />,
    args: {
        locale: "en",
        role: "student",
    },
};
