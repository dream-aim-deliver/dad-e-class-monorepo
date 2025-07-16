import type { Meta, StoryObj } from '@storybook/react';
import { WeeklyCalendar } from '../lib/components/calendar/weekly-calendar';

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
    },
};