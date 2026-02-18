import type { Meta, StoryObj } from '@storybook/react-vite';
import { CoachingSessionGrid } from '../lib/components/grids/coaching-session-grid';
import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react';
import { NextIntlClientProvider } from 'next-intl';
import { TStudentCoachingSession } from '@maany_shr/e-class-models/src/usecase-models/common';

const mockMessages = {
    en: {
        pages: {
            coachingSessions: {
                exportButton: 'Export',
            },
        },
    },
    de: {
        pages: {
            coachingSessions: {
                exportButton: 'Exportieren',
            },
        },
    },
};

const meta: Meta<typeof CoachingSessionGrid> = {
    title: 'Components/CoachingSessionGrid',
    component: CoachingSessionGrid,
    tags: ['autodocs'],
    parameters: {
        layout: 'fullscreen'
    },
    argTypes: {
        locale: {
            control: 'select',
            options: ['en', 'de'],
        },
        enableSelection: {
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
                        <Story args={{
                            ...context.args,
                            gridRef: gridRef
                        }} />
                    </div>
                </NextIntlClientProvider>
            );
        }
    ]
};

const mockCoachingSessions: TStudentCoachingSession[] = [
    {
        id: 1,
        coachingOfferingTitle: 'Introduction to React Fundamentals',
        coachingOfferingDuration: 60,
        status: 'completed',
        startTime: '2024-01-15T10:00:00.000Z',
        endTime: '2024-01-15T11:00:00.000Z',
        coach: {
            name: 'Sarah',
            surname: 'Chen',
            username: 'sarah.chen',
            avatarUrl: null
        },
        student: {
            id: 101,
            username: 'john.doe',
            name: 'John',
            surname: 'Doe'
        },
        course: {
            id: 1,
            title: 'React Development Bootcamp',
            slug: 'react-bootcamp'
        },
        coupon: {
            code: 'REACT20',
            discount: 20
        },
        meetingUrl: 'https://meet.example.com/session1',
        rating: 4.5
    },
    {
        id: 2,
        coachingOfferingTitle: 'Advanced TypeScript Patterns',
        coachingOfferingDuration: 90,
        status: 'scheduled',
        startTime: '2024-01-16T14:30:00.000Z',
        endTime: '2024-01-16T16:00:00.000Z',
        coach: {
            name: 'Michael',
            surname: 'Davis',
            username: 'michael.davis',
            avatarUrl: null
        },
        student: {
            id: 102,
            username: 'jane.smith',
            name: 'Jane',
            surname: 'Smith'
        },
        course: {
            id: 2,
            title: 'TypeScript Mastery Course',
            slug: 'typescript-mastery'
        },
        meetingUrl: 'https://meet.example.com/session2'
    },
    {
        id: 3,
        coachingOfferingTitle: 'Database Design Principles',
        coachingOfferingDuration: 45,
        status: 'completed',
        startTime: '2024-01-17T09:15:00.000Z',
        endTime: '2024-01-17T10:00:00.000Z',
        coach: {
            name: 'Sarah',
            surname: 'Chen',
            username: 'sarah.chen',
            avatarUrl: null
        },
        student: {
            id: 103,
            username: 'alex.johnson',
            name: 'Alex',
            surname: 'Johnson'
        },
        course: {
            id: 3,
            title: 'Database Systems Fundamentals',
            slug: 'database-fundamentals'
        },
        coupon: {
            code: 'DB15',
            discount: 15
        },
        meetingUrl: 'https://meet.example.com/session3',
        rating: 5.0
    },
    {
        id: 4,
        coachingOfferingTitle: 'Python Data Science Workshop',
        coachingOfferingDuration: 120,
        status: 'requested',
        startTime: '2024-01-18T16:00:00.000Z',
        endTime: '2024-01-18T18:00:00.000Z',
        coach: {
            name: 'Emily',
            surname: 'Rodriguez',
            username: 'emily.rodriguez',
            avatarUrl: null
        },
        student: {
            id: 104,
            username: 'maria.garcia',
            name: 'Maria',
            surname: 'Garcia'
        },
        course: {
            id: 4,
            title: 'Data Science with Python',
            slug: 'python-data-science'
        },
        meetingUrl: 'https://meet.example.com/session4'
    },
    {
        id: 5,
        coachingOfferingTitle: 'UI/UX Design Fundamentals',
        coachingOfferingDuration: 75,
        status: 'canceled',
        startTime: '2024-01-19T11:30:00.000Z',
        endTime: '2024-01-19T12:45:00.000Z',
        coach: {
            name: 'Lisa',
            surname: 'Thompson',
            username: 'lisa.thompson',
            avatarUrl: null
        },
        student: {
            id: 105,
            username: 'david.wilson',
            name: 'David',
            surname: 'Wilson'
        },
        course: {
            id: 5,
            title: 'User Experience Design',
            slug: 'ux-design-fundamentals'
        },
        meetingUrl: 'https://meet.example.com/session5'
    },
    {
        id: 6,
        coachingOfferingTitle: 'Cloud Architecture Overview',
        coachingOfferingDuration: 60,
        status: 'completed',
        startTime: '2024-01-20T13:00:00.000Z',
        endTime: '2024-01-20T14:00:00.000Z',
        coach: {
            name: 'Michael',
            surname: 'Davis',
            username: 'michael.davis',
            avatarUrl: null
        },
        student: {
            id: 106,
            username: 'emma.brown',
            name: 'Emma',
            surname: 'Brown'
        },
        course: {
            id: 6,
            title: 'Cloud Computing Essentials',
            slug: 'cloud-essentials'
        },
        coupon: {
            code: 'CLOUD25',
            discount: 25
        },
        meetingUrl: 'https://meet.example.com/session6',
        rating: 4.0
    }
]; export default meta;
type Story = StoryObj<typeof CoachingSessionGrid>;

export const Default: Story = {
    args: {
        sessions: mockCoachingSessions,
        locale: 'en',
        onSessionDetailsClick: (session) => {
            alert(`View details for session: ${session.coachingOfferingTitle}`);
        },
        onCoachClick: (coach) => {
            alert(`View coach: ${coach.name} ${coach.surname}`);
        }
    }
};

export const GermanLocale: Story = {
    args: {
        sessions: mockCoachingSessions,
        locale: 'de',
        onSessionDetailsClick: (session) => {
            alert(`Details anzeigen für Session: ${session.coachingOfferingTitle}`);
        },
        onCoachClick: (coach) => {
            alert(`Coach anzeigen: ${coach.name} ${coach.surname}`);
        }
    }
};

export const Empty: Story = {
    args: {
        sessions: [],
        locale: 'en',
        onSessionDetailsClick: (session) => {
            alert(`View details for session: ${session.coachingOfferingTitle}`);
        },
        onCoachClick: (coach) => {
            alert(`View coach: ${coach.name} ${coach.surname}`);
        }
    }
};

export const WithSelectionEnabled: Story = {
    args: {
        sessions: mockCoachingSessions,
        locale: 'en',
        enableSelection: true,
        onSessionDetailsClick: (session) => {
            alert(`View details for session: ${session.coachingOfferingTitle}`);
        },
        onCoachClick: (coach) => {
            alert(`View coach: ${coach.name} ${coach.surname}`);
        },
        onSendReminders: (sessionIds) => {
            alert(`Send reminders to sessions: ${sessionIds.join(', ')}`);
        }
    }
};

export const CompletedSessionsOnly: Story = {
    args: {
        sessions: mockCoachingSessions.filter(session => session.status === 'completed'),
        locale: 'en',
        onSessionDetailsClick: (session) => {
            alert(`View details for session: ${session.coachingOfferingTitle}`);
        },
        onCoachClick: (coach) => {
            alert(`View coach: ${coach.name} ${coach.surname}`);
        }
    }
};

export const ScheduledSessionsOnly: Story = {
    args: {
        sessions: mockCoachingSessions.filter(session => session.status === 'scheduled'),
        locale: 'en',
        onSessionDetailsClick: (session) => {
            alert(`View details for session: ${session.coachingOfferingTitle}`);
        },
        onCoachClick: (coach) => {
            alert(`View coach: ${coach.name} ${coach.surname}`);
        }
    }
};