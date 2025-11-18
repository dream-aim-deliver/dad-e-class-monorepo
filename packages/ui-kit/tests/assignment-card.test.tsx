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
    Message: ({ reply, onDeleteIcon }) => (
        <div data-testid="message-reply">
            {reply.comment}
            {onDeleteIcon && <button data-testid="delete-icon" onClick={() => onDeleteIcon('test-id')}>Delete Icon</button>}
        </div>
    ),
}));

// --- Mock Data ---
const defaultProps = {
    assignmentId: 42,
    role: 'coach' as const,
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
            sender: { id: 'teacher1', name: 'Teacher', isCurrentUser: false, role: 'coach' as const, image: 'https://example.com/teacher.jpg' },
            timestamp: '2024-01-02T12:00:00Z',
            files: [],
            links: [],
        },
        {
            replyId: 21,
            type: 'text' as const,
            comment: 'Most recent reply',
            sender: { id: 'student1', name: 'Student', isCurrentUser: true, role: 'student' as const, image: 'https://example.com/student.jpg' },
            timestamp: '2025-01-02T13:00:00Z',
            files: [],
            links: [],
        },
    ],
    student: { id: '9', name: 'Student', image: 'https://example.com/student.jpg', isCurrentUser: true, role: 'student' as const },
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
    onReplyFileDelete: vi.fn(),
    onReplyLinkDelete: vi.fn(),
    onDeleteIcon: vi.fn(),
    replyLinkEditIndex: -1,
    onReplyImageChange: vi.fn(),
    onReplyDeleteIcon: vi.fn(),
    onReplyChange: vi.fn(),
    locale: 'en' as TLocale,
};

// --- Tests ---
describe('AssignmentCard Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders assignment card with reply and view button', () => {
        render(<AssignmentCard {...defaultProps} />);

        // Header
        expect(screen.getByTestId('header')).toHaveTextContent('Homework - Algebra');

        // Reply Section
        expect(screen.getByText('Last Activity')).toBeInTheDocument();
        expect(screen.getByTestId('message-reply')).toHaveTextContent('Latest activity here');

        // View Button
        expect(screen.getByText('View Assignment')).toBeInTheDocument();
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

    it('renders latest reply when replies exist', () => {
        render(<AssignmentCard {...defaultProps} />);
        expect(screen.getByText('Last Activity')).toBeInTheDocument();
        expect(screen.getByTestId('message-reply')).toHaveTextContent('Latest activity here');
    });
});