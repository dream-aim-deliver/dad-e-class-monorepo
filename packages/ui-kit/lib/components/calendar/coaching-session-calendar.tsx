import React, { useState, useCallback, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarHeader } from './calendar-header';
import { EventContent } from './event';
import { calendarStyles } from './calendar-styles';
import { ScheduleSession } from './schedule-session';
import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';

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

export type Event = CalendarEvent | CoachAvailabilityEvent | UserMeetingEvent;

export interface ScheduleSessionData {
  date: Date;
  time: string;
  title: string;
  coachingSessionId?: string;
}

export interface CalendarProps extends isLocalAware{
  events: CalendarEvent[];
  coachAvailability: BaseEvent[];
  yourMeetings: BaseEvent[];
  availableCoachingSessionsData?: { id: string; title: string; time: number; numberOfSessions: number }[];
  onAddEvent: (event: CalendarEvent) => void;
  onEventDrop: (event: CalendarEvent) => void;
  variant: Variant;
  // Add these props for modal details
  coachName?: string;
  groupName?: string;
  courseTitle?: string;
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

const CoachingSessionCalendar: React.FC<CalendarProps> = ({
  events,
  coachAvailability,
  yourMeetings,
  onAddEvent,
  onEventDrop,
  variant,
  locale,
  coachName,
  groupName,
  courseTitle,
}) => {
  const [viewType, setViewType] = useState('timeGridWeek');
  const [isScheduleSessionOpen, setIsScheduleSessionOpen] = useState(false);
  const [scheduleSessionData, setScheduleSessionData] = useState<ScheduleSessionData | null>(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [isHovering, setIsHovering] = useState(false);

  const calendarRef = useRef<FullCalendar>(null);
  const draggableRef = useRef<HTMLDivElement>(null);

  // Helper function to check if a time slot is within coach availability
  const isWithinCoachAvailability = (start: Date, duration: string): boolean => {
    const [hours, minutes] = duration.split(':').map(Number);
    const end = new Date(start);
    end.setHours(start.getHours() + hours, start.getMinutes() + minutes);

    return coachAvailability.some((availability) => {
      const availStart = new Date(availability.start);
      const availEnd = new Date(availability.end);
      return start >= availStart && end <= availEnd;
    });
  };

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

  const handleExternalDrop = (info: any) => {
    const { draggedEl, date } = info;
    const title = draggedEl.getAttribute('data-title') || 'Coaching Session';
    const duration = draggedEl.getAttribute('data-duration') || '01:00';
    const coachingSessionId = draggedEl.getAttribute('data-session-id') || '';

    const start = new Date(date);

    // Check if the dropped slot is within coach availability
    if (!isWithinCoachAvailability(start, duration)) {
      window.dispatchEvent(new CustomEvent('invalidSessionDrop'));
      return;
    }

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

  const handleMouseEnter = () => {
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  const handleCalendarClick = (info: any) => {
    const start = new Date(info.date);
    const title = 'Coaching Session';
    const coachingSessionId = `session-${Date.now()}`;
    const duration = '01:00'; // Default duration for click-to-schedule

    // Check if the clicked slot is within coach availability
    if (!isWithinCoachAvailability(start, duration)) {
      console.log('Cannot schedule session: No coach availability for this time slot.');
      return;
    }

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

  const handleEventClick = (info: any) => {
    if (info.event.extendedProps.isCoachAvailability) {
      const start = new Date(info.event.start);
      const title = 'Coaching Session';
      const coachingSessionId = `session-${Date.now()}`;
      const duration = '01:00'; // Default duration for click-to-schedule
      const time = `${start.getHours().toString().padStart(2, '0')}:${start
        .getMinutes()
        .toString()
        .padStart(2, '0')}`;

      // Since this is a coach availability event, it's inherently valid
      setScheduleSessionData({
        date: start,
        time,
        title,
        coachingSessionId,
      });
      setIsScheduleSessionOpen(true);
    }
  };

  const handleDatesSet = (dateInfo: any) => {
    setCurrentDate(dateInfo.view.currentStart);
  };

  // Prepare events for FullCalendar, handling coach availability as visible events in month view
  const getAllEvents = () => {
    if (viewType === 'dayGridMonth') {
      return [
        ...events,
        ...coachAvailability.map((event, index) => ({
          ...event,
          isCoachAvailability: true,
          title: `Coach Available ${index + 1}`,
        })),
        ...yourMeetings.map((event) => ({ ...event, isYourMeeting: true })),
      ];
    } else {
      return [
        ...events,
        ...coachAvailability.map((event, index) => ({
          ...event,
          isCoachAvailability: true,
          title: `Coach Available ${index + 1}`,
        })),
        ...yourMeetings.map((event) => ({ ...event, isYourMeeting: true })),
      ];
    }
  };

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

  // Custom day cell content to limit events and show "+X more"
  const renderDayCellContent = (args: any) => {
    const dayNumber = args.date.getDate();
    const isToday = args.date.toDateString() === new Date().toDateString();
    const eventsForDay = getAllEvents().filter((event) => {
      const eventDate = new Date(event.start).toDateString();
      return eventDate === args.date.toDateString();
    });

    const maxEvents = window.innerWidth < 640 ? 2 : 3; // 2 events on small screens, 3 on larger
    const displayedEvents = eventsForDay.slice(0, maxEvents);
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
        locale={locale as TLocale}
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
            dayMaxEvents={window.innerWidth < 640 ? 2 : 3}
            weekends={true}
            events={getAllEvents()}
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
            dayCellContent={viewType === 'dayGridMonth' ? renderDayCellContent : undefined}
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
              coachName={coachName}
              groupName={groupName}
              courseTitle={courseTitle}
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
              locale={locale as TLocale}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default CoachingSessionCalendar;