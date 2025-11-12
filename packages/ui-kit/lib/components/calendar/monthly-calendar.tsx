import { cn } from '../../utils/style-utils';
import {
    isLocalAware,
} from '@maany_shr/e-class-translations';
import LoadingOverlay from './loading-overlay';
import { CalendarNavigationHeader } from './calendar-navigation-header';
import { Divider } from '../divider';

interface MonthlyCalendarProps extends isLocalAware {
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    selectedDate?: Date;
    onDateClick?: (date: Date) => void;
    dateEvents?: {
        [date: string]: {
            hasCoachAvailability: boolean;
            hasSessions: boolean;
        };
    };
    isLoading?: boolean;
    variant?: 'compact' | 'full';
}

export function formatDateKey(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

export function MonthlyCalendar(props: MonthlyCalendarProps) {
    const { currentDate, setCurrentDate } = props;

    const firstDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth(),
        1,
    );
    const lastDayOfMonth = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        0,
    );

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
    const calendarDays: Date[] = [];
    for (
        let date = new Date(firstMonday);
        date <= lastSunday;
        date.setDate(date.getDate() + 1)
    ) {
        calendarDays.push(new Date(date));
    }

    const currentMonth = currentDate.getMonth();

    // Generate localized day headers (Monday to Sunday)
    const dayHeaders: string[] = [];
    for (let i = 1; i <= 7; i++) {
        const date = new Date(2024, 0, i); // January 1, 2024 was a Monday
        dayHeaders.push(
            date.toLocaleDateString(props.locale, { weekday: 'short' }),
        );
    }

    const showHeader = props.variant === 'compact';

    return (
        <div className="bg-base-neutral-800 rounded-xl border border-base-neutral-700 p-6 overflow-x-auto relative">
            {props.isLoading && <LoadingOverlay />}

            {showHeader && (
                <CalendarNavigationHeader
                    currentDate={currentDate}
                    setCurrentDate={setCurrentDate}
                    locale={props.locale}
                    viewType="monthly"
                    onDateClick={props.onDateClick}
                />
            )}

            <div className="grid grid-cols-7 gap-2 min-w-[320px]">
                {/* Day headers */}
                {dayHeaders.map((day, index) => (
                    <div
                        key={index}
                        className="py-2 font-semibold text-text-primary text-sm md:text-xl text-center"
                    >
                        {day.toUpperCase()}
                        <Divider className='my-2'/>
                    </div>
                ))}

                {/* Calendar days */}
                {calendarDays.map((date) => {
                    const isCurrentMonth = date.getMonth() === currentMonth;
                    const today = new Date();
                    const isToday =
                        date.getDate() === today.getDate() &&
                        date.getMonth() === today.getMonth() &&
                        date.getFullYear() === today.getFullYear();
                    const isSelected =
                        props.selectedDate &&
                        date.toDateString() ===
                            props.selectedDate.toDateString();
                    const dateKey = formatDateKey(date);
                    const hasCoachAvailability =
                        props.dateEvents?.[dateKey]?.hasCoachAvailability;
                    const hasSessions =
                        props.dateEvents?.[dateKey]?.hasSessions;

                    return (
                        <div
                            key={date.toISOString()}
                            onClick={() => props.onDateClick?.(date)}
                            className={cn(
                                `flex flex-col items-center justify-center text-text-primary mx-auto min-w-0 w-10 h-10`,
                                !isCurrentMonth && 'text-base-neutral-400',
                                isSelected &&
                                    'bg-base-brand-500 text-text-primary-inverted rounded-full',
                                isToday && !isSelected &&
                                    'bg-base-brand-400 text-text-primary-inverted rounded-full',
                                props.onDateClick
                                    ? 'cursor-pointer'
                                    : 'cursor-default',
                            )}
                        >
                            <span className="text-xl font-bold leading-none">
                                {date.getDate()}
                            </span>
                            {!isSelected && !isToday && (
                                <div className="flex flex-row space-x-1 mt-1">
                                    {hasCoachAvailability && (
                                        <div className="h-[6px] w-[6px] rounded-full bg-action-semi-transparent-medium"></div>
                                    )}
                                    {hasSessions && (
                                        <div className="h-[6px] w-[6px] rounded-full bg-action-default"></div>
                                    )}
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
