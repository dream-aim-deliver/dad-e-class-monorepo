import { useState } from 'react';
import { trpc } from '../../../../trpc/cms-client';


const MAX_AVAILABILITY_MONTHS = 6

export type DayOfWeek = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday' | 'Sunday';

interface RecurringAvailability {
    dayOfWeek?: DayOfWeek;
    startTime: string; // HH:MM format
    endTime: string;   // HH:MM format
    availabilityUntil?: Date;
}

interface UseAddRecurringAvailabilityProps {
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


// Get max date (6 months from today)
export function getMaxAvailabilityDate(): Date {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + MAX_AVAILABILITY_MONTHS);
    return maxDate;
}

// Generate all recurring slots
function generateSlots(
    dayOfWeek: DayOfWeek,
    startTime: string,
    endTime: string,
    availabilityUntil: Date
): Array<{ startTime: string; endTime: string }> {
    const targetDay = dayMap[dayOfWeek];
    const slots: Array<{ startTime: string; endTime: string }> = [];

    // Start from today at midnight
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let currentDate = new Date(today);
    const todayDay = currentDate.getDay();

    // Calculate days until next occurrence of target day
    let daysUntilTarget = (targetDay - todayDay + 7) % 7;
    if (daysUntilTarget === 0) {
        // If today is the target day, skip to next week
        daysUntilTarget = 7;
    }
    currentDate.setDate(currentDate.getDate() + daysUntilTarget);

    // Set availabilityUntil to end of day for comparison
    const untilDate = new Date(availabilityUntil);
    untilDate.setHours(23, 59, 59, 999);

    // Parse time components
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    // Generate slots until availabilityUntil
    while (currentDate <= untilDate) {
        const slotStart = new Date(currentDate);
        slotStart.setHours(startHour, startMin, 0, 0);

        const slotEnd = new Date(currentDate);
        slotEnd.setHours(endHour, endMin, 0, 0);

        slots.push({
            startTime: slotStart.toISOString(),
            endTime: slotEnd.toISOString()
        });

        // Move to next week
        currentDate.setDate(currentDate.getDate() + 7);
    }

    return slots;
}

export function useAddRecurringAvailability({ onSuccess }: UseAddRecurringAvailabilityProps = {}) {
    const [recurringAvailability, setRecurringAvailability] = useState<RecurringAvailability>({
        dayOfWeek: undefined,
        startTime: '09:00',
        endTime: '17:00',
        availabilityUntil: undefined,
    });
    const [error, setError] = useState<string | undefined>(undefined);

    const utils = trpc.useUtils();

    const addAvailabilityMutation = trpc.addAvailability.useMutation({
        onSuccess: () => {
            utils.getCoachAvailability.invalidate();
        },
    });

    const setDayOfWeek = (day: DayOfWeek) => {
        setRecurringAvailability((prev) => ({ ...prev, dayOfWeek: day }));
    };

    const setStartTime = (time: string) => {
        setRecurringAvailability((prev) => ({ ...prev, startTime: time }));
    };

    const setEndTime = (time: string) => {
        setRecurringAvailability((prev) => ({ ...prev, endTime: time }));
    };

    const setAvailabilityUntil = (date: Date) => {
        setRecurringAvailability((prev) => ({ ...prev, availabilityUntil: date }));
    };

    const reset = () => {
        setRecurringAvailability({
            dayOfWeek: undefined,
            startTime: '09:00',
            endTime: '17:00',
            availabilityUntil: undefined,
        });
        setError(undefined);
    };

    const validateAndSubmit = () => {
        const { dayOfWeek, startTime, endTime, availabilityUntil } = recurringAvailability;

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

        // Validate availability until date
        if (!availabilityUntil) {
            setError('Please select an "Available Until" date.');
            return;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (availabilityUntil <= today) {
            setError('"Available Until" date must be in the future.');
            return;
        }

        const maxDate = getMaxAvailabilityDate();
        if (availabilityUntil > maxDate) {
            setError('"Available Until" date cannot be more than 6 months from today.');
            return;
        }

        // Generate slots
        const slots = generateSlots(dayOfWeek, startTime, endTime, availabilityUntil);

        if (slots.length === 0) {
            setError('No availability slots can be generated. Please select a later "Available Until" date.');
            return;
        }

        setError(undefined);

        addAvailabilityMutation.mutate(
            { slots },
            {
                onSuccess: (result) => {
                    if (result.success) {
                        reset();
                        onSuccess?.();
                    } else {
                        setError('Failed to add recurring availability.');
                    }
                },
                onError: () => {
                    setError('Failed to add recurring availability.');
                },
            },
        );
    };

    return {
        dayOfWeek: recurringAvailability.dayOfWeek,
        startTime: recurringAvailability.startTime,
        endTime: recurringAvailability.endTime,
        availabilityUntil: recurringAvailability.availabilityUntil,
        setDayOfWeek,
        setStartTime,
        setEndTime,
        setAvailabilityUntil,
        error,
        isSubmitting: addAvailabilityMutation.isPending,
        validateAndSubmit,
        reset,
    };
}
