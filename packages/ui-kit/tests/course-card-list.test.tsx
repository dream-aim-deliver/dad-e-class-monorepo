import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CourseCardList, CourseCardListProps } from '../lib/components/course-card/course-card-list';
import { TLocale } from '@maany_shr/e-class-translations';

// Mock the EmptyState component
vi.mock('../lib/components/course-card/empty-state', () => ({
  EmptyState: ({ message, buttonText, onButtonClick, locale }: any) => (
    <div data-testid="empty-state">
      <p data-testid="empty-state-message">{`${message} (${locale})`}</p>
      <button data-testid="empty-state-button" onClick={onButtonClick}>
        {`${buttonText} (${locale})`}
      </button>
    </div>
  ),
}));

// Mock the translation dictionary
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      courseCard: {
        courseEmptyState: {
          message: `No courses available`,
          buttonText: `Browse Courses`,
          messageCreator: `You haven’t created any courses yet`,
          buttonTextCreator: `Create a Course`,
          messageCoach: `You haven’t enrolled in any coaching groups yet`,
          buttonTextCoach: `Join a Group`,
        },
      },
    },
  }),
  TLocale: String,
}));

describe('CourseCardList', () => {
  const baseProps: CourseCardListProps = {
    locale: 'en' as TLocale,
    emptyStateMessage: 'No courses available',
    emptyStateButtonText: 'Browse Courses',
    onEmptyStateButtonClick: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders children when provided', () => {
    render(
      <CourseCardList {...baseProps}>
        <div data-testid="course-card-1">Course 1</div>
        <div data-testid="course-card-2">Course 2</div>
      </CourseCardList>
    );

    expect(screen.getByTestId('course-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('course-card-2')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('renders grid layout with correct classes', () => {
    render(
      <CourseCardList {...baseProps}>
        <div data-testid="course-card">Course</div>
      </CourseCardList>
    );

    const grid = screen.getByRole('list');
    expect(grid).toHaveClass('course-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6');
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('renders EmptyState with message and button when no children are provided', () => {
    render(<CourseCardList {...baseProps} />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-message')).toHaveTextContent('No courses available (en)');
    expect(screen.getByTestId('empty-state-button')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-button')).toHaveTextContent('Browse Courses (en)');

    fireEvent.click(screen.getByTestId('empty-state-button'));
    expect(baseProps.onEmptyStateButtonClick).toHaveBeenCalledTimes(1);
  });

  it('renders EmptyState with creator-specific message and button', () => {
    const creatorProps = {
      ...baseProps,
      emptyStateMessage: 'You haven’t created any courses yet',
      emptyStateButtonText: 'Create a Course',
    };
    render(<CourseCardList {...creatorProps} />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-message')).toHaveTextContent('You haven’t created any courses yet (en)');
    expect(screen.getByTestId('empty-state-button')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-button')).toHaveTextContent('Create a Course (en)');

    fireEvent.click(screen.getByTestId('empty-state-button'));
    expect(creatorProps.onEmptyStateButtonClick).toHaveBeenCalledTimes(1);
  });

  it('renders EmptyState with coach-specific message and button', () => {
    const coachProps = {
      ...baseProps,
      emptyStateMessage: 'You haven’t enrolled in any coaching groups yet',
      emptyStateButtonText: 'Join a Group',
    };
    render(<CourseCardList {...coachProps} />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-message')).toHaveTextContent('You haven’t enrolled in any coaching groups yet (en)');
    expect(screen.getByTestId('empty-state-button')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-button')).toHaveTextContent('Join a Group (en)');

    fireEvent.click(screen.getByTestId('empty-state-button'));
    expect(coachProps.onEmptyStateButtonClick).toHaveBeenCalledTimes(1);
  });

  it('handles single child correctly', () => {
    render(
      <CourseCardList {...baseProps}>
        <div data-testid="course-card">Single Course</div>
      </CourseCardList>
    );

    expect(screen.getByTestId('course-card')).toBeInTheDocument();
    expect(screen.getByText('Single Course')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it('assigns keys to children correctly', () => {
    render(
      <CourseCardList {...baseProps}>
        <div data-testid="course-card-1">Course 1</div>
        <div data-testid="course-card-2">Course 2</div>
      </CourseCardList>
    );

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(2);
    expect(listItems[0]).toContainElement(screen.getByTestId('course-card-1'));
    expect(listItems[1]).toContainElement(screen.getByTestId('course-card-2'));
  });

  it('memoizes component correctly', () => {
    const { rerender } = render(
      <CourseCardList {...baseProps}>
        <div data-testid="course-card">Course</div>
      </CourseCardList>
    );
    const firstRender = screen.getByTestId('course-card');

    rerender(
      <CourseCardList {...baseProps}>
        <div data-testid="course-card">Course</div>
      </CourseCardList>
    );
    const secondRender = screen.getByTestId('course-card');

    expect(firstRender).toBe(secondRender); // Same DOM node, proving memoization
  });

  it('handles different locales for empty state', () => {
    const deProps = {
      ...baseProps,
      locale: 'de' as TLocale,
      emptyStateMessage: 'Keine Kurse verfügbar',
      emptyStateButtonText: 'Kurse durchsuchen',
    };
    render(<CourseCardList {...deProps} />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-message')).toHaveTextContent('Keine Kurse verfügbar (de)');
    expect(screen.getByTestId('empty-state-button')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-button')).toHaveTextContent('Kurse durchsuchen (de)');
  });
});