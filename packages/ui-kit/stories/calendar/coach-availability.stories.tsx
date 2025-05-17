// File: coach-availability-calendar.stories.tsx
import { Meta, StoryObj } from '@storybook/react';
import React, { useState } from 'react';
import CoachAvailabilityCalendar from '../../lib/components/calendar/coach-availability-calendar';
import { TAvailability, TRecurringAvailability } from '../../lib/components/calendar/add-availability/availability-manager';

const meta: Meta<typeof CoachAvailabilityCalendar> = {
  title: 'Components/CoachAvailabilityCalendar',
  component: CoachAvailabilityCalendar,
  tags: ['autodocs'],
  decorators: [
    (Story) => (
      <div style={{ width: '100%', height: '800px' }}>
        <Story />
      </div>
    ),
  ],
  argTypes: {
    events: { control: 'object', description: 'Array of event objects to display on the calendar.' },
    coachAvailability: { control: 'object', description: 'Array of coach availability event objects.' },
    yourMeetings: { control: 'object', description: 'Array of user meeting event objects.' },
    onAddAvailability: { action: 'addAvailability', description: 'Callback for adding new availability.' },
    onEditAvailability: { action: 'editAvailability', description: 'Callback for editing availability.' },
    onDeleteAvailability: { action: 'deleteAvailability', description: 'Callback for deleting availability.' },
    onEventDrop: { action: 'eventDrop', description: 'Callback for dragging and dropping an event.' },
    isLoading: { control: 'boolean', description: 'Loading state for availability actions.' },
    isError: { control: 'boolean', description: 'Error state for availability actions.' },
    locale: { control: 'select', options: ['en', 'de'], defaultValue: 'en', description: 'Locale for the component.' },
  },
};

export default meta;

type BaseEvent = {
  id: string;
  title: string;
  description?: string;
  start: string;
  end: string;
  attendees?: string;
  isAvailability?: boolean;
  availabilityId?: number;
  isRecurring?: boolean;
  days?: string[];
  startDate?: string;
  expirationDate?: string;
};

type CalendarEvent = BaseEvent & {
  coachingSessionId?: string;
};

const mockEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Student Coaching Session',
    description: 'Coaching session with student John Smith',
    start: '2025-05-06T10:00:00',
    end: '2025-05-06T11:00:00',
    attendees: 'john@example.com',
    coachingSessionId: 'cs-123',
  },
  {
    id: '2',
    title: 'Student Group Session',
    description: 'Group coaching session with Team A',
    start: '2025-05-07T14:00:00',
    end: '2025-05-07T15:00:00',
    attendees: 'group@example.com',
    coachingSessionId: 'cs-456',
  },
];

const mockCoachAvailability: BaseEvent[] = [
  {
    id: '3',
    title: 'Available',
    description: 'Regular availability',
    start: '2025-05-06T09:00:00',
    end: '2025-05-06T12:00:00',
    isAvailability: true,
    availabilityId: 1,
    isRecurring: true,
    days: ['Monday', 'Tuesday'],
    startDate: '2025-05-01',
    expirationDate: '2025-06-30',
  },
  {
    id: '4',
    title: 'Available',
    description: 'One-time availability',
    start: '2025-05-07T13:00:00',
    end: '2025-05-07T16:00:00',
    isAvailability: true,
    availabilityId: 2,
    isRecurring: false,
  },
];

const mockYourMeetings: BaseEvent[] = [
  {
    id: '7',
    title: 'Team Planning Meeting',
    description: 'Weekly team planning session',
    start: '2025-05-06T13:00:00',
    end: '2025-05-06T14:00:00',
    attendees: 'team@example.com',
  },
];

const Template: StoryObj<typeof CoachAvailabilityCalendar> = {
  render: (args) => {
    const [events, setEvents] = useState([...mockEvents]);
    const [coachAvailability, setCoachAvailability] = useState([...mockCoachAvailability]);
    const [yourMeetings] = useState([...mockYourMeetings]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const generateRecurringEvents = (availability: TRecurringAvailability): BaseEvent[] => {
      const events: BaseEvent[] = [];
      const startDate = new Date(availability.startDate);
      const endDate = new Date(availability.expirationDate);
      const [startHour, startMin] = availability.startTime.split(':').map(Number);
      const [endHour, endMin] = availability.endTime.split(':').map(Number);
      const dayMap: { [key: string]: number } = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
      };

      let currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dayName = currentDate.toLocaleDateString('en-US', { weekday: 'long' });
        if (availability.days.includes(dayName as any)) {
          const eventStart = new Date(currentDate);
          eventStart.setHours(startHour, startMin, 0, 0);
          const eventEnd = new Date(currentDate);
          eventEnd.setHours(endHour, endMin, 0, 0);

          events.push({
            id: `avail-${availability.id}-${eventStart.toISOString()}`,
            title: 'Available',
            description: 'Recurring availability',
            start: eventStart.toISOString(),
            end: eventEnd.toISOString(),
            isAvailability: true,
            availabilityId: availability.id,
            isRecurring: true,
            days: availability.days,
            startDate: availability.startDate,
            expirationDate: availability.expirationDate,
          });
        }
        currentDate.setDate(currentDate.getDate() + 1);
      }
      return events;
    };

    const handleAddAvailability = (availability: TAvailability) => {
      setLoading(true);
      setTimeout(() => {
        try {
          let newEvents: BaseEvent[] = [];
          const availabilityId = availability.id;

          if (availability.type === 'recurring') {
            newEvents = generateRecurringEvents(availability as TRecurringAvailability);
          } else {
            const date = new Date(availability.date);
            const [startHour, startMin] = availability.startTime.split(':').map(Number);
            const [endHour, endMin] = availability.endTime.split(':').map(Number);
            const start = new Date(date);
            start.setHours(startHour, startMin, 0, 0);
            const end = new Date(date);
            end.setHours(endHour, endMin, 0, 0);

            newEvents = [{
              id: `avail-${Date.now()}`,
              title: 'Available',
              description: 'One-time availability',
              start: start.toISOString(),
              end: end.toISOString(),
              isAvailability: true,
              availabilityId,
              isRecurring: false,
            }];
          }

          setCoachAvailability([...coachAvailability, ...newEvents]);
          args.onAddAvailability(availability);
          setLoading(false);
        } catch (e) {
          console.error('Error adding availability:', e);
          setError(true);
          setLoading(false);
        }
      }, 1000);
    };

    const handleEditAvailability = (availability: TAvailability) => {
      setLoading(true);
      setTimeout(() => {
        try {
          // Remove old events with the same availabilityId
          const filteredAvailability = coachAvailability.filter(
            (event) => event.availabilityId !== availability.id
          );

          // Generate new events
          let newEvents: BaseEvent[] = [];
          if (availability.type === 'recurring') {
            newEvents = generateRecurringEvents(availability as TRecurringAvailability);
          } else {
            const date = new Date(availability.date);
            const [startHour, startMin] = availability.startTime.split(':').map(Number);
            const [endHour, endMin] = availability.endTime.split(':').map(Number);
            const start = new Date(date);
            start.setHours(startHour, startMin, 0, 0);
            const end = new Date(date);
            end.setHours(endHour, endMin, 0, 0);

            newEvents = [{
              id: `avail-${Date.now()}`,
              title: 'Available',
              description: 'One-time availability',
              start: start.toISOString(),
              end: end.toISOString(),
              isAvailability: true,
              availabilityId: availability.id,
              isRecurring: false,
            }];
          }

          setCoachAvailability([...filteredAvailability, ...newEvents]);
          args.onEditAvailability(availability);
          setLoading(false);
        } catch (e) {
          console.error('Error editing availability:', e);
          setError(true);
          setLoading(false);
        }
      }, 1000);
    };

    const handleDeleteAvailability = (id: number) => {
      setLoading(true);
      setTimeout(() => {
        try {
          const filteredAvailability = coachAvailability.filter(
            (event) => event.availabilityId !== id
          );
          setCoachAvailability(filteredAvailability);
          args.onDeleteAvailability(id);
          setLoading(false);
        } catch (e) {
          console.error('Error deleting availability:', e);
          setError(true);
          setLoading(false);
        }
      }, 1000);
    };

    const handleEventDrop = (event: CalendarEvent) => {
      setLoading(true);
      setTimeout(() => {
        try {
          if (event.isAvailability) {
            const updatedAvailability = coachAvailability.map((a) => {
              if (a.id === event.id) return { ...a, start: event.start, end: event.end };
              return a;
            });
            setCoachAvailability(updatedAvailability);
          } else {
            const updatedEvents = events.map((e) => {
              if (e.id === event.id) return { ...e, start: event.start, end: event.end };
              return e;
            });
            setEvents(updatedEvents);
          }
          args.onEventDrop(event);
          setLoading(false);
        } catch (e) {
          console.error('Error dropping event:', e);
          setError(true);
          setLoading(false);
        }
      }, 500);
    };

    return (
      <CoachAvailabilityCalendar
        events={events}
        coachAvailability={coachAvailability}
        yourMeetings={yourMeetings}
        onAddAvailability={handleAddAvailability}
        onEditAvailability={handleEditAvailability}
        onDeleteAvailability={handleDeleteAvailability}
        onEventDrop={handleEventDrop}
        isLoading={loading}
        isError={error}
        locale={args.locale}
      />
    );
  },
};

export const Default: StoryObj<typeof CoachAvailabilityCalendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    locale: 'en',
  },
};

export const EmptyCalendar: StoryObj<typeof CoachAvailabilityCalendar> = {
  ...Template,
  args: {
    events: [],
    coachAvailability: [],
    yourMeetings: [],
    locale: 'en',
  },
};

export const WithError: StoryObj<typeof CoachAvailabilityCalendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    isError: true,
    locale: 'en',
  },
};

export const Loading: StoryObj<typeof CoachAvailabilityCalendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    isLoading: true,
    locale: 'en',
  },
};

export const GermanLocale: StoryObj<typeof CoachAvailabilityCalendar> = {
  ...Template,
  args: {
    events: mockEvents,
    coachAvailability: mockCoachAvailability,
    yourMeetings: mockYourMeetings,
    locale: 'de',
  },
};