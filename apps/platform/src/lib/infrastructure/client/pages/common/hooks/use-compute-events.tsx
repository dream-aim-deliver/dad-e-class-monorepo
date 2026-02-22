import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    AvailabilityCalendarCard,
    formatDateKey,
    SessionCalendarCard,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { useMemo } from 'react';
import { splitTimeRangeByDays } from '../../../utils/split-time-range';

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
                            title={`${segment.original.sessionType?.startsWith('group-') ? 'Group Session' : 'Individual'}: ${segment.original.coachingOfferingName}`}
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
