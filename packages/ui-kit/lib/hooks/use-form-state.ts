import { useState, useCallback, useEffect, useMemo } from 'react';

/**
 * Custom hook for managing form state with dirty tracking
 * 
 * Features:
 * - Automatic dirty state tracking
 * - Deep equality comparison
 * - Reset functionality
 * - Type-safe
 * - Browser reload protection (warns before leaving page with unsaved changes)
 * 
 * @example
 * const formState = useFormState(initialData, {
 *   enableReloadProtection: true
 * });
 * 
 * // Update form
 * formState.setValue(newData);
 * 
 * // Check if dirty
 * if (formState.isDirty) { ... }
 * 
 * // Save
 * onSave(formState.value);
 * formState.markAsSaved();
 * 
 * // Discard changes
 * formState.reset();
 */

export interface UseFormStateOptions {
  /**
   * Enable browser reload/close protection
   * Shows browser confirmation dialog when user tries to leave with unsaved changes
   */
  enableReloadProtection?: boolean;
}

// SetState action type - similar to React.SetStateAction
export type SetValueAction<T> = T | null | ((prevState: T | null) => T | null);

export function useFormState<T>(
  initialValue: T | null | undefined,
  options: UseFormStateOptions = {}
) {
  const {
    enableReloadProtection = false
  } = options;
  const [state, setState] = useState<{
    current: T | null;
    original: T | null;
  }>({
    current: initialValue ?? null,
    original: initialValue ?? null,
  });

  // Deep equality check
  const deepEqual = useCallback((obj1: any, obj2: any): boolean => {
    if (obj1 === obj2) return true;
    if (!obj1 || !obj2) return false;
    
    try {
      return JSON.stringify(obj1) === JSON.stringify(obj2);
    } catch {
      return false;
    }
  }, []);

  // Check if current state differs from original
  const isDirty = useMemo(() => {
    return !deepEqual(state.current, state.original);
  }, [state.current, state.original, deepEqual]);

  const setValue = (newValue: SetValueAction<T>) => {
    setState(prev => {
      const nextValue = typeof newValue === 'function'
        ? (newValue as (prevState: T | null) => T | null)(prev.current)
        : newValue;

      return {
        ...prev,
        current: nextValue,
      };
    });
  }

  // Mark current state as saved (makes it the new baseline)
  const markAsSaved = () => {
    setState(prev => ({
      current: prev.current,
      original: prev.current,
    }));
  }

  // Reset to original value
  const reset =() => {
    setState(prev => ({
      ...prev,
      current: prev.original,
    }));
  }

  // Update both current and original when initial value changes from parent
  useEffect(() => {
    if (!deepEqual(state.original, initialValue)) {
      setState({
        current: initialValue ?? null,
        original: initialValue ?? null,
      });
    }
  }, [initialValue, deepEqual, state.original]);

  // Browser reload protection
  useEffect(() => {
    if (!enableReloadProtection) return;

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      if (isDirty) {
        event.preventDefault();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [enableReloadProtection, isDirty]);

  return {
    value: state.current,
    originalValue: state.original,
    isDirty,
    setValue: setValue as (newValue: SetValueAction<T>) => void,
    markAsSaved,
    reset,
  };
}
