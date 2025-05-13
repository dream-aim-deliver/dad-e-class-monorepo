import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import { LessonNoteView } from '../lib/components/lesson-note/lesson-note-view';
import { TLocale } from '@maany_shr/e-class-translations';

// Mock dictionary for translations
const mockDictionary = {
  components: {
    lessonNotes: {
      lessonText: 'Lesson',
      viewLessonText: 'View Lesson',
    },
  },
};

// Mock getDictionary
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => mockDictionary,
}));

// Mock Button
vi.mock('../lib/components/button', () => ({
  Button: ({ text, onClick }: any) => (
    <button data-testid="view-lesson-btn" onClick={onClick}>
      {text}
    </button>
  ),
}));

describe('LessonNoteView Component', () => {
  const mockOnClick = vi.fn();
  const mockProps = {
    lessonNumber: 3,
    lessonTitle: 'Data Structures',
    lessonDescription: 'Learn about arrays, stacks, and queues.',
    onClickViewLesson: mockOnClick,
    locale: 'en' as TLocale,
  };

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  it('renders lesson number and title correctly', () => {
    render(<LessonNoteView {...mockProps} />);
    expect(
      screen.getByText(
        `${mockDictionary.components.lessonNotes.lessonText} ${mockProps.lessonNumber} - ${mockProps.lessonTitle}`
      )
    ).toBeInTheDocument();
  });

  it('renders lesson description', () => {
    render(<LessonNoteView {...mockProps} />);
    expect(screen.getByText(mockProps.lessonDescription)).toBeInTheDocument();
  });

  it('renders the "View Lesson" button with correct text', () => {
    render(<LessonNoteView {...mockProps} />);
    const button = screen.getByTestId('view-lesson-btn');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent(mockDictionary.components.lessonNotes.viewLessonText);
  });

  it('calls onClickViewLesson when the button is clicked', () => {
    render(<LessonNoteView {...mockProps} />);
    const button = screen.getByTestId('view-lesson-btn');
    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });
});
