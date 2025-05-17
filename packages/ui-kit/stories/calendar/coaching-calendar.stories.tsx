import { Meta, StoryObj } from '@storybook/react';
import CoachingSessionCalendar from '../../lib/components/calendar/coaching-session-calendar';
import { Button } from '../../lib/components/button';
import React, { useEffect } from 'react';
import { ScheduleSession } from '../../lib/components/calendar/schedule-session';
import { AvailableCoachingSessions } from '../../lib/components/available-coaching-sessions/available-coaching-sessions';
import { getDictionary, locales } from '@maany_shr/e-class-translations';

const meta: Meta<typeof CoachingSessionCalendar> = {
  title: 'Components/CoachingSessionCalendar',
  component: CoachingSessionCalendar,
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
      description: 'Array of coaching session objects for drag-and-drop (dragAndDrop variant only).',
    },
    onAddEvent: {
      action: 'addEvent',
      description: 'Callback for adding a new event.',
    },
    onEventDrop: {
      action: 'eventDrop',
      description: 'Callback for dragging and dropping an event.',
    },
    variant: {
      control: 'select',
      options: ['dragAndDrop', 'clickToSchedule'],
      description: 'Determines the calendar behavior: dragAndDrop for external session dragging, clickToSchedule for hover and click scheduling.',
    },
    locale: {
      control: 'select',
      options: ['en', 'de'],
      defaultValue: 'en',
      description: 'The locale for the component (e.g., for date formatting and translations).',
    },
  },
};

export default meta;

type Event = {
  id: string;
  title: string;
  start: string;
  end: string;
  extendedProps?: {
    coachingSessionId?: string;
  };
};

type BaseEvent = {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  attendees?: string;
};

type CalendarEvent = {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  attendees?: string;
};

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    description: 'Weekly sync with the development team',
    start: '2025-05-06T10:00:00',
    end: '2025-05-06T12:00:00',
    attendees: 'team@example.com',
  },
  {
    id: '2',
    title: 'Project Review',
    description: 'Q2 project status review',
    start: '2025-05-07T14:00:00',
    end: '2025-05-07T15:30:00',
    attendees: 'reviewers@example.com',
  },
];

const mockCoachAvailability: BaseEvent[] = [
  {
    id: '3',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-05-06T09:00:00',
    end: '2025-05-06T11:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '4',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-05-07T13:00:00',
    end: '2025-05-07T15:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '5',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-05-08T10:00:00',
    end: '2025-05-08T12:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '6',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-05-09T14:00:00',
    end: '2025-05-09T16:00:00',
    attendees: 'coach@example.com',
  },
];

const mockYourMeetings: BaseEvent[] = [
  {
    id: '7',
    title: 'Your Meeting',
    description: 'Scheduled meeting with coach',
    start: '2025-05-06T13:00:00',
    end: '2025-05-06T14:00:00',
    attendees: 'user@example.com',
  },
];

const mockCoachingSessions = [
  {
    id: '1',
    title: 'Quick Sprint',
    time: 20,
    numberOfSessions: 2,
  },
  {
    id: '2',
    title: 'Normal Sprint',
    time: 30,
    numberOfSessions: 1,
  },
  {
    id: '3',
    title: 'Full Immersion',
    time: 60,
    numberOfSessions: 2,
  },
];

const Template: StoryObj<typeof CoachingSessionCalendar> = {
  render: (args: {
    events: typeof mockEvents;
    coachAvailability: typeof mockCoachAvailability;
    yourMeetings: typeof mockYourMeetings;
    availableCoachingSessionsData?: typeof mockCoachingSessions;
    onAddEvent?: (event: Event) => void;
    onEventDrop?: (event: Event) => void;
    variant: 'dragAndDrop' | 'clickToSchedule';
    locale: 'en' | 'de';
  }) => {
    const [isScheduleSessionOpen, setIsScheduleSessionOpen] = React.useState(false);
    const [scheduleSessionData, setScheduleSessionData] = React.useState<{
      date: Date;
      time: string;
      title: string;
      coachingSessionId?: string;
    } | null>(null);

    const handleOpenSessions = () => {
      const now = new Date();
      setScheduleSessionData({
        date: now,
        time: `${now.getHours().toString().padStart(2, '0')}:${now
          .getMinutes()
          .toString
          .toString().padStart(2, '0')}`,
        title: 'Coaching Session',
        coachingSessionId: `session-${Date.now()}`,
      });
      setIsScheduleSessionOpen(true);
    };

    const handleSendRequest = () => {
      if (!scheduleSessionData) return;

      const { date, time, title, coachingSessionId: sessionId } = scheduleSessionData;
      const [hours, minutes] = time.split(':').map(Number);
      const start = new Date(date);
      start.setHours(hours, minutes);
      const end = new Date(start);
      end.setHours(hours + 1, minutes);

      const newEvent: Event = {
        id: Date.now().toString(),
        title,
        start: start.toISOString(),
        end: end.toISOString(),
        extendedProps: { coachingSessionId: sessionId },
      };

      args.onAddEvent?.(newEvent);
      setIsScheduleSessionOpen(false);
      setScheduleSessionData(null);
    };

    const handleBuyMoreSessions = () => {
      console.log('Buy more sessions');
    };

    // Fetch dictionary based on the selected locale
    const dictionary = getDictionary(args.locale);

    const handleInvalidDrop = () => {
      if (args.variant === 'dragAndDrop') {
        alert( 'Cannot schedule session: No coach availability for this time slot.');
      }
    };

    useEffect(() => {
      window.addEventListener('invalidSessionDrop' as any, handleInvalidDrop);
      return () => {
        window.removeEventListener('invalidSessionDrop' as any, handleInvalidDrop);
      };
    }, [args.variant, args.locale]);

    const noop = () => console.log('No operation performed');

    return (
      <div className="flex flex-col min-h-screen bg-background p-4">
        {args.variant === 'clickToSchedule' && (
          <div className="flex justify-end mb-4">
            <Button
              onClick={handleOpenSessions}
              variant="secondary"
              size="medium"
              text={dictionary.components.calendar.scheduleSession}
            />
          </div>
        )}

        {args.variant === 'dragAndDrop' && args.availableCoachingSessionsData ? (
          <div className="flex flex-row gap-4">
            <div className="flex-grow">
              <CoachingSessionCalendar
                {...args}
                locale={args.locale}
                onAddEvent={args.onAddEvent || noop}
                onEventDrop={args.onEventDrop || noop}
              />
            </div>
            <div className="w-64">
              <AvailableCoachingSessions
                locale={args.locale}
                text={ 'Drag these sessions to the calendar'}
                availableCoachingSessionsData={args.availableCoachingSessionsData}
                onClickBuyMoreSessions={handleBuyMoreSessions}
              />
            </div>
          </div>
        ) : (
          <div className="flex-1">
            <CoachingSessionCalendar
              {...args}
              locale={args.locale}
              onAddEvent={args.onAddEvent || noop}
              onEventDrop={args.onEventDrop || noop}
            />
          </div>
        )}

        {isScheduleSessionOpen && scheduleSessionData && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-10 z-50 backdrop-blur-xs">
            <div className="bg-card-fill p-6 rounded-md border border-card-stroke max-w-[320px] w-full">
              <ScheduleSession
                user="student"
                isError={false}
                groupSession={true}
                coachName="John Doe"
                groupName="Group A"
                courseTitle="Course Title"
                course={true}
                dateValue={scheduleSessionData.date}
                timeValue={scheduleSessionData.time}
                sessionName={scheduleSessionData.title}
                onDateChange={(value) =>
                  setScheduleSessionData((prev) =>
                    prev ? { ...prev, date: new Date(value) } : prev
                  )
                }
                onTimeChange={(value) =>
                  setScheduleSessionData((prev) => (prev ? { ...prev, time: value } : prev))
                }
                onClickDiscard={() => {
                  setIsScheduleSessionOpen(false);
                  setScheduleSessionData(null);
                }}
                onClickSendRequest={handleSendRequest}
                locale={args.locale}
              />
            </div>
          </div>
        )}
      </div>
    );
  },
};

export const DragAndDropVariant: StoryObj<typeof CoachingSessionCalendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    availableCoachingSessionsData: mockCoachingSessions,
    onAddEvent: (event: Event) => console.log('Add Event:', event),
    onEventDrop: (event: Event) => console.log('Event Dropped:', event),
    variant: 'dragAndDrop',
    locale: 'en',
  },
};

export const ClickToScheduleVariant: StoryObj<typeof CoachingSessionCalendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    onAddEvent: (event: Event) => console.log('Add Event:', event),
    onEventDrop: (event: Event) => console.log('Event Dropped:', event),
    variant: 'clickToSchedule',
    locale: 'en',
  },
};

export const EmptyDragAndDrop: StoryObj<typeof CoachingSessionCalendar> = {
  ...Template,
  args: {
    events: [],
    coachAvailability: [],
    yourMeetings: [],
    availableCoachingSessionsData: [],
    onAddEvent: (event: Event) => console.log('Add Event:', event),
    onEventDrop: (event: Event) => console.log('Event Dropped:', event),
    variant: 'dragAndDrop',
    locale: 'en',
  },
};

export const EmptyClickToSchedule: StoryObj<typeof CoachingSessionCalendar> = {
  ...Template,
  args: {
    events: [],
    coachAvailability: [],
    yourMeetings: [],
    onAddEvent: (event: Event) => console.log('Add Event:', event),
    onEventDrop: (event: Event) => console.log('Event Dropped:', event),
    variant: 'clickToSchedule',
    locale: 'en',
  },
};

export const InteractiveDragAndDrop: StoryObj<typeof CoachingSessionCalendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    availableCoachingSessionsData: mockCoachingSessions,
    onAddEvent: (event: Event) => alert(`Added Event: ${event.title}`),
    onEventDrop: (event: Event) =>
      alert(`Dropped Event: ${event.title} to ${new Date(event.start).toLocaleString()}`),
    variant: 'dragAndDrop',
    locale: 'en',
  },
};

export const InteractiveClickToSchedule: StoryObj<typeof CoachingSessionCalendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    onAddEvent: (event: Event) => alert(`Added Event: ${event.title}`),
    onEventDrop: (event: Event) =>
      alert(`Dropped Event: ${event.title} to ${new Date(event.start).toLocaleString()}`),
    variant: 'clickToSchedule',
    locale: 'en',
  },
};

export const GermanLocaleDragAndDrop: StoryObj<typeof CoachingSessionCalendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    availableCoachingSessionsData: mockCoachingSessions,
    onAddEvent: (event: Event) => console.log('Add Event:', event),
    onEventDrop: (event: Event) => console.log('Event Dropped:', event),
    variant: 'dragAndDrop',
    locale: 'de',
  },
};

export const GermanLocaleClickToSchedule: StoryObj<typeof CoachingSessionCalendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    onAddEvent: (event: Event) => console.log('Add Event:', event),
    onEventDrop: (event: Event) => console.log('Event Dropped:', event),
    variant: 'clickToSchedule',
    locale: 'de',
  },
};