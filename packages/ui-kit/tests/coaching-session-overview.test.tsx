import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CoachingSessionOverview } from '../lib/components/coaching-sessions/coaching-session-overview'; // Adjust path as needed

// Mock the dependencies
vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
      coachingSession: {
        readMore: 'Read More',
        createdBy: 'Created by',
        student: 'Student',
        course: 'Course',
        group: 'Group',
        downloadRecording: 'Download Recording',
        rateCallQuality: 'Rate Call Quality',
        sessionCanceled: 'Session Canceled',
        decline: 'Decline',
        accept: 'Accept',
        suggestAnotherDate: 'Suggest Another Date',
        joinMeeting: 'Join Meeting',
        requestSent: 'Request Sent',
        cancelRequest: 'Cancel Request',
        hoursLeftToEdit: '24 hours left to edit',
        reschedule: 'Reschedule',
        cancel: 'Cancel',
      },
    },
  }),
  isLocalAware: {},
}));

// Mock the imported components
vi.mock('./time-info', () => ({
  TimeInfo: () => <div data-testid="time-info">Time Info</div>,
}));
vi.mock('./course-creator', () => ({
  CreatorInfo: () => <div data-testid="creator-info">Creator Info</div>,
}));
vi.mock('./review-card', () => ({
  ReviewCard: () => <div data-testid="review-card">Review Card</div>,
}));
vi.mock('../button', () => ({
  Button: ({ text, ...props }) => <button data-testid="button" {...props}>{text}</button>,
}));
vi.mock('../badge', () => ({
  Badge: ({ text }) => <span data-testid="badge">{text}</span>,
}));

describe('CoachingSessionOverview', () => {
  const defaultProps = {
    title: 'Test Session',
    duration: '1 hour',
    date: '2025-03-05',
    time: '10:00 AM',
    locale: 'en' as const,
  };

  it('renders ongoing session with join button', () => {
    const onJoin = vi.fn();
    render(
      <CoachingSessionOverview
        {...defaultProps}
        status="ongoing"
        meetingLink="https://zoom.us/j/123"
        onJoin={onJoin}
      />
    );

    const joinButton = screen.getByText('Join Meeting');
    expect(joinButton).toBeInTheDocument();
    expect(screen.getByText('https://zoom.us/j/123')).toBeInTheDocument();
    
    joinButton.click();
    expect(onJoin).toHaveBeenCalled();
  });

  it('renders upcoming-editable session with reschedule and cancel buttons', () => {
    const onReschedule = vi.fn();
    const onCancel = vi.fn();
    
    render(
      <CoachingSessionOverview
        {...defaultProps}
        status="upcoming-editable"
        onReschedule={onReschedule}
        onCancel={onCancel}
      />
    );

    expect(screen.getByText('24 hours left to edit')).toBeInTheDocument();
    expect(screen.getByText('Reschedule')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('renders canceled session with appropriate badge', () => {
    render(
      <CoachingSessionOverview
        {...defaultProps}
        status="canceled"
      />
    );

    expect(screen.getByText('Session Canceled')).toBeInTheDocument();
  });

  it('renders rescheduled session with accept/decline buttons', () => {
    render(
      <CoachingSessionOverview
        {...defaultProps}
        status="rescheduled"
      />
    );

    expect(screen.getByText('Decline')).toBeInTheDocument();
    expect(screen.getByText('Accept')).toBeInTheDocument();
    expect(screen.getByText('Suggest Another Date')).toBeInTheDocument();
  });

  it('disables join button for upcoming-locked status', () => {
    render(
      <CoachingSessionOverview
        {...defaultProps}
        status="upcoming-locked"
        meetingLink="https://zoom.us/j/123"
      />
    );

    const joinButton = screen.getByText('Join Meeting');
    expect(joinButton).toBeDisabled();
  });
});