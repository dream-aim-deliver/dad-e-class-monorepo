import React, { useState, useEffect } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { AssignmentCard } from "../../lib/components/assignment/assignment-card";
import { assignment, fileMetadata, role, shared } from "@maany_shr/e-class-models";
import { TLocale } from "@maany_shr/e-class-translations";

// --- Data Generators ---
const mockCourse = {
    id: 7,
    title: "Super Course",
    imageUrl: "https://picsum.photos/40/40",
};

const mockStudent = {
    id: "stu1",
    name: "Priya",
    image: "https://randomuser.me/api/portraits/women/18.jpg",
    isCurrentUser: true,
    role: "student" as const,
};

const fakeFile = (): fileMetadata.TFileMetadata => ({
    id: Math.random().toString(36).substring(2),
    name: "Assignment.pdf",
    size: 50488,
    status: "available",
    category: "document",
    url: "https://example.com/document.pdf",
});
const fakeLink = (): shared.TLinkWithId => ({
    linkId: Math.floor(Math.random() * 10000),
    title: "Reference",
    url: "https://ref.com",
});

const fakeReply = (overrides = {}): assignment.TAssignmentReplyWithId => ({
    replyId: Math.floor(Math.random() * 99999),
    timestamp: Date.now() - 86400000, // 1 day ago
    type: "resources",
    comment: "Here is my submission.",
    sender: mockStudent,
    files: [fakeFile()],
    links: [fakeLink()],
    ...overrides,
});

// Add a mock coach sender
const mockSenderCoach = {
    id: "coach1",
    name: "Coach Smith",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    isCurrentUser: false,
    role: "coach" as const,
};

// --- Meta ---
const meta: Meta<typeof AssignmentCard> = {
    title: "Components/Assignment/AssignmentCard",
    component: AssignmentCard,
    argTypes: {
        locale: {
            control: "radio",
            options: ["en", "de"],
            defaultValue: "en",
        },
        role: {
            control: "radio",
            options: ["coach", "student"],
        },
    },
};
export default meta;
type Story = StoryObj<typeof AssignmentCard>;

// --- Template/Wrapper React Component ---
const CardTemplate = ({
    role,
    locale,
    status,
    hasReply
}: {
    role: Omit<role.TRole, 'visitor' | 'admin' | 'superadmin'>;
    locale: TLocale;
    status: assignment.TAssignmentStatusEnum;
    hasReply: boolean;
}) => {
    // Assignment state
    const [files, setFiles] = useState([fakeFile()]);
    const [links, setLinks] = useState([fakeLink()]);
    const [linkEditIndex, setLinkEditIndex] = useState<number>(-1);

    // Latest Reply state (independent)
    const [replies, setReplies] = useState<assignment.TAssignmentReplyWithId[]>(
        hasReply
            ? status === "Passed"
                ? [{
                    replyId: 1,
                    timestamp: Date.now(),
                    sender: mockSenderCoach,
                    type: 'passed' as const,
                }]
                : [fakeReply()]
            : []
    );
    const [replyLinkEditIndex, setReplyLinkEditIndex] = useState<number>(-1);
    // For Message reply edit operations, grab files/links from latest reply

    // --- Logging all state after update ---
    useEffect(() => {
         
        console.log("AssignmentCard state:", {
            files,
            links,
            linkEditIndex,
            replies,
            replyLinkEditIndex,
        });
    }, [files, links, linkEditIndex, replies, replyLinkEditIndex]);

    // Assignment-level handlers
    const onFileDownload = (id: string) => alert("Download file " + id);

    const onFileDelete = (assignmentId: number, fileId: string) => {
        setFiles(prev => prev.filter(f => f.id !== fileId));
    };

    const onLinkDelete = (assignmentId: number, linkId: number) => {
        setLinks(prev => {
            const upd = prev.filter(l => l.linkId !== linkId);
            if (linkEditIndex !== -1 && prev[linkEditIndex]?.linkId === linkId) setLinkEditIndex(-1);
            return upd;
        });
    };

    // Reply file delete handler
    const onReplyFileDelete = (replyId: number, fileId: string) => {
        setReplies(prev =>
            prev.map(reply =>
                reply.replyId === replyId && reply.type === 'resources'
                    ? {
                        ...reply,
                        files: reply.files?.filter(f => f.id !== fileId) || [],
                    }
                    : reply
            )
        );
    };

    // Reply link delete handler
    const onReplyLinkDelete = (replyId: number, linkId: number) => {
        setReplies(prev =>
            prev.map(reply =>
                reply.replyId === replyId && reply.type === 'resources'
                    ? {
                        ...reply,
                        links: reply.links?.filter(link => link.linkId !== linkId) || [],
                    }
                    : reply
            )
        );
    };

    const onChange = (
        newFiles: fileMetadata.TFileMetadata[],
        newLinks: shared.TLinkWithId[],
        newEditIndex: number
    ) => {
        setFiles(newFiles);
        setLinks(newLinks);
        setLinkEditIndex(typeof newEditIndex === "number" ? newEditIndex : -1);
    };

    const handleImageChange = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ): Promise<fileMetadata.TFileMetadata> => {
        // Simulate file upload
        const uploadedFile: fileMetadata.TFileMetadata = {
            id: Math.random().toString(36).substring(2),
            name: fileRequest.name,
            size: fileRequest.file.size,
            status: 'processing' as const,
            category: 'image' as const,
            url: URL.createObjectURL(fileRequest.file),
            thumbnailUrl: URL.createObjectURL(fileRequest.file),
        };

        // Update link with processing status
        if (linkEditIndex !== -1) {
            setLinks(links =>
                links.map((link, idx) =>
                    idx === linkEditIndex
                        ? { ...link, customIcon: uploadedFile }
                        : link
                )
            );
        }

        try {
            // Simulate async upload with abort
            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => resolve(), 2000);
                if (abortSignal) {
                    abortSignal.addEventListener('abort', () => {
                        clearTimeout(timeout);
                        reject(new DOMException('Cancelled', 'AbortError'));
                    });
                }
            });

            // Finished upload, mark as 'available'
            const finalFile = { ...uploadedFile, status: 'available' as const };

            if (linkEditIndex !== -1) {
                setLinks(currentLinks =>
                    currentLinks.map((link, idx) =>
                        idx === linkEditIndex
                            ? { ...link, customIcon: finalFile }
                            : link
                    )
                );
            }

            return finalFile;
        } catch (error) {
            // Remove if aborted or error
            if (linkEditIndex !== -1) {
                setLinks(currentLinks =>
                    currentLinks.map((link, idx) =>
                        idx === linkEditIndex
                            ? { ...link, customIcon: undefined }
                            : link
                    )
                );
            }
            throw error;
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

    // --- Latest Reply handlers ---
    const onReplyChange = (
        newFiles: fileMetadata.TFileMetadata[],
        newLinks: shared.TLinkWithId[],
        newEditIndex: number
    ) => {
        setReplies(prev => [
            {
                ...prev[0],
                files: newFiles,
                links: newLinks,
            }
        ]);
        setReplyLinkEditIndex(typeof newEditIndex === "number" ? newEditIndex : -1);
    };

    const handleReplyImageChange = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal
    ): Promise<fileMetadata.TFileMetadata> => {
        // Simulate file upload
        const uploadedFile: fileMetadata.TFileMetadata = {
            id: Math.random().toString(36).substring(2),
            name: fileRequest.name,
            size: fileRequest.file.size,
            status: 'processing' as const,
            category: 'image' as const,
            url: URL.createObjectURL(fileRequest.file),
            thumbnailUrl: URL.createObjectURL(fileRequest.file),
        };

        // Set status to 'processing'
        if (replyLinkEditIndex !== -1) {
            setReplies(prev => [
                prev[0].type === 'resources'
                    ? {
                        ...prev[0],
                        links: (prev[0].links ?? []).map((link, idx) =>
                            idx === replyLinkEditIndex
                                ? { ...link, customIcon: uploadedFile }
                                : link
                        )
                    }
                    : prev[0]
            ]);
        }

        try {
            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => resolve(), 2000);
                if (abortSignal) {
                    abortSignal.addEventListener('abort', () => {
                        clearTimeout(timeout);
                        reject(new DOMException('Cancelled', 'AbortError'));
                    });
                }
            });

            // On success: mark as 'available'
            const finalFile = { ...uploadedFile, status: 'available' as const };

            if (replyLinkEditIndex !== -1) {
                setReplies(prev => [
                    prev[0].type === 'resources'
                        ? {
                            ...prev[0],
                            links: (prev[0].links ?? []).map((link, idx) =>
                                idx === replyLinkEditIndex
                                    ? { ...link, customIcon: finalFile }
                                    : link
                            )
                        }
                        : prev[0]
                ]);
            }

            return finalFile;
        } catch (error) {
            // On abort/failure: remove customIcon
            if (replyLinkEditIndex !== -1) {
                setReplies(prev => [
                    prev[0].type === 'resources'
                        ? {
                            ...prev[0],
                            links: (prev[0].links ?? []).map((link, idx) =>
                                idx === replyLinkEditIndex
                                    ? { ...link, customIcon: undefined }
                                    : link
                            )
                        }
                        : prev[0]
                ]);
            }
            throw error;
        }
    };

    const handleReplyDeleteIcon = (id: string) => {
        if (replyLinkEditIndex === -1) return;

        setReplies(prev => [
            prev[0].type === 'resources'
                ? {
                    ...prev[0],
                    links: (prev[0].links ?? []).map((link, idx) =>
                        idx === replyLinkEditIndex && link.customIcon?.id === id
                            ? { ...link, customIcon: undefined }
                            : link
                    )
                }
                : prev[0]
        ]);
    };

    // UI handlers
    const onClickCourse = () => alert("Go to Course");
    const onClickUser = () => alert("Go to Student");
    const onClickGroup = () => alert("Go to Group");
    const onClickView = () => alert("Go to Details");

    return (
        <AssignmentCard
            assignmentId={99}
            role={role}
            title="Algebra Homework"
            description="Solve all the equations in section B."
            files={files}
            links={links}
            course={mockCourse}
            module={2}
            lesson={4}
            status={status}
            replies={replies}
            student={mockStudent}
            groupName="Team Rockets"
            linkEditIndex={linkEditIndex}
            onFileDownload={onFileDownload}
            onFileDelete={onFileDelete}
            onLinkDelete={onLinkDelete}
            onChange={onChange}
            onImageChange={handleImageChange}
            onDeleteIcon={handleDeleteIcon}
            // Reply separation
            onReplyFileDelete={onReplyFileDelete}
            onReplyLinkDelete={onReplyLinkDelete}
            replyLinkEditIndex={replyLinkEditIndex}
            onReplyChange={onReplyChange}
            onReplyImageChange={handleReplyImageChange}
            onReplyDeleteIcon={handleReplyDeleteIcon}
            // rest
            onClickCourse={onClickCourse}
            onClickUser={onClickUser}
            onClickGroup={onClickGroup}
            onClickView={onClickView}
            locale={locale}
        />
    );
};

// --- Play Stories ---
export const AwaitingReviewNoReply: Story = {
    render: (args) => (
        <CardTemplate role={args.role} locale={args.locale} status="AwaitingReview" hasReply={false} />
    ),
    args: {
        role: "coach",
        locale: "en",
    },
};

export const AwaitingReviewWithReply: Story = {
    render: (args) => (
        <CardTemplate role={args.role} locale={args.locale} status="AwaitingReview" hasReply={true} />
    ),
    args: {
        role: "coach",
        locale: "en",
    },
};

export const PassedWithReply: Story = {
    render: (args) => (
        <CardTemplate role={args.role} locale={args.locale} status="Passed" hasReply={true} />
    ),
    args: {
        role: "student",
        locale: "en",
    },
};

export const AwaitingForLongTimeNoReply: Story = {
    render: (args) => (
        <CardTemplate role={args.role} locale={args.locale} status="AwaitingForLongTime" hasReply={false} />
    ),
    args: {
        role: "coach",
        locale: "en",
    },
};
