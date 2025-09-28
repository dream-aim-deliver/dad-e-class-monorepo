'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale } from 'next-intl';
import React, { Suspense } from 'react';
import {
    Button,
    DefaultLoading,
} from '@maany_shr/e-class-ui-kit';
import ConfirmTimeContent from './confirm-time-content';
import ChooseCoachingSessionContent from './choose-coaching-session-content';

interface ScheduledOfferingContentProps {
    offering: ScheduledOffering | null;
    setOffering: React.Dispatch<React.SetStateAction<ScheduledOffering | null>>;
    onSubmit: () => void;
}

export default function ScheduledOfferingContent({
    offering: session,
    setOffering: setSession,
    onSubmit,
}: ScheduledOfferingContentProps) {
    const locale = useLocale() as TLocale;

    if (!session) return null;

    return (
        <div className="flex flex-col gap-3">
            <h2>Schedule</h2>
            {session.session && <div className="bg-card-stroke rounded-md border border-neutral-700 p-4">
                <span className="text-text-secondary">Session: </span>
                <span className="font-bold text-text-primary">{session.session.name} ({session.session.duration} minutes)</span>
            </div>}
            {!session.session && (
                <Suspense fallback={<DefaultLoading locale={locale} />}>
                    <ChooseCoachingSessionContent setSession={setSession} />
                </Suspense>
            )}
            {session.session && session.startTime && session.endTime && (
                <ConfirmTimeContent
                    session={session}
                    setSession={setSession}
                    onSubmit={onSubmit}
                />
            )}
            <Button
                className="w-full"
                variant="secondary"
                onClick={() => setSession(null)}
            >
                Cancel
            </Button>
        </div>
    );
}
