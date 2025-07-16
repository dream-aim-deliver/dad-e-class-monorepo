import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "../../utils/style-utils";
import { TLocale, getDictionary } from "@maany_shr/e-class-translations";
import { Button } from "../button";

interface MonthlyCalendarProps {
    selectedDate?: Date;
    onDateClick?: (date: Date) => void;
    dateEvents?: {
        [date: string]: {
            hasCoachAvailability: boolean;
            hasSessions: boolean;
        }
    };
    locale: TLocale;
}

export function formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function MonthlyCalendar(props: MonthlyCalendarProps) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const dictionary = getDictionary(props.locale);

    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);

    // Get the first Monday of the calendar (might be from previous month)
    const firstMonday = new Date(firstDayOfMonth);
    const dayOfWeek = firstDayOfMonth.getDay();
    const daysToSubtract = dayOfWeek === 0 ? 6 : dayOfWeek - 1; // Sunday = 0, so we need 6 days back
    firstMonday.setDate(firstDayOfMonth.getDate() - daysToSubtract);

    // Get the last Sunday of the calendar (might be from next month)
    const lastSunday = new Date(lastDayOfMonth);
    const lastDayOfWeek = lastDayOfMonth.getDay();
    const daysToAdd = lastDayOfWeek === 0 ? 0 : 7 - lastDayOfWeek; // Sunday = 0
    lastSunday.setDate(lastDayOfMonth.getDate() + daysToAdd);

    // Generate all days from first Monday to last Sunday
    const calendarDays = [];
    for (let date = new Date(firstMonday); date <= lastSunday; date.setDate(date.getDate() + 1)) {
        calendarDays.push(new Date(date));
    }

    const currentMonth = currentDate.getMonth();

    // Generate localized day headers (Monday to Sunday)
    const dayHeaders = [];
    for (let i = 1; i <= 7; i++) {
        const date = new Date(2024, 0, i); // January 1, 2024 was a Monday
        dayHeaders.push(date.toLocaleDateString(props.locale, { weekday: 'short' }));
    }

    const changeMonth = (difference: 1 | -1) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + difference, 1));
    }

    return (
        <div className="bg-card-fill rounded-xl border border-card-stroke p-6 m-4 overflow-x-auto">
            <div className="flex flex-row justify-between items-center space-x-3">
                <div className="flex flex-row space-x-3">
                    <div className="text-lg font-semibold text-text-primary">
                        {currentDate.toLocaleDateString(props.locale, { month: 'long', year: 'numeric' })}
                    </div>
                    <div className="flex flex-row space-x-6 text-base-brand-500">
                        <ChevronLeft className="cursor-pointer" onClick={() => changeMonth(-1)} />
                        <ChevronRight className="cursor-pointer" onClick={() => changeMonth(1)} />
                    </div>
                </div>
                <Button variant="secondary" text={dictionary.components.calendar.today} onClick={() => setCurrentDate(new Date())} />
            </div>
            <div className="mt-4 grid grid-cols-7 gap-2 min-w-[320px]">
                {/* Day headers */}
                {dayHeaders.map((day, index) => (
                    <div key={index} className="py-2 font-semibold text-text-secondary text-center">
                        {day.toUpperCase()}
                    </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((date) => {
                    const isCurrentMonth = date.getMonth() === currentMonth;
                    const isSelected = props.selectedDate && date.toDateString() === props.selectedDate.toDateString();
                    const dateKey = formatDateKey(date);
                    const hasCoachAvailability = props.dateEvents?.[dateKey]?.hasCoachAvailability;
                    const hasSessions = props.dateEvents?.[dateKey]?.hasSessions;

                    return (
                        <div
                            key={date.toISOString()}
                            onClick={() => props.onDateClick?.(date)}
                            className={cn(`flex flex-col py-2 items-center justify-center text-text-primary aspect-square mx-auto space-y-1 min-w-0`,
                                !isCurrentMonth && 'text-base-neutral-400',
                                isSelected && 'bg-base-brand-500 text-text-primary-inverted rounded-full',
                                props.onDateClick ? 'cursor-pointer' : 'cursor-default')}
                        >
                            <span className="text-xl font-bold">{date.getDate()}</span>
                            {!isSelected && <div className="flex flex-row space-x-1">
                                {hasCoachAvailability && <div className="h-[6px] w-[6px] rounded-full bg-action-semi-transparent-medium"></div>}
                                {hasSessions && <div className="h-[6px] w-[6px] rounded-full bg-action-default"></div>}
                            </div>}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}