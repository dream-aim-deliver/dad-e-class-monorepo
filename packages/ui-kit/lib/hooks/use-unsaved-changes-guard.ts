import { useState, useCallback, useRef } from 'react';

export type TabValue = string;

export interface UseUnsavedChangesGuardOptions {
  /**
   * Callback to check if the current tab has unsaved changes
   */
  checkHasChanges: (currentTab: TabValue) => boolean;
  
  /**
   * Callback to reset changes for a specific tab
   */
  onDiscardChanges?: (tab: TabValue) => void;
}

export interface UseUnsavedChangesGuardReturn {
  /**
   * Call this before changing tabs
   * Returns true if tab change should proceed, false otherwise
   */
  handleTabChangeRequest: (newTab: TabValue, currentTab: TabValue) => boolean;
  showDialog: boolean;

  cancelChange: () => void;
  
  /**
   * Confirm discarding changes and proceed with tab change
   */
  confirmDiscard: () => void;
  
  /**
   * The tab that's pending change (waiting for user confirmation)
   */
  pendingTab: TabValue | null;
  
  /**
   * The tab that had unsaved changes
   */
  sourceTab: TabValue | null;
}

/**
 * Hook for managing unsaved changes when switching tabs
 * 
 * Features:
 * - Prevents tab changes when there are unsaved changes
 * - Shows confirmation dialog
 * - Handles discard/cancel logic
 * - No exception-based control flow
 * 
 * @example
 * const guard = useUnsavedChangesGuard({
 *   checkHasChanges: (tab) => tab === 'personal' ? personalForm.isDirty : professionalForm.isDirty,
 *   onDiscardChanges: (tab) => {
 *     if (tab === 'personal') personalForm.reset();
 *     else professionalForm.reset();
 *   }
 * });
 * 
 * // In tab change handler
 * const canChange = guard.handleTabChangeRequest(newTab, currentTab);
 * if (!canChange) return;
 * 
 * // In dialog
 * <Dialog open={guard.showDialog}>
 *   <Button onClick={guard.cancelChange}>Cancel</Button>
 *   <Button onClick={guard.confirmDiscard}>Discard</Button>
 * </Dialog>
 */
export function useUnsavedChangesGuard(
  options: UseUnsavedChangesGuardOptions
): UseUnsavedChangesGuardReturn {
  const { checkHasChanges, onDiscardChanges } = options;
  
  const [showDialog, setShowDialog] = useState(false);
  const [pendingTab, setPendingTab] = useState<TabValue | null>(null);
  const [sourceTab, setSourceTab] = useState<TabValue | null>(null);
  
  // Store the resolve function for the pending tab change
  const resolveRef = useRef<((value: boolean) => void) | null>(null);

  const handleTabChangeRequest = useCallback((
    newTab: TabValue,
    currentTab: TabValue
  ): boolean => {
    // Check if current tab has unsaved changes
    const hasChanges = checkHasChanges(currentTab);
    
    if (!hasChanges) {
      return true; // Allow tab change
    }
    
    // Show confirmation dialog
    setPendingTab(newTab);
    setSourceTab(currentTab);
    setShowDialog(true);
    
    return false; // Prevent tab change until user confirms
  }, [checkHasChanges]);

  const cancelChange = useCallback(() => {
    setShowDialog(false);
    setPendingTab(null);
    setSourceTab(null);
  }, []);

  const confirmDiscard = useCallback(() => {
    if (sourceTab && onDiscardChanges) {
      onDiscardChanges(sourceTab);
    }
    
    setShowDialog(false);
    setPendingTab(null);
    setSourceTab(null);
  }, [sourceTab, onDiscardChanges]);

  return {
    handleTabChangeRequest,
    showDialog,
    cancelChange,
    confirmDiscard,
    pendingTab,
    sourceTab,
  };
}
