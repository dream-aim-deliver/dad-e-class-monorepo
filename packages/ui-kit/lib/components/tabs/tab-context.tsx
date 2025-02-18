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
}

export function TabProvider({ children, defaultTab }: TabProviderProps) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <TabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </TabContext.Provider>
  );
}