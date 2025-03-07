import { CoachingSessionOverview } from '../lib/components/coaching-sessions/coaching-session-overview';
import type { Meta } from '@storybook/react';

// Mock Data for Coaching Session Overview
const mockCoachingSessionBase = {
  title: 'Introduction to React',
  duration: '1 hour',
  date: 'March 10, 2025',
  time: '10:00 AM - 11:00 AM',
  creatorName: 'Jane Smith',
  courseName: 'React Fundamentals',
  groupName: 'Beginner Cohort',
  meetingLink: 'https://zoom.us/j/123456789',
  description: 'A session to cover the basics of React.',
  locale: 'en',
};

// Default Export for Storybook
const meta = {
  title: 'Components/CoachingSessionOverview',
  component: CoachingSessionOverview,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered', // Center the component in the Storybook canvas
  },
  argTypes: {
    status: {
      control: 'select',
      options: [
        'ongoing',
        'upcoming-editable',
        'upcoming-locked',
        'ended',
        'requested',
        'rescheduled',
        'canceled',
      ],
    },
    userRole: {
      control: 'select',
      options: ['student', 'coach'],
    },
    hasReview: {
      control: 'boolean',
    },
    hasCallQualityRating: {
      control: 'boolean',
    },
    withinCourse: {
      control: 'boolean',
    },
    groupSession: {
      control: 'boolean',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
  },
} as Meta;

export default meta;

// Template for the Story
const Template = (args) => <CoachingSessionOverview {...args} />;

// Stories
export const OngoingSession = Template.bind({});
OngoingSession.args = {
  ...mockCoachingSessionBase,
  status: 'ongoing',
  userRole: 'student',
  hasReview: false,
  hasCallQualityRating: false,
  withinCourse: true,
  groupSession: false,
  onJoin: () => console.log('Join clicked'),
};

export const UpcomingEditableSession = Template.bind({});
UpcomingEditableSession.args = {
  ...mockCoachingSessionBase,
  status: 'upcoming-editable',
  userRole: 'coach',
  hasReview: false,
  hasCallQualityRating: false,
  withinCourse: false,
  groupSession: true,
  onCancel: () => console.log('Cancel clicked'),
  onReschedule: () => console.log('Reschedule clicked'),
};

export const WithReviewAndRating = Template.bind({});
WithReviewAndRating.args = {
  ...mockCoachingSessionBase,
  reviewText:
    'Coach was very helpful and answered all my questions. The only issue was that the session was slightly delayed due to technical difficulties. Overall, I would recommend this service!',
  rating: 4,
  status: 'ended',
  userRole: 'student',
  hasReview: true,
  hasCallQualityRating: true,
  withinCourse: true,
  groupSession: false,
};

export const CanceledSession = Template.bind({});
CanceledSession.args = {
  ...mockCoachingSessionBase,
  status: 'canceled',
  userRole: 'coach',
  hasReview: false,
  hasCallQualityRating: false,
  withinCourse: false,
  groupSession: false,
};

export const RequestedSession = Template.bind({});
RequestedSession.args = {
  ...mockCoachingSessionBase,
  status: 'requested',
  userRole: 'student',
  hasReview: false,
  hasCallQualityRating: false,
  withinCourse: true,
  groupSession: false,
  onCancel: () => console.log('Cancel request clicked'),
};

export const RescheduledSession = Template.bind({});
RescheduledSession.args = {
  ...mockCoachingSessionBase,
  status: 'rescheduled',
  userRole: 'coach',
  hasReview: false,
  hasCallQualityRating: false,
  withinCourse: false,
  groupSession: true,
};
