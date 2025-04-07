import { Meta, StoryObj } from '@storybook/react';
import { RecentActivity } from '../../lib/components/notifications/recent-activity';
import { Activity } from '../../lib/components/notifications/activity';
import { NextIntlClientProvider } from 'next-intl';

const mockMessages = {};

const mockActivities = [
  {
    message:
      'Coach Jane Smith accepted your request to reschedule the coaching session.',
    action: { title: 'Session details', url: 'https://google.com' },
    timestamp: '2024-08-07T21:17:00Z',
    isRead: false,
    platformName: 'Zoom',
    recipients: 88,
    layout: 'horizontal' as 'horizontal',
    locale: 'en',
  },
  {
    message: 'You have a new message from Coach John Doe.',
    action: { title: 'View message', url: 'https://google.com' },
    timestamp: '2024-08-07T20:45:00Z',
    isRead: true,
    layout: 'horizontal',
    locale: 'en',
  },
  {
    message: 'Your session with Coach Alice Brown has been confirmed.',
    action: { title: 'View details', url: 'https://google.com' },
    timestamp: '2024-08-07T19:30:00Z',
    isRead: false,
    platformName: 'Teams',
    recipients: 12,
    layout: 'horizontal',
    locale: 'en',
  },
  {
    message: 'Coach Bob Wilson declined your session request.',
    action: { title: 'See why', url: 'https://google.com' },
    timestamp: '2024-08-07T18:15:00Z',
    isRead: false,
    platformName: 'Google Meet',
    layout: 'horizontal',
    locale: 'en',
  },
  {
    message: 'New course materials uploaded by Coach Emma Taylor.',
    action: { title: 'Download', url: 'https://google.com' },
    timestamp: '2024-08-07T17:00:00Z',
    isRead: true,
    recipients: 50,
    layout: 'horizontal',
    locale: 'en',
  },
  {
    message: 'Session reminder: Meeting with Coach Sarah Lee tomorrow.',
    action: { title: 'Add to calendar', url: 'https://google.com' },
    timestamp: '2024-08-07T16:30:00Z',
    isRead: false,
    platformName: 'Zoom',
    layout: 'horizontal',
    locale: 'en',
  },
];

const meta: Meta<typeof RecentActivity> = {
  title: 'Components/Notifications/RecentActivity',
  component: RecentActivity,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <NextIntlClientProvider locale="en" messages={mockMessages}>
        <div className="w-full max-w-3xl">
          <Story />
        </div>
      </NextIntlClientProvider>
    ),
  ],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    maxActivities: {
      control: 'number',
    },
    onClickMarkAllAsRead: { action: 'markAllAsRead' },
    onViewAll: { action: 'viewAll' },
    className: {
      control: 'text',
    },
    variation: {
      control: 'radio',
      options: ['Pop-up', 'Feed'],
    },
    totalActivitiesCount: {
      control: 'number',
    },
  },
};

export default meta;

type Story = StoryObj<typeof RecentActivity>;

const Template: Story = {
  render: (args) => (
    <RecentActivity {...args}>
      {mockActivities.slice(0, args.totalActivitiesCount || mockActivities.length).map((activity, index) => (
        <Activity
          key={index}
          {...activity}
          onClickActivity={(url) => () => alert(`Notification clicked for URL: ${url}`)}
        />
      ))}
    </RecentActivity>
  ),
};

export const DefaultWithFiveActivities: Story = {
  ...Template,
  args: {
    locale: 'en',
    maxActivities: 3,
    totalActivitiesCount: 5,
    onClickMarkAllAsRead: () => alert('Mark all as read clicked'),
    onViewAll: () => alert('View all clicked'),
    variation: 'Pop-up',
  },
};

export const WithLimitedActivities: Story = {
  ...Template,
  args: {
    locale: 'en',
    maxActivities: 5,
    totalActivitiesCount: 3,
    onClickMarkAllAsRead: () => alert('Mark all as read clicked'),
    onViewAll: () => alert('View all clicked'),
    variation: 'Feed',
  },
};

export const WithExcessActivities: Story = {
  ...Template,
  args: {
    locale: 'en',
    maxActivities: 3,
    totalActivitiesCount: 6,
    onClickMarkAllAsRead: () => alert('Mark all as read clicked'),
    onViewAll: () => alert('View all clicked'),
    variation: 'Feed',
  },
};