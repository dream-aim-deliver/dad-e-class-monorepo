"use client";

import { TLocale } from "@maany_shr/e-class-translations";
import { useLocale, useTranslations } from "next-intl";
import { useState, useMemo } from "react";
import { trpc } from "../../trpc/client";
import { viewModels } from "@maany_shr/e-class-models";
import { useListStudentCoachingSessionsPresenter } from "../../hooks/use-list-student-coaching-sessions-presenter";
import { CoachingSessionCard, CoachingSessionList, DefaultError, DefaultLoading, Tabs, Button } from "@maany_shr/e-class-ui-kit";
import useClientSidePagination from "../../utils/use-client-side-pagination";

export default function StudentCoachingSessions() {
    const locale = useLocale() as TLocale;

    const coachingSessionTranslations = useTranslations(
        'pages.studentCoachingSessions',
    );

    const paginationTranslations = useTranslations(
        'components.paginationButton',
    );

    const [activeTab, setActiveTab] = useState<string>('upcoming');

    const [studentCoachingSessionsResponse] = trpc.listStudentCoachingSessions.useSuspenseQuery({});

    const [studentCoachingSessionsViewModel, setStudentCoachingSessionsViewModel] = useState<
        viewModels.TStudentCoachingSessionsListViewModel | undefined
    >(undefined);

    const { presenter } = useListStudentCoachingSessionsPresenter(
        setStudentCoachingSessionsViewModel,
    );

    presenter.present(studentCoachingSessionsResponse, studentCoachingSessionsViewModel);

    // Get all sessions from the view model
    const allSessions = useMemo(() => {
        if (!studentCoachingSessionsViewModel || studentCoachingSessionsViewModel.mode !== 'default') {
            return [];
        }
        return studentCoachingSessionsViewModel.data.sessions;
    }, [studentCoachingSessionsViewModel]);

    // Filter sessions by status for each tab
    const upcomingSessions = useMemo(() => {
        return allSessions.filter(session => session.status === 'scheduled' || session.status === 'requested');
    }, [allSessions]);

    const endedSessions = useMemo(() => {
        return allSessions.filter(session => session.status === 'completed');
    }, [allSessions]);

    const availableSessions = useMemo(() => {
        return allSessions.filter(session => session.status === 'unscheduled');
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

    // Pagination for available sessions
    const {
        displayedItems: displayedAvailableSessions,
        hasMoreItems: hasMoreAvailableSessions,
        handleLoadMore: handleLoadMoreAvailableSessions,
    } = useClientSidePagination({
        items: availableSessions,
    });

    if (!studentCoachingSessionsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (studentCoachingSessionsViewModel.mode !== 'default') {
        return <DefaultError locale={locale} />;
    }

    // Helper to render content based on sessions and pagination state
    const renderSessionContent = (
        sessions: viewModels.TStudentCoachingSessionsListSuccess['sessions'], 
        displayedSessions: viewModels.TStudentCoachingSessionsListSuccess['sessions'], 
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
    const renderSessionCards = (sessions: viewModels.TStudentCoachingSessionsListSuccess['sessions']) => {
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

            // Map based on session status
            if (session.status === 'unscheduled') {
                // For unscheduled sessions (available tab)
                return (
                    <CoachingSessionCard
                        key={session.id}
                        locale={locale}
                        userType="student"
                        status="to-be-defined"
                        title={session.coachingOfferingTitle}
                        duration={session.coachingOfferingDuration}
                    />
                );
            }

            if (session.status === 'requested') {
                // For requested sessions (upcoming tab)
                return (
                    <CoachingSessionCard
                        key={session.id}
                        locale={locale}
                        userType="student"
                        status="requested"
                        title={session.coachingOfferingTitle}
                        duration={session.coachingOfferingDuration}
                        date={new Date(session.startTime)}
                        startTime={formatTime(session.startTime)}
                        endTime={formatTime(session.endTime)}
                        creatorName={`${session.coach.name || ''} ${session.coach.surname || ''}`.trim() || session.coach.username}
                        creatorImageUrl={session.coach.avatarUrl || ''}
                        onClickCreator={() => console.log('Creator clicked:', session.coach.username)}
                        onClickCancel={() => console.log('Cancel clicked for session:', session.id)}
                        courseName={session.course?.title}
                        onClickCourse={session.course ? () => console.log('Course clicked:', session.course!.slug) : undefined}
                    />
                );
            }

            if (session.status === 'scheduled') {
                // For scheduled sessions (upcoming tab)
                return (
                    <CoachingSessionCard
                        key={session.id}
                        locale={locale}
                        userType="student"
                        status="upcoming-locked"
                        title={session.coachingOfferingTitle}
                        duration={session.coachingOfferingDuration}
                        date={new Date(session.startTime)}
                        startTime={formatTime(session.startTime)}
                        endTime={formatTime(session.endTime)}
                        creatorName={`${session.coach.name || ''} ${session.coach.surname || ''}`.trim() || session.coach.username}
                        creatorImageUrl={session.coach.avatarUrl || ''}
                        onClickCreator={() => console.log('Creator clicked:', session.coach.username)}
                        onClickJoinMeeting={() => window.open(session.meetingUrl || '', '_blank')}
                        courseName={session.course?.title}
                        onClickCourse={session.course ? () => console.log('Course clicked:', session.course!.slug) : undefined}
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
                            userType="student"
                            status="ended"
                            hasReview={true}
                            title={session.coachingOfferingTitle}
                            duration={session.coachingOfferingDuration}
                            date={new Date(session.startTime)}
                            startTime={formatTime(session.startTime)}
                            endTime={formatTime(session.endTime)}
                            creatorName={`${session.coach.name || ''} ${session.coach.surname || ''}`.trim() || session.coach.username}
                            creatorImageUrl={session.coach.avatarUrl || ''}
                            onClickCreator={() => console.log('Creator clicked:', session.coach.username)}
                            reviewText={session.review.comment || ''}
                            rating={session.review.rating}
                            onClickDownloadRecording={() => console.log('Download recording for session:', session.id)}
                            isRecordingDownloading={false}
                            courseName={session.course?.title}
                            onClickCourse={session.course ? () => console.log('Course clicked:', session.course!.slug) : undefined}
                        />
                    );
                } else {
                    return (
                        <CoachingSessionCard
                            key={session.id}
                            locale={locale}
                            userType="student"
                            status="ended"
                            hasReview={false}
                            title={session.coachingOfferingTitle}
                            duration={session.coachingOfferingDuration}
                            date={new Date(session.startTime)}
                            startTime={formatTime(session.startTime)}
                            endTime={formatTime(session.endTime)}
                            creatorName={`${session.coach.name || ''} ${session.coach.surname || ''}`.trim() || session.coach.username}
                            creatorImageUrl={session.coach.avatarUrl || ''}
                            onClickCreator={() => console.log('Creator clicked:', session.coach.username)}
                            onClickReviewCoachingSession={() => console.log('Review session:', session.id)}
                            onClickDownloadRecording={() => console.log('Download recording for session:', session.id)}
                            isRecordingDownloading={false}
                            courseName={session.course?.title}
                            onClickCourse={session.course ? () => console.log('Course clicked:', session.course!.slug) : undefined}
                        />
                    );
                }
            }

            return null;
        }).filter(Boolean);
    };

    return (
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
                {renderSessionContent(availableSessions, displayedAvailableSessions, hasMoreAvailableSessions, handleLoadMoreAvailableSessions)}
            </Tabs.Content>
        </Tabs.Root >
    );
}