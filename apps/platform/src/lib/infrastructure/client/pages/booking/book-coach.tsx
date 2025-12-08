'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { trpc } from '../../trpc/cms-client';
import React, { useEffect, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { useGetCoachAvailabilityPresenter } from '../../hooks/use-coach-availability-presenter';
import {
    DefaultError,
    DefaultLoading,
    Dialog,
    DialogContent,
    CalendarNavigationHeader,
    Button,
} from '@maany_shr/e-class-ui-kit';
import ScheduledOfferingContent from './dialogs/scheduled-offering-content';
import {
    MonthlyCoachCalendarWrapper,
    WeeklyCoachCalendarWrapper,
} from '../common/coach-calendar-wrappers';
import { useGetStudentCoachingSessionPresenter } from '../../hooks/use-student-coaching-session-presenter';

interface BookCoachPageProps {
    coachUsername: string;
    sessionId?: number;
    returnTo?: string;
    lessonComponentId?: string;
    courseSlug?: string;
}

interface BookCoachPageContentProps {
    coachUsername: string;
    defaultSession: ScheduledOffering | null;
    returnTo?: string;
    lessonComponentId?: string;
    courseSlug?: string;
    onBookingInitiated?: () => void;
}

function BookCoachPageContent({
    coachUsername,
    defaultSession,
    returnTo,
    lessonComponentId,
    courseSlug,
    onBookingInitiated,
}: BookCoachPageContentProps) {
    const locale = useLocale() as TLocale;
    const router = useRouter();

    const [coachAvailabilityResponse, { refetch: refetchCoachAvailability }] =
        trpc.getCoachAvailability.useSuspenseQuery({ coachUsername });

    const [coachAvailabilityViewModel, setCoachAvailabilityViewModel] =
        useState<viewModels.TCoachAvailabilityViewModel | undefined>(undefined);
    const { presenter } = useGetCoachAvailabilityPresenter(
        setCoachAvailabilityViewModel,
    );

    // @ts-ignore
    presenter.present(coachAvailabilityResponse, coachAvailabilityViewModel);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [newSession, setNewSession] = useState<ScheduledOffering | null>(
        defaultSession,
    );
    const [bookingSuccess, setBookingSuccess] = useState(false);
    const [briefing, setBriefing] = useState('');

    const setNewSessionStart = (startTime: Date) => {
        setNewSession((prev) => {
            if (!defaultSession || !defaultSession.session)
                return { startTime };
            const endTime = new Date(startTime);
            endTime.setMinutes(
                endTime.getMinutes() + defaultSession.session.duration,
            );
            return { ...prev, startTime, endTime };
        });
    };

    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const utils = trpc.useUtils();

    const requestSessionMutation = trpc.requestCoachingSession.useMutation({
        onSuccess: () => {
            // Invalidate related queries to refetch fresh data
            utils.listStudentCoachingSessions.invalidate();
            utils.getCoachAvailability.invalidate({ coachUsername });
        },
    });
    const [submitError, setSubmitError] = useState<string | undefined>(
        undefined,
    );

    const onSubmit = () => {
        if (!newSession) return;
        if (!newSession.session) return;
        if (!newSession.startTime) return;

        // Check if briefing is provided
        if (!briefing.trim()) {
            setSubmitError('Please provide a briefing for your coach.');
            return;
        }

        // Check if session is scheduled for the past
        if (newSession.startTime < new Date()) {
            setSubmitError('Cannot schedule a session in the past.');
            return;
        }

        // TODO: Check if there is availability for the selected time

        // briefing and lessonComponentId are supported by the backend but not yet in @dream-aim-deliver/e-class-cms-rest types
        requestSessionMutation.mutate(
            {
                coachUsername,
                sessionId: newSession.session.id,
                startTime: newSession.startTime.toISOString(),
                briefing,
                ...(lessonComponentId && { lessonComponentId }),
            } as Parameters<typeof requestSessionMutation.mutate>[0],
            {
                onSuccess: (data) => {
                    if (!data.success) {
                        // TODO: check error type and show specific message
                        setSubmitError(
                            'Failed to schedule session. Please try again.',
                        );
                        return;
                    }
                    setBookingSuccess(true);
                    onBookingInitiated?.();
                    // Query invalidation handled by mutation's onSuccess callback
                },
                onError: (error) => {
                    setSubmitError(
                        'Failed to schedule session. Please try again.',
                    );
                },
            },
        );
    };

    useEffect(() => {
        if (coachAvailabilityViewModel?.mode === 'unauthenticated') {
            router.push('/auth/login');
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
                open={isDialogOpen}
                onOpenChange={(isDialogOpen) => {
                    if (!isDialogOpen) {
                        setNewSession(defaultSession);
                        setSubmitError(undefined);
                        setBriefing('');
                    }
                    setIsDialogOpen(isDialogOpen);
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
                        briefing={briefing}
                        setBriefing={setBriefing}
                        onSubmit={onSubmit}
                        isSubmitting={requestSessionMutation.isPending}
                        submitError={submitError}
                        bookingSuccess={bookingSuccess}
                        returnTo={returnTo}
                        courseSlug={courseSlug}
                        onReturnToCourse={() => {
                            if (returnTo) {
                                router.push(returnTo);
                            }
                        }}
                        onViewSessions={() => {
                            router.push('/workspace/coaching-sessions');
                        }}
                        closeDialog={() => {
                            setIsDialogOpen(false);
                            setNewSession(defaultSession);
                            setSubmitError(undefined);
                            setBookingSuccess(false);
                            setBriefing('');
                        }}
                    />
                </DialogContent>
            </Dialog>
            <div className="flex flex-col h-screen">
                {returnTo && (
                    <div className="mb-4">
                        <Button
                            variant="text"
                            text="← Back to Course"
                            onClick={() => router.push(returnTo)}
                        />
                    </div>
                )}
                <div className="max-h-full flex-row hidden md:flex">
                    <div className="w-full rounded-lg bg-card-fill p-4 flex-1">
                        <CalendarNavigationHeader
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                            locale={locale}
                            viewType="weekly"
                        />
                        <WeeklyCoachCalendarWrapper
                            coachAvailabilityViewModel={
                                coachAvailabilityViewModel
                            }
                            setNewSessionStart={setNewSessionStart}
                            openDialog={() => setIsDialogOpen(true)}
                            currentDate={currentDate}
                            setCurrentDate={setCurrentDate}
                        />
                    </div>
                </div>
                <div className="flex flex-col md:hidden">
                    <MonthlyCoachCalendarWrapper
                        coachAvailabilityViewModel={coachAvailabilityViewModel}
                        currentDate={currentDate}
                        setCurrentDate={setCurrentDate}
                        setNewSessionStart={setNewSessionStart}
                        openDialog={() => setIsDialogOpen(true)}
                    />
                </div>
            </div>
        </>
    );
}

interface BookCoachWithSessionPageProps {
    coachUsername: string;
    sessionId: number | string;
    returnTo?: string;
    lessonComponentId?: string;
    courseSlug?: string;
}

function BookCoachWithSessionPage({
    coachUsername,
    sessionId,
    returnTo,
    lessonComponentId,
    courseSlug,
}: BookCoachWithSessionPageProps) {
    const locale = useLocale() as TLocale;

    const sessionIdNumber = typeof sessionId === 'string' ? parseInt(sessionId, 10) : sessionId;

    // Track if booking was initiated to avoid showing error after successful request
    const [bookingInitiated, setBookingInitiated] = useState(false);

    const [coachingSessionResponse] =
        trpc.getStudentCoachingSession.useSuspenseQuery({ id: sessionIdNumber });

    const [coachingSessionViewModel, setCoachingSessionViewModel] = useState<
        viewModels.TStudentCoachingSessionViewModel | undefined
    >(undefined);

    const { presenter } = useGetStudentCoachingSessionPresenter(
        setCoachingSessionViewModel,
    );
    // @ts-ignore
    presenter.present(coachingSessionResponse, coachingSessionViewModel);

    if (!coachingSessionViewModel) {
        return <DefaultLoading locale={locale} />;
    }

    if (coachingSessionViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    const coachingSession = coachingSessionViewModel.data;

    // Guard against undefined data or session
    if (!coachingSession?.session) {
        return <DefaultError locale={locale} />;
    }

    // Only check unscheduled status if booking hasn't been initiated
    // After booking, status changes to 'requested' which would incorrectly trigger error
    // When bookingInitiated is true, we skip this check so user can continue viewing calendar
    if (coachingSession.session.status !== 'unscheduled' && !bookingInitiated) {
        return (
            <DefaultError
                locale={locale}
                title="Invalid request"
                description="This coaching session has been scheduled"
            />
        );
    }

    const coachingSessionId = typeof coachingSession.session.id === 'string'
        ? parseInt(coachingSession.session.id, 10)
        : coachingSession.session.id;

    const defaultSession: ScheduledOffering = {
        session: {
            id: coachingSessionId,
            name: coachingSession.session.coachingOfferingTitle,
            duration: coachingSession.session.coachingOfferingDuration,
        },
    };

    return (
        <div className="flex flex-col gap-4">
            <div className="bg-card-stroke rounded-md border border-neutral-700 p-4 w-full">
                <span className="text-text-secondary">Session: </span>
                <span className="font-bold text-text-primary">
                    {coachingSession.session.coachingOfferingTitle} (
                    {coachingSession.session.coachingOfferingDuration} minutes)
                </span>
            </div>
            <BookCoachPageContent
                coachUsername={coachUsername}
                defaultSession={defaultSession}
                returnTo={returnTo}
                lessonComponentId={lessonComponentId}
                courseSlug={courseSlug}
                onBookingInitiated={() => setBookingInitiated(true)}
            />
        </div>
    );
}

export default function BookCoachPage({
    coachUsername,
    sessionId,
    returnTo,
    lessonComponentId,
    courseSlug,
}: BookCoachPageProps) {
    if (sessionId) {
        return (
            <BookCoachWithSessionPage
                coachUsername={coachUsername}
                sessionId={sessionId}
                returnTo={returnTo}
                lessonComponentId={lessonComponentId}
                courseSlug={courseSlug}
            />
        );
    }

    return <BookCoachPageContent coachUsername={coachUsername} defaultSession={null} returnTo={returnTo} lessonComponentId={lessonComponentId} courseSlug={courseSlug} />;
}
