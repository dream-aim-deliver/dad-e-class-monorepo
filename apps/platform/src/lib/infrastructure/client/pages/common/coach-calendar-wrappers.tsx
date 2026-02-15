import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
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
import { splitTimeRangeByDays } from '../../utils/split-time-range';

interface WeeklyCoachCalendarWrapperProps {
    coachAvailabilityViewModel:
        | viewModels.TCoachAvailabilityViewModel
        | undefined;
    setNewSessionStart?: (startTime: Date) => void;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    openDialog?: () => void;
    onAvailabilityClick?: (availability: useCaseModels.TAvailability) => void;
    scrollToHour?: number;
    scrollKey?: number;
}

export function WeeklyCoachCalendarWrapper({
    coachAvailabilityViewModel,
    setNewSessionStart,
    currentDate,
    setCurrentDate,
    onAvailabilityClick,
    openDialog,
    scrollToHour,
    scrollKey,
}: WeeklyCoachCalendarWrapperProps) {
    const locale = useLocale() as TLocale;

    const getOnNewEventHandler = () => {
        if (!setNewSessionStart) return;
        return (startTime: Date) => {
            setNewSessionStart?.(startTime);
            openDialog?.();
        };
    };

    const { weeklyEvents } = useComputeWeeklyEvents({
        coachAvailabilityViewModel,
        onNewEvent: getOnNewEventHandler(),
        onAvailabilityClick,
    });

    return (
        <WeeklyCalendar
            locale={locale}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            events={weeklyEvents}
            scrollToHour={scrollToHour}
            scrollKey={scrollKey}
        />
    );
}

interface MonthlyCoachCalendarWrapperProps {
    coachAvailabilityViewModel:
        | viewModels.TCoachAvailabilityViewModel
        | undefined;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    setNewSessionStart?: (startTime: Date) => void;
    openDialog?: () => void;
    onAvailabilityClick?: (availability: useCaseModels.TAvailability) => void;
    onSessionClick?: (sessionId: number) => void;
    variant?: 'compact' | 'full';
    selectedDate?: Date;
    setSelectedDate?: (date: Date | undefined) => void;
}

export function MonthlyCoachCalendarWrapper({
    coachAvailabilityViewModel,
    currentDate,
    setCurrentDate,
    setNewSessionStart,
    onAvailabilityClick,
    onSessionClick,
    openDialog,
    variant = 'compact',
    selectedDate: externalSelectedDate,
    setSelectedDate: externalSetSelectedDate,
}: MonthlyCoachCalendarWrapperProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('components.calendar');
    const { monthlyEvents } = useComputeMonthlyEvents({
        coachAvailabilityViewModel,
    });
    const [internalSelectedDate, setInternalSelectedDate] = useState<Date | undefined>(
        undefined,
    );

    // Use external state if provided, otherwise use internal state
    const selectedDate = externalSelectedDate !== undefined ? externalSelectedDate : internalSelectedDate;
    const setSelectedDate = externalSetSelectedDate || setInternalSelectedDate;

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

        // Split all availability periods by day
        const availabilitySegments =
            coachAvailabilityViewModel.data.availability.flatMap(
                (availability) =>
                    splitTimeRangeByDays(
                        availability.startTime,
                        availability.endTime,
                        availability,
                    ),
            );

        // Split all sessions by day
        const sessionSegments =
            coachAvailabilityViewModel.data.mySessions.flatMap((session) =>
                splitTimeRangeByDays(
                    session.startTime,
                    session.endTime,
                    session,
                ),
            );

        // Filter availability segments for the selected date
        const availabilityOnDate = availabilitySegments.filter((segment) =>
            isSameDay(new Date(segment.startTime), selectedDate),
        );

        // Filter session segments for the selected date
        const sessionsOnDate = sessionSegments.filter((segment) =>
            isSameDay(new Date(segment.startTime), selectedDate),
        );

        const result: Array<{
            availability?: useCaseModels.TAvailability;
            sessions: useCaseModels.TCoachCoachingSession[];
        }> = [];

        // Track which sessions have been assigned to an availability
        const assignedSessionIds = new Set<number>();

        // Map availability segments with their sessions
        availabilityOnDate.forEach((availabilitySegment) => {
            // Find all session segments that fall within this availability segment
            const sessionsForAvailability = sessionsOnDate.filter(
                (sessionSegment) => {
                    const sessionStart = new Date(sessionSegment.startTime);
                    const sessionEnd = new Date(sessionSegment.endTime);
                    const availStart = new Date(availabilitySegment.startTime);
                    const availEnd = new Date(availabilitySegment.endTime);

                    // Check if session segment overlaps with availability segment
                    return sessionStart >= availStart && sessionEnd <= availEnd;
                },
            );

            // Mark these sessions as assigned
            sessionsForAvailability.forEach((seg) => {
                assignedSessionIds.add(seg.original.id);
            });

            result.push({
                availability: {
                    ...availabilitySegment.original,
                    startTime: availabilitySegment.startTime,
                    endTime: availabilitySegment.endTime,
                },
                sessions: sessionsForAvailability.map((seg) => ({
                    ...seg.original,
                    startTime: seg.startTime,
                    endTime: seg.endTime,
                })),
            });
        });

        // Find sessions that are not assigned to any availability
        const sessionsOutsideAvailability = sessionsOnDate.filter(
            (sessionSegment) =>
                !assignedSessionIds.has(sessionSegment.original.id),
        );

        // Add sessions outside availability as a separate card without availability
        if (sessionsOutsideAvailability.length > 0) {
            result.push({
                availability: undefined,
                sessions: sessionsOutsideAvailability.map((seg) => ({
                    ...seg.original,
                    startTime: seg.startTime,
                    endTime: seg.endTime,
                })),
            });
        }

        return result;
    }, [coachAvailabilityViewModel, selectedDate]);

    const getOnRequestAvailabilityHandler = (
        availability: useCaseModels.TAvailability,
    ) => {
        if (!setNewSessionStart) return;
        return () => {
            setNewSessionStart?.(new Date(availability.startTime));
            openDialog?.();
        };
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
                variant={variant}
            />
            {availabilityWithSessions.map(
                ({ availability, sessions }, index) => {
                    const availabilityProps = availability
                        ? {
                              startTime: new Date(availability.startTime),
                              endTime: new Date(availability.endTime),
                              onClick: onAvailabilityClick
                                  ? () => onAvailabilityClick(availability)
                                  : undefined,
                          }
                        : undefined;

                    const sessionProps = sessions.map((session) => ({
                        startTime: new Date(session.startTime),
                        endTime: new Date(session.endTime),
                        title: session.coachingOfferingName,
                        onClick: onSessionClick
                            ? () => onSessionClick(session.id)
                            : undefined,
                    }));

                    return (
                        <CoachingAvailabilityCard
                            locale={locale}
                            key={`availability-card-${index}`}
                            onRequest={
                                availability
                                    ? getOnRequestAvailabilityHandler(
                                          availability,
                                      )
                                    : undefined
                            }
                            availability={availabilityProps}
                            coachingSessions={sessionProps}
                        />
                    );
                },
            )}
            {availabilityWithSessions.length === 0 && (
                <div className="border border-base-neutral-700 bg-base-neutral-800 text-text-secondary p-4 rounded-md">
                    {t('selectDateWithAvailability')}
                </div>
            )}
        </div>
    );
}
