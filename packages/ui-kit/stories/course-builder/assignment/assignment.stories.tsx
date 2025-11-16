import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import assignmentElement from "../../../lib/components/course-builder-lesson-component/assignment";
import { CourseElementType } from "../../../lib/components/course-builder/types";
import { fileMetadata, shared } from "@maany_shr/e-class-models";
import { AssignmentElement, AssignmentStatus } from "../../../lib/components/course-builder-lesson-component/types";
import { TLocale } from "@maany_shr/e-class-translations";

// --- Mock data
const mockFiles: fileMetadata.TFileMetadata[] = [
    {
        id: "file-1",
        name: "ProblemSet.pdf",
        size: 102400,
        status: "available",
        category: "document",
        url: "#",
    },
];

const mockLinks: shared.TLink[] = [
    {
        title: "Reference Article",
        url: "https://www.example.com/article",
    },
];

const BASE_ASSIGNMENT: AssignmentElement = {
    type: CourseElementType.Assignment,
    id: "assignment-1",
    title: "Sample Assignment Title",
    description: "This is a sample assignment description for preview and editing.",
    files: mockFiles,
    links: mockLinks,
};

const initialPreviewAssignment: AssignmentElement = {
    type: CourseElementType.Assignment,
    id: "assignment-preview-1",
    title: "Sample Assignment Title",
    description: "This is a sample assignment description for preview and editing.",
    files: mockFiles,
    links: mockLinks,
};

const passedAssignment: AssignmentElement = {
    type: CourseElementType.Assignment,
    id: "assignment-passed-1",
    title: "Completed Assignment",
    description: "This assignment has been completed and marked as passed.",
    files: mockFiles,
    links: mockLinks,
    progress: {
        status: AssignmentStatus.Passed,
        lastReply: {
            sentAt: Date.now() - 86400000, // 1 day ago
            comment: "Great work! Assignment completed successfully.",
            files: [],
            links: [],
            sender: {
                id: "coach-1",
                username: "coach_smith",
                name: "John",
                surname: "Smith",
                avatarUrl: "https://i.pravatar.cc/150?img=33",
                role: 'coach',
            }
        }
    }
};


interface PreviewStoryArgs {
    locale: TLocale;
}

// --- Mock file upload simulation
const mockImageResponse = (fileName: string): fileMetadata.TFileMetadata => ({
    id: String(Math.floor(Math.random() * 1000000)),
    name: fileName,
    mimeType: 'image/jpeg',
    size: Math.floor(Math.random() * 3000000) + 50000,
    checksum: `checksum-${Math.random().toString(36).substr(2, 16)}`,
    status: 'available',
    category: 'image',
    url: 'https://source.unsplash.com/random/300×200/?city',
    thumbnailUrl: 'https://picsum.photos/200/300',
} as fileMetadata.TFileMetadata);

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

// --- Meta definition
const meta: Meta<PreviewStoryArgs> = {
    title: "Components/CourseBuilder/AssignmentCourseElement",
    tags: ["autodocs"],
    argTypes: {
        locale: {
            control: "radio",
            options: ["en", "de"],
            defaultValue: "en",
        },
    },
};

export default meta;

// --- Designer Assignment Story as a React component (stateful!)
function DesignerAssignmentStory({ locale }: { locale: TLocale }) {
    const [elementInstance, setElementInstance] = useState<AssignmentElement>(BASE_ASSIGNMENT);
    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    useEffect(() => {
        console.log("Assignment Data Changed:", elementInstance);
    }, [elementInstance]);

    // File actions
    const handleFilesChange = async (file: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => {
        const uploadedFile = await simulateFileUpload(file, abortSignal);
        return uploadedFile;
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
        const files = elementInstance.files || [];
        const updatedFiles = files.some((f) => f.id === file.id)
            ? files.map((f) => f.id === file.id ? file : f)
            : [...files, file];
        setElementInstance((ad) => ({
            ...ad,
            files: updatedFiles,
        }));
    };

    const handleFileDelete = (id: string) => {
        setElementInstance((ad) => ({
            ...ad,
            files: (ad.files || []).filter(f => f.id !== id),
        }));
    };

    const handleImageChange = async (
        fileRequest: fileMetadata.TFileUploadRequest,
        abortSignal?: AbortSignal,
    ) => {
        const uploadedFile = await simulateFileUpload(fileRequest, abortSignal);
        return uploadedFile;
    };

    const handleDeleteIcon = (index: number) => {
        setElementInstance(ad => {
            const links = ad.links || [];
            return {
                ...ad,
                links: links.map((link, idx) =>
                    idx === index
                        ? { ...link, customIcon: undefined }
                        : link
                ),
            };
        });
    };

    // Link actions
    const handleLinkDelete = (index: number) => {
        setElementInstance((ad) => ({
            ...ad,
            links: (ad.links || []).filter((_, i) => i !== index),
        }));
        setLinkEditIndex(null);
    };

    const handleLinkEdit = (data: shared.TLink, idx: number) => {
        setElementInstance((ad) => {
            const links = ad.links || [];
            const updatedLinks = links.map((l, i) => i === idx ? { ...l, ...data } : l);
            return { ...ad, links: updatedLinks };
        });
        setLinkEditIndex(null);
    };

    const handleLinkDiscard = () => {
        setLinkEditIndex(null);
    };

    const handleClickAddLink = () => {
        // Prevent creating a draft if already editing one
        if (typeof linkEditIndex === 'number') return;
        setElementInstance((ad) => {
            const links = ad.links || [];
            return { ...ad, links: [...links, { title: "", url: "" }] };
        });
        setLinkEditIndex(elementInstance.links?.length ?? 0);
    };

    const handleClickEditLink = (idx: number) => {
        setElementInstance(ad => {
            const links = ad.links || [];
            // If the last link is a draft (empty), remove it before editing another
            if (
                links.length > 0 &&
                links[links.length - 1].title === '' &&
                links[links.length - 1].url === ''
            ) {
                return {
                    ...ad,
                    links: links.slice(0, -1)
                };
            }
            return ad;
        });
        setLinkEditIndex(idx);
    };

    // Main change handler for title/description
    const handleChange = (newInstance: AssignmentElement) => {
        setElementInstance(newInstance);
    };

    const DesignerComp = assignmentElement.designerComponent as React.ComponentType<any>;

    return (
        <div style={{ maxWidth: 750, margin: "auto", padding: 24 }}>
            <DesignerComp
                elementInstance={elementInstance}
                locale={locale}
                onChange={handleChange}
                onFilesChange={handleFilesChange}
                onUploadComplete={handleUploadComplete}
                onFileDelete={handleFileDelete}
                onFileDownload={(id: string) => alert(`Download file: ${id}`)}
                onLinkDelete={handleLinkDelete}
                onLinkEdit={handleLinkEdit}
                onLinkDiscard={handleLinkDiscard}
                onImageChange={handleImageChange}
                onDeleteIcon={handleDeleteIcon}
                onClickAddLink={handleClickAddLink}
                onClickEditLink={handleClickEditLink}
                linkEditIndex={linkEditIndex}
                onUpClick={() => alert("Move up")}
                onDownClick={() => alert("Move down")}
                onDeleteClick={() => alert("Delete")}
            />
        </div>
    );
}

// --- Story (Designer)
export const Designer: StoryObj<PreviewStoryArgs> = {
    name: "Designer – Assignment",
    render: (args) => <DesignerAssignmentStory locale={args.locale} />,
    args: { locale: "en" },
};

// --- Preview Story (Student View, stateless)
export const Preview: StoryObj<PreviewStoryArgs> = {
    name: "Preview – Assignment",
    render: (args) => {
        const FormComp = assignmentElement.formComponent as React.ComponentType<any>;
        return (
            <div style={{ maxWidth: 750, margin: "auto", padding: 24 }}>
                <FormComp
                    elementInstance={initialPreviewAssignment}
                    locale={args.locale}
                    onFileDownload={(file: fileMetadata.TFileMetadata) => {
                        alert(`Download file: ${file.name}`);
                    }}
                />
            </div>
        );
    },
    args: { locale: "en" },
};

// --- Passed Assignment Story (Shows completed state)
export const PassedAssignment: StoryObj<PreviewStoryArgs> = {
    name: "Passed Assignment – Preview",
    render: (args) => {
        const FormComp = assignmentElement.formComponent as React.ComponentType<any>;
        return (
            <div style={{ maxWidth: 750, margin: "auto", padding: 24 }}>
                <FormComp
                    elementInstance={passedAssignment}
                    locale={args.locale}
                    onFileDownload={(file: fileMetadata.TFileMetadata) => {
                        alert(`Download file: ${file.name}`);
                    }}
                />
            </div>
        );
    },
    args: { locale: "en" },
};
