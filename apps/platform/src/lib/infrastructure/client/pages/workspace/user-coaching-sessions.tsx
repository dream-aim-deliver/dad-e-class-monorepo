'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { viewModels } from '@maany_shr/e-class-models';
import { TUpcomingStudentCoachingSession, TListCoachCoachingSessionsSuccessResponse } from '@dream-aim-deliver/e-class-cms-rest';
import { TLocale, getDictionary } from '@maany_shr/e-class-translations';
import { Button, CoachingSessionCard, AvailableCoachingSessions, ConfirmationModal, CancelCoachingSessionModal } from '@maany_shr/e-class-ui-kit';
import { useListUpcomingStudentCoachingSessionsPresenter } from '../../hooks/use-list-upcoming-student-coaching-sessions-presenter';
import { useListStudentCoachingSessionsPresenter } from '../../hooks/use-list-student-coaching-sessions-presenter';
import { useListCoachCoachingSessionsPresenter } from '../../hooks/use-list-coach-coaching-sessions-presenter';
import { useScheduleCoachingSessionPresenter } from '../../hooks/use-schedule-coaching-session-presenter';
import { useUnscheduleCoachingSessionPresenter } from '../../hooks/use-unschedule-coaching-session-presenter';
import { trpc } from '../../trpc/cms-client';
import { formatTime } from '../../utils/format-time';

interface UserCoachingSessionsProps {
    studentUsername: string | undefined | null;
    isCoach?: boolean;
}

function isUpcomingSession(session: TUpcomingStudentCoachingSession): session is TUpcomingStudentCoachingSession {
    return session.status === 'scheduled';
}

// --- Coach session types and type guards (same as coach-coaching-sessions.tsx) ---

type TCoachSession = TListCoachCoachingSessionsSuccessResponse['data']['sessions'][number];
type TScheduledCoachSession = Extract<TCoachSession, { sessionType: 'individual-scheduled' | 'group-scheduled' }>;

function isGroupCoachSession(session: TCoachSession): session is Extract<TCoachSession, { sessionType: `group-${string}` }> {
    return session.sessionType.startsWith('group-');
}

function isScheduledCoachSession(session: TCoachSession): session is TScheduledCoachSession {
    return session.sessionType === 'individual-scheduled' || session.sessionType === 'group-scheduled';
}

function isGroupScheduledCoachSession(session: TScheduledCoachSession): session is Extract<TScheduledCoachSession, { sessionType: 'group-scheduled' }> {
    return session.sessionType === 'group-scheduled';
}

// --- Scheduled coach session card with time-based status (same pattern as coach-coaching-sessions.tsx) ---

interface ScheduledCoachSessionCardProps {
    session: TScheduledCoachSession;
    locale: TLocale;
    onStudentClick: () => void;
    onGroupClick: () => void;
    onJoinMeeting: () => void;
    onCancel: () => void;
}

function ScheduledCoachSessionCard({
    session,
    locale,
    onStudentClick,
    onGroupClick,
    onJoinMeeting,
    onCancel,
}: ScheduledCoachSessionCardProps) {
    const startDateTime = new Date(session.startTime);
    const isGroup = isGroupScheduledCoachSession(session);

    const [status, setStatus] = useState<{
        cardStatus: 'upcoming-editable' | 'upcoming-locked' | 'ongoing';
        hoursLeftToEdit: number;
        minutesLeftToEdit: number | undefined;
    } | null>(null);

    useEffect(() => {
        const calculateStatus = () => {
            const now = new Date();
            const msUntilSession = startDateTime.getTime() - now.getTime();

            if (msUntilSession <= 10 * 60 * 1000) {
                setStatus({ cardStatus: 'ongoing', hoursLeftToEdit: 0, minutesLeftToEdit: undefined });
            } else if (msUntilSession <= 24 * 60 * 60 * 1000) {
                setStatus({ cardStatus: 'upcoming-locked', hoursLeftToEdit: 0, minutesLeftToEdit: undefined });
            } else {
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
    }, [session.startTime]);

    if (!status) return null;

    const { cardStatus, hoursLeftToEdit, minutesLeftToEdit } = status;

    const sessionTypeProps = isGroup
        ? {
            sessionType: 'group' as const,
            groupName: session.group.name,
            onClickGroup: onGroupClick,
        }
        : {
            sessionType: 'student' as const,
            studentName: session.student.username,
            studentImageUrl: session.student.avatarUrl || "",
            onClickStudent: onStudentClick,
        };

    const commonProps = {
        locale,
        userType: "coach" as const,
        title: session.coachingOfferingTitle,
        duration: session.coachingOfferingDuration,
        date: startDateTime,
        startTime: formatTime(session.startTime),
        endTime: formatTime(session.endTime),
        ...sessionTypeProps,
    };

    if (cardStatus === 'ongoing') {
        return (
            <CoachingSessionCard
                {...commonProps}
                status="ongoing"
                meetingLink={session.meetingUrl || undefined}
                onClickJoinMeeting={onJoinMeeting}
            />
        );
    }

    if (cardStatus === 'upcoming-locked') {
        return (
            <CoachingSessionCard
                {...commonProps}
                status="upcoming-locked"
                meetingLink={session.meetingUrl || undefined}
                onClickJoinMeeting={onJoinMeeting}
            />
        );
    }

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

// --- Main component ---

export default function UserCoachingSessions(props: UserCoachingSessionsProps) {
    const router = useRouter();
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.studentCoachingSessions');
    const coachT = useTranslations('pages.coachCoachingSessions');
    const paginationT = useTranslations('components.paginationButton');

    const { studentUsername, isCoach } = props;
    const utils = trpc.useUtils();

    // --- Student sessions state & queries ---

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

    // --- Coach sessions state & queries (conditional) ---

    const [coachViewModel, setCoachViewModel] = useState<
        viewModels.TListCoachCoachingSessionsViewModel | undefined
    >(undefined);
    const { presenter: coachPresenter } = useListCoachCoachingSessionsPresenter(setCoachViewModel);

    const [coachSessionsResponse] = isCoach
        ? trpc.listCoachCoachingSessions.useSuspenseQuery({})
        : [null];

    useEffect(() => {
        if (coachSessionsResponse && coachPresenter) {
            // @ts-ignore
            coachPresenter.present(coachSessionsResponse, coachViewModel);
        }
    }, [coachSessionsResponse, coachPresenter]);

    // Schedule/unschedule mutations for coach accept/decline
    const scheduleMutation = trpc.scheduleCoachingSession.useMutation();
    const unscheduleMutation = trpc.unscheduleCoachingSession.useMutation();

    const [scheduleViewModel, setScheduleViewModel] = useState<
        viewModels.TScheduleCoachingSessionViewModel | undefined
    >(undefined);
    const [unscheduleViewModel, setUnscheduleViewModel] = useState<
        viewModels.TUnscheduleCoachingSessionViewModel | undefined
    >(undefined);

    const { presenter: schedulePresenter } = useScheduleCoachingSessionPresenter(setScheduleViewModel);
    const { presenter: unschedulePresenter } = useUnscheduleCoachingSessionPresenter(setUnscheduleViewModel);

    // Accept/decline modal state
    const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);
    const [acceptSessionId, setAcceptSessionId] = useState<number | null>(null);
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

    const invalidateCoachQueries = () => {
        utils.getCoachAvailability.invalidate();
        utils.listCoachCoachingSessions.invalidate();
        utils.listStudentCoachingSessions.invalidate();
        utils.listAvailableCoachings.invalidate();
        utils.listUpcomingStudentCoachingSessions.invalidate();
    };

    const handleConfirmAccept = async () => {
        if (!acceptSessionId) return;

        const result = await scheduleMutation.mutateAsync({ coachingSessionId: acceptSessionId });
        // @ts-ignore
        schedulePresenter.present(result, scheduleViewModel);

        if (!result.success) return;

        invalidateCoachQueries();
        setIsAcceptModalOpen(false);
        setAcceptSessionId(null);
        setScheduleViewModel(undefined);
    };

    const handleDecline = async (sessionId: number | string, declineReason: string) => {
        const numericId = typeof sessionId === 'string' ? parseInt(sessionId, 10) : sessionId;

        const response = await unscheduleMutation.mutateAsync({
            coachingSessionId: numericId,
            declineReason,
        });
        // @ts-ignore
        unschedulePresenter.present(response, unscheduleViewModel);

        if (!response.success) return;

        invalidateCoachQueries();
        setIsDeclineModalOpen(false);
        setDeclineSessionId(null);
    };

    // Filter upcoming coach sessions (scheduled + requested)
    const upcomingCoachSessions = useMemo(() => {
        if (!coachViewModel || coachViewModel.mode !== 'default' || !coachViewModel.data) {
            return [];
        }
        const sessions = coachViewModel.data.sessions || [];
        return sessions.filter(
            (session: TCoachSession) => session.status === 'scheduled' || session.status === 'requested'
        );
    }, [coachViewModel]);

    // Navigation helpers
    const handleStudentClick = (studentUsername: string) => {
        window.open(`/${locale}/students/${studentUsername}`, '_blank');
    };

    const handleGroupClick = (courseSlug: string, groupId: number) => {
        window.open(`/${locale}/workspace/courses/${courseSlug}/groups/${groupId}`, '_blank');
    };

    const handleJoinMeeting = (meetingUrl: string | null | undefined) => {
        if (meetingUrl) {
            window.open(meetingUrl, '_blank');
        }
    };

    // --- Existing student session logic ---

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
    const hasCoachSessions = upcomingCoachSessions.length > 0;

    // --- Render coach session cards ---
    const renderCoachSessionCards = () => {
        return upcomingCoachSessions.slice(0, 3).map((session) => {
            const startDateTime = new Date(session.startTime);
            const isGroup = isGroupCoachSession(session);

            const sessionTypeProps = isGroup
                ? {
                    sessionType: 'group' as const,
                    groupName: session.group.name,
                    onClickGroup: () => handleGroupClick(session.course.slug, session.group.id),
                }
                : {
                    sessionType: 'student' as const,
                    studentName: session.student.username,
                    studentImageUrl: session.student.avatarUrl || "",
                    onClickStudent: () => handleStudentClick(session.student.username),
                };

            if (session.status === 'requested') {
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
                        {...sessionTypeProps}
                        onClickAccept={() => handleAcceptClick(parseInt(`${session.id}`))}
                        onClickDecline={() => handleDeclineClick(parseInt(`${session.id}`))}
                    />
                );
            }

            if (isScheduledCoachSession(session)) {
                const isGroupScheduled = isGroupScheduledCoachSession(session);
                return (
                    <ScheduledCoachSessionCard
                        key={session.id}
                        session={session}
                        locale={locale}
                        onStudentClick={() => !isGroupScheduled && handleStudentClick(session.student.username)}
                        onGroupClick={() => isGroupScheduled && handleGroupClick(session.course.slug, session.group.id)}
                        onJoinMeeting={() => handleJoinMeeting(session.meetingUrl)}
                        onCancel={() => handleDeclineClick(parseInt(`${session.id}`))}
                    />
                );
            }

            return null;
        });
    };

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

            {/* Coach sessions section (as coach) */}
            {isCoach && hasCoachSessions && (
                <div className="mt-6">
                    <p className="text-sm text-text-secondary mb-2">{t('asCoach')}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {renderCoachSessionCards()}
                    </div>
                </div>
            )}

            {/* Student sessions section (as student) */}
            <div className="mt-6">
                {hasUpcomingSessions ? (
                    <>
                    {isCoach && <p className="text-sm text-text-secondary mb-2">{t('asStudent')}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {upcomingSessions.slice(0, 3).map((session) => {
                            const safeDate = (iso?: string | null) => {
                                if (!iso) return null;
                                const d = new Date(iso);
                                return Number.isNaN(d.getTime()) ? null : d;
                            };

                            const start = safeDate(session.startTime);
                            const end = safeDate(session.endTime);
                            if (!start || !end) return null;

                            const fmtTime = (date: Date) => date.toLocaleTimeString(locale, {
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
                                    startTime={fmtTime(start)}
                                    endTime={fmtTime(end)}
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
                    </>
                ) : !hasCoachSessions ? (
                    <div className="flex flex-col md:p-5 p-3 gap-2 rounded-medium border border-card-stroke bg-card-fill w-full lg:min-w-[22rem]">
                        <p className="text-text-primary text-md">
                            {t('noSessionsFound')}
                        </p>
                    </div>
                ) : null}
            </div>

            {availableCoachingSessionsData.length > 0 && (
                <div className="mt-10">
                    <p className="text-2xl font-semibold text-white mb-6">
                        {t('availableCoachingSessions')}
                    </p>
                    <AvailableCoachingSessions
                        locale={locale}
                        availableCoachingSessionsData={availableCoachingSessionsData}
                        buttonText={getDictionary(locale)?.components?.availableCoachingSessions?.exploreOurCoaches}
                        onClickBuyMoreSessions={() => {
                            router.push(`/${locale}/coaching`);
                        }}
                        hideButton={availableCoachingSessionsData.length === 0}
                    />
                </div>
            )}

            {/* Coach accept/decline modals */}
            {isCoach && (
                <>
                    {isAcceptModalOpen && (
                        <ConfirmationModal
                            type="accept"
                            isOpen={true}
                            onClose={() => {
                                setIsAcceptModalOpen(false);
                                setAcceptSessionId(null);
                            }}
                            onConfirm={handleConfirmAccept}
                            title={coachT('confirmAcceptance')}
                            message={coachT('confirmAcceptanceMessage')}
                            confirmText={coachT('accept')}
                            isLoading={scheduleMutation.isPending}
                            viewModel={scheduleViewModel}
                            locale={locale}
                        />
                    )}

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
