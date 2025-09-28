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

interface ScheduledSessionContentProps {
    session: ScheduledOffering | null;
    setSession: React.Dispatch<React.SetStateAction<ScheduledOffering | null>>;
}

export default function ScheduledSessionContent({
    session,
    setSession,
}: ScheduledSessionContentProps) {
    const locale = useLocale() as TLocale;

    if (!session) return null;

    return (
        <div className="flex flex-col gap-3">
            <h2>Schedule</h2>
            {!session.session && (
                <Suspense fallback={<DefaultLoading locale={locale} />}>
                    <ChooseCoachingSessionContent setSession={setSession} />
                </Suspense>
            )}
            {session.session && session.startTime && session.endTime && (
                <ConfirmTimeContent
                    session={session}
                    setSession={setSession}
                    onSubmit={() => {
                        // Handle submit logic here
                    }}
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
