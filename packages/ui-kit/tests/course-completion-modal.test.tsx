import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CourseCompletionModal } from '../lib/components/course-completion-modal';

// Mock translations
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: (locale: string) => ({
    components: {
      courseCompletionModal: {
        courseCompletedText: 'Course Completed!',
        completedOnText: 'Completed on',
        downloadCertificateText: 'Download Certificate',
        rateTheCourseText: 'Rate the Course',
        atText: 'at',
      },
      coachBanner: {
        placeHolderText: 'No Image Available',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

// Mock icons and subcomponents
vi.mock('../lib/components/icon-button', () => ({
  IconButton: ({ icon, onClick, className, dataTestid }: any) => (
    <button
      data-testid={dataTestid || 'icon-button'}
      onClick={onClick}
      className={className}
    >
      {icon}
    </button>
  ),
}));
vi.mock('../lib/components/icons/icon-close', () => ({
  IconClose: () => <span data-testid="icon-close">Close</span>,
}));
vi.mock('../lib/components/button', () => ({
  Button: ({ text, onClick, className, disabled, iconLeft }: any) => (
    <button
      data-testid={`button-${text}`}
      onClick={onClick}
      className={className}
      disabled={disabled}
    >
      {iconLeft}
      {text}
    </button>
  ),
}));
vi.mock('../lib/components/icons/icon-certification', () => ({
  IconCertification: () => <span data-testid="icon-certification">Cert</span>,
}));
vi.mock('../lib/components/icons/icon-star', () => ({
  IconStar: () => <span data-testid="icon-star">Star</span>,
}));
vi.mock('../lib/components/icons/icon-success', () => ({
  IconSuccess: ({ classNames }: { classNames: string }) => (
    <span data-testid="icon-success" className={classNames}>Success</span>
  ),
}));
vi.mock('../lib/components/badge', () => ({
  Badge: ({ text }: any) => (
    <span data-testid="badge">{text}</span>
  ),
}));

describe('CourseCompletionModal', () => {
  const completionDate = new Date('2024-05-10T15:30:00Z').toISOString();
  const defaultProps = {
    courseImage: 'https://example.com/course.jpg',
    courseTitle: 'AI Fundamentals',
    completionDate,
    onClickDownloadCertificate: vi.fn(),
    onClickRateCourse: vi.fn(),
    onClose: vi.fn(),
    locale: 'en' as const,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders all main elements and course info', () => {
    render(<CourseCompletionModal {...defaultProps} />);
    // Success icon
    expect(screen.getByTestId('icon-success')).toBeInTheDocument();
    // Course completed text
    expect(screen.getByText('Course Completed!')).toBeInTheDocument();
    // Course image
    expect(screen.getByAltText('AI Fundamentals')).toBeInTheDocument();
    // Course title
    expect(screen.getByText('AI Fundamentals')).toBeInTheDocument();
    // Badge with date and time (dynamically generated)
    const expectedDate = new Date(completionDate).toLocaleDateString('en-CA');
    expect(screen.getByTestId('badge')).toHaveTextContent(
      new RegExp(`^Completed on ${expectedDate}`)
    );
    // Download Certificate button
    expect(screen.getByTestId('button-Download Certificate')).toBeInTheDocument();
    // Rate the Course button
    expect(screen.getByTestId('button-Rate the Course')).toBeInTheDocument();
    // Certification icon
    expect(screen.getByTestId('icon-certification')).toBeInTheDocument();
    // Star icon
    expect(screen.getByTestId('icon-star')).toBeInTheDocument();
    // Close icon
    expect(screen.getByTestId('icon-close')).toBeInTheDocument();
  });

  it('calls onClickDownloadCertificate when button is clicked', () => {
    render(<CourseCompletionModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('button-Download Certificate'));
    expect(defaultProps.onClickDownloadCertificate).toHaveBeenCalledTimes(1);
  });

  it('calls onClickRateCourse when button is clicked', () => {
    render(<CourseCompletionModal {...defaultProps} />);
    fireEvent.click(screen.getByTestId('button-Rate the Course'));
    expect(defaultProps.onClickRateCourse).toHaveBeenCalledTimes(1);
  });

  it('shows placeholder if image fails to load', () => {
    render(<CourseCompletionModal {...defaultProps} />);
    // Simulate image error
    const img = screen.getByAltText('AI Fundamentals') as HTMLImageElement;
    fireEvent.error(img);
    expect(screen.getByText('No Image Available')).toBeInTheDocument();
  });

  it('shows placeholder if courseImage is empty', () => {
    render(<CourseCompletionModal {...defaultProps} courseImage="" />);
    expect(screen.getByText('No Image Available')).toBeInTheDocument();
  });

  it('renders with different course title and date', () => {
    const newDate = new Date('2025-01-01T09:15:00Z').toLocaleDateString('en-CA');
    render(
      <CourseCompletionModal
        {...defaultProps}
        courseTitle="Deep Learning Mastery"
        completionDate={newDate}
      />
    );
    expect(screen.getByText('Deep Learning Mastery')).toBeInTheDocument();
    const expectedDate = newDate
    expect(screen.getByTestId('badge')).toHaveTextContent(
      new RegExp(`^Completed on ${expectedDate}`)
    );
  });

  it('renders localized text from dictionary', () => {
    render(<CourseCompletionModal {...defaultProps} />);
    expect(screen.getByText('Course Completed!')).toBeInTheDocument();
    expect(screen.getByText('Download Certificate')).toBeInTheDocument();
    expect(screen.getByText('Rate the Course')).toBeInTheDocument();
  });
});
