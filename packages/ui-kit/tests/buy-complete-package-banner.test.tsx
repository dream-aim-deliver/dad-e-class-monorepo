import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { BuyCompletePackageBanner } from '../lib/components/buy-complete-package-banner';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            buyCompletePackageBanner: {
                coachingIncluded: 'Coaching included',
                purchaseButton: 'Buy Now',
                fromText: 'from',
                saveText: 'save',
            },
            packages: {
                savingsTooltip: 'Savings information',
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

vi.mock('../lib/components/icons/icon-clock', () => ({
    IconClock: ({ size }: { size: string }) => (
        <span>Clock Icon (size {size})</span>
    ),
}));

vi.mock('../lib/components/avatar/user-avatar', () => ({
    UserAvatar: ({ imageUrl }: { imageUrl: string }) => (
        <img src={imageUrl} alt="User Avatar" />
    ),
}));

vi.mock('../lib/components/checkbox', () => ({
    CheckBox: ({ label }: { label: string }) => <label>{label}</label>,
}));

describe('BuyCompletePackageBanner', () => {
    const mockProps = {
        titleBanner: 'Complete Package Offer',
        descriptionBanner: 'Get full access with exclusive benefits',
        imageUrl: 'https://example.com/avatar.jpg',
        title: 'Ultimate Learning Pack',
        description: 'Includes all courses and features',
        duration: 120,
        pricing: {
            fullPrice: 1000,
            partialPrice: 200,
            currency: 'CHF',
            savingsWithoutCoachings: 800,
            savingsWithCoachings: 800,
        },
        locale: 'en' as 'en' | 'de',
        onClickPurchase: vi.fn(),
    };

    it('renders banner content correctly', () => {
        render(<BuyCompletePackageBanner {...mockProps} />);

        expect(screen.getByText('Complete Package Offer')).toBeInTheDocument();
        expect(
            screen.getByText('Get full access with exclusive benefits'),
        ).toBeInTheDocument();
        expect(screen.getByText('Ultimate Learning Pack')).toBeInTheDocument();
        expect(
            screen.getByText('Includes all courses and features'),
        ).toBeInTheDocument();
        expect(screen.getByText('2h 0m')).toBeInTheDocument(); // Duration badge
        expect(screen.getByText('Coaching included')).toBeInTheDocument();
        expect(screen.getByText('Buy Now')).toBeInTheDocument();
        expect(screen.getByText('from CHF 200')).toBeInTheDocument();
        expect(screen.getByText('save CHF 800')).toBeInTheDocument();
    });

    it('calls onClickPurchase when button is clicked', () => {
        render(<BuyCompletePackageBanner {...mockProps} />);

        const button = screen.getByText('Buy Now');
        fireEvent.click(button);

        expect(mockProps.onClickPurchase).toHaveBeenCalled();
    });

    it('renders avatar with correct src and alt', () => {
        render(<BuyCompletePackageBanner {...mockProps} />);
        const img = screen.getByAltText('User Avatar');
        expect(img).toHaveAttribute('src', mockProps.imageUrl);
    });
});