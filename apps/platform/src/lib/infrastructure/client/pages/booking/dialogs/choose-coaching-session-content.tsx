'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import { trpc } from '../../../trpc/cms-client';
import React, { useMemo, useState } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import {
    AvailableCoachingSessionCard,
    Button,
    CoachingSessionData,
    DefaultError,
    DefaultLoading,
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
        </div>
    );
}