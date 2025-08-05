import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BookSessionWith, BookSessionWithProps } from '../lib/components/book-session-with-banner';

// Mocks dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            bookSessionWithBanner: {
                coachBadge: 'Coach',
                courseCreatorBadge: 'Course Creator',
                bookSessionButton: 'Book session with',
            },
        },
    }),
    isLocalAware: vi.fn(),
}));

vi.mock('../lib/components/badge', () => ({
    Badge: ({ text }: { text: string }) => <span>{text}</span>,
}));

vi.mock('../lib/components/button', () => ({
    Button: ({ text, onClick }: { text: string; onClick?: () => void }) => (
        <button onClick={onClick}>{text}</button>
    ),
}));

vi.mock('../lib/components/avatar/user-avatar', () => ({
    UserAvatar: ({ imageUrl }: { imageUrl: string }) => (
        <img src={imageUrl} alt="User Avatar" />
    ),
}));

vi.mock('../lib/components/star-rating', () => ({
    StarRating: ({ rating }: { rating: number }) => (
        <div>Rating: {rating}</div>
    ),
}));

describe('BookSessionWith', () => {
    const defaultProps: BookSessionWithProps = {
        coachName: 'Anna Keller',
        coachAvatarUrl: 'https://example.com/avatar.jpg',
        description: 'Experienced career coach with 10+ years of experience.',
        coachRating: 4.9,
        totalRatings: 140,
        locale: 'en' as 'en' | 'de',
        onBookSessionWith: vi.fn(),
    };

    it('renders all content correctly without course creator badge', () => {
        render(<BookSessionWith {...defaultProps} isCourseCreator={false} />);

        expect(screen.getByText('Anna Keller')).toBeInTheDocument();
        expect(screen.getByAltText('User Avatar')).toHaveAttribute(
            'src',
            defaultProps.coachAvatarUrl,
        );
        expect(
            screen.getByText('Experienced career coach with 10+ years of experience.'),
        ).toBeInTheDocument();
        expect(screen.getByText('Coach')).toBeInTheDocument();
        expect(screen.queryByText('Course Creator')).not.toBeInTheDocument();
    });

    it('renders course creator badge when isCourseCreator is true', () => {
        render(<BookSessionWith {...defaultProps} isCourseCreator={true} />);

        expect(screen.getByText('Coach')).toBeInTheDocument();
        expect(screen.getByText('Course Creator')).toBeInTheDocument();
    });

    it('calls onBookSessionWith when button is clicked', () => {
        render(<BookSessionWith {...defaultProps} />);
        const button = screen.getByText(`Book session with Anna Keller`);
        fireEvent.click(button);
        expect(defaultProps.onBookSessionWith).toHaveBeenCalled();
    });
});
