'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { trpc } from '../../trpc/client';
import React, { useEffect, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetCoachAvailabilityPresenter } from '../../hooks/use-coach-availability-presenter';
import {
    DefaultError,
    DefaultLoading,
    Dialog,
    DialogContent,
    WeeklyHeader,
} from '@maany_shr/e-class-ui-kit';
import ScheduledOfferingContent from './dialogs/scheduled-offering-content';
import { MonthlyCalendarWrapper, WeeklyCalendarWrapper } from '../common/calendar-wrappers';

interface BookCoachPageProps {
    coachUsername: string;
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

    const requestSessionMutation = trpc.requestCoachingSession.useMutation();
    const [submitError, setSubmitError] = useState<string | undefined>(undefined);

    const onSubmit = () => {
        if (!newSession) return;
        if (!newSession.session) return;
        if (!newSession.startTime) return;

        // Check if session is scheduled for the past
        if (newSession.startTime < new Date()) {
            setSubmitError('Cannot schedule a session in the past.');
            return;
        }

        // TODO: Check if there is availability for the selected time

        requestSessionMutation.mutate(
            {
                coachUsername,
                sessionId: newSession.session.id,
                startTime: newSession.startTime.toISOString(),
            },
            {
                onSuccess: (data) => {
                    if (!data.success) {
                        // TODO: check error type and show specific message
                        setSubmitError('Failed to schedule session. Please try again.');
                        return;
                    }
                    setNewSession(null);
                    refetchCoachAvailability();
                },
                onError: (error) => {
                    setSubmitError('Failed to schedule session. Please try again.');
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
                        isSubmitting={requestSessionMutation.isPending}
                        submitError={submitError}
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
