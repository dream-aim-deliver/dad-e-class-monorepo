import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import QuizTypeOne from '../lib/components/quiz/quiz-type-one/quiz-type-one';
import { vi } from 'vitest';
import { CourseElementType } from '../lib/components/course-builder/types';
import { TLocale } from '@maany_shr/e-class-translations';

// Mock dictionary for translations
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
        quiz: {
            quizTypeOne: {
            headingText: 'Single Choice Question',
            radioButtonText: 'Option',
            },
            quizTitleText: 'Title',
            enterTitleText: 'Enter your question title',
            descriptionText: 'Description',
            enterDescriptionText: 'Enter description',
            addChoiceText: 'Add Choice',
        },
        uploadingSection:{
            uploadImage:{
                choseImages: 'Choose images',
                description: 'or drag and drop images here',
            },
        },
    },
  }),
}));

// Mock Uploader and IconButton to avoid unrelated side effects
vi.mock('../../drag-and-drop/uploader', () => ({
  Uploader: ({ onFilesChange, onDelete, onDownload }: any) => (
    <div role="uploader-mock"></div>
  ),
}));

const defaultProps = {
    id: 1,
    quizType: 'quizTypeOne' as const,
    type: 'quiz' as CourseElementType.Quiz,
    order: 1,
    required: true,
    title: 'What is the capital of France?',
    description: 'Choose the correct answer.',
    imageId: undefined,
    imageThumbnailUrl: undefined,
    options: [
        { optionText: 'Berlin', correct: false },
        { optionText: 'Paris', correct: true },
        { optionText: 'Madrid', correct: false },
    ],
    locale: 'en' as TLocale,
    onChange: vi.fn(),
    onFilesChange: vi.fn(),
    onFileDelete: vi.fn(),
    onFileDownload: vi.fn(),
    onTypeChange: vi.fn(),
};

describe('QuizTypeOne Component', () => {
  it('renders title, description, and all choices with correct labels', () => {
    render(<QuizTypeOne {...defaultProps} />);
    expect(screen.getByText('Single Choice Question')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('What is the capital of France?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Choose the correct answer.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Berlin')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Paris')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Madrid')).toBeInTheDocument();
    expect(screen.getByText('Add Choice')).toBeInTheDocument();
  });

  it('calls onChange with updated title and description', () => {
    const mockOnChange = vi.fn();
    render(<QuizTypeOne {...defaultProps} onChange={mockOnChange} />);
    const titleInput = screen.getByDisplayValue('What is the capital of France?');
    fireEvent.change(titleInput, { target: { value: 'New Title' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Title' })
    );

    const descInput = screen.getByDisplayValue('Choose the correct answer.');
    fireEvent.change(descInput, { target: { value: 'New Description' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'New Description' })
    );
  });

  it('allows editing choice text and marks correct answer', () => {
    const mockOnChange = vi.fn();
    render(<QuizTypeOne {...defaultProps} onChange={mockOnChange} />);
    const choiceInputs = screen.getAllByDisplayValue(/Berlin|Paris|Madrid/);
    fireEvent.change(choiceInputs[0], { target: { value: 'Rome' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.arrayContaining([
          expect.objectContaining({ optionText: 'Rome' }),
        ]),
      })
    );

    // Mark first choice as correct
    const radios = screen.getAllByRole('radio');
    fireEvent.click(radios[0]);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        options: [
          { optionText: 'Rome', correct: true },
          { optionText: 'Paris', correct: false },
          { optionText: 'Madrid', correct: false },
        ],
      })
    );
  });

  it('adds a new choice when "Add Choice" is clicked', () => {
    render(<QuizTypeOne {...defaultProps} />);
    fireEvent.click(screen.getByText('Add Choice'));
    // Should render one more input field for the new choice
    expect(screen.getAllByRole('textbox').length).toBeGreaterThan(3); // title, description, + choices
  });

  it('deletes a choice when delete button is clicked', () => {
    render(<QuizTypeOne {...defaultProps} />);
    const deleteButton = screen.getByTestId('delete-choice-0');
    fireEvent.click(deleteButton);
    // Now only two choices should remain
    expect(screen.queryByDisplayValue('Berlin')).not.toBeInTheDocument();
  });

  it('disables delete button when only one choice left', () => {
    render(
      <QuizTypeOne
        {...defaultProps}
        options={[{ optionText: 'Only Option', correct: true }]}
      />
    );
    const deleteButton = screen.getByTestId('delete-choice-0');
    expect(deleteButton).toBeDisabled();
  });
});
