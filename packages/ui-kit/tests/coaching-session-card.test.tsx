import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  CoachingSessionCard,
  CoachingSessionCardProps,
} from '../lib/components/coaching-sessions/coaching-session-card';


const mockDate = new Date('2025-03-20T12:00:00');

const coachBase: Extract<
  CoachingSessionCardProps,
  { userType: 'coach'; status: 'ongoing' }
> = {
  locale: 'en',
  userType: 'coach',
  status: 'ongoing',
  title: 'Test Coaching Session',
  duration: 60,
  date: mockDate,
  startTime: '12:00 PM',
  endTime: '1:00 PM',
  /* coach-specific */
  studentName: 'John Doe',
  studentImageUrl: 'https://example.com/student.jpg',
  meetingLink: 'https://meet.example.com/abc',
  onClickStudent: vi.fn(),
  onClickJoinMeeting: vi.fn(),
};

const studentBase: Extract<
  CoachingSessionCardProps,
  { userType: 'student'; status: 'ongoing' }
> = {
  locale: 'en',
  userType: 'student',
  status: 'ongoing',
  title: 'Test Coaching Session',
  duration: 60,
  date: mockDate,
  startTime: '12:00 PM',
  endTime: '1:00 PM',
  /* student-specific */
  creatorName: 'Jane Smith',
  creatorImageUrl: 'https://example.com/creator.jpg',
  meetingLink: 'https://meet.example.com/abc',
  onClickCreator: vi.fn(),
  onClickJoinMeeting: vi.fn(),
};


describe('CoachingSessionCard', () => {
  it('renders CoachCoachingSessionCard for coach user type', () => {
    render(<CoachingSessionCard {...coachBase} />);
    expect(screen.getByText('Test Coaching Session')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders StudentCoachingSessionCard for student user type', () => {
    render(<CoachingSessionCard {...studentBase} />);
    expect(screen.getByText('Test Coaching Session')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('calls onClickJoinMeeting when Join Meeting button is clicked (coach)', () => {
    render(<CoachingSessionCard {...coachBase} />);
    fireEvent.click(screen.getByRole('button', { name: /join meeting/i }));
    expect(coachBase.onClickJoinMeeting).toHaveBeenCalled();
  });

  it('renders correct badge for upcoming-editable session', () => {
    const props: Extract<
      CoachingSessionCardProps,
      { userType: 'coach'; status: 'upcoming-editable' }
    > = {
      ...coachBase,
      status: 'upcoming-editable',
      hoursLeftToEdit: 24,
      onClickReschedule: vi.fn(),
      onClickCancel: vi.fn(),
    };

    render(<CoachingSessionCard {...props} />);
    expect(
      screen.getByText(/24 .*hour.*left.*cancel/i),
    ).toBeInTheDocument();
  });

  it('renders review and recording button for ended session (coach, session-review)', () => {
    const props: Extract<
      CoachingSessionCardProps,
      { userType: 'coach'; status: 'ended'; reviewType: 'session-review' }
    > = {
      ...coachBase,
      status: 'ended',
      reviewType: 'session-review',
      reviewText: 'Great session',
      rating: 4.5,
      onClickRateCallQuality: vi.fn(),
      onClickDownloadRecording: vi.fn(),
    };

    render(<CoachingSessionCard {...props} />);
    expect(screen.getByText(/Great session/i)).toBeInTheDocument();
    // Download recording button is currently commented out (TODO) in the component
  });

  it('handles rescheduled session actions (coach)', () => {
    const onClickAccept = vi.fn();
    const onClickDecline = vi.fn();

    const props: Extract<
      CoachingSessionCardProps,
      { userType: 'coach'; status: 'rescheduled' }
    > = {
      ...coachBase,
      status: 'rescheduled',
      previousDate: new Date('2025-03-18T12:00:00'),
      previousStartTime: '11:00 AM',
      previousEndTime: '12:00 PM',
      onClickAccept,
      onClickDecline,
      onClickSuggestAnotherDate: vi.fn(),
    };

    render(<CoachingSessionCard {...props} />);
    fireEvent.click(screen.getByRole('button', { name: /accept/i }));
    expect(onClickAccept).toHaveBeenCalled();

    fireEvent.click(screen.getByRole('button', { name: /decline/i }));
    expect(onClickDecline).toHaveBeenCalled();
  });
});
