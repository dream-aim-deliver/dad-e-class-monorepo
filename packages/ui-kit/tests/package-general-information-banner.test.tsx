import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PackageGeneralInformation } from '../lib/components/package-general-information-banner';

// Mock dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            packageGeneralInformation: {
                coachingIncluded: 'Coaching included',
                purchaseButton: 'Buy Now',
                fromText: 'From',
                saveText: 'save',
                errorImageText: 'Image not available',
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

vi.mock('../lib/components/checkbox', () => ({
    CheckBox: ({ label }: { label: string }) => {
        const id = 'mock-checkbox';
        return (
            <>
                <input type="checkbox" id={id} />
                <label htmlFor={id}>{label}</label>
            </>
        );
    },
}));

vi.mock('../lib/components/tooltip', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        Tooltip: () => null,
    };
});

describe('PackageGeneralInformation', () => {
    const mockProps = {
        title: 'Visualisierung',
        subTitle: 'Als Package oder flexibel:',
        description:
            'Das Angebot "Visualisierung" richtet sich an Firmen und Einzelpersonen, die bereits über eine Idee verfügen.',
        duration: 165,
        pricing: {
            fullPrice: 299,
            partialPrice: 249,
            currency: 'CHF',
            savingsWithoutCoachings: 50,
            savingsWithCoachings: 50,
        },
        locale: 'en' as 'en' | 'de',
        onClickPurchase: vi.fn(),
        imageUrl:
            'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    };

    it('renders all main content correctly', () => {
        render(<PackageGeneralInformation {...mockProps} />);

        // Titles
        expect(screen.getByText(mockProps.title)).toBeInTheDocument();
        expect(screen.getByText(mockProps.subTitle)).toBeInTheDocument();
        expect(screen.getByText(mockProps.description)).toBeInTheDocument();

        // Duration
        expect(screen.getByText('2h 45m')).toBeInTheDocument();

        // Checkbox
        expect(screen.getByLabelText('Coaching included')).toBeInTheDocument();

        // Button and prices
        expect(screen.getByText('Buy Now')).toBeInTheDocument();
        expect(screen.getByText((_content, element) => {
            return element?.tagName === 'H6' && element?.textContent?.trim() === `From CHF ${mockProps.pricing.partialPrice.toFixed(2)}`;
        })).toBeInTheDocument();
        expect(screen.getByText((_content, element) => {
            return element?.tagName === 'P' && element?.textContent?.trim() === `save CHF ${(mockProps.pricing.fullPrice - mockProps.pricing.partialPrice).toFixed(2)}`;
        })).toBeInTheDocument();
    });

    it('calls onClickPurchase when purchase button is clicked', () => {
        render(<PackageGeneralInformation {...mockProps} />);
        fireEvent.click(screen.getByText('Buy Now'));
        expect(mockProps.onClickPurchase).toHaveBeenCalled();
    });

    it('shows placeholder text if image is broken', async () => {
        render(
            <PackageGeneralInformation
                {...mockProps}
                imageUrl="broken-image.jpg"
            />,
        );

        const imgs = screen.queryAllByRole('img');
        imgs.forEach((img) => {
            fireEvent.error(img);
        });

        const placeholders = screen.getAllByText('Image not available');
        expect(placeholders.length).toBeGreaterThan(0);
    });
});
