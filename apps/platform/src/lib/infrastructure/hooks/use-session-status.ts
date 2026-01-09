import { useState, useEffect } from 'react';

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

  // Within 10 minutes of session start = ongoing (show meeting link)
  if (msUntilSession <= 10 * 60 * 1000 && msUntilSession > 0) {
    return {
      status: 'ongoing',
      hoursLeftToEdit: 0,
      minutesLeftToEdit: undefined,
    };
  }
  // Within 24 hours = locked (can't cancel, but can join when ready)
  if (msUntilSession <= 24 * 60 * 60 * 1000 && msUntilSession > 0) {
    return {
      status: 'upcoming-locked',
      hoursLeftToEdit: 0,
      minutesLeftToEdit: undefined,
    };
  }
  // More than 24 hours out = editable
  if (msUntilSession > 24 * 60 * 60 * 1000) {
    // Calculate hours/minutes left to edit (time until 24h lock)
    const msUntilLock = msUntilSession - (24 * 60 * 60 * 1000);
    const totalMinutesLeft = Math.max(0, Math.floor(msUntilLock / (1000 * 60)));
    const hoursLeft = Math.floor(totalMinutesLeft / 60);
    return {
      status: 'upcoming-editable',
      hoursLeftToEdit: hoursLeft,
      minutesLeftToEdit: hoursLeft === 0 ? totalMinutesLeft : undefined,
    };
  }
  // Session has passed or is happening now
  return {
    status: 'upcoming-locked',
    hoursLeftToEdit: 0,
    minutesLeftToEdit: undefined,
  };
}

/**
 * Custom hook to calculate session card status based on time until session start.
 * Returns null initially (for SSR), then calculates on client to avoid hydration mismatch.
 * Updates every minute to keep status current.
 *
 * Status logic:
 * - 'ongoing': Within 10 minutes of session start (show meeting link)
 * - 'upcoming-locked': Within 24 hours of session start (can't cancel)
 * - 'upcoming-editable': More than 24 hours before session (can cancel/reschedule)
 *
 * @param startDateTime - The session's start time
 * @returns SessionStatusResult with status and time remaining info, or null during SSR
 */
export function useSessionStatus(startDateTime: Date): SessionStatusResult | null {
  // Start with null to indicate "not yet calculated" - avoids hydration mismatch
  const [result, setResult] = useState<SessionStatusResult | null>(null);

  useEffect(() => {
    // Calculate immediately on mount
    setResult(calculateSessionStatus(startDateTime));

    // Re-check every minute for dynamic updates
    const interval = setInterval(() => {
      setResult(calculateSessionStatus(startDateTime));
    }, 60000);

    return () => clearInterval(interval);
  }, [startDateTime]);

  return result;
}
