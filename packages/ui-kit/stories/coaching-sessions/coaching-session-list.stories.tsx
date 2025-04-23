import type { Meta, StoryObj } from '@storybook/react';
import { CoachingSessionList } from '../../lib/components/coaching-sessions/coaching-session-list'
import { TLocale } from '@maany_shr/e-class-translations';
import { CoachingSessionCard, CoachingSessionCardProps } from '../../lib/components/coaching-sessions/coaching-session-card';

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

// Create mock session data
const mockSession: CoachingSessionCardProps = {
  locale: 'en' as TLocale,
  userType: 'coach',
  status: 'upcoming-editable',
  title: 'Design Principles Discussion',
  duration: 60,
  date: new Date(),
  startTime: '10:00',
  endTime: '11:00',
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
  userType: 'coach' | 'student',
  locale: TLocale,
): CoachingSessionCardProps[] => {
  const statuses: CoachingSessionCardProps['status'][] = [
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
      locale,
      userType,
      title: `Session ${index + 1}`,
      date: new Date(mockSession.date.getTime() + index * 24 * 60 * 60 * 1000),
      status: statuses[index % statuses.length],
      previousDate: statuses[index % statuses.length] === 'rescheduled' ? new Date() : undefined,
      previousStartTime: statuses[index % statuses.length] === 'rescheduled' ? '10:00' : undefined,
      previousEndTime: statuses[index % statuses.length] === 'rescheduled' ? '11:00' : undefined,
      courseName: index % 2 === 0 ? '' : mockSession.courseName,
      groupName: index % 2 === 0 ? '' : mockSession.groupName,
      studentName: userType === 'coach' ? `Student ${index + 1}` : undefined,
      creatorName: userType === 'student' ? `Coach ${index + 1}` : undefined,
    }));
};

export const Default: Story = {
  render: ({ locale }) => {
    const sessions = generateMockSessions(6, 'coach', locale as TLocale);
    return (
      <CoachingSessionList locale={locale as TLocale}>
        {sessions.map((session, idx) => (
          <CoachingSessionCard key={session.title + idx} {...session} userType='coach' />
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
    const sessions = generateMockSessions(6, 'student', locale as TLocale);
    return (
      <CoachingSessionList locale={locale as TLocale}>
        {sessions.map((session, idx) => (
          <CoachingSessionCard key={session.title + idx} {...session} />
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
    const sessions = generateMockSessions(3, 'coach', locale as TLocale);
    return (
      <CoachingSessionList locale={locale as TLocale}>
        {sessions.map((session, idx) => (
          <CoachingSessionCard key={session.title + idx} {...session} />
        ))}
      </CoachingSessionList>
    );
  },
  args: {
    locale: 'en',
  },
};
