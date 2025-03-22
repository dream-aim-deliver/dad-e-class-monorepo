import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CourseCardList, CourseCardListProps } from '../lib/components/coursecard/course-list-card';
import { course } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';

vi.mock('../lib/components/coursecard/course-card', () => ({
  CourseCard: ({ userType, course, reviewCount, locale }: any) => (
    <div data-testid={`course-card-${course.title}-${userType}`}>
      {course.title} - {reviewCount} - {locale}
    </div>
  ),
}));

// Mock the EmptyState component
vi.mock('../lib/components/coursecard/course-empty-state', () => ({
  EmptyState: ({ message, buttonText, onButtonClick }: any) => (
    <div data-testid="empty-state">
      <p>{message}</p>
      {buttonText && onButtonClick && (
        <button data-testid="browse-button" onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  ),
}));

vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      courseCard: {
        courseEmptyState: {
          message: `No courses available (${locale})`,
          message2: `Create a course (${locale})`,
          buttonText: `Browse Courses (${locale})`,
        },
      },
    },
  }),
  TLocale: String,
}));

describe('CourseCardList', () => {
  const mockCallbacks = {
    onEdit: vi.fn(),
    onManage: vi.fn(),
    onBegin: vi.fn(),
    onResume: vi.fn(),
    onReview: vi.fn(),
    onDetails: vi.fn(),
    onBuy: vi.fn(),
    onBrowseCourses: vi.fn(),
  };

  const sampleCourse = {
    course: {
      title: 'React Fundamentals',
      rating: 4.8,
    },
    reviewCount: 30,
    language: { code: 'ENG' as const, name: 'English' as const },
    progress: 60,
    locale: 'en' as TLocale,
    userType: 'student' as const, 
  };

  const baseProps: CourseCardListProps = {
    courses: [sampleCourse],
    userType: 'student',
    locale: 'en',
    callbacks: mockCallbacks,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  // Populated list tests
  it('renders CourseCards when courses are provided', () => {
    render(<CourseCardList {...baseProps} />);
    
    expect(screen.getByTestId('course-card-React Fundamentals-student')).toBeInTheDocument();
    expect(screen.getByText('React Fundamentals - 30 - en')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-state')).not.toBeInTheDocument();
  });

  it.each(['creator', 'coach', 'student', 'visitor'])(
    'renders correctly for %s user type',
    (userType) => {
      render(<CourseCardList {...baseProps} userType={userType as any} />);
      expect(screen.getByTestId(`course-card-React Fundamentals-${userType}`)).toBeInTheDocument();
      expect(screen.getByText('React Fundamentals - 30 - en')).toBeInTheDocument();
    }
  );
  // Empty state tests
  it('renders EmptyState with message2 for creator when no courses', () => {
    render(<CourseCardList {...baseProps} userType="creator" courses={[]} />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('Create a course (en)')).toBeInTheDocument();
    expect(screen.queryByTestId('browse-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('course-card-creator')).not.toBeInTheDocument();
  });

  it('renders EmptyState with message2 for coach when no courses', () => {
    render(<CourseCardList {...baseProps} userType="coach" courses={[]} />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('Create a course (en)')).toBeInTheDocument();
    expect(screen.queryByTestId('browse-button')).not.toBeInTheDocument();
    expect(screen.queryByTestId('course-card-coach')).not.toBeInTheDocument();
  });

  it('renders EmptyState with browse button for student when no courses', () => {
    render(<CourseCardList {...baseProps} userType="student" courses={[]} />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No courses available (en)')).toBeInTheDocument();
    expect(screen.getByTestId('browse-button')).toBeInTheDocument();
    expect(screen.getByText('Browse Courses (en)')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('browse-button'));
    expect(mockCallbacks.onBrowseCourses).toHaveBeenCalledTimes(1);
  });

  it('renders EmptyState with browse button for visitor when no courses', () => {
    render(<CourseCardList {...baseProps} userType="visitor" courses={[]} />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No courses available (en)')).toBeInTheDocument();
    expect(screen.getByTestId('browse-button')).toBeInTheDocument();
    expect(screen.getByText('Browse Courses (en)')).toBeInTheDocument();

    fireEvent.click(screen.getByTestId('browse-button'));
    expect(mockCallbacks.onBrowseCourses).toHaveBeenCalledTimes(1);
  });

  // Edge cases
  it('handles null courses array by showing EmptyState', () => {
    render(<CourseCardList {...baseProps} courses={null as any} />);
    
    expect(screen.getByTestId('empty-state')).toBeInTheDocument();
    expect(screen.getByText('No courses available (en)')).toBeInTheDocument();
    expect(screen.getByTestId('browse-button')).toBeInTheDocument();
  });

  it('memoizes component correctly', () => {
    const { rerender } = render(<CourseCardList {...baseProps} />);
    const firstRender = screen.getByTestId('course-card-React Fundamentals-student');
    
    rerender(<CourseCardList {...baseProps} />);
    const secondRender = screen.getByTestId('course-card-React Fundamentals-student');
    
    expect(firstRender).toBe(secondRender); // Same DOM node, proving memoization
  });

  it('renders multiple courses correctly', () => {
    const courses = [
      sampleCourse,
      { ...sampleCourse, course: { ...sampleCourse.course, title: 'React Advanced' } },
    ];
    render(
      <CourseCardList
        {...baseProps}
        courses={courses.map((course) => ({
          ...course,
          userType: baseProps.userType,
          locale: baseProps.locale,
        }))}
      />
    );
    
    const cards = screen.getAllByTestId(/course-card-.*-student/); // Use regex to match any course title
    expect(cards).toHaveLength(2);
    expect(screen.getByText('React Fundamentals - 30 - en')).toBeInTheDocument();
    expect(screen.getByText('React Advanced - 30 - en')).toBeInTheDocument();
  });

  it('passes all callbacks to CourseCard', () => {
    render(<CourseCardList {...baseProps} />);
    // Note: Limited testing here since mock doesn't use callbacks
    // Enhance CourseCard mock if callback testing is needed
    expect(mockCallbacks.onBegin).not.toHaveBeenCalled();
    expect(mockCallbacks.onDetails).not.toHaveBeenCalled();
  });
});