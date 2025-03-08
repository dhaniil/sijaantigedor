"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark" | "system";

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: Theme;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: Theme;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: Theme) => void;
  themes: Theme[];
};

const initialState: ThemeProviderState = {
  theme: "system",
  resolvedTheme: "light",
  setTheme: () => null,
  themes: ["light", "dark", "system"],
};

const ThemeContext = createContext<ThemeProviderState>(initialState);

export function ThemeProvider({
  children,
  defaultTheme = "system",
  storageKey = "sija-theme-preference",
  ...props
}: ThemeProviderProps) {
  // Safe initialization for localStorage
  const [theme, setThemeState] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && localStorage) {
      try {
        const storedTheme = localStorage.getItem(storageKey) as Theme;
        return storedTheme || defaultTheme;
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        return defaultTheme;
      }
    }
    return defaultTheme;
  });
  
  const [resolvedTheme, setResolvedTheme] = useState<"light" | "dark">("light");

  // Function to check system preference
  const getSystemTheme = (): "light" | "dark" => {
    if (typeof window === "undefined") return "light";
    try {
      return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch (error) {
      console.error("Error checking system theme:", error);
      return "light";
    }
  };

  useEffect(() => {
    try {
      const root = window.document.documentElement;

      // Remove previous theme classes
      root.classList.remove("light", "dark");

      // Apply new theme class
      if (theme === "system") {
        const systemTheme = getSystemTheme();
        root.classList.add(systemTheme);
        setResolvedTheme(systemTheme);
      } else {
        root.classList.add(theme);
        setResolvedTheme(theme);
      }

      // Save to localStorage
      if (localStorage) {
        localStorage.setItem(storageKey, theme);
      }
    } catch (error) {
      console.error("Error applying theme:", error);
    }
  }, [theme, storageKey]);

  // Listen for system theme changes
  useEffect(() => {
    try {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      
      const handleChange = () => {
        if (theme === "system") {
          const newSystemTheme = getSystemTheme();
          const root = window.document.documentElement;
          
          root.classList.remove("light", "dark");
          root.classList.add(newSystemTheme);
          setResolvedTheme(newSystemTheme);
        }
      };

      // Initial check
      handleChange();

      // Use the appropriate event listener method
      if (mediaQuery.addEventListener) {
        mediaQuery.addEventListener("change", handleChange);
        return () => mediaQuery.removeEventListener("change", handleChange);
      } else {
        // Fallback for older browsers
        mediaQuery.addListener(handleChange);
        return () => mediaQuery.removeListener(handleChange);
      }
    } catch (error) {
      console.error("Error setting up system theme listener:", error);
      return () => {};
    }
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const value = {
    theme,
    resolvedTheme,
    setTheme,
    themes: ["light", "dark", "system"] as Theme[],
  };

  return (
    <ThemeContext.Provider value={value} {...props}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  
  return context;
};
