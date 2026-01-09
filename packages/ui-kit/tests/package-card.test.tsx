import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PackageCard } from '../lib/components/packages/package-card';

// Mock the dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            generalCard: {
                placeHolderText: 'Image not available',
            },
            packages: {
                coursesText: ' Courses',
                purchasePackageText: 'Buy Now',
                detailsText: 'View Details',
                saveText: 'Save',
                savingsTooltip: 'Savings information',
            },
        },
    }),
    isLocalAware: vi.fn(),
}));

vi.mock('../badge', () => ({
    Badge: ({ text }: { text: string }) => <span>{text}</span>,
}));

vi.mock('../button', () => ({
    Button: ({ text }: { text: string }) => <button>{text}</button>,
}));

vi.mock('../icons/icon-clock', () => ({
    IconClock: ({ size }: { size: string }) => (
        <span>Clock Icon (size {size})</span>
    ),
}));

vi.mock('../tooltip', async (importOriginal) => {
    const actual = await importOriginal();
    return {
        ...actual,
        default: () => null,
    };
});

describe('PackageCard', () => {
    const defaultProps = {
        imageUrl: 'https://example.com/image.jpg',
        title: 'Package Title',
        description: 'Package Description',
        duration: 180,
        courseCount: 5,
        pricing: {
            fullPrice: 100,
            partialPrice: 50,
            currency: 'CHF',
            savingsWithoutCoachings: 50,
        },
        locale: 'en' as 'en' | 'de',
        onClickPurchase: vi.fn(),
        onClickDetails: vi.fn(),
    };

    it('renders title, description, and badges', () => {
        render(<PackageCard {...defaultProps} />);

        expect(screen.getByText('Package Title')).toBeInTheDocument();
        expect(screen.getByText('Package Description')).toBeInTheDocument();
        expect(screen.getByText('3h 0m')).toBeInTheDocument();
        expect(screen.getByText('5 Courses')).toBeInTheDocument();
    });

    it('renders image with correct src and alt attributes', () => {
        render(<PackageCard {...defaultProps} />);

        const img = screen.getByRole('img');
        expect(img).toHaveAttribute('src', 'https://example.com/image.jpg');
        expect(img).toHaveAttribute('alt', 'Package Title');
    });

    it('shows placeholder when image URL is empty', () => {
        render(<PackageCard {...defaultProps} imageUrl="" />);

        expect(screen.getByText('Image not available')).toBeInTheDocument();
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('shows placeholder when image fails to load', async () => {
        render(<PackageCard {...defaultProps} />);

        const img = screen.getByRole('img');
        img.dispatchEvent(new Event('error'));

        await waitFor(() => {
            expect(screen.getByText('Image not available')).toBeInTheDocument();
        });
        expect(screen.queryByRole('img')).not.toBeInTheDocument();
    });

    it('displays price and saved price correctly', () => {
        render(<PackageCard {...defaultProps} />);

        expect(screen.getByText('CHF 100')).toBeInTheDocument();
        expect(screen.getByText('Save CHF 50')).toBeInTheDocument();
    });

    it('shows tooltip container when title is truncated', async () => {
        // Mock the scrollHeight > clientHeight condition
        vi.spyOn(Element.prototype, 'scrollHeight', 'get').mockReturnValue(50);
        vi.spyOn(Element.prototype, 'clientHeight', 'get').mockReturnValue(40);

        render(<PackageCard {...defaultProps} />);

        const titleElement = screen.getByRole('heading', {
            name: 'Package Title',
        });
        const tooltipContainer = titleElement.parentElement?.querySelector(
            'div.bg-card-stroke.text-text-primary.text-sm',
        );

        expect(tooltipContainer).toBeInTheDocument();
        expect(tooltipContainer).toHaveTextContent('Package Title');

        // Clean up
        vi.restoreAllMocks();
    });
});
