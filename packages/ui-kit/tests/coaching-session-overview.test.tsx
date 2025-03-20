import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {
  CoachingSessionOverview,
  CoachingSessionOverviewProps,
} from '../lib/components/coaching-sessions/coaching-session-overview';

describe('CoachingSessionOverview', () => {
  const mockDate = new Date('2025-03-20T12:00:00');
  const baseProps: CoachingSessionOverviewProps = {
    locale: 'en',
    userType: 'coach',
    status: 'ongoing',
    title: 'Test Coaching Session',
    duration: 60,
    date: mockDate,
    time: '12:00 PM',
    studentName: 'John Doe',
    studentImageUrl: 'https://example.com/student.jpg',
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://example.com/creator.jpg',
    onClickJoinMeeting: vi.fn(),
  };

  it('renders CoachingSessionOverviewCoach for coach user type', () => {
    render(<CoachingSessionOverview {...baseProps} />);
    expect(screen.getByText('Test Coaching Session')).toBeInTheDocument();
    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('renders CoachingSessionOverviewStudent for student user type', () => {
    render(<CoachingSessionOverview {...baseProps} userType="student" />);
    expect(screen.getByText('Test Coaching Session')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
  });

  it('displays error message when studentName is missing for coach', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => console.log('error'));
    const { container } = render(
      <CoachingSessionOverview
        {...baseProps}
        studentName={undefined}
        userType="coach"
      />,
    );
    expect(container.textContent).toContain('Student Name is required');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Student Name is required');
    consoleErrorSpy.mockRestore();
  });

  it('displays error message when creatorName is missing for student', () => {
    const consoleErrorSpy = vi
      .spyOn(console, 'error')
      .mockImplementation(() => console.log('error'));
    const { container } = render(
      <CoachingSessionOverview
        {...baseProps}
        creatorName={undefined}
        userType="student"
      />,
    );
    expect(container.textContent).toContain('Creator Name is required');
    expect(consoleErrorSpy).toHaveBeenCalledWith('Creator Name is required');

    consoleErrorSpy.mockRestore();
  });

  it('calls onClickJoinMeeting when join meeting button is clicked', () => {
    render(<CoachingSessionOverview {...baseProps} />);
    fireEvent.click(screen.getByText('Join Meeting'));
    expect(baseProps.onClickJoinMeeting).toHaveBeenCalled();
  });

  it('renders correct status for upcoming-editable session', () => {
    render(
      <CoachingSessionOverview
        {...baseProps}
        status="upcoming-editable"
        hoursLeftToEdit={24}
      />,
    );
    expect(screen.getByText('24 hours left to edit event')).toBeInTheDocument();
  });

  it('renders correct components for ended session', () => {
    render(
      <CoachingSessionOverview
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
      <CoachingSessionOverview
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
