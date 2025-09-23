"use client";

import { TLocale } from "@maany_shr/e-class-translations";
import { useLocale, useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { trpc } from "../../trpc/client";
import { viewModels } from "@maany_shr/e-class-models";
import { useListStudentCoachingSessionsPresenter } from "../../hooks/use-list-student-coaching-sessions-presenter";
import { useListCoachesPresenter } from "../../hooks/use-coaches-presenter";
import { useCreateCoachingSessionReviewPresenter } from "../../hooks/use-create-coaching-session-review-presenter";
import { useUnscheduleCoachingSessionPresenter } from "../../hooks/use-unschedule-coaching-session-presenter";
import { CoachingSessionCard, CoachingSessionList, DefaultError, DefaultLoading, Tabs, Button, CoachCard, CardListLayout, DefaultNotFound, Breadcrumbs, AvailableCoachingSessions, ReviewModal } from "@maany_shr/e-class-ui-kit";
import useClientSidePagination from "../../utils/use-client-side-pagination";
import { useRouter } from "next/navigation";
import { useCheckTimeLeft } from "../../../hooks/use-check-time-left";

export default function StudentCoachingSessions() {
    const locale = useLocale() as TLocale;

    const coachingSessionTranslations = useTranslations(
        'pages.studentCoachingSessions',
    );

    const paginationTranslations = useTranslations(
        'components.paginationButton',
    );

    const [activeTab, setActiveTab] = useState<string>('upcoming');
    const router = useRouter();

    const [studentCoachingSessionsResponse] = trpc.listStudentCoachingSessions.useSuspenseQuery({});
    const utils = trpc.useUtils();

    const createReviewMutation = trpc.createCoachingSessionReview.useMutation();
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
        pastStudentCoaches: true,
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

    presenter.present(studentCoachingSessionsResponse, studentCoachingSessionsViewModel);
    coachesPresenter.present(coachesResponse, coachesViewModel);

    // Get all sessions from the view model
    const allSessions = useMemo(() => {
        if (!studentCoachingSessionsViewModel || studentCoachingSessionsViewModel.mode !== 'default') {
            return [];
        }
        return studentCoachingSessionsViewModel.data.sessions;
    }, [studentCoachingSessionsViewModel]);

    // Type for scheduled sessions (excluding unscheduled)
    type ScheduledSession = Exclude<viewModels.TStudentCoachingSessionsListSuccess['sessions'][0], { status: 'unscheduled' }>;

    // Filter out unscheduled sessions for card rendering (they're handled separately in Available tab)
    const scheduledSessions = useMemo(() => {
        return allSessions.filter((session): session is ScheduledSession => session.status !== 'unscheduled');
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
        if (!coachesViewModel || coachesViewModel.mode !== 'default') {
            return [];
        }
        return coachesViewModel.data.coaches;
    }, [coachesViewModel]);

    // Transform unscheduled sessions to AvailableCoachingSessions format
    const availableCoachingSessionsData = useMemo(() => {
        // Group sessions by title and duration, count occurrences
        const sessionGroups = unscheduledSessions.reduce((acc, session) => {
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

    // Review handlers
    const handleReviewClick = (sessionId: number) => {
        setReviewSessionId(sessionId);
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

        // Present the result using the presenter
        createReviewPresenter.present(result, createReviewViewModel);

        // Check if the presentation resulted in an error
        if (createReviewViewModel && createReviewViewModel.mode === 'kaboom') {
            // Error occurred, don't proceed with success actions
            return;
        }

        // Success - update UI state and invalidate cache
        setReviewSubmitted(true);
        // Invalidate and refetch the sessions to show the updated review
        // This is IMPORTANT: It refreshes the UI so the session card shows 
        // "has review" instead of "add review" and displays the new review data
        utils.listStudentCoachingSessions.invalidate();
        // Note: Modal will stay open in success state until user clicks "Close" button
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
    const handleCancel = async (sessionId: number) => {
        const response = await unscheduleMutation.mutateAsync({
            coachingSessionId: sessionId,
        });
        
        // Present the response to the view model
        unschedulePresenter.present(response, unscheduleViewModel);

        // Check if the presentation resulted in an error
        if (unscheduleViewModel && unscheduleViewModel.mode === 'kaboom') {
            // Error occurred, don't proceed with success actions
            return;
        }
        
        // Invalidate and refetch the sessions list to reflect the change
        utils.listStudentCoachingSessions.invalidate();
    };

    // Reschedule handler - unschedule and redirect to coach calendar
    const handleReschedule = async (sessionId: number, coachUsername: string) => {
        const response = await unscheduleMutation.mutateAsync({
            coachingSessionId: sessionId,
        });
        
        // Present the response to the view model
        unschedulePresenter.present(response, unscheduleViewModel);

        // Check if the presentation resulted in an error
        if (unscheduleViewModel && unscheduleViewModel.mode === 'kaboom') {
            // Error occurred, don't proceed with success actions
            return;
        }
        
        // Invalidate and refetch the sessions list to reflect the change
        utils.listStudentCoachingSessions.invalidate();
        
        // Redirect to the coach's calendar page
        router.push(`/coaches/${coachUsername}`);
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
        // TODO: Implement navigation to workspace
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

    const handleDownloadRecording = (sessionId: number) => {
        // TODO: Implement download recording functionality
        console.log('Download recording for session:', sessionId);
    };

    const handleBookSession = (coachUsername: string) => {
        // TODO: Implement booking session navigation
        router.push(`/coaches/${coachUsername}`);
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
                                <h3 className="text-lg font-semibold text-white">
                                    {coachingSessionTranslations('yourPastCoaches')}
                                </h3>
                                <Button
                                    variant="text"
                                    text={coachingSessionTranslations('viewAllCoaches')}
                                    onClick={handleViewAllCoaches}
                                />
                            </div>
                            <CardListLayout className="md:grid-cols-1 xl:grid-cols-2 2xl:grid-cols-2">
                                {displayedAvailableCoaches.map((coach) => (
                                    <CoachCard
                                        key={`coach-${coach.username}`}
                                        locale={locale}
                                        cardDetails={{
                                            coachName: coach.name + ' ' + coach.surname,
                                            coachImage: coach.avatarUrl ?? undefined,
                                            languages: coach.languages,
                                            sessionCount: coach.coachingSessionCount,
                                            description: coach.bio,
                                            courses: coach.coursesTaught.map((course) => ({
                                                title: course.title,
                                                image: course.imageUrl ?? '',
                                                slug: course.slug,
                                            })),
                                            skills: coach.skills.map((skill) => skill.name),
                                            rating: coach.averageRating ?? 0,
                                            totalRatings: coach.reviewCount,
                                        }}
                                        onClickViewProfile={() => handleViewCoachProfile(coach.username)}
                                        onClickCourse={(courseSlug: string) => handleViewCourse(courseSlug)}
                                        onClickBookSession={() => handleBookSession(coach.username)}
                                    />
                                ))}
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
            const commonProps = {
                locale,
                userType: 'student' as const,
                title: session.coachingOfferingTitle,
                duration: session.coachingOfferingDuration,
                date: startDateTime,
                startTime: formatTime(session.startTime),
                endTime: formatTime(session.endTime),
                creatorName: `${session.coach.name || ''} ${session.coach.surname || ''}`.trim() || session.coach.username,
                creatorImageUrl: session.coach.avatarUrl || '',
                onClickCreator: () => handleCreatorClick(session.coach.username),
                courseName: session.course?.title,
                onClickCourse: session.course ? () => handleViewCourse(session.course!.slug) : undefined,
            };

            if (session.status === 'requested') {
                return (
                    <CoachingSessionCard
                        key={session.id}
                        {...commonProps}
                        status="requested"
                        onClickCancel={() => handleCancel(session.id)}
                    />
                );
            }

            if (session.status === 'scheduled') {
                if (isJoiningEnabled) {
                    let meetingUrl: string | null = null;
                    if ('meetingUrl' in session) {
                        meetingUrl = session.meetingUrl;
                    }

                    return (
                        <CoachingSessionCard
                            key={session.id}
                            {...commonProps}
                            status="upcoming-locked"
                            onClickJoinMeeting={() => handleJoinMeeting(meetingUrl!)}
                        />
                    );
                } else if (isMeetingLink) {
                    let meetingUrl: string | null = null;
                    if ('meetingUrl' in session) {
                        meetingUrl = session.meetingUrl;
                    }

                    return (
                        <CoachingSessionCard
                            key={session.id}
                            {...commonProps}
                            status="ongoing"
                            meetingLink={meetingUrl || ''}
                            onClickJoinMeeting={() => handleJoinMeeting(meetingUrl!)}
                        />
                    );
                } else {
                    const hoursLeftToEdit = Math.max(0, Math.floor((startDateTime.getTime() - Date.now()) / (1000 * 60 * 60)) - 24);

                    return (
                        <CoachingSessionCard
                            key={session.id}
                            {...commonProps}
                            status="upcoming-editable"
                            hoursLeftToEdit={hoursLeftToEdit}
                            onClickReschedule={() => handleReschedule(session.id, session.coach.username)}
                            onClickCancel={() => handleCancel(session.id)}
                        />
                    );
                }
            }

            if (session.status === 'completed') {
                // For completed sessions (ended tab)
                const hasReview = session.status === 'completed' && session.review;
                if (hasReview) {
                    return (
                        <CoachingSessionCard
                            key={session.id}
                            {...commonProps}
                            status="ended"
                            hasReview={true}
                            reviewText={session.review!.comment || ''}
                            rating={session.review!.rating}
                            onClickDownloadRecording={() => handleDownloadRecording(session.id)}
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
                            onClickReviewCoachingSession={() => handleReviewClick(session.id)}
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
                        <p className="text-2xl font-semibold text-white" >
                            {coachingSessionTranslations('yourCoachingSessions')}
                        </p>
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
            {isReviewModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
                    <ReviewModal
                        locale={locale}
                        modalType="coaching"
                        onClose={handleReviewClose}
                        onSubmit={handleReviewSubmit}
                        onSkip={handleReviewSkip}
                        isLoading={createReviewMutation.isPending}
                        isError={createReviewViewModel?.mode === 'kaboom'}
                        submitted={reviewSubmitted}
                    />
                </div>
            )}
        </div>
    );
}
