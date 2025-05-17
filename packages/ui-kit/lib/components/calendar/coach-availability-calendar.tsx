// File: coach-availability-calendar.tsx
import React, { useState, useCallback, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarHeader } from './calendar-header';
import { EventContent } from './event';
import { calendarStyles } from './calendar-styles';
import { AvailabilityManager, TAvailability, TRecurringAvailability, TSingleAvailability } from './add-availability/availability-manager';
import { AvailabilityDetails } from './add-availability/availability-details';
import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { Button } from '../button';

export interface BaseEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  attendees?: string;
  isAvailability?: boolean;
  availabilityId?: number;
  isRecurring?: boolean;
  days?: string[];
  startDate?: string;
  expirationDate?: string;
  extendedProps?: {
    numberOfSessions?: number;
    coachName?: string;
    coachingSessionId?: string;
    [key: string]: any;
  };
}

export interface CalendarEvent extends BaseEvent {
  coachingSessionId?: string;
  extendedProps?: {
    isCoachAvailability?: boolean;
    isYourMeeting?: boolean;
    numberOfSessions?: number;
    coachName?: string;
    coachingSessionId?: string;
  };
}

export interface CoachAvailabilityCalendarProps extends isLocalAware {
  events: CalendarEvent[];
  coachAvailability: BaseEvent[];
  yourMeetings: BaseEvent[];
  onAddAvailability: (availability: TAvailability) => void;
  onEditAvailability: (availability: TAvailability) => void;
  onDeleteAvailability: (id: number) => void;
  onEventDrop: (event: CalendarEvent) => void;
  isLoading?: boolean;
  isError?: boolean;
}

// Utility to generate recurring events
const generateRecurringEvents = (availability: TRecurringAvailability, maxEvents: number = 100): BaseEvent[] => {
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
  let eventCount = 0;

  while (currentDate <= endDate && eventCount < maxEvents) {
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
        extendedProps: {
          isCoachAvailability: true,
          isYourMeeting: false,
        },
      });
      eventCount++;
    }
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return events;
};

export const formatDate = (date: Date, viewType = 'timeGridWeek'): string => {
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'long' });
  if (viewType === 'dayGridMonth') return `${month} ${year}`;
  const day = viewType === 'timeGridDay' ? date.getDate() : '';
  return [day, month, year].filter(Boolean).join(' ');
};

const CoachAvailabilityCalendar: React.FC<CoachAvailabilityCalendarProps> = ({
  events,
  coachAvailability,
  yourMeetings,
  onAddAvailability,
  onEditAvailability,
  onDeleteAvailability,
  onEventDrop,
  isLoading = false,
  isError = false,
  locale,
}) => {
  const [viewType, setViewType] = useState('timeGridWeek');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isAvailabilityManagerOpen, setIsAvailabilityManagerOpen] = useState(false);
  const [isAvailabilityDetailsOpen, setIsAvailabilityDetailsOpen] = useState(false);
  const [selectedAvailability, setSelectedAvailability] = useState<TAvailability | null>(null);
  const calendarRef = useRef<FullCalendar>(null);

  const handleViewChange = useCallback((newView: string) => {
    setViewType(newView);
    if (calendarRef.current) calendarRef.current.getApi().changeView(newView);
  }, []);

  const handleNavigation = (action: 'next' | 'prev' | 'today') => {
    if (!calendarRef.current) return;
    const calendarApi = calendarRef.current.getApi();
    if (action === 'next') calendarApi.next();
    else if (action === 'prev') calendarApi.prev();
    else calendarApi.today();
    setCurrentDate(calendarApi.getDate());
  };

  const handleEventDrop = (info: any) => {
    const updatedEvent: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description || '',
      start: info.event.start.toISOString(),
      end: info.event.end.toISOString(),
      attendees: info.event.extendedProps.attendees || '',
      coachingSessionId: info.event.extendedProps.coachingSessionId,
      isAvailability: info.event.extendedProps.isCoachAvailability,
      availabilityId: info.event.extendedProps.availabilityId,
      extendedProps: {
        isCoachAvailability: info.event.extendedProps.isCoachAvailability,
        isYourMeeting: info.event.extendedProps.isYourMeeting,
        numberOfSessions: info.event.extendedProps.numberOfSessions,
        coachName: info.event.extendedProps.coachName,
        coachingSessionId: info.event.extendedProps.coachingSessionId,
      },
    };
    onEventDrop(updatedEvent);
  };

  const handleEventClick = (info: any) => {
    if (!info.event.extendedProps.isCoachAvailability) return;
    const availability = info.event.extendedProps;
    const availabilityData: TAvailability = availability.isRecurring
      ? {
          id: availability.availabilityId,
          type: 'recurring',
          days: availability.days || [],
          startTime: new Date(info.event.start).toTimeString().substring(0, 5),
          endTime: new Date(info.event.end).toTimeString().substring(0, 5),
          startDate: availability.startDate,
          expirationDate: availability.expirationDate,
        }
      : {
          id: availability.availabilityId,
          type: 'single',
          date: new Date(info.event.start).toISOString().split('T')[0],
          startTime: new Date(info.event.start).toTimeString().substring(0, 5),
          endTime: new Date(info.event.end).toTimeString().substring(0, 5),
        };
    setSelectedAvailability(availabilityData);
    setIsAvailabilityDetailsOpen(true);
  };

  const handleDatesSet = (dateInfo: any) => {
    setCurrentDate(dateInfo.view.currentStart);
  };

  const handleAddAvailability = () => {
    setSelectedAvailability(null);
    setIsAvailabilityManagerOpen(true);
  };

  const handleSaveAvailability = (availability: TAvailability) => {
    if (selectedAvailability && selectedAvailability.id === availability.id) {
      onEditAvailability(availability);
    } else {
      onAddAvailability(availability);
    }
    setIsAvailabilityManagerOpen(false);
    setSelectedAvailability(null);
  };

  const handleEditAvailability = () => {
    setIsAvailabilityDetailsOpen(false);
    setIsAvailabilityManagerOpen(true);
  };

  const handleDeleteAvailability = () => {
    if (selectedAvailability) {
      onDeleteAvailability(selectedAvailability.id);
      setIsAvailabilityDetailsOpen(false);
      setSelectedAvailability(null);
    }
  };

  const handleCloseAvailabilityManager = () => {
    setIsAvailabilityManagerOpen(false);
    setSelectedAvailability(null);
  };

  const handleCloseAvailabilityDetails = () => {
    setIsAvailabilityDetailsOpen(false);
    setSelectedAvailability(null);
  };

  // Transform availability data to calendar events
  const availabilityEvents = coachAvailability.flatMap((event) => {
    if (event.isRecurring && event.days && event.startDate && event.expirationDate) {
      const recurringAvailability: TRecurringAvailability = {
        id: event.availabilityId || Date.now(),
        type: 'recurring',
        days: event.days as any,
        startTime: new Date(event.start).toTimeString().substring(0, 5),
        endTime: new Date(event.end).toTimeString().substring(0, 5),
        startDate: event.startDate,
        expirationDate: event.expirationDate,
      };
      return generateRecurringEvents(recurringAvailability);
    }
    return [{
      ...event,
      title: 'Available',
      isAvailability: true,
      extendedProps: {
        isCoachAvailability: true,
        isYourMeeting: false,
        numberOfSessions: event.extendedProps?.numberOfSessions,
        coachName: event.extendedProps?.coachName,
        availabilityId: event.availabilityId,
        isRecurring: event.isRecurring,
        days: event.days,
        startDate: event.startDate,
        expirationDate: event.expirationDate,
      },
    }];
  });

  const allEvents = [
    ...events.map((event) => ({
      ...event,
      extendedProps: {
        isCoachAvailability: false,
        isYourMeeting: false,
        numberOfSessions: event.extendedProps?.numberOfSessions,
        coachName: event.extendedProps?.coachName,
        coachingSessionId: event.coachingSessionId,
      },
    })),
    ...availabilityEvents,
    ...yourMeetings.map((meeting) => ({
      ...meeting,
      extendedProps: {
        isCoachAvailability: false,
        isYourMeeting: true,
        numberOfSessions: meeting.extendedProps?.numberOfSessions,
        coachName: meeting.extendedProps?.coachName,
      },
    })),
  ];

  const renderDayCellContent = (args: any) => {
    const dayNumber = args.date.getDate();
    const isToday = args.date.toDateString() === new Date().toDateString();
    const eventsForDay = allEvents.filter((event) => {
      const eventDate = new Date(event.start).toDateString();
      return eventDate === args.date.toDateString();
    });
    const maxEvents = window.innerWidth < 640 ? 2 : 3;
    const moreEventsCount = eventsForDay.length - maxEvents;

    return (
      <div className="fc-daygrid-day-top">
        <span className={`fc-daygrid-day-number ${isToday ? 'text-button-secondary-text' : ''}`}>
          {dayNumber}
        </span>
        {moreEventsCount > 0 && (
          <div className="fc-daygrid-more">
            <span className="fc-daygrid-more-text">+{moreEventsCount} more</span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full h-auto">
      <div className="flex justify-end p-4">
        <Button
          variant="secondary"
          onClick={handleAddAvailability}
          text="Add Availability"
          data-testid="add-availability-button"
        />
      </div>
      <div className="w-full bg-card-fill">
        <div className="w-full max-w-full p-4">
          <CalendarHeader
            viewType={viewType}
            onNavigation={handleNavigation}
            onViewChange={handleViewChange}
            formatDate={formatDate}
            coachAvailability={coachAvailability}
            yourMeetings={yourMeetings}
            isVariantTwo={true}
            locale={locale as TLocale}
          />
          <style>{calendarStyles}</style>
          <div className="h-[920px] overflow-hidden rounded-md border border-divider shadow-md">
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
              initialView={viewType}
              headerToolbar={false}
              editable={true}
              selectable={false}
              selectMirror={false}
              dayMaxEvents={window.innerWidth < 640 ? 2 : 3}
              weekends={true}
              events={allEvents}
              datesSet={handleDatesSet}
              eventContent={(eventInfo) => <EventContent eventInfo={eventInfo} />}
              eventDrop={handleEventDrop}
              eventClick={handleEventClick}
              slotMinTime="07:00:00"
              slotMaxTime="18:00:00"
              allDaySlot={false}
              height="100%"
              slotDuration="01:00:00"
              expandRows={true}
              stickyHeaderDates={true}
              nowIndicator={true}
              dayHeaderContent={(args) => {
                const dayName = args.date.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNumber = args.date.getDate();
                const isToday = args.date.toDateString() === new Date().toDateString();
                return (
                  <div className="flex flex-col items-center">
                    <span className="day-name">{dayName}</span>
                    <span className={`day-number ${isToday ? 'text-button-secondary-text' : ''}`}>
                      {dayNumber}
                    </span>
                  </div>
                );
              }}
              dayCellContent={viewType === 'dayGridMonth' ? renderDayCellContent : undefined}
            />
          </div>
        </div>
        {isAvailabilityManagerOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-10 z-50 backdrop-blur-xs">
            <AvailabilityManager
              availability={selectedAvailability || undefined}
              isLoading={isLoading}
              isError={isError}
              onSave={handleSaveAvailability}
              onDelete={selectedAvailability ? handleDeleteAvailability : undefined}
              onCancel={handleCloseAvailabilityManager}
              locale={locale}
            />
          </div>
        )}
        {isAvailabilityDetailsOpen && selectedAvailability && (
          <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-10 z-50 backdrop-blur-xs">
            {selectedAvailability.type === 'recurring' ? (
              <AvailabilityDetails
                availability={selectedAvailability as TRecurringAvailability}
                isLoading={isLoading}
                isError={isError}
                onClickCancel={handleDeleteAvailability}
                onClickEdit={handleEditAvailability}
                onClickClose={handleCloseAvailabilityDetails}
                locale={locale}
              />
            ) : (
              <AvailabilityDetails
                availability={selectedAvailability as TSingleAvailability}
                isLoading={isLoading}
                isError={isError}
                onClickCancel={handleDeleteAvailability}
                onClickEdit={handleEditAvailability}
                onClickClose={handleCloseAvailabilityDetails}
                locale={locale}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoachAvailabilityCalendar;