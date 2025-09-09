import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
    CourseCardAddToPackage,
    CourseCardAddToPackageProps,
} from '../lib/components/course-card/add-to-package/course-card-add-to-package';
import { TLocale } from '@maany_shr/e-class-translations';

// Mock translations for English and German only
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: TLocale) => ({
        components: {
            courseCard: {
                addToPackageButton:
                    locale === 'en' ? 'Add to Package' : 'Zum Paket hinzufügen',
                removeButton: locale === 'en' ? 'Remove' : 'Entfernen',
                hours: locale === 'en' ? 'hours' : 'Stunden',
            },
            coachBanner: {
                placeHolderText:
                    locale === 'en'
                        ? 'No Image Available'
                        : 'Kein Bild verfügbar',
            },
        },
    }),
}));

const baseProps: CourseCardAddToPackageProps = {
    title: 'React Basics',
    rating: 4.2,
    reviewCount: 55,
    language: { code: 'ENG', name: 'English' },
    sessions: 12,
    author: { name: 'Jane Smith', image: 'https://example.com/author.jpg' },
    duration: { video: 120, coaching: 30, selfStudy: 60 }, // 210 mins = 3.5 hrs
    sales: 100,
    imageUrl: 'https://example.com/course.jpg',
    onClickUser: vi.fn(),
    courseAdded: false,
    onAddOrRemove: vi.fn(),
    locale: 'en',
};

describe('CourseCardAddToPackage', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders all course info correctly', () => {
        render(<CourseCardAddToPackage {...baseProps} />);

        expect(screen.getByText(/React Basics/i)).toBeInTheDocument();
        expect(
            screen.getByText((text) => text.includes('4.2')),
        ).toBeInTheDocument();
        expect(screen.getByText('(55)')).toBeInTheDocument();
        expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();

        // Sessions
        expect(
            screen.getByText((text) => text.includes('12')),
        ).toBeInTheDocument();

        // Duration
        expect(
            screen.getByText(
                (text) =>
                    text.includes('3.5') &&
                    text.toLowerCase().includes('hours'),
            ),
        ).toBeInTheDocument();

        // Sales
        expect(
            screen.getByText((text) => text.includes('100')),
        ).toBeInTheDocument();

        // Button
        expect(
            screen.getByRole('button', { name: /Add to Package/i }),
        ).toBeInTheDocument();
    });

    it('formats duration properly when integer hours', () => {
        render(
            <CourseCardAddToPackage
                {...baseProps}
                duration={{ video: 60, coaching: 60, selfStudy: 60 }} // 180 mins = 3 hrs
            />,
        );

        expect(
            screen.getByText(
                (text) =>
                    text.includes('3') && text.toLowerCase().includes('hours'),
            ),
        ).toBeInTheDocument();
    });

    it('shows placeholder when imageUrl is missing', () => {
        render(
            <CourseCardAddToPackage
                {...{ ...baseProps, imageUrl: undefined }}
            />,
        );
        expect(screen.getByText(/No Image Available/i)).toBeInTheDocument();
    });

    it('shows placeholder when course image fails to load', async () => {
        render(<CourseCardAddToPackage {...baseProps} />);
        const courseImage = screen.getByAltText('React Basics');
        fireEvent.error(courseImage);

        await waitFor(() => {
            expect(screen.getByText(/No Image Available/i)).toBeInTheDocument();
        });
    });

    it('calls onClickUser when clicking on author name', () => {
        render(<CourseCardAddToPackage {...baseProps} />);
        fireEvent.click(screen.getByText(/Jane Smith/i));
        expect(baseProps.onClickUser).toHaveBeenCalled();
    });

    it('calls onAddOrRemove and toggles button text', () => {
        const { rerender } = render(
            <CourseCardAddToPackage {...baseProps} courseAdded={false} />,
        );

        const button = screen.getByRole('button', {
            name: /Remove|Add to Package/i,
        });
        fireEvent.click(button);
        expect(baseProps.onAddOrRemove).toHaveBeenCalled();

        // Re-render with updated props to reflect toggle state
        rerender(<CourseCardAddToPackage {...baseProps} courseAdded={true} />);
        expect(
            screen.getByRole('button', { name: /Remove/i }),
        ).toBeInTheDocument();
    });

    it('renders localized texts in German locale', () => {
        render(<CourseCardAddToPackage {...baseProps} locale="de" />);
        expect(
            screen.getByRole('button', { name: /Zum Paket hinzufügen/i }),
        ).toBeInTheDocument();
    });
});
