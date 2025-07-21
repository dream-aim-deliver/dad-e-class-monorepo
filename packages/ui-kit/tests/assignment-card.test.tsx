import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { AssignmentCard } from '../lib/components/assignment/assignment-card';
import { assignment } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';

// --- Mocks ---
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: () => ({
        components: {
            assignment: {
                assignmentCard: {
                    lastActivityText: 'Last Activity',
                    viewText: 'View Assignment',
                },
            },
        },
    }),
}));

vi.mock('../lib/components/assignment/assignment-header', () => ({
    AssignmentHeader: (props: any) => (
        <div data-testid="header">{props.title}</div>
    ),
}));

vi.mock('../lib/components/drag-and-drop-uploader/file-preview', () => ({
    FilePreview: ({ uploadResponse, onDelete, onDownload, isDeletionAllowed = true }) => (
        <div data-testid={`file-preview-${uploadResponse.id}`}>
            <span>{uploadResponse.name}</span>
            {isDeletionAllowed && (
                <button data-testid={`delete-btn-${uploadResponse.id}`} onClick={onDelete}>
                    Delete
                </button>
            )}
            <button data-testid={`download-btn-${uploadResponse.id}`} onClick={onDownload}>
                Download
            </button>
        </div>
    ),
}));

vi.mock('../lib/components/links', () => ({
    LinkEdit: ({
        initialTitle,
        initialUrl,
        onSave,
        onDiscard,
        // customIcon, onImageChange, onDeleteIcon, ...ignored for test
    }) => (
        <div data-testid="link-edit">
            <input data-testid="edit-title" defaultValue={initialTitle} />
            <input data-testid="edit-url" defaultValue={initialUrl} />
            <button data-testid="save-link" onClick={() => onSave('Edited', 'https://edit.link', undefined)}>Save</button>
            <button data-testid="discard-link" onClick={onDiscard}>Discard</button>
        </div>
    ),
    LinkPreview: ({
        title,
        url,
        onEdit,
        onDelete,
        // customIcon, preview, ...ignored for test
    }) => (
        <div data-testid="link-preview">
            <span>{title}</span>
            <span>{url}</span>
            <button data-testid="edit-link" onClick={onEdit}>Edit</button>
            <button data-testid="delete-link" onClick={onDelete}>Delete</button>
        </div>
    ),
}));

vi.mock('../lib/components/assignment/message', () => ({
    Message: ({ reply }) => (
        <div data-testid="message-reply">{reply.comment}</div>
    ),
}));

// --- Mock Data ---
const defaultProps = {
    assignmentId: 42,
    role: 'coach',
    title: 'Homework - Algebra',
    description: 'Review all problems.',
    files: [
        {
            id: 'f1',
            name: 'Algebra.pdf',
            size: 10000,
            mimeType: 'application/pdf',
            checksum: 'c1',
            status: 'available' as const,
            category: 'generic' as const,
            url: 'https://file.com/test.pdf',
        },
    ],
    links: [
        { linkId: 8, title: 'Notes', url: 'https://notes.com' },
        { linkId: 9, title: 'Reference', url: 'https://ref.com' },
    ],
    course: {
        id: 1,
        title: 'Math 101',
        imageUrl: 'https://picsum.photos/40/40',
    },
    module: 1,
    lesson: 2,
    status: 'AwaitingReview' as assignment.TAssignmentStatusEnum,
    replies: [
        {
            replyId: 20,
            type: 'resources' as const,
            comment: 'Latest activity here',
            sender: { name: 'Teacher', isCurrentUser: false },
            timestamp: '2024-01-02T12:00:00Z',
            files: [],
            links: [],
        },
        {
            replyId: 21,
            type: 'text' as const,
            comment: 'Most recent reply',
            sender: { name: 'Student', isCurrentUser: true },
            timestamp: '2025-01-02T13:00:00Z',
            files: [],
            links: [],
        },
    ],
    student: { id: '9', name: 'Student' },
    groupName: null,
    linkEditIndex: -1,
    onFileDownload: vi.fn(),
    onFileDelete: vi.fn(),
    onLinkDelete: vi.fn(),
    onChange: vi.fn(),
    onClickCourse: vi.fn(),
    onClickUser: vi.fn(),
    onClickGroup: vi.fn(),
    onImageChange: vi.fn(),
    onClickView: vi.fn(),
    locale: 'en' as TLocale,
};

// --- Tests ---
describe('AssignmentCard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders assignment card with title, description, header, files, links, reply and view button', () => {
        render(<AssignmentCard {...defaultProps} />);

        // Header
        expect(screen.getByTestId('header')).toHaveTextContent('Homework - Algebra');
        // Description
        expect(screen.getByText('Review all problems.')).toBeInTheDocument();

        // Files
        expect(screen.getByText('Algebra.pdf')).toBeInTheDocument();
        expect(screen.getByTestId('file-preview-f1')).toBeInTheDocument();
        expect(screen.getByTestId('download-btn-f1')).toBeInTheDocument();
        expect(screen.getByTestId('delete-btn-f1')).toBeInTheDocument();

        // Links
        expect(screen.getByText('Notes')).toBeInTheDocument();
        expect(screen.getByText('Reference')).toBeInTheDocument();
        expect(screen.getAllByTestId('link-preview')).toHaveLength(2);

        // Reply Section
        expect(screen.getByText('Last Activity')).toBeInTheDocument();
        expect(screen.getByTestId('message-reply')).toHaveTextContent('Most recent reply');

        // View Button
        expect(screen.getByText('View Assignment')).toBeInTheDocument();
    });

    it('calls onFileDelete and onFileDownload on FilePreview actions', () => {
        render(<AssignmentCard {...defaultProps} />);
        fireEvent.click(screen.getByTestId('delete-btn-f1'));
        expect(defaultProps.onFileDelete).toHaveBeenCalledWith(42, 'f1', 'file');
        fireEvent.click(screen.getByTestId('download-btn-f1'));
        expect(defaultProps.onFileDownload).toHaveBeenCalledWith('f1');
    });

    it('shows LinkEdit when linkEditIndex matches, saves, and discards', () => {
        render(<AssignmentCard {...defaultProps} linkEditIndex={1} />);
        expect(screen.getByTestId('link-edit')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('save-link'));
        // Should call onChange
        expect(defaultProps.onChange).toHaveBeenCalled();

        fireEvent.click(screen.getByTestId('discard-link'));
        expect(defaultProps.onLinkDelete).toHaveBeenCalledWith(42, 9, 'link');
    });

    it('calls onClickEditLink and onLinkDelete from LinkPreview', () => {
        render(<AssignmentCard {...defaultProps} />);
        const editButtons = screen.getAllByTestId('edit-link');
        fireEvent.click(editButtons[1]);
        expect(defaultProps.onChange).toHaveBeenCalledWith(
            defaultProps.files,
            defaultProps.links,
            1
        );

        const deleteButtons = screen.getAllByTestId('delete-link');
        fireEvent.click(deleteButtons[0]);
        expect(defaultProps.onLinkDelete).toHaveBeenCalledWith(42, 8, 'link');
    });

    it('calls onClickView when button is clicked', () => {
        render(<AssignmentCard {...defaultProps} />);
        fireEvent.click(screen.getByText('View Assignment'));
        expect(defaultProps.onClickView).toHaveBeenCalled();
    });

    it('does not render reply/message section if replies is empty', () => {
        render(<AssignmentCard {...defaultProps} replies={[]} />);
        expect(screen.queryByTestId('message-reply')).not.toBeInTheDocument();
        expect(screen.queryByText('Last Activity')).not.toBeInTheDocument();
    });
});
