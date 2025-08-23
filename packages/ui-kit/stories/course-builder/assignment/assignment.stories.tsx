import React, { useEffect, useState } from "react";
import type { Meta, StoryObj } from "@storybook/react";
import assignmentElement from "../../../lib/components/course-builder-lesson-component/assignment";
import { CourseElementType } from "../../../lib/components/course-builder/types";
import { assignment, fileMetadata, shared } from "@maany_shr/e-class-models";
import { AssignmentBuilderViewTypes, CreateAssignmentBuilderViewTypes } from "../../../lib/components/course-builder-lesson-component/types";
import { TLocale } from "@maany_shr/e-class-translations";

// --- Mock data
const mockFiles: fileMetadata.TFileMetadata[] = [
    {
        id: "file-1",
        name: "ProblemSet.pdf",
        mimeType: "application/pdf",
        size: 102400,
        checksum: "abc123",
        status: "available",
        category: "document",
        url: "#",
    },
];

const mockLinks: shared.TLinkWithId[] = [
    {
        linkId: 1,
        title: "Reference Article",
        url: "https://www.example.com/article",
    },
];

const BASE_ASSIGNMENT: assignment.TAssignmentBase = {
    title: "Sample Assignment Title",
    description: "This is a sample assignment description for preview and editing.",
    files: mockFiles,
    links: mockLinks,
};

const initialDesignerAssignment: CreateAssignmentBuilderViewTypes = {
    type: CourseElementType.Assignment,
    id: 1,
    order: 1,
    assignmentData: BASE_ASSIGNMENT,
    onChange: () => alert("Change triggered"),
    onFilesChange: async () => mockFiles[0],
    onUploadComplete: () => alert("Upload complete"),
    onFileDelete: () => alert("File deleted"),
    onFileDownload: () => alert("File downloaded"),
    onLinkDelete: () => alert("Link deleted"),
    onLinkEdit: () => alert("Link edited"),
    linkEditIndex: null,
    onClickEditLink: () => alert("Edit link clicked"),
    onImageChange: () => alert("Image changed"),
    onDeleteIcon: () => alert("Delete icon clicked"),
    onClickAddLink: () => alert("Add link clicked"),
    locale: "en",
};

const initialPreviewAssignment: AssignmentBuilderViewTypes = {
    type: CourseElementType.Assignment,
    id: 1,
    order: 1,
    assignmentData: BASE_ASSIGNMENT,
    locale: "en",
    onFileDownload: () => alert("onFileDownload"),
    onFileCancel: (id: string) => alert(`File with id ${id} cancelled`)
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
    const [assignmentData, setAssignmentData] = useState<assignment.TAssignmentBaseWithId>(BASE_ASSIGNMENT);
    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    useEffect(() => {
        console.log("Assignment Data Changed:", assignmentData);
    }, [assignmentData]);

    // File actions
    const handleFilesChange = async (file: fileMetadata.TFileUploadRequest, abortSignal?: AbortSignal) => {
        const uploadedFile = await simulateFileUpload(file, abortSignal);
        return uploadedFile;
    };

    const handleUploadComplete = (file: fileMetadata.TFileMetadata) => {
        const files = assignmentData.files || [];
        const updatedFiles = files.some((f) => f.id === file.id)
            ? files.map((f) => f.id === file.id ? file : f)
            : [...files, file];
        setAssignmentData((ad) => ({
            ...ad,
            files: updatedFiles,
        }));
    };

    const handleFileDelete = (id: string) => {
        setAssignmentData((ad) => ({
            ...ad,
            files: (ad.files || []).filter(f => f.id !== id),
        }));
    };

    const handleImageChange = async (
        image: fileMetadata.TFileMetadata,
        abortSignal?: AbortSignal,
    ) => {
        if (typeof linkEditIndex !== 'number') return;

        // Set status to "processing"
        setAssignmentData(ad => {
            const links = ad.links || [];
            return {
                ...ad,
                links: links.map((link, idx) =>
                    idx === linkEditIndex
                        ? { ...link, customIcon: { ...image, status: 'processing' as const } }
                        : link
                ),
            };
        });

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

            // Set status to "available"
            setAssignmentData(ad => {
                const links = ad.links || [];
                return {
                    ...ad,
                    links: links.map((link, idx) =>
                        idx === linkEditIndex
                            ? { ...link, customIcon: { ...image, status: 'available' as const } }
                            : link
                    ),
                };
            });
        } catch {
            // Remove icon if aborted/failed
            setAssignmentData(ad => {
                const links = ad.links || [];
                return {
                    ...ad,
                    links: links.map((link, idx) =>
                        idx === linkEditIndex
                            ? { ...link, customIcon: undefined }
                            : link
                    ),
                };
            });
        }
    };

    const handleDeleteIcon = (id: string) => {
        if (typeof linkEditIndex !== 'number') return;
        setAssignmentData(ad => {
            const links = ad.links || [];
            return {
                ...ad,
                links: links.map((link, idx) =>
                    idx === linkEditIndex && link.customIcon?.id === id
                        ? { ...link, customIcon: undefined }
                        : link
                ),
            };
        });
    };

    // Link actions
    const handleLinkDelete = (linkId: number) => {
        setAssignmentData((ad) => ({
            ...ad,
            links: (ad.links || []).filter((l) => l.linkId !== linkId),
        }));
        setLinkEditIndex(null);
    };

    const handleLinkEdit = (data: shared.TLink, idx: number) => {
        setAssignmentData((ad) => {
            const links = ad.links || [];
            const updatedLinks = links.map((l, i) => i === idx ? { ...l, ...data } : l);
            return { ...ad, links: updatedLinks };
        });
        setLinkEditIndex(null);
    };

    const handleClickAddLink = () => {
        // Prevent creating a draft if already editing one
        if (typeof linkEditIndex === 'number') return;
        setAssignmentData((ad) => {
            const links = ad.links || [];
            return { ...ad, links: [...links, { linkId: Date.now(), title: "", url: "" }] };
        });
        setLinkEditIndex(assignmentData.links?.length ?? 0);
    };

    const handleClickEditLink = (idx: number) => {
        setAssignmentData(ad => {
            const links = ad.links || [];
            // If the last link is a draft (empty), remove it before editing another
            if (
                links.length > 0 &&
                links[links.length - 1].linkId !== undefined &&
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
    const handleChange = (data: {
        type: CourseElementType.Assignment;
        id: number;
        order: number;
        assignmentData: assignment.TAssignmentBase;
    }) => {
        setAssignmentData(data.assignmentData);
    };

    return (
        <div style={{ maxWidth: 750, margin: "auto", padding: 24 }}>
            <assignmentElement.designerComponent
                elementInstance={{
                    ...initialDesignerAssignment,
                    assignmentData,
                    linkEditIndex,
                    onChange: handleChange,
                    onFilesChange: handleFilesChange,
                    onUploadComplete: handleUploadComplete,
                    onFileDelete: handleFileDelete,
                    onLinkDelete: handleLinkDelete,
                    onLinkEdit: handleLinkEdit,
                    onImageChange: handleImageChange,
                    onDeleteIcon: handleDeleteIcon,
                    onClickAddLink: handleClickAddLink,
                    onClickEditLink: handleClickEditLink,
                    locale,
                }}
                locale={locale}
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
        return assignmentElement.formComponent({
            elementInstance: {
                ...initialPreviewAssignment,
                locale: args.locale,
            },
            locale: args.locale,
        });
    },
    args: { locale: "en" },
};
