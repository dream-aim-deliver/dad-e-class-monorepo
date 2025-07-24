import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BuyCoachingSessionBanner } from '../lib/components/buy-coaching-session-banner';

// Mocks
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            buyCoachingSessionBanner: {
                coachBadge: 'Coach',
                courseCreatorBadge: 'Course Creator',
                skillsLabel: 'Skills',
                buyButton: 'Buy coaching sessions',
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
    UserAvatar: ({
        imageUrl,
        fullName,
        size,
    }: {
        imageUrl: string;
        fullName: string;
        size: string;
    }) => (
        <img
            src={imageUrl}
            alt={`Avatar: ${fullName}, size: ${size}`}
            data-testid="user-avatar"
        />
    ),
}));

vi.mock('../lib/components/star-rating', () => ({
    StarRating: ({ rating }: { rating: number }) => <div>Rating: {rating}</div>,
}));

vi.mock('../lib/components/skill-badges', () => ({
    __esModule: true,
    default: ({ skills }: { skills: string[] }) => (
        <div>{skills.join(', ')}</div>
    ),
}));

describe('BuyCoachingSessionBanner', () => {
    const defaultProps = {
        coachName: 'Anna Keller',
        coachAvatarUrl: 'https://example.com/avatar.jpg',
        description: 'Experienced career coach with 10+ years of experience.',
        coachRating: 4.9,
        totalRatings: 140,
        locale: 'en' as 'en' | 'de',
        onBookSessionWith: vi.fn(),
        skills: ['Leadership', 'Communication'],
        isCourseCreator: false,
    };

    it('renders all content correctly without course creator badge', () => {
        render(<BuyCoachingSessionBanner {...defaultProps} />);

        expect(screen.getByText(defaultProps.coachName)).toBeInTheDocument();

        // Avatar check
        expect(
            screen.getByAltText('Avatar: Anna Keller, size: xLarge'),
        ).toBeInTheDocument();

        expect(screen.getByText(defaultProps.description)).toBeInTheDocument();
        expect(screen.getByText('Coach')).toBeInTheDocument();
        expect(screen.queryByText('Course Creator')).not.toBeInTheDocument();
        expect(screen.getByText('Skills')).toBeInTheDocument();
        expect(
            screen.getByText('Leadership, Communication'),
        ).toBeInTheDocument();
        expect(screen.getByText('Buy coaching sessions')).toBeInTheDocument();
    });

    it('renders course creator badge when isCourseCreator is true', () => {
        render(
            <BuyCoachingSessionBanner
                {...defaultProps}
                isCourseCreator={true}
            />,
        );

        expect(screen.getByText('Coach')).toBeInTheDocument();
        expect(screen.getByText('Course Creator')).toBeInTheDocument();
    });

    it('calls onBookSessionWith when button is clicked', () => {
        render(<BuyCoachingSessionBanner {...defaultProps} />);
        const button = screen.getByText('Buy coaching sessions');
        fireEvent.click(button);
        expect(defaultProps.onBookSessionWith).toHaveBeenCalled();
    });
});
