import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { RemoveModal, RemoveModalProps } from '../lib/components/remove-modal';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: () => ({
        components: {
            removeModal: {
                titleLesson: 'Delete this lesson?',
                titleModule: 'Delete this module?',
                titleCoach: 'Remove this coach?',
                lessonDeleted: 'Lesson has been deleted.',
                moduleDeleted: 'Module has been deleted.',
                coachRemoved: 'Coach has been removed.',
                errorMessageLesson:
                    'An error occurred while deleting the lesson.',
                errorMessageModule:
                    'An error occurred while deleting the module.',
                errorMessageCoach:
                    'An error occurred while removing the coach.',
                closeButton: 'Close',
                backButton: 'Back',
                deleteButton: 'Delete',
                coach: 'Coach',
                course: 'Course',
            },
        },
    }),
    isLocalAware: vi.fn(),
}));

// Mock components

vi.mock('../lib/components/button', () => ({
    Button: ({
        text,
        onClick,
        disabled,
    }: {
        text: string;
        onClick: () => void;
        variant: string;
        size: string;
        disabled?: boolean;
    }) => (
        <button onClick={onClick} disabled={disabled}>
            {text}
        </button>
    ),
}));

vi.mock('../lib/components/icons/icon-close', () => ({
    IconClose: () => <span data-testid="icon-close">X</span>,
}));

vi.mock('../lib/components/icons/icon-success', () => ({
    IconSuccess: ({ classNames }: { classNames?: string }) => (
        <span data-testid="icon-success" className={classNames}>
            Success
        </span>
    ),
}));

vi.mock('../lib/components/icons/icon-error', () => ({
    IconError: ({ classNames }: { classNames?: string }) => (
        <span data-testid="icon-error" className={classNames}>
            Error
        </span>
    ),
}));

vi.mock('../lib/components/icons/icon-lesson', () => ({
    IconLesson: ({
        classNames,
    }: {
        classNames?: string;
        size?: string | number;
    }) => (
        <span data-testid="icon-lesson" className={classNames}>
            LessonIcon
        </span>
    ),
}));

vi.mock('../lib/components/icons/icon-module', () => ({
    IconModule: ({
        classNames,
    }: {
        classNames?: string;
        size?: string | number;
    }) => (
        <span data-testid="icon-module" className={classNames}>
            ModuleIcon
        </span>
    ),
}));

vi.mock('../lib/components/icons/icon-course', () => ({
    IconCourse: ({
        classNames,
    }: {
        classNames?: string;
        size: string | number;
    }) => (
        <span data-testid="icon-course" className={classNames}>
            CourseIcon
        </span>
    ),
}));

vi.mock('../lib/components/icons/icon-coaching-offer', () => ({
    IconCoachingOffer: ({
        classNames,
    }: {
        classNames?: string;
        size?: string | number;
    }) => (
        <span data-testid="icon-coaching-offer" className={classNames}>
            CoachIcon
        </span>
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

vi.mock('../lib/components/icon-button', () => ({
    IconButton: ({
        onClick,
        icon,
        'data-testid': testId,
    }: {
        onClick: () => void;
        styles?: string;
        icon: React.ReactNode;
        size?: string;
        className?: string;
        'data-testid'?: string;
    }) => (
        <button onClick={onClick} data-testid={testId}>
            {icon}
        </button>
    ),
}));

vi.mock('../lib/components/icons/icon-loader-spinner', () => ({
    IconLoaderSpinner: ({ classNames }: { classNames?: string }) => (
        <div data-testid="spinner" className={classNames}>
            Loading...
        </div>
    ),
}));

describe('RemoveModal', () => {
    const baseProps: RemoveModalProps = {
        locale: 'en',
        onClose: vi.fn(),
        onDelete: vi.fn(),
        onBack: vi.fn(),
        coachName: 'Jane Coach',
        coachAvatarUrl: 'coach.jpg',
        courseTitle: 'Cool Course',
        courseImageUrl: 'course.jpg',
        lessonTitle: 'Lesson 1',
        moduleTitle: 'Module 1',
        variant: 'lesson',
        isError: false,
        isLoading: false,
        isDeleted: false,
    };

    it('renders the confirmation state for lesson', () => {
        render(<RemoveModal {...baseProps} />);
        expect(screen.getByText('Delete this lesson?')).toBeInTheDocument();
        expect(screen.getByText('Back')).toBeInTheDocument();
        expect(screen.getByText('Delete')).toBeInTheDocument();
    });

    it('renders the deleted state for module', () => {
        render(
            <RemoveModal {...baseProps} variant="module" isDeleted={true} />,
        );
        expect(
            screen.getByText('Module has been deleted.'),
        ).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('renders the error state for coach', () => {
        render(<RemoveModal {...baseProps} variant="coach" isError={true} />);
        expect(
            screen.getByText('An error occurred while removing the coach.'),
        ).toBeInTheDocument();
        expect(screen.getByText('Close')).toBeInTheDocument();
    });

    it('calls onClose when close button is clicked', () => {
        render(<RemoveModal {...baseProps} />);
        fireEvent.click(screen.getByTestId('close-modal-button'));
        expect(baseProps.onClose).toHaveBeenCalled();
    });

    it('calls onDelete when delete button is clicked', () => {
        render(<RemoveModal {...baseProps} />);
        fireEvent.click(screen.getByText('Delete'));
        expect(baseProps.onDelete).toHaveBeenCalled();
    });

    it('calls onBack when back button is clicked', () => {
        render(<RemoveModal {...baseProps} />);
        fireEvent.click(screen.getByText('Back'));
        expect(baseProps.onBack).toHaveBeenCalled();
    });

    it('shows spinner when loading', () => {
        render(<RemoveModal {...baseProps} isLoading={true} />);
        expect(screen.getByTestId('spinner')).toBeInTheDocument();
    });
});
