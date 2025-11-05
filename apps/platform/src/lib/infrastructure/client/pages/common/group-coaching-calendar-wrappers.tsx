import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import React, { useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import {
    CoachingAvailabilityCard,
    MonthlyCalendar,
    WeeklyCalendar,
    SessionCalendarCard,
} from '@maany_shr/e-class-ui-kit';
import { splitTimeRangeByDays } from '../../utils/split-time-range';

interface WeeklyGroupCoachingCalendarWrapperProps {
    groupCoachingSessionsViewModel:
        | viewModels.TListGroupCoachingSessionsViewModel
        | undefined;
    coachCoachingSessionsViewModel:
        | viewModels.TListCoachCoachingSessionsViewModel
        | undefined;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    setNewSessionStart?: (startTime: Date) => void;
    selectedDate?: Date;
    setSelectedDate?: (date: Date | undefined) => void;
}

export function WeeklyGroupCoachingCalendarWrapper({
    groupCoachingSessionsViewModel,
    coachCoachingSessionsViewModel,
    currentDate,
    setCurrentDate,
    setNewSessionStart,
    selectedDate: externalSelectedDate,
    setSelectedDate: externalSetSelectedDate,
}: WeeklyGroupCoachingCalendarWrapperProps) {
    const locale = useLocale() as TLocale;

    const weeklyEvents = useMemo(() => {
        const events: any[] = [];

        // Add group coaching sessions
        if (groupCoachingSessionsViewModel?.mode === 'default') {
            const groupSessions = groupCoachingSessionsViewModel.data.sessions || [];
            groupSessions.forEach((session) => {
                // Validate that we have valid dates before creating the event
                if (session.startTime && session.endTime) {
                    const startTime = new Date(session.startTime);
                    const endTime = new Date(session.endTime);
                    
                    // Check that the dates are valid (not NaN)
                    if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
                        events.push({
                            start: startTime, // WeeklyCalendar expects 'start' property
                            end: endTime,     // WeeklyCalendar expects 'end' property
                            priority: 2, // Higher priority for sessions
                            component: (
                                <SessionCalendarCard
                                    locale={locale}
                                    start={startTime}
                                    end={endTime}
                                    title={`Group: ${session.course?.title || 'Coaching Session'}`}
                                />
                            ),
                        });
                    }
                }
            });
        }

        // Add individual coaching sessions
        if (coachCoachingSessionsViewModel?.mode === 'default') {
            const coachSessions = coachCoachingSessionsViewModel.data.sessions || [];
            coachSessions.forEach((session) => {
                // Validate that we have valid dates before creating the event
                if (session.startTime && session.endTime) {
                    const startTime = new Date(session.startTime);
                    const endTime = new Date(session.endTime);
                    
                    // Check that the dates are valid (not NaN)
                    if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
                        events.push({
                            start: startTime, // WeeklyCalendar expects 'start' property
                            end: endTime,     // WeeklyCalendar expects 'end' property
                            priority: 2, // Higher priority for sessions
                            component: (
                                <SessionCalendarCard
                                    locale={locale}
                                    start={startTime}
                                    end={endTime}
                                    title={`Individual: ${session.coachingOfferingTitle}`}
                                />
                            ),
                        });
                    }
                }
            });
        }

        return events;
    }, [groupCoachingSessionsViewModel, coachCoachingSessionsViewModel]);

    const getOnNewEventHandler = () => {
        if (!setNewSessionStart) return;
        return (startTime: Date) => {
            setNewSessionStart?.(startTime);
        };
    };

    return (
        <WeeklyCalendar
            locale={locale}
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            events={weeklyEvents}
        />
    );
}

interface MonthlyGroupCoachingCalendarWrapperProps {
    groupCoachingSessionsViewModel:
        | viewModels.TListGroupCoachingSessionsViewModel
        | undefined;
    coachCoachingSessionsViewModel:
        | viewModels.TListCoachCoachingSessionsViewModel
        | undefined;
    currentDate: Date;
    setCurrentDate: (date: Date) => void;
    setNewSessionStart?: (startTime: Date) => void;
    variant?: 'compact' | 'full';
    selectedDate?: Date;
    setSelectedDate?: (date: Date | undefined) => void;
}

export function MonthlyGroupCoachingCalendarWrapper({
    groupCoachingSessionsViewModel,
    coachCoachingSessionsViewModel,
    currentDate,
    setCurrentDate,
    setNewSessionStart,
    variant = 'compact',
    selectedDate: externalSelectedDate,
    setSelectedDate: externalSetSelectedDate,
}: MonthlyGroupCoachingCalendarWrapperProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('components.calendar');
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

    // Compute monthly calendar events
    const monthlyEvents = useMemo(() => {
        const dateEvents: {
            [date: string]: {
                hasCoachAvailability: boolean;
                hasSessions: boolean;
            };
        } = {};

        // Add group coaching sessions to calendar
        if (groupCoachingSessionsViewModel?.mode === 'default') {
            const groupSessions = groupCoachingSessionsViewModel.data.sessions || [];
            groupSessions.forEach((session) => {
                // Validate that we have a valid date before processing
                if (session.startTime) {
                    const sessionDate = new Date(session.startTime);
                    
                    // Check that the date is valid (not NaN)
                    if (!isNaN(sessionDate.getTime())) {
                        const dateKey = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}-${String(sessionDate.getDate()).padStart(2, '0')}`;
                        if (!dateEvents[dateKey]) {
                            dateEvents[dateKey] = { hasCoachAvailability: false, hasSessions: false };
                        }
                        dateEvents[dateKey].hasSessions = true;
                    }
                }
            });
        }

        // Add individual coaching sessions to calendar
        if (coachCoachingSessionsViewModel?.mode === 'default') {
            const coachSessions = coachCoachingSessionsViewModel.data.sessions || [];
            coachSessions.forEach((session) => {
                // Validate that we have a valid date before processing
                if (session.startTime) {
                    const sessionDate = new Date(session.startTime);
                    
                    // Check that the date is valid (not NaN)
                    if (!isNaN(sessionDate.getTime())) {
                        const dateKey = `${sessionDate.getFullYear()}-${String(sessionDate.getMonth() + 1).padStart(2, '0')}-${String(sessionDate.getDate()).padStart(2, '0')}`;
                        if (!dateEvents[dateKey]) {
                            dateEvents[dateKey] = { hasCoachAvailability: false, hasSessions: false };
                        }
                        dateEvents[dateKey].hasSessions = true;
                    }
                }
            });
        }

        return dateEvents;
    }, [groupCoachingSessionsViewModel, coachCoachingSessionsViewModel]);

    // Get sessions for the selected date
    const sessionsOnDate = useMemo(() => {
        if (!selectedDate) return [];

        const allSessions: Array<{
            startTime: Date;
            endTime: Date;
            title: string;
            type: 'group' | 'individual';
        }> = [];

        // Add group sessions for selected date
        if (groupCoachingSessionsViewModel?.mode === 'default') {
            const groupSessions = groupCoachingSessionsViewModel.data.sessions || [];
            groupSessions
                .filter((session) => {
                    // Validate date before comparison
                    if (!session.startTime) return false;
                    const startTime = new Date(session.startTime);
                    return !isNaN(startTime.getTime()) && isSameDay(startTime, selectedDate);
                })
                .forEach((session) => {
                    const startTime = new Date(session.startTime);
                    const endTime = new Date(session.endTime);
                    
                    // Double-check that both dates are valid
                    if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
                        allSessions.push({
                            startTime,
                            endTime,
                            title: `Group: ${session.course?.title || 'Coaching Session'}`,
                            type: 'group',
                        });
                    }
                });
        }

        // Add individual sessions for selected date
        if (coachCoachingSessionsViewModel?.mode === 'default') {
            const coachSessions = coachCoachingSessionsViewModel.data.sessions || [];
            coachSessions
                .filter((session) => {
                    // Validate date before comparison
                    if (!session.startTime) return false;
                    const startTime = new Date(session.startTime);
                    return !isNaN(startTime.getTime()) && isSameDay(startTime, selectedDate);
                })
                .forEach((session) => {
                    const startTime = new Date(session.startTime);
                    const endTime = new Date(session.endTime);
                    
                    // Double-check that both dates are valid
                    if (!isNaN(startTime.getTime()) && !isNaN(endTime.getTime())) {
                        allSessions.push({
                            startTime,
                            endTime,
                            title: `Individual: ${session.coachingOfferingTitle}`,
                            type: 'individual',
                        });
                    }
                });
        }

        return allSessions;
    }, [groupCoachingSessionsViewModel, coachCoachingSessionsViewModel, selectedDate]);

    const handleDateClick = (date: Date) => {
        setSelectedDate(date);
    };

    const handleNewSessionRequest = () => {
        if (!selectedDate || !setNewSessionStart) return;
        setNewSessionStart(selectedDate);
    };

    return (
        <div className="flex flex-col gap-3">
            <MonthlyCalendar
                locale={locale}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                dateEvents={monthlyEvents}
                selectedDate={selectedDate}
                onDateClick={handleDateClick}
                variant={variant}
            />
            {sessionsOnDate.length > 0 && selectedDate && (
                <div className="space-y-2">
                    {sessionsOnDate.map((session, index) => (
                        <CoachingAvailabilityCard
                            key={index}
                            locale={locale}
                            coachingSessions={[{
                                startTime: session.startTime,
                                endTime: session.endTime,
                                title: session.title,
                            }]}
                        />
                    ))}
                </div>
            )}
            {sessionsOnDate.length === 0 && selectedDate && (
                <div className="border border-base-neutral-700 bg-base-neutral-800 text-text-secondary p-4 rounded-md">
                    <div className="flex flex-col gap-2">
                        <p>No sessions scheduled for this date</p>
                        {setNewSessionStart && (
                            <button
                                onClick={handleNewSessionRequest}
                                className="text-action-default hover:underline text-left"
                            >
                                Add group session
                            </button>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}