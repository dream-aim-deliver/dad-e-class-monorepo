'use client';

import { useState, useCallback, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { viewModels } from '@maany_shr/e-class-models';
import { TUpcomingStudentCoachingSession } from '@dream-aim-deliver/e-class-cms-rest';
import { TLocale } from '@maany_shr/e-class-translations';
import { Button, CoachingSessionCard, Tabs } from '@maany_shr/e-class-ui-kit';
import { useListUpcomingStudentCoachingSessionsPresenter } from '../../hooks/use-list-upcoming-student-coaching-sessions-presenter';
import { trpc } from '../../trpc/cms-client';
interface UserCoachingSessionsProps {
    studentId: number | undefined;
}

function isUpcomingSession(session: TUpcomingStudentCoachingSession): session is TUpcomingStudentCoachingSession {
    return session.status === 'scheduled';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
export default function UserCoachingSessions(props: UserCoachingSessionsProps) {
    const router = useRouter();
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.studentCoachingSessions');
    const paginationT = useTranslations('components.paginationButton');

    const { studentId } = props;

    if (!studentId) {
        return null;
    }
    const [viewModel, setViewModel] = useState<viewModels.TListUpcomingStudentCoachingSessionsViewModel | null>(null);

    const { presenter } = useListUpcomingStudentCoachingSessionsPresenter(setViewModel);

    const [activeTab, setActiveTab] = useState<string>('upcoming');

    const [upcomingSessionsResponse] = trpc.listUpcomingStudentCoachingSessions.useSuspenseQuery(
        { studentId: studentId },
        {
            retry: false
        }
    );

    useEffect(() => {

        // @ts-ignore
        presenter.present(upcomingSessionsResponse, viewModel);

    }, [upcomingSessionsResponse, presenter, viewModel]);

    const handleViewAllCoachingSessions = useCallback(() => {
        router.push(`/${locale}/workspace/coaching-sessions`);
    }, [router, locale]);

    const handleEndedClick = useCallback(() => {
        // TODO: Navigate to coaching sessions page with ended filter
        handleViewAllCoachingSessions();
    }, [handleViewAllCoachingSessions]);

    const handleAvailableClick = useCallback(() => {
        // TODO: Navigate to coaching sessions page with available filter
        handleViewAllCoachingSessions();
    }, [handleViewAllCoachingSessions]);

    if (!viewModel) {
        return (
            <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-semibold">{t('yourCoachingSessions')}</h2>
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
                    <div className="h-32 bg-gray-200 rounded"></div>
                </div>
            </div>
        );
    }

    if (viewModel.mode === 'kaboom') {
        return (
            <div className="flex flex-col space-y-4">
                <h2 className="text-xl font-semibold">{t('yourCoachingSessions')}</h2>
                <div className="text-red-500">
                    {viewModel.data.message}
                </div>
            </div>
        );
    }

    // Filter only upcoming sessions (scheduled) that have required properties
    const allSessions = viewModel.mode === 'default' ? viewModel.data.sessions : [];
    const upcomingSessions = allSessions.filter(isUpcomingSession);
    const hasUpcomingSessions = upcomingSessions.length > 0;

    return (
        <div className="rounded-lg pb-15">
            <Tabs.Root defaultTab="upcoming" onValueChange={setActiveTab}>
                <div className="w-full flex justify-between items-center md:flex-row flex-col gap-4">
                    <div className="w-full flex gap-4 items-center justify-between">
                        <p className="text-2xl font-semibold text-white">
                            {t('yourCoachingSessions')}
                        </p>
                        <div className="flex items-center gap-4">
                            <Tabs.List className="flex rounded-medium gap-2 w-fit whitespace-nowrap">
                                <Tabs.Trigger value="upcoming" isLast={false}>
                                    {t('upcoming')}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="ended" isLast={false}>
                                    {t('ended')}
                                </Tabs.Trigger>
                                <Tabs.Trigger value="available" isLast={true}>
                                    {t('available')}
                                </Tabs.Trigger>
                            </Tabs.List>
                            <Button
                                variant="text"
                                size="small"
                                onClick={handleViewAllCoachingSessions}
                            >
                                {paginationT('viewAll')}
                            </Button>
                        </div>
                    </div>
                </div>

                <Tabs.Content value="upcoming" className="mt-6">
                    {hasUpcomingSessions ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {upcomingSessions.slice(0, 3).map((session) => {
                                const safeDate = (iso?: string | null) => {
                                    if (!iso) return null;
                                    const d = new Date(iso);
                                    return Number.isNaN(d.getTime()) ? null : d;
                                };

                                const start = safeDate(session.startTime);
                                const end = safeDate(session.endTime);
                                if (!start || !end) return null;

                                const formatTime = (date: Date) => date.toLocaleTimeString(locale, {
                                    hour: '2-digit',
                                    minute: '2-digit',
                                });

                                return (
                                    <CoachingSessionCard
                                        key={session.id}
                                        locale={locale}
                                        userType="student"
                                        status="upcoming-locked"
                                        title={session.coachingOfferingTitle}
                                        duration={session.coachingOfferingDuration}
                                        date={start}
                                        startTime={formatTime(start)}
                                        endTime={formatTime(end)}
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
                                            router.push(`/${locale}/workspace/course/${session.course?.slug || ''}`);
                                        } : undefined}
                                    />
                                );
                            })}
                        </div>
                    ) : (
                        <div className="text-center py-8">
                            <h3 className="text-lg font-medium text-white mb-2">
                                {t('noSessionsFound')}
                            </h3>
                            <p className="text-gray-400 mb-4">
                                {t('noSessionsFound')}
                            </p>
                            <Button
                                variant="primary"
                                onClick={handleViewAllCoachingSessions}
                            >
                                {paginationT('viewAll')}
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
                            {paginationT('viewAll')}
                        </Button>
                    </div>
                </Tabs.Content>

                <Tabs.Content value="available" className="mt-6">
                    <div className="text-center py-8">
                        <Button
                            variant="primary"
                            onClick={handleAvailableClick}
                        >
                            {paginationT('viewAll')}
                        </Button>
                    </div>
                </Tabs.Content>
            </Tabs.Root>
        </div>
    );
}
