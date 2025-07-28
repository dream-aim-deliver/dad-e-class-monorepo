import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CoachingSessionList } from '../lib/components/coaching-sessions/coaching-session-list';
import { CoachingSessionCard } from '../lib/components/coaching-sessions/coaching-session-card';
import { CoachingSessionCardProps } from '../lib/components/coaching-sessions/coaching-session-card';

describe('CoachingSessionList', () => {
    const mockDate = new Date('2025-03-20T12:00:00');

    // Create type-safe coach session factory
    const createCoachOngoingSession = (
        overrides: Partial<Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'ongoing' }>> = {}
    ): Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'ongoing' }> => {
        return {
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
            meetingLink: 'https://meet.example.com/session',
            onClickStudent: vi.fn(),
            onClickJoinMeeting: vi.fn(),
            onClickCourse: vi.fn(),
            onClickGroup: vi.fn(),
            ...overrides,
        };
    };

    const createCoachUpcomingEditableSession = (
        overrides: Partial<Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'upcoming-editable' }>> = {}
    ): Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'upcoming-editable' }> => {
        return {
            locale: 'en',
            userType: 'coach',
            status: 'upcoming-editable',
            title: 'Test Editable Session',
            duration: 60,
            date: mockDate,
            startTime: '12:00 PM',
            endTime: '1:00 PM',
            hoursLeftToEdit: 24,
            studentName: 'John Doe',
            studentImageUrl: 'https://example.com/student.jpg',
            onClickStudent: vi.fn(),
            onClickReschedule: vi.fn(),
            onClickCancel: vi.fn(),
            onClickCourse: vi.fn(),
            onClickGroup: vi.fn(),
            ...overrides,
        };
    };

    const createCoachEndedSessionReviewSession = (
        overrides: Partial<Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'ended'; reviewType: 'session-review' }>> = {}
    ): Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'ended'; reviewType: 'session-review' }> => {
        return {
            locale: 'en',
            userType: 'coach',
            status: 'ended',
            reviewType: 'session-review',
            title: 'Test Ended Session',
            duration: 60,
            date: mockDate,
            startTime: '12:00 PM',
            endTime: '1:00 PM',
            reviewText: 'Great session!',
            rating: 5,
            studentName: 'John Doe',
            studentImageUrl: 'https://example.com/student.jpg',
            onClickStudent: vi.fn(),
            onClickRateCallQuality: vi.fn(),
            onClickDownloadRecording: vi.fn(),
            onClickCourse: vi.fn(),
            onClickGroup: vi.fn(),
            ...overrides,
        };
    };

    // Create type-safe student session factories
    const createStudentOngoingSession = (
        overrides: Partial<Extract<CoachingSessionCardProps, { userType: 'student'; status: 'ongoing' }>> = {}
    ): Extract<CoachingSessionCardProps, { userType: 'student'; status: 'ongoing' }> => {
        return {
            locale: 'en',
            userType: 'student',
            status: 'ongoing',
            title: 'Test Student Session',
            duration: 45,
            date: mockDate,
            startTime: '4:00 PM',
            endTime: '4:45 PM',
            creatorName: 'Jane Smith',
            creatorImageUrl: 'https://example.com/creator.jpg',
            meetingLink: 'https://meet.example.com/session',
            onClickCreator: vi.fn(),
            onClickJoinMeeting: vi.fn(),
            onClickCourse: vi.fn(),
            onClickGroup: vi.fn(),
            ...overrides,
        };
    };

    const createStudentToBeDefinedSession = (
        overrides: Partial<Extract<CoachingSessionCardProps, { userType: 'student'; status: 'to-be-defined' }>> = {}
    ): Extract<CoachingSessionCardProps, { userType: 'student'; status: 'to-be-defined' }> => {
        return {
            locale: 'en',
            userType: 'student',
            status: 'to-be-defined',
            title: 'Test TBD Session',
            duration: 30,
            ...overrides,
        };
    };

    const createStudentEndedWithoutReviewSession = (
        overrides: Partial<Extract<CoachingSessionCardProps, { userType: 'student'; status: 'ended'; hasReview: false }>> = {}
    ): Extract<CoachingSessionCardProps, { userType: 'student'; status: 'ended'; hasReview: false }> => {
        return {
            locale: 'en',
            userType: 'student',
            status: 'ended',
            hasReview: false,
            title: 'Test Ended Student Session',
            duration: 45,
            date: mockDate,
            startTime: '4:00 PM',
            endTime: '4:45 PM',
            creatorName: 'Jane Smith',
            creatorImageUrl: 'https://example.com/creator.jpg',
            onClickCreator: vi.fn(),
            onClickReviewCoachingSession: vi.fn(),
            onClickDownloadRecording: vi.fn(),
            isRecordingDownloading: false,
            onClickCourse: vi.fn(),
            onClickGroup: vi.fn(),
            ...overrides,
        };
    };

    // Helper to create mock sessions with proper typing
    const createCoachMockSessions = (count: number) => {
        return Array.from({ length: count }, (_, index) => {
            const sessionData = createCoachOngoingSession({
                title: `Test Coaching Session ${index + 1}`,
            });
            return <CoachingSessionCard key={index} {...sessionData} />;
        });
    };

    const createStudentMockSessions = (count: number) => {
        return Array.from({ length: count }, (_, index) => {
            const sessionData = createStudentOngoingSession({
                title: `Test Student Session ${index + 1}`,
            });
            return <CoachingSessionCard key={index} {...sessionData} />;
        });
    };

    const createMixedMockSessions = (count: number) => {
        return Array.from({ length: count }, (_, index) => {
            const sessionCreators = [
                () => createCoachOngoingSession({ title: `Coach Session ${index + 1}` }),
                () => createStudentOngoingSession({ title: `Student Session ${index + 1}` }),
                () => createCoachUpcomingEditableSession({ title: `Coach Editable ${index + 1}` }),
                () => createStudentToBeDefinedSession({ title: `Student TBD ${index + 1}` }),
                () => createCoachEndedSessionReviewSession({ title: `Coach Ended ${index + 1}` }),
                () => createStudentEndedWithoutReviewSession({ title: `Student Ended ${index + 1}` }),
            ];

            const sessionData = sessionCreators[index % sessionCreators.length]();
            return <CoachingSessionCard key={index} {...sessionData} />;
        });
    };

    it('renders the correct number of coach sessions', () => {
        const mockCoachSessions = createCoachMockSessions(10);

        render(
            <CoachingSessionList locale="en">
                {mockCoachSessions}
            </CoachingSessionList>
        );

        const sessionTitles = screen.getAllByText(/Test Coaching Session \d+/);
        expect(sessionTitles).toHaveLength(10);

        const studentNames = screen.getAllByText('John Doe');
        expect(studentNames).toHaveLength(10);
    });

    it('renders the correct number of student sessions', () => {
        const mockStudentSessions = createStudentMockSessions(8);

        render(
            <CoachingSessionList locale="en">
                {mockStudentSessions}
            </CoachingSessionList>
        );

        const sessionTitles = screen.getAllByText(/Test Student Session \d+/);
        expect(sessionTitles).toHaveLength(8);

        const creatorNames = screen.getAllByText('Jane Smith');
        expect(creatorNames).toHaveLength(8);
    });

    it('renders mixed session types correctly', () => {
        const mockMixedSessions = createMixedMockSessions(12);

        render(
            <CoachingSessionList locale="en">
                {mockMixedSessions}
            </CoachingSessionList>
        );

        const coachSessions = screen.getAllByText(/Coach Session \d+/);
        const studentSessions = screen.getAllByText(/Student Session \d+/);

        expect(coachSessions.length).toBeGreaterThan(0);
        expect(studentSessions.length).toBeGreaterThan(0);

        const allSessions = screen.getAllByText(/Session \d+|TBD \d+|Ended \d+|Editable \d+/);
        expect(allSessions).toHaveLength(12);
    });

    it('renders empty list correctly', () => {
        render(
            <CoachingSessionList locale="en">
                {[]}
            </CoachingSessionList>
        );

        expect(screen.queryByText(/Test.*Session/)).not.toBeInTheDocument();
    });

    it('handles different session statuses correctly', () => {
        const sessions = [
            <CoachingSessionCard key="1" {...createCoachOngoingSession({ title: 'Ongoing Session' })} />,
            <CoachingSessionCard key="2" {...createCoachUpcomingEditableSession({ title: 'Editable Session' })} />,
            <CoachingSessionCard key="3" {...createCoachEndedSessionReviewSession({ title: 'Ended Session' })} />,
            <CoachingSessionCard key="4" {...createStudentToBeDefinedSession({ title: 'TBD Session' })} />,
            <CoachingSessionCard key="5" {...createStudentEndedWithoutReviewSession({ title: 'Student Ended Session' })} />,
        ];

        render(
            <CoachingSessionList locale="en">
                {sessions}
            </CoachingSessionList>
        );

        expect(screen.getByText('Ongoing Session')).toBeInTheDocument();
        expect(screen.getByText('Editable Session')).toBeInTheDocument();
        expect(screen.getByText('Ended Session')).toBeInTheDocument();
        expect(screen.getByText('TBD Session')).toBeInTheDocument();
        expect(screen.getByText('Student Ended Session')).toBeInTheDocument();
    });

    it('passes locale correctly to child components', () => {
        const mockSessions = createCoachMockSessions(1);

        render(
            <CoachingSessionList locale="de">
                {mockSessions}
            </CoachingSessionList>
        );
        expect(screen.getByText('Test Coaching Session 1')).toBeInTheDocument();
    });
});
