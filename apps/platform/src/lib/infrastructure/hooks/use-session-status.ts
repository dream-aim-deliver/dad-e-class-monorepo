import { useCallback, useSyncExternalStore } from 'react';

export type SessionCardStatus = 'upcoming-editable' | 'upcoming-locked' | 'ongoing';

export interface SessionStatusResult {
  status: SessionCardStatus;
  hoursLeftToEdit: number;
  minutesLeftToEdit: number | undefined;
}

/**
 * Calculate session status based on time until session start.
 * Extracted as a pure function so it can be used for both initial state and updates.
 */
function calculateSessionStatus(startDateTime: Date): SessionStatusResult {
  const now = new Date();
  const msUntilSession = startDateTime.getTime() - now.getTime();
  const tenMinutesMs = 10 * 60 * 1000;

  // Within 10 minutes of session start (or past) = ongoing (show meeting link)
  if (msUntilSession <= tenMinutesMs) {
    return {
      status: 'ongoing',
      hoursLeftToEdit: 0,
      minutesLeftToEdit: undefined,
    };
  }
  // More than 10 minutes out = editable (can cancel/reschedule)
  const msUntilLock = msUntilSession - tenMinutesMs;
  const totalMinutesLeft = Math.max(0, Math.floor(msUntilLock / (1000 * 60)));
  const hoursLeft = Math.floor(totalMinutesLeft / 60);
  return {
    status: 'upcoming-editable',
    hoursLeftToEdit: hoursLeft,
    minutesLeftToEdit: hoursLeft === 0 ? totalMinutesLeft : undefined,
  };
}

/**
 * Custom hook to calculate session card status based on time until session start.
 * Returns null during SSR, then calculates on client to avoid hydration mismatch.
 * Updates every minute to keep status current.
 *
 * Status logic:
 * - 'ongoing': Within 10 minutes of session start or past (show meeting link)
 * - 'upcoming-editable': More than 10 minutes before session (can cancel/reschedule)
 *
 * @param startDateTime - The session's start time
 * @returns SessionStatusResult with status and time remaining info, or null during SSR
 */
export function useSessionStatus(startDateTime: Date): SessionStatusResult | null {
  const subscribe = useCallback((onStoreChange: () => void) => {
    const interval = setInterval(onStoreChange, 60000);
    return () => clearInterval(interval);
  }, []);

  const getSnapshot = useCallback(
    () => calculateSessionStatus(startDateTime),
    [startDateTime]
  );

  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
