import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CourseCard, CourseCardProps } from '../lib/components/course-card/course-card';

// Mock translations
const mockDictionary = {
  components: {
    courseCard: {
      publishedBadge: 'Live',
      draftBadge: 'Draft',
      editCourseButton: 'Edit Course',
      duplicateButton: 'Duplicate',
      manageButton: 'Manage',
      beginCourseButton: 'Begin Course',
      resumeCourseButton: 'Resume Course',
      reviewCourseButton: 'Review Course',
      viewDetailsButton: 'View Details',
      buyButton: 'Buy',
      fromButton: 'from',
      detailsCourseButton: 'Go to offer',
      cochingSession: 'coaching sessions',
      sales: 'sales',
      creatorText: 'by',
      you: 'You',
      createdBy: 'by'
    },
    coachBanner: {
      placeHolderText: 'Image not available'
    }
  }
};

vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => mockDictionary,
  TLocale: String
}));

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

  const baseCourse = {
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
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders CoachCourseCard for coach user type', async () => {
    render(
      <CourseCard
        userType="coach"
        course={baseCourse}
        reviewCount={120}
        locale={mockLocale}
        language={mockLanguage}
        sessions={24}
        sales={1850}
        groupName="React Group"
        onManage={mockOnManage}
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
        userType="visitor"
        course={baseCourse}
        reviewCount={120}
        locale={mockLocale}
        language={mockLanguage}
        sessions={24}
        sales={1850}
        onBuy={mockOnBuy}
        onDetails={mockOnDetails}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/React for Beginners/i)).toBeInTheDocument();
    });

    // Price button now links to details page (no direct buy from card)
    fireEvent.click(screen.getByText(/from/i));
    expect(mockOnDetails).toHaveBeenCalled();
  });

  it('renders CourseCreatorCard for course_creator user type', async () => {
    render(
      <CourseCard
        userType="course_creator"
        course={baseCourse}
        reviewCount={120}
        locale={mockLocale}
        language={mockLanguage}
        creatorStatus="live"
        sessions={24}
        sales={1850}
        onEdit={mockOnEdit}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/React for Beginners/i)).toBeInTheDocument();
    });

    expect(screen.getAllByLabelText('filled star')).toHaveLength(4);
  });

  it('renders StudentCourseCard for student user type', async () => {
    render(
      <CourseCard
        userType="student"
        course={baseCourse}
        reviewCount={120}
        locale={mockLocale}
        language={mockLanguage}
        sales={1850}
        progress={42}
        onResume={mockOnResume}
      />
    );

    await waitFor(() => {
      expect(screen.getByText(/React for Beginners/i)).toBeInTheDocument();
    });
  });

});