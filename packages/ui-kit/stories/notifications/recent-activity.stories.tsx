import { RecentActivity } from '../../lib/components/notifications/recent-activity';
import type { Meta } from '@storybook/react';
import { ActivityProps } from '../../lib/components/notifications/activity';

const mockActivities: ActivityProps[] = [
  {
    message:
      'Coach Jane Smith accepted your request to reschedule the coaching session.',
    action: { title: 'Session details' , url: 'https://google.com' },
    timestamp: '2024-08-07T21:17:00Z',
    isRead: false,
    platformName: 'Zoom',
    recipients: 88,
    layout: 'horizontal',
    locale: 'en'
  },
  {
    message: 'You have a new message from Coach John Doe.',
    action: { title: 'View message' , url: 'https://google.com' },
    timestamp: '2024-08-07T20:45:00Z',
    isRead: true,
    recipients: undefined,
    layout: 'horizontal',
    locale: 'en'
  },
  {
    message: 'Your session with Coach Alice Brown has been confirmed.',
    action: { title: 'View details' , url: 'https://google.com' },
    timestamp: '2024-08-07T19:30:00Z',
    isRead: false,
    platformName: 'Teams',
    recipients: 12,
    layout: 'horizontal',
    locale: 'en'
  },
  {
    message: 'Coach Bob Wilson declined your session request.',
    action: { title: 'See why' , url: 'https://google.com' },
    timestamp: '2024-08-07T18:15:00Z',
    isRead: false,
    platformName: 'Google Meet',
    recipients: undefined,
    layout: 'horizontal',
    locale: 'en'
  },
  {
    message: 'New course materials uploaded by Coach Emma Taylor.',
    action: { title: 'Download' , url: 'https://google.com' },
    timestamp: '2024-08-07T17:00:00Z',
    isRead: true,
    recipients: 50,
    layout: 'horizontal',
    locale: 'en'
  },
  {
    message:
      'Session reminder: Meeting with Coach Sarah Lee tomorrow.',
    action: { title: 'Add to calendar' , url: 'https://google.com' },
    timestamp: '2024-08-07T16:30:00Z',
    isRead: false,
    platformName: 'Zoom',
    recipients: undefined,
    layout: 'horizontal',
    locale: 'en',
  },
];

const meta: Meta<typeof RecentActivity> = {
  title: 'Components/Notifications/RecentActivity',
  component: RecentActivity,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    activities: {
      control: 'object',
    },
    maxActivities: {
      control: 'number',
    },
    onClickMarkAllAsRead: { action: 'markAllAsRead' },
    onViewAll: { action: 'viewAll' },
    className: {
      control: 'text',
    },
  },
} as Meta;

export default meta;

const Template = (args) => <RecentActivity {...args} />;

export const DefaultWithFiveActivities = Template.bind({});
DefaultWithFiveActivities.args = {
  locale: 'en',
  activities: mockActivities,
  maxActivities: 3,
  onClickMarkAllAsRead: () => alert('Mark all as read clicked'),
  onViewAll: () => alert('View all clicked'),
  variation: 'Pop-up',
};

export const WithLimitedActivities = Template.bind({});
WithLimitedActivities.args = {
  locale: 'en',
  activities: mockActivities.slice(0, 3),
  maxActivities: 5,
  onClickMarkAllAsRead: () => alert('Mark all as read clicked'),
  onViewAll: () => alert('View all clicked'),
  variation: 'Feed',
};

export const WithExcessActivities = Template.bind({});
WithExcessActivities.args = {
  locale: 'en',
  activities: mockActivities,
  maxActivities: 3,
  onClickMarkAllAsRead: () => alert('Mark all as read clicked'),
  onViewAll: () => alert('View all clicked'),
  variation: 'Feed',
};
