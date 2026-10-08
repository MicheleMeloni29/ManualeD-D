"use client";

import React, {
  useState,
  useEffect,
  useCallback,
  useSyncExternalStore,
} from "react";
import dynamic from "next/dynamic";
import { Loader2 } from "lucide-react";
import type {
  BookmarkItem,
  HighlightColor,
  OutlineItem,
  PageTextEntry,
  PdfMetadata,
} from "@/types/pdf";
import {
  usePdfNavigation,
  resolveChapterForPage,
  DEFAULT_PDF_WIDTH,
  DEFAULT_PDF_HEIGHT,
} from "@/hooks/usePdfNavigation";
import { usePdfSearch } from "@/hooks/usePdfSearch";
import {
  useBookmarks,
  type AddHighlightBookmarkInput,
} from "@/hooks/useBookmarks";
import { useThemeMode } from "@/hooks/useThemeMode";
import { ControlBar } from "./ControlBar";
import { SidebarIndex } from "./SidebarIndex";
import { SearchModal } from "./SearchModal";
import { HighlightColorManagerModal } from "./HighlightColorManagerModal";

// Importazione dinamica client-only per evitare l'esecuzione SSR di PDF.js
const PdfViewer = dynamic(() => import("./PdfViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex-1 flex flex-col items-center justify-center gap-3 p-8">
      <Loader2 className="w-7 h-7 animate-spin opacity-60" />
      <p className="text-xs font-medium opacity-70">
        Inizializzazione motore di rendering PDF...
      </p>
    </div>
  ),
});

const PDF_FILE_URL = "/Manuale%20del%20giocatore.pdf";
const METADATA_URL = "/pdf-metadata.json";

const emptySubscribe = () => () => {};

export function PdfReaderApp() {
  const isHydrated = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  const [outline, setOutline] = useState<OutlineItem[]>([]);
  const [pagesText, setPagesText] = useState<PageTextEntry[]>([]);
  const [isSidebarOpenState, setIsSidebarOpen] = useState<boolean>(
    () => typeof window !== "undefined" && window.innerWidth >= 1280
  );
  const isSidebarOpen = isHydrated ? isSidebarOpenState : false;
  const [isAreaHighlightMode, setIsAreaHighlightMode] =
    useState<boolean>(false);
  const [activeHighlightColor, setActiveHighlightColor] =
    useState<HighlightColor>("yellow");
  const [isColorManagerOpen, setIsColorManagerOpen] = useState<boolean>(false);

  const { themeMode, setThemeMode, resolvedTheme } = useThemeMode();

  const {
    numPages,
    setNumPages,
    currentPage,
    viewMode,
    setViewMode,
    isTwoPageSpread,
    spreadPages,
    turnAnimation,
    zoomMode,
    effectiveScale,
    zoomPercentage,
    wheelZoomInContinuous,
    setWheelZoomInContinuous,
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
  } = usePdfNavigation({
    initialTotalPages: 321,
    outline,
  });

  const {
    isSearchOpen,
    openSearch,
    closeSearch,
    toggleSearch,
    query,
    setQuery,
    debouncedQuery,
    exactWord,
    setExactWord,
    caseSensitive,
    setCaseSensitive,
    matches,
    matchesByPage,
    pagesWithMatchesCount,
    activeMatchIndex,
    activeMatch,
    selectMatch,
    nextMatch,
    prevMatch,
    clearSearch,
  } = usePdfSearch({
    pagesText,
    outline,
    onNavigateToPage: goToPage,
  });

  const {
    bookmarks,
    highlightColors,
    addHighlightColor,
    updateHighlightColorMeta,
    removeHighlightColor,
    resetHighlightColors,
    highlightsByPage,
    focusedHighlightId,
    focusHighlight,
    isPageBookmarked,
    toggleBookmark,
    addHighlightBookmark,
    removeBookmark,
    updateBookmarkLabel,
    updateBookmarkColor,
    lastHighlight,
    canUndoHighlight,
    undoLastHighlight,
  } = useBookmarks();

  // Carica l'indice dei capitoli e il testo pre-indicizzato delle 321 pagine
  useEffect(() => {
    let active = true;
    fetch(METADATA_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load metadata");
        return res.json() as Promise<PdfMetadata>;
      })
      .then((data) => {
        if (!active) return;
        if (data.outline) setOutline(data.outline);
        if (data.pagesText) setPagesText(data.pagesText);
        if (data.numPages) setNumPages(data.numPages);
        if (data.pageWidth && data.pageHeight) {
          setPageIntrinsicSize({
            width: data.pageWidth,
            height: data.pageHeight,
          });
        }
      })
      .catch(() => {
        // Il viewer funziona comunque anche senza metadata statico
      });

    return () => {
      active = false;
    };
  }, [setNumPages, setPageIntrinsicSize]);

  // Scorciatoie da tastiera globali (inclusi tasti rapidi Zoom senza mouse: Z / X / + / - / 0, H per evidenziatore, Ctrl+Z per annullare ultima evidenziazione)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const lowerKey = e.key.toLowerCase();

      const target = e.target as HTMLElement | null;
      const isInputFocused =
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable);

      // Intercetta Ctrl+F / Cmd+F per aprire la ricerca interna sul PDF
      if ((e.ctrlKey || e.metaKey) && lowerKey === "f") {
        e.preventDefault();
        openSearch();
        return;
      }

      // Intercetta Ctrl+Z / Cmd+Z (fuori dai campi di testo) per annullare l'ultima evidenziazione errata
      if (
        !isInputFocused &&
        (e.ctrlKey || e.metaKey) &&
        !e.shiftKey &&
        lowerKey === "z"
      ) {
        if (canUndoHighlight) {
          e.preventDefault();
          undoLastHighlight();
        }
        return;
      }

      // Intercetta Ctrl/Cmd + (+ / - / 0) per fare zoom sul PDF invece che sull'interfaccia browser
      if (e.ctrlKey || e.metaKey) {
        if (e.key === "+" || e.key === "=") {
          e.preventDefault();
          zoomIn();
          return;
        }
        if (e.key === "-" || e.key === "_") {
          e.preventDefault();
          zoomOut();
          return;
        }
        if (e.key === "0") {
          e.preventDefault();
          resetZoom();
          return;
        }
      }

      if (isInputFocused) return;

      if (e.key === "Escape" && isAreaHighlightMode) {
        e.preventDefault();
        setIsAreaHighlightMode(false);
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextPage();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevPage();
      } else if (e.key === "+" || e.key === "=" || lowerKey === "z") {
        e.preventDefault();
        zoomIn();
      } else if (e.key === "-" || e.key === "_" || lowerKey === "x") {
        e.preventDefault();
        zoomOut();
      } else if (e.key === "0") {
        e.preventDefault();
        resetZoom();
      } else if (lowerKey === "b") {
        e.preventDefault();
        toggleBookmark(currentPage, activeChapter);
      } else if (lowerKey === "h") {
        e.preventDefault();
        setIsAreaHighlightMode((prev) => !prev);
      } else if (lowerKey === "i") {
        e.preventDefault();
        setIsSidebarOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [
    openSearch,
    nextPage,
    prevPage,
    zoomIn,
    zoomOut,
    resetZoom,
    toggleBookmark,
    currentPage,
    activeChapter,
    isAreaHighlightMode,
    canUndoHighlight,
    undoLastHighlight,
  ]);

  const handleToggleCurrentBookmark = useCallback(() => {
    toggleBookmark(currentPage, activeChapter);
  }, [toggleBookmark, currentPage, activeChapter]);

  const handleToggleAreaHighlightMode = useCallback(() => {
    setIsAreaHighlightMode((prev) => !prev);
  }, []);

  const handleAddHighlightBookmark = useCallback(
    (input: AddHighlightBookmarkInput) => {
      const chapterTitle =
        input.chapterTitle ?? resolveChapterForPage(outline, input.pageNumber);
      addHighlightBookmark({
        ...input,
        chapterTitle,
      });
    },
    [addHighlightBookmark, outline]
  );

  const handleSelectBookmark = useCallback(
    (bm: BookmarkItem) => {
      goToPage(bm.pageNumber);
      if (bm.rects && bm.rects.length > 0) {
        focusHighlight(bm.id);
      }
    },
    [goToPage, focusHighlight]
  );

  const rootThemeClasses =
    resolvedTheme === "dark"
      ? "dark bg-[#110d0b] text-[#ede2d0]"
      : resolvedTheme === "sepia"
      ? "bg-[#e3d2b0] text-[#2a180d]"
      : "bg-[#f3ecde] text-[#24160e]";

  return (
    <div
      data-dnd-theme={resolvedTheme}
      className={`h-dvh w-full flex flex-col overflow-hidden transition-colors duration-200 ${rootThemeClasses}`}
    >
      {/* Barra di controllo superiore (Desktop) + Bottom Bar (Mobile) */}
      <ControlBar
        currentPage={currentPage}
        spreadPages={spreadPages}
        numPages={numPages}
        activeChapter={activeChapter}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        zoomPercentage={zoomPercentage}
        zoomMode={zoomMode}
        onZoomIn={zoomIn}
        onZoomOut={zoomOut}
        onFitToWidth={fitToWidth}
        onFitToPage={fitToPage}
        onGoToPage={goToPage}
        onPrevPage={prevPage}
        onNextPage={nextPage}
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        isSearchOpen={isSearchOpen}
        onToggleSearch={toggleSearch}
        searchMatchesCount={matches.length}
        isBookmarked={isPageBookmarked(currentPage)}
        onToggleBookmark={handleToggleCurrentBookmark}
        isAreaHighlightMode={isAreaHighlightMode}
        onToggleAreaHighlightMode={handleToggleAreaHighlightMode}
        highlightColors={highlightColors}
        activeHighlightColor={
          highlightColors.some((c) => c.id === activeHighlightColor)
            ? activeHighlightColor
            : highlightColors[0]?.id ?? "yellow"
        }
        onSelectHighlightColor={setActiveHighlightColor}
        onOpenColorManager={() => setIsColorManagerOpen(true)}
        canUndoHighlight={canUndoHighlight}
        lastHighlightLabel={lastHighlight?.label}
        onUndoLastHighlight={undoLastHighlight}
        themeMode={themeMode}
        resolvedTheme={resolvedTheme}
        onThemeChange={setThemeMode}
      />

      {/* Area Centrale: Sidebar Indice + Visualizzatore PDF + Modale Ricerca */}
      <div className="relative flex-1 flex min-h-0 overflow-hidden">
        <SidebarIndex
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          outline={outline}
          currentPage={currentPage}
          activeChapter={activeChapter}
          onSelectPage={goToPage}
          onSelectBookmark={handleSelectBookmark}
          bookmarks={bookmarks}
          highlightColors={highlightColors}
          onOpenColorManager={() => setIsColorManagerOpen(true)}
          isCurrentPageBookmarked={isPageBookmarked(currentPage)}
          onToggleCurrentPageBookmark={handleToggleCurrentBookmark}
          onRemoveBookmark={removeBookmark}
          onUpdateBookmarkLabel={updateBookmarkLabel}
          onUpdateBookmarkColor={updateBookmarkColor}
          isAreaHighlightMode={isAreaHighlightMode}
          onToggleAreaHighlightMode={handleToggleAreaHighlightMode}
          canUndoHighlight={canUndoHighlight}
          lastHighlightLabel={lastHighlight?.label}
          onUndoLastHighlight={undoLastHighlight}
          resolvedTheme={resolvedTheme}
        />

        <main className="flex-1 flex flex-col min-w-0 min-h-0 relative">
          <PdfViewer
            fileUrl={PDF_FILE_URL}
            numPages={numPages}
            onDocumentLoadSuccess={setNumPages}
            currentPage={currentPage}
            spreadPages={spreadPages}
            isTwoPageSpread={isTwoPageSpread}
            turnAnimation={turnAnimation}
            viewMode={viewMode}
            effectiveScale={effectiveScale}
            wheelZoomInContinuous={wheelZoomInContinuous}
            onToggleWheelZoomInContinuous={() =>
              setWheelZoomInContinuous((prev) => !prev)
            }
            onZoomIn={zoomIn}
            onZoomOut={zoomOut}
            onSetExactZoom={setExactZoom}
            onResetZoom={resetZoom}
            onDoubleTapZoom={toggleDoubleTapZoom}
            pageIntrinsicWidth={pageIntrinsicSize.width || DEFAULT_PDF_WIDTH}
            pageIntrinsicHeight={
              pageIntrinsicSize.height || DEFAULT_PDF_HEIGHT
            }
            onContainerResize={setContainerDimensions}
            registerScrollHandler={registerScrollHandler}
            onViewportPageChange={onViewportPageChange}
            onPrevPage={prevPage}
            onNextPage={nextPage}
            searchQuery={debouncedQuery}
            exactWord={exactWord}
            caseSensitive={caseSensitive}
            activeMatch={activeMatch}
            matchesByPage={matchesByPage}
            highlightsByPage={highlightsByPage}
            highlightColors={highlightColors}
            onOpenColorManager={() => setIsColorManagerOpen(true)}
            focusedHighlightId={focusedHighlightId}
            isAreaHighlightMode={isAreaHighlightMode}
            onToggleAreaHighlightMode={handleToggleAreaHighlightMode}
            activeHighlightColor={
              highlightColors.some((c) => c.id === activeHighlightColor)
                ? activeHighlightColor
                : highlightColors[0]?.id ?? "yellow"
            }
            onSelectHighlightColor={setActiveHighlightColor}
            canUndoHighlight={canUndoHighlight}
            lastHighlightLabel={lastHighlight?.label}
            onUndoLastHighlight={undoLastHighlight}
            onAddHighlightBookmark={handleAddHighlightBookmark}
            onUpdateHighlightColor={updateBookmarkColor}
            onUpdateHighlightLabel={updateBookmarkLabel}
            onRemoveHighlight={removeBookmark}
            resolvedTheme={resolvedTheme}
          />
        </main>

        <SearchModal
          isOpen={isSearchOpen}
          onClose={closeSearch}
          query={query}
          onQueryChange={setQuery}
          exactWord={exactWord}
          onToggleExactWord={() => setExactWord((prev) => !prev)}
          caseSensitive={caseSensitive}
          onToggleCaseSensitive={() => setCaseSensitive((prev) => !prev)}
          matches={matches}
          pagesWithMatchesCount={pagesWithMatchesCount}
          activeMatchIndex={activeMatchIndex}
          onSelectMatch={selectMatch}
          onNextMatch={nextMatch}
          onPrevMatch={prevMatch}
          onClearSearch={clearSearch}
          resolvedTheme={resolvedTheme}
        />

        <HighlightColorManagerModal
          isOpen={isColorManagerOpen}
          onClose={() => setIsColorManagerOpen(false)}
          highlightColors={highlightColors}
          activeHighlightColor={
            highlightColors.some((c) => c.id === activeHighlightColor)
              ? activeHighlightColor
              : highlightColors[0]?.id ?? "yellow"
          }
          onSelectHighlightColor={setActiveHighlightColor}
          onAddHighlightColor={addHighlightColor}
          onUpdateHighlightColorMeta={updateHighlightColorMeta}
          onRemoveHighlightColor={removeHighlightColor}
          onResetHighlightColors={resetHighlightColors}
          resolvedTheme={resolvedTheme}
        />
      </div>
    </div>
  );
}
