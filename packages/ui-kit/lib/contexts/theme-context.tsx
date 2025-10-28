"use client";
import React, { ReactNode, useState, createContext, useContext } from 'react';

type ThemeContextProps = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

type ThemeProviderProps = {
  children: ReactNode;
  defaultTheme?: 'just-do-ad' | 'job-brand-me' | 'bewerbeagentur' | 'cms';
};

const ThemeProvider = ({ children, defaultTheme = "just-do-ad" }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<string>(defaultTheme);

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div className={`theme theme-${theme}`}>{children}</div>
    </ThemeContext.Provider>

  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export default ThemeProvider;
