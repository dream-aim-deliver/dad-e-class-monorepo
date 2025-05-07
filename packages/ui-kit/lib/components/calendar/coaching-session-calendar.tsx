import React, { useState, useCallback, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarHeader } from './calendar-header';
import { EventContent } from './event';
import { calendarStyles } from './calendar-styles';
import { ScheduleSession } from './schedule-session';

export type Variant = 'dragAndDrop' | 'clickToSchedule';


export interface BaseEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  description?: string;
  attendees?: string;
}

export interface CoachAvailabilityEvent extends BaseEvent {
  isCoachAvailability: true;
}


export interface UserMeetingEvent extends BaseEvent {
  isYourMeeting: true;
}


export interface CalendarEvent extends BaseEvent {
  coachingSessionId?: string;
}

/**
 * Union type for all event kinds
 */
export type Event = CalendarEvent | CoachAvailabilityEvent | UserMeetingEvent;


export interface ScheduleSessionData {
  date: Date;
  time: string;
  title: string;
  coachingSessionId?: string;
}

export interface CalendarProps {
  events: CalendarEvent[];
  coachAvailability: BaseEvent[];
  yourMeetings: BaseEvent[];
  availableCoachingSessionsData?: { id: string; title: string; time: number; numberOfSessions: number }[];
  onAddEvent: (event: CalendarEvent) => void;
  onEventDrop: (event: CalendarEvent) => void;
  variant: Variant;
}

export const formatDate = (date: Date, viewType = 'timeGridWeek'): string => {
  const year = date.getFullYear();
  const month = date.toLocaleString('default', { month: 'long' });

  if (viewType === 'dayGridMonth') {
    return `${month} ${year}`;
  }

  const day = viewType === 'timeGridDay' ? date.getDate() : '';
  return [day, month, year].filter(Boolean).join(' ');
};

/**
 * A calendar component for managing coaching sessions with drag-and-drop or click-to-schedule functionality.
 *
 * @param events Array of calendar events representing scheduled coaching sessions.
 * @param coachAvailability Array of events indicating the coach's available time slots.
 * @param yourMeetings Array of events representing the user's scheduled meetings.
 * @param availableCoachingSessionsData Optional array of available coaching session data, each containing id, title, time, and numberOfSessions.
 * @param onAddEvent Handler function for adding a new event to the calendar.
 * @param onEventDrop Handler function for updating an event after it is dropped or dragged.
 * @param variant The interaction mode for scheduling:
 *   - `dragAndDrop`: Allows dragging sessions from available sessions to the calendar.
 *   - `clickToSchedule`: Allows clicking on the calendar or coach availability slots to schedule.
 *
 * @example
 * <CoachingSessionCalendar
 *   events={[
 *     { id: "1", title: "Session 1", start: "2025-05-07T10:00:00", end: "2025-05-07T11:00:00" }
 *   ]}
 *   coachAvailability={[
 *     { id: "2", title: "Available", start: "2025-05-07T12:00:00", end: "2025-05-07T13:00:00" }
 *   ]}
 *   yourMeetings={[
 *     { id: "3", title: "Your Meeting", start: "2025-05-07T14:00:00", end: "2025-05-07T15:00:00" }
 *   ]}
 *   availableCoachingSessionsData={[
 *     { id: "4", title: "Intro Session", time: 60, numberOfSessions: 2 }
 *   ]}
 *   onAddEvent={(event) => console.log("Event added:", event)}
 *   onEventDrop={(event) => console.log("Event dropped:", event)}
 *   variant="dragAndDrop"
 * />
 *
 * @example
 * <CoachingSessionCalendar
 *   events={[]}
 *   coachAvailability={[]}
 *   yourMeetings={[]}
 *   onAddEvent={(event) => console.log("Event added:", event)}
 *   onEventDrop={(event) => console.log("Event dropped:", event)}
 *   variant="clickToSchedule"
 * />
 */
const CoachingSessionCalendar: React.FC<CalendarProps> = ({
  events,
  coachAvailability,
  yourMeetings,
  onAddEvent,
  onEventDrop,
  variant,
}) => {
  const [viewType, setViewType] = useState('timeGridWeek');
  const [isScheduleSessionOpen, setIsScheduleSessionOpen] = useState(false);
  const [scheduleSessionData, setScheduleSessionData] = useState<ScheduleSessionData | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isHovering, setIsHovering] = useState(false);

  const calendarRef = useRef<FullCalendar>(null);
  const draggableRef = useRef<HTMLDivElement>(null);

  /**
   * Handle view type change (day, week, month)
   */
  const handleViewChange = useCallback((newView: string) => {
    setViewType(newView);
    if (calendarRef.current) {
      const api = calendarRef.current.getApi();
      api.changeView(newView);
    }
  }, []);

  /**
   * Handle calendar navigation (prev, next, today)
   */
  const handleNavigation = (action: 'next' | 'prev' | 'today') => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      if (action === 'next') calendarApi.next();
      else if (action === 'prev') calendarApi.prev();
      else calendarApi.today();
      setCurrentDate(calendarApi.getDate());
    }
  };

  /**
   * Handle event drag and drop within calendar
   */
  const handleEventDrop = (info: any) => {
    const updatedEvent: CalendarEvent = {
      id: info.event.id,
      title: info.event.title,
      description: info.event.extendedProps.description || '',
      start: info.event.start.toISOString(),
      end: info.event.end.toISOString(),
      attendees: info.event.extendedProps.attendees || '',
      coachingSessionId: info.event.extendedProps.coachingSessionId,
    };

    onEventDrop(updatedEvent);
  };

  /**
   * Handle external drop (from available sessions)
   */
  const handleExternalDrop = (info: any) => {
    const { draggedEl, date } = info;
    const title = draggedEl.getAttribute('data-title') || 'Coaching Session';
    const duration = draggedEl.getAttribute('data-duration') || '01:00';
    const coachingSessionId = draggedEl.getAttribute('data-session-id') || '';

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
      coachingSessionId,
    });
    setIsScheduleSessionOpen(true);

    window.dispatchEvent(new CustomEvent('sessionDropped', { detail: { coachingSessionId } }));
  };

  /**
   * Handle mouse enter for click to schedule variant
   */
  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  /**
   * Handle mouse leave for click to schedule variant
   */
  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  /**
   * Handle calendar click for click to schedule variant
   */
  const handleCalendarClick = (info: any) => {
    const start = new Date(info.date);
    const title = 'Coaching Session';
    const coachingSessionId = `session-${Date.now()}`;
    const time = `${start.getHours().toString().padStart(2, '0')}:${start
      .getMinutes()
      .toString()
      .padStart(2, '0')}`;

    setScheduleSessionData({
      date: start,
      time,
      title,
      coachingSessionId,
    });
    setIsScheduleSessionOpen(true);
  };

  /**
   * Handle event click for coach availability slots
   */
  const handleEventClick = (info: any) => {
    if (info.event.extendedProps.isCoachAvailability) {
      const start = new Date(info.event.start);
      const title = 'Coaching Session';
      const coachingSessionId = `session-${Date.now()}`;
      const time = `${start.getHours().toString().padStart(2, '0')}:${start
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      setScheduleSessionData({
        date: start,
        time,
        title,
        coachingSessionId,
      });
      setIsScheduleSessionOpen(true);
    }
  };

  /**
   * Handle date set to update current date
   */
  const handleDatesSet = (dateInfo: any) => {
    setCurrentDate(dateInfo.view.currentStart);
  };

  /**
   * Combine all events with their specific types
   */
  const allEvents = [
    ...events,
    ...coachAvailability.map((event, index) => ({
      ...event,
      isCoachAvailability: true,
      title: `Coach Available ${index + 1}`,
    })),
    ...yourMeetings.map((event) => ({ ...event, isYourMeeting: true })),
  ];

  /**
   * Handle session scheduling request
   */
  const handleSendRequest = () => {
    if (!scheduleSessionData) return;

    const { date, time, title, coachingSessionId } = scheduleSessionData;
    const [hours, minutes] = time.split(':').map(Number);
    const start = new Date(date);
    start.setHours(hours, minutes);
    const end = new Date(start);
    end.setHours(hours + 1, minutes);

    const newEvent: CalendarEvent = {
      id: Date.now().toString(),
      title,
      start: start.toISOString(),
      end: end.toISOString(),
      coachingSessionId,
    };

    onAddEvent(newEvent);
    setIsScheduleSessionOpen(false);
    setScheduleSessionData(null);
  };

  return (
    <div
      className="w-full bg-card-fill"
      onMouseEnter={variant === 'clickToSchedule' ? handleMouseEnter : undefined}
      onMouseLeave={variant === 'clickToSchedule' ? handleMouseLeave : undefined}
    >
      <CalendarHeader
        viewType={viewType}
        onNavigation={handleNavigation}
        onViewChange={handleViewChange}
        formatDate={formatDate}
        coachAvailability={coachAvailability}
        yourMeetings={yourMeetings}
        isVariantTwo={variant === 'clickToSchedule'}
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
            droppable={variant === 'dragAndDrop'}
            drop={variant === 'dragAndDrop' ? handleExternalDrop : undefined}
            dateClick={variant === 'clickToSchedule' ? handleCalendarClick : undefined}
            eventClick={variant === 'clickToSchedule' ? handleEventClick : undefined}
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
          {variant === 'clickToSchedule' && isHovering && (
            <div
              ref={draggableRef}
              className="absolute bg-button-primary text-button-primary-text px-2 py-1 rounded-md shadow-md pointer-events-none"
              style={{ zIndex: 1000 }}
            >
              Schedule Coaching Session
            </div>
          )}
        </div>
      </div>
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
              locale="en"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachingSessionCalendar;