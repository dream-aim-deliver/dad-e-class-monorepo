import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PlatformCard, PlatformCardProps } from '../lib/components/platform-cards/platform-card';
import * as translations from '@maany_shr/e-class-translations';

describe('PlatformCard', () => {
    const mockDictionary = {
        components: {
            packages: {
                coursesText: 'courses',
            },
            courseCard: {
                manageButton: 'Manage',
            },
        },
    };

    beforeEach(() => {
        vi.spyOn(translations, 'getDictionary').mockImplementation(() => mockDictionary);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const baseProps: PlatformCardProps = {
        platformName: 'Digital Marketing Hub',
        courseCount: 15,
        imageUrl: 'https://example.com/platform.jpg',
        locale: 'en',
        onClickManage: vi.fn(),
    };

    it('renders platform name and course count', () => {
        render(<PlatformCard {...baseProps} />);

        expect(screen.getByText('Digital Marketing Hub')).toBeInTheDocument();
        expect(screen.getByText('15 courses')).toBeInTheDocument();
    });

    it('renders manage button and calls onClickManage when clicked', () => {
        const mockOnClick = vi.fn();
        render(<PlatformCard {...baseProps} onClickManage={mockOnClick} />);

        const manageButton = screen.getByText('Manage');
        expect(manageButton).toBeInTheDocument();

        fireEvent.click(manageButton);
        expect(mockOnClick).toHaveBeenCalledOnce();
    });

    it('renders platform image when imageUrl is provided', () => {
        render(<PlatformCard {...baseProps} />);

        const image = screen.getByAltText('Digital Marketing Hub');
        expect(image).toBeInTheDocument();
        expect(image).toHaveAttribute('src', 'https://example.com/platform.jpg');
    });

    it('renders UserAvatar placeholder when imageUrl is not provided', () => {
        render(<PlatformCard {...baseProps} imageUrl={undefined} />);

        // UserAvatar should render with platform name as fallback
        expect(screen.queryByAltText('Digital Marketing Hub')).not.toBeInTheDocument();
        // The UserAvatar component should be rendered instead
        expect(screen.getByText('DH')).toBeInTheDocument(); // UserAvatar shows initials for "Digital Hub"
    });

    it('renders UserAvatar placeholder when image fails to load', () => {
        render(<PlatformCard {...baseProps} />);

        const image = screen.getByAltText('Digital Marketing Hub');
        fireEvent.error(image);

        // After error, UserAvatar should be rendered
        expect(screen.getByText('DH')).toBeInTheDocument(); // UserAvatar shows initials for "Digital Hub"
    });

    it('does not render course count badge when courseCount is 0', () => {
        render(<PlatformCard {...baseProps} courseCount={0} />);

        expect(screen.queryByText('0 courses')).not.toBeInTheDocument();
    });

    it('renders course count badge when courseCount is greater than 0', () => {
        render(<PlatformCard {...baseProps} courseCount={5} />);

        expect(screen.getByText('5 courses')).toBeInTheDocument();
    });

    it('handles empty imageUrl string', () => {
        render(<PlatformCard {...baseProps} imageUrl="" />);

        // Should render UserAvatar instead of image
        expect(screen.queryByAltText('Digital Marketing Hub')).not.toBeInTheDocument();
        expect(screen.getByText('DH')).toBeInTheDocument(); // UserAvatar shows initials for "Digital Hub"
    });

    it('applies correct CSS classes for styling', () => {
        const { container } = render(<PlatformCard {...baseProps} />);

        const cardElement = container.firstChild;
        expect(cardElement).toHaveClass('flex', 'flex-col', 'gap-4', 'rounded-medium', 'border', 'border-card-stroke', 'bg-card-fill', 'w-full');
    });
});