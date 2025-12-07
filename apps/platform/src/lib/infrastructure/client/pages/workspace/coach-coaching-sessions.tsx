"use client";

import { TLocale } from "@maany_shr/e-class-translations";
import { useLocale, useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { trpc } from "../../trpc/cms-client";
import { viewModels } from "@maany_shr/e-class-models";
import { useListCoachCoachingSessionsPresenter } from "../../hooks/use-list-coach-coaching-sessions-presenter";
import { CoachingSessionCard, CoachingSessionList, DefaultError, DefaultLoading, Tabs, Button, ConfirmationModal, Breadcrumbs, Dropdown } from "@maany_shr/e-class-ui-kit";
import useClientSidePagination from "../../utils/use-client-side-pagination";
import { useScheduleCoachingSessionPresenter } from "../../hooks/use-schedule-coaching-session-presenter";
import { useUnscheduleCoachingSessionPresenter } from "../../hooks/use-unschedule-coaching-session-presenter";
import { useCheckTimeLeft } from "../../../hooks/use-check-time-left";
import { TListCoachCoachingSessionsSuccessResponse } from "@dream-aim-deliver/e-class-cms-rest";


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

    // Handle role change and update search params
    const onRoleChange = (selected: string | string[] | null) => {
        const roleValue = selected as string;

        setCurrentRole(roleValue);
        const newSearchParams = new URLSearchParams(searchParams.toString());
        newSearchParams.set('role', roleValue);
        router.push(`?${newSearchParams.toString()}`);
    };
    const [coachCoachingSessionsResponse, { refetch: refetchCoachingSessions }] = trpc.listCoachCoachingSessions.useSuspenseQuery({});
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

    // @ts-ignore
    presenter.present(coachCoachingSessionsResponse, coachCoachingSessionsViewModel);

    // Helper functions for navigation and actions
    const handleStudentClick = (studentId: number) => {
        // TODO: Implement navigation to student profile
        console.log('Navigate to student profile:', studentId);
    };

    const handleJoinMeeting = (meetingUrl: string) => {
        if (meetingUrl) {
            window.open(meetingUrl, '_blank');
        }
    };

    const handleDownloadRecording = (sessionId: number | string) => {
        // TODO: Implement recording download
        console.log('Download recording for session:', sessionId);
    };

    // Time-based hooks for session management
    const isJoiningEnabled = useCheckTimeLeft(new Date(), { hours: 24 });
    const isMeetingLink = useCheckTimeLeft(new Date(), { minutes: 10 });

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

    // Unified modal state for accept/decline functionality
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'accept' | 'decline' | null>('accept');
    const [sessionId, setSessionId] = useState<number | null>(null);

    const handleAcceptClick = (sessionId: number) => {
        setSessionId(sessionId);
        setModalType('accept');
        setIsModalOpen(true);
    };

    const handleDeclineClick = (sessionId: number) => {
        setSessionId(sessionId);
        setModalType('decline');
        setIsModalOpen(true);
    };

    const handleConfirmAccept = async () => {
        if (!sessionId) return;

        const result = await scheduleMutation.mutateAsync({ coachingSessionId: sessionId });

        // Present the result using the presenter
        // @ts-ignore
        schedulePresenter.present(result, scheduleViewModel);

        // Check if the mutation failed using the result directly (viewModel state is async)
        if (!result.success) {
            // Error occurred, don't close modal - let user see the error
            return;
        }

        // Refetch to get fresh data immediately before closing modal
        await refetchCoachingSessions();
        utils.listStudentCoachingSessions.invalidate();
        utils.getCoachAvailability.invalidate();

        // Success - close modal
        setIsModalOpen(false);
        setModalType(null);
        setSessionId(null);
        setScheduleViewModel(undefined);
    };

    const handleConfirmDecline = async (declineReason: string) => {
        if (!sessionId) return;

        // Unschedule the coaching session

        const response = await unscheduleMutation.mutateAsync({
            coachingSessionId: sessionId,
            declineReason,
        });

        // @ts-ignore
        unschedulePresenter.present(response, unscheduleViewModel);

        // Check if the mutation failed using the result directly (viewModel state is async)
        if (!response.success) {
            return;
        }

        // Refetch to get fresh data immediately before closing modal
        await refetchCoachingSessions();
        utils.listStudentCoachingSessions.invalidate();
        utils.getCoachAvailability.invalidate();

        // Success - close modal and reset state
        setIsModalOpen(false);
        setModalType(null);
        setSessionId(null);
        setUnscheduleViewModel(undefined);
    };

    // Unified confirm handler using switch condition
    const handleConfirm = async (reason?: string) => {
        if (!sessionId || !modalType) return;

        switch (modalType) {
            case 'accept':
                await handleConfirmAccept();
                break;
            case 'decline':
                await handleConfirmDecline(reason || '');
                break;
        }
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setModalType(null);
        setSessionId(null);

    };

    // Get modal configuration based on type using switch condition - memoized for performance
    const getModalConfig = () => {
        switch (modalType) {
            case 'accept':
                return {
                    title: t('confirmAcceptance'),
                    message: t('confirmAcceptanceMessage'),
                    confirmText: t('accept'),
                    isLoading: scheduleMutation.isPending,
                    viewModel: scheduleViewModel
                };
            case 'decline':
                return {
                    title: t('confirmDecline'),
                    message: t('confirmDeclineMessage'),
                    confirmText: t('decline'),
                    isLoading: unscheduleMutation.isPending,
                    viewModel: unscheduleViewModel,
                    declineReasonPlaceholder: t('declineReasonPlaceholder'),
                };
            default:
                return {
                    title: '',
                    message: '',
                    confirmText: '',
                    isLoading: false,
                    viewModel: undefined
                };
        }
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
            // Helper function to format time from ISO string
            const formatTime = (isoString: string) => {
                const date = new Date(isoString);
                return date.toLocaleTimeString(locale, {
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                });
            };

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
                        onClickStudent={() => handleStudentClick(parseInt(`${session.id}`))}
                        onClickAccept={() => handleAcceptClick(parseInt(`${session.id}`))}
                        onClickDecline={() => handleDeclineClick(parseInt(`${session.id}`))}
                    />
                );
            }

            if (session.status === 'scheduled') {
                if (isJoiningEnabled) {
                    return (
                        <CoachingSessionCard
                            key={session.id}
                            locale={locale}
                            userType="coach"
                            status="upcoming-locked"
                            title={session.coachingOfferingTitle}
                            duration={session.coachingOfferingDuration}
                            date={startDateTime}
                            startTime={formatTime(session.startTime)}
                            endTime={formatTime(session.endTime)}
                            studentName={`${session.student.name || ''} ${session.student.surname || ''}`.trim() || session.student.username}
                            studentImageUrl={session.student.avatarUrl || ""}
                            onClickStudent={() => handleStudentClick(parseInt(`${session.id}`))}
                            onClickJoinMeeting={() => handleJoinMeeting(session?.meetingUrl || "")}
                        />
                    );
                } else if (isMeetingLink) {
                    return (
                        <CoachingSessionCard
                            key={session.id}
                            locale={locale}
                            userType="coach"
                            status="ongoing"
                            title={session.coachingOfferingTitle}
                            duration={session.coachingOfferingDuration}
                            date={startDateTime}
                            startTime={formatTime(session.startTime)}
                            endTime={formatTime(session.endTime)}
                            studentName={`${session.student.name || ''} ${session.student.surname || ''}`.trim() || session.student.username}
                            studentImageUrl={session.student.avatarUrl || ""}
                            onClickStudent={() => handleStudentClick(parseInt(`${session.id}`))}
                            meetingLink={session?.meetingUrl || ""}
                            onClickJoinMeeting={() => handleJoinMeeting(session?.meetingUrl || "")}
                        />
                    );
                } else {
                    const hoursLeftToEdit = Math.floor((startDateTime.getTime() - Date.now()) / (1000 * 60 * 60));
                    return (
                        <CoachingSessionCard
                            key={session.id}
                            locale={locale}
                            userType="coach"
                            status="upcoming-editable"
                            title={session.coachingOfferingTitle}
                            duration={session.coachingOfferingDuration}
                            date={startDateTime}
                            startTime={formatTime(session.startTime)}
                            endTime={formatTime(session.endTime)}
                            studentName={`${session.student.name || ''} ${session.student.surname || ''}`.trim() || session.student.username}
                            studentImageUrl={session.student.avatarUrl || ""}
                            onClickStudent={() => handleStudentClick(parseInt(`${session.id}`))}
                            onClickCancel={() => handleDeclineClick(parseInt(`${session.id}`))}
                            hoursLeftToEdit={hoursLeftToEdit}
                        />
                    );
                }
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
                            onClickStudent={() => handleStudentClick(parseInt(`${session.id}`))}
                            reviewType="call-quality"
                            callQualityRating={session.review?.rating || 0}
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
            <Tabs.Root defaultTab="upcoming">
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

            {/* Unified Accept/Decline Modal using Switch Condition */}
            <ConfirmationModal
                type={modalType || 'accept'}
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onConfirm={handleConfirm}
                title={getModalConfig().title}
                message={getModalConfig().message}
                confirmText={getModalConfig().confirmText}
                isLoading={getModalConfig().isLoading}
                viewModel={getModalConfig().viewModel}
                locale={locale}
                declineReasonPlaceholder={getModalConfig().declineReasonPlaceholder}
            />
        </div>
    );
}
