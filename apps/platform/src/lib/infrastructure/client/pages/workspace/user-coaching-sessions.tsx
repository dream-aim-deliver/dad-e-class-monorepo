'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { viewModels } from '@maany_shr/e-class-models';
import { TUpcomingStudentCoachingSession } from '@dream-aim-deliver/e-class-cms-rest';
import { TLocale } from '@maany_shr/e-class-translations';
import { Button, CoachingSessionCard, AvailableCoachingSessions } from '@maany_shr/e-class-ui-kit';
import { useListUpcomingStudentCoachingSessionsPresenter } from '../../hooks/use-list-upcoming-student-coaching-sessions-presenter';
import { useListStudentCoachingSessionsPresenter } from '../../hooks/use-list-student-coaching-sessions-presenter';
import { trpc } from '../../trpc/cms-client';

interface UserCoachingSessionsProps {
    studentUsername: string | undefined | null;
}

function isUpcomingSession(session: TUpcomingStudentCoachingSession): session is TUpcomingStudentCoachingSession {
    return session.status === 'scheduled';
}


export default function UserCoachingSessions(props: UserCoachingSessionsProps) {
    const router = useRouter();
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.studentCoachingSessions');
    const paginationT = useTranslations('components.paginationButton');

    const { studentUsername } = props;

    const [viewModel, setViewModel] = useState<viewModels.TListUpcomingStudentCoachingSessionsViewModel | null>(null);
    const { presenter } = useListUpcomingStudentCoachingSessionsPresenter(setViewModel);

    const [studentCoachingSessionsViewModel, setStudentCoachingSessionsViewModel] = useState<
        viewModels.TStudentCoachingSessionsListViewModel | undefined
    >(undefined);
    const { presenter: allSessionsPresenter } = useListStudentCoachingSessionsPresenter(setStudentCoachingSessionsViewModel);

    const [upcomingSessionsResponse] = trpc.listUpcomingStudentCoachingSessions.useSuspenseQuery({
        studentUsername: studentUsername || ''
    });

    const [studentCoachingSessionsResponse] = trpc.listStudentCoachingSessions.useSuspenseQuery({});

    useEffect(() => {
        // @ts-ignore
        presenter.present(upcomingSessionsResponse, viewModel);
    }, [upcomingSessionsResponse, presenter]);

    useEffect(() => {
        if (studentCoachingSessionsResponse) {
            // @ts-ignore
            allSessionsPresenter.present(studentCoachingSessionsResponse, studentCoachingSessionsViewModel);
        }
    }, [studentCoachingSessionsResponse, allSessionsPresenter]);

    // Filter unscheduled sessions and group by offering title+duration
    const availableCoachingSessionsData = useMemo(() => {
        if (!studentCoachingSessionsViewModel || studentCoachingSessionsViewModel.mode !== 'default' || !studentCoachingSessionsViewModel.data) {
            return [];
        }
        const allSessions = studentCoachingSessionsViewModel.data.sessions || [];
        const unscheduledSessions = allSessions.filter(session => session.status === 'unscheduled');

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
    }, [studentCoachingSessionsViewModel]);

    const handleViewAllCoachingSessions = useCallback(() => {
        router.push(`/${locale}/workspace/coaching-sessions`);
    }, [router, locale]);

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
            <div className="w-full flex justify-between items-center md:flex-row flex-col gap-4">
                <p className="text-2xl font-semibold text-white">
                    {t('yourCoachingSessions')}
                </p>
                <Button
                    variant="text"
                    size="small"
                    onClick={handleViewAllCoachingSessions}
                >
                    {paginationT('viewAll')}
                </Button>
            </div>

            <div className="mt-6">
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
                                    }}
                                    onClickCourse={session.course ? () => {
                                        router.push(`/${locale}/courses/${session.course?.slug || ''}`);
                                    } : undefined}
                                />
                            );
                        })}
                    </div>
                ) : (
                    <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                        <p className="text-text-primary text-md">
                            {t('noSessionsFound')}
                        </p>
                    </div>
                )}
            </div>

            {availableCoachingSessionsData.length > 0 && (
                <div className="mt-10">
                    <p className="text-2xl font-semibold text-white mb-6">
                        {t('availableCoachingSessions')}
                    </p>
                    <AvailableCoachingSessions
                        locale={locale}
                        availableCoachingSessionsData={availableCoachingSessionsData}
                        onClickBuyMoreSessions={() => {
                            router.push(`/${locale}/coaching`);
                        }}
                        hideButton={availableCoachingSessionsData.length === 0}
                    />
                </div>
            )}
        </div>
    );
}
