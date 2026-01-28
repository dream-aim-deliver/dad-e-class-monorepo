'use client';

import { TLocale } from '@maany_shr/e-class-translations';
import { useLocale, useTranslations } from 'next-intl';
import React, { Suspense, useMemo } from 'react';
import { Banner, Button, DefaultLoading, TextAreaInput } from '@maany_shr/e-class-ui-kit';
import ConfirmTimeContent from '../../common/confirm-time-content';
import ChooseCoachingSessionContent from './choose-coaching-session-content';
import { MIN_ADVISED_BOOKING_HOURS } from '../../../config/booking-constants';

interface ScheduledOfferingContentProps {
    offering: ScheduledOffering | null;
    setOffering: React.Dispatch<React.SetStateAction<ScheduledOffering | null>>;
    briefing: string;
    setBriefing: React.Dispatch<React.SetStateAction<string>>;
    onSubmit: () => void;
    isSubmitting?: boolean;
    submitError?: { title: string; description: string };
    bookingSuccess?: boolean;
    returnTo?: string;
    courseSlug?: string;
    onReturnToCourse?: () => void;
    onViewSessions?: () => void;
    closeDialog?: () => void;
    onBuyMoreSessions?: () => void;
}

export default function ScheduledOfferingContent({
    offering: session,
    setOffering: setSession,
    briefing,
    setBriefing,
    onSubmit,
    submitError,
    isSubmitting,
    bookingSuccess,
    returnTo,
    courseSlug,
    onReturnToCourse,
    onViewSessions,
    closeDialog,
    onBuyMoreSessions,
}: ScheduledOfferingContentProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.coaching');

    // Calculate if the selected booking time is within the short-notice threshold
    const isShortNoticeBooking = useMemo(() => {
        if (!session?.startTime || MIN_ADVISED_BOOKING_HOURS <= 0) return false;
        const now = new Date();
        const hoursUntilSession = (session.startTime.getTime() - now.getTime()) / (1000 * 60 * 60);
        return hoursUntilSession < MIN_ADVISED_BOOKING_HOURS;
    }, [session?.startTime]);

    if (!session) return null;

    // Show success state after booking
    if (bookingSuccess) {
        return (
            <div className="flex flex-col gap-4">
                <h2 className="text-xl font-bold text-text-primary">Booking Request Sent!</h2>
                <p className="text-text-secondary">
                    Your coaching session request has been sent successfully. The coach will review and confirm your request.
                </p>
                <div className="flex flex-col gap-2">
                    {returnTo && (
                        <Button
                            variant="primary"
                            text="← Back to Course"
                            onClick={onReturnToCourse}
                        />
                    )}
                    <Button
                        variant={returnTo ? "secondary" : "primary"}
                        text="View All Sessions"
                        onClick={onViewSessions}
                    />
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            <h2>Schedule</h2>
            {session.session && (
                <div className="bg-card-stroke rounded-md border border-neutral-700 p-4">
                    <span className="text-text-secondary">Session: </span>
                    <span className="font-bold text-text-primary">
                        {session.session.name} ({session.session.duration}{' '}
                        minutes)
                    </span>
                </div>
            )}
            {!session.session && (
                <Suspense fallback={<DefaultLoading locale={locale} />}>
                    <ChooseCoachingSessionContent setSession={setSession} courseSlug={courseSlug} onBuyMoreSessions={onBuyMoreSessions} />
                </Suspense>
            )}
            {session.session && (
                <div className="flex flex-col gap-3">
                    <h3 className="text-lg font-semibold text-text-primary">
                        {t('briefingTitle')}
                    </h3>
                    <p className="text-text-secondary text-sm">
                        {t('briefingDescription')}
                    </p>
                    <ul className="list-disc list-inside text-text-secondary text-sm space-y-1">
                        <li>{t('briefingMotivation')}</li>
                        <li>{t('briefingSkills')}</li>
                        <li>{t('briefingOutcome')}</li>
                    </ul>
                    <TextAreaInput
                        className="min-h-[104px]"
                        placeholder={t('briefingPlaceholder')}
                        value={briefing}
                        setValue={setBriefing}
                    />
                </div>
            )}
            {session.session && session.startTime && session.endTime && isShortNoticeBooking && (
                <Banner
                    style="warning"
                    icon={true}
                    title={t('shortNoticeWarning.title')}
                    description={t('shortNoticeWarning.description', { hours: MIN_ADVISED_BOOKING_HOURS })}
                />
            )}
            {session.session && session.startTime && session.endTime && (
                <ConfirmTimeContent
                    startTime={session.startTime}
                    endTime={session.endTime}
                    setStartTime={(date: Date) =>
                        setSession((prev) =>
                            prev ? { ...prev, startTime: date } : prev,
                        )
                    }
                    setEndTime={(date: Date) =>
                        setSession((prev) =>
                            prev ? { ...prev, endTime: date } : prev,
                        )
                    }
                    duration={session.session.duration}
                    isSubmitting={isSubmitting}
                    onSubmit={onSubmit}
                    buttonText={
                        isSubmitting ? 'Sending request...' : 'Send request'
                    }
                    submitError={submitError}
                />
            )}
            <Button
                className="w-full"
                variant="secondary"
                onClick={closeDialog}
            >
                Cancel
            </Button>
        </div>
    );
}
