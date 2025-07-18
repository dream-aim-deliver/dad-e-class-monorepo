import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
    AddCoachModal,
    AddCoachModalProps,
} from '../lib/components/add-coach-modal';

// Mock translations
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: () => ({
        components: {
            addCoachModal: {
                title: 'Add a Coach',
                description: 'Search for and add a coach to your session.',
                searchLabel: 'Search Coach',
                noFoundLabel: 'No coach found',
                addedLabel: 'Added',
                addButton: 'Add',
                closeButton: 'Close',
            },
        },
    }),
    isLocalAware: vi.fn(),
}));

// Mock dependencies
vi.mock('../lib/components/button', () => ({
    Button: ({
        text,
        onClick,
        variant,
        size,
        iconLeft,
    }: {
        text: string;
        onClick: () => void;
        variant: string;
        size: string;
        iconLeft?: React.ReactNode;
    }) => (
        <button
            data-testid={`button-${text}`}
            onClick={onClick}
            className={`button-${variant} button-${size}`}
        >
            {iconLeft}
            {text}
        </button>
    ),
}));

vi.mock('../lib/components/icon-button', () => ({
    IconButton: ({
        icon,
        onClick,
    }: {
        icon: React.ReactNode;
        onClick: () => void;
    }) => (
        <button data-testid="close-modal-button" onClick={onClick}>
            {icon}
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

vi.mock('../lib/components/input-field', () => ({
    InputField: ({
        value,
        setValue,
        inputText,
    }: {
        value: string;
        setValue: (v: string) => void;
        inputText: string;
    }) => (
        <input
            data-testid="search-input"
            placeholder={inputText}
            value={value}
            onChange={(e) => setValue(e.target.value)}
        />
    ),
}));

describe('AddCoachModal', () => {
    const mockProps: AddCoachModalProps = {
        locale: 'en',
        onClose: vi.fn(),
        onAdd: vi.fn(),
        content: [
            {
                id: '1',
                coachName: 'Jane Coach',
                coachAvatarUrl: '/avatars/jane.jpg',
                totalRating: 42,
                rating: 4.2,
            },
        ],
        addedCoachIds: [],
    };

    it('renders with title and description', () => {
        render(<AddCoachModal {...mockProps} />);
        expect(screen.getByText('Add a Coach')).toBeInTheDocument();
        expect(
            screen.getByText('Search for and add a coach to your session.'),
        ).toBeInTheDocument();
    });

    it('shows search input and types into it', () => {
        render(<AddCoachModal {...mockProps} />);
        const input = screen.getByTestId('search-input');
        expect(input).toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'Jane' } });
        expect(input).toHaveValue('Jane');
    });

    it('filters and shows coach with rating', () => {
        render(<AddCoachModal {...mockProps} />);
        fireEvent.change(screen.getByTestId('search-input'), {
            target: { value: 'Jane' },
        });

        expect(screen.getByText('Jane Coach')).toBeInTheDocument();
        expect(screen.getByTestId('star-rating')).toHaveTextContent(
            'Rating: 4.2',
        );
        expect(screen.getByTestId('user-avatar')).toBeInTheDocument();
    });

    it('clicks "Add" button for coach', () => {
        render(<AddCoachModal {...mockProps} />);
        fireEvent.change(screen.getByTestId('search-input'), {
            target: { value: 'Jane' },
        });

        fireEvent.click(screen.getByTestId('button-Add'));
        expect(mockProps.onAdd).toHaveBeenCalledWith('1');
    });

    it('displays "Added" label for already added coach', () => {
        render(<AddCoachModal {...mockProps} addedCoachIds={['1']} />);

        fireEvent.change(screen.getByTestId('search-input'), {
            target: { value: 'Jane' },
        });

        expect(screen.getByText('Added')).toBeInTheDocument();
    });

    it('shows empty state when no results match', () => {
        render(<AddCoachModal {...mockProps} />);
        fireEvent.change(screen.getByTestId('search-input'), {
            target: { value: 'NotFound' },
        });

        expect(screen.getByText('No coach found')).toBeInTheDocument();
    });

    it('clicks close button', () => {
        render(<AddCoachModal {...mockProps} />);
        fireEvent.click(screen.getByTestId('close-modal-button'));
        expect(mockProps.onClose).toHaveBeenCalled();
    });

    it('clicks bottom close button', () => {
        render(<AddCoachModal {...mockProps} />);
        fireEvent.click(screen.getByTestId('button-Close'));
        expect(mockProps.onClose).toHaveBeenCalledTimes(1); // now total 2
    });
});
