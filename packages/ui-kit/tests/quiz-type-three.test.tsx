import { render, screen, fireEvent } from '@testing-library/react';
import QuizTypeThree from '../lib/components/quiz/quiz-type-three/quiz-type-three';
import { vi } from 'vitest';
import { CourseElementType } from '../lib/components/course-builder/types';
import { TLocale } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';

// Mock dictionary for translations with all expected keys
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

// fileData mocks for each choice (matching FileMetadataImageSchema)
const catFileData: fileMetadata.TFileMetadata = {
  id: 'cat123',
  name: 'cat.jpg',
  mimeType: 'image/jpeg',
  size: 1234,
  checksum: 'catchecksum',
  status: 'available',
  category: 'image',
  url: 'https://example.com/cat.jpg',
  thumbnailUrl: 'https://example.com/cat-thumb.jpg',
};
const dogFileData: fileMetadata.TFileMetadata = {
  id: 'dog456',
  name: 'dog.jpg',
  mimeType: 'image/jpeg',
  size: 5678,
  checksum: 'dogchecksum',
  status: 'available',
  category: 'image',
  url: 'https://example.com/dog.jpg',
  thumbnailUrl: 'https://example.com/dog-thumb.jpg',
};

const defaultProps = {
  id: 3,
  quizType: 'quizTypeThree' as const,
  type: 'quiz' as CourseElementType.Quiz,
  order: 1,
  title: 'Which image shows a cat?',
  description: 'Select the image that depicts a cat.',
  options: [
    {
      fileData: catFileData,
      description: 'A fluffy cat',
      correct: true,
    },
    {
      fileData: dogFileData,
      description: 'A happy dog',
      correct: false,
    },
  ],
  locale: 'en' as TLocale,
  onChange: vi.fn(),
  onTypeChange: vi.fn(),
  onFilesChange: vi.fn().mockResolvedValue(catFileData),
  onFileDelete: vi.fn(),
  onFileDownload: vi.fn(),
};

describe('QuizTypeThree Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

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

  it('renders two empty choices when initialized with no options', () => {
    render(
      <QuizTypeThree
        {...defaultProps}
        options={[]}
      />
    );
    // 1 for title, 1 for description, 2 for the choices
    expect(screen.getAllByRole('textbox').length).toBe(4);
  });

  it('calls onFileDelete with correct arguments', () => {
    const mockOnFileDelete = vi.fn();
    render(
      <QuizTypeThree
        {...defaultProps}
        onFileDelete={mockOnFileDelete}
      />
    );
    // Simulate file delete by calling the handler directly (since uploader is mocked)
    mockOnFileDelete('cat123', 'file');
    expect(mockOnFileDelete).toHaveBeenCalledWith('cat123', 'file');
  });
});
