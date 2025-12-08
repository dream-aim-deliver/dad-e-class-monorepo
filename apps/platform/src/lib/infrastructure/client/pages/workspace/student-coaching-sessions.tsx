"use client";

import { TLocale, getDictionary } from "@maany_shr/e-class-translations";
import { useLocale, useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { viewModels } from "@maany_shr/e-class-models";
import { useListStudentCoachingSessionsPresenter } from "../../hooks/use-list-student-coaching-sessions-presenter";
import { useListCoachesPresenter } from "../../hooks/use-coaches-presenter";
import { useCreateCoachingSessionReviewPresenter } from "../../hooks/use-create-coaching-session-review-presenter";
import { useUnscheduleCoachingSessionPresenter } from "../../hooks/use-unschedule-coaching-session-presenter";
import { CoachingSessionCard, CoachingSessionList, DefaultError, DefaultLoading, Tabs, Button, CoachCard, CardListLayout, DefaultNotFound, Breadcrumbs, AvailableCoachingSessions, ReviewDialog, CancelCoachingSessionModal } from "@maany_shr/e-class-ui-kit";
import useClientSidePagination from "../../utils/use-client-side-pagination";
import { useRouter } from "next/navigation";
import { useCheckTimeLeft } from "../../../hooks/use-check-time-left";
import { trpc } from "../../trpc/cms-client";

export default function StudentCoachingSessions() {
    const locale = useLocale() as TLocale;
    const dictionary = getDictionary(locale);

    const coachingSessionTranslations = useTranslations(
        'pages.studentCoachingSessions',
    );

    const paginationTranslations = useTranslations(
        'components.paginationButton',
    );

    const [activeTab, setActiveTab] = useState<string>('upcoming');
    const router = useRouter();

    const [studentCoachingSessionsResponse, { refetch: refetchStudentCoachingSessions }] = trpc.listStudentCoachingSessions.useSuspenseQuery({});
    const utils = trpc.useUtils();

    const createReviewMutation = trpc.createCoachingSessionReview.useMutation({
        onSuccess: () => {
            // Invalidate related queries to refetch fresh data
            utils.listStudentCoachingSessions.invalidate();
            utils.listCoachCoachingSessions.invalidate();
        },
    });

    const unscheduleMutation = trpc.unscheduleCoachingSession.useMutation();

    const [studentCoachingSessionsViewModel, setStudentCoachingSessionsViewModel] = useState<
        viewModels.TStudentCoachingSessionsListViewModel | undefined
    >(undefined);

    const [createReviewViewModel, setCreateReviewViewModel] = useState<
        viewModels.TCreateCoachingSessionReviewViewModel | undefined
    >(undefined);

    const [unscheduleViewModel, setUnscheduleViewModel] = useState<
        viewModels.TUnscheduleCoachingSessionViewModel | undefined
    >(undefined);

    // Time-based hooks for session management
    const isJoiningEnabled = useCheckTimeLeft(new Date(), { hours: 24 });
    const isMeetingLink = useCheckTimeLeft(new Date(), { minutes: 10 });

    // For the available tab - coaches data
    const [coachesResponse] = trpc.listCoaches.useSuspenseQuery({
        pastCoaches: true,
    });

    const [coachesViewModel, setCoachesViewModel] = useState<
        viewModels.TCoachListViewModel | undefined
    >(undefined);

    const { presenter } = useListStudentCoachingSessionsPresenter(
        setStudentCoachingSessionsViewModel,
    );

    const { presenter: coachesPresenter } = useListCoachesPresenter(setCoachesViewModel);

    const { presenter: createReviewPresenter } = useCreateCoachingSessionReviewPresenter(
        setCreateReviewViewModel,
    );

    const { presenter: unschedulePresenter } = useUnscheduleCoachingSessionPresenter(
        setUnscheduleViewModel,
    );

    // @ts-ignore
    presenter.present(studentCoachingSessionsResponse, studentCoachingSessionsViewModel);

    // @ts-ignore
    coachesPresenter.present(coachesResponse, coachesViewModel);

    // Get all sessions from the view model
    const allSessions = useMemo(() => {
        if (!studentCoachingSessionsViewModel || studentCoachingSessionsViewModel.mode !== 'default' || !studentCoachingSessionsViewModel.data) {
            return [];
        }
        return studentCoachingSessionsViewModel.data.sessions || [];
    }, [studentCoachingSessionsViewModel]);

    // Type for scheduled sessions (excluding unscheduled)
    type ScheduledSession = Exclude<NonNullable<viewModels.TStudentCoachingSessionsListSuccess['sessions']>[number], { status: 'unscheduled' }>;

    // Filter out unscheduled sessions for card rendering (they're handled separately in Available tab)
    const scheduledSessions = useMemo(() => {
        return allSessions.filter((session): session is ScheduledSession => session?.status !== 'unscheduled');
    }, [allSessions]);

    // Filter sessions by status for each tab
    const upcomingSessions = useMemo(() => {
        return scheduledSessions.filter(session => session.status === 'scheduled' || session.status === 'requested');
    }, [scheduledSessions]);

    const endedSessions = useMemo(() => {
        return scheduledSessions.filter(session => session.status === 'completed');
    }, [scheduledSessions]);

    // Filter unscheduled sessions for Available tab
    const unscheduledSessions = useMemo(() => {
        return allSessions.filter(session => session.status === 'unscheduled');
    }, [allSessions]);

    // For available tab - get coaches data
    const availableCoaches = useMemo(() => {
        if (!coachesViewModel || coachesViewModel.mode !== 'default' || !coachesViewModel.data) {
            return [];
        }
        return coachesViewModel.data.coaches || [];
    }, [coachesViewModel]);

    // Transform unscheduled sessions to AvailableCoachingSessions format
    const availableCoachingSessionsData = useMemo(() => {
        // Group sessions by title and duration, count occurrences
        const sessionGroups = unscheduledSessions.reduce((acc, session) => {
            if (!session?.coachingOfferingTitle || session?.coachingOfferingDuration === undefined) {
                return acc;
            }
            const key = `${session.coachingOfferingTitle}-${session.coachingOfferingDuration}`;
            if (!acc[key]) {
                acc[key] = {
                    title: session.coachingOfferingTitle,
                    time: session.coachingOfferingDuration,
                    numberOfSessions: 0
                };
            }
            acc[key].numberOfSessions += 1;
            return acc;
        }, {} as Record<string, { title: string; time: number; numberOfSessions: number }>);

        return Object.values(sessionGroups);
    }, [unscheduledSessions]);

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

    // Pagination for available coaches
    const {
        displayedItems: displayedAvailableCoaches,
        hasMoreItems: hasMoreAvailableCoaches,
        handleLoadMore: handleLoadMoreAvailableCoaches,
    } = useClientSidePagination({
        items: availableCoaches,
    });

    // Review modal state
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [reviewSessionId, setReviewSessionId] = useState<number | null>(null);
    const [reviewSubmitted, setReviewSubmitted] = useState(false);

    // Cancel modal state
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [cancelSessionId, setCancelSessionId] = useState<number | null>(null);

    // Reschedule modal state
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [rescheduleSessionId, setRescheduleSessionId] = useState<number | null>(null);

    // Review handlers
    const handleReviewClick = (sessionId: number | string) => {
        const numericId = typeof sessionId === 'string' ? parseInt(sessionId, 10) : sessionId;
        setReviewSessionId(numericId);
        setIsReviewModalOpen(true);
        setReviewSubmitted(false);
        setCreateReviewViewModel(undefined);
    };

    const handleReviewSubmit = async (rating: number, review: string, neededMoreTime: boolean) => {
        if (!reviewSessionId) return;

        const result = await createReviewMutation.mutateAsync({
            coachingSessionId: reviewSessionId,
            rating,
            notes: review || null,
            neededMoreTime,
        });

        // @ts-ignore Present the result using the presenter
        createReviewPresenter.present(result, createReviewViewModel);

        // Check if the mutation failed using the result directly (viewModel state is async)
        if (!result.success) {
            // Error occurred, don't proceed with success actions
            return;
        }

        // Success - update UI state and invalidate cache
        setReviewSubmitted(true);
        // Invalidate and refetch the sessions to show the updated review
        // This is IMPORTANT: It refreshes the UI so the session card shows
        // "has review" instead of "add review" and displays the new review data
        utils.listStudentCoachingSessions.invalidate();
        utils.listCoachCoachingSessions.invalidate();
    };

    const handleReviewSkip = () => {
        setIsReviewModalOpen(false);
        setReviewSessionId(null);
        setReviewSubmitted(false);
        setCreateReviewViewModel(undefined);
    };

    const handleReviewClose = () => {
        setIsReviewModalOpen(false);
        setReviewSessionId(null);
        setReviewSubmitted(false);
        setCreateReviewViewModel(undefined);
    };

    // Cancel handler - just unschedule the session
    const handleCancel = async (sessionId: number | string, cancelReason: string) => {
        const numericId = typeof sessionId === 'string' ? parseInt(sessionId, 10) : sessionId;

        const response = await unscheduleMutation.mutateAsync({
            coachingSessionId: numericId,
            declineReason: cancelReason,
        });

        //@ts-ignore
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
        await refetchStudentCoachingSessions();

        // Success - close modal and reset state
        setIsCancelModalOpen(false);
        setCancelSessionId(null);
    };

    // Open cancel modal instead of direct cancel
    const handleOpenCancelModal = (sessionId: number | string) => {
        const numericId = typeof sessionId === 'string' ? parseInt(sessionId, 10) : sessionId;
        setCancelSessionId(numericId);
        setIsCancelModalOpen(true);
    };

    // Open reschedule modal
    const handleOpenRescheduleModal = (sessionId: number | string) => {
        const numericId = typeof sessionId === 'string' ? parseInt(sessionId, 10) : sessionId;
        setRescheduleSessionId(numericId);
        setIsRescheduleModalOpen(true);
    };

    // Reschedule handler - unschedule session (no redirect)
    const handleReschedule = async (sessionId: number, reason: string) => {
        const response = await unscheduleMutation.mutateAsync({
            coachingSessionId: sessionId,
            declineReason: reason || 'Rescheduling session',
        });

        // @ts-ignore Present the response to the view model
        unschedulePresenter.present(response, unscheduleViewModel);

        // Check if the mutation failed using the result directly (viewModel state is async)
        if (!response.success) {
            // Error occurred, don't proceed with success actions
            return;
        }

        // Refetch to get fresh data
        utils.getCoachAvailability.invalidate();
        utils.listCoachCoachingSessions.invalidate();
        utils.listStudentCoachingSessions.invalidate();
        await refetchStudentCoachingSessions();

        // Close the modal
        setIsRescheduleModalOpen(false);
        setRescheduleSessionId(null);
    };

    // Navigation handlers
    const handleViewCoachProfile = (coachUsername: string) => {
        router.push(`/coaches/${coachUsername}`);
    };

    const handleViewCourse = (courseSlug: string) => {
        router.push(`/courses/${courseSlug}`);
    };

    const handleViewAllCoaches = () => {
        router.push('/coaches');
    };

    const handleNavigateHome = () => {
        router.push('/');
    };

    const handleNavigateWorkspace = () => {
        router.push('/workspace');
    };

    const handleNavigateCoachingSessions = () => {
        // Nothing should happen on clicking the current page
    };

    // Session action handlers
    const handleCreatorClick = (coachUsername: string) => {
        router.push(`/coaches/${coachUsername}`);
    };

    const handleJoinMeeting = (meetingUrl: string) => {
        window.open(meetingUrl, '_blank');
    };

    const handleDownloadRecording = (sessionId: number | string) => {
        // TODO: Implement download recording functionality if available in stack
        const numericId = typeof sessionId === 'string' ? parseInt(sessionId, 10) : sessionId;
        console.log('Download recording for session:', numericId);
    };

    const handleBookSession = (coachUsername: string) => {
        window.open(`/coaches/${coachUsername}/book`, '_blank');
    };

    const handleBuyMoreSessions = () => {
        // TODO: Implement buy more sessions functionality
        console.log('Buy more sessions clicked');
    };

    if (!studentCoachingSessionsViewModel || !coachesViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (studentCoachingSessionsViewModel.mode !== 'default' || coachesViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    // Helper to render available coaches content with two-column layout
    const renderAvailableCoachesContent = () => {
        return (
            <div className="flex flex-col lg:flex-row gap-6 w-full">
                {/* Left side - Available Coaching Sessions */}
                <div className="lg:w-1/4">
                    <AvailableCoachingSessions
                        locale={locale}
                        text={coachingSessionTranslations('availableSessionsDescription')}
                        availableCoachingSessionsData={availableCoachingSessionsData}
                        onClickBuyMoreSessions={handleBuyMoreSessions}
                        hideButton={availableCoachingSessionsData.length === 0}
                    />
                </div>

                {/* Right side - Available Coaches */}
                <div className="lg:w-3/4">
                    {availableCoaches.length === 0 ? (
                        <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                            <p className="text-text-primary text-md">
                                {coachingSessionTranslations('noCoachesFound')}
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-4 mb-4">
                                <h5>
                                    {coachingSessionTranslations('yourPastCoaches')}
                                </h5>
                                <Button
                                    variant="text"
                                    text={coachingSessionTranslations('viewAllCoaches')}
                                    onClick={handleViewAllCoaches}
                                />
                            </div>
                            <CardListLayout className="md:grid-cols-2 xl:grid-cols-2 2xl:grid-cols-2">
                                {displayedAvailableCoaches.map((coach) => {
                                    if (!coach?.username) return null;
                                    return (
                                        <CoachCard
                                            key={`coach-${coach.username}`}
                                            locale={locale}
                                            cardDetails={{
                                                coachName: `${coach.name || ''} ${coach.surname || ''}`.trim() || coach.username,
                                                coachImage: coach.avatarUrl ?? undefined,
                                                languages: coach.languages || [],
                                                sessionCount: coach.coachingSessionCount || 0,
                                                description: coach.bio || '',
                                                courses: (coach.coursesTaught || []).map((course) => ({
                                                    title: course?.title || '',
                                                    image: course?.imageUrl ?? '',
                                                    slug: course?.slug || '',
                                                })),
                                                skills: (coach.skills || []).map((skill) => skill?.name || '').filter(Boolean),
                                                rating: coach.averageRating ?? 0,
                                                totalRatings: coach.reviewCount || 0,
                                            }}
                                            onClickViewProfile={() => handleViewCoachProfile(coach.username!)}
                                            onClickCourse={(courseSlug: string) => handleViewCourse(courseSlug)}
                                            onClickBookSession={() => handleBookSession(coach.username!)}
                                        />
                                    );
                                })}
                            </CardListLayout>
                            {hasMoreAvailableCoaches && (
                                <div className="flex justify-center items-center w-full mt-6">
                                    <Button
                                        variant="text"
                                        text={paginationTranslations('loadMore')}
                                        onClick={handleLoadMoreAvailableCoaches}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>
        );
    };

    // Helper to render content based on sessions and pagination state
    const renderSessionContent = (
        sessions: ScheduledSession[],
        displayedSessions: ScheduledSession[],
        hasMore: boolean,
        handleLoadMore: () => void
    ) => {
        // If no sessions, show empty state
        if (sessions.length === 0) {
            return (
                <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                    <p className="text-text-primary text-md">
                        {coachingSessionTranslations('noSessionsFound')}
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
                            text={paginationTranslations('loadMore')}
                            onClick={handleLoadMore}
                        />
                    </div>
                )}
            </>
        );
    };

    // Helper to render session cards (extracted to avoid duplication)
    const renderSessionCards = (sessions: ScheduledSession[]) => {
        return sessions.map((session) => {
            // Type guard to ensure we have a scheduled/requested/completed session with required fields
            if (!session) return null;
            if (!('startTime' in session) || !('endTime' in session) || !('coach' in session)) return null;
            if (!session.startTime || !session.endTime || !session.coach?.username || session.id === undefined) {
                return null;
            }

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

            // Common properties for all session cards (excluding key)
            const coach = session.coach;
            const course = 'course' in session ? session.course : undefined;
            const coachName = `${coach.name || ''} ${coach.surname || ''}`.trim() || coach.username || 'Unknown Coach';

            const commonProps = {
                locale,
                userType: 'student' as const,
                title: session.coachingOfferingTitle || '',
                duration: session.coachingOfferingDuration || 0,
                date: startDateTime,
                startTime: formatTime(session.startTime),
                endTime: formatTime(session.endTime),
                creatorName: coachName,
                creatorImageUrl: coach.avatarUrl || '',
                onClickCreator: () => handleCreatorClick(coach.username || ''),
                courseName: course?.title,
                onClickCourse: course?.slug ? () => handleViewCourse(course.slug || '') : undefined,
            };

            if (session.status === 'requested') {
                return (
                    <CoachingSessionCard
                        key={session.id}
                        {...commonProps}
                        status="requested"
                        onClickCancel={() => handleOpenCancelModal(session.id!)}
                    />
                );
            }

            if (session.status === 'scheduled') {
                const meetingUrl = 'meetingUrl' in session ? (session.meetingUrl || null) : null;

                if (isJoiningEnabled) {
                    return (
                        <CoachingSessionCard
                            key={session.id}
                            {...commonProps}
                            status="upcoming-locked"
                            onClickJoinMeeting={() => handleJoinMeeting(meetingUrl || '')}
                        />
                    );
                } else if (isMeetingLink) {
                    return (
                        <CoachingSessionCard
                            key={session.id}
                            {...commonProps}
                            status="ongoing"
                            meetingLink={meetingUrl || ''}
                            onClickJoinMeeting={() => handleJoinMeeting(meetingUrl || '')}
                        />
                    );
                } else {
                    // Calculate time remaining before 24-hour lock
                    const msUntilLock = startDateTime.getTime() - Date.now() - (24 * 60 * 60 * 1000);
                    const totalMinutesLeft = Math.max(0, Math.floor(msUntilLock / (1000 * 60)));
                    const hoursLeftToEdit = Math.floor(totalMinutesLeft / 60);
                    // Calculate remaining minutes when hours is 0
                    const minutesLeftToEdit = hoursLeftToEdit === 0 ? totalMinutesLeft : undefined;

                    return (
                        <CoachingSessionCard
                            key={session.id}
                            {...commonProps}
                            status="upcoming-editable"
                            hoursLeftToEdit={hoursLeftToEdit}
                            minutesLeftToEdit={minutesLeftToEdit}
                            // Reschedule is commented out - it's functionally the same as cancel for students
                            // onClickReschedule={() => handleOpenRescheduleModal(session.id!)}
                            onClickCancel={() => handleOpenCancelModal(session.id!)}
                        />
                    );
                }
            }

            if (session.status === 'completed') {
                // For completed sessions (ended tab)
                const hasReview = 'review' in session && session.review;
                if (hasReview && session.review) {
                    return (
                        <CoachingSessionCard
                            key={session.id}
                            {...commonProps}
                            status="ended"
                            hasReview={true}
                            reviewText={session.review.comment || ''}
                            rating={session.review.rating || 0}
                            onClickDownloadRecording={() => handleDownloadRecording(session.id!)}
                            isRecordingDownloading={false}
                        />
                    );
                } else {
                    return (
                        <CoachingSessionCard
                            key={session.id}
                            {...commonProps}
                            status="ended"
                            hasReview={false}
                            onClickReviewCoachingSession={() => handleReviewClick(session.id!)}
                            onClickDownloadRecording={() => handleDownloadRecording(session.id!)}
                            isRecordingDownloading={false}
                        />
                    );
                }
            }

            return null;
        }).filter(Boolean);
    };

    return (
        <div className="flex flex-col space-y-2">
            <Breadcrumbs
                items={[
                    {
                        label: coachingSessionTranslations('home'),
                        onClick: handleNavigateHome,
                    },
                    {
                        label: coachingSessionTranslations('workspace'),
                        onClick: handleNavigateWorkspace,
                    },
                    {
                        label: coachingSessionTranslations('coachingSessions'),
                        onClick: handleNavigateCoachingSessions,
                    },
                ]}
            />
            <Tabs.Root defaultTab="upcoming" onValueChange={setActiveTab}>
                <div className="w-full flex justify-between items-center md:flex-row flex-col gap-4" >
                    <div className="w-full flex gap-4 items-center justify-between" >
                        <h1>
                            {coachingSessionTranslations('yourCoachingSessions')}
                        </h1>
                        <Tabs.List className="flex rounded-medium gap-2 w-fit whitespace-nowrap">
                            <Tabs.Trigger value="upcoming" isLast={false}>
                                {coachingSessionTranslations('upcoming')}
                            </Tabs.Trigger>
                            <Tabs.Trigger value="ended" isLast={false}>
                                {coachingSessionTranslations('ended')}
                            </Tabs.Trigger>
                            <Tabs.Trigger value="available" isLast={true}>
                                {coachingSessionTranslations('available')}
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

                <Tabs.Content value="available" className="mt-10">
                    {renderAvailableCoachesContent()}
                </Tabs.Content>
            </Tabs.Root >

            {/* Review Modal */}
            <ReviewDialog
                locale={locale}
                modalType="coaching"
                onClose={handleReviewClose}
                onSubmit={handleReviewSubmit}
                onSkip={handleReviewSkip}
                isLoading={createReviewMutation.isPending}
                isError={createReviewViewModel?.mode === 'kaboom'}
                submitted={reviewSubmitted}
                isOpen={isReviewModalOpen}
                onOpenChange={(open) => {
                    if (!open) {
                        handleReviewClose();
                    }
                }}
            />

            {/* Cancel Coaching Session Modal */}
            {isCancelModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm rounded-lg shadow-lg">
                    <CancelCoachingSessionModal
                        locale={locale}
                        onClose={() => {
                            setIsCancelModalOpen(false);
                            setCancelSessionId(null);
                        }}
                        onCancel={(reason: string) => {
                            if (cancelSessionId) handleCancel(cancelSessionId, reason);
                        }}
                        isLoading={unscheduleMutation.isPending}
                        isError={unscheduleViewModel?.mode === 'kaboom'}
                    />
                </div>
            )}

            {/* Reschedule Coaching Session Modal */}
            {isRescheduleModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm rounded-lg shadow-lg">
                    <CancelCoachingSessionModal
                        locale={locale}
                        onClose={() => {
                            setIsRescheduleModalOpen(false);
                            setRescheduleSessionId(null);
                        }}
                        onCancel={(reason: string) => {
                            if (rescheduleSessionId) handleReschedule(rescheduleSessionId, reason);
                        }}
                        isLoading={unscheduleMutation.isPending}
                        isError={unscheduleViewModel?.mode === 'kaboom'}
                        customModalText={dictionary.components.coachingSessionRescheduleModal.modalText}
                        customPlaceholder={dictionary.components.coachingSessionRescheduleModal.rescheduleReasonPlaceholder}
                        customConfirmText={dictionary.components.coachingSessionRescheduleModal.yesRescheduleText}
                    />
                </div>
            )}
        </div>
    );
}