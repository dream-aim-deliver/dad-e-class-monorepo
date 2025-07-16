import type { Meta, StoryObj } from '@storybook/react';
import { WeeklyCalendar } from '../lib/components/calendar/weekly-calendar';
import { AvailabilityCalendarCard } from '../lib/components/calendar/calendar-cards';

export default {
    title: 'Components/Calendar/CalendarWeekly',
    component: WeeklyCalendar,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof WeeklyCalendar>;

type Story = StoryObj<typeof WeeklyCalendar>;

export const Default: Story = {
    args: {
        currentDate: new Date(),
        setCurrentDate: (date: Date) => console.log('Current date set to:', date),
        locale: 'en',
        events: [
            {
                start: new Date('2025-07-16T10:00:00'),
                end: new Date('2025-07-16T12:15:00'),
                component: <AvailabilityCalendarCard locale="en" start={new Date('2025-07-16T10:00:00')} end={new Date('2025-07-16T12:15:00')} />,
            }
        ]
    },
};