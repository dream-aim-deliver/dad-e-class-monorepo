import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PackageCourseSelector } from '../lib/components/course-card/package-course-selector/package-course-selector';
import { PackageCourseCard } from '../lib/components/course-card/package-course-selector/package-course-card';
import { TLocale } from '@maany_shr/e-class-translations';


// --- MOCKS ---
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            courseCard: {
                packageCourseSelectorTitle: 'Select Your Courses',
                packageCourseSelectorDescription: 'Build your learning package',
                coachingIncluded: 'Include coaching sessions',
                packageCourseSelectorButton: 'Purchase Package',
                saveText: 'Save',
                includeCourseButton: 'Include',
                excludeCourseButton: 'Exclude',
                detailsCourseButton: 'Details',
                hours: 'hours'
            },
            coachBanner: {
                placeHolderText: 'Image not available'
            },
            packages: {
                savingsTooltip: 'Amount saved compared to buying courses separately'
            }
        }
    }),
    isLocalAware: vi.fn()
}));

vi.mock('../../checkbox', () => ({
    CheckBox: ({ checked, onChange, label }: {
        checked: boolean;
        onChange: () => void;
        label: string
    }) => (
        <label data-testid="coaching-checkbox">
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
            {label}
        </label>
    )
}));

vi.mock('../../button', () => ({
    Button: ({ text, onClick }: {
        text: string;
        onClick: () => void
    }) => (
        <button onClick={onClick}>{text}</button>
    )
}));

// --- TEST DATA ---
const mockCourses = [
    {
        courseId: '1',
        title: 'React Fundamentals',
        description: 'Learn React basics',
        duration: { video: 120, coaching: 60, selfStudy: 30 },
        pricing: { fullPrice: 199, partialPrice: 149, currency: 'CHF' },
        imageUrl: '',
        rating: 4.5,
        author: { name: 'John Doe', image: '' },
        language: { code: 'ENG' as const, name: 'English' as const },
        sales: 100,
        reviewCount: 50,
        courseIncluded: true,
        onClickUser: vi.fn(),
        onClickDetails: vi.fn(),
        onClickIncludeExclude: vi.fn(),
        locale: 'en' as TLocale
    },
    {
        courseId: '2',
        title: 'Advanced TypeScript',
        description: 'Master TS concepts',
        duration: { video: 180, coaching: 0, selfStudy: 60 },
        pricing: { fullPrice: 299, partialPrice: 249, currency: 'CHF' },
        imageUrl: '',
        rating: 4.8,
        author: { name: 'Jane Smith', image: '' },
        language: { code: 'ENG' as const, name: 'English' as const },
        sales: 150,
        reviewCount: 75,
        courseIncluded: false,
        onClickUser: vi.fn(),
        onClickDetails: vi.fn(),
        onClickIncludeExclude: vi.fn(),
        locale: 'en' as TLocale
    }
];

// --- TEST SUITE ---
describe('PackageCourseSelector', () => {
    const mockProps = {
        title: 'Premium Package',
        description: 'Customize your learning experience',
        coachingIncluded: false,
        pricing: { fullPrice: 1000, partialPrice: 799, currency: 'CHF', savings: 201 },
        onClickCheckbox: vi.fn(),
        onClickPurchase: vi.fn(),
        locale: 'en' as TLocale,
        children: mockCourses.map(course => (
            <PackageCourseCard key={course.courseId} {...course} />
        ))
    };

    it('renders all main elements', () => {
        render(<PackageCourseSelector {...mockProps} />);

        expect(screen.getByText('Select Your Courses')).toBeInTheDocument();
        expect(screen.getByText('Build your learning package')).toBeInTheDocument();
        expect(screen.getByText('Premium Package')).toBeInTheDocument();
        expect(screen.getByText('Customize your learning experience')).toBeInTheDocument();
        expect(screen.getByText(/CHF\s+799/)).toBeInTheDocument();
        expect(screen.getByText(/Save\s+CHF\s+201/)).toBeInTheDocument();
    });

    it('renders correct number of course cards', () => {
        render(<PackageCourseSelector {...mockProps} />);
        const courseCards = screen.getAllByText(/React Fundamentals|Advanced TypeScript/);
        expect(courseCards).toHaveLength(2);
    });

    it('triggers purchase action', () => {
        render(<PackageCourseSelector {...mockProps} />);
        const purchaseButton = screen.getByRole('button', { name: 'Purchase Package' });
        fireEvent.click(purchaseButton);
        expect(mockProps.onClickPurchase).toHaveBeenCalledTimes(1);
    });

    it('handles course inclusion/exclusion', () => {
        render(<PackageCourseSelector {...mockProps} />);

        // First course is included by default (Exclude button)
        const excludeButton = screen.getByText('Exclude');
        fireEvent.click(excludeButton);
        expect(mockCourses[0].onClickIncludeExclude).toHaveBeenCalledTimes(1);

        // Second course is excluded by default (Include button)
        const includeButton = screen.getByText('Include');
        fireEvent.click(includeButton);
        expect(mockCourses[1].onClickIncludeExclude).toHaveBeenCalledTimes(1);
    });

    it('displays correct pricing information', () => {
        render(<PackageCourseSelector {...mockProps} />);

        expect(screen.getByText(/CHF\s+799/)).toBeInTheDocument();
        expect(screen.getByText(/Save\s+CHF\s+201/)).toBeInTheDocument();
    });
});
