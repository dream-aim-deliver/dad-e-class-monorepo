import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import {
    AvailabilityCalendarCard,
    formatDateKey,
    SessionCalendarCard,
} from '@maany_shr/e-class-ui-kit';
import { useLocale } from 'next-intl';
import { useMemo } from 'react';

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
            events.push({
                start: new Date(session.startTime),
                end: new Date(session.endTime),
                priority: 2,
                component: (
                    <SessionCalendarCard
                        locale={locale}
                        start={new Date(session.startTime)}
                        end={new Date(session.endTime)}
                        title={session.coachingOfferingName}
                        onClick={() => onSessionClick?.(session.id)}
                    />
                ),
            });
        });

        coachAvailabilityViewModel.data.availability.forEach((availability) => {
            events.push({
                start: new Date(availability.startTime),
                end: new Date(availability.endTime),
                priority: 1,
                component: (
                    <AvailabilityCalendarCard
                        locale={locale}
                        start={new Date(availability.startTime)}
                        end={new Date(availability.endTime)}
                        onNewEvent={onNewEvent}
                        onClick={() => onAvailabilityClick?.(availability)}
                    />
                ),
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

        // Process sessions
        coachAvailabilityViewModel.data.mySessions.forEach((session) => {
            const dateKey = formatDateKey(new Date(session.startTime));

            if (!dateEventsMap[dateKey]) {
                dateEventsMap[dateKey] = {
                    hasCoachAvailability: false,
                    hasSessions: false,
                };
            }

            dateEventsMap[dateKey].hasSessions = true;
        });

        // Process availability
        coachAvailabilityViewModel.data.availability.forEach((availability) => {
            const dateKey = formatDateKey(new Date(availability.startTime));

            if (!dateEventsMap[dateKey]) {
                dateEventsMap[dateKey] = {
                    hasCoachAvailability: false,
                    hasSessions: false,
                };
            }

            dateEventsMap[dateKey].hasCoachAvailability = true;
        });

        return dateEventsMap;
    }, [coachAvailabilityViewModel]);

    return { monthlyEvents };
}
