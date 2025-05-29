import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
    CreateCourseModal,
    CreateCourseModalProps,
} from '../lib/components/create-course-modal';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            createCourseModal: {
                title: 'Create a New Course',
                description: 'Choose how you want to start',
                startFromScratch: 'Start from Scratch',
                duplicateCourse: 'Duplicate Course',
                createNewCourse: 'Create New Course',
                searchCourse: 'Search a course...',
                noCourseFound: 'No courses found',
                duplicate: 'Duplicate',
                close: 'Close',
                you: 'You',
            },
        },
    }),
    isLocalAware: vi.fn(),
}));

vi.mock('../lib/components/icons/icon-plus', () => ({
    IconPlus: () => <span data-testid="icon-plus" />,
}));
vi.mock('../lib/components/icons/icon-search', () => ({
    IconSearch: () => <span data-testid="icon-search" />,
}));
vi.mock('../lib/components/icons/icon-close', () => ({
    IconClose: () => <span data-testid="icon-close" />,
}));
vi.mock('../lib/components/avatar/user-avatar', () => ({
    UserAvatar: ({ fullName }: { fullName: string }) => (
        <div data-testid="user-avatar">{fullName}</div>
    ),
}));
vi.mock('../lib/components/star-rating', () => ({
    StarRating: ({ rating }: { rating: number }) => (
        <div data-testid="star-rating">{rating} stars</div>
    ),
}));

describe('CreateCourseModal', () => {
    const courses = [
        {
            title: 'React Basics',
            ownerName: 'John Doe',
            ownerAvatarUrl: '',
            isYou: false,
            totalRating: 12,
            rating: 4.5,
            id: 'course-1',
        },
    ];

    const baseProps: CreateCourseModalProps = {
        locale: 'en',
        onClose: vi.fn(),
        onCreateNewCourseDraft: vi.fn(),
        onDuplicateCourse: vi.fn(),
        courses,
    };

    it('renders modal with default tab', () => {
        render(<CreateCourseModal {...baseProps} />);
        expect(screen.getByText('Create a New Course')).toBeInTheDocument();
        expect(screen.getByText('Start from Scratch')).toBeInTheDocument();
        expect(screen.getByText('Create New Course')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(<CreateCourseModal {...baseProps} />);
        fireEvent.click(screen.getByTestId('close-modal-button'));
        expect(baseProps.onClose).toHaveBeenCalled();
    });

    it('calls onCreateNewCourseDraft when start from scratch button is clicked', () => {
        render(<CreateCourseModal {...baseProps} />);
        fireEvent.click(screen.getByText('Create New Course'));
        expect(baseProps.onCreateNewCourseDraft).toHaveBeenCalled();
    });

    it('filters and selects course for duplication', () => {
        render(
            <CreateCourseModal
                {...baseProps}
                courses={[
                    ...courses,
                    {
                        title: 'Advanced TypeScript',
                        ownerName: 'Jane Smith',
                        ownerAvatarUrl: '',
                        isYou: true,
                        totalRating: 8,
                        rating: 4.8,
                        id: 'course-2',
                    },
                ]}
            />,
        );
        fireEvent.click(screen.getByText('Duplicate Course'));
        const input = screen.getByPlaceholderText('Search a course...');
        fireEvent.change(input, { target: { value: 'React' } });
        expect(screen.getByText('React Basics')).toBeInTheDocument();
        expect(
            screen.queryByText('Advanced TypeScript'),
        ).not.toBeInTheDocument();
        fireEvent.click(screen.getByText('React Basics'));
        fireEvent.click(
            screen.getByRole('button', { name: /duplicate course/i }),
        );
        expect(baseProps.onDuplicateCourse).toHaveBeenCalledWith('course-1');
    });

    it('shows no courses found message', () => {
        render(
            <CreateCourseModal
                {...baseProps}
                courses={[]} // lista vacía
            />,
        );

        fireEvent.click(screen.getByText('Duplicate Course'));
        const input = screen.getByPlaceholderText('Search a course...');
        fireEvent.change(input, { target: { value: 'unknown' } });

        expect(screen.getByText('No courses found')).toBeInTheDocument();
    });
});
