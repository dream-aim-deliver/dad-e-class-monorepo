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
    InputField,
    MonthlyCalendar,
    SessionCalendarCard,
    WeeklyCalendar,
    WeeklyHeader,
} from '@maany_shr/e-class-ui-kit';
import { useListAvailableCoachingsPresenter } from '../../hooks/use-available-coachings-presenter';
import { groupOfferings } from '../../utils/group-offerings';
import { set } from 'zod';

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

interface ConfirmTimeContentProps {
    session: ScheduledOffering;
    setSession: React.Dispatch<React.SetStateAction<ScheduledOffering | null>>;
    onSubmit: () => void;
}

function ConfirmTimeContent({
    session,
    setSession,
    onSubmit,
}: ConfirmTimeContentProps) {
    const locale = useLocale() as TLocale;

    const getTimeValue = (time: Date): string => {
        return time.toLocaleTimeString(locale, {
            hour: 'numeric',
            minute: '2-digit',
        });
    };

    const [timeValue, setTimeValue] = useState(() => {
        if (!session.startTime) return '';
        return getTimeValue(session.startTime);
    });
    const [hasTimeError, setHasTimeError] = useState(false);

    const getCurrentDateValue = (): string => {
        if (!session.startTime) return '';
        return session.startTime.toISOString().split('T')[0];
    };

    const parseTimeString = (
        timeStr: string,
    ): { hours: number; minutes: number } | null => {
        const cleanTime = timeStr.trim();

        // Handle 24-hour format (e.g., "14:30", "09:15")
        const time24Match = cleanTime.match(/^(\d{1,2}):(\d{2})$/);
        if (time24Match) {
            const hours = parseInt(time24Match[1], 10);
            const minutes = parseInt(time24Match[2], 10);
            if (hours >= 0 && hours < 24 && minutes >= 0 && minutes < 60) {
                return { hours, minutes };
            }
        }

        // Handle 12-hour format (e.g., "2:30 PM", "11:45 AM", "2 PM")
        const time12Match = cleanTime.match(
            /^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i,
        );
        if (time12Match) {
            let hours = parseInt(time12Match[1], 10);
            const minutes = parseInt(time12Match[2] || '0', 10);
            const meridiem = time12Match[3].toUpperCase();

            if (hours < 1 || hours > 12 || minutes < 0 || minutes >= 60) {
                return null;
            }

            if (meridiem === 'AM' && hours === 12) {
                hours = 0;
            } else if (meridiem === 'PM' && hours !== 12) {
                hours += 12;
            }

            return { hours, minutes };
        }

        return null;
    };

    const handleDateChange = (newDate: Date) => {
        if (!session.startTime || !session.session?.duration) return;

        try {
            const currentTime = session.startTime;
            newDate.setHours(
                currentTime.getHours(),
                currentTime.getMinutes(),
                0,
                0,
            );

            const newEndTime = new Date(newDate);
            newEndTime.setMinutes(
                newEndTime.getMinutes() + session.session.duration,
            );

            setSession((prevSession) => ({
                ...prevSession!,
                startTime: newDate,
                endTime: newEndTime,
            }));
        } catch (error) {
            // Handle invalid date silently
        }
    };

    const handleTimeChange = (newTimeValue: string) => {
        if (!session.startTime || !session.session?.duration) return;

        const parsedTime = parseTimeString(newTimeValue);

        if (!parsedTime) {
            setHasTimeError(true);
            return;
        }

        setHasTimeError(false);

        try {
            const newDate = new Date(session.startTime);
            newDate.setHours(parsedTime.hours, parsedTime.minutes, 0, 0);

            const newEndTime = new Date(newDate);
            newEndTime.setMinutes(
                newEndTime.getMinutes() + session.session.duration,
            );

            setSession((prevSession) => ({
                ...prevSession!,
                startTime: newDate,
                endTime: newEndTime,
            }));
        } catch (error) {
            setHasTimeError(true);
        }
    };

    useEffect(() => {
        handleTimeChange(timeValue);
    }, [timeValue]);

    if (!session || !session.session || !session.startTime || !session.endTime)
        return null;

    return (
        <div className="flex flex-col gap-3">
            <div>
                <span className="text-sm text-text-secondary">Date</span>
                <InputField
                    inputText="Date"
                    value={getCurrentDateValue()}
                    setValue={() => {
                        // Can't be edited directly
                    }}
                />
            </div>
            <div>
                <span className="text-sm text-text-secondary">Start Time</span>
                <InputField
                    inputText="Time"
                    value={timeValue}
                    setValue={setTimeValue}
                />
            </div>
            <div>
                <span className="text-sm text-text-secondary">End Time</span>
                <InputField
                    state='disabled'
                    inputText={getTimeValue(session.endTime)}
                    setValue={() => {
                        // Can't be edited directly
                    }}
                />
            </div>
            {hasTimeError && (
                <DefaultError
                    locale={locale}
                    title=""
                    description="Invalid time format"
                />
            )}
            <Button
                variant="primary"
                className="w-full"
                onClick={onSubmit}
                text="Submit"
            />
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
            {session.session && session.startTime && session.endTime && (
                <ConfirmTimeContent
                    session={session}
                    setSession={setSession}
                    onSubmit={() => {
                        // Handle submit logic here
                    }}
                />
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
