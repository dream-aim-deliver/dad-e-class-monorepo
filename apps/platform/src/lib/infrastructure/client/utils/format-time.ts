/**
 * Formats an ISO date string to 12-hour time format (e.g., "2:30 PM")
 * Uses local time methods to convert UTC to user's timezone
 */
export function formatTime(isoString: string): string {
    const date = new Date(isoString);
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    const paddedMinutes = minutes.toString().padStart(2, '0');
    return `${displayHours}:${paddedMinutes} ${period}`;
}
