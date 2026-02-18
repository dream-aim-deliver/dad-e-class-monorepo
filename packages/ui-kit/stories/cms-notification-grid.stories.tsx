import type { Meta, StoryObj } from '@storybook/react-vite';
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
        markSelectedAsRead: 'Mark Selected as Read',
        loading: 'Loading...',
        noRows: 'No notifications found',
        message: 'Message',
        action: 'Action',
        dateTime: 'Date/Time',
        new: 'New',
        page: 'Page',
        of: 'of',
        filterByType: 'Filter by type',
        all: 'All',
        received: 'Received',
        sent: 'Sent',
        type: 'Type',
        recipientsHeader: 'Recipients',
      },
      baseGrid: {
        loading: 'Loading...',
        noRows: 'No notifications found',
        page: 'Page',
        of: 'of',
      },
    },
  },
  de: {
    components: {
      notificationGrid: {
        searchPlaceholder: 'Benachrichtigungen suchen...',
        markAllAsRead: 'Alle als gelesen markieren',
        markSelectedAsRead: 'Ausgewählte als gelesen markieren',
        loading: 'Laden...',
        noRows: 'Keine Benachrichtigungen gefunden',
        message: 'Nachricht',
        action: 'Aktion',
        dateTime: 'Datum/Zeit',
        new: 'Neu',
        page: 'Seite',
        of: 'von',
        filterByType: 'Nach Typ filtern',
        all: 'Alle',
        received: 'Empfangen',
        sent: 'Gesendet',
        type: 'Typ',
        recipientsHeader: 'Empfänger',
      },
      baseGrid: {
        loading: 'Laden...',
        noRows: 'Keine Benachrichtigungen gefunden',
        page: 'Seite',
        of: 'von',
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

const generateMockReceivedNotifications = (count: number): ReceivedNotification[] => {
  const messages = [
    'Coach Emma Richards accepted your coaching session request.',
    'Coach Michael Johnson suggested a new date for the coaching session',
    'Coaching session canceled by you',
    'New assignment posted: Complete the project proposal',
    'Your submission has been graded',
    'Reminder: Upcoming exam on Friday',
    'Class schedule has been updated',
    'New course material available',
    'Discussion forum response from instructor',
    'Your attendance has been marked',
  ];

  return Array.from({ length: count }, (_, i) => ({
    id: String(i + 1),
    message: messages[i % messages.length],
    isRead: i % 3 === 0, // Every 3rd notification is read
    state: 'created' as const,
    createdAt: new Date(Date.now() - i * 3600000), // Each notification 1 hour apart
    updatedAt: new Date(Date.now() - i * 3600000),
    actionTitle: 'View Details',
    actionUrl: `https://cms.example.com/notifications/${i + 1}`,
    sendEmail: i % 2 === 0,
  }));
};

const mockReceivedNotifications: ReceivedNotification[] = generateMockReceivedNotifications(25);

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