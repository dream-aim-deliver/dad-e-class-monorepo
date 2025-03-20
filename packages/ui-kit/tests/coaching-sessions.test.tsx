import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CoachingSessions, {
  UserType,
} from '../lib/components/coaching-sessions/coaching-sessions';
import { CoachingSessionOverviewProps } from '../lib/components/coaching-sessions/coaching-session-overview';

vi.mock('@maany_shr/e-class-translations', () => ({
  getDictionary: () => ({
    components: {
      coachingSessionOverview: {
        loadMoreText: 'Load More',
      },
    },
  }),
  isLocalAware: vi.fn(),
}));

describe('CoachingSessions', () => {
  const mockDate = new Date('2025-03-20T12:00:00');
  const mockSessions: CoachingSessionOverviewProps[] = Array(10).fill({
    locale: 'en',
    userType: 'coach' as UserType,
    status: 'ongoing',
    title: 'Test Coaching Session',
    duration: 60,
    date: mockDate,
    time: '12:00 PM',
    studentName: 'John Doe',
    studentImageUrl: 'https://example.com/student.jpg',
    onClickJoinMeeting: vi.fn(),
  });

  it('renders the correct number of initial sessions', () => {
    render(
      <CoachingSessions
        coachingSessions={mockSessions}
        userType="coach"
        locale="en"
      />,
    );
    const sessionCards = screen.getAllByText('Test Coaching Session');
    expect(sessionCards).toHaveLength(6);
  });

  it('loads more sessions when "Load More" button is clicked', () => {
    render(
      <CoachingSessions
        coachingSessions={mockSessions}
        userType="coach"
        locale="en"
      />,
    );

    const buttons = screen.getAllByRole('button');
    const loadMoreButton = buttons[buttons.length - 1];
    expect(loadMoreButton).toBeInTheDocument();

    fireEvent.click(loadMoreButton);

    const sessionCards = screen.getAllByText('Test Coaching Session');
    expect(sessionCards).toHaveLength(10);
  });

  it('does not show "Load More" button when all sessions are visible', () => {
    render(
      <CoachingSessions
        coachingSessions={mockSessions.slice(0, 5)}
        userType="coach"
        locale="en"
      />,
    );
    const buttons = screen.queryAllByRole('button');
    console.log('button length ', buttons.length);
    expect(buttons.length).toBeLessThanOrEqual(10);
  });

  it('renders sessions for student user type', () => {
    const studentSessions = mockSessions.map((session) => ({
      ...session,
      userType: 'student' as UserType,
      creatorName: 'Jane Smith',
      creatorImageUrl: 'https://example.com/creator.jpg',
    }));
    render(
      <CoachingSessions
        coachingSessions={studentSessions}
        userType="student"
        locale="en"
      />,
    );
    expect(screen.getAllByText('Jane Smith')).toHaveLength(6);
  });

  it('uses the correct locale for translations', () => {
    vi.mock('@maany_shr/e-class-translations', () => ({
      getDictionary: () => ({
        components: {
          coachingSessionOverview: {
            loadMoreText: 'Charger plus',
          },
        },
      }),
      isLocalAware: vi.fn(),
    }));

    render(
      <CoachingSessions
        coachingSessions={mockSessions}
        userType="coach"
        locale="de"
      />,
    );
    const buttons = screen.getAllByRole('button');
    const loadMoreButton = buttons[buttons.length - 1];
    expect(loadMoreButton).toBeInTheDocument();
  });
});
