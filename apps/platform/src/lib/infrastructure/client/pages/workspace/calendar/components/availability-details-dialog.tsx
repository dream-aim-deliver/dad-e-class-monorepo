'use client';

import {
    Button,
    DefaultError,
    Dialog,
    DialogContent,
    IconCalendar,
    IconTrashAlt,
} from '@maany_shr/e-class-ui-kit';
import { useCaseModels } from '@maany_shr/e-class-models';
import { useDeleteAvailability } from '../hooks/use-delete-availability';
import { useLocale, useTranslations } from 'next-intl';
import { TLocale } from '@maany_shr/e-class-translations';

interface AvailabilityDetailsDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    availability: useCaseModels.TAvailability;
    onDeleteSuccess: () => void;
}

// TODO: possibly decompose and reuse
function formatTime(date: Date) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function AvailabilityDetailsDialog({
    isOpen,
    onOpenChange,
    availability,
    onDeleteSuccess,
}: AvailabilityDetailsDialogProps) {
    const locale = useLocale() as TLocale;
    const t = useTranslations('pages.calendarPage');

    const startDate = new Date(availability.startTime);
    const endDate = new Date(availability.endTime);

    const timeRange = `${formatTime(startDate)} - ${formatTime(endDate)}`;

    const isSameDay = startDate.toDateString() === endDate.toDateString();
    const dateDisplay = isSameDay
        ? startDate.toLocaleDateString()
        : `${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`;

    const {
        error: deleteError,
        deleteAvailability,
        isPending: isDeletionPending,
    } = useDeleteAvailability({
        onSuccess: onDeleteSuccess,
    });

    return (
        <Dialog defaultOpen={false} open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent showCloseButton closeOnOverlayClick closeOnEscape>
                <div className="flex flex-col gap-4">
                    <h4>{t('availabilityDetailsTitle')}</h4>
                    <div className="p-4 flex flex-col gap-3 bg-card-stroke rounded-md border border-divider text-text-primary">
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
                    </div>
                    <Button
                        text={
                            isDeletionPending
                                ? t('cancelingSlot')
                                : t('cancelSlotButton')
                        }
                        variant="primary"
                        iconLeft={<IconTrashAlt />}
                        hasIconLeft
                        onClick={() => {
                            deleteAvailability(availability.id);
                        }}
                        disabled={isDeletionPending}
                    />
                    {deleteError && (
                        <DefaultError
                            type="simple"
                            locale={locale}
                            title={t('error.title')}
                            description={deleteError}
                        />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
