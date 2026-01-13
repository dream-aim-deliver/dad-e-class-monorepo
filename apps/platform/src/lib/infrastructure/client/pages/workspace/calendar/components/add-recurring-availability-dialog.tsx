'use client';

import {
    Button,
    Dialog,
    DialogContent,
    DialogTrigger,
    RadioButton,
    InputField,
} from '@maany_shr/e-class-ui-kit';
import { useAddRecurringAvailability, DayOfWeek, getMaxAvailabilityDate } from '../hooks/use-add-recurring-availability';
import { useTranslations } from 'next-intl';
import DatePicker from '../../../common/date-picker';

interface AddRecurringAvailabilityDialogProps {
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    onSuccess: () => void;
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

export function AddRecurringAvailabilityDialog({
    isOpen,
    onOpenChange,
    onSuccess,
}: AddRecurringAvailabilityDialogProps) {
    const t = useTranslations('pages.calendarPage');
    const {
        dayOfWeek,
        startTime,
        endTime,
        availabilityUntil,
        setDayOfWeek,
        setStartTime,
        setEndTime,
        setAvailabilityUntil,
        error,
        isSubmitting,
        validateAndSubmit,
        reset,
    } = useAddRecurringAvailability({ onSuccess });

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            reset();
        }
        onOpenChange(open);
    };

    const maxDate = getMaxAvailabilityDate();
    const maxDateFormatted = maxDate.toLocaleDateString();

    return (
        <Dialog defaultOpen={false} open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="secondary" text={t('addRecurringAvailabilityButton') || 'Add Recurring'} />
            </DialogTrigger>
            <DialogContent
                showCloseButton
                closeOnOverlayClick
                closeOnEscape
            >
                <div className="flex flex-col gap-6 p-2">
                    <h2 className="text-xl font-bold text-text-primary">
                        {t('addRecurringAvailabilityTitle') || 'Add Recurring Availability'}
                    </h2>

                    {/* Day of Week Selection */}
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-text-primary">
                            {t('selectDayOfWeek') || 'Select Day of Week'}
                        </p>
                        <div className="grid grid-cols-2 gap-2">
                            {daysOfWeek.map((day) => (
                                <RadioButton
                                    key={day}
                                    name="dayOfWeek"
                                    value={day}
                                    label={day}
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
                            {t('timeLabel') || 'Time'}
                        </p>
                        <div className="flex gap-4">
                            <div className="flex-1">
                                <InputField
                                    inputText={t('startTimeLabel') || 'Start (HH:MM)'}
                                    value={startTime}
                                    setValue={setStartTime}
                                />
                            </div>
                            <div className="flex-1">
                                <InputField
                                    inputText={t('endTimeLabel') || 'End (HH:MM)'}
                                    value={endTime}
                                    setValue={setEndTime}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Available Until Date Picker */}
                    <div className="flex flex-col gap-3">
                        <p className="text-sm font-semibold text-text-primary">
                            {t('availableUntilLabel') || 'Available Until'}
                        </p>
                        <p className="text-xs text-text-secondary">
                            {t('maxDateNote') || `Maximum: ${maxDateFormatted} (6 months)`}
                        </p>
                        <DatePicker
                            selectedDate={availabilityUntil}
                            onDateSelect={setAvailabilityUntil}
                        />
                    </div>

                    {/* Error Display */}
                    {error && (
                        <p className="text-sm text-feedback-error-primary">{error}</p>
                    )}

                    {/* Action Buttons */}
                    <div className="flex gap-3 justify-end">
                        <Button
                            variant="secondary"
                            text={t('cancelButton') || 'Cancel'}
                            onClick={() => handleOpenChange(false)}
                            disabled={isSubmitting}
                        />
                        <Button
                            variant="primary"
                            text={isSubmitting
                                ? (t('addingRecurringAvailability') || 'Adding...')
                                : (t('addRecurringAvailabilityButton') || 'Add Recurring')
                            }
                            onClick={validateAndSubmit}
                            disabled={isSubmitting}
                        />
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
}
