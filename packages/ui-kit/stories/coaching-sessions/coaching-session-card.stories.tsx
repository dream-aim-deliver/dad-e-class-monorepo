import type { Meta, StoryObj } from '@storybook/react';
import { TLocale } from '@maany_shr/e-class-translations';
import { TRole } from 'packages/models/src/role';
import { CoachingSessionCard } from '../../lib/components/coaching-sessions/coaching-session-card'

const meta: Meta<typeof CoachingSessionCard> = {
  title: 'Components/CoachingSessionComponents/CoachingSessionCard',
  component: CoachingSessionCard,
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
    userType: {
      control: 'radio',
      options: ['coach', 'student'],
      description: 'Type of user viewing the session overview',
    },
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
      description: 'Status of the coaching session',
    },
    title: { control: 'text' },
    duration: { control: 'number' },
    date: { control: 'date' },
    previousDate: { control: 'date' },
    startTime: { control: 'text' },
    endTime: { control: 'text' },
    previousStartTime: { control: 'text' },
    previousEndTime: { control: 'text' },
    studentName: { control: 'text' },
    studentImageUrl: { control: 'text' },
    creatorName: { control: 'text' },
    creatorImageUrl: { control: 'text' },
    courseName: { control: 'text' },
    courseImageUrl: { control: 'text' },
    groupName: { control: 'text' },
    reviewText: { control: 'text' },
    rating: { control: 'number', min: 0, max: 5, step: 0.1 },
    callQualityRating: { control: 'number', min: 0, max: 5, step: 0.1 },
    meetingLink: { control: 'text' },
    isRecordingDownloading: { control: 'boolean' },
    hoursLeftToEdit: { control: 'number' },
  },
};

export default meta;
type Story = StoryObj<typeof CoachingSessionCard>;

const baseArgs = {
  locale: 'en' as TLocale,
  userType: 'coach' as Exclude<TRole, 'admin' | 'visitor'>,
  title: 'Design Principles Discussion',
  duration: 60,
  date: new Date('2025-03-20T10:00:00'),
  startTime: '10:00',
  endTime: '11:00',
  courseName: 'Advanced Brand Identity Design',
  courseImageUrl:
    'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  groupName: 'Design Professionals',
  meetingLink: 'https://meet.example.com/session',
  onClickCourse: () => alert('Course clicked'),
  onClickGroup: () => alert('Group clicked'),
  onClickJoinMeeting: () => alert('Join meeting clicked'),
  onClickReschedule: () => alert('Reschedule clicked'),
  onClickCancel: () => alert('Cancel clicked'),
  onClickDownloadRecording: () => alert('Download recording clicked'),
  onClickDecline: () => alert('Decline clicked'),
  onClickAccept: () => alert('Accept clicked'),
  onClickSuggestAnotherDate: () => alert('Suggest another date clicked'),
  studentName: 'John Doe',
  studentImageUrl:
    'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  onClickStudent: () => alert('Student clicked'),
  onClickRateCallQuality: () => alert('Rate call quality clicked'),
  creatorName: 'Jane Smith',
  creatorImageUrl:
    'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  onClickCreator: () => alert('Creator clicked'),
  onClickReviewCoachingSession: () => alert('Review coaching session clicked'),
};

export const Ongoing: Story = {
  args: {
    ...baseArgs,
    status: 'ongoing',
  },
};

export const UpcomingEditable: Story = {
  args: {
    ...baseArgs,
    status: 'upcoming-editable',
    hoursLeftToEdit: 24,
    userType: 'student',
  },
};

export const UpcomingLocked: Story = {
  args: {
    ...baseArgs,
    status: 'upcoming-locked',
    userType: 'student',
  },
};

export const Ended: Story = {
  args: {
    ...baseArgs,
    status: 'ended',
    rating: 0,

    reviewText: '',

    isRecordingDownloading: true,
    callQualityRating: 0,
    userType: 'student',
  },
};

export const EndedWithCallQualityRating: Story = {
  args: {
    ...baseArgs,
    status: 'ended',
    callQualityRating: 2,
    rating: 4,

    reviewText:
      'The coaching session was fantastic! The coach was knowledgeable, supportive, and made the learning process enjoyable. I gained valuable insights and look forward to future sessions',

    isRecordingDownloading: true,
  },
};

export const Requested: Story = {
  args: {
    ...baseArgs,
    status: 'requested',
  },
};

export const Rescheduled: Story = {
  args: {
    ...baseArgs,
    status: 'rescheduled',
    previousDate: new Date('2025-03-20T10:00:00'),
    previousStartTime: '9:00',
    previousEndTime: '10:00',
  },
};

export const Canceled: Story = {
  args: {
    ...baseArgs,
    status: 'canceled',
  },
};
