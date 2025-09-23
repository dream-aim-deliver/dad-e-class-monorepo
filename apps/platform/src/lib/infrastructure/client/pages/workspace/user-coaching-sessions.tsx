'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { viewModels, useCaseModels } from '@maany_shr/e-class-models';
import { TLocale } from '@maany_shr/e-class-translations';
import { Button, CoachingSessionCard, Tabs } from '@maany_shr/e-class-ui-kit';

import { trpc } from '../../trpc/client';
import { useListUpcomingCoachingSessionsPresenter } from '../../hooks/use-list-upcoming-coaching-sessions-presenter';

interface UserCoachingSessionsProps {
    emptyStateTranslationsNamespace?: string;
}

// Type guard to check if a session is upcoming/scheduled
function isUpcomingSession(session: useCaseModels.TUpcomingCoachingSession): session is useCaseModels.TUpcomingCoachingSession {
    return session.status === 'scheduled';
}

export default function UserCoachingSessions(props: UserCoachingSessionsProps) {
    const t = useTranslations('pages.userCoursesList');
    const router = useRouter();
    const locale = useLocale() as TLocale;
    const [viewModel, setViewModel] = useState<viewModels.TUpcomingCoachingSessionsListViewModel | null>(null);
    const [activeTab, setActiveTab] = useState<string>('upcoming');

    const { presenter } = useListUpcomingCoachingSessionsPresenter(setViewModel);

    const {
        data: upcomingSessionsResponse,
        isLoading: isUpcomingSessionsLoading,
        error: upcomingSessionsError,
    } = trpc.listUpcomingStudentCoachingSessions.useQuery(
        { studentId: 1 }, // Mock student ID
        {
            retry: false,
        }
    );

    useEffect(() => {
        if (upcomingSessionsResponse) {
            presenter.present(upcomingSessionsResponse, viewModel ?? undefined);
        }
        if (upcomingSessionsError) {
            presenter.present({
                success: false,
                data: {
                    errorType: 'UnknownError' as const,
                    message: upcomingSessionsError.message,
                    operation: 'list-upcoming-coaching-sessions',
                    context: {},
                },
            }, viewModel ?? undefined);
        }
    }, [upcomingSessionsResponse, upcomingSessionsError, presenter, viewModel]);

    const handleViewAllCoachingSessions = useCallback(() => {
        router.push(`/${locale}/workspace/coaching-sessions`);
    }, [router, locale]);

    const handleEndedClick = useCallback(() => {
        // Show alert and redirect to full coaching sessions page
        alert('Redirecting to the coaching sessions page to view ended sessions.');
        handleViewAllCoachingSessions();
    }, [handleViewAllCoachingSessions]);

    const handleAvailableClick = useCallback(() => {
        // Show alert and redirect to full coaching sessions page
        alert('Redirecting to the coaching sessions page to view available sessions.');
        handleViewAllCoachingSessions();
    }, [handleViewAllCoachingSessions]);

    if (isUpcomingSessionsLoading) {
        return (
            <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-semibold">Your Coaching Sessions</h2>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (viewModel?.mode === 'kaboom') {
        return (
            <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-semibold">Your Coaching Sessions</h2>
                <div className="text-red-500">
                    {viewModel.data.message}
                </div>
            </div>
        );
    }

    // Filter only upcoming sessions (scheduled) that have required properties
    const allSessions = viewModel?.mode === 'default' ? viewModel.data.sessions : [];
    const upcomingSessions = allSessions.filter(isUpcomingSession);
    const hasUpcomingSessions = upcomingSessions.length > 0;

    return (
        <div className="rounded-lg p-6">
            <Tabs.Root defaultTab="upcoming" onValueChange={setActiveTab}>
                <div className="w-full flex justify-between items-center md:flex-row flex-col gap-4">
                    <div className="w-full flex gap-4 items-center justify-between">
                        <p className="text-2xl font-semibold text-white">
                            Your Coaching Sessions
                        </p>
                        <div className="flex items-center gap-4">
                            <Tabs.List className="flex rounded-medium gap-2 w-fit whitespace-nowrap">
                                <Tabs.Trigger value="upcoming" isLast={false}>
                                    Upcoming
                                </Tabs.Trigger>
                                <Tabs.Trigger value="ended" isLast={false}>
                                    Ended
                                </Tabs.Trigger>
                                <Tabs.Trigger value="available" isLast={true}>
                                    Available
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Button
                                variant="text"
                                size="small"
                                onClick={handleViewAllCoachingSessions}
                            >
                                View All Sessions
                            </Button>
                        </div>
                    </div>
                </div>

                <Tabs.Content value="upcoming" className="mt-6">
                    {hasUpcomingSessions ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {upcomingSessions.slice(0, 3).map((session) => (
                                <CoachingSessionCard
                                    key={session.id}
                                    locale={locale}
                                    userType="student"
                                    status="upcoming-locked"
                                    title={session.coachingOfferingTitle}
                                    duration={session.coachingOfferingDuration}
                                    date={new Date(session.startTime)}
                                    startTime={new Date(session.startTime).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}
                                    endTime={new Date(session.endTime).toLocaleTimeString('en-US', {
                                        hour: '2-digit',
                                        minute: '2-digit',
                                        hour12: false
                                    })}
                                    creatorName={`${session.coach.name || ''} ${session.coach.surname || ''}`.trim() || session.coach.username}
                                    creatorImageUrl={session.coach.avatarUrl || ''}
                                    courseName={session.course?.title}
                                    onClickCreator={() => {
                                        console.log('View coach profile', session.coach.username);
                                    }}
                                    onClickJoinMeeting={() => {
                                        console.log('Join meeting for session', session.id);
                                        // TODO: Implement meeting join functionality
                                    }}
                                    onClickCourse={session.course ? () => {
                                        router.push(`/${locale}/course/${session.course!.slug}`);
                                    } : undefined}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <h3 className="text-lg font-medium text-white mb-2">
                                No upcoming sessions
                            </h3>
                            <p className="text-gray-400 mb-4">
                                You don't have any upcoming coaching sessions scheduled.
                            </p>
                            <Button
                                variant="primary"
                                onClick={handleViewAllCoachingSessions}
                            >
                                View All Sessions
                            </Button>
                        </div>
                    )}
                </Tabs.Content>

                <Tabs.Content value="ended" className="mt-6">
                    <div className="text-center py-8">
                        <Button
                            variant="primary"
                            onClick={handleEndedClick}
                        >
                            View All Sessions
                        </Button>
                    </div>
                </Tabs.Content>

                <Tabs.Content value="available" className="mt-6">
                    <div className="text-center py-8">
                        <Button
                            variant="primary"
                            onClick={handleAvailableClick}
                        >
                            View All Sessions
                        </Button>
                    </div>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}