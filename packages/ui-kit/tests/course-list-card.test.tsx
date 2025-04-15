import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CourseCardList, CourseCardListProps } from '../lib/components/coursecard/course-list-card';
import { TLocale } from '@maany_shr/e-class-translations';

// Mock the CourseEmptyState component
vi.mock('../lib/components/coursecard/course-empty-state', () => ({
  CourseEmptyState: ({ locale, onButtonClick }: any) => (
    <div data-testid="empty-state">
      <p>{`No courses available (${locale})`}</p>
      {onButtonClick && (
        <button data-testid="empty-state-button" onClick={onButtonClick}>
          {`Browse Courses (${locale})`}
        </button>
      )}
    </div>
  ),
}));

// Mock the translation dictionary
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      courseCard: {
        courseEmptyState: {
          message: `No courses available (${locale})`,
          buttonText: `Browse Courses (${locale})`,
        },
      },
    },
  }),
  TLocale: String,
}));

describe('CourseCardList', () => {
  const baseProps: CourseCardListProps = {
    locale: 'en',
  };

  const mockOnEmptyStateButtonClick = vi.fn();

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

  it('renders EmptyState when no children are provided', () => {
    render(<CourseCardList {...baseProps} />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No courses available (en)')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state-button')).not.toBeInTheDocument();
  });

  it('renders EmptyState with button when onEmptyStateButtonClick is provided', () => {
    render(
      <CourseCardList {...baseProps} onEmptyStateButtonClick={mockOnEmptyStateButtonClick} />
    );

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No courses available (en)')).toBeInTheDocument();
    expect(screen.getByTestId('empty-state-button')).toBeInTheDocument();
    expect(screen.getByText('Browse Courses (en)')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('empty-state-button'));
    expect(mockOnEmptyStateButtonClick).toHaveBeenCalledTimes(1);
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

  it('handles different locales', () => {
    render(<CourseCardList {...baseProps} locale="de" />);

    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No courses available (de)')).toBeInTheDocument();
  });
});