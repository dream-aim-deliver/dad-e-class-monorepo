import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import React, { useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import {
    CoachingAvailabilityCard,
    MonthlyCalendar,
    WeeklyCalendar,
} from '@maany_shr/e-class-ui-kit';
import {
    useComputeMonthlyEvents,
    useComputeWeeklyEvents,
} from './hooks/use-compute-events';

interface WeeklyCalendarWrapperProps {
    coachAvailabilityViewModel:
        | viewModels.TCoachAvailabilityViewModel
        | undefined;
    setNewSession: React.Dispatch<
        React.SetStateAction<ScheduledOffering | null>
    >;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
}

export function WeeklyCalendarWrapper({
    coachAvailabilityViewModel,
    setNewSession,
    currentDate,
    setCurrentDate,
}: WeeklyCalendarWrapperProps) {
    const locale = useLocale() as TLocale;

    const { weeklyEvents } = useComputeWeeklyEvents({
        coachAvailabilityViewModel,
        onAvailabilityClick: (startTime: Date) => {
            setNewSession({
                startTime,
            });
        },
    });

    return (
        <WeeklyCalendar
            locale={locale}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            events={weeklyEvents}
        />
    );
}

interface MonthlyCalendarWrapperProps {
    coachAvailabilityViewModel:
        | viewModels.TCoachAvailabilityViewModel
        | undefined;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    setNewSession: React.Dispatch<
        React.SetStateAction<ScheduledOffering | null>
    >;
}

export function MonthlyCalendarWrapper({
    coachAvailabilityViewModel,
    currentDate,
    setCurrentDate,
    setNewSession,
}: MonthlyCalendarWrapperProps) {
    const locale = useLocale() as TLocale;
    const { monthlyEvents } = useComputeMonthlyEvents({
        coachAvailabilityViewModel,
    });
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(
        undefined,
    );

    const isSameDay = (date1: Date, date2: Date): boolean => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    const availability = useMemo(() => {
        if (
            !coachAvailabilityViewModel ||
            coachAvailabilityViewModel.mode !== 'default' ||
            !selectedDate
        ) {
            return [];
        }
        return coachAvailabilityViewModel.data.availability.filter((event) =>
            isSameDay(new Date(event.startTime), selectedDate),
        );
    }, [coachAvailabilityViewModel, selectedDate]);

    return (
        <div className="flex flex-col gap-3">
            <MonthlyCalendar
                locale={locale}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                dateEvents={monthlyEvents}
                selectedDate={selectedDate}
                onDateClick={(date) => {
                    setSelectedDate(date);
                }}
            />
            {availability.map((availability, index) => (
                <CoachingAvailabilityCard
                    locale={locale}
                    key={`availability-card-${index}`}
                    startTime={new Date(availability.startTime)}
                    endTime={new Date(availability.endTime)}
                    onClick={() => {
                        setNewSession({
                            startTime: new Date(availability.startTime),
                        });
                    }}
                />
            ))}
            {availability.length === 0 && (
                <div className="border border-text-primary text-text-primary p-4 rounded-md">
                    Please select a date with availability.
                </div>
            )}
        </div>
    );
}