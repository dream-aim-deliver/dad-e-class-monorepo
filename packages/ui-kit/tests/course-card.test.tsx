import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CourseCard, CourseCardProps } from '../lib/components/course-card/course-card';

// Define mock data with specific literal types to match CourseCardProps
const mockLocale = 'en';
const mockLanguage = { code: 'ENG' as const, name: 'English' as const };
const mockAuthor = { name: 'John Doe', image: 'https://example.com/author-image.jpg' };

describe('CourseCard', () => {
  const mockOnEdit = vi.fn();
  const mockOnManage = vi.fn();
  const mockOnBegin = vi.fn();
  const mockOnResume = vi.fn();
  const mockOnReview = vi.fn();
  const mockOnDetails = vi.fn();
  const mockOnBuy = vi.fn();
  const mockOnBrowseCourses = vi.fn();

  const baseProps: Omit<CourseCardProps, 'userType'> = {
    course: {
      title: 'React for Beginners',
      duration: {
        video: 60,
        coaching: 30,
        selfStudy: 45,
      },
      author: mockAuthor,
      imageUrl: 'https://example.com/course-image.jpg',
      rating: 4.5,
      pricing: {
        fullPrice: 99.99,
        partialPrice: 79.99,
        currency: 'USD'
      },
      language: mockLanguage
    },
    reviewCount: 120,
    locale: mockLocale,
    language: mockLanguage,
    onEdit: mockOnEdit,
    onManage: mockOnManage,
    onBegin: mockOnBegin,
    onResume: mockOnResume,
    onReview: mockOnReview,
    onDetails: mockOnDetails,
    onBuy: mockOnBuy,
    onBrowseCourses: mockOnBrowseCourses,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CoachCourseCard for coach user type', async () => {
    render(
      <CourseCard
        {...baseProps}
        userType="coach"
        groupName="React Group"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/React for Beginners/i)).toBeInTheDocument();
      expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
      expect(screen.getByText(/React Group/i)).toBeInTheDocument();
    });

    expect(screen.getAllByLabelText('filled star')).toHaveLength(4);

    fireEvent.click(screen.getByText(/manage/i));
    expect(mockOnManage).toHaveBeenCalled();
  });

  it('renders VisitorCourseCard for visitor user type', async () => {
    render(
      <CourseCard
        {...baseProps}
        userType="visitor"
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/React for Beginners/i)).toBeInTheDocument();
      // Don't check for creator name or group name since they're not being passed
      // to VisitorCourseCard in the component implementation
    });

    // Check for Buy button instead of Manage button for visitor card
    fireEvent.click(screen.getByText(/buy/i));
    expect(mockOnBuy).toHaveBeenCalled();
  });

  it('logs an error if required props are missing for creator user type', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');
    render(<CourseCard userType="creator" locale={mockLocale} language={mockLanguage} reviewCount={120} />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Course and creatorStatus are required for creator view'
    );
    consoleErrorSpy.mockRestore();
  });

  it('logs an error if required props are missing for student user type', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error');

    // Create a modified version of baseProps without course to trigger the error
    const { course, ...propsWithoutCourse } = baseProps;

    render(<CourseCard {...propsWithoutCourse} userType="student" />);
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Course is required for student view'
    );
    consoleErrorSpy.mockRestore();
  });

});