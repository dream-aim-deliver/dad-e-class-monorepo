import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { LessonHeader } from '../lib/components/lesson-header';
import { TLocale } from '@maany_shr/e-class-translations';

// Mock dictionary for translations
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
      lessonHeader: {
        moduleText: 'Module',
        showNotesText: 'Show Notes (Alt/Ctrl + N)',
        hideNotesText: 'Hide Notes (Alt/Ctrl + N)',
      },
      modulePagination: {
        previous: 'Previous',
        next: 'Next',
        lesson: 'Lesson',
      },
    },
  }),
  isLocalAware: {},
}));


describe('<LessonHeader />', () => {
  const defaultProps = {
    currentModule: 1,
    totalModules: 3,
    moduleTitle: 'Test Module',
    currentLesson: 2,
    totalLessons: 5,
    lessonTitle: 'Test Lesson',
    showNotes: false,
    className: '',
    onClickPrevious: vi.fn(),
    onClickNext: vi.fn(),
    onClick: vi.fn(),
    locale: 'en' as TLocale,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders module and lesson titles', () => {
    render(<LessonHeader {...defaultProps} />);
    expect(screen.getByText('Module 1 / 3 Test Module')).toBeInTheDocument();
    expect(screen.getByText('Test Lesson')).toBeInTheDocument();
  });

  it('renders the correct lesson and module numbers', () => {
    render(<LessonHeader {...defaultProps} />);
    expect(screen.getByText('Module 1 / 3 Test Module')).toBeInTheDocument();
    expect(screen.getByText('Lesson 2 / 5')).toBeInTheDocument();
  });

  it('renders the Show Notes button when notes are hidden', () => {
    render(<LessonHeader {...defaultProps} showNotes={false} />);
    expect(
      screen.getByText(/Hide Notes \(Alt\/Ctrl \+ N\)/)
    ).toBeInTheDocument();
  });

  it('renders the Hide Notes button when notes are visible', () => {
    render(<LessonHeader {...defaultProps} showNotes={true} />);
    expect(
      screen.getByText(/Show Notes \(Alt\/Ctrl \+ N\)/)
    ).toBeInTheDocument();
  });

  it('calls onClickPrevious when Previous is clicked', () => {
    render(<LessonHeader {...defaultProps} />);
    const previousButton = screen.getByText('Previous');
    fireEvent.click(previousButton);
    expect(defaultProps.onClickPrevious).toHaveBeenCalledTimes(1);
  });

  it('calls onClickNext when Next is clicked', () => {
    render(<LessonHeader {...defaultProps} />);
    const nextButton = screen.getByText('Next');
    fireEvent.click(nextButton);
    expect(defaultProps.onClickNext).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Alt+N is pressed', () => {
    render(<LessonHeader {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'n', altKey: true });
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Ctrl+N is pressed', () => {
    render(<LessonHeader {...defaultProps} />);
    fireEvent.keyDown(document, { key: 'N', ctrlKey: true });
    expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
  });
});
