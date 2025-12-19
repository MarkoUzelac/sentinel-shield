import React, { createContext, useContext, useState, useEffect } from "react";

export type ThemeName = "cyber-dark" | "matrix-green" | "corporate-blue";

interface ThemeContextType {
  theme: ThemeName;
  setTheme: (theme: ThemeName) => void;
  themes: { id: ThemeName; name: string; icon: string }[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const themes = [
  { id: "cyber-dark" as ThemeName, name: "Cyber Dark", icon: "🌙" },
  { id: "matrix-green" as ThemeName, name: "Matrix Green", icon: "💚" },
  { id: "corporate-blue" as ThemeName, name: "Corporate Blue", icon: "💼" },
];

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("sechub-theme") as ThemeName;
      return saved && themes.find(t => t.id === saved) ? saved : "cyber-dark";
    }
    return "cyber-dark";
  });

  const setTheme = (newTheme: ThemeName) => {
    setThemeState(newTheme);
    localStorage.setItem("sechub-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
