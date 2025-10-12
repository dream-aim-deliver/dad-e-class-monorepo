/**
 * Splits a time period that spans multiple days into separate daily segments.
 * Each segment starts at the beginning of the period or midnight, and ends at
 * the end of the period or 23:59:59.999 of that day.
 */
export function splitTimeRangeByDays<T>(
    startTime: string,
    endTime: string,
    original: T,
): {
    startTime: string;
    endTime: string;
    original: T;
}[] {
    const start = new Date(startTime);
    const end = new Date(endTime);

    // Check if time range spans multiple days
    const startDay = new Date(
        start.getFullYear(),
        start.getMonth(),
        start.getDate(),
    );
    const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());

    if (startDay.getTime() === endDay.getTime()) {
        // Same day, no split needed
        return [
            {
                startTime,
                endTime,
                original,
            },
        ];
    }

    // Split into multiple days
    const segments: {
        startTime: string;
        endTime: string;
        original: T;
    }[] = [];
    const currentDate = new Date(start);

    while (currentDate <= end) {
        const dayStart = new Date(currentDate);
        const dayEnd = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            23,
            59,
            59,
            999,
        );

        const segmentStart =
            currentDate.getTime() === start.getTime() ? start : dayStart;
        const segmentEnd = dayEnd > end ? end : dayEnd;

        segments.push({
            startTime: segmentStart.toISOString(),
            endTime: segmentEnd.toISOString(),
            original,
        });

        // Move to next day
        currentDate.setDate(currentDate.getDate() + 1);
        currentDate.setHours(0, 0, 0, 0);
    }

    return segments;
}