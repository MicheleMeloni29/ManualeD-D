"use client";

import { useState, useCallback, useMemo, useSyncExternalStore } from "react";
import type { ThemeMode } from "@/types/pdf";

const STORAGE_KEY_THEME = "manuale_dnd_theme_v1";

function getThemeKey(accountId?: string): string {
  return accountId
    ? `${STORAGE_KEY_THEME}_${accountId}`
    : STORAGE_KEY_THEME;
}

function loadInitialTheme(accountId?: string): ThemeMode {
  if (typeof window === "undefined") return "system";
  try {
    const saved = localStorage.getItem(getThemeKey(accountId)) as ThemeMode | null;
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

export function useThemeMode(accountId?: string) {
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

  const themeKey = useMemo(() => getThemeKey(accountId), [accountId]);

  const [themeModeState, setThemeModeState] = useState<ThemeMode>(() =>
    loadInitialTheme(accountId)
  );

  const themeMode: ThemeMode = isHydrated ? themeModeState : "system";

  const setThemeMode = useCallback(
    (mode: ThemeMode) => {
      if (
        mode !== "system" &&
        mode !== "light" &&
        mode !== "dark" &&
        mode !== "sepia"
      ) {
        return;
      }
      setThemeModeState(mode);
      try {
        localStorage.setItem(themeKey, mode);
      } catch {
        // Ignora errori
      }
    },
    [themeKey]
  );

  const resolvedTheme: "light" | "dark" | "sepia" =
    themeMode === "system" ? (systemDark ? "dark" : "light") : themeMode;

  return {
    themeMode,
    setThemeMode,
    resolvedTheme,
  };
}
