"use client";

import { TLocale } from "@maany_shr/e-class-translations";
import { useLocale, useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { trpc } from "../../trpc/client";
import { viewModels } from "@maany_shr/e-class-models";
import { useListStudentCoachingSessionsPresenter } from "../../hooks/use-list-student-coaching-sessions-presenter";
import { useListCoachesPresenter } from "../../hooks/use-coaches-presenter";
import { CoachingSessionCard, CoachingSessionList, DefaultError, DefaultLoading, Tabs, Button, CoachCard, CardListLayout, DefaultNotFound, Breadcrumbs, AvailableCoachingSessions } from "@maany_shr/e-class-ui-kit";
import useClientSidePagination from "../../utils/use-client-side-pagination";
import { useRouter } from "next/navigation";

export default function StudentCoachingSessions() {
    const locale = useLocale() as TLocale;

    const breadcrumbsTranslations = useTranslations('components.breadcrumbs');
    const coachingSessionTranslations = useTranslations(
        'pages.studentCoachingSessions',
    );

    const paginationTranslations = useTranslations(
        'components.paginationButton',
    );

    const [activeTab, setActiveTab] = useState<string>('upcoming');
    const router = useRouter();

    const [studentCoachingSessionsResponse] = trpc.listStudentCoachingSessions.useSuspenseQuery({});

    const [studentCoachingSessionsViewModel, setStudentCoachingSessionsViewModel] = useState<
        viewModels.TStudentCoachingSessionsListViewModel | undefined
    >(undefined);

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

    // Helper to compute UI status based on domain status and time logic
    const computeUIStatus = (session: ScheduledSession) => {
        switch (session.status) {
            case 'requested':
                return 'requested' as const;

            case 'completed':
                return 'completed' as const;

            case 'scheduled': {
                const now = new Date();
                const sessionStart = new Date(session.startTime);
                const sessionEnd = new Date(session.endTime);
                const hoursUntilStart = (sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60);

                // If session is currently happening (between start and end time)
                if (now >= sessionStart && now <= sessionEnd) {
                    return 'ongoing' as const;
                }

                // If session starts in more than 24 hours, allow editing
                if (hoursUntilStart > 24) {
                    return 'upcoming-editable' as const;
                }

                // If session starts in 24 hours or less, lock from editing
                if (hoursUntilStart > 0) {
                    return 'upcoming-locked' as const;
                }

                // If session is in the past but status is still 'scheduled', treat as ongoing
                // This handles edge cases where session status hasn't been updated to completed
                return 'ongoing' as const;
            }
        }
    };

    // Filter sessions by status for each tab (using computed UI status)
    const upcomingSessions = useMemo(() => {
        return scheduledSessions.filter(session => {
            const uiStatus = computeUIStatus(session);
            return uiStatus === 'requested' ||
                uiStatus === 'ongoing' ||
                uiStatus === 'upcoming-editable' ||
                uiStatus === 'upcoming-locked';
        });
    }, [scheduledSessions]);

    const endedSessions = useMemo(() => {
        return scheduledSessions.filter(session => {
            const uiStatus = computeUIStatus(session);
            return uiStatus === 'completed';
        });
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
                        text="These are the sessions you purchased and were't included in a course. You can use them at any time with any coach."
                        availableCoachingSessionsData={availableCoachingSessionsData}
                        onClickBuyMoreSessions={() => {
                            // TODO: Implement buy more sessions functionality
                            console.log('Buy more sessions clicked');
                        }}
                        hideButton={availableCoachingSessionsData.length === 0}
                    />
                </div>

                {/* Right side - Available Coaches */}
                <div className="lg:w-3/4">
                    {availableCoaches.length === 0 ? (
                        <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                            <p className="text-text-primary text-md">
                                No coaches found
                            </p>
                        </div>
                    ) : (
                        <>
                            <div className="flex items-center gap-4 mb-4">
                                <h3 className="text-lg font-semibold text-white">
                                    Your past coaches
                                </h3>
                                <Button
                                    variant="text"
                                    text="View all coaches"
                                    onClick={() => router.push('/coaches')}
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
                                        onClickViewProfile={() => {
                                            router.push(`/coaches/${coach.username}`);
                                        }}
                                        onClickCourse={(courseSlug: string) => {
                                            router.push(`/courses/${courseSlug}`);
                                        }}
                                        onClickBookSession={() => {
                                            // TODO: Implement booking session navigation
                                            console.log('Book session with coach:', coach.username);
                                        }}
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
                        No sessions found
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

            // Get computed UI status
            const uiStatus = computeUIStatus(session);

            // Common properties for all session cards (excluding key)
            const commonProps = {
                locale,
                userType: 'student' as const,
                title: session.coachingOfferingTitle,
                duration: session.coachingOfferingDuration,
                date: new Date(session.startTime),
                startTime: formatTime(session.startTime),
                endTime: formatTime(session.endTime),
                creatorName: `${session.coach.name || ''} ${session.coach.surname || ''}`.trim() || session.coach.username,
                creatorImageUrl: session.coach.avatarUrl || '',
                onClickCreator: () => console.log('Creator clicked:', session.coach.username),
                courseName: session.course?.title,
                onClickCourse: session.course ? () => console.log('Course clicked:', session.course!.slug) : undefined,
            };

            // Render based on computed UI status
            if (uiStatus === 'requested') {
                return (
                    <CoachingSessionCard
                        key={session.id}
                        {...commonProps}
                        status="requested"
                        onClickCancel={() => console.log('Cancel clicked for session:', session.id)}
                    />
                );
            }

            if (uiStatus === 'ongoing') {
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
                        onClickJoinMeeting={() => {
                            if (meetingUrl) {
                                window.open(meetingUrl, '_blank');
                            }
                        }}
                    />
                );
            }

            if (uiStatus === 'upcoming-editable') {
                const now = new Date();
                const sessionStart = new Date(session.startTime);
                const hoursLeftToEdit = Math.max(0, Math.floor((sessionStart.getTime() - now.getTime()) / (1000 * 60 * 60)) - 24);

                return (
                    <CoachingSessionCard
                        key={session.id}
                        {...commonProps}
                        status="upcoming-editable"
                        hoursLeftToEdit={hoursLeftToEdit}
                        onClickReschedule={() => console.log('Reschedule clicked for session:', session.id)}
                        onClickCancel={() => console.log('Cancel clicked for session:', session.id)}
                    />
                );
            }

            if (uiStatus === 'upcoming-locked') {
                let meetingUrl: string | null = null;
                if ('meetingUrl' in session) {
                    meetingUrl = session.meetingUrl;
                }

                return (
                    <CoachingSessionCard
                        key={session.id}
                        {...commonProps}
                        status="upcoming-locked"
                        onClickJoinMeeting={() => {
                            if (meetingUrl) {
                                window.open(meetingUrl, '_blank');
                            }
                        }}
                    />
                );
            }

            if (uiStatus === 'completed') {
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
                            onClickDownloadRecording={() => console.log('Download recording for session:', session.id)}
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
                            onClickReviewCoachingSession={() => console.log('Review session:', session.id)}
                            onClickDownloadRecording={() => console.log('Download recording for session:', session.id)}
                            isRecordingDownloading={false}
                        />
                    );
                }
            }

            // Catch-all case for unhandled UI statuses
            return null;
        }).filter(Boolean);
    };

    return (
        <div className="flex flex-col space-y-2">
            <Breadcrumbs
                items={[
                    {
                        label: breadcrumbsTranslations('home'),
                        onClick: () => router.push('/'),
                    },
                    {
                        label: breadcrumbsTranslations('workspace'),
                        onClick: () => {
                            // TODO: Implement navigation to workspace
                        },
                    },
                    {
                        label: breadcrumbsTranslations('coachingSessions'),
                        onClick: () => {
                            // Nothing should happen on clicking the current page
                        },
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
        </div>
    );
}
