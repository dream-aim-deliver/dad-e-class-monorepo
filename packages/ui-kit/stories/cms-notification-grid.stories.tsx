import type { Meta, StoryObj } from '@storybook/react';
import type { ReceivedNotification, SentNotification } from '../lib/components/grids/cms-notification-grid';
import { AgGridReact } from 'ag-grid-react';
import { NextIntlClientProvider } from 'next-intl';
import { useRef } from 'react';
import { CMSNotificationGrid } from '../lib/components/grids/cms-notification-grid';

const mockMessages = {
  en: {
    components: {
      notificationGrid: {
        searchPlaceholder: 'Search notifications...',
        markAllAsRead: 'Mark All Read',
        loading: 'Loading...',
        noRows: 'No notifications found',
        message: 'Message',
        action: 'Action',
        dateTime: 'Date/Time',
        new: 'New',
        page: 'Page',
        of: 'of',
      },
      baseGrid: {
        loading: 'Loading...',
        noRows: 'No notifications found',
      },
    },
  },
  de: {
    components: {
      notificationGrid: {
        searchPlaceholder: 'Benachrichtigungen suchen...',
        markAllAsRead: 'Alle als gelesen markieren',
        loading: 'Laden...',
        noRows: 'Keine Benachrichtigungen gefunden',
        message: 'Nachricht',
        action: 'Aktion',
        dateTime: 'Datum/Zeit',
        new: 'Neu',
        page: 'Seite',
        of: 'von',
      },
      baseGrid: {
        loading: 'Laden...',
        noRows: 'Keine Benachrichtigungen gefunden',
      },
    },
  },
};

const meta: Meta<typeof CMSNotificationGrid> = {
  title: 'Components/CMSNotificationGrid',
  component: CMSNotificationGrid,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    locale: {
      control: 'select',
      options: ['en', 'de'],
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
type Story = StoryObj<typeof CMSNotificationGrid>;

const mockReceivedNotifications: ReceivedNotification[] = [
  {
    id: '1',
    message: 'Coach Emma Richards accepted your coaching session request.Coach Emma Richards accepted your coaching session request.Coach Emma Richards accepted your coaching session request.Coach Emma Richards accepted your coaching session request.',
    isRead: false,
    state: 'created',
    createdAt: new Date('2025-04-07T21:30:00.000Z'),
    updatedAt: new Date('2025-04-07T21:30:00.000Z'),
    actionTitle: 'View Details',
    actionUrl: 'https://cms.example.com/notifications/1',
    sendEmail: true,
  },
  {
    id: '2',
    message: 'Coach Michael Johnson suggested a new date for the coaching session',
    isRead: true,
    state: 'created',
    createdAt: new Date('2025-04-10T21:17:00.000Z'),
    updatedAt: new Date('2025-04-10T21:17:00.000Z'),
    actionTitle: 'View Details',
    actionUrl: 'https://cms.example.com/notifications/2',
    sendEmail: false,
  },
  {
    id: '3',
    message: 'Coaching session canceled by you',
    isRead: true,
    state: 'created',
    createdAt: new Date('2025-04-15T21:17:00.000Z'),
    updatedAt: new Date('2025-04-15T21:17:00.000Z'),
    actionTitle: 'View Details',
    actionUrl: 'https://cms.example.com/notifications/3',
    sendEmail: false,
  },
];

const mockSentNotifications: SentNotification[] = [
  {
    message: 'You sent a notification to students about the upcoming exam.',
    createdAt: '2025-04-08T10:00:00.000Z',
    updatedAt: '2025-04-08T10:00:00.000Z',
    actionTitle: 'View sent notification',
    actionUrl: 'https://cms.example.com/notifications/sent/1',
    sendEmail: true,
    receivers: [
      { id: 1, username: 'alice', isNotificationRead: true, notificationId: 1, name: 'Alice Johnson' },
      { id: 2, username: 'bob', isNotificationRead: false, notificationId: 1, name: 'Bob Smith' },
      { id: 3, username: 'charlie', isNotificationRead: true, notificationId: 1, name: 'Charlie Brown' },
    ],
  },
  {
    message: 'Reminder sent to all enrolled students for assignment submission.',
    createdAt: '2025-04-12T14:30:00.000Z',
    updatedAt: '2025-04-12T14:30:00.000Z',
    actionTitle: 'View sent notification',
    actionUrl: 'https://cms.example.com/notifications/sent/2',
    sendEmail: false,
    receivers: [
      { id: 4, username: 'diana', isNotificationRead: true, notificationId: 2, name: 'Diana Prince' },
      { id: 5, username: 'eve', isNotificationRead: false, notificationId: 2, name: 'Eve Adams' },
      { id: 6, username: 'frank', isNotificationRead: true, notificationId: 2, name: 'Frank Miller' },
      { id: 7, username: 'grace', isNotificationRead: true, notificationId: 2, name: 'Grace Lee' },
      { id: 8, username: 'henry', isNotificationRead: false, notificationId: 2, name: 'Henry Wilson' },
    ],
  },
];

const mockOnNotificationClick = (notification: any) => {
  console.log('Notification clicked:', notification);
  alert(`Notification clicked. Recipients: ${notification.recipients?.length || 0}`);
};

const mockOnMarkAllRead = () => {
  console.log('Mark all as read clicked');
  alert('All notifications marked as read');
};

const mockOnMarkSelectedAsRead = (ids: string[]) => {
  console.log('Mark selected as read:', ids);
  alert(`Marked notifications as read: ${ids.join(', ')}`);
};

export const Default: Story = {
  args: {
    locale: 'en',
    receivedNotifications: mockReceivedNotifications,
    sentNotifications: mockSentNotifications,
    onMarkAllRead: mockOnMarkAllRead,
    onMarkSelectedAsRead: mockOnMarkSelectedAsRead,
    loading: false,
  },
};

export const GermanLocale: Story = {
  args: {
    locale: 'de',
    receivedNotifications: mockReceivedNotifications,
    sentNotifications: mockSentNotifications,
    onMarkAllRead: mockOnMarkAllRead,
    onMarkSelectedAsRead: mockOnMarkSelectedAsRead,
    loading: false,
  },
};

export const OnlyReceived: Story = {
  args: {
    locale: 'en',
    receivedNotifications: mockReceivedNotifications,
    sentNotifications: [],
    onMarkAllRead: mockOnMarkAllRead,
    onMarkSelectedAsRead: mockOnMarkSelectedAsRead,
    loading: false,
  },
};

export const OnlySent: Story = {
  args: {
    locale: 'en',
    receivedNotifications: [],
    sentNotifications: mockSentNotifications,
    onMarkAllRead: mockOnMarkAllRead,
    onMarkSelectedAsRead: mockOnMarkSelectedAsRead,
    loading: false,
  },
};

export const Empty: Story = {
  args: {
    locale: 'en',
    receivedNotifications: [],
    sentNotifications: [],
    onMarkAllRead: mockOnMarkAllRead,
    onMarkSelectedAsRead: mockOnMarkSelectedAsRead,
    loading: false,
  },
};

export const Loading: Story = {
  args: {
    locale: 'en',
    receivedNotifications: mockReceivedNotifications,
    sentNotifications: mockSentNotifications,
    onMarkAllRead: mockOnMarkAllRead,
    onMarkSelectedAsRead: mockOnMarkSelectedAsRead,
    loading: true,
  },
};