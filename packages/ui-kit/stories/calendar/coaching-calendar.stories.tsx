import { Meta, StoryObj } from '@storybook/react';
import CoachingSessionCalendar from '../../lib/components/calendar/coaching-session-calendar';
import { Button } from '../../lib/components/button';
import React, { useEffect } from 'react';
import { ScheduleSession } from '../../lib/components/calendar/schedule-session';
import { AvailableCoachingSessions } from '../../lib/components/available-coaching-sessions/available-coaching-sessions';
import { getDictionary, locales } from '@maany_shr/e-class-translations';

const meta: Meta<typeof CoachingSessionCalendar> = {
  title: 'Components/Calendar/CoachingSessionCalendar',
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

const mockCoachAvailability: BaseEvent[] = [
  {
    id: '1',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-05-26T08:00:00',
    end: '2025-05-26T10:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '2',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-05-27T10:00:00',
    end: '2025-05-27T12:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '3',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-05-28T13:00:00',
    end: '2025-05-28T15:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '4',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-05-29T09:00:00',
    end: '2025-05-29T11:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '5',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-05-30T14:00:00',
    end: '2025-05-30T16:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '6',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-05-31T10:00:00',
    end: '2025-05-31T12:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '7',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-06-02T08:00:00',
    end: '2025-06-02T10:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '8',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-06-03T13:00:00',
    end: '2025-06-03T15:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '9',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-06-04T09:00:00',
    end: '2025-06-04T11:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '10',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-06-05T14:00:00',
    end: '2025-06-05T16:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '11',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-06-06T08:00:00',
    end: '2025-06-06T10:00:00',
    attendees: 'coach@example.com',
  },
  {
    id: '12',
    title: 'Coach Available',
    description: 'Available for coaching session',
    start: '2025-06-07T11:00:00',
    end: '2025-06-07T13:00:00',
    attendees: 'coach@example.com',
  },
];

const mockYourMeetings: BaseEvent[] = [
  {
    id: '13',
    title: 'Your Meeting',
    description: 'Scheduled meeting with coach',
    start: '2025-05-26T08:30:00',
    end: '2025-05-26T09:30:00',
    attendees: 'user@example.com',
  },
  {
    id: '14',
    title: 'Your Meeting',
    description: 'Scheduled meeting with coach',
    start: '2025-05-27T10:30:00',
    end: '2025-05-27T11:30:00',
    attendees: 'user@example.com',
  },
  {
    id: '15',
    title: 'Your Meeting',
    description: 'Scheduled meeting with coach',
    start: '2025-05-28T13:30:00',
    end: '2025-05-28T14:30:00',
    attendees: 'user@example.com',
  },
  {
    id: '16',
    title: 'Your Meeting',
    description: 'Scheduled meeting with coach',
    start: '2025-05-29T09:30:00',
    end: '2025-05-29T10:30:00',
    attendees: 'user@example.com',
  },
  {
    id: '17',
    title: 'Your Meeting',
    description: 'Scheduled meeting with coach',
    start: '2025-05-30T14:30:00',
    end: '2025-05-30T15:30:00',
    attendees: 'user@example.com',
  },
  {
    id: '18',
    title: 'Your Meeting',
    description: 'Scheduled meeting with coach',
    start: '2025-06-02T08:30:00',
    end: '2025-06-02T09:30:00',
    attendees: 'user@example.com',
  },
  {
    id: '19',
    title: 'Your Meeting',
    description: 'Scheduled meeting with coach',
    start: '2025-06-03T13:30:00',
    end: '2025-06-03T14:30:00',
    attendees: 'user@example.com',
  },
  {
    id: '20',
    title: 'Your Meeting',
    description: 'Scheduled meeting with coach',
    start: '2025-06-04T09:30:00',
    end: '2025-06-04T10:30:00',
    attendees: 'user@example.com',
  },
];

const mockEvents: CalendarEvent[] = [
  {
    id: '21',
    title: 'Team Sync',
    description: 'Weekly team alignment meeting',
    start: '2025-05-26T11:00:00',
    end: '2025-05-26T12:00:00',
    attendees: 'team@example.com',
  },
  {
    id: '22',
    title: 'Sprint Planning',
    description: 'Planning for next sprint',
    start: '2025-05-27T13:00:00',
    end: '2025-05-27T14:00:00',
    attendees: 'devteam@example.com',
  },
  {
    id: '23',
    title: 'Client Presentation',
    description: 'Q2 results presentation',
    start: '2025-05-28T09:00:00',
    end: '2025-05-28T10:00:00',
    attendees: 'client@example.com',
  },
  {
    id: '24',
    title: 'Code Review',
    description: 'Review recent code submissions',
    start: '2025-05-29T12:00:00',
    end: '2025-05-29T13:00:00',
    attendees: 'devs@example.com',
  },
  {
    id: '25',
    title: 'Project Kickoff',
    description: 'Kickoff for Project Beta',
    start: '2025-05-30T10:00:00',
    end: '2025-05-30T11:00:00',
    attendees: 'projectteam@example.com',
  },
  {
    id: '26',
    title: 'Retrospective',
    description: 'Sprint retrospective meeting',
    start: '2025-06-02T11:00:00',
    end: '2025-06-02T12:00:00',
    attendees: 'team@example.com',
  },
  {
    id: '27',
    title: 'Stakeholder Update',
    description: 'Update for project stakeholders',
    start: '2025-06-03T09:00:00',
    end: '2025-06-03T10:00:00',
    attendees: 'stakeholders@example.com',
  },
  {
    id: '28',
    title: 'Training Session',
    description: 'New tool training for team',
    start: '2025-06-04T12:00:00',
    end: '2025-06-04T13:00:00',
    attendees: 'trainees@example.com',
  },
  {
    id: '29',
    title: 'Design Review',
    description: 'Review UI/UX designs',
    start: '2025-06-05T10:00:00',
    end: '2025-06-05T11:00:00',
    attendees: 'designers@example.com',
  },
  {
    id: '30',
    title: 'Budget Planning',
    description: 'Q3 budget planning session',
    start: '2025-06-06T11:00:00',
    end: '2025-06-06T12:00:00',
    attendees: 'finance@example.com',
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

const mockCoachName = 'John Doe';
const mockGroupName = 'Group A';
const mockCourseTitle = 'Course Title';

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
    coachName: mockCoachName,
    groupName: mockGroupName,
    courseTitle: mockCourseTitle,
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
    coachName: mockCoachName,
    groupName: mockGroupName,
    courseTitle: mockCourseTitle,
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
    coachName: mockCoachName,
    groupName: mockGroupName,
    courseTitle: mockCourseTitle,
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
    coachName: mockCoachName,
    groupName: mockGroupName,
    courseTitle: mockCourseTitle,
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
    coachName: mockCoachName,
    groupName: mockGroupName,
    courseTitle: mockCourseTitle,
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
    coachName: mockCoachName,
    groupName: mockGroupName,
    courseTitle: mockCourseTitle,
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
    coachName: mockCoachName,
    groupName: mockGroupName,
    courseTitle: mockCourseTitle,
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
    coachName: mockCoachName,
    groupName: mockGroupName,
    courseTitle: mockCourseTitle,
  },
};