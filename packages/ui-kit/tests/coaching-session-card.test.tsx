import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  CoachingSessionCard,
  CoachingSessionCardProps,
} from '../lib/components/coaching-sessions/coaching-session-card';

describe('CoachingSessionCard', () => {
  const mockDate = new Date('2025-03-20T12:00:00');

  // Helper function to create a mock CoachingSessionCard
  const baseProps: CoachingSessionCardProps = {
    locale: 'en',
    userType: 'coach',
    status: 'ongoing',
    title: 'Test Coaching Session',
    duration: 60,
    date: mockDate,
    startTime: '12:00 PM',
    endTime: '1:00 PM',
    studentName: 'John Doe',
    studentImageUrl: 'https://example.com/student.jpg',
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://example.com/creator.jpg',
    onClickJoinMeeting: vi.fn(),
  };

  it('renders CoachingSessionCardCoach for coach user type', () => {
    render(<CoachingSessionCard {...baseProps} />);
    expect(screen.getByText('Test Coaching Session')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders CoachingSessionCardStudent for student user type', () => {
    render(<CoachingSessionCard {...baseProps} userType="student" />);
    expect(screen.getByText('Test Coaching Session')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('calls onClickJoinMeeting when join meeting button is clicked', () => {
    render(<CoachingSessionCard {...baseProps} />);
    fireEvent.click(screen.getByText('Join Meeting'));
    expect(baseProps.onClickJoinMeeting).toHaveBeenCalled();
  });

  it('renders correct status for upcoming-editable session', () => {
    render(
      <CoachingSessionCard
        {...baseProps}
        status="upcoming-editable"
        hoursLeftToEdit={24}
      />,
    );
    expect(screen.getByText('24 hours left to edit event')).toBeInTheDocument();
  });

  it('renders correct components for ended session', () => {
    render(
      <CoachingSessionCard
        {...baseProps}
        status="ended"
        rating={4.5}
        reviewText="Great session"
      />,
    );
    expect(screen.getByText('"Great session"')).toBeInTheDocument();
    expect(screen.getByText('Download Recording')).toBeInTheDocument();
  });

  it('handles rescheduled session correctly', () => {
    const onClickAccept = vi.fn();
    const onClickDecline = vi.fn();
    render(
      <CoachingSessionCard
        {...baseProps}
        status="rescheduled"
        onClickAccept={onClickAccept}
        onClickDecline={onClickDecline}
      />,
    );
    fireEvent.click(screen.getByText('Accept'));
    expect(onClickAccept).toHaveBeenCalled();
    fireEvent.click(screen.getByText('Decline'));
    expect(onClickDecline).toHaveBeenCalled();
  });
});
