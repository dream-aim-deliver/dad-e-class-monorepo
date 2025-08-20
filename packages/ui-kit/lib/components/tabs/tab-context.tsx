"use client";
import React, { createContext, useContext, useState } from 'react';

interface TabContextType {
  activeTab: string;
  setActiveTab: (id: string) => void;
}

const TabContext = createContext<TabContextType | undefined>(undefined);

export function useTabContext() {
  const context = useContext(TabContext);
  if (!context) {
    throw new Error('not found');
  }
  return context;
}

interface TabProviderProps {
  children: React.ReactNode;
  defaultTab: string;
  onValueChange?: (value: string) => void;
}

export function TabProvider({ children, onValueChange, defaultTab }: TabProviderProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  const handleSetActiveTab = (id: string) => {
    if (onValueChange) {
      try {
        onValueChange(id);
      } catch (error) {
        console.warn('Tab change cancelled');
        return;
      }
    }
    setActiveTab(id);
  }

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab: handleSetActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}
