'use client';

import {
    Button,
    Dialog,
    DialogContent,
    DialogTrigger,
    RadioButton,
    InputField,
} from '@maany_shr/e-class-ui-kit';
import { useDeleteRecurringAvailability, DayOfWeek } from '../hooks/use-delete-recurring-availability';
import { useTranslations } from 'next-intl';
import { useCaseModels } from '@maany_shr/e-class-models';

interface DeleteRecurringAvailabilityDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
    availabilities: useCaseModels.TAvailability[];
}

const daysOfWeek: DayOfWeek[] = [
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
    'Sunday',
];

// Maps DayOfWeek to translation keys
const dayTranslationKeys: Record<DayOfWeek, string> = {
    'Monday': 'dayMonday',
    'Tuesday': 'dayTuesday',
    'Wednesday': 'dayWednesday',
    'Thursday': 'dayThursday',
    'Friday': 'dayFriday',
    'Saturday': 'daySaturday',
    'Sunday': 'daySunday',
};

export function DeleteRecurringAvailabilityDialog({
    isOpen,
    onOpenChange,
    onSuccess,
    availabilities,
}: DeleteRecurringAvailabilityDialogProps) {
    const t = useTranslations('pages.calendarPage');
    const {
        dayOfWeek,
        startTime,
        endTime,
        matchingCount,
        setDayOfWeek,
        setStartTime,
        setEndTime,
        error,
        isSubmitting,
        validateAndSubmit,
        reset,
    } = useDeleteRecurringAvailability({ availabilities, onSuccess });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            reset();
        }
        onOpenChange(open);
    };

    return (
        <Dialog defaultOpen={false} open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="secondary" text={t('deleteRecurringAvailabilityButton')} />
            </DialogTrigger>
            <DialogContent
                showCloseButton
                closeOnOverlayClick
                closeOnEscape
            >
                <div className="flex flex-col gap-6 p-2">
                    <h2 className="text-xl font-bold text-text-primary">
                        {t('deleteRecurringAvailabilityTitle')}
                    </h2>

                    {/* Day of Week Selection */}
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-text-primary">
                            {t('selectDayOfWeek')}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {daysOfWeek.map((day) => (
                                <RadioButton
                                    key={day}
                                    name="dayOfWeekDelete"
                                    value={day}
                                    label={t(dayTranslationKeys[day])}
                                    checked={dayOfWeek === day}
                                    onChange={(value) => setDayOfWeek(value as DayOfWeek)}
                                    withText
                                    size="small"
                                    labelClass="text-sm text-text-primary"
                                />
                            ))}
                        </div>
                    </div>

                    {/* Time Selection */}
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-text-primary">
                            {t('timeRangeToMatchLabel')}
                        </p>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <InputField
                                    inputText={t('startTimeLabel')}
                                    value={startTime}
                                    setValue={setStartTime}
                                />
                            </div>
                            <div className="flex-1">
                                <InputField
                                    inputText={t('endTimeLabel')}
                                    value={endTime}
                                    setValue={setEndTime}
                                />
                            </div>
                        </div>
                        {/* Helper text explaining the matching behavior */}
                        <p className="text-xs text-text-secondary">
                            {t('deleteRecurringHelperText')}
                        </p>
                    </div>

                    {/* Preview of how many slots will be deleted */}
                    <div className="p-3 rounded-md bg-card-stroke border border-divider">
                        {matchingCount > 0 ? (
                            <p className="text-sm text-feedback-warning-primary font-medium">
                                ⚠️ {t('slotsWillBeDeleted', { count: matchingCount })}
                            </p>
                        ) : (
                            <p className="text-sm text-text-secondary">
                                {t('noMatchingSlotsFound')}
                            </p>
                        )}
                    </div>

                    {/* Error Display */}
                    {error && (
                        <p className="text-sm text-feedback-error-primary">{error}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="secondary"
                            text={t('cancelButton')}
                            onClick={() => handleOpenChange(false)}
                            disabled={isSubmitting}
                        />
                        <Button
                            variant="primary"
                            text={isSubmitting
                                ? t('deletingSlots')
                                : t('deleteNSlots', { count: matchingCount })
                            }
                            onClick={validateAndSubmit}
                            disabled={isSubmitting || matchingCount === 0}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
