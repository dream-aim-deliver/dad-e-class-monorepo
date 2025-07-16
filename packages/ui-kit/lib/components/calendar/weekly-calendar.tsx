import { TLocale } from "@maany_shr/e-class-translations";
import { useEffect, useMemo, useRef } from "react";

const isToday = (date) => {
    const today = new Date();
    return date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear();
};

const getHeaderBackground = (date) => {
    if (isToday(date)) {
        return 'bg-base-neutral-700';
    }
    return 'bg-base-neutral-800';
}

const getCellBackground = (date) => {
    if (isToday(date)) {
        return 'bg-base-neutral-800';
    }
    return 'bg-card-fill';
}

interface WeeklyCalendarProps {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    locale: TLocale;
}

function WeekdayHeader({ date, locale }: { date: Date; locale: TLocale }) {
    const weekday = date.toLocaleDateString(locale, { weekday: 'short' });
    const day = date.getDate();

    return <div className={`${getHeaderBackground(date)} border-t border-divider outline outline-1 outline-divider p-2 pb-0 font-medium text-text-primary`}>
        <div className="text-text-secondary text-sm">{weekday.toUpperCase()}</div>
        <div className="text-3xl font-bold">{day}</div>
    </div>
}

export function WeeklyCalendar({ currentDate, setCurrentDate, locale }: WeeklyCalendarProps) {
    const getWeekStart = (date) => {
        const d = new Date(date);
        const day = d.getDay();
        const diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    // Get array of dates for the current week
    const getWeekDates = () => {
        const weekStart = getWeekStart(currentDate);
        const dates = [];
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            dates.push(date);
        }
        return dates;
    };

    const timeSlots = useMemo(() => {
        const slots = [];
        for (let hour = 0; hour < 24; hour++) {
            const date = new Date();
            date.setHours(hour, 0, 0, 0);

            const formattedTime = date.toLocaleTimeString(locale, {
                hour: 'numeric',
                minute: '2-digit',
                hour12: undefined // Let the locale decide 12/24 hour format
            });

            slots.push(formattedTime);
        }
        return slots;
    }, [locale]);

    const weekDates = getWeekDates();

    const getTimezoneFormat = () => {
        const now = new Date();

        const offsetMinutes = now.getTimezoneOffset();
        const offsetHours = -offsetMinutes / 60;

        // Format the offset as GMT±X
        return `GMT${offsetHours >= 0 ? '+' : ''}${offsetHours}`;
    }

    return (
        <div className="flex flex-col h-full w-full bg-base-neutral-900">
            {/* Header row */}
            <div className="grid grid-cols-[80px_repeat(7,1fr)] sticky top-0 z-10">
                <div className="p-2 text-sm text-base-neutral-500 bg-card-fill">
                    {getTimezoneFormat()}
                </div>
                {weekDates.map((date, index) => (
                    <WeekdayHeader key={index} date={date} locale={locale} />
                ))}
            </div>


            {/* Time slots and calendar grid */}
            <div
                className="flex-1 overflow-auto"
            >
                {/* Time slots and calendar grid */}
                {timeSlots.map((time, timeIndex) => (
                    <div key={timeIndex} className="grid grid-cols-[80px_repeat(7,1fr)]">
                        <div className="p-2 h-24 text-sm text-text-secondary border-r border-divider">
                            {time}
                        </div>
                        {weekDates.map((date, dateIndex) => (
                            <div key={dateIndex}
                                className={`outline outline-1 outline-divider h-24 ${getCellBackground(date)}`}>
                                {/* Empty cell for events/appointments */}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}