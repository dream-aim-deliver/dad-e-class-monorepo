import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { AssignmentBuilderView } from "../lib/components/assignment-course-builder/assignment-builder-view";
import { CourseElementType } from "../lib/components/course-builder/types";
import { fileMetadata } from "@maany_shr/e-class-models";

// --------- Mock dependencies ---------
vi.mock("@maany_shr/e-class-translations", () => ({
    getDictionary: () => ({
        components: {
            assignment: {
                assignmentBuilder: {
                    assignmentText: "Assignment Preview"
                }
            }
        }
    })
}));

vi.mock("../lib/components/icons/icon-assignment", () => ({
    IconAssignment: ({ classNames }: any) => (
        <span data-testid="icon-assignment" className={classNames}>[Icon]</span>
    )
}));

vi.mock("../lib/components/drag-and-drop-uploader/file-preview", () => ({
    FilePreview: ({ uploadResponse, onDelete, onDownload, onCancel }: any) => (
        <div data-testid={`file-preview-${uploadResponse.id}`}>
            <span>{uploadResponse.name}</span>
            <button data-testid={`dl-btn-${uploadResponse.id}`} onClick={onDownload}>Download</button>
        </div>
    )
}));

vi.mock("../lib/components/links", () => ({
    LinkPreview: ({ title, url }: any) => (
        <div data-testid="link-preview">
            <span>{title}</span>
            <span>{url}</span>
        </div>
    )
}));

// --------- Test data ---------
const assignmentData = {
    title: "Math Assignment",
    description: "Solve all problems. Show your work.",
    files: [
        {
            id: "f1",
            name: "math.pdf",
            size: 1000,
            mimeType: "application/pdf",
            checksum: "",
            status: "available" as fileMetadata.TFileStatusEnum,
            category: "generic" as const,
            url: ""
        },
        {
            id: "f2",
            name: "solutions.doc",
            size: 2000,
            mimeType: "application/msword",
            checksum: "",
            status: "available" as fileMetadata.TFileStatusEnum,
            category: "generic" as const,
            url: ""
        }
    ],
    links: [
        { title: "Reference", url: "https://ref.com" },
        { title: "Help Sheet", url: "https://help.com" }
    ]
};

const baseProps = {
    type: "assignment" as CourseElementType.Assignment,
    id: 7,
    order: 2,
    assignmentData,
    locale: "en" as const,
    onFileDelete: vi.fn(),
    onFileDownload: vi.fn(),
    onCancel: vi.fn()
};

describe("AssignmentBuilderView", () => {
    it("renders assignment title, description, icon, files, and links", () => {
        render(
            <AssignmentBuilderView
                {...baseProps}
            />
        );
        expect(screen.getByTestId("icon-assignment")).toBeInTheDocument();
        expect(screen.getByText("Assignment Preview")).toBeInTheDocument();
        expect(screen.getByText("Math Assignment")).toBeInTheDocument();
        expect(screen.getByText("Solve all problems. Show your work.")).toBeInTheDocument();
        expect(screen.getByText("math.pdf")).toBeInTheDocument();
        expect(screen.getByText("solutions.doc")).toBeInTheDocument();
        expect(screen.getByText("Reference")).toBeInTheDocument();
        expect(screen.getByText("Help Sheet")).toBeInTheDocument();
        expect(screen.getByText("https://ref.com")).toBeInTheDocument();
        expect(screen.getByText("https://help.com")).toBeInTheDocument();
        expect(screen.getAllByTestId("link-preview").length).toBe(2);
    });

    it("calls onFileDownload when buttons pressed", () => {
        const onFileDownload = vi.fn();
        render(
            <AssignmentBuilderView
                {...baseProps}
                onFileDownload={onFileDownload}
            />
        );
        // Download
        fireEvent.click(screen.getByTestId("dl-btn-f2"));
        expect(onFileDownload).toHaveBeenCalledWith("f2");
    });

    it("renders with empty files and links", () => {
        render(
            <AssignmentBuilderView
                {...baseProps}
                assignmentData={{ ...assignmentData, files: [], links: [] }}
            />
        );
        expect(screen.queryByTestId("file-preview-f1")).not.toBeInTheDocument();
        expect(screen.queryByTestId("link-preview")).not.toBeInTheDocument();
    });
});
