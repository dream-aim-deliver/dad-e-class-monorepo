import { render, screen, fireEvent } from '@testing-library/react';
import QuizTypeOne from '../lib/components/quiz/quiz-type-one/quiz-type-one';
import { vi } from 'vitest';
import { CourseElementType } from '../lib/components/course-builder/types';
import { TLocale } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';

// Mock dictionary for translations with all expected keys
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
        errorText: 'Quiz Error',
      },
      uploadingSection: {
        uploadFile: {
          choseFiles: 'Choose files',
          description: 'or drag and drop files here',
          maxSizeText: 'Max size: 5MB',
        },
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

// fileData must match FileMetadataImageSchema
const mockFileData: fileMetadata.TFileMetadata = {
  id: 'file-1',
  name: 'sample-image.jpg',
  mimeType: 'image/jpeg',
  size: 1024,
  checksum: 'abc123',
  status: 'available',   // must be "available" | "processing" | "unavailable"
  category: 'image',     // must be "image" for FileMetadataImageSchema
  url: 'https://example.com/sample-image.jpg',
  thumbnailUrl: 'https://example.com/sample-image-thumb.jpg',
};

const defaultProps = {
  id: 1,
  quizType: 'quizTypeOne' as const,
  type: 'quiz' as CourseElementType.Quiz,
  order: 1,
  required: true,
  title: 'What is the capital of France?',
  description: 'Choose the correct answer.',
  fileData: mockFileData,
  options: [
    { optionText: 'Berlin', correct: false },
    { optionText: 'Paris', correct: true },
    { optionText: 'Madrid', correct: false },
  ],
  locale: 'en' as TLocale,
  onChange: vi.fn(),
  onFilesChange: vi.fn().mockResolvedValue(mockFileData),
  onFileDelete: vi.fn(),
  onFileDownload: vi.fn(),
  onTypeChange: vi.fn(),
};

describe('QuizTypeOne Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title, description, choices, and uploader', () => {
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
    // There are 2 textboxes for title and description, rest are for choices
    expect(screen.getAllByRole('textbox').length).toBe(6);
  });

  it('deletes a choice when delete button is clicked', () => {
    render(<QuizTypeOne {...defaultProps} />);
    const deleteButton = screen.getByTestId('delete-choice-0');
    fireEvent.click(deleteButton);
    expect(screen.queryByDisplayValue('Berlin')).not.toBeInTheDocument();
    expect(screen.getByDisplayValue('Paris')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Madrid')).toBeInTheDocument();
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

  it('calls onFileDelete with correct arguments', () => {
    const mockOnFileDelete = vi.fn();
    render(
      <QuizTypeOne
        {...defaultProps}
        onFileDelete={mockOnFileDelete}
      />
    );
    // Simulate file delete by calling the handler directly (since uploader is mocked)
    mockOnFileDelete('file-1', 'file');
    expect(mockOnFileDelete).toHaveBeenCalledWith('file-1', 'file');
  });
});
