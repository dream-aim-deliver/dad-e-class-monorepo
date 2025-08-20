import { FC, useEffect, useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
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
    role: Omit<role.TRole, 'visitor' | 'admin'>;
    withReplies?: boolean;
}> = ({ locale, role, withReplies }) => {
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

        return [
            {
                replyId: 1,
                timestamp: new Date().toISOString(),
                type: "text",
                comment: "Great job!",
                sender: mockCoach,
            },
            {
                replyId: 2,
                timestamp: new Date().toISOString(),
                type: "resources",
                comment: "Thanks for feedback!",
                sender: mockStudent,
                files: [file],
                links: [link],
            },
            {
                replyId: 3,
                timestamp: new Date().toISOString(),
                type: "resources",
                comment: "Please check these resources.",
                files: [file],
                links: [link],
                sender: mockCoach,
            },
        ];
    });

    // Track per reply editing
    const [messageLinkEditIndexes, setMessageLinkEditIndexes] = useState<Record<number, number | null>>({});

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
            messagesLinkEditIndexes: messageLinkEditIndexes,
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
        messageLinkEditIndexes,
        replyComment,
        replyFiles,
        replyLinks,
        replyDraftLink,
        replyLinkEditIndex
    ]);

    const handleFileDownload = (id: string) => alert(`Download file ${id}`);

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
        image: fileMetadata.TFileMetadata,
        abortSignal?: AbortSignal
    ) => {
        if (linkEditIndex === null) return;
        setLinks(links =>
            links.map((link, idx) =>
                idx === linkEditIndex
                    ? { ...link, customIcon: { ...image, status: 'processing' as const } }
                    : link
            )
        );
        try {
            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(resolve, 2000);
                if (abortSignal) {
                    abortSignal.addEventListener('abort', () => {
                        clearTimeout(timeout);
                        reject(new DOMException('Cancelled', 'AbortError'));
                    });
                }
            });
            setLinks(links =>
                links.map((link, idx) =>
                    idx === linkEditIndex
                        ? { ...link, customIcon: { ...image, status: 'available' as const } }
                        : link
                )
            );
        } catch {
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
        image: fileMetadata.TFileMetadata,
        abortSignal?: AbortSignal
    ) => {
        // Use the index logic as in your robust reply story
        const editIdx = replyDraftLink ? replyLinks.length : replyLinkEditIndex;
        if (typeof editIdx !== "number") return;

        const linksList = replyDraftLink ? [...replyLinks, replyDraftLink] : replyLinks;

        // "processing" state
        const updated = linksList.map((link, idx) =>
            idx === editIdx
                ? { ...link, customIcon: { ...image, status: 'processing' as const } }
                : link
        );
        if (replyDraftLink) {
            setReplyDraftLink(updated.pop()!);
            setReplyLinks(updated);
        } else {
            setReplyLinks(updated);
        }
        try {
            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(resolve, 2000);
                if (abortSignal) {
                    abortSignal.addEventListener('abort', () => {
                        clearTimeout(timeout);
                        reject(new DOMException('Cancelled', 'AbortError'));
                    });
                }
            });
            const available = (replyDraftLink ? [...replyLinks, replyDraftLink] : replyLinks).map((link, idx) =>
                idx === editIdx
                    ? { ...link, customIcon: { ...image, status: 'available' as const } }
                    : link
            );
            if (replyDraftLink) {
                setReplyDraftLink(available.pop()!);
                setReplyLinks(available);
            } else {
                setReplyLinks(available);
            }
        } catch {
            const removed = (replyDraftLink ? [...replyLinks, replyDraftLink] : replyLinks).map((link, idx) =>
                idx === editIdx
                    ? { ...link, customIcon: undefined }
                    : link
            );
            if (replyDraftLink) {
                setReplyDraftLink(removed.pop()!);
                setReplyLinks(removed);
            } else {
                setReplyLinks(removed);
            }
        }
    };

    const handleReplyDeleteIcon = (id: string) => {
        const editIdx = replyDraftLink ? replyLinks.length : replyLinkEditIndex;
        if (typeof editIdx !== "number") return;
        const linksList = replyDraftLink ? [...replyLinks, replyDraftLink] : replyLinks;
        const updated = linksList.map((link, idx) =>
            idx === editIdx && link.customIcon?.id === id
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
                timestamp: new Date().toISOString(),
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

    const handleMessageChange = (
        updatedFiles: fileMetadata.TFileMetadata[],
        updatedLinks: shared.TLinkWithId[],
        linkEditIndex: number | null,
        messageId: number
    ) => {
        setMessages(prev =>
            prev.map(msg =>
                msg.replyId === messageId
                    ? {
                        ...msg,
                        type: "resources",
                        files: updatedFiles,
                        links: updatedLinks,
                    }
                    : msg
            )
        );
        setMessageLinkEditIndexes(prev => ({
            ...prev,
            [messageId]: linkEditIndex,
        }));
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
                {messages.map((msg, index) => {
                    const isResourcesType = msg.type === "resources";

                    // narrow the type to include `files` and `links`.
                    const files = isResourcesType ? msg.files ?? [] : [];
                    const links = isResourcesType ? msg.links ?? [] : [];

                    const msgLinkEditIndex = messageLinkEditIndexes[msg.replyId] ?? null;

                    const handleMessageImageChange = async (
                        image: fileMetadata.TFileMetadata,
                        abortSignal?: AbortSignal
                    ) => {
                        if (msgLinkEditIndex === null) return;

                        const isResourcesType = msg.type === "resources";
                        const files = isResourcesType ? msg.files ?? [] : [];
                        const links = isResourcesType ? msg.links ?? [] : [];

                        // Set status to processing for customIcon of editing link
                        const updatedLinks = links.map((link, idx) =>
                            idx === msgLinkEditIndex
                                ? { ...link, customIcon: { ...image, status: 'processing' as const } }
                                : link
                        );
                        handleMessageChange(files, updatedLinks, msgLinkEditIndex, msg.replyId);

                        try {
                            await new Promise<void>((resolve, reject) => {
                                const timeout = setTimeout(resolve, 2000);
                                if (abortSignal) {
                                    abortSignal.addEventListener('abort', () => {
                                        clearTimeout(timeout);
                                        reject(new DOMException('Cancelled', 'AbortError'));
                                    });
                                }
                            });

                            // set status to available
                            const readyLinks = links.map((link, idx) =>
                                idx === msgLinkEditIndex
                                    ? { ...link, customIcon: { ...image, status: 'available' as const } }
                                    : link
                            );
                            handleMessageChange(files, readyLinks, msgLinkEditIndex, msg.replyId);
                        } catch {
                            // remove icon if aborted
                            const removedLinks = links.map((link, idx) =>
                                idx === msgLinkEditIndex
                                    ? { ...link, customIcon: undefined }
                                    : link
                            );
                            handleMessageChange(files, removedLinks, msgLinkEditIndex, msg.replyId);
                        }
                    };

                    const handleMessageDeleteIcon = (id: string) => {
                        if (msgLinkEditIndex === null) return;

                        const isResourcesType = msg.type === "resources";
                        const files = isResourcesType ? msg.files ?? [] : [];
                        const links = isResourcesType ? msg.links ?? [] : [];

                        const updatedLinks = links.map((link, idx) =>
                            idx === msgLinkEditIndex && link.customIcon?.id === id
                                ? { ...link, customIcon: undefined }
                                : link
                        );
                        handleMessageChange(files, updatedLinks, msgLinkEditIndex, msg.replyId);
                    };

                    return (
                        <Message
                            key={msg.replyId}
                            reply={msg}
                            linkEditIndex={messageLinkEditIndexes[msg.replyId] ?? null}
                            locale={locale}
                            onFileDownload={handleFileDownload}
                            onFileDelete={(_id, fileId) => {
                                // only handle if resource type
                                isResourcesType &&
                                    handleMessageChange(
                                        files.filter((f) => f.id !== fileId),
                                        links,
                                        null,
                                        msg.replyId
                                    );
                            }}
                            onLinkDelete={(_id, linkId) => {
                                isResourcesType &&
                                    handleMessageChange(
                                        files,
                                        links.filter((l) => l.linkId !== linkId),
                                        null,
                                        msg.replyId
                                    );
                            }}
                            onChange={(newFiles, newLinks, newLinkEditIndex) =>
                                handleMessageChange(
                                    newFiles,
                                    newLinks,
                                    newLinkEditIndex ?? null,
                                    msg.replyId
                                )
                            }
                            onImageChange={handleMessageImageChange}
                            onDeleteIcon={handleMessageDeleteIcon}
                        />
                    );
                })}

                <ReplyPanel
                    locale={locale}
                    role={role}
                    comment={replyComment}
                    sender={sender}
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
                    onClickSendMessage={(reply) => handleSendMessage(reply)}
                    onClickAddLink={() => {
                        if (!replyDraftLink && replyLinkEditIndex === undefined) {
                            setReplyDraftLink({ linkId: 0, url: "", title: "" });
                        }
                    }}
                    onClickEditLink={(index) => {
                        if (replyDraftLink) setReplyDraftLink(null);
                        setReplyLinkEditIndex(index);
                    }}
                    onLinkDelete={(linkId, index) => {
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
                />
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
