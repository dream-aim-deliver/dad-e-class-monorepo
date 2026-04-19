'use client';

import { getDictionary, TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { trpc } from '../../../trpc/cms-client';
import React, { useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { TStudentCoachingSession } from '@dream-aim-deliver/e-class-cms-rest';
import {
    AvailableCoachingSessionCard,
    Button,
    CoachingSessionData,
    CourseCoachingSessionCard,
    DefaultError,
    DefaultLoading,
    Tooltip,
} from '@maany_shr/e-class-ui-kit';
import { useListAvailableCoachingsPresenter } from '../../../hooks/use-available-coachings-presenter';
import { groupOfferings } from '../../../utils/group-offerings';


interface ChooseCoachingSessionContentProps {
    setSession: React.Dispatch<React.SetStateAction<ScheduledOffering | null>>;
    courseSlug?: string;
    onBuyMoreSessions?: () => void;
}

function CoachingSessionsNotFound({ onBuyMoreSessions }: { onBuyMoreSessions?: () => void }) {
    const locale = useLocale() as TLocale;
    return (
        <div className="flex flex-col gap-3">
            <div className="p-4 bg-card-stroke rounded-md border border-neutral-700 text-text-secondary">
                No available coaching sessions found.
            </div>
            <Button variant="primary" text="Buy more sessions" onClick={onBuyMoreSessions} />
        </div>
    );
}

export default function ChooseCoachingSessionContent({
    setSession,
    courseSlug,
    onBuyMoreSessions,
}: ChooseCoachingSessionContentProps) {
    // courseSlug filters available coaching sessions by course context
    // NOTE: courseSlug support requires backend update in @dream-aim-deliver/e-class-cms-rest
    const [availableCoachingsResponse] =
        trpc.listAvailableCoachings.useSuspenseQuery({ courseSlug } as Parameters<typeof trpc.listAvailableCoachings.useSuspenseQuery>[0], {
            staleTime: 0,
            refetchOnMount: 'always',
        });
    const [availableCoachingsViewModel, setAvailableCoachingsViewModel] =
        useState<viewModels.TAvailableCoachingListViewModel | undefined>(
            undefined,
        );
    const { presenter } = useListAvailableCoachingsPresenter(
        setAvailableCoachingsViewModel,
    );
    // @ts-ignore
    presenter.present(availableCoachingsResponse, availableCoachingsViewModel);

    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.coaching');
    const router = useRouter();
    const dictionary = getDictionary(locale);

    const studentSessionsQuery = trpc.listStudentCoachingSessions.useQuery(
        {},
        { enabled: !courseSlug, staleTime: 0, refetchOnMount: 'always' }
    );

    type CourseUnscheduledSession = Extract<TStudentCoachingSession, { sessionType: 'course-unscheduled' }>;

    const courseCoachingSessions = useMemo(() => {
        if (courseSlug || !studentSessionsQuery.data?.data?.sessions) return [];
        const sessions = studentSessionsQuery.data.data.sessions;
        const courseUnscheduled = sessions.filter(
            (s): s is CourseUnscheduledSession => s.sessionType === 'course-unscheduled' && s.id != null
        );
        return Object.values(
            courseUnscheduled.reduce((acc: Record<string, { courseTitle: string; courseSlug: string; sessionTitle: string; sessionDuration: number; sessionId: number }>, session) => {
                if (session.id == null) return acc;
                if (!acc[session.course.slug]) {
                    acc[session.course.slug] = {
                        courseTitle: session.course.title,
                        courseSlug: session.course.slug,
                        sessionTitle: session.coachingOfferingTitle || '',
                        sessionDuration: session.coachingOfferingDuration || 0,
                        sessionId: typeof session.id === 'string' ? parseInt(session.id, 10) : session.id,
                    };
                }
                return acc;
            }, {})
        );
    }, [courseSlug, studentSessionsQuery.data]);

    const groupedOfferings = useMemo(() => {
        if (!availableCoachingsViewModel) return [];
        return groupOfferings(availableCoachingsViewModel);
    }, [availableCoachingsViewModel]);

    if (!availableCoachingsViewModel) {
        return <DefaultLoading locale={locale} variant="minimal" />;
    }

    if (availableCoachingsViewModel.mode === 'kaboom') {
        return (
            <DefaultError
                type="simple"
                locale={locale}
                title={t('error.title')}
                description={t('error.description')}
            />
        );
    }

    if (
        availableCoachingsViewModel.mode === 'not-found' ||
        availableCoachingsViewModel.mode === 'unauthenticated'
    ) {
        return <CoachingSessionsNotFound onBuyMoreSessions={onBuyMoreSessions} />;
    }

    const availableOfferings = availableCoachingsViewModel.data.offerings;

    if (availableOfferings.length === 0) {
        return <CoachingSessionsNotFound onBuyMoreSessions={onBuyMoreSessions} />;
    }

    const calculateEndTime = (startTime: Date, durationMinutes: number) => {
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + durationMinutes);
        return endTime;
    };

    const onChoose = (offering: CoachingSessionData) => {
        // Find the first matching ID
        const sessionId = availableOfferings.find(
            (o) => o.name === offering.title && o.duration === offering.time,
        )?.id;
        if (!sessionId) return;
        setSession((oldSession) => {
            return {
                session: {
                    id: sessionId,
                    name: offering.title,
                    duration: offering.time,
                },
                startTime: oldSession?.startTime,
                endTime: oldSession?.startTime
                    ? calculateEndTime(oldSession.startTime, offering.time)
                    : undefined,
            };
        });
    };

    return (
        <div className="flex flex-col gap-3">
            {courseCoachingSessions.length > 0 && (
                <div className="flex items-center gap-1">
                    <span className="text-sm text-text-primary font-semibold">
                        {dictionary?.components?.availableCoachingSessions?.standaloneTitle}
                    </span>
                    <Tooltip text="" description={dictionary?.components?.availableCoachingSessions?.standaloneTooltip || ''} />
                </div>
            )}
            <span className="text-text-secondary">
                Select a coaching session
            </span>
            {groupedOfferings.map((offering) => (
                <AvailableCoachingSessionCard
                    key={offering.title}
                    {...offering}
                    numberOfSessions={offering.numberOfSessions}
                    durationMinutes="minutes"
                    onClick={() => onChoose(offering)}
                />
            ))}
            {courseCoachingSessions.length > 0 && (
                <>
                    <div className="flex items-center gap-1 mt-2">
                        <span className="text-sm text-text-primary font-semibold">
                            {dictionary?.components?.availableCoachingSessions?.courseTitle}
                        </span>
                        <Tooltip text="" description={dictionary?.components?.availableCoachingSessions?.courseTooltip || ''} />
                    </div>
                    {courseCoachingSessions.map((session) => (
                        <CourseCoachingSessionCard
                            key={`${session.courseSlug}-${session.sessionId}`}
                            sessionTitle={session.sessionTitle}
                            sessionDuration={session.sessionDuration}
                            courseTitle={session.courseTitle}
                            durationMinutes={dictionary?.components?.availableCoachingSessions?.durationMinutes}
                            onClick={() => {
                                window.open(`/${locale}/courses/${session.courseSlug}?tab=study&highlightSession=${session.sessionId}`, '_blank');
                            }}
                        />
                    ))}
                </>
            )}
        </div>
    );
}