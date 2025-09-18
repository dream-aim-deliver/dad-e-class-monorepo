import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PlatformCardList, PlatformCardListProps } from '../lib/components/platform-cards/platform-card-list';
import { PlatformCard } from '../lib/components/platform-cards/platform-card';
import * as translations from '@maany_shr/e-class-translations';

describe('PlatformCardList', () => {
    const mockDictionary = {
        components: {
            platformCard: {
                emptyState: 'No platforms yet.',
            },
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

    const baseProps: PlatformCardListProps = {
        locale: 'en',
    };

    it('renders empty state when no children are provided', () => {
        render(<PlatformCardList {...baseProps} />);

        expect(screen.getByText('No platforms yet.')).toBeInTheDocument();
    });

    it('renders empty state when children is an empty array', () => {
        render(<PlatformCardList {...baseProps} children={[]} />);

        expect(screen.getByText('No platforms yet.')).toBeInTheDocument();
    });

    it('renders empty state when children is null', () => {
        render(<PlatformCardList {...baseProps} children={null} />);

        expect(screen.getByText('No platforms yet.')).toBeInTheDocument();
    });

    it('renders empty state when children is undefined', () => {
        render(<PlatformCardList {...baseProps} children={undefined} />);

        expect(screen.getByText('No platforms yet.')).toBeInTheDocument();
    });

    it('renders single platform card', () => {
        const mockOnClick = vi.fn();
        render(
            <PlatformCardList {...baseProps}>
                <PlatformCard
                    platformName="Test Platform"
                    courseCount={5}
                    imageUrl="https://example.com/test.jpg"
                    locale="en"
                    onClickManage={mockOnClick}
                />
            </PlatformCardList>
        );

        expect(screen.getByText('Test Platform')).toBeInTheDocument();
        expect(screen.getByText('5 courses')).toBeInTheDocument();
        expect(screen.queryByText('No platforms yet.')).not.toBeInTheDocument();
    });

    it('renders multiple platform cards in grid layout', () => {
        const mockOnClick = vi.fn();
        render(
            <PlatformCardList {...baseProps}>
                <PlatformCard
                    platformName="Platform 1"
                    courseCount={5}
                    imageUrl="https://example.com/platform1.jpg"
                    locale="en"
                    onClickManage={mockOnClick}
                />
                <PlatformCard
                    platformName="Platform 2"
                    courseCount={10}
                    imageUrl="https://example.com/platform2.jpg"
                    locale="en"
                    onClickManage={mockOnClick}
                />
                <PlatformCard
                    platformName="Platform 3"
                    courseCount={3}
                    imageUrl="https://example.com/platform3.jpg"
                    locale="en"
                    onClickManage={mockOnClick}
                />
            </PlatformCardList>
        );

        expect(screen.getByText('Platform 1')).toBeInTheDocument();
        expect(screen.getByText('Platform 2')).toBeInTheDocument();
        expect(screen.getByText('Platform 3')).toBeInTheDocument();
        expect(screen.getByText('5 courses')).toBeInTheDocument();
        expect(screen.getByText('10 courses')).toBeInTheDocument();
        expect(screen.getByText('3 courses')).toBeInTheDocument();
        expect(screen.queryByText('No platforms yet.')).not.toBeInTheDocument();
    });

    it('applies correct grid CSS classes', () => {
        const mockOnClick = vi.fn();
        const { container } = render(
            <PlatformCardList {...baseProps}>
                <PlatformCard
                    platformName="Test Platform"
                    courseCount={5}
                    locale="en"
                    onClickManage={mockOnClick}
                />
            </PlatformCardList>
        );

        const gridContainer = container.querySelector('[role="list"]');
        expect(gridContainer).toHaveClass('grid', 'grid-cols-1', 'md:grid-cols-2', 'xl:grid-cols-3', 'gap-3', 'w-full');
    });

    it('applies correct accessibility attributes', () => {
        const mockOnClick = vi.fn();
        const { container } = render(
            <PlatformCardList {...baseProps}>
                <PlatformCard
                    platformName="Test Platform"
                    courseCount={5}
                    locale="en"
                    onClickManage={mockOnClick}
                />
            </PlatformCardList>
        );

        const listContainer = container.querySelector('[role="list"]');
        expect(listContainer).toBeInTheDocument();

        const listItem = container.querySelector('[role="listitem"]');
        expect(listItem).toBeInTheDocument();
    });

    it('handles array of platform cards correctly', () => {
        const mockOnClick = vi.fn();
        const platforms = [
            <PlatformCard
                key="1"
                platformName="Platform 1"
                courseCount={5}
                locale="en"
                onClickManage={mockOnClick}
            />,
            <PlatformCard
                key="2"
                platformName="Platform 2"
                courseCount={8}
                locale="en"
                onClickManage={mockOnClick}
            />,
        ];

        render(<PlatformCardList {...baseProps} children={platforms} />);

        expect(screen.getByText('Platform 1')).toBeInTheDocument();
        expect(screen.getByText('Platform 2')).toBeInTheDocument();
    });

    it('renders empty state with correct styling', () => {
        const { container } = render(<PlatformCardList {...baseProps} />);

        const emptyStateElement = container.querySelector('.flex.flex-col.gap-2.rounded-medium.border.border-card-stroke.bg-card-fill');
        expect(emptyStateElement).toBeInTheDocument();
        expect(emptyStateElement).toHaveTextContent('No platforms yet.');
    });

    it('uses German locale correctly', () => {
        const germanMockDictionary = {
            components: {
                platformCard: {
                    emptyState: 'Noch keine Plattformen.',
                },
            },
        };

        vi.spyOn(translations, 'getDictionary').mockImplementation(() => germanMockDictionary);

        render(<PlatformCardList locale="de" />);

        expect(screen.getByText('Noch keine Plattformen.')).toBeInTheDocument();
    });
});