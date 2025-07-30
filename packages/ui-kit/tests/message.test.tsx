import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Message } from '../lib/components/assignment/message';
import { assignment, fileMetadata } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';

vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: () => ({
        components: {
            assignment: {
                message: {
                    youText: 'You',
                    markAssignmentText: 'Marked as Passed',
                },
            },
        },
    }),
}));

vi.mock('../lib/components/drag-and-drop-uploader/file-preview', () => ({
    FilePreview: ({ uploadResponse, onDelete, onDownload, locale, className, isDeleteAllowed = true }: any) => (
        <div data-testid={`file-preview-${uploadResponse.id}`}>
            <span>{uploadResponse.name}</span>
            <button data-testid={`download-btn-${uploadResponse.id}`} onClick={onDownload}>Download</button>
            {isDeleteAllowed && (
                <button data-testid={`delete-btn-${uploadResponse.id}`} onClick={onDelete}>Delete</button>
            )}
        </div>
    ),
}));

vi.mock('../lib/components/links', () => ({
    LinkEdit: ({ initialTitle, initialUrl, onSave, onDiscard }: any) => (
        <div data-testid="link-edit">
            <input data-testid="edit-title" defaultValue={initialTitle} />
            <input data-testid="edit-url" defaultValue={initialUrl} />
            <button data-testid="save-link" onClick={() => onSave('Edited Title', 'https://edited.com')}>Save</button>
            <button data-testid="discard-link" onClick={onDiscard}>Discard</button>
        </div>
    ),
    LinkPreview: ({ title, url, onEdit, onDelete }: any) => (
        <div data-testid="link-preview">
            <span>{title}</span>
            <span>{url}</span>
            {onEdit && <button data-testid="edit-link" onClick={onEdit}>Edit</button>}
            {onDelete && <button data-testid="delete-link" onClick={onDelete}>Delete</button>}
        </div>
    ),
}));

vi.mock('../lib/components/avatar/user-avatar', () => ({
    UserAvatar: ({ imageUrl, fullName }) => (<div data-testid="user-avatar">{fullName}</div>),
}));

const mockReply: assignment.TAssignmentReplyWithId = {
    replyId: 123,
    type: 'resources',
    comment: 'See attached resources!',
    sender: { name: 'Alice', isCurrentUser: true, image: 'http://avatar.url' },
    timestamp: '2024-06-09T10:37:00Z',
    files: [
        {
            id: 'f1',
            name: 'file1.pdf',
            size: 123456,
            mimeType: 'application/pdf',
            status: 'available',
            category: 'generic',
            url: 'http://example.com/file1.pdf'
        } as fileMetadata.TFileMetadata
    ],
    links: [
        { linkId: 1, title: 'Resource Link', url: 'https://resource.com' }
    ]
};

const defaultProps = {
    reply: mockReply,
    linkEditIndex: -1,
    onFileDownload: vi.fn(),
    onFileDelete: vi.fn(),
    onLinkDelete: vi.fn(),
    onChange: vi.fn(),
    onImageChange: vi.fn(),
    onDeleteIcon: vi.fn(),
    locale: 'en' as TLocale,
};

describe('Message Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders sender name and comment', () => {
        render(<Message {...defaultProps} />);
        expect(screen.getByText('You')).toBeInTheDocument();
        expect(screen.getByText('See attached resources!')).toBeInTheDocument();
    });

    it('renders file previews with download and delete', () => {
        render(<Message {...defaultProps} />);
        // Checks that FilePreview is rendered with file name
        expect(screen.getByText('file1.pdf')).toBeInTheDocument();
        expect(screen.getByTestId('download-btn-f1')).toBeInTheDocument();
        expect(screen.getByTestId('delete-btn-f1')).toBeInTheDocument();
    });

    it('calls onFileDownload when download clicked', () => {
        render(<Message {...defaultProps} />);
        fireEvent.click(screen.getByTestId('download-btn-f1'));
        expect(defaultProps.onFileDownload).toHaveBeenCalledWith('f1');
    });

    it('calls onFileDelete when delete clicked', () => {
        render(<Message {...defaultProps} />);
        fireEvent.click(screen.getByTestId('delete-btn-f1'));
        expect(defaultProps.onFileDelete).toHaveBeenCalledWith(123, 'f1');
    });

    it('renders link previews and calls edit/delete', () => {
        render(<Message {...defaultProps} />);
        expect(screen.getByText('Resource Link')).toBeInTheDocument();
        expect(screen.getByText('https://resource.com')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('edit-link'));
    });

    it('shows LinkEdit when linkEditIndex matches and calls onSave/onDiscard', () => {
        const props = { ...defaultProps, linkEditIndex: 0 };
        render(<Message {...props} />);
        expect(screen.getByTestId('link-edit')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('save-link'));
        expect(props.onChange).toHaveBeenCalled();
        fireEvent.click(screen.getByTestId('discard-link'));
        expect(props.onLinkDelete).toHaveBeenCalledWith(123, 1);
    });

    it('displays as a passed banner if reply.type="passed"', () => {
        render(<Message {...defaultProps} reply={{ ...mockReply, type: 'passed' }} />);
        expect(screen.getByText('Marked as Passed')).toBeInTheDocument();
    });

    it('displays user avatar on the right if sent by current user', () => {
        render(<Message {...defaultProps} />);
        expect(screen.getByTestId('user-avatar')).toHaveTextContent('Alice');
    });

    it('displays user avatar on the left if sent by other user', () => {
        render(<Message
            {...defaultProps}
            reply={{
                ...mockReply,
                sender: { ...mockReply.sender, name: 'Bob', isCurrentUser: false }
            }}
        />);
        expect(screen.getByTestId('user-avatar')).toHaveTextContent('Bob');
    });


    it('renders plain text for "text" reply', () => {
        const reply = { ...mockReply, type: 'text' as const, comment: 'A simple message', files: [], links: [] };
        render(<Message {...defaultProps} reply={reply} />);
        expect(screen.getByText('A simple message')).toBeInTheDocument();
    });
});
