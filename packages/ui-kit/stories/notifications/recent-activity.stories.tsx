import { Meta, StoryObj } from '@storybook/react';
import {
  RecentActivity,
  RecentActivityProps,
} from '../../lib/components/notifications/recent-activity';
import { NextIntlClientProvider } from 'next-intl';

const mockMessages = {
  components: {
    recentActivity: {
      recentActivity: 'Recent Activity',
      markAllAsRead: 'Mark all as read',
      viewAll: 'View all',
    },
  },
};

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
  argTypes: {
    locale: { control: 'text' },
    activities: { control: 'object' },
    maxActivities: { control: 'number' },
    onMarkAllAsRead: { action: 'marked all as read' },
    onViewAll: { action: 'viewed all' },
  },
};

export default meta;

type Story = StoryObj<typeof RecentActivity>;

const Template: Story = {
  render: (args) => <RecentActivity {...args} />,
};

const mockActivities = [
  {
    message:
      'Coach John Doe accepted your request to reschedule the coaching session.',
    actionButton: 'Session details',
    dateTime: '2024-08-07 at 21:17',
  },
  {
    message: 'New message from Jane Smith',
    actionButton: 'View message',
    dateTime: '2024-08-06 at 15:30',
  },
  {
    message: 'Your report has been approved',
    actionButton: 'View report',
    dateTime: '2024-08-05 at 09:45',
  },
];

export const Default: Story = {
  ...Template,
  args: {
    locale: 'en',
    activities: mockActivities,
    maxActivities: 5,
  },
};

export const WithLimitedActivities: Story = {
  ...Template,
  args: {
    ...Default.args,
    maxActivities: 2,
  },
};

export const Empty: Story = {
  ...Template,
  args: {
    ...Default.args,
    activities: [],
  },
};

export const WithManyActivities: Story = {
  ...Template,
  args: {
    ...Default.args,
    activities: [...mockActivities, ...mockActivities, ...mockActivities],
    maxActivities: 3,
  },
};
