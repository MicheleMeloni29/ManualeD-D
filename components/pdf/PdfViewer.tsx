"use client";

import React, {
  useEffect,
  useRef,
  useCallback,
  useMemo,
  useState,
} from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  AlertCircle,
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Loader2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Mouse,
  Highlighter,
  Undo2,
  Plus,
  X,
} from "lucide-react";
import type {
  BookmarkItem,
  HighlightColor,
  HighlightColorConfig,
  NormalizedRect,
  SearchMatch,
  ViewMode,
} from "@/types/pdf";
import { buildSearchRegex } from "@/hooks/usePdfSearch";
import { MIN_ZOOM, MAX_ZOOM } from "@/hooks/usePdfNavigation";
import type { AddHighlightBookmarkInput } from "@/hooks/useBookmarks";
import { PageHighlightsLayer } from "./PageHighlightsLayer";

// Configura il worker PDF.js locale nello stesso modulo in cui sono usati <Document> e <Page>
pdfjs.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";

export interface PdfViewerProps {
  fileUrl: string;
  numPages: number;
  onDocumentLoadSuccess: (numPages: number) => void;
  currentPage: number;
  spreadPages: number[];
  isTwoPageSpread: boolean;
  turnAnimation: { direction: "next" | "prev"; tick: number } | null;
  viewMode: ViewMode;
  effectiveScale: number;
  wheelZoomInContinuous: boolean;
  onToggleWheelZoomInContinuous: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onSetExactZoom: (scale: number) => void;
  onResetZoom: () => void;
  onDoubleTapZoom: () => void;
  pageIntrinsicWidth: number;
  pageIntrinsicHeight: number;
  onContainerResize: (dims: { width: number; height: number }) => void;
  registerScrollHandler: (handler: ((page: number) => void) | null) => void;
  onViewportPageChange: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  searchQuery: string;
  exactWord: boolean;
  caseSensitive: boolean;
  activeMatch: SearchMatch | null;
  matchesByPage: Map<number, SearchMatch[]>;
  highlightsByPage: Map<number, BookmarkItem[]>;
  highlightColors: HighlightColorConfig[];
  onOpenColorManager: () => void;
  focusedHighlightId: string | null;
  isAreaHighlightMode: boolean;
  onToggleAreaHighlightMode: () => void;
  activeHighlightColor: HighlightColor;
  onSelectHighlightColor: (color: HighlightColor) => void;
  canUndoHighlight: boolean;
  lastHighlightLabel?: string;
  onUndoLastHighlight: () => void;
  onAddHighlightBookmark: (input: AddHighlightBookmarkInput) => void;
  onUpdateHighlightColor: (id: string, color: HighlightColor) => void;
  onUpdateHighlightLabel: (id: string, label: string) => void;
  onRemoveHighlight: (id: string) => void;
  resolvedTheme: "light" | "dark" | "sepia";
}

interface PendingTextSelection {
  pageNumber: number;
  text: string;
  rects: NormalizedRect[];
  popupX: number;
  popupY: number;
}

/**
 * Effettua l'escape dell'HTML prima di iniettare i tag <mark> nel customTextRenderer
 */
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function getTouchDistance(t1: React.Touch, t2: React.Touch): number {
  const dx = t1.clientX - t2.clientX;
  const dy = t1.clientY - t2.clientY;
  return Math.hypot(dx, dy);
}

/**
 * Unisce i rettangoli di selezione adiacenti sulla stessa riga per creare un'evidenziazione pulita
 */
function mergeSelectionRects(
  domRects: DOMRect[],
  pageRect: DOMRect
): NormalizedRect[] {
  if (pageRect.width <= 0 || pageRect.height <= 0) return [];

  const raw: NormalizedRect[] = [];
  for (const r of domRects) {
    if (r.width < 2 || r.height < 2) continue;
    const x = Math.max(
      0,
      Math.min(100, ((r.left - pageRect.left) / pageRect.width) * 100)
    );
    const y = Math.max(
      0,
      Math.min(100, ((r.top - pageRect.top) / pageRect.height) * 100)
    );
    const width = Math.max(
      0.5,
      Math.min(100 - x, (r.width / pageRect.width) * 100)
    );
    const height = Math.max(
      0.5,
      Math.min(100 - y, (r.height / pageRect.height) * 100)
    );
    raw.push({ x, y, width, height });
  }

  if (raw.length <= 1) return raw;

  // Raggruppa rettangoli sulla stessa linea verticale (tolleranza 0.8%)
  const merged: NormalizedRect[] = [];
  for (const rect of raw) {
    const prev = merged[merged.length - 1];
    if (
      prev &&
      Math.abs(prev.y - rect.y) < 0.85 &&
      Math.abs(prev.height - rect.height) < 1.0 &&
      rect.x <= prev.x + prev.width + 1.5
    ) {
      const rightEdge = Math.max(prev.x + prev.width, rect.x + rect.width);
      prev.x = Math.min(prev.x, rect.x);
      prev.width = Number((rightEdge - prev.x).toFixed(2));
      prev.height = Number(Math.max(prev.height, rect.height).toFixed(2));
    } else {
      merged.push({
        x: Number(rect.x.toFixed(2)),
        y: Number(rect.y.toFixed(2)),
        width: Number(rect.width.toFixed(2)),
        height: Number(rect.height.toFixed(2)),
      });
    }
  }

  return merged;
}

/**
 * Numero di pagine adiacenti da mantenere renderizzate sopra e sotto la pagina corrente
 * in modalità scorrimento continuo (totale max = 5 pagine nel DOM su 321).
 */
const VIRTUAL_BUFFER_PAGES = 2;

export default function PdfViewer({
  fileUrl,
  numPages,
  onDocumentLoadSuccess,
  currentPage,
  spreadPages,
  isTwoPageSpread,
  turnAnimation,
  viewMode,
  effectiveScale,
  wheelZoomInContinuous,
  onToggleWheelZoomInContinuous,
  onZoomIn,
  onZoomOut,
  onSetExactZoom,
  onResetZoom,
  onDoubleTapZoom,
  pageIntrinsicWidth,
  pageIntrinsicHeight,
  onContainerResize,
  registerScrollHandler,
  onViewportPageChange,
  onPrevPage,
  onNextPage,
  searchQuery,
  exactWord,
  caseSensitive,
  activeMatch,
  matchesByPage,
  highlightsByPage,
  highlightColors,
  onOpenColorManager,
  focusedHighlightId,
  isAreaHighlightMode,
  onToggleAreaHighlightMode,
  activeHighlightColor,
  onSelectHighlightColor,
  canUndoHighlight,
  lastHighlightLabel,
  onUndoLastHighlight,
  onAddHighlightBookmark,
  onUpdateHighlightColor,
  onUpdateHighlightLabel,
  onRemoveHighlight,
  resolvedTheme,
}: PdfViewerProps) {
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const pageRefs = useRef<Map<number, HTMLDivElement>>(new Map());
  const rafScrollRef = useRef<number | null>(null);

  // Riferimenti per gesture Touch (Pinch-to-Zoom a 2 dita, Doppio Tap, Swipe)
  const touchStartXRef = useRef<number | null>(null);
  const touchStartYRef = useRef<number | null>(null);
  const lastTapTimeRef = useRef<number>(0);
  const lastTapPosRef = useRef<{ x: number; y: number } | null>(null);
  const isPinchingRef = useRef<boolean>(false);
  const pinchInitialDistanceRef = useRef<number | null>(null);
  const pinchInitialScaleRef = useRef<number>(effectiveScale);

  const [pinchPreviewRatio, setPinchPreviewRatio] = useState<number>(1);
  const [loadProgress, setLoadProgress] = useState<number>(0);
  const [isDocumentLoaded, setIsDocumentLoaded] = useState<boolean>(false);
  const [pendingSelection, setPendingSelection] =
    useState<PendingTextSelection | null>(null);

  // Dimensioni in pixel di ogni singola pagina scalata
  const scaledWidth = Math.round(pageIntrinsicWidth * effectiveScale);
  const scaledHeight = Math.round(pageIntrinsicHeight * effectiveScale);

  // Osserva il ridimensionamento del contenitore principale per adattare lo zoom "Fit to width/page"
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const updateSize = () => {
      onContainerResize({
        width: container.clientWidth,
        height: container.clientHeight,
      });
    };

    updateSize();

    const observer = new ResizeObserver(() => {
      updateSize();
    });
    observer.observe(container);

    return () => observer.disconnect();
  }, [onContainerResize]);

  // Gestione Zoom tramite Rotella del Mouse e Pinch sul Trackpad (listener non-passive)
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      const isTrackpadPinchOrModifier = e.ctrlKey || e.metaKey || e.altKey;
      const isDirectWheelZoomActive = wheelZoomInContinuous;

      if (!isTrackpadPinchOrModifier && !isDirectWheelZoomActive) {
        return;
      }

      e.preventDefault();

      // Calcola il passo di zoom fluido in base all'intensità della rotella o del pinch su trackpad
      const rawDelta = -e.deltaY;
      const step = isTrackpadPinchOrModifier
        ? rawDelta * 0.0065
        : rawDelta > 0
        ? 0.1
        : -0.1;

      const nextScale = Math.max(
        MIN_ZOOM,
        Math.min(MAX_ZOOM, Number((effectiveScale + step).toFixed(3)))
      );

      if (nextScale !== effectiveScale) {
        onSetExactZoom(nextScale);
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [wheelZoomInContinuous, effectiveScale, onSetExactZoom]);

  // Registra l'handler per saltare programmaticamente a una pagina specifica
  useEffect(() => {
    const scrollToPage = (targetPage: number) => {
      const container = scrollContainerRef.current;
      if (!container) return;

      if (viewMode === "single" || viewMode === "book") {
        container.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
        return;
      }

      const pageEl = pageRefs.current.get(targetPage);
      if (pageEl) {
        const containerRect = container.getBoundingClientRect();
        const pageRect = pageEl.getBoundingClientRect();
        const targetTop =
          container.scrollTop + (pageRect.top - containerRect.top) - 16;

        container.scrollTo({
          top: Math.max(0, targetTop),
          behavior: "instant" as ScrollBehavior,
        });
      }
    };

    registerScrollHandler(scrollToPage);
    return () => registerScrollHandler(null);
  }, [registerScrollHandler, viewMode]);

  // Rileva la selezione di testo effettuata dall'utente sul PDF per mostrare il menu coi 4 colori fluo
  const checkTextSelection = useCallback(() => {
    if (isAreaHighlightMode || typeof window === "undefined") return;

    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) {
      setPendingSelection(null);
      return;
    }

    const selectedText = sel.toString().replace(/\s+/g, " ").trim();
    if (selectedText.length < 2) {
      setPendingSelection(null);
      return;
    }

    const range = sel.getRangeAt(0);
    const anchorEl =
      range.commonAncestorContainer.nodeType === Node.ELEMENT_NODE
        ? (range.commonAncestorContainer as HTMLElement)
        : range.commonAncestorContainer.parentElement;

    if (!anchorEl) {
      setPendingSelection(null);
      return;
    }

    const pageWrapper = anchorEl.closest<HTMLElement>("[data-page-number]");
    if (!pageWrapper) {
      setPendingSelection(null);
      return;
    }

    const pageNumber = parseInt(
      pageWrapper.getAttribute("data-page-number") ?? "0",
      10
    );
    if (!pageNumber || Number.isNaN(pageNumber)) {
      setPendingSelection(null);
      return;
    }

    const pageRect = pageWrapper.getBoundingClientRect();
    const clientRects = Array.from(range.getClientRects());
    const mergedRects = mergeSelectionRects(clientRects, pageRect);

    if (mergedRects.length === 0) {
      setPendingSelection(null);
      return;
    }

    const boundingRect = range.getBoundingClientRect();
    const popupX = Math.max(
      140,
      Math.min(
        window.innerWidth - 140,
        boundingRect.left + boundingRect.width / 2
      )
    );
    const popupY = Math.max(70, boundingRect.top - 10);

    setPendingSelection({
      pageNumber,
      text: selectedText,
      rects: mergedRects,
      popupX,
      popupY,
    });
  }, [isAreaHighlightMode]);

  const handleConfirmTextHighlight = useCallback(
    (color: HighlightColor) => {
      if (!pendingSelection) return;
      onAddHighlightBookmark({
        pageNumber: pendingSelection.pageNumber,
        type: "text",
        color,
        rects: pendingSelection.rects,
        highlightedText: pendingSelection.text,
      });
      onSelectHighlightColor(color);
      setPendingSelection(null);
      window.getSelection()?.removeAllRanges();
    },
    [pendingSelection, onAddHighlightBookmark, onSelectHighlightColor]
  );

  const handleCreateAreaHighlight = useCallback(
    (pageNumber: number, rect: NormalizedRect, color: HighlightColor) => {
      onAddHighlightBookmark({
        pageNumber,
        type: "area",
        color,
        rects: [rect],
      });
    },
    [onAddHighlightBookmark]
  );

  // Calcola la pagina attiva durante lo scroll continuo
  const handleScroll = useCallback(() => {
    setPendingSelection(null);
    if (viewMode !== "continuous") return;
    if (rafScrollRef.current !== null) return;

    rafScrollRef.current = window.requestAnimationFrame(() => {
      rafScrollRef.current = null;
      const container = scrollContainerRef.current;
      if (!container) return;

      const viewportReferenceY =
        container.scrollTop + container.clientHeight * 0.35;
      const gap = 24;
      const topPadding = 24;
      const itemPitch = scaledHeight + gap;

      if (itemPitch <= 0) return;

      const estimatedIndex = Math.floor(
        (viewportReferenceY - topPadding) / itemPitch
      );
      const visiblePage = Math.max(
        1,
        Math.min(numPages, estimatedIndex + 1)
      );

      onViewportPageChange(visiblePage);
    });
  }, [viewMode, scaledHeight, numPages, onViewportPageChange]);

  useEffect(() => {
    return () => {
      if (rafScrollRef.current !== null) {
        cancelAnimationFrame(rafScrollRef.current);
      }
    };
  }, []);

  // =========================================================================
  // GESTURE TOUCH: Pinch-to-Zoom a 2 dita + Doppio Tap + Swipe
  // =========================================================================
  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAreaHighlightMode) return;
    if (e.touches.length === 2) {
      isPinchingRef.current = true;
      pinchInitialDistanceRef.current = getTouchDistance(
        e.touches[0],
        e.touches[1]
      );
      pinchInitialScaleRef.current = effectiveScale;
      setPinchPreviewRatio(1);
      touchStartXRef.current = null;
      touchStartYRef.current = null;
      return;
    }

    if (e.touches.length === 1 && !isPinchingRef.current) {
      touchStartXRef.current = e.touches[0].clientX;
      touchStartYRef.current = e.touches[0].clientY;
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isAreaHighlightMode) return;
    if (
      e.touches.length === 2 &&
      isPinchingRef.current &&
      pinchInitialDistanceRef.current
    ) {
      const currentDist = getTouchDistance(e.touches[0], e.touches[1]);
      const rawRatio = currentDist / pinchInitialDistanceRef.current;
      const minRatio = MIN_ZOOM / pinchInitialScaleRef.current;
      const maxRatio = MAX_ZOOM / pinchInitialScaleRef.current;
      const clampedRatio = Math.max(minRatio, Math.min(maxRatio, rawRatio));
      setPinchPreviewRatio(clampedRatio);
    }
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (isAreaHighlightMode) return;

    setTimeout(() => {
      checkTextSelection();
    }, 60);

    if (isPinchingRef.current) {
      if (e.touches.length < 2) {
        const finalScale = Math.max(
          MIN_ZOOM,
          Math.min(
            MAX_ZOOM,
            Number((pinchInitialScaleRef.current * pinchPreviewRatio).toFixed(3))
          )
        );
        setPinchPreviewRatio(1);
        isPinchingRef.current = false;
        pinchInitialDistanceRef.current = null;
        onSetExactZoom(finalScale);
      }
      return;
    }

    if (
      touchStartXRef.current === null ||
      touchStartYRef.current === null ||
      e.changedTouches.length === 0
    ) {
      return;
    }

    const endX = e.changedTouches[0].clientX;
    const endY = e.changedTouches[0].clientY;
    const deltaX = endX - touchStartXRef.current;
    const deltaY = endY - touchStartYRef.current;
    touchStartXRef.current = null;
    touchStartYRef.current = null;

    // 1. Verifica Doppio Tap
    const now = Date.now();
    if (Math.abs(deltaX) < 15 && Math.abs(deltaY) < 15) {
      const prevTap = lastTapPosRef.current;
      if (
        now - lastTapTimeRef.current < 280 &&
        prevTap &&
        Math.hypot(endX - prevTap.x, endY - prevTap.y) < 36
      ) {
        lastTapTimeRef.current = 0;
        lastTapPosRef.current = null;
        onDoubleTapZoom();
        return;
      }
      lastTapTimeRef.current = now;
      lastTapPosRef.current = { x: endX, y: endY };
    }

    // 2. Swipe orizzontale per sfogliare pagina
    if (viewMode !== "continuous") {
      const container = scrollContainerRef.current;
      const isHorizontallyScrollable =
        container && container.scrollWidth > container.clientWidth + 12;

      if (
        !isHorizontallyScrollable &&
        Math.abs(deltaX) > 55 &&
        Math.abs(deltaX) > Math.abs(deltaY) * 1.4
      ) {
        if (deltaX < 0) {
          onNextPage();
        } else {
          onPrevPage();
        }
      }
    }
  };

  // Costruisce il renderer del text-layer per evidenziare le parole cercate direttamente sul PDF
  const customTextRenderer = useMemo(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) return undefined;

    const regex = buildSearchRegex(trimmed, exactWord, caseSensitive);
    if (!regex) return undefined;

    return ({ str }: { str: string }) => {
      if (!str) return "";
      regex.lastIndex = 0;
      if (!regex.test(str)) {
        return escapeHtml(str);
      }

      regex.lastIndex = 0;
      let lastIndex = 0;
      let result = "";
      let match: RegExpExecArray | null;

      while ((match = regex.exec(str)) !== null) {
        const start = match.index;
        const matchedText = match[0];
        result += escapeHtml(str.slice(lastIndex, start));
        result += `<mark class="pdf-search-highlight">${escapeHtml(
          matchedText
        )}</mark>`;
        lastIndex = start + matchedText.length;

        if (match.index === regex.lastIndex) {
          regex.lastIndex++;
        }
      }

      result += escapeHtml(str.slice(lastIndex));
      return result;
    };
  }, [searchQuery, exactWord, caseSensitive]);

  // Evidenzia con uno stile più marcato l'occorrenza attiva sulla pagina corrente
  const highlightActiveMarkOnPage = useCallback(
    (pageNumber: number) => {
      const pageEl = pageRefs.current.get(pageNumber);
      if (!pageEl) return;

      const marks = pageEl.querySelectorAll("mark.pdf-search-highlight");
      marks.forEach((m) => m.classList.remove("pdf-search-highlight-active"));

      if (
        activeMatch &&
        activeMatch.pageNumber === pageNumber &&
        marks.length > 0
      ) {
        const targetMark =
          marks[Math.min(activeMatch.matchIndexInPage, marks.length - 1)];
        if (targetMark) {
          targetMark.classList.add("pdf-search-highlight-active");
        }
      }
    },
    [activeMatch]
  );

  useEffect(() => {
    if (activeMatch) {
      highlightActiveMarkOnPage(activeMatch.pageNumber);
    }
  }, [activeMatch, highlightActiveMarkOnPage]);

  // Elenco numeri di pagina (1..numPages)
  const allPages = useMemo(
    () => Array.from({ length: numPages }, (_, i) => i + 1),
    [numPages]
  );

  const viewerBg =
    resolvedTheme === "dark"
      ? "bg-[#110d0b]"
      : resolvedTheme === "sepia"
      ? "bg-[#e3d2b0]"
      : "bg-[#f3ecde]";

  const pageCardBg =
    resolvedTheme === "dark"
      ? "bg-[#1b1512] shadow-black/70 ring-1 ring-[#785926]/65"
      : resolvedTheme === "sepia"
      ? "bg-[#fbf4e4] shadow-[#3a200a]/20 ring-1 ring-[#b88938]/75"
      : "bg-[#fffdf9] shadow-[#3e220e]/12 ring-1 ring-[#c8a050]/70";

  const floatingSurface =
    resolvedTheme === "dark"
      ? "bg-[#1b1512]/95 text-[#ede2d0] dnd-frame-dark"
      : resolvedTheme === "sepia"
      ? "bg-[#f2e4c6]/95 text-[#2a180d] dnd-frame-sepia"
      : "bg-[#fbf6eb]/95 text-[#24160e] dnd-frame-light";

  const lastSpreadPage =
    spreadPages.length > 0
      ? spreadPages[spreadPages.length - 1]
      : currentPage;

  const searchKeySuffix =
    searchQuery.trim().length >= 2
      ? `${searchQuery.trim()}-${exactWord}-${caseSensitive}`
      : "clean";

  const livePinchPercentage = Math.round(
    effectiveScale * pinchPreviewRatio * 100
  );

  return (
    <div className="relative flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
      {/* MENU FLOTTANTE AUTOMATICO QUANDO L'UTENTE SELEZIONA DEL TESTO SUL PDF */}
      {pendingSelection && (
        <div
          style={{
            left: `${pendingSelection.popupX}px`,
            top: `${pendingSelection.popupY}px`,
            transform: "translate(-50%, -100%)",
          }}
          onMouseDown={(e) => e.preventDefault()}
          className={`fixed z-50 flex items-center gap-2 px-3 py-2 rounded-2xl border shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 ${floatingSurface}`}
        >
          <Highlighter className="w-3.5 h-3.5 text-[#8c1d14] dark:text-[#d4a74a] shrink-0" />
          <span className="text-[11px] font-semibold mr-0.5">Evidenzia:</span>
          <div className="flex items-center gap-1.5">
            {highlightColors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleConfirmTextHighlight(c.id)}
                title={`Evidenzia come "${c.label}"`}
                aria-label={`Evidenzia in ${c.label}`}
                style={{
                  backgroundColor: c.hex,
                  boxShadow: `0 0 0 1.5px ${c.borderStyle}`,
                }}
                className="w-5 h-5 rounded-full border border-black/20 transition-transform hover:scale-125 active:scale-95"
              />
            ))}
            <button
              type="button"
              onClick={onOpenColorManager}
              title="Aggiungi nuovo colore o rinomina categorie"
              aria-label="Gestisci colori evidenziatore"
              className="w-5 h-5 rounded-full border border-dashed border-current/50 flex items-center justify-center opacity-75 hover:opacity-100 hover:scale-110 transition"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>

          {canUndoHighlight && (
            <>
              <div className="h-3.5 w-px bg-current opacity-20 mx-0.5" />
              <button
                type="button"
                onClick={onUndoLastHighlight}
                title={`Annulla ultima evidenziazione${
                  lastHighlightLabel ? `: "${lastHighlightLabel}"` : ""
                } (Ctrl+Z)`}
                aria-label="Annulla ultima evidenziazione"
                className="px-1.5 py-0.5 rounded-lg text-[11px] font-semibold flex items-center gap-1 text-[#8c1d14] dark:text-[#e5be67] hover:bg-[#8c1d14]/15 dark:hover:bg-[#d4a74a]/15 transition"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Indietro</span>
              </button>
            </>
          )}

          <button
            type="button"
            onClick={() => {
              setPendingSelection(null);
              window.getSelection()?.removeAllRanges();
            }}
            aria-label="Chiudi menu selezione"
            className="p-0.5 rounded opacity-50 hover:opacity-100 ml-0.5"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* BANNER ATTIVO QUANDO È IN USO LO STRUMENTO EVIDENZIATORE AD AREA */}
      {isAreaHighlightMode && (
        <div
          className={`absolute top-3 left-1/2 -translate-x-1/2 z-40 w-max max-w-[calc(100vw-1.5rem)] flex flex-wrap items-center justify-center gap-1.5 sm:gap-2.5 px-3 sm:px-3.5 py-2 rounded-2xl border shadow-2xl backdrop-blur-md text-xs select-none ${floatingSurface}`}
        >
          <Highlighter className="w-4 h-4 text-[#8c1d14] dark:text-[#d4a74a] shrink-0" />
          <span className="hidden md:inline font-medium">
            Traccia un riquadro sulla pagina per evidenziarlo:
          </span>
          <span className="md:hidden font-medium">Riquadra:</span>
          <div className="flex items-center gap-1.5 px-1.5 py-1 rounded-lg bg-black/5 dark:bg-white/10 border border-[#c59b27]/30">
            {highlightColors.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectHighlightColor(c.id)}
                title={c.label}
                style={{
                  backgroundColor: c.hex,
                  boxShadow:
                    activeHighlightColor === c.id
                      ? `0 0 0 2px ${c.borderStyle}`
                      : undefined,
                }}
                className={`w-4 h-4 rounded-full border border-black/20 transition-transform ${
                  activeHighlightColor === c.id
                    ? "scale-125"
                    : "opacity-65 hover:opacity-100"
                }`}
              />
            ))}
            <button
              type="button"
              onClick={onOpenColorManager}
              title="Aggiungi nuovo colore o rinomina categorie"
              aria-label="Gestisci colori evidenziatore"
              className="w-4 h-4 rounded-full border border-dashed border-current/50 flex items-center justify-center opacity-75 hover:opacity-100 hover:scale-110 transition"
            >
              <Plus className="w-2.5 h-2.5" />
            </button>
          </div>

          {/* Tasto Back / Indietro direttamente nel banner dell'evidenziatore */}
          <button
            type="button"
            onClick={onUndoLastHighlight}
            disabled={!canUndoHighlight}
            title={
              canUndoHighlight
                ? `Annulla ultima evidenziazione${
                    lastHighlightLabel ? `: "${lastHighlightLabel}"` : ""
                  } (Ctrl+Z)`
                : "Nessuna evidenziazione da annullare"
            }
            aria-label="Annulla ultima evidenziazione"
            className={`px-2 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 border transition ${
              canUndoHighlight
                ? "border-[#8c1d14]/45 dark:border-[#d4a74a]/50 text-[#8c1d14] dark:text-[#e5be67] bg-[#8c1d14]/10 dark:bg-[#d4a74a]/15 hover:bg-[#8c1d14]/20 active:scale-95"
                : "border-current/15 opacity-35 pointer-events-none"
            }`}
          >
            <Undo2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Indietro</span>
          </button>

          <button
            type="button"
            onClick={onToggleAreaHighlightMode}
            className="px-2.5 py-1 rounded-lg bg-[#8c1d14] text-[#fdf6e6] border border-[#d4a74a]/80 hover:opacity-95 text-[11px] font-semibold"
          >
            Fine
          </button>
        </div>
      )}

      {/* Indicatore live durante il Pinch-to-Zoom a 2 dita */}
      {pinchPreviewRatio !== 1 && (
        <div
          className={`absolute top-6 left-1/2 -translate-x-1/2 z-50 px-3.5 py-1.5 rounded-full border font-mono text-xs font-bold shadow-xl backdrop-blur-md pointer-events-none ${floatingSurface}`}
        >
          Zoom {livePinchPercentage}%
        </div>
      )}

      {/* PULSANTI LATERALI PRECEDENTE / SUCCESSIVO (Ancorati ai bordi dell'area di lettura in vista Singola e Libro) */}
      {viewMode !== "continuous" && (
        <>
          <button
            type="button"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            aria-label="Pagina precedente"
            title="Pagina precedente (Freccia Sinistra)"
            className={`hidden md:flex absolute left-4 lg:left-5 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full border shadow-xl backdrop-blur-md hover:scale-105 active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition ${floatingSurface}`}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onNextPage}
            disabled={
              viewMode === "book"
                ? lastSpreadPage >= numPages
                : currentPage >= numPages
            }
            aria-label="Pagina successiva"
            title="Pagina successiva (Freccia Destra)"
            className={`hidden md:flex absolute right-4 lg:right-5 top-1/2 -translate-y-1/2 z-20 p-3.5 rounded-full border shadow-xl backdrop-blur-md hover:scale-105 active:scale-95 disabled:opacity-20 disabled:pointer-events-none transition ${floatingSurface}`}
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </>
      )}

      {/* CONTROLLI ZOOM & EVIDENZIATORE FLOTTANTI SU DESKTOP (>= 1024px) */}
      <div
        className={`hidden lg:flex absolute bottom-5 right-4 z-30 items-center gap-1 p-1.5 rounded-2xl border shadow-xl backdrop-blur-xl select-none ${floatingSurface}`}
      >
        <button
          type="button"
          onClick={onToggleAreaHighlightMode}
          title="Strumento Evidenziatore ad Area (Scorciatoia: H)"
          aria-label="Evidenziatore ad Area"
          className={`p-2 rounded-xl transition ${
            isAreaHighlightMode
              ? "bg-amber-400 text-stone-950 font-semibold shadow-xs"
              : "hover:bg-black/5 dark:hover:bg-white/10 opacity-85 hover:opacity-100"
          }`}
        >
          <Highlighter className="w-4 h-4" />
        </button>

        {(isAreaHighlightMode || canUndoHighlight) && (
          <button
            type="button"
            onClick={onUndoLastHighlight}
            disabled={!canUndoHighlight}
            title={
              canUndoHighlight
                ? `Annulla ultima evidenziazione${
                    lastHighlightLabel ? `: "${lastHighlightLabel}"` : ""
                  } (Ctrl+Z)`
                : "Nessuna evidenziazione da annullare"
            }
            aria-label="Annulla ultima evidenziazione"
            className={`p-2 rounded-xl transition ${
              canUndoHighlight
                ? "text-[#8c1d14] dark:text-[#e5be67] hover:bg-[#8c1d14]/15 dark:hover:bg-[#d4a74a]/15 active:scale-95"
                : "opacity-30 pointer-events-none"
            }`}
          >
            <Undo2 className="w-4 h-4" />
          </button>
        )}

        <div className="h-4 w-px bg-current opacity-20 mx-0.5" />

        <button
          type="button"
          onClick={onToggleWheelZoomInContinuous}
          title={
            wheelZoomInContinuous
              ? "Rotella mouse impostata su Zoom diretto (Clicca per tornare a Ctrl+Rotella)"
              : "Zoom con Ctrl+Rotella attivo (Clicca per fare Zoom con la sola rotella)"
          }
          className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-medium transition ${
            wheelZoomInContinuous
              ? "bg-[#8c1d14] text-[#fdf6e6] border border-[#d4a74a]/80 font-semibold"
              : "opacity-75 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
          }`}
        >
          <Mouse className="w-3.5 h-3.5" />
          <span>
            {wheelZoomInContinuous ? "Rotella: Zoom" : "Ctrl+Rotella"}
          </span>
        </button>

        <button
          type="button"
          onClick={onZoomOut}
          aria-label="Zoom Out (Tasto X o -)"
          title="Zoom Out (Tasto X oppure -)"
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={onResetZoom}
          aria-label="Ripristina zoom (Tasto 0)"
          title="Adatta allo schermo (Tasto 0 o Doppio Tap)"
          className="px-2 py-1 rounded-xl font-mono text-xs font-semibold hover:bg-black/5 dark:hover:bg-white/10 flex items-center gap-1 transition"
        >
          <span>{livePinchPercentage}%</span>
          <RotateCcw className="w-3 h-3 opacity-60" />
        </button>

        <button
          type="button"
          onClick={onZoomIn}
          aria-label="Zoom In (Tasto Z o +)"
          title="Zoom In (Tasto Z oppure +)"
          className="p-2 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 active:scale-95 transition"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* CONTENITORE DI SCORRIMENTO PAGINE PDF */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        onMouseUp={checkTextSelection}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        className={`relative flex-1 h-full overflow-auto dnd-scrollbar-main dnd-scrollbar-${resolvedTheme} transition-colors duration-200 pb-24 lg:pb-10 touch-pan-x touch-pan-y ${viewerBg}`}
      >

      <Document
        file={fileUrl}
        suspense={false}
        onLoadProgress={({ loaded, total }) => {
          if (total > 0) {
            setLoadProgress(Math.min(100, Math.round((loaded / total) * 100)));
          }
        }}
        onLoadSuccess={(pdf) => {
          setIsDocumentLoaded(true);
          onDocumentLoadSuccess(pdf.numPages);
        }}
        loading={
          <div className="flex flex-col items-center justify-center min-h-[75vh] gap-4 p-6 text-center">
            <div className="w-14 h-14 rounded-2xl bg-stone-800 text-white dark:bg-zinc-800 flex items-center justify-center shadow-lg">
              <Loader2 className="w-7 h-7 animate-spin" />
            </div>
            <div className="space-y-1.5 max-w-xs">
              <p className="text-sm font-semibold">
                Apertura del Manuale del Giocatore...
              </p>
              <p className="text-xs opacity-65">
                Caricamento del documento PDF (321 pagine)
                {loadProgress > 0 ? ` — ${loadProgress}%` : ""}
              </p>
              {loadProgress > 0 && (
                <div className="w-48 h-1.5 mx-auto mt-2 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden">
                  <div
                    className="h-full bg-amber-500 transition-all duration-200"
                    style={{ width: `${loadProgress}%` }}
                  />
                </div>
              )}
            </div>
          </div>
        }
        error={
          <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3 p-6 text-center max-w-md mx-auto">
            <div className="p-3 rounded-2xl bg-red-500/10 text-red-600 dark:text-red-400">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-base font-semibold">
              Impossibile caricare il file PDF
            </h2>
            <p className="text-xs opacity-70 leading-relaxed">
              Assicurati che il file{" "}
              <code className="px-1.5 py-0.5 rounded bg-black/10 dark:bg-white/10 font-mono">
                public/Manuale del giocatore.pdf
              </code>{" "}
              sia presente e accessibile.
            </p>
          </div>
        }
        className="flex flex-col items-center justify-center min-h-full py-4 sm:py-6 px-2 sm:px-6"
      >
        <div
          style={
            pinchPreviewRatio !== 1
              ? {
                  transform: `scale(${pinchPreviewRatio})`,
                  transformOrigin: "center center",
                }
              : undefined
          }
          className="transition-transform duration-75"
        >
          {viewMode === "continuous" ? (
            /* ==================================================================
               1. MODALITÀ SCORRIMENTO VERTICALE CONTINUO VIRTUALIZZATO
               ================================================================== */
            <div className="flex flex-col items-center gap-6">
              {allPages.map((pageNumber) => {
                const shouldRenderCanvas =
                  isDocumentLoaded &&
                  Math.abs(pageNumber - currentPage) <= VIRTUAL_BUFFER_PAGES;
                const pageMatches = matchesByPage.get(pageNumber);
                const pageHighlights = highlightsByPage.get(pageNumber) ?? [];

                return (
                  <div
                    key={pageNumber}
                    data-page-number={pageNumber}
                    onDoubleClick={
                      !isAreaHighlightMode ? onDoubleTapZoom : undefined
                    }
                    ref={(el) => {
                      if (el) {
                        pageRefs.current.set(pageNumber, el);
                      } else {
                        pageRefs.current.delete(pageNumber);
                      }
                    }}
                    style={{
                      width: `${scaledWidth}px`,
                      height: `${scaledHeight}px`,
                    }}
                    className={`relative rounded-lg shadow-xl overflow-hidden transition-shadow select-text ${pageCardBg} ${
                      resolvedTheme === "sepia" ? "sepia-[.18]" : ""
                    }`}
                  >
                    <PageOverlayBadges
                      pageNumber={pageNumber}
                      matchesCount={pageMatches?.length ?? 0}
                      side="right"
                    />

                    {/* Layer Evidenziazioni Categorizzate (Testo & Area) */}
                    <PageHighlightsLayer
                      pageNumber={pageNumber}
                      highlights={pageHighlights}
                      highlightColors={highlightColors}
                      focusedHighlightId={focusedHighlightId}
                      isAreaHighlightMode={isAreaHighlightMode}
                      activeHighlightColor={activeHighlightColor}
                      onCreateAreaHighlight={handleCreateAreaHighlight}
                      onUpdateHighlightColor={onUpdateHighlightColor}
                      onUpdateHighlightLabel={onUpdateHighlightLabel}
                      onRemoveHighlight={onRemoveHighlight}
                      onOpenColorManager={onOpenColorManager}
                      resolvedTheme={resolvedTheme}
                    />

                    {shouldRenderCanvas ? (
                      <Page
                        key={`page-${pageNumber}-${searchKeySuffix}`}
                        pageNumber={pageNumber}
                        width={scaledWidth}
                        suspense={false}
                        renderAnnotationLayer={true}
                        renderTextLayer={true}
                        customTextRenderer={customTextRenderer}
                        onRenderTextLayerSuccess={() =>
                          highlightActiveMarkOnPage(pageNumber)
                        }
                        loading={
                          <PagePlaceholder
                            pageNumber={pageNumber}
                            width={scaledWidth}
                            height={scaledHeight}
                          />
                        }
                      />
                    ) : (
                      <PagePlaceholder
                        pageNumber={pageNumber}
                        width={scaledWidth}
                        height={scaledHeight}
                      />
                    )}
                  </div>
                );
              })}
            </div>
          ) : viewMode === "single" ? (
            /* ==================================================================
               2. MODALITÀ PAGINA SINGOLA
               ================================================================== */
            <div className="relative flex items-center justify-center my-auto">
              <div
                data-page-number={currentPage}
                onDoubleClick={
                  !isAreaHighlightMode ? onDoubleTapZoom : undefined
                }
                ref={(el) => {
                  if (el) {
                    pageRefs.current.set(currentPage, el);
                  }
                }}
                style={{
                  width: `${scaledWidth}px`,
                  height: `${scaledHeight}px`,
                }}
                className={`relative rounded-lg shadow-2xl overflow-hidden select-text ${pageCardBg} ${
                  resolvedTheme === "sepia" ? "sepia-[.18]" : ""
                }`}
              >
                <PageOverlayBadges
                  pageNumber={currentPage}
                  matchesCount={matchesByPage.get(currentPage)?.length ?? 0}
                  side="right"
                />

                {/* Layer Evidenziazioni Categorizzate (Testo & Area) */}
                <PageHighlightsLayer
                  pageNumber={currentPage}
                  highlights={highlightsByPage.get(currentPage) ?? []}
                  highlightColors={highlightColors}
                  focusedHighlightId={focusedHighlightId}
                  isAreaHighlightMode={isAreaHighlightMode}
                  activeHighlightColor={activeHighlightColor}
                  onCreateAreaHighlight={handleCreateAreaHighlight}
                  onUpdateHighlightColor={onUpdateHighlightColor}
                  onUpdateHighlightLabel={onUpdateHighlightLabel}
                  onRemoveHighlight={onRemoveHighlight}
                  onOpenColorManager={onOpenColorManager}
                  resolvedTheme={resolvedTheme}
                />

                {isDocumentLoaded && (
                  <Page
                    key={`single-page-${currentPage}-${searchKeySuffix}`}
                    pageNumber={currentPage}
                    width={scaledWidth}
                    suspense={false}
                    renderAnnotationLayer={true}
                    renderTextLayer={true}
                    customTextRenderer={customTextRenderer}
                    onRenderTextLayerSuccess={() =>
                      highlightActiveMarkOnPage(currentPage)
                    }
                    loading={
                      <PagePlaceholder
                        pageNumber={currentPage}
                        width={scaledWidth}
                        height={scaledHeight}
                      />
                    }
                  />
                )}
              </div>
            </div>
          ) : (
            /* ==================================================================
               3. MODALITÀ LIBRO SFOGLIABILE 3D (Doppia Facciata con Rilegatura)
               ================================================================== */
            <div className="relative flex flex-col items-center justify-center my-auto book-perspective-container">
              {/* Contenitore 3D del Libro Aperto */}
              <div
                key={
                  turnAnimation
                    ? `book-turn-${turnAnimation.direction}-${turnAnimation.tick}`
                    : "book-static"
                }
                onDoubleClick={
                  !isAreaHighlightMode ? onDoubleTapZoom : undefined
                }
                className={`relative flex items-center justify-center rounded-xl transition-shadow duration-300 book-spread-wrapper ${
                  turnAnimation?.direction === "next"
                    ? "animate-book-turn-next"
                    : turnAnimation?.direction === "prev"
                    ? "animate-book-turn-prev"
                    : ""
                }`}
                style={{
                  boxShadow:
                    resolvedTheme === "dark"
                      ? "0 28px 60px -12px rgba(0,0,0,0.85), -4px 0 0 #3d2c14, -8px 0 0 #1f160a, 4px 0 0 #3d2c14, 8px 0 0 #1f160a"
                      : "0 28px 60px -12px rgba(42,24,13,0.34), -4px 0 0 #e6d7b8, -7px 0 0 #cfb88c, -10px 0 0 #8c1d14, 4px 0 0 #e6d7b8, 7px 0 0 #cfb88c, 10px 0 0 #8c1d14",
                }}
              >
                {spreadPages.map((pageNum, idx) => {
                  const isDouble = spreadPages.length === 2;
                  const isLeftPage = isDouble && idx === 0;
                  const isRightPage = isDouble && idx === 1;
                  const isCover = !isDouble && pageNum === 1;

                  return (
                    <div
                      key={`book-page-${pageNum}`}
                      data-page-number={pageNum}
                      ref={(el) => {
                        if (el) {
                          pageRefs.current.set(pageNum, el);
                        } else {
                          pageRefs.current.delete(pageNum);
                        }
                      }}
                      style={{
                        width: `${scaledWidth}px`,
                        height: `${scaledHeight}px`,
                      }}
                      className={`relative overflow-hidden select-text ${pageCardBg} ${
                        resolvedTheme === "sepia" ? "sepia-[.18]" : ""
                      } ${
                        isLeftPage
                          ? "rounded-l-lg rounded-r-none"
                          : isRightPage
                          ? "rounded-r-lg rounded-l-none"
                          : "rounded-lg"
                      }`}
                    >
                      <PageOverlayBadges
                        pageNumber={pageNum}
                        matchesCount={matchesByPage.get(pageNum)?.length ?? 0}
                        side={isLeftPage ? "left" : "right"}
                        labelOverride={
                          isCover ? "Copertina • Pag. 1" : undefined
                        }
                      />

                      {/* Layer Evidenziazioni Categorizzate (Testo & Area) */}
                      <PageHighlightsLayer
                        pageNumber={pageNum}
                        highlights={highlightsByPage.get(pageNum) ?? []}
                        highlightColors={highlightColors}
                        focusedHighlightId={focusedHighlightId}
                        isAreaHighlightMode={isAreaHighlightMode}
                        activeHighlightColor={activeHighlightColor}
                        onCreateAreaHighlight={handleCreateAreaHighlight}
                        onUpdateHighlightColor={onUpdateHighlightColor}
                        onUpdateHighlightLabel={onUpdateHighlightLabel}
                        onRemoveHighlight={onRemoveHighlight}
                        onOpenColorManager={onOpenColorManager}
                        resolvedTheme={resolvedTheme}
                      />

                      {/* Ombra realistica di curvatura verso la rilegatura centrale */}
                      {isLeftPage && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 right-0 w-12 z-10"
                          style={{
                            background:
                              "linear-gradient(to right, rgba(0,0,0,0) 0%, rgba(0,0,0,0.06) 55%, rgba(0,0,0,0.22) 100%)",
                          }}
                        />
                      )}
                      {isRightPage && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 left-0 w-12 z-10"
                          style={{
                            background:
                              "linear-gradient(to left, rgba(0,0,0,0) 0%, rgba(0,0,0,0.05) 55%, rgba(0,0,0,0.20) 100%)",
                          }}
                        />
                      )}

                      {!isDouble && (
                        <div
                          aria-hidden="true"
                          className="pointer-events-none absolute inset-y-0 left-0 w-6 z-10"
                          style={{
                            background:
                              "linear-gradient(to right, rgba(0,0,0,0.22) 0%, rgba(255,255,255,0.08) 35%, rgba(0,0,0,0) 100%)",
                          }}
                        />
                      )}

                      {/* Rendering Canvas + Text Layer PDF.js */}
                      {isDocumentLoaded ? (
                        <Page
                          key={`book-render-${pageNum}-${searchKeySuffix}`}
                          pageNumber={pageNum}
                          width={scaledWidth}
                          suspense={false}
                          renderAnnotationLayer={true}
                          renderTextLayer={true}
                          customTextRenderer={customTextRenderer}
                          onRenderTextLayerSuccess={() =>
                            highlightActiveMarkOnPage(pageNum)
                          }
                          loading={
                            <PagePlaceholder
                              pageNumber={pageNum}
                              width={scaledWidth}
                              height={scaledHeight}
                            />
                          }
                        />
                      ) : (
                        <PagePlaceholder
                          pageNumber={pageNum}
                          width={scaledWidth}
                          height={scaledHeight}
                        />
                      )}
                    </div>
                  );
                })}

                {/* Piega centrale della rilegatura (Gutter Spine) tra le due pagine affiancate */}
                {spreadPages.length === 2 && (
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-y-0 left-1/2 -translate-x-1/2 w-[3px] z-20 bg-gradient-to-b from-black/30 via-black/45 to-black/30"
                  />
                )}

                {/* Foglio 3D animato che ruota durante lo sfogliamento */}
                {turnAnimation && (
                  <div
                    key={`leaf-overlay-${turnAnimation.tick}`}
                    aria-hidden="true"
                    style={{
                      width: `${scaledWidth}px`,
                      height: `${scaledHeight}px`,
                    }}
                    className={`pointer-events-none absolute top-0 z-30 rounded-sm ${
                      spreadPages.length === 2
                        ? turnAnimation.direction === "next"
                          ? "left-1/2 book-turning-leaf-next"
                          : "right-1/2 book-turning-leaf-prev"
                        : turnAnimation.direction === "next"
                        ? "left-0 book-turning-leaf-next"
                        : "right-0 book-turning-leaf-prev"
                    } ${
                      resolvedTheme === "dark"
                        ? "bg-gradient-to-r from-zinc-800/80 via-zinc-700/60 to-zinc-900/80"
                        : resolvedTheme === "sepia"
                        ? "bg-gradient-to-r from-[#e6d7b8]/90 via-[#fbf5e6]/85 to-[#d8c5a0]/90"
                        : "bg-gradient-to-r from-stone-200/85 via-white/85 to-stone-300/85"
                    } shadow-2xl`}
                  />
                )}
              </div>

              {/* Didascalia inferiore stile libro aperto */}
              <div className="mt-3 flex items-center gap-3 text-xs opacity-65 select-none text-center px-4">
                <span>
                  {spreadPages.length === 2
                    ? `Pagine ${spreadPages[0]} – ${spreadPages[1]} di ${numPages}`
                    : currentPage === 1 && isTwoPageSpread
                    ? `Copertina (Pagina 1 di ${numPages})`
                    : `Pagina ${currentPage} di ${numPages}`}
                </span>
                <span className="hidden sm:inline">•</span>
                <span className="hidden sm:inline">
                  Ctrl+Rotella o tasti Z / X (+ / -) per fare Zoom • Frecce ← / → per sfogliare
                </span>
              </div>
            </div>
          )}
        </div>
      </Document>
      </div>
    </div>
  );
}

function PageOverlayBadges({
  pageNumber,
  matchesCount,
  side,
  labelOverride,
}: {
  pageNumber: number;
  matchesCount: number;
  side: "left" | "right";
  labelOverride?: string;
}) {
  return (
    <div
      className={`absolute top-2.5 ${
        side === "left" ? "left-2.5" : "right-2.5"
      } z-10 flex items-center gap-1.5 pointer-events-none`}
    >
      {matchesCount > 0 && (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500 text-stone-950 shadow-xs">
          {matchesCount} risultat{matchesCount === 1 ? "o" : "i"}
        </span>
      )}
      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-black/55 text-white backdrop-blur-xs">
        {labelOverride ?? `Pag. ${pageNumber}`}
      </span>
    </div>
  );
}

function PagePlaceholder({
  pageNumber,
  width,
  height,
}: {
  pageNumber: number;
  width: number;
  height: number;
}) {
  return (
    <div
      style={{ width: `${width}px`, height: `${height}px` }}
      className="flex flex-col items-center justify-center gap-2 text-stone-400 dark:text-zinc-600 select-none"
    >
      <BookOpen className="w-6 h-6 opacity-40 animate-pulse" />
      <span className="font-mono text-xs opacity-60">
        Pagina {pageNumber}
      </span>
    </div>
  );
}
