import { RecentActivity } from '../../lib/components/notifications/recent-activity';
import type { Meta } from '@storybook/react';
import { ActivityProps } from '../../lib/components/notifications/activity';

const mockActivities: ActivityProps[] = [
  {
    message:
      'Coach Jane Smith accepted your request to reschedule the coaching session.',
    actionButton: 'Session details',
    dateTime: '2024-08-07 at 21:17',
    isRead: false,
    showPlatform: true,
    platformName: 'Zoom',
    showRecipients: true,
    recipients: '88 Recipients',
    onClick: () => console.log('Session details clicked for activity 1'),
  },
  {
    message: 'You have a new message from Coach John Doe.',
    actionButton: 'View message',
    dateTime: '2024-08-07 at 20:45',
    isRead: true,
    showPlatform: false,
    showRecipients: false,
    onClick: () => console.log('View message clicked for activity 2'),
  },
  {
    message: 'Your session with Coach Alice Brown has been confirmed.',
    actionButton: 'View details',
    dateTime: '2024-08-07 at 19:30',
    isRead: false,
    showPlatform: true,
    platformName: 'Teams',
    showRecipients: true,
    recipients: '12 Recipients',
    onClick: () => console.log('View details clicked for activity 3'),
  },
  {
    message: 'Coach Bob Wilson declined your session request.',
    actionButton: 'See why',
    dateTime: '2024-08-07 at 18:15',
    isRead: false,
    showPlatform: true,
    platformName: 'Google Meet',
    showRecipients: false,
    onClick: () => console.log('See why clicked for activity 4'),
  },
  {
    message: 'New course materials uploaded by Coach Emma Taylor.',
    actionButton: 'Download',
    dateTime: '2024-08-07 at 17:00',
    isRead: true,
    showPlatform: false,
    showRecipients: true,
    recipients: '50 Recipients',
    onClick: () => console.log('Download clicked for activity 5'),
  },
  {
    message: 'Session reminder: Meeting with Coach Sarah Lee tomorrow.',
    actionButton: 'Add to calendar',
    dateTime: '2024-08-07 at 16:30',
    isRead: false,
    showPlatform: true,
    platformName: 'Zoom',
    showRecipients: false,
    onClick: () => console.log('Add to calendar clicked for activity 6'),
  },
];

const meta = {
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
    onMarkAllAsRead: { action: 'markAllAsRead' },
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
  onMarkAllAsRead: () => console.log('Mark all as read clicked'),
  onViewAll: () => console.log('View all clicked'),
};

export const WithLimitedActivities = Template.bind({});
WithLimitedActivities.args = {
  locale: 'en',
  activities: mockActivities.slice(0, 3),
  maxActivities: 5,
  onMarkAllAsRead: () => console.log('Mark all as read clicked'),
  onViewAll: () => console.log('View all clicked'),
};

export const WithExcessActivities = Template.bind({});
WithExcessActivities.args = {
  locale: 'en',
  activities: mockActivities,
  maxActivities: 3,
  onMarkAllAsRead: () => console.log('Mark all as read clicked'),
  onViewAll: () => console.log('View all clicked'),
};
