"use client";

import { useState, useEffect, useCallback } from "react";
import type { ThemeMode } from "@/types/pdf";

const STORAGE_KEY_THEME = "manuale_dnd_theme_v1";

export function useThemeMode() {
  const [themeMode, setThemeModeState] = useState<ThemeMode>("system");
  const [systemDark, setSystemDark] = useState<boolean>(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode | null;
      if (
        saved === "system" ||
        saved === "light" ||
        saved === "dark" ||
        saved === "sepia"
      ) {
        setThemeModeState(saved);
      }
    } catch {
      // Ignora errori storage
    }

    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemDark(mq.matches);

    const listener = (e: MediaQueryListEvent) => setSystemDark(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    try {
      localStorage.setItem(STORAGE_KEY_THEME, mode);
    } catch {
      // Ignora errori
    }
  }, []);

  const resolvedTheme: "light" | "dark" | "sepia" =
    themeMode === "system" ? (systemDark ? "dark" : "light") : themeMode;

  return {
    themeMode,
    setThemeMode,
    resolvedTheme,
  };
}
