"use client";
import React, { ReactNode, useState, createContext, useContext, useMemo, useEffect } from 'react';

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

  // Memoize context value to prevent unnecessary re-renders of consumers
  const value = useMemo(() => ({ theme, setTheme }), [theme, setTheme]);

  // Keep the body theme classes aligned with the active theme context value.
  useEffect(() => {
    const body = document.body;
    const themeClasses = Array.from(body.classList).filter((className) =>
      className === 'theme' || className.startsWith('theme-')
    );

    if (themeClasses.length > 0) {
      body.classList.remove(...themeClasses);
    }

    body.classList.add('theme', `theme-${theme}`);

    return () => {
      body.classList.remove('theme', `theme-${theme}`);
    };
  }, [theme]);

  return (
    <ThemeContext.Provider value={value}>
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
