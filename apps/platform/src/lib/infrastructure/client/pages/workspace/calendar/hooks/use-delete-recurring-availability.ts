import { useState, useMemo } from 'react';
import { trpc } from '../../../../trpc/cms-client';
import { useCaseModels } from '@maany_shr/e-class-models';

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

interface UseDeleteRecurringAvailabilityProps {
    availabilities: useCaseModels.TAvailability[];
    onSuccess?: () => void;
}

// Map day names to JavaScript day numbers (Sunday = 0)
const dayMap: Record<DayOfWeek, number> = {
    'Sunday': 0,
    'Monday': 1,
    'Tuesday': 2,
    'Wednesday': 3,
    'Thursday': 4,
    'Friday': 5,
    'Saturday': 6
};

// Validate time format (HH:MM)
function isValidTimeFormat(time: string): boolean {
    return /^([01]\d|2[0-3]):([0-5]\d)$/.test(time);
}

// Check if end time is after start time
function isEndTimeAfterStartTime(startTime: string, endTime: string): boolean {
    if (!isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) return false;

    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);

    if (endHour > startHour) return true;
    if (endHour === startHour && endMinute > startMinute) return true;
    return false;
}

// Find matching slots based on day of week and time containment
function findMatchingSlots(
    availabilities: useCaseModels.TAvailability[],
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string
): useCaseModels.TAvailability[] {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const targetDay = dayMap[dayOfWeek];

    const [selStartH, selStartM] = startTime.split(':').map(Number);
    const [selEndH, selEndM] = endTime.split(':').map(Number);
    const selStartMinutes = selStartH * 60 + selStartM;
    const selEndMinutes = selEndH * 60 + selEndM;

    return availabilities.filter(slot => {
        const slotStart = new Date(slot.startTime);
        const slotEnd = new Date(slot.endTime);

        // Must be in the future (from today onwards)
        if (slotStart < today) return false;

        // Must be on the correct day of week
        if (slotStart.getDay() !== targetDay) return false;

        // Selected time must be CONTAINED within slot time
        const slotStartMinutes = slotStart.getHours() * 60 + slotStart.getMinutes();
        const slotEndMinutes = slotEnd.getHours() * 60 + slotEnd.getMinutes();

        return slotStartMinutes <= selStartMinutes && slotEndMinutes >= selEndMinutes;
    });
}

export function useDeleteRecurringAvailability({
    availabilities,
    onSuccess
}: UseDeleteRecurringAvailabilityProps) {
    const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek | undefined>(undefined);
    const [startTime, setStartTime] = useState('09:00');
    const [endTime, setEndTime] = useState('17:00');
    const [error, setError] = useState<string | undefined>(undefined);

    const utils = trpc.useUtils();

    const deleteAvailabilityMutation = trpc.deleteAvailability.useMutation({
        onSuccess: () => {
            utils.getCoachAvailability.invalidate();
        },
    });

    // Compute matching slots whenever inputs change
    const matchingSlots = useMemo(() => {
        if (!dayOfWeek || !isValidTimeFormat(startTime) || !isValidTimeFormat(endTime)) {
            return [];
        }
        if (!isEndTimeAfterStartTime(startTime, endTime)) {
            return [];
        }
        return findMatchingSlots(availabilities, dayOfWeek, startTime, endTime);
    }, [availabilities, dayOfWeek, startTime, endTime]);

    const reset = () => {
        setDayOfWeek(undefined);
        setStartTime('09:00');
        setEndTime('17:00');
        setError(undefined);
    };

    const validateAndSubmit = () => {
        // Validate day selection
        if (!dayOfWeek) {
            setError('Please select a day of the week.');
            return;
        }

        // Validate time format
        if (!isValidTimeFormat(startTime)) {
            setError('Invalid start time format. Use HH:MM (e.g., 09:00).');
            return;
        }

        if (!isValidTimeFormat(endTime)) {
            setError('Invalid end time format. Use HH:MM (e.g., 17:00).');
            return;
        }

        // Validate time range
        if (!isEndTimeAfterStartTime(startTime, endTime)) {
            setError('End time must be after start time.');
            return;
        }

        // Check if there are matching slots
        if (matchingSlots.length === 0) {
            setError('No matching slots found.');
            return;
        }

        setError(undefined);

        // Get all IDs of matching slots
        const availabilityIds = matchingSlots.map(slot => slot.id);

        deleteAvailabilityMutation.mutate(
            { availabilityIds },
            {
                onSuccess: (result) => {
                    if (result.success) {
                        reset();
                        onSuccess?.();
                    } else {
                        setError('Failed to delete recurring availability.');
                    }
                },
                onError: () => {
                    setError('Failed to delete recurring availability.');
                },
            },
        );
    };

    return {
        dayOfWeek,
        startTime,
        endTime,
        matchingSlots,
        matchingCount: matchingSlots.length,
        setDayOfWeek,
        setStartTime,
        setEndTime,
        error,
        isSubmitting: deleteAvailabilityMutation.isPending,
        validateAndSubmit,
        reset,
    };
}
