import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { TLocale } from '@maany_shr/e-class-translations';
import { CourseElementType } from '../lib/components/course-builder/types';
import { fileMetadata } from '@maany_shr/e-class-models';
import QuizTypeTwo from '../lib/components/quiz/quiz-type-two/quiz-type-two';

vi.mock('../../drag-and-drop-uploader/uploader', () => ({
  Uploader: () => <div role="uploader-mock" />,
}));

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
  onUploadComplete: vi.fn(),
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
    expect(screen.getByDisplayValue(defaultProps.title)).toBeInTheDocument();
    expect(screen.getByDisplayValue(defaultProps.description)).toBeInTheDocument();
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
    fireEvent.change(screen.getByDisplayValue(defaultProps.title), {
      target: { value: 'New Matching Title' },
    });
    expect(mockOnChange).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'New Matching Title' })
    );

    fireEvent.change(screen.getByDisplayValue(defaultProps.description), {
      target: { value: 'New Matching Description' },
    });
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
          expect.objectContaining({ groupTitle: 'Country Group' }),
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
    fireEvent.click(radios[1]); // Germany
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
    fireEvent.click(screen.getAllByText('Add Choice')[0]);
    expect(screen.getAllByRole('textbox').length).toBe(8);
  });

  it('disables delete button when one option left in a group', () => {
    render(
      <QuizTypeTwo
        {...defaultProps}
        groups={[
          { groupTitle: 'Group 1', options: [{ optionText: 'Only Option', correct: true }] },
          { groupTitle: 'Group 2', options: [{ optionText: 'Another Only', correct: false }] },
        ]}
      />
    );
    expect(screen.getByTestId('delete-choice-0-0')).toBeDisabled();
    expect(screen.getByTestId('delete-choice-1-0')).toBeDisabled();
  });

  it('calls onFileDelete with correct arguments', () => {
    const mockOnFileDelete = vi.fn();
    render(<QuizTypeTwo {...defaultProps} onFileDelete={mockOnFileDelete} />);
    mockOnFileDelete('file-2', 0);
    expect(mockOnFileDelete).toHaveBeenCalledWith('file-2', 0);
  });
});
