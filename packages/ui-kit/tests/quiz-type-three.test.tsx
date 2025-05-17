import { render, screen, fireEvent } from '@testing-library/react';
import QuizTypeThree from '../lib/components/quiz/quiz-type-three/quiz-type-three';
import { vi } from 'vitest';
import { CourseElementType } from '../lib/components/course-builder/types';
import { TLocale } from '@maany_shr/e-class-translations';

// Mock dictionary for translations
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
      quiz: {
        quizTypeThree: {
          headingText: 'Image Choice Question',
          choiceDescriptionText: 'Choice Description',
        },
        quizTitleText: 'Title',
        enterTitleText: 'Enter your question title',
        descriptionText: 'Description',
        enterDescriptionText: 'Enter description',
        addChoiceText: 'Add Choice',
      },
      uploadingSection: {
        uploadImage: {
          choseImages: 'Choose images',
          description: 'or drag and drop images here',
        },
      },
    },
  }),
}));

// Mock Uploader to avoid unrelated side effects
vi.mock('../../drag-and-drop/uploader', () => ({
  Uploader: ({ onFilesChange, onDelete, onDownload }: any) => (
    <div role="uploader-mock"></div>
  ),
}));

const defaultProps = {
  id: 3,
  quizType: 'quizTypeThree' as const,
  type: 'quiz' as CourseElementType.Quiz,
  order: 1,
  title: 'Which image shows a cat?',
  description: 'Select the image that depicts a cat.',
  options: [
    {
      imageId: 'cat123',
      imageThumbnailUrl: 'https://example.com/cat.jpg',
      description: 'A fluffy cat',
      correct: true,
    },
    {
      imageId: 'dog456',
      imageThumbnailUrl: 'https://example.com/dog.jpg',
      description: 'A happy dog',
      correct: false,
    },
  ],
  locale: 'en' as TLocale,
  onChange: vi.fn(),
  onTypeChange: vi.fn(), 
  onFilesChange: vi.fn(), 
  onFileDelete: vi.fn(), 
  onFileDownload: vi.fn()
};

describe('QuizTypeThree Component', () => {
  it('renders title, description, heading, and all choices with correct labels', () => {
    render(<QuizTypeThree {...defaultProps} />);
    expect(screen.getByText('Image Choice Question')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Which image shows a cat?')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Select the image that depicts a cat.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A fluffy cat')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A happy dog')).toBeInTheDocument();
  });

  it('calls onChange with updated title and description', () => {
    const mockOnChange = vi.fn();
    render(<QuizTypeThree {...defaultProps} onChange={mockOnChange} />);
    const titleInput = screen.getByDisplayValue('Which image shows a cat?');
    fireEvent.change(titleInput, { target: { value: 'New Image Choice Title' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Image Choice Title' })
    );

    const descInput = screen.getByDisplayValue('Select the image that depicts a cat.');
    fireEvent.change(descInput, { target: { value: 'New Image Choice Description' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'New Image Choice Description' })
    );
  });

  it('allows editing choice descriptions', () => {
    const mockOnChange = vi.fn();
    render(<QuizTypeThree {...defaultProps} onChange={mockOnChange} />);
    const choiceInputs = screen.getAllByDisplayValue(/A fluffy cat|A happy dog/);
    fireEvent.change(choiceInputs[0], { target: { value: 'A playful kitten' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        options: expect.arrayContaining([
          expect.objectContaining({ description: 'A playful kitten' }),
        ]),
      })
    );
  });

  it('marks correct answer among choices', () => {
    const mockOnChange = vi.fn();
    render(<QuizTypeThree {...defaultProps} onChange={mockOnChange} />);
    const radios = screen.getAllByRole('radio');
    // Click the second radio (should be for the dog)
    fireEvent.click(radios[1]);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        options: [
          expect.objectContaining({ correct: false }),
          expect.objectContaining({ correct: true }),
        ],
      })
    );
  });

  it('renders a new choice when initialized with no options', () => {
    render(
      <QuizTypeThree
        {...defaultProps}
        options={[]}
      />
    );
    // Should render 3 textboxes: 1 for title, 1 for description, and 2 for the choice
    expect(screen.getAllByRole('textbox').length).toBe(4); // 1 for title, 1 for description, and 2 for the choice
  });
});
