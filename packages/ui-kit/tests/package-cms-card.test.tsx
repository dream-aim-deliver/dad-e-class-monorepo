import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { PackageCmsCard } from '../lib/components/packages/package-cms-card';
import * as translations from '@maany_shr/e-class-translations';

describe('PackageCmsCard', () => {
    const mockDictionary = {
        components: {
            packages: {
                placeHolderText: 'No image available',
                archivedBadge: 'Archived',
                coursesText: 'courses',
                saveText: 'Save',
                publishButton: 'Publish',
                archiveButton: 'Archive',
                editButton: 'Edit',
            },
        },
    };

    beforeEach(() => {
        vi.spyOn(translations, 'getDictionary').mockImplementation(
            () => mockDictionary,
        );
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    const baseProps = {
        title: 'Test Package',
        description: 'A description for the package',
        duration: 90,
        courseCount: 3,
        imageUrl: 'https://example.com/image.jpg',
        pricing: { currency: '$', fullPrice: 200, partialPrice: 150 },
        locale: 'en' as const,
        onClickEdit: vi.fn(),
    };

    it('renders published package card with correct details and buttons', () => {
        const onClickArchive = vi.fn();

        render(
            <PackageCmsCard
                {...baseProps}
                status="published"
                onClickArchive={onClickArchive}
            />,
        );

        expect(screen.getByText(baseProps.title)).toBeInTheDocument();
        expect(screen.getByText(baseProps.description)).toBeInTheDocument();
        expect(screen.getByText('1h 30m')).toBeInTheDocument();
        expect(screen.getByText('3 courses')).toBeInTheDocument();
        expect(screen.getByText((_content, element) => {
            return element?.tagName === 'SPAN' && element?.textContent?.trim() === '$ 200.00';
        })).toBeInTheDocument();
        expect(screen.getByText((_content, element) => {
            return element?.tagName === 'P' && !!element?.textContent?.match(/Save\s+\$\s+50\.00/);
        })).toBeInTheDocument();

        const archiveButton = screen.getByRole('button', { name: /archive/i });
        expect(archiveButton).toBeInTheDocument();
        fireEvent.click(archiveButton);
        expect(onClickArchive).toHaveBeenCalled();

        const editButton = screen.getByRole('button', { name: /edit/i });
        expect(editButton).toBeInTheDocument();
        fireEvent.click(editButton);
        expect(baseProps.onClickEdit).toHaveBeenCalled();
    });

    it('renders archived package card with correct details and buttons', () => {
        const onClickPublished = vi.fn();

        render(
            <PackageCmsCard
                {...baseProps}
                status="archived"
                onClickPublished={onClickPublished}
            />,
        );

        expect(screen.getByText(baseProps.title)).toBeInTheDocument();
        expect(screen.getByText(baseProps.description)).toBeInTheDocument();
        expect(screen.getByText('1h 30m')).toBeInTheDocument();
        expect(screen.getByText('3 courses')).toBeInTheDocument();
        expect(screen.getByText((_content, element) => {
            return element?.tagName === 'SPAN' && element?.textContent?.trim() === '$ 200.00';
        })).toBeInTheDocument();
        expect(screen.getByText((_content, element) => {
            return element?.tagName === 'P' && !!element?.textContent?.match(/Save\s+\$\s+50\.00/);
        })).toBeInTheDocument();

        expect(screen.getByText(/Archived/)).toBeInTheDocument();

        const publishButton = screen.getByRole('button', { name: /publish/i });
        expect(publishButton).toBeInTheDocument();
        fireEvent.click(publishButton);
        expect(onClickPublished).toHaveBeenCalled();

        const editButton = screen.getByRole('button', { name: /edit/i });
        expect(editButton).toBeInTheDocument();
        fireEvent.click(editButton);
        expect(baseProps.onClickEdit).toHaveBeenCalled();
    });

    it('displays placeholder text if image fails to load', () => {
        const brokenImageUrl = 'https://example.com/broken.jpg';

        render(
            <PackageCmsCard
                {...baseProps}
                status="published"
                imageUrl={brokenImageUrl}
                onClickArchive={vi.fn()}
            />,
        );

        // Trigger image error by firing onError event on img
        const img = screen.getByRole('img', { name: baseProps.title });
        fireEvent.error(img);

        // Placeholder text should appear
        expect(
            screen.getByText(
                mockDictionary.components.packages.placeHolderText,
            ),
        ).toBeInTheDocument();
    });

    it('formats duration correctly for less than 1 hour', () => {
        render(
            <PackageCmsCard
                {...baseProps}
                status="published"
                duration={45}
                onClickArchive={vi.fn()}
            />,
        );

        expect(screen.getByText('45m')).toBeInTheDocument();
    });
});
