/**
 * Converts video duration from seconds (as stored by the API/Mux) to whole minutes.
 * Returns 0 for null, undefined, NaN, or non-positive values.
 */
export function videoSecondsToMinutes(seconds: number | null | undefined): number {
    if (!seconds || isNaN(seconds) || seconds <= 0) return 0;
    return Math.round(seconds / 60);
}

/**
 * Formats a duration given in minutes into a human-readable string.
 * Uses the provided labels for "hours" and "minutes".
 * - < 60 min → "X MINUTES"
 * - >= 60 min → "X HOURS Y MINUTES" (omits minutes if 0)
 */
export function formatVideoDuration(
    durationInMinutes: number,
    labels: { hours: string; minutes: string },
): string {
    if (durationInMinutes < 60) {
        return `${durationInMinutes} ${labels.minutes}`;
    }
    const hours = Math.floor(durationInMinutes / 60);
    const mins = durationInMinutes % 60;
    let result = `${hours} ${labels.hours}`;
    if (mins > 0) {
        result += ` ${mins} ${labels.minutes}`;
    }
    return result;
}
