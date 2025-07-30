import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { AssignmentModal } from '../lib/components/assignment/assignment-modal';
import { assignment } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';

// --- Mock dependencies ---
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: () => ({
        components: {
            assignment: {
                assignmentModal: {
                    assignmentText: 'Assignment',
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
    FilePreview: ({ uploadResponse, onDelete, onDownload, isDeleteAllowed = true }) => (
        <div data-testid={`file-preview-${uploadResponse.id}`}>
            <span>{uploadResponse.name}</span>
            <button data-testid={`download-btn-${uploadResponse.id}`} onClick={onDownload}>Download</button>
            {isDeleteAllowed ? (
                <button data-testid={`delete-btn-${uploadResponse.id}`} onClick={onDelete}>Delete</button>
            ) : null}
        </div>
    ),
}));

vi.mock('../lib/components/links', () => ({
    LinkEdit: ({ initialTitle, initialUrl, onSave, onDiscard }) => (
        <div data-testid="link-edit">
            <input data-testid="edit-title" defaultValue={initialTitle} />
            <input data-testid="edit-url" defaultValue={initialUrl} />
            <button data-testid="save-link" onClick={() => onSave('Edited', 'https://edited.link')}>Save</button>
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

// vi.mock('@maany_shr/e-class-ui-kit', () => ({
//     IconButton: (props: any) => (
//         <button data-testid={props['data-testid']} onClick={props.onClick}>
//             {props.icon ? 'X' : null}
//         </button>
//     ),
// }));

vi.mock('../lib/components/icons', () => ({
    IconAssignment: ({ classNames }: any) => <span data-testid="icon-assignment" className={classNames}>[Icon]</span>,
    IconClose: () => <span data-testid="icon-close">[X]</span>,
}));

// --- Default props ---
const defaultProps = {
    assignmentId: 12,
    role: 'coach',
    title: 'Assignment Modal Title',
    description: 'This is an assignment for you!',
    files: [
        {
            id: 'f1',
            name: 'fileone.pdf',
            size: 123,
            mimeType: 'application/pdf',
            checksum: '',
            status: 'available' as const,
            category: 'generic' as const,
            url: 'https://fileone.com',
        },
    ],
    links: [
        { linkId: 3, title: 'Doc A', url: 'https://doca.com' },
        { linkId: 4, title: 'Doc B', url: 'https://docb.com' },
    ],
    course: {
        id: 1,
        title: 'Math 101',
        imageUrl: 'https://picsum.photos/40/40',
    },
    module: 1,
    lesson: 6,
    status: 'AwaitingReview' as assignment.TAssignmentStatusEnum,
    student: { id: '1', name: 'Learner' },
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
    onClose: vi.fn(),
    onDeleteIcon: vi.fn(),
    locale: 'en' as TLocale,
    children: <div data-testid="modal-children">Children Here</div>,
};

// --- Test suite ---
describe('AssignmentModal Component', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders modal UI: header, description, icon, files, links, children', () => {
        render(<AssignmentModal {...defaultProps} />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByText('Assignment Modal Title')).toBeInTheDocument();
        expect(screen.getByText('This is an assignment for you!')).toBeInTheDocument();
        expect(screen.getByText('Assignment')).toBeInTheDocument();
        // file preview
        expect(screen.getByText('fileone.pdf')).toBeInTheDocument();
        // Link previews
        expect(screen.getByText('Doc A')).toBeInTheDocument();
        expect(screen.getByText('Doc B')).toBeInTheDocument();
        // children
        expect(screen.getByTestId('modal-children')).toBeInTheDocument();
        // icon
        expect(screen.getByTestId('icon-assignment')).toBeInTheDocument();
    });

    it('calls onFileDelete and onFileDownload from FilePreview', () => {
        render(<AssignmentModal {...defaultProps} />);
        fireEvent.click(screen.getByTestId('delete-btn-f1'));
        expect(defaultProps.onFileDelete).toHaveBeenCalledWith(12, 'f1');
        fireEvent.click(screen.getByTestId('download-btn-f1'));
        expect(defaultProps.onFileDownload).toHaveBeenCalledWith('f1');
    });

    it('calls onClose when close button is clicked', () => {
        render(<AssignmentModal {...defaultProps} />);
        fireEvent.click(screen.getByTestId('close-modal-button'));
        expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('shows LinkEdit for correct linkEditIndex, saves and discards', () => {
        render(<AssignmentModal {...defaultProps} linkEditIndex={1} />);
        expect(screen.getByTestId('link-edit')).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('save-link'));
        expect(defaultProps.onChange).toHaveBeenCalled();
        fireEvent.click(screen.getByTestId('discard-link'));
        expect(defaultProps.onLinkDelete).toHaveBeenCalledWith(12, 4);
    });

    it('calls onChange for Edit button, and onLinkDelete for Delete (LinkPreview)', () => {
        render(<AssignmentModal {...defaultProps} />);
        const editBtns = screen.getAllByTestId('edit-link');
        fireEvent.click(editBtns[0]);
        expect(defaultProps.onChange).toHaveBeenCalledWith(
            defaultProps.files,
            defaultProps.links,
            0
        );
        const delBtns = screen.getAllByTestId('delete-link');
        fireEvent.click(delBtns[1]);
        expect(defaultProps.onLinkDelete).toHaveBeenCalledWith(12, 4);
    });

    it('renders multiple files/links', () => {
        const props = {
            ...defaultProps,
            files: [
                ...defaultProps.files,
                {
                    id: 'f2',
                    name: 'filetwo.doc',
                    size: 292,
                    mimeType: 'application/msword',
                    checksum: '',
                    status: 'available' as const,
                    category: 'generic' as const,
                    url: 'https://filetwo.com',
                },
            ],
            links: [
                ...defaultProps.links,
                { linkId: 5, title: 'Doc C', url: 'https://docc.com' },
            ],
        };
        render(<AssignmentModal {...props} />);
        expect(screen.getByText('filetwo.doc')).toBeInTheDocument();
        expect(screen.getByText('Doc C')).toBeInTheDocument();
    });
});
