import { render, fireEvent, screen } from '@testing-library/react';
import { vi } from 'vitest';
import { ReplyPanel } from '../lib/components/assignment/reply-panel';
import { fileMetadata } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';

vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: () => ({
        components: {
            assignment: {
                replyPanel: {
                    replyText: 'Reply',
                    sendMessageText: 'Send Message',
                    markAsPassedText: 'Mark as Passed',
                    yourCommentsText: 'Your Comments',
                    addLinkText: 'Add Link',
                    replyPlaceholderText: 'Type your comments here...',
                },
            },
        },
    }),
}));

vi.mock('../lib/components/drag-and-drop-uploader/uploader', () => ({
    Uploader: ({ onFilesChange, onDelete, onDownload, onUploadComplete, files }) => (
        <div data-testid="uploader">
            {files && files.length > 0 && files.map((file: fileMetadata.TFileMetadata, idx: number) => (
                <div key={idx}>
                    <span>{file.name}</span>
                    <button data-testid={`delete-file-${file.id}`} onClick={() => onDelete(file.id)} />
                    <button data-testid={`download-file-${file.id}`} onClick={() => onDownload(file.id)} />
                </div>
            ))}
            <button onClick={() => onFilesChange({ id: '3', name: 'newfile.pdf' })} data-testid="upload-file-btn">Upload File</button>
        </div>
    ),
}));

vi.mock('../lib/components/links', () => ({
    LinkEdit: ({ initialTitle, initialUrl, onSave, onDiscard }) => (
        <div data-testid="link-edit">
            <input data-testid="edit-title" defaultValue={initialTitle} />
            <input data-testid="edit-url" defaultValue={initialUrl} />
            <button data-testid="save-link" onClick={() => onSave('Edited Link', 'https://edited.com')}>Save</button>
            <button data-testid="discard-link" onClick={onDiscard}>Discard</button>
        </div>
    ),
    LinkPreview: ({ title, url, onEdit, onDelete }) => (
        <div data-testid="link-preview">
            <span>{title}</span>
            <span>{url}</span>
            <button data-testid="edit-link" onClick={onEdit}>Edit</button>
            <button data-testid="delete-link" onClick={onDelete}>Delete</button>
        </div>
    ),
}));

vi.mock('../lib/components/tooltip', () => ({
    default: ({ description }) => <span data-testid="tooltip">{description}</span>
}));

const defaultProps = {
    role: 'coach',
    comment: 'This is my feedback',
    files: [
        {
            id: '1',
            name: 'file1.pdf',
            size: 1000,
            mimeType: 'application/pdf',
            checksum: '',
            status: 'available' as fileMetadata.TFileStatusEnum,
            category: 'generic' as const,
            url: ''
        },
        {
            id: '2',
            name: 'file2.doc',
            size: 2000,
            mimeType: 'application/msword',
            checksum: '',
            status: 'available' as fileMetadata.TFileStatusEnum,
            category: 'generic' as const,
            url: ''
        }
    ],
    links: [
        { linkId: 1, title: 'Link 1', url: 'https://link1.com' },
        { linkId: 2, title: 'Link 2', url: 'https://link2.com' },
    ],
    linkEditIndex: undefined,
    sender: { name: 'Alice', isCurrentUser: true, image: '/alice.jpg' },
    onChangeComment: vi.fn(),
    onFileDownload: vi.fn(),
    onFileDelete: vi.fn(),
    onLinkDelete: vi.fn(),
    onFilesChange: vi.fn().mockResolvedValue({ id: '3', name: 'newfile.pdf' }),
    onUploadComplete: vi.fn(),
    onCreateLink: vi.fn().mockResolvedValue({ linkId: 3, title: 'Link 3', url: 'https://link3.com' }),
    onClickEditLink: vi.fn(),
    onClickAddLink: vi.fn(),
    onImageChange: vi.fn(),
    onClickSendMessage: vi.fn(),
    onDeleteIcon: vi.fn(),
    locale: 'en' as TLocale,
};

describe('ReplyPanel Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders ReplyPanel main elements', () => {
        render(<ReplyPanel {...defaultProps} />);
        expect(screen.getByText('Reply')).toBeInTheDocument();
        expect(screen.getByText('Send Message')).toBeInTheDocument();
        expect(screen.getByTestId('uploader')).toBeInTheDocument();
        expect(screen.getByText('This is my feedback')).toBeInTheDocument();
        // Links
        expect(screen.getByText('Link 1')).toBeInTheDocument();
        expect(screen.getByText('https://link1.com')).toBeInTheDocument();
        expect(screen.getByText('Link 2')).toBeInTheDocument();
    });

    it('calls onChangeComment on textarea change', () => {
        render(<ReplyPanel {...defaultProps} />);
        const textarea = screen.getByPlaceholderText('Type your comments here...');
        fireEvent.change(textarea, { target: { value: 'New comment' } });
        expect(defaultProps.onChangeComment).toHaveBeenCalledWith('New comment');
    });

    it('calls onFileDelete and onFileDownload', () => {
        render(<ReplyPanel {...defaultProps} />);
        fireEvent.click(screen.getByTestId('delete-file-1'));
        expect(defaultProps.onFileDelete).toHaveBeenCalledWith('1');
        fireEvent.click(screen.getByTestId('download-file-2'));
        expect(defaultProps.onFileDownload).toHaveBeenCalledWith('2');
    });

    it('calls onFilesChange when uploading a new file', () => {
        render(<ReplyPanel {...defaultProps} />);
        fireEvent.click(screen.getByTestId('upload-file-btn'));
        expect(defaultProps.onFilesChange).toHaveBeenCalled();
    });

    it('calls onClickSendMessage with "resources" if there are files/links', () => {
        render(<ReplyPanel {...defaultProps} />);
        fireEvent.click(screen.getByText('Send Message'));
        expect(defaultProps.onClickSendMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'resources',
                comment: defaultProps.comment,
                files: defaultProps.files,
                links: defaultProps.links,
                sender: defaultProps.sender,
            })
        );
    });

    it('calls onClickSendMessage with "text" if no files and no links', () => {
        render(<ReplyPanel {...defaultProps} files={[]} links={[]} />);
        fireEvent.click(screen.getByText('Send Message'));
        expect(defaultProps.onClickSendMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'text',
                comment: defaultProps.comment
            })
        );
    });

    it('calls onClickSendMessage with "passed" type for coach mark as passed', () => {
        render(<ReplyPanel {...defaultProps} />);
        fireEvent.click(screen.getByText('Mark as Passed'));
        expect(defaultProps.onClickSendMessage).toHaveBeenCalledWith(
            expect.objectContaining({
                type: 'passed',
                sender: defaultProps.sender,
            })
        );
    });

    it('calls onClickAddLink when add link button is clicked', () => {
        render(<ReplyPanel {...defaultProps} />);
        fireEvent.click(screen.getByText('Add Link'));
        expect(defaultProps.onClickAddLink).toHaveBeenCalled();
    });

    it('renders LinkEdit when linkEditIndex matches and calls onCreateLink/onLinkDelete', async () => {
        const props = { ...defaultProps, linkEditIndex: 1 };
        render(<ReplyPanel {...props} />);
        expect(screen.getByTestId('link-edit')).toBeInTheDocument();

        fireEvent.click(screen.getByTestId('save-link'));
        expect(props.onCreateLink).toHaveBeenCalledWith({ title: 'Edited Link', url: 'https://edited.com', customIcon: undefined, linkId: 2 }, 1);

        fireEvent.click(screen.getByTestId('discard-link'));
        expect(props.onLinkDelete).toHaveBeenCalledWith(2, 1);
    });

    it('calls onClickEditLink when Edit button of LinkPreview is clicked', () => {
        render(<ReplyPanel {...defaultProps} />);
        const editButtons = screen.getAllByTestId('edit-link');
        fireEvent.click(editButtons[1]);
        expect(defaultProps.onClickEditLink).toHaveBeenCalledWith(1);
    });

    it('calls onLinkDelete when Delete button of LinkPreview is clicked', () => {
        render(<ReplyPanel {...defaultProps} />);
        const deleteButtons = screen.getAllByTestId('delete-link');
        fireEvent.click(deleteButtons[0]);
        expect(defaultProps.onLinkDelete).toHaveBeenCalledWith(1, 0);
    });
});
