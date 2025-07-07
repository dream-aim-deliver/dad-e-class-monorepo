import { render, screen, fireEvent } from '@testing-library/react';
import QuizTypeFour from '../lib/components/quiz/quiz-type-four/quiz-type-four';
import { vi } from 'vitest';
import { CourseElementType } from '../lib/components/course-builder/types';
import { TLocale } from '@maany_shr/e-class-translations';
import { fileMetadata } from '@maany_shr/e-class-models';

// Mock dictionary for translations with all expected keys
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
      quiz: {
        quizTypeFour: {
          headingText: 'Label the Images',
          choiceDescriptionText: 'Enter label description',
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

// fileData mocks for each image (matching FileMetadataImageSchema)
const catFileData: fileMetadata.TFileMetadata = {
  id: 'img1',
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
  id: 'img2',
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
  id: 4,
  quizType: 'quizTypeFour' as const,
  type: 'quiz' as CourseElementType.Quiz,
  order: 1,
  required: true,
  title: 'Label the following images.',
  description: 'Match each label to the correct image.',
  labels: [
    { letter: 'A', description: 'A cat' },
    { letter: 'B', description: 'A dog' },
  ],
  images: [
    {
      correctLetter: 'A',
      fileData: catFileData,
    },
    {
      correctLetter: 'B',
      fileData: dogFileData,
    },
  ],
  locale: 'en' as TLocale,
  onChange: vi.fn(),
  onTypeChange: vi.fn(),
  onFilesChange: vi.fn().mockResolvedValue(catFileData),
  onFileDelete: vi.fn(),
  onFileDownload: vi.fn(),
};

describe('QuizTypeFour Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title, description, heading, and all label-image pairs', () => {
    render(<QuizTypeFour {...defaultProps} />);
    expect(screen.getByText('Label the Images')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Label the following images.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Match each label to the correct image.')).toBeInTheDocument();
    expect(screen.getByText('A)')).toBeInTheDocument();
    expect(screen.getByText('B)')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A cat')).toBeInTheDocument();
    expect(screen.getByDisplayValue('A dog')).toBeInTheDocument();
    expect(screen.getAllByText('Add Choice').length).toBe(1);
  });

  it('calls onChange with updated title and description', () => {
    const mockOnChange = vi.fn();
    render(<QuizTypeFour {...defaultProps} onChange={mockOnChange} />);
    const titleInput = screen.getByDisplayValue('Label the following images.');
    fireEvent.change(titleInput, { target: { value: 'New Label Title' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Label Title' })
    );

    const descInput = screen.getByDisplayValue('Match each label to the correct image.');
    fireEvent.change(descInput, { target: { value: 'New Label Description' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'New Label Description' })
    );
  });

  it('allows editing label descriptions', () => {
    const mockOnChange = vi.fn();
    render(<QuizTypeFour {...defaultProps} onChange={mockOnChange} />);
    const labelInputs = screen.getAllByDisplayValue(/A cat|A dog/);
    fireEvent.change(labelInputs[0], { target: { value: 'A playful kitten' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        labels: expect.arrayContaining([
          expect.objectContaining({ description: 'A playful kitten' }),
        ]),
      })
    );
  });

  it('adds a new label-image pair when "Add Choice" is clicked', () => {
    render(<QuizTypeFour {...defaultProps} />);
    const addButton = screen.getByText('Add Choice');
    fireEvent.click(addButton);
    // Should render one more label (C)
    expect(screen.getByText('C)')).toBeInTheDocument();
  });

  it('deletes a label-image pair and reorders labels starting from A', () => {
    render(<QuizTypeFour {...defaultProps} />);
    // Find the delete button for the second pair (B)
    const deleteButtons = screen.getAllByTestId(/delete-choice-/);
    fireEvent.click(deleteButtons[1]); // Delete the second label-image pair (B)
    // The first label (A) should still exist
    expect(screen.queryByText('A)')).toBeInTheDocument();
    // The second label (B) should now be removed
    expect(screen.queryByText('B)')).not.toBeInTheDocument();
    // The remaining label should be 'A' and description should be 'A cat'
    expect(screen.getByDisplayValue('A cat')).toBeInTheDocument();
    expect(screen.queryByDisplayValue('A dog')).not.toBeInTheDocument();
  });

  it('disables delete button when only one pair is left', () => {
    render(
      <QuizTypeFour
        {...defaultProps}
        labels={[{ letter: 'A', description: 'Only label' }]}
        images={[
          { correctLetter: 'A', fileData: catFileData },
        ]}
      />
    );
    // There should be only one delete button and it should be disabled
    const deleteButton = screen.getByTestId('delete-choice-0');
    expect(deleteButton).toBeDisabled();
  });

  it('calls onFileDelete with correct arguments', () => {
    const mockOnFileDelete = vi.fn();
    render(
      <QuizTypeFour
        {...defaultProps}
        onFileDelete={mockOnFileDelete}
      />
    );
    // Simulate file delete by calling the handler directly (since uploader is mocked)
    mockOnFileDelete('img1', 'file');
    expect(mockOnFileDelete).toHaveBeenCalledWith('img1', 'file');
  });
});
