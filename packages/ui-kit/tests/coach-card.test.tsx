import { fireEvent, render, screen } from '@testing-library/react';
import CoachCard from '../lib/components/coach/coach-card';
import { vi } from 'vitest';

const mockDictionary = {
  components: {
    coachCard: {
      coachingSession: 'session',
      teaches: 'Teaches',
      viewProfile: 'View Profile',
      bookSession: 'Book Session'
    }
  }
};

vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => mockDictionary
}));

const mockCoachDetails = {
  coachName: 'Jane Doe',
  coachImage: '',
  languages: ['English', 'French'],
  sessionCount: 10,
  skills: ['React', 'Node.js', 'GraphQL'],
  description: 'Experienced coach in full-stack development.',
  courses: [
    { image: '', title: 'React Basics' },
    { image: '', title: 'Advanced Node.js' }
  ],
  rating: 4.8,
  totalRatings: 100
};

describe('CoachCard Component', () => {
  it('renders coach details correctly', () => {
    render(<CoachCard cardDetails={mockCoachDetails} locale="en" />);

    expect(screen.getByText('Jane Doe')).toBeInTheDocument();
    expect(screen.getByText('4.8')).toBeInTheDocument();
    expect(screen.getByText('(100)')).toBeInTheDocument();
    expect(screen.getByText('React')).toBeInTheDocument();
    expect(screen.getByText('10 sessions')).toBeInTheDocument();
    expect(screen.getByText('Experienced coach in full-stack development.')).toBeInTheDocument();
    expect(screen.getByText('Teaches:')).toBeInTheDocument();
  });

  it('renders buttons correctly and triggers click events', () => {
    const mockViewProfile = vi.fn();
    const mockBookSession = vi.fn();

    render(
      <CoachCard
        cardDetails={mockCoachDetails}
        locale="en"
        onClickViewProfile={mockViewProfile}
        onClickBookSession={mockBookSession}
      />
    );

    const viewProfileButton = screen.getByText('View Profile');
    const bookSessionButton = screen.getByText('Book Session');

    expect(viewProfileButton).toBeInTheDocument();
    expect(bookSessionButton).toBeInTheDocument();

    fireEvent.click(viewProfileButton);
    expect(mockViewProfile).toHaveBeenCalledTimes(1); // ✅ Now it works!

    fireEvent.click(bookSessionButton);
    expect(mockBookSession).toHaveBeenCalledTimes(1); // ✅ Now it works!
  });
});
