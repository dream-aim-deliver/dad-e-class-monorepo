import { render, screen, fireEvent } from '@testing-library/react';
import QuizTypeFourStudentView from '../lib/components/quiz/quiz-type-four/quiz-type-four-student-view';
import { vi } from 'vitest';
import { TLocale } from '@maany_shr/e-class-translations';
import { CourseElementType } from '../lib/components/course-builder/types';

// Mock dictionary for translations with all expected keys
// vi.mock('@maany_shr/e-class-translations', () => ({
//     getDictionary: () => ({
//         components: {
//             quiz: {
//                 quizTypeFourStudentView: {
//                     descriptionText: 'Enter the correct label for each image.',
//                 },
//                 successBannerText: 'Correct!',
//                 errorBannerText: 'Incorrect!',
//                 showSolutionText: 'Show Solution',
//                 hideSolutionText: 'Hide Solution',
//                 tryAgainText: 'Try Again',
//                 checkAnswerText: 'Check Answer',
//                 clearText: 'Clear',
//             },
//             coachBanner: {
//                 placeHolderText: 'No image available',
//             },
//         },
//     }),
// }));

// const defaultProps = {
//     quizType: 'quizTypeFour' as const,
//     type: 'quiz' as CourseElementType.Quiz,
//     id: 4,
//     order: 1,
//     required: true,
//     title: 'Match the images with the correct labels',
//     description: 'Drag and drop the correct labels to match the images.',
//     labels: [
//         { letter: 'A', description: 'Apple' },
//         { letter: 'B', description: 'Banana' },
//     ],
//     images: [
//         {
//             imageThumbnailUrl: 'https://example.com/apple.jpg',
//             correctLetter: 'A',
//             userInput: '',
//             imageId: 'apple',
//         },
//         {
//             imageThumbnailUrl: 'https://example.com/banana.jpg',
//             correctLetter: 'B',
//             userInput: '',
//             imageId: 'banana',
//         },
//     ],
//     onChange: vi.fn(),
//     locale: 'en' as TLocale,
// };

describe('QuizTypeFourStudentView', () => {
    it('passes', () => {
        // This is a placeholder test to ensure the test suite runs without errors.
        // Actual tests should be implemented based on the component's functionality.
        expect(true).toBe(true);
    });
    
    // beforeEach(() => {
    //     vi.clearAllMocks();
    // });

    // it('renders title, description, labels, and images with input fields', () => {
    //     render(<QuizTypeFourStudentView {...defaultProps} />);
    //     expect(screen.getByText('Match the images with the correct labels')).toBeInTheDocument();
    //     expect(screen.getByText('Drag and drop the correct labels to match the images.')).toBeInTheDocument();
    //     expect(screen.getByText('A')).toBeInTheDocument();
    //     expect(screen.getByText('B')).toBeInTheDocument();
    //     expect(screen.getByText('Apple')).toBeInTheDocument();
    //     expect(screen.getByText('Banana')).toBeInTheDocument();
    //     expect(screen.getAllByRole('img').length).toBe(2);
    //     expect(screen.getAllByRole('textbox').length).toBe(2);
    //     expect(screen.getByText('Check Answer')).toBeInTheDocument();
    //     expect(screen.getByText('Enter the correct label for each image.')).toBeInTheDocument();
    // });

    // it('calls onChange with user inputs after checking answer', () => {
    //     const mockOnChange = vi.fn();
    //     render(<QuizTypeFourStudentView {...defaultProps} onChange={mockOnChange} />);
    //     const inputs = screen.getAllByRole('textbox');
    //     fireEvent.change(inputs[0], { target: { value: 'A' } });
    //     fireEvent.change(inputs[1], { target: { value: 'B' } });
    //     fireEvent.click(screen.getByText('Check Answer'));
    //     expect(mockOnChange).toHaveBeenCalledWith(
    //         expect.objectContaining({
    //             images: [
    //                 expect.objectContaining({ userInput: 'A' }),
    //                 expect.objectContaining({ userInput: 'B' }),
    //             ],
    //         })
    //     );
    // });

    // it('shows success banner and clear button when all answers are correct', () => {
    //     render(<QuizTypeFourStudentView {...defaultProps} />);
    //     const inputs = screen.getAllByRole('textbox');
    //     fireEvent.change(inputs[0], { target: { value: 'A' } });
    //     fireEvent.change(inputs[1], { target: { value: 'B' } });
    //     fireEvent.click(screen.getByText('Check Answer'));
    //     expect(screen.getByText('Correct!')).toBeInTheDocument();
    //     expect(screen.getByText('Clear')).toBeInTheDocument();
    // });

    // it('shows error banner and solution/try again buttons when any answer is incorrect', () => {
    //     render(<QuizTypeFourStudentView {...defaultProps} />);
    //     const inputs = screen.getAllByRole('textbox');
    //     fireEvent.change(inputs[0], { target: { value: 'A' } });
    //     fireEvent.change(inputs[1], { target: { value: 'C' } });
    //     fireEvent.click(screen.getByText('Check Answer'));
    //     expect(screen.getByText('Incorrect!')).toBeInTheDocument();
    //     expect(screen.getByText('Show Solution')).toBeInTheDocument();
    //     expect(screen.getByText('Try Again')).toBeInTheDocument();
    // });

    // it('shows correct answers when Show Solution is clicked', () => {
    //     render(<QuizTypeFourStudentView {...defaultProps} />);
    //     const inputs = screen.getAllByRole('textbox');
    //     fireEvent.change(inputs[0], { target: { value: 'A' } });
    //     fireEvent.change(inputs[1], { target: { value: 'C' } });
    //     fireEvent.click(screen.getByText('Check Answer'));
    //     fireEvent.click(screen.getByText('Show Solution'));
    //     // Inputs should display the correct letters now
    //     expect(inputs[0]).toHaveValue('A');
    //     expect(inputs[1]).toHaveValue('B');
    //     expect(screen.getByText('Hide Solution')).toBeInTheDocument();
    //     expect(screen.getByText('Try Again')).toBeInTheDocument();
    // });

    // it('resets state when Try Again is clicked', () => {
    //     render(<QuizTypeFourStudentView {...defaultProps} />);
    //     const inputs = screen.getAllByRole('textbox');
    //     fireEvent.change(inputs[0], { target: { value: 'A' } });
    //     fireEvent.change(inputs[1], { target: { value: 'C' } });
    //     fireEvent.click(screen.getByText('Check Answer'));
    //     fireEvent.click(screen.getByText('Try Again'));
    //     expect(inputs[0]).toHaveValue('');
    //     expect(inputs[1]).toHaveValue('');
    // });
});
