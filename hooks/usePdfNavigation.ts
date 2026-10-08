"use client";

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  useMemo,
  useSyncExternalStore,
} from "react";
import type { OutlineItem, ViewMode, ZoomMode } from "@/types/pdf";

const STORAGE_KEY_LAST_PAGE = "manuale_dnd_last_page_v1";
const STORAGE_KEY_VIEW_MODE = "manuale_dnd_view_mode_v1";

const emptySubscribe = () => () => {};

export const DEFAULT_PDF_WIDTH = 747.895;
export const DEFAULT_PDF_HEIGHT = 1057.756;
export const MIN_ZOOM = 0.45;
export const MAX_ZOOM = 3.0;
export const ZOOM_STEP = 0.15;

export interface UsePdfNavigationOptions {
  initialTotalPages?: number;
  outline?: OutlineItem[];
}

function loadSavedPage(maxPages: number): number {
  if (typeof window === "undefined") return 1;
  try {
    const saved = localStorage.getItem(STORAGE_KEY_LAST_PAGE);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= maxPages) {
        return parsed;
      }
    }
  } catch {
    // Ignora errori storage
  }
  return 1;
}

function loadSavedViewMode(): ViewMode {
  if (typeof window === "undefined") return "continuous";
  try {
    const saved = localStorage.getItem(STORAGE_KEY_VIEW_MODE);
    if (
      saved === "continuous" ||
      saved === "single" ||
      saved === "book"
    ) {
      return saved;
    }
  } catch {
    // Ignora errori storage
  }
  return "continuous";
}

/**
 * Risolve il capitolo o sottocapitolo attivo per una determinata pagina
 */
export function resolveChapterForPage(
  outline: OutlineItem[],
  pageNumber: number
): string | undefined {
  let currentMatch: string | undefined;

  function traverse(items: OutlineItem[]) {
    for (const item of items) {
      if (item.pageNumber <= pageNumber) {
        currentMatch = item.title;
      }
      if (item.items && item.items.length > 0) {
        traverse(item.items);
      }
    }
  }

  traverse(outline);
  return currentMatch;
}

export function usePdfNavigation({
  initialTotalPages = 321,
  outline = [],
}: UsePdfNavigationOptions = {}) {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [numPages, setNumPages] = useState<number>(initialTotalPages);
  const [currentPageState, setCurrentPage] = useState<number>(() =>
    loadSavedPage(initialTotalPages)
  );
  const [viewModeState, setViewModeState] =
    useState<ViewMode>(loadSavedViewMode);
  const [zoomModeState, setZoomMode] = useState<ZoomMode>(() =>
    loadSavedViewMode() === "book" ? "fit-page" : "fit-width"
  );
  const [customScale, setCustomScale] = useState<number>(1.0);
  // Permette di usare la rotella diretta per lo zoom anche in modalità "Continuo"
  const [wheelZoomInContinuous, setWheelZoomInContinuous] =
    useState<boolean>(false);

  // Allinea SSR e primo pass di idratazione client per evitare Hydration Mismatch
  const currentPage = isHydrated ? currentPageState : 1;
  const viewMode: ViewMode = isHydrated ? viewModeState : "continuous";
  const zoomMode: ZoomMode = isHydrated ? zoomModeState : "fit-width";

  const [containerDimensions, setContainerDimensions] = useState<{
    width: number;
    height: number;
  }>({ width: 1100, height: 820 });
  const [pageIntrinsicSize, setPageIntrinsicSize] = useState<{
    width: number;
    height: number;
  }>({
    width: DEFAULT_PDF_WIDTH,
    height: DEFAULT_PDF_HEIGHT,
  });

  // Stato per animare la direzione di sfogliamento 3D nella modalità Libro
  const [turnAnimation, setTurnAnimation] = useState<{
    direction: "next" | "prev";
    tick: number;
  } | null>(null);

  // Callback registrata dal componente PdfViewer per scrollare programmaticamente alla pagina
  const scrollToPageHandlerRef = useRef<((page: number) => void) | null>(null);
  // Lock temporaneo per evitare che l'IntersectionObserver sovrascriva currentPage durante uno salto programmatico
  const isProgrammaticScrollRef = useRef<boolean>(false);
  const programmaticTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  // Al primo mount posiziona lo scroll del viewer sulla pagina salvata (senza chiamare setState nell'effect)
  useEffect(() => {
    const initialPage = loadSavedPage(initialTotalPages);
    if (initialPage > 1) {
      const timer = setTimeout(() => {
        scrollToPageHandlerRef.current?.(initialPage);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [initialTotalPages]);

  // Salva pagina corrente su localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_LAST_PAGE, String(currentPageState));
    } catch {
      // Ignora errori
    }
  }, [currentPageState]);

  const setViewMode = useCallback((mode: ViewMode) => {
    setViewModeState(mode);
    if (mode === "book") {
      setZoomMode("fit-page");
    } else if (mode === "continuous") {
      setZoomMode("fit-width");
    }
    try {
      localStorage.setItem(STORAGE_KEY_VIEW_MODE, mode);
    } catch {
      // Ignora
    }
  }, []);

  // Determina se in modalità "Libro" c'è spazio per mostrare 2 pagine affiancate (Desktop/Tablet/Landscape)
  // oppure 1 singola pagina sfogliabile (Smartphone verticale)
  const isTwoPageSpread = useMemo(() => {
    return viewMode === "book" && containerDimensions.width >= 720;
  }, [viewMode, containerDimensions.width]);

  // Calcola le pagine attualmente visibili nella facciata del libro:
  // Pag. 1 = Copertina singola; poi [2, 3], [4, 5], ..., [320, 321]
  const spreadPages = useMemo<number[]>(() => {
    if (viewMode !== "book" || !isTwoPageSpread) {
      return [currentPage];
    }
    if (currentPage <= 1) {
      return [1];
    }
    const leftPage = currentPage % 2 === 0 ? currentPage : currentPage - 1;
    const rightPage = leftPage + 1 <= numPages ? leftPage + 1 : null;
    return rightPage ? [leftPage, rightPage] : [leftPage];
  }, [viewMode, isTwoPageSpread, currentPage, numPages]);

  // Scale base automatico ("fit") usato come riferimento anche per il doppio tap
  const baseFitScale = useMemo(() => {
    const horizontalPadding = containerDimensions.width < 640 ? 16 : 56;
    const verticalPadding = containerDimensions.width < 640 ? 28 : 56;
    const availableWidth = Math.max(
      280,
      containerDimensions.width - horizontalPadding
    );
    const availableHeight = Math.max(
      360,
      containerDimensions.height - verticalPadding
    );

    if (viewMode === "book" && isTwoPageSpread) {
      const spreadTotalWidth = pageIntrinsicSize.width * 2 + 16;
      const scaleW = availableWidth / spreadTotalWidth;
      const scaleH = availableHeight / pageIntrinsicSize.height;
      return Number(Math.min(scaleW, scaleH).toFixed(3));
    }

    if (zoomMode === "fit-page") {
      const scaleW = availableWidth / pageIntrinsicSize.width;
      const scaleH = availableHeight / pageIntrinsicSize.height;
      return Number(Math.min(scaleW, scaleH).toFixed(3));
    }

    const targetWidth = Math.min(availableWidth, 920);
    return Number((targetWidth / pageIntrinsicSize.width).toFixed(3));
  }, [viewMode, isTwoPageSpread, zoomMode, containerDimensions, pageIntrinsicSize]);

  // Calcola lo scale effettivo applicato alla pagina PDF
  const effectiveScale = useMemo(() => {
    if (zoomMode === "custom") {
      return customScale;
    }
    return baseFitScale;
  }, [zoomMode, customScale, baseFitScale]);

  // Registra la funzione di scroll del viewer
  const registerScrollHandler = useCallback(
    (handler: ((page: number) => void) | null) => {
      scrollToPageHandlerRef.current = handler;
    },
    []
  );

  // Salto diretto a una pagina (da pulsanti, input, indice o risultati di ricerca)
  const goToPage = useCallback(
    (targetPage: number, explicitDirection?: "next" | "prev") => {
      const clamped = Math.max(1, Math.min(numPages, Math.floor(targetPage)));
      setCurrentPage((prev) => {
        if (clamped !== prev) {
          const dir =
            explicitDirection ?? (clamped > prev ? "next" : "prev");
          setTurnAnimation((prevAnim) => ({
            direction: dir,
            tick: (prevAnim?.tick ?? 0) + 1,
          }));
        }
        return clamped;
      });

      if (programmaticTimeoutRef.current) {
        clearTimeout(programmaticTimeoutRef.current);
      }
      isProgrammaticScrollRef.current = true;
      scrollToPageHandlerRef.current?.(clamped);

      programmaticTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 450);
    },
    [numPages]
  );

  // Aggiornamento pagina proveniente dallo scroll manuale dell'utente
  const onViewportPageChange = useCallback((visiblePage: number) => {
    if (isProgrammaticScrollRef.current) return;
    setCurrentPage((prev) => (prev !== visiblePage ? visiblePage : prev));
  }, []);

  const nextPage = useCallback(() => {
    if (viewMode === "book" && isTwoPageSpread) {
      if (currentPage === 1) {
        if (numPages >= 2) goToPage(2, "next");
        return;
      }
      const leftPage = currentPage % 2 === 0 ? currentPage : currentPage - 1;
      const nextSpreadStart = leftPage + 2;
      if (nextSpreadStart <= numPages) {
        goToPage(nextSpreadStart, "next");
      }
      return;
    }

    if (currentPage < numPages) {
      goToPage(currentPage + 1, "next");
    }
  }, [viewMode, isTwoPageSpread, currentPage, numPages, goToPage]);

  const prevPage = useCallback(() => {
    if (viewMode === "book" && isTwoPageSpread) {
      if (currentPage <= 1) return;
      const leftPage = currentPage % 2 === 0 ? currentPage : currentPage - 1;
      if (leftPage <= 2) {
        goToPage(1, "prev");
      } else {
        goToPage(leftPage - 2, "prev");
      }
      return;
    }

    if (currentPage > 1) {
      goToPage(currentPage - 1, "prev");
    }
  }, [viewMode, isTwoPageSpread, currentPage, goToPage]);

  // Gestione dello Zoom
  const zoomIn = useCallback(() => {
    const next = Math.min(
      MAX_ZOOM,
      Number((effectiveScale + ZOOM_STEP).toFixed(2))
    );
    setCustomScale(next);
    setZoomMode("custom");
  }, [effectiveScale]);

  const zoomOut = useCallback(() => {
    const next = Math.max(
      MIN_ZOOM,
      Number((effectiveScale - ZOOM_STEP).toFixed(2))
    );
    setCustomScale(next);
    setZoomMode("custom");
  }, [effectiveScale]);

  const setExactZoom = useCallback((scale: number) => {
    const clamped = Number(
      Math.max(MIN_ZOOM, Math.min(MAX_ZOOM, scale)).toFixed(3)
    );
    setCustomScale(clamped);
    setZoomMode("custom");
  }, []);

  const fitToWidth = useCallback(() => {
    setZoomMode("fit-width");
  }, []);

  const fitToPage = useCallback(() => {
    setZoomMode("fit-page");
  }, []);

  const resetZoom = useCallback(() => {
    if (viewMode === "book") {
      setZoomMode("fit-page");
    } else {
      setZoomMode("fit-width");
    }
  }, [viewMode]);

  // Doppio tap / doppio clic rapido per ingrandire (1.65x del baseFitScale) o tornare a dimensioni adattate
  const toggleDoubleTapZoom = useCallback(() => {
    if (zoomMode === "custom" && effectiveScale > baseFitScale * 1.18) {
      resetZoom();
    } else {
      const target = Math.min(
        MAX_ZOOM,
        Number((baseFitScale * 1.65).toFixed(2))
      );
      setCustomScale(target);
      setZoomMode("custom");
    }
  }, [zoomMode, effectiveScale, baseFitScale, resetZoom]);

  const activeChapter = useMemo(
    () => resolveChapterForPage(outline, currentPage),
    [outline, currentPage]
  );

  return {
    numPages,
    setNumPages,
    currentPage,
    viewMode,
    setViewMode,
    isTwoPageSpread,
    spreadPages,
    turnAnimation,
    zoomMode,
    setZoomMode,
    customScale,
    effectiveScale,
    baseFitScale,
    zoomPercentage: Math.round(effectiveScale * 100),
    wheelZoomInContinuous,
    setWheelZoomInContinuous,
    containerDimensions,
    setContainerDimensions,
    pageIntrinsicSize,
    setPageIntrinsicSize,
    activeChapter,
    goToPage,
    nextPage,
    prevPage,
    zoomIn,
    zoomOut,
    setExactZoom,
    fitToWidth,
    fitToPage,
    resetZoom,
    toggleDoubleTapZoom,
    registerScrollHandler,
    onViewportPageChange,
  };
}
