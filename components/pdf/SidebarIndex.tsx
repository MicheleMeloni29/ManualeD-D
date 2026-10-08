"use client";

import React, { useState, useMemo } from "react";
import {
  BookMarked,
  ChevronDown,
  ChevronRight,
  ListTree,
  Plus,
  Search,
  Trash2,
  X,
  Edit3,
  Check,
  Highlighter,
  Undo2,
} from "lucide-react";
import type {
  BookmarkItem,
  HighlightColor,
  OutlineItem,
} from "@/types/pdf";
import { HIGHLIGHT_COLORS, getHighlightColorConfig } from "@/types/pdf";

export interface SidebarIndexProps {
  isOpen: boolean;
  onClose: () => void;
  outline: OutlineItem[];
  currentPage: number;
  activeChapter?: string;
  onSelectPage: (pageNumber: number) => void;
  onSelectBookmark: (bookmark: BookmarkItem) => void;
  bookmarks: BookmarkItem[];
  isCurrentPageBookmarked: boolean;
  onToggleCurrentPageBookmark: () => void;
  onRemoveBookmark: (id: string) => void;
  onUpdateBookmarkLabel: (id: string, label: string) => void;
  onUpdateBookmarkColor: (id: string, color: HighlightColor) => void;
  isAreaHighlightMode: boolean;
  onToggleAreaHighlightMode: () => void;
  canUndoHighlight: boolean;
  lastHighlightLabel?: string;
  onUndoLastHighlight: () => void;
  resolvedTheme: "light" | "dark" | "sepia";
}

export function SidebarIndex({
  isOpen,
  onClose,
  outline,
  currentPage,
  activeChapter,
  onSelectPage,
  onSelectBookmark,
  bookmarks,
  isCurrentPageBookmarked,
  onToggleCurrentPageBookmark,
  onRemoveBookmark,
  onUpdateBookmarkLabel,
  onUpdateBookmarkColor,
  isAreaHighlightMode,
  onToggleAreaHighlightMode,
  canUndoHighlight,
  lastHighlightLabel,
  onUndoLastHighlight,
  resolvedTheme,
}: SidebarIndexProps) {
  const [activeTab, setActiveTab] = useState<"outline" | "bookmarks">(
    "outline"
  );
  const [filterText, setFilterText] = useState<string>("");
  const [colorFilter, setColorFilter] = useState<
    "all" | "page" | HighlightColor
  >("all");
  const [collapsedTitles, setCollapsedTitles] = useState<
    Record<string, boolean>
  >({});
  const [editingBookmarkId, setEditingBookmarkId] = useState<string | null>(
    null
  );
  const [editingLabel, setEditingLabel] = useState<string>("");

  const toggleCollapse = (title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setCollapsedTitles((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  // Filtra l'albero dei capitoli se l'utente digita nel campo filtro
  const filteredOutline = useMemo(() => {
    const q = filterText.trim().toLowerCase();
    if (!q) return outline;

    function filterNodes(nodes: OutlineItem[]): OutlineItem[] {
      const res: OutlineItem[] = [];
      for (const node of nodes) {
        const childMatches = filterNodes(node.items || []);
        const selfMatches = node.title.toLowerCase().includes(q);
        if (selfMatches || childMatches.length > 0) {
          res.push({
            ...node,
            items:
              selfMatches && childMatches.length === 0
                ? node.items
                : childMatches,
          });
        }
      }
      return res;
    }

    return filterNodes(outline);
  }, [outline, filterText]);

  // Filtra i segnalibri per colore o tipologia
  const filteredBookmarks = useMemo(() => {
    if (colorFilter === "all") return bookmarks;
    if (colorFilter === "page") {
      return bookmarks.filter((b) => !b.type || b.type === "page");
    }
    return bookmarks.filter((b) => b.color === colorFilter);
  }, [bookmarks, colorFilter]);

  const handlePageJump = (pageNumber: number) => {
    onSelectPage(pageNumber);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onClose();
    }
  };

  const handleBookmarkClick = (bm: BookmarkItem) => {
    onSelectBookmark(bm);
    if (typeof window !== "undefined" && window.innerWidth < 768) {
      onClose();
    }
  };

  const startEditing = (bm: BookmarkItem, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingBookmarkId(bm.id);
    setEditingLabel(bm.label);
  };

  const saveEditing = (id: string, e: React.FormEvent | React.MouseEvent) => {
    e.stopPropagation();
    onUpdateBookmarkLabel(id, editingLabel);
    setEditingBookmarkId(null);
  };

  if (!isOpen) return null;

  const panelBg =
    resolvedTheme === "dark"
      ? "bg-[#1a1411] text-[#ede2d0] dnd-frame-dark"
      : resolvedTheme === "sepia"
      ? "bg-[#f3e5c8] text-[#2a180d] dnd-frame-sepia"
      : "bg-[#fbf6eb] text-[#24160e] dnd-frame-light";

  const activeDndTab =
    "bg-[#8c1d14] text-[#fdf6e6] border border-[#d4a74a]/85 shadow-xs";

  return (
    <>
      {/* Backdrop su Mobile */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className="md:hidden fixed inset-0 z-40 bg-black/55 backdrop-blur-xs animate-in fade-in"
      />

      {/* Drawer su Mobile / Sidebar laterale su Desktop */}
      <aside
        aria-label="Indice del libro e segnalibri"
        className={`fixed md:static inset-y-0 left-0 z-50 md:z-20 w-[85vw] max-w-[330px] md:w-80 shrink-0 border-r flex flex-col h-full transition-colors select-none ${panelBg}`}
      >
        {/* Header Sidebar con Tab Switcher */}
        <div className="p-3 border-b border-[#c59b27]/35 flex flex-col gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 p-1 rounded-xl bg-black/5 dark:bg-white/5 border border-[#c59b27]/30 flex-1 mr-2">
              <button
                type="button"
                onClick={() => setActiveTab("outline")}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  activeTab === "outline"
                    ? activeDndTab
                    : "opacity-75 hover:opacity-100 border border-transparent"
                }`}
              >
                <ListTree className="w-3.5 h-3.5" />
                <span>Capitoli</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("bookmarks")}
                className={`flex-1 py-1.5 px-2.5 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition ${
                  activeTab === "bookmarks"
                    ? activeDndTab
                    : "opacity-75 hover:opacity-100 border border-transparent"
                }`}
              >
                <BookMarked className="w-3.5 h-3.5" />
                <span>Segnalibri</span>
                {bookmarks.length > 0 && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-[#d4a74a] text-[#1c120a] font-bold">
                    {bookmarks.length}
                  </span>
                )}
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Chiudi pannello indice"
              className="p-1.5 rounded-lg opacity-65 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/10"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Filtro rapido per l'indice dei capitoli */}
          {activeTab === "outline" && (
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={filterText}
                onChange={(e) => setFilterText(e.target.value)}
                placeholder="Filtra capitolo, razza, classe..."
                className="w-full pl-8 pr-7 py-1.5 rounded-lg text-xs bg-black/5 dark:bg-white/5 border border-[#c59b27]/35 focus:border-[#8c1d14] dark:focus:border-[#d4a74a] focus:outline-none"
              />
              {filterText && (
                <button
                  type="button"
                  onClick={() => setFilterText("")}
                  className="absolute right-2 top-1/2 -translate-y-1/2 opacity-50 hover:opacity-100"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {/* Barra filtri per Colore Fluo nel tab Segnalibri */}
          {activeTab === "bookmarks" && bookmarks.length > 0 && (
            <div className="flex items-center justify-between gap-1 pt-0.5">
              <button
                type="button"
                onClick={() => setColorFilter("all")}
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                  colorFilter === "all"
                    ? activeDndTab
                    : "opacity-70 hover:opacity-100 bg-black/5 dark:bg-white/5 border border-[#c59b27]/25"
                }`}
              >
                Tutti
              </button>

              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black/5 dark:bg-white/5 border border-[#c59b27]/25">
                {HIGHLIGHT_COLORS.map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() =>
                      setColorFilter((prev) =>
                        prev === c.id ? "all" : c.id
                      )
                    }
                    title={`Filtra per ${c.label}`}
                    aria-label={`Filtra per ${c.label}`}
                    className={`w-4 h-4 rounded-full transition-transform ${
                      c.swatchClass
                    } ${
                      colorFilter === c.id
                        ? "scale-125 ring-2"
                        : "opacity-70 hover:opacity-100"
                    }`}
                  />
                ))}
              </div>

              <button
                type="button"
                onClick={() =>
                  setColorFilter((prev) =>
                    prev === "page" ? "all" : "page"
                  )
                }
                className={`px-2 py-1 rounded-lg text-[11px] font-medium transition ${
                  colorFilter === "page"
                    ? activeDndTab
                    : "opacity-70 hover:opacity-100 bg-black/5 dark:bg-white/5 border border-[#c59b27]/25"
                }`}
              >
                Pagine
              </button>
            </div>
          )}
        </div>

        {/* Contenuto Scrollabile */}
        <div
          className={`flex-1 overflow-y-auto dnd-scrollbar-thin dnd-scrollbar-${resolvedTheme} p-2.5 space-y-1`}
        >
          {activeTab === "outline" ? (
            filteredOutline.length === 0 ? (
              <div className="py-12 px-4 text-center text-xs opacity-60">
                Nessuna sezione trovata per &ldquo;{filterText}&rdquo;.
              </div>
            ) : (
              filteredOutline.map((chapter) => {
                const hasSubItems =
                  chapter.items && chapter.items.length > 0;
                const isCollapsed =
                  !filterText && Boolean(collapsedTitles[chapter.title]);
                const isChapterActive = activeChapter === chapter.title;

                return (
                  <div
                    key={`${chapter.title}-${chapter.pageNumber}`}
                    className="space-y-0.5"
                  >
                    <div
                      onClick={() => handlePageJump(chapter.pageNumber)}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          handlePageJump(chapter.pageNumber);
                        }
                      }}
                      className={`group flex items-center justify-between gap-2 px-2.5 py-2 rounded-xl text-xs font-medium cursor-pointer transition ${
                        isChapterActive
                          ? `${activeDndTab} font-semibold`
                          : "hover:bg-[#c59b27]/15 border border-transparent"
                      }`}
                    >
                      <div className="flex items-center gap-1.5 min-w-0">
                        {hasSubItems ? (
                          <button
                            type="button"
                            onClick={(e) => toggleCollapse(chapter.title, e)}
                            aria-label="Espandi o comprimi sezione"
                            className="p-0.5 rounded hover:bg-black/10 dark:hover:bg-white/10"
                          >
                            {isCollapsed ? (
                              <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-70" />
                            ) : (
                              <ChevronDown className="w-3.5 h-3.5 shrink-0 opacity-70" />
                            )}
                          </button>
                        ) : (
                          <span className="w-4 shrink-0" />
                        )}
                        <span className="truncate">{chapter.title}</span>
                      </div>

                      <span
                        className={`font-mono text-[11px] px-1.5 py-0.5 rounded-md shrink-0 ${
                          isChapterActive
                            ? "bg-[#d4a74a] text-[#1c120a] font-bold"
                            : "opacity-60 group-hover:opacity-95"
                        }`}
                      >
                        {chapter.pageNumber}
                      </span>
                    </div>

                    {/* Sottocapitoli */}
                    {hasSubItems && !isCollapsed && (
                      <div className="pl-6 pr-1 py-0.5 space-y-0.5 border-l border-[#c59b27]/35 ml-4">
                        {chapter.items.map((sub) => {
                          const isSubActive = activeChapter === sub.title;
                          return (
                            <button
                              key={`${sub.title}-${sub.pageNumber}`}
                              type="button"
                              onClick={() => handlePageJump(sub.pageNumber)}
                              className={`w-full flex items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg text-left text-xs transition ${
                                isSubActive
                                  ? `${activeDndTab} font-semibold`
                                  : "opacity-80 hover:opacity-100 hover:bg-[#c59b27]/15"
                              }`}
                            >
                              <span className="truncate">{sub.title}</span>
                              <span className="font-mono text-[10px] opacity-65 shrink-0">
                                {sub.pageNumber}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })
            )
          ) : (
            /* TAB SEGNALIBRI PERSONALI ED EVIDENZIAZIONI FLUO */
            <div className="space-y-2.5 p-1">
              <div className="grid grid-cols-1 gap-1.5">
                <button
                  type="button"
                  onClick={onToggleCurrentPageBookmark}
                  className={`w-full py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                    isCurrentPageBookmarked
                      ? activeDndTab
                      : "border-dashed border-[#c59b27]/50 hover:border-[#8c1d14] hover:bg-[#c59b27]/10"
                  }`}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>
                    {isCurrentPageBookmarked
                      ? `Rimuovi Pagina ${currentPage} intera`
                      : `Salva Pagina ${currentPage} intera`}
                  </span>
                </button>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      onToggleAreaHighlightMode();
                      if (
                        typeof window !== "undefined" &&
                        window.innerWidth < 768
                      ) {
                        onClose();
                      }
                    }}
                    className={`flex-1 py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                      isAreaHighlightMode
                        ? "bg-amber-400 text-stone-950 border-amber-500 shadow-xs"
                        : "border-[#c59b27]/40 bg-black/5 dark:bg-white/5 hover:bg-[#c59b27]/15"
                    }`}
                  >
                    <Highlighter className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">
                      {isAreaHighlightMode
                        ? "Disattiva Evidenziatore"
                        : "Evidenzia un'area"}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={onUndoLastHighlight}
                    disabled={!canUndoHighlight}
                    title={
                      canUndoHighlight
                        ? `Annulla ultima evidenziazione${
                            lastHighlightLabel
                              ? `: "${lastHighlightLabel}"`
                              : ""
                          } (Ctrl+Z)`
                        : "Nessuna evidenziazione da annullare"
                    }
                    aria-label="Annulla ultima evidenziazione"
                    className={`py-2 px-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center gap-1 transition shrink-0 ${
                      canUndoHighlight
                        ? "border-[#8c1d14]/45 dark:border-[#d4a74a]/45 text-[#8c1d14] dark:text-[#e5be67] bg-[#8c1d14]/10 dark:bg-[#d4a74a]/10 hover:bg-[#8c1d14]/20 active:scale-95"
                        : "border-current/15 opacity-35 pointer-events-none"
                    }`}
                  >
                    <Undo2 className="w-3.5 h-3.5" />
                    <span>Indietro</span>
                  </button>
                </div>
              </div>

              <p className="text-[11px] opacity-65 px-1 leading-snug">
                Suggerimento: puoi anche selezionare qualsiasi testo sul PDF
                per evidenziarlo coi 4 colori fluo (Ctrl+Z per annullare).
              </p>

              {filteredBookmarks.length === 0 ? (
                <div className="py-8 px-4 text-center space-y-2 opacity-60">
                  <BookMarked className="w-7 h-7 mx-auto opacity-50" />
                  <p className="text-xs font-medium">
                    {bookmarks.length === 0
                      ? "Nessun segnalibro o evidenziazione"
                      : "Nessun elemento per questo filtro"}
                  </p>
                  <p className="text-[11px] leading-relaxed">
                    Seleziona una frase sul manuale o usa lo strumento
                    Evidenziatore per salvare passaggi con Giallo, Verde,
                    Celeste o Rosa fluo.
                  </p>
                </div>
              ) : (
                <div className="space-y-1.5">
                  {filteredBookmarks.map((bm) => {
                    const isCurrent = bm.pageNumber === currentPage;
                    const isEditing = editingBookmarkId === bm.id;
                    const isHighlight =
                      bm.type === "text" || bm.type === "area";
                    const colorCfg = isHighlight
                      ? getHighlightColorConfig(bm.color)
                      : null;

                    return (
                      <div
                        key={bm.id}
                        onClick={() =>
                          !isEditing && handleBookmarkClick(bm)
                        }
                        className={`group relative p-2.5 rounded-xl border transition cursor-pointer overflow-hidden ${
                          isCurrent
                            ? "border-[#8c1d14]/65 dark:border-[#d4a74a]/70 bg-[#8c1d14]/10 dark:bg-[#d4a74a]/10"
                            : "border-[#c59b27]/35 hover:bg-[#c59b27]/10"
                        }`}
                      >
                        {/* Barra laterale colorata per le evidenziazioni fluo */}
                        {colorCfg && (
                          <span
                            aria-hidden="true"
                            className={`absolute inset-y-0 left-0 w-1.5 ${colorCfg.swatchClass}`}
                          />
                        )}

                        <div
                          className={`flex flex-col gap-1.5 ${
                            colorCfg ? "pl-2" : ""
                          }`}
                        >
                          <div className="flex items-start justify-between gap-2">
                            {isEditing ? (
                              <form
                                onSubmit={(e) => saveEditing(bm.id, e)}
                                className="flex items-center gap-1 flex-1"
                              >
                                <input
                                  type="text"
                                  value={editingLabel}
                                  onChange={(e) =>
                                    setEditingLabel(e.target.value)
                                  }
                                  autoFocus
                                  className="flex-1 px-2 py-1 text-xs rounded bg-black/10 dark:bg-white/10 focus:outline-none"
                                />
                                <button
                                  type="submit"
                                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-emerald-600 dark:text-emerald-400"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                </button>
                              </form>
                            ) : (
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-1.5">
                                  {colorCfg && (
                                    <span
                                      className={`inline-block w-2.5 h-2.5 rounded-full shrink-0 ${colorCfg.swatchClass}`}
                                    />
                                  )}
                                  <p className="text-xs font-semibold truncate">
                                    {bm.label}
                                  </p>
                                </div>
                                {bm.highlightedText &&
                                  bm.highlightedText !== bm.label && (
                                    <p className="text-[11px] italic opacity-75 line-clamp-2 mt-0.5">
                                      &ldquo;{bm.highlightedText}&rdquo;
                                    </p>
                                  )}
                                {bm.chapterTitle &&
                                  bm.chapterTitle !== bm.label && (
                                    <p className="text-[10px] opacity-55 truncate mt-0.5">
                                      {bm.chapterTitle}
                                    </p>
                                  )}
                              </div>
                            )}

                            <div className="flex items-center gap-1 shrink-0">
                              <span className="font-mono text-[10px] font-semibold px-1.5 py-0.5 rounded bg-black/5 dark:bg-white/10">
                                Pag. {bm.pageNumber}
                              </span>
                              {!isEditing && (
                                <button
                                  type="button"
                                  onClick={(e) => startEditing(bm, e)}
                                  title="Rinomina o aggiungi nota"
                                  className="p-1 rounded opacity-0 group-hover:opacity-70 hover:!opacity-100 hover:bg-black/10 dark:hover:bg-white/10"
                                >
                                  <Edit3 className="w-3 h-3" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveBookmark(bm.id);
                                }}
                                title="Elimina segnalibro"
                                className="p-1 rounded opacity-0 group-hover:opacity-70 hover:!opacity-100 hover:text-red-500 hover:bg-black/10 dark:hover:bg-white/10"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>

                          {/* Selettore rapido cambio colore fluo per le evidenziazioni */}
                          {isHighlight && (
                            <div
                              onClick={(e) => e.stopPropagation()}
                              className="flex items-center justify-between pt-1 border-t border-current/5"
                            >
                              <span className="text-[10px] opacity-50">
                                {bm.type === "area"
                                  ? "Riquadro evidenziato"
                                  : "Testo evidenziato"}
                              </span>
                              <div className="flex items-center gap-1">
                                {HIGHLIGHT_COLORS.map((c) => (
                                  <button
                                    key={c.id}
                                    type="button"
                                    onClick={() =>
                                      onUpdateBookmarkColor(bm.id, c.id)
                                    }
                                    title={`Cambia colore in ${c.label}`}
                                    aria-label={`Cambia colore in ${c.label}`}
                                    className={`w-3.5 h-3.5 rounded-full transition-transform ${
                                      c.swatchClass
                                    } ${
                                      bm.color === c.id
                                        ? "scale-125 ring-1"
                                        : "opacity-45 hover:opacity-100"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
