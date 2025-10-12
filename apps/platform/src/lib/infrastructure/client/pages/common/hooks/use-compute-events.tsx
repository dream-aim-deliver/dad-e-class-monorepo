import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    AvailabilityCalendarCard,
    formatDateKey,
    SessionCalendarCard,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { useMemo } from 'react';

/**
 * Splits a time period that spans multiple days into separate daily segments.
 * Each segment starts at the beginning of the period or midnight, and ends at
 * the end of the period or 23:59:59.999 of that day.
 */
function splitTimeRangeByDays<T>(
    startTime: string,
    endTime: string,
    original: T,
): {
    startTime: string;
    endTime: string;
    original: T;
}[] {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check if time range spans multiple days
    const startDay = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
    );
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    if (startDay.getTime() === endDay.getTime()) {
        // Same day, no split needed
        return [
            {
                startTime,
                endTime,
                original,
            },
        ];
    }

    // Split into multiple days
    const segments: {
        startTime: string;
        endTime: string;
        original: T;
    }[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
        const dayStart = new Date(currentDate);
        const dayEnd = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            23,
            59,
            59,
            999,
        );

        const segmentStart =
            currentDate.getTime() === start.getTime() ? start : dayStart;
        const segmentEnd = dayEnd > end ? end : dayEnd;

        segments.push({
            startTime: segmentStart.toISOString(),
            endTime: segmentEnd.toISOString(),
            original,
        });

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0, 0, 0, 0);
    }

    return segments;
}

/**
 * Splits an availability period that spans multiple days into separate daily segments.
 */
function splitAvailabilityByDays(availability: useCaseModels.TAvailability) {
    return splitTimeRangeByDays(
        availability.startTime,
        availability.endTime,
        availability,
    );
}

/**
 * Splits a coaching session that spans multiple days into separate daily segments.
 */
function splitSessionByDays(session: useCaseModels.TCoachCoachingSession) {
    return splitTimeRangeByDays(session.startTime, session.endTime, session);
}

interface UseComputeEventsProps {
    coachAvailabilityViewModel:
        | viewModels.TCoachAvailabilityViewModel
        | undefined;
}

interface UseComputeWeeklyEventsProps extends UseComputeEventsProps {
    onNewEvent?: (startTime: Date) => void;
    onAvailabilityClick?: (availability: useCaseModels.TAvailability) => void;
    onSessionClick?: (sessionId: number) => void;
}

export function useComputeWeeklyEvents({
    coachAvailabilityViewModel,
    onNewEvent,
    onAvailabilityClick,
    onSessionClick,
}: UseComputeWeeklyEventsProps) {
    const locale = useLocale() as TLocale;

    const weeklyEvents = useMemo(() => {
        if (
            !coachAvailabilityViewModel ||
            coachAvailabilityViewModel.mode !== 'default'
        ) {
            return [];
        }

        const events: {
            start: Date;
            end: Date;
            priority: number;
            component: React.ReactNode;
        }[] = [];

        coachAvailabilityViewModel.data.mySessions.forEach((session) => {
            const segments = splitSessionByDays(session);

            segments.forEach((segment) => {
                events.push({
                    start: new Date(segment.startTime),
                    end: new Date(segment.endTime),
                    priority: 2,
                    component: (
                        <SessionCalendarCard
                            locale={locale}
                            start={new Date(segment.startTime)}
                            end={new Date(segment.endTime)}
                            title={segment.original.coachingOfferingName}
                            onClick={() =>
                                onSessionClick?.(segment.original.id)
                            }
                        />
                    ),
                });
            });
        });

        coachAvailabilityViewModel.data.availability.forEach((availability) => {
            const segments = splitAvailabilityByDays(availability);

            segments.forEach((segment) => {
                events.push({
                    start: new Date(segment.startTime),
                    end: new Date(segment.endTime),
                    priority: 1,
                    component: (
                        <AvailabilityCalendarCard
                            locale={locale}
                            start={new Date(segment.startTime)}
                            end={new Date(segment.endTime)}
                            onNewEvent={onNewEvent}
                            onClick={() =>
                                onAvailabilityClick?.(segment.original)
                            }
                        />
                    ),
                });
            });
        });

        return events;
    }, [coachAvailabilityViewModel]);

    return {
        weeklyEvents,
    };
}

export function useComputeMonthlyEvents({
    coachAvailabilityViewModel,
}: UseComputeEventsProps) {
    const monthlyEvents = useMemo(() => {
        if (
            !coachAvailabilityViewModel ||
            coachAvailabilityViewModel.mode !== 'default'
        ) {
            return {};
        }

        const dateEventsMap: {
            [date: string]: {
                hasCoachAvailability: boolean;
                hasSessions: boolean;
            };
        } = {};

        // Process sessions - split multi-day sessions into separate days
        coachAvailabilityViewModel.data.mySessions.forEach((session) => {
            const segments = splitSessionByDays(session);

            segments.forEach((segment) => {
                const dateKey = formatDateKey(new Date(segment.startTime));

                if (!dateEventsMap[dateKey]) {
                    dateEventsMap[dateKey] = {
                        hasCoachAvailability: false,
                        hasSessions: false,
                    };
                }

                dateEventsMap[dateKey].hasSessions = true;
            });
        });

        // Process availability - split multi-day availability into separate days
        coachAvailabilityViewModel.data.availability.forEach((availability) => {
            const segments = splitAvailabilityByDays(availability);

            segments.forEach((segment) => {
                const dateKey = formatDateKey(new Date(segment.startTime));

                if (!dateEventsMap[dateKey]) {
                    dateEventsMap[dateKey] = {
                        hasCoachAvailability: false,
                        hasSessions: false,
                    };
                }

                dateEventsMap[dateKey].hasCoachAvailability = true;
            });
        });

        return dateEventsMap;
    }, [coachAvailabilityViewModel]);

    return { monthlyEvents };
}
