import { useState, useEffect } from 'react';

interface TimeThreshold {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

/**
 * Custom hook to check if there's time remaining before a target date/time
 * @param targetDateTime - The future date/time to check against
 * @param timeThreshold - Object specifying hours, minutes, and/or seconds threshold (default: 10 minutes)
 * @returns boolean - true if current time is within the threshold, false otherwise
 *
 * @example
 * // Check if within 30 minutes
 * const hasTimeLeft = useCheckTimeLeft(new Date('2025-01-01T10:00:00'), { minutes: 30 });
 *
 * // Check if within 2 hours and 15 minutes
 * const hasTimeLeft = useCheckTimeLeft(new Date('2025-01-01T10:00:00'), { hours: 2, minutes: 15 });
 *
 * // Check if within 45 seconds
 * const hasTimeLeft = useCheckTimeLeft(new Date('2025-01-01T10:00:00'), { seconds: 45 });
 */
export function useCheckTimeLeft(
  targetDateTime: Date,
  timeThreshold: TimeThreshold = { minutes: 10 }
): boolean {
  // Start with false to avoid hydration mismatch (server and client render same initial value)
  const [isWithinThreshold, setIsWithinThreshold] = useState(false);

  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const timeDiff = targetDateTime.getTime() - now.getTime();

      // Convert time config to milliseconds
      const thresholdInMs =
        ((timeThreshold.hours || 0) * 60 * 60 * 1000) +
        ((timeThreshold.minutes || 0) * 60 * 1000) +
        ((timeThreshold.seconds || 0) * 1000);

      setIsWithinThreshold(timeDiff <= thresholdInMs && timeDiff > 0);
    };

    checkTime();
    // Re-check every minute for dynamic updates
    const interval = setInterval(checkTime, 60000);
    return () => clearInterval(interval);
  }, [targetDateTime, timeThreshold.hours, timeThreshold.minutes, timeThreshold.seconds]);

  return isWithinThreshold;
}
