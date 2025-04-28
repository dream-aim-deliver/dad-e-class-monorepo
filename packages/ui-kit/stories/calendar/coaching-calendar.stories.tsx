import { Meta, StoryObj } from '@storybook/react';
import Calendar from '../../lib/components/calendar/coaching-session-calendar';
import { AvailableCoachingSessions } from '../../lib/components/available-coaching-sessions/available-coaching-sessions';

// Mock dictionary for Storybook
const mockDictionary = {
  components: {
    availableCoachingSessions: {
      title: 'Available Coaching Sessions',
      noAvailableSessionText: 'No sessions available',
      loadingText: 'Loading...',
      durationMinutes: 'minutes',
      buyMoreSessions: 'Buy More Sessions',
    },
  },
};

const meta: Meta<typeof Calendar> = {
  title: 'Components/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '800px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    events: {
      control: 'object',
      description: 'Array of event objects to display on the calendar.',
    },
    coachAvailability: {
      control: 'object',
      description: 'Array of coach availability event objects.',
    },
    yourMeetings: {
      control: 'object',
      description: 'Array of user meeting event objects.',
    },
    availableCoachingSessionsData: {
      control: 'object',
      description: 'Array of coaching session objects to display in the top-right corner.',
    },
    onAddEvent: {
      action: 'addEvent',
      description: 'Callback for adding a new event.',
    },
    onUpdateEvent: {
      action: 'updateEvent',
      description: 'Callback for updating an existing event.',
    },
    onEventDrop: {
      action: 'eventDrop',
      description: 'Callback for dragging and dropping an event.',
    },
  },
};

export default meta;

const Template: StoryObj<typeof Calendar> = {
  render: (args: {
    events: typeof mockEvents;
    coachAvailability: typeof mockCoachAvailability;
    yourMeetings: typeof mockYourMeetings;
    availableCoachingSessionsData: typeof mockCoachingSessions;
    onAddEvent?: (event: any) => void;
    onUpdateEvent?: (event: any) => void;
    onEventDrop?: (event: any) => void;
  }) => (
    <div className="relative flex flex-col min-h-screen bg-background">
      {/* Container for AvailableCoachingSessions */}
      <div className="absolute top-10 right-4 z-30">
        <AvailableCoachingSessions
          locale="en"
          text="Drag these sessions to the calendar"
          availableCoachingSessionsData={args.availableCoachingSessionsData}
          onClickBuyMoreSessions={() => console.log('Buy more sessions')}
        />
      </div>

      {/* Container for Calendar with padding to avoid overlap */}
      <div className="flex-1 p-4 pt-10 pr-80">
        <Calendar {...args} />
      </div>
    </div>
  ),
};

const mockEvents = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly sync with the development team',
    start: '2025-04-28T10:00:00',
    end: '2025-04-28T12:00:00',
    attendees: 'team@example.com',
  },
  {
    id: '2',
    title: 'Project Review',
    description: 'Q1 project status review',
    start: '2025-04-29T14:00:00',
    end: '2025-04-29T17:30:00',
    attendees: 'reviewers@example.com',
  },
];

const mockCoachAvailability = [
  {
    id: '3',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-04-30T09:00:00',
    end: '2025-04-30T14:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '4',
    title: 'Coach Available 1',
    description: 'Available for coaching session 1',
    start: '2025-04-01T09:00:00',
    end: '2025-04-01T12:00:00',
    attendees: 'coach@example.com',
  },
];

const mockYourMeetings = [
  {
    id: '5',
    title: 'Your Meeting',
    description: 'Scheduled meeting with coach',
    start: '2025-04-28T13:00:00',
    end: '2025-04-28T14:00:00',
    attendees: 'user@example.com',
  },
];

const mockCoachingSessions = [
  {
    title: 'Quick Sprint',
    time: 20,
    numberOfSessions: 2,
  },
  {
    title: 'Normal Sprint',
    time: 30,
    numberOfSessions: 1,
  },
  {
    title: 'Full Immersion',
    time: 60,
    numberOfSessions: 2,
  },
];

export const Default: StoryObj<typeof Calendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    availableCoachingSessionsData: mockCoachingSessions,
    onAddEvent: (event) => console.log('Add Event:', event),
    onUpdateEvent: (event) => console.log('Update Event:', event),
    onEventDrop: (event) => console.log('Event Dropped:', event),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A default view of the Calendar component with sample events and draggable coaching sessions in the top-right corner.',
      },
    },
  },
};

export const MonthView: StoryObj<typeof Calendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    availableCoachingSessionsData: mockCoachingSessions,
    onAddEvent: (event) => console.log('Add Event:', event),
    onUpdateEvent: (event) => console.log('Update Event:', event),
    onEventDrop: (event) => console.log('Event Dropped:', event),
    // initialView: 'dayGridMonth', // Removed as it is not a valid property
  },
  parameters: {
    docs: {
      description: {
        story: 'A month view of the Calendar component.',
      },
    },
  },
};

export const Empty: StoryObj<typeof Calendar> = {
  ...Template,
  args: {
    events: [],
    coachAvailability: [],
    yourMeetings: [],
    availableCoachingSessionsData: [],
    onAddEvent: (event) => console.log('Add Event:', event),
    onUpdateEvent: (event) => console.log('Update Event:', event),
    onEventDrop: (event) => console.log('Event Dropped:', event),
  },
  parameters: {
    docs: {
      description: {
        story: 'An empty view of the Calendar component.',
      },
    },
  },
};

export const CustomEvents: StoryObj<typeof Calendar> = {
  ...Template,
  args: {
    events: [
      {
        id: '6',
        title: 'Sprint Planning',
        description: 'Planning for next sprint',
        start: '2025-04-27T09:00:00',
        end: '2025-04-27T10:30:00',
        attendees: 'planners@example.com',
      },
    ],
    coachAvailability: [
      {
        id: '7',
        title: 'Coach Available',
        description: 'Open slot for coaching',
        start: '2025-04-27T11:00:00',
        end: '2025-04-27T12:00:00',
        attendees: 'coach@example.com',
      },
    ],
    yourMeetings: [
      {
        id: '8',
        title: 'Your Meeting',
        description: 'Scheduled user meeting',
        start: '2025-04-27T14:00:00',
        end: '2025-04-27T15:00:00',
        attendees: 'user@example.com',
      },
    ],
    availableCoachingSessionsData: [
      {
        title: 'Advanced React',
        time: 90,
        numberOfSessions: 3,
      },
      {
        title: 'TypeScript Intro',
        time: 30,
        numberOfSessions: 1,
      },
    ],
    onAddEvent: (event) => console.log('Add Event:', event),
    onUpdateEvent: (event) => console.log('Update Event:', event),
    onEventDrop: (event) => console.log('Event Dropped:', event),
  },
  parameters: {
    docs: {
      description: {
        story: 'A custom view of the Calendar component with different event data.',
      },
    },
  },
};

export const Interactive: StoryObj<typeof Calendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    availableCoachingSessionsData: mockCoachingSessions,
    onAddEvent: (event) => alert(`Added Event: ${event.title}`),
    onUpdateEvent: (event) => alert(`Updated Event: ${event.title}`),
    onEventDrop: (event) =>
      alert(`Dropped Event: ${event.title} to ${new Date(event.start).toLocaleString()}`),
  },
  parameters: {
    docs: {
      description: {
        story: 'An interactive view of the Calendar component with alerts for event changes.',
      },
    },
  },
};