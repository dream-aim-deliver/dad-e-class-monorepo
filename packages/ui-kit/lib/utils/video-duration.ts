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
 * Uses the provided labels for singular and plural "hour(s)" and "minute(s)".
 * - < 60 min → "X minute(s)"
 * - >= 60 min → "X hour(s) Y minute(s)" (omits minutes if 0)
 */
export function formatVideoDuration(
    durationInMinutes: number,
    labels: { hour: string; hours: string; minute: string; minutes: string },
): string {
    if (durationInMinutes < 60) {
        return `${durationInMinutes} ${durationInMinutes === 1 ? labels.minute : labels.minutes}`;
    }
    const hours = Math.floor(durationInMinutes / 60);
    const mins = durationInMinutes % 60;
    let result = `${hours} ${hours === 1 ? labels.hour : labels.hours}`;
    if (mins > 0) {
        result += ` ${mins} ${mins === 1 ? labels.minute : labels.minutes}`;
    }
    return result;
}

/**
 * Formats a duration given in minutes into a compact string like "1h 30m" or "45m".
 * - 0 or negative → "0m"
 * - < 60 min → "Xm"
 * - exactly N hours → "Nh"
 * - otherwise → "Nh Mm"
 */
export function formatCompactDuration(durationInMinutes: number): string {
    if (durationInMinutes <= 0) return '0m';
    const hours = Math.floor(durationInMinutes / 60);
    const mins = durationInMinutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
}

/**
 * Computes the total course duration in whole minutes from a duration object
 * where video is in seconds and coaching/selfStudy are in minutes.
 * Keeps full precision through the computation, rounds only at the end.
 */
export function computeTotalDurationMinutes(duration: {
    video?: number | null;
    coaching?: number | null;
    selfStudy?: number | null;
}): number {
    const videoMinutes = (duration.video ?? 0) / 60;
    const totalMinutes = videoMinutes + (duration.coaching ?? 0) + (duration.selfStudy ?? 0);
    return Math.round(totalMinutes);
}
