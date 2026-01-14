'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

/**
 * Availability error types for validation and API errors.
 */
export enum AvailabilityErrorType {
  MISSING_TIMES = 'missing_times',
  INVALID_TIME_RANGE = 'invalid_time_range',
  PAST_TIME = 'past_time',
  GENERIC_ERROR = 'generic_error',
}

/**
 * Mapping from error types to translation keys.
 */
export const ERROR_TYPE_TO_TRANSLATION_KEY: Record<string, string> = {
  [AvailabilityErrorType.MISSING_TIMES]: 'missingTimes',
  [AvailabilityErrorType.INVALID_TIME_RANGE]: 'invalidTimeRange',
  [AvailabilityErrorType.PAST_TIME]: 'pastTime',
  [AvailabilityErrorType.GENERIC_ERROR]: 'genericError',
};

/**
 * Gets the translation key for a given error type.
 * Returns 'genericError' if the error type is not recognized.
 */
export function getAvailabilityErrorKey(errorType?: string): string {
  if (errorType && ERROR_TYPE_TO_TRANSLATION_KEY[errorType]) {
    return ERROR_TYPE_TO_TRANSLATION_KEY[errorType];
  }
  return 'genericError';
}

/**
 * Hook to get internationalized availability error messages.
 */
export function useAvailabilityErrors() {
  const t = useTranslations('components.availabilityErrors');

  const getAvailabilityErrorMessage = useCallback(
    (errorType?: string): { title: string; description: string } => {
      const key = getAvailabilityErrorKey(errorType);

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
    getAvailabilityErrorMessage,
    getAvailabilityErrorKey,
    AvailabilityErrorType,
  };
}
