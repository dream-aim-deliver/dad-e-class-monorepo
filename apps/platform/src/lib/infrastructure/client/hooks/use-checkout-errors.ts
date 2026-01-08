'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';
import { viewModels } from '@maany_shr/e-class-models';

/**
 * Mapping from error modes to translation keys
 */
const ERROR_MODE_TO_KEY: Record<string, string> = {
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
 * Mapping from API error messages to view modes.
 * The API returns error messages in the `message` field of the error response.
 * This maps those messages to the appropriate view mode for displaying user-friendly errors.
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
 * Uses the `message` field from the error response to determine the mode.
 *
 * @param errorData - The error data from the API response (response.data when success is false)
 * @returns The view mode string (e.g., 'already-owned', 'not-found', 'kaboom')
 */
export function getCheckoutErrorMode(errorData: { message?: string; errorType?: string }): string {
  const message = errorData.message || '';
  return ERROR_MESSAGE_TO_MODE[message] || 'kaboom';
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
