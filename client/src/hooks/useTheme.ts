/* ============================================
   useTheme Hook
   Manages dark/light theme state and persists
   the user's preference.
   ============================================ */

import { useState, useEffect } from "react";

type Theme = "light" | "dark";

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    /*
     * Initialize from saved preference.
     * Falls back to system preference, then dark as default.
     *
     * Note: We use localStorage here ONLY for theme preference,
     * which is non-sensitive data. We will NEVER store tokens
     * or user data in localStorage.
     */
    const saved = localStorage.getItem("theme") as Theme | null;

    if (saved === "light" || saved === "dark") {
      return saved;
    }

    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)"
    ).matches;
    return prefersDark ? "dark" : "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }

  return { theme, toggleTheme };
}
