'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { trpc } from '../../trpc/client';
import React, { useEffect, useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetCoachAvailabilityPresenter } from '../../hooks/use-coach-availability-presenter';
import {
    CoachingAvailabilityCard,
    DefaultError,
    DefaultLoading,
    Dialog,
    DialogContent,
    MonthlyCalendar,
    WeeklyCalendar,
    WeeklyHeader,
} from '@maany_shr/e-class-ui-kit';
import ScheduledOfferingContent from './dialogs/scheduled-offering-content';
import {
    useComputeMonthlyEvents,
    useComputeWeeklyEvents,
} from './hooks/use-compute-events';

interface BookCoachPageProps {
    coachUsername: string;
}

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

function WeeklyCalendarWrapper({
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

function MonthlyCalendarWrapper({
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

export default function BookCoachPage({ coachUsername }: BookCoachPageProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();

    const [coachAvailabilityResponse, {
        refetch: refetchCoachAvailability,
    }] =
        trpc.getCoachAvailability.useSuspenseQuery({ coachUsername });
    const [coachAvailabilityViewModel, setCoachAvailabilityViewModel] =
        useState<viewModels.TCoachAvailabilityViewModel | undefined>(undefined);
    const { presenter } = useGetCoachAvailabilityPresenter(
        setCoachAvailabilityViewModel,
    );
    presenter.present(coachAvailabilityResponse, coachAvailabilityViewModel);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [newSession, setNewSession] = useState<ScheduledOffering | null>(
        null,
    );

    const scheduleSessionMutation = trpc.scheduleCoachingSession.useMutation();

    const onSubmit = () => {
        if (!newSession) return;
        if (!newSession.session) return;
        if (!newSession.startTime) return;

        // TODO: Check if there is availability for the selected time

        scheduleSessionMutation.mutate(
            {
                coachUsername,
                sessionId: newSession.session.id,
                startTime: newSession.startTime.toISOString(),
            },
            {
                onSuccess: (data) => {
                    if (!data.success) {
                        // TODO: check error type and show specific message
                        throw new Error('Failed to schedule session:');
                    }
                    setNewSession(null);
                    refetchCoachAvailability();
                },
                onError: (error) => {
                    throw new Error('Failed to schedule session:');
                },
            },
        );
    };

    useEffect(() => {
        if (coachAvailabilityViewModel?.mode === 'unauthenticated') {
            // TODO: navigate to existing page with a redirect
            router.push('/login');
        }
    }, [coachAvailabilityViewModel, router]);

    if (!coachAvailabilityViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (coachAvailabilityViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const coachAvailability = coachAvailabilityViewModel.data;

    return (
        <>
            <Dialog
                open={newSession !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setNewSession(null);
                    }
                }}
                defaultOpen={false}
            >
                <DialogContent
                    showCloseButton
                    closeOnOverlayClick
                    closeOnEscape
                >
                    <ScheduledOfferingContent
                        offering={newSession}
                        setOffering={setNewSession}
                        onSubmit={onSubmit}
                    />
                </DialogContent>
            </Dialog>
            <div className="flex flex-col h-screen">
                <div className="max-h-full flex-row hidden md:flex">
                    <div className="w-full rounded-lg bg-card-fill p-4 flex-1">
                        <WeeklyHeader
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            locale={locale}
                        />
                        <WeeklyCalendarWrapper
                            coachAvailabilityViewModel={
                                coachAvailabilityViewModel
                            }
                            setNewSession={setNewSession}
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:hidden">
                    <MonthlyCalendarWrapper
                        coachAvailabilityViewModel={coachAvailabilityViewModel}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        setNewSession={setNewSession}
                    />
                </div>
            </div>
        </>
    );
}
