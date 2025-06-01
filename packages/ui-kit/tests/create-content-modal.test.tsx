import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
    CreateContentModal,
    CreateContentModalProps,
} from '../lib/components/create-content-modal';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: () => ({
        components: {
            createContentModal: {
                titleCourse: 'Create a course',
                descriptionCourse:
                    'Start from scratch or duplicate an existing course.',
                createNewCourse: 'Create New Course',
                duplicateCourse: 'Duplicate',
                searchCourse: 'Search Course',
                noCourseFound: 'No course found',
                titleLesson: 'Create a lesson',
                descriptionLesson:
                    'Start from scratch or duplicate an existing lesson.',
                createNewLesson: 'Create New Lesson',
                duplicateLesson: 'Duplicate',
                searchLesson: 'Search Lesson',
                noLessonFound: 'No lesson found',
                startFromScratch: 'Start from scratch',
                close: 'Close',
                you: 'You',
            },
        },
    }),
    isLocalAware: vi.fn(),
}));

vi.mock('../lib/components/button', () => ({
    Button: ({
        text,
        onClick,
        variant,
        size,
    }: {
        text: string;
        onClick: () => void;
        variant: string;
        size: string;
    }) => (
        <button
            data-testid={`button-${text}`}
            onClick={onClick}
            className={`button-${variant} button-${size}`}
        >
            {text}
        </button>
    ),
}));

vi.mock('../lib/components/avatar/user-avatar', () => ({
    UserAvatar: ({
        fullName,
        size,
        imageUrl,
    }: {
        fullName: string;
        size: string;
        imageUrl: string;
    }) => (
        <img
            data-testid="user-avatar"
            src={imageUrl}
            alt={fullName}
            className={`avatar-${size}`}
        />
    ),
}));

vi.mock('../lib/components/star-rating', () => ({
    StarRating: ({ rating }: { rating: number }) => (
        <div data-testid="star-rating">{`Rating: ${rating}`}</div>
    ),
}));

// 🧪 Test
describe('CreateContentModal - Course variant', () => {
    const mockProps: CreateContentModalProps = {
        variant: 'course',
        locale: 'en',
        onClose: vi.fn(),
        onCreateNewContentDraft: vi.fn(),
        onDuplicateContent: vi.fn(),
        courses: [
            {
                id: '1',
                title: 'React Basics',
                ownerName: 'Alice',
                ownerAvatarUrl: '',
                isYou: true,
                totalRating: 20,
                rating: 4.5,
            },
        ],
        lessons: [],
    };

    it('renders modal with correct title and description', () => {
        render(<CreateContentModal {...mockProps} />);
        expect(screen.getByText('Create a course')).toBeInTheDocument();
        expect(
            screen.getByText(/Start from scratch or duplicate/),
        ).toBeInTheDocument();
    });

    it('shows Create New Course button in "start from scratch" tab', () => {
        render(<CreateContentModal {...mockProps} />);
        expect(
            screen.getByTestId('button-Create New Course'),
        ).toBeInTheDocument();
    });

    it('clicks "Create New Course" button', () => {
        render(<CreateContentModal {...mockProps} />);
        fireEvent.click(screen.getByTestId('button-Create New Course'));
        expect(mockProps.onCreateNewContentDraft).toHaveBeenCalled();
    });

    it('switches to "Duplicate" tab and filters courses', () => {
        render(<CreateContentModal {...mockProps} />);
        fireEvent.click(screen.getByText('Duplicate'));

        const searchInput = screen.getByPlaceholderText('Search Course');
        fireEvent.change(searchInput, { target: { value: 'React' } });

        expect(screen.getByText('React Basics')).toBeInTheDocument();
        expect(screen.getByTestId('star-rating')).toHaveTextContent(
            'Rating: 4.5',
        );
    });

    it('selects a course and duplicates it', () => {
        render(<CreateContentModal {...mockProps} />);
        fireEvent.click(screen.getByText('Duplicate'));

        const searchInput = screen.getByPlaceholderText('Search Course');
        fireEvent.change(searchInput, { target: { value: 'React' } });

        // Click list item to select it
        fireEvent.click(screen.getByText('React Basics'));

        // Should now show the duplicate button
        fireEvent.click(screen.getByTestId('button-Duplicate'));

        expect(mockProps.onDuplicateContent).toHaveBeenCalledWith('1');
    });

    it('clicks close button', () => {
        render(<CreateContentModal {...mockProps} />);
        fireEvent.click(screen.getByTestId('close-modal-button'));
        expect(mockProps.onClose).toHaveBeenCalled();
    });
});
