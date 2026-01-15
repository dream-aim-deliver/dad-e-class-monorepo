"use client";

import { TLocale } from "@maany_shr/e-class-translations";
import { useLocale, useTranslations } from "next-intl";
import { useState, useMemo, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../../trpc/cms-client";
import { viewModels } from "@maany_shr/e-class-models";
import { useListCoachCoachingSessionsPresenter } from "../../hooks/use-list-coach-coaching-sessions-presenter";
import { CoachingSessionCard, CoachingSessionList, DefaultError, DefaultLoading, Tabs, Button, ConfirmationModal, CancelCoachingSessionModal, Breadcrumbs, Dropdown } from "@maany_shr/e-class-ui-kit";
import useClientSidePagination from "../../utils/use-client-side-pagination";
import { formatTime } from "../../utils/format-time";
import { useScheduleCoachingSessionPresenter } from "../../hooks/use-schedule-coaching-session-presenter";
import { useUnscheduleCoachingSessionPresenter } from "../../hooks/use-unschedule-coaching-session-presenter";
import { TListCoachCoachingSessionsSuccessResponse } from "@dream-aim-deliver/e-class-cms-rest";
import StudentCoachingSessions from "./student-coaching-sessions";


// Wrapper component for scheduled sessions that handles time-based status client-side only
interface ScheduledCoachSessionCardProps {
    session: TListCoachCoachingSessionsSuccessResponse['data']['sessions'][number];
    locale: TLocale;
    onStudentClick: () => void;
    onJoinMeeting: () => void;
    onCancel: () => void;
    formatTime: (isoString: string) => string;
}

function ScheduledCoachSessionCard({
    session,
    locale,
    onStudentClick,
    onJoinMeeting,
    onCancel,
    formatTime,
}: ScheduledCoachSessionCardProps) {
    const startDateTime = new Date(session.startTime);
    const studentName = `${session.student.name || ''} ${session.student.surname || ''}`.trim() || session.student.username;

    // Client-side only status calculation to avoid hydration mismatch
    const [status, setStatus] = useState<{
        cardStatus: 'upcoming-editable' | 'upcoming-locked' | 'ongoing';
        hoursLeftToEdit: number;
        minutesLeftToEdit: number | undefined;
    } | null>(null);

    useEffect(() => {
        const calculateStatus = () => {
            const now = new Date();
            const msUntilSession = startDateTime.getTime() - now.getTime();

            // Session has started or is within 10 minutes of starting
            if (msUntilSession <= 10 * 60 * 1000) {
                setStatus({ cardStatus: 'ongoing', hoursLeftToEdit: 0, minutesLeftToEdit: undefined });
            } else if (msUntilSession <= 24 * 60 * 60 * 1000) {
                // Between 10 minutes and 24 hours before session
                setStatus({ cardStatus: 'upcoming-locked', hoursLeftToEdit: 0, minutesLeftToEdit: undefined });
            } else {
                // More than 24 hours before session
                const msUntilLock = msUntilSession - (24 * 60 * 60 * 1000);
                const totalMinutesLeft = Math.max(0, Math.floor(msUntilLock / (1000 * 60)));
                const hoursLeft = Math.floor(totalMinutesLeft / 60);
                setStatus({
                    cardStatus: 'upcoming-editable',
                    hoursLeftToEdit: hoursLeft,
                    minutesLeftToEdit: hoursLeft === 0 ? totalMinutesLeft : undefined
                });
            }
        };

        calculateStatus();
        const interval = setInterval(calculateStatus, 60000);
        return () => clearInterval(interval);
    }, [session.startTime]); // Use stable string instead of Date object to avoid infinite loop

    // Don't render until status is calculated
    if (!status) return null;

    const { cardStatus, hoursLeftToEdit, minutesLeftToEdit } = status;

    const commonProps = {
        locale,
        userType: "coach" as const,
        title: session.coachingOfferingTitle,
        duration: session.coachingOfferingDuration,
        date: startDateTime,
        startTime: formatTime(session.startTime),
        endTime: formatTime(session.endTime),
        studentName,
        studentImageUrl: session.student.avatarUrl || "",
        onClickStudent: onStudentClick,
    };

    if (cardStatus === 'ongoing') {
        return (
            <CoachingSessionCard
                {...commonProps}
                status="ongoing"
                meetingLink={session.status == "scheduled" ? session?.meetingUrl || undefined : undefined}
                onClickJoinMeeting={onJoinMeeting}
            />
        );
    }

    if (cardStatus === 'upcoming-locked') {
        return (
            <CoachingSessionCard
                {...commonProps}
                status="upcoming-locked"
                meetingLink={session.status == "scheduled" ? session?.meetingUrl || undefined : undefined}
                onClickJoinMeeting={onJoinMeeting}
            />
        );
    }

    // upcoming-editable
    return (
        <CoachingSessionCard
            {...commonProps}
            status="upcoming-editable"
            onClickCancel={onCancel}
            hoursLeftToEdit={hoursLeftToEdit}
            minutesLeftToEdit={minutesLeftToEdit}
        />
    );
}

interface CoachCoachingSessionsProps {
    role?: string;
}

export default function CoachCoachingSessions({ role: initialRole }: CoachCoachingSessionsProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.coachCoachingSessions');
    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const router = useRouter();
    const searchParams = useSearchParams();

    // Role options for the dropdown
    const roleOptions = [
        { label: t('roleCoach'), value: 'coach' },
        { label: t('roleStudent'), value: 'student' }
    ];

    // Current role state - use initialRole from server if provided, otherwise from search params
    const [currentRole, setCurrentRole] = useState(
        initialRole || searchParams.get('role') || 'coach'
    );

    // Current tab state from URL, defaults to 'upcoming'
    const currentTab = searchParams.get('tab') || 'upcoming';

    // Handle role change and update search params
    const onRoleChange = (selected: string | string[] | null) => {
        const roleValue = selected as string;

        setCurrentRole(roleValue);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('role', roleValue);
        router.push(`?${newSearchParams.toString()}`);
    };

    // Handle tab change and update search params
    const onTabChange = (tab: string) => {
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('tab', tab);
        router.push(`?${newSearchParams.toString()}`);
    };

    // Helper to check if any session starts within the next 15 minutes
    const hasUpcomingSessionSoon = (sessions: { startTime?: string }[]) => {
        const now = new Date();
        const fifteenMinutesFromNow = now.getTime() + 15 * 60 * 1000;
        return sessions.some(session => {
            if (!session?.startTime) return false;
            const startTime = new Date(session.startTime).getTime();
            return startTime > now.getTime() && startTime <= fifteenMinutesFromNow;
        });
    };

    const [coachCoachingSessionsResponse, { refetch: refetchCoachingSessions }] = trpc.listCoachCoachingSessions.useSuspenseQuery({}, {
        staleTime: 0,
        refetchOnMount: 'always',
        refetchInterval: (query) => {
            const data = query.state.data as { data?: { sessions?: { startTime?: string }[] } } | undefined;
            const sessions = data?.data?.sessions || [];
            return hasUpcomingSessionSoon(sessions) ? 30000 : false;
        },
    });
    const utils = trpc.useUtils();

    const scheduleMutation = trpc.scheduleCoachingSession.useMutation();
    const unscheduleMutation = trpc.unscheduleCoachingSession.useMutation();

    const [coachCoachingSessionsViewModel, setCoachCoachingSessionsViewModel] = useState<
        viewModels.TListCoachCoachingSessionsViewModel | undefined
    >(undefined);

    const [scheduleViewModel, setScheduleViewModel] = useState<
        viewModels.TScheduleCoachingSessionViewModel | undefined
    >(undefined);

    const [unscheduleViewModel, setUnscheduleViewModel] = useState<
        viewModels.TUnscheduleCoachingSessionViewModel | undefined
    >(undefined);

    const { presenter } = useListCoachCoachingSessionsPresenter(
        setCoachCoachingSessionsViewModel,
    );

    const { presenter: schedulePresenter } = useScheduleCoachingSessionPresenter(
        setScheduleViewModel,
    );

    const { presenter: unschedulePresenter } = useUnscheduleCoachingSessionPresenter(
        setUnscheduleViewModel,
    );

    // Present data when available (in useEffect to avoid setState during render)
    useEffect(() => {
        if (coachCoachingSessionsResponse && presenter) {
            // @ts-ignore
            presenter.present(coachCoachingSessionsResponse, coachCoachingSessionsViewModel);
        }
    }, [coachCoachingSessionsResponse, presenter]);

    // Helper functions for navigation and actions
    const handleStudentClick = (studentUsername: string) => {
        window.open(`/${locale}/students/${studentUsername}`, '_blank');
    };

    const handleJoinMeeting = (meetingUrl: string | null | undefined) => {
        if (meetingUrl) {
            window.open(meetingUrl, '_blank');
        }
    };

    const handleDownloadRecording = (sessionId: number | string) => {
        // TODO: Implement recording download
        console.log('Download recording for session:', sessionId);
    };

    // Get all sessions from the view model
    const allSessions = useMemo(() => {
        if (!coachCoachingSessionsViewModel || coachCoachingSessionsViewModel.mode !== 'default' || !coachCoachingSessionsViewModel.data) {
            return [];
        }
        return coachCoachingSessionsViewModel.data.sessions || [];
    }, [coachCoachingSessionsViewModel]);

    // Filter sessions by status for each tab
    const upcomingSessions = useMemo(() => {
        return allSessions.filter(session => session.status === 'scheduled' || session.status === 'requested');
    }, [allSessions]);

    const endedSessions = useMemo(() => {
        return allSessions.filter(session => session.status === 'completed');
    }, [allSessions]);


    // Pagination for upcoming sessions
    const {
        displayedItems: displayedUpcomingSessions,
        hasMoreItems: hasMoreUpcomingSessions,
        handleLoadMore: handleLoadMoreUpcomingSessions,
    } = useClientSidePagination({
        items: upcomingSessions,
    });

    // Pagination for ended sessions
    const {
        displayedItems: displayedEndedSessions,
        hasMoreItems: hasMoreEndedSessions,
        handleLoadMore: handleLoadMoreEndedSessions,
    } = useClientSidePagination({
        items: endedSessions,
    });

    // Accept modal state
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [acceptSessionId, setAcceptSessionId] = useState<number | null>(null);

    // Decline/Cancel modal state (using CancelCoachingSessionModal like student page)
    const [isDeclineModalOpen, setIsDeclineModalOpen] = useState(false);
    const [declineSessionId, setDeclineSessionId] = useState<number | null>(null);

    const handleAcceptClick = (sessionId: number) => {
        setAcceptSessionId(sessionId);
        setIsAcceptModalOpen(true);
    };

    const handleDeclineClick = (sessionId: number) => {
        setDeclineSessionId(sessionId);
        setIsDeclineModalOpen(true);
    };

    const handleConfirmAccept = async () => {
        if (!acceptSessionId) return;

        const result = await scheduleMutation.mutateAsync({ coachingSessionId: acceptSessionId });

        // Present the result using the presenter
        // @ts-ignore
        schedulePresenter.present(result, scheduleViewModel);

        // Check if the mutation failed using the result directly (viewModel state is async)
        if (!result.success) {
            // Error occurred, don't close modal - let user see the error
            return;
        }

        // Refetch to get fresh data immediately before closing modal
        utils.getCoachAvailability.invalidate();
        utils.listCoachCoachingSessions.invalidate();
        utils.listStudentCoachingSessions.invalidate();
        utils.listAvailableCoachings.invalidate();
        await refetchCoachingSessions();

        // Success - close modal
        setIsAcceptModalOpen(false);
        setAcceptSessionId(null);
        setScheduleViewModel(undefined);
    };

    // Decline/Cancel handler - matches student page's handleCancel pattern
    const handleDecline = async (sessionId: number | string, declineReason: string) => {
        const numericId = typeof sessionId === 'string' ? parseInt(sessionId, 10) : sessionId;

        const response = await unscheduleMutation.mutateAsync({
            coachingSessionId: numericId,
            declineReason,
        });

        // @ts-ignore
        unschedulePresenter.present(response, unscheduleViewModel);

        // Check if the mutation failed using the result directly (viewModel state is async)
        if (!response.success) {
            // Error occurred, don't proceed with success actions
            return;
        }

        // Refetch to get fresh data immediately before closing modal
        utils.getCoachAvailability.invalidate();
        utils.listCoachCoachingSessions.invalidate();
        utils.listStudentCoachingSessions.invalidate();
        utils.listAvailableCoachings.invalidate();
        await refetchCoachingSessions();

        // Success - close modal and reset state
        setIsDeclineModalOpen(false);
        setDeclineSessionId(null);
    };

    if (!coachCoachingSessionsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (coachCoachingSessionsViewModel.mode === 'kaboom') {
        return <DefaultError locale={locale} />;
    }

    // Helper to render content based on sessions and pagination state
    const renderSessionContent = (
        sessions: TListCoachCoachingSessionsSuccessResponse['data']['sessions'],
        displayedSessions: TListCoachCoachingSessionsSuccessResponse['data']['sessions'],
        hasMore: boolean,
        handleLoadMore: () => void
    ) => {
        // If no sessions, show empty state
        if (sessions.length === 0) {
            return (
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                    <p className="text-text-primary text-md">
                        {t('noSessionsFound')}
                    </p>
                </div>
            );
        }

        // Otherwise, render the session list
        return (
            <>
                <CoachingSessionList locale={locale}>
                    {renderSessionCards(displayedSessions)}
                </CoachingSessionList>
                {hasMore && (
                    <div className="flex justify-center items-center w-full mt-6">
                        <Button
                            variant="text"
                            text={t('loadMore')}
                            onClick={handleLoadMore}
                        />
                    </div>
                )}
            </>
        );
    };

    // Helper to render session cards (extracted to avoid duplication)
    const renderSessionCards = (sessions: TListCoachCoachingSessionsSuccessResponse['data']['sessions']) => {

        return sessions.map((session) => {
            // Create start DateTime for time calculations
            const startDateTime = new Date(session.startTime);

            if (session.status === 'requested') {
                // For requested sessions (upcoming tab)
                return (
                    <CoachingSessionCard
                        key={session.id}
                        locale={locale}
                        userType="coach"
                        status="requested"
                        title={session.coachingOfferingTitle}
                        duration={session.coachingOfferingDuration}
                        date={startDateTime}
                        startTime={formatTime(session.startTime)}
                        endTime={formatTime(session.endTime)}
                        studentName={`${session.student.name || ''} ${session.student.surname || ''}`.trim() || session.student.username}
                        studentImageUrl={session.student.avatarUrl || ""}
                        onClickStudent={() => handleStudentClick(session.student.username || '')}
                        onClickAccept={() => handleAcceptClick(parseInt(`${session.id}`))}
                        onClickDecline={() => handleDeclineClick(parseInt(`${session.id}`))}
                    />
                );
            }

            if (session.status === 'scheduled') {
                return (
                    <ScheduledCoachSessionCard
                        key={session.id}
                        session={session}
                        locale={locale}
                        formatTime={formatTime}
                        onStudentClick={() => handleStudentClick(session.student.username || '')}
                        onJoinMeeting={() => handleJoinMeeting(session?.meetingUrl)}
                        onCancel={() => handleDeclineClick(parseInt(`${session.id}`))}
                    />
                );
            }

            if (session.status === 'completed') {
                // For completed sessions (ended tab)
                if (session.review) {
                    return (
                        <CoachingSessionCard
                            key={session.id}
                            locale={locale}
                            userType="coach"
                            status="ended"
                            title={session.coachingOfferingTitle}
                            duration={session.coachingOfferingDuration}
                            date={startDateTime}
                            startTime={formatTime(session.startTime)}
                            endTime={formatTime(session.endTime)}
                            studentName={`${session.student.name || ''} ${session.student.surname || ''}`.trim() || session.student.username}
                            studentImageUrl={session.student.avatarUrl || ""}
                            onClickStudent={() => handleStudentClick(session.student.username || '')}
                            reviewType="call-quality"
                            callQualityRating={session.review?.rating || 0}
                            onClickDownloadRecording={() => handleDownloadRecording(session.id)}
                            isRecordingDownloading={false}
                        />
                    );
                } else {
                    // Completed session without review
                    return (
                        <CoachingSessionCard
                            key={session.id}
                            locale={locale}
                            userType="coach"
                            status="ended"
                            reviewType="no-review"
                            title={session.coachingOfferingTitle}
                            duration={session.coachingOfferingDuration}
                            date={startDateTime}
                            startTime={formatTime(session.startTime)}
                            endTime={formatTime(session.endTime)}
                            studentName={`${session.student.name || ''} ${session.student.surname || ''}`.trim() || session.student.username}
                            studentImageUrl={session.student.avatarUrl || ""}
                            onClickStudent={() => handleStudentClick(session.student.username || '')}
                            onClickDownloadRecording={() => handleDownloadRecording(session.id)}
                            isRecordingDownloading={false}
                        />
                    );
                }
            }

            return null;
        }).filter(Boolean);
    };

    return (
        <div className="w-full h-full flex flex-col gap-4"  >
            <div className="w-full flex justify-between items-center " >
                <Breadcrumbs
                    items={[
                        {
                            label: breadcrumbsTranslations('home'),
                            onClick: () => router.push('/'),
                        },
                        {
                            label: breadcrumbsTranslations('workspace'),
                            onClick: () => router.push('/workspace/'),
                        },
                        {
                            label: breadcrumbsTranslations('yourCoachingSessions'),
                            onClick: () => {
                                // Nothing should happen on clicking the current page
                            },
                        },
                    ]}
                />

                <Dropdown
                    type="simple"
                    className="w-fit"
                    options={roleOptions}
                    defaultValue={currentRole}
                    text={{ simpleText: t('selectRole') }}
                    onSelectionChange={onRoleChange}
                />
            </div>

            {/* Render student or coach content based on selected role */}
            {currentRole === 'student' ? (
                <StudentCoachingSessions hideBreadcrumbs={true} />
            ) : (
                <Tabs.Root defaultTab={currentTab} onValueChange={onTabChange}>
                    <div className="w-full flex justify-between items-center md:flex-row flex-col gap-4" >
                        <div className="w-full flex gap-4 items-center justify-between" >
                            <h1>
                                {t('yourCoachingSessions')}
                            </h1>
                            <Tabs.List className="flex rounded-medium gap-2 w-fit whitespace-nowrap">
                                <Tabs.Trigger value="upcoming" isLast={false}>
                                    {t('upcoming')}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="ended" isLast={true}>
                                    {t('ended')}
                                </Tabs.Trigger>
                            </Tabs.List>
                        </div>
                    </div>
                    <Tabs.Content value="upcoming" className="mt-10">
                        {renderSessionContent(upcomingSessions, displayedUpcomingSessions, hasMoreUpcomingSessions, handleLoadMoreUpcomingSessions)}
                    </Tabs.Content>

                    <Tabs.Content value="ended" className="mt-10">
                        {renderSessionContent(endedSessions, displayedEndedSessions, hasMoreEndedSessions, handleLoadMoreEndedSessions)}
                    </Tabs.Content>
                </Tabs.Root>
            )}

            {/* Coach-specific modals - only render when in coach mode */}
            {currentRole !== 'student' && (
                <>
                    {/* Accept Modal */}
                    {isAcceptModalOpen && (
                        <ConfirmationModal
                            type="accept"
                            isOpen={true}
                            onClose={() => {
                                setIsAcceptModalOpen(false);
                                setAcceptSessionId(null);
                            }}
                            onConfirm={handleConfirmAccept}
                            title={t('confirmAcceptance')}
                            message={t('confirmAcceptanceMessage')}
                            confirmText={t('accept')}
                            isLoading={scheduleMutation.isPending}
                            viewModel={scheduleViewModel}
                            locale={locale}
                        />
                    )}

                    {/* Decline/Cancel Modal - using same component as student page */}
                    {isDeclineModalOpen && (
                        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm rounded-lg shadow-lg">
                            <CancelCoachingSessionModal
                                locale={locale}
                                onClose={() => {
                                    setIsDeclineModalOpen(false);
                                    setDeclineSessionId(null);
                                }}
                                onCancel={(reason: string) => {
                                    if (declineSessionId) handleDecline(declineSessionId, reason);
                                }}
                                isLoading={unscheduleMutation.isPending}
                                isError={unscheduleViewModel?.mode === 'kaboom'}
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
