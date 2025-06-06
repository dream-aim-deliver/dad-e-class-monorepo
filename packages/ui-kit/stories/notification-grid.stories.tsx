import type { Meta, StoryObj } from '@storybook/react';
import { NotificationGrid } from '../lib/components/grids/notification-grid';
import { AgGridReact } from 'ag-grid-react';
import { NextIntlClientProvider } from 'next-intl';
import { useRef, useState } from 'react';
import { Button } from '../lib/components/button';

const mockMessages = {
  en: {
    components: {
      notificationGrid: {
        all: 'All',
        justdoad: 'Just Do Ad',
        bewerbeagentur: 'Bewerbeagentur',
        cms: 'CMS',
        searchPlaceholder: 'Search notifications...',
        markAllRead: 'Mark All Read',
        noNotifications: 'No notifications found',
      },
    },
  },
  de: {
    components: {
      notificationGrid: {
        all: 'Alle',
        justdoad: 'Just Do Ad',
        bewerbeagentur: 'Bewerbeagentur',
        cms: 'CMS',
        searchPlaceholder: 'Benachrichtigungen suchen...',
        markAllRead: 'Alle als gelesen markieren',
        noNotifications: 'Keine Benachrichtigungen gefunden',
      },
    },
  },
};

const meta: Meta<typeof NotificationGrid> = {
  title: 'Components/NotificationGrid',
  component: NotificationGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
    },
    variant: {
      control: 'select',
      options: ['student', 'coach', 'cms'],
    },
    loading: {
      control: 'boolean',
    },
  },
  decorators: [
    (Story, context) => {
      const gridRef = useRef<AgGridReact>(null);
      return (
        <NextIntlClientProvider
          locale={context.args.locale || 'en'}
          messages={mockMessages[context.args.locale || 'en']}
        >
          <div className="h-screen w-full p-4">
            <Story
              args={{
                ...context.args,
                gridRef: gridRef,
              }}
            />
          </div>
        </NextIntlClientProvider>
      );
    },
  ],
};

export default meta;
type Story = StoryObj<typeof NotificationGrid>;

const longMessage =
  'Coach Emma Richards accepted your coaching session request. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
const longActionText =
  'Session details. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const mockNotifications = [
  {
    message: longMessage,
    action: {
      title: 'Session details',
      url: 'https://coaching.example.com/sessions/12345',
    },
    timestamp: '2025-04-07T21:30:00.000Z',
    isRead: false,
    platform: 'justdoad',
  },
  {
    message: 'Coach Michael Johnson suggested a new date for the coaching session',
    action: {
      title: longActionText,
      url: 'https://coaching.example.com/sessions/12346',
    },
    timestamp: '2025-04-10T21:17:00.000Z',
    isRead: true,
    platform: 'justdoad',
  },
  {
    message: longMessage,
    action: {
      title: longActionText,
      url: 'https://coaching.example.com/sessions/12347',
    },
    timestamp: '2025-04-12T21:17:00.000Z',
    isRead: false,
    platform: 'justdoad',
  },
  {
    message: 'Coaching session canceled by you',
    action: {
      title: 'Session details',
      url: 'https://coaching.example.com/sessions/12348',
    },
    timestamp: '2025-04-15T21:17:00.000Z',
    isRead: true,
    platform: 'justdoad',
  },
  {
    message: 'Coaching session canceled by Coach David Martinez',
    action: {
      title: 'Session details',
      url: 'https://coaching.example.com/sessions/12349',
    },
    timestamp: '2025-04-18T21:17:00.000Z',
    isRead: false,
    platform: 'justdoad',
  },
  {
    message: 'Coach Jennifer Lee replied to your assignment in Advanced Leadership Skills',
    action: {
      title: 'View assignment',
      url: 'https://coaching.example.com/courses/leadership/assignments/89012',
    },
    timestamp: '2025-04-19T21:17:00.000Z',
    isRead: true,
    platform: 'bewerbeagentur',
  },
  {
    message: 'Coach Robert Chen marked your assignment in Data Science Fundamentals as passed',
    action: {
      title: 'View assignment',
      url: 'https://coaching.example.com/courses/data-science/assignments/45678',
    },
    timestamp: '2025-04-20T21:17:00.000Z',
    isRead: false,
    platform: 'bewerbeagentur',
  },
  {
    message: 'Coach Priya Patel has updated the shared workspaces for the group Marketing Team',
    action: {
      title: 'Group workspace',
      url: 'https://coaching.example.com/groups/marketing-team/workspace',
    },
    timestamp: '2025-04-21T21:17:00.000Z',
    isRead: true,
    platform: 'cms',
  },
  {
    message: 'Coach Thomas Wilson has updated the shared workspaces for the group Product Development',
    action: {
      title: 'Group workspace',
      url: 'https://coaching.example.com/groups/product-dev/workspace',
    },
    timestamp: '2025-04-22T21:17:00.000Z',
    isRead: false,
    platform: 'cms',
  },
  {
    message: 'Coaching session ended',
    action: {
      title: 'Rate coach',
      url: 'https://coaching.example.com/sessions/12350/feedback',
    },
    timestamp: '2025-04-23T21:17:00.000Z',
    isRead: false,
    platform: 'justdoad',
  },
];

export const StudentView: Story = {
  args: {
    notifications: mockNotifications,
    locale: 'en',
    variant: 'student',
    onNotificationClick: (notification) => {
      alert('Proceeding to ' + notification.action?.url);
    },
  },
};

export const CoachView: Story = {
  args: {
    notifications: mockNotifications,
    locale: 'en',
    variant: 'coach',
    onNotificationClick: (notification) => {
      alert('Proceeding to ' + notification.action?.url);
    },
  },
};

export const CMSView: Story = {
  args: {
    notifications: mockNotifications,
    locale: 'en',
    variant: 'cms',
    platforms: ['justdoad', 'bewerbeagentur', 'cms'],
    onNotificationClick: (notification) => {
      alert('Proceeding to ' + notification.action?.url);
    },
  },
};

export const GermanLocale: Story = {
  args: {
    notifications: mockNotifications,
    locale: 'de',
    variant: 'cms',
    platforms: ['justdoad', 'bewerbeagentur', 'cms'],
    onNotificationClick: (notification) => {
      alert('Proceeding to ' + notification.action?.url);
    },
  },
};

export const Empty: Story = {
  args: {
    notifications: [],
    locale: 'en',
    variant: 'student',
    onNotificationClick: (notification) => {
      alert('Proceeding to ' + notification.action?.url);
    },
  },
};

export const Loading: Story = {
  args: {
    notifications: [],
    locale: 'en',
    variant: 'cms',
    platforms: ['justdoad', 'bewerbeagentur', 'cms'],
    loading: true, // Enable loading state
    onNotificationClick: (notification) => {
      alert('Proceeding to ' + notification.action?.url);
    },
  },
};

const platformTabs = [
  { value: 'all', label: mockMessages.en.components.notificationGrid.all },
  { value: 'justdoad', label: mockMessages.en.components.notificationGrid.justdoad },
  { value: 'bewerbeagentur', label: mockMessages.en.components.notificationGrid.bewerbeagentur },
  { value: 'cms', label: mockMessages.en.components.notificationGrid.cms },
];

export const CMSWithTabs: Story = {
  args: {
    notifications: mockNotifications,
    locale: 'en',
    variant: 'cms',
    platforms: ['justdoad', 'bewerbeagentur', 'cms'],
    onNotificationClick: (notification) => {
      alert('Proceeding to ' + notification.action?.url);
    },
  },
  decorators: [
    (Story, context) => {
      const gridRef = useRef<AgGridReact>(null);
      const [selectedTab, setSelectedTab] = useState('all');
      const notifications = context.args.notifications || [];
      const filteredNotifications =
        selectedTab === 'all'
          ? notifications
          : notifications.filter((n) => n.platform === selectedTab);
      return (
        <NextIntlClientProvider
          locale={context.args.locale || 'en'}
          messages={mockMessages[context.args.locale || 'en']}
        >
          <div className="h-screen w-full p-4 flex flex-col">
            <div className="flex gap-2 mb-4">
              {platformTabs.map((tab) => (
                <Button
                  key={tab.value}
                  text={tab.label}
                  variant={selectedTab === tab.value ? 'primary' : 'secondary'}
                  onClick={() => setSelectedTab(tab.value)}
                />
              ))}
            </div>
            <Story
              args={{
                ...context.args,
                gridRef: gridRef,
                notifications: filteredNotifications,
              }}
            />
          </div>
        </NextIntlClientProvider>
      );
    },
  ],
};