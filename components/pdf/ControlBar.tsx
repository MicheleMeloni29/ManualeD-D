"use client";

import React, { useState, useEffect } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Bookmark,
  PanelLeft,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Rows3,
  FileText,
  SlidersHorizontal,
} from "lucide-react";
import type { ThemeMode, ViewMode, ZoomMode } from "@/types/pdf";

export interface ControlBarProps {
  currentPage: number;
  spreadPages: number[];
  numPages: number;
  activeChapter?: string;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  zoomPercentage: number;
  zoomMode: ZoomMode;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onFitToWidth: () => void;
  onFitToPage: () => void;
  onGoToPage: (page: number) => void;
  onPrevPage: () => void;
  onNextPage: () => void;
  isSidebarOpen: boolean;
  onToggleSidebar: () => void;
  isSearchOpen: boolean;
  onToggleSearch: () => void;
  searchMatchesCount: number;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  themeMode: ThemeMode;
  resolvedTheme: "light" | "dark" | "sepia";
  onThemeChange: (mode: ThemeMode) => void;
}

export function ControlBar({
  currentPage,
  spreadPages,
  numPages,
  activeChapter,
  viewMode,
  onViewModeChange,
  zoomPercentage,
  zoomMode,
  onZoomIn,
  onZoomOut,
  onFitToWidth,
  onFitToPage,
  onGoToPage,
  onPrevPage,
  onNextPage,
  isSidebarOpen,
  onToggleSidebar,
  isSearchOpen,
  onToggleSearch,
  searchMatchesCount,
  isBookmarked,
  onToggleBookmark,
  themeMode,
  resolvedTheme,
  onThemeChange,
}: ControlBarProps) {
  const [pageInput, setPageInput] = useState<string>(String(currentPage));
  const [mobileZoomSheetOpen, setMobileZoomSheetOpen] =
    useState<boolean>(false);

  // Sincronizza l'input testuale quando la pagina corrente cambia
  useEffect(() => {
    setPageInput(String(currentPage));
  }, [currentPage]);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = parseInt(pageInput, 10);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
      onGoToPage(parsed);
    } else {
      setPageInput(String(currentPage));
    }
  };

  const lastVisiblePage =
    spreadPages.length > 0
      ? spreadPages[spreadPages.length - 1]
      : currentPage;
  const progressPercentage =
    numPages > 0 ? Math.min(100, (lastVisiblePage / numPages) * 100) : 0;

  // Classi dinamiche basate sul tema di lettura
  const barSurface =
    resolvedTheme === "dark"
      ? "bg-zinc-900/90 border-zinc-800 text-zinc-100"
      : resolvedTheme === "sepia"
      ? "bg-[#f4ecd8]/95 border-[#dfcfb0] text-stone-900"
      : "bg-white/90 border-stone-200 text-stone-900";

  const subtleBg =
    resolvedTheme === "dark"
      ? "bg-zinc-800/80 hover:bg-zinc-700/80 text-zinc-200"
      : resolvedTheme === "sepia"
      ? "bg-[#e8dec5] hover:bg-[#ddd0b1] text-stone-800"
      : "bg-stone-100 hover:bg-stone-200/80 text-stone-700";

  return (
    <>
      {/* TOP BAR (Desktop completa + Mobile compatta con titolo e capitolo attivo) */}
      <header
        className={`sticky top-0 z-30 h-14 border-b backdrop-blur-md transition-colors duration-200 select-none ${barSurface}`}
      >
        <div className="h-full max-w-[1800px] mx-auto px-3 sm:px-5 flex items-center justify-between gap-2">
          {/* Sezione Sinistra: Toggle Indice + Titolo Libro + Capitolo Attivo */}
          <div className="flex items-center gap-2.5 min-w-0">
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Apri o chiudi indice"
              title="Indice e Segnalibri (Scorciatoia: I)"
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium ${
                isSidebarOpen
                  ? "bg-stone-800 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : subtleBg
              }`}
            >
              <PanelLeft className="w-4 h-4 shrink-0" />
              <span className="hidden xl:inline">Indice</span>
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 opacity-60 shrink-0 hidden sm:inline" />
                <h1 className="text-xs sm:text-sm font-semibold tracking-tight truncate">
                  Manuale del Giocatore
                </h1>
              </div>
              {activeChapter && (
                <p className="text-[11px] opacity-65 truncate max-w-[180px] sm:max-w-[240px] 2xl:max-w-[340px]">
                  {activeChapter}
                </p>
              )}
            </div>
          </div>

          {/* Sezione Centrale (Desktop): Navigazione Pagine, Zoom & Modalità Vista */}
          <div className="hidden md:flex items-center gap-2 lg:gap-2.5">
            {/* Navigazione Pagine */}
            <div
              className={`flex items-center gap-1 p-1 rounded-xl border ${
                resolvedTheme === "dark"
                  ? "bg-zinc-950/60 border-zinc-800"
                  : resolvedTheme === "sepia"
                  ? "bg-[#efe4ca] border-[#d9c7a3]"
                  : "bg-stone-50 border-stone-200/90"
              }`}
            >
              <button
                type="button"
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                aria-label="Pagina precedente"
                title="Pagina precedente (Freccia Sinistra)"
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <form
                onSubmit={handlePageSubmit}
                className="flex items-center gap-1.5 px-1.5 text-xs font-medium"
              >
                <label
                  htmlFor="desktop-page-input"
                  className="opacity-60 hidden 2xl:inline"
                >
                  Pag.
                </label>
                <input
                  id="desktop-page-input"
                  type="text"
                  inputMode="numeric"
                  value={pageInput}
                  onChange={(e) => setPageInput(e.target.value)}
                  onBlur={handlePageSubmit}
                  aria-label="Numero di pagina"
                  className={`w-12 h-7 text-center rounded-md font-mono text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-stone-500 transition ${
                    resolvedTheme === "dark"
                      ? "bg-zinc-900 border-zinc-700 text-zinc-100"
                      : resolvedTheme === "sepia"
                      ? "bg-[#fbf6ea] border-[#cbb894] text-stone-900"
                      : "bg-white border-stone-300 text-stone-900"
                  }`}
                />
                {spreadPages.length === 2 && (
                  <span
                    title={`Facciata aperta: pagine ${spreadPages[0]} e ${spreadPages[1]}`}
                    className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10 opacity-80"
                  >
                    –{spreadPages[1]}
                  </span>
                )}
                <span className="opacity-60 font-mono">/ {numPages}</span>
              </form>

              <button
                type="button"
                onClick={onNextPage}
                disabled={lastVisiblePage >= numPages}
                aria-label="Pagina successiva"
                title="Pagina successiva (Freccia Destra)"
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* Controlli Zoom + Adatta */}
            <div
              className={`flex items-center gap-1 p-1 rounded-xl border ${
                resolvedTheme === "dark"
                  ? "bg-zinc-950/60 border-zinc-800"
                  : resolvedTheme === "sepia"
                  ? "bg-[#efe4ca] border-[#d9c7a3]"
                  : "bg-stone-50 border-stone-200/90"
              }`}
            >
              <button
                type="button"
                onClick={onZoomOut}
                aria-label="Riduci zoom"
                title="Zoom Out (-)"
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="w-12 text-center font-mono text-xs font-medium">
                {zoomPercentage}%
              </span>

              <button
                type="button"
                onClick={onZoomIn}
                aria-label="Aumenta zoom"
                title="Zoom In (+)"
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-current opacity-15 mx-0.5" />

              <button
                type="button"
                onClick={
                  zoomMode === "fit-width" ? onFitToPage : onFitToWidth
                }
                title={
                  zoomMode === "fit-width"
                    ? "Adatta pagina/libro allo schermo"
                    : "Adatta alla larghezza"
                }
                className={`px-2 py-1 rounded-lg text-xs font-medium flex items-center gap-1 transition ${
                  zoomMode !== "custom"
                    ? "bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                    : "hover:bg-black/5 dark:hover:bg-white/10 opacity-80"
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5" />
                <span className="hidden xl:inline">
                  {zoomMode === "fit-page" ? "Pagina" : "Adatta"}
                </span>
              </button>
            </div>

            {/* Selettore Modalità di Visualizzazione: Continuo | Singola | Libro Sfogliabile */}
            <div
              className={`flex items-center p-1 rounded-xl border ${
                resolvedTheme === "dark"
                  ? "bg-zinc-950/60 border-zinc-800"
                  : resolvedTheme === "sepia"
                  ? "bg-[#efe4ca] border-[#d9c7a3]"
                  : "bg-stone-50 border-stone-200/90"
              }`}
            >
              <button
                type="button"
                onClick={() => onViewModeChange("continuous")}
                title="Scorrimento verticale continuo"
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  viewMode === "continuous"
                    ? "bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <Rows3 className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Continuo</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("single")}
                title="Modalità Pagina Singola"
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  viewMode === "single"
                    ? "bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <FileText className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Singola</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("book")}
                title="Modalità Libro Sfogliabile 3D (Doppia pagina)"
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  viewMode === "book"
                    ? "bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                    : "opacity-70 hover:opacity-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Libro</span>
              </button>
            </div>
          </div>

          {/* Sezione Destra: Segnalibro, Ricerca, Tema */}
          <div className="flex items-center gap-1.5">
            {/* Pulsante Segnalibro Pagina Corrente */}
            <button
              type="button"
              onClick={onToggleBookmark}
              aria-label="Aggiungi o rimuovi segnalibro per questa pagina"
              title={
                isBookmarked
                  ? "Rimuovi segnalibro da questa pagina (B)"
                  : "Salva pagina nei segnalibri (B)"
              }
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked
                  ? "bg-amber-500/20 text-amber-600 dark:text-amber-400"
                  : subtleBg
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
              />
            </button>

            {/* Pulsante Ricerca Avanzata */}
            <button
              type="button"
              onClick={onToggleSearch}
              aria-label="Cerca nel documento"
              title="Cerca nel manuale (Ctrl+F)"
              className={`px-2.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
                isSearchOpen
                  ? "bg-stone-800 text-white dark:bg-zinc-100 dark:text-zinc-900"
                  : subtleBg
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Cerca</span>
              {searchMatchesCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-amber-500 text-stone-950 font-bold">
                  {searchMatchesCount}
                </span>
              )}
            </button>

            {/* Selettore Tema di Lettura */}
            <div
              className={`hidden sm:flex items-center p-1 rounded-xl border ${
                resolvedTheme === "dark"
                  ? "bg-zinc-950/60 border-zinc-800"
                  : resolvedTheme === "sepia"
                  ? "bg-[#efe4ca] border-[#d9c7a3]"
                  : "bg-stone-50 border-stone-200/90"
              }`}
            >
              {(
                [
                  { id: "system", icon: Monitor, label: "Sistema" },
                  { id: "light", icon: Sun, label: "Chiaro" },
                  { id: "sepia", icon: Sparkles, label: "Seppia" },
                  { id: "dark", icon: Moon, label: "Scuro" },
                ] as const
              ).map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => onThemeChange(id)}
                  title={`Tema: ${label}`}
                  aria-label={`Tema ${label}`}
                  className={`p-1.5 rounded-lg transition ${
                    themeMode === id
                      ? "bg-stone-800 text-white dark:bg-zinc-200 dark:text-zinc-900"
                      : "opacity-60 hover:opacity-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Barra sottile di avanzamento lettura sul bordo inferiore dell'header */}
        <div className="w-full h-[2px] bg-black/5 dark:bg-white/5 overflow-hidden">
          <div
            className="h-full bg-stone-600 dark:bg-zinc-300 transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* POPOVER IMPOSTAZIONI VISTA/ZOOM SU MOBILE */}
      {mobileZoomSheetOpen && (
        <div className="md:hidden fixed inset-x-3 bottom-20 z-40 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl bg-white/95 dark:bg-zinc-900/95 border-stone-200 dark:border-zinc-800 text-stone-900 dark:text-zinc-100 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex flex-col gap-3">
            {/* Riga Zoom */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                Livello Zoom
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onZoomOut}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-zinc-800 active:scale-95"
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="w-14 text-center font-mono text-sm font-semibold">
                  {zoomPercentage}%
                </span>
                <button
                  type="button"
                  onClick={onZoomIn}
                  className="p-2 rounded-xl bg-stone-100 dark:bg-zinc-800 active:scale-95"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onFitToWidth}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                    zoomMode !== "custom"
                      ? "bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-stone-100 dark:bg-zinc-800"
                  }`}
                >
                  Adatta
                </button>
              </div>
            </div>

            {/* Riga Modalità Lettura (Continuo | Singola | Libro) */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                Vista
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onViewModeChange("continuous")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 ${
                    viewMode === "continuous"
                      ? "bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-stone-100 dark:bg-zinc-800"
                  }`}
                >
                  <Rows3 className="w-3.5 h-3.5" />
                  Continuo
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange("single")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 ${
                    viewMode === "single"
                      ? "bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-stone-100 dark:bg-zinc-800"
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Singola
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange("book")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 ${
                    viewMode === "book"
                      ? "bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                      : "bg-stone-100 dark:bg-zinc-800"
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Libro
                </button>
              </div>
            </div>

            {/* Riga Tema */}
            <div className="flex items-center justify-between pt-2 border-t border-stone-200/60 dark:border-zinc-800">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-60">
                Tema Vista
              </span>
              <div className="flex items-center gap-1.5">
                {(
                  [
                    { id: "system", label: "Auto" },
                    { id: "light", label: "Chiaro" },
                    { id: "sepia", label: "Seppia" },
                    { id: "dark", label: "Scuro" },
                  ] as const
                ).map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => onThemeChange(t.id)}
                    className={`px-2.5 py-1.5 rounded-xl text-xs font-medium ${
                      themeMode === t.id
                        ? "bg-stone-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
                        : "bg-stone-100 dark:bg-zinc-800"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOTTOM BAR MOBILE-FIRST (A portata di pollice su smartphone) */}
      <nav
        aria-label="Controlli di navigazione mobile"
        className={`md:hidden fixed bottom-0 inset-x-0 z-30 h-16 border-t backdrop-blur-lg px-3 flex items-center justify-between gap-2 select-none ${barSurface}`}
      >
        <button
          type="button"
          onClick={onToggleSidebar}
          aria-label="Indice capitoli"
          className={`p-2.5 rounded-xl flex items-center justify-center ${
            isSidebarOpen
              ? "bg-stone-800 text-white dark:bg-zinc-100 dark:text-zinc-900"
              : subtleBg
          }`}
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* Controllo Pagina Precedente / Input Diretto / Pagina Successiva */}
        <div className="flex items-center gap-1.5 bg-black/5 dark:bg-white/5 px-2 py-1 rounded-2xl">
          <button
            type="button"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            aria-label="Pagina precedente"
            className="p-2 rounded-xl disabled:opacity-30 active:scale-95"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <form
            onSubmit={handlePageSubmit}
            className="flex items-center gap-1 text-xs font-mono"
          >
            <input
              type="text"
              inputMode="numeric"
              value={pageInput}
              onChange={(e) => setPageInput(e.target.value)}
              onBlur={handlePageSubmit}
              aria-label="Vai a pagina"
              className="w-12 h-8 text-center rounded-lg font-semibold bg-white dark:bg-zinc-800 border border-stone-300 dark:border-zinc-700 text-stone-900 dark:text-zinc-100 text-xs"
            />
            <span className="opacity-65">/ {numPages}</span>
          </form>

          <button
            type="button"
            onClick={onNextPage}
            disabled={lastVisiblePage >= numPages}
            aria-label="Pagina successiva"
            className="p-2 rounded-xl disabled:opacity-30 active:scale-95"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => setMobileZoomSheetOpen((v) => !v)}
            aria-label="Opzioni zoom e vista"
            className={`p-2.5 rounded-xl ${
              mobileZoomSheetOpen
                ? "bg-stone-800 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : subtleBg
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onToggleSearch}
            aria-label="Ricerca nel testo"
            className={`p-2.5 rounded-xl relative ${
              isSearchOpen
                ? "bg-stone-800 text-white dark:bg-zinc-100 dark:text-zinc-900"
                : subtleBg
            }`}
          >
            <Search className="w-5 h-5" />
            {searchMatchesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 text-[10px] font-bold flex items-center justify-center">
                {searchMatchesCount > 99 ? "99" : searchMatchesCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
