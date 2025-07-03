// AssignmentElement.stories.tsx

import React, { useState } from "react";
import { Meta, StoryObj } from "@storybook/react";
import assignmentElement from "../../../lib/components/course-builder-lesson-component/assignment";
import { CourseElementType } from "../../../lib/components/course-builder/types";
import { AssignmentBuilderViewTypes, CreateAssignmentBuilderViewTypes } from "../../../lib/components/course-builder-lesson-component/types";
import { fileMetadata, shared } from "@maany_shr/e-class-models";

// --- Mock Data Generators ---
const generateMockFile = (): fileMetadata.TFileMetadata => ({
    id: Math.floor(Math.random() * 1000000),
    name: "Assignment.pdf",
    mimeType: "application/pdf",
    size: 123456,
    checksum: "checksum123",
    status: "available",
    category: "document",
    url: "https://example.com/assignment.pdf",
});

const generateMockImage = (): fileMetadata.TFileMetadata => ({
    id: Math.floor(Math.random() * 1000000),
    name: "Diagram.png",
    mimeType: "image/png",
    size: 54321,
    checksum: "checksum456",
    status: "available",
    category: "image",
    url: "https://picsum.photos/400/300",
    thumbnailUrl: "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg",
});

const generateMockLink = (overrides?: Partial<shared.TLink>): shared.TLink => ({
    linkId: Math.floor(Math.random() * 1000000),
    url: "https://react.dev",
    title: "React Documentation",
    customIconUrl: "https://cdn-icons-png.flaticon.com/512/25/25231.png",
    ...overrides,
});

// --- Designer Story Render ---
const AssignmentDesignerRender: React.FC<{ locale: "en" | "de" }> = ({ locale }) => {
    // Assignment data state
    const [assignmentData, setAssignmentData] = useState<AssignmentBuilderViewTypes["assignmentData"]>({
        title: "Design a Button Component",
        description: "Create a reusable button with variants and size options.",
        files: [generateMockFile(), generateMockImage()],
        links: [
            generateMockLink(),
            generateMockLink({ url: "https://storybook.js.org", title: "Storybook Docs", customIconUrl: "" }),
        ],
    });

    // Log assignment data on every change
    React.useEffect(() => {
        console.log("Assignment Data Changed:", assignmentData);
    }, [assignmentData]);

    const [linkEditIndex, setLinkEditIndex] = useState<number | null>(null);

    // --- File Handlers ---

    // Helper to mock a final uploaded file (you can adjust as needed)
    const mockFileResponse = (name: string, original: fileMetadata.TFileUploadRequest, category: "image" | "document" = "document"): fileMetadata.TFileMetadata => ({
        id: Math.floor(Math.random() * 1000000),
        name,
        mimeType: original.file.type || (category === "image" ? "image/jpeg" : "application/pdf"),
        size: original.file.size,
        checksum: "checksum-uploaded",
        status: "available",
        category,
        url: "https://example.com/" + name,
        thumbnailUrl: category === "image" ? "https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg" : "",
    });

    // The new async handler
    const handleFilesChange = async (
        newFiles: fileMetadata.TFileUploadRequest[]
    ): Promise<fileMetadata.TFileMetadata> => {
        if (newFiles.length === 0) {
            return Promise.resolve({} as fileMetadata.TFileMetadata);
        }

        // 1. Add "processing" files to state immediately
        const processingMetadata: fileMetadata.TFileMetadata[] = newFiles.map((upload, idx) => ({
            id: Date.now() + idx, // Unique temp ID
            name: upload.name,
            mimeType: upload.file.type || "application/pdf",
            size: upload.file.size,
            checksum: "processing",
            status: "processing",
            category: upload.file.type.startsWith("image") ? "image" : "document",
            url: "",
            thumbnailUrl: "",
        }));

        setAssignmentData(prev => ({
            ...prev,
            files: [...prev.files, ...processingMetadata]
        }));

        // 2. Simulate upload and replace processing with real metadata
        return new Promise((resolve) => {
            setTimeout(() => {
                const finalMetadata = newFiles.map(upload =>
                    mockFileResponse(upload.name, upload, upload.file.type.startsWith("image") ? "image" : "document")
                );

                setAssignmentData(prev => {
                    // Remove processing files (by temp ID), add real ones
                    const nonProcessing = prev.files.filter(
                        f => !processingMetadata.some(p => p.id === f.id)
                    );
                    return {
                        ...prev,
                        files: [...nonProcessing, ...finalMetadata]
                    };
                });

                resolve(finalMetadata[finalMetadata.length - 1] || {} as fileMetadata.TFileMetadata);
            }, 1500);
        });
    };

    const handleFileDelete = (fileId: number) => {
        setAssignmentData((prev) => ({
            ...prev,
            files: prev.files.filter((f) => f.id !== fileId),
        }));
    };
    const handleFileDownload = (fileId: number) => {
        alert(`Download file with id: ${fileId}`);
    };

    // --- Link Handlers ---
    const handleLinkDelete = (assignmentId: number, linkId: number, type: "link") => {
        setAssignmentData((prev) => ({
            ...prev,
            links: prev.links.filter((l) => l.linkId !== linkId),
        }));
        if (linkEditIndex !== null && assignmentData.links[linkEditIndex]?.linkId === linkId) {
            setLinkEditIndex(null);
        }
    };

    const handleLinkEdit = (data: shared.TLink, index: number) => {
        setAssignmentData((prev) => {
            const newLinks = [...prev.links];
            newLinks[index] = data;
            return { ...prev, links: newLinks };
        });
    };

    const handleClickAddLink = () => {
        setAssignmentData((prev) => ({
            ...prev,
            links: [
                ...prev.links,
                generateMockLink({
                    title: "New Link",
                    url: "",
                }),
            ],
        }));
        setLinkEditIndex(assignmentData.links.length);
    };

    // --- Assignment Change Handler (title/desc) ---
    const handleAssignmentChange = (updated: CreateAssignmentBuilderViewTypes) => {
        setAssignmentData(updated.assignmentData);
    };

    // Compose elementInstance for designer
    const elementInstance: CreateAssignmentBuilderViewTypes = {
        type: CourseElementType.Assignment,
        id: 1,
        order: 0,
        assignmentId: 1,
        assignmentData,
        onChange: handleAssignmentChange,
        onFilesChange: handleFilesChange,
        onFileDelete: handleFileDelete,
        onFileDownload: handleFileDownload,
        onLinkDelete: handleLinkDelete,
        onLinkEdit: handleLinkEdit,
        onClickAddLink: handleClickAddLink,
        locale,
    };

    // Designer controls (mocked as alerts for Storybook)
    const onUpClick = (id: number) => alert(`Move up: ${id}`);
    const onDownClick = (id: number) => alert(`Move down: ${id}`);
    const onDeleteClick = (id: number) => alert(`Delete: ${id}`);

    // Render the designer component
    return assignmentElement.designerComponent({
        elementInstance,
        onUpClick,
        onDownClick,
        onDeleteClick,
        locale,
    });
};

// --- Form Story Render (student view) ---
const AssignmentFormRender: React.FC<{ locale: "en" | "de" }> = ({ locale }) => {
    const assignmentData: AssignmentBuilderViewTypes["assignmentData"] = {
        title: "Design a Button Component",
        description: "Create a reusable button with variants and size options.",
        files: [generateMockFile(), generateMockImage()],
        links: [
            generateMockLink(),
            generateMockLink({ url: "https://storybook.js.org", title: "Storybook Docs", customIconUrl: "" }),
        ],
    };
    const elementInstance: AssignmentBuilderViewTypes = {
        type: CourseElementType.Assignment,
        id: 1,
        order: 0,
        assignmentData,
        locale,
    };
    // Render the form component (student-facing)
    return assignmentElement.formComponent({ elementInstance, locale });
};

// --- Storybook Meta ---
const meta: Meta = {
    title: "Components/CourseBuilder/AssignmentElement",
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
type Story = StoryObj<{ locale: "en" | "de" }>;

// --- Designer Story ---
export const Designer: Story = {
    render: (args) => <AssignmentDesignerRender locale={args.locale || "en"} />,
    args: { locale: "en" },
};

// --- Form (Student) Story ---
export const Form: Story = {
    render: (args) => <AssignmentFormRender locale={args.locale || "en"} />,
    args: { locale: "en" },
};
