import type { Meta, StoryObj } from '@storybook/react-vite';
import { WeeklyCalendar } from '../lib/components/calendar/weekly-calendar';
import { AnonymousCalendarCard, AvailabilityCalendarCard, SessionCalendarCard } from '../lib/components/calendar/calendar-cards';

export default {
    title: 'Components/Calendar/CalendarWeekly',
    component: WeeklyCalendar,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen',
    },
} satisfies Meta<typeof WeeklyCalendar>;

type Story = StoryObj<typeof WeeklyCalendar>;

interface CalendarEvent {
    start: Date;
    end: Date;
    component: React.ReactNode;
}

// Static session titles for supported locales
const sessionTitles = {
    'en': [
        'Team Meeting',
        'Client Call',
        'Project Review',
        'Training Session',
        'One-on-One',
        'Planning Meeting',
        'Code Review',
        'Standup',
        'Demo Session',
        'Workshop'
    ],
    'de': [
        'Team Meeting',
        'Kundengespräch',
        'Projekt Review',
        'Training Session',
        'Einzelgespräch',
        'Planungsmeeting',
        'Code Review',
        'Standup',
        'Demo Session',
        'Workshop'
    ]
};

type Locale = 'en' | 'de';

// Helper function to create a date with specific time
function createDateTime(baseDate: Date, hours: number, minutes = 0): Date {
    const date = new Date(baseDate);
    date.setHours(hours, minutes, 0, 0);
    return date;
}

// Helper function to add days to a date
function addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

// Static mock data generator
function generateMockCalendarEvents(
    locale: Locale = 'en',
    baseDate: Date = new Date()
): CalendarEvent[] {
    const events: CalendarEvent[] = [];
    const titles = sessionTitles[locale];

    // Day -2 (2 days before)
    const dayMinus2 = addDays(baseDate, -2);
    events.push(
        // Availability slot
        {
            start: createDateTime(dayMinus2, 9, 0),
            end: createDateTime(dayMinus2, 10, 30),
            component: (
                <AvailabilityCalendarCard
                    locale={locale}
                    start={createDateTime(dayMinus2, 9, 0)}
                    end={createDateTime(dayMinus2, 10, 30)}
                />
            )
        },
        // Session
        {
            start: createDateTime(dayMinus2, 14, 0),
            end: createDateTime(dayMinus2, 15, 30),
            component: (
                <SessionCalendarCard
                    locale={locale}
                    start={createDateTime(dayMinus2, 14, 0)}
                    end={createDateTime(dayMinus2, 15, 30)}
                    title={titles[0]} // Team Meeting
                />
            )
        }
    );

    // Day -1 (1 day before)
    const dayMinus1 = addDays(baseDate, -1);
    events.push(
        // Availability slots
        {
            start: createDateTime(dayMinus1, 10, 0),
            end: createDateTime(dayMinus1, 11, 0),
            component: (
                <AvailabilityCalendarCard
                    locale={locale}
                    start={createDateTime(dayMinus1, 10, 0)}
                    end={createDateTime(dayMinus1, 11, 0)}
                />
            )
        },
        {
            start: createDateTime(dayMinus1, 16, 0),
            end: createDateTime(dayMinus1, 17, 30),
            component: (
                <AvailabilityCalendarCard
                    locale={locale}
                    start={createDateTime(dayMinus1, 16, 0)}
                    end={createDateTime(dayMinus1, 17, 30)}
                />
            )
        },
        // Session
        {
            start: createDateTime(dayMinus1, 13, 0),
            end: createDateTime(dayMinus1, 14, 30),
            component: (
                <SessionCalendarCard
                    locale={locale}
                    start={createDateTime(dayMinus1, 13, 0)}
                    end={createDateTime(dayMinus1, 14, 30)}
                    title={titles[1]} // Client Call / Kundengespräch
                />
            )
        }
    );

    // Today (baseDate)
    events.push(
        // Availability slot
        {
            start: createDateTime(baseDate, 9, 30),
            end: createDateTime(baseDate, 11, 0),
            component: (
                <AvailabilityCalendarCard
                    locale={locale}
                    start={createDateTime(baseDate, 9, 30)}
                    end={createDateTime(baseDate, 11, 0)}
                />
            )
        },
        // Sessions
        {
            start: createDateTime(baseDate, 11, 30),
            end: createDateTime(baseDate, 12, 30),
            component: (
                <SessionCalendarCard
                    locale={locale}
                    start={createDateTime(baseDate, 11, 30)}
                    end={createDateTime(baseDate, 12, 30)}
                    title={titles[2]} // Project Review / Projekt Review
                />
            )
        },
        {
            start: createDateTime(baseDate, 15, 0),
            end: createDateTime(baseDate, 16, 0),
            component: (
                <SessionCalendarCard
                    locale={locale}
                    start={createDateTime(baseDate, 15, 0)}
                    end={createDateTime(baseDate, 16, 0)}
                    title={titles[3]} // Training Session
                />
            )
        }
    );

    // Day +1 (1 day after)
    const dayPlus1 = addDays(baseDate, 1);
    events.push(
        // Availability slots
        {
            start: createDateTime(dayPlus1, 8, 30),
            end: createDateTime(dayPlus1, 10, 0),
            component: (
                <AvailabilityCalendarCard
                    locale={locale}
                    start={createDateTime(dayPlus1, 8, 30)}
                    end={createDateTime(dayPlus1, 10, 0)}
                />
            )
        },
        {
            start: createDateTime(dayPlus1, 14, 30),
            end: createDateTime(dayPlus1, 16, 0),
            component: (
                <AvailabilityCalendarCard
                    locale={locale}
                    start={createDateTime(dayPlus1, 14, 30)}
                    end={createDateTime(dayPlus1, 16, 0)}
                />
            )
        },
        // Session
        {
            start: createDateTime(dayPlus1, 10, 30),
            end: createDateTime(dayPlus1, 11, 30),
            component: (
                <SessionCalendarCard
                    locale={locale}
                    start={createDateTime(dayPlus1, 10, 30)}
                    end={createDateTime(dayPlus1, 11, 30)}
                    title={titles[4]} // One-on-One / Einzelgespräch
                />
            )
        }
    );

    // Day +2 (2 days after)
    const dayPlus2 = addDays(baseDate, 2);
    events.push(
        // Availability slot
        {
            start: createDateTime(dayPlus2, 13, 0),
            end: createDateTime(dayPlus2, 15, 0),
            component: (
                <AvailabilityCalendarCard
                    locale={locale}
                    start={createDateTime(dayPlus2, 13, 0)}
                    end={createDateTime(dayPlus2, 15, 0)}
                />
            )
        },
        // Sessions
        {
            start: createDateTime(dayPlus2, 9, 0),
            end: createDateTime(dayPlus2, 10, 0),
            component: (
                <SessionCalendarCard
                    locale={locale}
                    start={createDateTime(dayPlus2, 9, 0)}
                    end={createDateTime(dayPlus2, 10, 0)}
                    title={titles[5]} // Planning Meeting / Planungsmeeting
                />
            )
        },
        {
            start: createDateTime(dayPlus2, 16, 0),
            end: createDateTime(dayPlus2, 17, 0),
            component: (
                <SessionCalendarCard
                    locale={locale}
                    start={createDateTime(dayPlus2, 16, 0)}
                    end={createDateTime(dayPlus2, 17, 0)}
                    title={titles[6]} // Code Review
                />
            )
        }
    );

    // Day +3 (3 days after)
    const dayPlus3 = addDays(baseDate, 3);
    events.push(
        // Availability slots
        {
            start: createDateTime(dayPlus3, 11, 0),
            end: createDateTime(dayPlus3, 12, 0),
            component: (
                <AvailabilityCalendarCard
                    locale={locale}
                    start={createDateTime(dayPlus3, 11, 0)}
                    end={createDateTime(dayPlus3, 12, 0)}
                />
            )
        },
        {
            start: createDateTime(dayPlus3, 15, 30),
            end: createDateTime(dayPlus3, 17, 0),
            component: (
                <AvailabilityCalendarCard
                    locale={locale}
                    start={createDateTime(dayPlus3, 15, 30)}
                    end={createDateTime(dayPlus3, 17, 0)}
                />
            )
        },
        // Session
        {
            start: createDateTime(dayPlus3, 9, 30),
            end: createDateTime(dayPlus3, 10, 30),
            component: (
                <SessionCalendarCard
                    locale={locale}
                    start={createDateTime(dayPlus3, 9, 30)}
                    end={createDateTime(dayPlus3, 10, 30)}
                    title={titles[7]} // Standup
                />
            )
        }
    );

    // Sort events by start time
    return events.sort((a, b) => a.start.getTime() - b.start.getTime());
}

// Predefined scenarios with static data
const mockDataScenarios = {
    // Light schedule - fewer events
    light: (locale: Locale = 'en', baseDate: Date = new Date()): CalendarEvent[] => {
        const events: CalendarEvent[] = [];
        const titles = sessionTitles[locale];

        // Today - minimal events
        events.push(
            {
                start: createDateTime(baseDate, 10, 0),
                end: createDateTime(baseDate, 11, 30),
                component: (
                    <AvailabilityCalendarCard
                        locale={locale}
                        start={createDateTime(baseDate, 10, 0)}
                        end={createDateTime(baseDate, 11, 30)}
                    />
                )
            },
            {
                start: createDateTime(baseDate, 14, 0),
                end: createDateTime(baseDate, 15, 0),
                component: (
                    <SessionCalendarCard
                        locale={locale}
                        start={createDateTime(baseDate, 14, 0)}
                        end={createDateTime(baseDate, 15, 0)}
                        title={titles[0]} // Team Meeting
                    />
                )
            },
            {
                start: createDateTime(baseDate, 15, 15),
                end: createDateTime(baseDate, 16, 45),
                component: (
                    <AnonymousCalendarCard
                        locale={locale}
                        start={createDateTime(baseDate, 15, 15)}
                        end={createDateTime(baseDate, 16, 45)}
                    />
                )
            }
        );

        // Tomorrow
        const tomorrow = addDays(baseDate, 1);
        events.push(
            {
                start: createDateTime(tomorrow, 9, 0),
                end: createDateTime(tomorrow, 12, 0),
                component: (
                    <AvailabilityCalendarCard
                        locale={locale}
                        start={createDateTime(tomorrow, 9, 0)}
                        end={createDateTime(tomorrow, 12, 0)}
                    />
                )
            },
            {
                start: createDateTime(tomorrow, 10, 15),
                end: createDateTime(tomorrow, 11, 39),
                component: (
                    <SessionCalendarCard
                        locale={locale}
                        start={createDateTime(tomorrow, 10, 15)}
                        end={createDateTime(tomorrow, 11, 30)}
                        title={titles[1]}
                        onClick={() => console.log('Session clicked')}
                    />
                )
            }
        );

        return events.sort((a, b) => a.start.getTime() - b.start.getTime());
    },

    // Busy schedule - many events
    busy: (locale: Locale = 'en', baseDate: Date = new Date()): CalendarEvent[] => {
        const events: CalendarEvent[] = [];
        const titles = sessionTitles[locale];

        // Today - packed schedule
        events.push(
            {
                start: createDateTime(baseDate, 9, 0),
                end: createDateTime(baseDate, 10, 0),
                component: (
                    <SessionCalendarCard
                        locale={locale}
                        start={createDateTime(baseDate, 9, 0)}
                        end={createDateTime(baseDate, 10, 0)}
                        title={titles[7]} // Standup
                    />
                )
            },
            {
                start: createDateTime(baseDate, 10, 30),
                end: createDateTime(baseDate, 11, 30),
                component: (
                    <SessionCalendarCard
                        locale={locale}
                        start={createDateTime(baseDate, 10, 30)}
                        end={createDateTime(baseDate, 11, 30)}
                        title={titles[0]} // Team Meeting
                    />
                )
            },
            {
                start: createDateTime(baseDate, 13, 0),
                end: createDateTime(baseDate, 14, 0),
                component: (
                    <SessionCalendarCard
                        locale={locale}
                        start={createDateTime(baseDate, 13, 0)}
                        end={createDateTime(baseDate, 14, 0)}
                        title={titles[1]} // Client Call
                    />
                )
            },
            {
                start: createDateTime(baseDate, 14, 30),
                end: createDateTime(baseDate, 16, 0),
                component: (
                    <SessionCalendarCard
                        locale={locale}
                        start={createDateTime(baseDate, 14, 30)}
                        end={createDateTime(baseDate, 16, 0)}
                        title={titles[2]} // Project Review
                    />
                )
            },
            {
                start: createDateTime(baseDate, 16, 30),
                end: createDateTime(baseDate, 17, 0),
                component: (
                    <AvailabilityCalendarCard
                        locale={locale}
                        start={createDateTime(baseDate, 16, 30)}
                        end={createDateTime(baseDate, 17, 0)}
                    />
                )
            }
        );

        return events.sort((a, b) => a.start.getTime() - b.start.getTime());
    }
};

export const EnglishNoEvents: Story = {
    args: {
        currentDate: new Date(),
        setCurrentDate: (date: Date) => console.log('Current date set to:', date),
        locale: 'en',
        events: []
    },
};

export const GermanNoEvents: Story = {
    args: {
        currentDate: new Date(),
        setCurrentDate: (date: Date) => console.log('Aktuelles Datum gesetzt auf:', date),
        locale: 'de',
        events: []
    },
};

export const EnglishLightSchedule: Story = {
    args: {
        currentDate: new Date(),
        setCurrentDate: (date: Date) => console.log('Current date set to:', date),
        locale: 'en',
        events: mockDataScenarios.light('en')
    },
}

export const GermanLightSchedule: Story = {
    args: {
        currentDate: new Date(),
        setCurrentDate: (date: Date) => console.log('Aktuelles Datum gesetzt auf:', date),
        locale: 'de',
        events: mockDataScenarios.light('de')
    },
};

export const EnglishBusySchedule: Story = {
    args: {
        currentDate: new Date(),
        setCurrentDate: (date: Date) => console.log('Current date set to:', date),
        locale: 'en',
        events: mockDataScenarios.busy('en')
    },
}

export const GermanBusySchedule: Story = {
    args: {
        currentDate: new Date(),
        setCurrentDate: (date: Date) => console.log('Aktuelles Datum gesetzt auf:', date),
        locale: 'de',
        events: mockDataScenarios.busy('de')
    },
};

export const Loading: Story = {
    args: {
        currentDate: new Date(),
        setCurrentDate: (date: Date) => console.log('Current date set to:', date),
        locale: 'en',
        events: mockDataScenarios.busy('en'),
        isLoading: true,
    },
}
