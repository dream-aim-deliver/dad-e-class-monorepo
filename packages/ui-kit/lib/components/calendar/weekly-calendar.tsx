'use client';

import { isLocalAware, TLocale } from '@maany_shr/e-class-translations';
import { useEffect, useMemo, useRef } from 'react';
import LoadingOverlay from './loading-overlay';

const isToday = (date: Date) => {
    const today = new Date();
    return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
    );
};

const getWeekStart = (date: Date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
};

const getHeaderBackground = (date: Date) => {
    if (isToday(date)) {
        return 'bg-base-neutral-700';
    }
    return 'bg-base-neutral-800';
};

interface CalendarEvent {
    start: Date;
    end: Date;
    priority: number;
    component: React.ReactNode;
}

interface WeeklyCalendarProps extends isLocalAware {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    events?: CalendarEvent[];
    onSessionDrop?: (sessionId: string, date: Date, startTime: string) => void;
    isLoading?: boolean;
    scrollToHour?: number;
    scrollKey?: number;
}

interface ProcessedEvent extends CalendarEvent {
    id: string;
    priority: number;
    dayIndex: number;
    startMinutes: number;
    durationMinutes: number;
}

function WeekdayHeader({ date, locale }: { date: Date; locale: TLocale }) {
    const weekday = date.toLocaleDateString(locale, { weekday: 'short' });
    const day = date.getDate();

    return (
        <div
            className={`${getHeaderBackground(date)} border-t border-divider outline outline-1 outline-divider p-2 pb-0 font-medium text-text-primary`}
        >
            <div className="text-text-secondary text-sm">
                {weekday.toUpperCase()}
            </div>
            <div className="text-3xl font-bold">{day}</div>
        </div>
    );
}

export function WeeklyCalendar({
    currentDate,
    setCurrentDate,
    onSessionDrop,
    locale,
    events,
    isLoading,
    scrollToHour,
    scrollKey,
}: WeeklyCalendarProps) {
    // Get array of dates for the current week
    const getWeekDates = () => {
        const weekStart = getWeekStart(currentDate);
        const dates: Date[] = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const timeSlots = useMemo(() => {
        const slots: string[] = [];
        for (let hour = 0; hour < 24; hour++) {
            const date = new Date();
            date.setHours(hour, 0, 0, 0);

            const formattedTime = date.toLocaleTimeString(locale, {
                hour: 'numeric',
                minute: '2-digit',
                hour12: undefined, // Let the locale decide 12/24 hour format
            });

            slots.push(formattedTime);
        }
        return slots;
    }, [locale]);

    const weekDates = getWeekDates();

    // Helper function to get day index for a date
    const getDayIndex = (date: Date, weekDates: Date[]) => {
        const dateStr = date.toDateString();
        return weekDates.findIndex(
            (weekDate) => weekDate.toDateString() === dateStr,
        );
    };

    // Helper function to convert time to minutes from midnight
    const timeToMinutes = (date: Date) => {
        return date.getHours() * 60 + date.getMinutes();
    };

    // Process events to calculate positioning
    const processedEvents = useMemo(() => {
        if (!events || events.length === 0) {
            return [];
        }

        const processed: ProcessedEvent[] = events
            .filter((event) => {
                // Filter events that fall within the current week
                const dayIndex = getDayIndex(event.start, weekDates);
                return dayIndex !== -1;
            })
            .map((event, index) => ({
                ...event,
                id: `event-${index}`,
                priority: event.priority,
                dayIndex: getDayIndex(event.start, weekDates),
                startMinutes: timeToMinutes(event.start),
                durationMinutes: Math.max(
                    30,
                    timeToMinutes(event.end) - timeToMinutes(event.start),
                ), // Minimum 30 minutes
            }));

        return processed;
    }, [events, weekDates]);

    // Group processed events by day for easy lookup
    const eventsByDayAndTime = useMemo(() => {
        const grouped: { [key: string]: ProcessedEvent[] } = {};

        processedEvents.forEach((event) => {
            const key = `${event.dayIndex}`;
            if (!grouped[key]) {
                grouped[key] = [];
            }
            grouped[key].push(event);
        });

        return grouped;
    }, [processedEvents]);

    // Component to render a single event
    const EventComponent = ({ event }: { event: ProcessedEvent }) => {
        const top = (event.startMinutes / 60) * 96; // 96px per hour (24px * 4 quarters)
        const height = Math.max(20, (event.durationMinutes / 60) * 96);
        const zIndex = 10 + event.priority; // Base z-index plus priority

        return (
            <div
                className='absolute px-1'
                style={{
                    top: `${top}px`,
                    height: `${height}px`,
                    left: 0,
                    right: 0,
                    paddingRight: '2px',
                    zIndex,
                }}
            >
                {event.component}
            </div>
        );
    };

    const getTimezoneFormat = () => {
        const now = new Date();

        const offsetMinutes = now.getTimezoneOffset();
        const offsetHours = -offsetMinutes / 60;

        // Format the offset as GMT±X
        return `GMT${offsetHours >= 0 ? '+' : ''}${offsetHours}`;
    };

    const getCellBackground = (time: string, date: Date) => {
        const dayOfWeek = date.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6; // Sunday = 0, Saturday = 6

        if (isToday(date)) {
            return 'bg-base-neutral-800';
        }
        if (isWeekend) {
            return 'bg-base-neutral-950';
        }
        return 'bg-card-fill';
    };

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
     if (scrollContainerRef.current) {
       const container = scrollContainerRef.current;
       // Scroll to 6am (6 hours * 96px per hour slot = 576px)
       const sixAmPosition = 6 * 96;
       container.scrollTop = sixAmPosition;
     }
   }, [scrollContainerRef]);

    useEffect(() => {
        if (scrollToHour !== undefined && scrollContainerRef.current) {
            const position = scrollToHour * 96;
            scrollContainerRef.current.scrollTop = position;
        }
    }, [scrollToHour, scrollKey]);

    return (
        <div
            ref={scrollContainerRef}
            className="flex flex-col h-full w-full bg-base-neutral-900 overflow-auto"
        >
            {isLoading && <LoadingOverlay className="fixed z-60" />}

            {/* Header row */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] sticky top-0 z-40">
                <div className="p-2 text-sm text-base-neutral-500 bg-card-fill">
                    {getTimezoneFormat()}
                </div>
                {weekDates.map((date, index) => (
                    <WeekdayHeader key={index} date={date} locale={locale} />
                ))}
            </div>

            {/* Time slots and calendar grid */}
            <div className="flex-1">
                <div className="relative">
                    {/* Time slots and calendar grid */}
                    {timeSlots.map((time, timeIndex) => (
                        <div
                            key={timeIndex}
                            className="grid grid-cols-[80px_repeat(7,1fr)]"
                        >
                            <div className="p-2 h-24 text-sm text-text-secondary border-r border-divider">
                                {time}
                            </div>
                            {weekDates.map((date, dateIndex) => (
                                <div
                                    key={dateIndex}
                                    className={`outline outline-1 outline-divider border-r border-b border-divider h-24 ${getCellBackground(time, date)} relative`}
                                >
                                    {/* Events will be positioned absolutely within their day columns */}
                                </div>
                            ))}
                        </div>
                    ))}

                    {/* Event overlay - positioned absolutely over the entire calendar */}
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="grid grid-cols-[80px_repeat(7,1fr)] h-full">
                            <div className="h-full"></div>
                            {weekDates.map((date, dateIndex) => (
                                <div
                                    key={dateIndex}
                                    className="relative h-full pointer-events-auto"
                                >
                                    {(eventsByDayAndTime[dateIndex] || []).map(
                                        (event) => (
                                            <EventComponent
                                                key={event.id}
                                                event={event}
                                            />
                                        ),
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

