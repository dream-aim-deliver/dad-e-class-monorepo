import type { Meta, StoryObj } from '@storybook/react';
import { NotificationGrid } from '../lib/components/grids/notification-grid';

const meta: Meta<typeof NotificationGrid> = {
    title: 'Components/NotificationGrid',
    component: NotificationGrid,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen'
    },
    decorators: [
        (Story) => (
            <div className="h-screen w-full p-4">
                <Story />
            </div>
        )
    ]
};

export default meta;
type Story = StoryObj<typeof NotificationGrid>;

const longMessage = 'Coach Emma Richards accepted your coaching session request. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
const longActionText = 'Session details. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';

const mockNotifications = [
    {
        message: longMessage,
        action: {
            title: 'Session details',
            url: 'https://coaching.example.com/sessions/12345'
        },
        timestamp: '2025-04-07T21:30:00.000Z',
        isRead: false
    },
    {
        message: 'Coach Michael Johnson suggested a new date for the coaching session',
        action: {
            title: longActionText,
            url: 'https://coaching.example.com/sessions/12346'
        },
        timestamp: '2025-04-10T21:17:00.000Z',
        isRead: true
    },
    {
        message: longMessage,
        action: {
            title: longActionText,
            url: 'https://coaching.example.com/sessions/12347'
        },
        timestamp: '2025-04-12T21:17:00.000Z',
        isRead: false
    },
    {
        message: 'Coaching session canceled by you',
        action: {
            title: 'Session details',
            url: 'https://coaching.example.com/sessions/12348'
        },
        timestamp: '2025-04-15T21:17:00.000Z',
        isRead: true
    },
    {
        message: 'Coaching session canceled by Coach David Martinez',
        action: {
            title: 'Session details',
            url: 'https://coaching.example.com/sessions/12349'
        },
        timestamp: '2025-04-18T21:17:00.000Z',
        isRead: false
    },
    {
        message: 'Coach Jennifer Lee replied to your assignment in Advanced Leadership Skills',
        action: {
            title: 'View assignment',
            url: 'https://coaching.example.com/courses/leadership/assignments/89012'
        },
        timestamp: '2025-04-19T21:17:00.000Z',
        isRead: true
    },
    {
        message: 'Coach Robert Chen marked your assignment in Data Science Fundamentals as passed',
        action: {
            title: 'View assignment',
            url: 'https://coaching.example.com/courses/data-science/assignments/45678'
        },
        timestamp: '2025-04-20T21:17:00.000Z',
        isRead: false
    },
    {
        message: 'Coach Priya Patel has updated the shared workspace for the group Marketing Team',
        action: {
            title: 'Group workspace',
            url: 'https://coaching.example.com/groups/marketing-team/workspace'
        },
        timestamp: '2025-04-21T21:17:00.000Z',
        isRead: true
    },
    {
        message: 'Coach Thomas Wilson has updated the shared workspace for the group Product Development',
        action: {
            title: 'Group workspace',
            url: 'https://coaching.example.com/groups/product-dev/workspace'
        },
        timestamp: '2025-04-22T21:17:00.000Z',
        isRead: false
    },
    {
        message: 'Coaching session ended',
        action: {
            title: 'Rate coach',
            url: 'https://coaching.example.com/sessions/12350/feedback'
        },
        timestamp: '2025-04-23T21:17:00.000Z',
        isRead: false
    }
];

export const Default: Story = {
    args: {
        notifications: [...mockNotifications, ...mockNotifications.reverse()],
        onNotificationClick: (notification) => {
            alert('Proceeding to ' + notification.action.url);
        }
    }
};
