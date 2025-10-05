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
    FilePreview: ({ uploadResponse, onDownload }: any) => (
        <div data-testid={`file-preview-${uploadResponse.id}`}>
            <span>{uploadResponse.name}</span>
            <button data-testid={`download-btn-${uploadResponse.id}`} onClick={onDownload}>Download</button>
        </div>
    ),
}));

vi.mock('../lib/components/links', () => ({
    LinkPreview: ({ title, url }: any) => (
        <div data-testid="link-preview">
            <span>{title}</span>
            <span>{url}</span>
        </div>
    ),
}));

vi.mock('../lib/components/avatar/user-avatar', () => ({
    UserAvatar: ({ imageUrl, fullName }: any) => (<div data-testid="user-avatar">{fullName}</div>),
}));

vi.mock('../lib/components/banner', () => ({
    default: ({ title }: any) => <div data-testid="banner">{title}</div>,
}));

const mockReply: assignment.TAssignmentReplyWithId = {
    replyId: 123,
    type: 'resources',
    comment: 'See attached resources!',
    sender: { name: 'Alice', isCurrentUser: true, image: 'http://avatar.url', id: '1', role: 'student', email: 'alice@example.com' } as any,
    timestamp: 1717930620, // Unix timestamp in seconds
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
    onFileDownload: vi.fn(),
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

    it('renders file previews (read-only)', () => {
        render(<Message {...defaultProps} />);
        expect(screen.getByText('file1.pdf')).toBeInTheDocument();
        expect(screen.getByTestId('download-btn-f1')).toBeInTheDocument();
    });

    it('calls onFileDownload when download clicked', () => {
        render(<Message {...defaultProps} />);
        fireEvent.click(screen.getByTestId('download-btn-f1'));
        expect(defaultProps.onFileDownload).toHaveBeenCalledWith(mockReply.files![0]);
    });

    it('renders link previews (read-only)', () => {
        render(<Message {...defaultProps} />);
        expect(screen.getByText('Resource Link')).toBeInTheDocument();
        expect(screen.getByText('https://resource.com')).toBeInTheDocument();
    });

    it('displays as a passed banner if reply.type="passed"', () => {
        const passedReply: assignment.TAssignmentReplyWithId = {
            ...mockReply,
            type: 'passed',
            replyId: 456,
            timestamp: 1717930620,
        } as any;
        render(<Message {...defaultProps} reply={passedReply} />);
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
        const textReply: assignment.TAssignmentReplyWithId = {
            replyId: 789,
            type: 'text',
            comment: 'A simple message',
            sender: mockReply.sender,
            timestamp: 1717930620,
        };
        render(<Message {...defaultProps} reply={textReply} />);
        expect(screen.getByText('A simple message')).toBeInTheDocument();
    });

    it('does not show resources section for text reply', () => {
        const textReply: assignment.TAssignmentReplyWithId = {
            replyId: 789,
            type: 'text',
            comment: 'Just text',
            sender: mockReply.sender,
            timestamp: 1717930620,
        };
        render(<Message {...defaultProps} reply={textReply} />);
        expect(screen.queryByTestId('file-preview-f1')).not.toBeInTheDocument();
        expect(screen.queryByTestId('link-preview')).not.toBeInTheDocument();
    });

    it('renders resources for resources reply type', () => {
        render(<Message {...defaultProps} />);
        expect(screen.getByText('See attached resources!')).toBeInTheDocument();
        expect(screen.getByTestId('file-preview-f1')).toBeInTheDocument();
        expect(screen.getByTestId('link-preview')).toBeInTheDocument();
    });
});
