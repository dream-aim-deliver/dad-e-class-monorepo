import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { LessonNoteBuilderView } from '../lib/components/lesson-note/lesson-note-builder-view';
import { TLocale } from '@maany_shr/e-class-translations';
import { CourseElementType } from '../lib/components/course-builder/types';

// Mock dictionary for translations
const mockDictionary = {
  components: {
    lessonNotes: {
      lessonNotesText: 'Lesson Notes',
      saveNotesText: 'Save Notes',
      notesNotSavedText: 'You have unsaved notes!',
    },
  },
};

const mockOnDeserializationError = vi.fn((message: string, error: Error): void => {
  // This is empty on purpose, don't remove this comment or ESLint will complain
});


// Mock getDictionary
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => mockDictionary,
}));

// Mock IconNotes and IconSave to avoid SVG issues in tests
vi.mock('../lib/components/icons/icon-notes', () => ({
  IconNotes: (props: any) => <span data-testid="icon-notes" {...props} />,
}));
vi.mock('../lib/components/icons/icon-save', () => ({
  IconSave: (props: any) => <span data-testid="icon-save" {...props} />,
}));

// Mock Banner - differentiate by style
vi.mock('../lib/components/banner', () => ({
  default: ({ title, style }: { title: string; style?: string }) => (
    <div data-testid={style === 'success' ? 'banner-success' : 'banner'}>{title}</div>
  ),
}));

// Mock RichTextEditor
const mockOnChange = vi.fn(() => true);
vi.mock('../lib/components/rich-text-element/editor', () => ({
  __esModule: true,
  default: ({ initialValue, placeholder, onChange, onLoseFocus, name, locale }: any) => (
    <textarea
      data-testid="rich-text-editor"
      defaultValue={initialValue}
      placeholder={placeholder}
      onBlur={e => onLoseFocus(e.target.value)}
      onChange={e => onChange(e.target.value)}
    />
  ),
}));

describe('LessonNoteBuilderView Component', () => {
  const mockProps = {
    type: CourseElementType.LessonNote as CourseElementType.LessonNote,
    id: 1,
    order: 1,
    initialValue: 'Initial lesson note',
    onChange: mockOnChange,
    placeholder: 'Write your lesson notes here...',
    locale: 'en' as TLocale,
    children: undefined,
    onDeserializationError: mockOnDeserializationError,
  };

  beforeEach(() => {
    mockOnChange.mockClear();
  });

  it('renders title and save icon correctly', () => {
    render(<LessonNoteBuilderView {...mockProps} />);
    expect(screen.getByText(mockDictionary.components.lessonNotes.lessonNotesText)).toBeInTheDocument();
    expect(screen.getByTestId('icon-notes')).toBeInTheDocument();
    expect(screen.getByTestId('icon-save')).toBeInTheDocument();
  });

  it('renders the rich text editor with initial value and placeholder', () => {
    render(<LessonNoteBuilderView {...mockProps} />);
    const editor = screen.getByTestId('rich-text-editor') as HTMLTextAreaElement;
    expect(editor.value).toBe(mockProps.initialValue);
    expect(editor.placeholder).toBe(mockProps.placeholder);
  });

  it('calls onChange when save icon is clicked', () => {
    render(<LessonNoteBuilderView {...mockProps} />);
    const saveButton = screen.getByTestId('icon-save').parentElement!;
    fireEvent.click(saveButton);
    expect(mockOnChange).toHaveBeenCalledWith(mockProps.initialValue);
  });

  it('shows unsaved notes banner when notes are edited and not saved', () => {
    render(<LessonNoteBuilderView {...mockProps} />);
    const editor = screen.getByTestId('rich-text-editor') as HTMLTextAreaElement;
    fireEvent.change(editor, { target: { value: 'Changed note' } });
    expect(screen.getByTestId('banner')).toHaveTextContent(
      mockDictionary.components.lessonNotes.notesNotSavedText
    );
  });

  it('removes unsaved notes banner after saving', () => {
    render(<LessonNoteBuilderView {...mockProps} />);
    const editor = screen.getByTestId('rich-text-editor') as HTMLTextAreaElement;
    fireEvent.change(editor, { target: { value: 'Changed note' } });
    // Banner should appear
    expect(screen.getByTestId('banner')).toBeInTheDocument();
    // Click save
    const saveButton = screen.getByTestId('icon-save').parentElement!;
    fireEvent.click(saveButton);
    // Banner should disappear
    expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
  });

  it('calls onChange with new value when editor loses focus', () => {
    render(<LessonNoteBuilderView {...mockProps} />);
    const editor = screen.getByTestId('rich-text-editor') as HTMLTextAreaElement;
    fireEvent.change(editor, { target: { value: 'Blur note' } });
    fireEvent.blur(editor);
    expect(mockOnChange).toHaveBeenCalledWith('Blur note');
  });

  it('renders children if provided and hides unsaved notes banner', () => {
    render(
      <LessonNoteBuilderView {...mockProps}>
        <div data-testid="custom-child">Custom Child</div>
      </LessonNoteBuilderView>
    );
    expect(screen.getByTestId('custom-child')).toBeInTheDocument();
    // Even after editing, banner should not show if children are present
    const editor = screen.getByTestId('rich-text-editor') as HTMLTextAreaElement;
    fireEvent.change(editor, { target: { value: 'Changed note' } });
    expect(screen.queryByTestId('banner')).not.toBeInTheDocument();
  });
});
