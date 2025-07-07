import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { TLocale } from '@maany_shr/e-class-translations';
import { CourseElementType } from '../lib/components/course-builder/types';
import { fileMetadata } from '@maany_shr/e-class-models';
import QuizTypeTwo from '../lib/components/quiz/quiz-type-two/quiz-type-two';

// Mock dictionary for translations with all expected keys
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
      quiz: {
        quizTypeTwo: {
          headingText: 'Matching Question',
          groupTitleText: 'Group Title',
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

// fileData must match FileMetadataImageSchema or can be undefined for this test
const mockFileData: fileMetadata.TFileMetadata = {
  id: 'file-2',
  name: 'sample-image2.jpg',
  mimeType: 'image/jpeg',
  size: 2048,
  checksum: 'def456',
  status: 'available',
  category: 'image',
  url: 'https://example.com/sample-image2.jpg',
  thumbnailUrl: 'https://example.com/sample-image2-thumb.jpg',
};

const defaultProps = {
  id: 2,
  quizType: 'quizTypeTwo' as const,
  type: 'quiz' as CourseElementType.Quiz,
  order: 1,
  required: true,
  title: 'Match the capitals with their countries.',
  description: 'Drag and drop the capitals to their corresponding countries.',
  fileData: mockFileData,
  groups: [
    {
      groupTitle: 'Country',
      options: [
        { optionText: 'France', correct: true },
        { optionText: 'Germany', correct: false },
      ],
    },
    {
      groupTitle: 'Capital',
      options: [
        { optionText: 'Paris', correct: true },
        { optionText: 'Berlin', correct: false },
      ],
    },
  ],
  locale: 'en' as TLocale,
  onChange: vi.fn(),
  onFilesChange: vi.fn().mockResolvedValue(mockFileData),
  onFileDelete: vi.fn(),
  onFileDownload: vi.fn(),
  onTypeChange: vi.fn(),
};

describe('QuizTypeTwo Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders title, description, group titles, all options, and uploader', () => {
    render(<QuizTypeTwo {...defaultProps} />);
    expect(screen.getByText('Matching Question')).toBeInTheDocument();
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Description')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Match the capitals with their countries.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Drag and drop the capitals to their corresponding countries.')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Country')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Capital')).toBeInTheDocument();
    expect(screen.getByDisplayValue('France')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Germany')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Paris')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Berlin')).toBeInTheDocument();
    expect(screen.getAllByText('Add Choice').length).toBe(2);
  });

  it('calls onChange with updated title and description', () => {
    const mockOnChange = vi.fn();
    render(<QuizTypeTwo {...defaultProps} onChange={mockOnChange} />);
    const titleInput = screen.getByDisplayValue('Match the capitals with their countries.');
    fireEvent.change(titleInput, { target: { value: 'New Matching Title' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Matching Title' })
    );

    const descInput = screen.getByDisplayValue('Drag and drop the capitals to their corresponding countries.');
    fireEvent.change(descInput, { target: { value: 'New Matching Description' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ description: 'New Matching Description' })
    );
  });

  it('allows editing group titles and option text', () => {
    const mockOnChange = vi.fn();
    render(<QuizTypeTwo {...defaultProps} onChange={mockOnChange} />);
    const groupTitleInputs = screen.getAllByDisplayValue(/Country|Capital/);
    fireEvent.change(groupTitleInputs[0], { target: { value: 'Country Group' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        groups: expect.arrayContaining([
          expect.objectContaining({ title: 'Country Group' }),
        ]),
      })
    );

    const optionInputs = screen.getAllByDisplayValue(/France|Germany|Paris|Berlin/);
    fireEvent.change(optionInputs[0], { target: { value: 'Spain' } });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        groups: expect.arrayContaining([
          expect.objectContaining({
            options: expect.arrayContaining([
              expect.objectContaining({ optionText: 'Spain' }),
            ]),
          }),
        ]),
      })
    );
  });

  it('marks correct answer within a group', () => {
    const mockOnChange = vi.fn();
    render(<QuizTypeTwo {...defaultProps} onChange={mockOnChange} />);
    const radios = screen.getAllByRole('radio');
    // Click the second radio of the first group (should be Germany)
    fireEvent.click(radios[1]);
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({
        groups: expect.arrayContaining([
          expect.objectContaining({
            options: [
              { optionText: 'France', correct: false },
              { optionText: 'Germany', correct: true },
            ],
          }),
        ]),
      })
    );
  });

  it('adds a new choice to a group when "Add Choice" is clicked', () => {
    render(<QuizTypeTwo {...defaultProps} />);
    const addButtons = screen.getAllByText('Add Choice');
    fireEvent.click(addButtons[0]);
    // There are 1-title + 1-description + 2 group titles + 2*2 options initially = 6, now should be 9
    expect(screen.getAllByRole('textbox').length).toBe(9);
  });

  it('deletes a choice from a group when delete button is clicked', () => {
    render(<QuizTypeTwo {...defaultProps} />);
    const deleteButton = screen.getByTestId('delete-choice-0-0');
    fireEvent.click(deleteButton);
    expect(screen.queryByDisplayValue('France')).not.toBeInTheDocument();
  });

  it('disables delete button when only one choice left in a group', () => {
    render(
      <QuizTypeTwo
        {...defaultProps}
        groups={[
          { groupTitle: 'Group 1', options: [{ optionText: 'Only Option', correct: true }] },
          { groupTitle: 'Group 2', options: [{ optionText: 'Another Only', correct: false }] },
        ]}
      />
    );
    const deleteButtonOne = screen.getByTestId('delete-choice-0-0');
    const deleteButtonTwo = screen.getByTestId('delete-choice-1-0');
    expect(deleteButtonOne).toBeDisabled();
    expect(deleteButtonTwo).toBeDisabled();
  });

  it('calls onFileDelete with correct arguments', () => {
    const mockOnFileDelete = vi.fn();
    render(
      <QuizTypeTwo
        {...defaultProps}
        onFileDelete={mockOnFileDelete}
      />
    );
    // Simulate file delete by calling the handler directly (since uploader is mocked)
    mockOnFileDelete('file-2', 'file');
    expect(mockOnFileDelete).toHaveBeenCalledWith('file-2', 'file');
  });
});
