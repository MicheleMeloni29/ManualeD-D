"use client";

import React, { useState, useEffect, useRef } from "react";
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
  Plus,
  Palette,
  RotateCcw,
  X,
  Check,
  Shield,
  CloudCheck,
  CloudOff,
  RefreshCw,
  LogOut,
  UserCheck,
  Crown,
} from "lucide-react";
import type {
  HighlightColor,
  HighlightColorConfig,
  ThemeMode,
  ViewMode,
  ZoomMode,
} from "@/types/pdf";
import type {
  AuthSession,
  StorageBackendType,
  SyncStatus,
} from "@/types/account";

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
  highlightColors: HighlightColorConfig[];
  activeHighlightColor: HighlightColor;
  onSelectHighlightColor: (color: HighlightColor) => void;
  onOpenColorManager: () => void;
  canUndoHighlight: boolean;
  lastHighlightLabel?: string;
  onUndoLastHighlight: () => void;
  themeMode: ThemeMode;
  resolvedTheme: "light" | "dark" | "sepia";
  onThemeChange: (mode: ThemeMode) => void;
  isCharacterSheetOpen: boolean;
  onToggleCharacterSheet: () => void;
  characterName?: string;
  session?: AuthSession | null;
  syncStatus?: SyncStatus;
  lastSavedAt?: number | null;
  storageBackend?: StorageBackendType;
  onSyncNow?: () => void;
  onLogout?: () => void;
}

const THEME_OPTIONS = [
  {
    id: "system",
    icon: Monitor,
    shortLabel: "Auto",
    fullLabel: "Sistema (Automatico)",
  },
  {
    id: "light",
    icon: Sun,
    shortLabel: "Chiaro",
    fullLabel: "Chiaro (Pergamena Reale)",
  },
  {
    id: "sepia",
    icon: Sparkles,
    shortLabel: "Seppia",
    fullLabel: "Seppia (Grimorio 5e)",
  },
  {
    id: "dark",
    icon: Moon,
    shortLabel: "Scuro",
    fullLabel: "Scuro (Dungeon)",
  },
] as const;

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
  highlightColors,
  activeHighlightColor,
  onSelectHighlightColor,
  onOpenColorManager,
  canUndoHighlight,
  lastHighlightLabel,
  onUndoLastHighlight,
  themeMode,
  resolvedTheme,
  onThemeChange,
  isCharacterSheetOpen,
  onToggleCharacterSheet,
  characterName,
  session,
  syncStatus = "idle",
  lastSavedAt,
  storageBackend = "local-file",
  onSyncNow,
  onLogout,
}: ControlBarProps) {
  const [editingPageInput, setEditingPageInput] = useState<string | null>(null);
  const [mobileZoomSheetOpen, setMobileZoomSheetOpen] =
    useState<boolean>(false);
  const [desktopThemeMenuOpen, setDesktopThemeMenuOpen] =
    useState<boolean>(false);
  const [desktopAccountMenuOpen, setDesktopAccountMenuOpen] =
    useState<boolean>(false);

  const desktopThemeRef = useRef<HTMLDivElement | null>(null);
  const desktopAccountRef = useRef<HTMLDivElement | null>(null);

  const pageInput = editingPageInput ?? String(currentPage);

  // Chiude i menu desktop cliccando fuori o premendo Escape
  useEffect(() => {
    if (!desktopThemeMenuOpen && !desktopAccountMenuOpen) return;

    const handlePointerDown = (e: MouseEvent) => {
      if (
        desktopThemeRef.current &&
        !desktopThemeRef.current.contains(e.target as Node)
      ) {
        setDesktopThemeMenuOpen(false);
      }
      if (
        desktopAccountRef.current &&
        !desktopAccountRef.current.contains(e.target as Node)
      ) {
        setDesktopAccountMenuOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDesktopThemeMenuOpen(false);
        setDesktopAccountMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [desktopThemeMenuOpen, desktopAccountMenuOpen]);

  // Chiude il menu impostazioni mobile premendo Escape
  useEffect(() => {
    if (!mobileZoomSheetOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileZoomSheetOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileZoomSheetOpen]);

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

  const inputSurface =
    resolvedTheme === "dark"
      ? "bg-[#1c1612] border-[#785926] text-[#f5ebd9]"
      : resolvedTheme === "sepia"
      ? "bg-[#fbf4e3] border-[#b88b3a] text-[#2a180d]"
      : "bg-[#fffdf8] border-[#c8a050] text-[#24160e]";

  const activeDndBtn =
    "bg-[#8c1d14] text-[#fdf6e6] border border-[#d4a74a]/85 shadow-xs";

  const currentThemeOption =
    THEME_OPTIONS.find((t) => t.id === themeMode) ?? THEME_OPTIONS[0];
  const CurrentThemeIcon = currentThemeOption.icon;

  return (
    <>
      {/* TOP BAR: Pulita ed essenziale sotto 1024px, completa e bilanciata su Desktop (>=1024px) */}
      <header
        className={`relative sticky top-0 z-30 h-14 border-b backdrop-blur-md transition-colors duration-200 select-none flex flex-col justify-between ${barSurface}`}
      >
        <div className="flex-1 min-h-0 w-full max-w-[1800px] mx-auto px-3 sm:px-4 xl:px-5 flex items-center justify-between gap-2 lg:gap-3">
          {/* Sezione Sinistra: Toggle Indice (su Desktop) + Titolo Libro + Capitolo Attivo */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1 lg:min-w-[190px] xl:min-w-[240px]">
            {/* Su Desktop (>=1024px) il pulsante Indice sta nella Top Bar; sotto 1024px è nella Bottom Bar */}
            <button
              type="button"
              onClick={onToggleSidebar}
              aria-label="Apri o chiudi indice"
              title="Indice e Segnalibri (Scorciatoia: I)"
              className={`hidden lg:flex p-2 rounded-lg transition-colors items-center gap-1.5 text-xs font-medium shrink-0 ${
                isSidebarOpen ? activeDndBtn : subtleBg
              }`}
            >
              <PanelLeft className="w-4 h-4 shrink-0" />
              <span className="hidden xl:inline">Indice</span>
            </button>

            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <BookOpen className="w-3.5 h-3.5 text-[#9e1b1b] dark:text-[#d4a74a] shrink-0" />
                <h1 className="text-xs sm:text-sm font-bold tracking-tight truncate">
                  Manuale del Giocatore
                </h1>
              </div>
              {activeChapter && (
                <p className="text-[11px] opacity-75 truncate">
                  {activeChapter}
                </p>
              )}
            </div>
          </div>

          {/* Sezione Centrale (Desktop >= 1024px): Navigazione Pagine, Zoom & Modalità Vista */}
          <div className="hidden lg:flex items-center gap-1.5 xl:gap-2.5 shrink-0">
            {/* 1. Navigazione Pagine */}
            <div
              className={`flex items-center gap-1 p-1 rounded-xl border shrink-0 ${pillGroupSurface}`}
            >
              <button
                type="button"
                onClick={onPrevPage}
                disabled={currentPage <= 1}
                aria-label="Pagina precedente"
                title="Pagina precedente (Freccia Sinistra)"
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <form
                onSubmit={handlePageSubmit}
                className="flex items-center gap-1 px-1 text-xs font-medium whitespace-nowrap shrink-0"
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
                  className={`w-11 h-7 text-center rounded-md font-mono text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-[#9e1b1b]/60 transition shrink-0 ${inputSurface}`}
                />
                {spreadPages.length === 2 && (
                  <span
                    title={`Facciata aperta: pagine ${spreadPages[0]} e ${spreadPages[1]}`}
                    className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#9e1b1b]/10 text-[#8c1d14] dark:bg-[#d4a74a]/15 dark:text-[#e5be67] font-semibold whitespace-nowrap shrink-0"
                  >
                    –{spreadPages[1]}
                  </span>
                )}
                <span className="opacity-65 font-mono whitespace-nowrap shrink-0">
                  / {numPages}
                </span>
              </form>

              <button
                type="button"
                onClick={onNextPage}
                disabled={lastVisiblePage >= numPages}
                aria-label="Pagina successiva"
                title="Pagina successiva (Freccia Destra)"
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition shrink-0"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            {/* 2. Controlli Zoom + Adatta */}
            <div
              className={`flex items-center gap-0.5 xl:gap-1 p-1 rounded-xl border shrink-0 ${pillGroupSurface}`}
            >
              <button
                type="button"
                onClick={onZoomOut}
                aria-label="Riduci zoom"
                title="Zoom Out (-)"
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition shrink-0"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <span className="w-11 text-center font-mono text-xs font-semibold whitespace-nowrap shrink-0">
                {zoomPercentage}%
              </span>

              <button
                type="button"
                onClick={onZoomIn}
                aria-label="Aumenta zoom"
                title="Zoom In (+)"
                className="p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition shrink-0"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              <div className="h-4 w-px bg-current opacity-20 mx-0.5 shrink-0" />

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
                className={`px-2 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1 transition whitespace-nowrap shrink-0 ${
                  zoomMode !== "custom"
                    ? activeDndBtn
                    : "hover:bg-black/5 dark:hover:bg-white/10 opacity-80"
                }`}
              >
                <Maximize2 className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden 2xl:inline">
                  {zoomMode === "fit-page" ? "Pagina" : "Adatta"}
                </span>
              </button>
            </div>

            {/* 3. Selettore Modalità di Visualizzazione: Continuo | Singola | Libro */}
            <div
              className={`flex items-center gap-0.5 p-1 rounded-xl border shrink-0 ${pillGroupSurface}`}
            >
              <button
                type="button"
                onClick={() => onViewModeChange("continuous")}
                title="Scorrimento verticale continuo"
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
                  viewMode === "continuous"
                    ? activeDndBtn
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <Rows3 className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">Continuo</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("single")}
                title="Modalità Pagina Singola"
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
                  viewMode === "single"
                    ? activeDndBtn
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <FileText className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">Singola</span>
              </button>
              <button
                type="button"
                onClick={() => onViewModeChange("book")}
                title="Modalità Libro Sfogliabile 3D (Doppia pagina)"
                className={`px-2 xl:px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition whitespace-nowrap shrink-0 ${
                  viewMode === "book"
                    ? activeDndBtn
                    : "opacity-75 hover:opacity-100"
                }`}
              >
                <BookOpen className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden xl:inline">Libro</span>
              </button>
            </div>
          </div>

          {/* Sezione Destra: Azioni rapide su Mobile/Tablet (Segnalibro + Evidenziatore) e set completo compatto su Desktop */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Strumento Evidenziatore ad Area (Stabile in larghezza: i colori sono nel banner flottante) */}
            <div
              className={`flex items-center gap-1 p-1 rounded-xl border shrink-0 ${pillGroupSurface}`}
            >
              <button
                type="button"
                onClick={onToggleAreaHighlightMode}
                aria-label="Attiva o disattiva evidenziatore ad area"
                title="Evidenziatore ad Area (Riquadra una parte della pagina per salvarla nei segnalibri — Scorciatoia: H)"
                className={`px-2 sm:px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium whitespace-nowrap shrink-0 ${
                  isAreaHighlightMode
                    ? "bg-amber-400 text-stone-950 font-semibold shadow-xs ring-2 ring-amber-500/60"
                    : subtleBg
                }`}
              >
                <Highlighter className="w-4 h-4 shrink-0" />
                <span className="hidden 2xl:inline">Evidenzia</span>
              </button>

              {/* Pulsante "+" Gestione Colori nella Top Bar solo su Desktop (su Mobile/Tablet è nella Bottom Bar) */}
              <button
                type="button"
                onClick={onOpenColorManager}
                aria-label="Gestisci colori e categorie evidenziatore"
                title="Crea nuovi colori evidenziatore o rinomina le categorie (es. Azioni, Azioni Bonus, Incantesimi)"
                className="hidden lg:flex p-1.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/10 opacity-75 hover:opacity-100 transition items-center justify-center shrink-0"
              >
                <Plus className="w-4 h-4" />
              </button>

              {/* Tasto Back / Annulla ultima evidenziazione */}
              {canUndoHighlight && (
                <button
                  type="button"
                  onClick={onUndoLastHighlight}
                  aria-label="Annulla ultima evidenziazione"
                  title={`Annulla ultima evidenziazione${
                    lastHighlightLabel ? `: "${lastHighlightLabel}"` : ""
                  } (Ctrl+Z)`}
                  className="p-1.5 rounded-lg transition flex items-center justify-center hover:bg-[#8c1d14]/15 text-[#8c1d14] dark:text-[#e5be67] dark:hover:bg-[#d4a74a]/15 active:scale-95 shrink-0"
                >
                  <Undo2 className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Pulsante Segnalibro Pagina Corrente (Sempre accessibile nella Top Bar) */}
            <button
              type="button"
              onClick={onToggleBookmark}
              aria-label="Aggiungi o rimuovi segnalibro per questa pagina"
              title={
                isBookmarked
                  ? "Rimuovi segnalibro da questa pagina (B)"
                  : "Salva pagina intera nei segnalibri (B)"
              }
              className={`p-2 rounded-lg transition-colors shrink-0 ${
                isBookmarked ? activeDndBtn : subtleBg
              }`}
            >
              <Bookmark
                className={`w-4 h-4 ${isBookmarked ? "fill-current" : ""}`}
              />
            </button>

            {/* Pulsante Ricerca Avanzata (Nella Top Bar solo su Desktop >=1024px; sotto 1024px è nella Bottom Bar) */}
            <button
              type="button"
              onClick={onToggleSearch}
              aria-label="Cerca nel documento"
              title="Cerca nel manuale (Ctrl+F)"
              className={`hidden lg:flex px-2.5 py-2 rounded-lg transition-colors items-center gap-1.5 text-xs font-medium whitespace-nowrap shrink-0 ${
                isSearchOpen ? activeDndBtn : subtleBg
              }`}
            >
              <Search className="w-4 h-4 shrink-0" />
              <span className="hidden xl:inline">Cerca</span>
              {searchMatchesCount > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full bg-[#d4a74a] text-[#1c120a] font-bold">
                  {searchMatchesCount}
                </span>
              )}
            </button>

            {/* Pulsante Scheda Personaggio D&D 5e (Desktop >=1024px) */}
            <button
              type="button"
              onClick={onToggleCharacterSheet}
              aria-label="Apri o chiudi la Scheda Personaggio"
              title="Scheda Personaggio D&D 5e (Tasto rapido: C)"
              className={`hidden lg:flex px-2.5 py-2 rounded-lg transition-colors items-center gap-1.5 text-xs font-semibold whitespace-nowrap shrink-0 cursor-pointer ${
                isCharacterSheetOpen ? activeDndBtn : subtleBg
              }`}
            >
              <Shield className="w-4 h-4 shrink-0" />
              <span className="max-w-[110px] truncate">
                {characterName?.trim() || "Scheda PG"}
              </span>
            </button>

            {/* Selettore Tema Compatto con Popover su Desktop (>=1024px) */}
            <div ref={desktopThemeRef} className="relative hidden lg:block shrink-0">
              <button
                type="button"
                onClick={() => {
                  setDesktopAccountMenuOpen(false);
                  setDesktopThemeMenuOpen((v) => !v);
                }}
                aria-label={`Tema di lettura: ${currentThemeOption.fullLabel}`}
                title={`Tema di lettura (${currentThemeOption.fullLabel})`}
                className={`px-2.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium whitespace-nowrap ${
                  desktopThemeMenuOpen ? activeDndBtn : subtleBg
                }`}
              >
                <CurrentThemeIcon className="w-4 h-4 shrink-0" />
                <span className="hidden 2xl:inline">
                  {currentThemeOption.shortLabel}
                </span>
              </button>

              {desktopThemeMenuOpen && (
                <div
                  className={`absolute right-0 top-full mt-2 w-56 rounded-2xl border p-2 shadow-2xl backdrop-blur-xl z-50 ${barSurface}`}
                >
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider opacity-65">
                    Tema di Lettura D&amp;D
                  </div>
                  <div className="flex flex-col gap-1 mt-0.5">
                    {THEME_OPTIONS.map(({ id, icon: Icon, fullLabel }) => {
                      const isActive = themeMode === id;
                      return (
                        <button
                          key={id}
                          type="button"
                          onClick={() => {
                            onThemeChange(id);
                            setDesktopThemeMenuOpen(false);
                          }}
                          className={`w-full px-2.5 py-2 rounded-xl text-xs font-medium flex items-center justify-between gap-2 transition ${
                            isActive
                              ? activeDndBtn
                              : "hover:bg-black/5 dark:hover:bg-white/10 opacity-85 hover:opacity-100"
                          }`}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <Icon className="w-4 h-4 shrink-0" />
                            <span className="truncate">{fullLabel}</span>
                          </span>
                          {isActive && <Check className="w-3.5 h-3.5 shrink-0" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Menu Profilo Account & Sincronizzazione Cloud (Desktop >=1024px) */}
            {session && (
              <div
                ref={desktopAccountRef}
                className="relative hidden lg:block shrink-0"
              >
                <button
                  type="button"
                  onClick={() => {
                    setDesktopThemeMenuOpen(false);
                    setDesktopAccountMenuOpen((v) => !v);
                  }}
                  aria-label="Profilo Account e Salvataggio Cloud"
                  title={`Account: ${session.characterName} (Master: ${session.masterName})`}
                  className={`px-2.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 text-xs font-medium whitespace-nowrap cursor-pointer ${
                    desktopAccountMenuOpen ? activeDndBtn : subtleBg
                  }`}
                >
                  {syncStatus === "syncing" ? (
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500 shrink-0" />
                  ) : syncStatus === "error" ? (
                    <CloudOff className="w-3.5 h-3.5 text-red-500 shrink-0" />
                  ) : (
                    <CloudCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                  )}
                  <span className="hidden xl:inline max-w-[96px] truncate font-semibold">
                    {session.characterName}
                  </span>
                </button>

                {desktopAccountMenuOpen && (
                  <div
                    className={`absolute right-0 top-full mt-2 w-68 rounded-2xl border p-3 shadow-2xl backdrop-blur-xl z-50 ${barSurface}`}
                  >
                    <div className="flex items-start justify-between gap-2 pb-2.5 border-b border-[#c59b27]/30">
                      <div className="min-w-0">
                        <div className="text-[10px] font-bold uppercase tracking-wider opacity-60 flex items-center gap-1">
                          <UserCheck className="w-3 h-3" />
                          <span>{session.slotLabel}</span>
                        </div>
                        <div className="text-sm font-bold truncate mt-0.5">
                          {session.characterName}
                        </div>
                        <div className="text-[11px] opacity-75 flex items-center gap-1 mt-0.5">
                          <Crown className="w-3 h-3 text-[#8c1d14] dark:text-[#d4a74a] shrink-0" />
                          <span className="truncate">
                            Master: <strong>{session.masterName}</strong>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stato sincronizzazione */}
                    <div className="py-2.5 border-b border-[#c59b27]/30 flex flex-col gap-1 text-xs">
                      <div className="flex items-center justify-between gap-2">
                        <span className="opacity-70">Stato salvataggi:</span>
                        <span className="font-semibold flex items-center gap-1">
                          {syncStatus === "syncing" ? (
                            <>
                              <RefreshCw className="w-3 h-3 animate-spin text-amber-500" />
                              <span>Salvataggio...</span>
                            </>
                          ) : syncStatus === "error" ? (
                            <>
                              <CloudOff className="w-3 h-3 text-red-500" />
                              <span className="text-red-500">Errore rete</span>
                            </>
                          ) : (
                            <>
                              <CloudCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                              <span>Sincronizzato</span>
                            </>
                          )}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 text-[11px] opacity-65">
                        <span>Archivio:</span>
                        <span>
                          {storageBackend === "upstash-redis"
                            ? "Cloud (Upstash Redis)"
                            : "Server Locale (.data)"}
                        </span>
                      </div>
                      {lastSavedAt && (
                        <div className="flex items-center justify-between gap-2 text-[11px] opacity-65">
                          <span>Ultimo salvataggio:</span>
                          <span className="font-mono">
                            {new Date(lastSavedAt).toLocaleTimeString("it-IT", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Azioni Account */}
                    <div className="flex flex-col gap-1.5 pt-2.5">
                      {onSyncNow && (
                        <button
                          type="button"
                          onClick={() => {
                            onSyncNow();
                          }}
                          disabled={syncStatus === "syncing"}
                          className={`w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${subtleBg}`}
                        >
                          <RefreshCw
                            className={`w-3.5 h-3.5 ${
                              syncStatus === "syncing" ? "animate-spin" : ""
                            }`}
                          />
                          <span>Sincronizza ora</span>
                        </button>
                      )}

                      {onLogout && (
                        <button
                          type="button"
                          onClick={() => {
                            setDesktopAccountMenuOpen(false);
                            onLogout();
                          }}
                          className="w-full px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 text-red-700 dark:text-red-300 hover:bg-red-500/15 transition cursor-pointer"
                        >
                          <LogOut className="w-3.5 h-3.5" />
                          <span>Cambia Account / Esci</span>
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Filetto inferiore D&D 5e (Cremisi e Oro Antico) con barra di avanzamento lettura integrata */}
        <div className="w-full h-[3px] bg-[#c59b27]/25 overflow-hidden shrink-0">
          <div
            className="h-full bg-gradient-to-r from-[#8c1d14] via-[#b8281c] to-[#d4a74a] transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </header>

      {/* POPOVER IMPOSTAZIONI VISTA / ZOOM / TEMA / COLORI SU MOBILE & TABLET (< 1024px) */}
      {mobileZoomSheetOpen && (
        <>
          {/* Backdrop per chiudere il menù toccando fuori */}
          <div
            onClick={() => setMobileZoomSheetOpen(false)}
            aria-hidden="true"
            className="lg:hidden fixed inset-0 z-30 bg-black/25 backdrop-blur-[1px]"
          />

          <div
            role="dialog"
            aria-label="Impostazioni vista, zoom e tema"
            className={`lg:hidden fixed bottom-20 left-1/2 -translate-x-1/2 sm:left-auto sm:right-4 sm:translate-x-0 w-[calc(100vw-1rem)] sm:w-[calc(100vw-1.5rem)] max-w-sm z-40 rounded-2xl border p-3 sm:p-4 shadow-2xl backdrop-blur-xl ${barSurface}`}
          >
            {/* Header del Popover */}
            <div className="flex items-center justify-between pb-2.5 mb-3 border-b border-[#c59b27]/30">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4 text-[#8c1d14] dark:text-[#d4a74a]" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  Impostazioni di Lettura
                </span>
              </div>
              <button
                type="button"
                onClick={() => setMobileZoomSheetOpen(false)}
                aria-label="Chiudi menu impostazioni"
                className="p-1 rounded-lg opacity-65 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* 1. Sezione Livello Zoom */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-semibold uppercase tracking-wider opacity-70">
                    Livello Zoom
                  </span>
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded-md bg-black/5 dark:bg-white/10">
                    {zoomPercentage}%
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                  <button
                    type="button"
                    onClick={onZoomOut}
                    aria-label="Riduci zoom"
                    className={`py-2 rounded-xl flex items-center justify-center active:scale-95 transition ${subtleBg}`}
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onZoomIn}
                    aria-label="Aumenta zoom"
                    className={`py-2 rounded-xl flex items-center justify-center active:scale-95 transition ${subtleBg}`}
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={onFitToWidth}
                    className={`py-2 px-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center transition ${
                      zoomMode === "fit-width" ? activeDndBtn : subtleBg
                    }`}
                  >
                    <span className="truncate">Larghezza</span>
                  </button>
                  <button
                    type="button"
                    onClick={onFitToPage}
                    className={`py-2 px-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1 transition ${
                      zoomMode === "fit-page" ? activeDndBtn : subtleBg
                    }`}
                  >
                    <RotateCcw className="w-3 h-3 shrink-0 hidden sm:inline" />
                    <span className="truncate">Pagina</span>
                  </button>
                </div>
              </div>

              {/* 2. Sezione Modalità di Vista (Griglia a 3 colonne a tutta larghezza) */}
              <div className="flex flex-col gap-2 pt-2.5 border-t border-[#c59b27]/30">
                <span className="text-[11px] font-semibold uppercase tracking-wider opacity-70">
                  Modalità di Vista
                </span>
                <div className="grid grid-cols-3 gap-1 sm:gap-1.5">
                  <button
                    type="button"
                    onClick={() => onViewModeChange("continuous")}
                    className={`py-2 px-1.5 sm:px-2 rounded-xl text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1 sm:gap-1.5 transition ${
                      viewMode === "continuous" ? activeDndBtn : subtleBg
                    }`}
                  >
                    <Rows3 className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Continuo</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewModeChange("single")}
                    className={`py-2 px-1.5 sm:px-2 rounded-xl text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1 sm:gap-1.5 transition ${
                      viewMode === "single" ? activeDndBtn : subtleBg
                    }`}
                  >
                    <FileText className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Singola</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewModeChange("book")}
                    className={`py-2 px-1.5 sm:px-2 rounded-xl text-[11px] sm:text-xs font-medium flex items-center justify-center gap-1 sm:gap-1.5 transition ${
                      viewMode === "book" ? activeDndBtn : subtleBg
                    }`}
                  >
                    <BookOpen className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">Libro</span>
                  </button>
                </div>
              </div>

              {/* 3. Sezione Tema D&D (Griglia a 4 colonne a tutta larghezza) */}
              <div className="flex flex-col gap-2 pt-2.5 border-t border-[#c59b27]/30">
                <span className="text-[11px] font-semibold uppercase tracking-wider opacity-70">
                  Tema di Lettura D&amp;D
                </span>
                <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
                  {THEME_OPTIONS.map(({ id, icon: Icon, shortLabel }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => onThemeChange(id)}
                      className={`py-2 px-1 rounded-xl text-xs font-medium flex flex-col items-center justify-center gap-1 transition ${
                        themeMode === id ? activeDndBtn : subtleBg
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5 shrink-0" />
                      <span className="text-[11px] leading-none">
                        {shortLabel}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* 4. Sezione Colori e Categorie Evidenziatore */}
              <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#c59b27]/30">
                <div className="flex items-center gap-1.5 overflow-x-auto py-1">
                  {highlightColors.map((c) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => onSelectHighlightColor(c.id)}
                      title={c.label}
                      aria-label={c.label}
                      style={{
                        backgroundColor: c.hex,
                        boxShadow:
                          activeHighlightColor === c.id
                            ? `0 0 0 2px ${c.borderStyle}`
                            : undefined,
                      }}
                      className={`w-5 h-5 rounded-full border border-black/20 shrink-0 transition-transform ${
                        activeHighlightColor === c.id
                          ? "scale-115"
                          : "opacity-70 hover:opacity-100"
                      }`}
                    />
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setMobileZoomSheetOpen(false);
                    onOpenColorManager();
                  }}
                  className={`px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-semibold flex items-center gap-1.5 shrink-0 transition ${subtleBg}`}
                >
                  <Palette className="w-3.5 h-3.5 shrink-0" />
                  <span>Gestisci colori</span>
                </button>
              </div>

              {/* 5. Sezione Profilo Account & Cloud Sync (Mobile/Tablet) */}
              {session && (
                <div className="flex items-center justify-between gap-2 pt-2.5 border-t border-[#c59b27]/30">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold truncate">
                      {syncStatus === "syncing" ? (
                        <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500 shrink-0" />
                      ) : syncStatus === "error" ? (
                        <CloudOff className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      ) : (
                        <CloudCheck className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                      )}
                      <span className="truncate">{session.characterName}</span>
                    </div>
                    <div className="text-[10px] opacity-65 truncate">
                      Master: {session.masterName}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {onSyncNow && (
                      <button
                        type="button"
                        onClick={() => onSyncNow()}
                        title="Sincronizza salvataggi"
                        className={`p-2 rounded-xl transition ${subtleBg}`}
                      >
                        <RefreshCw
                          className={`w-3.5 h-3.5 ${
                            syncStatus === "syncing" ? "animate-spin" : ""
                          }`}
                        />
                      </button>
                    )}
                    {onLogout && (
                      <button
                        type="button"
                        onClick={() => {
                          setMobileZoomSheetOpen(false);
                          onLogout();
                        }}
                        className="px-2.5 py-1.5 rounded-xl text-[11px] font-semibold flex items-center gap-1 bg-red-500/15 text-red-700 dark:text-red-300 transition"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Esci</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* BOTTOM BAR MOBILE & TABLET (< 1024px): Compatta anche su 320px (Mobile S) */}
      <nav
        aria-label="Controlli di navigazione mobile e tablet"
        className={`lg:hidden fixed bottom-0 inset-x-0 z-30 h-16 border-t backdrop-blur-lg px-2 sm:px-4 flex items-center justify-between gap-1 sm:gap-3 select-none ${barSurface}`}
      >
        {/* Zona Sinistra: Indice e Ricerca */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileZoomSheetOpen(false);
              onToggleSidebar();
            }}
            aria-label="Indice capitoli e segnalibri"
            title="Indice e Segnalibri"
            className={`p-2 sm:p-2.5 rounded-xl flex items-center justify-center transition ${
              isSidebarOpen ? activeDndBtn : subtleBg
            }`}
          >
            <PanelLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            type="button"
            onClick={() => {
              setMobileZoomSheetOpen(false);
              onToggleSearch();
            }}
            aria-label="Ricerca nel testo"
            title="Cerca nel manuale"
            className={`p-2 sm:p-2.5 rounded-xl relative flex items-center justify-center transition ${
              isSearchOpen ? activeDndBtn : subtleBg
            }`}
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
            {searchMatchesCount > 0 && (
              <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#d4a74a] text-[#1c120a] text-[10px] font-bold flex items-center justify-center">
                {searchMatchesCount > 99 ? "99+" : searchMatchesCount}
              </span>
            )}
          </button>
        </div>

        {/* Zona Centrale: Paginazione su singola riga con whitespace-nowrap */}
        <div
          className={`flex items-center gap-0.5 sm:gap-1.5 px-1 sm:px-2.5 py-1 rounded-2xl border shrink-0 ${pillGroupSurface}`}
        >
          <button
            type="button"
            onClick={onPrevPage}
            disabled={currentPage <= 1}
            aria-label="Pagina precedente"
            className="p-1.5 sm:p-2 rounded-xl disabled:opacity-30 active:scale-95 transition shrink-0"
          >
            <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <form
            onSubmit={handlePageSubmit}
            className="flex items-center gap-1 text-[11px] sm:text-xs font-mono whitespace-nowrap shrink-0"
          >
            <input
              type="text"
              inputMode="numeric"
              value={pageInput}
              onChange={(e) => setEditingPageInput(e.target.value)}
              onBlur={handlePageSubmit}
              aria-label="Vai a pagina"
              className={`w-10 sm:w-12 h-7 sm:h-8 text-center rounded-lg font-semibold border text-xs shrink-0 ${inputSurface}`}
            />
            {spreadPages.length === 2 && (
              <span className="hidden sm:inline font-mono text-[11px] px-1 py-0.5 rounded bg-[#9e1b1b]/10 text-[#8c1d14] dark:bg-[#d4a74a]/15 dark:text-[#e5be67] font-semibold whitespace-nowrap shrink-0">
                –{spreadPages[1]}
              </span>
            )}
            <span className="opacity-65 whitespace-nowrap shrink-0">
              / {numPages}
            </span>
          </form>

          <button
            type="button"
            onClick={onNextPage}
            disabled={lastVisiblePage >= numPages}
            aria-label="Pagina successiva"
            className="p-1.5 sm:p-2 rounded-xl disabled:opacity-30 active:scale-95 transition shrink-0"
          >
            <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>

        {/* Zona Destra: Scheda PG + Impostazioni Vista/Zoom/Tema/Colori */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              setMobileZoomSheetOpen(false);
              onToggleCharacterSheet();
            }}
            aria-label="Apri o chiudi la Scheda Personaggio"
            title="Scheda Personaggio D&D 5e"
            className={`p-2 sm:p-2.5 rounded-xl flex items-center justify-center transition ${
              isCharacterSheetOpen ? activeDndBtn : subtleBg
            }`}
          >
            <Shield className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>

          <button
            type="button"
            onClick={() => setMobileZoomSheetOpen((v) => !v)}
            aria-label="Opzioni zoom, vista, tema e colori"
            title="Impostazioni Vista, Zoom, Tema e Colori"
            className={`p-2 sm:p-2.5 rounded-xl flex items-center justify-center transition ${
              mobileZoomSheetOpen ? activeDndBtn : subtleBg
            }`}
          >
            <SlidersHorizontal className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </div>
      </nav>
    </>
  );
}
