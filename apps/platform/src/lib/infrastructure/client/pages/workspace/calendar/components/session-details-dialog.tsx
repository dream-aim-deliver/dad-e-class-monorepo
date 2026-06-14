'use client';

import {
    Button,
    CancelCoachingSessionModal,
    Dialog,
    DialogBody,
    DialogContent,
    IconCalendar,
    IconCourse,
    IconGroup,
    IconPerson,
    IconStudent,
    IconTrashAlt,
} from '@maany_shr/e-class-ui-kit';
import { useCancelCoachingSession } from '../hooks/use-cancel-coaching-session';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';
import { useState } from 'react';

interface SessionDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    sessionId: number;
    sessionTitle: string;
    startTime: Date;
    endTime: Date;
    studentUsername?: string | null;
    groupName?: string | null;
    courseName?: string | null;
    platformName?: string | null;
    userRole?: 'coach' | 'student';
    coachName?: string | null;
    coachSurname?: string | null;
    coachUsername?: string | null;
    onCancelSuccess: () => void;
}

function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function SessionDetailsDialog({
    isOpen,
    onOpenChange,
    sessionId,
    sessionTitle,
    startTime,
    endTime,
    studentUsername,
    groupName,
    courseName,
    platformName,
    userRole,
    coachName,
    coachSurname,
    coachUsername,
    onCancelSuccess,
}: SessionDetailsDialogProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.calendarPage');
    const [showCancelView, setShowCancelView] = useState(false);

    const timeRange = `${formatTime(startTime)} - ${formatTime(endTime)}`;

    const isSameDay = startTime.toDateString() === endTime.toDateString();
    const dateDisplay = isSameDay
        ? startTime.toLocaleDateString()
        : `${startTime.toLocaleDateString()} - ${endTime.toLocaleDateString()}`;

    const {
        cancelSession,
        isPending,
        isError,
    } = useCancelCoachingSession({
        onSuccess: () => {
            setShowCancelView(false);
            onCancelSuccess();
        },
    });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setShowCancelView(false);
        }
        onOpenChange(open);
    };

    return (
        <Dialog defaultOpen={false} open={isOpen} onOpenChange={handleOpenChange}>
            <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
                {!showCancelView ? (
                    <DialogBody>
                        <div className="flex flex-col gap-4">
                            <h4>{t('sessionDetailsTitle')}</h4>
                            <div className="p-4 flex flex-col gap-3 bg-card-stroke rounded-md border border-divider text-text-primary">
                                <span className="font-medium">{sessionTitle}</span>
                                {userRole === 'student' && (
                                    <div className="flex items-center gap-2 text-text-secondary">
                                        <IconStudent size="4" />
                                        <span className="text-sm">{t('studentRoleLabel')}</span>
                                    </div>
                                )}
                                <div className="flex flex-row gap-2 text-text-secondary">
                                    <IconCalendar />
                                    <span>{t('dateLabel')}</span>
                                </div>
                                <span>{dateDisplay}</span>
                                <div className="flex flex-row gap-2 text-text-secondary">
                                    <IconCalendar />
                                    <span>{t('timeSlotLabel')}</span>
                                </div>
                                <span>{timeRange}</span>
                                {userRole === 'student' && (coachName || coachUsername) && (
                                    <>
                                        <div className="flex flex-row gap-2 text-text-secondary">
                                            <IconPerson />
                                            <span>{t('coachLabel')}</span>
                                        </div>
                                        <span>{coachName && coachSurname ? `${coachName} ${coachSurname}` : coachUsername}</span>
                                    </>
                                )}
                                {userRole !== 'student' && studentUsername && (
                                    <>
                                        <div className="flex flex-row gap-2 text-text-secondary">
                                            <IconPerson />
                                            <span>{t('studentLabel')}</span>
                                        </div>
                                        <span>{studentUsername}</span>
                                    </>
                                )}
                                {groupName && (
                                    <>
                                        <div className="flex flex-row gap-2 text-text-secondary">
                                            <IconGroup />
                                            <span>{t('groupLabel')}</span>
                                        </div>
                                        <span>{groupName}</span>
                                    </>
                                )}
                                {courseName && (
                                    <>
                                        <div className="flex flex-row gap-2 text-text-secondary">
                                            <IconCourse />
                                            <span>{t('courseLabel')}</span>
                                        </div>
                                        <span>{courseName}</span>
                                    </>
                                )}
                                {platformName && (
                                    <>
                                        <div className="flex flex-row gap-2 text-text-secondary">
                                            <IconCourse />
                                            <span>{t('platformLabel')}</span>
                                        </div>
                                        <span>{platformName}</span>
                                    </>
                                )}
                            </div>
                            <Button
                                text={t('cancelSessionButton')}
                                variant="primary"
                                iconLeft={<IconTrashAlt />}
                                hasIconLeft
                                onClick={() => setShowCancelView(true)}
                            />
                        </div>
                    </DialogBody>
                ) : (
                    <DialogBody>
                        <CancelCoachingSessionModal
                            locale={locale}
                            onClose={() => setShowCancelView(false)}
                            onCancel={(reason) => cancelSession(sessionId, reason)}
                            isLoading={isPending}
                            isError={isError}
                        />
                    </DialogBody>
                )}
            </DialogContent>
        </Dialog>
    );
}
