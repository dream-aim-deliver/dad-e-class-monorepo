import type { Meta, StoryObj } from '@storybook/react';
import CoachingSessions from '../lib/components/coaching-sessions/coaching-sessions';
import { TLocale } from '@maany_shr/e-class-translations';
import { CoachingSessionOverviewProps } from '../lib/components/coaching-sessions/coaching-session-overview';

const meta: Meta<typeof CoachingSessions> = {
  title: 'Components/CoachingSessionComponents/CoachingSessions',
  component: CoachingSessions,
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
      description: 'Type of user viewing the sessions',
    },
    coachingSessions: {
      control: 'object',
      description: 'Array of coaching session objects',
    },
  },
};

export default meta;
type Story = StoryObj<typeof CoachingSessions>;

const mockSession: CoachingSessionOverviewProps = {
  locale: 'en' as TLocale,
  userType: 'coach',
  status: 'upcoming-editable',
  title: 'Design Principles Discussion',
  duration: 60,
  date: new Date('2025-03-20T10:00:00'),
  time: '10:00 - 11:00',
  hoursLeftToEdit: 2,
  courseName: 'Advanced Brand Identity Design',
  courseImageUrl:
    'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  groupName: 'Design Professionals',
  meetingLink:
    'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  studentName: 'John Doe',
  studentImageUrl:
    'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
  creatorName: 'Jane Smith',
  creatorImageUrl:
    'https://res.cloudinary.com/dgk9gxgk4/image/upload/v1733464948/2151206389_1_c38sda.jpg',
};

const generateMockSessions = (
  count: number,
): CoachingSessionOverviewProps[] => {
  const statuses: CoachingSessionOverviewProps['status'][] = [
    'ongoing',
    'upcoming-editable',
    'upcoming-locked',
    'ended',
    'requested',
    'rescheduled',
    'canceled',
  ];

  return Array(count)
    .fill(null)
    .map((_, index) => ({
      ...mockSession,
      title: `Session ${index + 1}`,
      date: new Date(mockSession.date.getTime() + index * 24 * 60 * 60 * 1000),
      status: statuses[index % statuses.length], // Cycle through statuses
      courseName: index % 2 === 0 ? '' : mockSession.courseName,
      goupName: index % 2 === 0 ? '' : mockSession.groupName,
    }));
};

export const Default: Story = {
  args: {
    locale: 'en',
    userType: 'coach',
    coachingSessions: generateMockSessions(10),
  },
};

export const StudentView: Story = {
  args: {
    ...Default.args,
    userType: 'student',
  },
};

export const FewSessions: Story = {
  args: {
    ...Default.args,
    coachingSessions: generateMockSessions(3),
  },
};
