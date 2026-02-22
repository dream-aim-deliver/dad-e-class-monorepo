import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
    CourseGeneralInformationVisitor,
    CourseGeneralInformationVisitorProps,
} from '../lib/components/course-general-information/course-general-information-visitor';

// Mock translations dictionary and helpers
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: (locale: string) => ({
        components: {
            courseGeneralInformationView: {
                requirementsDetails: 'Requirements details text',
                noRequirements: 'No requirements',
                durationText: 'Duration',
                minutesText: 'minutes',
                hoursText: 'hour(s)',
                filmMaterialText: 'Video material',
                coachingWithAProfessionalText: 'Coaching sessions',
                selfStudyMaterialText: 'Self-study material',
                createdByText: 'Created by',
                bookLabel: 'Book',
                taughtBy: 'Taught by',
                requirementsTitle: 'Requirements',
                coachingIncluded: 'Coaching included',
                saveLabel: 'Save',
                buyButton: 'Buy Course',
                reviewLabel: 'reviews',
            },
            coachBanner: {
                placeHolderText: 'No image available',
            },
        },
    }),
    isLocalAware: () => true,
}));

const mockLocale = 'en';
const mockAuthor = {
    name: 'John Doe',
    image: 'https://example.com/author-image.jpg',
};

describe('CourseGeneralInformationVisitor', () => {
    const mockOnClickBook = vi.fn();
    const mockOnClickBuyCourse = vi.fn();
    const mockOnCoachingIncludedChange = vi.fn();
    const mockOnClickCourse = vi.fn();

    const baseProps: CourseGeneralInformationVisitorProps = {
        title: 'Test Course',
        duration: { video: 60, coaching: 30, selfStudy: 45 },
        author: mockAuthor,
        imageUrl: 'https://example.com/course-image.jpg',
        pricing: { currency: 'USD', partialPrice: 79.99, fullPrice: 99.99 },
        longDescription: 'This is a test course description.',
        rating: 4.5,
        totalRating: 120,
        ownerRating: 4,
        ownerTotalRating: 50,
        locale: mockLocale,
        onClickBook: mockOnClickBook,
        onClickBuyCourse: mockOnClickBuyCourse,
        onCoachingIncludedChange: mockOnCoachingIncludedChange,
        totalCoachesCount: 3,
        coachingIncluded: false,
        requiredCourses: [],
        coaches: [],
        onClickRequiredCourse: vi.fn(),
    };

    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders course title and author correctly', async () => {
        render(<CourseGeneralInformationVisitor {...baseProps} />);

        await waitFor(() => {
            expect(
                screen.getByRole('heading', { name: /Test Course/i }),
            ).toBeInTheDocument();
            expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
            expect(
                screen.getByText(/This is a test course description./i),
            ).toBeInTheDocument();
        });
    });

    it('calls onClickBook when Book button is clicked', async () => {
        render(<CourseGeneralInformationVisitor {...baseProps} />);

        const bookButton = screen.getByRole('button', { name: /book/i });
        fireEvent.click(bookButton);
        expect(mockOnClickBook).toHaveBeenCalled();
    });

    it('calls onClickBuyCourse with correct coachingIncluded state', async () => {
        render(<CourseGeneralInformationVisitor {...baseProps} />);

        const buyButton = screen.getByRole('button', {
            name: new RegExp(
                `buy.*\\(${baseProps.pricing.currency} ${baseProps.pricing.partialPrice}\\)`,
                'i',
            ),
        });

        fireEvent.click(buyButton);
        expect(mockOnClickBuyCourse).toHaveBeenCalledWith(false);
    });

    it('toggles coachingIncluded checkbox and triggers onCoachingIncludedChange', async () => {
        render(<CourseGeneralInformationVisitor {...baseProps} />);

        const checkbox = screen.getByRole('checkbox', {
            name: /coaching included/i,
        });
        expect(checkbox).not.toBeChecked();

        fireEvent.click(checkbox);
        expect(mockOnCoachingIncludedChange).toHaveBeenCalledWith(true);
    });

    it('renders required courses buttons and triggers onClickCourse', async () => {
        const requiredCourses = [
            {
                image: 'https://example.com/course1.jpg',
                courseTitle: 'Req Course 1',
                slug: 'req-course-1',
            },
            {
                image: 'https://example.com/course2.jpg',
                courseTitle: 'Req Course 2',
                slug: 'req-course-2',
            },
        ];

        render(
            <CourseGeneralInformationVisitor
                {...baseProps}
                requiredCourses={requiredCourses}
                onClickRequiredCourse={mockOnClickCourse}
            />,
        );

        const button1 = screen.getByRole('button', { name: /Req Course 1/i });
        fireEvent.click(button1);
        expect(mockOnClickCourse).toHaveBeenCalledWith('req-course-1');

        const button2 = screen.getByRole('button', { name: /Req Course 2/i });
        fireEvent.click(button2);
        expect(mockOnClickCourse).toHaveBeenCalledWith('req-course-2');
    });
});
