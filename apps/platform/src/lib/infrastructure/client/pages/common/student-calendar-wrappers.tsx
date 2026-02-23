import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';
import { useCaseModels, viewModels } from '@maany_shr/e-class-models';
import {
    CoachingAvailabilityCard,
    formatDateKey,
    MonthlyCalendar,
    SessionCalendarCard,
    WeeklyCalendar,
} from '@maany_shr/e-class-ui-kit';
import { splitTimeRangeByDays } from '../../utils/split-time-range';

interface WeeklyStudentCalendarWrapperProps {
    studentCoachingSessionsViewModel:
        | viewModels.TStudentCoachingSessionsListViewModel
        | undefined;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    onSessionClick?: (sessionId: number | string) => void;
}

export function WeeklyStudentCalendarWrapper({
    studentCoachingSessionsViewModel,
    currentDate,
    setCurrentDate,
    onSessionClick,
}: WeeklyStudentCalendarWrapperProps) {
    const locale = useLocale() as TLocale;

    const weeklyEvents = useMemo(() => {
        if (
            !studentCoachingSessionsViewModel ||
            studentCoachingSessionsViewModel.mode !== 'default'
        ) {
            return [];
        }

        const events: {
            start: Date;
            end: Date;
            priority: number;
            component: React.ReactNode;
        }[] = [];

        studentCoachingSessionsViewModel.data.sessions.forEach((session) => {
            if (session.status === 'unscheduled') return;

            const segments = splitTimeRangeByDays(session.startTime, session.endTime, session);

            segments.forEach((segment) => {
                events.push({
                    start: new Date(segment.startTime),
                    end: new Date(segment.endTime),
                    priority: 1,
                    component: (
                        <SessionCalendarCard
                            locale={locale}
                            start={new Date(segment.startTime)}
                            end={new Date(segment.endTime)}
                            title={`${segment.original.sessionType?.startsWith('group-') ? 'Group Session' : 'Individual'}: ${segment.original.coachingOfferingTitle}`}
                            onClick={() =>
                                onSessionClick?.(segment.original.id)
                            }
                        />
                    ),
                });
            });
        });

        return events;
    }, [studentCoachingSessionsViewModel]);

    return (
        <WeeklyCalendar
            locale={locale}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            events={weeklyEvents}
        />
    );
}

interface MonthlyStudentCalendarWrapperProps {
    studentCoachingSessionsViewModel:
        | viewModels.TStudentCoachingSessionsListViewModel
        | undefined;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    onSessionClick?: (sessionId: number | string) => void;
    variant?: 'compact' | 'full';
    selectedDate?: Date;
    setSelectedDate?: (date: Date | undefined) => void;
}

export function MonthlyStudentCalendarWrapper({
    studentCoachingSessionsViewModel,
    currentDate,
    setCurrentDate,
    onSessionClick,
    variant = 'compact',
    selectedDate: externalSelectedDate,
    setSelectedDate: externalSetSelectedDate,
}: MonthlyStudentCalendarWrapperProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('components.calendar');
    const [internalSelectedDate, setInternalSelectedDate] = useState<Date | undefined>(
        undefined,
    );

    // Use external state if provided, otherwise use internal state
    const selectedDate = externalSelectedDate !== undefined ? externalSelectedDate : internalSelectedDate;
    const setSelectedDate = externalSetSelectedDate || setInternalSelectedDate;

    const monthlyEvents = useMemo(() => {
        if (
            !studentCoachingSessionsViewModel ||
            studentCoachingSessionsViewModel.mode !== 'default'
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
        studentCoachingSessionsViewModel.data.sessions.forEach((session) => {
            if (session.status === 'unscheduled') return;

            const segments = splitTimeRangeByDays(session.startTime, session.endTime, session);

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

        return dateEventsMap;
    }, [studentCoachingSessionsViewModel]);

    const isSameDay = (date1: Date, date2: Date): boolean => {
        return (
            date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate()
        );
    };

    const sessionsOnDate = useMemo(() => {
        if (
            !studentCoachingSessionsViewModel ||
            studentCoachingSessionsViewModel.mode !== 'default' ||
            !selectedDate
        ) {
            return [];
        }

        // Split all sessions by day
        const sessionSegments =
            studentCoachingSessionsViewModel.data.sessions.flatMap((session) => {
                if (session.status === 'unscheduled') return [];
                return splitTimeRangeByDays(
                    session.startTime,
                    session.endTime,
                    session,
                );
            });

        // Filter session segments for the selected date
        return sessionSegments
            .filter((segment) =>
                isSameDay(new Date(segment.startTime), selectedDate),
            )
            .map((seg) => ({
                ...seg.original,
                startTime: seg.startTime,
                endTime: seg.endTime,
            }));
    }, [studentCoachingSessionsViewModel, selectedDate]);

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
            {sessionsOnDate.length > 0 && (
                <CoachingAvailabilityCard
                    locale={locale}
                    coachingSessions={sessionsOnDate.map((session) => ({
                        startTime: new Date(session.startTime),
                        endTime: new Date(session.endTime),
                        title: `${session.sessionType?.startsWith('group-') ? 'Group Session' : 'Individual'}: ${session.coachingOfferingTitle}`,
                        onClick:
                            onSessionClick &&
                            (() => onSessionClick?.(Number(session.id))),
                    }))}
                />
            )}
            {sessionsOnDate.length === 0 && selectedDate && (
                <div className="border border-base-neutral-700 bg-base-neutral-800 text-text-secondary p-4 rounded-md">
                    {t('selectDateWithAvailability')}
                </div>
            )}
        </div>
    );
}
