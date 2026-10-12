"use client";

import {
  useState,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

const STORAGE_KEY_PANEL_WIDTHS = "manuale_dnd_panel_widths_v1";

export const DESKTOP_MIN_VIEWPORT = 1024;
export const SIDEBAR_DEFAULT_WIDTH = 320;
export const SIDEBAR_MIN_WIDTH = 220;
export const SIDEBAR_MAX_WIDTH = 1100;

export const SHEET_DEFAULT_WIDTH = 640;
export const SHEET_MIN_WIDTH = 360;
export const SHEET_MAX_WIDTH = 1100;

export const MANUAL_MIN_WIDTH = 360;

export type ActiveDragPanel = "sidebar" | "characterSheet" | null;

interface SavedPanelWidths {
  sidebarWidth: number;
  characterSheetWidth: number;
}

function getStorageKey(accountId?: string): string {
  return accountId
    ? `${STORAGE_KEY_PANEL_WIDTHS}_${accountId}`
    : STORAGE_KEY_PANEL_WIDTHS;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, Math.round(value)));
}

function loadSavedWidths(accountId?: string): SavedPanelWidths {
  if (typeof window === "undefined") {
    return {
      sidebarWidth: SIDEBAR_DEFAULT_WIDTH,
      characterSheetWidth: SHEET_DEFAULT_WIDTH,
    };
  }
  try {
    const raw = localStorage.getItem(getStorageKey(accountId));
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<SavedPanelWidths>;
      const sidebarWidth =
        typeof parsed.sidebarWidth === "number" &&
        !Number.isNaN(parsed.sidebarWidth)
          ? clamp(parsed.sidebarWidth, SIDEBAR_MIN_WIDTH, SIDEBAR_MAX_WIDTH)
          : SIDEBAR_DEFAULT_WIDTH;
      const characterSheetWidth =
        typeof parsed.characterSheetWidth === "number" &&
        !Number.isNaN(parsed.characterSheetWidth)
          ? clamp(parsed.characterSheetWidth, SHEET_MIN_WIDTH, SHEET_MAX_WIDTH)
          : SHEET_DEFAULT_WIDTH;
      return { sidebarWidth, characterSheetWidth };
    }
  } catch {
    // Ignora errori di lettura da localStorage
  }
  return {
    sidebarWidth: SIDEBAR_DEFAULT_WIDTH,
    characterSheetWidth: SHEET_DEFAULT_WIDTH,
  };
}

const emptySubscribe = () => () => {};

export interface UseResizablePanelsOptions {
  accountId?: string;
  isSidebarOpen: boolean;
  isCharacterSheetOpen: boolean;
  isCharacterSheetExpanded: boolean;
}

/**
 * Gestisce il ridimensionamento manuale su desktop (≥ 1024px) per le 3 finestre:
 * Indice (sinistra) — Manuale (centro) — Scheda Giocatore (destra).
 */
export function useResizablePanels({
  accountId,
  isSidebarOpen,
  isCharacterSheetOpen,
  isCharacterSheetExpanded,
}: UseResizablePanelsOptions) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const storageKey = useMemo(() => getStorageKey(accountId), [accountId]);

  const [widths, setWidths] = useState<SavedPanelWidths>(() =>
    loadSavedWidths(accountId)
  );
  const [viewportWidth, setViewportWidth] = useState<number>(() =>
    typeof window !== "undefined" ? window.innerWidth : 1440
  );
  const [activeDragPanel, setActiveDragPanel] =
    useState<ActiveDragPanel>(null);

  // Osserva la larghezza della finestra del browser per garantire che tutte le 3 colonne rispettino i minimi
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handleResize = () => {
      setViewportWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Persiste le larghezze personalizzate su localStorage per il dispositivo/account corrente
  useEffect(() => {
    if (!isHydrated) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(widths));
    } catch {
      // Ignora errori di scrittura su localStorage
    }
  }, [widths, storageKey, isHydrated]);

  const isSheetDockedOnDesktop =
    isCharacterSheetOpen && !isCharacterSheetExpanded;

  // Calcola le larghezze effettive garantendo sempre almeno MANUAL_MIN_WIDTH al Manuale centrale
  const { effectiveSidebarWidth, effectiveCharacterSheetWidth } =
    useMemo(() => {
      if (!isHydrated || viewportWidth < DESKTOP_MIN_VIEWPORT) {
        return {
          effectiveSidebarWidth: SIDEBAR_DEFAULT_WIDTH,
          effectiveCharacterSheetWidth: SHEET_DEFAULT_WIDTH,
        };
      }

      const maxAvailableForSides = Math.max(
        SIDEBAR_MIN_WIDTH + SHEET_MIN_WIDTH,
        viewportWidth - MANUAL_MIN_WIDTH
      );

      let sWidth = clamp(
        widths.sidebarWidth,
        SIDEBAR_MIN_WIDTH,
        SIDEBAR_MAX_WIDTH
      );
      let cWidth = clamp(
        widths.characterSheetWidth,
        SHEET_MIN_WIDTH,
        SHEET_MAX_WIDTH
      );

      if (isSidebarOpen && isSheetDockedOnDesktop) {
        if (sWidth + cWidth > maxAvailableForSides) {
          if (activeDragPanel === "sidebar") {
            sWidth = clamp(
              sWidth,
              SIDEBAR_MIN_WIDTH,
              Math.max(SIDEBAR_MIN_WIDTH, maxAvailableForSides - cWidth)
            );
          } else if (activeDragPanel === "characterSheet") {
            cWidth = clamp(
              cWidth,
              SHEET_MIN_WIDTH,
              Math.max(SHEET_MIN_WIDTH, maxAvailableForSides - sWidth)
            );
          } else {
            // Riduce l'eccesso preservando i limiti minimi di entrambi i pannelli laterali
            const excess = sWidth + cWidth - maxAvailableForSides;
            const sShrinkable = Math.max(0, sWidth - SIDEBAR_MIN_WIDTH);
            const cShrinkable = Math.max(0, cWidth - SHEET_MIN_WIDTH);
            const totalShrinkable = sShrinkable + cShrinkable;

            if (totalShrinkable > 0) {
              const sReduction = Math.round(
                excess * (sShrinkable / totalShrinkable)
              );
              const cReduction = excess - sReduction;
              sWidth = Math.max(SIDEBAR_MIN_WIDTH, sWidth - sReduction);
              cWidth = Math.max(SHEET_MIN_WIDTH, cWidth - cReduction);
            } else {
              sWidth = SIDEBAR_MIN_WIDTH;
              cWidth = SHEET_MIN_WIDTH;
            }
          }
        }
      } else if (isSidebarOpen) {
        const maxSingleSidebar = Math.min(
          SIDEBAR_MAX_WIDTH,
          Math.max(SIDEBAR_MIN_WIDTH, viewportWidth - MANUAL_MIN_WIDTH)
        );
        sWidth = clamp(sWidth, SIDEBAR_MIN_WIDTH, maxSingleSidebar);
      } else if (isSheetDockedOnDesktop) {
        const maxSingleSheet = Math.min(
          SHEET_MAX_WIDTH,
          Math.max(SHEET_MIN_WIDTH, viewportWidth - MANUAL_MIN_WIDTH)
        );
        cWidth = clamp(cWidth, SHEET_MIN_WIDTH, maxSingleSheet);
      }

      return {
        effectiveSidebarWidth: sWidth,
        effectiveCharacterSheetWidth: cWidth,
      };
    }, [
      isHydrated,
      viewportWidth,
      widths.sidebarWidth,
      widths.characterSheetWidth,
      isSidebarOpen,
      isSheetDockedOnDesktop,
      activeDragPanel,
    ]);

  // Ref sincronizzato per leggere i valori correnti all'inizio del trascinamento
  const stateRef = useRef({
    effectiveSidebarWidth,
    effectiveCharacterSheetWidth,
    isSidebarOpen,
    isSheetDockedOnDesktop,
    viewportWidth,
  });
  useEffect(() => {
    stateRef.current = {
      effectiveSidebarWidth,
      effectiveCharacterSheetWidth,
      isSidebarOpen,
      isSheetDockedOnDesktop,
      viewportWidth,
    };
  }, [
    effectiveSidebarWidth,
    effectiveCharacterSheetWidth,
    isSidebarOpen,
    isSheetDockedOnDesktop,
    viewportWidth,
  ]);

  const startResizeSidebar = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();

      const startX = e.clientX;
      const startSidebarW = stateRef.current.effectiveSidebarWidth;
      const currentSheetW = stateRef.current.isSheetDockedOnDesktop
        ? stateRef.current.effectiveCharacterSheetWidth
        : 0;
      const currentVw = window.innerWidth;

      const maxAllowed = Math.min(
        SIDEBAR_MAX_WIDTH,
        Math.max(
          SIDEBAR_MIN_WIDTH,
          currentVw - MANUAL_MIN_WIDTH - currentSheetW
        )
      );

      setActiveDragPanel("sidebar");
      // Sincronizza il valore di partenza se il pannello opposto era stato compresso
      setWidths((prev) => ({
        sidebarWidth: startSidebarW,
        characterSheetWidth: stateRef.current.isSheetDockedOnDesktop
          ? stateRef.current.effectiveCharacterSheetWidth
          : prev.characterSheetWidth,
      }));

      const prevCursor = document.body.style.cursor;
      const prevUserSelect = document.body.style.userSelect;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const handlePointerMove = (moveEvent: PointerEvent) => {
        const deltaX = moveEvent.clientX - startX;
        const nextWidth = clamp(
          startSidebarW + deltaX,
          SIDEBAR_MIN_WIDTH,
          maxAllowed
        );
        setWidths((prev) =>
          prev.sidebarWidth === nextWidth
            ? prev
            : { ...prev, sidebarWidth: nextWidth }
        );
      };

      const handlePointerUp = () => {
        setActiveDragPanel(null);
        document.body.style.cursor = prevCursor;
        document.body.style.userSelect = prevUserSelect;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    },
    []
  );

  const startResizeCharacterSheet = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      if (e.button !== 0) return;
      e.preventDefault();

      const startX = e.clientX;
      const startSheetW = stateRef.current.effectiveCharacterSheetWidth;
      const currentSidebarW = stateRef.current.isSidebarOpen
        ? stateRef.current.effectiveSidebarWidth
        : 0;
      const currentVw = window.innerWidth;

      const maxAllowed = Math.min(
        SHEET_MAX_WIDTH,
        Math.max(
          SHEET_MIN_WIDTH,
          currentVw - MANUAL_MIN_WIDTH - currentSidebarW
        )
      );

      setActiveDragPanel("characterSheet");
      setWidths((prev) => ({
        sidebarWidth: stateRef.current.isSidebarOpen
          ? stateRef.current.effectiveSidebarWidth
          : prev.sidebarWidth,
        characterSheetWidth: startSheetW,
      }));

      const prevCursor = document.body.style.cursor;
      const prevUserSelect = document.body.style.userSelect;
      document.body.style.cursor = "col-resize";
      document.body.style.userSelect = "none";

      const handlePointerMove = (moveEvent: PointerEvent) => {
        // Il pannello scheda è a destra: trascinando a sinistra (clientX minore) la larghezza aumenta
        const deltaX = startX - moveEvent.clientX;
        const nextWidth = clamp(
          startSheetW + deltaX,
          SHEET_MIN_WIDTH,
          maxAllowed
        );
        setWidths((prev) =>
          prev.characterSheetWidth === nextWidth
            ? prev
            : { ...prev, characterSheetWidth: nextWidth }
        );
      };

      const handlePointerUp = () => {
        setActiveDragPanel(null);
        document.body.style.cursor = prevCursor;
        document.body.style.userSelect = prevUserSelect;
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        window.removeEventListener("pointercancel", handlePointerUp);
      };

      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    },
    []
  );

  const resetSidebarWidth = useCallback(() => {
    setWidths((prev) => ({
      ...prev,
      sidebarWidth: SIDEBAR_DEFAULT_WIDTH,
    }));
  }, []);

  const resetCharacterSheetWidth = useCallback(() => {
    setWidths((prev) => ({
      ...prev,
      characterSheetWidth: SHEET_DEFAULT_WIDTH,
    }));
  }, []);

  const nudgeSidebarWidth = useCallback((deltaPx: number) => {
    const {
      effectiveSidebarWidth: curS,
      effectiveCharacterSheetWidth: curC,
      isSheetDockedOnDesktop: sheetOpen,
      viewportWidth: vw,
    } = stateRef.current;
    const maxAllowed = Math.min(
      SIDEBAR_MAX_WIDTH,
      Math.max(
        SIDEBAR_MIN_WIDTH,
        vw - MANUAL_MIN_WIDTH - (sheetOpen ? curC : 0)
      )
    );
    const nextWidth = clamp(curS + deltaPx, SIDEBAR_MIN_WIDTH, maxAllowed);
    setWidths((prev) => ({ ...prev, sidebarWidth: nextWidth }));
  }, []);

  const nudgeCharacterSheetWidth = useCallback((deltaPx: number) => {
    const {
      effectiveSidebarWidth: curS,
      effectiveCharacterSheetWidth: curC,
      isSidebarOpen: sidebarOpen,
      viewportWidth: vw,
    } = stateRef.current;
    const maxAllowed = Math.min(
      SHEET_MAX_WIDTH,
      Math.max(
        SHEET_MIN_WIDTH,
        vw - MANUAL_MIN_WIDTH - (sidebarOpen ? curS : 0)
      )
    );
    const nextWidth = clamp(curC + deltaPx, SHEET_MIN_WIDTH, maxAllowed);
    setWidths((prev) => ({ ...prev, characterSheetWidth: nextWidth }));
  }, []);

  return {
    effectiveSidebarWidth,
    effectiveCharacterSheetWidth,
    activeDragPanel,
    startResizeSidebar,
    startResizeCharacterSheet,
    resetSidebarWidth,
    resetCharacterSheetWidth,
    nudgeSidebarWidth,
    nudgeCharacterSheetWidth,
  };
}
