"use client";

import { useState, useCallback, useSyncExternalStore } from "react";
import type { ThemeMode } from "@/types/pdf";

const STORAGE_KEY_THEME = "manuale_dnd_theme_v1";

function loadInitialTheme(): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const saved = localStorage.getItem(STORAGE_KEY_THEME) as ThemeMode | null;
    if (
      saved === "system" ||
      saved === "light" ||
      saved === "dark" ||
      saved === "sepia"
    ) {
      return saved;
    }
  } catch {
    // Ignora errori storage
  }
  return "system";
}

function subscribeColorScheme(callback: () => void) {
  if (typeof window === "undefined") return () => {};
  const mq = window.matchMedia("(prefers-color-scheme: dark)");
  mq.addEventListener("change", callback);
  return () => mq.removeEventListener("change", callback);
}

function getColorSchemeSnapshot(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function getColorSchemeServerSnapshot(): boolean {
  return false;
}

const emptySubscribe = () => () => {};

export function useThemeMode() {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const systemDark = useSyncExternalStore(
    subscribeColorScheme,
    getColorSchemeSnapshot,
    getColorSchemeServerSnapshot
  );

  const [themeModeState, setThemeModeState] =
    useState<ThemeMode>(loadInitialTheme);

  const themeMode: ThemeMode = isHydrated ? themeModeState : "system";

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
