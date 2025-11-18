import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { Message } from '../lib/components/assignment/message';
import { fileMetadata } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import { TAssignmentReplyResponse, TAssignmentPassedResponse } from '@dream-aim-deliver/e-class-cms-rest';

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

const mockReply: TAssignmentReplyResponse = {
    replyType: 'reply',
    comment: 'See attached resources!',
    sender: {
        id: 1,
        username: 'Alice',
        name: 'Alice',
        surname: null,
        avatarUrl: 'http://avatar.url',
        role: 'student',
        isCurrentUser: true
    },
    sentAt: 1717930620, // Unix timestamp in seconds
    files: [
        {
            id: 'f1',
            name: 'file1.pdf',
            size: 123456,
            category: 'generic',
            downloadUrl: 'http://example.com/file1.pdf',
            thumbnailUrl: null
        }
    ],
    links: [
        { title: 'Resource Link', url: 'https://resource.com' }
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
        // The component transforms the backend file format to TFileMetadata
        expect(defaultProps.onFileDownload).toHaveBeenCalledWith(
            expect.objectContaining({
                id: 'f1',
                name: 'file1.pdf',
                size: 123456,
                category: 'generic',
                downloadUrl: 'http://example.com/file1.pdf',
            })
        );
    });

    it('renders link previews (read-only)', () => {
        render(<Message {...defaultProps} />);
        expect(screen.getByText('Resource Link')).toBeInTheDocument();
        expect(screen.getByText('https://resource.com')).toBeInTheDocument();
    });

    it('displays as a passed banner if reply.type="passed"', () => {
        const passedReply: TAssignmentPassedResponse = {
            replyType: 'passed',
            passedAt: 1717930620,
            sender: mockReply.sender
        };
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
                sender: { ...mockReply.sender, username: 'Bob', name: 'Bob', isCurrentUser: false }
            }}
        />);
        expect(screen.getByTestId('user-avatar')).toHaveTextContent('Bob');
    });

    it('renders plain text for "text" reply', () => {
        const textReply: TAssignmentReplyResponse = {
            replyType: 'reply',
            comment: 'A simple message',
            sender: mockReply.sender,
            sentAt: 1717930620,
            files: [],
            links: []
        };
        render(<Message {...defaultProps} reply={textReply} />);
        expect(screen.getByText('A simple message')).toBeInTheDocument();
    });

    it('does not show resources section for text reply', () => {
        const textReply: TAssignmentReplyResponse = {
            replyType: 'reply',
            comment: 'Just text',
            sender: mockReply.sender,
            sentAt: 1717930620,
            files: [],
            links: []
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
