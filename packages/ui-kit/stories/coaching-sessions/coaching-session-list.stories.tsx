import type { Meta, StoryObj } from '@storybook/react-vite';
import { CoachingSessionList } from '../../lib/components/coaching-sessions/coaching-session-list';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    CoachingSessionCard,
    CoachingSessionCardProps,
} from '../../lib/components/coaching-sessions/coaching-session-card';

const meta: Meta<typeof CoachingSessionList> = {
    title: 'Components/CoachingSessionComponents/CoachingSessionList',
    component: CoachingSessionList,
    tags: ['autodocs'],
    parameters: {
        layout: 'centered',
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
            description: 'Locale for translations',
        },
    },
};

export default meta;

type Story = StoryObj<typeof CoachingSessionList>;

// Mock callback functions
const mockCallbacks = {
    onClickCourse: () => alert('Course clicked'),
    onClickGroup: () => alert('Group clicked'),
    onClickStudent: () => alert('Student clicked'),
    onClickCreator: () => alert('Creator clicked'),
    onClickJoinMeeting: () => alert('Join meeting clicked'),
    onClickReschedule: () => alert('Reschedule clicked'),
    onClickCancel: () => alert('Cancel clicked'),
    onClickDownloadRecording: () => alert('Download recording clicked'),
    onClickDecline: () => alert('Decline clicked'),
    onClickAccept: () => alert('Accept clicked'),
    onClickSuggestAnotherDate: () => alert('Suggest another date clicked'),
    onClickReviewCoachingSession: () => alert('Review coaching session clicked'),
    onClickRateCallQuality: () => alert('Rate call quality clicked'),
};

// Base session properties
const baseSessionProps = {
    duration: 60,
    startTime: '10:00',
    endTime: '11:00',
    courseName: 'Advanced Brand Identity Design',
    courseImageUrl:
        'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    groupName: 'Design Professionals',
    meetingLink: 'https://meet.example.com/session',
};

// Type-safe session creators
const createCoachOngoingSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'ongoing' }> => ({
    locale,
    userType: 'coach',
    status: 'ongoing',
    title: `Session ${index + 1}`,
    date: sessionDate,
    ...baseSessionProps,
    studentName: `Student ${index + 1}`,
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: mockCallbacks.onClickStudent,
    onClickJoinMeeting: mockCallbacks.onClickJoinMeeting,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createCoachUpcomingEditableSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'upcoming-editable' }> => ({
    locale,
    userType: 'coach',
    status: 'upcoming-editable',
    title: `Session ${index + 1}`,
    date: sessionDate,
    hoursLeftToEdit: 24 - (index % 48),
    ...baseSessionProps,
    studentName: `Student ${index + 1}`,
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: mockCallbacks.onClickStudent,
    onClickReschedule: mockCallbacks.onClickReschedule,
    onClickCancel: mockCallbacks.onClickCancel,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createCoachUpcomingLockedSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'upcoming-locked' }> => ({
    locale,
    userType: 'coach',
    status: 'upcoming-locked',
    title: `Session ${index + 1}`,
    date: sessionDate,
    ...baseSessionProps,
    studentName: `Student ${index + 1}`,
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: mockCallbacks.onClickStudent,
    onClickJoinMeeting: mockCallbacks.onClickJoinMeeting,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createCoachEndedSessionReviewSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'ended'; reviewType: 'session-review' }> => ({
    locale,
    userType: 'coach',
    status: 'ended',
    reviewType: 'session-review',
    title: `Session ${index + 1}`,
    date: sessionDate,
    reviewText: 'Great session! The student was engaged and asked excellent questions.',
    rating: 4 + (index % 2),
    ...baseSessionProps,
    studentName: `Student ${index + 1}`,
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: mockCallbacks.onClickStudent,
    onClickRateCallQuality: mockCallbacks.onClickRateCallQuality,
    onClickDownloadRecording: mockCallbacks.onClickDownloadRecording,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createCoachEndedCallQualitySession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'ended'; reviewType: 'call-quality' }> => ({
    locale,
    userType: 'coach',
    status: 'ended',
    reviewType: 'call-quality',
    title: `Session ${index + 1}`,
    date: sessionDate,
    callQualityRating: 3 + (index % 3),
    isRecordingDownloading: index % 3 === 0,
    ...baseSessionProps,
    studentName: `Student ${index + 1}`,
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: mockCallbacks.onClickStudent,
    onClickDownloadRecording: mockCallbacks.onClickDownloadRecording,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createCoachRequestedSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'requested' }> => ({
    locale,
    userType: 'coach',
    status: 'requested',
    title: `Session ${index + 1}`,
    date: sessionDate,
    ...baseSessionProps,
    studentName: `Student ${index + 1}`,
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: mockCallbacks.onClickStudent,
    onClickAccept: mockCallbacks.onClickAccept,
    onClickDecline: mockCallbacks.onClickDecline,
    onClickSuggestAnotherDate: mockCallbacks.onClickSuggestAnotherDate,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createCoachRescheduledSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'rescheduled' }> => ({
    locale,
    userType: 'coach',
    status: 'rescheduled',
    title: `Session ${index + 1}`,
    date: sessionDate,
    previousDate: new Date(sessionDate.getTime() - 2 * 24 * 60 * 60 * 1000),
    previousStartTime: '09:00',
    previousEndTime: '10:00',
    ...baseSessionProps,
    studentName: `Student ${index + 1}`,
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: mockCallbacks.onClickStudent,
    onClickAccept: mockCallbacks.onClickAccept,
    onClickDecline: mockCallbacks.onClickDecline,
    onClickSuggestAnotherDate: mockCallbacks.onClickSuggestAnotherDate,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createCoachCanceledSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'canceled' }> => ({
    locale,
    userType: 'coach',
    status: 'canceled',
    title: `Session ${index + 1}`,
    date: sessionDate,
    ...baseSessionProps,
    studentName: `Student ${index + 1}`,
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: mockCallbacks.onClickStudent,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

// Student session creators
const createStudentOngoingSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'student'; status: 'ongoing' }> => ({
    locale,
    userType: 'student',
    status: 'ongoing',
    title: `Session ${index + 1}`,
    date: sessionDate,
    ...baseSessionProps,
    creatorName: `Coach ${index + 1}`,
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: mockCallbacks.onClickCreator,
    onClickJoinMeeting: mockCallbacks.onClickJoinMeeting,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createStudentUpcomingEditableSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'student'; status: 'upcoming-editable' }> => ({
    locale,
    userType: 'student',
    status: 'upcoming-editable',
    title: `Session ${index + 1}`,
    date: sessionDate,
    hoursLeftToEdit: 12 + (index % 36),
    ...baseSessionProps,
    creatorName: `Coach ${index + 1}`,
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: mockCallbacks.onClickCreator,
    onClickReschedule: mockCallbacks.onClickReschedule,
    onClickCancel: mockCallbacks.onClickCancel,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createStudentUpcomingLockedSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'student'; status: 'upcoming-locked' }> => ({
    locale,
    userType: 'student',
    status: 'upcoming-locked',
    title: `Session ${index + 1}`,
    date: sessionDate,
    ...baseSessionProps,
    creatorName: `Coach ${index + 1}`,
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: mockCallbacks.onClickCreator,
    onClickJoinMeeting: mockCallbacks.onClickJoinMeeting,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createStudentEndedWithReviewSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'student'; status: 'ended'; hasReview: true }> => ({
    locale,
    userType: 'student',
    status: 'ended',
    hasReview: true,
    title: `Session ${index + 1}`,
    date: sessionDate,
    reviewText: 'The coaching session was fantastic! Very helpful and informative.',
    rating: 4 + (index % 2),
    isRecordingDownloading: index % 3 === 0,
    ...baseSessionProps,
    creatorName: `Coach ${index + 1}`,
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: mockCallbacks.onClickCreator,
    onClickDownloadRecording: mockCallbacks.onClickDownloadRecording,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createStudentEndedWithoutReviewSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'student'; status: 'ended'; hasReview: false }> => ({
    locale,
    userType: 'student',
    status: 'ended',
    hasReview: false,
    title: `Session ${index + 1}`,
    date: sessionDate,
    isRecordingDownloading: index % 4 === 0,
    ...baseSessionProps,
    creatorName: `Coach ${index + 1}`,
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: mockCallbacks.onClickCreator,
    onClickReviewCoachingSession: mockCallbacks.onClickReviewCoachingSession,
    onClickDownloadRecording: mockCallbacks.onClickDownloadRecording,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createStudentRequestedSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'student'; status: 'requested' }> => ({
    locale,
    userType: 'student',
    status: 'requested',
    title: `Session ${index + 1}`,
    date: sessionDate,
    ...baseSessionProps,
    creatorName: `Coach ${index + 1}`,
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: mockCallbacks.onClickCreator,
    onClickCancel: mockCallbacks.onClickCancel,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createStudentRescheduledSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'student'; status: 'rescheduled' }> => ({
    locale,
    userType: 'student',
    status: 'rescheduled',
    title: `Session ${index + 1}`,
    date: sessionDate,
    previousDate: new Date(sessionDate.getTime() - 2 * 24 * 60 * 60 * 1000),
    previousStartTime: '09:00',
    previousEndTime: '10:00',
    ...baseSessionProps,
    creatorName: `Coach ${index + 1}`,
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: mockCallbacks.onClickCreator,
    onClickAccept: mockCallbacks.onClickAccept,
    onClickDecline: mockCallbacks.onClickDecline,
    onClickSuggestAnotherDate: mockCallbacks.onClickSuggestAnotherDate,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createStudentCanceledSession = (
    index: number,
    locale: TLocale,
    sessionDate: Date
): Extract<CoachingSessionCardProps, { userType: 'student'; status: 'canceled' }> => ({
    locale,
    userType: 'student',
    status: 'canceled',
    title: `Session ${index + 1}`,
    date: sessionDate,
    ...baseSessionProps,
    creatorName: `Coach ${index + 1}`,
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: mockCallbacks.onClickCreator,
    onClickCourse: mockCallbacks.onClickCourse,
    onClickGroup: mockCallbacks.onClickGroup,
});

const createStudentToBeDefinedSession = (
    index: number,
    locale: TLocale
): Extract<CoachingSessionCardProps, { userType: 'student'; status: 'to-be-defined' }> => ({
    locale,
    userType: 'student',
    status: 'to-be-defined',
    title: `Session ${index + 1}`,
    duration: 90,
});

// Type-safe session generators
const generateCoachSessions = (count: number, locale: TLocale): CoachingSessionCardProps[] => {
    const sessionCreators = [
        createCoachOngoingSession,
        createCoachUpcomingEditableSession,
        createCoachUpcomingLockedSession,
        createCoachEndedSessionReviewSession,
        createCoachEndedCallQualitySession,
        createCoachRequestedSession,
        createCoachRescheduledSession,
        createCoachCanceledSession,
    ];

    return Array(count)
        .fill(null)
        .map((_, index) => {
            const creatorIndex = index % sessionCreators.length;
            const creator = sessionCreators[creatorIndex];
            const baseDate = new Date('2025-03-20T10:00:00');
            const sessionDate = new Date(baseDate.getTime() + index * 24 * 60 * 60 * 1000);

            // Handle ended sessions with alternating review types
            if (creatorIndex === 3 || creatorIndex === 4) {
                const isSessionReview = index % 2 === 0;
                if (isSessionReview) {
                    return createCoachEndedSessionReviewSession(index, locale, sessionDate);
                } else {
                    return createCoachEndedCallQualitySession(index, locale, sessionDate);
                }
            }

            return creator(index, locale, sessionDate);
        });
};

const generateStudentSessions = (count: number, locale: TLocale): CoachingSessionCardProps[] => {
    const sessionCreators = [
        createStudentOngoingSession,
        createStudentUpcomingEditableSession,
        createStudentUpcomingLockedSession,
        createStudentEndedWithReviewSession,
        createStudentEndedWithoutReviewSession,
        createStudentRequestedSession,
        createStudentRescheduledSession,
        createStudentCanceledSession,
        createStudentToBeDefinedSession,
    ];

    return Array(count)
        .fill(null)
        .map((_, index) => {
            const creatorIndex = index % sessionCreators.length;
            const creator = sessionCreators[creatorIndex];
            const baseDate = new Date('2025-03-20T10:00:00');
            const sessionDate = new Date(baseDate.getTime() + index * 24 * 60 * 60 * 1000);

            // Handle to-be-defined sessions (no date needed)
            if (creatorIndex === 8) {
                return createStudentToBeDefinedSession(index, locale);
            }

            // Handle ended sessions with alternating review status
            if (creatorIndex === 3 || creatorIndex === 4) {
                const hasReview = index % 2 === 0;
                if (hasReview) {
                    return createStudentEndedWithReviewSession(index, locale, sessionDate);
                } else {
                    return createStudentEndedWithoutReviewSession(index, locale, sessionDate);
                }
            }

            return creator(index, locale, sessionDate);
        });
};

// Stories with proper typing
export const Default: Story = {
    render: ({ locale }) => {
        const sessions = generateCoachSessions(6, locale as TLocale);
        return (
            <CoachingSessionList locale={locale as TLocale}>
                {sessions.map((session, idx) => (
                    <CoachingSessionCard
                        key={session.title + idx}
                        {...session}
                    />
                ))}
            </CoachingSessionList>
        );
    },
    args: {
        locale: 'en',
    },
};

export const StudentView: Story = {
    render: ({ locale }) => {
        const sessions = generateStudentSessions(8, locale as TLocale);
        return (
            <CoachingSessionList locale={locale as TLocale}>
                {sessions.map((session, idx) => (
                    <CoachingSessionCard
                        key={session.title + idx}
                        {...session}
                    />
                ))}
            </CoachingSessionList>
        );
    },
    args: {
        locale: 'en',
    },
};

export const FewSessions: Story = {
    render: ({ locale }) => {
        const sessions = generateCoachSessions(3, locale as TLocale);
        return (
            <CoachingSessionList locale={locale as TLocale}>
                {sessions.map((session, idx) => (
                    <CoachingSessionCard
                        key={session.title + idx}
                        {...session}
                    />
                ))}
            </CoachingSessionList>
        );
    },
    args: {
        locale: 'en',
    },
};

export const MixedUserTypes: Story = {
    render: ({ locale }) => {
        const coachSessions = generateCoachSessions(4, locale as TLocale);
        const studentSessions = generateStudentSessions(4, locale as TLocale);
        const allSessions = [...coachSessions, ...studentSessions];

        return (
            <CoachingSessionList locale={locale as TLocale}>
                {allSessions.map((session, idx) => (
                    <CoachingSessionCard
                        key={session.title + idx}
                        {...session}
                    />
                ))}
            </CoachingSessionList>
        );
    },
    args: {
        locale: 'en',
    },
};

export const AllCoachStatuses: Story = {
    render: ({ locale }) => {
        const sessions = generateCoachSessions(14, locale as TLocale);
        return (
            <CoachingSessionList locale={locale as TLocale}>
                {sessions.map((session, idx) => (
                    <CoachingSessionCard
                        key={session.title + idx}
                        {...session}
                    />
                ))}
            </CoachingSessionList>
        );
    },
    args: {
        locale: 'en',
    },
};

export const AllStudentStatuses: Story = {
    render: ({ locale }) => {
        const sessions = generateStudentSessions(16, locale as TLocale);
        return (
            <CoachingSessionList locale={locale as TLocale}>
                {sessions.map((session, idx) => (
                    <CoachingSessionCard
                        key={session.title + idx}
                        {...session}
                    />
                ))}
            </CoachingSessionList>
        );
    },
    args: {
        locale: 'en',
    },
};