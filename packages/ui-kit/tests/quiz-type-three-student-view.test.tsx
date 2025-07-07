import { render, screen, fireEvent } from '@testing-library/react';
import QuizTypeThreeStudentView from '../lib/components/quiz/quiz-type-three/quiz-type-three-student-view';
import { vi } from 'vitest';
import { TLocale } from '@maany_shr/e-class-translations';
import { CourseElementType } from '../lib/components/course-builder/types';

// Mock dictionary for translations with all expected keys
vi.mock('@maany_shr/e-class-translations', () => ({
    getDictionary: () => ({
        components: {
            quiz: {
                successBannerText: 'Correct!',
                errorBannerText: 'Incorrect!',
                showSolutionText: 'Show Solution',
                hideSolutionText: 'Hide Solution',
                tryAgainText: 'Try Again',
                checkAnswerText: 'Check Answer',
                clearText: 'Clear',
            },
            coachBanner: {
                placeHolderText: 'No image available',
            },
        },
    }),
}));

const defaultProps = {
    quizType: 'quizTypeThree' as const,
    type: 'quiz' as CourseElementType.Quiz,
    id: 3,
    order: 1,
    required: true,
    title: 'Select the correct image',
    description: 'Choose the image that matches the description.',
    options: [
        {
            imageId: '1',
            imageThumbnailUrl: 'https://example.com/image1.jpg',
            description: 'Option 1',
            correct: false,
            selected: false,
        },
        {
            imageId: '2',
            imageThumbnailUrl: 'https://example.com/image2.jpg',
            description: 'Option 2',
            correct: true,
            selected: false,
        },
    ],
    onChange: vi.fn(),
    locale: 'en' as TLocale,
};

describe('QuizTypeThreeStudentView', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('renders question, description, and all image options', () => {
        render(<QuizTypeThreeStudentView {...defaultProps} />);
        expect(screen.getByText('Select the correct image')).toBeInTheDocument();
        expect(screen.getByText('Choose the image that matches the description.')).toBeInTheDocument();
        expect(screen.getByLabelText('Option 1')).toBeInTheDocument();
        expect(screen.getByLabelText('Option 2')).toBeInTheDocument();
        expect(screen.getByText('Check Answer')).toBeInTheDocument();
        // Images should be rendered
        expect(screen.getAllByRole('img').length).toBe(2);
    });

    it('calls onChange with selected option after checking answer', () => {
        const mockOnChange = vi.fn();
        render(<QuizTypeThreeStudentView {...defaultProps} onChange={mockOnChange} />);
        fireEvent.click(screen.getByLabelText('Option 2'));
        fireEvent.click(screen.getByText('Check Answer'));
        expect(mockOnChange).toHaveBeenCalledWith(
            expect.objectContaining({
                options: [
                    expect.objectContaining({ description: 'Option 1', selected: false }),
                    expect.objectContaining({ description: 'Option 2', selected: true }),
                ],
            })
        );
    });

    it('shows success banner and clear button when correct answer is checked', () => {
        render(<QuizTypeThreeStudentView {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('Option 2'));
        fireEvent.click(screen.getByText('Check Answer'));
        expect(screen.getByText('Correct!')).toBeInTheDocument();
        expect(screen.getByText('Clear')).toBeInTheDocument();
    });

    it('shows error banner and solution/try again buttons when incorrect answer is checked', () => {
        render(<QuizTypeThreeStudentView {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('Option 1'));
        fireEvent.click(screen.getByText('Check Answer'));
        expect(screen.getByText('Incorrect!')).toBeInTheDocument();
        expect(screen.getByText('Show Solution')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('shows correct answer when Show Solution is clicked', () => {
        render(<QuizTypeThreeStudentView {...defaultProps} />);
        fireEvent.click(screen.getByLabelText('Option 1'));
        fireEvent.click(screen.getByText('Check Answer'));
        fireEvent.click(screen.getByText('Show Solution'));
        // The correct option (Option 2) should be visually selected
        const radios = screen.getAllByRole('radio');
        expect(radios[1]).toBeChecked();
        expect(screen.getByText('Hide Solution')).toBeInTheDocument();
        expect(screen.getByText('Try Again')).toBeInTheDocument();
    });

    it('shows placeholder if image fails to load', () => {
        render(
            <QuizTypeThreeStudentView
                {...defaultProps}
                options={[
                    {
                        imageId: '1',
                        imageThumbnailUrl: 'broken-url.jpg',
                        description: 'Option 1',
                        correct: false,
                        selected: false,
                    },
                    {
                        imageId: '2',
                        imageThumbnailUrl: 'broken-url2.jpg',
                        description: 'Option 2',
                        correct: true,
                        selected: false,
                    },
                ]}
            />
        );
        // Simulate image error for both images
        const imgs = screen.getAllByRole('img');
        fireEvent.error(imgs[0]);
        fireEvent.error(imgs[1]);
        expect(screen.getAllByText('No image available').length).toBe(2);
    });
});
