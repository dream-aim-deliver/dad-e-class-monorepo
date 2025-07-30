import { render, screen, fireEvent } from "@testing-library/react";
import { vi } from "vitest";
import { CreateAssignmentBuilderView } from "../lib/components/assignment-course-builder/create-assignment-builder-view";
import { CourseElementType } from "../lib/components/course-builder/types";
import { fileMetadata } from "@maany_shr/e-class-models";

// ---- Mocks ----
vi.mock("@maany_shr/e-class-translations", () => ({
    getDictionary: () => ({
        components: {
            assignment: {
                assignmentBuilder: {
                    assignmentTitleText: "Title",
                    assignmentDescriptionText: "Description",
                    addResourcesText: "Add Resources",
                    titlePlaceholderText: "Type your title...",
                    descriptionPlaceholderText: "Describe assignment...",
                },
                replyPanel: {
                    addLinkText: "Add Link",
                },
            },
        },
    }),
}));

vi.mock("../lib/components/text-input", () => ({
    TextInput: ({ label, inputField }: any) => (
        <div>
            <label>{label}</label>
            <input
                data-testid="assignment-title"
                value={inputField.value}
                onChange={e => inputField.setValue(e.target.value)}
            />
        </div>
    ),
}));

vi.mock("../lib/components/text-areaInput", () => ({
    TextAreaInput: ({ value, setValue, placeholder }: any) => (
        <textarea
            data-testid="assignment-desc"
            value={value}
            placeholder={placeholder}
            onChange={e => setValue(e.target.value)}
        />
    ),
}));

vi.mock("../lib/components/tooltip", () => ({
    default: ({ description }: any) => <span data-testid="tooltip">{description}</span>
}));

vi.mock("../lib/components/icons/icon-cloud-upload", () => ({
    IconCloudUpload: ({ classNames }: any) => <span data-testid="icon-cloud-upload" className={classNames}>[CloudUpload]</span>
}));

vi.mock("../lib/components/drag-and-drop-uploader/uploader", () => ({
    Uploader: ({ files, onFilesChange, onDelete, onDownload, onUploadComplete }: any) => (
        <div data-testid="uploader">
            {files.map((file: any) =>
                <div key={file.id}>
                    <span>{file.name}</span>
                    <button data-testid={`delete-file-${file.id}`} onClick={() => onDelete(file.id)}>Delete</button>
                    <button data-testid={`download-file-${file.id}`} onClick={() => onDownload(file.id)}>Download</button>
                </div>
            )}
            <button data-testid="upload-file-btn" onClick={() => onFilesChange({ id: "n1", name: "newfile.pdf" })}>Upload</button>
        </div>
    )
}));

vi.mock("../lib/components/links", () => ({
    LinkEdit: ({ initialTitle, initialUrl, onSave, onDiscard }: any) => (
        <div data-testid="link-edit">
            <input data-testid="edit-title" defaultValue={initialTitle} />
            <input data-testid="edit-url" defaultValue={initialUrl} />
            <button data-testid="save-link" onClick={() => onSave('Edited', 'https://edit.link')}>Save</button>
            <button data-testid="discard-link" onClick={onDiscard}>Discard</button>
        </div>
    ),
    LinkPreview: ({ title, url, onEdit, onDelete }: any) => (
        <div data-testid="link-preview">
            <span>{title}</span>
            <span>{url}</span>
            <button data-testid="edit-link" onClick={onEdit}>Edit</button>
            <button data-testid="delete-link" onClick={onDelete}>Delete</button>
        </div>
    ),
}));

vi.mock("../lib/components/icons/icon-plus", () => ({
    IconPlus: () => <span data-testid="plus-icon">[+]</span>
}));

// ---- Test Data ----
const files = [
    { id: "f1", name: "math.pdf", size: 500, mimeType: "application/pdf", checksum: "", status: "available" as fileMetadata.TFileStatusEnum, category: "generic" as const, url: "" },
    { id: "f2", name: "sol.pdf", size: 800, mimeType: "application/pdf", checksum: "", status: "available" as fileMetadata.TFileStatusEnum, category: "generic" as const, url: "" }
];
const links = [
    { linkId: 1, title: "Ref", url: "https://ref.com" },
    { linkId: 2, title: "Guide", url: "https://guide.com" }
];
const assignmentData = {
    title: "Essay: Future of AI",
    description: "Write your thoughts on AI.",
    files,
    links,
};

const baseProps = {
    type: "assignment" as CourseElementType.Assignment,
    id: 7,
    order: 1,
    assignmentData,
    onChange: vi.fn(),
    onFilesChange: vi.fn().mockResolvedValue(files[0]),
    onUploadComplete: vi.fn(),
    onFileDelete: vi.fn(),
    onFileDownload: vi.fn(),
    onLinkDelete: vi.fn(),
    onLinkEdit: vi.fn(),
    linkEditIndex: null,
    onClickEditLink: vi.fn(),
    onClickAddLink: vi.fn(),
    onImageChange: vi.fn(),
    onDeleteIcon: vi.fn(),
    locale: "en" as const
};

// ---- Tests ----
describe("CreateAssignmentBuilderView", () => {
    beforeEach(() => vi.clearAllMocks());

    it("renders title, description, resources, links, and add link", () => {
        render(<CreateAssignmentBuilderView {...baseProps} />);
        expect(screen.getByTestId("assignment-title")).toBeInTheDocument();
        expect(screen.getByTestId("assignment-title")).toHaveValue("Essay: Future of AI");
        expect(screen.getByText("Description")).toBeInTheDocument();
        expect(screen.getByTestId("assignment-desc")).toHaveValue("Write your thoughts on AI.");
        expect(screen.getByTestId("icon-cloud-upload")).toBeInTheDocument();
        expect(screen.getByText("Add Resources")).toBeInTheDocument();
        expect(screen.getByText("math.pdf")).toBeInTheDocument();
        expect(screen.getByText("sol.pdf")).toBeInTheDocument();
        expect(screen.getByText("Ref")).toBeInTheDocument();
        expect(screen.getByText("https://ref.com")).toBeInTheDocument();
        expect(screen.getByText("Guide")).toBeInTheDocument();
        expect(screen.getByText("https://guide.com")).toBeInTheDocument();
        expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
        expect(screen.getByText("Add Link")).toBeInTheDocument();
    });

    it("calls onChange on title and description change", () => {
        render(<CreateAssignmentBuilderView {...baseProps} />);
        fireEvent.change(screen.getByTestId("assignment-title"), { target: { value: "New Title" } });
        expect(baseProps.onChange).toHaveBeenCalledWith(expect.objectContaining({
            assignmentData: expect.objectContaining({ title: "New Title" })
        }));

        fireEvent.change(screen.getByTestId("assignment-desc"), { target: { value: "New Desc" } });
        expect(baseProps.onChange).toHaveBeenCalledWith(expect.objectContaining({
            assignmentData: expect.objectContaining({ description: "New Desc" })
        }));
    });

    it("calls onFileDelete and onFileDownload on file actions", () => {
        render(<CreateAssignmentBuilderView {...baseProps} />);
        fireEvent.click(screen.getByTestId("delete-file-f1"));
        expect(baseProps.onFileDelete).toHaveBeenCalledWith("f1");

        fireEvent.click(screen.getByTestId("download-file-f2"));
        expect(baseProps.onFileDownload).toHaveBeenCalledWith("f2");
    });

    it("calls onFilesChange when upload button is clicked", () => {
        render(<CreateAssignmentBuilderView {...baseProps} />);
        fireEvent.click(screen.getByTestId("upload-file-btn"));
        expect(baseProps.onFilesChange).toHaveBeenCalled();
    });

    it("calls onClickAddLink when + Add Link is clicked", () => {
        render(<CreateAssignmentBuilderView {...baseProps} />);
        fireEvent.click(screen.getByText("Add Link"));
        expect(baseProps.onClickAddLink).toHaveBeenCalled();
    });

    it("shows LinkEdit when linkEditIndex is set, and calls onSave and onDiscard", () => {
        render(<CreateAssignmentBuilderView {...baseProps} linkEditIndex={1} />);
        expect(screen.getByTestId("link-edit")).toBeInTheDocument();
        fireEvent.click(screen.getByTestId("save-link"));
        expect(baseProps.onLinkEdit).toHaveBeenCalledWith({ title: "Edited", url: "https://edit.link" }, 1);
        fireEvent.click(screen.getByTestId("discard-link"));
        expect(baseProps.onLinkDelete).toHaveBeenCalledWith(2);
    });

    it("calls onClickEditLink and onLinkDelete from LinkPreview", () => {
        render(<CreateAssignmentBuilderView {...baseProps} />);
        const editBtns = screen.getAllByTestId("edit-link");
        fireEvent.click(editBtns[1]);
        expect(baseProps.onClickEditLink).toHaveBeenCalledWith(1);

        const delBtns = screen.getAllByTestId("delete-link");
        fireEvent.click(delBtns[0]);
        expect(baseProps.onLinkDelete).toHaveBeenCalledWith(1);
    });
});
