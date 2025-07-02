import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CoachingSessionList } from '../lib/components/coaching-sessions/coaching-session-list';
import { CoachingSessionCard } from '../lib/components/coaching-sessions/coaching-session-card';
import {
    CoachCoachingSessionCardProps,
    StudentCoachingSessionCardProps,
} from '../lib/components/coaching-sessions/coaching-session-card';

describe('CoachingSessions', () => {
    const mockDate = new Date('2025-03-20T12:00:00');

    const createCoachMockSession = (
        overrides: Partial<CoachCoachingSessionCardProps> = {},
    ) => {
        const base: CoachCoachingSessionCardProps = {
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
            onClickJoinMeeting: vi.fn(),
            ...overrides,
        };
        return <CoachingSessionCard {...base} />;
    };

    const createStudentMockSession = (
        overrides: Partial<StudentCoachingSessionCardProps> = {},
    ) => {
        const base: StudentCoachingSessionCardProps = {
            locale: 'en',
            userType: 'student',
            status: 'to-be-defined',
            title: 'Test Student Session',
            duration: 45,
            date: mockDate,
            startTime: '4:00 PM',
            endTime: '4:45 PM',
            creatorName: 'Jane Smith',
            creatorImageUrl: 'https://example.com/creator.jpg',
            studentName: 'John Doe',
            studentImageUrl: 'https://example.com/student.jpg',
            onClickReschedule: vi.fn(),
            ...overrides,
        };
        return <CoachingSessionCard {...base} />;
    };

    const mockCoachSessions = Array.from({ length: 10 }, () =>
        createCoachMockSession(),
    );
    const mockStudentSessions = Array.from({ length: 10 }, () =>
        createStudentMockSession(),
    );

    it('renders the correct number of initial sessions', () => {
        render(
            <CoachingSessionList locale="en">
                {mockCoachSessions}
            </CoachingSessionList>,
        );
        const sessionCards = screen.getAllByText('Test Coaching Session');
        expect(sessionCards).toHaveLength(10);
    });

    it('renders sessions for student user type', () => {
        render(
            <CoachingSessionList locale="en">
                {mockStudentSessions}
            </CoachingSessionList>,
        );
        expect(screen.getAllByText('Test Student Session')).toHaveLength(10);
    });
});
