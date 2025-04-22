import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import {CoachingSessionList} from '../lib/components/coaching-sessions/coaching-session-list';
import { CoachingSessionCard , CoachingSessionCardProps} from '../lib/components/coaching-sessions/coaching-session-card';

describe('CoachingSessions', () => {
  const mockDate = new Date('2025-03-20T12:00:00');
  
  // Helper function to create a mock CoachingSessionCard
  const createMockSession = (props: Partial<CoachingSessionCardProps> = {}) => (
    <CoachingSessionCard
      locale="en"
      userType="coach"
      status="ongoing"
      title="Test Coaching Session"
      duration={60}
      date={mockDate}
      startTime="12:00 PM"
      endTime="1:00 PM"
      studentName="John Doe"
      studentImageUrl="https://example.com/student.jpg"
      onClickJoinMeeting={vi.fn()}
      {...props}
    />
  );

  // Create mock sessions
  const mockSessions = Array(10).fill(0).map(() => createMockSession());

  // Create mock sessions for student user type
  const studentMockSessions = Array(10).fill(0).map(() => createMockSession({
    userType: 'student',
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://example.com/creator.jpg',
  }));

  it('renders the correct number of initial sessions', () => {
    render(
      <CoachingSessionList locale="en">
        {mockSessions}
      </CoachingSessionList>,
    );
    const sessionCards = screen.getAllByText('Test Coaching Session');
    expect(sessionCards).toHaveLength(10);
  });

  it('renders sessions for student user type', () => {
    render(
      <CoachingSessionList locale="en">
        {studentMockSessions}
      </CoachingSessionList>,
    );
    expect(screen.getAllByText('Jane Smith')).toHaveLength(10);
  });
});
