import { render, screen, fireEvent } from '@testing-library/react';
import { LessonCoachComponent } from '../lib/components/coaching-session-course-builder/lesson-coach-component';
import { vi } from 'vitest';
import { TLocale } from '@maany_shr/e-class-translations';

// Mock dictionary for translation
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
      coachingSessionCourseBuilder: {
        profileText: 'Profile',
        bookText: 'Book',
      },
    },
  }),
}));

const defaultProps = {
  name: 'Jane Smith',
  rating: 4.8,
  imageUrl: 'https://example.com/avatar.jpg',
  numberOfRatings: 42,
  description: 'Expert in leadership coaching.',
  defaultCoach: true,
  onClickProfile: vi.fn(),
  onClickBook: vi.fn(),
  locale: 'en' as TLocale,
};

describe('LessonCoachComponent', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders coach information correctly', () => {
    render(<LessonCoachComponent {...defaultProps} />);

    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(42)')).toBeInTheDocument();
    expect(screen.getByText('Expert in leadership coaching.')).toBeInTheDocument();
  });

  it('renders Profile and Book buttons with correct text', () => {
    render(<LessonCoachComponent {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Profile' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Book' })).toBeInTheDocument();
  });

  it('calls onClickProfile when Profile button is clicked', () => {
    render(<LessonCoachComponent {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Profile' }));
    expect(defaultProps.onClickProfile).toHaveBeenCalledTimes(1);
  });

  it('calls onClickBook when Book button is clicked', () => {
    render(<LessonCoachComponent {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: 'Book' }));
    expect(defaultProps.onClickBook).toHaveBeenCalledTimes(1);
  });

  it('renders the Book button as primary if defaultCoach is true', () => {
    render(<LessonCoachComponent {...defaultProps} defaultCoach={true} />);
    const bookButton = screen.getByRole('button', { name: 'Book' });
    expect(bookButton.className).toMatch(/primary/);
  });

  it('renders the Book button as secondary if defaultCoach is false', () => {
    render(<LessonCoachComponent {...defaultProps} defaultCoach={false} />);
    const bookButton = screen.getByRole('button', { name: 'Book' });
    expect(bookButton.className).toMatch(/secondary/);
  });

  it('renders rating stars component', () => {
    render(<LessonCoachComponent {...defaultProps} />);
    // Assuming StarRating renders elements with aria-label or similar
    expect(screen.getByText('4.8')).toBeInTheDocument();
    // Optionally check for star icons if accessible
    // expect(screen.getAllByTestId('star')).toHaveLength(5);
  });
});
