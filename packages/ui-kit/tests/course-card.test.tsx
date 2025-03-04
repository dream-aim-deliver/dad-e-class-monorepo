import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CourseCard, { CourseCardProps } from '../lib/components/coursecard/course-card';

const mockLocale = 'en';
const mockLanguage = { code: 'ENG', name: 'English' };

describe('CourseCard', () => {
  const mockOnEdit = vi.fn();
  const mockOnManage = vi.fn();
  const mockOnBegin = vi.fn();
  const mockOnResume = vi.fn();
  const mockOnReview = vi.fn();
  const mockOnDetails = vi.fn();

  const baseProps: Omit<CourseCardProps, 'userType'> = {
    title: 'React for Beginners',
    imageUrl: 'https://example.com/course-image.jpg',
    rating: 4.5,
    reviewCount: 120,
    locale: mockLocale,
    language: mockLanguage as { code?: "ENG"; name?: "English"; } | { code?: "DEU"; name?: "German"; },
    onEdit: mockOnEdit,
    onManage: mockOnManage,
    onBegin: mockOnBegin,
    onResume: mockOnResume,
    onReview: mockOnReview,
    onDetails: mockOnDetails,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CoachCourseCard for coach user type', () => {
    render(
      <CourseCard
        {...baseProps}
        userType="coach"
        creatorName="John Doe"
        groupName="React Group"
        sessions={8}
        duration={{ video: 120, coaching: 60, selfStudy: 30 }}
      />
    );

    expect(screen.getByText(/React for Beginners/i)).toBeInTheDocument();
    expect(screen.getByText(/John Doe/i)).toBeInTheDocument();
    expect(screen.getByText(/React Group/i)).toBeInTheDocument();
    expect(screen.getByText(/4.5/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/manage/i));
    expect(mockOnManage).toHaveBeenCalled();
  });

  it('renders VisitorCourseCard for visitor user type', () => {
    render(
      <CourseCard
        {...baseProps}
        userType="visitor"
        creatorName="Jane Smith"
        groupName="Frontend Devs"
        sessions={5}
        duration={{ video: 90, coaching: 30, selfStudy: 20 }}
      />
    );

    expect(screen.getByText(/React for Beginners/i)).toBeInTheDocument();
    expect(screen.getByText(/Jane Smith/i)).toBeInTheDocument();
    expect(screen.getByText(/Frontend Devs/i)).toBeInTheDocument();

    fireEvent.click(screen.getByText(/manage/i));
    expect(mockOnManage).toHaveBeenCalled();
  });

  it('logs an error if required props are missing for creator user type', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    render(<CourseCard {...baseProps} userType="creator" />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Course and creatorStatus are required for creator view'
    );

    consoleErrorSpy.mockRestore();
  });

  it('logs an error if required props are missing for student user type', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => { });

    render(<CourseCard {...baseProps} userType="student" />);

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      'Course is required for student view'
    );

    consoleErrorSpy.mockRestore();
  });
});