'use client';

import { useEffect, useCallback } from 'react';
import { useUnsavedChanges } from '../contexts/unsaved-changes-context';

export interface UseFormDirtyTrackingOptions {
  /**
   * Unique identifier for this form
   */
  formId: string;

  /**
   * Whether the form currently has unsaved changes
   */
  isDirty: boolean;
}

/**
 * Hook for tracking form dirty state in the global unsaved changes context
 *
 * Automatically registers/unregisters the form based on its dirty state
 *
 * @example
 * const form = useForm();
 * useFormDirtyTracking({
 *   formId: 'user-profile-form',
 *   isDirty: form.formState.isDirty
 * });
 */
export function useFormDirtyTracking({ formId, isDirty }: UseFormDirtyTrackingOptions) {
  const { registerUnsavedChanges, unregisterUnsavedChanges } = useUnsavedChanges();

  useEffect(() => {
    if (isDirty) {
      registerUnsavedChanges(formId);
    } else {
      unregisterUnsavedChanges(formId);
    }

    // Clean up on unmount
    return () => {
      unregisterUnsavedChanges(formId);
    };
  }, [formId, isDirty, registerUnsavedChanges, unregisterUnsavedChanges]);

  // Return a manual registration function if needed
  const markDirty = useCallback(() => {
    registerUnsavedChanges(formId);
  }, [formId, registerUnsavedChanges]);

  const markClean = useCallback(() => {
    unregisterUnsavedChanges(formId);
  }, [formId, unregisterUnsavedChanges]);

  return { markDirty, markClean };
}
