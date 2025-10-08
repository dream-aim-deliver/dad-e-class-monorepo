import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import React, { useMemo, useState } from 'react';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
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
    setNewSession?: React.Dispatch<
        React.SetStateAction<ScheduledOffering | null>
    >;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    onAvailabilityClick?: (availability: useCaseModels.TAvailability) => void;
}

export function WeeklyCalendarWrapper({
    coachAvailabilityViewModel,
    setNewSession,
    currentDate,
    setCurrentDate,
    onAvailabilityClick,
}: WeeklyCalendarWrapperProps) {
    const locale = useLocale() as TLocale;

    const { weeklyEvents } = useComputeWeeklyEvents({
        coachAvailabilityViewModel,
        onNewEvent: setNewSession
            ? (startTime: Date) => {
                  setNewSession({
                      startTime,
                  });
              }
            : undefined,
        onAvailabilityClick,
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
    setNewSession?: React.Dispatch<
        React.SetStateAction<ScheduledOffering | null>
    >;
    onAvailabilityClick?: (availability: useCaseModels.TAvailability) => void;
}

export function MonthlyCalendarWrapper({
    coachAvailabilityViewModel,
    currentDate,
    setCurrentDate,
    setNewSession,
    onAvailabilityClick,
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

    const availabilityWithSessions = useMemo(() => {
        if (
            !coachAvailabilityViewModel ||
            coachAvailabilityViewModel.mode !== 'default' ||
            !selectedDate
        ) {
            return [];
        }

        const availabilityOnDate =
            coachAvailabilityViewModel.data.availability.filter((event) =>
                isSameDay(new Date(event.startTime), selectedDate),
            );

        return availabilityOnDate.map((availability) => {
            // Find all sessions that fall within this availability time slot
            const sessionsForAvailability =
                coachAvailabilityViewModel.data.mySessions.filter((session) => {
                    const sessionStart = new Date(session.startTime);
                    const sessionEnd = new Date(session.endTime);
                    const availStart = new Date(availability.startTime);
                    const availEnd = new Date(availability.endTime);

                    // Check if session overlaps with availability
                    return sessionStart >= availStart && sessionEnd <= availEnd;
                });

            return {
                availability,
                sessions: sessionsForAvailability,
            };
        });
    }, [coachAvailabilityViewModel, selectedDate]);

    // TODO: Implement handling sessions outside of availability

    const getOnRequestAvailabilityHandler = (
        availability: useCaseModels.TAvailability,
    ) => {
        if (!setNewSession) return;
        return () =>
            setNewSession({
                startTime: new Date(availability.startTime),
            });
    };

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
            {availabilityWithSessions.map(
                ({ availability, sessions }, index) => (
                    <CoachingAvailabilityCard
                        locale={locale}
                        key={`availability-card-${index}`}
                        onRequest={getOnRequestAvailabilityHandler(
                            availability,
                        )}
                        availability={{
                            startTime: new Date(availability.startTime),
                            endTime: new Date(availability.endTime),
                            onClick: () => onAvailabilityClick?.(availability),
                        }}
                        coachingSessions={sessions.map((session) => ({
                            startTime: new Date(session.startTime),
                            endTime: new Date(session.endTime),
                            title: session.coachingOfferingName,
                            onClick: () => {
                                // TODO: Implement session click functionality
                            },
                        }))}
                    />
                ),
            )}
            {availabilityWithSessions.length === 0 && (
                <div className="border border-card-stroke bg-card-fill text-text-secondary p-4 rounded-md">
                    Please select a date with availability.
                </div>
            )}
        </div>
    );
}
