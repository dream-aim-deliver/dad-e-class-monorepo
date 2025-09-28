'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { trpc } from '../../trpc/client';
import { useEffect, useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetCoachAvailabilityPresenter } from '../../hooks/use-coach-availability-presenter';
import {
    AnonymousCalendarCard,
    AvailabilityCalendarCard,
    DefaultError,
    DefaultLoading,
    MonthlyCalendar,
    SectionHeading,
    SessionCalendarCard,
    WeeklyCalendar,
} from '@maany_shr/e-class-ui-kit';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BookCoachPageProps {
    coachUsername: string;
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

    const events = useMemo(() => {
        if (
            !coachAvailabilityViewModel ||
            coachAvailabilityViewModel.mode !== 'default'
        ) {
            return [];
        }

        const events: { start: Date; end: Date; component: React.ReactNode }[] =
            [];

        coachAvailabilityViewModel.data.anonymousSessions.forEach((session) => {
            events.push({
                start: new Date(session.startTime),
                end: new Date(session.endTime),
                component: (
                    <AnonymousCalendarCard
                        locale={locale}
                        start={new Date(session.startTime)}
                        end={new Date(session.endTime)}
                    />
                ),
            });
        });

        coachAvailabilityViewModel.data.mySessions.forEach((session) => {
            events.push({
                start: new Date(session.startTime),
                end: new Date(session.endTime),
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
            if (availability.type === 'single') {
                events.push({
                    start: new Date(availability.startTime),
                    end: new Date(availability.endTime),
                    component: (
                        <AvailabilityCalendarCard
                            locale={locale}
                            start={new Date(availability.startTime)}
                            end={new Date(availability.endTime)}
                        />
                    ),
                });
            }
            if (availability.type === 'recurring') {
                // TODO: check for every day of the currently displayed week
            }
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

    const changeWeek = (difference: 1 | -1) => {
        setCurrentDate(
            new Date(
                currentDate.getFullYear(),
                currentDate.getMonth(),
                currentDate.getDate() + difference * 7,
            ),
        );
    };

    return (
        <div>
            <div className="flex-row hidden md:flex">
                <div className="w-full rounded-lg bg-card-fill p-4 max-h-100%">
                    <div className="flex flex-row mb-4 items-center justify-between">
                        <SectionHeading
                            text={currentDate.toLocaleDateString(locale, {
                                month: 'long',
                                year: 'numeric',
                            })}
                        />
                        <div className="flex flex-row space-x-6 text-base-brand-500">
                            <ChevronLeft
                                className="cursor-pointer"
                                onClick={() => changeWeek(-1)}
                            />
                            <ChevronRight
                                className="cursor-pointer"
                                onClick={() => changeWeek(1)}
                            />
                        </div>
                    </div>
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
    );
}
