import type { Meta, StoryObj } from '@storybook/react-vite';
import { TLocale } from '@maany_shr/e-class-translations';
import {
  CoachingSessionGroupOverviewCard,
  CoachingSessionGroupOverviewCardProps
} from '../../lib/components/coaching-session-group-overview/coaching-session-group-overview-card';

const meta: Meta<typeof CoachingSessionGroupOverviewCard> = {
  title: 'Components/CoachingSessionGroupOverviewComponents/CoachingSessionGroupOverviewCard',
  component: CoachingSessionGroupOverviewCard,
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
  withinCourse: true,
  courseName: 'Advanced Brand Identity Design',
  courseImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  groupName: 'Design Professionals',
  creatorName: 'Jane Smith',
  creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  onClickCourse: () => alert('Course clicked'),
  onClickGroup: () => alert('Group clicked'),
  onClickCreator: () => alert('Creator clicked'),
};

// Create STRICT story types that require ALL properties
type StrictStoryObj<T> = {
  args: T; // ← No Partial here, all props are required
};

// Create specific story types for each variant
type StudentOngoingStory = StrictStoryObj<Extract<CoachingSessionGroupOverviewCardProps, { userType: 'student'; status: 'ongoing' }>>;
type StudentUpcomingEditableStory = StrictStoryObj<Extract<CoachingSessionGroupOverviewCardProps, { userType: 'student'; status: 'upcoming-editable' }>>;
type StudentUpcomingLockedStory = StrictStoryObj<Extract<CoachingSessionGroupOverviewCardProps, { userType: 'student'; status: 'upcoming-locked' }>>;
type StudentEndedStory = StrictStoryObj<Extract<CoachingSessionGroupOverviewCardProps, { userType: 'student'; status: 'ended' }>>;
type StudentCanceledStory = StrictStoryObj<Extract<CoachingSessionGroupOverviewCardProps, { userType: 'student'; status: 'canceled' }>>;
type StudentUnscheduledStory = StrictStoryObj<Extract<CoachingSessionGroupOverviewCardProps, { userType: 'student'; status: 'unscheduled' }>>;

type CoachOngoingStory = StrictStoryObj<Extract<CoachingSessionGroupOverviewCardProps, { userType: 'coach'; status: 'ongoing' }>>;
type CoachUpcomingEditableStory = StrictStoryObj<Extract<CoachingSessionGroupOverviewCardProps, { userType: 'coach'; status: 'upcoming-editable' }>>;
type CoachUpcomingLockedStory = StrictStoryObj<Extract<CoachingSessionGroupOverviewCardProps, { userType: 'coach'; status: 'upcoming-locked' }>>;
type CoachEndedStory = StrictStoryObj<Extract<CoachingSessionGroupOverviewCardProps, { userType: 'coach'; status: 'ended';}>>;
type CoachCanceledStory = StrictStoryObj<Extract<CoachingSessionGroupOverviewCardProps, { userType: 'coach'; status: 'canceled' }>>;
type CoachUnscheduledStory = StrictStoryObj<Extract<CoachingSessionGroupOverviewCardProps, { userType: 'coach'; status: 'unscheduled' }>>;

// Student Stories
export const StudentOngoing: StudentOngoingStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'ongoing',
    meetingLink: 'https://meet.example.com/session',
    onClickJoinMeeting: () => alert('Join meeting clicked'),
  },
};

export const StudentUpcomingEditable: StudentUpcomingEditableStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'upcoming-editable',
    hoursLeftToEdit: 12,
    onClickReschedule: () => alert('Reschedule clicked'),
    onClickCancel: () => alert('Cancel clicked'),
  },
};

export const StudentUpcomingLocked: StudentUpcomingLockedStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'upcoming-locked',
    onClickJoinMeeting: () => alert('Join meeting clicked (locked)'),
  },
};

export const StudentEnded: StudentEndedStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'ended',
    averageRating: 4.7,
    reviewCount: 15,
    studentCount: 20,
    onClickReadReviews: () => alert('Read reviews clicked'),
  },
};



export const StudentCanceled: StudentCanceledStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'canceled',
  },
};

export const StudentUnscheduled: StudentUnscheduledStory = {
  args: {
    userType: 'student',
    status: 'unscheduled',
    locale: 'en' as TLocale,
    title: 'Design Principles Discussion',
    duration: 60,
  },
};

// Additional stories to demonstrate withinCourse functionality
export const StudentOngoingOutsideCourse: StudentOngoingStory = {
  args: {
    ...baseSharedProps,
    userType: 'student',
    status: 'ongoing',
    meetingLink: 'https://meet.example.com/session',
    onClickJoinMeeting: () => alert('Join meeting clicked'),
    withinCourse: false, // This will hide the course/group section
  },
};

// Coach Stories
export const CoachOngoing: CoachOngoingStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'ongoing',
    meetingLink: 'https://meet.example.com/session',
    onClickJoinMeeting: () => alert('Join meeting clicked'),
  },
};

export const CoachUpcomingEditable: CoachUpcomingEditableStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'upcoming-editable',
    hoursLeftToEdit: 8,
    onClickReschedule: () => alert('Reschedule clicked'),
    onClickCancel: () => alert('Cancel clicked'),
  },
};

export const CoachUpcomingLocked: CoachUpcomingLockedStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'upcoming-locked',
    onClickJoinMeeting: () => alert('Join meeting clicked (locked)'),
  },
};

export const CoachEnded: CoachEndedStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'ended',
    averageRating: 4.7,
    reviewCount: 15,
    studentCount: 20,
    onClickReadReviews: () => alert('Read reviews clicked'),
  },
};


export const CoachCanceled: CoachCanceledStory = {
  args: {
    ...baseSharedProps,
    userType: 'coach',
    status: 'canceled',
  },
};

export const CoachUnscheduled: CoachUnscheduledStory = {
  args: {
    userType: 'coach',
    status: 'unscheduled',
    locale: 'en' as TLocale,
    title: 'Brand Strategy Deep Dive',
    duration: 90,
    withinCourse: true,
    courseName: 'Advanced Brand Identity Design',
    courseImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    groupName: 'Design Professionals',
    creatorName: 'Jane Smith',
    creatorImageUrl: 'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
    onClickCourse: () => alert('Course clicked'),
    onClickGroup: () => alert('Group clicked'),
    onClickCreator: () => alert('Creator clicked'),
    onClickScheduleSession: () => alert('Schedule session clicked'),
  },
};

// Additional story to demonstrate withinCourse functionality for unscheduled sessions
export const CoachUnscheduledOutsideCourse: CoachUnscheduledStory = {
  args: {
    userType: 'coach',
    status: 'unscheduled',
    locale: 'en' as TLocale,
    title: 'Brand Strategy Deep Dive',
    duration: 90,
    withinCourse: false, // This will hide the course/group section
    onClickScheduleSession: () => alert('Schedule session clicked'),
  },
};