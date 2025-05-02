import React, { useState, useCallback, useEffect, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarHeader } from './calendar-header';
import { EventContent, Event } from './event';
import { calendarStyles } from './calendar-styles';
import { ScheduleSession } from './schedule-session';

type CalendarProps = {
  events: Event[];
  coachAvailability: Event[];
  yourMeetings: Event[];
  onAddEvent?: (event: Event) => void;
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
  onEventDrop,
}) => {
  const [viewType, setViewType] = useState('timeGridWeek');
  const [isScheduleSessionOpen, setIsScheduleSessionOpen] = useState(false);
  const [scheduleSessionData, setScheduleSessionData] = useState<{
    date: Date;
    time: string;
    title: string;
    sessionId?: string;
  } | null>(null);
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

    setScheduleSessionData({
      date: start,
      time: `${start.getHours().toString().padStart(2, '0')}:${start
        .getMinutes()
        .toString()
        .padStart(2, '0')}`,
      title,
      sessionId,
    });
    setIsScheduleSessionOpen(true);

    window.dispatchEvent(new CustomEvent('sessionDropped', { detail: { sessionId } }));
  };

  const handleDatesSet = (dateInfo: any) => {
    setCurrentDate(dateInfo.view.currentStart);
  };

  const allEvents = [
    ...events,
    ...coachAvailability.map((event) => ({ ...event, isCoachAvailability: true })),
    ...yourMeetings.map((event) => ({ ...event, isYourMeeting: true })),
  ];

  const handleSendRequest = () => {
    if (!scheduleSessionData) return;

    const { date, time, title, sessionId } = scheduleSessionData;
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
      extendedProps: { sessionId },
    };

    onAddEvent?.(newEvent);
    setIsScheduleSessionOpen(false);
    setScheduleSessionData(null);
  };

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
      <div className="w-full max-w-full p-4">
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
            dayMaxEvents={true}
            weekends={true}
            events={allEvents}
            datesSet={handleDatesSet}
            eventContent={(eventInfo) => <EventContent eventInfo={eventInfo} />}
            eventDrop={handleEventDrop}
            droppable={true}
            drop={handleExternalDrop}
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
          />
        </div>
      </div>
      {isScheduleSessionOpen && scheduleSessionData && (
        <div className="fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-10 z-50 backdrop-blur-xs">
          <div className="bg-card-fill p-6 rounded-md border border-card-stroke max-w-[320px] w-full ">
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
              locale="en"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Calendar;