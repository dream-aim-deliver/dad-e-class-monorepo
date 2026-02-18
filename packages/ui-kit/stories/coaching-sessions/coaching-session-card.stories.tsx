import type { Meta, StoryObj } from '@storybook/react-vite';
import { TLocale } from '@maany_shr/e-class-translations';
import {
  CoachingSessionCard,
  CoachingSessionCardProps
} from '../../lib/components/coaching-sessions/coaching-session-card';

const meta: Meta<typeof CoachingSessionCard> = {
  title: 'Components/CoachingSessionComponents/CoachingSessionCard',
  component: CoachingSessionCard,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;

// Define base shared props once
const baseSharedProps = {
  locale: 'en' as TLocale,
  title: 'Design Principles Discussion',
  duration: 60,
  date: new Date('2025-03-20T10:00:00'),
  startTime: '10:00',
  endTime: '11:00',
  courseName: 'Advanced Brand Identity Design',
  courseImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  groupName: 'Design Professionals',
  onClickCourse: () => alert('Course clicked'),
  onClickGroup: () => alert('Group clicked'),
};

// Create STRICT story types that require ALL properties
type StrictStoryObj<T> = {
  args: T; // ← No Partial here, all props are required
};

// Create specific story types for each variant
type StudentOngoingStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'student'; status: 'ongoing' }>>;
type StudentUpcomingEditableStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'student'; status: 'upcoming-editable' }>>;
type StudentUpcomingLockedStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'student'; status: 'upcoming-locked' }>>;
type StudentEndedWithoutReviewStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'student'; status: 'ended'; hasReview: false }>>;
type StudentEndedWithReviewStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'student'; status: 'ended'; hasReview: true }>>;
type StudentRequestedStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'student'; status: 'requested' }>>;
type StudentRescheduledStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'student'; status: 'rescheduled' }>>;
type StudentCanceledStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'student'; status: 'canceled' }>>;
type StudentToBeDefinedStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'student'; status: 'to-be-defined' }>>;

type CoachOngoingStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'ongoing' }>>;
type CoachUpcomingEditableStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'upcoming-editable' }>>;
type CoachUpcomingLockedStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'upcoming-locked' }>>;
type CoachEndedSessionReviewStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'ended'; reviewType: 'session-review' }>>;
type CoachEndedCallQualityStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'ended'; reviewType: 'call-quality' }>>;
type CoachRequestedStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'requested' }>>;
type CoachRescheduledStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'rescheduled' }>>;
type CoachCanceledStory = StrictStoryObj<Extract<CoachingSessionCardProps, { userType: 'coach'; status: 'canceled' }>>;

// Student Stories
export const StudentOngoing: StudentOngoingStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'ongoing',
    meetingLink: 'https://meet.example.com/session',
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: () => alert('Creator clicked'),
    onClickJoinMeeting: () => alert('Join meeting clicked'),
  },
};

export const StudentUpcomingEditable: StudentUpcomingEditableStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'upcoming-editable',
    hoursLeftToEdit: 12,
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: () => alert('Creator clicked'),
    onClickReschedule: () => alert('Reschedule clicked'),
    onClickCancel: () => alert('Cancel clicked'),
  },
};

export const StudentUpcomingLocked: StudentUpcomingLockedStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'upcoming-locked',
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: () => alert('Creator clicked'),
    onClickJoinMeeting: () => alert('Join meeting clicked'),
  },
};

export const StudentEndedWithoutReview: StudentEndedWithoutReviewStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'ended',
    hasReview: false,
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: () => alert('Creator clicked'),
    onClickReviewCoachingSession: () => alert('Review coaching session clicked'),
    onClickDownloadRecording: () => alert('Download recording clicked'),
    isRecordingDownloading: false,
  },
};

export const StudentEndedWithReview: StudentEndedWithReviewStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'ended',
    hasReview: true,
    reviewText: 'The coaching session was fantastic! The coach was knowledgeable, supportive, and made the learning process enjoyable.',
    rating: 4.5,
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: () => alert('Creator clicked'),
    onClickDownloadRecording: () => alert('Download recording clicked'),
    isRecordingDownloading: false,
  },
};

export const StudentRequested: StudentRequestedStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'requested',
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: () => alert('Creator clicked'),
    onClickCancel: () => alert('Cancel clicked'),
  },
};

export const StudentRescheduled: StudentRescheduledStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'rescheduled',
    previousDate: new Date('2025-03-18T09:00:00'),
    previousStartTime: '9:00',
    previousEndTime: '10:00',
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: () => alert('Creator clicked'),
    onClickAccept: () => alert('Accept clicked'),
    onClickDecline: () => alert('Decline clicked'),
    onClickSuggestAnotherDate: () => alert('Suggest another date clicked'),
  },
};

export const StudentCanceled: StudentCanceledStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'canceled',
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCreator: () => alert('Creator clicked'),
  },
};

export const StudentToBeDefined: StudentToBeDefinedStory = {
  args: {
    locale: 'en' as TLocale,
    userType: 'student',
    status: 'to-be-defined',
    title: 'Full Immersion Coaching',
    duration: 90,
  },
};

// Coach Stories
export const CoachOngoing: CoachOngoingStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'ongoing',
    meetingLink: 'https://meet.example.com/session',
    studentName: 'John Doe',
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: () => alert('Student clicked'),
    onClickJoinMeeting: () => alert('Join meeting clicked'),
  },
};

export const CoachUpcomingEditable: CoachUpcomingEditableStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'upcoming-editable',
    hoursLeftToEdit: 24,
    studentName: 'John Doe',
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: () => alert('Student clicked'),
    onClickReschedule: () => alert('Reschedule clicked'),
    onClickCancel: () => alert('Cancel clicked'),
  },
};

export const CoachUpcomingLocked: CoachUpcomingLockedStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'upcoming-locked',
    studentName: 'John Doe',
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: () => alert('Student clicked'),
    onClickJoinMeeting: () => alert('Join meeting clicked'),
  },
};

export const CoachEndedWithSessionReview: CoachEndedSessionReviewStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'ended',
    reviewType: 'session-review',
    reviewText: 'Excellent session! The student showed great understanding of the concepts.',
    rating: 5,
    studentName: 'John Doe',
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: () => alert('Student clicked'),
    onClickRateCallQuality: () => alert('Rate call quality clicked'),
    onClickDownloadRecording: () => alert('Download recording clicked'),
  },
};

export const CoachEndedWithCallQualityRating: CoachEndedCallQualityStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'ended',
    reviewType: 'call-quality',
    callQualityRating: 4,
    studentName: 'John Doe',
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: () => alert('Student clicked'),
    onClickDownloadRecording: () => alert('Download recording clicked'),
    isRecordingDownloading: false,
  },
};

export const CoachRequested: CoachRequestedStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'requested',
    studentName: 'John Doe',
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: () => alert('Student clicked'),
    onClickAccept: () => alert('Accept clicked'),
    onClickDecline: () => alert('Decline clicked'),
    onClickSuggestAnotherDate: () => alert('Suggest another date clicked'),
  },
};

export const CoachRescheduled: CoachRescheduledStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'rescheduled',
    previousDate: new Date('2025-03-18T09:00:00'),
    previousStartTime: '9:00',
    previousEndTime: '10:00',
    studentName: 'John Doe',
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: () => alert('Student clicked'),
    onClickAccept: () => alert('Accept clicked'),
    onClickDecline: () => alert('Decline clicked'),
    onClickSuggestAnotherDate: () => alert('Suggest another date clicked'),
  },
};

export const CoachCanceled: CoachCanceledStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'canceled',
    studentName: 'John Doe',
    studentImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickStudent: () => alert('Student clicked'),
  },
};
