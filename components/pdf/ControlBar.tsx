"use client";

import React, { useState } from "react";
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Search,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Bookmark,
  Highlighter,
  PanelLeft,
  Sun,
  Moon,
  Monitor,
  Sparkles,
  Rows3,
  FileText,
  SlidersHorizontal,
  Undo2,
} from "lucide-react";
import type {
  HighlightColor,
  ThemeMode,
  ViewMode,
  ZoomMode,
} from "@/types/pdf";
import { HIGHLIGHT_COLORS } from "@/types/pdf";

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
  isAreaHighlightMode: boolean;
  onToggleAreaHighlightMode: () => void;
  activeHighlightColor: HighlightColor;
  onSelectHighlightColor: (color: HighlightColor) => void;
  canUndoHighlight: boolean;
  lastHighlightLabel?: string;
  onUndoLastHighlight: () => void;
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
  isAreaHighlightMode,
  onToggleAreaHighlightMode,
  activeHighlightColor,
  onSelectHighlightColor,
  canUndoHighlight,
  lastHighlightLabel,
  onUndoLastHighlight,
  themeMode,
  resolvedTheme,
  onThemeChange,
}: ControlBarProps) {
  const [editingPageInput, setEditingPageInput] = useState<string | null>(null);
  const [mobileZoomSheetOpen, setMobileZoomSheetOpen] =
    useState<boolean>(false);

  const pageInput = editingPageInput ?? String(currentPage);

  const handlePageSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingPageInput === null) return;
    const parsed = parseInt(editingPageInput, 10);
    setEditingPageInput(null);
    if (!Number.isNaN(parsed) && parsed >= 1 && parsed <= numPages) {
      onGoToPage(parsed);
    }
  };

  const lastVisiblePage =
    spreadPages.length > 0
      ? spreadPages[spreadPages.length - 1]
      : currentPage;
  const progressPercentage =
    numPages > 0 ? Math.min(100, (lastVisiblePage / numPages) * 100) : 0;

  // Classi dinamiche basate sul tema D&D 5e (Chiaro Pergamena Reale, Seppia Grimorio, Scuro Dungeon)
  const barSurface =
    resolvedTheme === "dark"
      ? "bg-[#1b1512]/95 text-[#ede2d0] dnd-frame-dark"
      : resolvedTheme === "sepia"
      ? "bg-[#f2e4c6]/95 text-[#2a180d] dnd-frame-sepia"
      : "bg-[#fbf6eb]/95 text-[#24160e] dnd-frame-light";

  const subtleBg =
    resolvedTheme === "dark"
      ? "bg-[#281f1a] hover:bg-[#342821] text-[#e6d8c3] border border-[#6e5023]/45"
      : resolvedTheme === "sepia"
      ? "bg-[#e5d4b0] hover:bg-[#dac59b] text-[#2b190e] border border-[#b58938]/45"
      : "bg-[#f0e6d2] hover:bg-[#e5d7bc] text-[#2b1a10] border border-[#c9a358]/45";

  const pillGroupSurface =
    resolvedTheme === "dark"
      ? "bg-[#120e0b]/90 border-[#6e5023]/65 shadow-[inset_0_0_0_1px_rgba(197,155,39,0.12)]"
      : resolvedTheme === "sepia"
      ? "bg-[#e7d6b3]/90 border-[#b38432]/65 shadow-[inset_0_0_0_1px_rgba(255,244,214,0.45)]"
      : "bg-[#f2e8d5]/90 border-[#c8a050]/60 shadow-[inset_0_0_0_1px_rgba(255,252,242,0.65)]";

  const activeDndBtn =
    "bg-[#8c1d14] text-[#fdf6e6] border border-[#d4a74a]/85 shadow-xs";

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
              className={`p-2 rounded-lg transition-colors flex items-center gap-2 text-xs sm:text-sm font-medium ${
                isSidebarOpen ? activeDndBtn : subtleBg
              }`}
            >
              <PanelLeft className="w-4 h-4 shrink-0" />
              <span className="hidden xl:inline">Indice</span>
            </button>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-[#9e1b1b] dark:text-[#d4a74a] shrink-0 hidden sm:inline" />
                <h1 className="text-xs sm:text-sm font-bold tracking-tight truncate">
                  Manuale del Giocatore
                </h1>
              </div>
              {activeChapter && (
                <p className="text-[11px] opacity-70 truncate max-w-[180px] sm:max-w-[240px] 2xl:max-w-[340px]">
                  {activeChapter}
                </p>
              )}
            </div>
          </div>

          {/* Sezione Centrale (Desktop): Navigazione Pagine, Zoom & Modalità Vista */}
          <div className="hidden md:flex items-center gap-2 lg:gap-2.5">
            {/* Navigazione Pagine */}
            <div
              className={`flex items-center gap-1 p-1 rounded-xl border ${pillGroupSurface}`}
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
                  className="opacity-65 hidden 2xl:inline"
                >
                  Pag.
                </label>
                <input
                  id="desktop-page-input"
                  type="text"
                  inputMode="numeric"
                  value={pageInput}
                  onChange={(e) => setEditingPageInput(e.target.value)}
                  onBlur={handlePageSubmit}
                  aria-label="Numero di pagina"
                  className={`w-12 h-7 text-center rounded-md font-mono text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-[#9e1b1b]/60 transition ${
                    resolvedTheme === "dark"
                      ? "bg-[#1c1612] border-[#785926] text-[#f5ebd9]"
                      : resolvedTheme === "sepia"
                      ? "bg-[#fbf4e3] border-[#b88b3a] text-[#2a180d]"
                      : "bg-[#fffdf8] border-[#c8a050] text-[#24160e]"
                  }`}
                />
                {spreadPages.length === 2 && (
                  <span
                    title={`Facciata aperta: pagine ${spreadPages[0]} e ${spreadPages[1]}`}
                    className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#9e1b1b]/10 text-[#8c1d14] dark:bg-[#d4a74a]/15 dark:text-[#e5be67] font-semibold"
                  >
                    –{spreadPages[1]}
                  </span>
                )}
                <span className="opacity-65 font-mono">/ {numPages}</span>
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
              className={`flex items-center gap-1 p-1 rounded-xl border ${pillGroupSurface}`}
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

              <span className="w-12 text-center font-mono text-xs font-semibold">
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

              <div className="h-4 w-px bg-current opacity-20 mx-0.5" />

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
                    ? activeDndBtn
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
              className={`flex items-center p-1 rounded-xl border ${pillGroupSurface}`}
            >
              <button
                type="button"
                onClick={() => onViewModeChange("continuous")}
                title="Scorrimento verticale continuo"
                className={`px-2.5 py-1 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                  viewMode === "continuous"
                    ? activeDndBtn
                    : "opacity-75 hover:opacity-100"
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
                    ? activeDndBtn
                    : "opacity-75 hover:opacity-100"
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
                    ? activeDndBtn
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span className="hidden lg:inline">Libro</span>
              </button>
            </div>
          </div>

          {/* Sezione Destra: Evidenziatore ad Area + Back, Segnalibro Pagina, Ricerca, Tema */}
          <div className="flex items-center gap-1.5">
            {/* Strumento Evidenziatore ad Area + Selettore rapido colore fluo + Tasto Back/Annulla */}
            <div
              className={`flex items-center gap-1 rounded-xl ${
                isAreaHighlightMode || canUndoHighlight
                  ? `p-1 border ${pillGroupSurface}`
                  : ""
              }`}
            >
              <button
                type="button"
                onClick={onToggleAreaHighlightMode}
                aria-label="Attiva o disattiva evidenziatore ad area"
                title="Evidenziatore ad Area (Riquadra una parte della pagina per salvarla nei segnalibri — Scorciatoia: H)"
                className={`px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium ${
                  isAreaHighlightMode
                    ? "bg-amber-400 text-stone-950 font-semibold shadow-xs ring-2 ring-amber-500/60"
                    : subtleBg
                }`}
              >
                <Highlighter className="w-4 h-4" />
                <span className="hidden xl:inline">Evidenzia</span>
              </button>

              {isAreaHighlightMode && (
                <div className="hidden sm:flex items-center gap-1 px-1.5 py-1 rounded-lg bg-black/5 dark:bg-white/10">
                  {HIGHLIGHT_COLORS.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelectHighlightColor(c.id)}
                      title={c.label}
                      aria-label={c.label}
                      className={`w-4 h-4 rounded-full transition-transform ${
                        c.swatchClass
                      } ${
                        activeHighlightColor === c.id
                          ? "scale-125 ring-2"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
              )}

              {/* Tasto Back / Annulla ultima evidenziazione nel menù evidenziatore */}
              {(isAreaHighlightMode || canUndoHighlight) && (
                <button
                  type="button"
                  onClick={onUndoLastHighlight}
                  disabled={!canUndoHighlight}
                  aria-label="Annulla ultima evidenziazione"
                  title={
                    canUndoHighlight
                      ? `Annulla ultima evidenziazione${
                          lastHighlightLabel ? `: "${lastHighlightLabel}"` : ""
                        } (Ctrl+Z)`
                      : "Nessuna evidenziazione da annullare"
                  }
                  className={`p-1.5 rounded-lg transition flex items-center gap-1 text-xs font-medium ${
                    canUndoHighlight
                      ? "hover:bg-[#8c1d14]/15 text-[#8c1d14] dark:text-[#e5be67] dark:hover:bg-[#d4a74a]/15 active:scale-95"
                      : "opacity-30 pointer-events-none"
                  }`}
                >
                  <Undo2 className="w-4 h-4" />
                  <span className="hidden 2xl:inline text-[11px] font-semibold">
                    Indietro
                  </span>
                </button>
              )}
            </div>

            {/* Pulsante Segnalibro Pagina Corrente */}
            <button
              type="button"
              onClick={onToggleBookmark}
              aria-label="Aggiungi o rimuovi segnalibro per questa pagina"
              title={
                isBookmarked
                  ? "Rimuovi segnalibro da questa pagina (B)"
                  : "Salva pagina intera nei segnalibri (B)"
              }
              className={`p-2 rounded-lg transition-colors ${
                isBookmarked ? activeDndBtn : subtleBg
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
                isSearchOpen ? activeDndBtn : subtleBg
              }`}
            >
              <Search className="w-4 h-4" />
              <span className="hidden sm:inline">Cerca</span>
              {searchMatchesCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#d4a74a] text-[#1c120a] font-bold">
                  {searchMatchesCount}
                </span>
              )}
            </button>

            {/* Selettore Tema di Lettura D&D */}
            <div
              className={`hidden sm:flex items-center p-1 rounded-xl border ${pillGroupSurface}`}
            >
              {(
                [
                  { id: "system", icon: Monitor, label: "Sistema" },
                  { id: "light", icon: Sun, label: "Chiaro (Pergamena Reale)" },
                  { id: "sepia", icon: Sparkles, label: "Seppia (Grimorio 5e)" },
                  { id: "dark", icon: Moon, label: "Scuro (Dungeon)" },
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
                      ? activeDndBtn
                      : "opacity-65 hover:opacity-100"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Filetto inferiore D&D 5e (Cremisi e Oro Antico) con barra di avanzamento lettura */}
        <div className="w-full h-[3px] bg-[#c59b27]/25 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#8c1d14] via-[#b8281c] to-[#d4a74a] transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* POPOVER IMPOSTAZIONI VISTA/ZOOM SU MOBILE */}
      {mobileZoomSheetOpen && (
        <div
          className={`md:hidden fixed inset-x-3 bottom-20 z-40 rounded-2xl border p-4 shadow-2xl backdrop-blur-xl animate-in fade-in slide-in-from-bottom-3 ${barSurface}`}
        >
          <div className="flex flex-col gap-3">
            {/* Riga Zoom */}
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Livello Zoom
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onZoomOut}
                  className={`p-2 rounded-xl active:scale-95 ${subtleBg}`}
                >
                  <ZoomOut className="w-4 h-4" />
                </button>
                <span className="w-14 text-center font-mono text-sm font-semibold">
                  {zoomPercentage}%
                </span>
                <button
                  type="button"
                  onClick={onZoomIn}
                  className={`p-2 rounded-xl active:scale-95 ${subtleBg}`}
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={onFitToWidth}
                  className={`px-3 py-2 rounded-xl text-xs font-semibold ${
                    zoomMode !== "custom" ? activeDndBtn : subtleBg
                  }`}
                >
                  Adatta
                </button>
              </div>
            </div>

            {/* Riga Modalità Lettura (Continuo | Singola | Libro) */}
            <div className="flex items-center justify-between pt-2 border-t border-[#c59b27]/30">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Vista
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onViewModeChange("continuous")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 ${
                    viewMode === "continuous" ? activeDndBtn : subtleBg
                  }`}
                >
                  <Rows3 className="w-3.5 h-3.5" />
                  Continuo
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange("single")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 ${
                    viewMode === "single" ? activeDndBtn : subtleBg
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Singola
                </button>
                <button
                  type="button"
                  onClick={() => onViewModeChange("book")}
                  className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1 ${
                    viewMode === "book" ? activeDndBtn : subtleBg
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Libro
                </button>
              </div>
            </div>

            {/* Riga Tema */}
            <div className="flex items-center justify-between pt-2 border-t border-[#c59b27]/30">
              <span className="text-xs font-semibold uppercase tracking-wider opacity-70">
                Tema D&amp;D
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
                      themeMode === t.id ? activeDndBtn : subtleBg
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
            isSidebarOpen ? activeDndBtn : subtleBg
          }`}
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* Controllo Pagina Precedente / Input Diretto / Pagina Successiva */}
        <div
          className={`flex items-center gap-1.5 px-2 py-1 rounded-2xl border ${pillGroupSurface}`}
        >
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
              onChange={(e) => setEditingPageInput(e.target.value)}
              onBlur={handlePageSubmit}
              aria-label="Vai a pagina"
              className={`w-12 h-8 text-center rounded-lg font-semibold border text-xs ${
                resolvedTheme === "dark"
                  ? "bg-[#1c1612] border-[#785926] text-[#f5ebd9]"
                  : resolvedTheme === "sepia"
                  ? "bg-[#fbf4e3] border-[#b88b3a] text-[#2a180d]"
                  : "bg-[#fffdf8] border-[#c8a050] text-[#24160e]"
              }`}
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
              mobileZoomSheetOpen ? activeDndBtn : subtleBg
            }`}
          >
            <SlidersHorizontal className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={onToggleSearch}
            aria-label="Ricerca nel testo"
            className={`p-2.5 rounded-xl relative ${
              isSearchOpen ? activeDndBtn : subtleBg
            }`}
          >
            <Search className="w-5 h-5" />
            {searchMatchesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#d4a74a] text-[#1c120a] text-[10px] font-bold flex items-center justify-center">
                {searchMatchesCount > 99 ? "99" : searchMatchesCount}
              </span>
            )}
          </button>
        </div>
      </nav>
    </>
  );
}
