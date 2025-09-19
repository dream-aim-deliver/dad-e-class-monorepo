"use client";

import { TLocale } from "@maany_shr/e-class-translations";
import { useLocale, useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { trpc } from "../../trpc/client";
import { viewModels, useCaseModels } from "@maany_shr/e-class-models";
import { useListCoachCoachingSessionsPresenter } from "../../hooks/use-list-coach-coaching-sessions-presenter";
import { CoachingSessionCard, CoachingSessionList, DefaultError, DefaultLoading, Tabs, Button } from "@maany_shr/e-class-ui-kit";
import useClientSidePagination from "../../utils/use-client-side-pagination";

export default function CoachCoachingSessions() {
    const locale = useLocale() as TLocale;

    const [studentCoachingSessionsResponse] = trpc.listCoachCoachingSessions.useSuspenseQuery({});

    const [studentCoachingSessionsViewModel, setStudentCoachingSessionsViewModel] = useState<
        viewModels.TCoachCoachingSessionsViewModel | undefined
    >(undefined);

    const { presenter } = useListCoachCoachingSessionsPresenter(
        setStudentCoachingSessionsViewModel,
    );

    presenter.present(studentCoachingSessionsResponse, studentCoachingSessionsViewModel);

    // Get all sessions from the view model
    const allSessions = useMemo(() => {
        if (!studentCoachingSessionsViewModel || studentCoachingSessionsViewModel.mode !== 'default') {
            return [];
        }
        return (studentCoachingSessionsViewModel.data as useCaseModels.TListCoachCoachingSessionsSuccessResponse['data']).sessions;
    }, [studentCoachingSessionsViewModel]);

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

    if (!studentCoachingSessionsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (studentCoachingSessionsViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    // Helper to render content based on sessions and pagination state
    const renderSessionContent = (
        sessions: useCaseModels.TListCoachCoachingSessionsSuccessResponse['data']['sessions'],
        displayedSessions: useCaseModels.TListCoachCoachingSessionsSuccessResponse['data']['sessions'],
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
                            text={"loadMore"}
                            onClick={handleLoadMore}
                        />
                    </div>
                )}
            </>
        );
    };

    // Helper to render session cards (extracted to avoid duplication)
    const renderSessionCards = (sessions: useCaseModels.TListCoachCoachingSessionsSuccessResponse['data']['sessions']) => {
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
                        date={new Date(session.startTime)}
                        startTime={formatTime(session.startTime)}
                        endTime={formatTime(session.endTime)}
                        studentName={`${session.student.name || ''} ${session.student.surname || ''}`.trim() || session.student.username}
                        studentImageUrl={session.student.avatarUrl || ""}
                        onClickStudent={() => { }}
                        onClickAccept={() => { }}
                        onClickDecline={() => { }}
                        onClickSuggestAnotherDate={() => { }}
                    />
                );
            }

            if (session.status === 'scheduled') {
                // For scheduled sessions (upcoming tab)
                return (
                    <CoachingSessionCard
                        key={session.id}
                        locale={locale}
                        userType="coach"
                        status="upcoming-locked"
                        title={session.coachingOfferingTitle}
                        duration={session.coachingOfferingDuration}
                        date={new Date(session.startTime)}
                        startTime={formatTime(session.startTime)}
                        endTime={formatTime(session.endTime)}
                        studentName={`${session.student.name || ''} ${session.student.surname || ''}`.trim() || session.student.username}
                        studentImageUrl={session.student.avatarUrl || ""}
                        onClickStudent={() => { }}
                        onClickJoinMeeting={() => { }}
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
                            date={new Date(session.startTime)}
                            startTime={formatTime(session.startTime)}
                            endTime={formatTime(session.endTime)}
                            studentName={`${session.student.name || ''} ${session.student.surname || ''}`.trim() || session.student.username}
                            studentImageUrl={session.student.avatarUrl || ""}
                            onClickStudent={() => { }}
                            reviewType="call-quality"
                            callQualityRating={session.review?.rating || 0}
                            onClickDownloadRecording={() => { }}
                            isRecordingDownloading={false}
                        />
                    );
                }
            }

            return null;
        }).filter(Boolean);
    };

    return (
        <Tabs.Root defaultTab="upcoming">
            <div className="w-full flex justify-between items-center md:flex-row flex-col gap-4" >
                <div className="w-full flex gap-4 items-center justify-between" >
                    <p className="text-2xl font-semibold text-white" >
                        yourCoachingSessions
                    </p>
                    <Tabs.List className="flex rounded-medium gap-2 w-fit whitespace-nowrap">
                        <Tabs.Trigger value="upcoming" isLast={false}>
                            upcoming
                        </Tabs.Trigger>
                        <Tabs.Trigger value="ended" isLast={false}>
                            ended
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


        </Tabs.Root >
    );
}