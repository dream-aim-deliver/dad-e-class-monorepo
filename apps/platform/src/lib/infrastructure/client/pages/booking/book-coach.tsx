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
    SessionCalendarCard,
    WeeklyCalendar,
} from '@maany_shr/e-class-ui-kit';

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

    return (
        <div className="h-full">
            <WeeklyCalendar
                locale={locale}
                currentDate={currentDate}
                setCurrentDate={setCurrentDate}
                events={events}
            />
        </div>
    );
}
