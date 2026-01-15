'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { RequestCoachingSessionErrorType } from '@dream-aim-deliver/e-class-cms-rest';

/**
 * Mapping from error types to translation keys.
 * Maps the backend RequestCoachingSessionErrorType enum values to the
 * translation keys used in the schedulingErrors namespace.
 */
export const ERROR_TYPE_TO_TRANSLATION_KEY: Record<string, string> = {
  // Authentication errors
  [RequestCoachingSessionErrorType.NOT_AUTHENTICATED]: 'notAuthenticated',
  [RequestCoachingSessionErrorType.NOT_STUDENT]: 'notStudent',

  // Session state errors
  [RequestCoachingSessionErrorType.SESSION_NOT_FOUND]: 'sessionNotFound',
  [RequestCoachingSessionErrorType.SESSION_NOT_UNSCHEDULED]: 'sessionNotUnscheduled',

  // Time/availability errors
  [RequestCoachingSessionErrorType.SESSION_IN_PAST]: 'sessionInPast',
  [RequestCoachingSessionErrorType.INSUFFICIENT_ADVANCE_NOTICE]: 'insufficientAdvanceNotice',
  [RequestCoachingSessionErrorType.COACH_UNAVAILABLE]: 'coachUnavailable',
  [RequestCoachingSessionErrorType.SESSION_OVERLAP]: 'sessionOverlap',

  // Coach errors
  [RequestCoachingSessionErrorType.COACH_NOT_FOUND]: 'coachNotFound',
  [RequestCoachingSessionErrorType.COACH_NOT_ASSIGNED_TO_COURSE]: 'coachNotAssignedToCourse',

  // Lesson component errors
  [RequestCoachingSessionErrorType.CANNOT_LINK_STANDALONE_SESSION]: 'cannotLinkStandaloneSession',
  [RequestCoachingSessionErrorType.LESSON_COMPONENT_NOT_FOUND]: 'lessonComponentNotFound',
  [RequestCoachingSessionErrorType.LESSON_COMPONENT_TYPE_MISMATCH]: 'lessonComponentTypeMismatch',
  [RequestCoachingSessionErrorType.LESSON_COMPONENT_DURATION_MISMATCH]: 'lessonComponentDurationMismatch',

  // Session linking errors
  [RequestCoachingSessionErrorType.STUDENT_MISMATCH]: 'studentMismatch',
  [RequestCoachingSessionErrorType.SESSION_ALREADY_LINKED]: 'sessionAlreadyLinked',

  // Frontend-only validation errors
  'briefing_required': 'briefingRequired',

  // Generic fallback
  [RequestCoachingSessionErrorType.UNKNOWN_ERROR]: 'genericError',
};

/**
 * Mapping from error message patterns to translation keys.
 * Used as fallback when errorType is lost in the http-response-interceptor.
 * @deprecated This is a workaround until cms-rest preserves context.operationDetails
 */
const ERROR_MESSAGE_PATTERNS: Array<{ pattern: RegExp; key: string }> = [
  { pattern: /at least \d+ hours? in advance/i, key: 'insufficientAdvanceNotice' },
  { pattern: /scheduled at least/i, key: 'insufficientAdvanceNotice' },
  { pattern: /not available at the selected time/i, key: 'coachUnavailable' },
  { pattern: /coach is not available/i, key: 'coachUnavailable' },
  { pattern: /already has a session/i, key: 'sessionOverlap' },
  { pattern: /session overlap/i, key: 'sessionOverlap' },
  { pattern: /in the past/i, key: 'sessionInPast' },
  { pattern: /not authenticated/i, key: 'notAuthenticated' },
  { pattern: /not a student/i, key: 'notStudent' },
  { pattern: /session not found/i, key: 'sessionNotFound' },
  { pattern: /coach not found/i, key: 'coachNotFound' },
  { pattern: /not assigned to.*course/i, key: 'coachNotAssignedToCourse' },
];

/**
 * Gets the translation key from an error message by matching patterns.
 * @param message - The error message from the API response
 * @returns The translation key if a pattern matches, undefined otherwise
 */
function getKeyFromMessage(message?: string): string | undefined {
  if (!message) return undefined;
  for (const { pattern, key } of ERROR_MESSAGE_PATTERNS) {
    if (pattern.test(message)) {
      return key;
    }
  }
  return undefined;
}

/**
 * Gets the translation key for a given error type or message.
 * Returns 'genericError' if neither errorType nor message match.
 *
 * @param errorType - The error type from the API response
 * @param message - The error message (fallback when errorType is unavailable)
 * @returns The translation key to use
 */
export function getSchedulingErrorKey(errorType?: string, message?: string): string {
  // First try errorType
  if (errorType && ERROR_TYPE_TO_TRANSLATION_KEY[errorType]) {
    return ERROR_TYPE_TO_TRANSLATION_KEY[errorType];
  }
  // Fallback to message pattern matching
  const keyFromMessage = getKeyFromMessage(message);
  if (keyFromMessage) {
    return keyFromMessage;
  }
  return 'genericError';
}

/**
 * Hook to get internationalized scheduling error messages.
 * This hook provides a function to get user-friendly error title and description
 * based on the error type from the request coaching session API response.
 *
 * @returns Object with getSchedulingErrorMessage function
 */
export function useSchedulingErrors() {
  const t = useTranslations('components.schedulingErrors');

  const getSchedulingErrorMessage = useCallback(
    (errorType?: string, message?: string): { title: string; description: string } => {
      const key = getSchedulingErrorKey(errorType, message);

      return {
        // @ts-expect-error - Dynamic key access for translations
        title: t(`${key}.title`),
        // @ts-expect-error - Dynamic key access for translations
        description: t(`${key}.description`),
      };
    },
    [t]
  );

  return {
    getSchedulingErrorMessage,
    getSchedulingErrorKey,
  };
}
