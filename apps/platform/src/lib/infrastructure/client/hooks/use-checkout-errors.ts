'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { viewModels } from '@maany_shr/e-class-models';
import { PrepareCheckoutErrorType } from '@dream-aim-deliver/e-class-cms-rest';

/**
 * Mapping from error modes to translation keys
 */
export const ERROR_MODE_TO_KEY: Record<string, string> = {
  'already-owned': 'alreadyOwned',
  'not-found': 'notFound',
  'not-enrolled': 'notEnrolled',
  'already-purchased': 'alreadyPurchased',
  'coupon-not-found': 'couponNotFound',
  'coupon-expired': 'couponExpired',
  'coupon-limit-reached': 'couponLimitReached',
  'invalid-coupon-type': 'invalidCouponType',
  'kaboom': 'genericError',
};

/**
 * Mapping from PrepareCheckoutErrorType enum values to view modes.
 * Uses typed error types from cms-rest for type safety.
 */
const ERROR_TYPE_TO_MODE: Record<PrepareCheckoutErrorType | string, string> = {
  // Already owned/enrolled errors (eligibility)
  [PrepareCheckoutErrorType.ALREADY_ENROLLED_IN_COURSE]: 'already-owned',
  [PrepareCheckoutErrorType.ALREADY_HAS_COACHING_FOR_COURSE]: 'already-owned',
  [PrepareCheckoutErrorType.PACKAGE_ALREADY_PURCHASED]: 'already-owned',
  [PrepareCheckoutErrorType.SELECTED_COURSES_ALREADY_OWNER]: 'already-owned',

  // Already purchased coaching
  [PrepareCheckoutErrorType.PACKAGE_COACHING_ALREADY_PURCHASED]: 'already-purchased',
  [PrepareCheckoutErrorType.ALREADY_HAS_COACHING_FOR_COMPONENT]: 'already-purchased',

  // Not found errors
  [PrepareCheckoutErrorType.COURSE_NOT_FOUND]: 'not-found',
  [PrepareCheckoutErrorType.PACKAGE_NOT_FOUND]: 'not-found',
  [PrepareCheckoutErrorType.COACHING_OFFERING_NOT_FOUND]: 'not-found',
  [PrepareCheckoutErrorType.LESSON_COMPONENT_NOT_FOUND]: 'not-found',

  // Not enrolled error
  [PrepareCheckoutErrorType.NOT_ENROLLED_IN_COURSE]: 'not-enrolled',

  // Coupon errors
  [PrepareCheckoutErrorType.COUPON_NOT_FOUND]: 'coupon-not-found',
  [PrepareCheckoutErrorType.COUPON_EXPIRED]: 'coupon-expired',
  [PrepareCheckoutErrorType.COUPON_LIMIT_REACHED]: 'coupon-limit-reached',
  [PrepareCheckoutErrorType.COUPON_USER_LIMIT_REACHED]: 'coupon-limit-reached',
  [PrepareCheckoutErrorType.INVALID_COUPON_TYPE]: 'invalid-coupon-type',
};

/**
 * Mapping from API error messages to view modes.
 * The API returns error messages in the `message` field of the error response.
 * This maps those messages to the appropriate view mode for displaying user-friendly errors.
 * @deprecated Use ERROR_TYPE_TO_MODE with errorType field instead. Kept for backwards compatibility.
 */
const ERROR_MESSAGE_TO_MODE: Record<string, string> = {
  // Already owned/enrolled errors
  'already_enrolled_in_course': 'already-owned',
  'user_already_enrolled': 'already-owned',
  'selected_courses_already_owned': 'already-owned',
  // Not found errors
  'course_not_found': 'not-found',
  'package_not_found': 'not-found',
  'coaching_offering_not_found': 'not-found',
  'lesson_component_not_found': 'not-found',
  // Not enrolled error
  'not_enrolled_in_course': 'not-enrolled',
  // Already purchased coaching
  'component_coaching_already_purchased': 'already-purchased',
  // Coupon errors
  'coupon_not_found': 'coupon-not-found',
  'coupon_expired': 'coupon-expired',
  'coupon_limit_reached': 'coupon-limit-reached',
  'coupon_user_limit_reached': 'coupon-limit-reached',
  'invalid_coupon_type': 'invalid-coupon-type',
};

/**
 * Maps an API error response to the appropriate view mode.
 * CRITICAL: Checks errorType field FIRST (from PrepareCheckoutErrorType enum),
 * then falls back to message field for backwards compatibility.
 *
 * @param errorData - The error data from the API response (response.data when success is false)
 * @returns The view mode string (e.g., 'already-owned', 'not-found', 'kaboom')
 */
export function getCheckoutErrorMode(errorData: {
  message?: string;
  errorType?: PrepareCheckoutErrorType | string;
}): string {
  // Check errorType first (from backend's PrepareCheckoutErrorType)
  if (errorData.errorType && ERROR_TYPE_TO_MODE[errorData.errorType]) {
    return ERROR_TYPE_TO_MODE[errorData.errorType];
  }

  // Fallback to message-based lookup for backwards compatibility
  if (errorData.message && ERROR_MESSAGE_TO_MODE[errorData.message]) {
    return ERROR_MESSAGE_TO_MODE[errorData.message];
  }

  return 'kaboom';
}

/**
 * Creates a checkout error view model from API error data.
 * This is a utility function to transform API error responses into the view model format
 * expected by the UI components.
 *
 * @param errorData - The error data from the API response
 * @returns A TPrepareCheckoutViewModel with the appropriate error mode
 */
export function createCheckoutErrorViewModel(
  errorData: { message?: string; errorType?: string; operation?: string; context?: unknown }
): viewModels.TPrepareCheckoutViewModel {
  const mode = getCheckoutErrorMode(errorData);
  return {
    mode,
    data: {
      message: errorData.message || '',
      operation: errorData.operation || '',
      context: (errorData.context || {}) as { digest?: string } & { [k: string]: unknown },
    },
  } as viewModels.TPrepareCheckoutViewModel;
}

/**
 * Hook to get internationalized checkout error messages.
 * This hook provides functions to get user-friendly error titles and descriptions
 * based on the error mode from the prepare checkout view model.
 *
 * @returns Object with getCheckoutErrorTitle and getCheckoutErrorDescription functions
 */
export function useCheckoutErrors() {
  const t = useTranslations('components.checkoutErrors');

  const getCheckoutErrorTitle = useCallback(
    (errorMode: string): string => {
      const key = ERROR_MODE_TO_KEY[errorMode] || 'genericError';
      // @ts-expect-error - Dynamic key access for translations
      return t(`${key}.title`);
    },
    [t]
  );

  const getCheckoutErrorDescription = useCallback(
    (errorMode: string): string => {
      const key = ERROR_MODE_TO_KEY[errorMode] || 'genericError';
      // @ts-expect-error - Dynamic key access for translations
      return t(`${key}.description`);
    },
    [t]
  );

  return {
    getCheckoutErrorTitle,
    getCheckoutErrorDescription,
  };
}
