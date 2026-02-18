import type { Meta, StoryObj } from '@storybook/react-vite';
import { MonthlyCalendar } from '../lib/components/calendar/monthly-calendar';

export default {
    title: 'Components/Calendar/CalendarMonthly',
    component: MonthlyCalendar,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof MonthlyCalendar>;

type Story = StoryObj<typeof MonthlyCalendar>;

export const English: Story = {
    args: {
        locale: 'en',
        currentDate: new Date('2025-07-01'),
        setCurrentDate: (date: Date) => {
            console.log('Current date set to:', date.toLocaleDateString());
        },
        selectedDate: new Date('2025-07-16'),
        onDateClick: (date: Date) => {
            alert('Selected date: ' + date.toLocaleDateString());
        },
        dateEvents: {
            '2025-07-16': {
                hasCoachAvailability: true,
                hasSessions: false,
            },
            '2025-07-17': {
                hasCoachAvailability: false,
                hasSessions: true,
            },
            '2025-07-18': {
                hasCoachAvailability: true,
                hasSessions: true,
            },
        }
    },
};

export const German: Story = {
    args: {
        locale: 'de',
        currentDate: new Date('2025-07-01'),
        setCurrentDate: (date: Date) => {
            console.log('Current date set to:', date.toLocaleDateString());
        },
        selectedDate: new Date('2025-07-16'),
        onDateClick: (date: Date) => {
            alert('Selected date: ' + date.toLocaleDateString());
        },
        dateEvents: {
            '2025-07-16': {
                hasCoachAvailability: true,
                hasSessions: false,
            },
            '2025-07-17': {
                hasCoachAvailability: false,
                hasSessions: true,
            },
            '2025-07-18': {
                hasCoachAvailability: true,
                hasSessions: true,
            },
        }
    },
};

export const Loading: Story = {
    args: {
        locale: 'en',
        currentDate: new Date('2025-07-01'),
        setCurrentDate: (date: Date) => {
            console.log('Current date set to:', date.toLocaleDateString());
        },
        selectedDate: new Date('2025-07-16'),
        onDateClick: (date: Date) => {
            alert('Selected date: ' + date.toLocaleDateString());
        },
        dateEvents: {
            '2025-07-16': {
                hasCoachAvailability: true,
                hasSessions: false,
            },
            '2025-07-17': {
                hasCoachAvailability: false,
                hasSessions: true,
            },
            '2025-07-18': {
                hasCoachAvailability: true,
                hasSessions: true,
            },
        },
        isLoading: true,
    },
};
