import React, { useState, useCallback, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarHeader } from './calendar-header';
import { Event, EventModal, EventContent } from './event';
import { calendarStyles } from './calendar-styles';

type CalendarProps = {
  events: Event[];
  coachAvailability: Event[];
  yourMeetings: Event[];
  onAddEvent?: (event: Event) => void;
  onUpdateEvent?: (event: Event) => void;
  onEventDrop?: (event: Event) => void;
  availableCoachingSessionsData?: { title: string; time: number; numberOfSessions: number }[];
};

export const formatDate = (date: Date, viewType: string = 'timeGridWeek'): string => {
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'long' });

  if (viewType === 'dayGridMonth') {
    return `${month} ${year}`;
  }

  const day = viewType === 'timeGridDay' ? date.getDate() : '';
  return [day, month, year].filter(Boolean).join(' ');
};

const Calendar: React.FC<CalendarProps> = ({
  events,
  coachAvailability,
  yourMeetings,
  onAddEvent,
  onUpdateEvent,
  onEventDrop,
}) => {
  const [viewType, setViewType] = useState('timeGridWeek');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [newEvent, setNewEvent] = useState({
    title: '',
    description: '',
    start: '',
    end: '',
    attendees: '',
  });
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarRef = useRef<FullCalendar>(null);

  const handleViewChange = useCallback((newView: string) => {
    setViewType(newView);
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.changeView(newView);
    }
  }, []);

  const handleNavigation = (action: 'next' | 'prev' | 'today') => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (action === 'next') calendarApi.next();
      else if (action === 'prev') calendarApi.prev();
      else calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !newEvent.start || !newEvent.end) {
      alert('Please fill in all required fields');
      return;
    }

    const eventId = selectedEvent?.id || Date.now().toString();
    const formattedEvent: Event = {
      id: eventId,
      title: newEvent.title,
      description: newEvent.description,
      start: new Date(newEvent.start).toISOString(),
      end: new Date(newEvent.end).toISOString(),
      attendees: newEvent.attendees,
    };

    if (selectedEvent) {
      onUpdateEvent?.(formattedEvent);
    } else {
      onAddEvent?.(formattedEvent);
    }

    setNewEvent({ title: '', description: '', start: '', end: '', attendees: '' });
    setSelectedEvent(null);
    setIsModalOpen(false);
  };

  const handleEventDrop = (info: any) => {
    const updatedEvent: Event = {
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description || '',
      start: info.event.start.toISOString(),
      end: info.event.end.toISOString(),
      attendees: info.event.extendedProps.attendees || '',
    };

    onEventDrop?.(updatedEvent);
  };

  const handleExternalDrop = (info: any) => {
    const { draggedEl, date } = info;
    const title = draggedEl.getAttribute('data-title') || 'Coaching Session';
    const duration = draggedEl.getAttribute('data-duration') || '01:00';
    const numberOfSessions = parseInt(draggedEl.getAttribute('data-sessions') || '1', 10);
    const sessionId = draggedEl.getAttribute('data-session-id') || '';

    const start = new Date(date);
    const end = new Date(start);
    const [hours, minutes] = duration.split(':').map(Number);
    end.setHours(start.getHours() + hours, start.getMinutes() + minutes);

    const newEvent: Event = {
      id: Date.now().toString(),
      title,
      description: '',
      start: start.toISOString(),
      end: end.toISOString(),
      attendees: '',
      extendedProps: { numberOfSessions, sessionId },
    };

    onAddEvent?.(newEvent);

    window.dispatchEvent(
      new CustomEvent('sessionDropped', { detail: { sessionId } })
    );
  };

  const handleDatesSet = (dateInfo: any) => {
    setCurrentDate(dateInfo.view.currentStart);
  };

  const allEvents = [
    ...events,
    ...coachAvailability.map((event) => ({ ...event, isCoachAvailability: true })),
    ...yourMeetings.map((event) => ({ ...event, isYourMeeting: true })),
  ];

  return (
    <div className="w-full bg-card-fill">
      <CalendarHeader
        viewType={viewType}
        onNavigation={handleNavigation}
        onViewChange={handleViewChange}
        formatDate={formatDate}
        coachAvailability={coachAvailability}
        yourMeetings={yourMeetings}
      />
      <div className="w-full max-w-full p-6">
        <style>{calendarStyles}</style>
        <div className="h-[750px]">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView={viewType}
            headerToolbar={false}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            events={allEvents}
            datesSet={handleDatesSet}
            select={(info) => {
              setNewEvent({
                title: '',
                description: '',
                start: info.startStr,
                end: info.endStr,
                attendees: '',
              });
              setSelectedEvent(null);
              setIsModalOpen(true);
            }}
            eventContent={(eventInfo) => (
              <EventContent
                eventInfo={eventInfo}
                onClick={() => {
                  setSelectedEvent({
                    id: eventInfo.event.id,
                    title: eventInfo.event.title,
                    description: eventInfo.event.extendedProps.description || '',
                    start: eventInfo.event.start.toISOString(),
                    end: eventInfo.event.end.toISOString(),
                    attendees: eventInfo.event.extendedProps.attendees || '',
                  });
                  setNewEvent({
                    title: eventInfo.event.title,
                    description: eventInfo.event.extendedProps.description || '',
                    start: eventInfo.event.start.toISOString(),
                    end: eventInfo.event.end.toISOString(),
                    attendees: eventInfo.event.extendedProps.attendees || '',
                  });
                  setIsModalOpen(true);
                }}
              />
            )}
            eventDrop={handleEventDrop}
            droppable={true}
            drop={handleExternalDrop}
            slotMinTime="07:00:00"
            slotMaxTime="22:00:00"
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
          />
        </div>
      </div>
      <EventModal
        isOpen={isModalOpen}
        selectedEvent={selectedEvent}
        newEvent={newEvent}
        setNewEvent={setNewEvent}
        onClose={() => {
          setIsModalOpen(false);
          setNewEvent({ title: '', description: '', start: '', end: '', attendees: '' });
          setSelectedEvent(null);
        }}
        onSave={handleAddEvent}
      />
    </div>
  );
};

export default Calendar;