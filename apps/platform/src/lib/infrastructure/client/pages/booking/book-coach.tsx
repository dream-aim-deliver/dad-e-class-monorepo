'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { trpc } from '../../trpc/client';
import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetCoachAvailabilityPresenter } from '../../hooks/use-coach-availability-presenter';
import {
    AvailabilityCalendarCard,
    AvailableCoachingSessionCard,
    AvailableCoachingSessions,
    Button,
    CoachingSessionData,
    DefaultError,
    DefaultLoading,
    Dialog,
    DialogContent,
    MonthlyCalendar,
    SessionCalendarCard,
    WeeklyCalendar,
    WeeklyHeader,
} from '@maany_shr/e-class-ui-kit';
import { useListAvailableCoachingsPresenter } from '../../hooks/use-available-coachings-presenter';
import { groupOfferings } from '../../utils/group-offerings';

interface BookCoachPageProps {
    coachUsername: string;
}

interface ScheduledOffering {
    session?: {
        id: number;
        name: string;
        duration: number;
    };
    startTime?: Date;
    endTime?: Date;
}

interface ChooseCoachingSessionContentProps {
    setSession: React.Dispatch<React.SetStateAction<ScheduledOffering | null>>;
}

function ChooseCoachingSessionContent({
    setSession,
}: ChooseCoachingSessionContentProps) {
    const [availableCoachingsResponse] =
        trpc.listAvailableCoachings.useSuspenseQuery({});
    const [availableCoachingsViewModel, setAvailableCoachingsViewModel] =
        useState<viewModels.TAvailableCoachingListViewModel | undefined>(
            undefined,
        );
    const { presenter } = useListAvailableCoachingsPresenter(
        setAvailableCoachingsViewModel,
    );
    presenter.present(availableCoachingsResponse, availableCoachingsViewModel);

    const locale = useLocale() as TLocale;

    const groupedOfferings = useMemo(() => {
        if (!availableCoachingsViewModel) return [];
        return groupOfferings(availableCoachingsViewModel);
    }, [availableCoachingsViewModel]);

    if (!availableCoachingsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (availableCoachingsViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    if (
        availableCoachingsViewModel.mode === 'not-found' ||
        availableCoachingsViewModel.mode === 'unauthenticated'
    ) {
        return;
    }

    const availableOfferings = availableCoachingsViewModel.data.offerings;

    if (availableOfferings.length === 0) {
        return;
    }

    const calculateEndTime = (startTime: Date, durationMinutes: number) => {
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + durationMinutes);
        return endTime;
    };

    const onChoose = (offering: CoachingSessionData) => {
        // Find the first matching ID
        const sessionId = availableOfferings.find(
            (o) => o.name === offering.title && o.duration === offering.time,
        )?.id;
        if (!sessionId) return;
        setSession((oldSession) => {
            return {
                session: {
                    id: sessionId,
                    name: offering.title,
                    duration: offering.time,
                },
                startTime: oldSession?.startTime,
                endTime: oldSession?.startTime
                    ? calculateEndTime(oldSession.startTime, offering.time)
                    : undefined,
            };
        });
    };

    return (
        <div className="flex flex-col gap-3">
            <span className="text-text-secondary">
                Select a coaching session
            </span>
            {groupedOfferings.map((offering) => (
                <AvailableCoachingSessionCard
                    key={offering.title}
                    {...offering}
                    numberOfSessions={offering.numberOfSessions}
                    durationMinutes="minutes"
                    onClick={() => onChoose(offering)}
                />
            ))}
        </div>
    );
}

interface ScheduledSessionContentProps {
    session: ScheduledOffering | null;
    setSession: React.Dispatch<React.SetStateAction<ScheduledOffering | null>>;
}

function ScheduledSessionContent({
    session,
    setSession,
}: ScheduledSessionContentProps) {
    const locale = useLocale() as TLocale;

    if (!session) return null;

    return (
        <div className="flex flex-col gap-3">
            <h2>Schedule</h2>
            {!session.session && (
                <Suspense fallback={<DefaultLoading locale={locale} />}>
                    <ChooseCoachingSessionContent setSession={setSession} />
                </Suspense>
            )}
            <Button
                className="w-full"
                variant="secondary"
                onClick={() => setSession(null)}
            >
                Cancel
            </Button>
        </div>
    );
}

export default function BookCoachPage({ coachUsername }: BookCoachPageProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();

    const [coachAvailabilityResponse] =
        trpc.getCoachAvailability.useSuspenseQuery({ coachUsername });
    const [coachAvailabilityViewModel, setCoachAvailabilityViewModel] =
        useState<viewModels.TCoachAvailabilityViewModel | undefined>(undefined);
    const { presenter } = useGetCoachAvailabilityPresenter(
        setCoachAvailabilityViewModel,
    );
    presenter.present(coachAvailabilityResponse, coachAvailabilityViewModel);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [newEvent, setNewEvent] = useState<ScheduledOffering | null>(null);

    const events = useMemo(() => {
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
                        onClick={() => {}}
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
                        onClick={(startTime) => {
                            setNewEvent({
                                startTime: startTime,
                            });
                        }}
                    />
                ),
            });
        });

        return events;
    }, [coachAvailabilityViewModel]);

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
                open={newEvent !== null}
                onOpenChange={(open) => {
                    if (!open) {
                        setNewEvent(null);
                    }
                }}
                defaultOpen={false}
            >
                <DialogContent
                    showCloseButton
                    closeOnOverlayClick
                    closeOnEscape
                >
                    <ScheduledSessionContent
                        session={newEvent}
                        setSession={setNewEvent}
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
                        <WeeklyCalendar
                            locale={locale}
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            events={events}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:hidden">
                    <MonthlyCalendar
                        locale={locale}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                    />
                </div>
            </div>
        </>
    );
}
