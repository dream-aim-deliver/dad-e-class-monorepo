"use client";
import React, { ReactNode, useState, createContext, useContext, useCallback } from 'react';

type UnsavedChangesContextProps = {
  hasUnsavedChanges: boolean;
  unsavedForms: Set<string>;
  registerUnsavedChanges: (formId: string) => void;
  unregisterUnsavedChanges: (formId: string) => void;
  clearAllUnsavedChanges: () => void;
};

const UnsavedChangesContext = createContext<UnsavedChangesContextProps | undefined>(undefined);

type UnsavedChangesProviderProps = {
  children: ReactNode;
};

const UnsavedChangesProvider = ({ children }: UnsavedChangesProviderProps) => {
  const [unsavedForms, setUnsavedForms] = useState<Set<string>>(new Set());

  const registerUnsavedChanges = useCallback((formId: string) => {
    setUnsavedForms(prev => {
      const next = new Set(prev);
      next.add(formId);
      return next;
    });
  }, []);

  const unregisterUnsavedChanges = useCallback((formId: string) => {
    setUnsavedForms(prev => {
      const next = new Set(prev);
      next.delete(formId);
      return next;
    });
  }, []);

  const clearAllUnsavedChanges = useCallback(() => {
    setUnsavedForms(new Set());
  }, []);

  const hasUnsavedChanges = unsavedForms.size > 0;

  return (
    <UnsavedChangesContext.Provider
      value={{
        hasUnsavedChanges,
        unsavedForms,
        registerUnsavedChanges,
        unregisterUnsavedChanges,
        clearAllUnsavedChanges
      }}
    >
      {children}
    </UnsavedChangesContext.Provider>
  );
};

export const useUnsavedChanges = () => {
  const context = useContext(UnsavedChangesContext);
  if (!context) throw new Error("useUnsavedChanges must be used within an UnsavedChangesProvider");
  return context;
};

export default UnsavedChangesProvider;
