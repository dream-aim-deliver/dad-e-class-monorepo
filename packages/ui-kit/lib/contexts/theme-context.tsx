"use client";
import React, { ReactNode, useState, createContext, useContext } from "react";

type ThemeContextProps = {
  theme: string;
  setTheme: React.Dispatch<React.SetStateAction<string>>;
};

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const themeConfigurations = {
  "just-do-add": {
    backgroundImage: "url('/theme/just-do-add.jpg')",
  },
  "Job-rand-me": {
    backgroundImage: "url('/theme/job-rand.jpg')",
  },
  "Bewerbeagenture": {
    backgroundImage: "url('/theme/bewerbeagenture.jpg')",
  },
  "Cms": {
    backgroundImage: "url('/theme/cms.jpg')",
  },
};

const defaultTheme = "Bewerbeagenture";

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  
  const [theme, setTheme] = useState<string>(defaultTheme);

  const currentThemeConfig = themeConfigurations[theme as keyof typeof themeConfigurations] || themeConfigurations[defaultTheme];

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      <div
        className={`theme theme-${theme}`}
        style={{
          backgroundImage: "https://res.cloudinary.com/dyve1c6cb/image/upload/v1731928044/Rectangle_3_oqzlev.png",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error("useTheme must be used within a ThemeProvider");
  return context;
};

export default ThemeProvider;
